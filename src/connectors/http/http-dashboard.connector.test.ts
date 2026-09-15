import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createInitialState,
  referenceDashboard,
} from '@/features/dashboard/data/reference-dashboard';
import { HttpClient, HttpError } from './http-client';
import { HttpDashboardConnector } from './http-dashboard.connector';

afterEach(() => vi.useRealTimers());

describe('HTTP connector contract', () => {
  it('loads and validates a response and sends same-origin session credentials', async () => {
    const snapshot = { data: referenceDashboard, state: createInitialState() };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json(snapshot));
    const connector = new HttpDashboardConnector(new HttpClient({ baseUrl: '/api/', fetcher }));
    expect(await connector.load()).toEqual(snapshot);
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe('/api/dashboard');
    expect(init?.method).toBe('GET');
    expect(init?.credentials).toBe('same-origin');
    expect(new Headers(init?.headers).get('Accept')).toBe('application/json');
  });

  it('rejects malformed API data instead of passing it to the UI', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ data: {}, state: {} }));
    const connector = new HttpDashboardConnector(new HttpClient({ baseUrl: '/api', fetcher }));
    await expect(connector.load()).rejects.toThrow();
  });

  it('writes validated state as JSON and accepts a 204 response', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }));
    const connector = new HttpDashboardConnector(new HttpClient({ baseUrl: '/api', fetcher }));
    const state = createInitialState();
    await expect(connector.persistState(state)).resolves.toBeUndefined();
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe('/api/dashboard/state');
    expect(init?.method).toBe('PUT');
    expect(init?.body).toBe(JSON.stringify(state));
    expect(new Headers(init?.headers).get('Content-Type')).toBe('application/json');
  });

  it('posts reset preferences and validates the resulting state', async () => {
    const state = createInitialState();
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json(state));
    const connector = new HttpDashboardConnector(new HttpClient({ baseUrl: '/api', fetcher }));
    expect(await connector.resetState(state.preferences)).toEqual(state);
    expect(fetcher.mock.calls[0][0]).toBe('/api/dashboard/state/reset');
    expect(fetcher.mock.calls[0][1]?.method).toBe('POST');
    expect(fetcher.mock.calls[0][1]?.body).toBe(JSON.stringify({ preferences: state.preferences }));
  });

  it('preserves the HTTP status for error handling', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 }));
    const client = new HttpClient({ baseUrl: '/api', fetcher });
    const pending = client.request('dashboard', {}, (value) => value);
    await expect(pending).rejects.toBeInstanceOf(HttpError);
    await expect(pending).rejects.toMatchObject({ status: 503 });
  });

  it('does not issue a request that was already cancelled', async () => {
    const fetcher = vi.fn<typeof fetch>();
    const controller = new AbortController();
    controller.abort();
    const client = new HttpClient({ baseUrl: '/api', fetcher });
    await expect(
      client.request('dashboard', { signal: controller.signal }, (value) => value),
    ).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each(['timeout', 'caller'] as const)('aborts a pending request on %s', async (cause) => {
    vi.useFakeTimers();
    const fetcher = vi.fn<typeof fetch>().mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), {
            once: true,
          });
        }),
    );
    const controller = new AbortController();
    const client = new HttpClient({ baseUrl: '/api', timeoutMs: 100, fetcher });
    const pending = client.request('dashboard', { signal: controller.signal }, (value) => value);
    const assertion = expect(pending).rejects.toMatchObject({
      name: cause === 'timeout' ? 'TimeoutError' : 'AbortError',
    });
    if (cause === 'timeout') await vi.advanceTimersByTimeAsync(100);
    else controller.abort();
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });
});
