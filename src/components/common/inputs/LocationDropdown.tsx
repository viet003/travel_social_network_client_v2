import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { searchCities, getPopularCities, formatCityData } from '../../../services/geoService';

interface LocationDropdownProps {
  value: string | null;
  onChange: (location: string | null) => void;
  placeholder?: string;
  type?: boolean;
}

interface CityData {
  value: string;
  label: string;
  city: string;
  country: string;
  region?: string;
  population?: number;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  value,
  onChange,
  placeholder = "Add location...",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [locations, setLocations] = useState<CityData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load popular cities on mount
  useEffect(() => {
    const loadPopularCities = async () => {
      setIsLoading(true);
      try {
        const cities = await getPopularCities(5);
        const formattedCities = formatCityData(cities);
        setLocations(formattedCities);
      } catch (error) {
        console.error('Error loading popular cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularCities();
  }, []);

  // Search cities when search term changes
  useEffect(() => {
    const searchForCities = async () => {
      if (searchTerm.length < 2) {
        // Load popular cities if search term is too short
        const cities = await getPopularCities(5);
        const formattedCities = formatCityData(cities);
        setLocations(formattedCities);
        return;
      }

      setIsLoading(true);
      try {
        const cities = await searchCities(searchTerm, 5);
        const formattedCities = formatCityData(cities);
        setLocations(formattedCities);
      } catch (error) {
        console.error('Error searching cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchForCities();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleLocationSelect = (location: CityData) => {
    onChange(location.value);
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
        className="flex cursor-pointer items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none max-w-[140px] sm:max-w-none"
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
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
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
              placeholder="Tìm kiếm..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : locations.length > 0 ? (
              locations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="font-medium">{location.city}</span>
                      <span className="text-xs text-gray-500">
                        {location.region ? `${location.region}, ${location.country}` : location.country}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Không tìm thấy địa điểm
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;