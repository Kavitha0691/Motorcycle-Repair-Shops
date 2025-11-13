'use client';

import { useState, useEffect } from 'react';

interface SearchFiltersProps {
  onSearch: (searchTerm: string) => void;
  onCityFilter: (city: string) => void;
  onRatingFilter: (minRating: number) => void;
  cities: string[];
}

export default function SearchFilters({
  onSearch,
  onCityFilter,
  onRatingFilter,
  cities,
}: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onCityFilter(city);
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    onRatingFilter(rating);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCity('');
    setMinRating(0);
    onSearch('');
    onCityFilter('');
    onRatingFilter(0);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-zinc-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Search & Filter
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Search by name or address
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search shops..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* City Filter */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            City
          </label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Minimum Rating
          </label>
          <select
            id="rating"
            value={minRating}
            onChange={(e) => handleRatingChange(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors text-sm font-medium"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
