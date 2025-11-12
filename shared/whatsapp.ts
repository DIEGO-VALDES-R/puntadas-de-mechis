// WhatsApp contact numbers
export const WHATSAPP_NUMBERS = [
  {
    number: "3124915127",
    name: "WhatsApp 1",
    country: "Colombia",
  },
  {
    number: "3224589653",
    name: "WhatsApp 2",
    country: "Colombia",
  },
  {
    number: "3204884943",
    name: "WhatsApp 3",
    country: "Colombia",
  },
];

export function getWhatsAppLink(phoneNumber: string, message?: string) {
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

export function getWhatsAppLinkWithCountryCode(phoneNumber: string, countryCode: string = "57", message?: string) {
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  const fullNumber = `${countryCode}${cleanNumber}`;
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${fullNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}
