import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Users, Briefcase, Image as ImageIcon, MessageSquare, Calendar, Trash2, Check, X, Plus, Edit3, Save, MessageCircle } from "lucide-react";
import { isAdminAuthed, adminLogout } from "./AdminLogin";
import { useAppData, waLink, type Client, type Service, type GalleryItem, type Testimonial, type Appointment } from "@/contexts/AppDataContext";
import { ToothIcon } from "@/components/ToothLoader";

type Tab = "appointments" | "clients" | "services" | "gallery" | "testimonials";

export function AdminDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("appointments");
  useEffect(() => { if (!isAdminAuthed()) nav("/admin-pallares"); }, [nav]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "appointments", label: "Citas", icon: <Calendar size={16}/> },
    { id: "clients", label: "Clientes", icon: <Users size={16}/> },
    { id: "services", label: "Servicios", icon: <Briefcase size={16}/> },
    { id: "gallery", label: "Galería", icon: <ImageIcon size={16}/> },
    { id: "testimonials", label: "Testimonios", icon: <MessageSquare size={16}/> },
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
        {tab === "gallery" && <GalleryPanel/>}
        {tab === "testimonials" && <TestimonialsPanel/>}
      </div>
    </div>
  );
}

/* ============ APPOINTMENTS ============ */
function AppointmentsPanel() {
  const { data, set } = useAppData();
  const sorted = [...data.appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const pending = sorted.filter((a) => a.status === "pending");
  const accepted = sorted.filter((a) => a.status === "accepted");
  const rejected = sorted.filter((a) => a.status === "rejected");

  const update = (id: string, status: Appointment["status"]) => {
    set("appointments", data.appointments.map((a) => a.id === id ? { ...a, status } : a));
  };
  const remove = (id: string) => set("appointments", data.appointments.filter((a) => a.id !== id));

  return (
    <div className="space-y-6">
      <Section title={`Pendientes (${pending.length})`}>
        {pending.length === 0 ? <Empty/> : pending.map((a) => <ApptRow key={a.id} a={a} onAccept={() => update(a.id, "accepted")} onReject={() => update(a.id, "rejected")} onDelete={() => remove(a.id)} />)}
      </Section>
      <Section title={`Aceptadas (${accepted.length})`}>
        {accepted.length === 0 ? <Empty/> : accepted.map((a) => <ApptRow key={a.id} a={a} onDelete={() => remove(a.id)} accepted/>)}
      </Section>
      <Section title={`Rechazadas (${rejected.length})`}>
        {rejected.length === 0 ? <Empty/> : rejected.map((a) => <ApptRow key={a.id} a={a} onDelete={() => remove(a.id)} />)}
      </Section>
    </div>
  );
}

function ApptRow({ a, onAccept, onReject, onDelete, accepted }: { a: Appointment; onAccept?: () => void; onReject?: () => void; onDelete: () => void; accepted?: boolean }) {
  const waText = `Hola ${a.name}, te confirmo tu cita para el ${a.date} a las ${a.time} para ${a.service}. ¿Quieres confirmar tu cita?`;
  const phone = a.whatsapp.replace(/\D/g, "");
  return (
    <div className="card-soft p-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex-1 min-w-[240px]">
        <div className="font-semibold">{a.name} <span className="text-xs text-muted-foreground font-normal">· CC {a.idNumber}</span></div>
        <div className="text-sm text-muted-foreground">{a.service}</div>
        <div className="text-xs mt-1 flex gap-3 flex-wrap">
          <span className="font-medium text-primary">{a.date} {a.time}</span>
          <span>📱 {a.whatsapp}</span>
        </div>
        {a.notes && <div className="text-xs text-muted-foreground mt-1 italic">"{a.notes}"</div>}
      </div>
      <div className="flex gap-1.5">
        {accepted && (
          <a href={waLink(waText, phone)} target="_blank" rel="noreferrer" className="btn-primary text-xs !py-1.5 !px-3">
            <MessageCircle size={14}/> WhatsApp
          </a>
        )}
        {onAccept && <button onClick={onAccept} className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20"><Check size={16}/></button>}
        {onReject && <button onClick={onReject} className="p-2 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"><X size={16}/></button>}
        <button onClick={onDelete} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><Trash2 size={16}/></button>
      </div>
    </div>
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
            {(c.beforeImage || c.afterImage) && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {c.beforeImage && <img src={c.beforeImage} alt="antes" className="w-full h-24 object-cover rounded-lg"/>}
                {c.afterImage && <img src={c.afterImage} alt="después" className="w-full h-24 object-cover rounded-lg"/>}
              </div>
            )}
          </div>
        ))}
      </div>
      {edit && <ClientModal client={edit} onClose={() => setEdit(null)} onSave={save}/>}
    </div>
  );
}

