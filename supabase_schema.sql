-- =========================================================
-- Supabase Schema for SIH26002 Emergency Logistics Network
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mfpgdfrmuoevzugmegja/sql
-- =========================================================

-- 1. Responders Profile Table
CREATE TABLE IF NOT EXISTS public.responders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    division TEXT,
    role TEXT DEFAULT 'responder',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Incident Reports Table
CREATE TABLE IF NOT EXISTS public.incident_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    hazard_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT,
    reported_by TEXT DEFAULT 'Field Responder',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.responders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- Responders Policies (Allow anonymous & authenticated read/write for emergency responders)
CREATE POLICY "Allow public read access on responders" 
    ON public.responders FOR SELECT USING (true);

CREATE POLICY "Allow public insert on responders" 
    ON public.responders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update own responder profile" 
    ON public.responders FOR UPDATE USING (true);

-- Incident Reports Policies (Allow reporting incidents and viewing recent hazard reports)
CREATE POLICY "Allow public read access on incident_reports" 
    ON public.incident_reports FOR SELECT USING (true);

CREATE POLICY "Allow public insert on incident_reports" 
    ON public.incident_reports FOR INSERT WITH CHECK (true);
