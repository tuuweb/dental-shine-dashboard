import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import { AppDataProvider } from "@/contexts/AppDataContext";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Services } from "@/pages/Services";
import { ServiceDetail } from "@/pages/ServiceDetail";
import { Gallery } from "@/pages/Gallery";
import { Testimonials } from "@/pages/Testimonials";
import { Blog } from "@/pages/Blog";
import { Contact } from "@/pages/Contact";
import { Appointment } from "@/pages/Appointment";
import { AdminLogin } from "@/pages/AdminLogin";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { ToothLoader } from "@/components/ToothLoader";

export function SpaApp() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ToothLoader />
      </div>
    );
  }
  return (
    <I18nProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/sobre-mi" element={<About />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/servicios/:id" element={<ServiceDetail />} />
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/testimonios" element={<Testimonials />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/agendar" element={<Appointment />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            <Route path="/admin-pallares" element={<AdminLogin />} />
            <Route path="/admin-pallares/dashboard" element={<AdminDashboard />} />
            {/* legacy redirects */}
            <Route path="/admin" element={<Navigate to="/admin-pallares" replace />} />
            <Route path="/admin/dashboard" element={<Navigate to="/admin-pallares/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </I18nProvider>
  );
}
