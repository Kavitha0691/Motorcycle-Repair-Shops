'use client';

import { MotorcycleShop } from '@/types/motorcycle-shop';

interface ShopCardProps {
  shop: MotorcycleShop;
}

export default function ShopCard({ shop }: ShopCardProps) {
  const getRatingStars = (rating: number | null) => {
    if (!rating) return 'No rating';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">
          {'★'.repeat(fullStars)}
          {hasHalfStar ? '⯨' : ''}
          {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const handleViewOnMap = () => {
    if (shop.latitude && shop.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`,
        '_blank'
      );
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-zinc-800">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {shop.name}
        </h3>
        {shop.rating && (
          <div className="flex flex-col items-end">
            {getRatingStars(shop.rating)}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({shop.reviews_count} reviews)
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-start gap-2">
          <span className="text-gray-400">📍</span>
          <span>{shop.address}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400">🏙️</span>
          <span className="font-medium">{shop.city}</span>
        </div>

        {shop.phone && shop.phone !== 'N/A' && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📞</span>
            <a
              href={`tel:${shop.phone}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {shop.phone}
            </a>
          </div>
        )}

        {shop.website && shop.website !== 'N/A' && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🌐</span>
            <a
              href={shop.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline truncate"
            >
              Visit Website
            </a>
          </div>
        )}

        {shop.hours && shop.hours !== 'N/A' && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🕐</span>
            <span className="text-xs">{shop.hours}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {shop.latitude && shop.longitude && (
          <button
            onClick={handleViewOnMap}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View on Map
          </button>
        )}
      </div>
    </div>
  );
}
