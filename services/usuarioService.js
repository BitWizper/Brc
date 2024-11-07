const Usuario = require('../models/Usuario');

class UsuarioService {
  static async crearUsuario(data) {
    try {
      const usuario = await Usuario.create(data);
      return usuario;
    } catch (error) {
      throw new Error('Error al crear usuario: ' + error.message);
    }
  }

  static async obtenerUsuarios() {
    try {
      const usuarios = await Usuario.findAll();
      return usuarios;
    } catch (error) {
      throw new Error('Error al obtener usuarios: ' + error.message);
    }
  }

  static async obtenerUsuarioPorId(id) {
    try {
      const usuario = await Usuario.findByPk(id);
      return usuario;
    } catch (error) {
      throw new Error('Error al obtener usuario: ' + error.message);
    }
  }

  static async actualizarUsuario(id, data) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return null;
      await usuario.update(data);
      return usuario;
    } catch (error) {
      throw new Error('Error al actualizar usuario: ' + error.message);
    }
  }

  static async eliminarUsuario(id) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return null;
      await usuario.destroy();
      return true;
    } catch (error) {
      throw new Error('Error al eliminar usuario: ' + error.message);
    }
  }
}

module.exports = UsuarioService;
