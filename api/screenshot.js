const puppeteer = require("puppeteer");
const { db, makeFirebaseId } = require("./_db.js");

const CACHE_DIR = "server-maps";
const browserWSEndpoint = `wss://chrome.browserless.io?token=${process.env.BROWSERLESSTOKEN}`;

async function getBrowser() {
  // should add something cheaper for local dev later
  return puppeteer.connect({ browserWSEndpoint });
}

async function checkCache(reqUrl) {
  const firebaseId = makeFirebaseId(reqUrl);
  const cachedResult = await db.ref(CACHE_DIR + "/" + firebaseId).once("value");

  return cachedResult.exists() ? cachedResult.val() : false;
}

async function setCache(reqUrl, blob) {
  const firebaseId = makeFirebaseId(reqUrl);
  const cachedResult = await db.ref(CACHE_DIR + "/" + firebaseId).set(blob);

  return cachedResult;
}

module.exports = async (req, res) => {
  const cachedScreenshot = await checkCache(req.url);
  if (cachedScreenshot) {
    console.log("returning image from cache");
    return res.end(cachedScreenshot, "base64");
  }

  console.log("generating new image with puppeteer");

  const queryParamsString = req.url.split("?")[1] || "";
  const url = `https://server-maps.now.sh?${queryParamsString}`;
  const width = parseInt(req.query.width, 10) || 400,
    height = parseInt(req.query.height, 10) || 300,
    dpi = parseInt(req.query.dpi, 10) || 1;

  let browser = null;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    page.setViewport({ width, height, deviceScaleFactor: dpi });
    await page.goto(url, { waitUntil: "networkidle0" });
    const screenshot = await page.screenshot({ encoding: "base64" });

    await setCache(req.url, screenshot);
    res.end(screenshot, "base64");
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).send(error.message);
    }
  } finally {
    if (browser) {
      browser.close();
    }
  }
};
