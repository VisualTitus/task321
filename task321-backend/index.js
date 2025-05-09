const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const database = require('./db/database'); // Inicializa la base de datos

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);     // Registro, login
app.use('/api/tasks', taskRoutes);    // Crear/ver tareas

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ Backend Task321 funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
