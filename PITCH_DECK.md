# Scout — ETHOnline 2026 Pitch Deck

Present one slide at a time. Speaker notes are spoken English, not a restatement of the bullets. Facts below are from deployed testnet proof captured between 11 and 13 September 2026. No simulated settlement. No synthetic ENS receipts.

**One-liner:** Scout is a protocol research agent that ranks live Base lending from The Graph, requests a policy-controlled evidence purchase when uncertain, and writes the result to `scout-agent.eth`.

**Live app:** [scout-web-ethglobal-2026.onrender.com](https://scout-web-ethglobal-2026-y6tp.onrender.com/)

---

## 01 — Title

**SCOUT**

Autonomous protocol intelligence agent

ETHOnline 2026 · Start Fresh

Ranks live Base lending from The Graph. Pays for extra evidence after authorization. Writes the result to `scout-agent.eth`.

[scout-web-ethglobal-2026.onrender.com](https://scout-web-ethglobal-2026-y6tp.onrender.com/)

**Notes (0:00–0:15):** Judges, this is Scout. You type a research question. You do not connect a wallet. Scout pulls live Graph data, scores the market, and if it is not sure, it asks you to authorize three cents from its policy wallet for more evidence. Then it writes the result on-chain as scout-agent.eth.

---

## 02 — Problem

On-chain activity and search demand live in different worlds.

- Contracts show what users are doing. Search shows what builders are looking for. Those signals are usually analyzed separately.
- Lending markets move faster than blog posts. TVL and SERP tell different stories.
- Builders guess which token market to ship against.

**Notes (0:15–0:35):** Crypto research is split. The Graph can show how cbBTC is moving on Aave. OpenSEO adds evidence about search visibility and content gaps. Scout puts those two signal layers into one cited decision instead of asking a builder to reconcile separate dashboards manually.

---

## 03 — Solution

Ask → Graph + OpenSEO → score → buy evidence if uncertain → ENS report.

- No Connect Wallet. The visitor does not fund the $0.03 evidence payment.
- The Graph is load-bearing. If live data fails, research stops.
- After authorization, a Privy policy treasury pays x402. ENSv2 supplies runtime identity, permissions and a budget cap.

**Notes (0:35–0:55):** The product is a single loop. You ask. Scout discovers Base lending through The Graph and enriches it with search demand. It scores six evidence dimensions. If the answer is too close or confidence is thin, it pauses for authorization and buys candidate-specific diagnostics. Then it writes status to scout-agent.eth. You never paste a private key. Scout’s wallet does the spend, inside a cap.

---

## 04 — How it works

| Step | What happens |
|---|---|
| 01 Ask | Type a prompt. No wallet. No visitor login required. |
| 02 The Graph | One Messari Lending/CDP query across protocols on Base. Live Gateway data. |
| 03 Score | On-chain + SEO + confidence. If the answer is thin, Scout asks to buy extra evidence. |
| 04 Authorize | Scout’s Privy policy wallet pays ~$0.03 USDC via x402. The visitor is not charged. |
| 05 ENSv2 | Status write on `scout-agent.eth`. Report you can verify on-chain. |

**Notes (0:55–1:15):** Five steps, all in the product. Ask. Graph. Score. Authorize. ENS. The visitor stays on the page. Scout uses separate policy and ENS wallets on their respective testnets, with both roles visible in one research session.

---

## 05 — The Graph

One query × N protocols. Native adapters labeled separately.

- Five Base Messari deployments configured: Moonwell, Seamless, Compound V3, QiDao, and Aave V3.
- Aave native 1-hour event subgraph is a separate adapter, labeled as native — not mixed into the standard results.
- Preserved run: all five queried; two Messari deployments plus native Aave returned token-level data; 11 candidates from 15 evidence sources; two skips disclosed.
- Graph failure stops research. Streamable HTTP MCP + `SKILL.md`; current build passes local initialize and must be redeployed before recording.

**Notes (1:15–1:40):** This is the Graph prize story. We did not write five custom queries. We wrote one Messari template and pointed it at five configured deployments. In the preserved run, two returned usable token markets, two were disclosed as skipped, and Aave supplied separately labeled native one-hour data. That partial-failure disclosure matters: Scout does not invent missing TVL. Other agents can call the same research through our MCP tool.

---

## 06 — Uncertainty gate

Scout makes its decision thresholds explicit.

- Model: onchain growth 30% · user growth 20% · search demand 20% · competitive gap 15% · SEO opportunity 10% · evidence confidence 5%.
- Trigger: top-two opportunity gap **≤ 5 points** **or** confidence **< 70%**.
- Clear result: leader ahead by **> 10 points** **and** confidence **≥ 75%**.
- Action after visitor authorization: official x402 v2 candidate diagnostics at **$0.03 USDC** on Base Sepolia.
- A random payment header never unlocks the route. Unpaid requests return HTTP 402.

**Notes (1:40–2:00):** Most AI demos always look confident. Scout has an explicit uncertainty gate. If the top two scores are within five points, or evidence confidence is below seventy percent, it stops and asks to buy candidate-specific diagnostics. That purchase is a real HTTP 402 using official middleware. Three cents of testnet USDC. No header spoofing. The visitor decides whether the policy wallet should proceed.

---

## 07 — Privy financial flow

The visitor is not charged. Scout’s policy wallet is.

- Payer: [`0x38B28037192d6b44B537c2c6F717f150a1989E69`](https://sepolia.basescan.org/address/0x38B28037192d6b44B537c2c6F717f150a1989E69)
- Policy: `eebmveuo1rtadd1pua6vll2x` — Base Sepolia USDC EIP-3009 only, allowlisted payee, **max 0.10 USDC**
- Preserved report settlement: [0.03 USDC on Base Sepolia](https://sepolia.basescan.org/tx/0x487cf199e32403636324c2a2157aa6cd6683d116b5a94932fb47c4765239e6c8)
- UI keeps payer, payee, amount, policy ID, service URL, timestamp, and Basescan link in one receipt

**Notes (2:00–2:25):** Privy is the financial flow, not a login badge. There is no seed in the browser. A restricted server wallet signs the x402 authorization. The policy is hard: this chain, this USDC, this payee, ten cents maximum. We funded it, we settled three cents, and the receipt is on Basescan and in the report. If you take the policy off, the agent cannot pay. That is the control.

---

## 08 — ENSv2 control plane

`scout-agent.eth` is infrastructure, not a sticker.

- Permissioned Resolver on Ethereum Sepolia. Forward resolution: `0x9BCB…3eaE`
- `research.budget` is read before an x402 purchase. `agent.mcp` resolves to the public MCP URL.
- Agent holds record-scoped `ROLE_SET_TEXT` for `research.status` and `research.lastReport` only.
- Authorized write [succeeds](https://sepolia.etherscan.io/tx/0x2b65dbcf1de552eb8c31ad20d39a84107d6c59fe0b85f572c36461b8a1a0235b). Unauthorized write [is mined and reverts](https://sepolia.etherscan.io/tx/0xebc0c9435af2af0c1146d28b03b526082dd50b3c0556709254f95ae0fec2f831).

**Notes (2:25–2:50):** ENS is in the runtime path. Scout resolves the name, reads the budget cap, and only then authorizes payment. The agent can update status and last report. It cannot change the resolver or the root. We proved that with two transactions: the agent write lands, the unauthorized key is mined and reverts. The MCP URL you would give another agent is an ENS text record, not a hardcoded string in a README.

---

## 09 — Proof

Preserved deployed testnet run. Public endpoints. Explorer links.

- Report: [sFRAX on Compound V3](https://scout-web-ethglobal-2026-y6tp.onrender.com//research/3c47f2ea-52a1-40fc-b0cf-a6776d7c5183) — opportunity **51.4**, risk **30**, 100% confidence, 15 evidence sources
- Run evidence: 11 ranked candidates, 3.3-point top-two gap, $0.03 spent, settlement `0x487cf199…39e6c8`
- Web · [API health](https://scout-api-ethglobal-2026-rljy.onrender.com/health) · [MCP](https://scout-api-ethglobal-2026-rljy.onrender.com/mcp) · [OpenAPI](https://scout-api-ethglobal-2026-rljy.onrender.com/openapi.json)
- Payments on **Base Sepolia**. ENS on **Ethereum Sepolia**. Separate wallets. Separate explorers.

**Notes (2:50–3:10):** Do not take our word. Open the preserved report. You will see the Graph sources, skipped-source disclosure, score breakdown, and Privy receipt. The winner is sFRAX on Compound V3 at 51.4 opportunity and 30 risk. Scout read the ENS budget before payment; the agent page and explorer links show the identity and scoped EAC proof separately. Two networks on purpose: Base Sepolia for USDC and Ethereum Sepolia for ENSv2.

---

## 10 — What is differentiated

One research loop joins standardized data, explicit uncertainty and verifiable agent controls.

- **Graph research:** a standardized Messari query, a public MCP tool and a labeled native adapter.
- **Evidence purchase:** an explicit uncertainty gate, bounded x402 spend and an explorer-linked receipt.
- **Agent control plane:** a real ENSv2 name, record-scoped EAC and an onchain budget cap.

**Notes (3:10–3:25):** Scout’s differentiation is the connected loop. Standardized Graph evidence drives the ranking. Explicit uncertainty decides when more evidence is worth buying. Privy and x402 constrain and prove the spend. ENS supplies the agent name, scoped permissions, budget and MCP location. We are not stretching into prizes we did not finish.

---

## 11 — Close

Demo prompt:

> Rank the top lending assets across Base protocols. Which token market has the best opportunity for a new developer product? I have a $0.50 research budget.

**Scout turns uncertain Web3 questions into defensible, paid, on-chain decisions.**

- Repo: [github.com/RohitSah23/scout](https://github.com/RohitSah23/scout)
- App: [scout-web-ethglobal-2026.onrender.com](https://scout-web-ethglobal-2026-y6tp.onrender.com/)
- Deck: [scout-web-ethglobal-2026-y6tp.onrender.com/pitch-deck](https://scout-web-ethglobal-2026-y6tp.onrender.com/pitch-deck)
- Report: [preserved deployed testnet run](https://scout-web-ethglobal-2026-y6tp.onrender.com//research/3c47f2ea-52a1-40fc-b0cf-a6776d7c5183)
- MCP: [scout-api-ethglobal-2026.onrender.com/mcp](https://scout-api-ethglobal-2026-rljy.onrender.com/mcp)

**Notes (3:25–3:40):** If you remember one sentence: Scout turns uncertain Web3 questions into defensible, paid, on-chain decisions. Live Graph. A three-cent policy payment when the answer is thin. A name you can resolve. That is the demo. Thank you.

---

# Appendix — ETHGlobal submission copy

Paste into the ETHGlobal project form. Do not edit numbers without checking [README.md](../README.md) and [BOUNTY_STATUS.md](./BOUNTY_STATUS.md).

## Tagline

Protocol research agent that ranks live Base lending from The Graph, buys extra evidence after policy-controlled authorization, and writes the result to scout-agent.eth.

## Short description

Scout ranks Base lending markets from live Graph data and web demand, then requests an evidence purchase when the ranking is uncertain. One Messari Lending/CDP query runs across configured protocols; OpenSEO adds search-gap evidence and sparse results are disclosed. After visitor authorization, a Privy policy wallet pays 0.03 testnet USDC via x402. scout-agent.eth holds the budget cap and MCP URL. Preserved report: sFRAX on Compound V3, opportunity 51.4, risk 30.

*(393 characters)*

## How it’s made

TypeScript monorepo. Next.js 15 app (`apps/web`) streams a Hono API (`apps/api`) over typed SSE. `@scout/graph` queries The Graph gateway with one Messari Lending/CDP template plus a labeled Aave native adapter. `@scout/openseo` enriches search demand. `@scout/scoring` applies a deterministic six-dimension opportunity score and an explicit uncertainty gate. Official x402 v2 middleware gates candidate-specific diagnostics on Base Sepolia USDC. After visitor authorization, a Privy server wallet with a restricted policy signs the payment. `@scout/ens` reads and writes ENSv2 Sepolia through a Permissioned Resolver and record-scoped EAC. OpenRouter narrates the recommendation from the fixed score breakdown. Public Streamable HTTP MCP exposes `protocol_opportunity_analysis`. Fail-closed: missing Graph, payment, or ENS config does not fabricate receipts.

Partners in the runtime path: **The Graph**, **Privy**, **x402**, **ENSv2**, **OpenSEO**. OpenSEO is product intelligence, not an ETHOnline prize partner.

## Prize blurbs

### The Graph — Best Use of Composable or Standardized Graph Products ($5,000)

Scout runs one Messari Lending/CDP query template against live Graph gateway deployments for Moonwell, Seamless, Compound V3, QiDao, and Aave V3. That shared schema is the point: the same fields (input token, TVL, 7-day snapshots, top markets) flatten into a cross-protocol token leaderboard. Aave’s native 1-hour event subgraph is a separate adapter and is labeled native so standardized results are not mixed with custom ones. Graph is live provider data, not a fixture. Public repo, public app, and a 2–4 minute video show the template, the deployment IDs, and the ranked output.

### The Graph — Best AI Tooling or AI Use Case (From Scratch) ($5,000)

The Graph is load-bearing: if the gateway cannot return lending data, research stops. In the preserved run, live Graph results drove an 11-asset ranking, six-dimension scoring, an uncertainty decision, and natural-language output via OpenRouter. Scout exposes a public Streamable HTTP MCP server (`protocol_opportunity_analysis`) and a `SKILL.md` so other agents can call the same loop. First repository commit is 5 September 2026, after ETHOnline began — Start Fresh, not Continuity. The submission video will show a new prompt with live sources against the public app and MCP.

### Privy — Best financial flow ($2,500)

A Privy-managed server wallet, not a browser seed, signs a real x402 EIP-3009 authorization. Attached policy `eebmveuo1rtadd1pua6vll2x` allows only Base Sepolia USDC, an allowlisted payee, and at most 0.10 USDC. The preserved report flow settled **0.03 USDC**: [Basescan 0x487cf199…39e6c8](https://sepolia.basescan.org/tx/0x487cf199e32403636324c2a2157aa6cd6683d116b5a94932fb47c4765239e6c8). The report UI shows wallet, policy ID, amount, payee, service URL, timestamp, and explorer link together. The visitor does not fund the treasury. Mocks are not used for settlement.

### ENS — Best Use of ENSv2 ($4,500)

ENSv2 Sepolia is in the runtime path, not hardcoded. `scout-agent.eth` has a per-owner Permissioned Resolver. Scout resolves the name, reads `research.budget` before authorizing x402, and publishes `agent.mcp` to the public MCP URL. The agent wallet may set `research.status` and `research.lastReport` only. Authorized write: [0x2b65db…0235b](https://sepolia.etherscan.io/tx/0x2b65dbcf1de552eb8c31ad20d39a84107d6c59fe0b85f572c36461b8a1a0235b). Unauthorized write mined and reverted: [0xebc0c9…2f831](https://sepolia.etherscan.io/tx/0xebc0c9435af2af0c1146d28b03b526082dd50b3c0556709254f95ae0fec2f831). Values are read back from chain.

## Demo prompt

```
Rank the top lending assets across Base protocols. Which token market has the best opportunity for a new developer product? I have a $0.50 research budget.
```

## Video beat sheet (0:00–3:30)

Synced to [DEMO.md](./DEMO.md). Record a live run — no prerecorded result.

| Time | Beat | On screen | Say |
|---|---|---|---|
| 0:00 | Problem | Landing headline | On-chain activity and web demand live in different worlds. Builders guess which lending market to ship against. |
| 0:15 | Prompt | Composer with demo prompt, $0.50 budget | No Connect Wallet. Watch Scout work. |
| 0:30 | Graph | Discovery log, same Messari template, live metrics | One query across protocols. Native Aave 1-hour data labeled separately. Graph is live; if it fails, we stop. |
| 1:10 | OpenSEO | Search / SERP evidence | Search gap versus on-chain growth. That is the second world, in the same score. |
| 1:35 | Score | Uncertainty panel | The top-two gap is at most five points or confidence is below seventy percent. Scout requests extra evidence. |
| 1:50 | Payment | 402 → Privy policy → receipt | Three cents from the policy wallet. Visitor is not charged. Hash on Basescan. |
| 2:10 | ENS | `scout-agent.eth`, permissions, MCP record | Identity, budget cap, public MCP URL. Agent can write status. Unauthorized key reverts. |
| 2:30 | Result | Winner + spend | sFRAX on Compound V3. Preserved report: opportunity 51.4, risk 30, 11 candidates, 15 evidence sources. |
| 3:10 | Close | App + repo + MCP links | Scout turns uncertain Web3 questions into defensible, paid, on-chain decisions. |

**Token leaderboard cut (optional 30s):** Scout discovers Moonwell, Seamless, Aave, Compound V3, and QiDao on Base. One Messari template pulls the top markets. Aave adds 1-hour live events. Result: a cross-protocol token leaderboard — cbBTC on Aave ranks first for short-term lending activity.

## Links for the form

| Surface | URL |
|---|---|
| Repository | https://github.com/RohitSah23/scout |
| Web | https://scout-web-ethglobal-2026-y6tp.onrender.com/ |
| Pitch deck | https://scout-web-ethglobal-2026-y6tp.onrender.com/pitch-deck |
| Preserved report | https://scout-web-ethglobal-2026-y6tp.onrender.com//research/3c47f2ea-52a1-40fc-b0cf-a6776d7c5183 |
| API health | https://scout-api-ethglobal-2026-rljy.onrender.com/health |
| MCP | https://scout-api-ethglobal-2026-rljy.onrender.com/mcp |
| OpenAPI | https://scout-api-ethglobal-2026-rljy.onrender.com/openapi.json |
| Preserved-report x402 tx | https://sepolia.basescan.org/tx/0x487cf199e32403636324c2a2157aa6cd6683d116b5a94932fb47c4765239e6c8 |
| ENS authorized write | https://sepolia.etherscan.io/tx/0x2b65dbcf1de552eb8c31ad20d39a84107d6c59fe0b85f572c36461b8a1a0235b |
| ENS unauthorized revert | https://sepolia.etherscan.io/tx/0xebc0c9435af2af0c1146d28b03b526082dd50b3c0556709254f95ae0fec2f831 |
| ENS MCP record | https://sepolia.etherscan.io/tx/0x968cc1b7fc77a268815be40e55d2d197b11ebdcbb1015f88216c904467e22665 |
