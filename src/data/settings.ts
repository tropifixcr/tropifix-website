// Every placeholder Loic fills in is one Netlify environment variable, read here and nowhere else.
const env = import.meta.env;

// Digits only, with country code, as wa.me expects. The default is an obvious fake.
export const whatsappNumber: string = env.PUBLIC_WHATSAPP_NUMBER || '50600000000';
export const contactEmail: string = env.PUBLIC_CONTACT_EMAIL || '';
export const legalEntity: string = env.PUBLIC_LEGAL_ENTITY_NAME || '';

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
