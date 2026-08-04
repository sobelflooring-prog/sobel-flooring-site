"use client";

import {
  ArrowDown,
  ArrowRight,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Layers3,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";

const WHATSAPP_NUMBER = "5511989357411";
const DEFAULT_MESSAGE =
  "Olá, vim pelo site da Sobel Flooring e quero fazer um orçamento de piso.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={fadeUp}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#inicio" className="flex items-center gap-3" aria-label="Sobel Flooring — início">
      <span className="brand-mark" aria-hidden="true">S</span>
      <span className="leading-none">
        <span className={`block text-[0.9rem] font-[780] tracking-[0.13em] ${light ? "text-white" : "text-[#191917]"}`}>
          SOBEL
        </span>
        <span className={`mt-1 block text-[0.56rem] font-semibold tracking-[0.26em] ${light ? "text-white/55" : "text-[#777269]"}`}>
          FLOORING
        </span>
      </span>
    </a>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="topbar mx-auto flex max-w-[1180px] items-center justify-between rounded-2xl px-3 py-2.5 sm:px-4">
        <Brand />
        <nav className="hidden items-center gap-7 text-[0.78rem] font-semibold text-[#68665f] lg:flex" aria-label="Navegação principal">
          <a className="transition-colors hover:text-[#191917]" href="#servicos">Serviços</a>
          <a className="transition-colors hover:text-[#191917]" href="#instalacao">Instalação</a>
          <a className="transition-colors hover:text-[#191917]" href="#calculadora">Calculadora</a>
          <a className="transition-colors hover:text-[#191917]" href="#processo">Como funciona</a>
          <a className="transition-colors hover:text-[#191917]" href="#faq">Dúvidas</a>
        </nav>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-primary min-h-0! px-4! py-2.5! text-[0.76rem]! sm:px-5!"
        >
          <MessageCircle size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Fazer orçamento</span>
          <span className="sm:hidden">Orçamento</span>
        </a>
      </div>
    </header>
  );
}

const heroBoards = [
  { x: 3, y: 2, z: 18, delay: 0.1 },
  { x: 34, y: 2, z: 9, delay: 1.2 },
  { x: 18, y: 19, z: 40, delay: 0.7 },
  { x: 49, y: 19, z: 18, delay: 1.7 },
  { x: 2, y: 36, z: 4, delay: 2.2 },
  { x: 33, y: 36, z: 28, delay: 1.1 },
  { x: 18, y: 53, z: 12, delay: 2.8 },
  { x: 49, y: 53, z: 35, delay: 1.9 },
  { x: 2, y: 70, z: 24, delay: 0.4 },
  { x: 33, y: 70, z: 6, delay: 2.4 },
];

