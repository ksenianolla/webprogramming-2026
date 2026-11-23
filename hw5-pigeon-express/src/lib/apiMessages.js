import { ApiErrorKind } from '../api/http.js';

const reasons = {
  [ApiErrorKind.offline]: () => 'you are offline. Check the connection and try again',
  [ApiErrorKind.timeout]: () => 'the server took too long to answer. Try again',
  [ApiErrorKind.http]: (error) => `the server answered with error ${error.status}. Try again later`,
  [ApiErrorKind.format]: () => 'the server sent an unexpected answer. Try again later',
  [ApiErrorKind.network]: () => 'the server is unreachable. Check the connection and try again',
};

export function describeApiError(error, action) {
  const reason = reasons[error?.kind] ?? reasons[ApiErrorKind.network];
  return `Couldn’t ${action}: ${reason(error)}`;
}
