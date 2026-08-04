import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
  assert.match(html, /Transforme seu ambiente/);
  assert.match(html, /Calcular estimativa/);
  assert.match(html, /Sobel Flooring/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("keeps calculator, WhatsApp and motion safeguards in source", async () => {
  const [landing, css, packageJson] = await Promise.all([
    readFile(new URL("../app/components/SobelLanding.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(landing, /5511989357411/);
  assert.match(landing, /Com instalação" \? 100 : 70/);
  assert.match(landing, /parsedArea <= 0/);
  assert.match(landing, /Estimativa inicial:/);
  assert.match(landing, /encodeURIComponent\(message\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(packageJson, /"framer-motion"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
