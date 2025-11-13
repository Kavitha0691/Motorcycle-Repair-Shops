export interface MotorcycleShop {
  id: number;
  city: string;
  name: string;
  address: string;
  rating: number | null;
  reviews_count: number;
  phone: string | null;
  website: string | null;
  business_type: string | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  place_id: string;
  scraped_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MotorcycleShopCSV {
  city: string;
  name: string;
  address: string;
  rating: string;
  reviews_count: string;
  phone: string;
  website: string;
  business_type: string;
  hours: string;
  latitude: string;
  longitude: string;
  place_id: string;
  scraped_at: string;
}
