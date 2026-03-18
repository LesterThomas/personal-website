/**
 * Authory Content Scraper with Playwright (Visible Browser)
 * Extracts presentations, articles, and other content from authory.com profile
 * and generates individual YAML files for each item.
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const AUTHORY_URL = 'https://authory.com/lesterthomas';
const OUTPUT_DIR = join(__dirname, '..', 'src', 'data', 'content');

// Ensure output directories exist
mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Slugify a string for use as filename
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

/**
 * Map content type from source text
 */
function mapContentType(source, title) {
  const combined = (source + ' ' + title).toLowerCase();
  if (combined.includes('video')) return 'video';
  if (combined.includes('podcast') || combined.includes('audio')) return 'podcast';
  if (combined.includes('linkedin') || combined.includes('post at')) return 'social';
  if (combined.includes('dtw') || combined.includes('catalyst') || combined.includes('presentation')) return 'presentation';
  return 'article';
}

/**
 * Generate YAML content for an item
 */
function generateYAML(item) {
  const yaml = [];
  yaml.push(`title: "${item.title.replace(/"/g, '\\"')}"`);
  yaml.push(`type: ${item.type}`);
  yaml.push(`date: ${item.date}`);
  yaml.push(`url: "${item.url}"`);
  
  if (item.description) {
    yaml.push(`description: "${item.description.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
  }
  
  if (item.source) {
    if (item.type === 'article') {
      yaml.push(`publication: "${item.source}"`);
    } else if (item.type === 'presentation') {
      yaml.push(`event: "${item.source}"`);
    } else {
      yaml.push(`source: "${item.source}"`);
    }
  }
  
  if (item.tags && item.tags.length > 0) {
    yaml.push(`tags:`);
    item.tags.forEach(tag => {
      yaml.push(`  - ${tag}`);
    });
  }
  
  if (item.featured) {
    yaml.push(`featured: true`);
  }
  
  return yaml.join('\n');
}

/**
 * Main scraping function
 */
async function scrapeAuthory() {
  console.log(`🚀 Starting Authory scraper for ${AUTHORY_URL}`);
  console.log('📺 Browser window will be visible - you can watch the process\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 50 // Slow down to see what's happening
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📄 Loading Authory page...');
    await page.goto(AUTHORY_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for the main content to be visible
    console.log('⏳ Waiting for content to load...');
    await page.waitForSelector('h2', { timeout: 10000 }).catch(() => {
      console.log('⚠️  h2 selector timeout, continuing anyway...');
    });
    
    await page.waitForTimeout(5000); // Give React time to hydrate
    
    // Scroll to load all content
    console.log('📜 Scrolling to load all content...');
    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxScrolls = 15;
    
    while (scrollAttempts < maxScrolls) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(3000);
      
      const currentHeight = await page.evaluate(() => document.body.scrollHeight);
      console.log(`  Scroll ${scrollAttempts + 1}/${maxScrolls} - Height: ${currentHeight}px`);
      
      if (currentHeight === previousHeight) {
        console.log('  ✓ No more content loading');
        break;
      }
      
      previousHeight = currentHeight;
      scrollAttempts++;
    }
    
    // Take a screenshot
    await page.screenshot({ path: join(__dirname, 'authory-screenshot.png'), fullPage: true });
    console.log('📸 Screenshot saved\n');
    
    // Extract content items
    console.log('🔍 Extracting content items...');
    
    const items = await page.evaluate(() => {
      const results = [];
      
      // Find all h2 headings (titles)
      const headings = document.querySelectorAll('h2');
      console.log(`Found ${headings.length} h2 elements`);
      
      headings.forEach((h2, index) => {
        try {
          const title = h2.textContent.trim();
          
          // Skip if too short
          if (!title || title.length < 10) return;
          
          // Find the parent container (go up a few levels)
          let container = h2.closest('div');
          for (let i = 0; i < 3; i++) {
            if (container && container.parentElement) {
              container = container.parentElement;
            }
          }
          
          if (!container) return;
          
          // Find all links in this container
          const links = Array.from(container.querySelectorAll('a[href^="http"]'));
          
          // Get the main article link
          let url = '';
          for (const link of links) {
            const href = link.getAttribute('href');
            if (href && !href.includes('svg') && link.textContent.trim().length > 10) {
              url = href;
              break;
            }
          }
          
          if (!url) return;
          
          // Get all paragraphs
          const paragraphs = Array.from(container.querySelectorAll('p'));
          
          // Find description (longest relevant paragraph)
          let description = '';
          let maxLength = 0;
          for (const p of paragraphs) {
            const text = p.textContent.trim();
            if (text.length > maxLength && 
                text.length > 50 && 
                !text.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)/) &&
                !text.includes('Article at') && 
                !text.includes('Post at')) {
              description = text;
              maxLength = text.length;
            }
          }
          
          // Find date
          let date = '';
          for (const p of paragraphs) {
            const text = p.textContent.trim();
            if (text.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$/)) {
              date = text;
              break;
            }
          }
          
          // Find source/publication
          let source = '';
          for (const p of paragraphs) {
            const text = p.textContent;
            if (text.includes('Article at') || text.includes('Post at')) {
              const match = text.match(/at\s+(.+)$/);
              if (match) {
                source = match[1].replace(/\*\*/g, '').trim();
              }
              break;
            }
          }
          
          // Check for thumbnail
          const hasThumbnail = container.querySelector('img') !== null;
          
          results.push({
            title,
            url,
            date,
            description: description.substring(0, 300),
            source,
            hasThumbnail,
            index
          });
          
        } catch (e) {
          console.error(`Error processing h2 ${index}:`, e.message);
        }
      });
      
      return results;
    });
    
    console.log(`✅ Extracted ${items.length} content items\n`);
    
    if (items.length === 0) {
      console.log('⚠️  No items found!');
      console.log('💡 Browser will stay open for 30 seconds so you can inspect the page...');
      await page.waitForTimeout(30000);
      return;
    }
    
    // Process and save each item
    let savedCount = 0;
    for (const item of items) {
      try {
        // Parse date
        let dateStr = '2024-01-01';
        if (item.date) {
          const parsed = new Date(item.date);
          if (!isNaN(parsed.getTime())) {
            dateStr = parsed.toISOString().split('T')[0];
          }
        }
        
        // Determine type
        const type = mapContentType(item.source, item.title);
        
        // Create YAML object
        const yamlData = {
          title: item.title,
          type,
          date: dateStr,
          url: item.url,
          description: item.description || '',
          source: item.source || '',
          tags: [],
          featured: item.hasThumbnail && item.index < 10
        };
        
        // Generate filename
        const slug = slugify(item.title);
        const filename = `${dateStr}-${slug}.yml`;
        const filepath = join(OUTPUT_DIR, filename);
        
        // Write YAML file
        const yamlContent = generateYAML(yamlData);
        writeFileSync(filepath, yamlContent);
        savedCount++;
        
        console.log(`  ✓ ${savedCount}. ${item.title.substring(0, 60)}...`);
      } catch (e) {
        console.error(`  ✗ Failed to save: ${item.title}`, e.message);
      }
    }
    
    console.log(`\n🎉 Successfully saved ${savedCount}/${items.length} items to ${OUTPUT_DIR}`);
    
    // Save summary
    const summary = {
      scrapedAt: new Date().toISOString(),
      sourceUrl: AUTHORY_URL,
      totalItems: items.length,
      savedItems: savedCount,
      outputDir: OUTPUT_DIR
    };
    
    writeFileSync(
      join(__dirname, 'scrape-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log('📊 Summary saved to scripts/scrape-summary.json');
    
    console.log('\n✨ Success! Browser will close in 3 seconds...');
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('\n❌ Error during scraping:', error);
    console.log('\n💡 Browser will stay open for 30 seconds so you can inspect...');
    await page.waitForTimeout(30000);
    throw error;
  } finally {
    console.log('👋 Closing browser...');
    await browser.close();
  }
}

// Run the scraper
scrapeAuthory()
  .then(() => {
    console.log('\n✨ Scraping completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Scraping failed:', error.message);
    process.exit(1);
  });
