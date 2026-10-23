/**
 * Delivery helpers shared by the Pages Functions: Turnstile verification,
 * HTML escaping for e-mail bodies, and sending through Resend.
 *
 * Pure on purpose: no Workers globals, and every network call takes an
 * injectable `fetch`, so each flow runs under Vitest without a runtime.
 * The leading underscore keeps Pages from routing this directory.
 */

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Server-side Turnstile check. Any network or parse failure counts as a fail. */
export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
  fetchImpl: FetchLike = fetch,
): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const response = await fetchImpl(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!response.ok) return false;

    const result = (await response.json()) as { success?: unknown };
    return result.success === true;
  } catch {
    return false;
  }
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export const RESEND_API_URL = 'https://api.resend.com/emails';

export interface ResendMessage {
  apiKey: string;
  from: string;
  to: string;
  /** Omitted when the visitor gave no address to answer. */
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

/** Sends through Resend's REST API. Returns false on any non-2xx or error. */
export async function sendWithResend(
  { apiKey, from, to, replyTo, subject, text, html }: ResendMessage,
  fetchImpl: FetchLike = fetch,
): Promise<boolean> {
  try {
    const response = await fetchImpl(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        text,
        html,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
