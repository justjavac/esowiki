export function formatDate(date?: string | Date) {
  if (date == null) return "";
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateTime(datetime?: string | Date) {
  if (datetime == null) return "";
  if (typeof datetime === "string") {
    datetime = new Date(datetime);
  }
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(datetime);
}
