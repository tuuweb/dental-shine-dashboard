import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Play } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAppData } from "@/contexts/AppDataContext";
import { VideoEmbed } from "@/components/VideoEmbed";

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
          {data.blog.map((p, i) => {
            const isOpen = open === p.id;
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-soft overflow-hidden flex flex-col"
              >
                {(p.image || (p.images && p.images[0])) && (
                  <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                    <img src={p.image || p.images![0]} alt={p.title} className="w-full h-full object-cover"/>
                    {p.videoUrl && (
                      <div className="absolute inset-0 grid place-items-center bg-black/30">
                        <div className="h-14 w-14 rounded-full bg-white/95 grid place-items-center">
                          <Play size={22} className="text-primary ml-0.5" fill="currentColor"/>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12}/> {p.date}</div>
                  <h3 className="text-lg font-semibold mt-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 flex-1">{isOpen ? p.content : p.excerpt}</p>

                  {isOpen && p.videoUrl && (
                    <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-black">
                      <VideoEmbed url={p.videoUrl}/>
                    </div>
                  )}
                  {isOpen && p.images && p.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {p.images.slice(1).map((img, idx) => (
                        <img key={idx} src={img} alt="" className="aspect-square object-cover rounded-lg"/>
                      ))}
                    </div>
                  )}

                  <button onClick={() => setOpen(isOpen ? null : p.id)} className="text-xs font-semibold text-primary mt-4 self-start">
                    {isOpen ? t("blog.close") : t("blog.readMore")}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
