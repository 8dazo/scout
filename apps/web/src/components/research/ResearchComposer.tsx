"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";

export function ResearchComposer({ initialPrompt = "" }: { initialPrompt?: string }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState(initialPrompt);

  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
  }, [initialPrompt]);

  function handleSubmit() {
    if (!prompt.trim()) return;
    router.push(`/research/new?prompt=${encodeURIComponent(prompt)}`);
  }

  return (
    <div className="space-y-6">
      <Textarea
        label="Ask a research question"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        placeholder="Analyze the most promising lending protocol on Base for a developer product…"
        className="text-lg min-h-[120px]"
      />
      <Button onClick={handleSubmit} disabled={!prompt.trim()} className="group gap-3">
        <span>Run Research</span>
        <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
      </Button>
    </div>
  );
}
