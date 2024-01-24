class ProductManager {
    constructor() {
      this.Productos = [];
      this.UltimoID = 0;
      this.CodigosGuardados = new Set();
}

//Eliminar productos por ID
eliminarProducto(ID) {
  const productoIndex = this.Productos.findIndex((producto) => producto.ID === ID);

  if (productoIndex !== -1) {
    const productoEliminado = this.Productos.splice(productoIndex, 1);
    this.CodigosGuardados.delete(productoEliminado[0].Codigo);
    return productoEliminado[0];
  } else {
    return null;
  }
}

// Verifica que el código no se repita
agregarProducto(Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad) {
  if (this.CodigosGuardados.has(Codigo)) {
    console.error(`El código ${Codigo} ya está en uso.`);
    return;
}
  
      // Aumenta en 1 el ID
      const ID = this.UltimoID + 1;
      this.UltimoID = ID;
  
      const producto = new AgregarProductos(
        ID,
        Titulo,
        Descripcion,
        Precio,
        Miniatura,
        Codigo,
        Cantidad
      );
  
      // Inserta los productos y el código en ProductManager
      this.Productos.push(producto);
      this.CodigosGuardados.add(Codigo);
    }
  
    // Devuelve los productos
    ObtenerProductos() {
      return this.Productos;
    }
  
    // Devuelve un producto por ID
    obtenerProductoPorID(ID) {
      return this.Productos.find((producto) => producto.ID === ID);
    }
  }
  
class AgregarProductos {
    constructor(ID, Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad) {
      this.ID = ID;
      this.Titulo = Titulo;
      this.Descripcion = Descripcion;
      this.Precio = Precio;
      this.Miniatura = Miniatura;
      this.Codigo = Codigo;
      this.Cantidad = Cantidad;
    }
  }
  
  // Uso del código
  const productManagerInstance = new ProductManager();
  
  // Utiliza agregarProducto para insertar características del producto
  productManagerInstance.agregarProducto("zapatilla", "Zapatilla Marca Nike", 10000, "Imagen.jpg", "1", 10);
  productManagerInstance.agregarProducto("pantalon", "Pantalon Marca Levi`s", 3000, "Imagen.jpg", "2", 20);
  productManagerInstance.agregarProducto("remera", "Remera Marca Vans", 4000, "Imagen.jpg", "3", 15);
  productManagerInstance.agregarProducto("camisa", "Camisa Marca Lacoste", 10000, "Imagen.jpg", "4", 10);
  productManagerInstance.agregarProducto("zapatillas", "Zapatillas Marca Fila", 20000, "Imagen.jpg", "5", 20);
  productManagerInstance.agregarProducto("remera", "Remera Marca Cucci", 15000, "Imagen.jpg", "6", 5);
  productManagerInstance.agregarProducto("pantalon", "Pantalon Marca Furor", 13000, "Imagen.jpg", "7", 15);
  productManagerInstance.agregarProducto("corbata", "Corbata Marca Hermès", 10000, "Imagen.jpg", "8", 8);
  productManagerInstance.agregarProducto("vestido", "Vestido Marca Ted Baker", 30000, "Imagen.jpg", "9", 6);
  productManagerInstance.agregarProducto("falda", "Falda Marca GANNI", 9000, "Imagen.jpg", "10", 7);



module.exports = productManagerInstance;



//module.exports = peticion;


/*
  // Muestra la lista de productos completa
  console.log("Lista de Productos:");
  console.log(peticion.ObtenerProductos());
  
  // Buscar producto por ID, si no existe, devuelve "Producto no encontrado."
  const productoPorID = peticion.obtenerProductoPorID();
  if (productoPorID) {
    console.log(`Producto con ID ${productoPorID.ID}:`);
    console.log(productoPorID);
  } else {
    console.log("Producto no encontrado");
  }  
*/