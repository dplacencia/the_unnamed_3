import {
  mkdir,
  readFile,
  readdir,
  writeFile,
  copyFile,
  cp,
} from "node:fs/promises";
import path from "node:path";
import { cache, root, inventory } from "./runtime.ts";
import { profiles } from "./profiles.ts";
import {
  successfulCaseIds,
  type Candidate,
  type CaptureRun,
  type Reference,
} from "./core.ts";

const escape = (value: unknown) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );

export async function createReview(id: string, exitCode: number) {
  const directory = path.join(cache, "runs", id);
  const request = JSON.parse(
    await readFile(path.join(directory, "request.json"), "utf8"),
  );
  const names = await readdir(directory);
  let cases: Candidate[] = [];
  let environment: CaptureRun["environment"] | undefined;
  for (const name of names.filter(
    (item) =>
      item.endsWith(".json") && item !== "request.json" && item !== "run.json",
  )) {
    const candidate = JSON.parse(
      await readFile(path.join(directory, name), "utf8"),
    );
    if (candidate.id && candidate.file && candidate.environment) {
      cases.push(candidate);
      environment = candidate.environment;
    }
  }
  cases.sort((a, b) => a.id.localeCompare(b.id));
  const results = JSON.parse(
    await readFile(path.join(cache, "results.json"), "utf8"),
  );
  if (results.config.metadata.runId !== id)
    throw new Error("Playwright report belongs to a different run");
  const successful = successfulCaseIds(results.suites);
  cases = cases.filter((candidate) => successful.has(candidate.id));
  await cp(
    path.join(cache, "playwright-report"),
    path.join(directory, "playwright-report"),
    { recursive: true },
  );
  await copyFile(
    path.join(cache, "results.json"),
    path.join(directory, "results.json"),
  );
  const run = {
    id,
    mode: request.mode,
    sourceHash: request.sourceHash,
    environment,
    cases,
    exitCode,
    checks: results.stats,
    expectedCases:
      inventory.entries.reduce((sum, entry) => sum + entry.cases.length, 0) *
      profiles.length,
  };
  await writeFile(
    path.join(directory, "run.json"),
    JSON.stringify(run, null, 2) + "\n",
  );
  const references = JSON.parse(
    await readFile(path.join(root, "visual/references.json"), "utf8"),
  ) as { cases: Record<string, Reference> };
  const reviewed = cases.filter(
    (candidate) => references.cases[candidate.id],
  ).length;
  const coverage = JSON.parse(
    await readFile(path.join(cache, "coverage.json"), "utf8"),
  );
  await mkdir(path.join(directory, "review-references"), { recursive: true });
  const tiles = [];
  for (const candidate of cases) {
    const reference = references.cases[candidate.id];
    if (reference && candidate.profile)
      await copyFile(
        path.join(root, "visual/references", candidate.profile, candidate.file),
        path.join(directory, "review-references", candidate.file),
      );
    const entry = [...inventory.entries]
      .sort((a, b) => b.id.length - a.id.length)
      .find((item) => candidate.id.startsWith(item.id + "-"));
    tiles.push(
      `<article data-search="${escape(candidate.id.toLowerCase())}"><header><label><input type="checkbox" value="${escape(candidate.id)}"> ${escape(candidate.title ?? candidate.id)}</label><span class="status">${reference ? "Referencia disponible: ejecutar comparación" : "Candidata · pendiente de aprobación"}</span></header><p><code>${escape(candidate.id)}</code></p><details><summary>Condiciones de captura</summary><pre>${escape(JSON.stringify(candidate.conditions ?? { profile: candidate.profile }, null, 2))}</pre><p>El enlace abre la muestra base. Repite el tamaño, apariencia, idioma y estado indicados; para el idioma de una vista real usa su caso en Playwright UI. La vista real conserva la preferencia de tu navegador.</p></details><div class="images">${reference ? `<figure><figcaption>Referencia aprobada</figcaption><a href="/runs/${escape(id)}/review-references/${escape(candidate.file)}" target="_blank"><img loading="lazy" src="/runs/${escape(id)}/review-references/${escape(candidate.file)}" alt="Referencia aprobada"></a></figure>` : ""}<figure><figcaption>Captura candidata</figcaption><a href="/runs/${escape(id)}/${escape(candidate.file)}" target="_blank"><img loading="lazy" src="/runs/${escape(id)}/${escape(candidate.file)}" alt="Candidata ${escape(candidate.title)}"></a></figure></div><p><a href="${escape(candidate.preview)}" target="_blank">Abrir muestra base interactiva</a></p>${entry?.limitation ? `<p class="limitation">${escape(entry.limitation)}</p>` : ""}</article>`,
    );
  }
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Revisión visual · ${escape(id)}</title><style>
  :root{font:15px/1.5 system-ui,sans-serif;color:#20242b;background:#f5f6f7}body{margin:0}main{max-width:1500px;margin:auto;padding:24px}h1{margin:0;font-size:1.8rem}a{color:#244eaa}nav{display:flex;flex-wrap:wrap;gap:16px;margin:16px 0}.notice{padding:16px;border:1px solid #a87920;background:#fff8e7;border-radius:6px}.stats{display:flex;flex-wrap:wrap;gap:24px;padding:16px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:20px}article{background:white;border:1px solid #d5d7da;border-radius:8px;padding:16px}article header{display:grid;gap:8px}.status{font-size:12px;color:#76530a}code{overflow-wrap:anywhere;font-size:11px}.images{display:flex;gap:10px}figure{margin:0;min-width:0;flex:1}figcaption{font-size:12px;margin-bottom:6px}img{width:100%;height:250px;object-fit:contain;background:#eceef0;border:1px solid #ddd}input[type=search]{font:inherit;padding:8px;width:min(100%,500px)}button{font:inherit;padding:8px 12px;cursor:pointer}.tools{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0}.limitation{font-size:12px;color:#555}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#e9ebed;padding:12px}details{margin:16px 0}</style></head><body><main>
  <h1>Revisión visual</h1><p>Componentes reales y vistas actuales · ejecución <code>${escape(id)}</code></p><nav><a href="http://localhost:6006/" target="_blank">Catálogo Storybook</a><a href="http://localhost:3100/" target="_blank">Backoffice</a><a href="http://localhost:4323/__visual/" target="_blank">Catálogo Astro</a><a href="/runs/${escape(id)}/playwright-report/index.html" target="_blank">Informe Playwright</a></nav>
  <div class="notice"><strong>${request.mode === "capture" ? "Capturas candidatas: la revisión visual sigue pendiente." : "Comparación de referencias: consulta el resultado de cada caso en Playwright."}</strong><p>Que una captura o interacción pase no aprueba el diseño. La apariencia retenida de TailAdmin es una referencia técnica provisional.</p></div>
  <div class="stats"><span>Módulos inventariados: <strong>${coverage.sourceModules}</strong></span><span>Historias: <strong>${coverage.catalogueStories}</strong></span><span>Vistas: <strong>${coverage.viewEntries}</strong></span><span>Capturas: <strong>${cases.length}/${run.expectedCases}</strong></span><span>Con referencia: <strong>${reviewed}</strong></span><span>Comprobaciones correctas: <strong>${results.stats.expected}</strong></span><span>Fallidas: <strong>${results.stats.unexpected}</strong></span><span>Omitidas: <strong>${results.stats.skipped}</strong></span><span>Salida del proceso: <strong>${exitCode}</strong></span></div>
  <details><summary>Entorno y alcance de la evidencia</summary><pre>${escape(JSON.stringify({ environment, sourceHash: run.sourceHash, profiles, scope: inventory.coverageScope }, null, 2))}</pre><p>Las piezas compuestas se revisan en contexto. Los documentos vacíos de Astro siguen pendientes de diseño; el marco de vídeo usa contenido externo sustituido.</p></details>
  <div class="tools"><input type="search" id="search" aria-label="Filtrar casos" placeholder="Filtrar por componente, estado o tamaño"><button id="select-visible">Seleccionar visibles para revisión</button><button id="clear">Limpiar selección</button><button id="selection">Mostrar casos revisados seleccionados</button></div><pre id="selected" aria-live="polite">Selecciona únicamente las capturas que hayas revisado. Este panel no modifica las referencias.</pre>
  ${cases.length < run.expectedCases && request.mode === "capture" ? '<p class="notice">Ejecución parcial: consulta los casos fallidos o no ejecutados en el informe. No hay cobertura de captura completa.</p>' : ""}<section class="grid">${tiles.join("\n")}</section>
  <script>const cards=[...document.querySelectorAll('article[data-search]')];document.getElementById('search').addEventListener('input',event=>{const value=event.target.value.toLowerCase();cards.forEach(card=>card.hidden=!card.dataset.search.includes(value))});document.getElementById('select-visible').onclick=()=>cards.filter(card=>!card.hidden).forEach(card=>card.querySelector('input').checked=true);document.getElementById('clear').onclick=()=>cards.forEach(card=>card.querySelector('input').checked=false);document.getElementById('selection').onclick=()=>{const ids=[...document.querySelectorAll('article input:checked')].map(input=>input.value);document.getElementById('selected').textContent=JSON.stringify({run:${JSON.stringify(id)},reviewedCases:ids},null,2)};</script></main></body></html>`;
  await writeFile(path.join(directory, "review.html"), html);
  await writeFile(path.join(cache, "index.html"), html);
  console.log(
    `Review candidates: pnpm visual:review, then http://localhost:9324/ (${cases.length}/${run.expectedCases} captures; approval pending)`,
  );
}
