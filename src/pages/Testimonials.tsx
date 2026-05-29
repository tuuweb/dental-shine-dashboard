import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, Camera, X, Instagram, Play } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAppData, type Testimonial } from "@/contexts/AppDataContext";
import { VideoModalTrigger } from "@/components/VideoEmbed";

export function Testimonials() {
  const { t } = useI18n();
  const { data, set } = useAppData();
  const approved = data.testimonials.filter((tt) => (tt.status ?? "approved") === "approved");
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">{t("testimonials.title")}</h1>
          <p className="text-muted-foreground mt-3">Opiniones reales de quienes ya transformaron su sonrisa</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-6">
            <Send size={16}/> Deja tu opinión
          </button>
        </div>

        {/* Reels grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {approved.filter((tt) => tt.instagramUrl || tt.thumbnail).map((tt, i) => {
            const isLink = !!tt.instagramUrl;
            return (
              <motion.a
                key={tt.id}
                href={tt.instagramUrl || "#"}
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
                  <img src={tt.thumbnail} alt={tt.name} className="absolute inset-0 w-full h-full object-cover"/>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary-light/20 to-accent"/>
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
                  <div className="font-semibold text-sm">{tt.name}</div>
                  <div className="text-[11px] opacity-80">{tt.treatment}</div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Text testimonials */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {approved.filter((tt) => !tt.instagramUrl && !tt.thumbnail).map((tt, i) => (
            <motion.div
              key={tt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-soft p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                {tt.avatar ? (
                  <img src={tt.avatar} alt={tt.name} className="h-12 w-12 rounded-full object-cover"/>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-accent text-primary grid place-items-center font-bold text-lg">
                    {tt.name[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{tt.name}</div>
                  <div className="flex gap-0.5 text-yellow-500">
                    {Array.from({ length: tt.rating }).map((_, j) => <Star key={j} size={12} fill="currentColor"/>)}
                  </div>
                </div>
              </div>
              <p className="text-sm italic text-muted-foreground">"{tt.text}"</p>
              {tt.treatment && <div className="text-xs text-primary mt-3 font-medium">{tt.treatment}</div>}
            </motion.div>
          ))}
        </div>

        {showForm && (
          <TestimonialForm
            onClose={() => { setShowForm(false); setSent(false); }}
            sent={sent}
            onSubmit={(t) => {
              set("testimonials", [...data.testimonials, t]);
              setSent(true);
            }}
          />
        )}
      </div>
    </div>
  );
}

function TestimonialForm({ onClose, onSubmit, sent }: { onClose: () => void; onSubmit: (t: Testimonial) => void; sent: boolean }) {
  const [f, setF] = useState({ name: "", text: "", rating: 5, treatment: "", avatar: "" as string | undefined });
  const submit = () => {
    if (!f.name.trim() || !f.text.trim()) return;
    onSubmit({
      id: crypto.randomUUID(),
      name: f.name.trim(),
      text: f.text.trim(),
      rating: f.rating,
      treatment: f.treatment.trim(),
      avatar: f.avatar,
      status: "pending",
      createdAt: Date.now(),
    });
  };
  const upload = (file: File) => {
    const r = new FileReader();
    r.onload = () => setF((s) => ({ ...s, avatar: r.result as string }));
    r.readAsDataURL(file);
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Tu opinión</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent"><X size={16}/></button>
        </div>
        {sent ? (
          <div className="py-8 text-center">
            <div className="text-5xl mb-3">✨</div>
            <h4 className="font-bold text-lg">¡Gracias por tu opinión!</h4>
            <p className="text-sm text-muted-foreground mt-2">Aparecerá publicada una vez sea revisada.</p>
            <button onClick={onClose} className="btn-primary mt-5">Cerrar</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tratamiento (opcional)</label>
              <input value={f.treatment} onChange={(e) => setF({ ...f, treatment: e.target.value })} placeholder="Ej. Blanqueamiento" className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Calificación</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setF({ ...f, rating: n })}>
                    <Star size={28} className={n <= f.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}/>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comentario *</label>
              <textarea value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} rows={4} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Foto de perfil (opcional)</label>
              <div className="flex items-center gap-3">
                {f.avatar ? (
                  <div className="relative">
                    <img src={f.avatar} alt="" className="h-14 w-14 rounded-full object-cover"/>
                    <button onClick={() => setF({ ...f, avatar: undefined })} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"><X size={10}/></button>
                  </div>
                ) : (
                  <div className="h-14 w-14 rounded-full bg-accent grid place-items-center text-primary"><Camera size={20}/></div>
                )}
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(file); }} className="text-xs"/>
              </div>
            </div>
            <button onClick={submit} className="btn-primary w-full mt-3">
              <Send size={16}/> Enviar opinión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
