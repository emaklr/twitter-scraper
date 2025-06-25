# Twitter Scraper Backend

Node.js + TypeScript backend for scraping Twitter leads and pushing them into Airtable. Runs on Render as a web service plus a scheduled background worker.

## Scripts

- `npm run build` – compile TypeScript
- `npm start` – start HTTP server (`/leads` and `/webhook/approval`)
- `npm run scrape` – run scraping job once

## Environment Variables

See `.env.example` for required variables:

- `TWITTER_BEARER_TOKEN`
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `OPENAI_API_KEY` (optional for outreach message)
- `RENDER_CRON_SECRET` (used to secure scheduled jobs)

## Endpoints

- `GET /leads` – list leads from Airtable
- `POST /webhook/approval` – generate outreach message for an approved lead

## Scheduled Job

Deploy `npm run scrape` as a Render background worker on a daily cron schedule to collect new leads.
