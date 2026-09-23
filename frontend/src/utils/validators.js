export function isHttpUrl(value) {
  return /^https?:\/\//i.test(value.trim());
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}