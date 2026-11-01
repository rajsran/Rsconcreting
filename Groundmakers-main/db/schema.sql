-- Database schema for the website (Neon Postgres).
-- Safe to run more than once: every statement uses IF NOT EXISTS.
-- Apply with:  npm run db:setup

-- Leads from the "Get a Free Quote" popup
CREATE TABLE IF NOT EXISTS quote_leads (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  name          TEXT,
  email         TEXT,
  phone         TEXT,
  service       TEXT NOT NULL,
  type          TEXT,
  size          TEXT,
  timeline      TEXT,
  estimate_low  INTEGER,
  estimate_high INTEGER,
  status        TEXT NOT NULL DEFAULT 'new'   -- new | contacted | won | lost
);
CREATE INDEX IF NOT EXISTS quote_leads_created_idx ON quote_leads (created_at DESC);

-- Messages from the Contact page form
CREATE TABLE IF NOT EXISTS contact_messages (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  service     TEXT,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new'     -- new | replied
);
CREATE INDEX IF NOT EXISTS contact_messages_created_idx ON contact_messages (created_at DESC);

-- Portfolio projects managed in the admin area (image files stay in Vercel Blob)
CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_urls  TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS projects_created_idx ON projects (created_at DESC);

-- Hero photos managed in the admin area (position 0 is shown first)
CREATE TABLE IF NOT EXISTS hero_images (
  id          BIGSERIAL PRIMARY KEY,
  url         TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
