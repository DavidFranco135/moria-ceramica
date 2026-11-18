"use client";

// Seção "Cuidados com a sua peça": cards de uso (micro-ondas, forno…) e
// dicas de autocuidado, editáveis em Minha Loja. Também há uma versão
// compacta dentro da janela do produto.
import { useState } from "react";
import type { StoreCareItem } from "@/lib/store";
import { Reveal } from "./ui";

export const CARE_ICON_OPTIONS: { key: StoreCareItem["icon"]; label: string }[] = [
  { key: "microondas", label: "Micro-ondas" },
  { key: "forno", label: "Forno" },
  { key: "lavaloucas", label: "Lava-louças" },
  { key: "freezer", label: "Freezer / geladeira" },
  { key: "ouro", label: "Ouro / detalhe dourado" },
  { key: "brilho", label: "Brilho" },
  { key: "esponja", label: "Esponja / limpeza" },
  { key: "temperatura", label: "Temperatura" },
  { key: "coracao", label: "Coração" },
  { key: "mao", label: "Feito à mão" },
  { key: "sol", label: "Sol" },
  { key: "gota", label: "Água" },
  { key: "alerta", label: "Atenção" },
  { key: "caixa", label: "Embalagem" },
  { key: "folha", label: "Natural" },
];

const P = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CareIcon({ icon, className = "h-10 w-10" }: { icon: string; className?: string }) {
  const svg = (children: React.ReactNode) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden {...P}>
      {children}
    </svg>
  );
  switch (icon) {
    case "microondas":
      return svg(
        <>
          <rect x="4" y="10" width="40" height="28" rx="3" />
          <rect x="9" y="15" width="24" height="18" rx="1.5" />
          <path d="M13 21c2-1.5 4 1.5 6 0s4 1.5 6 0M13 27c2-1.5 4 1.5 6 0s4 1.5 6 0" />
          <circle cx="38.5" cy="18" r="1.6" />
          <circle cx="38.5" cy="24" r="1.6" />
          <path d="M36.5 30h4" />
        </>
      );
    case "forno":
      return svg(
        <>
          <rect x="7" y="6" width="34" height="36" rx="3" />
          <path d="M7 15h34" />
          <circle cx="13" cy="10.5" r="1.3" />
          <circle cx="19" cy="10.5" r="1.3" />
          <circle cx="25" cy="10.5" r="1.3" />
          <rect x="12" y="20" width="24" height="16" rx="1.5" />
          <path d="M17 24h14" />
        </>
      );
    case "lavaloucas":
      return svg(
        <>
          <rect x="6" y="5" width="36" height="38" rx="3" />
          <path d="M6 13h36" />
          <path d="M11 9h8" />
          <circle cx="33" cy="9" r="1.3" />
          <circle cx="37.5" cy="9" r="1.3" />
          <circle cx="20" cy="28" r="9" />
          <circle cx="20" cy="28" r="4.5" />
          <path d="M34 20c1.8 2.4 2.7 4 2.7 5.2a2.7 2.7 0 0 1-5.4 0c0-1.2.9-2.8 2.7-5.2zM33.5 32c1.2 1.6 1.8 2.7 1.8 3.5a1.8 1.8 0 0 1-3.6 0c0-.8.6-1.9 1.8-3.5z" />
        </>
      );
    case "freezer":
      return svg(
        <>
          <path d="M24 5v38M7.5 14.5l33 19M7.5 33.5l33-19" />
          <path d="M19 8l5 4 5-4M19 40l5-4 5 4M8 21l6-1-2-6M40 27l-6 1 2 6M8 27l6 1-2 6M40 21l-6-1 2-6" />
        </>
      );
    case "ouro":
    case "brilho":
      return svg(
        <>
          <path d="M20 6c1.4 8.6 4.4 11.6 13 13-8.6 1.4-11.6 4.4-13 13-1.4-8.6-4.4-11.6-13-13 8.6-1.4 11.6-4.4 13-13z" />
          <path d="M36 28c.8 4.2 2.3 5.7 6.5 6.5-4.2.8-5.7 2.3-6.5 6.5-.8-4.2-2.3-5.7-6.5-6.5 4.2-.8 5.7-2.3 6.5-6.5z" />
        </>
      );
    case "esponja":
      return svg(
        <>
          <path d="M8 22c0-6 4-10 10-10h12c6 0 10 4 10 10v6c0 5-4 9-9 9H17c-5 0-9-4-9-9z" />
          <path d="M8 26c5 2 27 2 32 0" />
          <circle cx="16" cy="19" r="1.2" />
          <circle cx="23" cy="17.5" r="1.2" />
          <circle cx="30" cy="19" r="1.2" />
          <circle cx="19" cy="32" r="1.2" />
          <circle cx="28" cy="32" r="1.2" />
        </>
      );
    case "temperatura":
      return svg(
        <>
          <path d="M20 29V9a4 4 0 0 1 8 0v20a8 8 0 1 1-8 0z" />
          <path d="M24 33V18" />
          <circle cx="24" cy="35" r="3" />
          <path d="M32 12h4M32 18h4M32 24h4" />
        </>
      );
    case "coracao":
      return svg(<path d="M24 40S7 29.5 7 18.5A8.5 8.5 0 0 1 24 13a8.5 8.5 0 0 1 17 5.5C41 29.5 24 40 24 40z" />);
    case "mao":
      return svg(
        <>
          <path d="M16 24V11a2.5 2.5 0 0 1 5 0v11M21 21V8.5a2.5 2.5 0 0 1 5 0V21M26 21V10.5a2.5 2.5 0 0 1 5 0V23M31 23v-7a2.5 2.5 0 0 1 5 0v12c0 7-5 12-12 12h-1c-5 0-8-3-11-7l-4-6a2.6 2.6 0 0 1 4-3.2L16 28" />
        </>
      );
    case "sol":
      return svg(
        <>
          <circle cx="24" cy="24" r="8" />
          <path d="M24 5v5M24 38v5M5 24h5M38 24h5M10.6 10.6l3.5 3.5M33.9 33.9l3.5 3.5M10.6 37.4l3.5-3.5M33.9 14.1l3.5-3.5" />
        </>
      );
    case "gota":
      return svg(<path d="M24 6c7 9 11 15.5 11 21a11 11 0 0 1-22 0c0-5.5 4-12 11-21z" />);
    case "alerta":
      return svg(
        <>
          <path d="M24 6L4.5 40h39z" />
          <path d="M24 19v10M24 34v.5" />
        </>
      );
    case "caixa":
      return svg(
        <>
          <path d="M6 15l18-9 18 9v18l-18 9-18-9z" />
          <path d="M6 15l18 9 18-9M24 24v18M15 10.5l18 9" />
        </>
      );
    case "folha":
      return svg(
        <>
          <path d="M10 38C8 22 18 9 40 8c0 22-13 32-29 30z" />
          <path d="M10 38c6-9 13-16 22-22" />
        </>
      );
    default:
      return svg(<circle cx="24" cy="24" r="14" />);
  }
}

