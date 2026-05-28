require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { generateCode } = require('./services/generator');
const { analyzeCode } = require('./services/analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy headers (Render, Vercel, etc. use reverse proxies)
app.set('trust proxy', 1);

// Simple in-memory rate limiter with periodic cleanup
const rateLimits = new Map();
const RATE_WINDOW_MS = 60000; // 1 minute
const RATE_MAX_REQUESTS = 20; // 20 requests per minute per IP

// Clean up expired entries every 5 minutes to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimits) {
    if (now > entry.resetAt) rateLimits.delete(ip);
  }
}, 5 * 60 * 1000);

function rateLimit(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + RATE_WINDOW_MS;
  } else {
    entry.count++;
  }

  rateLimits.set(ip, entry);

  if (entry.count > RATE_MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }
  next();
}

app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '512kb' })); // Limit request body size

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate code from prompt
app.post('/api/generate', rateLimit, async (req, res) => {
  try {
    const { prompt, language = 'python' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }
    if (prompt.length > 2000) {
      return res.status(400).json({ error: 'Prompt too long (max 2000 characters)' });
    }

    const result = await generateCode(prompt, language);
    res.json(result);
  } catch (err) {
    console.error('Generate error:', err.message);
    res.status(500).json({ error: 'Code generation failed. Please try again.' });
  }
});

// Analyze code
app.post('/api/analyze', rateLimit, async (req, res) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Support both single string and multi-file array
    const isMultiFile = Array.isArray(code);
    const codeSize = isMultiFile
      ? code.reduce((sum, f) => sum + (f.content?.length || 0), 0)
      : code.length;

    if (codeSize > 100000) {
      return res.status(400).json({ error: 'Code too large (max 100KB total)' });
    }

    const result = await analyzeCode(code, language);
    res.json(result);
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

// Log override decision
app.post('/api/override', rateLimit, (req, res) => {
  const { user_id, prompt, generated_code, language, signal_level, override_decision } = req.body;

  if (!user_id || !prompt || !generated_code) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (generated_code.length > 50000) {
    return res.status(400).json({ error: 'Code too large' });
  }

  db.run(
    `INSERT INTO interactions (user_id, prompt, generated_code, language, signal_level, override_decision)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, prompt, generated_code, language, signal_level, override_decision || 'accepted'],
    function (err) {
      if (err) {
        console.error('Override insert error:', err);
        return res.status(500).json({ error: 'Failed to log override' });
      }

      // Update calibration profile
      db.get(`SELECT * FROM calibration_profiles WHERE user_id = ?`, [user_id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Calibration lookup failed' });

        const isOverride = override_decision === 'override';
        if (!row) {
          db.run(
            `INSERT INTO calibration_profiles (user_id, interaction_count, override_count, issues_from_overrides, signal_strength)
             VALUES (?, 1, ?, 0, 'default')`,
            [user_id, isOverride ? 1 : 0],
            () => res.json({ success: true, id: this.lastID })
          );
        } else {
          const newOverrideCount = row.override_count + (isOverride ? 1 : 0);
          const newSignalStrength = newOverrideCount > 3 ? 'amplified' : newOverrideCount > 6 ? 'reduced' : 'default';
          db.run(
            `UPDATE calibration_profiles
             SET interaction_count = interaction_count + 1,
                 override_count = ?,
                 signal_strength = ?,
                 last_updated = CURRENT_TIMESTAMP
             WHERE user_id = ?`,
            [newOverrideCount, newSignalStrength, user_id],
            () => res.json({ success: true, id: this.lastID })
          );
        }
      });
    }
  );
});

// Get calibration profile
app.get('/api/calibration/:userId', (req, res) => {
  const { userId } = req.params;

  db.get(`SELECT * FROM calibration_profiles WHERE user_id = ?`, [userId], (err, profile) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    db.all(
      `SELECT signal_level, override_decision, created_at FROM interactions
       WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [userId],
      (err, interactions) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        res.json({
          profile: profile || {
            user_id: userId,
            interaction_count: 0,
            override_count: 0,
            issues_from_overrides: 0,
            signal_strength: 'default'
          },
          interactions: interactions || []
        });
      }
    );
  });
});

// Get recent interactions
app.get('/api/interactions/:userId', (req, res) => {
  const { userId } = req.params;
  db.all(
    `SELECT * FROM interactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Claude Signal backend running on port ${PORT}`);
});
