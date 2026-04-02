# Studio Deployment

This Studio is prepared to deploy as its own Vercel project from the monorepo.

## Vercel project settings

Create a second Vercel project for this repo and set:

- Root Directory: `apps/studio`
- Framework Preset: `Other` or `Sanity`
- Source Files Outside Root Directory: enabled

The checked-in [vercel.json](./vercel.json) uses the repo root `pnpm-lock.yaml`, so the separate Studio project installs and builds through the root workspace while still outputting `apps/studio/dist`.

## Required environment variables

Set these in Vercel for the Studio project:

- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`

Use [`.env.example`](./.env.example) as the template.

## Local usage

From the repo root:

```powershell
pnpm dev:studio
pnpm build:studio
```

## Deployment workflow

This Studio project is intended to deploy through Vercel Git integration.
Push commits to the repository and let the separate `pulse-studio` Vercel project build from its configured Root Directory.

If the Vercel project Root Directory is `apps/studio`, do not run `vercel --cwd apps/studio` from this repo.
That combination can cause the CLI to resolve a non-existent `apps/studio/apps/studio` path locally.

If you need monorepo-aware CLI deployments later, set up a repo-level Vercel link from the repository root with `vercel link --repo` instead of linking the subdirectory directly.
