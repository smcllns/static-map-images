## Map Screenshot Service

Goal: API endpoint to get static map images free.

### Alternatives | Shortcoming

1. [Mapbox static images service](https://docs.mapbox.com/api/maps/#static-images) | 50K requests/mo free but then \$1/1,000 requests
2. [Headless Leaflet](https://github.com/jieter/leaflet-headless) | Running node-canvas requires installing deps I don't think I can easily do without managing containers

### Trying a different approach more suitable for lambda functions:

1. Provide a endpoint for rendering the map in a browser, setting map properties through url parameters (`index.html`)
2. Provide an endpoint to have Puppeteer visit that url and return a screenshot (`index.js`)
