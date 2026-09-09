import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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

test("server-renders the LINEA XI game shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="it"/i);
  assert.match(html, /<title>LINEA XI — Simulatore di carriera<\/title>/i);
  assert.match(html, /LINEA/);
  assert.match(html, /Ogni sei mesi/);
  assert.match(html, /Inizia la carriera/);
  assert.match(html, /36 club reali/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/i);
});

test("includes the accessible game controls and non-affiliation notice", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /aria-label="Language"/i);
  assert.match(html, /href="#game"/i);
  assert.match(
    html,
    /Simulazione non ufficiale\. Marchi e stemmi appartengono ai rispettivi titolari\. Nessuna affiliazione o sponsorizzazione reale\./i,
  );
  assert.match(html, /Nessun account\. Nessun salvataggio\./i);
});

test("ships 36 clubs and the exact hidden development odds", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.equal(source.match(/logo: "\/clubs\//g)?.length, 36);
  assert.match(source, /wonderkid:\s*\{\s*chance: 18,/);
  assert.match(source, /steady:\s*\{\s*chance: 50,/);
  assert.match(source, /late_bloomer:\s*\{\s*chance: 20,/);
  assert.match(source, /volatile:\s*\{\s*chance: 9,/);
  assert.match(source, /prodigy:\s*\{\s*chance: 3,/);
});
