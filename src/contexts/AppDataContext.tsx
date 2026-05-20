import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase, APP_DATA_ID } from "@/lib/supabase";

export interface Client {
  id: string;
  name: string;
  idNumber: string;
  whatsapp: string;
  email: string;
  treatment: string;
  beforeImage?: string;
  afterImage?: string;
  createdAt: number;
}

export interface Service {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  icon: string;
  quoteOnly?: boolean;
  image?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  before: string;
  after: string;
  treatment: string;
  featuredOnHome?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  treatment: string;
  avatar?: string;
  instagramUrl?: string;
  thumbnail?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
}

export interface Appointment {
  id: string;
  name: string;
  idNumber: string;
  whatsapp: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: number;
}

export interface SiteImage {
  id: string;
  label: string;
  url: string;
  section: string;
}

interface AppData {
  clients: Client[];
  services: Service[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  blog: BlogPost[];
  appointments: Appointment[];
  images: SiteImage[];
}

const STORAGE_KEY = "dp-data-v1";

const defaultData: AppData = {
  clients: [],
  services: [
    { id: "s1", name: "Blanqueamiento Dental", nameEn: "Teeth Whitening", description: "Sonrisa visiblemente más blanca en una sola sesión con tecnología LED.", descriptionEn: "A visibly whiter smile in a single session using LED technology.", price: 450000, icon: "✨" },
    { id: "s2", name: "Ortodoncia", nameEn: "Orthodontics", description: "Brackets metálicos, estéticos y alineadores invisibles.", descriptionEn: "Metal, aesthetic brackets and invisible aligners.", price: 0, icon: "🦷", quoteOnly: true },
    { id: "s3", name: "Implantes Dentales", nameEn: "Dental Implants", description: "Reemplazo permanente de piezas perdidas con titanio de grado médico.", descriptionEn: "Permanent replacement of lost teeth with medical-grade titanium.", price: 2800000, icon: "🔩" },
    { id: "s4", name: "Flowable Injection Technique", nameEn: "Flowable Injection Technique", description: "Diseño de sonrisa mínimamente invasivo, sin desgaste dental.", descriptionEn: "Minimally invasive smile design with no enamel wear.", price: 0, icon: "💉", quoteOnly: true },
    { id: "s5", name: "Carillas Dentales", nameEn: "Dental Veneers", description: "Carillas en porcelana y resina para una sonrisa armónica.", descriptionEn: "Porcelain and resin veneers for a harmonious smile.", price: 850000, icon: "😁" },
    { id: "s6", name: "Endodoncia", nameEn: "Root Canal", description: "Tratamiento de conducto con técnicas rotatorias modernas.", descriptionEn: "Root canal treatment with modern rotary techniques.", price: 550000, icon: "🩺" },
  ],
  gallery: [
    { id: "g1", title: "Diseño de sonrisa", before: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&auto=format&fit=crop", after: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop", treatment: "Flowable Injection Technique" },
    { id: "g2", title: "Blanqueamiento profesional", before: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop", after: "https://images.unsplash.com/photo-1581585504879-94d2e6e7e2c4?w=600&auto=format&fit=crop", treatment: "Blanqueamiento" },
    { id: "g3", title: "Carillas en porcelana", before: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&auto=format&fit=crop", after: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop", treatment: "Carillas" },
  ],
  testimonials: [
    { id: "t1", name: "María González", rating: 5, text: "El Dr. Diego cambió mi sonrisa por completo. Profesional, amable y muy detallista.", treatment: "Carillas" },
    { id: "t2", name: "Carlos Pérez", rating: 5, text: "Excelente atención, equipo moderno y resultados increíbles con mis implantes.", treatment: "Implantes" },
    { id: "t3", name: "Ana Ruiz", rating: 5, text: "Mi blanqueamiento quedó espectacular. Lo recomiendo 100%.", treatment: "Blanqueamiento" },
  ],
  blog: [
    { id: "b1", title: "¿Qué es el Flowable Injection Technique?", excerpt: "Conoce la técnica que está revolucionando la estética dental sin desgaste.", content: "Es una técnica mínimamente invasiva que permite rediseñar tu sonrisa usando resinas fluidas inyectadas en moldes diseñados a medida...", date: "2025-04-12" },
    { id: "b2", title: "5 hábitos para mantener tu sonrisa blanca", excerpt: "Pequeños cambios que marcan la diferencia.", content: "Reducir café y vino tinto, cepillado correcto, hilo dental diario, limpieza profesional semestral y enjuague con flúor...", date: "2025-03-02" },
    { id: "b3", title: "Ortodoncia adulta: nunca es tarde", excerpt: "Los alineadores invisibles cambian las reglas.", content: "Más del 40% de nuestros pacientes son adultos. Hoy existen alternativas estéticas como Invisalign y brackets cerámicos...", date: "2025-02-10" },
  ],
  appointments: [],
  images: [],
};

interface Ctx {
  data: AppData;
  set: <K extends keyof AppData>(k: K, v: AppData[K]) => void;
  reset: () => void;
}

const Ctx = createContext<Ctx | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData({ ...defaultData, ...parsed });
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const set = <K extends keyof AppData>(k: K, v: AppData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultData);
  };

  return <Ctx.Provider value={{ data, set, reset }}>{children}</Ctx.Provider>;
}

export function useAppData() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAppData inside AppDataProvider");
  return v;
}

export const WHATSAPP_NUMBER = "573014276409";
export const PHONE_LANDLINE = "(5) 342 3347";
export const PHONE_MOBILE = "+57 301 4276409";
export const EMAIL = "drdiegopallares@gmail.com";
export const ADDRESS = "Cra 43 # 80 - 155, Barranquilla";
export const INSTAGRAM = "https://www.instagram.com/drdiegopallares/";
export const TIKTOK = "https://www.tiktok.com/@drdiegopallares28";
export const MAPS = "https://maps.app.goo.gl/yhQ4Mia9nEZDTksP7";

export function waLink(text: string, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
