"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { WHATSAPP_URL } from "./site-config";
import { useMobilePerformanceMode } from "./useMobilePerformanceMode";

const HeroSceneCanvas = dynamic(
  () => import("./HeroSceneCanvas").then((module) => module.HeroSceneCanvas),
  { ssr: false, loading: () => <div className="canvas-loading" /> },
);

export function Hero3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const mobilePerformanceMode = useMobilePerformanceMode();
  const isNearViewport = useInView(sectionRef, { margin: "160px 0px" });

  return (
    <section id="inicio" ref={sectionRef} className="hero3d">
      <div className="hero3d-canvas" aria-hidden="true">
        {isNearViewport ? (
          <HeroSceneCanvas reducedMotion={reducedMotion} mobilePerformanceMode={mobilePerformanceMode} />
        ) : null}
      </div>

      <div className="hero3d-vignette" aria-hidden="true" />
      <div className="hero3d-content">
        <p className="section-kicker">Venda + instalação profissional</p>
        <h1>
          Seu ambiente muda<br />
          <span>quando o piso encaixa.</span>
        </h1>
        <p className="hero3d-lead">
          Piso vinílico selecionado, instalação precisa e uma estimativa clara antes de começar.
        </p>
        <div className="hero3d-actions">
          <a className="button button-dark" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            Fazer orçamento <ArrowRight size={17} aria-hidden="true" />
          </a>
          <a className="button button-ghost" href="#experiencia-3d">
            Ver o piso ganhar forma <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hero3d-data" aria-hidden="true">
        <span>VINÍLICO</span>
        <span>PRECISÃO</span>
        <span>ACABAMENTO</span>
      </div>
    </section>
  );
}
