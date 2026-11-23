export const ApiErrorKind = Object.freeze({
  offline: 'offline',
  network: 'network',
  timeout: 'timeout',
  http: 'http',
  format: 'format',
});

export class ApiError extends Error {
  constructor(kind, { status = null, cause } = {}) {
    super(status ? `${kind} ${status}` : kind, { cause });
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

const DEFAULT_TIMEOUT_MS = 10_000;

function isOffline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

export async function requestJson(url, { method = 'GET', body, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  if (isOffline()) {
    throw new ApiError(ApiErrorKind.offline);
  }

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const stopOnOuterAbort = () => controller.abort();
  signal?.addEventListener('abort', stopOnOuterAbort, { once: true });

  const headers = { Accept: 'application/json' };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json; charset=UTF-8';
  }

  try {
    let response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }
      if (timedOut) {
        throw new ApiError(ApiErrorKind.timeout, { cause: error });
      }
      throw new ApiError(isOffline() ? ApiErrorKind.offline : ApiErrorKind.network, { cause: error });
    }

    if (!response.ok) {
      throw new ApiError(ApiErrorKind.http, { status: response.status });
    }

    try {
      return await response.json();
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }
      throw new ApiError(timedOut ? ApiErrorKind.timeout : ApiErrorKind.format, { cause: error });
    }
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', stopOnOuterAbort);
  }
}

export function isAbortError(error) {
  return error?.name === 'AbortError';
}
