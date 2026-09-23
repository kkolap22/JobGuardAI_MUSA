export function getRiskTone(level = "LOW") {
  const normalized = level.toUpperCase();
  if (["HIGH", "CRITICAL"].includes(normalized)) return "danger";
  if (normalized === "MEDIUM") return "warn";
  return "safe";
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "Recently";
}