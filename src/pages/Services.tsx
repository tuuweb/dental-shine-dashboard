import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { useAppData, waLink } from "@/contexts/AppDataContext";

export function Services() {
  const { t, lang } = useI18n();
  const { data } = useAppData();
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{t("services.title")}</h1>
          <p className="text-muted-foreground mt-3">{t("services.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-soft p-6 flex flex-col relative overflow-hidden isolate"
            >
              {s.image && (
                <>
                  <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover -z-10" aria-hidden/>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/85 via-card/90 to-card/95" aria-hidden/>
                </>
              )}
              <div className="text-5xl mb-3">{s.icon}</div>
              <h3 className="text-xl font-semibold">{lang === "es" ? s.name : s.nameEn}</h3>
              <p className="text-sm text-muted-foreground mt-2 flex-1">{lang === "es" ? s.description : s.descriptionEn}</p>
              <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                {s.quoteOnly || s.price === 0 ? (
                  <span className="text-sm font-semibold text-muted-foreground">{t("common.quote")}</span>
                ) : (
                  <span className="text-lg font-bold text-primary">${s.price.toLocaleString("es-CO")}</span>
                )}
                <a
                  href={waLink(`Hola Dr. Diego, quiero cotizar ${s.name}.`)}
                  target="_blank" rel="noreferrer"
                  className="btn-primary text-xs"
                >{t("cta.quote")}</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
