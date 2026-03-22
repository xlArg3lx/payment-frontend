export type CardBrand = "VISA" | "MASTERCARD" | "UNKNOWN";

export const detectCardBrand = (number: string): CardBrand => {
  const clean = number.replace(/\s/g, "");
  if (/^4/.test(clean)) return "VISA";
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return "MASTERCARD";
  return "UNKNOWN";
};

export const formatCardNumber = (value: string): string => {
  const clean = value.replace(/\D/g, "").slice(0, 16);
  return clean.replace(/(.{4})/g, "$1 ").trim();
};

export const formatExpiry = (value: string): string => {
  const clean = value.replace(/\D/g, "").slice(0, 4);
  if (clean.length >= 2) {
    return clean.slice(0, 2) + "/" + clean.slice(2);
  }
  return clean;
};

export const luhnCheck = (number: string): boolean => {
  const clean = number.replace(/\s/g, "");
  if (clean.length === 0) return false;

  let sum = 0;
  let isEven = false;

  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};
