const express = require('express');
const router = express.Router();
const { productManagerInstance } = require('../productManager');
const Carts = require('../models/carts');
const Product = require('../models/product');
const Carrito = require('../carrito');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const authorizationMiddleware = require('../middleware/authorization');
const Ticket = require('../Tickets/ticketModel');

// Crea una instancia de Carrito
const carrito = new Carrito();



// Configura la ruta para mostrar el carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid; // Obtener el cartId desde los parámetros de la URL
    const productosCarrito = await carritoService.obtenerProductosCarrito(cartId); // Obtener los productos del carrito

    res.render('carrito', { productosCarrito, cartId }); 
  } catch (error) {
    res.status(500).send('Error al obtener los productos del carrito');
  }
});


// Para buscar un carrito por su ID con Promesas
Carts.findById('1')
  .then(cart => {
    if (!cart) {
      console.log('Carrito no encontrado');
    } else {
      console.log('Carrito encontrado:', cart);
    }
  })
  .catch(error => {
    console.error('Error al buscar el carrito:', error);
  });

// Ruta para crear un nuevo carrito
router.post('/'/*, authorizationMiddleware('user')*/, (req, res) => {
    const nuevoCarrito = carrito.crearCarrito(req.body.Products);
    res.status(201).json(nuevoCarrito);
});

router.get('/:cid', (req, res) => {
    const carritoID = parseInt(req.params.cid);

    // Busca el carrito por ID
    const carritoEncontrado = carrito.Carritos.find((c) => c.ID === carritoID);

    if (carritoEncontrado) {
        res.json(carritoEncontrado.Products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

// Ruta para agregar productos a un carrito
router.post('/:cid/product/:pid'/*, authorizationMiddleware('user')*/, (req, res) => {
    const carritoID = parseInt(req.params.cid);
    const productoID = parseInt(req.params.pid);

    // Busca el carrito por ID
    const carritoEncontrado = carrito.Carritos.find((c) => c.ID === carritoID);

    if (carritoEncontrado) {
        const product = {
            product: productoID,
            quantity: 1,
        };

        // Verifica si el producto ya existe en el carrito
        const existingProduct = carritoEncontrado.Products.find((p) => p.product === productoID);

        if (existingProduct) {
            // Si ya existe, aumenta la cantidad en 1
            existingProduct.quantity += 1;
        } else {
            // Si no existe, agrega el producto al carrito
            carritoEncontrado.Products.push(product);
        }

        res.status(201).json(carritoEncontrado);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
const io = req.app.get('io'); // Obtiene el objeto Socket.io
io.emit('productoCambiado');

});


// DELETE api/carts/:cid/products/:pid: Eliminar un producto del carrito
router.delete('/:cid/products/:pid', authorizationMiddleware('user'), (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  const cartIndex = carrito.Carritos.findIndex(c => c.ID === cartId);

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const cart = carrito.Carritos[cartIndex];

  const productIndex = cart.Products.findIndex(p => p.product === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
  }

  cart.Products.splice(productIndex, 1);

  return res.json({ message: 'Producto eliminado del carrito correctamente' });
});



  
  
// PUT api/carts/:cid: Actualizar el carrito con un arreglo de productos
  router.put('/:cid', async (req, res) => {
    try {
      const carts = await Carts.findById(req.params.cid);
  
      if (!carts) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      carts.products = req.body.products;
      await carts.save();
  
      res.json({ message: 'Carrito actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
// PUT api/carts/:cid/products/:pid: Actualizar la cantidad de un producto en el carrito

router.put('/:cid/products/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const newQuantity = parseInt(req.body.quantity);

  const cartIndex = carrito.Carritos.findIndex(c => c.ID === cartId);

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const cart = carrito.Carritos[cartIndex];

  const productIndex = cart.Products.findIndex(p => p.product === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
  }

  cart.Products[productIndex].quantity = newQuantity;

  return res.json({ message: 'Cantidad del producto actualizada correctamente' });
});

  
// DELETE api/carts/:cid: Eliminar todos los productos del carrito
router.delete('/:cid', authorizationMiddleware('user'), (req, res) => {
  const cartId = parseInt(req.params.cid);

  const cartIndex = carrito.Carritos.findIndex(c => c.ID === cartId);

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const cart = carrito.Carritos[cartIndex];

  cart.Products = [];

  return res.json({ message: 'Todos los productos fueron eliminados del carrito' });
});

  
// GET api/carts/:cid: Obtener el carrito con productos completos
router.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = carrito.obtenerCarritoPorId(cartId); // Usa el método correspondiente en tu clase Carrito

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



//Ruta para generar el ticket
router.post('/api/tickets/:cid/purchase', async (req, res) => {
    console.log('Entró a la ruta de generación de tickets');
    const carritoID = parseInt(req.params.cid);

    // Obtén el carrito por ID
    const carritoEncontrado = carrito.Carritos.find((c) => c.ID === carritoID);
    console.log('Carrito encontrado:', carritoEncontrado);
    if (!carritoEncontrado) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Validar el stock y generar ticket
    const productosNoProcesados = [];
    for (const producto of carritoEncontrado.Products) {
        const productoEncontrado = productManagerInstance.obtenerProductoPorID(producto.ID);

        if (!productoEncontrado || producto.Cantidad > productoEncontrado.Cantidad) {
            // Producto no encontrado o no hay suficiente stock
            productosNoProcesados.push(producto.ID);
            continue;
        }

        // Restar el stock
        productoEncontrado.Cantidad -= producto.Cantidad;
        await productoEncontrado.save();
    }

    if (productosNoProcesados.length > 0) {
      console.log('Algunos productos no pudieron procesarse completamente', productosNoProcesados);
        return res.status(400).json({ error: 'Algunos productos no pudieron procesarse completamente', productosNoProcesados });
    }

    // Calcular el monto total del carrito
    const totalAmount = carritoEncontrado.Products.reduce((total, producto) => {
        const productoEncontrado = productManagerInstance.obtenerProductoPorID(producto.ID);
        return total + (productoEncontrado ? productoEncontrado.Precio * producto.Cantidad : 0);
    }, 0);

    // Crear el ticket
    const nuevoTicket = new Ticket({
        code: generateUniqueTicketCode(), // Implementa tu lógica para generar códigos únicos
        amount: totalAmount,
        purchaser: req.user.email
    });

    await nuevoTicket.save();
    console.log('Se generó el ticket con éxito');

    // Eliminar el carrito después de la compra
    carrito.Carritos = carrito.Carritos.filter((c) => c.ID !== carritoID);

    res.json({ message: 'Compra realizada con éxito', ticket: nuevoTicket });
});



// Función para generar un código de ticket único (puedes personalizarla según tus necesidades)
function generateUniqueTicketCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}


module.exports = router;