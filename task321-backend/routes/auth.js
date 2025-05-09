const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();
const JWT_SECRET = 'clave_secreta_321'; // ⚠️ Reemplazá esto con una variable de entorno en producción

// Registro
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
    [email, hashedPassword, role || 'callcenter'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(409).json({ error: 'Usuario ya existe' });
        }
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }
      res.status(201).json({ id: this.lastID, email });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  });
});

module.exports = router;
