# AssortIQ — Assortment Planning Platform

A modern web-based assortment planning tool built for merchants, category managers, and planners.

## Features
- Executive dashboard with KPIs and charts
- Assortment grid with filtering, sorting, and bulk selection
- Retailer planning (scorecard, placements, timeline views)
- SKU rationalization with health scoring
- Product catalog card view
- AI copilot powered by Claude

## Deploy to Vercel (5 minutes, free)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub/Google
2. Click **"Add New Project"**
3. Drag this entire folder into the Vercel import screen, OR push to a GitHub repo first
4. Vercel auto-detects Vite — click **Deploy**
5. You get a shareable URL like `assortiq-yourname.vercel.app`

## Deploy to Netlify (alternative)

1. Go to [netlify.com](https://netlify.com) → "Add new site" → "Deploy manually"
2. Run `npm run build` locally first, then drag the `dist/` folder to Netlify
3. Done — shareable URL instantly

## Run locally

```bash
npm install
npm run dev
```
Open http://localhost:5173

## Add more retailers

Upload additional Excel files to Claude and ask it to add them to `src/App.jsx`.
Each retailer's data gets added to the `RAW_SKUS` array with a `retailer` field,
and the cross-retailer master grid view will populate automatically.

## Team sharing

Once deployed to Vercel/Netlify, just send your team the URL.
For password protection, use Vercel's password protection feature (Pro plan)
or add Netlify's simple password feature.

## Tech stack
- React 18 + Vite
- Recharts for data visualization
- Tabler Icons
- Anthropic Claude API (for AI copilot)
