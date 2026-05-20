import { useMemo, useState } from "react";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAppData, type Appointment } from "@/contexts/AppDataContext";

export function Appointment() {
  const { t, lang } = useI18n();
  const { data, set } = useAppData();
  const [form, setForm] = useState({ name: "", whatsapp: "", service: data.services[0]?.id ?? "", date: "", time: "", notes: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const weekday = form.date ? new Date(form.date + "T12:00:00").getDay() : -1;
  const slotsForDay = weekday >= 0 ? (data.schedule?.[weekday] ?? []) : [];

  const takenSlots = useMemo(() => {
    return new Set(
      data.appointments
        .filter((a) => a.status !== "rejected" && a.date === form.date)
        .map((a) => a.time)
    );
  }, [data.appointments, form.date]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.whatsapp || !form.date || !form.time) {
      setError(t("appt.fillAll"));
      return;
    }
    const exists = data.appointments.some((a) => a.status !== "rejected" && a.date === form.date && a.time === form.time);
    if (exists) { setError(t("appt.taken")); return; }

    const appt: Appointment = {
      id: crypto.randomUUID(),
      name: form.name,
      whatsapp: form.whatsapp,
      service: data.services.find((s) => s.id === form.service)?.name ?? form.service,
      date: form.date,
      time: form.time,
      notes: form.notes,
      status: "pending",
      createdAt: Date.now(),
    };
    set("appointments", [...data.appointments, appt]);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="py-20 mx-auto max-w-xl px-4 text-center">
        <div className="card-soft p-10">
          <CheckCircle2 className="text-primary mx-auto" size={64}/>
          <h2 className="text-2xl font-bold mt-4">{t("appt.success")}</h2>
          <p className="text-muted-foreground mt-2">{t("appt.confirmSoon")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">{t("appt.title")}</h1>
          <p className="text-muted-foreground mt-3">{t("appt.subtitle")}</p>
        </div>
        <form onSubmit={submit} className="card-soft p-6 md:p-8 grid md:grid-cols-2 gap-4">
          <Field label={t("appt.fullname")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label={t("appt.whatsapp")} value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="+57 300 0000000" />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">{t("appt.service")}</label>
            <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm">
              {data.services.map((s) => <option key={s.id} value={s.id}>{lang === "es" ? s.name : s.nameEn}</option>)}
            </select>
          </div>
          <Field label={t("appt.date")} type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v, time: "" })} min={new Date().toISOString().slice(0, 10)} />
          <div>
            <label className="text-sm font-medium mb-1 flex items-center gap-1"><Clock size={14}/> {t("appt.time")}</label>
            {!form.date ? (
              <p className="text-xs text-muted-foreground py-2">Selecciona primero una fecha.</p>
            ) : slotsForDay.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No hay horarios disponibles ese día.</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5">
                {slotsForDay.map((h) => {
                  const disabled = takenSlots.has(h);
                  const active = form.time === h;
                  return (
                    <button type="button" key={h} disabled={disabled} onClick={() => setForm({ ...form, time: h })}
                      className={`text-xs py-2 rounded-lg font-medium ${active ? "bg-primary text-primary-foreground" : disabled ? "bg-muted text-muted-foreground line-through cursor-not-allowed" : "border border-border hover:bg-accent"}`}>
                      {h}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">{t("appt.notes")}</label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
          </div>
          {error && <p className="md:col-span-2 text-sm text-destructive">{error}</p>}
          <button type="submit" className="btn-primary md:col-span-2"><Calendar size={18}/> {t("appt.submit")}</button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, min }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; min?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} value={value} placeholder={placeholder} min={min} maxLength={255} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/>
    </div>
  );
}
