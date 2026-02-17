-- ============================================================
-- Feedback & Experience Reviews Tables
-- ============================================================

-- 1. Feedback (floating feedback button — allows multiple per device)
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT,
  page TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Experience Reviews (summit wrap-up — one per device)
CREATE TABLE IF NOT EXISTS experience_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  best_part TEXT,
  improvement TEXT,
  would_recommend BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_reviews ENABLE ROW LEVEL SECURITY;

-- Feedback: public insert + select
CREATE POLICY "feedback_select" ON feedback FOR SELECT USING (true);
CREATE POLICY "feedback_insert" ON feedback FOR INSERT WITH CHECK (true);

-- Experience Reviews: public insert + select
CREATE POLICY "experience_reviews_select" ON experience_reviews FOR SELECT USING (true);
CREATE POLICY "experience_reviews_insert" ON experience_reviews FOR INSERT WITH CHECK (true);
