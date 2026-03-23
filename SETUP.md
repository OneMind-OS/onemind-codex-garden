# OneMind Codex Live — Setup & Operations

Technical reference for the Codex Live website and auto-sync pipeline.

---

## Architecture

```
onemind-codex-live/              ← This repo (Quartz website engine)
├── codex/                       ← Vault content (markdown) — EDIT HERE
│   ├── index.md                 ← Homepage
│   ├── _codex/                  ← Intelligence layer (skills, conventions)
│   ├── 00-24 UI (..)            ← Unified Intelligence quadrant
│   ├── 25-49 HP (..)            ← Holistic Performance quadrant
│   ├── 50-74 LE (..)            ← Legacy Evolution quadrant
│   ├── 75-99 GE (..)            ← Generational Entrepreneurship quadrant
│   ├── agent-examples/          ← Example agent configs
│   ├── integrations/            ← Integration guides
│   └── templates/               ← Starter templates
├── quartz/                      ← Quartz v4 engine (don't edit)
├── quartz.config.ts             ← Site config (title, theme, base URL)
├── quartz.layout.ts             ← Layout (sidebar, footer links)
├── wrangler.toml                ← Cloudflare Pages config
├── .github/workflows/
│   ├── deploy.yml               ← Auto-deploy to Cloudflare on push
│   └── sync-vault.yml           ← Auto-sync codex/ to student template
└── public/                      ← Build output (gitignored)
```

---

## Content Directory

Vault content lives in **`codex/`** (not Quartz's default `content/`). The build uses `-d codex` to point Quartz at this custom directory.

**Only edit files inside `codex/`** — everything else is Quartz engine code.

### Editing in Obsidian

Open this folder as your Obsidian vault to edit the live site:
```
~/Documents/onemind-codex-live/codex/
```

Changes here → git push → website auto-deploys + student template auto-syncs.

---

## Auto-Deploy Pipeline

On every push to `main`, two GitHub Actions workflows run in parallel:

### 1. Deploy to Cloudflare (`deploy.yml`)
- Checks out code
- Installs Node.js 22 + `npm ci`
- Builds: `npx quartz build -d codex`
- Deploys `public/` to Cloudflare Pages via `wrangler pages deploy`
- Takes ~2 minutes

### 2. Sync to Student Template (`sync-vault.yml`)
- Only triggers when files in `codex/**` change
- Checks out this repo + the student template repo
- Wipes old content in template repo (preserving `.git`, `README.md`, `LICENSE`)
- Copies `codex/*` into the template repo
- Renames `index.md` → `README.md` for GitHub display
- Commits as "OneMind Sync <sync@onemindcodex.com>"
- Takes ~30 seconds

---

## GitHub Secrets

Three secrets are configured on `OneMind-OS/onemind-codex-live`:

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier (`ce13703e0b76938c179ebc51e2945c7e`) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages deploy permission |
| `VAULT_SYNC_TOKEN` | GitHub fine-grained PAT with push access to `onemind-codex-template` |

---

## Cloudflare Pages

| Field | Value |
|-------|-------|
| Project name | `onemind-codex-garden` |
| Account | `zeus.vaults@pm.me` |
| Account ID | `ce13703e0b76938c179ebc51e2945c7e` |
| Deploy URL | `onemind-codex-garden.pages.dev` |
| Output dir | `./public` |
| Build tool | Wrangler CLI via GitHub Actions (not Cloudflare's built-in build) |

**Note:** The Cloudflare project name is `onemind-codex-garden` (from original setup). This is independent of the GitHub repo name and does not need to match.

---

## Student Template

Repo: [OneMind-OS/onemind-codex-template](https://github.com/OneMind-OS/onemind-codex-template)

- GitHub template repo (`Use this template` button)
- Contains only vault content (no Quartz engine)
- Auto-synced from `codex/` in this repo on every push
- Topics: obsidian, vault, productivity, life-os, codex, ai, template

Students get the full quadrant structure, `_codex/` intelligence layer, example agents, integrations, and templates.

---

## Local Development

```bash
# Install dependencies
npm ci

# Build the site
npx quartz build -d codex

# Build + serve locally with hot reload
npx quartz build -d codex --serve

# Deploy manually (requires wrangler OAuth or API token)
npx wrangler pages deploy ./public --project-name=onemind-codex-garden
```

---

## Theme

Solarpunk green palette in `quartz.config.ts`:

| Mode | Primary | Secondary | Tertiary/Highlight |
|------|---------|-----------|-------------------|
| Light | `#2d6a4f` | `#52b788` | `#d8f3dc` |
| Dark | `#52b788` | `#95d5b2` | `#1b4332` |

---

## Related Repos

| Repo | Purpose | Visibility |
|------|---------|------------|
| `OneMind-OS/onemind-codex` | Private main vault (source of truth) | Private |
| `OneMind-OS/onemind-codex-live` | This repo — public website | Public |
| `OneMind-OS/onemind-codex-template` | Student fork template (auto-synced) | Public |

---

## Local Folder Map

| Local Path | GitHub Repo | Purpose |
|------------|-------------|---------|
| `~/Documents/onemind-codex` | `onemind-codex` | Private vault |
| `~/Documents/onemind-codex-live` | `onemind-codex-live` | Quartz website (this) |
| `~/Documents/onemind-codex-template` | `onemind-codex-template` | Student template |

---

## Workflow: Making Changes

1. Edit files in `codex/` (via Obsidian, VS Code, or any editor)
2. `git add -A && git commit -m "description" && git push`
3. GitHub Actions auto-deploys to Cloudflare (~2 min)
4. GitHub Actions auto-syncs to student template (~30 sec)
5. Verify at `onemind-codex-garden.pages.dev`

No manual deploy steps needed.
