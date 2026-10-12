'use client';

import Link from 'next/link';
import { Check, Copy, ExternalLink, Github, Heart, X } from 'lucide-react';
import { useState } from 'react';

const columns = [
  { title: 'Produto', links: [['Recursos', '/resources'], ['Agentes', '/agents'], ['Como funciona', '/como-funciona'], ['Arquitetura', '/arquitetura'], ['Auditoria', '/audit'], ['Observabilidade', '/observabilidade'], ['Knowledge Studio', '/knowledge'], ['Evolution Engine', '/evolution']] },
  { title: 'Comunidade', links: [['Open Source', '/open-source'], ['Comunidade', '/community'], ['Código de Conduta', '/codigo-de-conduta'], ['Governança', '/governanca'], ['Parceiros', '/parceiros'], ['Contribuir', '/contribute']] },
  { title: 'Desenvolvedores', links: [['Documentação', '/docs'], ['Desenvolvedores', '/desenvolvedores'], ['Integrações', '/integrations'], ['Engenharia verificável', '/engenharia-verificavel'], ['Roadmap', '/roadmap'], ['Changelog', '/changelog']] },
  { title: 'Segurança e Legal', links: [['Segurança', '/seguranca'], ['Privacidade', '/privacidade'], ['Termos de Uso', '/termos'], ['Licença', '/licenca'], ['Status', '/status'], ['Media Kit', '/media-kit'], ['Contato', '/contato'], ['Apoie o Projeto', '/contribute']] },
];

function FooterLink({ label, href }: { label: string; href: string }) {
  const external = href.startsWith('http') || href.startsWith('mailto:');
  return external ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{label}</a> : <Link href={href}>{label}</Link>;
}

const pixKey = '63.187.175/0001-70';

export function Footer() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyPixKey() {
    await navigator.clipboard.writeText(pixKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return <footer className="public-footer">
    <div className="footer-grid">
      <div className="footer-brand"><div className="footer-logo"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icone-RxzatGh5zLyRqc6WE6I32LuIblr1nd.png" alt="" style={{width: 24, height: 24}} /><strong>Note<span>Agents</span></strong></div><p>Engenharia de software assistida por IA.</p><p className="footer-description">Projeto open source desenvolvido para desenvolvedores e comunidades de tecnologia.</p><button className="footer-support-button" type="button" onClick={() => setSupportOpen(true)}><Heart size={15} /> Apoiar o projeto</button><div className="footer-socials"><a href="https://github.com/flow-social-network/clonar-repositorio-github" target="_blank" rel="noreferrer" aria-label="NoteAgents no GitHub"><Github size={17} /></a><a href="https://github.com/flow-social-network/clonar-repositorio-github/discussions" target="_blank" rel="noreferrer" aria-label="Discussões no GitHub"><ExternalLink size={16} /></a></div></div>
      {columns.map((column) => <nav className="footer-column" key={column.title} aria-label={column.title}><h3>{column.title}</h3>{column.links.map(([label, href]) => <FooterLink key={label} label={label} href={href} />)}</nav>)}
    </div>
    <div className="footer-bottom"><span>© 2026 DEEVO Soluções Financeiras LTDA — CNPJ: 63.187.175/0001-70. Todos os direitos reservados.</span><span className="footer-open-source"><Github size={14} /> Open Source Software</span><span>(51) 3786-6302 · contato@deevofinanceiras.com.br</span><div className="footer-legal"><Link href="/docs#privacidade">Privacidade</Link><Link href="/docs#termos">Termos</Link><Link href="/status">Status</Link><a href="mailto:contato@deevofinanceiras.com.br">Ajuda</a></div></div>
    {supportOpen && <div className="support-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSupportOpen(false); }}><section className="support-modal" role="dialog" aria-modal="true" aria-labelledby="support-title"><button className="support-close" type="button" aria-label="Fechar apoio" onClick={() => setSupportOpen(false)}><X size={18} /></button><div className="support-icon"><Heart size={23} /></div><p className="support-eyebrow">Apoie o projeto</p><h2 id="support-title">Ajude a manter o NoteAgents</h2><p>Se você acredita na proposta, sua contribuição ajuda diretamente na infraestrutura, servidores, recursos de IA e evolução contínua do projeto.</p><div className="pix-recipient"><span>Recebedor</span><strong>DEEVO Soluções Financeiras LTDA</strong><small>CNPJ: 63.187.175/0001-70</small></div><div className="pix-key"><span>Chave Pix — CNPJ</span><strong>{pixKey}</strong></div><button className="pix-copy-button" type="button" onClick={copyPixKey}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? 'Chave copiada' : 'Copiar chave Pix'}</button><p className="support-thanks">Toda contribuição ajuda diretamente na manutenção e evolução do projeto. Obrigado por apoiar o desenvolvimento open source.</p></section></div>}
  </footer>;
}

export default Footer;
