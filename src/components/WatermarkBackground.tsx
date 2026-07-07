import { ToothIcon } from "@/components/ToothLoader";

export function WatermarkBackground() {
  const items = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-6 gap-x-8 gap-y-12 opacity-40">
        {items.map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <ToothIcon
              size={90}
              className="text-primary/[0.06] rotate-[-25deg]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
