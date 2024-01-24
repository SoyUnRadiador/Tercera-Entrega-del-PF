const mongoose = require('mongoose');
const config = require('./config')

async function connectToDatabase() {
  try {
    //MongoDB_URI ya no esta expuesta en el codigo
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('Error de conexión a MongoDB Atlas:', error);
  }
}

module.exports = connectToDatabase;