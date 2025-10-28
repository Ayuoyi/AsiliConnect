// Current exchange rate: 1 INR = 1.65 KES (as of 2025)
const INR_TO_KES_RATE = 1.65;

export const convertToKES = (amount: string | number): string => {
  // Remove currency symbol and commas, then convert to number
  const numericAmount = Number(String(amount).replace(/[₹,]/g, ''));
  const kesAmount = numericAmount * INR_TO_KES_RATE;
  
  // Format as KES with comma separators
  return `KES ${kesAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatKES = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};