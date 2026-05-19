import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { useAppData } from "@/contexts/AppDataContext";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

export function Gallery() {
  const { t } = useI18n();
  const { data } = useAppData();
  const items = [
    ...data.gallery,
    ...data.clients
      .filter((c) => c.beforeImage && c.afterImage)
      .map((c) => ({ id: c.id, title: c.name, before: c.beforeImage!, after: c.afterImage!, treatment: c.treatment })),
  ];

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{t("gallery.title")}</h1>
          <p className="text-muted-foreground mt-3">{t("gallery.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 && <p className="text-muted-foreground text-center col-span-full">{t("gallery.empty")}</p>}
          {items.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-soft overflow-hidden"
            >
              <BeforeAfterSlider before={g.before} after={g.after} alt={g.title} className="aspect-[4/3] bg-muted"/>
              <div className="p-4">
                <h3 className="font-semibold">{g.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{g.treatment}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
