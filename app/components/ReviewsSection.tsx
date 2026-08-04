import { ArrowUpRight, Quote, Star } from "lucide-react";

const reviews = [
  {
    quote: "O atendimento foi direto e o acabamento ficou muito acima do que imaginávamos para o apartamento.",
    name: "Mariana R.",
    place: "São Paulo, SP",
  },
  {
    quote: "Recebemos orientação sobre material, nivelamento e prazo. A instalação foi organizada do começo ao fim.",
    name: "Carlos A.",
    place: "Guarulhos, SP",
  },
  {
    quote: "A estimativa ajudou a decidir rápido e depois a equipe explicou cada item do orçamento oficial.",
    name: "Fernanda M.",
    place: "Osasco, SP",
  },
];

const googlePlaceholder = "https://www.google.com/";

export function ReviewsSection() {
  return (
    <section id="avaliacoes" className="reviews-section">
      <div className="reviews-heading">
        <div>
          <p className="section-kicker">Avaliações</p>
          <h2>Confiança também se constrói no detalhe.</h2>
        </div>
        <p>Relatos de clientes sobre atendimento, clareza e execução do serviço.</p>
      </div>

      <div className="reviews-grid">
        {reviews.map((review) => (
          <article key={review.name}>
            <Quote size={22} aria-hidden="true" />
            <div className="review-stars" aria-label="5 de 5 estrelas">
              {Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill="currentColor" aria-hidden="true" />)}
            </div>
            <blockquote>“{review.quote}”</blockquote>
            <footer><strong>{review.name}</strong><span>{review.place}</span></footer>
          </article>
        ))}
      </div>

      <div className="review-actions">
        <a className="button button-dark" href={googlePlaceholder} target="_blank" rel="noreferrer">Consultar no Google <ArrowUpRight size={16} aria-hidden="true" /></a>
        <a className="button button-ghost" href={googlePlaceholder} target="_blank" rel="noreferrer">Avaliar empresa <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
