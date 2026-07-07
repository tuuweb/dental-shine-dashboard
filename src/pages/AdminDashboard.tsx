import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Users, Briefcase, Image as ImageIcon, MessageSquare, Calendar, Clock, Trash2, Check, X, Plus, Edit3, Save, MessageCircle, FolderTree, FileText, UserCog, ToggleLeft, ToggleRight } from "lucide-react";
import { isAdminAuthed, adminLogout } from "./AdminLogin";
import { useAppData, waLink, type Client, type Service, type ServiceCategory, type GalleryItem, type GalleryCategory, type Testimonial, type Appointment, type BlogPost, type DoctorInfo } from "@/contexts/AppDataContext";
import { ToothIcon } from "@/components/ToothLoader";

type Tab = "appointments" | "clients" | "services" | "categories" | "gallery" | "testimonials" | "blog" | "doctor";

export function AdminDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("appointments");
  useEffect(() => { if (!isAdminAuthed()) nav("/admin-pallares"); }, [nav]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "appointments", label: "Citas", icon: <Calendar size={16}/> },
    { id: "clients", label: "Clientes", icon: <Users size={16}/> },
    { id: "services", label: "Servicios", icon: <Briefcase size={16}/> },
    { id: "categories", label: "Categorías", icon: <FolderTree size={16}/> },
    { id: "gallery", label: "Galería", icon: <ImageIcon size={16}/> },
    { id: "testimonials", label: "Testimonios", icon: <MessageSquare size={16}/> },
    { id: "blog", label: "Blog", icon: <FileText size={16}/> },
    { id: "doctor", label: "Doctor", icon: <UserCog size={16}/> },
  ];

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg"><ToothIcon size={18}/></div>
            <span className="font-semibold">Admin · Diego Pallares</span>
          </Link>
          <button onClick={() => { adminLogout(); nav("/admin-pallares"); }} className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1.5">
            <LogOut size={16}/> Salir
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {tabs.map((tt) => (
            <button key={tt.id} onClick={() => setTab(tt.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${tab === tt.id ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-accent"}`}>
              {tt.icon} {tt.label}
            </button>
          ))}
        </div>

        {tab === "appointments" && <AppointmentsPanel/>}
        {tab === "clients" && <ClientsPanel/>}
        {tab === "services" && <ServicesPanel/>}
        {tab === "categories" && <CategoriesPanel/>}
        {tab === "gallery" && <GalleryPanel/>}
        {tab === "testimonials" && <TestimonialsPanel/>}
        {tab === "blog" && <BlogPanel/>}
        {tab === "doctor" && <DoctorPanel/>}
      </div>
    </div>
  );
}

/* ============ APPOINTMENTS ============ */
const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function AppointmentsPanel() {
  const { data, set } = useAppData();
  const [showNew, setShowNew] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const sorted = [...data.appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const pending = sorted.filter((a) => a.status === "pending");
  const accepted = sorted.filter((a) => a.status === "accepted");
  const rejected = sorted.filter((a) => a.status === "rejected");

  const update = (id: string, status: Appointment["status"]) => {
    set("appointments", data.appointments.map((a) => a.id === id ? { ...a, status } : a));
  };
  const remove = (id: string) => set("appointments", data.appointments.filter((a) => a.id !== id));
  const create = (a: Appointment) => { set("appointments", [...data.appointments, a]); setShowNew(false); };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-end">
        <button onClick={() => setShowSchedule(true)} className="btn-outline text-sm"><Clock size={16}/> Horarios disponibles</button>
        <button onClick={() => setShowNew(true)} className="btn-primary text-sm"><Plus size={16}/> Nueva cita manual</button>
      </div>
      <Section title={`Pendientes (${pending.length})`}>
        {pending.length === 0 ? <Empty/> : pending.map((a) => <ApptRow key={a.id} a={a} onAccept={() => update(a.id, "accepted")} onReject={() => update(a.id, "rejected")} onDelete={() => remove(a.id)} />)}
      </Section>
      <Section title={`Aceptadas (${accepted.length})`}>
        {accepted.length === 0 ? <Empty/> : accepted.map((a) => <ApptRow key={a.id} a={a} onDelete={() => remove(a.id)} accepted/>)}
      </Section>
      <Section title={`Rechazadas (${rejected.length})`}>
        {rejected.length === 0 ? <Empty/> : rejected.map((a) => <ApptRow key={a.id} a={a} onDelete={() => remove(a.id)} />)}
      </Section>
      {showNew && <NewAppointmentModal onClose={() => setShowNew(false)} onCreate={create}/>}
      {showSchedule && <ScheduleModal onClose={() => setShowSchedule(false)}/>}
    </div>
  );
}

function buildWaText(a: Appointment) {
  const lines = [
    `Hola ${a.name} 👋`,
    ``,
    `Te escribo de parte del Dr. Diego Pallares sobre tu cita:`,
    `• Servicio: ${a.service}`,
    `• Fecha: ${a.date}`,
    `• Hora: ${a.time}`,
  ];
  if (a.notes) lines.push(`• Notas: ${a.notes}`);
  lines.push(``, `¿Nos confirmas tu cita? 🦷✨`);
  return lines.join("\n");
}

function ApptRow({ a, onAccept, onReject, onDelete, accepted }: { a: Appointment; onAccept?: () => void; onReject?: () => void; onDelete: () => void; accepted?: boolean }) {
  const phone = a.whatsapp.replace(/\D/g, "");
  const waHref = waLink(buildWaText(a), phone);
  return (
    <div className="card-soft p-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex-1 min-w-[240px]">
        <div className="font-semibold">{a.name}</div>
        <div className="text-sm text-muted-foreground">{a.service}</div>
        <div className="text-xs mt-1 flex gap-3 flex-wrap items-center">
          <span className="font-medium text-primary">{a.date} {a.time}</span>
          <a href={waHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#128C7E] hover:underline font-medium">
            <MessageCircle size={12}/> {a.whatsapp}
          </a>
        </div>
        {a.notes && <div className="text-xs text-muted-foreground mt-1 italic">"{a.notes}"</div>}
      </div>
      <div className="flex gap-1.5">
        {accepted && (
          <a href={waHref} target="_blank" rel="noreferrer" className="btn-primary text-xs !py-1.5 !px-3">
            <MessageCircle size={14}/> Confirmar
          </a>
        )}
        {onAccept && <button onClick={onAccept} className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20"><Check size={16}/></button>}
        {onReject && <button onClick={onReject} className="p-2 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"><X size={16}/></button>}
        <button onClick={onDelete} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><Trash2 size={16}/></button>
      </div>
    </div>
  );
}

function NewAppointmentModal({ onClose, onCreate }: { onClose: () => void; onCreate: (a: Appointment) => void }) {
  const { data } = useAppData();
  const [f, setF] = useState({ name: "", whatsapp: "", service: data.services[0]?.name ?? "", date: "", time: "", notes: "", status: "accepted" as Appointment["status"] });
  const submit = () => {
    if (!f.name || !f.whatsapp || !f.date || !f.time) return;
    onCreate({ id: crypto.randomUUID(), name: f.name, whatsapp: f.whatsapp, service: f.service, date: f.date, time: f.time, notes: f.notes, status: f.status, createdAt: Date.now() });
  };
  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-bold mb-4">Nueva cita manual</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <In label="Nombre" v={f.name} on={(v) => setF({ ...f, name: v })}/>
        <In label="WhatsApp" v={f.whatsapp} on={(v) => setF({ ...f, whatsapp: v })}/>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Servicio</label>
          <select value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm">
            {data.services.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <In label="Fecha" type="date" v={f.date} on={(v) => setF({ ...f, date: v })}/>
        <In label="Hora (HH:MM)" v={f.time} on={(v) => setF({ ...f, time: v })}/>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as Appointment["status"] })} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm">
            <option value="accepted">Aceptada</option>
            <option value="pending">Pendiente</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Notas</label>
          <textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={2} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
        </div>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onClose} className="btn-outline text-sm">Cancelar</button>
        <button onClick={submit} className="btn-primary text-sm"><Save size={14}/> Guardar</button>
      </div>
    </Modal>
  );
}

