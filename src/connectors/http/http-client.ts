export class HttpError extends Error {
  readonly status: number;
  constructor(status: number) {
    super(`Request failed (${status})`);
    this.name = 'HttpError';
    this.status = status;
  }
}
type HttpClientOptions = { baseUrl: string; timeoutMs?: number; fetcher?: typeof fetch };

/** No embedded credentials. Authentication belongs to the same-origin server/session. */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetcher: typeof fetch;

  constructor({ baseUrl, timeoutMs = 10_000, fetcher = fetch }: HttpClientOptions) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeoutMs = timeoutMs;
    this.fetcher = fetcher;
  }

  async request<T>(path: string, options: RequestInit, decode: (body: unknown) => T): Promise<T> {
    const controller = new AbortController();
    const upstream = options.signal;
    const abort = () => controller.abort(upstream?.reason);
    upstream?.throwIfAborted();
    upstream?.addEventListener('abort', abort, { once: true });
    const timer = setTimeout(
      () => controller.abort(new DOMException('Request timed out', 'TimeoutError')),
      this.timeoutMs,
    );
    try {
      const headers = new Headers(options.headers);
      if (!headers.has('Accept')) headers.set('Accept', 'application/json');
      if (options.body && !headers.has('Content-Type'))
        headers.set('Content-Type', 'application/json');
      const response = await this.fetcher(`${this.baseUrl}/${path.replace(/^\//, '')}`, {
        ...options,
        signal: controller.signal,
        credentials: 'same-origin',
        headers,
      });
      if (!response.ok) throw new HttpError(response.status);
      return decode(response.status === 204 ? undefined : await response.json());
    } finally {
      clearTimeout(timer);
      upstream?.removeEventListener('abort', abort);
    }
  }
}
