// Every placeholder Loic fills in is one Netlify environment variable, read here and nowhere else.
const env = import.meta.env;

// Digits only, with country code, as wa.me expects. The default is an obvious fake.
export const whatsappNumber: string = env.PUBLIC_WHATSAPP_NUMBER || '50600000000';
export const contactEmail: string = env.PUBLIC_CONTACT_EMAIL || '';
export const legalEntity: string = env.PUBLIC_LEGAL_ENTITY_NAME || '';

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// GA4 Measurement ID (G-XXXXXXX). Analytics and the cookie banner exist only when this is set
// AND the build is a production deploy, so previews and local builds never load GA4.
export const gaId: string = env.PUBLIC_GA4_ID || '';
