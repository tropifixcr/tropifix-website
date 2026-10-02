// One entry per service. Tree trimming lives under landscaping, mold and humidity under painting,
// and generators under solar. Security, cleaning and "Other / not sure" are off for now.
// One entry per service. Service pages, the home grid and the form tiles all read from here.
// `id` matches the icon file name in /Icons and is the value sent with a request.
// Page copy lives in services.en.ts and services.es.ts, keyed by the same id.
export type Lang = 'en' | 'es';

export interface Service {
  id: string;
  en: string;
  es: string;
  slug: Record<Lang, string>;
  /** Ids of 3 related services, linked from the service page. */
  related: string[];
}

export interface ServiceCopy {
  /** <title>, under ~60 characters. */
  title: string;
  /** Meta description, under ~155 characters. */
  description: string;
  h1: string;
  intro: string;
  jobs: string[];
  why: string;
  faqs: [string, string][];
}

const s = (id: string, en: string, es: string, slugEn: string, slugEs: string, related: string[]): Service => ({
  id, en, es, slug: { en: slugEn, es: slugEs }, related,
});

export const services: Service[] = [
  s('plumbing', 'Plumbing', 'Fontanería', 'plumbing', 'fontaneria', ['water-systems', 'septic', 'appliance-repair']),
  s('electrical', 'Electrical', 'Electricidad', 'electrical', 'electricidad', ['solar', 'ac-hvac', 'appliance-repair']),
  s('ac-hvac', 'AC & HVAC', 'Aire acondicionado', 'ac-repair', 'reparacion-aire-acondicionado', ['electrical', 'appliance-repair', 'painting']),
  s('landscaping', 'Landscaping & gardening', 'Jardinería y paisajismo', 'landscaping', 'jardineria', ['pool-care', 'pest-control', 'pressure-washing']),
  s('handyman', 'Handyman & carpentry', 'Mantenimiento y carpintería', 'handyman', 'mantenimiento-carpinteria', ['painting', 'locksmith', 'roofing']),
  s('painting', 'Painting', 'Pintura', 'painting', 'pintura', ['pressure-washing', 'roofing', 'handyman']),
  s('locksmith', 'Locksmith', 'Cerrajería', 'locksmith', 'cerrajeria', ['wifi-smart-home', 'handyman', 'electrical']),
  s('appliance-repair', 'Appliance repair', 'Reparación de electrodomésticos', 'appliance-repair', 'reparacion-electrodomesticos', ['electrical', 'ac-hvac', 'plumbing']),
  s('pool-care', 'Pool care', 'Mantenimiento de piscinas', 'pool-care', 'mantenimiento-piscinas', ['landscaping', 'pressure-washing', 'water-systems']),
  s('pest-control', 'Pest control', 'Control de plagas', 'pest-control', 'control-plagas', ['landscaping', 'painting', 'handyman']),
  s('water-systems', 'Water systems', 'Sistemas de agua', 'water-systems', 'sistemas-agua', ['plumbing', 'septic', 'solar']),
  s('roofing', 'Roofing', 'Techos', 'roofing', 'techos', ['painting', 'landscaping', 'solar']),
  s('pressure-washing', 'Pressure washing', 'Lavado a presión', 'pressure-washing', 'lavado-presion', ['painting', 'pool-care', 'landscaping']),
  s('septic', 'Septic service', 'Tanques sépticos', 'septic-service', 'tanques-septicos', ['plumbing', 'water-systems', 'landscaping']),
  s('solar', 'Solar', 'Energía solar', 'solar', 'energia-solar', ['electrical', 'roofing', 'water-systems']),
  s('wifi-smart-home', 'Wi-Fi, smart home & security cameras', 'Wi-Fi, casa inteligente y cámaras de seguridad', 'wifi-smart-home', 'wifi-casa-inteligente', ['electrical', 'locksmith', 'solar']),
];

export const servicePath = (service: Service, lang: Lang) =>
  lang === 'en' ? `/services/${service.slug.en}` : `/es/servicios/${service.slug.es}`;
