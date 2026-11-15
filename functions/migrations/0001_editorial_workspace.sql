CREATE TABLE IF NOT EXISTS review_tasks (
  topic_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'needs_review' CHECK (status IN ('needs_review', 'in_review', 'verified')),
  assignee TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  draft_content TEXT,
  published_content TEXT,
  version INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS review_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id TEXT NOT NULL REFERENCES review_tasks(topic_id) ON DELETE CASCADE,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  content_snapshot TEXT,
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS review_tasks_status_updated ON review_tasks(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS review_tasks_assignee ON review_tasks(assignee);
CREATE INDEX IF NOT EXISTS review_history_topic_time ON review_history(topic_id, created_at DESC);
