/** Formats an amount as USD. Kept as formatINR for backward compatibility. */
export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

