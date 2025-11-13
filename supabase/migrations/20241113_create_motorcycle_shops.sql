-- Create the motorcycle_shops table
CREATE TABLE IF NOT EXISTS public.motorcycle_shops (
  id BIGSERIAL PRIMARY KEY,
  city TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  rating DECIMAL(2, 1),
  reviews_count INTEGER DEFAULT 0,
  phone TEXT,
  website TEXT,
  business_type TEXT,
  hours TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  place_id TEXT UNIQUE NOT NULL,
  scraped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_motorcycle_shops_city ON public.motorcycle_shops(city);
CREATE INDEX IF NOT EXISTS idx_motorcycle_shops_rating ON public.motorcycle_shops(rating DESC);
CREATE INDEX IF NOT EXISTS idx_motorcycle_shops_name ON public.motorcycle_shops(name);
CREATE INDEX IF NOT EXISTS idx_motorcycle_shops_location ON public.motorcycle_shops(latitude, longitude);

-- Create a GIN index for full-text search on name and address
CREATE INDEX IF NOT EXISTS idx_motorcycle_shops_search
  ON public.motorcycle_shops
  USING GIN (to_tsvector('english', name || ' ' || address));

-- Enable Row Level Security
ALTER TABLE public.motorcycle_shops ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read (public access)
CREATE POLICY "Allow public read access"
  ON public.motorcycle_shops
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can insert (for data import)
CREATE POLICY "Allow authenticated insert"
  ON public.motorcycle_shops
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update
CREATE POLICY "Allow authenticated update"
  ON public.motorcycle_shops
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete
CREATE POLICY "Allow authenticated delete"
  ON public.motorcycle_shops
  FOR DELETE
  TO authenticated
  USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.motorcycle_shops
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
