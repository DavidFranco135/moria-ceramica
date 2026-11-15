// x / y: enquadramento (0-100). Sem valores = foto inteira, sem corte.
export type StoreSlide = { url: string; title: string; subtitle: string; x?: number | null; y?: number | null };
export type StoreHighlight = { title: string; text: string };
// cover_url: foto principal da categoria na vitrine ("" = automática).
// cover_x / cover_y: enquadramento da foto principal (0-100, 50 = centro).
export type StoreCategory = {
  id: string;
  name: string;
  product_ids: string[];
  cover_url: string;
  cover_x?: number;
  cover_y?: number;
  // Subcategoria: id da categoria principal ("" ou ausente = principal).
  parent_id?: string;
};
export type PublicCategory = {
  id: string;
  name: string;
  cover_url: string;
  cover_x?: number;
  cover_y?: number;
  parent_id?: string;
};

// "moria": tema da marca — fundo areia, cabeçalho e cards creme, textos e
// botões café e rodapé café com letras creme (paleta da loja Moriá).
export type StoreTheme = "light" | "dark" | "moria";

export const THEME_OPTIONS: { key: StoreTheme; label: string }[] = [
  { key: "light", label: "Claro" },
  { key: "dark", label: "Escuro" },
  { key: "moria", label: "Moriá – areia e café" },
];

export type StoreSettings = {
  display_name: string;
  logo_url: string;
  tagline: string;
  about: string;
  whatsapp: string;
  instagram: string;
  hours: string;
  address: string;
  accent: string;
  theme: StoreTheme;
  slides: StoreSlide[];
  highlights: StoreHighlight[];
  // Links de Reels/posts do Instagram mostrados na vitrine.
  reels: string[];
  hidden_product_ids: string[];
  // A ordem de featured_product_ids é a ordem dos destaques na vitrine.
  featured_product_ids: string[];
  // Ordem personalizada dos produtos na vitrine.
  product_order: string[];
  price_on_request_product_ids: string[];
  categories: StoreCategory[];
  // Vitrine segue o modo escuro do celular/computador do cliente.
  auto_dark?: boolean;
  // Selos de confiança (vitrine, pedido e rodapé).
  trust_badges?: string[];
  // Prazo de produção mostrado na vitrine (ex.: "7 a 10 dias úteis").
  production_days?: string;
  // Modelo 3D (.glb) de cada produto: {id do produto: link https}.
  model_urls?: Record<string, string>;
  // Descontos: % OFF por produto, promoção geral (com datas) e faixas do pedido.
  product_discounts?: Record<string, number>;
  promo_percent?: number;
  promo_label?: string;
  promo_start?: string;
  promo_end?: string;
  cart_tiers?: { min_total: number; percent: number }[];
  discounts_stack?: boolean;
};

export type StoreAdminResponse = { slug: string; name: string; settings: StoreSettings };

export type PublicProduct = {
  id: string;
  name: string;
  description: string | null;
  size: string | null;
  photo_urls: string[];
  photo_focus: { url: string; x: number; y: number }[];
  price: number;
  stock_quantity: number | null;
  available: boolean;
  featured: boolean;
  category_ids: string[];
  price_on_request: boolean;
  // Link do modelo 3D (.glb), quando houver.
  model_url?: string;
  // Desconto em vigor (% OFF). `price` é o preço cheio.
  discount_percent?: number;
};

export type PublicStore = {
  slug: string;
  name: string;
  settings: Omit<
    StoreSettings,
    | "hidden_product_ids"
    | "featured_product_ids"
    | "product_order"
    | "price_on_request_product_ids"
    | "categories"
    | "model_urls"
    | "product_discounts"
    | "promo_start"
  > & {
    categories: PublicCategory[];
    // Destaques visíveis, já na ordem escolhida (servidores antigos não mandam).
    featured_product_ids?: string[];
  };
  products: PublicProduct[];
};

export type CartLine = { id: string; qty: number; note: string };

