import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournalist } from "@/lib/next/api";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  try {
    const profile = await getJournalist((await params).slug);
    return {
      title: profile.name + " — Perfil de imprensa",
      description: profile.professionalTitle
        ? profile.name + ", " + profile.professionalTitle + " no O Patriota Brasil."
        : "Perfil de imprensa confirmado pelo O Patriota Brasil.",
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: "Perfil de imprensa não encontrado", robots: { index: false, follow: false } };
  }
}

export default async function JournalistProfilePage({ params }: Props) {
  const { slug } = await params;
  let profile;
  try {
    profile = await getJournalist(slug);
  } catch (error) {
    if (error instanceof Error && error.message === "JOURNALIST_NOT_FOUND") notFound();
    return <main className="site-shell" style={{ paddingTop: "2rem" }}>
      <h1 className="page-title">Verificação temporariamente indisponível</h1>
      <p className="error-state">Não foi possível consultar o registo de imprensa. Tente novamente mais tarde.</p>
    </main>;
  }
  const verifiedDate = new Date(profile.verifiedAt).toLocaleDateString("pt-BR", { dateStyle: "long", timeZone: "UTC" });
  const expiryDate = profile.expiresAt
    ? new Date(profile.expiresAt).toLocaleDateString("pt-BR", { dateStyle: "long", timeZone: "UTC" })
    : null;

  return <main className="site-shell" style={{ maxWidth: 1000, paddingTop: "2rem", paddingBottom: "3rem" }}>
    <p className="source-credit">REGISTRO PÚBLICO DE IMPRENSA</p>
    <section className="journalist-profile">
      <div className="journalist-profile-heading">
        {profile.photoUrl
          ? <img className="journalist-avatar" src={profile.photoUrl} alt={"Fotografia de " + profile.name} />
          : <div className="journalist-avatar journalist-avatar-placeholder" aria-hidden="true">{profile.name.split(/\s+/).map(part => part[0]).slice(0,2).join("").toUpperCase()}</div>}
        <div>
          <p className="verified-label"><span aria-hidden="true">✓</span> VÍNCULO CONFIRMADO</p>
          <h1 className="page-title">{profile.name}</h1>
          {profile.professionalTitle ? <p>{profile.professionalTitle}</p> : null}
          <p><strong>{profile.outlet}</strong></p>
        </div>
      </div>
      <dl className="verification-details">
        <div><dt>Situação</dt><dd><span className="verified-status">Confirmado</span></dd></div>
        <div><dt>Código de verificação</dt><dd><code>{profile.credentialCode}</code></dd></div>
        <div><dt>Vínculo confirmado em</dt><dd>{verifiedDate}</dd></div>
        <div><dt>Validade</dt><dd>{expiryDate ?? "Sem data de expiração definida"}</dd></div>
      </dl>
      {profile.bio ? <section><h2>Sobre o profissional</h2><p className="profile-bio">{profile.bio}</p></section> : null}
      <p className="verification-scope">{profile.verificationScope}</p>
      {profile.publicContactUrl ? <p><a href={profile.publicContactUrl} target="_blank" rel="noopener noreferrer">Contacto profissional público</a></p> : null}
    </section>
    <section style={{ marginTop: "2.5rem" }} aria-labelledby="recent-work">
      <h2 id="recent-work">Matérias publicadas</h2>
      {profile.articles.length ? <ul className="profile-articles">{profile.articles.map(article => <li key={article.slug}>
        <Link href={"/artigo/" + encodeURIComponent(article.slug)}>{article.title}</Link>
        {article.publishedAt ? <time dateTime={article.publishedAt}> · {new Date(article.publishedAt).toLocaleDateString("pt-BR")}</time> : null}
      </li>)}</ul> : <p>Não há matérias publicadas disponíveis para este perfil.</p>}
    </section>
    <p style={{ marginTop: "2rem" }}><Link href="/verificar-imprensa">Consultar outro profissional</Link></p>
  </main>;
}
