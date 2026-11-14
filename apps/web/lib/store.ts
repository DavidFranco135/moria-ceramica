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
};
export type PublicCategory = { id: string; name: string; cover_url: string; cover_x?: number; cover_y?: number };

// "moria": tema da marca — creme e marrom da logo, com destaque terracota.
export type StoreTheme = "light" | "dark" | "moria";

export const THEME_OPTIONS: { key: StoreTheme; label: string }[] = [
  { key: "light", label: "Claro" },
  { key: "dark", label: "Escuro" },
  { key: "moria", label: "Moriá – creme e terracota" },
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
  moria: { bg: "#fbf4ea", surface: "#fffdf9", ink: "#3d2e25", muted: "#8a7363", line: "#ead8c3" },
} as const;

function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function themeVars(accent: string, theme: StoreTheme): React.CSSProperties {
  const a = ACCENTS[accent] ?? ACCENTS.terracota;
  const t = THEMES[theme] ?? THEMES.light;
  const isDark = theme === "dark";
  const color = isDark && a.dark ? a.dark.color : a.color;
  const ink = isDark && a.dark ? a.dark.ink : "#ffffff";
  return {
    "--bg": t.bg,
    "--surface": t.surface,
    "--ink": t.ink,
    "--muted": t.muted,
    "--line": t.line,
    "--accent": color,
    "--accent-ink": ink,
    "--bg-glass": rgba(t.bg, 0.82),
    "--surface-glass": rgba(t.surface, 0.82),
    "--accent-ring": rgba(color, 0.22),
    "--accent-soft":
      theme === "dark" ? "rgba(255,255,255,0.06)" : a.soft,
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

export function priceLabel(product: PublicProduct, qty = 1): string {
  return product.price_on_request ? PRICE_ON_REQUEST_LABEL : brl(product.price * qty);
}

export function buildOrderMessage(
  storeName: string,
  lines: OrderLine[],
  customer: { name: string; extra: string }
): string {
  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const anyOnRequest = lines.some((l) => l.product.price_on_request);
  const items = lines
    .map((l, i) => {
      const size = l.product.size ? ` (${l.product.size})` : "";
      const note = l.note ? `\n   Obs: ${l.note}` : "";
      const price = l.product.price_on_request
        ? `${l.qty} × preço a consultar`
        : `${l.qty} × ${brl(l.product.price)} = ${brl(l.product.price * l.qty)}`;
      return `*${i + 1}.* ${l.product.name}${size}\n   ${price}${note}`;
    })
    .join("\n\n");
  const totalLine =
    anyOnRequest && total === 0
      ? "*Total: a consultar*"
      : `*Total estimado: ${brl(total)}*${anyOnRequest ? " + itens com preço a consultar" : ""}`;
  const parts = [`Olá, ${storeName}! Gostaria de fazer um pedido:`, items, totalLine];
  if (customer.name.trim()) parts.push(`*Nome:* ${customer.name.trim()}`);
  if (customer.extra.trim()) parts.push(`*Informações adicionais:* ${customer.extra.trim()}`);
  return parts.join("\n\n");
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