function ScheduleModal({ onClose }: { onClose: () => void }) {
  const { data, set } = useAppData();
  const [draft, setDraft] = useState<Record<number, string>>(() => {
    const out: Record<number, string> = {};
    for (let i = 0; i < 7; i++) out[i] = (data.schedule?.[i] ?? []).join(", ");
    return out;
  });
  const save = () => {
    const parsed: Record<number, string[]> = {};
    for (let i = 0; i < 7; i++) {
      parsed[i] = draft[i].split(",").map((s) => s.trim()).filter((s) => /^\d{1,2}:\d{2}$/.test(s)).map((s) => {
        const [h, m] = s.split(":"); return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
      });
    }
    set("schedule", parsed);
    onClose();
  };
  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-bold mb-2">Horarios disponibles</h3>
      <p className="text-xs text-muted-foreground mb-4">Escribe las horas separadas por coma (ej: <code>09:00, 10:00, 14:30</code>). Deja vacío si ese día no atiendes.</p>
      <div className="space-y-3">
        {WEEKDAYS.map((day, i) => (
          <div key={i}>
            <label className="block text-sm font-medium mb-1">{day}</label>
            <input value={draft[i]} onChange={(e) => setDraft({ ...draft, [i]: e.target.value })} placeholder="09:00, 10:00, 11:00..." className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onClose} className="btn-outline text-sm">Cancelar</button>
        <button onClick={save} className="btn-primary text-sm"><Save size={14}/> Guardar</button>
      </div>
    </Modal>
  );
}

/* ============ CLIENTS ============ */
function ClientsPanel() {
  const { data, set } = useAppData();
  const [edit, setEdit] = useState<Client | null>(null);
  const blank = (): Client => ({ id: crypto.randomUUID(), name: "", idNumber: "", whatsapp: "", email: "", treatment: "", createdAt: Date.now() });

  const save = (c: Client) => {
    const exists = data.clients.some((x) => x.id === c.id);
    set("clients", exists ? data.clients.map((x) => x.id === c.id ? c : x) : [...data.clients, c]);
    setEdit(null);
  };
  const remove = (id: string) => set("clients", data.clients.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEdit(blank())} className="btn-primary text-sm"><Plus size={16}/> Nuevo cliente</button>
      </div>
      {data.clients.length === 0 && <Empty/>}
      <div className="grid md:grid-cols-2 gap-4">
        {data.clients.map((c) => (
          <div key={c.id} className="card-soft p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">CC {c.idNumber} · {c.email}</div>
                <div className="text-xs mt-1">📱 {c.whatsapp}</div>
                <div className="text-sm text-primary mt-1">{c.treatment}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEdit(c)} className="p-2 rounded-lg bg-accent text-primary"><Edit3 size={14}/></button>
                <button onClick={() => remove(c.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={14}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {edit && <ClientModal client={edit} onClose={() => setEdit(null)} onSave={save}/>}
    </div>
  );
}

function ClientModal({ client, onClose, onSave }: { client: Client; onClose: () => void; onSave: (c: Client) => void }) {
  const [c, setC] = useState(client);
  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-bold mb-4">Cliente</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <In label="Nombre" v={c.name} on={(v) => setC({ ...c, name: v })}/>
        <In label="Cédula" v={c.idNumber} on={(v) => setC({ ...c, idNumber: v })}/>
        <In label="WhatsApp" v={c.whatsapp} on={(v) => setC({ ...c, whatsapp: v })}/>
        <In label="Correo" v={c.email} on={(v) => setC({ ...c, email: v })}/>
        <In label="Tratamiento" v={c.treatment} on={(v) => setC({ ...c, treatment: v })} className="md:col-span-2"/>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onClose} className="btn-outline text-sm">Cancelar</button>
        <button onClick={() => onSave(c)} className="btn-primary text-sm"><Save size={14}/> Guardar</button>
      </div>
    </Modal>
  );
}

/* ============ CATEGORIES ============ */
function CategoriesPanel() {
  const { data, set } = useAppData();
  const [sc, setSc] = useState<ServiceCategory | null>(null);
  const [gc, setGc] = useState<GalleryCategory | null>(null);

  const saveSc = (c: ServiceCategory) => {
    const exists = data.serviceCategories.some((x) => x.id === c.id);
    set("serviceCategories", exists ? data.serviceCategories.map((x) => x.id === c.id ? c : x) : [...data.serviceCategories, c]);
    setSc(null);
  };
  const removeSc = (id: string) => set("serviceCategories", data.serviceCategories.filter((x) => x.id !== id));
  const saveGc = (c: GalleryCategory) => {
    const exists = data.galleryCategories.some((x) => x.id === c.id);
    set("galleryCategories", exists ? data.galleryCategories.map((x) => x.id === c.id ? c : x) : [...data.galleryCategories, c]);
    setGc(null);
  };
  const removeGc = (id: string) => set("galleryCategories", data.galleryCategories.filter((x) => x.id !== id));

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">Categorías de servicios</h3>
          <button onClick={() => setSc({ id: crypto.randomUUID(), name: "", nameEn: "" })} className="btn-primary text-sm"><Plus size={14}/> Nueva</button>
        </div>
        <div className="space-y-2">
          {data.serviceCategories.map((c) => (
            <div key={c.id} className="card-soft p-3 flex justify-between items-center">
              <div><div className="font-semibold text-sm">{c.name}</div><div className="text-xs text-muted-foreground">{c.nameEn}</div></div>
              <div className="flex gap-1">
                <button onClick={() => setSc(c)} className="p-1.5 rounded-lg bg-accent text-primary"><Edit3 size={12}/></button>
                <button onClick={() => removeSc(c.id)} className="p-1.5 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">Categorías de galería</h3>
          <button onClick={() => setGc({ id: crypto.randomUUID(), name: "" })} className="btn-primary text-sm"><Plus size={14}/> Nueva</button>
        </div>
        <div className="space-y-2">
          {data.galleryCategories.map((c) => (
            <div key={c.id} className="card-soft p-3 flex justify-between items-center">
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="flex gap-1">
                <button onClick={() => setGc(c)} className="p-1.5 rounded-lg bg-accent text-primary"><Edit3 size={12}/></button>
                <button onClick={() => removeGc(c.id)} className="p-1.5 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sc && (
        <Modal onClose={() => setSc(null)}>
          <h3 className="text-lg font-bold mb-4">Categoría de servicio</h3>
          <div className="space-y-3">
            <In label="Nombre (ES)" v={sc.name} on={(v) => setSc({ ...sc, name: v })}/>
            <In label="Name (EN)" v={sc.nameEn} on={(v) => setSc({ ...sc, nameEn: v })}/>
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <button onClick={() => setSc(null)} className="btn-outline text-sm">Cancelar</button>
            <button onClick={() => saveSc(sc)} className="btn-primary text-sm"><Save size={14}/> Guardar</button>
          </div>
        </Modal>
      )}
      {gc && (
        <Modal onClose={() => setGc(null)}>
          <h3 className="text-lg font-bold mb-4">Categoría de galería</h3>
          <In label="Nombre" v={gc.name} on={(v) => setGc({ ...gc, name: v })}/>
          <div className="flex gap-2 mt-5 justify-end">
            <button onClick={() => setGc(null)} className="btn-outline text-sm">Cancelar</button>
            <button onClick={() => saveGc(gc)} className="btn-primary text-sm"><Save size={14}/> Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ SERVICES ============ */
function ServicesPanel() {
  const { data, set } = useAppData();
  const [edit, setEdit] = useState<Service | null>(null);
  const blank = (): Service => ({ id: crypto.randomUUID(), categoryId: data.serviceCategories[0]?.id, name: "", nameEn: "", description: "", descriptionEn: "", longDescription: "", price: 0, icon: "🦷", images: [] });

  const save = (s: Service) => {
    const exists = data.services.some((x) => x.id === s.id);
    set("services", exists ? data.services.map((x) => x.id === s.id ? s : x) : [...data.services, s]);
    setEdit(null);
  };
  const remove = (id: string) => set("services", data.services.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEdit(blank())} className="btn-primary text-sm"><Plus size={16}/> Nuevo servicio</button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {data.services.map((s) => {
          const cat = data.serviceCategories.find((c) => c.id === s.categoryId);
          return (
            <div key={s.id} className="card-soft p-4 flex items-center gap-3">
              <div className="text-3xl">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{s.name}</div>
                <div className="text-xs text-muted-foreground truncate">{cat?.name ?? "Sin categoría"}</div>
                <div className="text-sm font-bold text-primary mt-0.5">{s.quoteOnly || s.price === 0 ? "Cotización" : `$${s.price.toLocaleString("es-CO")}`}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEdit(s)} className="p-2 rounded-lg bg-accent text-primary"><Edit3 size={14}/></button>
                <button onClick={() => remove(s.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={14}/></button>
              </div>
            </div>
          );
        })}
      </div>
      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h3 className="text-lg font-bold mb-4">Servicio</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select value={edit.categoryId ?? ""} onChange={(e) => setEdit({ ...edit, categoryId: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm">
                <option value="">Sin categoría</option>
                {data.serviceCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <In label="Nombre (ES)" v={edit.name} on={(v) => setEdit({ ...edit, name: v })}/>
            <In label="Name (EN)" v={edit.nameEn} on={(v) => setEdit({ ...edit, nameEn: v })}/>
            <In label="Icono (emoji)" v={edit.icon} on={(v) => setEdit({ ...edit, icon: v })}/>
            <In label="Precio (COP)" type="number" v={String(edit.price)} on={(v) => setEdit({ ...edit, price: Number(v) || 0 })}/>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción corta (ES)</label>
              <textarea value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} rows={2} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Short description (EN)</label>
              <textarea value={edit.descriptionEn} onChange={(e) => setEdit({ ...edit, descriptionEn: e.target.value })} rows={2} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción larga (página de detalle)</label>
              <textarea value={edit.longDescription ?? ""} onChange={(e) => setEdit({ ...edit, longDescription: e.target.value })} rows={4} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <In label="Link de video (YouTube/Instagram/MP4)" v={edit.videoUrl ?? ""} on={(v) => setEdit({ ...edit, videoUrl: v })} className="md:col-span-2"/>
            <div className="md:col-span-2">
              <FileIn label="Imagen principal" preview={edit.image} onFile={(f) => readFile(f, (url) => setEdit({ ...edit, image: url }))} onClear={() => setEdit({ ...edit, image: undefined })}/>
            </div>
            <div className="md:col-span-2">
              <MultiImageIn label="Galería adicional" images={edit.images ?? []} onChange={(imgs) => setEdit({ ...edit, images: imgs })}/>
            </div>
            <label className="md:col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!edit.quoteOnly} onChange={(e) => setEdit({ ...edit, quoteOnly: e.target.checked })}/>
              Solo cotización por WhatsApp (sin precio fijo)
            </label>
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <button onClick={() => setEdit(null)} className="btn-outline text-sm">Cancelar</button>
            <button onClick={() => save(edit)} className="btn-primary text-sm"><Save size={14}/> Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ GALLERY ============ */
function GalleryPanel() {
  const { data, set } = useAppData();
  const [edit, setEdit] = useState<GalleryItem | null>(null);
  const blank = (): GalleryItem => ({ id: crypto.randomUUID(), categoryId: data.galleryCategories[0]?.id, title: "", treatment: "", image: "" });
  const save = (g: GalleryItem) => {
    const exists = data.gallery.some((x) => x.id === g.id);
    set("gallery", exists ? data.gallery.map((x) => x.id === g.id ? g : x) : [...data.gallery, g]);
    setEdit(null);
  };
  const remove = (id: string) => set("gallery", data.gallery.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2 text-sm">
          <button type="button" onClick={() => set("showBeforeAfterOnHome", !data.showBeforeAfterOnHome)} className="text-primary">
            {data.showBeforeAfterOnHome ? <ToggleRight size={28}/> : <ToggleLeft size={28}/>}
          </button>
          Mostrar la galería en la página principal
        </label>
        <button onClick={() => setEdit(blank())} className="btn-primary text-sm"><Plus size={16}/> Nuevo caso</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.gallery.map((g) => {
          const cat = data.galleryCategories.find((c) => c.id === g.categoryId);
          return (
            <div key={g.id} className="card-soft p-3">
              {(g.image || g.before) && <img src={(g.image || g.before)!} alt="" className="aspect-[4/3] w-full object-cover rounded-lg mb-2"/>}
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{cat?.name ?? "Sin categoría"}</div>
              <div className="font-semibold text-sm">{g.title}</div>
              <div className="text-xs text-muted-foreground">{g.treatment}</div>
              {g.videoUrl && <div className="text-xs text-primary mt-1">▶ Tiene video</div>}
              <div className="flex gap-1 mt-2">
                <button onClick={() => setEdit(g)} className="flex-1 p-1.5 rounded-lg bg-accent text-primary text-xs flex items-center justify-center gap-1"><Edit3 size={12}/> Editar</button>
                <button onClick={() => remove(g.id)} className="p-1.5 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={12}/></button>
              </div>
            </div>
          );
        })}
      </div>
      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h3 className="text-lg font-bold mb-4">Caso de galería</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select value={edit.categoryId ?? ""} onChange={(e) => setEdit({ ...edit, categoryId: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm">
                <option value="">Sin categoría</option>
                {data.galleryCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <In label="Título" v={edit.title} on={(v) => setEdit({ ...edit, title: v })}/>
            <In label="Tratamiento" v={edit.treatment} on={(v) => setEdit({ ...edit, treatment: v })}/>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción (opcional)</label>
              <textarea value={edit.description ?? ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} rows={2} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <In label="Link de video (opcional)" v={edit.videoUrl ?? ""} on={(v) => setEdit({ ...edit, videoUrl: v })} className="md:col-span-2"/>
            <div className="md:col-span-2">
              <FileIn label="Imagen" preview={edit.image} onFile={(f) => readFile(f, (url) => setEdit({ ...edit, image: url }))} onClear={() => setEdit({ ...edit, image: "" })}/>
            </div>
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <button onClick={() => setEdit(null)} className="btn-outline text-sm">Cancelar</button>
            <button onClick={() => save(edit)} className="btn-primary text-sm"><Save size={14}/> Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ TESTIMONIALS ============ */
function TestimonialsPanel() {
  const { data, set } = useAppData();
  const [edit, setEdit] = useState<Testimonial | null>(null);
  const blank = (): Testimonial => ({ id: crypto.randomUUID(), name: "", rating: 5, text: "", treatment: "", status: "approved" });
  const save = (t: Testimonial) => {
    const exists = data.testimonials.some((x) => x.id === t.id);
    set("testimonials", exists ? data.testimonials.map((x) => x.id === t.id ? t : x) : [...data.testimonials, t]);
    setEdit(null);
  };
  const setStatus = (id: string, status: Testimonial["status"]) =>
    set("testimonials", data.testimonials.map((x) => x.id === id ? { ...x, status } : x));
  const remove = (id: string) => set("testimonials", data.testimonials.filter((x) => x.id !== id));

  const pending = data.testimonials.filter((t) => t.status === "pending");
  const approved = data.testimonials.filter((t) => (t.status ?? "approved") === "approved");

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setEdit(blank())} className="btn-primary text-sm"><Plus size={16}/> Nuevo testimonio</button>
      </div>

      <Section title={`Pendientes de aprobación (${pending.length})`}>
        {pending.length === 0 ? <Empty/> : (
          <div className="grid md:grid-cols-2 gap-3">
            {pending.map((t) => (
              <div key={t.id} className="card-soft p-4 border-2 border-orange-500/40">
                <TestimonialPreview t={t}/>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setStatus(t.id, "approved")} className="flex-1 p-2 rounded-lg bg-green-500/15 text-green-700 text-xs font-semibold flex items-center justify-center gap-1"><Check size={14}/> Aprobar</button>
                  <button onClick={() => remove(t.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title={`Aprobados (${approved.length})`}>
        <div className="grid md:grid-cols-2 gap-3">
          {approved.map((t) => (
            <div key={t.id} className="card-soft p-4">
              <TestimonialPreview t={t}/>
              <div className="flex gap-1 mt-3 justify-end">
                <button onClick={() => setEdit(t)} className="p-2 rounded-lg bg-accent text-primary"><Edit3 size={14}/></button>
                <button onClick={() => remove(t.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h3 className="text-lg font-bold mb-4">Testimonio</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <In label="Nombre" v={edit.name} on={(v) => setEdit({ ...edit, name: v })}/>
            <In label="Tratamiento" v={edit.treatment} on={(v) => setEdit({ ...edit, treatment: v })}/>
            <In label="Rating (1-5)" type="number" v={String(edit.rating)} on={(v) => setEdit({ ...edit, rating: Math.min(5, Math.max(1, Number(v) || 5)) })}/>
            <In label="Link de Instagram (Reel/Post)" v={edit.instagramUrl || ""} on={(v) => setEdit({ ...edit, instagramUrl: v })}/>
            <div className="md:col-span-2">
              <FileIn label="Miniatura del video (vertical 9:16)" preview={edit.thumbnail} onFile={(f) => readFile(f, (url) => setEdit({ ...edit, thumbnail: url }))} onClear={() => setEdit({ ...edit, thumbnail: undefined })}/>
            </div>
            <div className="md:col-span-2">
              <FileIn label="Foto de perfil (opcional)" preview={edit.avatar} onFile={(f) => readFile(f, (url) => setEdit({ ...edit, avatar: url }))} onClear={() => setEdit({ ...edit, avatar: undefined })}/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Texto</label>
              <textarea value={edit.text} onChange={(e) => setEdit({ ...edit, text: e.target.value })} rows={3} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select value={edit.status ?? "approved"} onChange={(e) => setEdit({ ...edit, status: e.target.value as Testimonial["status"] })} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm">
                <option value="approved">Aprobado</option>
                <option value="pending">Pendiente</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <button onClick={() => setEdit(null)} className="btn-outline text-sm">Cancelar</button>
            <button onClick={() => save(edit)} className="btn-primary text-sm"><Save size={14}/> Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TestimonialPreview({ t }: { t: Testimonial }) {
  return (
    <div className="flex gap-3">
      {t.avatar ? <img src={t.avatar} className="h-12 w-12 rounded-full object-cover" alt=""/> :
        <div className="h-12 w-12 rounded-full bg-accent text-primary grid place-items-center font-bold">{t.name[0]?.toUpperCase()}</div>}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{t.name} · {"★".repeat(t.rating)}</div>
        <div className="text-xs text-muted-foreground">{t.treatment}</div>
        <p className="text-xs mt-1 italic line-clamp-3">"{t.text}"</p>
      </div>
    </div>
  );
}

/* ============ BLOG ============ */
function BlogPanel() {
  const { data, set } = useAppData();
  const [edit, setEdit] = useState<BlogPost | null>(null);
  const blank = (): BlogPost => ({ id: crypto.randomUUID(), title: "", excerpt: "", content: "", date: new Date().toISOString().slice(0, 10), images: [] });
  const save = (b: BlogPost) => {
    const exists = data.blog.some((x) => x.id === b.id);
    set("blog", exists ? data.blog.map((x) => x.id === b.id ? b : x) : [...data.blog, b]);
    setEdit(null);
  };
  const remove = (id: string) => set("blog", data.blog.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEdit(blank())} className="btn-primary text-sm"><Plus size={16}/> Nueva entrada</button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {data.blog.map((b) => (
          <div key={b.id} className="card-soft p-4">
            <div className="text-xs text-muted-foreground">{b.date}</div>
            <div className="font-semibold mt-1">{b.title}</div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{b.excerpt}</p>
            {b.videoUrl && <div className="text-xs text-primary mt-1">▶ Tiene video</div>}
            <div className="flex gap-1 mt-3 justify-end">
              <button onClick={() => setEdit(b)} className="p-2 rounded-lg bg-accent text-primary"><Edit3 size={14}/></button>
              <button onClick={() => remove(b.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h3 className="text-lg font-bold mb-4">Entrada de blog</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <In label="Título" v={edit.title} on={(v) => setEdit({ ...edit, title: v })} className="md:col-span-2"/>
            <In label="Fecha" type="date" v={edit.date} on={(v) => setEdit({ ...edit, date: v })}/>
            <In label="Link de video (opcional)" v={edit.videoUrl ?? ""} on={(v) => setEdit({ ...edit, videoUrl: v })}/>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Resumen</label>
              <textarea value={edit.excerpt} onChange={(e) => setEdit({ ...edit, excerpt: e.target.value })} rows={2} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Contenido completo</label>
              <textarea value={edit.content} onChange={(e) => setEdit({ ...edit, content: e.target.value })} rows={6} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <div className="md:col-span-2">
              <FileIn label="Imagen principal" preview={edit.image} onFile={(f) => readFile(f, (url) => setEdit({ ...edit, image: url }))} onClear={() => setEdit({ ...edit, image: undefined })}/>
            </div>
            <div className="md:col-span-2">
              <MultiImageIn label="Galería adicional" images={edit.images ?? []} onChange={(imgs) => setEdit({ ...edit, images: imgs })}/>
            </div>
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <button onClick={() => setEdit(null)} className="btn-outline text-sm">Cancelar</button>
            <button onClick={() => save(edit)} className="btn-primary text-sm"><Save size={14}/> Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ DOCTOR INFO ============ */
function DoctorPanel() {
  const { data, set } = useAppData();
  const [d, setD] = useState<DoctorInfo>(data.doctorInfo);
  const [certsRaw, setCertsRaw] = useState(d.certifications.join("\n"));
  const [price, setPrice] = useState<number>(data.appointmentPrice ?? 50000);
  const save = () => {
    set("doctorInfo", { ...d, certifications: certsRaw.split("\n").map((s) => s.trim()).filter(Boolean) });
    set("appointmentPrice", Number.isFinite(price) && price >= 0 ? price : 50000);
  };
  return (
    <div className="card-soft p-6 max-w-3xl mx-auto">
      <h3 className="text-lg font-bold mb-4">Información del doctor</h3>
      <p className="text-xs text-muted-foreground mb-4">Estos datos se muestran en el hero del Home y en la página "Sobre mí".</p>
      <div className="grid md:grid-cols-2 gap-3">
        <In label="Nombre" v={d.name} on={(v) => setD({ ...d, name: v })}/>
        <In label="Rol" v={d.role} on={(v) => setD({ ...d, role: v })}/>
        <In label="Especialidad (chip arriba del nombre)" v={d.specialty} on={(v) => setD({ ...d, specialty: v })}/>
        <In label="Años de experiencia (ej: 17+)" v={d.yearsExperience} on={(v) => setD({ ...d, yearsExperience: v })}/>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Bio corta</label>
          <textarea value={d.bioShort} onChange={(e) => setD({ ...d, bioShort: e.target.value })} rows={2} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Bio larga</label>
          <textarea value={d.bioLong} onChange={(e) => setD({ ...d, bioLong: e.target.value })} rows={4} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Visión</label>
          <textarea value={d.vision} onChange={(e) => setD({ ...d, vision: e.target.value })} rows={2} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
        </div>
        <In label="Universidad" v={d.university} on={(v) => setD({ ...d, university: v })} className="md:col-span-2"/>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Certificaciones (una por línea)</label>
          <textarea value={certsRaw} onChange={(e) => setCertsRaw(e.target.value)} rows={4} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono"/>
        </div>
        <In label="Teléfono" v={d.phone} on={(v) => setD({ ...d, phone: v })}/>
        <In label="WhatsApp" v={d.whatsapp} on={(v) => setD({ ...d, whatsapp: v })}/>
        <In label="Email" v={d.email} on={(v) => setD({ ...d, email: v })}/>
        <In label="Dirección" v={d.address} on={(v) => setD({ ...d, address: v })}/>
        <div className="md:col-span-2 border-t border-border pt-4 mt-2">
          <h4 className="text-sm font-bold mb-2">Ajustes de citas</h4>
          <label className="block text-sm font-medium mb-1">Valor de la consulta (COP)</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-[11px] text-muted-foreground mt-1">Se muestra en la página de agendar cita. Ej: 50000 → $50.000</p>
        </div>
      </div>
      <div className="flex justify-end mt-5">
        <button onClick={save} className="btn-primary text-sm"><Save size={14}/> Guardar cambios</button>
      </div>
    </div>
  );
}

/* ============ UI helpers ============ */
function readFile(file: File, cb: (dataUrl: string) => void) {
  const r = new FileReader();
  r.onload = () => cb(r.result as string);
  r.readAsDataURL(file);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Empty() { return <p className="text-sm text-muted-foreground text-center py-6">Sin registros.</p>; }
function In({ label, v, on, type = "text", className }: { label: string; v: string; on: (v: string) => void; type?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} value={v} onChange={(e) => on(e.target.value)} maxLength={500} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/>
    </div>
  );
}
function FileIn({ label, preview, onFile, onClear }: { label: string; preview?: string; onFile: (f: File) => void; onClear: () => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="border border-dashed border-border rounded-xl p-3">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="" className="w-full h-32 object-cover rounded-lg"/>
            <button type="button" onClick={onClear} className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full"><X size={12}/></button>
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} className="text-xs"/>
        )}
      </div>
    </div>
  );
}
function MultiImageIn({ label, images, onChange }: { label: string; images: string[]; onChange: (imgs: string[]) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img src={img} alt="" className="aspect-square object-cover rounded-lg"/>
            <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5"><X size={10}/></button>
          </div>
        ))}
        <label className="aspect-square border border-dashed border-border rounded-lg grid place-items-center cursor-pointer hover:bg-accent">
          <Plus size={20} className="text-muted-foreground"/>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]; if (!f) return;
            readFile(f, (url) => onChange([...images, url]));
          }}/>
        </label>
      </div>
    </div>
  );
}
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
