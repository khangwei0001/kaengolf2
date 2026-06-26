import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, 'temporary screenshots');

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function takeScreenshot(url, label = '') {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();

    // Set viewport for consistent screenshots
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Scroll through the page so scroll-triggered reveals fire, then return
    // to the top — mirrors what a real visitor sees.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });

    // Find next screenshot number
    const files = fs.readdirSync(screenshotsDir);
    const numbers = files
      .map(f => parseInt(f.match(/\d+/)?.[0] || 0))
      .filter(n => n > 0);
    const nextNum = Math.max(...numbers, 0) + 1;

    const filename = label
      ? `screenshot-${nextNum}-${label}.png`
      : `screenshot-${nextNum}.png`;

    const filepath = path.join(screenshotsDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });

    console.log(`Screenshot saved: ${filename}`);
  } catch (error) {
    console.error('Screenshot failed:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
takeScreenshot(url, label);
