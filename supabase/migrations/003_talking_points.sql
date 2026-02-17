-- Talking points per interest tag
CREATE TABLE talking_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id TEXT NOT NULL CHECK (tag_id IN ('infra', 'models', 'governance', 'startups', 'global', 'voice', 'health', 'creative')),
  title TEXT NOT NULL,
  points TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE talking_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON talking_points
  FOR SELECT USING (true);

-- Seed data: one row per tag with 5 talking points each
INSERT INTO talking_points (tag_id, title, points) VALUES
(
  'infra',
  'AI Infrastructure & Compute',
  ARRAY[
    'India''s National AI Compute Mission targets 10,000+ GPU capacity — how does this compare to global benchmarks?',
    'Which cloud providers are winning India''s AI infrastructure deals, and what does that mean for startups?',
    'How are Indian data center operators handling the power demands of large-scale GPU clusters?',
    'What role will sovereign AI clouds play in India''s digital public infrastructure stack?',
    'Edge AI vs centralized compute — which use cases in India justify each approach?'
  ]
),
(
  'models',
  'Foundation Models & LLMs',
  ARRAY[
    'How do India-built foundation models (Sarvam, Krutrim) compare against GPT-4 and Gemini for Indic language tasks?',
    'What is the real cost of training a competitive LLM in India today, and who is funding it?',
    'Open-weight vs proprietary models — which path makes more sense for the Indian AI ecosystem?',
    'How are Indian enterprises fine-tuning foundation models for domain-specific use cases like legal and finance?',
    'What benchmarks should we use to evaluate multilingual models for India''s 22 official languages?'
  ]
),
(
  'governance',
  'AI Governance & Safety',
  ARRAY[
    'India chose not to sign the Bletchley Declaration — what does India''s own AI governance framework look like?',
    'How should India balance innovation speed with responsible AI deployment in public services?',
    'What guardrails are needed for AI in Aadhaar-linked services and UPI-scale financial systems?',
    'How are Indian companies implementing AI safety testing before production deployment?',
    'Should India create an independent AI safety institute, and what should its mandate be?'
  ]
),
(
  'startups',
  'Startups & Innovation',
  ARRAY[
    'Which AI startup verticals in India are attracting the most funding right now, and why?',
    'How can early-stage AI startups access affordable GPU compute without burning through runway?',
    'What''s the playbook for Indian AI startups going global — Southeast Asia first or direct to US/EU?',
    'How are AI startups navigating the build-vs-wrap decision with foundation model APIs?',
    'What government schemes (like the INDIAai Mission) actually help startups, and which are just paperwork?'
  ]
),
(
  'global',
  'Global Partnerships',
  ARRAY[
    'What concrete outcomes have come from India''s AI partnerships with the US, UK, and Japan so far?',
    'How is India positioning itself as an AI talent hub for global enterprises setting up GCCs?',
    'What does the India–EU Trade and Technology Council mean for cross-border AI data flows?',
    'How can Indian AI companies leverage GPAI (Global Partnership on AI) membership for market access?',
    'Which countries are looking to replicate India''s digital public infrastructure — and what AI layer can India export?'
  ]
),
(
  'voice',
  'Voice & Multilingual AI',
  ARRAY[
    'Bhashini has processed 1B+ translations — what''s next for India''s national language AI platform?',
    'How close are we to real-time, production-quality speech-to-speech translation across Indian languages?',
    'What unique challenges do tonal and low-resource Indian languages pose for ASR and TTS models?',
    'How are voice AI startups in India monetizing — B2G, B2B, or consumer-first?',
    'Can India build the equivalent of a multilingual AI assistant that works for 500M non-English internet users?'
  ]
),
(
  'health',
  'AI for Healthcare',
  ARRAY[
    'Which AI diagnostic tools deployed in India have shown clinically validated results at scale?',
    'How is ABDM (Ayushman Bharat Digital Mission) creating the data layer needed for health AI?',
    'What are the regulatory hurdles for AI-powered medical devices in India compared to FDA/CE pathways?',
    'How can AI bridge the specialist doctor shortage in rural India — teleradiology, pathology, or screening?',
    'What privacy frameworks are needed when training health AI models on Indian patient data?'
  ]
),
(
  'creative',
  'Creative AI & Media',
  ARRAY[
    'How is Bollywood and Indian media experimenting with generative AI for content production?',
    'What intellectual property challenges arise from AI-generated content trained on Indian creative works?',
    'How are Indian advertising agencies using AI tools — productivity boost or creative replacement?',
    'What opportunities exist for AI-powered content creation in Indian regional languages and markets?',
    'How should India regulate deepfakes while still enabling legitimate creative AI applications?'
  ]
);
