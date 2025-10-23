# Family Budget & Essentials Tracker

Simple budget tracker built with React, LocalStorage, Recharts, and a demo OpenAI integration.

## Features
- Add / Delete expenses (stored in localStorage)
- Pie chart for spending by category (Recharts)
- Essentials checklist (shopping items)
- AI-powered saving tips (requires OpenAI API key)

## Run locally
1. `npm install`
2. Create `.env` with `VITE_OPENAI_API_KEY=your_api_key`
3. `npm run dev`

## Deploy
- Build: `npm run build`
- Deploy `dist/` to Netlify or GitHub Pages.
