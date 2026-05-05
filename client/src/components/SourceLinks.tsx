import { ExternalLink } from "lucide-react";

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SourceLinks({ urls, dense = false }: { urls: string[]; dense?: boolean }) {
  if (!urls || urls.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${dense ? "" : "mt-2"}`}>
      {urls.map((u, i) => (
        <a
          key={i}
          href={u}
          target="_blank"
          rel="noreferrer noopener"
          data-testid={`link-source-${i}`}
          className="inline-flex max-w-full items-center gap-1 rounded border border-border bg-card/60 px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          title={u}
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span className="truncate">{hostOf(u)}</span>
        </a>
      ))}
    </div>
  );
}
