import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Award, Users, Calendar, MapPin, Phone, Mail, ArrowRight, Play, Instagram } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAppData, waLink, EMAIL, PHONE_MOBILE, ADDRESS, MAPS } from "@/contexts/AppDataContext";
import { ChevronArt } from "@/components/ChevronArt";
import { ToothIcon } from "@/components/ToothLoader";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import drDiego from "@/assets/dr-diego.png";


export function Home() {
  const { t, lang } = useI18n();
  const { data } = useAppData();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/40" />
        </div>
        <ChevronArt className="chevron-corner hidden md:block" />
        <div className="mx-auto max-w-7xl px-4 pt-12 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-2 gap-10 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-foreground">Dr. Diego Pallares</span>
              <br/>
              <span className="text-gradient">{t("hero.title")}</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/agendar" className="btn-primary"><Calendar size={18}/> {t("cta.book")}</Link>
              <Link to="/servicios" className="btn-outline">{t("cta.learnMore")}</Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: "1500+", l: t("stats.patients") },
                { n: "12+", l: t("stats.years") },
                { n: "4.9★", l: t("stats.rating") },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl md:text-3xl font-bold text-primary">{s.n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light/30 to-primary/20 blur-3xl" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-primary-dark" />
              <img
                src={drDiego}
                alt="Dr. Diego Pallares"
                className="relative z-10 w-full h-full object-contain object-bottom float-soft"
              />
              <div className="absolute -bottom-2 -right-2 bg-white card-soft px-4 py-3 z-20 flex items-center gap-2">
                <div className="bg-accent rounded-full p-2 text-primary"><ToothIcon size={20}/></div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("home.specialist")}</div>
                  <div className="text-sm font-semibold">{t("home.specialistArea")}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t("services.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("services.subtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.services.slice(0, 6).map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-soft p-6 group hover:-translate-y-1 transition-transform relative overflow-hidden isolate"
              >
                {s.image ? (
                  <>
                    <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover -z-10" aria-hidden/>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/85 via-card/90 to-card/95" aria-hidden/>
                  </>
                ) : (
                  <ToothIcon size={220} className="absolute -right-10 -bottom-10 text-primary/5 -z-10 rotate-12" aria-hidden/>
                )}
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="text-lg font-semibold">{lang === "es" ? s.name : s.nameEn}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{lang === "es" ? s.description : s.descriptionEn}</p>
                <div className="mt-4 flex items-center justify-between">
                  {s.quoteOnly || s.price === 0 ? (
                    <a href={waLink(`Hola, quiero cotizar ${s.name}`)} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary">{t("cta.quote")} →</a>
                  ) : (
                    <span className="text-sm font-bold text-primary">{t("common.from")} ${s.price.toLocaleString("es-CO")}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/servicios" className="btn-outline">{t("cta.viewAll")}</Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-primary-dark text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <ChevronArt className="w-full h-full" />
        </div>
        <div className="mx-auto max-w-7xl px-4 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.whyUs")}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Award/>, title: t("home.why.experience"), d: t("home.why.experienceText") },
              { icon: <Users/>, title: t("home.why.patients"), d: t("home.why.patientsText") },
              { icon: <CheckCircle2/>, title: t("home.why.tech"), d: t("home.why.techText") },
              { icon: <Star/>, title: "4.9★", d: t("home.why.ratingText") },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-white/10 grid place-items-center mb-3">{f.icon}</div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm opacity-80 mt-1">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">{t("gallery.title")}</h2>
              <p className="text-muted-foreground mt-2">{t("gallery.subtitle")}</p>
            </div>
            <Link to="/galeria" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
              {t("cta.viewAll")} <ArrowRight size={16}/>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ...data.gallery,
              ...data.clients.filter(c => c.beforeImage && c.afterImage).map(c => ({ id: c.id, title: c.name, before: c.beforeImage!, after: c.afterImage!, treatment: c.treatment }))
            ].slice(0, 4).map((g) => (
              <GalleryPreviewCard key={g.id} item={g} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS MARQUEE */}
      <section className="py-20 bg-accent/30 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">{t("testimonials.title")}</h2>
          <p className="text-muted-foreground mt-2">{t("home.testimonialsSubtitle")}</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-accent/60 to-transparent z-10 pointer-events-none"/>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-accent/60 to-transparent z-10 pointer-events-none"/>
          <div className="flex gap-6 marquee-track">
            {[...data.testimonials, ...data.testimonials, ...data.testimonials].map((tt, i) => (
              <div key={i} className="card-soft p-4 md:p-6 w-[46vw] sm:w-[280px] md:w-[380px] shrink-0 relative">
                <Quote className="absolute top-4 right-4 text-primary/20" size={32}/>
                <div className="flex gap-1 mb-3 text-yellow-500">
                  {Array.from({ length: tt.rating }).map((_, j) => <Star key={j} size={14} fill="currentColor"/>)}
                </div>
                <p className="text-sm italic text-foreground line-clamp-4">"{tt.text}"</p>
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="font-semibold text-sm">{tt.name}</div>
                  <div className="text-xs text-muted-foreground">{tt.treatment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-10">
          <Link to="/testimonios" className="btn-outline">{t("cta.viewAll")}</Link>
        </div>
      </section>

      {/* LOCATION + CONTACT */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10 items-stretch">
          <div className="card-soft overflow-hidden">
            <iframe
              title="Ubicación"
              className="w-full h-full min-h-[360px] border-0"
              src="https://www.google.com/maps?q=Cra+43+%23+80-155+Barranquilla&output=embed"
              loading="lazy"
            />
          </div>
          <div className="card-soft p-8 md:p-10 flex flex-col">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary-dark uppercase tracking-wider w-fit">
              <MapPin size={13}/> {t("home.visitUs")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">{t("home.location")}</h2>
            <p className="text-muted-foreground mt-3">{t("home.locationText")}</p>
            <div className="mt-6 space-y-3">
              <a href={MAPS} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition">
                <div className="bg-accent text-primary p-2.5 rounded-lg"><MapPin size={18}/></div>
                <div><div className="text-xs text-muted-foreground">{t("contact.address")}</div><div className="font-semibold text-sm">{ADDRESS}</div></div>
              </a>
              <a href="tel:+573014276409" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition">
                <div className="bg-accent text-primary p-2.5 rounded-lg"><Phone size={18}/></div>
                <div><div className="text-xs text-muted-foreground">{t("contact.phone")}</div><div className="font-semibold text-sm">{PHONE_MOBILE}</div></div>
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition">
                <div className="bg-accent text-primary p-2.5 rounded-lg"><Mail size={18}/></div>
                <div><div className="text-xs text-muted-foreground">{t("contact.email")}</div><div className="font-semibold text-sm">{EMAIL}</div></div>
              </a>
            </div>
            <div className="mt-auto pt-6 flex flex-wrap gap-3">
              <Link to="/contacto" className="btn-primary"><Mail size={16}/> {t("cta.contact")}</Link>
              <Link to="/agendar" className="btn-outline"><Calendar size={16}/> {t("cta.book")}</Link>
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center card-soft p-10 md:p-16">
          <ToothIcon size={48} className="text-primary mx-auto mb-4 tooth-bounce"/>
          <h2 className="text-3xl md:text-4xl font-bold">{t("home.ctaTitle")}</h2>
          <p className="text-muted-foreground mt-3">{t("home.ctaText")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/agendar" className="btn-primary"><Calendar size={18}/> {t("cta.book")}</Link>
            <Link to="/contacto" className="btn-outline">{t("cta.contact")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
