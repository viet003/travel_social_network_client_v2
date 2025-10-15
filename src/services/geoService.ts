// Geo service for location functionality
// This would typically integrate with a geocoding API like Google Places, Mapbox, or OpenStreetMap

interface CityData {
  city: string;
  region?: string;
  country: string;
  population?: number;
  value: string;
  label: string;
}

// Mock implementation - replace with real API calls
export const searchCities = async (query: string, limit: number = 10): Promise<CityData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock data - replace with real API call
  const mockCities: CityData[] = [
    { city: "New York", region: "NY", country: "United States", population: 8336817, value: "new-york-ny-us", label: "New York, NY, United States" },
    { city: "London", region: "England", country: "United Kingdom", population: 8982000, value: "london-england-uk", label: "London, England, United Kingdom" },
    { city: "Paris", region: "Île-de-France", country: "France", population: 2161000, value: "paris-france", label: "Paris, Île-de-France, France" },
    { city: "Tokyo", region: "Tokyo", country: "Japan", population: 13960000, value: "tokyo-japan", label: "Tokyo, Japan" },
    { city: "Sydney", region: "NSW", country: "Australia", population: 5312000, value: "sydney-nsw-au", label: "Sydney, NSW, Australia" },
    { city: "Bangkok", region: "Bangkok", country: "Thailand", population: 10539000, value: "bangkok-thailand", label: "Bangkok, Thailand" },
    { city: "Singapore", country: "Singapore", population: 5454000, value: "singapore", label: "Singapore" },
    { city: "Dubai", region: "Dubai", country: "UAE", population: 3331000, value: "dubai-uae", label: "Dubai, UAE" },
    { city: "Istanbul", region: "Istanbul", country: "Turkey", population: 15520000, value: "istanbul-turkey", label: "Istanbul, Turkey" },
    { city: "Rome", region: "Lazio", country: "Italy", population: 2873000, value: "rome-italy", label: "Rome, Lazio, Italy" }
  ];

  // Filter cities based on query
  const filteredCities = mockCities.filter(city => 
    city.city.toLowerCase().includes(query.toLowerCase()) ||
    city.country.toLowerCase().includes(query.toLowerCase()) ||
    (city.region && city.region.toLowerCase().includes(query.toLowerCase()))
  );

  return filteredCities.slice(0, limit);
};

export const getPopularCities = async (limit: number = 15): Promise<CityData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Return most popular cities
  const popularCities: CityData[] = [
    { city: "New York", region: "NY", country: "United States", population: 8336817, value: "new-york-ny-us", label: "New York, NY, United States" },
    { city: "London", region: "England", country: "United Kingdom", population: 8982000, value: "london-england-uk", label: "London, England, United Kingdom" },
    { city: "Paris", region: "Île-de-France", country: "France", population: 2161000, value: "paris-france", label: "Paris, Île-de-France, France" },
    { city: "Tokyo", region: "Tokyo", country: "Japan", population: 13960000, value: "tokyo-japan", label: "Tokyo, Japan" },
    { city: "Sydney", region: "NSW", country: "Australia", population: 5312000, value: "sydney-nsw-au", label: "Sydney, NSW, Australia" },
    { city: "Bangkok", region: "Bangkok", country: "Thailand", population: 10539000, value: "bangkok-thailand", label: "Bangkok, Thailand" },
    { city: "Singapore", country: "Singapore", population: 5454000, value: "singapore", label: "Singapore" },
    { city: "Dubai", region: "Dubai", country: "UAE", population: 3331000, value: "dubai-uae", label: "Dubai, UAE" },
    { city: "Istanbul", region: "Istanbul", country: "Turkey", population: 15520000, value: "istanbul-turkey", label: "Istanbul, Turkey" },
    { city: "Rome", region: "Lazio", country: "Italy", population: 2873000, value: "rome-italy", label: "Rome, Lazio, Italy" },
    { city: "Barcelona", region: "Catalonia", country: "Spain", population: 1620000, value: "barcelona-spain", label: "Barcelona, Catalonia, Spain" },
    { city: "Amsterdam", region: "North Holland", country: "Netherlands", population: 872000, value: "amsterdam-netherlands", label: "Amsterdam, Netherlands" },
    { city: "Berlin", region: "Berlin", country: "Germany", population: 3669000, value: "berlin-germany", label: "Berlin, Germany" },
    { city: "Vienna", region: "Vienna", country: "Austria", population: 1920000, value: "vienna-austria", label: "Vienna, Austria" },
    { city: "Prague", region: "Prague", country: "Czech Republic", population: 1309000, value: "prague-czech", label: "Prague, Czech Republic" }
  ];

  return popularCities.slice(0, limit);
};

export const formatCityData = (cities: any[]): CityData[] => {
  return cities.map(city => ({
    city: city.city,
    region: city.region,
    country: city.country,
    population: city.population,
    value: city.value,
    label: city.label
  }));
};
