import Link from "next/link";
type Props = { params: Promise<{ slug: string }> };
export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  return <main className="site-shell" style={{paddingTop:"2rem"}}>
    <h1 className="page-title">Perfil de autor</h1>
    <p>O perfil público de imprensa deste autor, quando confirmado, está disponível no registo do jornal.</p>
    <Link href={"/imprensa/" + encodeURIComponent(slug)}>Consultar perfil de imprensa →</Link>
  </main>;
}
