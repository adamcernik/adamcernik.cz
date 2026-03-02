-- ============================================================
-- Voxpot Survey – Supabase Schema
-- ============================================================
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- Table for survey responses
CREATE TABLE survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version TEXT NOT NULL CHECK (version IN ('vedeni', 'prispevatel')),
    respondent_name TEXT,
    role TEXT,
    answers JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    user_agent TEXT
);

-- Index for faster queries by version
CREATE INDEX idx_survey_version ON survey_responses(version);
CREATE INDEX idx_survey_created ON survey_responses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can INSERT (anonymous survey submissions)
CREATE POLICY "Allow anonymous inserts"
    ON survey_responses
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Only authenticated users can SELECT (Adam reads results)
CREATE POLICY "Allow authenticated reads"
    ON survey_responses
    FOR SELECT
    TO authenticated
    USING (true);

-- Optional: Also allow anon SELECT if you want to show a thank-you with stats
-- CREATE POLICY "Allow anon reads" ON survey_responses FOR SELECT TO anon USING (true);

-- ============================================================
-- View for quick overview
-- ============================================================
CREATE VIEW survey_overview AS
SELECT
    version,
    COUNT(*) as total_responses,
    MIN(created_at) as first_response,
    MAX(created_at) as last_response
FROM survey_responses
GROUP BY version;
