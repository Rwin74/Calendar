-- Create the calendar_entries table in Supabase
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS calendar_entries (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('Meeting', 'Note')),
  content TEXT NOT NULL,
  time TEXT NOT NULL,
  created_by TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the date column for faster queries
CREATE INDEX IF NOT EXISTS idx_calendar_entries_date ON calendar_entries(date);

-- Enable Row Level Security
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;

-- Allow public access (for demo purposes - adjust for production)
CREATE POLICY "Allow all access on calendar_entries" ON calendar_entries
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample data (optional)
-- INSERT INTO calendar_entries (id, type, content, time, created_by, date) VALUES
-- ('sample-1', 'Meeting', 'Team standup', '09:00', 'Partner 1', '2026-04-19'),
-- ('sample-2', 'Note', 'Remember to send report', '14:00', 'Partner 2', '2026-04-19');
