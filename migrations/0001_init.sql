CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  owner_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  dog_name TEXT NOT NULL,
  dog_breed TEXT,
  desired_at TEXT NOT NULL,
  plan TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
