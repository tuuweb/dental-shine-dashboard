import { ToothIcon } from "@/components/ToothLoader";

/**
 * Marca de agua tileada del logo (diente), inclinada, para llenar el fondo
 * de la página principal en las zonas con mucho espacio en blanco.
 * Se posiciona absoluta dentro de un contenedor `relative`.
 */
export function WatermarkBackground() {
  const rows = 12;
  const cols = 6;
  const items = Array.from({ length: rows * cols });
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      <div
        className="absolute -inset-20 grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          transform: "rotate(-22deg)",
        }}
      >
        {items.map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <ToothIcon
              size={110}
              className="text-primary opacity-[0.07]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
