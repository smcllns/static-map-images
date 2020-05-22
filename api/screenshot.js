const puppeteer = require("puppeteer");

const getBrowser = async () => {
  return puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESSTOKEN}`,
  });
};

module.exports = async (req, res) => {
  const qs = req.url.split("?")[1] || "";
  const width = parseInt(req.query.width, 10) || 400,
    height = parseInt(req.query.height, 10) || 300,
    dpi = parseInt(req.query.dpi, 10) || 1;
  const url = `https://server-maps.now.sh?${qs}`;
  let browser = null;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    page.setViewport({ width, height, deviceScaleFactor: dpi });
    await page.goto(url, { waitUntil: "load" });
    const screenshot = await page.screenshot({ encoding: "base64" });
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
