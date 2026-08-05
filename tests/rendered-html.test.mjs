import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Sobel Flooring landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Sobel Flooring \| Venda e instalação de pisos<\/title>/i);
  assert.match(html, /Seu ambiente muda/);
  assert.match(html, /Quem somos/);
  assert.match(html, /Piso aquecido/);
  assert.match(html, /Calcular estimativa/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("keeps the 3D stories, official estimator rules and motion safeguards in source", async () => {
  const [calculator, config, story, scene, heatedExperience, heatedScene, about, reviews, landing, mobilePerformance, css, packageJson, socialImage, logo, headerLogo, texture] = await Promise.all([
    readFile(new URL("../app/components/EstimateCalculator.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/site-config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ScrollFloorExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/FloorSceneCanvas.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/HeatedFloorExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/HeatedFloorCanvas.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AboutSection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ReviewsSection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SobelLanding.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/useMobilePerformanceMode.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    stat(new URL("../public/og-heated.png", import.meta.url)),
    stat(new URL("../public/sobel-flooring-logo.webp", import.meta.url)),
    stat(new URL("../public/sobel-header-logo.webp", import.meta.url)),
    stat(new URL("../public/vinyl-grain.jpg", import.meta.url)),
  ]);

  assert.match(config, /5511989357411/);
  assert.match(calculator, /"Piso Colado 2 mm"[\s\S]*base: 150[\s\S]*min: 140[\s\S]*max: 170/);
  assert.match(calculator, /"Piso Colado 3 mm \(Comercial\)"[\s\S]*base: 160/);
  assert.match(calculator, /"Piso Clicado 5 mm"[\s\S]*base: 200[\s\S]*min: 190[\s\S]*max: 230/);
  assert.match(calculator, /!validArea/);
  assert.match(calculator, /Este orçamento é apenas uma estimativa inicial e não substitui um orçamento oficial\./);
  assert.match(calculator, /Solicitar orçamento oficial pelo WhatsApp/);
  assert.match(calculator, /encodeURIComponent\(whatsappMessage\)/);
  assert.match(calculator, /instagram\.com\/sobelflooring\//);
  assert.match(story, /ScrollFloorExperience/);
  assert.match(story, /JOURNEY_STAGES/);
  assert.match(story, /Paginação/);
  assert.match(story, /at === 0 \? \[0, 0\.14\]/);
  assert.match(story, /at === 1 \? \[0\.86, 1\]/);
  assert.match(scene, /RoundedBox/);
  assert.match(scene, /progress\.get\(\)/);
  assert.match(scene, /camera\.position\.lerp/);
  assert.match(scene, /samplePath/);
  assert.match(scene, /GridHelper/);
  assert.match(heatedExperience, /Aumentar temperatura/);
  assert.match(heatedExperience, /Diminuir temperatura/);
  assert.match(heatedScene, /TubeGeometry/);
  assert.match(heatedScene, /createSerpentineCurve/);
  assert.match(heatedScene, /vinyl-grain\.jpg/);
  assert.match(heatedScene, /emissiveIntensity/);
  assert.match(about, /todo o Brasil com venda e envio de produtos/i);
  assert.match(about, /7 dias úteis/);
  assert.match(reviews, /Consultar no Google/);
  assert.match(reviews, /Avaliar empresa/);
  assert.match(reviews, /google\.com\/search\?q=Sobel\+Flooring/);
  assert.match(reviews, /Sobel\+Flooring\+avalia%C3%A7%C3%B5es/);
  assert.match(landing, /sobel-header-logo\.webp/);
  assert.match(landing, /aria-controls="mobile-navigation"/);
  assert.match(landing, /aria-expanded=\{menuOpen\}/);
  assert.match(mobilePerformance, /max-width: 900px/);
  assert.match(scene, /frameloop=\{mobilePerformanceMode \? "demand" : "always"\}/);
  assert.match(heatedScene, /frameloop=\{mobilePerformanceMode \? "demand" : "always"\}/);
  assert.match(css, /\.floor-experience\s*\{[^}]*height:\s*320vh/s);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*\.floor-experience\s*\{\s*height:\s*235vh/);
  assert.match(css, /@media \(max-width: 380px\)/);
  assert.match(css, /\.menu-toggle/);
  assert.match(css, /\.heated-stage/);
  assert.match(css, /linear-gradient\(105deg, #405de6/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(packageJson, /"framer-motion"/);
  assert.match(packageJson, /"@react-three\/fiber"/);
  assert.ok(socialImage.size > 100_000);
  assert.ok(logo.size > 10_000);
  assert.ok(headerLogo.size > 5_000);
  assert.ok(texture.size > 10_000);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
