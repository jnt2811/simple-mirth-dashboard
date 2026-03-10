const express = require('express');
const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
  if (req.cookies && req.cookies.auth === '1') {
    return res.redirect('/trusted-service');
  }
  res.render('login', { error: null });
});

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.cookie('auth', '1', { httpOnly: true });
    return res.redirect('/trusted-service');
  }
  res.render('login', { error: 'Invalid username or password.' });
});

// POST /logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth');
  res.redirect('/login');
});

module.exports = router;
