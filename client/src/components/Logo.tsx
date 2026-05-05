interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 24, showWordmark = true, className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`} data-testid="logo-mark">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-label="GulfDC Signal logo"
        className="shrink-0"
      >
        {/* Stack of "racks" with a propagating signal pulse on the right */}
        <rect x="1" y="1" width="30" height="30" rx="6" fill="hsl(var(--sidebar))" stroke="hsl(var(--primary) / 0.5)" />
        <path
          d="M6 10h8M6 16h11M6 22h6"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="10" r="2" fill="hsl(var(--primary))" />
        <circle cx="24" cy="16" r="2" fill="hsl(var(--primary))" opacity="0.65" />
        <circle cx="24" cy="22" r="2" fill="hsl(var(--primary))" opacity="0.32" />
      </svg>
      {showWordmark && (
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="font-semibold tracking-tight text-[15px]">GulfDC</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            Signal
          </span>
        </div>
      )}
    </div>
  );
}
