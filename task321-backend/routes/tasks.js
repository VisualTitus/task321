const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Crear nueva tarea (y cliente si no existe)
router.post('/', (req, res) => {
  const { name, phone, email, address, description, urgent } = req.body;

  if (!name || !phone || !description) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Verificamos si el cliente ya existe por teléfono
  db.get(`SELECT id FROM clients WHERE phone = ?`, [phone], (err, client) => {
    if (err) return res.status(500).json({ error: 'Error al buscar cliente' });

    const client_id = client?.id;

    const insertTask = (cid) => {
      db.run(
        `INSERT INTO task_request (client_id, description, urgent) VALUES (?, ?, ?)`,
        [cid, description, urgent ? 1 : 0],
        function (err2) {
          if (err2) return res.status(500).json({ error: 'Error al registrar tarea' });
          res.status(201).json({ task_id: this.lastID });
        }
      );
    };

    if (client_id) {
      insertTask(client_id);
    } else {
      // Crear cliente primero
      db.run(
        `INSERT INTO clients (name, phone, email, address) VALUES (?, ?, ?, ?)`,
        [name, phone, email || '', address || ''],
        function (err2) {
          if (err2) return res.status(500).json({ error: 'Error al crear cliente' });
          insertTask(this.lastID);
        }
      );
    }
  });
});

// Ver tareas por estado
router.get('/', (req, res) => {
  const status = req.query.status || 'pending';

  db.all(`SELECT t.*, c.name, c.phone FROM task_request t JOIN clients c ON t.client_id = c.id WHERE t.status = ? ORDER BY t.created_at DESC`, [status], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener tareas' });
    res.json(rows);
  });
});

module.exports = router;
