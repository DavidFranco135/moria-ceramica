"use client";

// Minha Loja: editores de "Cuidados com a sua peça" e das opções dos
// produtos (argila, cores de esmalte…), com estoque por opção.
import { useMemo, useState } from "react";
import type { StoreCareItem, StoreOption, StoreOptionGroup, StoreSettings } from "@/lib/store";
import type { Product } from "@/lib/types";
import { IMG_WIDTH, imgSrc } from "@/lib/img";
import { matchesSearch } from "@/lib/search";
import { CARE_ICON_OPTIONS, CareIcon } from "@/components/store/care";

const input =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm placeholder:text-neutral-600";
const smallBtn = "rounded border border-neutral-700 px-2.5 py-1 text-xs hover:bg-neutral-800 disabled:opacity-30";

export const DEFAULT_CARE_ITEMS: StoreCareItem[] = [
  { icon: "microondas", title: "Pode ir ao micro-ondas", text: "Aqueça seus alimentos com segurança." },
  { icon: "forno", title: "Pode ir ao forno", text: "Pode ser usada no forno convencional." },
  { icon: "lavaloucas", title: "Pode ir à lava-louças", text: "Resiste ao uso diário na lava-louças." },
  { icon: "ouro", title: "Peças com ouro não vão ao micro-ondas", text: "As demais peças podem ser usadas normalmente." },
];
export const DEFAULT_CARE_TIPS: StoreCareItem[] = [
  { icon: "esponja", title: "Limpeza", text: "Utilize esponja macia e sabão neutro para a limpeza. Evite o uso de produtos abrasivos." },
  { icon: "temperatura", title: "Temperatura", text: "Evite mudanças bruscas de temperatura para preservar a durabilidade da peça." },
  {
    icon: "coracao",
    title: "Peça artesanal",
    text: "Por ser uma peça artesanal, pequenas variações de forma, cor e textura são naturais e tornam cada peça única e especial.",
  },
];

function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

const rid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// ── Cuidados ──────────────────────────────────────────────────────────────
function CareList({
  label,
  items,
  onChange,
  max = 6,
  showTitle = true,
}: {
  label: string;
  items: StoreCareItem[];
  onChange: (items: StoreCareItem[]) => void;
  max?: number;
  showTitle?: boolean;
}) {
  const set = (i: number, patch: Partial<StoreCareItem>) =>
    onChange(items.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {items.map((c, i) => (
        <div key={i} className="flex flex-wrap items-start gap-2 rounded-lg border border-neutral-800 p-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-amber-200">
              <CareIcon icon={c.icon} className="h-7 w-7" />
            </span>
            <select value={c.icon} onChange={(e) => set(i, { icon: e.target.value })} className={`${input} w-40`}>
              {CARE_ICON_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px] flex-1 space-y-1.5">
            {showTitle && (
              <input value={c.title} maxLength={60} onChange={(e) => set(i, { title: e.target.value })} placeholder="Título (ex.: Pode ir ao forno)" className={input} />
            )}
            <textarea value={c.text} maxLength={240} rows={2} onChange={(e) => set(i, { text: e.target.value })} placeholder="Texto" className={`${input} resize-y`} />
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={() => onChange(move(items, i, -1))} disabled={i === 0} className={smallBtn} aria-label="Subir">↑</button>
            <button type="button" onClick={() => onChange(move(items, i, 1))} disabled={i === items.length - 1} className={smallBtn} aria-label="Descer">↓</button>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="rounded border border-red-900 px-2.5 py-1 text-xs text-red-400 hover:bg-red-950">Apagar</button>
          </div>
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, { icon: "brilho", title: "", text: "" }])} className={smallBtn}>
          + Adicionar
        </button>
      )}
    </div>
  );
}

