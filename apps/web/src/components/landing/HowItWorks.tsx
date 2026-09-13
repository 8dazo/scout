import { SponsorLogo } from "@/components/shell/PartnerStrip";

const STEPS = [
  {
    n: "01",
    title: "Ask a question",
    body: "Type a research prompt. No Connect Wallet. No visitor login required.",
  },
  {
    n: "02",
    title: "The Graph",
    body: "One Messari Lending/CDP query across protocols on Base — live Gateway data, not a mock.",
    logos: [{ name: "The Graph", src: "/sponsors/the-graph.svg", className: "h-8 w-8" }],
  },
  {
    n: "03",
    title: "Score + uncertainty gate",
    body: "On-chain, SEO, and confidence scores. If the answer is thin, Scout asks to buy extra evidence.",
    logos: [{ name: "OpenSEO", src: "/sponsors/openseo.png", className: "h-7 w-7" }],
  },
  {
    n: "04",
    title: "Authorize",
    body: "Scout’s Privy policy wallet pays ~$0.03 USDC via x402. The visitor is not charged and does not fund the treasury.",
    logos: [
      { name: "Privy", src: "/sponsors/privy.svg", className: "h-5 w-auto" },
      { name: "x402", src: "/sponsors/x402.svg", className: "h-5 w-auto" },
    ],
  },
  {
    n: "05",
    title: "ENSv2",
    body: "Status write on scout-agent.eth plus a report you can verify on-chain.",
    logos: [{ name: "ENSv2", src: "/sponsors/ens.svg", className: "h-8 w-7" }],
  },
] as const;

export function HowItWorks() {
  return (
    <div>
      <p className="font-display text-xs uppercase tracking-widest text-signal mb-6">
        How it works
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {STEPS.map((step) => (
          <div key={step.n} className="border-brutal p-4 bg-paper flex flex-col gap-3 min-h-[180px]">
            <div className="flex items-start justify-between gap-2">
              <span className="font-display text-2xl leading-none">{step.n}</span>
              {"logos" in step && step.logos ? (
                <div className="flex items-center gap-2">
                  {step.logos.map((logo) => (
                    <SponsorLogo
                      key={logo.name}
                      name={logo.name}
                      src={logo.src}
                      className={logo.className}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            <p className="font-display text-sm uppercase tracking-wide">{step.title}</p>
            <p className="font-mono text-[11px] text-ink/70 leading-snug">{step.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-6">
        <a
          href="#ask"
          className="font-display text-sm uppercase tracking-widest text-signal hover:underline"
        >
          Ask Scout.
        </a>
      </p>
    </div>
  );
}
