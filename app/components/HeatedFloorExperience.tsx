"use client";

import { useReducedMotion } from "framer-motion";
import { Minus, Plus, ThermometerSun } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const HeatedFloorCanvas = dynamic(
  () => import("./HeatedFloorCanvas").then((module) => module.HeatedFloorCanvas),
  { ssr: false, loading: () => <div className="canvas-loading canvas-loading-dark" /> },
);

export function HeatedFloorExperience() {
  const [temperature, setTemperature] = useState(24);
  const reducedMotion = Boolean(useReducedMotion());
  const heatLevel = ((temperature - 18) / 14) * 100;

  return (
    <section id="piso-aquecido" className="heated-section">
      <div className="heated-heading">
        <div>
          <p className="section-kicker">Tecnologia sob o acabamento</p>
          <h2>Veja o calor percorrer cada camada.</h2>
        </div>
        <p>
          Explore em 3D como o piso vinílico, o cabo de aquecimento e o contrapiso trabalham juntos.
          Ajuste o termostato e acompanhe a resposta do sistema em tempo real.
        </p>
      </div>

      <div className="heated-stage">
        <div className="heated-canvas" aria-label="Modelo 3D em camadas de um sistema de piso aquecido">
          <HeatedFloorCanvas temperature={temperature} reducedMotion={reducedMotion} />
        </div>
        <div className="heated-stage-vignette" aria-hidden="true" />

        <div className="layer-legend" aria-label="Camadas do sistema">
          <div><i className="legend-vinyl" /><span>01</span><strong>Piso vinílico</strong></div>
          <div><i className="legend-cable" /><span>02</span><strong>Cabo de aquecimento</strong></div>
          <div><i className="legend-base" /><span>03</span><strong>Contrapiso</strong></div>
        </div>

        <div className="thermostat-card">
          <div className="thermostat-topline">
            <span><ThermometerSun size={16} aria-hidden="true" /> Termostato digital</span>
            <i className={temperature > 24 ? "is-heating" : ""}>{temperature > 24 ? "Aquecendo" : "Conforto"}</i>
          </div>
          <div className="thermostat-display" aria-live="polite">
            <strong>{temperature}</strong><span>°C</span>
          </div>
          <div className="thermostat-meter" aria-hidden="true"><i style={{ width: `${heatLevel}%` }} /></div>
          <div className="thermostat-controls">
            <button type="button" onClick={() => setTemperature((value) => Math.max(18, value - 1))} disabled={temperature === 18} aria-label="Diminuir temperatura">
              <Minus size={19} aria-hidden="true" />
            </button>
            <span>Ajuste a temperatura</span>
            <button type="button" onClick={() => setTemperature((value) => Math.min(32, value + 1))} disabled={temperature === 32} aria-label="Aumentar temperatura">
              <Plus size={19} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
