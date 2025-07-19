const express = require("express");
const puppeteer = require("puppeteer-core"); // ✅ use puppeteer-core
const chromium = require("@sparticuz/chromium"); // ✅ chromium for headless on Render
const path = require("path");

const app = express();
const port = process.env.PORT || 3000; // ✅ important for Render

let browser, page;

// 👇 Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// ✅ Automation endpoints
app.use(express.json());

app.post("/start", async (req, res) => {
  browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  page = await browser.newPage();
  res.send("✅ Browser launched");
});

app.post("/goto", async (req, res) => {
  const { url } = req.body;
  await page.goto(url, { waitUntil: "networkidle2" });
  res.send("✅ Navigated to " + url);
});

app.post("/fill", async (req, res) => {
  const { selector, value } = req.body;
  await page.waitForSelector(selector);
  await page.type(selector, value);
  res.send(`✅ Filled ${selector}`);
});

app.post("/click", async (req, res) => {
  const { selector } = req.body;
  await page.waitForSelector(selector);
  await page.click(selector);
  res.send(`✅ Clicked ${selector}`);
});

// 🚀 Start server
app.listen(port, () => {
  console.log(`🌐 MCP + Static Server running at http://localhost:${port}/index.html`);
});
