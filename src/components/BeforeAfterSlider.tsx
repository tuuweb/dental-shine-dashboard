import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n";

interface Props {
  before: string;
  after: string;
  alt?: string;
  className?: string;
}

export function BeforeAfterSlider({ before, after, alt = "", className = "" }: Props) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      update(x);
    };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [update]);

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    update(x);
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden select-none touch-none cursor-ew-resize ${className}`}
      onMouseDown={start}
      onTouchStart={start}
    >
      <img src={after} alt={alt} className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false}/>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${pos}%` }}>
        <div className="relative h-full" style={{ width: `${100 / (pos / 100 || 0.0001)}%` }}>
          <img src={before} alt={alt} className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
        </div>
      </div>
      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wider pointer-events-none">{t("common.before")}</span>
      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider pointer-events-none">{t("common.after")}</span>
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center text-primary">
          <ChevronLeft size={14} strokeWidth={3}/>
          <ChevronRight size={14} strokeWidth={3}/>
        </div>
      </div>
    </div>
  );
}
