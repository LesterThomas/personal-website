import { Globe, ExternalLink } from 'lucide-react';

/**
 * ContentCard - list item with title, description, and metadata row
 */
export default function ContentCard({ item }) {
  const { title, type, date, url, description, publication, event, source } = item;

  const formattedDate = date
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
    : '';

  const sourceLabel = publication || event || source || '';

  // Human-readable type label
  const typeLabel = type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : '';

  return (
    <article className="py-6 border-b border-gray-100 last:border-b-0">
      {/* Title */}
      <h2 className="leading-snug mb-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[1.05rem] font-semibold text-gray-900 hover:text-accent transition-colors duration-150"
        >
          {title}
        </a>
      </h2>

      {/* Description */}
      {description && (
        <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>
      )}

      {/* Metadata row: globe + date · type at source */}
      <div className="flex items-center gap-1.5 text-gray-400 text-xs flex-wrap">
        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
        {formattedDate && <span>{formattedDate}</span>}
        {typeLabel && (
          <>
            <span className="mx-0.5">&middot;</span>
            <span className="capitalize">{typeLabel}</span>
          </>
        )}
        {sourceLabel && (
          <>
            <span className="mx-0.5">&middot;</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-accent transition-colors font-medium"
            >
              {sourceLabel}
            </a>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </>
        )}
      </div>
    </article>
  );
}

