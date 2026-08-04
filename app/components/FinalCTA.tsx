import { ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "./site-config";

export function FinalCTA() {
  return (
    <section className="final-cta">
      <p className="section-kicker">Seu ambiente, a próxima etapa</p>
      <h2>Quer saber quanto ficaria seu piso?</h2>
      <p>Calcule em menos de 30 segundos ou fale direto com a Sobel Flooring.</p>
      <div>
        <a className="button button-light" href="#calculadora">Calcular estimativa <ArrowRight size={17} /></a>
        <a className="button button-outline-light" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
      </div>
    </section>
  );
}
