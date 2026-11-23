const descriptions = [
  [[0], 'clear sky'],
  [[1], 'mainly clear'],
  [[2], 'partly cloudy'],
  [[3], 'overcast'],
  [[45, 48], 'fog'],
  [[51, 53, 55], 'drizzle'],
  [[56, 57], 'freezing drizzle'],
  [[61, 63, 65], 'rain'],
  [[66, 67], 'freezing rain'],
  [[71, 73, 75, 77], 'snow'],
  [[80, 81, 82], 'rain showers'],
  [[85, 86], 'snow showers'],
  [[95, 96, 97, 99], 'thunderstorm'],
];

const PRECIPITATION_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86]);
const STORM_CODES = new Set([95, 96, 97, 99]);
const FOG_CODES = new Set([45, 48]);

const windDelays = [
  { from: 40, minutes: 3 },
  { from: 25, minutes: 2 },
  { from: 15, minutes: 1 },
];

export function describeWeatherCode(code) {
  return descriptions.find(([codes]) => codes.includes(code))?.[1] ?? 'unknown weather';
}

export function formatTemperature(value) {
  const rounded = Math.round(value);
  return `${rounded > 0 ? '+' : ''}${rounded}°C`;
}

export function formatWind(value) {
  return `wind ${Math.round(value)} km/h`;
}

export function summarizeWeather(weather) {
  return `${formatTemperature(weather.temperature)}, ${describeWeatherCode(weather.code)}, ${formatWind(weather.windSpeed)}`;
}

export function getWeatherDelay(weather) {
  if (!weather) {
    return { minutes: 0, reasons: [] };
  }

  const reasons = [];
  let minutes = 0;

  const windDelay = windDelays.find(({ from }) => weather.windSpeed >= from);
  if (windDelay) {
    minutes += windDelay.minutes;
    reasons.push('wind');
  }

  if (STORM_CODES.has(weather.code)) {
    minutes += 3;
    reasons.push('thunderstorm');
  } else if (PRECIPITATION_CODES.has(weather.code) || FOG_CODES.has(weather.code)) {
    minutes += 1;
    reasons.push(describeWeatherCode(weather.code));
  }

  return { minutes, reasons };
}

export function describeDelay(delay) {
  if (delay.minutes === 0) {
    return 'good flying weather, no delay';
  }
  return `+${delay.minutes} min because of ${delay.reasons.join(' and ')}`;
}
