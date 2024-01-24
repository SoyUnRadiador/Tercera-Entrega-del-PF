class Carrito {
    constructor() {
        this.Carritos = [];
        this.UltimoID = 0;
    }

    // Función para crear un nuevo carrito
    crearCarrito(productos) {
        this.UltimoID++;
        const nuevoCarrito = {
            ID: this.UltimoID,
            Products: productos || [],
        };
        this.Carritos.push(nuevoCarrito);
        return nuevoCarrito;
    }

}

module.exports = Carrito;