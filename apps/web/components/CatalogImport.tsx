"use client";

// Botão "Importar catálogo 2026" de Minha Loja.
// Cria só o que falta (produtos e categorias com o mesmo nome são
// reaproveitados) e nunca apaga nada; pode ser usado mais de uma vez.
import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { CATALOGO_2026, CATALOGO_INFO, catalogPhotoUrl, normalizeName } from "@/lib/catalogo-2026";
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

const ITEMS = CATALOGO_2026.flatMap((c) => c.items);

// Quanto do catálogo ainda falta na loja: peças não cadastradas, peças do
// catálogo ainda sem foto e categorias/subcategorias que faltam. Quando tudo
// é zero, o quadro some de Minha Loja.
export function catalogPending(settings: StoreSettings, products: Product[]) {
  const byName = new Map(products.map((p) => [normalizeName(p.name), p]));
  const missing = ITEMS.filter((i) => !byName.has(normalizeName(i.name))).length;
  const noPhoto = ITEMS.filter((i) => {
    const p = byName.get(normalizeName(i.name));
    return p && (i.photos?.length ?? 0) > 0 && p.photo_urls.length === 0;
  }).length;
  const cats = new Map(settings.categories.map((c) => [normalizeName(c.name), c]));
  const missingCats = CATALOGO_2026.filter((c) => {
    const cat = cats.get(normalizeName(c.name));
    if (!cat) return true;
    if (!c.parent) return false;
    const parent = cats.get(normalizeName(c.parent));
    return !parent || cat.parent_id !== parent.id;
  }).length;
  return { missing, noPhoto, missingCats, total: missing + noPhoto + missingCats };
}

function newCategoryId() {
  return `cat-${Math.random().toString(36).slice(2, 10)}`;
}

export function CatalogImport({ orgPath, accessToken, settings, products, dirty, onDone }: Props) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const total = ITEMS.length;
  const { missing, noPhoto } = catalogPending(settings, products);

  async function run() {
    if (dirty) {
      setError("Salve as alterações de Minha Loja antes de importar.");
      return;
    }
    if (
      !window.confirm(
        `Importar o catálogo 2026? Serão criados ${missing} produto(s), colocadas fotos em ${noPhoto} peça(s) já cadastrada(s) sem foto e criadas as categorias que faltam. Nada será apagado.`
      )
    ) {
      return;
    }
    setRunning(true);
    setError(null);
    try {
      // 1) Produtos que faltam.
      const byName = new Map(products.map((p) => [normalizeName(p.name), p.id]));
      const photoless = new Set(products.filter((p) => p.photo_urls.length === 0).map((p) => p.id));
      const items = ITEMS;
      let created = 0;
      let photosAdded = 0;
      for (const item of items) {
        const key = normalizeName(item.name);
        const photoUrls = (item.photos ?? []).map(catalogPhotoUrl);
        const existingId = byName.get(key);
        if (existingId) {
          // Já cadastrada: só coloca as fotos do catálogo se ela não tiver nenhuma.
          if (photoless.has(existingId) && photoUrls.length > 0) {
            setProgress(`Colocando fotos: ${item.name}`);
            await apiFetch<Product>(`${orgPath}/products/${existingId}`, {
              method: "PATCH",
              accessToken,
              body: JSON.stringify({ photo_urls: photoUrls }),
            });
            photosAdded += 1;
          }
          continue;
        }
        setProgress(`Criando ${created + 1} de ${missing}: ${item.name}`);
        const product = await apiFetch<Product>(`${orgPath}/products`, {
          method: "POST",
          accessToken,
          body: JSON.stringify({
            name: item.name,
            description: item.description ?? null,
            manual_price: item.price ?? 0,
            size: item.size ?? null,
            photo_urls: photoUrls,
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
        `Catálogo importado: ${created} produto(s) criado(s), fotos colocadas em ${photosAdded} já existente(s), ${categories.length} categorias.` +
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
        {missing > 0 ? `${missing} ainda não estão cadastradas. ` : ""}
        {noPhoto > 0 ? `${noPhoto} já cadastrada(s) ainda sem foto. ` : ""}
        Este quadro some sozinho quando tudo estiver importado.
      </p>
      <button
        onClick={run}
        disabled={running}
        className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium hover:bg-emerald-600 disabled:opacity-50"
      >
        {running ? "Importando…" : "Importar catálogo 2026"}
      </button>
      {progress && <p className="text-xs text-neutral-500">{progress}</p>}
      {error && <p className="rounded bg-red-950 p-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
