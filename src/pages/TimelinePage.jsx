import { useState, useEffect } from 'react';
import { loadAllContent, groupByYear } from '../utils/contentLoader';
import { Calendar, ExternalLink, Loader2 } from 'lucide-react';

/**
 * TimelinePage - chronological view of all content
 */
export default function TimelinePage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedContent, setGroupedContent] = useState({});

  useEffect(() => {
    async function fetchContent() {
      try {
        const items = await loadAllContent();
        setContent(items);
        setGroupedContent(groupByYear(items));
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="ml-3 text-gray-600">Loading timeline...</span>
      </div>
    );
  }

  const years = Object.keys(groupedContent).sort((a, b) => b - a);

  // Type badge colors
  const typeColors = {
    article: 'bg-blue-100 text-blue-800 border-blue-200',
    presentation: 'bg-purple-100 text-purple-800 border-purple-200',
    video: 'bg-red-100 text-red-800 border-red-200',
    podcast: 'bg-green-100 text-green-800 border-green-200',
    social: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Content Timeline</h2>
        <p className="text-gray-600">
          Chronological view of {content.length} items
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {years.map((year) => (
          <div key={year} className="mb-12">
            {/* Year Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative z-10 bg-accent text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md">
                {year}
              </div>
              <div className="flex-1 h-0.5 bg-gray-200"></div>
            </div>

            {/* Items for this year */}
            <div className="space-y-4">
              {groupedContent[year].map((item) => {
                const formattedDate = item.date ? new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric'
                }).format(item.date) : '';

                const sourceLabel = item.publication || item.event || item.source || '';

                return (
                  <div key={item.id} className="relative pl-16">
                    {/* Timeline dot */}
                    <div className="absolute left-6 top-6 w-4 h-4 bg-accent rounded-full border-4 border-white shadow"></div>

                    {/* Content card */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${typeColors[item.type] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                            {item.type}
                          </span>
                          {formattedDate && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formattedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-accent transition-colors duration-150 flex items-start gap-2"
                        >
                          {item.title}
                          <ExternalLink className="w-4 h-4 mt-1 flex-shrink-0 text-gray-400" />
                        </a>
                      </h3>

                      {/* Source */}
                      {sourceLabel && (
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                          {sourceLabel}
                        </p>
                      )}

                      {/* Description */}
                      {item.description && (
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {item.description}
                        </p>
                      )}

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
