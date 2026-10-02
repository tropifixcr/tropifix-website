// Zone 1 towns, south to north, then inland. Used by the home page, the form and structured data.
export const zone1Towns = [
  'Playa Langosta',
  'Tamarindo',
  'Playa Grande',
  'Playa Ventanas',
  'Playa Conchal',
  'Brasilito',
  'Playa Flamingo',
  'Playa Potrero',
  'Playa Penca',
  'Playa Pan de Azúcar (Sugar Beach)',
  'Playa Danta',
  'Las Catalinas',
  'Huacas',
];

// `live` zones get the response-time promise; the others get the honest "we'll reply on WhatsApp" message.
export const zones = [
  { id: 'zone1', name: 'Tamarindo – Las Catalinas', live: true },
  { id: 'papagayo-coco', name: 'Papagayo – Coco', live: false },
  { id: 'nosara-samara', name: 'Nosara – Sámara', live: false },
  { id: 'santa-teresa', name: 'Santa Teresa', live: false },
  { id: 'liberia', name: 'Liberia', live: false },
];
