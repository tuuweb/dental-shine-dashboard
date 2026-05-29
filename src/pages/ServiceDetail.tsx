import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, CheckCircle2 } from "lucide-react";
import { useAppData, waLink } from "@/contexts/AppDataContext";
import { useI18n } from "@/i18n";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ToothIcon } from "@/components/ToothLoader";

export function ServiceDetail() {
  const { id } = useParams();
  const { data } = useAppData();
  const { lang } = useI18n();
  const service = data.services.find((s) => s.id === id);
  if (!service) return <Navigate to="/servicios" replace />;
  const cat = data.serviceCategories.find((c) => c.id === service.categoryId);
  const images = [service.image, ...(service.images || [])].filter(Boolean) as string[];

  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <Link to="/servicios" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={14}/> Todos los servicios
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent">
              {images[0] ? (
                <img src={images[0]} alt={service.name} className="absolute inset-0 w-full h-full object-cover"/>
              ) : (
                <ToothIcon size={200} className="absolute inset-0 m-auto text-primary/25"/>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt="" className="aspect-square object-cover rounded-lg"/>
                ))}
              </div>
            )}
            {service.videoUrl && (
              <div className="mt-4 aspect-video rounded-2xl overflow-hidden bg-black">
                <VideoEmbed url={service.videoUrl}/>
              </div>
            )}
          </div>

          <div>
            {cat && (
              <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {lang === "es" ? cat.name : cat.nameEn}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mt-3 flex items-center gap-3">
              <span className="text-4xl">{service.icon}</span>
              {lang === "es" ? service.name : service.nameEn}
            </h1>
            <p className="text-muted-foreground mt-4">{lang === "es" ? service.description : service.descriptionEn}</p>
            {(service.longDescription || service.longDescriptionEn) && (
              <p className="mt-4 text-sm leading-relaxed">
                {lang === "es" ? (service.longDescription || "") : (service.longDescriptionEn || service.longDescription || "")}
              </p>
            )}
            <div className="mt-6 card-soft p-5">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Inversión</div>
              {service.quoteOnly || service.price === 0 ? (
                <div className="text-2xl font-bold text-primary mt-1">Cotización personalizada</div>
              ) : (
                <div className="text-3xl font-bold text-primary mt-1">Desde ${service.price.toLocaleString("es-CO")}</div>
              )}
              <ul className="mt-4 space-y-1.5 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary"/> Evaluación inicial sin costo</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary"/> Plan de tratamiento a medida</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary"/> Financiación disponible</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={waLink(`Hola Dr. Diego, quiero más información sobre ${service.name}.`)} target="_blank" rel="noreferrer" className="btn-primary text-sm">
                  <MessageCircle size={16}/> Cotizar por WhatsApp
                </a>
                <Link to="/agendar" className="btn-outline text-sm">Agendar cita</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