function ClientModal({ client, onClose, onSave }: { client: Client; onClose: () => void; onSave: (c: Client) => void }) {
  const [c, setC] = useState(client);
  const upload = async (file: File, field: "beforeImage" | "afterImage") => {
    const reader = new FileReader();
    reader.onload = () => setC({ ...c, [field]: reader.result as string });
    reader.readAsDataURL(file);
  };
  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-bold mb-4">Cliente</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <In label="Nombre" v={c.name} on={(v) => setC({ ...c, name: v })}/>
        <In label="Cédula" v={c.idNumber} on={(v) => setC({ ...c, idNumber: v })}/>
        <In label="WhatsApp" v={c.whatsapp} on={(v) => setC({ ...c, whatsapp: v })}/>
        <In label="Correo" v={c.email} on={(v) => setC({ ...c, email: v })}/>
        <In label="Tratamiento" v={c.treatment} on={(v) => setC({ ...c, treatment: v })} className="md:col-span-2"/>
        <FileIn label="Antes" preview={c.beforeImage} onFile={(f) => upload(f, "beforeImage")} onClear={() => setC({ ...c, beforeImage: undefined })}/>
        <FileIn label="Después" preview={c.afterImage} onFile={(f) => upload(f, "afterImage")} onClear={() => setC({ ...c, afterImage: undefined })}/>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onClose} className="btn-outline text-sm">Cancelar</button>
        <button onClick={() => onSave(c)} className="btn-primary text-sm"><Save size={14}/> Guardar</button>
      </div>
    </Modal>
  );
}

