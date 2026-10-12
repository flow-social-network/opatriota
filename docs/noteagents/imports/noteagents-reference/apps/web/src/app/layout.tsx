import type { Metadata } from 'next';
import './globals.css';
import './chat.css';

export const metadata: Metadata = { title: 'NoteAgents — AI Engineering Control Plane', description: 'Plataforma de engenharia de software com agentes, execução, evidências e observabilidade.', applicationName: 'NoteAgents', icons: { icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icone.ico-g2rBvhQ2aMlntf5bFJFPKVW5Mhqua4.x-icon', apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icone.png' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
