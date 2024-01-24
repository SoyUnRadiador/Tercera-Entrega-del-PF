const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  cantidad: Number
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
