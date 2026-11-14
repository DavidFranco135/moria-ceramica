import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "Moriá Cerâmica",
  description: "Cerâmica artesanal, utilitária, feita à mão. Cada peça moldada com propósito.",
  manifest: undefined,
  openGraph: {
    title: "Moriá Cerâmica",
    description: "Cerâmica artesanal, utilitária, feita à mão. Cada peça moldada com propósito.",
    images: [{ url: "/brand/moria-logo.png", width: 1000, height: 1000 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf4ea",
};

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${sans.variable} ${display.variable}`}>{children}</div>;
}
