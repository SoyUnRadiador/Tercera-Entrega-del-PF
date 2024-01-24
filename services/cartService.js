// services/cartService.js
const Cart = require('../models/cart');
const Product = require('../models/product');

async function obtenerProductosDelCarrito(cartId) {
  try {
    const cart = await Cart.findById(cartId).populate('products', 'nombre cantidad');
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    return cart.products;
  } catch (error) {
    console.error('Error al obtener productos del carrito:', error);
    throw new Error('Error al obtener productos del carrito');
  }
}

module.exports = { obtenerProductosDelCarrito };
