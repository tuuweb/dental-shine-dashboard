import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAppData, type Appointment } from "@/contexts/AppDataContext";

const WEEKDAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  const day = x.getDay(); // 0..6
  // Empezar en lunes
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

function fmtISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function Appointment() {
  const { t, lang } = useI18n();
  const { data, set } = useAppData();
  const [serviceId, setServiceId] = useState(data.services[0]?.id ?? "");
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);
  const [form, setForm] = useState({ name: "", whatsapp: "", notes: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const taken = useMemo(() => {
    const map = new Map<string, Set<string>>();
    data.appointments.filter((a) => a.status !== "rejected").forEach((a) => {
      if (!map.has(a.date)) map.set(a.date, new Set());
      map.get(a.date)!.add(a.time);
    });
    return map;
  }, [data.appointments]);

  const service = data.services.find((s) => s.id === serviceId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selected) { setError("Selecciona una fecha y hora."); return; }
    if (!form.name || !form.whatsapp) { setError(t("appt.fillAll")); return; }
    const exists = data.appointments.some((a) => a.status !== "rejected" && a.date === selected.date && a.time === selected.time);
    if (exists) { setError(t("appt.taken")); return; }

    const appt: Appointment = {
      id: crypto.randomUUID(),
      name: form.name,
      whatsapp: form.whatsapp,
      service: service?.name ?? "",
      date: selected.date,
      time: selected.time,
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

  const weekLabel = `${days[0].getDate()} ${MONTH_SHORT[days[0].getMonth()]} – ${days[6].getDate()} ${MONTH_SHORT[days[6].getMonth()]}`;

  const goPrev = () => {
    const w = new Date(weekStart); w.setDate(w.getDate() - 7);
    if (w >= startOfWeek(today)) setWeekStart(w);
  };
  const goNext = () => {
    const w = new Date(weekStart); w.setDate(w.getDate() + 7);
    setWeekStart(w);
  };

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">{t("appt.title")}</h1>
          <p className="text-muted-foreground mt-3">{t("appt.subtitle")}</p>
        </div>

        {/* Service + price */}
        <div className="card-soft p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Servicio</label>
            <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm">
              {data.services.map((s) => <option key={s.id} value={s.id}>{lang === "es" ? s.name : s.nameEn}</option>)}
            </select>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inversión</div>
            <div className="text-2xl font-bold text-primary mt-0.5">
              {!service || service.quoteOnly || service.price === 0 ? "Cotización" : `Desde $${service.price.toLocaleString("es-CO")}`}
            </div>
          </div>
        </div>

        {/* Weekly calendar */}
        <div className="card-soft overflow-hidden mb-6">
          <div className="flex items-center justify-between p-4 border-b border-border bg-accent/30">
            <button onClick={goPrev} className="p-2 rounded-lg hover:bg-card disabled:opacity-30" disabled={weekStart <= startOfWeek(today)}>
              <ChevronLeft size={18}/>
            </button>
            <div className="text-sm font-semibold flex items-center gap-2"><Calendar size={14}/> {weekLabel}</div>
            <button onClick={goNext} className="p-2 rounded-lg hover:bg-card"><ChevronRight size={18}/></button>
          </div>

          <div className="grid grid-cols-7 text-center">
            {days.map((d) => {
              const past = d < today;
              const isToday = d.getTime() === today.getTime();
              return (
                <div key={d.toISOString()} className={`p-3 border-b border-border ${past ? "opacity-40" : ""}`}>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{WEEKDAY_SHORT[d.getDay()]}</div>
                  <div className={`text-lg font-bold ${isToday ? "text-primary" : ""}`}>{d.getDate()}</div>
                  <div className="text-[10px] text-muted-foreground">{MONTH_SHORT[d.getMonth()]}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7">
            {days.map((d) => {
              const iso = fmtISO(d);
              const slots = data.schedule[d.getDay()] ?? [];
              const takenForDay = taken.get(iso) ?? new Set<string>();
              const past = d < today;
              return (
                <div key={iso} className="p-2 border-r border-border last:border-r-0 space-y-1.5 min-h-[200px]">
                  {past || slots.length === 0 ? (
                    <div className="text-[10px] text-muted-foreground text-center py-4">—</div>
                  ) : (
                    slots.map((h) => {
                      const disabled = takenForDay.has(h);
                      const active = selected?.date === iso && selected?.time === h;
                      return (
                        <button key={h} type="button" disabled={disabled}
                          onClick={() => setSelected({ date: iso, time: h })}
                          className={`block w-full text-[11px] md:text-xs font-semibold py-2 rounded-md transition
                            ${active ? "bg-primary text-primary-foreground shadow-md" :
                              disabled ? "bg-muted text-muted-foreground line-through cursor-not-allowed opacity-60" :
                              "bg-orange-500/90 text-white hover:bg-orange-500"}`}>
                          {h}
                        </button>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selection summary + form */}
        {selected && (
          <form onSubmit={submit} className="card-soft p-6 md:p-8 grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2 bg-accent/40 rounded-xl p-3 text-sm font-semibold text-primary-dark">
              📅 Cita seleccionada: {selected.date} a las {selected.time}
            </div>
            <Field label={t("appt.fullname")} value={form.name} onChange={(v) => setForm({ ...form, name: v })}/>
            <Field label={t("appt.whatsapp")} value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="+57 300 0000000"/>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">{t("appt.notes")}</label>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            {error && <p className="md:col-span-2 text-sm text-destructive">{error}</p>}
            <button type="submit" className="btn-primary md:col-span-2"><Calendar size={18}/> {t("appt.submit")}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} value={value} placeholder={placeholder} maxLength={255} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/>
    </div>
  );
}
