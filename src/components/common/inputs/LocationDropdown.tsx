import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationDropdownProps {
  value: string | null;
  onChange: (location: string | null) => void;
  placeholder?: string;
  type?: boolean;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  value,
  onChange,
  placeholder = "Add location...",
  type = false
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Mock locations data
  const locations = [
    "Hà Nội, Việt Nam",
    "TP. Hồ Chí Minh, Việt Nam",
    "Đà Nẵng, Việt Nam",
    "Hội An, Việt Nam",
    "Sapa, Việt Nam",
    "Phú Quốc, Việt Nam",
    "Nha Trang, Việt Nam",
    "Đà Lạt, Việt Nam",
    "Huế, Việt Nam",
    "Hạ Long, Việt Nam"
  ];

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (location: string) => {
    onChange(location);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
  };

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none max-w-[140px] sm:max-w-none"
      >
        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
        <span className="truncate">
          {value || placeholder}
        </span>
        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search locations..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{location}</span>
                </div>
              </button>
            ))}
            {filteredLocations.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;