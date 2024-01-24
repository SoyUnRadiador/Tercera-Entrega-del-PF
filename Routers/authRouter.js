const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const Carrito = require('../carrito');

router.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('register');
    }
  });

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('login', { layout: 'loginLayout', showButtons: false });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Busca al usuario por su correo electrónico en la base de datos
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            // Si el usuario no existe o la contraseña es incorrecta, muestra un mensaje de error
            console.error('Credenciales incorrectas');
            return res.redirect('/login');
        }

        // Si las credenciales son correctas, establece la sesión del usuario
        req.session.user = {
            email: user.email,
            role: user.role // Si tienes un campo de 'role' en tu modelo de usuario
        };

        res.redirect('/home'); // Redirige a la página principal
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});


// Ruta para el cierre de sesión
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
  });

  
// Ruta para procesar el registro de un nuevo usuario
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verifica si el correo electrónico ya está en uso
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send('El correo electrónico ya está en uso');
        }

        // Crea un nuevo usuario con los datos proporcionados
        const newUser = new User({ name, email, password });
        await newUser.save(); // Guarda el nuevo usuario en la base de datos

        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar al usuario:', error);
        res.status(500).send('Error al registrar al usuario');
    }
});
  
const hashFromDatabase = '$2b$10$YourStoredHashHere';
const passwordAttempt = 'password123';

bcrypt.compare(passwordAttempt, hashFromDatabase, function(err, result) {
  if (err) {
    // Manejar el error
    console.error(err);
    return;
  }

  if (result) {
    // Contraseña correcta
    console.log('Contraseña correcta');
  } else {
    // Contraseña incorrecta
    console.log('Contraseña incorrecta');
  }
});


//GitHub

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }) 
  );

  router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
        req.session.user = req.user;
        res.redirect("/home");
    }
);

module.exports = router;
