export interface ImageAsset {
  src: string;
  alt: string;
  credit: string;
  creditHref: string;
}

export interface Service {
  name: string;
  price: string;
  duration: string;
  image: ImageAsset;
}

export interface Review {
  quote: string;
  name: string;
  service: string;
}

export interface HoursRow {
  day: string;
  time: string;
}

export interface ChatDemoConfig {
  stylist: string;
  nextAvailable: string;
}

export interface Salon {
  salonName: string;
  area: string;
  accent: string;
  established: string;
  rating: string;
  phone: string;
  addressLine1: string;
  postcode: string;
  logo: { src: string; alt: string };
  heroImage: ImageAsset;
  services: Service[];
  reviews: Review[];
  hours: HoursRow[];
  chat: ChatDemoConfig;
}
