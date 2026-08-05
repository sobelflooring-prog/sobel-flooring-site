"use client";

import { motion, type MotionValue, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { type ReactNode, useRef } from "react";
import { WHATSAPP_URL } from "./site-config";
import { useMobilePerformanceMode } from "./useMobilePerformanceMode";

const JOURNEY_STAGES = [
  { index: "01", label: "Base", at: 0 },
  { index: "02", label: "Preparo", at: 0.25 },
  { index: "03", label: "Paginação", at: 0.5 },
  { index: "04", label: "Encaixe", at: 0.75 },
  { index: "05", label: "Pronto", at: 1 },
] as const;

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

function JourneyMarker({ progress, index, label, at }: { progress: MotionValue<number>; index: string; label: string; at: number }) {
  const input = at === 0 ? [0, 0.14] : at === 1 ? [0.86, 1] : [at - 0.14, at, at + 0.14];
  const opacityOutput = at === 0 ? [1, 0.34] : at === 1 ? [0.34, 1] : [0.34, 1, 0.34];
  const scaleOutput = at === 0 ? [1, 0.86] : at === 1 ? [0.86, 1] : [0.86, 1, 0.86];
  const opacity = useTransform(progress, input, opacityOutput);
  const scale = useTransform(progress, input, scaleOutput);

  return (
    <motion.li style={{ opacity, scale }}>
      <span>{index}</span>
      <small>{label}</small>
    </motion.li>
  );
}

export function ScrollFloorExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const mobilePerformanceMode = useMobilePerformanceMode();
  const isNearViewport = useInView(sectionRef, { margin: "320px 0px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 92, damping: 26, mass: 0.35 });
  const progress = reducedMotion ? scrollYProgress : smoothProgress;
  const barScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section id="experiencia-3d" ref={sectionRef} className="floor-experience">
      <div className="floor-experience-sticky">
        <div className="floor-canvas" aria-hidden="true">
          {isNearViewport ? (
            <FloorSceneCanvas progress={progress} reducedMotion={reducedMotion} mobilePerformanceMode={mobilePerformanceMode} />
          ) : null}
        </div>
        <div className="floor-overlay" aria-hidden="true" />

        <div className="floor-route" aria-hidden="true">
          <div className="floor-route-track"><motion.div style={{ scaleX: barScale }} /></div>
          <ol>
            {JOURNEY_STAGES.map((stage) => <JourneyMarker key={stage.index} progress={progress} {...stage} />)}
          </ol>
        </div>

        <div className="floor-progress" aria-hidden="true">
          <span>01</span><div className="floor-progress-track"><motion.div style={{ scaleY: barScale }} /></div><span>05</span>
        </div>

        <PhaseCopy progress={progress} range={[0, 0.19]} index="01" kicker="Leitura do ambiente" title="A transformação começa na base." text="Antes do piso, vêm a análise do contrapiso, as medidas e as condições reais do espaço." />
        <PhaseCopy progress={progress} range={[0.2, 0.39]} index="02" kicker="Preparo" title="Nivelar é parte da instalação." text="Uma base bem preparada reduz desníveis, frestas e problemas que aparecem depois da obra." align="right" />
        <PhaseCopy progress={progress} range={[0.4, 0.64]} index="03" kicker="Paginação" title="Cada régua encontra seu lugar." text="O desenho é planejado para manter alinhamento, proporção e um acabamento visualmente contínuo." />
        <PhaseCopy progress={progress} range={[0.65, 0.84]} index="04" kicker="Encaixe e acabamento" title="Instalação faz tanta diferença quanto o piso." text="Material e execução trabalhando juntos entregam unidade, conforto e valorização real do ambiente." align="right" />
        <PhaseCopy progress={progress} range={[0.85, 1]} index="05" kicker="Agora é o seu ambiente" title="Transforme a metragem em uma primeira estimativa.">
          <div className="floor-phase-actions">
            <a className="button button-warm" href="#calculadora">Calcular estimativa <ArrowRight size={17} /></a>
            <a className="button button-outline-light" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
          </div>
        </PhaseCopy>

        <div className="floor-scroll-label" aria-hidden="true">ROLE PARA VER A INSTALAÇÃO</div>
      </div>
    </section>
  );
}
