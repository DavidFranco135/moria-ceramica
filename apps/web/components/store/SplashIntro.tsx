"use client";

// Abertura da loja (no estilo da abertura do Driver Booster): fundo café, um
// anel de luz âmbar e terracota se desenha girando, solta faíscas e a logo
// surge num disco creme no centro. Depois tudo se dissolve e a loja aparece.
//
// - Primeira visita na sessão: animação completa (~2,4 s), e só sai quando a
//   loja já carregou (serve de tela de carregamento).
// - Visitas seguintes na mesma sessão, ou aparelho com "reduzir movimento":
//   só o disco com a logo enquanto carrega, e sai rápido.
// - Clicar/tocar pula a abertura (quando a loja já carregou).
import { useEffect, useRef, useState } from "react";
import { IMG_WIDTH, imgSrc } from "@/lib/img";

const SEEN_KEY = "moria-abertura-vista";
const LOGO_KEY = "moria-abertura-logo";
const INTRO_MS = 2400;
const EXIT_MS = 650;
const MAX_WAIT_MS = 7000;

type Phase = "intro" | "loader" | "exit" | "done";

// Faíscas que saem do anel quando ele se fecha: ângulo e distância de cada uma.
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  angle: (360 / 14) * i + (i % 2 ? 9 : -6),
  distance: 34 + ((i * 37) % 30),
  delay: 1450 + ((i * 53) % 220),
  size: i % 3 === 0 ? 5 : 3,
}));

export function SplashIntro({ logoUrl, name, ready }: { logoUrl?: string; name: string; ready: boolean }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [cachedLogo, setCachedLogo] = useState<string | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const startedAt = useRef(0);
  const minMs = useRef(INTRO_MS);

  // Decide o modo assim que a página abre no navegador.
  useEffect(() => {
    startedAt.current = performance.now();
    let seen = false;
    let reduce = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      window.sessionStorage.setItem(SEEN_KEY, "1");
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCachedLogo(window.localStorage.getItem(LOGO_KEY));
    } catch {
      // navegação privada: segue com a abertura completa
    }
    if (seen || reduce) {
      minMs.current = 350;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("loader");
    }
  }, []);

  // Guarda a logo para a próxima abertura já começar com ela.
  useEffect(() => {
    if (!logoUrl) return;
    try {
      window.localStorage.setItem(LOGO_KEY, logoUrl);
    } catch {
      // sem armazenamento: tudo bem
    }
  }, [logoUrl]);

  // Sai quando a loja carregou e a animação mínima terminou (ou no tempo máximo).
  useEffect(() => {
    if (phase === "exit" || phase === "done") return;
    const elapsed = startedAt.current ? performance.now() - startedAt.current : 0;
    const wait = ready ? Math.max(0, minMs.current - elapsed) : Math.max(0, MAX_WAIT_MS - elapsed);
    const id = setTimeout(() => setPhase("exit"), wait);
    return () => clearTimeout(id);
  }, [ready, phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const id = setTimeout(() => setPhase("done"), EXIT_MS);
    return () => clearTimeout(id);
  }, [phase]);

  // Trava a rolagem da página enquanto a abertura está na tela.
  useEffect(() => {
    if (phase === "done") return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [phase]);

  if (phase === "done") return null;

  const logo = logoUrl || cachedLogo || "";
  const loader = phase === "loader";

  return (
    <div
      role="presentation"
      aria-hidden
      onClick={() => ready && setPhase("exit")}
      className={`moria-splash ${loader ? "is-loader" : "is-intro"} ${phase === "exit" ? "is-exit" : ""}`}
    >
      <div className="moria-splash-stage">
        <svg className="moria-splash-ring" viewBox="0 0 260 260" aria-hidden>
          <defs>
            <linearGradient id="moriaRingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffe2b3" />
              <stop offset="45%" stopColor="#e9974f" />
              <stop offset="100%" stopColor="#b8541f" />
            </linearGradient>
            <filter id="moriaGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* trilho apagado */}
          <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(242,225,203,0.08)" strokeWidth="2" />
          {/* anel de luz que se desenha */}
          <g className="moria-splash-spin">
            <circle
              className="moria-splash-arc"
              cx="130"
              cy="130"
              r="110"
              fill="none"
              stroke="url(#moriaRingGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#moriaGlow)"
              pathLength={100}
            />
          </g>
          {/* anel fino que gira ao contrário */}
          <g className="moria-splash-spin-rev">
            <circle
              cx="130"
              cy="130"
              r="122"
              fill="none"
              stroke="rgba(255,226,179,0.45)"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="18 82"
            />
          </g>
        </svg>

        {!loader &&
          SPARKS.map((s, i) => (
            <span
              key={i}
              className="moria-splash-spark"
              style={
                {
                  "--a": `${s.angle}deg`,
                  "--d": `${s.distance}px`,
                  "--s": `${s.size}px`,
                  animationDelay: `${s.delay}ms`,
                } as React.CSSProperties
              }
            />
          ))}

        <div className="moria-splash-disc">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc(logo, IMG_WIDTH.thumb)}
              alt=""
              onLoad={() => setLogoLoaded(true)}
              className={`moria-splash-logo ${logoLoaded ? "is-loaded" : ""}`}
            />
          ) : (
            <span className="moria-splash-initial">{name.slice(0, 1).toUpperCase()}</span>
          )}
        </div>
      </div>
      <p className="moria-splash-name">{name}</p>
    </div>
  );
}
