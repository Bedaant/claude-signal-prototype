const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.RENDER_DISK_PATH
  ? path.join(process.env.RENDER_DISK_PATH, 'signal.db')
  : process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'signal.db')
  : path.join(__dirname, 'signal.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    generated_code TEXT NOT NULL,
    language TEXT NOT NULL,
    signal_level TEXT NOT NULL,
    override_decision TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS calibration_profiles (
    user_id TEXT PRIMARY KEY,
    interaction_count INTEGER DEFAULT 0,
    override_count INTEGER DEFAULT 0,
    issues_from_overrides INTEGER DEFAULT 0,
    signal_strength TEXT DEFAULT 'default',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
