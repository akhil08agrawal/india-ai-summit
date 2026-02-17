-- ============================================================
-- India AI Summit — Engagement Features Schema
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  persona TEXT,
  interests TEXT[] DEFAULT '{}',
  visit_day INT,
  whatsapp TEXT,
  working_on TEXT,
  looking_for TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Polls
CREATE TABLE IF NOT EXISTS polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Poll Votes
CREATE TABLE IF NOT EXISTS poll_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  option_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(poll_id, device_id)
);

-- 4. Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Meetups
CREATE TABLE IF NOT EXISTS meetups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  description TEXT,
  persona_tag TEXT,
  max_attendees INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Meetup RSVPs
CREATE TABLE IF NOT EXISTS meetup_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meetup_id UUID NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(meetup_id, device_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetup_rsvps ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, public upsert
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (true);

-- Polls: public read only
CREATE POLICY "polls_select" ON polls FOR SELECT USING (true);

-- Poll Votes: public read, public insert
CREATE POLICY "poll_votes_select" ON poll_votes FOR SELECT USING (true);
CREATE POLICY "poll_votes_insert" ON poll_votes FOR INSERT WITH CHECK (true);

-- Announcements: public read only
CREATE POLICY "announcements_select" ON announcements FOR SELECT USING (true);

-- Meetups: public read, public insert, creator can delete
CREATE POLICY "meetups_select" ON meetups FOR SELECT USING (true);
CREATE POLICY "meetups_insert" ON meetups FOR INSERT WITH CHECK (true);
CREATE POLICY "meetups_delete" ON meetups FOR DELETE USING (true);

-- Meetup RSVPs: public read, public insert, public delete
CREATE POLICY "meetup_rsvps_select" ON meetup_rsvps FOR SELECT USING (true);
CREATE POLICY "meetup_rsvps_insert" ON meetup_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "meetup_rsvps_delete" ON meetup_rsvps FOR DELETE USING (true);

-- ============================================================
-- Realtime
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE poll_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE meetup_rsvps;
