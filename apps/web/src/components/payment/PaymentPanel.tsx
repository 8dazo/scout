"use client";

import { useState } from "react";
import type { PaymentPending, ResearchSession } from "@scout/schemas";
import { authorizePayment, denyPayment } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PaymentTimeline } from "./PaymentTimeline";
import { UncertaintyPanel } from "./UncertaintyPanel";
import { useScoutAuth } from "@/app/providers";
import { PaymentProof } from "./PaymentProof";

export function PaymentPanel({
  researchId,
  session,
  paymentPending,
  onComplete,
}: {
  researchId: string;
  session: ResearchSession;
  paymentPending: PaymentPending;
  onComplete: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"prompt" | "settled">("prompt");
  const [activeStep, setActiveStep] = useState(0);
  const [completedSession, setCompletedSession] = useState<ResearchSession | null>(null);
  const { getAccessToken, authenticated, login } = useScoutAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleAuthorize() {
    if (!authenticated) {
      login();
      setError("Sign in with Privy before authorizing the treasury payment.");
      return;
    }
    setLoading(true);
    setError(null);
    setActiveStep(2);
    try {
      setActiveStep(3);
      const completed = await authorizePayment(researchId, await getAccessToken());
      setCompletedSession(completed);
      setPhase("settled");
      setActiveStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment authorization failed");
      setLoading(false);
    }
  }

  async function handleSkip() {
    setLoading(true);
    try {
      await denyPayment(researchId, await getAccessToken());
      onComplete();
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-dialog-title"
        className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-paper border-brutal p-6 md:p-8 space-y-8"
      >
        <div className="text-center">
          <h1
            id="payment-dialog-title"
            className="font-display text-3xl md:text-4xl uppercase tracking-wide"
          >
            Scout Needs More Evidence
          </h1>
        </div>

        {phase === "prompt" ? (
          <>
            <UncertaintyPanel session={session} paymentPending={paymentPending} />

            <Card shadow>
              <p className="font-display text-xs uppercase tracking-widest text-signal">Scout treasury pays</p>
              <h2 className="font-display text-xl uppercase mt-2">{paymentPending.serviceName}</h2>
              <p className="font-mono text-3xl mt-4">${paymentPending.amount.toFixed(2)} USDC</p>
              <p className="mt-2 font-mono text-xs text-ink/60">
                Visitor wallet is not charged. Authorize lets Scout spend from its Privy policy wallet.
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <p className="font-display text-xs uppercase text-ink/50">Why?</p>
                  <p className="mt-1">{paymentPending.reason}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div>
                    <p className="text-ink/50 text-xs uppercase">Budget before</p>
                    <p>${paymentPending.budgetBefore.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-ink/50 text-xs uppercase">After purchase</p>
                    <p>${paymentPending.budgetAfter.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-ink/50 text-xs uppercase">Expected impact</p>
                  <p className="text-success font-display">HIGH</p>
                </div>
              </div>
            </Card>

            <PaymentTimeline activeStep={activeStep} />

            {error && <p role="alert" className="font-mono text-sm text-error">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="danger"
                loading={loading}
                onClick={handleAuthorize}
                className="flex-1"
              >
                Authorize Scout to pay ${paymentPending.amount.toFixed(2)} from its Privy policy wallet
              </Button>
              <Button variant="secondary" disabled={loading} onClick={handleSkip} className="flex-1">
                Skip
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-5">
            {completedSession?.paymentReceipt && (
              <PaymentProof receipt={completedSession.paymentReceipt} />
            )}
            <PaymentTimeline activeStep={5} />
            <Button onClick={onComplete} className="w-full">View completed report</Button>
          </div>
        )}
      </div>
    </div>
  );
}
