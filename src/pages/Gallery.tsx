import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { useAppData } from "@/contexts/AppDataContext";

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
            <GalleryCard key={g.id} item={g} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ item, delay }: { item: { title: string; before: string; after: string; treatment: string }; delay: number }) {
  const [show, setShow] = useState<"before" | "after">("after");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="card-soft overflow-hidden"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <img src={show === "before" ? item.before : item.after} alt={`${item.title} ${show}`} className="w-full h-full object-cover transition-opacity" />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase">
          {show === "before" ? "Antes" : "Después"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{item.treatment}</p>
        <div className="mt-3 flex rounded-full bg-muted p-1 text-xs">
          <button onClick={() => setShow("before")} className={`flex-1 py-1.5 rounded-full font-medium ${show === "before" ? "bg-primary text-primary-foreground" : ""}`}>Antes</button>
          <button onClick={() => setShow("after")} className={`flex-1 py-1.5 rounded-full font-medium ${show === "after" ? "bg-primary text-primary-foreground" : ""}`}>Después</button>
        </div>
      </div>
    </motion.div>
  );
}