export function CareEditor({
  settings,
  update,
}: {
  settings: StoreSettings;
  update: (patch: Partial<StoreSettings>) => void;
}) {
  const items = settings.care_items ?? DEFAULT_CARE_ITEMS;
  const tips = settings.care_tips ?? DEFAULT_CARE_TIPS;
  return (
    <div className="space-y-5">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={settings.care_enabled ?? true} onChange={(e) => update({ care_enabled: e.target.checked })} />
        Mostrar a seção na página inicial (e o resumo “Cuidados com a peça” dentro de cada produto)
      </label>
      <div>
        <p className="mb-1 text-xs text-neutral-500">Título da seção</p>
        <input value={settings.care_title ?? "Cuidados com a sua peça"} maxLength={80} onChange={(e) => update({ care_title: e.target.value })} className={input} />
      </div>
      <CareList label="Cards de uso (até 6)" items={items} onChange={(v) => update({ care_items: v })} />
      <CareList label="Dicas de autocuidado (até 6)" items={tips} onChange={(v) => update({ care_tips: v })} showTitle={false} />
      <button
        type="button"
        onClick={() => update({ care_items: DEFAULT_CARE_ITEMS, care_tips: DEFAULT_CARE_TIPS })}
        className="text-xs text-neutral-400 underline"
      >
        Voltar aos textos originais
      </button>
    </div>
  );
}

// ── Opções (argila, esmalte…) ─────────────────────────────────────────────
const PRESETS: { label: string; group: () => StoreOptionGroup }[] = [
  {
    label: "Argila (com pintas / sem pintas)",
    group: () => ({
      id: rid("argila"),
      name: "Escolha a argila",
      hint: "",
      info: "Com pintas: argila com pequenos pontinhos escuros naturais, aparentes na base da peça.\nSem pintas: argila de tom liso e uniforme.",
      required: true,
      options: [
        { id: rid("o"), name: "Com pintas", image_url: "", color: "#d9c3a5", available: true },
        { id: rid("o"), name: "Sem pintas", image_url: "", color: "#e8d6c1", available: true },
      ],
    }),
  },
  {
    label: "Cores de esmalte",
    group: () => ({
      id: rid("esmalte"),
      name: "Escolha o esmalte",
      hint: "defina sua cor",
      info: "Cada peça é esmaltada à mão e queimada em alta temperatura: o tom final pode variar um pouco da foto. Essas variações fazem parte da beleza da cerâmica artesanal.",
      required: true,
      options: [
        ["Branco", "#efebe3"],
        ["Areia", "#d8b98a"],
        ["Rosé", "#d8b0a6"],
        ["Terracota", "#9a4e2e"],
        ["Verde oliva", "#7b8455"],
        ["Azul", "#22476e"],
        ["Preto", "#262626"],
      ].map(([name, color]) => ({ id: rid("o"), name, image_url: "", color, available: true })),
    }),
  },
];

function OptionTile({
  option,
  index,
  total,
  onChange,
  onMove,
  onRemove,
  upload,
}: {
  option: StoreOption;
  index: number;
  total: number;
  onChange: (patch: Partial<StoreOption>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  upload: (file: File) => Promise<string>;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className={`space-y-2 rounded-lg border p-2 ${option.available ? "border-neutral-800" : "border-red-900/60 opacity-70"}`}>
      <label className="relative block aspect-square w-full cursor-pointer overflow-hidden rounded-md bg-neutral-800" style={option.color && !option.image_url ? { background: option.color } : undefined} title="Trocar a foto da amostra">
        {option.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc(option.image_url, IMG_WIDTH.thumb)} alt="" className="h-full w-full object-cover" />
        )}
        <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[10px] text-white">
          {busy ? "Enviando…" : option.image_url ? "Trocar foto" : "Enviar foto"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            setBusy(true);
            try {
              onChange({ image_url: await upload(f) });
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      <input value={option.name} maxLength={60} onChange={(e) => onChange({ name: e.target.value })} placeholder="Nome (ex.: Verde oliva)" className={`${input} px-2 py-1 text-xs`} />
      <div className="flex items-center gap-1.5">
        <input type="color" value={option.color || "#cccccc"} onChange={(e) => onChange({ color: e.target.value })} className="h-7 w-8 cursor-pointer rounded border border-neutral-700 bg-transparent" title="Cor da bolinha" />
        {option.color && (
          <button type="button" onClick={() => onChange({ color: "" })} className="text-[10px] text-neutral-500 underline">sem cor</button>
        )}
        {option.image_url && (
          <button type="button" onClick={() => onChange({ image_url: "" })} className="text-[10px] text-neutral-500 underline">tirar foto</button>
        )}
      </div>
      <label className="flex items-center gap-1.5 text-xs">
        <input type="checkbox" checked={option.available} onChange={(e) => onChange({ available: e.target.checked })} />
        {option.available ? "Em estoque" : <span className="text-red-400">Sem estoque (oculta)</span>}
      </label>
      <div className="flex gap-1">
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className={smallBtn} aria-label="Para a esquerda">←</button>
        <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} className={smallBtn} aria-label="Para a direita">→</button>
        <button type="button" onClick={onRemove} className="ml-auto rounded border border-red-900 px-2 py-1 text-xs text-red-400 hover:bg-red-950" aria-label="Apagar opção">✕</button>
      </div>
    </div>
  );
}

