'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MotorcycleShop } from '@/types/motorcycle-shop';
import ShopCard from './components/ShopCard';
import SearchFilters from './components/SearchFilters';

export default function Home() {
  const [shops, setShops] = useState<MotorcycleShop[]>([]);
  const [filteredShops, setFilteredShops] = useState<MotorcycleShop[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [minRating, setMinRating] = useState(0);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [shops, searchTerm, selectedCity, minRating]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data, error, count } = await supabase
        .from('motorcycle_shops')
        .select('*', { count: 'exact' })
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(10000); // Fetch up to 10,000 records

      if (error) throw error;

      console.log(`Fetched ${data?.length} shops from Supabase`);

      setShops(data || []);
      setFilteredShops(data || []);

      // Extract unique cities
      const uniqueCities = Array.from(
        new Set(data?.map((shop) => shop.city) || [])
      ).sort();
      setCities(uniqueCities);

      // Calculate stats
      const totalShops = data?.length || 0;
      const shopsWithRating = data?.filter((shop) => shop.rating !== null) || [];
      const avgRating =
        shopsWithRating.reduce((sum, shop) => sum + (shop.rating || 0), 0) /
        (shopsWithRating.length || 1);
      const totalReviews = data?.reduce(
        (sum, shop) => sum + shop.reviews_count,
        0
      ) || 0;

      setStats({
        total: totalShops,
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews,
      });
    } catch (err) {
      console.error('Error fetching shops:', err);
      setError('Failed to load motorcycle shops. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterShops = () => {
    let filtered = [...shops];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (shop) =>
          shop.name.toLowerCase().includes(term) ||
          shop.address.toLowerCase().includes(term) ||
          shop.city.toLowerCase().includes(term)
      );
    }

    // City filter
    if (selectedCity) {
      filtered = filtered.filter((shop) => shop.city === selectedCity);
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(
        (shop) => shop.rating !== null && shop.rating >= minRating
      );
    }

    setFilteredShops(filtered);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading motorcycle repair shops...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center max-w-md p-6">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchShops}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🏍️ EU Motorcycle Repair Shops
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the best motorcycle repair shops across Europe
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-zinc-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Shops
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.total.toLocaleString()}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-zinc-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Average Rating
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.avgRating} ⭐
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-zinc-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Reviews
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalReviews.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <SearchFilters
          onSearch={setSearchTerm}
          onCityFilter={setSelectedCity}
          onRatingFilter={setMinRating}
          cities={cities}
        />

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredShops.length} of {shops.length} shops
          </p>
        </div>

        {/* Shop Cards */}
        {filteredShops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No shops found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Data sourced from Google Maps • Last updated: October 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
