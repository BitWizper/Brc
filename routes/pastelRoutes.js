const express = require('express');
const PastelController = require('../controllers/pastelController');

const router = express.Router();

router.post('/crearpasteles', PastelController.crearPastel);
router.get('/obtenerpasteles', PastelController.obtenerPasteles);
router.get('/pasteles/:id', PastelController.obtenerPastelPorId);
router.put('/actpasteles/:id', PastelController.actualizarPastel);
router.delete('/elimpasteles/:id', PastelController.eliminarPastel);

module.exports = router;
