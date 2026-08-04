import { CalendarClock, MapPin, PackageCheck, Truck } from "lucide-react";

const products = [
  "Piso vinílico colado",
  "Piso vinílico clicado",
  "Rodapés e mantas",
  "Colas e primers",
  "Niveladores e perfis",
  "Acessórios para piso vinílico",
];

export function AboutSection() {
  return (
    <section id="quem-somos" className="about-section">
      <div className="about-brand-card">
        <div className="about-brand-image">
          {/* next/image is intentionally avoided because Vinext's dev worker does not expose the image optimizer fetch binding. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sobel-flooring-logo.webp"
            alt="Logotipo oficial Sobel Flooring — pisos vinílicos e insumos"
            width={720}
            height={720}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="about-coverage">
          <article>
            <Truck size={19} aria-hidden="true" />
            <div><strong>Todo o Brasil</strong><span>Venda e envio de produtos</span></div>
          </article>
          <article>
            <CalendarClock size={19} aria-hidden="true" />
            <div><strong>Estado de São Paulo</strong><span>Instalação em média em até 7 dias úteis*</span></div>
          </article>
        </div>
      </div>

      <div className="about-copy">
        <p className="section-kicker">Quem somos</p>
        <h2>Especialistas em piso vinílico, do produto ao acabamento.</h2>
        <p>
          Localizada em São Paulo, a Sobel Flooring atende todo o Brasil com venda e envio de produtos.
          A instalação é realizada exclusivamente no estado de São Paulo, com atendimento médio em até
          7 dias úteis, conforme disponibilidade da agenda.
        </p>
        <p>
          Nosso objetivo é oferecer produtos de alta qualidade, atendimento especializado e instalação
          profissional para que cada ambiente receba a solução correta.
        </p>

        <div className="about-products" aria-label="Produtos Sobel Flooring">
          {products.map((product) => (
            <div key={product}><PackageCheck size={15} aria-hidden="true" /><span>{product}</span></div>
          ))}
        </div>

        <div className="about-location-note">
          <MapPin size={17} aria-hidden="true" />
          <span>*Prazo médio sujeito à disponibilidade da agenda e às características da obra.</span>
        </div>
      </div>
    </section>
  );
}
