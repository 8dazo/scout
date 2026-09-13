const SPONSORS = [
  {
    name: "The Graph",
    src: "/sponsors/the-graph.svg",
    job: "Live Messari Lending/CDP — one query across protocols",
    markClass: "h-9 w-9",
  },
  {
    name: "ENSv2",
    src: "/sponsors/ens.svg",
    job: "scout-agent.eth identity, status write, and scoped permissions",
    markClass: "h-9 w-8",
  },
  {
    name: "Privy",
    src: "/sponsors/privy.svg",
    job: "Policy-capped org wallet pays ~$0.03 — visitor is not charged",
    markClass: "h-6 w-auto",
  },
  {
    name: "OpenSEO",
    src: "/sponsors/openseo.png",
    job: "Web intelligence and SEO evidence for each protocol",
    markClass: "h-8 w-8",
  },
  {
    name: "x402",
    src: "/sponsors/x402.svg",
    job: "Paid deep analysis — ~$0.03 USDC after Authorize",
    markClass: "h-6 w-auto",
  },
] as const;

export function SponsorLogo({
  name,
  src,
  className = "h-8 w-auto",
}: {
  name: string;
  src: string;
  className?: string;
}) {
  return <img src={src} alt={name} className={`object-contain ${className}`} />;
}

export function PartnerStrip({
  className = "",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "marks";
}) {
  if (variant === "marks") {
    return (
      <div className={className}>
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {SPONSORS.map((sponsor) => (
            <SponsorLogo
              key={sponsor.name}
              name={sponsor.name}
              src={sponsor.src}
              className={sponsor.markClass}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SPONSORS.map((sponsor) => (
          <div key={sponsor.name} className="border-brutal p-4 bg-paper space-y-3">
            <SponsorLogo name={sponsor.name} src={sponsor.src} className={sponsor.markClass} />
            <p className="font-display text-xs uppercase tracking-widest">{sponsor.name}</p>
            <p className="font-mono text-[11px] text-ink/60 leading-snug">{sponsor.job}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink/70">
        Scout researches without a wallet. Extra evidence is paid from the agent treasury after
        Authorize. The visitor does not fund $0.03.
      </p>
    </div>
  );
}
