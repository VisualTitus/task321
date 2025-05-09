const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta de la base de datos local
const db = new sqlite3.Database(path.resolve(__dirname, 'task321.db'), (err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  } else {
    console.log('📦 Conectado a la base de datos SQLite: task321.db');
  }
});

// Crear tablas si no existen
db.serialize(() => {
  // Tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'callcenter'
    )
  `);

  // Tabla de clientes
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT
    )
  `);

  // Tabla de órdenes de trabajo
  db.run(`
    CREATE TABLE IF NOT EXISTS task_request (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      description TEXT NOT NULL,
      urgent INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(client_id) REFERENCES clients(id)
    )
  `);
});

module.exports = db;
