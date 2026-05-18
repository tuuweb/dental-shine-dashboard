interface Props { size?: number; className?: string }

export function ToothIcon({ size = 24, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c-2.5 0-3.8 1-5.2 1C5 3 3 4.5 3 7.5c0 2.3.8 3.7 1.4 5.5.6 1.8.7 3.4 1.1 5.3.3 1.6.9 3.7 2 3.7 1.4 0 1.5-2.5 1.9-4.2.3-1.2.6-2.3 1.6-2.3s1.3 1.1 1.6 2.3c.4 1.7.5 4.2 1.9 4.2 1.1 0 1.7-2.1 2-3.7.4-1.9.5-3.5 1.1-5.3.6-1.8 1.4-3.2 1.4-5.5 0-3-2-4.5-3.8-4.5C15.8 3 14.5 2 12 2z"/>
    </svg>
  );
}

export function ToothLoader() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-primary tooth-bounce">
        <ToothIcon size={56} />
      </div>
      <p className="text-sm text-muted-foreground font-medium">Cargando sonrisas...</p>
    </div>
  );
}
