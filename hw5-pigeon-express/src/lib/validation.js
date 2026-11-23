const MIN_ADDRESS_LENGTH = 5;
const MAX_ADDRESS_LENGTH = 80;
const MAX_NAME_LENGTH = 30;
const NAME_PATTERN = /^[\p{L}][\p{L}' -]*$/u;

export function normalizeAddress(text) {
  return text.trim().replace(/\s+/g, ' ');
}

export function validateAddress(addresses, text) {
  const normalized = normalizeAddress(text);
  if (normalized.length < MIN_ADDRESS_LENGTH) {
    return `Address should be at least ${MIN_ADDRESS_LENGTH} characters long`;
  }
  if (normalized.length > MAX_ADDRESS_LENGTH) {
    return `Address should be at most ${MAX_ADDRESS_LENGTH} characters long`;
  }
  const isDuplicate = addresses.some(
    (address) => address.text.toLowerCase() === normalized.toLowerCase(),
  );
  if (isDuplicate) {
    return 'This address is already in the list';
  }
  return '';
}

export function validateProfileField(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'This field cannot be empty';
  }
  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Use ${MAX_NAME_LENGTH} characters or fewer`;
  }
  if (!NAME_PATTERN.test(trimmed)) {
    return 'Use letters only';
  }
  return '';
}
