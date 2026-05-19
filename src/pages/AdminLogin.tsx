import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { ToothIcon } from "@/components/ToothLoader";

const ADMIN_PASSWORD = "pallaresweb123";
const SESSION_KEY = "dp-admin-session";

export function isAdminAuthed() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SESSION_KEY) === "1";
}

export function adminLogout() {
  localStorage.removeItem(SESSION_KEY);
}

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => { if (isAdminAuthed()) nav("/admin-pallares/dashboard"); }, [nav]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, "1");
      nav("/admin-pallares/dashboard");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-chevron p-4">
      <form onSubmit={submit} className="card-soft p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary text-primary-foreground p-4 rounded-2xl mb-3"><ToothIcon size={32}/></div>
          <h1 className="text-2xl font-bold">Panel Admin</h1>
          <p className="text-sm text-muted-foreground">Diego Pallares</p>
        </div>
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-3 text-muted-foreground"/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/>
        </div>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <button type="submit" className="btn-primary w-full mt-5">Ingresar</button>
        <Link to="/" className="block text-center text-xs text-muted-foreground mt-4 hover:text-primary">← Volver al sitio</Link>
      </form>
    </div>
  );
}
