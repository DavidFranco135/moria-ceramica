"use client";

// Botão "Importar catálogo 2026" de Minha Loja.
// Cria só o que falta (produtos e categorias com o mesmo nome são
// reaproveitados) e nunca apaga nada; pode ser usado mais de uma vez.
import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { CATALOGO_2026, CATALOGO_INFO, normalizeName } from "@/lib/catalogo-2026";
import type { StoreAdminResponse, StoreCategory, StoreSettings } from "@/lib/store";
import type { Product } from "@/lib/types";

type Props = {
  orgPath: string;
  accessToken: string;
  settings: StoreSettings;
  products: Product[];
  // Com alterações não salvas, a importação não roda (ela grava a loja).
  dirty: boolean;
  onDone: (message: string) => void;
};

function newCategoryId() {
  return `cat-${Math.random().toString(36).slice(2, 10)}`;
}

export function CatalogImport({ orgPath, accessToken, settings, products, dirty, onDone }: Props) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const total = CATALOGO_2026.reduce((n, c) => n + c.items.length, 0);
  const existingNames = new Set(products.map((p) => normalizeName(p.name)));
  const missing = CATALOGO_2026.flatMap((c) => c.items).filter((i) => !existingNames.has(normalizeName(i.name))).length;

  async function run() {
    if (dirty) {
      setError("Salve as alterações de Minha Loja antes de importar.");
      return;
    }
    if (!window.confirm(`Importar o catálogo 2026? Serão criados ${missing} produto(s) e as categorias que faltam. Nada será apagado.`)) {
      return;
    }
    setRunning(true);
    setError(null);
    try {
      // 1) Produtos que faltam.
      const byName = new Map(products.map((p) => [normalizeName(p.name), p.id]));
      const items = CATALOGO_2026.flatMap((c) => c.items);
      let created = 0;
      for (const item of items) {
        const key = normalizeName(item.name);
        if (byName.has(key)) continue;
        setProgress(`Criando ${created + 1} de ${missing}: ${item.name}`);
        const product = await apiFetch<Product>(`${orgPath}/products`, {
          method: "POST",
          accessToken,
          body: JSON.stringify({
            name: item.name,
            description: item.description ?? null,
            manual_price: item.price ?? 0,
            size: item.size ?? null,
            stock_quantity: null,
            materials: [],
            publish_in_store: true,
          }),
        });
        byName.set(key, product.id);
        created += 1;
      }

      // 2) Categorias: reaproveita pelo nome, cria as que faltam.
      setProgress("Organizando categorias…");
      const categories: StoreCategory[] = settings.categories.map((c) => ({ ...c, product_ids: [...c.product_ids] }));
      const catByName = new Map(categories.map((c) => [normalizeName(c.name), c]));
      const ensure = (name: string) => {
        const key = normalizeName(name);
        let cat = catByName.get(key);
        if (!cat) {
          cat = { id: newCategoryId(), name, product_ids: [], cover_url: "", parent_id: "" };
          categories.push(cat);
          catByName.set(key, cat);
        }
        return cat;
      };
      // Primeiro as principais, para as subcategorias acharem a mãe.
      for (const c of CATALOGO_2026.filter((c) => !c.parent)) ensure(c.name);
      for (const c of CATALOGO_2026) {
        const cat = ensure(c.name);
        if (c.parent) cat.parent_id = ensure(c.parent).id;
        for (const item of c.items) {
          const id = byName.get(normalizeName(item.name));
          if (!id) continue;
          if (!cat.product_ids.includes(id)) cat.product_ids.push(id);
          for (const extra of item.alsoIn ?? []) {
            const other = ensure(extra);
            if (!other.product_ids.includes(id)) other.product_ids.push(id);
          }
        }
      }

      // 3) Sob consulta, destaques e textos (só preenche o que está vazio).
      const items_ = CATALOGO_2026.flatMap((c) => c.items);
      const onRequest = items_.filter((i) => i.price === null).map((i) => byName.get(normalizeName(i.name))!);
      const featured = items_.filter((i) => i.featured).map((i) => byName.get(normalizeName(i.name))!);
      const body: StoreSettings = {
        ...settings,
        categories,
        price_on_request_product_ids: Array.from(new Set([...settings.price_on_request_product_ids, ...onRequest])),
        featured_product_ids: settings.featured_product_ids.length > 0 ? settings.featured_product_ids : featured,
        tagline: settings.tagline.trim() ? settings.tagline : CATALOGO_INFO.tagline,
        about: settings.about.trim() ? settings.about : CATALOGO_INFO.about,
        address: settings.address.trim() ? settings.address : CATALOGO_INFO.address,
        highlights: settings.highlights.some((h) => h.title.trim() || h.text.trim())
          ? settings.highlights
          : CATALOGO_INFO.highlights,
      };
      const saved = await apiFetch<StoreAdminResponse>(`${orgPath}/store`, {
        method: "PUT",
        accessToken,
        body: JSON.stringify(body),
      });
      const subOk = saved.settings.categories.some((c) => c.parent_id);
      setProgress("");
      onDone(
        `Catálogo importado: ${created} produto(s) criado(s), ${categories.length} categorias.` +
          (subOk ? "" : " Atenção: a API publicada ainda não guarda subcategorias — rode o PUBLICAR-API.bat e importe de novo.")
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Falha ao importar o catálogo.");
    } finally {
      setRunning(false);
      setProgress("");
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-400">
        {total} peças em {CATALOGO_2026.length} categorias (Linha Café, Mesa Posta, Para Servir, Linha Cozinha, Decoração,
        Linha Infantil, Presentes, Personalização e Projetos Especiais), com preços e descrições.{" "}
        {missing === 0 ? "Todas já estão cadastradas." : `${missing} ainda não estão cadastradas.`}
      </p>
      <button
        onClick={run}
        disabled={running}
        className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium hover:bg-emerald-600 disabled:opacity-50"
      >
        {running ? "Importando…" : missing === 0 ? "Reorganizar categorias do catálogo" : "Importar catálogo 2026"}
      </button>
      {progress && <p className="text-xs text-neutral-500">{progress}</p>}
      {error && <p className="rounded bg-red-950 p-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