function GroupProducts({
  groupId,
  products,
  mapping,
  onChange,
}: {
  groupId: string;
  products: Product[];
  mapping: Record<string, string[]>;
  onChange: (next: Record<string, string[]>) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const using = products.filter((p) => mapping[p.id]?.includes(groupId));
  const shown = useMemo(() => products.filter((p) => matchesSearch(query, p.name, p.description)), [products, query]);
  const toggle = (ids: string[], on: boolean) => {
    const next = { ...mapping };
    for (const id of ids) {
      const cur = (next[id] ?? []).filter((g) => g !== groupId);
      next[id] = on ? [...cur, groupId] : cur;
      if (next[id].length === 0) delete next[id];
    }
    onChange(next);
  };
  return (
    <div className="space-y-2 rounded-lg bg-neutral-900/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm">
          Usado em <strong>{using.length}</strong> produto(s)
          {using.length > 0 && <span className="text-neutral-500">: {using.slice(0, 4).map((p) => p.name).join(", ")}{using.length > 4 ? "…" : ""}</span>}
        </p>
        <button type="button" onClick={() => setOpen((o) => !o)} className={smallBtn}>
          {open ? "Fechar lista" : "Escolher produtos"}
        </button>
      </div>
      {open && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar produto…" className={`${input} max-w-xs`} />
            <button type="button" onClick={() => toggle(shown.map((p) => p.id), true)} className={smallBtn}>Marcar {query ? "os da busca" : "todos"}</button>
            <button type="button" onClick={() => toggle(shown.map((p) => p.id), false)} className={smallBtn}>Desmarcar {query ? "os da busca" : "todos"}</button>
          </div>
          <ul className="grid max-h-72 gap-1 overflow-y-auto sm:grid-cols-2">
            {shown.map((p) => (
              <li key={p.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-neutral-800">
                  <input type="checkbox" checked={!!mapping[p.id]?.includes(groupId)} onChange={(e) => toggle([p.id], e.target.checked)} />
                  <span className="truncate">{p.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function OptionsEditor({
  settings,
  products,
  update,
  upload,
}: {
  settings: StoreSettings;
  products: Product[];
  update: (patch: Partial<StoreSettings>) => void;
  upload: (file: File) => Promise<string>;
}) {
  const groups = settings.option_groups ?? [];
  const mapping = settings.product_option_groups ?? {};
  const [bulkBusy, setBulkBusy] = useState<string | null>(null);
  const setGroups = (next: StoreOptionGroup[]) => update({ option_groups: next });
  const setGroup = (gi: number, patch: Partial<StoreOptionGroup>) =>
    setGroups(groups.map((g, j) => (j === gi ? { ...g, ...patch } : g)));
  const setOption = (gi: number, oi: number, patch: Partial<StoreOption>) =>
    setGroup(gi, { options: groups[gi].options.map((o, j) => (j === oi ? { ...o, ...patch } : o)) });

  async function bulkPhotos(gi: number, files: FileList) {
    const list = Array.from(files).slice(0, 40 - groups[gi].options.length);
    const added: StoreOption[] = [];
    for (let i = 0; i < list.length; i++) {
      setBulkBusy(`Enviando ${i + 1} de ${list.length}…`);
      const url = await upload(list[i]);
      const name = list[i].name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
      added.push({ id: rid("o"), name: name.charAt(0).toUpperCase() + name.slice(1), image_url: url, color: "", available: true });
    }
    setBulkBusy(null);
    // Grupo pode ter mudado durante o envio: pega o atual pelo id.
    const gid = groups[gi].id;
    update({
      option_groups: (settings.option_groups ?? []).map((g) => (g.id === gid ? { ...g, options: [...g.options, ...added] } : g)),
    });
  }

  return (
    <div className="space-y-5">
      {groups.length === 0 && <p className="text-sm text-neutral-500">Nenhuma opção ainda. Comece por um modelo pronto ou crie do zero.</p>}

      {groups.map((g, gi) => {
        const inStock = g.options.filter((o) => o.available).length;
        return (
          <div key={g.id} className="space-y-3 rounded-xl border border-neutral-800 p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-900">{gi + 1}</span>
              <input value={g.name} maxLength={40} onChange={(e) => setGroup(gi, { name: e.target.value })} placeholder="Nome (ex.: Escolha o esmalte)" className={`${input} min-w-[180px] flex-1`} />
              <button type="button" onClick={() => setGroups(move(groups, gi, -1))} disabled={gi === 0} className={smallBtn} aria-label="Subir">↑</button>
              <button type="button" onClick={() => setGroups(move(groups, gi, 1))} disabled={gi === groups.length - 1} className={smallBtn} aria-label="Descer">↓</button>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm(`Apagar "${g.name || "este grupo"}" e todas as opções dele?`)) return;
                  const next = { ...mapping };
                  for (const k of Object.keys(next)) {
                    next[k] = next[k].filter((x) => x !== g.id);
                    if (!next[k].length) delete next[k];
                  }
                  update({ option_groups: groups.filter((_, j) => j !== gi), product_option_groups: next });
                }}
                className="rounded border border-red-900 px-2.5 py-1 text-xs text-red-400 hover:bg-red-950"
              >
                Apagar grupo
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input value={g.hint} maxLength={80} onChange={(e) => setGroup(gi, { hint: e.target.value })} placeholder="Texto ao lado antes de escolher (ex.: defina sua cor)" className={input} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={g.required} onChange={(e) => setGroup(gi, { required: e.target.checked })} />
                Obrigatório escolher antes de adicionar ao pedido
              </label>
            </div>
            <textarea value={g.info} maxLength={800} rows={2} onChange={(e) => setGroup(gi, { info: e.target.value })} placeholder="Explicação do “Entenda as cores/opções” (opcional)" className={`${input} resize-y`} />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-neutral-400">
                {g.options.length} opção(ões) · <span className={inStock ? "text-emerald-400" : "text-red-400"}>{inStock} em estoque</span>. Desmarque “Em estoque” quando acabar: a opção some da loja sem perder o cadastro.
              </p>
              <div className="flex gap-2">
                <label className={`${smallBtn} cursor-pointer`}>
                  {bulkBusy ?? "+ Várias fotos de uma vez"}
                  <input type="file" accept="image/*" multiple className="hidden" disabled={!!bulkBusy} onChange={(e) => { const f = e.target.files; if (f?.length) bulkPhotos(gi, f); e.target.value = ""; }} />
                </label>
                {g.options.length < 40 && (
                  <button type="button" onClick={() => setGroup(gi, { options: [...g.options, { id: rid("o"), name: "", image_url: "", color: "", available: true }] })} className={smallBtn}>
                    + Opção
                  </button>
                )}
              </div>
            </div>
            {g.options.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {g.options.map((o, oi) => (
                  <OptionTile
                    key={o.id}
                    option={o}
                    index={oi}
                    total={g.options.length}
                    upload={upload}
                    onChange={(patch) => setOption(gi, oi, patch)}
                    onMove={(dir) => setGroup(gi, { options: move(g.options, oi, dir) })}
                    onRemove={() => setGroup(gi, { options: g.options.filter((_, j) => j !== oi) })}
                  />
                ))}
              </div>
            )}

            <GroupProducts groupId={g.id} products={products} mapping={mapping} onChange={(next) => update({ product_option_groups: next })} />
          </div>
        );
      })}

      {groups.length < 8 && (
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" onClick={() => setGroups([...groups, p.group()])} className={smallBtn}>
              + Modelo: {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setGroups([...groups, { id: rid("grupo"), name: "", hint: "", info: "", required: true, options: [] }])}
            className={smallBtn}
          >
            + Grupo em branco
          </button>
        </div>
      )}
    </div>
  );
}
