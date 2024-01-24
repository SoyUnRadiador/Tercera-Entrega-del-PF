const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const productManagerInstance = require('../productManager');
const Message = require('../models/message');
const Carrito = require('../carrito');
require('dotenv').config();
const authorizationMiddleware = require('../middleware/authorization');


router.get('/register', (req, res) => {
  if (req.session.user) {
      res.redirect('/home');
  } else {
      res.render('register');
  }
});

router.get('/home', (req, res) => {
  if (!req.session.user) {
      res.redirect('/login');
  } else {
      res.render('home', { showButtons: true }); 
  }
});


// Manejar los mensajes del chat
const io = require('socket.io')();
io.on('connection', (socket) => {
    console.log('Usuario conectado al chat');

    // Escuchar mensajes del cliente
    socket.on('chatMessage', async (messageContent, req) => {
        const user = req.user.email; // Acceder a la información del usuario desde req
        const message = new Message({ user, message: messageContent });
        try {
            // Guardar el mensaje en MongoDB
            await message.save();

            // Emitir el mensaje a todos los clientes conectados
            io.emit('message', { user, message: messageContent });
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    });
});


// Obtener productos de la lista con parámetros de consulta
router.get('/', (req, res) => {
  const { limit = 10, page = 1, query = '', sort = 'asc' } = req.query;

  const productos = productManagerInstance.ObtenerProductos(); // Obtener todos los productos

  if (productos.length > 0) {
    let productosFiltrados = productos;

    // Filtrar por query (si se proporciona)
    if (query) {
      // Verificar si query es una cadena válida antes de usarla en el filtrado
      if (typeof query === 'string') {
        productosFiltrados = productosFiltrados.filter(product => {
          return product && product.nombre && product.nombre.includes(query);
        });
      }
    }

    // Ordenar los productos
    if (sort === 'asc') {
      //Lógica para ordenar ascendente
    } else if (sort === 'desc') {
      //Lógica para ordenar descendente
    }

    // Paginar los productos
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = productosFiltrados.slice(startIndex, endIndex);

    res.json({
      products: paginatedProducts,
      totalProducts: productosFiltrados.length,
      currentPage: page,
      totalPages: Math.ceil(productosFiltrados.length / limit)
    });
  } else {
    res.status(404).json({ error: 'No se encontraron productos' });
  }
});



//Obtener productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
  const productos = productManagerInstance.ObtenerProductos();
  res.render('realTimeProducts', { productos });
});


router.get('/home', (req, res) => {
  const productos = productManagerInstance.ObtenerProductos();
  res.render('home', { productos });
});

router.get('/chat', (req, res) => {
  res.render('chat');
});


router.get('/:cid', (req, res) => {
  const productId = parseInt(req.params.cid);
  const producto = productManagerInstance.obtenerProductoPorID(productId);

  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

//Ruta para editar productos
router.post('/', authorizationMiddleware('admin'), (req, res) => {
  const { Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad } = req.body;
  if (!Titulo || !Descripcion || !Precio || !Miniatura || !Codigo || !Cantidad) {
    return res.status(400).json({ error: 'Se requieren todos los campos para agregar un producto.' });
  }

  const productoExistente = productManagerInstance.ObtenerProductos().find((producto) => producto.Codigo === Codigo);

  if (productoExistente) {
    productoExistente.Cantidad += Cantidad;
    res.status(200).json(productoExistente);
  } else {
    productManagerInstance.agregarProducto(Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad);
    const nuevoProducto = productManagerInstance.ObtenerProductos().find((producto) => producto.Codigo === Codigo);
    res.status(201).json(nuevoProducto);
    
    const io = req.app.get('io');
    io.emit('productoCambiado', nuevoProducto);
  }

  res.status(201).json(nuevoProducto);
});

//Ruta para actualizar productos
router.put('/:id', authorizationMiddleware('admin'), (req, res) => {
  const productId = parseInt(req.params.id);
  const { Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad } = req.body;
  const productoExistente = productManagerInstance.obtenerProductoPorID(productId);

  if (!productoExistente) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  if (Titulo) {
    productoExistente.Titulo = Titulo;
  }
  if (Descripcion) {
    productoExistente.Descripcion = Descripcion;
  }
  if (Precio) {
    productoExistente.Precio = Precio;
  }
  if (Miniatura) {
    productoExistente.Miniatura = Miniatura;
  }
  if (Codigo) {
    productoExistente.Codigo = Codigo;
  }
  if (Cantidad) {
    productoExistente.Cantidad = Cantidad;
  }

  res.json(productoExistente);
});

//Ruta para eliminar productos de la lista
router.delete('/:pid', authorizationMiddleware('admin'), (req, res) => {
  const productId = parseInt(req.params.pid);
  const productoEliminado = productManagerInstance.eliminarProducto(productId);

  if (productoEliminado) {
    res.json({ message: 'Producto eliminado con éxito', productoEliminado });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }

  const io = req.app.get('io');
  io.emit('productoCambiado', productoEliminado);
});


module.exports = router;
