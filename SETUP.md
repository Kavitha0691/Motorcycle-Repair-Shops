# EU Motorcycle Repair Shops - Setup Guide

This guide will help you set up the Supabase database and import the CSV data.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- The CSV data file at `utils/data/eu_motorcycle_repairs.csv`

## Step 1: Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be provisioned
3. Note down your project URL and API keys (found in Settings > API)

## Step 2: Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```

   **Important:**
   - The `SUPABASE_SERVICE_KEY` is only needed for data import and should NEVER be exposed to the client
   - Keep this file secure and never commit it to version control

## Step 3: Create Database Table

You have two options to create the database table:

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `supabase/migrations/20241113_create_motorcycle_shops.sql`
5. Paste it into the SQL editor and click "Run"

### Option B: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Push the migration:
   ```bash
   supabase db push
   ```

## Step 4: Import CSV Data

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the import script:
   ```bash
   npm run import-data
   ```

   This will:
   - Read the CSV file from `utils/data/eu_motorcycle_repairs.csv`
   - Parse and validate the data
   - Insert records into Supabase in batches of 100
   - Display progress and any errors

   The import should complete in a few minutes.

## Step 5: Run the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to [http://localhost:3000](http://localhost:3000)

3. You should see the motorcycle repair shops website with:
   - Total shop count and statistics
   - Search functionality
   - City filter
   - Rating filter
   - Shop cards with details

## Database Schema

The `motorcycle_shops` table includes:

- `id` - Primary key
- `city` - City and country
- `name` - Shop name
- `address` - Full address
- `rating` - Rating (0-5)
- `reviews_count` - Number of reviews
- `phone` - Contact number
- `website` - Website URL
- `business_type` - Type of business
- `hours` - Operating hours
- `latitude` / `longitude` - GPS coordinates
- `place_id` - Google Maps Place ID (unique)
- `scraped_at` - When data was collected
- `created_at` / `updated_at` - Timestamps

## Row Level Security (RLS) Policies

The table has RLS enabled with the following policies:

- **Public Read**: Anyone can view the data (no authentication required)
- **Authenticated Insert/Update/Delete**: Only authenticated users can modify data

This means your website visitors can browse shops without authentication, but only you (when authenticated) can manage the data.

## Features

### Frontend Features
- ✅ Display all motorcycle repair shops
- ✅ Real-time search by name, address, or city
- ✅ Filter by city
- ✅ Filter by minimum rating
- ✅ View shop details (address, phone, website, hours, rating)
- ✅ Open location in Google Maps
- ✅ Responsive design with dark mode support
- ✅ Statistics dashboard

### Backend Features
- ✅ Supabase PostgreSQL database
- ✅ Row Level Security (RLS) policies
- ✅ Full-text search indexes
- ✅ Geographic location indexes
- ✅ Automatic timestamp updates

## Troubleshooting

### Import Script Fails

**Error: Missing environment variables**
- Make sure `.env.local` exists with all required variables
- Verify your Supabase credentials are correct

**Error: Cannot connect to Supabase**
- Check your internet connection
- Verify your Supabase project is running
- Check if your API keys are valid

**Error: Duplicate key violations**
- The table already has data with the same `place_id`
- You can either delete existing data or modify the script to skip duplicates

### Frontend Shows "Failed to load"

**Check these:**
1. Supabase table exists and has data
2. Environment variables in `.env.local` are correct
3. RLS policies are properly configured
4. Your Supabase project is not paused (free tier projects pause after inactivity)

### Search/Filter Not Working

- Make sure you have the GIN index created (it's in the migration file)
- Check browser console for errors
- Verify data was imported correctly

## Next Steps

Once everything is working, you can:

1. **Deploy to Production**
   - Use Vercel, Netlify, or any hosting platform
   - Add your environment variables in the hosting platform settings

2. **Customize the Design**
   - Modify components in `app/components/`
   - Update styles in `app/globals.css`
   - Change the theme colors

3. **Add More Features**
   - Add a map view with markers
   - Implement user reviews
   - Add favorite/bookmark functionality
   - Create an admin dashboard

4. **Optimize Performance**
   - Add pagination for large datasets
   - Implement virtual scrolling
   - Add caching strategies

## Support

If you run into issues:
1. Check the Supabase logs in the dashboard
2. Check browser console for errors
3. Verify your database schema matches the migration file
4. Ensure RLS policies are correctly configured

---

**Data Source:** Google Maps
**Last Updated:** October 2025
**Total Records:** 3,149 motorcycle repair shops
