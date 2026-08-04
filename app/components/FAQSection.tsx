const faqs = [
  ["O valor da calculadora é final?", "Não. É uma estimativa inicial. O valor final depende do ambiente, contrapiso, recortes, rodapé, material escolhido e deslocamento."],
  ["Vocês vendem só o piso sem instalar?", "Sim. Você pode solicitar apenas o piso ou piso com instalação."],
  ["Qual o principal tipo de piso trabalhado?", "O foco principal é piso vinílico, mas também podemos avaliar outros tipos de piso conforme o projeto."],
  ["Como faço para receber o orçamento?", "Você pode usar a calculadora ou chamar diretamente no WhatsApp."],
];

export function FAQSection() {
  return (
    <section id="faq" className="faq-section">
      <div className="faq-heading">
        <p className="section-kicker">Antes de começar</p>
        <h2>Dúvidas frequentes.</h2>
      </div>
      <div className="faq-list">
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
