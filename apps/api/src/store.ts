import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from "node:fs";
import { join } from "node:path";
import {
  ResearchSessionSchema,
  type DecisionLogEntry,
  type ResearchSession,
} from "@scout/schemas";
import verifiedSessionData from "./verified-session.json" with { type: "json" };

const DATA_DIR = process.env.SCOUT_DATA_DIR ?? join(process.cwd(), ".scout-data");
const SESSIONS_FILE = join(DATA_DIR, "sessions.json");

type SessionStore = Record<string, ResearchSession>;

const verifiedSession = ResearchSessionSchema.parse(verifiedSessionData);
const VERIFIED_SESSIONS: SessionStore = {
  [verifiedSession.researchId]: verifiedSession,
};

function loadStore(): SessionStore {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(SESSIONS_FILE)) return { ...VERIFIED_SESSIONS };
  try {
    return {
      ...VERIFIED_SESSIONS,
      ...(JSON.parse(readFileSync(SESSIONS_FILE, "utf8")) as SessionStore),
    };
  } catch {
    return { ...VERIFIED_SESSIONS };
  }
}

function saveStore(store: SessionStore): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  const temporaryFile = `${SESSIONS_FILE}.${process.pid}.tmp`;
  writeFileSync(temporaryFile, JSON.stringify(store, null, 2), "utf8");
  renameSync(temporaryFile, SESSIONS_FILE);
}

export function getSettledSpend(): number {
  return Object.values(loadStore()).reduce(
    (total, session) => total + (session.paymentReceipt?.amount ?? 0),
    0,
  );
}

export function storageStatus() {
  return {
    directory: DATA_DIR,
    persistent: Boolean(process.env.SCOUT_DATA_DIR),
  };
}

export function saveSession(session: ResearchSession): void {
  const store = loadStore();
  store[session.researchId] = session;
  saveStore(store);
}

export function getSession(researchId: string): ResearchSession | null {
  const store = loadStore();
  return store[researchId] ?? null;
}

export function listSessions(filter?: { status?: ResearchSession["status"] }): ResearchSession[] {
  const store = loadStore();
  let sessions = Object.values(store);
  if (filter?.status) {
    sessions = sessions.filter((s) => s.status === filter.status);
  }
  return sessions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

const liveStreams = new Map<string, Set<(entry: DecisionLogEntry) => void>>();

export function subscribeToLogs(
  researchId: string,
  callback: (entry: DecisionLogEntry) => void,
): () => void {
  if (!liveStreams.has(researchId)) {
    liveStreams.set(researchId, new Set());
  }
  liveStreams.get(researchId)!.add(callback);
  return () => liveStreams.get(researchId)?.delete(callback);
}

export function emitLog(researchId: string, entry: DecisionLogEntry): void {
  liveStreams.get(researchId)?.forEach((cb) => cb(entry));
}
