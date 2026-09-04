export const formatWhatsAppNumber = (
  phone
) => {
  const cleaned =
    phone.replace(/\D/g, "");

  if (
    cleaned.startsWith("234")
  ) {
    return cleaned;
  }

  if (
    cleaned.startsWith("0")
  ) {
    return `234${cleaned.slice(1)}`;
  }

  return cleaned;
};

export const openWhatsApp = (phone, message) => {
  const cleanPhone = phone.replace(/\D/g, "");

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");
};
