"use client";

// Escolha de opções na janela do produto (ex.: "Escolha a argila",
// "Escolha o esmalte"), com amostras em foto ou cor. As opções vêm de Minha
// Loja; as marcadas como sem estoque nem chegam à vitrine.
import { useState } from "react";
import type { PublicOptionGroup, PublicProduct } from "@/lib/store";
import { IMG_WIDTH, imgSrc } from "@/lib/img";

export function OptionPicker({
  group,
  value,
  onChange,
  step,
  error = false,
}: {
  group: PublicOptionGroup;
  value: string | undefined;
  onChange: (id: string) => void;
  step?: number;
  error?: boolean;
}) {
  const [info, setInfo] = useState(false);
  const chosen = group.options.find((o) => o.id === value);
  const withPhotos = group.options.some((o) => o.image_url);
  return (
    <div id={`opt-${group.id}`} className="scroll-mt-24 space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="flex flex-wrap items-baseline gap-x-2 text-base font-semibold">
          {step && (
            <span className="inline-flex h-5 w-5 items-center justify-center self-center rounded-full bg-[var(--ink)] text-[11px] font-bold text-[var(--surface)]">
              {step}
            </span>
          )}
          <span>{group.name}:</span>
          <span className={`font-normal ${chosen ? "" : "text-[var(--muted)]"}`}>
            {chosen?.name || group.hint || "escolha uma opção"}
            {!chosen && group.required && <span className="text-red-500">*</span>}
          </span>
        </p>
        {group.info && (
          <button
            type="button"
            onClick={() => setInfo((v) => !v)}
            className="text-sm text-[var(--accent-text)] underline underline-offset-4"
            aria-expanded={info}
          >
            {info ? "Fechar" : `Entenda ${/esmalte|cor/i.test(group.name) ? "as cores" : "as opções"}`}
          </button>
        )}
      </div>
      {info && group.info && (
        <p className="whitespace-pre-line rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]">
          {group.info}
        </p>
      )}

      <div
        role="radiogroup"
        aria-label={group.name}
        className={withPhotos ? "grid grid-cols-4 gap-2 sm:grid-cols-5" : "flex flex-wrap gap-2"}
      >
        {group.options.map((o) => {
          const selected = o.id === value;
          const ring = selected
            ? "border-[var(--accent)] ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]"
            : "border-[var(--line)] hover:border-[var(--accent)]";
          if (withPhotos)
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                title={o.name}
                onClick={() => onChange(selected && !group.required ? "" : o.id)}
                className={`group overflow-hidden rounded-xl border bg-[var(--bg)] text-left transition ${ring}`}
              >
                <span className="block aspect-square w-full overflow-hidden" style={o.color ? { background: o.color } : undefined}>
                  {o.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgSrc(o.image_url, IMG_WIDTH.thumb)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </span>
                {o.name && (
                  <span className="block truncate px-1.5 py-1 text-center text-[11px] font-medium leading-tight">{o.name}</span>
                )}
              </button>
            );
          if (o.color)
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                title={o.name}
                onClick={() => onChange(selected && !group.required ? "" : o.id)}
                className="flex w-16 flex-col items-center gap-1.5"
              >
                <span className={`block h-11 w-11 rounded-full border-2 transition ${ring}`} style={{ background: o.color }} />
                {o.name && <span className="text-center text-[11px] font-medium leading-tight">{o.name}</span>}
              </button>
            );
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(selected && !group.required ? "" : o.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selected ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--surface)]" : "border-[var(--line)] hover:border-[var(--ink)]"
              }`}
            >
              {o.name}
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm font-medium text-red-500">Escolha {group.name.replace(/^escolha\s+/i, "").toLowerCase()} para continuar.</p>}
    </div>
  );
}

// Bolinhas de cor no card do produto (primeiro grupo com cor/foto).
export function OptionDots({ product }: { product: PublicProduct }) {
  const group = (product.options ?? []).find((g) => g.options.some((o) => o.color || o.image_url));
  if (!group) return null;
  const shown = group.options.slice(0, 6);
  const extra = group.options.length - shown.length;
  return (
    <div className="flex items-center gap-1" aria-label={`${group.options.length} opções de ${group.name}`}>
      {shown.map((o) => (
        <span
          key={o.id}
          title={o.name}
          className="h-3.5 w-3.5 overflow-hidden rounded-full border border-black/10"
          style={o.color ? { background: o.color } : undefined}
        >
          {!o.color && o.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc(o.image_url, IMG_WIDTH.thumb)} alt="" loading="lazy" className="h-full w-full scale-150 object-cover" />
          )}
        </span>
      ))}
      {extra > 0 && <span className="text-[10px] font-semibold text-[var(--muted)]">+{extra}</span>}
    </div>
  );
}