function HeroFloorScene() {
  return (
    <div className="hero-stage" aria-label="Composição tridimensional de réguas de piso vinílico">
      <div className="hero-floor-plane" aria-hidden="true">
        {heroBoards.map((board, index) => (
          <span
            key={index}
            className="hero-plank"
            style={{
              "--x": board.x,
              "--y": board.y,
              "--z": board.z,
              "--delay": board.delay,
            } as CSSProperties}
          />
        ))}
      </div>
      <motion.div
        className="material-card"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.7 }}
      >
        <div className="material-swatch" />
        <div className="mt-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-[0.64rem] font-bold tracking-[0.13em] text-[#8e4020] uppercase">Destaque</p>
            <p className="mt-1 text-sm font-bold text-[#26231f]">Vinílico amadeirado</p>
          </div>
          <Layers3 size={18} className="mt-0.5 text-[#b85d2f]" aria-hidden="true" />
        </div>
      </motion.div>
      <div className="absolute top-[13%] left-[5%] hidden items-center gap-2 rounded-full border border-black/8 bg-white/55 px-3 py-2 text-[0.68rem] font-bold text-[#6a645b] shadow-sm backdrop-blur-md sm:flex">
        <Sparkles size={14} className="text-[#b85d2f]" aria-hidden="true" />
        Conforto + acabamento
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:min-h-[780px] lg:pt-40 lg:pb-20">
      <div className="absolute top-[-12rem] left-[-15rem] -z-10 h-[34rem] w-[34rem] rounded-full bg-[#e7dac8]/45 blur-3xl" />
      <div className="mx-auto grid max-w-[1180px] items-center gap-7 px-5 sm:px-7 lg:grid-cols-[1.02fr_.98fr] lg:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <span className="eyebrow">Pisos que elevam o ambiente</span>
          <h1 className="display-title mt-6 max-w-[720px] text-[clamp(3.15rem,7.2vw,6.4rem)] leading-[0.92] font-[670]">
            Transforme seu ambiente com piso bonito, resistente e <span className="text-[#b85d2f]">bem instalado.</span>
          </h1>
          <p className="mt-6 max-w-[620px] text-[1rem] leading-7 text-[#68665f] sm:text-[1.08rem]">
            A Sobel Flooring oferece venda e instalação de pisos com atendimento rápido, acabamento profissional e orçamento direto pelo WhatsApp.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="btn-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Fazer orçamento agora
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="btn-secondary" href="#calculadora">
              <Calculator size={18} aria-hidden="true" />
              Calcular estimativa
            </a>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-black/10 pt-5 text-[0.76rem] font-semibold text-[#6d6860]">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#b85d2f]" /> Atendimento direto</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#b85d2f]" /> Estimativa em segundos</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#b85d2f]" /> Instalação profissional</span>
          </div>
        </motion.div>
        <HeroFloorScene />
      </div>
      <a href="#transformacao" aria-label="Ir para a próxima seção" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[0.65rem] font-bold tracking-[0.18em] text-[#777269] uppercase lg:flex">
        Descubra <ArrowDown size={14} />
      </a>
    </section>
  );
}

