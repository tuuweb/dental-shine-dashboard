import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useI18n } from "@/i18n";
import { EMAIL, ADDRESS, PHONE_MOBILE, MAPS, waLink } from "@/contexts/AppDataContext";

export function Contact() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola Dr. Diego, soy ${form.name} (${form.email} / ${form.phone}). ${form.message}`;
    window.open(waLink(msg), "_blank");
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">{t("contact.title")}</h1>
          <p className="text-muted-foreground mt-3">{t("contact.subtitle")}</p>
          <div className="mt-8 space-y-4">
            <a href={`mailto:${EMAIL}`} className="card-soft p-4 flex items-center gap-3 hover:-translate-y-0.5 transition">
              <div className="bg-accent text-primary p-3 rounded-xl"><Mail/></div>
              <div><div className="text-xs text-muted-foreground">Email</div><div className="font-semibold">{EMAIL}</div></div>
            </a>
            <a href="tel:+573014276409" className="card-soft p-4 flex items-center gap-3 hover:-translate-y-0.5 transition">
              <div className="bg-accent text-primary p-3 rounded-xl"><Phone/></div>
              <div><div className="text-xs text-muted-foreground">{t("contact.phones")}</div><div className="font-semibold">{PHONE_MOBILE} / (5) 342 3347</div></div>
            </a>
            <a href={MAPS} target="_blank" rel="noreferrer" className="card-soft p-4 flex items-center gap-3 hover:-translate-y-0.5 transition">
              <div className="bg-accent text-primary p-3 rounded-xl"><MapPin/></div>
              <div><div className="text-xs text-muted-foreground">{t("contact.address")}</div><div className="font-semibold">{ADDRESS}</div></div>
            </a>
          </div>
          <iframe
            title="Mapa"
            className="mt-6 w-full h-64 rounded-2xl border border-border"
            src="https://www.google.com/maps?q=Cra+43+%23+80-155+Barranquilla&output=embed"
          />
        </div>
        <form onSubmit={submit} className="card-soft p-6 md:p-8 space-y-4 h-fit">
          <Input label={t("contact.name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Input label={t("contact.email")} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Input label={t("contact.phone")} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
          <div>
            <label className="block text-sm font-medium mb-1">{t("contact.message")}</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/>
          </div>
          <button type="submit" className="btn-primary w-full">{t("cta.sendWhatsapp")}</button>
          {sent && <p className="text-sm text-primary text-center">¡Mensaje enviado!</p>}
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} value={value} required={required} maxLength={255} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/>
    </div>
  );
}
