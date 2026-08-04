import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sobel Flooring | Venda e instalação de pisos",
  description:
    "Pisos vinílicos com venda, instalação profissional e orçamento rápido pelo WhatsApp.",
  keywords: [
    "piso vinílico",
    "instalação de pisos",
    "Sobel Flooring",
    "orçamento de piso",
  ],
  openGraph: {
    title: "Sobel Flooring | Seu ambiente começa pelo piso",
    description:
      "Venda e instalação de pisos com acabamento profissional e orçamento rápido.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
