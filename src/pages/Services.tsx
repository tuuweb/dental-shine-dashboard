import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { useAppData, waLink } from "@/contexts/AppDataContext";
import { ToothIcon } from "@/components/ToothLoader";
import { ArrowRight } from "lucide-react";

export function Services() {
  const { t, lang } = useI18n();
  const { data } = useAppData();
  const [activeCat, setActiveCat] = useState<string | "all">("all");

  const grouped = useMemo(() => {
    const byCat = new Map<string, typeof data.services>();
    data.services.forEach((s) => {
      const k = s.categoryId || "uncat";
      if (!byCat.has(k)) byCat.set(k, [] as typeof data.services);
      byCat.get(k)!.push(s);
    });
    return byCat;
  }, [data.services]);

  const visibleCats = data.serviceCategories.filter((c) => activeCat === "all" || c.id === activeCat);

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">{t("services.title")}</h1>
          <p className="text-muted-foreground mt-3">{t("services.subtitle")}</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <CategoryChip active={activeCat === "all"} onClick={() => setActiveCat("all")}>Todos</CategoryChip>
          {data.serviceCategories.map((c) => (
            <CategoryChip key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
              {lang === "es" ? c.name : c.nameEn}
            </CategoryChip>
          ))}
        </div>

        {visibleCats.map((cat) => {
          const items = grouped.get(cat.id) || [];
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="mb-16">
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  <span className="inline-block w-1.5 h-8 bg-primary rounded-full mr-3 align-middle" />
                  {lang === "es" ? cat.name : cat.nameEn}
                </h2>
                <div className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? "servicio" : "servicios"}</div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="card-soft overflow-hidden group flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 via-primary-light/10 to-accent">
                      {s.image ? (
                        <img src={s.image} alt={s.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <ToothIcon size={180} className="absolute inset-0 m-auto text-primary/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        <span className="text-base leading-none">{s.icon}</span>
                        {lang === "es" ? cat.name : cat.nameEn}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-bold leading-tight drop-shadow">{lang === "es" ? s.name : s.nameEn}</h3>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground line-clamp-3">{lang === "es" ? s.description : s.descriptionEn}</p>
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        {s.quoteOnly || s.price === 0 ? (
                          <span className="text-sm font-semibold text-muted-foreground">{t("common.quote")}</span>
                        ) : (
                          <span className="text-lg font-bold text-primary">${s.price.toLocaleString("es-CO")}</span>
                        )}
                        <Link to={`/servicios/${s.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                          Ver más <ArrowRight size={14} />
                        </Link>
                      </div>
                      <a
                        href={waLink(`Hola Dr. Diego, quiero cotizar ${s.name}.`)}
                        target="_blank" rel="noreferrer"
                        className="btn-primary text-xs mt-3 justify-center"
                      >{t("cta.quote")}</a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function CategoryChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${active ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-accent"}`}
    >
      {children}
    </button>
  );
}
