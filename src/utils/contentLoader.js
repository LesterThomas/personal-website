import yaml from 'js-yaml';

let cachedContent = null;

/**
 * Load all content YAML files and parse them into JavaScript objects.
 * Results are cached in module scope to avoid re-fetching on navigation.
 * @returns {Promise<Array>} Array of content items sorted by date (newest first)
 */
export async function loadAllContent() {
  if (cachedContent) return cachedContent;

  // Import all YAML files from the data/content directory using Vite's glob import
  const contentModules = import.meta.glob('../data/content/*.yml', { 
    query: '?raw', 
    import: 'default',
    eager: false
  });

  const contentItems = [];

  for (const path in contentModules) {
    try {
      const yamlContent = await contentModules[path]();
      const parsedContent = yaml.load(yamlContent);
      
      // Extract filename for use as ID (without .yml extension)
      const filename = path.split('/').pop().replace('.yml', '');
      
      contentItems.push({
        id: filename,
        ...parsedContent,
        // Ensure date is a proper Date object
        date: parsedContent.date ? new Date(parsedContent.date) : null
      });
    } catch (error) {
      console.error(`Error loading content from ${path}:`, error);
    }
  }

  // Sort by date, newest first
  contentItems.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return b.date - a.date;
  });

  cachedContent = contentItems;
  return contentItems;
}

/**
 * Get unique tags from all content items
 * @param {Array} contentItems - Array of content items
 * @returns {Array<string>} Sorted array of unique tags
 */
export function getUniqueTags(contentItems) {
  const tagsSet = new Set();
  
  contentItems.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Get unique content types
 * @param {Array} contentItems - Array of content items
 * @returns {Array<string>} Sorted array of unique types
 */
export function getContentTypes(contentItems) {
  const typesSet = new Set();
  
  contentItems.forEach(item => {
    if (item.type) {
      typesSet.add(item.type);
    }
  });
  
  return Array.from(typesSet).sort();
}

/**
 * Group content items by year
 * @param {Array} contentItems - Array of content items
 * @returns {Object} Object with years as keys and arrays of items as values
 */
export function groupByYear(contentItems) {
  return contentItems.reduce((acc, item) => {
    if (!item.date) return acc;
    
    const year = item.date.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    
    return acc;
  }, {});
}
