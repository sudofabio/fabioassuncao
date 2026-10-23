'use client';

import {
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import profile from '@/data/profile.json';
import { trackLead } from '@/lib/analytics';
import {
  type ChatDraft,
  type ChatStep,
  closingMessage,
  isUrgent,
  nextStep,
  questionFor,
  readUtm,
  whatsappTextFor,
} from '@/lib/chatFlow';
import { loadTurnstile, TURNSTILE_SITE_KEY } from '@/lib/turnstile';
import {
  LEAD_BUDGETS,
  LEAD_ORIGINS,
  LEAD_OWNERS,
  LEAD_REASONS,
  LEAD_ROLES,
  LEAD_SYSTEMS,
  type LeadClosing,
  type LeadSystem,
  type LeadTemperature,
  labelOf,
} from '../../../functions/_lib/lead';

import WhatsappLink from './WhatsappLink';

/** The `/api/lead` Pages Function. */
const ENDPOINT = '/api/lead';

type Option = { id: string; label: string };

const OPTIONS: Partial<Record<ChatStep, readonly Option[]>> = {
  reason: LEAD_REASONS,
  systems: LEAD_SYSTEMS,
  owner: LEAD_OWNERS,
  role: LEAD_ROLES,
  budget: LEAD_BUDGETS,
  origin: LEAD_ORIGINS,
};

interface Turn {
  step: ChatStep;
  question: string;
  answer: string;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | {
      kind: 'done';
      closing: LeadClosing;
    }
  | { kind: 'error'; message: string };

/**
 * The qualification chat: one question at a time, under two minutes, ending
 * with fit, urgency, budget, and origin (`05-perfis/chat-qualificacao.md`).
 * The score is recomputed by the server; the client only collects answers.
 */
export default function QualifierChat() {
  const formId = useId();
  const [step, setStep] = useState<ChatStep>('name');
  const [draft, setDraft] = useState<ChatDraft>({});
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState('');
  const [systems, setSystems] = useState<LeadSystem[]>([]);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const name = draft.name ?? '';
  const enabled = TURNSTILE_SITE_KEY !== '';

  // Keep the keyboard where the next answer goes, but only once the visitor
  // has started: focusing on load would open the phone keyboard over the page
  // inside an in-app browser.
  const started = turns.length > 0;
  useEffect(() => {
    if (started) inputRef.current?.focus();
  }, [step, started]);

  useEffect(() => {
    if (step !== 'contact' || !enabled || !widgetRef.current) return;
    let cancelled = false;
    const container = widgetRef.current;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || widgetId.current) return;
        widgetId.current = turnstile.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
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
              'Não foi possível carregar a verificação anti-spam. Me chama no WhatsApp ou por e-mail.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [step, enabled]);

  const advance = useCallback(
    (patch: ChatDraft, answer: string) => {
      const updated = { ...draft, ...patch };
      setTurns((previous) => [
        ...previous,
        { step, question: questionFor(step, updated.name), answer },
      ]);
      setDraft(updated);
      setText('');
      const next = nextStep(step, updated);
      if (next) setStep(next);
    },
    [draft, step],
  );

  const restart = useCallback(() => {
    setStep('name');
    setDraft({});
    setTurns([]);
    setText('');
    setSystems([]);
    setStatus({ kind: 'idle' });
  }, []);

  const submitText = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = text.trim();
    if (step === 'name') {
      if (value.length < 2) return;
      advance({ name: value }, value);
    } else if (step === 'video') {
      advance(value ? { videoMention: value } : {}, value || 'Não lembro');
    }
  };

  const choose = (option: Option) => {
    const patch: ChatDraft = { [step]: option.id } as ChatDraft;
    advance(patch, option.label);
  };

  const submitSystems = () => {
    if (systems.length === 0) return;
    advance(
      { systems },
      systems.map((id) => labelOf(LEAD_SYSTEMS, id)).join(', '),
    );
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!token) {
      setStatus({
        kind: 'error',
        message: 'Conclua a verificação anti-spam antes de enviar.',
      });
      return;
    }

    setStatus({ kind: 'sending' });
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          systems: draft.systems ?? [],
          whatsapp: String(form.get('whatsapp') ?? ''),
          email: String(form.get('email') ?? '') || undefined,
          company: String(form.get('company') ?? '') || undefined,
          consent: form.get('consent') === 'on',
          utm: readUtm(window.location.search),
          turnstileToken: token,
        }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string>;
        score?: number;
        temperature?: LeadTemperature;
        closing?: LeadClosing;
      };

      if (response.ok && body.ok && body.closing) {
        trackLead({
          score: body.score ?? 0,
          temperature: body.temperature ?? 'audiencia',
          budget: draft.budget ?? 'nao-sei',
        });
        setStatus({ kind: 'done', closing: body.closing });
        return;
      }

      setStatus({
        kind: 'error',
        message:
          body.error ??
          (body.errors
            ? Object.values(body.errors).join(' ')
            : 'Não foi possível enviar agora.'),
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
  };

  const options = OPTIONS[step];
  const whatsappText = whatsappTextFor(name, draft.reason);

  if (status.kind === 'done') {
    const closing = closingMessage(status.closing, name);
    return (
      <div className="chat chat--done" role="status">
        <p className="chat-closing-title">{closing.title}</p>
        <p>{closing.text}</p>
        <div className="chat-actions">
          <WhatsappLink
            className={`button${closing.whatsappFirst ? '' : ' button-secondary'}`}
            text={whatsappText}
          >
            Falar no WhatsApp
          </WhatsappLink>
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <ol className="chat-log" aria-live="polite">
        {turns.map((turn) => (
          <li key={turn.step} className="chat-turn">
            <p className="chat-bubble chat-bubble--fabio">{turn.question}</p>
            <p className="chat-bubble chat-bubble--you">{turn.answer}</p>
          </li>
        ))}
        <li className="chat-turn">
          <p className="chat-bubble chat-bubble--fabio" id={`${formId}-q`}>
            {questionFor(step, name)}
          </p>
        </li>
      </ol>

      {isUrgent(draft.reason) && step !== 'contact' ? (
        <p className="chat-urgent">
          Se for urgente, não espere o fim:{' '}
          <WhatsappLink text={whatsappText}>
            me chama agora no WhatsApp
          </WhatsappLink>
          .
        </p>
      ) : null}

      {step === 'name' || step === 'video' ? (
        <form className="chat-input" onSubmit={submitText}>
          <input
            ref={inputRef}
            id={`${formId}-text`}
            aria-labelledby={`${formId}-q`}
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            autoComplete={step === 'name' ? 'given-name' : 'off'}
            maxLength={step === 'name' ? 120 : 200}
            required={step === 'name'}
            minLength={step === 'name' ? 2 : undefined}
            placeholder={step === 'name' ? 'Seu nome' : 'Ex.: o vídeo sobre…'}
          />
          <button type="submit" className="button">
            {step === 'video' && !text.trim() ? 'Pular' : 'Continuar'}
          </button>
        </form>
      ) : null}

      {options && step !== 'systems' ? (
        <div
          className="chat-options"
          role="group"
          aria-labelledby={`${formId}-q`}
        >
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="chat-option"
              onClick={() => choose(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      {step === 'systems' ? (
        <fieldset
          className="chat-options chat-options--multi"
          aria-labelledby={`${formId}-q`}
        >
          {LEAD_SYSTEMS.map((option) => {
            const checked = systems.includes(option.id);
            return (
              <label
                key={option.id}
                className={`chat-option${checked ? ' chat-option--checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setSystems((current) =>
                      checked
                        ? current.filter((id) => id !== option.id)
                        : [...current, option.id],
                    )
                  }
                />
                {option.label}
              </label>
            );
          })}
          <button
            type="button"
            className="button"
            onClick={submitSystems}
            disabled={systems.length === 0}
          >
            Continuar
          </button>
        </fieldset>
      ) : null}

      {step === 'contact' ? (
        <form className="chat-contact" onSubmit={submitContact}>
          {enabled ? null : (
            <p className="quote-notice">
              O envio pelo chat ainda não está disponível. Me chama no{' '}
              <WhatsappLink text={whatsappText}>WhatsApp</WhatsappLink> ou
              escreve para{' '}
              <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>
          )}
          <fieldset className="quote-fieldset" disabled={!enabled}>
            <legend className="sr-only">Contato</legend>
            <div className="quote-field">
              <label htmlFor={`${formId}-whatsapp`}>WhatsApp</label>
              <input
                ref={inputRef}
                id={`${formId}-whatsapp`}
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                maxLength={40}
                placeholder="(98) 90000-0000"
              />
            </div>
            <div className="quote-field">
              <label htmlFor={`${formId}-email`}>
                E-mail <span className="quote-optional">(opcional)</span>
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
              />
            </div>
            <div className="quote-field">
              <label htmlFor={`${formId}-company`}>
                Empresa <span className="quote-optional">(opcional)</span>
              </label>
              <input
                id={`${formId}-company`}
                name="company"
                type="text"
                autoComplete="organization"
                maxLength={120}
              />
            </div>
            <div className="quote-field quote-field--wide chat-consent">
              <label>
                <input type="checkbox" name="consent" required />
                <span>
                  Concordo em ser contatado e com a{' '}
                  <a href="/privacidade/">política de privacidade</a>.
                </span>
              </label>
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
                {status.kind === 'sending' ? 'Enviando…' : 'Enviar'}
              </button>
            </div>
          </fieldset>
        </form>
      ) : null}

      {status.kind === 'error' ? (
        <div className="quote-result quote-result--error" role="alert">
          <p className="quote-result-title">{status.message}</p>
          <p>
            Se preferir, fale comigo pelo{' '}
            <WhatsappLink text={whatsappText}>WhatsApp</WhatsappLink> ou por{' '}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        </div>
      ) : null}

      {turns.length > 0 ? (
        <button type="button" className="chat-restart" onClick={restart}>
          Recomeçar
        </button>
      ) : null}
    </div>
  );
}
