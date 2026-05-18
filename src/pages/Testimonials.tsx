import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAppData } from "@/contexts/AppDataContext";

export function Testimonials() {
  const { t } = useI18n();
  const { data } = useAppData();
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{t("testimonials.title")}</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.testimonials.map((tt, i) => (
            <motion.div
              key={tt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-soft p-6 relative"
            >
              <Quote className="absolute top-4 right-4 text-primary/20" size={36}/>
              <div className="flex gap-1 mb-3 text-yellow-500">
                {Array.from({ length: tt.rating }).map((_, j) => <Star key={j} size={16} fill="currentColor"/>)}
              </div>
              <p className="text-sm text-foreground italic">"{tt.text}"</p>
              <div className="mt-5 pt-4 border-t border-border">
                <div className="font-semibold text-sm">{tt.name}</div>
                <div className="text-xs text-muted-foreground">{tt.treatment}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
