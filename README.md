# USD 259 bond tax estimator

A mobile-friendly informational calculator for the November 3, 2026 Wichita Public Schools bond proposal. Vanilla JavaScript and CSS, built with Vite.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Use `npm test` for calculation tests, `npm run build` for a production build, and `npm run preview` to preview it. Deploy the `dist/` directory to a static host.

## Research and source code

Public repository: https://github.com/DJSethDuncan/bond-issue

The app links to a formatted research page at `/research/`, with clickable source URLs and a downloadable Markdown copy. The formatted page renders the same research file used in this repository, so there is one source of truth for the notes. Both pages include a link back to the public code.

## Data

See [research/usd259-bond-2026.md](research/usd259-bond-2026.md) for sources, formulas, discrepancies and limitations. The main result shows the change from today's rate, with timing notes for each outcome. The projected 2028 decrease if the bond fails is documented in the assumptions and research. The model scales rounded district examples; it is not a full debt-service model or an official calculator.

Calculation logic is isolated in `src/calculator.js` and covered by Node's built-in test runner. Home values are processed locally and are not stored or submitted. Vercel Web Analytics is enabled on the calculator and research pages in production builds; no custom events, home values or election selections are sent by this integration. Google Fonts is requested for typography, with local system fallbacks.

## Vercel Web Analytics

In the Vercel project dashboard, open **Analytics** and enable Web Analytics, then deploy this version. The shared `src/analytics.js` module injects the production analytics script on both pages. Analytics is disabled during `npm run dev`. Vercel serves the analytics endpoint on deployed projects; a local production preview or non-Vercel host does not provide that endpoint automatically.
