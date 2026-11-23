import { ApiError, ApiErrorKind, requestJson } from './http.js';

const SAINT_PETERSBURG = { latitude: 59.94, longitude: 30.31 };

const WEATHER_URL = (() => {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: SAINT_PETERSBURG.latitude,
    longitude: SAINT_PETERSBURG.longitude,
    current: 'temperature_2m,wind_speed_10m,weather_code',
    wind_speed_unit: 'kmh',
    timezone: 'Europe/Moscow',
  }).toString();
  return url.href;
})();

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export async function fetchFlyingWeather({ signal } = {}) {
  const data = await requestJson(WEATHER_URL, { signal });
  const current = data?.current;

  if (
    !current ||
    !isNumber(current.temperature_2m) ||
    !isNumber(current.wind_speed_10m) ||
    !isNumber(current.weather_code)
  ) {
    throw new ApiError(ApiErrorKind.format);
  }

  return {
    temperature: current.temperature_2m,
    windSpeed: current.wind_speed_10m,
    code: current.weather_code,
    measuredAt: typeof current.time === 'string' ? current.time : null,
  };
}
