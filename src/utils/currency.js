export const formatCurrency = (value, options = {}) => {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;

  return `₦${safeValue.toLocaleString("en-NG", options)}`;
};
