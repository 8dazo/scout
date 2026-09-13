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
];

const FOOTER_MAP = [
  { word: "Discover", step: "01 Ask — no wallet" },
  { word: "Compare", step: "02 Graph + 03 Score" },
  { word: "Verify", step: "04 Privy authorize" },
  { word: "Decide", step: "05 ENS report" },
];

export default function HomePage() {
  const [selectedPrompt, setSelectedPrompt] = useState("");

  return (
    <ScoutShell>
      <Section variant="editorial">
        <div className="max-w-scout mx-auto px-4 md:px-8 space-y-16">
          <div className="max-w-3xl">
            <p className="font-display text-xs uppercase tracking-widest text-signal mb-4">
              ETHOnline 2026 protocol research agent
            </p>
            <h1 className="text-display text-5xl md:text-7xl lg:text-8xl space-y-1">
              <span className="block">What Should</span>
              <span className="block">
                Scout <span className="text-signal">Find?</span>
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-ink/80">
              Scout ranks Base lending from live Graph data, buys extra evidence from a capped
              Privy treasury when uncertain, and writes the result to{" "}
              <span className="font-mono text-sm">scout-agent.eth</span>.
            </p>
            <p className="mt-3 text-sm text-ink/70">
              No Connect Wallet. You do not fund the $0.03 evidence payment — Scout’s policy
              wallet does.
            </p>
            <PartnerStrip variant="marks" className="mt-8" />
          </div>

          <HowItWorks />

          <div id="ask" className="max-w-3xl scroll-mt-24">
            <ResearchComposer initialPrompt={selectedPrompt} />
          </div>
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
                onSelect={() => {
                  setSelectedPrompt(m.prompt);
                  document.getElementById("ask")?.scrollIntoView({ behavior: "smooth" });
                }}
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
          <p className="max-w-xl mx-auto text-ink/70">
            Scout combines live on-chain activity, web intelligence and paid evidence to turn
            uncertain Web3 questions into defensible decisions.
          </p>
        </div>
      </Section>
    </ScoutShell>
  );
}
