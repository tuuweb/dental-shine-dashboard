import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Award, Users, Calendar, Sparkles, Quote, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAppData, waLink, EMAIL, PHONE_MOBILE, ADDRESS, MAPS } from "@/contexts/AppDataContext";
import { ChevronArt } from "@/components/ChevronArt";
import { ToothIcon } from "@/components/ToothLoader";
import drDiego from "@/assets/dr-diego.png";

function GalleryPreviewCard({ item }: { item: { title: string; before: string; after: string; treatment: string } }) {
  const [show, setShow] = useState<"before" | "after">("after");
  return (
    <div className="card-soft overflow-hidden group">
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <img src={show === "before" ? item.before : item.after} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105"/>
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider">
          {show === "before" ? "Antes" : "Después"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{item.treatment}</p>
        <div className="mt-3 flex rounded-full bg-muted p-1 text-[11px]">
          <button onClick={() => setShow("before")} className={`flex-1 py-1 rounded-full font-medium transition ${show === "before" ? "bg-primary text-primary-foreground" : ""}`}>Antes</button>
          <button onClick={() => setShow("after")} className={`flex-1 py-1 rounded-full font-medium transition ${show === "after" ? "bg-primary text-primary-foreground" : ""}`}>Después</button>
        </div>
      </div>
    </div>
  );
}

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
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-primary-dark uppercase tracking-wider">
              <Sparkles size={14}/> {t("hero.tag")}
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
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
                  <div className="text-xs text-muted-foreground">Especialista</div>
                  <div className="text-sm font-semibold">Rehabilitación Oral</div>
                </div>
              </div>
              <div className="absolute -top-2 -left-2 bg-white card-soft px-4 py-3 z-20 flex items-center gap-2">
                <Award className="text-primary" size={22}/>
                <div>
                  <div className="text-xs text-muted-foreground">{t("stats.rating")}</div>
                  <div className="text-sm font-semibold">4.9 / 5.0</div>
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
                className="card-soft p-6 group hover:-translate-y-1 transition-transform"
              >
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Award/>, t: "Experiencia", d: "12+ años transformando sonrisas" },
              { icon: <Users/>, t: "1500+ pacientes", d: "Satisfechos en Barranquilla" },
              { icon: <CheckCircle2/>, t: "Tecnología", d: "Equipos de última generación" },
              { icon: <Star/>, t: "4.9★", d: "Calificación promedio" },
            ].map((f) => (
              <div key={f.t} className="text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-white/10 grid place-items-center mb-3">{f.icon}</div>
                <div className="font-semibold">{f.t}</div>
                <div className="text-sm opacity-80 mt-1">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center card-soft p-10 md:p-16">
          <ToothIcon size={48} className="text-primary mx-auto mb-4 tooth-bounce"/>
          <h2 className="text-3xl md:text-4xl font-bold">¿Listo para una nueva sonrisa?</h2>
          <p className="text-muted-foreground mt-3">Agenda tu valoración hoy mismo y recibe asesoría personalizada.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/agendar" className="btn-primary"><Calendar size={18}/> {t("cta.book")}</Link>
            <Link to="/contacto" className="btn-outline">{t("cta.contact")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
