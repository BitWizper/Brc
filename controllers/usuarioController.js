const UsuarioService = require('../services/usuarioService');

class UsuarioController {
  static async crearUsuario(req, res) {
    try {
      const usuario = await UsuarioService.crearUsuario(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerUsuarios(req, res) {
    try {
      const usuarios = await UsuarioService.obtenerUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerUsuarioPorId(req, res) {
    try {
      const usuario = await UsuarioService.obtenerUsuarioPorId(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizarUsuario(req, res) {
    try {
      const usuario = await UsuarioService.actualizarUsuario(req.params.id, req.body);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminarUsuario(req, res) {
    try {
      const eliminado = await UsuarioService.eliminarUsuario(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UsuarioController;

