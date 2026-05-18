export function ChevronArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cg1" x1="0" x2="1">
          <stop offset="0" stopColor="oklch(0.35 0.14 250)" />
          <stop offset="1" stopColor="oklch(0.55 0.16 245)" />
        </linearGradient>
        <linearGradient id="cg2" x1="0" x2="1">
          <stop offset="0" stopColor="oklch(0.55 0.16 245)" />
          <stop offset="1" stopColor="oklch(0.72 0.13 240)" />
        </linearGradient>
      </defs>
      <g transform="translate(120,0)">
        <path d="M120,40 L520,300 L120,560 L60,560 L460,300 L60,40 Z" fill="url(#cg1)" opacity="0.95"/>
        <path d="M210,90 L560,300 L210,510 L160,510 L500,300 L160,90 Z" fill="url(#cg2)" opacity="0.85"/>
        <path d="M300,140 L580,300 L300,460 L260,460 L530,300 L260,140 Z" fill="oklch(0.72 0.13 240)" opacity="0.7"/>
      </g>
    </svg>
  );
}
