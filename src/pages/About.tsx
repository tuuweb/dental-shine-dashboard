import { motion } from "framer-motion";
import { Award, GraduationCap, Briefcase, Heart } from "lucide-react";
import { useI18n } from "@/i18n";
import drDiego from "@/assets/dr-diego.png";
import { ChevronArt } from "@/components/ChevronArt";

export function About() {
  const { t } = useI18n();
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
          <div className="absolute inset-0 -z-10">
            <ChevronArt className="absolute -right-20 -top-10 w-[120%] opacity-20"/>
          </div>
          <div className="relative aspect-square max-w-md">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-primary-dark"/>
            <img src={drDiego} alt="Dr. Diego Pallares" className="relative w-full h-full object-contain object-bottom"/>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("about.role")}</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">{t("about.title")}</h1>
          <p className="text-lg text-muted-foreground mt-4">{t("about.bioShort")}</p>
          <div className="mt-6 p-6 card-soft">
            <div className="flex items-center gap-2 text-primary"><Heart size={20}/><h3 className="font-semibold">{t("about.vision")}</h3></div>
            <p className="text-sm text-muted-foreground mt-2">{t("about.visionText")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[
              { icon: <GraduationCap/>, title: t("about.uni"), d: t("about.uniDesc") },
              { icon: <Briefcase/>, title: t("about.years"), d: t("about.yearsDesc") },
              { icon: <Award/>, title: t("about.specialist"), d: t("about.specialistDesc") },
              { icon: <Award/>, title: t("about.certified"), d: t("about.certifiedDesc") },
            ].map((c) => (
              <div key={c.title} className="card-soft p-4">
                <div className="text-primary mb-1">{c.icon}</div>
                <div className="font-semibold text-sm">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.d}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
