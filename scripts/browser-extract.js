/**
 * Browser Console Extraction Script for Authory.com
 * 
 * Instructions:
 * 1. Open https://authory.com/lesterthomas in your browser
 * 2. Scroll down to load ALL content (scroll multiple times until no new items appear)
 * 3. Open Developer Tools (F12)
 * 4. Go to Console tab
 * 5. Copy and paste this entire script
 * 6. Press Enter to run
 * 7. Copy the JSON output that appears
 * 8. Save it to scripts/authory-data.json
 * 9. Run: npm run convert-json
 */

(function extractAuthoryContent() {
  console.log('🔍 Starting Authory content extraction...');
  
  const items = [];
  
  // Find all article/content containers
  // Looking for h2 headings which contain the titles
  const headings = document.querySelectorAll('h2');
  
  console.log(`Found ${headings.length} potential items`);
  
  headings.forEach((h2, index) => {
    try {
      const title = h2.textContent.trim();
      
      // Skip if too short or empty
      if (!title || title.length < 10) return;
      
      // Find parent container
      const container = h2.closest('div').parentElement;
      if (!container) return;
      
      // Find the main link (URL)
      const links = container.querySelectorAll('a[href^="http"]');
      let url = '';
      for (const link of links) {
        const href = link.getAttribute('href');
        // Skip icon links and SVG-only links
        if (href && !href.includes('svg') && link.textContent.trim().length > 5) {
          url = href;
          break;
        }
      }
      
      if (!url) return;
      
      // Find description (longer paragraph)
      let description = '';
      const paragraphs = container.querySelectorAll('p');
      for (const p of paragraphs) {
        const text = p.textContent.trim();
        if (text.length > 50 && !text.includes('Article at') && !text.includes('Post at')) {
          description = text.substring(0, 300);
          break;
        }
      }
      
      // Find date (format: "Month DD, YYYY")
      let date = '';
      for (const p of paragraphs) {
        const text = p.textContent.trim();
        const dateMatch = text.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$/);
        if (dateMatch) {
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
      
      // Determine type
      let type = 'article';
      const sourceAndTitle = (source + ' ' + title).toLowerCase();
      if (sourceAndTitle.includes('video')) type = 'video';
      else if (sourceAndTitle.includes('podcast') || sourceAndTitle.includes('audio')) type = 'podcast';
      else if (sourceAndTitle.includes('post at') || sourceAndTitle.includes('linkedin')) type = 'social';
      else if (title.toLowerCase().includes('dtw') || title.toLowerCase().includes('catalyst')) type = 'presentation';
      
      // Check if featured (look for image or special styling)
      const hasThumbnail = container.querySelector('img') !== null;
      
      items.push({
        title,
        url,
        description,
        date,
        source,
        type,
        featured: hasThumbnail && index < 10 // First 10 with images are featured
      });
      
    } catch (e) {
      console.warn(`Error processing item ${index}:`, e.message);
    }
  });
  
  console.log(`\n✅ Extracted ${items.length} items`);
  console.log('\n📋 Copy the JSON below and save to: scripts/authory-data.json\n');
  console.log('==== START JSON ====');
  console.log(JSON.stringify(items, null, 2));
  console.log('==== END JSON ====');
  
  // Also copy to clipboard if available
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(items, null, 2))
      .then(() => console.log('\n✨ JSON also copied to clipboard!'))
      .catch(() => console.log('\n⚠️  Could not copy to clipboard, please copy manually'));
  }
  
  return items;
})();
