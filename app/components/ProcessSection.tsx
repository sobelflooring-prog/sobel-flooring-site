const steps = [
  ["01", "Metragem", "Você informa o tamanho aproximado do ambiente."],
  ["02", "Leitura do espaço", "A equipe entende uso, base e acabamento desejado."],
  ["03", "Estimativa", "Você recebe uma referência clara para decidir."],
  ["04", "Instalação", "Fechamos o orçamento e agendamos a execução."],
];

export function ProcessSection() {
  return (
    <section id="processo" className="process-section">
      <div className="process-heading">
        <p className="section-kicker">Do primeiro contato ao acabamento</p>
        <h2>Um processo simples. Uma execução que exige precisão.</h2>
      </div>
      <div className="process-steps">
        {steps.map(([number, title, text]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
