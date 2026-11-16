import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  // Itálico para as palavras de destaque dos títulos ("mesa com *alma*").
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Moriá Cerâmica",
  description: "Cerâmica artesanal, utilitária, feita à mão. Cada peça moldada com propósito.",
  manifest: "/manifest-loja.json",
  openGraph: {
    title: "Moriá Cerâmica",
    description: "Cerâmica artesanal, utilitária, feita à mão. Cada peça moldada com propósito.",
    images: [{ url: "/brand/moria-og.jpg", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f2e1cb",
};

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${sans.variable} ${display.variable}`}>
      {/* Antes de qualquer coisa aparecer: aplica o último tema visto neste
          aparelho, para a abertura animada já sair nas cores certas. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{var t=localStorage.getItem('moria-tema');if(t)document.documentElement.setAttribute('data-loja-tema',t)}catch(e){}" +
            // Guarda o aviso de "instalar app" se ele chegar antes do resto da página.
            "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__bip=e;});",
        }}
      />
      {children}
    </div>
  );
}
