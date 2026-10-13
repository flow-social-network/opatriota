import { chromium } from 'playwright';

const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3000';
const routes = [
  ['/auth/login/admin', 'login administrativo'],
  ['/auth/login/redacao', 'login redação'],
  ['/auth/login', 'login leitor'],
  ['/auth/cadastro', 'cadastro leitor'],
  ['/auth/esqueci-a-senha', 'recuperação leitor'],
  ['/auth/esqueci-a-senha/admin', 'recuperação admin'],
  ['/admin', 'dashboard administrativo'],
  ['/redacao', 'dashboard editorial'],
  ['/leitor', 'dashboard leitor'],
  ['/planos', 'planos'],
  ['/checkout', 'checkout'],
] as const;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const consoleErrors: string[] = [];
const failedRequests: string[] = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`));

const results: Array<Record<string, string>> = [];
for (const [path, label] of routes) {
  const response = await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' });
  const url = new URL(page.url());
  const text = (await page.locator('body').innerText()).slice(0, 240).replace(/\s+/g, ' ');
  const status = response?.status() ?? 0;
  const result = { route: path, label, http: String(status), finalUrl: url.pathname + url.search, content: text };
  results.push(result);
  console.log(JSON.stringify(result));
}
console.log(JSON.stringify({ consoleErrors, failedRequests }, null, 2));
await browser.close();
if (consoleErrors.length || failedRequests.length) process.exitCode = 1;
