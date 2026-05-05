export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border bg-background/60 px-4 py-5 lg:px-6 lg:py-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1.5">
          {eyebrow && (
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              {eyebrow}
            </div>
          )}
          <h1 className="text-xl font-semibold leading-tight tracking-tight md:text-[22px]">
            {title}
          </h1>
          {description && (
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
