"use client";

import { createContext, useContext } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const ScoutAuthContext = createContext({
  getAccessToken: async (): Promise<string | null> => null,
  ready: true,
  authenticated: false,
  login: () => {},
  logout: async () => {},
});

function PrivyAuthBridge({ children }: { children: React.ReactNode }) {
  const { getAccessToken, ready, authenticated, login, logout } = usePrivy();
  return (
    <ScoutAuthContext.Provider value={{ getAccessToken, ready, authenticated, login, logout }}>
      {children}
    </ScoutAuthContext.Provider>
  );
}

export function useScoutAuth() {
  return useContext(ScoutAuthContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  if (!appId) {
    return children;
  }
  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: { theme: "dark", accentColor: "#22d3ee" },
        embeddedWallets: { createOnLogin: "users-without-wallets" },
      }}
    >
      <PrivyAuthBridge>{children}</PrivyAuthBridge>
    </PrivyProvider>
  );
}
