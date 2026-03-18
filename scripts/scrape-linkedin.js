/**
 * LinkedIn recent activity scraper
 * Opens a visible browser so you can log in, then scrapes articles/posts
 * and writes YAML files to src/data/content/
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../src/data/content');
const PROFILE_URL = 'https://www.linkedin.com/in/lester-thomas/recent-activity/all/';

// Slugify a title into a filename-safe string
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

// Format a Date as YYYY-MM-DD
function fmtDate(d) {
  return d.toISOString().split('T')[0];
}

// Parse LinkedIn's relative time labels ("2 weeks ago", "3 months ago", etc.)
function parseRelativeDate(text) {
  if (!text) return null;
  const now = new Date();
  const t = text.toLowerCase().trim();
  const m = t.match(/^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const unit = m[2];
  const d = new Date(now);
  if (unit === 'second') d.setSeconds(d.getSeconds() - n);
  else if (unit === 'minute') d.setMinutes(d.getMinutes() - n);
  else if (unit === 'hour') d.setHours(d.getHours() - n);
  else if (unit === 'day') d.setDate(d.getDate() - n);
  else if (unit === 'week') d.setDate(d.getDate() - n * 7);
  else if (unit === 'month') d.setMonth(d.getMonth() - n);
  else if (unit === 'year') d.setFullYear(d.getFullYear() - n);
  return d;
}

// Convert a parsed post object into YAML string (no external dep needed)
function toYaml({ title, type, date, url, description, source }) {
  const esc = (s) => s ? s.replace(/"/g, '\\"') : '';
  const lines = [
    `title: "${esc(title)}"`,
    `type: ${type}`,
    `date: ${date}`,
    `url: "${esc(url)}"`,
    `description: "${esc(description)}"`,
    `source: "${esc(source)}"`,
  ];
  return lines.join('\n') + '\n';
}

// Load existing YAML filenames so we can skip duplicates
function existingUrls() {
  const urls = new Set();
  for (const f of fs.readdirSync(OUTPUT_DIR)) {
    if (!f.endsWith('.yml')) continue;
    const raw = fs.readFileSync(path.join(OUTPUT_DIR, f), 'utf8');
    const m = raw.match(/^url:\s*"([^"]+)"/m);
    if (m) urls.add(m[1]);
  }
  return urls;
}

async function main() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // Go to LinkedIn sign-in page
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' });

  console.log('\n=== A Chrome window has opened. Please sign in to LinkedIn. ===');
  console.log('The script will automatically continue once you reach your feed.\n');

  // Wait up to 3 minutes for the user to sign in and land on the feed/home page
  await page.waitForURL(
    url => {
      const p = new URL(url).pathname;
      // Consider logged-in when on feed, home, mynetwork, or the activity page itself
      return p === '/feed/' || p === '/feed' || p === '/' ||
             p.startsWith('/in/') || p.startsWith('/mynetwork') ||
             p.includes('/recent-activity');
    },
    { timeout: 180000 }
  );

  console.log('Signed in! Navigating to recent activity...');
  await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  // Give the feed some time to render dynamic content
  await page.waitForTimeout(5000);
  await page.waitForTimeout(3000);

  // Dump the full page HTML for inspection
  const fullHtml = await page.content();
  fs.writeFileSync('./scripts/linkedin-dom-sample.html', fullHtml.slice(0, 50000));
  console.log('DOM sample (50KB) written to ./scripts/linkedin-dom-sample.html');

  const known = existingUrls();
  const created = [];

  // Scroll repeatedly to load more posts
  for (let pass = 0; pass < 10; pass++) {
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(1800);
  }

  // Extract posts anchored on data-urn="urn:li:activity:..." elements
  const posts = await page.evaluate(() => {
    const results = [];
    const seen = new Set();

    const postDivs = Array.from(
      document.querySelectorAll('div[data-urn*="activity"]')
    );

    postDivs.forEach(div => {
      const urn = div.getAttribute('data-urn');
      if (!urn || seen.has(urn)) return;
      seen.add(urn);

      const url = `https://www.linkedin.com/feed/update/${urn}/`;
      const rawText = (div.innerText || '').trim();

      // Detect repost
      const isRepost = rawText.includes('reposted this');

      // Extract time — "2 weeks ago", "3 months ago", "5 days ago" etc.
      const timeMatch = rawText.match(/\b(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago\b/i);
      const timeText = timeMatch ? timeMatch[0] : '';

      // Find the actual post content — everything after "Visible to anyone..."
      const visibleMarker = 'Visible to anyone on or off LinkedIn';
      const contentIdx = rawText.indexOf(visibleMarker);
      let actualContent = contentIdx > -1
        ? rawText.slice(contentIdx + visibleMarker.length).trim()
        : rawText;

      // Strip trailing boilerplate (reactions, comment counts, etc.)
      actualContent = actualContent.replace(/\n+(Like|Comment|Repost|Share|Send)\b.*/s, '').trim();

      // If repost, we want the original author's content not Lester's rephrasing
      // Split into lines and drop short noise lines (UI buttons, etc.)
      const NOISE = /^(Follow|Like|Comment|Repost|Send|Share|React|Connect|\d+|•)$/i;
      const lines = actualContent.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 2 && !NOISE.test(l));

      const titleLine = (lines.find(l => l.length >= 20) || lines[0] || 'LinkedIn post').slice(0, 120);
      const description = lines.slice(0, 5).join(' ').slice(0, 400);

      results.push({ postUrl: url, timeText, titleLine, description, isRepost });
    });
    return results;
  });

  console.log(`Found ${posts.length} posts. Processing...`);
  for (const post of posts) {
    const url = post.postUrl;
    if (!url || known.has(url)) continue;

    const date = parseRelativeDate(post.timeText);
    const dateStr = date ? fmtDate(date) : fmtDate(new Date());

    const title = post.titleLine || 'LinkedIn post';
    const description = post.description || title;
    const type = post.isRepost ? 'repost' : 'social';
    const source = 'LinkedIn';

    const slug = slugify(title);
    const filename = `${dateStr}-${slug}.yml`;
    const filepath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filepath)) {
      console.log(`  skip (exists): ${filename}`);
      continue;
    }

    const yaml = toYaml({ title, type, date: dateStr, url, description, source });
    fs.writeFileSync(filepath, yaml, 'utf8');
    created.push(filename);
    console.log(`  created: ${filename}`);
  }

  console.log(`\nDone. Created ${created.length} new YAML files.`);
  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
