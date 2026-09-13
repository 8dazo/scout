# Demo Script (3:30)

1. **0:00 Problem** — On-chain and web data live in different worlds
2. **0:15 Prompt** — "Analyze Base lending. $0.50 budget."
3. **0:30 Graph** — MCP discovery + "1 query × N protocols" + live metrics
4. **1:10 OpenSEO** — Search gap vs on-chain growth
5. **1:35 Score** — Gate triggers when the top-two gap is ≤5 points or confidence is <70%
6. **1:50 Payment** — 402 → Privy sign → settled
7. **2:10 ENS** — scout-agent.eth + permission summary + public MCP record
8. **2:30 Result** — Preserved report: sFRAX on Compound V3, opportunity 51.4, risk 30, 11 candidates, 15 evidence sources
9. **3:10 Close** — One-liner for judges

## Demo prompt

```
Rank the top lending assets across Base protocols. Which token market has the best opportunity for a new developer product? I have a $0.50 research budget.
```

## Token leaderboard pitch (30s)

Scout queries the five configured Base Messari deployments with one template and labels the Aave 1-hour native adapter separately. In the preserved run, Moonwell and Compound V3 returned token markets, native Aave supplied event data, two deployments were disclosed as skipped, and 11 candidates were ranked. Result: sFRAX on Compound V3 ranked first at 51.4/100.

## Pre-recording deployment check

- Deploy the current `dev` branch before recording; the bundled verified report snapshot and updated Sepolia RPC must be live.
- Confirm `/agent` resolves `scout-agent.eth` rather than stale UI copy.
- Restart the API once and confirm the preserved report still loads, proving the route no longer depends on Render's ephemeral session file.
- Confirm the report shows the $0.03 receipt and the agent page shows the ENS budget, MCP record and scoped permissions.
- If a fresh source or ENS write fails, show the disclosed failure and use the preserved report plus existing explorer proof. Do not hide or replace failed evidence.

## Evidence to capture

- Subgraph discovery log
- Same query template across protocols
- OpenSEO tool output in sources
- 402 response headers
- Privy policy chips + spend tx
- ENS Sepolia success transaction and unauthorized-write revert
- ENS `agent.mcp` readback and [public MCP update transaction](https://sepolia.etherscan.io/tx/0x968cc1b7fc77a268815be40e55d2d197b11ebdcbb1015f88216c904467e22665)
- Public app: <https://scout-web-ethglobal-2026.onrender.com>
- Preserved paid testnet report: <https://scout-web-ethglobal-2026.onrender.com/research/3c47f2ea-52a1-40fc-b0cf-a6776d7c5183>
- Preserved-report x402 receipt: <https://sepolia.basescan.org/tx/0x487cf199e32403636324c2a2157aa6cd6683d116b5a94932fb47c4765239e6c8>
