"use client";

import { MessageCircle } from "lucide-react";
import { EstimateCalculator } from "./EstimateCalculator";
import { FAQSection } from "./FAQSection";
import { FinalCTA } from "./FinalCTA";
import { Hero3D } from "./Hero3D";
import { ProcessSection } from "./ProcessSection";
import { ScrollFloorExperience } from "./ScrollFloorExperience";
import { WHATSAPP_URL } from "./site-config";
import { TrustSection } from "./TrustSection";

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#inicio" className={`brand ${light ? "brand-light" : ""}`} aria-label="Sobel Flooring — início">
      <span className="brand-symbol">S</span>
      <span><strong>SOBEL</strong><small>FLOORING</small></span>
    </a>
  );
}

function Header() {
  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="Navegação principal">
        <a href="#experiencia-3d">Experiência 3D</a>
        <a href="#calculadora">Estimativa</a>
        <a href="#processo">Processo</a>
        <a href="#faq">Dúvidas</a>
      </nav>
      <a className="header-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Orçamento</a>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <Brand light />
      <div>
        <p>Venda e instalação de pisos</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">(11) 98935-7411</a>
      </div>
      <p>Estimativas apresentadas no site são aproximadas e não substituem orçamento técnico final.</p>
    </footer>
  );
}

export function SobelLanding() {
  return (
    <main>
      <Header />
      <Hero3D />
      <ScrollFloorExperience />
      <EstimateCalculator />
      <ProcessSection />
      <TrustSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
      <a className="whatsapp-float" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Falar com a Sobel Flooring no WhatsApp">
        <MessageCircle size={20} aria-hidden="true" /><span>WhatsApp</span>
      </a>
    </main>
  );
}
