import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Instagram, Menu, X, Globe } from "lucide-react";
import { useI18n } from "@/i18n";
import { EMAIL, PHONE_MOBILE, ADDRESS, INSTAGRAM, TIKTOK, MAPS } from "@/contexts/AppDataContext";
import { WhatsAppButton } from "./WhatsAppButton";
import { ToothIcon } from "./ToothLoader";
import logo from "@/assets/logo-diego-pallares.png";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.6 6.3a5.5 5.5 0 0 1-3.5-1.3v8.6a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1V11a2.6 2.6 0 1 0 1.8 2.5V2h2.7a5.5 5.5 0 0 0 3.5 4.3z"/>
    </svg>
  );
}

function TopBar() {
  return (
    <div className="bg-primary-dark text-primary-foreground text-xs">
      <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 hover:opacity-80"><Mail size={13}/> {EMAIL}</a>
          <a href={`tel:+573014276409`} className="flex items-center gap-1.5 hover:opacity-80"><Phone size={13}/> {PHONE_MOBILE}</a>
          <a href={MAPS} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 hover:opacity-80"><MapPin size={13}/> {ADDRESS}</a>
        </div>
        <div className="flex items-center gap-3">
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:opacity-80"><Instagram size={15}/></a>
          <a href={TIKTOK} target="_blank" rel="noreferrer" className="hover:opacity-80"><TikTokIcon size={15}/></a>
        </div>
      </div>
    </div>
  );
}

function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs">
      <Globe size={13} className="ml-2 text-muted-foreground" />
      <button
        onClick={() => setLang("es")}
        className={`px-2.5 py-1 rounded-full font-semibold transition ${lang === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
      >ES</button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full font-semibold transition ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
      >EN</button>
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const links: { to: string; key: Parameters<typeof t>[0] }[] = [
    { to: "/", key: "nav.home" },
    { to: "/sobre-mi", key: "nav.about" },
    { to: "/servicios", key: "nav.services" },
    { to: "/galeria", key: "nav.gallery" },
    { to: "/testimonios", key: "nav.testimonials" },
    { to: "/blog", key: "nav.blog" },
    { to: "/contacto", key: "nav.contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Diego Pallares" className="h-12 w-auto" />
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-full transition ${isActive ? "text-primary bg-accent" : "text-foreground hover:text-primary hover:bg-accent/60"}`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <LangSwitch />
          <Link to="/agendar" className="btn-primary text-sm">{t("nav.appointment")}</Link>
        </div>
        <button className="lg:hidden p-2 rounded-md hover:bg-accent" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"}
                className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                {t(l.key)}
              </NavLink>
            ))}
            <div className="pt-2 flex items-center justify-between">
              <LangSwitch />
              <Link to="/agendar" className="btn-primary text-sm">{t("nav.appointment")}</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 bg-primary-dark text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white rounded-lg p-2"><ToothIcon size={20} className="text-primary" /></div>
            <span className="font-display text-xl">Diego Pallares</span>
          </div>
          <p className="text-sm opacity-80">{t("footer.tagline")}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t("contact.address")}</h4>
          <a href={MAPS} target="_blank" rel="noreferrer" className="text-sm opacity-80 hover:opacity-100 flex items-start gap-2">
            <MapPin size={16} className="mt-0.5"/> {ADDRESS}
          </a>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t("contact.phones")}</h4>
          <p className="text-sm opacity-80 flex items-center gap-2"><Phone size={14}/> (5) 342 3347</p>
          <p className="text-sm opacity-80 flex items-center gap-2 mt-1"><Phone size={14}/> {PHONE_MOBILE}</p>
          <p className="text-sm opacity-80 flex items-center gap-2 mt-1"><Mail size={14}/> {EMAIL}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Social</h4>
          <div className="flex gap-3">
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full"><Instagram size={18}/></a>
            <a href={TIKTOK} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full"><TikTokIcon size={18}/></a>
          </div>
          <Link to="/admin" className="mt-4 inline-block text-xs opacity-60 hover:opacity-100">Admin</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Diego Pallares · {t("footer.rights")}
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-chevron">
      <TopBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