// Loja mostrada na página inicial do site. É o endereço gerado no cadastro a
// partir do nome "Moriá Cerâmica"; se for outro, defina NEXT_PUBLIC_STORE_SLUG.
export const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || "moria-ceramica";

// WhatsApp da Moriá Cerâmica (pode ser trocado em Minha Loja).
// Logo oficial da Moriá (montanhas + nome), fundo transparente; a versão
// "claro" (creme) é usada no modo escuro.
export const BRAND_LOGO = "/brand/moria-logo-wide.png";
export const BRAND_LOGO_LIGHT = "/brand/moria-logo-wide-claro.png";
export function isBrandLogo(url: string): boolean {
  return url.split("?")[0] === BRAND_LOGO;
}
export function logoForTheme(url: string, dark: boolean): string {
  return dark && isBrandLogo(url) ? BRAND_LOGO_LIGHT : url;
}

export const DEFAULT_WHATSAPP = "5521984986236";

type Accent = {
  label: string;
  color: string;
  soft: string;
  // Cor mostrada no seletor de "Minha Loja" (quando difere de `color`).
  swatch?: string;
  // Variante para o tema escuro, quando a cor do tema claro não funciona lá.
  dark?: { color: string; ink: string };
};

export const ACCENTS: Record<string, Accent> = {
  // Paleta Moriá, tirada da logo e das fotos das peças. As cores de texto e
  // botão são versões mais escuras dos tons das peças (swatch), para manter
  // contraste sobre o fundo creme.
  cafe: {
    label: "Café",
    color: "#4c2d18",
    soft: "#e4cba7",
    swatch: "#4c2d18",
    dark: { color: "#e6c9a3", ink: "#24150b" },
  },
  oliva: {
    label: "Verde oliva",
    color: "#535417",
    soft: "#efedd9",
    swatch: "#7d7a2e",
    dark: { color: "#cfcd8f", ink: "#16160a" },
  },
  terracota: {
    label: "Terracota",
    color: "#9c4f33",
    soft: "#f8e9e0",
    swatch: "#c47a5a",
    dark: { color: "#e0a184", ink: "#1f120c" },
  },
  salvia: { label: "Verde sálvia", color: "#4f6b53", soft: "#eaf0e8", swatch: "#a9bfa3", dark: { color: "#a9bfa3", ink: "#121a13" } },
  petroleo: { label: "Azul petróleo", color: "#2c4656", soft: "#e6edf1", swatch: "#34566b", dark: { color: "#9fc0d2", ink: "#0d171d" } },
  rosa: { label: "Rosa argila", color: "#a3535f", soft: "#fbeaec", swatch: "#e8a9ad", dark: { color: "#e8a9ad", ink: "#1f0f12" } },
  marrom: { label: "Marrom da logo", color: "#5b4435", soft: "#f4e6d6", dark: { color: "#f4dec6", ink: "#241a14" } },
  indigo: { label: "Índigo", color: "#4f46e5", soft: "#eef2ff" },
  emerald: { label: "Esmeralda", color: "#047857", soft: "#ecfdf5" },
  rose: { label: "Rosé", color: "#be123c", soft: "#fff1f2" },
  amber: { label: "Âmbar", color: "#b45309", soft: "#fffbeb" },
  slate: { label: "Grafite", color: "#1e293b", soft: "#f1f5f9", dark: { color: "#e2e8f0", ink: "#0f172a" } },
};

export const THEMES = {
  light: { bg: "#faf8f5", surface: "#ffffff", ink: "#1c1917", muted: "#78716c", line: "#e7e5e4" },
  dark: { bg: "#0b0b10", surface: "#15151c", ink: "#f5f5f4", muted: "#a1a1aa", line: "#2a2a33" },
  moria: { bg: "#ebd7bb", surface: "#f4e5d0", ink: "#4b2f1c", muted: "#754d40", line: "#d9bf9b" },
  // Versão noturna do tema Moriá (modo escuro automático): café escuro e creme.
  "moria-noite": { bg: "#1f140c", surface: "#2c1d12", ink: "#f2e1cb", muted: "#cdb08c", line: "#43301f" },
} as const;

