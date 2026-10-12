import { readFile } from 'node:fs/promises';

const header = await readFile(new URL('../src/components/Header.tsx', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

const checks: Array<[string, boolean]> = [
  ['Faixa utilitária desktop identificada', header.includes('data-header-band="utility"')],
  ['Faixa utilitária mobile identificada', header.includes('data-header-band="utility-mobile"')],
  ['Faixa financeira separada', header.includes('data-header-band="market"')],
  ['Faixa utilitária fixa', css.includes('.site-utility-bar') && css.includes('position: fixed')],
  ['Faixa principal não sticky', !header.slice(header.indexOf('TIER 3'), header.indexOf('MOBILE DRAWER')).match(/sticky|fixed/)],
  ['Offset da faixa fixa', header.includes('lg:mt-[58px]')],
];

for (const [name, passed] of checks) {
  if (!passed) throw new Error(`Falha no contrato do cabeçalho: ${name}`);
  console.log(`OK: ${name}`);
}
