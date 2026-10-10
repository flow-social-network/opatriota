# Deploy, testes e erro 404

## Comandos do package.json
- `npm run dev` → `vite --port=3000 --host=0.0.0.0`
- `npm run build` → `vite build`
- `npm run preview` → `vite preview`
- `npm run lint` → `tsc --noEmit`
- `npm run clean` → `rm -rf dist server.js` (remove artefatos locais; revisar antes de executar)

Nenhum comando foi executado nesta auditoria.

## 404 reportado
URL: `https://opatriota-one.vercel.app/`
Erro informado: `404 NOT_FOUND`, `gru1::9p94d-1791585957264-de7e935fdae1`.

Causa não confirmada. Verificar no painel Vercel: projeto vinculado ao domínio, deployment Production, branch, root directory, framework preset, install/build command, output directory, rewrites/redirects, DNS e logs. Não declarar resolvido até existir deployment válido e teste HTTP.

## QA
O repositório contém `.github/workflows/validate.yml` e scripts:
- `scripts/test-meteorology-audit.ts`
- `scripts/test-sources-policy-audit.ts`
- `scripts/test-web-push-audit.ts`

A existência dos arquivos não comprova execução ou sucesso. Registrar comando, commit, exit code e log sanitizado ao executar. Testar pagamentos apenas em ambiente sandbox.

## Limites desta auditoria
Não houve deploy, migração, build, lint ou testes contra serviços reais.
