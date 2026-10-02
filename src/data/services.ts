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
  s('electrical', 'Electrical', 'Electricidad', 'electrical', 'electricidad', ['generators', 'solar', 'ac-hvac']),
  s('ac-hvac', 'AC & HVAC', 'Aire acondicionado', 'ac-repair', 'reparacion-aire-acondicionado', ['electrical', 'mold-humidity', 'appliance-repair']),
  s('landscaping', 'Landscaping & gardening', 'Jardinería y paisajismo', 'landscaping', 'jardineria', ['tree-trimming', 'pool-care', 'pest-control']),
  s('handyman', 'Handyman & carpentry', 'Mantenimiento y carpintería', 'handyman', 'mantenimiento-carpinteria', ['painting', 'locksmith', 'roofing']),
  s('painting', 'Painting', 'Pintura', 'painting', 'pintura', ['pressure-washing', 'mold-humidity', 'handyman']),
  s('locksmith', 'Locksmith', 'Cerrajería', 'locksmith', 'cerrajeria', ['security', 'handyman', 'wifi-smart-home']),
  s('appliance-repair', 'Appliance repair', 'Reparación de electrodomésticos', 'appliance-repair', 'reparacion-electrodomesticos', ['electrical', 'ac-hvac', 'plumbing']),
  s('pool-care', 'Pool care', 'Mantenimiento de piscinas', 'pool-care', 'mantenimiento-piscinas', ['landscaping', 'pressure-washing', 'cleaning']),
  s('pest-control', 'Pest control', 'Control de plagas', 'pest-control', 'control-plagas', ['mold-humidity', 'landscaping', 'cleaning']),
  s('generators', 'Generators & backup power', 'Generadores y respaldo eléctrico', 'generators', 'generadores', ['electrical', 'solar', 'water-systems']),
  s('water-systems', 'Water systems', 'Sistemas de agua', 'water-systems', 'sistemas-agua', ['plumbing', 'septic', 'generators']),
  s('roofing', 'Roofing', 'Techos', 'roofing', 'techos', ['mold-humidity', 'painting', 'tree-trimming']),
  s('mold-humidity', 'Mold & humidity', 'Moho y humedad', 'mold-humidity', 'moho-humedad', ['ac-hvac', 'roofing', 'painting']),
  s('pressure-washing', 'Pressure washing', 'Lavado a presión', 'pressure-washing', 'lavado-presion', ['painting', 'cleaning', 'pool-care']),
  s('tree-trimming', 'Tree trimming', 'Poda de árboles', 'tree-trimming', 'poda-arboles', ['landscaping', 'roofing', 'pest-control']),
  s('septic', 'Septic service', 'Tanques sépticos', 'septic-service', 'tanques-septicos', ['plumbing', 'water-systems', 'landscaping']),
  s('solar', 'Solar', 'Energía solar', 'solar', 'energia-solar', ['electrical', 'generators', 'roofing']),
  s('wifi-smart-home', 'Wi-Fi & smart home', 'Wi-Fi y casa inteligente', 'wifi-smart-home', 'wifi-casa-inteligente', ['security', 'electrical', 'locksmith']),
  s('security', 'Security & property checks', 'Seguridad y revisión de propiedades', 'security', 'seguridad', ['locksmith', 'wifi-smart-home', 'cleaning']),
  s('cleaning', 'Cleaning & turnovers', 'Limpieza y cambios de huésped', 'cleaning', 'limpieza', ['pool-care', 'pressure-washing', 'pest-control']),
];

// Always offered in the form; has no service page.
export const otherService = { id: 'other', en: 'Other / not sure', es: 'Otro / no estoy seguro' };

export const servicePath = (service: Service, lang: Lang) =>
  lang === 'en' ? `/services/${service.slug.en}` : `/es/servicios/${service.slug.es}`;
