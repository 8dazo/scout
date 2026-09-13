"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { startResearch } from "../api";
import { useScoutAuth } from "@/app/providers";

export function useStartResearch() {
  const router = useRouter();
  const { getAccessToken, authenticated, login } = useScoutAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start(params: {
    request: string;
    chain?: string;
    category?: string;
  }) {
    setLoading(true);
    setError(null);
    if (!authenticated) {
      login();
      setError("Sign in with Privy, then start the mission again.");
      setLoading(false);
      return;
    }
    try {
      const { researchId } = await startResearch(params, await getAccessToken());
      router.push(`/research/${researchId}`);
    } catch {
      setError("Failed to start research mission.");
      setLoading(false);
    }
  }

  return { start, loading, error };
}
