export function toSafeInteger(num?: string | number | null): number {
  if (num == null) return 1;
  if (typeof num === "string") {
    num = parseInt(num, 10);
  }
  return isNaN(num) || Number.isFinite(num) === false ? 1 : num;
}
