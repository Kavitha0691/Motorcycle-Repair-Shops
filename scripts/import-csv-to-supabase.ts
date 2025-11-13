import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for bulk insert

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CSVRow {
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

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

function parseValue(value: string): string | number | null {
  const trimmed = value.trim();

  if (trimmed === '' || trimmed === 'N/A' || trimmed === 'null') {
    return null;
  }

  // Try to parse as number
  const num = parseFloat(trimmed);
  if (!isNaN(num) && trimmed === num.toString()) {
    return num;
  }

  return trimmed;
}

async function importCSV() {
  const csvPath = path.join(process.cwd(), 'utils', 'data', 'eu_motorcycle_repairs.csv');

  console.log('Reading CSV file:', csvPath);
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n');

  console.log(`Total lines: ${lines.length}`);

  // Skip header
  const header = parseCSVLine(lines[0]);
  console.log('CSV Headers:', header);

  const records = [];
  let errorCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const values = parseCSVLine(line);

      if (values.length !== header.length) {
        console.warn(`Line ${i + 1}: Column count mismatch. Expected ${header.length}, got ${values.length}`);
        errorCount++;
        continue;
      }

      const record: any = {};
      header.forEach((key, index) => {
        record[key] = values[index];
      });

      // Transform the data
      const transformedRecord = {
        city: parseValue(record.city) as string,
        name: parseValue(record.name) as string,
        address: parseValue(record.address) as string,
        rating: parseValue(record.rating),
        reviews_count: parseInt(record.reviews_count) || 0,
        phone: parseValue(record.phone),
        website: parseValue(record.website),
        business_type: parseValue(record.business_type),
        hours: parseValue(record.hours),
        latitude: parseValue(record.latitude),
        longitude: parseValue(record.longitude),
        place_id: record.place_id,
        scraped_at: record.scraped_at ? new Date(record.scraped_at).toISOString() : null,
      };

      records.push(transformedRecord);
    } catch (error) {
      console.error(`Error parsing line ${i + 1}:`, error);
      errorCount++;
    }
  }

  console.log(`\nParsed ${records.length} valid records (${errorCount} errors)`);
  console.log('Starting Supabase import...\n');

  // Insert in batches of 100
  const batchSize = 100;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    console.log(`Inserting batch ${Math.floor(i / batchSize) + 1} (${i + 1}-${Math.min(i + batchSize, records.length)} of ${records.length})...`);

    const { data, error } = await supabase
      .from('motorcycle_shops')
      .insert(batch)
      .select();

    if (error) {
      console.error('Batch error:', error.message);
      failCount += batch.length;
    } else {
      successCount += data?.length || 0;
      console.log(`✓ Successfully inserted ${data?.length} records`);
    }
  }

  console.log('\n=== Import Complete ===');
  console.log(`Total records processed: ${records.length}`);
  console.log(`Successfully imported: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Parse errors: ${errorCount}`);
}

// Run the import
importCSV().catch(console.error);
