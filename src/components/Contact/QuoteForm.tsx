'use client';

import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { whatsappLink } from '@/data/contact';
import profile from '@/data/profile.json';
import { QUOTE_TYPE_LABELS, QUOTE_TYPES } from '../../../functions/_lib/quote';

/** The Pages Function in `functions/api/orcamento.ts`. */
const ENDPOINT = '/api/orcamento';
const TURNSTILE_SCRIPT =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/**
 * Public Turnstile site key, baked in at build time. Without it the form
 * cannot pass the server's anti-spam check, so it is shown disabled with the
 * direct channels instead of failing on submit.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      language?: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Loads the Turnstile script once per page, shared by every caller. */
let turnstileLoader: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  turnstileLoader ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT;
    script.async = true;
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error('Turnstile indisponível'));
    script.onerror = () => {
      turnstileLoader = null;
      reject(new Error('Turnstile indisponível'));
    };
    document.head.appendChild(script);
  });

  return turnstileLoader;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string; fields?: Record<string, string> };

const WHATSAPP_QUOTE_TEXT =
  'Olá, Fábio! Tentei enviar um pedido de orçamento pelo site e gostaria de conversar.';

export default function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const enabled = SITE_KEY !== '';

  useEffect(() => {
    if (!enabled || !widgetRef.current) return;

    let cancelled = false;
    const container = widgetRef.current;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || widgetId.current) return;
        widgetId.current = turnstile.render(container, {
          sitekey: SITE_KEY,
          language: 'pt-br',
          callback: setToken,
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        });
      })
      .catch(() => {
        if (!cancelled) {
          setStatus({
            kind: 'error',
            message:
              'Não foi possível carregar a verificação anti-spam. Recarregue a página ou fale comigo pelo WhatsApp.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!formRef.current) return;

      if (!token) {
        setStatus({
          kind: 'error',
          message: 'Conclua a verificação anti-spam antes de enviar.',
        });
        return;
      }

      const fields = Object.fromEntries(new FormData(formRef.current));
      // The widget adds its own hidden input; the token travels explicitly.
      delete fields['cf-turnstile-response'];
      setStatus({ kind: 'sending' });

      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...fields, turnstileToken: token }),
        });
        const body = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
          errors?: Record<string, string>;
        };

        if (response.ok && body.ok) {
          formRef.current.reset();
          setStatus({ kind: 'sent' });
          return;
        }

        setStatus({
          kind: 'error',
          message:
            body.error ??
            (body.errors
              ? 'Revise os campos destacados e tente de novo.'
              : 'Não foi possível enviar agora.'),
          ...(body.errors ? { fields: body.errors } : {}),
        });
      } catch {
        setStatus({
          kind: 'error',
          message: 'Sem conexão com o servidor. Tente de novo em instantes.',
        });
      } finally {
        // A Turnstile token is single-use, whatever the outcome.
        setToken('');
        if (widgetId.current) window.turnstile?.reset(widgetId.current);
      }
    },
    [token],
  );

  if (status.kind === 'sent') {
    return (
      <div className="quote-result quote-result--ok" role="status">
        <p className="quote-result-title">Pedido enviado. Obrigado!</p>
        <p>
          Recebi as informações e respondo por e-mail com os próximos passos. Se
          for urgente, fale comigo também pelo{' '}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          .
        </p>
      </div>
    );
  }

  const fieldErrors = status.kind === 'error' ? (status.fields ?? {}) : {};
  const errorFor = (name: string) =>
    fieldErrors[name] ? (
      <span className="quote-field-error" id={`${name}-error`}>
        {fieldErrors[name]}
      </span>
    ) : null;
  const describedBy = (name: string, hint?: string) =>
    [hint, fieldErrors[name] ? `${name}-error` : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <form
      ref={formRef}
      className="quote-form"
      onSubmit={handleSubmit}
      aria-describedby={enabled ? undefined : 'quote-disabled'}
    >
      {enabled ? null : (
        <p className="quote-notice" id="quote-disabled">
          O envio pelo formulário ainda não está disponível. Enquanto isso,
          mande o seu pedido para{' '}
          <a href={`mailto:${profile.email}`}>{profile.email}</a> ou pelo{' '}
          <a
            href={whatsappLink(WHATSAPP_QUOTE_TEXT)}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          .
        </p>
      )}

      <fieldset className="quote-fieldset" disabled={!enabled}>
        <legend className="sr-only">Pedido de orçamento</legend>

        <div className="quote-field">
          <label htmlFor="quote-name">Nome</label>
          <input
            id="quote-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            aria-invalid={Boolean(fieldErrors.name) || undefined}
            aria-describedby={describedBy('name')}
          />
          {errorFor('name')}
        </div>

        <div className="quote-field">
          <label htmlFor="quote-email">E-mail</label>
          <input
            id="quote-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            aria-invalid={Boolean(fieldErrors.email) || undefined}
            aria-describedby={describedBy('email')}
          />
          {errorFor('email')}
        </div>

        <div className="quote-field">
          <label htmlFor="quote-whatsapp">
            WhatsApp <span className="quote-optional">(opcional)</span>
          </label>
          <input
            id="quote-whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            aria-invalid={Boolean(fieldErrors.whatsapp) || undefined}
            aria-describedby={describedBy('whatsapp')}
          />
          {errorFor('whatsapp')}
        </div>

        <div className="quote-field">
          <label htmlFor="quote-type">Tipo de trabalho</label>
          <select
            id="quote-type"
            name="type"
            required
            defaultValue=""
            aria-invalid={Boolean(fieldErrors.type) || undefined}
            aria-describedby={describedBy('type')}
          >
            <option value="" disabled>
              Selecione
            </option>
            {QUOTE_TYPES.map((type) => (
              <option key={type} value={type}>
                {QUOTE_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          {errorFor('type')}
        </div>

        <div className="quote-field quote-field--wide">
          <label htmlFor="quote-scope">Descrição do escopo</label>
          <textarea
            id="quote-scope"
            name="scope"
            required
            minLength={20}
            maxLength={5000}
            rows={6}
            aria-invalid={Boolean(fieldErrors.scope) || undefined}
            aria-describedby={describedBy('scope', 'quote-scope-hint')}
          />
          <span className="quote-hint" id="quote-scope-hint">
            Contexto, problema atual e o que você espera do trabalho.
          </span>
          {errorFor('scope')}
        </div>

        <div className="quote-field">
          <label htmlFor="quote-deadline">Prazo</label>
          <input
            id="quote-deadline"
            name="deadline"
            type="text"
            required
            maxLength={120}
            placeholder="Ex.: próximo mês"
            aria-invalid={Boolean(fieldErrors.deadline) || undefined}
            aria-describedby={describedBy('deadline')}
          />
          {errorFor('deadline')}
        </div>

        <div className="quote-field">
          <label htmlFor="quote-budget">
            Faixa de investimento{' '}
            <span className="quote-optional">(opcional)</span>
          </label>
          <input
            id="quote-budget"
            name="budget"
            type="text"
            maxLength={120}
            aria-invalid={Boolean(fieldErrors.budget) || undefined}
            aria-describedby={describedBy('budget')}
          />
          {errorFor('budget')}
        </div>

        {enabled ? (
          <div className="quote-field quote-field--wide">
            <div ref={widgetRef} className="quote-turnstile" />
          </div>
        ) : null}

        <div className="quote-actions">
          <button
            type="submit"
            className="button"
            disabled={status.kind === 'sending'}
          >
            {status.kind === 'sending' ? 'Enviando…' : 'Enviar pedido'}
          </button>
        </div>
      </fieldset>

      <div className="quote-status" role="status" aria-live="polite">
        {status.kind === 'error' ? (
          <div className="quote-result quote-result--error">
            <p className="quote-result-title">{status.message}</p>
            <p>
              Se preferir, mande o pedido pelo{' '}
              <a
                href={whatsappLink(WHATSAPP_QUOTE_TEXT)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
                <span className="sr-only"> (abre em nova aba)</span>
              </a>{' '}
              ou para <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>
          </div>
        ) : null}
      </div>

      <noscript>
        <p className="quote-notice">
          O formulário precisa de JavaScript. Mande o seu pedido para{' '}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
      </noscript>
    </form>
  );
}