function Transformation() {
  return (
    <section id="transformacao" className="bg-[#232320] py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 sm:px-7 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
        <Reveal>
          <div className="room-card">
            <div className="room-wall" />
            <div className="room-floor-old" />
            <div className="room-floor-new" />
            <div className="room-divider" />
            <span className="room-label before">Antes</span>
            <span className="room-label after">Depois</span>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <span className="eyebrow text-[#e6a27d]!">Transformação real</span>
          <h2 className="display-title mt-6 text-[clamp(2.4rem,5vw,4.8rem)] leading-[.98] font-[650]">
            Seu piso muda a percepção do ambiente inteiro.
          </h2>
          <p className="mt-6 max-w-xl text-[1.03rem] leading-7 text-white/62">
            Um piso bem escolhido e bem instalado transforma a estética, valoriza o imóvel e evita dor de cabeça no futuro.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Piso antigo deixa o ambiente cansado",
              "Escolha errada gera arrependimento",
              "Instalação ruim reduz a durabilidade",
              "Orçamento confuso atrasa a decisão",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 border-t border-white/12 pt-4 text-sm leading-5 text-white/78">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d77e4e]" />
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const authorityCards = [
  {
    icon: PackageCheck,
    title: "Venda de pisos selecionados",
    text: "Indicamos opções adequadas para cada ambiente, considerando estética, resistência e custo-benefício.",
  },
  {
    icon: Wrench,
    title: "Instalação profissional",
    text: "A instalação correta evita frestas, desníveis, acabamento ruim e perda de durabilidade.",
  },
  {
    icon: ClipboardCheck,
    title: "Orçamento rápido e transparente",
    text: "Você recebe uma estimativa inicial e pode seguir direto para o atendimento no WhatsApp.",
  },
];

function Authority() {
  return (
    <section id="servicos" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
        <Reveal className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">Do material ao acabamento</span>
            <h2 className="display-title mt-5 max-w-3xl text-[clamp(2.45rem,5vw,4.9rem)] leading-[.98] font-[650]">
              Menos risco na obra. Mais clareza na decisão.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#68665f] sm:pb-2">
            Um único atendimento para escolher o piso, entender o ambiente e organizar a instalação.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {authorityCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 0.08}>
                <article className="premium-card h-full">
                  <div className="icon-box"><Icon size={22} aria-hidden="true" /></div>
                  <span className="mt-8 block text-[0.68rem] font-bold tracking-[0.17em] text-[#9a6e52] uppercase">0{index + 1}</span>
                  <h3 className="mt-3 text-xl leading-6 font-[690]">{card.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#68665f]">{card.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AssemblyPlank({
  progress,
  index,
  row,
  col,
}: {
  progress: MotionValue<number>;
  index: number;
  row: number;
  col: number;
}) {
  const reduceMotion = useReducedMotion();
  const direction = index % 2 === 0 ? -1 : 1;
  const x = useTransform(progress, [0, 0.35, 0.7, 1], [direction * 250, direction * 80, 0, 0]);
  const y = useTransform(progress, [0, 0.35, 0.7, 1], [-100 + index * 16, -30 + index * 5, 0, 0]);
  const z = useTransform(progress, [0, 0.55, 0.8, 1], [130 + index * 18, 60, 0, 0]);
  const rotateZ = useTransform(progress, [0, 0.7, 1], [direction * (16 + index * 2), direction * 3, 0]);
  const opacity = useTransform(progress, [0, 0.15, 0.62], [0.1, 0.65, 1]);

  return (
    <motion.div
      className="assembly-plank"
      style={{
        "--row": row,
        "--col": col,
        x: reduceMotion ? 0 : x,
        y: reduceMotion ? 0 : y,
        z: reduceMotion ? 0 : z,
        rotateZ: reduceMotion ? 0 : rotateZ,
        opacity: reduceMotion ? 1 : opacity,
      } as CSSProperties}
    />
  );
}

function FloorAssembly() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.45 });
  const textOpacity = useTransform(smoothProgress, [0.1, 0.28, 0.72, 0.88], [0, 1, 1, 0.2]);
  const textY = useTransform(smoothProgress, [0.1, 0.35], [50, 0]);
  const plans = [
    [0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [4, 1],
  ];

  return (
    <section id="instalacao" ref={sectionRef} className="assembly-section">
      <div className="assembly-sticky">
        <div className="mx-auto grid min-h-[100svh] max-w-[1180px] items-center gap-2 px-5 py-20 sm:px-7 lg:grid-cols-[.8fr_1.2fr]">
          <motion.div className="relative z-10" style={{ opacity: textOpacity, y: textY }}>
            <span className="eyebrow text-[#e6a27d]!">Precisão em cada régua</span>
            <h2 className="display-title mt-6 max-w-xl text-[clamp(2.5rem,5.5vw,5.2rem)] leading-[.96] font-[650]">
              A instalação faz tanta diferença quanto o próprio piso.
            </h2>
            <p className="mt-6 max-w-lg text-[.98rem] leading-7 text-white/58">
              Um bom material precisa de preparo, alinhamento e acabamento correto para entregar beleza, durabilidade e valorização real do ambiente.
            </p>
            <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-white/80">
              <ShieldCheck size={21} className="text-[#d77e4e]" />
              Preparo, encaixe e acabamento
            </div>
          </motion.div>
          <div className="assembly-scene" aria-hidden="true">
            <div className="assembly-glow" />
            <div className="assembly-grid">
              {plans.map(([row, col], index) => (
                <AssemblyPlank key={index} progress={smoothProgress} index={index} row={row} col={col} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BudgetCalculator() {
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

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <section id="calculadora" className="calculator-shell py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1180px] items-start gap-12 px-5 sm:px-7 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
        <Reveal>
          <span className="eyebrow text-[#e6a27d]!">Estimativa instantânea</span>
          <h2 className="display-title mt-6 text-[clamp(2.5rem,5vw,4.8rem)] leading-[.96] font-[650]">
            Tenha uma primeira noção do investimento.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-white/58">
            Preencha os dados essenciais e receba uma estimativa inicial em menos de 30 segundos.
          </p>
          <div className="mt-9 grid gap-4 text-sm text-white/76">
            <div className="flex items-center gap-3"><Ruler size={19} className="text-[#e6a27d]" /> Cálculo simples por metragem</div>
            <div className="flex items-center gap-3"><MessageCircle size={19} className="text-[#e6a27d]" /> Envio direto para o WhatsApp</div>
            <div className="flex items-center gap-3"><ShieldCheck size={19} className="text-[#e6a27d]" /> Sem compromisso e sem cadastro</div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <form className="calculator-card" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-label">
                Nome do cliente
                <input
                  className="form-control"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Como podemos te chamar?"
                  autoComplete="name"
                />
              </label>
              <label className="form-label">
                Bairro / Cidade
                <div className="relative">
                  <MapPin size={17} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-white/35" />
                  <input
                    className="form-control pl-10!"
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Ex.: Mooca, São Paulo"
                    autoComplete="address-level2"
                  />
                </div>
              </label>
              <label className="form-label">
                Metragem em m²
                <input
                  className="form-control"
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
              <label className="form-label">
                Tipo de piso
                <select className="form-control" value={floorType} onChange={(event) => setFloorType(event.target.value)}>
                  <option>Vinílico</option>
                  <option>Laminado</option>
                  <option>Outro</option>
                </select>
              </label>
            </div>

            <fieldset className="mt-5">
              <legend className="text-[.78rem] font-semibold text-white/72">Modalidade</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {["Com instalação", "Sem instalação"].map((option) => (
                  <label
                    key={option}
                    className={`flex min-h-14 cursor-pointer items-center justify-between rounded-xl border px-4 text-sm font-semibold transition-colors ${
                      modality === option
                        ? "border-[#d58456] bg-[#b85d2f]/20 text-white"
                        : "border-white/12 bg-white/5 text-white/62 hover:border-white/24"
                    }`}
                  >
                    <span>{option}</span>
                    <input
                      className="sr-only"
                      type="radio"
                      name="modality"
                      value={option}
                      checked={modality === option}
                      onChange={(event) => setModality(event.target.value)}
                    />
                    <span className={`grid h-5 w-5 place-items-center rounded-full border ${modality === option ? "border-[#e5a37d] bg-[#b85d2f]" : "border-white/25"}`}>
                      {modality === option && <Check size={13} />}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {error && <p id="area-error" role="alert" className="mt-3 text-sm font-medium text-[#ffb18a]">{error}</p>}

            <div className="estimate-panel mt-5">
              <p className="text-[.68rem] font-bold tracking-[.16em] text-white/45 uppercase">Estimativa inicial</p>
              <p className="estimate-value mt-1" aria-live="polite">{formattedEstimate}</p>
              <p className="mt-2 max-w-xl text-[.72rem] leading-5 text-white/43">
                Valor aproximado. O orçamento final pode variar conforme contrapiso, recortes, rodapés, deslocamento, escolha do material e condições do ambiente.
              </p>
            </div>

            <button type="submit" className="btn-primary mt-5 w-full border-0">
              <MessageCircle size={19} aria-hidden="true" />
              Enviar estimativa no WhatsApp
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

const processSteps = [
  { title: "Você informa a metragem", text: "Use a calculadora e conte onde será feita a instalação." },
  { title: "A gente entende o ambiente", text: "Avaliamos uso do espaço, condições e tipo de acabamento desejado." },
  { title: "Você recebe uma estimativa", text: "Tenha uma referência clara antes de avançar para a etapa técnica." },
  { title: "Fechamos e agendamos", text: "Nossa equipe confirma o orçamento e combina a instalação com você." },
];

function Process() {
  return (
    <section id="processo" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
        <Reveal>
          <span className="eyebrow">Simples do começo ao fim</span>
          <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <h2 className="display-title max-w-3xl text-[clamp(2.45rem,5vw,4.9rem)] leading-[.98] font-[650]">
              Da metragem ao piso instalado.
            </h2>
            <a className="group flex items-center gap-2 pb-2 text-sm font-bold text-[#a64e28]" href="#calculadora">
              Começar agora <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {processSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.07}>
              <article className="process-card group">
                <span className="process-number">PASSO 0{index + 1}</span>
                <h3 className="mt-8 text-xl leading-6 font-[690]">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#68665f]">{step.text}</p>
                <span className="absolute top-0 right-0 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-[#f5f2eb] text-[#b85d2f] transition-transform group-hover:rotate-45">
                  <ArrowRight size={14} />
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const items = ["Acabamento limpo", "Atendimento direto", "Estimativa rápida", "Instalação bem executada", "Visual moderno"];
  return (
    <section className="bg-[#232320] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
        <Reveal className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <span className="eyebrow text-[#e6a27d]!">Confiança em cada etapa</span>
            <h2 className="display-title mt-5 max-w-xl text-[clamp(2.2rem,4.5vw,4.2rem)] leading-[.98] font-[640]">
              Um atendimento. Menos risco na sua obra.
            </h2>
          </div>
          <div>
            <p className="max-w-xl text-base leading-7 text-white/60">
              A Sobel Flooring une fornecimento de piso e instalação para facilitar sua decisão e reduzir risco na obra.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-4">
              {items.map((item) => (
                <span key={item} className="trust-pill"><CheckCircle2 size={16} className="text-[#d77e4e]" />{item}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "O valor da calculadora é final?",
    a: "Não. É uma estimativa inicial. O valor final depende do ambiente, contrapiso, recortes, rodapé, material escolhido e deslocamento.",
  },
  {
    q: "Vocês vendem só o piso sem instalar?",
    a: "Sim. Você pode solicitar apenas o piso ou piso com instalação.",
  },
  {
    q: "Qual o principal tipo de piso trabalhado?",
    a: "O foco principal é piso vinílico, mas também podemos avaliar outros tipos de piso conforme o projeto.",
  },
  {
    q: "Como faço para receber o orçamento?",
    a: "Você pode usar a calculadora ou chamar diretamente no WhatsApp.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-7 lg:grid-cols-[.55fr_1fr] lg:gap-20">
        <Reveal>
          <span className="eyebrow">Antes de começar</span>
          <h2 className="display-title mt-5 text-[clamp(2.4rem,4.5vw,4.4rem)] leading-[.98] font-[650]">
            Dúvidas frequentes.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#68665f]">
            Não encontrou sua resposta? Fale diretamente com a equipe pelo WhatsApp.
          </p>
          <a className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#a64e28]" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            Tirar outra dúvida <ArrowRight size={16} />
          </a>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="border-t border-black/10">
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.q}>
                <summary>{faq.q}</summary>
                <p className="faq-answer">{faq.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="final-cta mx-auto max-w-[1370px] rounded-[1.6rem] px-5 py-16 sm:rounded-[2rem] sm:px-10 sm:py-20 lg:px-20">
        <Reveal className="relative z-10 max-w-4xl">
          <span className="text-[.7rem] font-bold tracking-[.17em] text-white/62 uppercase">Seu próximo ambiente começa aqui</span>
          <h2 className="display-title mt-5 text-[clamp(2.8rem,6vw,6rem)] leading-[.91] font-[660]">
            Quer saber quanto ficaria seu piso?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            Calcule uma estimativa em menos de 30 segundos ou fale direto com a Sobel Flooring pelo WhatsApp.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="btn-light" href="#calculadora"><Calculator size={18} />Calcular estimativa</a>
            <a className="inline-flex min-h-[3.35rem] items-center justify-center gap-2 rounded-full border border-white/28 px-6 text-sm font-bold text-white transition-colors hover:bg-white/10" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Falar no WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#181816] px-5 py-12 text-white sm:px-7">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col justify-between gap-9 border-b border-white/10 pb-9 sm:flex-row sm:items-end">
          <div>
            <Brand light />
            <p className="mt-5 text-sm text-white/48">Venda e instalação de pisos</p>
          </div>
          <a className="flex items-center gap-3 text-lg font-semibold hover:text-[#e6a27d]" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <Phone size={19} className="text-[#d77e4e]" /> (11) 98935-7411
          </a>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-7 text-[.7rem] leading-5 text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} Sobel Flooring. Todos os direitos reservados.</p>
          <p className="max-w-xl sm:text-right">Estimativas apresentadas no site são aproximadas e não substituem orçamento técnico final.</p>
        </div>
      </div>
    </footer>
  );
}

export function SobelLanding() {
  return (
    <main>
      <div className="noise-layer" aria-hidden="true" />
      <Header />
      <Hero />
      <Transformation />
      <Authority />
      <FloorAssembly />
      <BudgetCalculator />
      <Process />
      <Trust />
      <FAQ />
      <FinalCTA />
      <Footer />
      <a
        className="floating-whatsapp"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a Sobel Flooring no WhatsApp"
      >
        <MessageCircle size={20} aria-hidden="true" />
        <span>Falar no WhatsApp</span>
      </a>
    </main>
  );
}
