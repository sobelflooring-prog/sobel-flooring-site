const trustItems = [
  "Acabamento limpo",
  "Atendimento direto",
  "Estimativa rápida",
  "Instalação bem executada",
  "Visual moderno",
];

export function TrustSection() {
  return (
    <section className="trust-section">
      <div className="trust-statement">
        <p>SOBEL / FLOORING</p>
        <h2>O material aparece.<br />A execução permanece.</h2>
      </div>
      <div className="trust-body">
        <p>
          A Sobel Flooring une fornecimento de piso e instalação para facilitar sua decisão e reduzir risco na obra.
        </p>
        <div className="trust-list">
          {trustItems.map((item, index) => (
            <div key={item}><span>0{index + 1}</span>{item}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