// Tema efetivamente desenhado (inclui a variante noturna, que não é escolhida
// no painel: entra sozinha com o modo escuro automático).
export type RenderTheme = StoreTheme | "moria-noite";

// Modo escuro automático: qual tema usar quando o aparelho está no escuro.
export function darkVariant(theme: StoreTheme): RenderTheme {
  return theme === "moria" ? "moria-noite" : "dark";
}

function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function themeVars(accent: string, theme: RenderTheme): React.CSSProperties {
  // O tema da marca usa sempre o café da paleta Moriá.
  const a = theme === "moria" || theme === "moria-noite" ? ACCENTS.cafe : (ACCENTS[accent] ?? ACCENTS.cafe);
  const t = THEMES[theme] ?? THEMES.light;
  const isDark = theme === "dark" || theme === "moria-noite";
  const color = isDark && a.dark ? a.dark.color : a.color;
  const ink = isDark && a.dark ? a.dark.ink : theme === "moria" ? "#f2e1cb" : "#fffaf0";
  return {
    "--bg": t.bg,
    "--surface": t.surface,
    "--ink": t.ink,
    "--muted": t.muted,
    "--line": t.line,
    "--accent": color,
    "--accent-ink": ink,
    "--accent-text": color,
    "--bg-glass": rgba(t.bg, 0.82),
    "--surface-glass": rgba(t.surface, 0.82),
    "--accent-ring": rgba(color, 0.22),
    "--accent-soft":
      isDark ? "rgba(255,255,255,0.06)" : a.soft,
    // Rodapé: no tema Moriá é café com letras creme; nos outros, segue a página.
    "--footer-bg": theme === "moria" ? "#4c2d18" : theme === "moria-noite" ? "#140c06" : t.surface,
    "--footer-ink": theme === "moria" || theme === "moria-noite" ? "#f2e1cb" : t.ink,
    "--footer-muted": theme === "moria" || theme === "moria-noite" ? "#e0c9a6" : t.muted,
    "--footer-line": theme === "moria" || theme === "moria-noite" ? "rgba(242,225,203,0.18)" : t.line,
  } as React.CSSProperties;
}

