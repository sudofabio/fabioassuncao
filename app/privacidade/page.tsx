import type { Metadata } from 'next';
import Link from 'next/link';

import PageWrapper from '@/components/Template/PageWrapper';
import profile from '@/data/profile.json';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Política de privacidade',
  description: `Quais dados o site de ${profile.name} coleta, para quê, com quem compartilha e como exercer os seus direitos pela LGPD.`,
  path: '/privacidade/',
});

/**
 * Describes only what the site actually does: the contact chat, the e-mail
 * delivery, Turnstile, hosting, and the opt-in measurement tags.
 * TODO(fabio): revisão jurídica antes de ligar os pixels de anúncio, e definir
 * o prazo de guarda dos contatos recebidos.
 */
export default function PrivacyPage() {
  return (
    <PageWrapper>
      <article className="work-page privacy-page">
        <header className="work-header">
          <p className="section-label">LGPD</p>
          <h1 className="page-title">Política de privacidade</h1>
          <p className="page-subtitle">
            O que este site coleta, para quê e como você controla isso.
          </p>
        </header>

        <section className="work-section">
          <h2 className="work-section-title">Quem é o responsável</h2>
          <p className="work-note">
            {profile.name}, responsável por este site. Para qualquer assunto de
            privacidade, escreva para{' '}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        </section>

        <section className="work-section">
          <h2 className="work-section-title">O que é coletado e para quê</h2>
          <ul className="work-pains">
            <li>
              <strong>Chat de contato</strong> (
              <Link href="/contato/">/contato</Link>): nome, WhatsApp, e-mail e
              empresa (opcionais), as respostas sobre o seu projeto e de onde
              você chegou (incluindo os parâmetros UTM do link). Servem só para
              eu entender o seu caso e te responder. O envio depende do seu
              consentimento, marcado no próprio chat.
            </li>
            <li>
              <strong>Verificação anti-spam</strong>: o Cloudflare Turnstile
              confirma que o envio veio de uma pessoa.
            </li>
            <li>
              <strong>Medição de audiência e de anúncios</strong>: só depois que
              você clica em &ldquo;Aceitar&rdquo; no aviso de cookies, e só as
              ferramentas que estiverem ativas (Google Analytics, Meta Pixel,
              LinkedIn Insight Tag ou TikTok Pixel). Se você recusar, nada disso
              é carregado.
            </li>
          </ul>
        </section>

        <section className="work-section">
          <h2 className="work-section-title">
            Com quem os dados são compartilhados
          </h2>
          <p className="work-note">
            Com os serviços que fazem o site funcionar: Cloudflare (hospedagem e
            verificação anti-spam) e Resend (entrega do e-mail com a sua
            mensagem). Se você aceitar a medição, também com Google, Meta,
            LinkedIn e TikTok, conforme a ferramenta ativa. Os dados não são
            vendidos.
          </p>
        </section>

        <section className="work-section">
          <h2 className="work-section-title">Seus direitos</h2>
          <p className="work-note">
            Pela LGPD, você pode pedir a confirmação de que eu trato seus dados,
            o acesso, a correção, a anonimização ou a eliminação, a
            portabilidade e a informação sobre com quem eles foram
            compartilhados, e pode revogar o consentimento a qualquer momento.
            Basta escrever para{' '}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>. Para mudar
            a sua escolha sobre a medição, limpe os dados deste site no
            navegador: o aviso aparece de novo.
          </p>
        </section>
      </article>
    </PageWrapper>
  );
}
