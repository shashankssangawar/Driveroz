'use client';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPinIcon, LocateIcon, Loader2 } from 'lucide-react';
import { useLocationSearch } from '@/hooks/useLocationSearch';

export default function LocationInput({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Enter location",
  type = "pickup",
  onUseCurrentLocation
}) {
  const { query, setQuery, suggestions, loading, clearSuggestions } = useLocationSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion) => {
    const address = suggestion.display_name;
    onChange(address);
    setQuery(address);
    setShowSuggestions(false);

    if (onLocationSelect) {
      onLocationSelect([suggestion.lat, suggestion.lon]);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (onUseCurrentLocation) {
      await onUseCurrentLocation();
    }
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding to allow for suggestion click
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleUseCurrentLocation}
            className="h-6 w-6 hover:bg-gray-100"
            title="Use current location"
          >
            <LocateIcon className="h-3 w-3" />
          </Button>
          <MapPinIcon className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Searching...</span>
            </div>
          )}

          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium text-sm text-gray-900">
                {suggestion.display_name.split(',')[0]}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {suggestion.display_name}
              </div>
            </div>
          ))}

          {!loading && suggestions.length === 0 && query.length >= 3 && (
            <div className="p-3 text-sm text-gray-500 text-center">
              No locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
