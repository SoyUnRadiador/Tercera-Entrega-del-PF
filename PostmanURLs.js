/*
Obtener Productos con parametros (GET)

http://localhost:8080/api/products?limit=5&page=1&query=Titulo&sort=asc

--------------------------------------------
Agregar Producto (POST)
http://localhost:8080/api/products
EJ en JSON:
{
  "Titulo": "Zapatilla",
  "Descripcion": "Zapatilla Marca Nike",
  "Precio": 10000,
  "Miniatura": "Imagen.jpg",
  "Codigo": "11",
  "Cantidad": 10
}

--------------------------------------------

Editar Producto (POST)
http://localhost:8080/api/products/1
EJ en JSON:
{
  "Titulo": "Nuevo título",
  "Descripcion": "Nueva descripción",
  "Precio": 99.99,
  "Miniatura": "nueva-imagen.jpg",
  "Codigo": "11", // El mismo ID del producto
  "Cantidad": 50
}

--------------------------------------------

Eliminar Producto (DELETE)
http://localhost:8080/api/products/1

--------------------------------------------

Crear un carrito (POST)
http://localhost:8080/api/carts

--------------------------------------------

Mostrar productos de un carrito (GET)
http://localhost:8080/api/carts/1

--------------------------------------------

Agregar productos a un carrito (POST)
http://localhost:8080/api/carts/1/product/3

--------------------------------------------

Eliminar un producto del carrito (DELETE)
http://localhost:8080/api/carts/1/products/1


*/