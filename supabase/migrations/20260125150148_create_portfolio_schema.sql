/*
  # Portfolio OS Database Schema

  1. New Tables
    - `experiences`
      - `id` (uuid, primary key)
      - `company` (text)
      - `role` (text)
      - `duration` (text)
      - `start_date` (text)
      - `end_date` (text, nullable)
      - `location` (text)
      - `highlights` (jsonb array)
      - `logo` (text, nullable)
      - `created_at` (timestamptz)

    - `skills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `level` (integer)
      - `icon` (text, nullable)
      - `created_at` (timestamptz)

    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `tags` (jsonb array)
      - `image` (text)
      - `url` (text)
      - `featured` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (portfolio data is public)
*/

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  duration text NOT NULL,
  start_date text NOT NULL,
  end_date text,
  location text NOT NULL,
  highlights jsonb DEFAULT '[]'::jsonb,
  logo text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experiences"
  ON experiences FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  level integer NOT NULL CHECK (level >= 0 AND level <= 100),
  icon text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  tags jsonb DEFAULT '[]'::jsonb,
  image text NOT NULL,
  url text NOT NULL,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);
