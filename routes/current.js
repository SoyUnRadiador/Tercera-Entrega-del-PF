// routes/current.js
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Importar el DTO
const UserDTO = require('../services/UserDTO');

// Ruta protegida para obtener el usuario actual
router.get('/current', (req, res) => {
    // Verificar si el usuario está autenticado
    if (req.isAuthenticated()) {
        // Crear el DTO con la información necesaria
        const userDTO = UserDTO(req.user);

        // Enviar el DTO en lugar del objeto de usuario completo
        res.json(userDTO);
    } else {
        // El usuario no está autenticado
        res.status(401).json({ message: 'No autenticado' });
    }
});

module.exports = router;
