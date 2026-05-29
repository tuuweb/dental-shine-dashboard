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

export interface ServiceCategory {
  id: string;
  name: string;
  nameEn: string;
}

export interface Service {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  longDescription?: string;
  longDescriptionEn?: string;
  price: number;
  icon: string;
  quoteOnly?: boolean;
  image?: string;
  images?: string[];
  videoUrl?: string;
  categoryId?: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image?: string; // imagen principal nueva
  videoUrl?: string;
  description?: string;
  categoryId?: string;
  treatment: string;
  // legacy (compat)
  before?: string;
  after?: string;
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
  status?: "pending" | "approved";
  createdAt?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  images?: string[];
  videoUrl?: string;
}

export interface Appointment {
  id: string;
  name: string;
  idNumber?: string;
  whatsapp: string;
  service: string;
  date: string;
  time: string;
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

export type Schedule = Record<number, string[]>;

export interface DoctorInfo {
  name: string;
  specialty: string;       // "Especialista en estética dental"
  yearsExperience: string; // "17+"
  role: string;            // "Odontólogo estético"
  bioShort: string;
  bioLong: string;
  vision: string;
  university: string;
  certifications: string[];
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

interface AppData {
  clients: Client[];
  services: Service[];
  serviceCategories: ServiceCategory[];
  gallery: GalleryItem[];
  galleryCategories: GalleryCategory[];
  testimonials: Testimonial[];
  blog: BlogPost[];
  appointments: Appointment[];
  images: SiteImage[];
  schedule: Schedule;
  doctorInfo: DoctorInfo;
  showBeforeAfterOnHome: boolean;
}

const STORAGE_KEY = "dp-data-v1";

const defaultSchedule: Schedule = {
  0: [],
  1: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  2: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  3: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  4: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  5: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  6: ["09:00", "10:00", "11:00"],
};

const defaultDoctorInfo: DoctorInfo = {
  name: "Dr. Diego Pallares",
  specialty: "Especialista en estética dental",
  yearsExperience: "17+",
  role: "Odontólogo estético",
  bioShort: "17+ años transformando sonrisas con técnicas mínimamente invasivas y resultados naturales en Barranquilla.",
  bioLong: "Odontólogo egresado de la Fundación Universitaria San Martín (Bogotá, 2009). Más de 17 años de experiencia clínica enfocada en rehabilitación oral y estética dental avanzada. Especialista en diseño de sonrisa, Flowable Injection Technique, ortodoncia estética e implantes dentales.",
  vision: "Ser referentes en rehabilitación oral y estética dental en el Caribe colombiano, ofreciendo tratamientos de talla internacional con calidez humana.",
  university: "Fundación Universitaria San Martín",
  certifications: ["Diseño de sonrisa avanzado", "Flowable Injection Technique", "Rehabilitación oral integral"],
  phone: "(5) 342 3347",
  whatsapp: "+57 301 4276409",
  email: "drdiegopallares@gmail.com",
  address: "Cra 43 # 80 - 155, Barranquilla",
};

const defaultServiceCategories: ServiceCategory[] = [
  { id: "cat-estetica", name: "Estética Dental", nameEn: "Aesthetic Dentistry" },
  { id: "cat-rehabilitacion", name: "Rehabilitación Oral", nameEn: "Oral Rehabilitation" },
  { id: "cat-ortodoncia", name: "Ortodoncia", nameEn: "Orthodontics" },
  { id: "cat-general", name: "Odontología General", nameEn: "General Dentistry" },
];

const defaultGalleryCategories: GalleryCategory[] = [
  { id: "gcat-sonrisa", name: "Diseño de Sonrisa" },
  { id: "gcat-blanqueamiento", name: "Blanqueamiento" },
  { id: "gcat-ortodoncia", name: "Ortodoncia" },
  { id: "gcat-implantes", name: "Implantes" },
];

const defaultData: AppData = {
  clients: [],
  serviceCategories: defaultServiceCategories,
  services: [
    { id: "s1", categoryId: "cat-estetica", name: "Blanqueamiento Dental", nameEn: "Teeth Whitening", description: "Sonrisa visiblemente más blanca en una sola sesión con tecnología LED.", descriptionEn: "A visibly whiter smile in a single session using LED technology.", longDescription: "Tratamiento profesional con gel activado por luz LED. Aclara varios tonos en una sola sesión, sin sensibilidad excesiva. Ideal antes de un evento importante.", price: 450000, icon: "✨" },
    { id: "s2", categoryId: "cat-ortodoncia", name: "Ortodoncia", nameEn: "Orthodontics", description: "Brackets metálicos, estéticos y alineadores invisibles.", descriptionEn: "Metal, aesthetic brackets and invisible aligners.", longDescription: "Plan personalizado de ortodoncia: brackets metálicos, cerámicos o alineadores invisibles tipo Invisalign. Control mensual y radiografías incluidas.", price: 0, icon: "🦷", quoteOnly: true },
    { id: "s3", categoryId: "cat-rehabilitacion", name: "Implantes Dentales", nameEn: "Dental Implants", description: "Reemplazo permanente de piezas perdidas con titanio de grado médico.", descriptionEn: "Permanent replacement of lost teeth with medical-grade titanium.", longDescription: "Implantes de titanio osteointegrados con corona en zirconio. Cirugía guiada, mínimamente invasiva, con garantía de por vida sobre el implante.", price: 2800000, icon: "🔩" },
    { id: "s4", categoryId: "cat-estetica", name: "Flowable Injection Technique", nameEn: "Flowable Injection Technique", description: "Diseño de sonrisa mínimamente invasivo, sin desgaste dental.", descriptionEn: "Minimally invasive smile design with no enamel wear.", longDescription: "Técnica revolucionaria que rediseña tu sonrisa con resinas fluidas inyectadas en moldes hechos a medida. Sin tallar el diente, reversible y de larga duración.", price: 0, icon: "💉", quoteOnly: true },
    { id: "s5", categoryId: "cat-estetica", name: "Carillas Dentales", nameEn: "Dental Veneers", description: "Carillas en porcelana y resina para una sonrisa armónica.", descriptionEn: "Porcelain and resin veneers for a harmonious smile.", longDescription: "Carillas ultra delgadas en porcelana feldespática o resina nano-híbrida. Diseño digital previo (DSD) para que veas el resultado antes de empezar.", price: 850000, icon: "😁" },
    { id: "s6", categoryId: "cat-general", name: "Endodoncia", nameEn: "Root Canal", description: "Tratamiento de conducto con técnicas rotatorias modernas.", descriptionEn: "Root canal treatment with modern rotary techniques.", longDescription: "Endodoncia con instrumentación rotatoria y localizador apical. Procedimiento prácticamente indoloro que salva tu diente natural.", price: 550000, icon: "🩺" },
  ],
  galleryCategories: defaultGalleryCategories,
  gallery: [
    { id: "g1", categoryId: "gcat-sonrisa", title: "Diseño de sonrisa en resina", image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=900&auto=format&fit=crop", treatment: "Flowable Injection Technique", description: "Caso real de rediseño de sonrisa con técnica de inyección de resina." },
    { id: "g2", categoryId: "gcat-blanqueamiento", title: "Blanqueamiento profesional LED", image: "https://images.unsplash.com/photo-1581585504879-94d2e6e7e2c4?w=900&auto=format&fit=crop", treatment: "Blanqueamiento" },
    { id: "g3", categoryId: "gcat-sonrisa", title: "Carillas en porcelana", image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=900&auto=format&fit=crop", treatment: "Carillas" },
  ],
  testimonials: [
    { id: "t1", name: "María González", rating: 5, text: "El Dr. Diego cambió mi sonrisa por completo. Profesional, amable y muy detallista.", treatment: "Carillas", status: "approved", createdAt: Date.now() },
    { id: "t2", name: "Carlos Pérez", rating: 5, text: "Excelente atención, equipo moderno y resultados increíbles con mis implantes.", treatment: "Implantes", status: "approved", createdAt: Date.now() },
    { id: "t3", name: "Ana Ruiz", rating: 5, text: "Mi blanqueamiento quedó espectacular. Lo recomiendo 100%.", treatment: "Blanqueamiento", status: "approved", createdAt: Date.now() },
  ],
  blog: [
    { id: "b1", title: "¿Qué es el Flowable Injection Technique?", excerpt: "La técnica que está revolucionando la estética dental sin desgaste.", content: "Es una técnica mínimamente invasiva que permite rediseñar tu sonrisa usando resinas fluidas inyectadas en moldes diseñados a medida. No requiere tallar el diente y es completamente reversible.", date: "2025-04-12" },
    { id: "b2", title: "5 hábitos para mantener tu sonrisa blanca", excerpt: "Pequeños cambios que marcan la diferencia.", content: "Reducir café y vino tinto, cepillado correcto tres veces al día, hilo dental diario, limpieza profesional semestral y enjuague con flúor.", date: "2025-03-02" },
    { id: "b3", title: "Ortodoncia adulta: nunca es tarde", excerpt: "Los alineadores invisibles cambian las reglas.", content: "Más del 40% de nuestros pacientes son adultos. Hoy existen alternativas estéticas como Invisalign y brackets cerámicos que pasan desapercibidos.", date: "2025-02-10" },
  ],
  appointments: [],
  images: [],
  schedule: defaultSchedule,
  doctorInfo: defaultDoctorInfo,
  showBeforeAfterOnHome: true,
};

interface Ctx {
  data: AppData;
  set: <K extends keyof AppData>(k: K, v: AppData[K]) => void;
  reset: () => void;
}

const Ctx = createContext<Ctx | null>(null);

function mergeWithDefaults(partial: Partial<AppData>): AppData {
  return {
    ...defaultData,
    ...partial,
    doctorInfo: { ...defaultData.doctorInfo, ...(partial.doctorInfo || {}) },
    schedule: { ...defaultData.schedule, ...(partial.schedule || {}) },
    serviceCategories: partial.serviceCategories?.length ? partial.serviceCategories : defaultData.serviceCategories,
    galleryCategories: partial.galleryCategories?.length ? partial.galleryCategories : defaultData.galleryCategories,
    testimonials: (partial.testimonials || defaultData.testimonials).map((t) => ({ status: "approved", ...t })),
  };
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData);
  const loadedRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(mergeWithDefaults(JSON.parse(raw)));
    } catch {}

    (async () => {
      const { data: row, error } = await supabase
        .from("app_data")
        .select("data")
        .eq("id", APP_DATA_ID)
        .maybeSingle();
      if (!error && row?.data) setData(mergeWithDefaults(row.data as Partial<AppData>));
      loadedRef.current = true;
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (!loadedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase
        .from("app_data")
        .upsert({ id: APP_DATA_ID, data, updated_at: new Date().toISOString() })
        .then(({ error }) => { if (error) console.error("Supabase save error:", error.message); });
    }, 600);
  }, [data]);

  const set = <K extends keyof AppData>(k: K, v: AppData[K]) => setData((d) => ({ ...d, [k]: v }));
  const reset = () => { localStorage.removeItem(STORAGE_KEY); setData(defaultData); };

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
