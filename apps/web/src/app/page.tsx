"use client";

import { useState } from "react";
import { ScoutShell } from "@/components/shell/ScoutShell";
import { PartnerStrip } from "@/components/shell/PartnerStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ResearchComposer } from "@/components/research/ResearchComposer";
import { MissionCard } from "@/components/research/MissionCard";
import { Section } from "@/components/ui/Section";

const MISSIONS = [
  {
    tag: "Find a Build Opportunity",
    prompt: "Which lending protocol on Base has the biggest developer opportunity?",
  },
  {
    tag: "Find Market Gaps",
    prompt: "Find protocols with strong on-chain growth but weak web visibility.",
  },
  {
    tag: "Compare",
    prompt: "Compare the top lending protocols on Base by growth, users and competition.",
  },
  {
    tag: "Risk",
    prompt: "Which protocol shows the strongest growth quality right now?",
  },
  {
    tag: "DEX vs SEO",
    prompt: "Which DEX on Base has the strongest growth with the weakest SEO?",
  },
  {
    tag: "New Users",
    prompt: "Which Base lending market is attracting the most new users this week?",
  },
  {
    tag: "Aave vs Compound",
    prompt: "Compare Aave V3 and Compound V3 on Ethereum for a new dashboard product.",
  },
  {
    tag: "TVL vs Search",
    prompt: "Where is TVL high but developer search demand still low on Base?",
  },
];

const HERO_FACTS = [
  { value: "No wallet", label: "Visitor connect" },
  { value: "$0.03", label: "Capped evidence fee" },
  { value: "6 signals", label: "Deterministic score" },
];

const FOOTER_MAP = [
  { word: "Discover", step: "01 Ask — no wallet" },
  { word: "Compare", step: "02 Graph + 03 Score" },
  { word: "Verify", step: "04 Privy authorize" },
  { word: "Decide", step: "05 ENS report" },
];

export default function HomePage() {
  const [prompt, setPrompt] = useState("");

  function selectMission(nextPrompt: string) {
    setPrompt(nextPrompt);
    document.getElementById("ask")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <ScoutShell>
      <section className="border-b-2 border-ink">
        <div className="max-w-scout mx-auto px-4 md:px-8 py-12 flex items-center min-h-[calc(100svh-101px)] md:min-h-[calc(100svh-65px)]">
          <div className="w-full grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-signal">
                <span className="h-2 w-2 rounded-full bg-signal" />
                ETHOnline 2026 · Protocol research agent
              </p>
              <h1 className="mt-5 text-display text-5xl md:text-6xl lg:text-7xl">
                <span className="block">What should</span>
                <span className="block">
                  Scout <span className="text-signal">find?</span>
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base md:text-lg leading-relaxed text-ink/70">
                Live Graph data ranks Base lending. When the call is close, Scout buys evidence and
                writes the result to <span className="font-mono text-[0.95em]">scout-agent.eth</span>.
              </p>
              <div className="mt-8 max-w-md border-t-2 border-ink pt-4 grid grid-cols-3 gap-4">
                {HERO_FACTS.map((fact) => (
                  <div key={fact.label}>
                    <p className="font-display text-lg uppercase leading-none">{fact.value}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink/50">
                      {fact.label}
                    </p>
                  </div>
                ))}
              </div>
              <PartnerStrip variant="marks" className="mt-8" />
            </div>

            <div id="ask" className="scroll-mt-24">
              <div className="border-brutal bg-paper-muted p-5 md:p-6 shadow-brutal">
                <ResearchComposer prompt={prompt} onPromptChange={setPrompt} />
                <div className="mt-6 border-t-2 border-ink/15 pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink/50">
                    Or start from
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {MISSIONS.slice(0, 3).map((m) => (
                      <button
                        key={m.tag}
                        type="button"
                        onClick={() => setPrompt(m.prompt)}
                        className="border-brutal bg-paper px-3 py-1.5 font-display text-[11px] uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
                      >
                        {m.tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section variant="data">
        <div className="max-w-scout mx-auto px-4 md:px-8">
          <HowItWorks />
        </div>
      </Section>

      <Section variant="data">
        <div className="max-w-scout mx-auto px-4 md:px-8">
          <p className="font-display text-xs uppercase tracking-widest text-signal mb-6">
            Sponsors and their jobs
          </p>
          <PartnerStrip />
        </div>
      </Section>

      <Section variant="data">
        <div className="max-w-scout mx-auto px-4 md:px-8">
          <p className="font-display text-xs uppercase tracking-widest text-ink/50 mb-4">
            Example missions
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {MISSIONS.map((m) => (
              <MissionCard
                key={m.tag}
                tag={m.tag}
                prompt={m.prompt}
                onSelect={() => selectMission(m.prompt)}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section variant="editorial">
        <div className="max-w-scout mx-auto px-4 md:px-8 text-center space-y-8">
          <div className="grid sm:grid-cols-4 gap-6">
            {FOOTER_MAP.map((item) => (
              <div key={item.word} className="space-y-2">
                <p className="font-display text-xl md:text-2xl uppercase tracking-wide">
                  {item.word}
                </p>
                <p className="font-mono text-[11px] text-ink/60">{item.step}</p>
              </div>
            ))}
          </div>
          <p className="max-w-xl mx-auto text-ink/70 leading-relaxed">
            Scout combines live on-chain activity, web intelligence and paid evidence to turn
            uncertain Web3 questions into defensible decisions.
          </p>
        </div>
      </Section>
    </ScoutShell>
  );
}
