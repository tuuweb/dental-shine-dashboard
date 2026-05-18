import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAppData } from "@/contexts/AppDataContext";

export function Blog() {
  const { t } = useI18n();
  const { data } = useAppData();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{t("blog.title")}</h1>
          <p className="text-muted-foreground mt-3">{t("blog.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.blog.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-soft p-6 cursor-pointer hover:-translate-y-1 transition-transform"
              onClick={() => setOpen(open === p.id ? null : p.id)}
            >
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12}/> {p.date}</div>
              <h3 className="text-lg font-semibold mt-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{open === p.id ? p.content : p.excerpt}</p>
              <button className="text-xs font-semibold text-primary mt-3">{open === p.id ? t("blog.close") : t("blog.readMore")}</button>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
