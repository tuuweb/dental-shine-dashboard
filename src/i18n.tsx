import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "es" | "en";

const dict = {
  es: {
    "nav.home": "Inicio",
    "nav.about": "Dr. Diego",
    "nav.services": "Servicios",
    "nav.gallery": "Galería",
    "nav.testimonials": "Testimonios",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",
    "nav.appointment": "Agendar Cita",
    "cta.book": "Agenda tu cita",
    "cta.contact": "Contáctanos",
    "cta.learnMore": "Conoce más",
    "cta.viewAll": "Ver todo",
    "cta.sendWhatsapp": "Enviar por WhatsApp",
    "cta.quote": "Cotizar por WhatsApp",
    "hero.tag": "Rehabilitación Oral y Estética Dental",
    "hero.title": "Transformamos sonrisas, cambiamos vidas",
    "hero.subtitle":
      "Especialistas en Flowable Injection Technique, ortodoncia, implantes y estética dental avanzada en Barranquilla.",
    "about.title": "Dr. Diego Pallares",
    "about.role": "Odontólogo · Rehabilitador Oral",
    "about.bioShort":
      "Más de 12 años transformando sonrisas con técnicas mínimamente invasivas y resultados naturales.",
    "about.vision": "Visión",
    "about.visionText":
      "Ser referentes en rehabilitación oral y estética dental en el Caribe colombiano, ofreciendo tratamientos de talla internacional con calidez humana.",
    "about.experience": "Experiencia",
    "about.credentials": "Credenciales",
    "services.title": "Nuestros Servicios",
    "services.subtitle": "Tratamientos diseñados para tu sonrisa ideal",
    "gallery.title": "Antes y Después",
    "gallery.subtitle": "Resultados reales de nuestros pacientes",
    "testimonials.title": "Lo que dicen nuestros pacientes",
    "blog.title": "Blog y Consejos",
    "blog.subtitle": "Aprende a cuidar tu sonrisa",
    "contact.title": "Contáctanos",
    "contact.subtitle": "Estamos para resolver tus dudas",
    "contact.name": "Nombre",
    "contact.email": "Correo",
    "contact.phone": "Teléfono",
    "contact.message": "Mensaje",
    "contact.send": "Enviar mensaje",
    "contact.address": "Dirección",
    "contact.phones": "Teléfonos",
    "appt.title": "Agenda tu cita",
    "appt.subtitle": "Confirma tu fecha en minutos",
    "appt.fullname": "Nombre completo",
    "appt.idnum": "Cédula",
    "appt.whatsapp": "WhatsApp",
    "appt.date": "Fecha",
    "appt.time": "Hora",
    "appt.service": "Servicio",
    "appt.notes": "Notas",
    "appt.submit": "Solicitar cita",
    "appt.success": "¡Cita solicitada! Te contactaremos por WhatsApp.",
    "appt.taken": "Ese horario ya está reservado. Elige otro.",
    "footer.rights": "Todos los derechos reservados.",
    "footer.tagline": "Tu sonrisa, nuestra pasión.",
    "common.from": "Desde",
    "common.loading": "Cargando...",
    "stats.patients": "Pacientes felices",
    "stats.years": "Años de experiencia",
    "stats.treatments": "Tratamientos realizados",
    "stats.rating": "Calificación",
    "lang.es": "Español",
    "lang.en": "English",
    "common.before": "Antes",
    "common.after": "Después",
    "common.quote": "Cotización",
    "home.specialist": "Especialista",
    "home.specialistArea": "Rehabilitación Oral",
    "home.whyUs": "¿Por qué elegirnos?",
    "home.why.experience": "Experiencia",
    "home.why.experienceText": "12+ años transformando sonrisas",
    "home.why.patients": "1500+ pacientes",
    "home.why.patientsText": "Satisfechos en Barranquilla",
    "home.why.tech": "Tecnología",
    "home.why.techText": "Equipos de última generación",
    "home.why.ratingText": "Calificación promedio",
    "home.gallerySubtitle": "Lo que dicen nuestros pacientes",
    "home.testimonialsSubtitle": "Lo que dicen nuestros pacientes",
    "home.visitUs": "Visítanos",
    "home.location": "Estamos en Barranquilla",
    "home.locationText": "Te esperamos en nuestro consultorio para brindarte la mejor atención odontológica.",
    "home.ctaTitle": "¿Listo para una nueva sonrisa?",
    "home.ctaText": "Agenda tu valoración hoy mismo y recibe asesoría personalizada.",
    "gallery.empty": "Próximamente más casos.",
    "blog.readMore": "Leer más →",
    "blog.close": "Cerrar",
    "appt.confirmSoon": "Te confirmaremos por WhatsApp pronto.",
    "appt.fillAll": "Completa todos los campos.",
    "about.uni": "Universidad El Bosque",
    "about.uniDesc": "Odontología",
    "about.years": "12+ años",
    "about.yearsDesc": "Práctica clínica",
    "about.specialist": "Especialista",
    "about.specialistDesc": "Rehabilitación oral",
    "about.certified": "Certificado",
    "about.certifiedDesc": "Flowable Injection",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "Dr. Diego",
    "nav.services": "Services",
    "nav.gallery": "Gallery",
    "nav.testimonials": "Testimonials",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.appointment": "Book Appointment",
    "cta.book": "Book your appointment",
    "cta.contact": "Contact us",
    "cta.learnMore": "Learn more",
    "cta.viewAll": "View all",
    "cta.sendWhatsapp": "Send via WhatsApp",
    "cta.quote": "Quote via WhatsApp",
    "hero.tag": "Oral Rehabilitation and Aesthetic Dentistry",
    "hero.title": "We transform smiles, we change lives",
    "hero.subtitle":
      "Specialists in Flowable Injection Technique, orthodontics, implants and advanced aesthetic dentistry in Barranquilla.",
    "about.title": "Dr. Diego Pallares",
    "about.role": "Dentist · Oral Rehabilitator",
    "about.bioShort":
      "Over 12 years transforming smiles with minimally invasive techniques and natural results.",
    "about.vision": "Vision",
    "about.visionText":
      "To be a benchmark in oral rehabilitation and aesthetic dentistry in the Colombian Caribbean, offering world-class treatments with human warmth.",
    "about.experience": "Experience",
    "about.credentials": "Credentials",
    "services.title": "Our Services",
    "services.subtitle": "Treatments tailored to your ideal smile",
    "gallery.title": "Before and After",
    "gallery.subtitle": "Real results from real patients",
    "testimonials.title": "What our patients say",
    "blog.title": "Blog & Tips",
    "blog.subtitle": "Learn how to care for your smile",
    "contact.title": "Contact us",
    "contact.subtitle": "We're here to help",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.message": "Message",
    "contact.send": "Send message",
    "contact.address": "Address",
    "contact.phones": "Phones",
    "appt.title": "Book your appointment",
    "appt.subtitle": "Confirm your date in minutes",
    "appt.fullname": "Full name",
    "appt.idnum": "ID number",
    "appt.whatsapp": "WhatsApp",
    "appt.date": "Date",
    "appt.time": "Time",
    "appt.service": "Service",
    "appt.notes": "Notes",
    "appt.submit": "Request appointment",
    "appt.success": "Appointment requested! We'll contact you via WhatsApp.",
    "appt.taken": "That slot is already booked. Please pick another.",
    "footer.rights": "All rights reserved.",
    "footer.tagline": "Your smile, our passion.",
    "common.from": "From",
    "common.loading": "Loading...",
    "stats.patients": "Happy patients",
    "stats.years": "Years of experience",
    "stats.treatments": "Treatments performed",
    "stats.rating": "Rating",
    "lang.es": "Español",
    "lang.en": "English",
  },
} as const;

type Key = keyof (typeof dict)["es"];

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  useEffect(() => {
    const stored = localStorage.getItem("dp-lang") as Lang | null;
    if (stored === "es" || stored === "en") setLangState(stored);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("dp-lang", l);
    document.documentElement.lang = l;
  };
  const t = (k: Key) => dict[lang][k] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}
