#!/usr/bin/env node
// Validación estructural del corpus de producto. No valida significado ni aprobación.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const matrixPath = 'docs/frontend/MATRIZ_COBERTURA_FUNCIONAL.md';
const mapPath = 'docs/frontend/MAPA_PANTALLAS_Y_RECORRIDOS.md';
const planPath = 'docs/frontend/PLAN_IMPLEMENTACION.md';
const decisionsPath = 'docs/frontend/DECISIONS.md';
const read = (base, path) => readFileSync(resolve(base, path), 'utf8');
const withoutCode = text => text.replace(/^```[^\n]*\n[\s\S]*?^```/gm, '');
const definitions = text => [...text.matchAll(/^\|\s*([A-Z]+-\d{2,3})\s*\|/gm)].map(m => m[1]);
const uiDefinitions = text => definitions(text.split('## Inventario de experiencias')[1]?.split('### Clasificación')[0] ?? '');
const journeys = text => [...text.matchAll(/^### (J\d+) —/gm)].map(m => m[1]);
const slug = text => text.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/\s/g, '-');
const anchors = text => {
  const counts = new Map();
  return new Set([...withoutCode(text).matchAll(/^#{1,6} (.+)$/gm)].map(m => {
    const id = slug(m[1]);
    const count = counts.get(id) ?? 0;
    counts.set(id, count + 1);
    return count ? `${id}-${count}` : id;
  }).concat([...text.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1])));
};
const links = text => [...withoutCode(text).matchAll(/!?\[[^\]\n]*\]\((<[^>]+>|[^\s]+?)(?:\s+"[^"]*")?\)/g)].map(m => m[1].replace(/^<|>$/g, ''));
function linkError(path, target, exists = existsSync, content = path => readFileSync(path, 'utf8')) {
  if (/^[a-z][a-z\d+.-]*:/i.test(target)) return;
  const [file, hash] = target.split('#');
  const destination = file ? resolve(root, dirname(path), decodeURIComponent(file)) : resolve(root, path);
  if (!exists(destination)) return `${path}: enlace inexistente ${target}`;
  if (hash && destination.endsWith('.md') && !anchors(content(destination)).has(decodeURIComponent(hash))) return `${path}: anchor inexistente ${target}`;
}
const stageRows = text => [...text.matchAll(/^\|\s*(\d+) — [^|]+\|\s*([^|]+?)\s*\|$/gm)].map(m => [Number(m[1]), m[2].trim()]);
function markdownFiles(base, dir = 'docs') {
  return readdirSync(resolve(base, dir), { withFileTypes: true }).flatMap(entry => {
    const path = `${dir}/${entry.name}`;
    return entry.isDirectory() ? markdownFiles(base, path) : entry.name.endsWith('.md') ? [path] : [];
  });
}
function unique(values, label, errors) {
  const seen = new Set();
  for (const id of values) {
    if (seen.has(id)) errors.push(`${label}: ID duplicado ${id}`);
    seen.add(id);
  }
  return seen;
}
function missingReferences(text, known) {
  return [...withoutCode(text).matchAll(/\b(?:[A-Z]{2,6}-\d{2,3}|J\d+|T02-\d{2})\b/g)]
    .map(m => m[0]).filter(id => !known.has(id));
}

if (process.argv.includes('--self-test')) {
  assert.deepEqual(links('[A](a.md#uno)\n[X](<with space.md>)\n```\n[x](fake.md)\n```'), ['a.md#uno', 'with space.md']);
  assert.deepEqual([...anchors('# Título\n## Uno\n## Uno')], ['título', 'uno', 'uno-1']);
  const errors = [];
  unique(['WRK-001', 'WRK-001'], 'fixture', errors);
  assert.equal(errors.length, 1);
  assert.deepEqual(missingReferences('WRK-001 WRK-999', new Set(['WRK-001'])), ['WRK-999']);
  assert.deepEqual(stageRows('| 2 — Inicio | Pendiente |\n| 3 — Operaciones |    Under review  |'), [[2, 'Pendiente'], [3, 'Under review']]);
  assert.deepEqual(uiDefinitions('## Inventario de experiencias\n| WORK-01 | x |\n| OPS-03    | x |\n### Clasificación\n| INT-006 | fuera de alcance |'), ['WORK-01', 'OPS-03']);
  const fixture = new Map([[resolve(root, 'docs/a.md'), '# Título\n## Destino']]);
  const exists = path => fixture.has(path);
  const content = path => fixture.get(path);
  assert.equal(linkError('docs/b.md', 'a.md#destino', exists, content), undefined);
  assert.match(linkError('docs/b.md', 'retirado.md', exists, content), /enlace inexistente/);
  assert.match(linkError('docs/b.md', 'a.md#retirado', exists, content), /anchor inexistente/);
  assert.equal(linkError('docs/a.md', '#t%C3%ADtulo', exists, content), undefined);
  console.log('Self-test: enlaces, anchors, duplicados, referencias y estados OK.');
  process.exit(0);
}

const files = ['AGENTS.md', 'README.md', ...markdownFiles(root)];
const corpus = new Map(files.map(path => [path, read(root, path)]));
const errors = [];
const requirements = unique(definitions(corpus.get(matrixPath)), matrixPath, errors);
const experiences = unique(uiDefinitions(corpus.get(mapPath)), mapPath, errors);
const processes = unique(journeys(corpus.get(mapPath)), mapPath, errors);
const scenarios = unique([...corpus.get('docs/frontend/screens/02-inicio-mi-trabajo.md').matchAll(/^\|\s*(T02-\d{2})\s*\|/gm)].map(m => m[1]), 'Etapa 2', errors);
const known = new Set([...requirements, ...experiences, ...processes, ...scenarios]);
const externalIds = new Set(['DIR-001','DIR-002','DIR-003','DIR-004','DIR-005','DIR-006','DIR-007','DIR-008','DIR-009','DIR-010','COM-001','COM-002','FIN-010','FIN-011','FIN-012','OPS-010','OPS-011','OPS-012']);
const sourceIds = new Set([...corpus.get(matrixPath).matchAll(/^\|\s*([EL]\d+)\s*\|/gm)].map(m => m[1]));

for (const [path, text] of corpus) {
  for (const target of links(text)) {
    const error = linkError(path, target);
    if (error) errors.push(error);
  }
  // Referencias documentales en código inline: basename, relativo o raíz.
  for (const [, ref] of text.matchAll(/`([^`\n]+\.md)`/g)) {
    if (/[<>*]/.test(ref) || ref === 'NN-area-vista.md') continue; // plantilla explícita
    const candidates = [resolve(root, ref), resolve(root, dirname(path), ref)];
    if (!candidates.some(existsSync) && !files.some(p => p.endsWith(`/${ref}`))) errors.push(`${path}: ruta documental inexistente ${ref}`);
  }
  const clean = withoutCode(text);
  for (const [, id] of clean.matchAll(/\bE1:([A-Z]+-\d{3})\b/g)) {
    if (!externalIds.has(id)) errors.push(`${path}: ID externo E1:${id} no registrado`);
  }
  // Quitar namespaces externos antes de validar IDs locales homónimos.
  for (const id of missingReferences(clean.replace(/E1:[A-Z]+-\d{3}/g, ''), known)) errors.push(`${path}: referencia local inexistente ${id}`);
  for (const [, id] of clean.matchAll(/\b([EL]\d+)\b/g)) {
    if (!sourceIds.has(id)) errors.push(`${path}: fuente inexistente ${id}`);
  }
}

const stages = stageRows(corpus.get(planPath));
const classification = corpus.get(mapPath).split(/### Clasificación[^\n]*\n/)[1]?.split('## Relaciones entre objetos')[0] ?? '';
const classified = classification.split('\n').filter(line => line.startsWith('- **')).flatMap(line => [...line.split(';')[0].matchAll(/`([A-Z]+-\d{2})`/g)].map(m => m[1]));
unique(classified, 'Clasificación UI', errors);
for (const id of experiences) if (!classified.includes(id)) errors.push(`Experiencia sin clasificación: ${id}`);
for (const id of classified) if (!experiences.has(id)) errors.push(`Clasificación sin experiencia: ${id}`);
const validStates = new Set(['Pendiente', 'In implementation', 'Under review', 'Complete', 'Complete with environment limitation']);
assert.equal(new Set(stages.map(([id]) => id)).size, stages.length, 'Etapas duplicadas');
for (const [id, state] of stages) if (!validStates.has(state)) errors.push(`Etapa ${id}: estado desconocido ${state}`);
if (stages.length !== 14 || stages.some(([id], index) => id !== index)) errors.push('Plan: secuencia 0–13 incompleta o reordenada');
for (const id of [0, 1]) if (!stages.find(([i]) => i === id)?.[1].startsWith('Complete')) errors.push(`Etapa ${id}: cierre histórico perdido`);
for (const path of files.filter(p => /screens\/\d+.*\.md$/.test(p))) {
  const text = corpus.get(path);
  const state = text.match(/^> Estado: (.+)$/m)?.[1];
  if (!['Draft','Ready','In implementation','Under review','Approved','Superseded'].includes(state)) errors.push(`${path}: estado de especificación desconocido`);
  const stage = Number(text.match(/^> Etapa: (\d+)/m)?.[1]);
  const stageState = stages.find(([id]) => id === stage)?.[1];
  if (!stageState) errors.push(`${path}: etapa inexistente`);
  if (state === 'Approved' && !stageState?.startsWith('Complete')) errors.push(`${path}: Approved sin etapa completa`);
  if (state === 'In implementation' && stageState !== state) errors.push(`${path}: estado incompatible con el plan`);
}

const baselineIndex = process.argv.indexOf('--baseline');
if (baselineIndex >= 0) {
  const baseline = resolve(process.argv[baselineIndex + 1] ?? '');
  for (const [path, getter] of [[matrixPath, definitions], [mapPath, uiDefinitions], [mapPath, journeys]]) {
    const before = getter(read(baseline, path));
    const after = getter(corpus.get(path));
    for (const id of before) if (!after.includes(id)) errors.push(`Baseline: ID perdido ${id}`);
    for (const id of after) if (!before.includes(id)) errors.push(`Baseline: ID agregado ${id}; revisar alcance`);
  }
  if (!corpus.get(decisionsPath).startsWith(read(baseline, decisionsPath).trimEnd())) errors.push('Baseline: historia de decisiones modificada');
  for (const path of markdownFiles(baseline)) if (!existsSync(resolve(root, path))) errors.push(`Baseline: documento retirado ${path}`);
}

const alpha = [...requirements].filter(id => id.startsWith('ALP-')).length;
console.log(`${files.length} documentos; ${[...corpus.values()].reduce((sum, text) => sum + (text.match(/\n/g)?.length ?? 0), 0)} líneas (conteo equivalente a wc -l).`);
console.log(`${requirements.size - alpha} necesidades + ${alpha} Alpha2000 = ${requirements.size} IDs; ${experiences.size} experiencias; ${processes.size} recorridos; ${scenarios.size} escenarios Etapa 2.`);
if (process.argv.includes('--inventory')) {
  for (const [path, text] of corpus) {
    const outgoing = [...new Set(links(text).filter(l => !/^[a-z]+:/i.test(l)).map(l => l.split('#')[0] ? relative(root, resolve(root, dirname(path), l.split('#')[0])) : path))];
    const incoming = [...corpus].filter(([other, content]) => other !== path && links(content).some(l => !/^[a-z]+:/i.test(l) && resolve(root, dirname(other), l.split('#')[0]) === resolve(root, path))).map(([other]) => other);
    console.log(`${path}\n  entrantes: ${incoming.join(', ') || '—'}\n  salientes: ${outgoing.join(', ') || '—'}`);
  }
}
if (errors.length) {
  for (const error of [...new Set(errors)]) console.error(error);
  process.exitCode = 1;
} else console.log('Estructura documental OK. Semántica, fuentes externas y aprobaciones requieren revisión humana.');
