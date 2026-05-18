import { WHATSAPP_NUMBER, waLink } from "@/contexts/AppDataContext";
import { ToothIcon } from "./ToothLoader";

export function WhatsAppButton() {
  return (
    <a
      href={waLink("Hola Dr. Diego, me gustaría más información.", WHATSAPP_NUMBER)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="wa-pulse fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-2xl transition-transform hover:scale-110"
      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
    >
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#25D366]">
        <ToothIcon size={22} />
      </div>
    </a>
  );
}
