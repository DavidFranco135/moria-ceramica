// Fotos do ImgBB passam pela função /img da Cloudflare (functions/img.js),
// que as reduz para a largura pedida e as guarda em cache perto do cliente —
// direto do i.ibb.co muitas conexões no Brasil carregam muito devagar, e as
// originais têm vários MB. Em desenvolvimento (`next dev`) a função não
// existe, então lá a URL original é usada.
const PROXIED_PREFIX = "https://i.ibb.co/";

// Larguras usadas pela loja (a função arredonda para 240/640/1280/1920).
export const IMG_WIDTH = { thumb: 240, card: 640, large: 1280, hero: 1920 } as const;

export function imgSrc(url: string, width?: number): string;
export function imgSrc(url: string | undefined, width?: number): string | undefined;
export function imgSrc(url: string | undefined, width?: number): string | undefined {
  // Fotos do catálogo servidas pelo próprio site: há uma versão de 640 px
  // para cards e miniaturas, e a de 1600 px para o resto.
  const own = url?.match(/^\/fotos-catalogo\/(f\d+\.jpg)$/);
  if (own) return width && width <= 640 ? `/fotos-catalogo/640/${own[1]}` : url;
  if (!url || process.env.NODE_ENV !== "production" || !url.startsWith(PROXIED_PREFIX)) return url;
  return `/img?u=${encodeURIComponent(url)}${width ? `&w=${width}` : ""}`;
}
