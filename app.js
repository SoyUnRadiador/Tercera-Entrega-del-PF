const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const productManagerInstance = require('./productManager');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
const connectToDatabase = require('./config/database');
const carts = require('./models/carts');
const message = require('./models/message');
const product = require('./models/product');
const router = express.Router();
const productRouter = require('./Routers/router');
const carritoRouter = require('./Routers/carritoRouter');
const { MongoTopologyClosedError } = require('mongodb');
const path = require('path');
const session = require('express-session');
const authRouter = require('./Routers/authRouter');
const User = require('./models/User');
const passport = require('passport');
const initializePassport = require('./passport.config');
const config = require('./config/config')
const currentRoute = require('./routes/current');
const obtenerProductosDelCarrito = require('./carrito');
const carritoRouters = require('./Routers/carritoRouter');



require('dotenv').config();

//Configurar login
// Configuración de sesiones con almacenamiento en archivos
app.use(session({
  secret: 'mysecretkey', // Clave secreta para firmar la sesión
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Configuración de la cookie de sesión
}));


// Configurar Handlebars como motor de vistas
app.engine('handlebars', handlebars.engine({
  layoutsDir: path.join(__dirname, 'views/layouts'), // Directorio de layouts
  defaultLayout: 'main', // Establecer 'main' como diseño por defecto
  extname: 'handlebars' // Establecer la extensión de los archivos de vistas
}));
app.set('view engine', 'handlebars');

// Establecer la ubicación de las vistas
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    // Si el usuario está autenticado, redirige a la página principal
    res.redirect('/home');
  } else {
    // Si no está autenticado, redirige al formulario de inicio de sesión
    res.redirect('/login');
  }
});

// Rutas
app.get('/home', (req, res) => {
  if (!req.session.user) {
    // Si el usuario no está autenticado, redirige al inicio de sesión
    res.redirect('/login');
  } else {
    // Si está autenticado, muestra la página principal
    res.render('home'); // Renderiza la vista 'home.handlebars'
  }
});

app.get('/login', (req, res) => {
  res.render('login'); // Renderiza la vista de inicio de sesión
});

app.use('/api/carrito', carritoRouters);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.use('/api/products', productRouter);
app.use('/api/carts', carritoRouter);
app.use('/', authRouter);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter);
app.use('/api', currentRoute);
connectToDatabase();

const clients = new Set();

// Maneja conexiones WebSocket
wss.on('connection', (ws) => {
  clients.add(ws);
  if (clients.size === 1) {
    console.log('Cliente WebSocket conectado');
  }

  // Maneja el cierre de la conexión WebSocket
  ws.on('close', () => {
    clients.delete(ws);
    if (clients.size === 0) {
      console.log('Cliente WebSocket desconectado');
    }
  });
});

// Define la ruta GET '/carrito' para renderizar tu vista 'carrito.handlebars'
app.get('/carrito', (req, res) => {
  const cartId = 1; // ID del carrito
  const productosCarrito = obtenerProductosDelCarrito(cartId); // Obtén los productos del carrito

  // Renderiza la vista 'carrito.handlebars' y pasa los datos necesarios como contexto
  res.render('carrito', { productosCarrito, cartId });
});


app.use(express.static('public'));
app.use(bodyParser.json());

const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  io.emit('productosActualizados', productManagerInstance.ObtenerProductos());
});


app.get('/realtimeproducts', (req, res) => {
  const productos = productManagerInstance.ObtenerProductos();
  res.render('realTimeProducts', { productos });
});

//Github
app.use(express.urlencoded({ extended: false }));

initializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());



server.listen(port, () => {
  console.log('Servidor en ejecución en el puerto 8080');
});

app.set('io', io);

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Base de datos conectada');
  })
  .catch((error) => {
    console.error('Error en la conexión de la base de datos:', error);
  });

module.exports = app;