## Leaflet Static Images Service

Goal: API endpoint to get static images of maps.

### Alternatives | Shortcoming

1. [Mapbox static images service](https://docs.mapbox.com/api/maps/#static-images) | 50K requests/mo free but then \$1/1,000 requests (maybe caching makes this scale better but unclear what their caching policy is)
2. [Headless Leaflet](https://github.com/jieter/leaflet-headless) | Running node-canvas requires installing deps that requires I set up containers (was looking for something I could run in a lambda function)

### Trying another approach:

1. Render the map in a browser, setting map properties through url parameters (`public/index.html`)
2. Launch with Puppeteer and return a screenshot (`api/screenshot.js`)

Note: this is using browserless.io which is paid but is quicker to run puppeteer (can make that cheaper later), and I can permanently cache the images unlike Mapbox.

### Dev

1. Needs `.env` file:

```
BROWSERLESSTOKEN=xxx
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
(see _db.js for Firebase env vars required)
```

2. `npm run i`

### Deploy

`vercel`