export function normalizeWhatsapp(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

export function whatsappLink(number: string, text: string): string {
  const digits = normalizeWhatsapp(number || DEFAULT_WHATSAPP);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function formatWhatsappDisplay(number: string): string {
  const d = normalizeWhatsapp(number).replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return number;
}

// Endereço do player incorporado de um Reel/post do Instagram, ou null se o
// link não for de um vídeo/post.
export function instagramEmbedUrl(link: string): string | null {
  const m = link.trim().match(/^https:\/\/(?:www\.)?instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  if (!m) return null;
  const kind = m[1] === "reels" ? "reel" : m[1];
  return `https://www.instagram.com/${kind}/${m[2]}/embed`;
}

export type OrderLine = { product: PublicProduct; qty: number; note: string };

export const PRICE_ON_REQUEST_LABEL = "Preço a consultar";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const formatBRL = brl;
const round2 = (v: number) => Math.round(v * 100) / 100;
const pct = (v: number) => `${Number(v.toFixed(1)).toLocaleString("pt-BR")}%`;
export const formatPercent = pct;

// ---- Descontos ---------------------------------------------------------------
// `price` é sempre o preço cheio; `discount_percent` (vindo do servidor) já é o
// maior entre o desconto do produto e o da promoção geral em vigor.
export type CartTier = { min_total: number; percent: number };
export type DiscountRules = { tiers: CartTier[]; stack: boolean };

export function hasDiscount(product: PublicProduct): boolean {
  return !product.price_on_request && (product.discount_percent ?? 0) > 0;
}

export function unitPrice(product: PublicProduct): number {
  return hasDiscount(product) ? round2(product.price * (1 - (product.discount_percent ?? 0) / 100)) : product.price;
}

export function priceLabel(product: PublicProduct, qty = 1): string {
  return product.price_on_request ? PRICE_ON_REQUEST_LABEL : brl(unitPrice(product) * qty);
}

// Preço cheio (riscado), só quando há desconto.
export function fullPriceLabel(product: PublicProduct, qty = 1): string {
  return brl(product.price * qty);
}

export function discountBadge(product: PublicProduct): string {
  return `-${pct(product.discount_percent ?? 0)}`;
}

export type OrderTotals = {
  full: number; // soma dos preços cheios
  items: number; // soma já com os descontos dos produtos
  itemSavings: number; // economia dos descontos dos produtos (0 se não valeram)
  tier: CartTier | null; // faixa do pedido aplicada
  tierSavings: number;
  total: number;
  savings: number;
  // Próxima faixa e quanto falta para chegar nela.
  next: { tier: CartTier; missing: number } | null;
};

function tierFor(tiers: CartTier[], amount: number): CartTier | null {
  return [...tiers].sort((a, b) => b.min_total - a.min_total).find((t) => amount >= t.min_total) ?? null;
}

// Totais do pedido. Sem acumular (padrão), vale o MAIOR desconto: o dos
// produtos/promoção OU o da faixa do pedido (sobre o preço cheio). Acumulando,
// a faixa é aplicada por cima do valor já com desconto.
export function computeTotals(lines: OrderLine[], rules?: DiscountRules): OrderTotals {
  const tiers = rules?.tiers ?? [];
  const full = round2(lines.reduce((sum, l) => sum + (l.product.price_on_request ? 0 : l.product.price * l.qty), 0));
  const items = round2(lines.reduce((sum, l) => sum + (l.product.price_on_request ? 0 : unitPrice(l.product) * l.qty), 0));
  const base = rules?.stack ? items : full;
  const tier = tierFor(tiers, base);
  const upcoming = [...tiers].sort((a, b) => a.min_total - b.min_total).find((t) => t.min_total > base);
  const next = upcoming ? { tier: upcoming, missing: round2(upcoming.min_total - base) } : null;

  let result: Omit<OrderTotals, "full" | "items" | "next">;
  if (!tier) {
    result = { itemSavings: round2(full - items), tier: null, tierSavings: 0, total: items, savings: round2(full - items) };
  } else if (rules?.stack) {
    const total = round2(items * (1 - tier.percent / 100));
    result = { itemSavings: round2(full - items), tier, tierSavings: round2(items - total), total, savings: round2(full - total) };
  } else {
    const withTier = round2(full * (1 - tier.percent / 100));
    result =
      withTier < items
        ? { itemSavings: 0, tier, tierSavings: round2(full - withTier), total: withTier, savings: round2(full - withTier) }
        : { itemSavings: round2(full - items), tier: null, tierSavings: 0, total: items, savings: round2(full - items) };
  }
  return { full, items, next, ...result };
}

export function buildOrderMessage(
  storeName: string,
  lines: OrderLine[],
  customer: { name: string; extra: string },
  rules?: DiscountRules
): string {
  const totals = computeTotals(lines, rules);
  // Sem acumular e com a faixa valendo, os itens vão a preço cheio (a faixa
  // substitui os descontos dos produtos).
  const itemDiscounts = totals.tier === null || !!rules?.stack;
  const anyOnRequest = lines.some((l) => l.product.price_on_request);
  const items = lines
    .map((l, i) => {
      const size = l.product.size ? ` (${l.product.size})` : "";
      const note = l.note ? `\n   Obs: ${l.note}` : "";
      let price: string;
      if (l.product.price_on_request) price = `${l.qty} × preço a consultar`;
      else if (itemDiscounts && hasDiscount(l.product))
        price = `${l.qty} × ~${brl(l.product.price)}~ ${brl(unitPrice(l.product))} (${discountBadge(l.product)}) = ${brl(
          unitPrice(l.product) * l.qty
        )}`;
      else price = `${l.qty} × ${brl(l.product.price)} = ${brl(l.product.price * l.qty)}`;
      return `*${i + 1}.* ${l.product.name}${size}\n   ${price}${note}`;
    })
    .join("\n\n");
  const summary: string[] = [];
  if (totals.savings > 0) {
    summary.push(`Subtotal: ${brl(totals.full)}`);
    if (totals.itemSavings > 0) summary.push(`Descontos dos produtos: -${brl(totals.itemSavings)}`);
    if (totals.tier)
      summary.push(
        `Desconto de ${pct(totals.tier.percent)} (pedidos a partir de ${brl(totals.tier.min_total)}): -${brl(totals.tierSavings)}`
      );
  }
  const totalLine =
    anyOnRequest && totals.total === 0
      ? "*Total: a consultar*"
      : `*Total estimado: ${brl(totals.total)}*${anyOnRequest ? " + itens com preço a consultar" : ""}`;
  const parts = [`Olá, ${storeName}! Gostaria de fazer um pedido:`, items, [...summary, totalLine].join("\n")];
  if (customer.name.trim()) parts.push(`*Nome:* ${customer.name.trim()}`);
  if (customer.extra.trim()) parts.push(`*Informações adicionais:* ${customer.extra.trim()}`);
  return parts.join("\n\n");
}

// Avisos de promoção (faixa do topo e banner da página inicial).
export function promoNotices(settings: {
  promo_percent?: number;
  promo_label?: string;
  promo_end?: string;
  cart_tiers?: CartTier[];
}): string[] {
  const notes: string[] = [];
  if ((settings.promo_percent ?? 0) > 0) {
    const label = settings.promo_label?.trim() || "Promoção";
    const until = settings.promo_end
      ? ` até ${settings.promo_end.slice(8, 10)}/${settings.promo_end.slice(5, 7)}`
      : "";
    notes.push(`${label}: ${pct(settings.promo_percent ?? 0)} OFF em todos os itens${until}`);
  }
  for (const t of [...(settings.cart_tiers ?? [])].sort((a, b) => a.min_total - b.min_total)) {
    notes.push(`${pct(t.percent)} OFF em pedidos a partir de ${brl(t.min_total)}`);
  }
  return notes;
}

// Pede à Cloudflare (functions/loja-data.js) para buscar de novo os dados da
// loja pública logo após uma alteração no painel. Sem efeito em desenvolvimento.
export function refreshPublicStoreCache(slug: string | undefined): void {
  if (!slug || process.env.NODE_ENV !== "production") return;
  // Dá ~1 s para o servidor terminar de gravar antes de buscar.
  setTimeout(() => {
    fetch(`/loja-data?s=${encodeURIComponent(slug)}&refresh=1`).catch(() => {});
  }, 1000);
}

// Prazo de produção: "7 a 10 dias úteis" → data em que fica pronto pedindo
// hoje (usa o maior número; "úteis" pula sábado e domingo). Sem número, null.
export function productionReadyDate(text: string | undefined, from = new Date()): Date | null {
  const nums = (text ?? "").match(/\d+/g);
  if (!nums) return null;
  const days = Math.max(...nums.map(Number));
  if (!Number.isFinite(days) || days <= 0 || days > 365) return null;
  const businessOnly = /[uú]te(is|l)/i.test(text ?? "");
  const date = new Date(from);
  let left = days;
  while (left > 0) {
    date.setDate(date.getDate() + 1);
    const wd = date.getDay();
    if (businessOnly && (wd === 0 || wd === 6)) continue;
    left -= 1;
  }
  return date;
}

export function formatReadyDate(date: Date): string {
  return date
    .toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })
    .replace(".", "");
}
