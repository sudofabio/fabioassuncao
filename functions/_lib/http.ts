/**
 * Response and request helpers shared by the Pages Functions.
 *
 * Pure on purpose: only the Web platform's Request/Response, so every handler
 * runs under Vitest without a Workers runtime.
 */

/** JSON with `no-store`: every function answer is per-request. */
export function json(
  status: number,
  body: unknown,
  headers?: HeadersInit,
): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set('Content-Type', 'application/json; charset=utf-8');
  responseHeaders.set('Cache-Control', 'no-store');

  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders,
  });
}

export class PayloadTooLarge extends Error {}

/**
 * Reads the body with a running byte count and stops as soon as it passes
 * `maxBytes`, so a chunked body without Content-Length is never buffered past
 * the limit. Content-Length is checked first but not trusted.
 */
export async function readBounded(
  request: Request,
  maxBytes: number,
): Promise<Uint8Array<ArrayBuffer>> {
  const declared = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new PayloadTooLarge();
  }

  const body = new Uint8Array(maxBytes);
  if (!request.body) return body.subarray(0, 0);

  const reader = request.body.getReader();
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    if (received + value.byteLength > maxBytes) {
      await reader.cancel();
      throw new PayloadTooLarge();
    }
    body.set(value, received);
    received += value.byteLength;
  }

  return body.subarray(0, received);
}

/** The 405 every function answers for methods other than POST. */
export function methodNotAllowed(): Response {
  return json(
    405,
    { ok: false, error: 'Método não permitido.' },
    { Allow: 'POST' },
  );
}
