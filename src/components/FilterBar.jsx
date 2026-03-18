import { Search, ChevronDown } from 'lucide-react';

/**
 * FilterBar - horizontal inline filter row matching Authory's design
 */
export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSource,
  onSourceChange,
  availableTypes,
  availableSources,
}) {
  return (
    <div className="flex flex-row gap-2 mb-8">
      {/* Type filter dropdown */}
      <div className="relative">
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="appearance-none pl-3.5 pr-8 py-2 border border-gray-200 rounded-md text-sm text-gray-600 bg-white focus:outline-none focus:border-gray-400 cursor-pointer w-36 hover:border-gray-300 transition-colors"
        >
          <option value="all">All Types</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
      </div>

      {/* Source filter dropdown */}
      <div className="relative">
        <select
          value={selectedSource}
          onChange={(e) => onSourceChange(e.target.value)}
          className="appearance-none pl-3.5 pr-8 py-2 border border-gray-200 rounded-md text-sm text-gray-600 bg-white focus:outline-none focus:border-gray-400 cursor-pointer w-44 hover:border-gray-300 transition-colors"
        >
          <option value="all">All Sources</option>
          {availableSources.map((src) => (
            <option key={src} value={src}>{src}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
      </div>

      {/* Search input */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 hover:border-gray-300 transition-colors"
        />
      </div>
    </div>
  );
}

