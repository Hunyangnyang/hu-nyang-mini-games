-- v4.9.88: run in the existing D1 database's SQL console, once.
CREATE TABLE IF NOT EXISTS match_departures (room_id TEXT PRIMARY KEY, starts_at INTEGER NOT NULL);
