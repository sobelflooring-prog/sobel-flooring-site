"use client";

import { motion, type MotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { type ReactNode, useRef } from "react";
import { WHATSAPP_URL } from "./site-config";

const FloorSceneCanvas = dynamic(
  () => import("./FloorSceneCanvas").then((module) => module.FloorSceneCanvas),
  { ssr: false, loading: () => <div className="canvas-loading canvas-loading-dark" /> },
);

function PhaseCopy({
  progress,
  range,
  index,
  kicker,
  title,
  text,
  children,
  align = "left",
}: {
  progress: MotionValue<number>;
  range: [number, number];
  index: string;
  kicker: string;
  title: string;
  text?: string;
  children?: ReactNode;
  align?: "left" | "right";
}) {
  const isFinal = range[1] >= 1;
  const opacity = useTransform(progress, [range[0], range[0] + 0.035, range[1] - (isFinal ? 0 : 0.035), range[1]], [0, 1, 1, isFinal ? 1 : 0]);
  const y = useTransform(progress, [range[0], range[0] + 0.055], [48, 0]);

  return (
    <motion.div className={`floor-phase floor-phase-${align}`} style={{ opacity, y }}>
      <div className="floor-phase-index">{index}</div>
      <p className="floor-phase-kicker">{kicker}</p>
      <h2>{title}</h2>
      {text && <p className="floor-phase-text">{text}</p>}
      {children}
    </motion.div>
  );
}

export function ScrollFloorExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 92, damping: 26, mass: 0.35 });
  const progress = reducedMotion ? scrollYProgress : smoothProgress;
  const barScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section id="experiencia-3d" ref={sectionRef} className="floor-experience">
      <div className="floor-experience-sticky">
        <div className="floor-canvas" aria-hidden="true">
          <FloorSceneCanvas progress={progress} reducedMotion={reducedMotion} />
        </div>
        <div className="floor-overlay" aria-hidden="true" />

        <div className="floor-progress" aria-hidden="true">
          <span>01</span><div className="floor-progress-track"><motion.div style={{ scaleY: barScale }} /></div><span>05</span>
        </div>

        <PhaseCopy progress={progress} range={[0, 0.19]} index="01" kicker="Matéria em movimento" title="Tudo começa separado." text="Réguas independentes, profundidade real e possibilidades ainda abertas." />
        <PhaseCopy progress={progress} range={[0.2, 0.39]} index="02" kicker="Aproximação" title="O plano começa a aparecer." text="A câmera se aproxima enquanto cada peça desce em direção ao contrapiso." align="right" />
        <PhaseCopy progress={progress} range={[0.4, 0.64]} index="03" kicker="Alinhamento" title="Precisão antes do encaixe." text="O resultado nasce no preparo, no alinhamento e na constância entre cada régua." />
        <PhaseCopy progress={progress} range={[0.65, 0.84]} index="04" kicker="Ambiente pronto" title="Instalação faz tanta diferença quanto o próprio piso." text="Quando material e execução trabalham juntos, o ambiente ganha unidade, conforto e valor." align="right" />
        <PhaseCopy progress={progress} range={[0.85, 1]} index="05" kicker="Agora é o seu ambiente" title="Transforme a metragem em uma primeira estimativa.">
          <div className="floor-phase-actions">
            <a className="button button-warm" href="#calculadora">Calcular estimativa <ArrowRight size={17} /></a>
            <a className="button button-outline-light" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
          </div>
        </PhaseCopy>

        <div className="floor-scroll-label" aria-hidden="true">SCROLL PARA INSTALAR</div>
      </div>
    </section>
  );
}
