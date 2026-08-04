import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "sobel-flooring.kaiquesohn.chatgpt.site";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  let origin = new URL("https://sobel-flooring.kaiquesohn.chatgpt.site");

  try {
    origin = new URL(`${protocol}://${host}`);
  } catch {
    // Keep the canonical production origin when forwarded headers are invalid.
  }

  const socialImage = new URL("/og.png", origin).toString();

  return {
    metadataBase: origin,
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
      title: "Sobel Flooring | Seu ambiente muda quando o piso encaixa",
      description:
        "Venda e instalação de pisos com acabamento profissional e orçamento rápido.",
      type: "website",
      locale: "pt_BR",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Sobel Flooring — piso vinílico em movimento" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sobel Flooring | Seu ambiente muda quando o piso encaixa",
      description: "Venda e instalação de pisos com acabamento profissional.",
      images: [socialImage],
    },
  };
}

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
