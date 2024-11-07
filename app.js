const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const path = require('path');

// Crear la app de Express
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de la API
const usuarioRoutes = require('./routes/usuarioRoutes');
const pastelRoutes = require('./routes/pastelRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const reposteroRoutes = require('./routes/reposteroRoutes');
const citaRoutes = require('./routes/citaRoutes');
const pastelPersonalizadoRoutes = require('./routes/pastelPersonalizadoRoutes');
const resenaRoutes = require('./routes/resenaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

app.use('/api/usuario', usuarioRoutes);
app.use('/api/pastel', pastelRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/repostero', reposteroRoutes);
app.use('/api/cita', citaRoutes);
app.use('/api/pastelPersonalizado', pastelPersonalizadoRoutes);
app.use('/api/resena', resenaRoutes);
app.use('/api/pedido', pedidoRoutes);

// Carpeta que contiene los archivos estáticos del frontend (index.html, CSS, JS)
app.use(express.static(path.join(__dirname, 'front', 'public')));

// Ruta específica para pedidos
app.get('/pedidos', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'public', 'pedidos.html'));
});

// Ruta principal para index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'public', 'index.html'));
});


// Sincronizar la base de datos y lanzar el servidor
sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
  app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Error al sincronizar la base de datos:', error);
});
