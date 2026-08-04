import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Sobel Flooring landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Sobel Flooring \| Venda e instalação de pisos<\/title>/i);
  assert.match(html, /Seu ambiente muda/);
  assert.match(html, /Calcular estimativa/);
  assert.match(html, /Sobel Flooring/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("keeps the WebGL story, calculator and motion safeguards in source", async () => {
  const [calculator, config, story, scene, css, packageJson, socialImage] = await Promise.all([
    readFile(new URL("../app/components/EstimateCalculator.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/site-config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ScrollFloorExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/FloorSceneCanvas.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    stat(new URL("../public/og.png", import.meta.url)),
  ]);

  assert.match(config, /5511989357411/);
  assert.match(calculator, /Com instalação" \? 100 : 70/);
  assert.match(calculator, /parsedArea <= 0/);
  assert.match(calculator, /Estimativa inicial:/);
  assert.match(calculator, /encodeURIComponent\(message\)/);
  assert.match(story, /ScrollFloorExperience/);
  assert.match(scene, /RoundedBox/);
  assert.match(scene, /progress\.get\(\)/);
  assert.match(scene, /camera\.position\.lerp/);
  assert.match(css, /\.floor-experience\s*\{[^}]*height:\s*320vh/s);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(packageJson, /"framer-motion"/);
  assert.match(packageJson, /"@react-three\/fiber"/);
  assert.ok(socialImage.size > 100_000);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
