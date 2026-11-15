CREATE TABLE IF NOT EXISTS reader_users (
  id TEXT PRIMARY KEY,
  google_sub TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reader_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES reader_users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS reader_sessions_user_expiry
  ON reader_sessions(user_id, expires_at);

CREATE TABLE IF NOT EXISTS reader_progress (
  user_id TEXT NOT NULL REFERENCES reader_users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
  last_accessed TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, topic_id)
);
CREATE INDEX IF NOT EXISTS reader_progress_recent
  ON reader_progress(user_id, last_accessed DESC);

CREATE TABLE IF NOT EXISTS reader_saved_topics (
  user_id TEXT NOT NULL REFERENCES reader_users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  saved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, topic_id)
);
CREATE INDEX IF NOT EXISTS reader_saved_topics_recent
  ON reader_saved_topics(user_id, saved_at DESC);

CREATE TABLE IF NOT EXISTS reader_notes (
  user_id TEXT NOT NULL REFERENCES reader_users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, topic_id)
);
CREATE INDEX IF NOT EXISTS reader_notes_recent
  ON reader_notes(user_id, updated_at DESC);
