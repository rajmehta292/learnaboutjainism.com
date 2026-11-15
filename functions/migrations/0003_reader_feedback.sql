CREATE TABLE IF NOT EXISTS reader_feedback (
  id TEXT PRIMARY KEY,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('correction', 'accessibility', 'suggestion')),
  page_url TEXT NOT NULL DEFAULT '',
  feedback TEXT NOT NULL,
  supporting_context TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'triaged', 'in_progress', 'resolved', 'dismissed')),
  assignee TEXT NOT NULL DEFAULT '',
  staff_notes TEXT NOT NULL DEFAULT '',
  github_issue_number INTEGER,
  github_issue_url TEXT,
  github_synced_at TEXT,
  github_sync_state TEXT NOT NULL DEFAULT 'pending' CHECK (github_sync_state IN ('pending', 'sending', 'synced', 'failed', 'preview')),
  github_sync_error TEXT NOT NULL DEFAULT '',
  github_sync_started_at TEXT,
  delivery_attempts INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS reader_feedback_status_created
  ON reader_feedback(status, created_at DESC);
CREATE INDEX IF NOT EXISTS reader_feedback_assignee_status
  ON reader_feedback(assignee, status);
CREATE INDEX IF NOT EXISTS reader_feedback_github_sync
  ON reader_feedback(github_sync_state, created_at);

CREATE TABLE IF NOT EXISTS reader_feedback_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feedback_id TEXT NOT NULL REFERENCES reader_feedback(id) ON DELETE CASCADE,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS reader_feedback_history_item_time
  ON reader_feedback_history(feedback_id, created_at DESC);

CREATE TABLE IF NOT EXISTS reader_feedback_rate_limits (
  ip_digest TEXT PRIMARY KEY,
  window_started_at TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS reader_feedback_rate_limit_window
  ON reader_feedback_rate_limits(window_started_at);
