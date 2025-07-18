const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");

const app = express();
const port = 3000;

let browser, page;

// 👇 Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// ✅ Automation endpoints
app.use(express.json());

app.post("/start", async (req, res) => {
  browser = await puppeteer.launch({ headless: false });
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
  console.log(`🌐 MCP + Static Server running at http://localhost:${port}/test-form.html`);
});
