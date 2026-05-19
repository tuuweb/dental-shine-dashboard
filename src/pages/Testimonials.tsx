import { motion } from "framer-motion";
import { Play, Instagram, Star } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAppData } from "@/contexts/AppDataContext";
import { ToothIcon } from "@/components/ToothLoader";

export function Testimonials() {
  const { t } = useI18n();
  const { data } = useAppData();
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{t("testimonials.title")}</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {data.testimonials.map((tt, i) => {
            const href = tt.instagramUrl || "#";
            const isLink = !!tt.instagramUrl;
            return (
              <motion.a
                key={tt.id}
                href={href}
                target={isLink ? "_blank" : undefined}
                rel={isLink ? "noreferrer" : undefined}
                onClick={(e) => { if (!isLink) e.preventDefault(); }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden card-soft block"
              >
                {tt.thumbnail ? (
                  <img src={tt.thumbnail} alt={tt.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary-light/20 to-accent grid place-items-center">
                    <ToothIcon size={80} className="text-primary/40"/>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
                <div className="absolute top-3 right-3 bg-white/95 text-primary p-1.5 rounded-full">
                  <Instagram size={14}/>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/95 grid place-items-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play size={22} className="text-primary ml-0.5" fill="currentColor"/>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="flex gap-0.5 mb-1 text-yellow-400">
                    {Array.from({ length: tt.rating }).map((_, j) => <Star key={j} size={11} fill="currentColor"/>)}
                  </div>
                  <div className="font-semibold text-sm leading-tight">{tt.name}</div>
                  <div className="text-[11px] opacity-80">{tt.treatment}</div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
