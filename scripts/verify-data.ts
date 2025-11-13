import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyData() {
  console.log('Checking database...\n');

  // Get total count
  const { count, error } = await supabase
    .from('motorcycle_shops')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`✓ Total records in database: ${count}`);

  // Get count by city
  const { data: cities } = await supabase
    .from('motorcycle_shops')
    .select('city')
    .order('city');

  if (cities) {
    const cityCount = new Map<string, number>();
    cities.forEach(row => {
      cityCount.set(row.city, (cityCount.get(row.city) || 0) + 1);
    });

    console.log('\nRecords by city:');
    Array.from(cityCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([city, count]) => {
        console.log(`  ${city}: ${count}`);
      });
  }

  // Get sample data
  const { data: sample } = await supabase
    .from('motorcycle_shops')
    .select('name, city, rating')
    .limit(5);

  if (sample) {
    console.log('\nSample records:');
    sample.forEach(shop => {
      console.log(`  - ${shop.name} (${shop.city}) - ${shop.rating || 'No rating'}`);
    });
  }
}

verifyData();
