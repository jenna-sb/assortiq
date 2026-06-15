# AssortIQ — Assortment Planning Platform

Modern assortment planning tool for merchants, category managers, and planners.

## What's included

- **Dashboard** — KPIs, status breakdown, price architecture, action alerts
- **Assortment Grid** — Sortable/filterable SKU table with bulk select
- **Retailer Planning** — Target scorecard, placements, calendar timeline
- **SKU Rationalization** — Health scoring, drop alerts, category analysis
- **Product Catalog** — Editable cards with photo upload, selling points, logistics, margin calc
- **AI Copilot** — Claude-powered assortment analysis assistant

## Deploy to Vercel (first time)

1. Go to https://vercel.com and sign up (free)
2. Click **Add New Project**
3. Click **Upload** and drag this entire `assortiq` folder
4. Vercel auto-detects Vite — click **Deploy**
5. Your app is live at a URL like `assortiq-yourname.vercel.app`

## Redeploy an update (drag & drop method)

1. Go to your Vercel dashboard → click your `assortiq` project
2. Click **Deployments** tab → **Create Deployment**
3. Drop this updated `assortiq` folder
4. Vercel redeploys in ~30 seconds — same URL, no disruption

## Run locally

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Add more retailers

Upload additional Excel files to Claude and ask it to merge them.
Data lives in `src/App.jsx` in the `RAW_SKUS` array.

## Tech stack
- React 18 + Vite
- Recharts
- Tabler Icons (via CDN)
- Anthropic Claude API (AI copilot)
