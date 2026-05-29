import { motion } from "framer-motion";
import { Award, GraduationCap, Briefcase, Heart, CheckCircle2 } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";
import drDiego from "@/assets/dr-diego.png";
import { ChevronArt } from "@/components/ChevronArt";

export function About() {
  const { data } = useAppData();
  const d = data.doctorInfo;
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
          <div className="absolute inset-0 -z-10">
            <ChevronArt className="absolute -right-20 -top-10 w-[120%] opacity-20"/>
          </div>
          <div className="relative aspect-square max-w-md">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-primary-dark"/>
            <img src={drDiego} alt={d.name} className="relative w-full h-full object-contain object-bottom"/>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-accent px-3 py-1 rounded-full">
            {d.specialty} · {d.yearsExperience} años de experiencia
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3">{d.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{d.role}</p>
          <p className="text-lg text-muted-foreground mt-4">{d.bioShort}</p>
          <p className="text-sm leading-relaxed mt-3">{d.bioLong}</p>
          <div className="mt-6 p-6 card-soft">
            <div className="flex items-center gap-2 text-primary"><Heart size={20}/><h3 className="font-semibold">Visión</h3></div>
            <p className="text-sm text-muted-foreground mt-2">{d.vision}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="card-soft p-4">
              <div className="text-primary mb-1"><GraduationCap/></div>
              <div className="font-semibold text-sm">{d.university}</div>
              <div className="text-xs text-muted-foreground">Odontología</div>
            </div>
            <div className="card-soft p-4">
              <div className="text-primary mb-1"><Briefcase/></div>
              <div className="font-semibold text-sm">{d.yearsExperience} años</div>
              <div className="text-xs text-muted-foreground">Práctica clínica</div>
            </div>
            {d.certifications.slice(0, 2).map((c) => (
              <div key={c} className="card-soft p-4">
                <div className="text-primary mb-1"><Award/></div>
                <div className="font-semibold text-sm">Certificación</div>
                <div className="text-xs text-muted-foreground">{c}</div>
              </div>
            ))}
          </div>
          {d.certifications.length > 0 && (
            <ul className="mt-6 space-y-1.5 text-sm">
              {d.certifications.map((c) => (
                <li key={c} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary"/> {c}</li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
