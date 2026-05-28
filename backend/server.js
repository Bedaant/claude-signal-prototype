require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { generateCode } = require('./services/generator');
const { analyzeCode } = require('./services/analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate code from prompt
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, language = 'python' } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const result = await generateCode(prompt, language);
    res.json(result);
  } catch (err) {
    console.error('Generate error:', err.message);
    res.status(500).json({ error: 'Code generation failed', details: err.message });
  }
});

// Analyze code
app.post('/api/analyze', async (req, res) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required' });

    const result = await analyzeCode(code, language);
    res.json(result);
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: 'Analysis failed', details: err.message });
  }
});

// Log override decision
app.post('/api/override', (req, res) => {
  const { user_id, prompt, generated_code, language, signal_level, override_decision } = req.body;

  if (!user_id || !prompt || !generated_code) {
    return res.status(400).json({ error: 'Missing required fields' });
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
