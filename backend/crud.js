const express = require('express');
const router = express.Router();
const db = require('./db.js');

// Get all enarithma
router.get('/enarithma', async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM enarithma');
    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get enarithma by id
router.get('/enarithma/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query('SELECT * FROM enarithma WHERE id = $1', [id]);
    if (results.rows.length === 0) {
      return res.status(404).send('Enarithma not found');
    }
    res.json(results.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create a new enarithma
router.post('/enarithma', async (req, res) => {
  try {
    const { title, description, amount } = req.body;
    const results = await db.query('INSERT INTO enarithma (title, description, amount) VALUES ($1, $2, $3) RETURNING *', [title, description, amount]);
    res.json(results.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update an existing enarithma
router.put('/enarithma/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, amount } = req.body;
    const results = await db.query('UPDATE enarithma SET title = $1, description = $2, amount = $3 WHERE id = $4 RETURNING *', [title, description, amount, id]);
    if (results.rows.length === 0) {
      return res.status(404).send('Enarithma not found');
    }
    res.json(results.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete an enarithma
router.delete('/enarithma/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query('DELETE FROM enarithma WHERE id = $1', [id]);
    if (results.rowCount === 0) {
      return res.status(404).send('Enarithma not found');
    }
    res.send('Enarithma deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;