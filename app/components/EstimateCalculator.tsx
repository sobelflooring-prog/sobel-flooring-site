"use client";

import { ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { WHATSAPP_NUMBER } from "./site-config";

const FLOOR_OPTIONS = {
  "Piso Colado 2 mm": {
    base: 150,
    min: 140,
    max: 170,
    includes: "Piso, primer, cola, nivelamento, instalação e rodapé",
    excludes: "",
  },
  "Piso Colado 3 mm (Comercial)": {
    base: 160,
    min: 150,
    max: 175,
    includes: "Piso, primer, cola, nivelamento, instalação e rodapé",
    excludes: "",
  },
  "Piso Clicado 5 mm": {
    base: 200,
    min: 190,
    max: 230,
    includes: "Piso, instalação e rodapé",
    excludes: "Não inclui nivelamento nem primer",
  },
} as const;

type FloorType = keyof typeof FLOOR_OPTIONS;

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function EstimateCalculator() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [floorType, setFloorType] = useState<FloorType>("Piso Colado 2 mm");
  const [error, setError] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);

  const parsedArea = Number(area.replace(",", "."));
  const option = FLOOR_OPTIONS[floorType];
  const validArea = Number.isFinite(parsedArea) && parsedArea > 0;
  const calculation = {
    average: validArea ? parsedArea * option.base : 0,
    minimum: validArea ? parsedArea * option.min : 0,
    maximum: validArea ? parsedArea * option.max : 0,
  };

  function handleCalculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validArea) {
      setError("Informe uma metragem maior que zero para calcular.");
      setHasCalculated(false);
      return;
    }
    setError("");
    setHasCalculated(true);
  }

  const whatsappMessage = [
    "Olá, vim pelo site da Sobel Flooring e quero solicitar um orçamento oficial.",
    "",
    `Nome: ${name || "Não informado"}`,
    `Bairro/Cidade: ${location || "Não informado"}`,
    `Tipo de piso: ${floorType}`,
    `Metragem: ${validArea ? parsedArea.toLocaleString("pt-BR") : "Não informada"} m²`,
    `Valor médio estimado: ${formatBRL(calculation.average)}`,
    `Faixa estimada: ${formatBRL(calculation.minimum)} a ${formatBRL(calculation.maximum)}`,
    "",
    "Sei que esta é uma estimativa inicial e gostaria de receber o orçamento oficial.",
  ].join("\n");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="calculadora" className="estimate-section">
      <div className="estimate-intro">
        <p className="section-kicker">Simulador de orçamento</p>
        <h2>Uma referência clara antes do orçamento oficial.</h2>
        <p>
          Informe a metragem e o sistema desejado. A simulação considera um pacote completo adequado a cada tipo de piso.
        </p>
        <div className="estimate-rate-list">
          {Object.entries(FLOOR_OPTIONS).map(([label, data]) => (
            <div key={label}><span>{label}</span><strong>{formatBRL(data.base)} / m²</strong></div>
          ))}
        </div>
        <a className="instagram-button" href="https://www.instagram.com/sobelflooring/" target="_blank" rel="noreferrer">
          <InstagramIcon /> Ver projetos no Instagram <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>

      <form className="estimate-form" onSubmit={handleCalculate} noValidate>
        <div className="estimate-grid">
          <label>
            <span>Nome</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos te chamar?" autoComplete="name" />
          </label>
          <label>
            <span>Bairro / Cidade</span>
            <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Ex.: Mooca, São Paulo" autoComplete="address-level2" />
          </label>
          <label>
            <span>Metragem em m²</span>
            <input
              type="number"
              inputMode="decimal"
              min="0.1"
              step="0.1"
              value={area}
              onChange={(event) => {
                setArea(event.target.value);
                setHasCalculated(false);
                if (error) setError("");
              }}
              placeholder="Ex.: 50"
              aria-describedby={error ? "area-error" : undefined}
            />
          </label>
          <label>
            <span>Tipo de piso</span>
            <select value={floorType} onChange={(event) => { setFloorType(event.target.value as FloorType); setHasCalculated(false); }}>
              {Object.keys(FLOOR_OPTIONS).map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
        </div>

        <div className="estimate-package">
          <div><span>Inclui</span><p>{option.includes}</p></div>
          {option.excludes && <div className="estimate-exclusion"><span>Atenção</span><p>{option.excludes}</p></div>}
        </div>

        {error && <p id="area-error" className="estimate-error" role="alert">{error}</p>}

        <button className="button button-warm estimate-submit" type="submit">
          Calcular estimativa <ArrowRight size={18} aria-hidden="true" />
        </button>

        {hasCalculated && (
          <div className="estimate-result" aria-live="polite">
            <div className="estimate-result-heading">
              <span>Resultado da simulação</span>
              <strong>{floorType}</strong>
              <small>{parsedArea.toLocaleString("pt-BR")} m² informados</small>
            </div>
            <div className="estimate-values">
              <div><span>Valor médio estimado</span><strong>{formatBRL(calculation.average)}</strong></div>
              <div><span>Faixa de preço estimada</span><strong>{formatBRL(calculation.minimum)} — {formatBRL(calculation.maximum)}</strong></div>
            </div>
            <p className="estimate-disclaimer">Este orçamento é apenas uma estimativa inicial e não substitui um orçamento oficial.</p>
            <p className="estimate-note">
              O valor poderá variar conforme nivelamento, recortes, perdas, cidade, logística e demais características da obra.
            </p>
            <a className="button button-warm estimate-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
              Solicitar orçamento oficial pelo WhatsApp <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        )}
      </form>
    </section>
  );
}
