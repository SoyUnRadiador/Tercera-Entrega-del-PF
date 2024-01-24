const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carts' // Verificar cómo manejar los carritos
    },
    role: {
        type: String,
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

// Función para crear un usuario administrador
const createAdminUser = async () => {
    try {
        // Buscar si ya existe un usuario con el correo de administrador
        const adminUser = await User.findOne({ email: 'adminCoder@coder.com' });

        if (!adminUser) {
            // Si no existe, crear el usuario administrador
            const hashedPassword = await bcrypt.hash('adminCod3r123', 10);

            const newAdminUser = new User({
                first_name: 'Admin',
                last_name: 'Coder',
                email: 'adminCoder@coder.com',
                password: hashedPassword,
                role: 'admin'
            });

            await newAdminUser.save();
            console.log('Usuario administrador creado con éxito');
        } else {
            console.log('El usuario administrador ya existe');
        }
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
    }
};

// Llamamos a la función para crear el usuario administrador al iniciar la aplicación
createAdminUser();

module.exports = User;
