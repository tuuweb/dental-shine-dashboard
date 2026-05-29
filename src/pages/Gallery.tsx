import { useMemo } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAppData } from "@/contexts/AppDataContext";
import { VideoModalTrigger } from "@/components/VideoEmbed";
import { ToothIcon } from "@/components/ToothLoader";

export function Gallery() {
  const { t } = useI18n();
  const { data } = useAppData();

  const grouped = useMemo(() => {
    const byCat = new Map<string, typeof data.gallery>();
    data.gallery.forEach((g) => {
      const k = g.categoryId || "uncat";
      if (!byCat.has(k)) byCat.set(k, [] as typeof data.gallery);
      byCat.get(k)!.push(g);
    });
    return byCat;
  }, [data.gallery]);

  const hasItems = data.gallery.length > 0;

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{t("gallery.title")}</h1>
          <p className="text-muted-foreground mt-3">Casos reales organizados por tipo de tratamiento</p>
        </div>

        {!hasItems && <p className="text-muted-foreground text-center">{t("gallery.empty")}</p>}

        {data.galleryCategories.map((cat) => {
          const items = grouped.get(cat.id) || [];
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                <span className="inline-block w-1.5 h-8 bg-primary rounded-full mr-3 align-middle" />
                {cat.name}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((g, i) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="card-soft overflow-hidden group"
                  >
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      {g.image ? (
                        <img src={g.image} alt={g.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                      ) : g.before ? (
                        <img src={g.before} alt={g.title} className="absolute inset-0 w-full h-full object-cover"/>
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/10 to-accent">
                          <ToothIcon size={100} className="text-primary/30"/>
                        </div>
                      )}
                      {g.videoUrl && <VideoModalTrigger url={g.videoUrl} />}
                      {g.videoUrl && (
                        <span className="absolute top-3 right-3 bg-primary/90 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Play size={10} fill="currentColor"/> Video
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{g.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{g.treatment}</p>
                      {g.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{g.description}</p>}
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
