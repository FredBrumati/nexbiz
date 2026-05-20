export function formatMoney(value) {
  const number = Number(value || 0);

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseMoney(value) {
  if (!value) return 0;

  const cleanValue = String(value)
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  return Number(cleanValue || 0);
}

export function moneyInputMask(value) {
  if (!value) return "";

  const onlyNumbers = String(value).replace(/\D/g, "");

  if (!onlyNumbers) return "";

  const number = Number(onlyNumbers) / 100;

  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}