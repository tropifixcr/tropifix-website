// One entry per service. Service pages, the home grid and the form tiles all read from here.
// `id` matches the icon file name in /Icons and is the value sent with a request.
export interface Service {
  id: string;
  en: string;
  es: string;
}

export const services: Service[] = [
  { id: 'plumbing', en: 'Plumbing', es: 'Plomería' },
  { id: 'electrical', en: 'Electrical', es: 'Electricidad' },
  { id: 'ac-hvac', en: 'AC & HVAC', es: 'Aire acondicionado' },
  { id: 'landscaping', en: 'Landscaping & gardening', es: 'Jardinería y paisajismo' },
  { id: 'handyman', en: 'Handyman & carpentry', es: 'Mantenimiento y carpintería' },
  { id: 'painting', en: 'Painting', es: 'Pintura' },
  { id: 'locksmith', en: 'Locksmith', es: 'Cerrajería' },
  { id: 'appliance-repair', en: 'Appliance repair', es: 'Reparación de electrodomésticos' },
  { id: 'pool-care', en: 'Pool care', es: 'Mantenimiento de piscinas' },
  { id: 'pest-control', en: 'Pest control', es: 'Control de plagas' },
  { id: 'generators', en: 'Generators & backup power', es: 'Generadores y respaldo eléctrico' },
  { id: 'water-systems', en: 'Water systems', es: 'Sistemas de agua' },
  { id: 'roofing', en: 'Roofing', es: 'Techos' },
  { id: 'mold-humidity', en: 'Mold & humidity', es: 'Moho y humedad' },
  { id: 'pressure-washing', en: 'Pressure washing', es: 'Lavado a presión' },
  { id: 'tree-trimming', en: 'Tree trimming', es: 'Poda de árboles' },
  { id: 'septic', en: 'Septic service', es: 'Tanques sépticos' },
  { id: 'solar', en: 'Solar', es: 'Energía solar' },
  { id: 'wifi-smart-home', en: 'Wi-Fi & smart home', es: 'Wi-Fi y casa inteligente' },
  { id: 'security', en: 'Security & property checks', es: 'Seguridad y revisión de propiedades' },
  { id: 'cleaning', en: 'Cleaning & turnovers', es: 'Limpieza y cambios de huésped' },
];

// Always offered in the form; has no service page.
export const otherService: Service = { id: 'other', en: 'Other / not sure', es: 'Otro / no estoy seguro' };
