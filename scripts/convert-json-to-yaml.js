/**
 * Convert extracted JSON data to YAML files
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JSON_FILE = join(__dirname, 'authory-data.json');
const OUTPUT_DIR = join(__dirname, '..', 'src', 'data', 'content');

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
 * Parse date string to YYYY-MM-DD format
 */
function parseDate(dateStr) {
  if (!dateStr) return '2024-01-01';
  
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    // ignore
  }
  return '2024-01-01';
}

/**
 * Extract tags from title and description
 */
function extractTags(item) {
  const tags = new Set();
  const text = (item.title + ' ' + item.description + ' ' + item.source).toLowerCase();
  
  // Common tags
  const tagMap = {
    'ai': 'AI',
    'artificial intelligence': 'AI',
    'oda': 'ODA',
    'open digital architecture': 'ODA',
    'vodafone': 'Vodafone',
    'microsoft': 'Microsoft',
    'google': 'Google Cloud',
    'azure': 'Azure',
    'cloud': 'Cloud',
    'api': 'APIs',
    'open api': 'Open APIs',
    'telecom': 'Telecommunications',
    'telco': 'Telecommunications',
    '5g': '5G',
    'network': 'Networking',
    'automation': 'Automation',
    'digital transformation': 'Digital Transformation',
    'innovation': 'Innovation',
    'blockchain': 'Blockchain',
    'kubernetes': 'Kubernetes',
    'microservices': 'Microservices',
    'devops': 'DevOps',
    'agile': 'Agile',
    'procurement': 'Procurement',
    'opensource': 'Open Source',
    'open source': 'Open Source',
    'catalyst': 'TM Forum Catalyst',
    'tm forum': 'TM Forum'
  };
  
  for (const [keyword, tag] of Object.entries(tagMap)) {
    if (text.includes(keyword)) {
      tags.add(tag);
    }
  }
  
  return Array.from(tags).slice(0, 5); // Max 5 tags
}

/**
 * Generate YAML content for an item
 */
function generateYAML(item) {
  const yaml = [];
  yaml.push(`title: "${item.title.replace(/"/g, '\\"')}"`);
  yaml.push(`type: ${item.type}`);
  yaml.push(`date: ${parseDate(item.date)}`);
  yaml.push(`url: "${item.url}"`);
  
  if (item.description) {
    const desc = item.description.replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
    yaml.push(`description: "${desc}"`);
  }
  
  if (item.source && item.type === 'article') {
    yaml.push(`publication: "${item.source}"`);
  } else if (item.source && item.type === 'presentation') {
    yaml.push(`event: "${item.source}"`);
  } else if (item.source) {
    yaml.push(`source: "${item.source}"`);
  }
  
  const tags = extractTags(item);
  if (tags.length > 0) {
    yaml.push(`tags:`);
    tags.forEach(tag => {
      yaml.push(`  - ${tag}`);
    });
  }
  
  if (item.featured) {
    yaml.push(`featured: true`);
  }
  
  return yaml.join('\n');
}

/**
 * Main conversion function
 */
function convertJSON() {
  console.log(`📖 Reading JSON from ${JSON_FILE}`);
  
  try {
    const jsonData = JSON.parse(readFileSync(JSON_FILE, 'utf-8'));
    
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON data must be an array of items');
    }
    
    console.log(`✅ Found ${jsonData.length} items in JSON`);
    
    // Get existing files to avoid duplicates
    const existingFiles = new Set(readdirSync(OUTPUT_DIR));
    
    let savedCount = 0;
    let skippedCount = 0;
    
    for (const item of jsonData) {
      try {
        const date = parseDate(item.date);
        const slug = slugify(item.title);
        const filename = `${date}-${slug}.yml`;
        
        // Skip if already exists
        if (existingFiles.has(filename)) {
          console.log(`  ⊘ Skipped (exists): ${filename}`);
          skippedCount++;
          continue;
        }
        
        const filepath = join(OUTPUT_DIR, filename);
        const yamlContent = generateYAML(item);
        writeFileSync(filepath, yamlContent);
        savedCount++;
        
        console.log(`  ✓ Saved: ${filename}`);
      } catch (e) {
        console.error(`  ✗ Failed: ${item.title}`, e.message);
      }
    }
    
    console.log(`\n🎉 Conversion complete!`);
    console.log(`   Saved: ${savedCount} new files`);
    console.log(`   Skipped: ${skippedCount} existing files`);
    console.log(`   Total: ${savedCount + skippedCount} items`);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`\n❌ File not found: ${JSON_FILE}`);
      console.error('\nPlease follow these steps:');
      console.error('1. Open https://authory.com/lesterthomas in your browser');
      console.error('2. Scroll down to load ALL content');
      console.error('3. Open Developer Tools (F12) > Console');
      console.error('4. Copy and paste the contents of scripts/browser-extract.js');
      console.error('5. Save the JSON output to scripts/authory-data.json');
      console.error('6. Run this script again\n');
    } else {
      console.error('\n❌ Error:', error.message);
    }
    process.exit(1);
  }
}

// Run the converter
convertJSON();
console.log('\n✨ Done!');
