const express = require('express');
const UsuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.post('/crearusuarios', UsuarioController.crearUsuario);
router.get('/obtenerusuarios', UsuarioController.obtenerUsuarios);
router.get('/usuarios/:id', UsuarioController.obtenerUsuarioPorId);
router.put('/actusuarios/:id', UsuarioController.actualizarUsuario);
router.delete('/elimusuarios/:id', UsuarioController.eliminarUsuario);

module.exports = router;
