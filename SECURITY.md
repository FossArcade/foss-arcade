# Security policy

Foss Arcade treats race attempts, donated runners, and Shelf installs as **hostile by default**. License checks are not a security gate. Policy shape: [`docs/governance/06-security-supply-chain.md`](./docs/governance/06-security-supply-chain.md).

## Report a vulnerability

**Coordinated disclosure** is the org default when players or keys are at risk: give maintainers a reasonable window, then sunshine the write-up. Coordinated is not forever-private.

### Preferred intake

1. **GitHub private advisory** on [FossArcade/foss-arcade](https://github.com/FossArcade/foss-arcade/security/advisories/new) (when the repo is public).
2. If that path is unavailable, open a **minimal public issue** titled `[security]` with no exploit detail and ask maintainers for a private channel.

Do **not** attach payloads, secrets, or working exploits to public issues.

### What to include

- Affected title / path / commit (or channel tip)
- Impact (player machine, org secrets, supply chain, integrity of races)
- Reproduction at a high level (no weaponized PoC required)
- Whether the issue is already public

## After a report

- Maintainers acknowledge and triage.
- A short public note is published when it is safe (advisory, incident issue, or changelog pointer). Redact only true secrets or abuse material.
- Fixes land in-tree. Silent "we fixed it in Discord" is invalid process.

## Player surface (honest warnings)

- Official channel tips should be checksummed.
- Sideload and unsigned overlays stay allowed with **warnings** — no DRM.
- Mods are opt-in.

## Safe harbor

Good-faith research that follows this file and does not harm players or the commons pot is welcome. Do not DoS the forge, exfiltrate other people's data, or pivot through donated runners.

This file is **not legal advice**.
