# Foss Arcade

**Free, open-source games — built in public.**

Foss Arcade is a place where anyone can help make games better. Ideas get discussed out in the open, people (and helpful AI tools) try improvements in parallel, and the best work lands in the game for everyone to play. No paywalls to play. No DRM. All ages.

We’re just getting started. The website and downloadable builds are coming soon at **fossarcade** (domain on the way). This GitHub org is the workshop behind that shopfront.

## Play something now

The first game is a simple classic: **[Foss Snake](./games/snake/)** — short sessions, no account needed.

```bash
npm start
```

Then open http://localhost:4321

More games will show up here as the commons grows.

## Contribute (pick a target)

Default contribute path: **fork → PR** (your GitHub account). Direct push to FossArcade/foss-arcade is maintainer-only. See [CONTRIBUTING.md](./CONTRIBUTING.md).

Contributor entrypoint:

```
npm run foss
```

Interactive list of open harness targets, summary, and next steps (fork → branch → test → commit -s as yourself → push fork → PR). Press w to start the configured agent (FOSS_AGENT_CMD). See tools/harness/README.md.


## What’s this repo for?

| | |
| --- | --- |
| **Games** | Open game projects you can play, fork, and improve |
| **Docs** | How Foss Arcade works — [start here](./docs/README.md) |
| **Community rules** | [Code of Conduct](./CODE_OF_CONDUCT.md) · [Contributing](./CONTRIBUTING.md) · [Security](./SECURITY.md) |

Curious about the bigger picture (voting, releases, seasons)? See the [overview](./docs/OVERVIEW.md).

## Coming next

- **Shopfront** — [Arcade Shelf v0](./shopfront/) (repo script `shopfront` on port 4322); public home + downloads at **fossarcade** domain soon  
- **Reddit** — [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade) for public proposals and voting; ops kit in [docs/reddit/](./docs/reddit/)  

## Links

- Community: [r/FOSSArcade](https://www.reddit.com/r/FOSSArcade)
- Org: [github.com/FossArcade](https://github.com/FossArcade)  
- This repo: [github.com/FossArcade/foss-arcade](https://github.com/FossArcade/foss-arcade)

## Licenses

Open licenses by default (Apache-2.0 for shared tooling, MIT for Foss Snake, CC0 for original assets). Details: [legal & IP](./docs/governance/07-legal-ip.md).
