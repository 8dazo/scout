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
      <Section variant="editorial">
        <div className="max-w-scout mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <p className="font-display text-xs uppercase tracking-widest text-signal mb-4">
              ETHOnline 2026 protocol research agent
            </p>
            <h1 className="text-display text-5xl md:text-7xl lg:text-8xl space-y-1">
              <span className="block">What Should</span>
              <span className="block">
                Scout <span className="text-signal">Find?</span>
              </span>
            </h1>
            <div className="mt-6 space-y-4 text-lg md:text-xl leading-relaxed text-ink/80">
              <p>
                Scout ranks Base lending from live Graph data. When the answer is too close to
                call, it can buy extra evidence from a capped Privy treasury.
              </p>
              <p>
                The result is written to{" "}
                <span className="font-mono text-base">scout-agent.eth</span>. No Connect Wallet —
                Scout’s policy wallet pays the $0.03 evidence fee, not you.
              </p>
            </div>
            <PartnerStrip variant="marks" className="mt-8" />
          </div>

          <div id="ask" className="max-w-2xl mt-12 scroll-mt-24">
            <ResearchComposer prompt={prompt} onPromptChange={setPrompt} />
          </div>
        </div>
      </Section>

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
