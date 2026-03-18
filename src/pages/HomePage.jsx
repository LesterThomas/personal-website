import { useState, useEffect } from 'react';
import { loadAllContent, getContentTypes } from '../utils/contentLoader';
import ContentCard from '../components/ContentCard';
import FilterBar from '../components/FilterBar';
import { Loader2 } from 'lucide-react';

/**
 * Get unique source/publication values from content items
 */
function getSources(items) {
  const set = new Set();
  items.forEach(item => {
    const src = item.publication || item.event || item.source;
    if (src) set.add(src);
  });
  return Array.from(set).sort();
}

/**
 * HomePage - Authory-style single-column content list with inline filters
 */
export default function HomePage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableSources, setAvailableSources] = useState([]);

  useEffect(() => {
    async function fetchContent() {
      try {
        const items = await loadAllContent();
        setContent(items);
        setAvailableTypes(getContentTypes(items));
        setAvailableSources(getSources(items));
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const filteredContent = content.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.title?.toLowerCase().includes(q) && !item.description?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (selectedSource !== 'all') {
      const src = item.publication || item.event || item.source || '';
      if (src !== selectedSource) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-hero" />
        <span className="ml-3 text-gray-500">Loading content...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Inline Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
        availableTypes={availableTypes}
        availableSources={availableSources}
      />

      {/* Result count */}
      <p className="text-xs text-gray-400 mb-4">
        {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'items'}
      </p>

      {/* Content list */}
      {filteredContent.length > 0 ? (
        <div>
          {filteredContent.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400">No content found matching your filters</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedType('all'); setSelectedSource('all'); }}
            className="mt-3 text-sm text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