function TitleRule({ children, small = false }: { children: React.ReactNode; small?: boolean }) {
  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <span className="h-px flex-1 bg-[var(--accent-text)] opacity-30" />
      <h2
        className={`text-center font-[family-name:var(--font-display)] uppercase text-[var(--ink)] ${
          small ? "text-sm tracking-[0.25em] sm:text-base sm:tracking-[0.3em]" : "text-base tracking-[0.16em] sm:text-2xl sm:tracking-[0.3em]"
        }`}
      >
        {children}
      </h2>
      <span className="h-px flex-1 bg-[var(--accent-text)] opacity-30" />
    </div>
  );
}

export function CareSection({
  title,
  items,
  tips,
}: {
  title?: string;
  items: StoreCareItem[];
  tips: StoreCareItem[];
}) {
  if (items.length === 0 && tips.length === 0) return null;
  const cols = items.length >= 4 ? "lg:grid-cols-4" : items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <section id="cuidados" aria-label={title || "Cuidados com a sua peça"} className="scroll-mt-28 space-y-10">
      {items.length > 0 && (
        <Reveal>
          <div className="space-y-8 rounded-[32px] border border-[var(--line)] bg-[var(--accent-soft)] px-5 py-8 sm:px-10 sm:py-10">
            <TitleRule>{title || "Cuidados com a sua peça"}</TitleRule>
            <ul className={`grid grid-cols-2 gap-y-8 ${cols}`}>
              {items.map((c, i) => (
                <li
                  key={i}
                  className={`flex flex-col items-center gap-3 px-3 text-center sm:px-6 ${
                    i % 2 === 1 ? "border-l border-[var(--accent-text)]/25" : ""
                  } ${i > 0 ? "lg:border-l lg:border-[var(--accent-text)]/25" : "lg:border-l-0"}`}
                >
                  <CareIcon icon={c.icon} className="h-12 w-12 text-[var(--accent-text)] sm:h-14 sm:w-14" />
                  {c.title && (
                    <h3 className="text-xs font-semibold uppercase leading-snug tracking-[0.12em] text-[var(--ink)] sm:text-sm">
                      {c.title}
                    </h3>
                  )}
                  {c.text && (
                    <p className="font-[family-name:var(--font-display)] text-sm leading-snug text-[var(--muted)] sm:text-base">
                      {c.text}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {tips.length > 0 && (
        <Reveal>
          <div className="mx-auto max-w-3xl space-y-6">
            <TitleRule small>Dicas de autocuidado</TitleRule>
            <ul className="space-y-4">
              {tips.map((t, i) => (
                <li key={i} className="flex items-center gap-4 sm:gap-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-text)] sm:h-16 sm:w-16">
                    <CareIcon icon={t.icon} className="h-8 w-8 sm:h-9 sm:w-9" />
                  </span>
                  <p className="font-[family-name:var(--font-display)] text-base leading-snug text-[var(--ink)] sm:text-lg">
                    {t.text || t.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </section>
  );
}

// Versão compacta na janela do produto (abre/fecha).
export function CareMini({ items, tips }: { items: StoreCareItem[]; tips: StoreCareItem[] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0 && tips.length === 0) return null;
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold"
      >
        <span className="flex items-center gap-2">
          <CareIcon icon="coracao" className="h-5 w-5 text-[var(--accent-text)]" />
          Cuidados com a peça
        </span>
        <span className={`text-lg leading-none transition ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="space-y-4 px-4 pb-4">
          {items.length > 0 && (
            <ul className="grid grid-cols-2 gap-2">
              {items.map((c, i) => (
                <li key={i} className="flex items-start gap-2 rounded-xl bg-[var(--accent-soft)] p-2.5">
                  <CareIcon icon={c.icon} className="h-6 w-6 shrink-0 text-[var(--accent-text)]" />
                  <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide">{c.title}</span>
                </li>
              ))}
            </ul>
          )}
          {tips.length > 0 && (
            <ul className="space-y-2 text-xs leading-relaxed text-[var(--muted)]">
              {tips.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <CareIcon icon={t.icon} className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>{t.text || t.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
