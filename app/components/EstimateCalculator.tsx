"use client";

import { ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { WHATSAPP_NUMBER } from "./site-config";

export function EstimateCalculator() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [floorType, setFloorType] = useState("Vinílico");
  const [modality, setModality] = useState("Com instalação");
  const [error, setError] = useState("");

  const parsedArea = Number(area.replace(",", "."));
  const pricePerSquareMeter = modality === "Com instalação" ? 100 : 70;
  const estimate = Number.isFinite(parsedArea) && parsedArea > 0 ? parsedArea * pricePerSquareMeter : 0;
  const formattedEstimate = estimate.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
      setError("Informe uma metragem maior que zero para calcular.");
      return;
    }

    setError("");
    const message = [
      "Olá, vim pelo site da Sobel Flooring e quero fazer um orçamento.",
      "",
      `Nome: ${name || "Não informado"}`,
      `Bairro/Cidade: ${location || "Não informado"}`,
      `Metragem: ${parsedArea.toLocaleString("pt-BR")} m²`,
      `Tipo de piso: ${floorType}`,
      `Modalidade: ${modality}`,
      `Estimativa inicial: ${formattedEstimate}`,
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="calculadora" className="estimate-section">
      <div className="estimate-intro">
        <p className="section-kicker">Estimativa inicial</p>
        <h2>Agora calcule uma estimativa para o seu ambiente.</h2>
        <p>
          Escolha a modalidade e informe a metragem. Em seguida, envie os dados para a Sobel Flooring continuar o atendimento pelo WhatsApp.
        </p>
        <div className="estimate-rate-list">
          <div><span>Com instalação</span><strong>R$ 100 / m²</strong></div>
          <div><span>Sem instalação</span><strong>R$ 70 / m²</strong></div>
        </div>
      </div>

      <form className="estimate-form" onSubmit={handleSubmit} noValidate>
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
                if (error) setError("");
              }}
              placeholder="Ex.: 42"
              aria-describedby={error ? "area-error" : undefined}
            />
          </label>
          <label>
            <span>Tipo de piso</span>
            <select value={floorType} onChange={(event) => setFloorType(event.target.value)}>
              <option>Vinílico</option>
              <option>Laminado</option>
              <option>Outro</option>
            </select>
          </label>
        </div>

        <fieldset className="estimate-options">
          <legend>Modalidade</legend>
          <div>
            {["Com instalação", "Sem instalação"].map((option) => (
              <label key={option} className={modality === option ? "selected" : ""}>
                <input
                  type="radio"
                  name="modality"
                  value={option}
                  checked={modality === option}
                  onChange={(event) => setModality(event.target.value)}
                />
                <span>{option}</span>
                <i aria-hidden="true" />
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p id="area-error" className="estimate-error" role="alert">{error}</p>}

        <div className="estimate-result">
          <div>
            <span>Estimativa inicial</span>
            <strong aria-live="polite">{formattedEstimate}</strong>
          </div>
          <p>
            Valor aproximado. O orçamento final pode variar conforme contrapiso, recortes, rodapés, deslocamento, material e condições do ambiente.
          </p>
        </div>

        <button className="button button-warm estimate-submit" type="submit">
          Enviar estimativa no WhatsApp <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
