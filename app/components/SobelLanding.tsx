"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AboutSection } from "./AboutSection";
import { EstimateCalculator } from "./EstimateCalculator";
import { FAQSection } from "./FAQSection";
import { FinalCTA } from "./FinalCTA";
import { HeatedFloorExperience } from "./HeatedFloorExperience";
import { Hero3D } from "./Hero3D";
import { ProcessSection } from "./ProcessSection";
import { ReviewsSection } from "./ReviewsSection";
import { ScrollFloorExperience } from "./ScrollFloorExperience";
import { WHATSAPP_URL } from "./site-config";
import { TrustSection } from "./TrustSection";

function Brand({ light = false }: { light?: boolean }) {
  if (!light) {
    return (
      <a href="#inicio" className="brand brand-official" aria-label="Sobel Flooring — início">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sobel-header-logo.webp" alt="Sobel Flooring" width={680} height={152} />
      </a>
    );
  }

  return (
    <a href="#inicio" className="brand brand-light" aria-label="Sobel Flooring — início">
      <span className="brand-symbol">S</span>
      <span><strong>SOBEL</strong><small>FLOORING</small></span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <Brand />
      <nav id="mobile-navigation" className={menuOpen ? "is-open" : undefined} aria-label="Navegação principal">
        <a href="#quem-somos" onClick={closeMenu}>Quem somos</a>
        <a href="#piso-aquecido" onClick={closeMenu}>Piso aquecido</a>
        <a href="#calculadora" onClick={closeMenu}>Estimativa</a>
        <a href="#avaliacoes" onClick={closeMenu}>Avaliações</a>
        <a className="mobile-nav-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>Fazer orçamento</a>
      </nav>
      <a className="header-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Orçamento</a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>
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
      <AboutSection />
      <HeatedFloorExperience />
      <EstimateCalculator />
      <ReviewsSection />
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