/* ============ SERVICES ============ */
function ServicesPanel() {
  const { data, set } = useAppData();
  const [edit, setEdit] = useState<Service | null>(null);
  const blank = (): Service => ({ id: crypto.randomUUID(), name: "", nameEn: "", description: "", descriptionEn: "", price: 0, icon: "🦷" });

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
        {data.services.map((s) => (
          <div key={s.id} className="card-soft p-4 flex items-center gap-3">
            <div className="text-3xl">{s.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{s.name}</div>
              <div className="text-xs text-muted-foreground truncate">{s.description}</div>
              <div className="text-sm font-bold text-primary mt-0.5">{s.quoteOnly || s.price === 0 ? "Cotización" : `$${s.price.toLocaleString("es-CO")}`}</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEdit(s)} className="p-2 rounded-lg bg-accent text-primary"><Edit3 size={14}/></button>
              <button onClick={() => remove(s.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h3 className="text-lg font-bold mb-4">Servicio</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <In label="Nombre (ES)" v={edit.name} on={(v) => setEdit({ ...edit, name: v })}/>
            <In label="Name (EN)" v={edit.nameEn} on={(v) => setEdit({ ...edit, nameEn: v })}/>
            <In label="Icono (emoji)" v={edit.icon} on={(v) => setEdit({ ...edit, icon: v })}/>
            <In label="Precio (COP)" type="number" v={String(edit.price)} on={(v) => setEdit({ ...edit, price: Number(v) || 0 })}/>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción (ES)</label>
              <textarea value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} rows={2} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description (EN)</label>
              <textarea value={edit.descriptionEn} onChange={(e) => setEdit({ ...edit, descriptionEn: e.target.value })} rows={2} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
            </div>
            <div className="md:col-span-2">
              <FileIn label="Imagen de fondo (opcional)" preview={edit.image} onFile={(f) => { const r = new FileReader(); r.onload = () => setEdit({ ...edit, image: r.result as string }); r.readAsDataURL(f); }} onClear={() => setEdit({ ...edit, image: undefined })}/>
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
  const blank = (): GalleryItem => ({ id: crypto.randomUUID(), title: "", before: "", after: "", treatment: "" });
  const save = (g: GalleryItem) => {
    const exists = data.gallery.some((x) => x.id === g.id);
    set("gallery", exists ? data.gallery.map((x) => x.id === g.id ? g : x) : [...data.gallery, g]);
    setEdit(null);
  };
  const remove = (id: string) => set("gallery", data.gallery.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">Las fotos de clientes con antes/después aparecen aquí automáticamente.</p>
        <button onClick={() => setEdit(blank())} className="btn-primary text-sm"><Plus size={16}/> Nuevo caso</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.gallery.map((g) => (
          <div key={g.id} className="card-soft p-3">
            <div className="grid grid-cols-2 gap-1 mb-2">
              <img src={g.before} alt="" className="aspect-square object-cover rounded-lg"/>
              <img src={g.after} alt="" className="aspect-square object-cover rounded-lg"/>
            </div>
            <div className="font-semibold text-sm">{g.title}</div>
            <div className="text-xs text-muted-foreground">{g.treatment}</div>
            <div className="flex gap-1 mt-2">
              <button onClick={() => setEdit(g)} className="flex-1 p-1.5 rounded-lg bg-accent text-primary text-xs flex items-center justify-center gap-1"><Edit3 size={12}/> Editar</button>
              <button onClick={() => remove(g.id)} className="p-1.5 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h3 className="text-lg font-bold mb-4">Caso de galería</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <In label="Título" v={edit.title} on={(v) => setEdit({ ...edit, title: v })}/>
            <In label="Tratamiento" v={edit.treatment} on={(v) => setEdit({ ...edit, treatment: v })}/>
            <FileIn label="Antes" preview={edit.before} onFile={(f) => { const r = new FileReader(); r.onload = () => setEdit({ ...edit, before: r.result as string }); r.readAsDataURL(f); }} onClear={() => setEdit({ ...edit, before: "" })}/>
            <FileIn label="Después" preview={edit.after} onFile={(f) => { const r = new FileReader(); r.onload = () => setEdit({ ...edit, after: r.result as string }); r.readAsDataURL(f); }} onClear={() => setEdit({ ...edit, after: "" })}/>
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
  const blank = (): Testimonial => ({ id: crypto.randomUUID(), name: "", rating: 5, text: "", treatment: "" });
  const save = (t: Testimonial) => {
    const exists = data.testimonials.some((x) => x.id === t.id);
    set("testimonials", exists ? data.testimonials.map((x) => x.id === t.id ? t : x) : [...data.testimonials, t]);
    setEdit(null);
  };
  const remove = (id: string) => set("testimonials", data.testimonials.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEdit(blank())} className="btn-primary text-sm"><Plus size={16}/> Nuevo testimonio</button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {data.testimonials.map((t) => (
          <div key={t.id} className="card-soft p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{t.name} · {"★".repeat(t.rating)}</div>
                <div className="text-xs text-muted-foreground">{t.treatment}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEdit(t)} className="p-2 rounded-lg bg-accent text-primary"><Edit3 size={14}/></button>
                <button onClick={() => remove(t.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive"><Trash2 size={14}/></button>
              </div>
            </div>
            <p className="text-sm mt-2 italic">"{t.text}"</p>
          </div>
        ))}
      </div>
      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h3 className="text-lg font-bold mb-4">Testimonio</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <In label="Nombre" v={edit.name} on={(v) => setEdit({ ...edit, name: v })}/>
            <In label="Tratamiento" v={edit.treatment} on={(v) => setEdit({ ...edit, treatment: v })}/>
            <In label="Rating (1-5)" type="number" v={String(edit.rating)} on={(v) => setEdit({ ...edit, rating: Math.min(5, Math.max(1, Number(v) || 5)) })}/>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Texto</label>
              <textarea value={edit.text} onChange={(e) => setEdit({ ...edit, text: e.target.value })} rows={3} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"/>
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

/* ============ UI helpers ============ */
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
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
