# next-ctf-mn

Next.js 16 app migrated to Cloudflare Workers with `@opennextjs/cloudflare`.

## Prerequisites

- Node.js 20+
- `pnpm`
- `wrangler` (installed via dev dependency)
- Cloudflare account

## Local Development

Run the standard Next.js dev server:

```bash
pnpm dev
```

## Cloudflare Preview (Workers Runtime)

Build with OpenNext and preview in Workers locally:

```bash
pnpm preview
```

## Deploy

Deploy the app to Cloudflare Workers:

```bash
pnpm deploy
```

Before first deploy, create the configured R2 bucket:

```bash
pnpm wrangler r2 bucket create next-ctf-mn-cache
```

## Optional: Cloudflare Env Types

Generate Worker env typings:

```bash
pnpm cf-typegen
```
