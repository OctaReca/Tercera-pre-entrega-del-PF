// import { promises as fs } from "fs";
// import { nanoid } from "nanoid";

// class ProductManager {
//     constructor() {
//         this.path = './src/models/productos.json';
//     }

//     readProducts = async () => {
//         let products = await fs.readFile(this.path, 'utf-8');
//         return JSON.parse(products);
//     }

//     writeProducts = async (products) => {
//         await fs.writeFile(this.path, JSON.stringify(products, null, 2))
//     }

//     exist = async (id) => {
//         let products = await this.readProducts();
//         return products.find(prod => prod.id === id)
//     }

//     addProducts = async (product) => {
//         let productsOld = await this.readProducts();
//         if (
//             !product.title ||
//             !product.description ||
//             !product.price ||
//             !product.code ||
//             !product.stock ||
//             !product.category
//         ) {
//             console.log ('Todos los campos son obligatorios');
//             return 'Todos los campos son obligatorios';
//         }
//         // Verificar que el código no se repita
//         let codeExist = productsOld.some(prod => prod.code === product.code);
//         if (codeExist) {
//             console.log ('El codigo ya existe');
//             return 'El codigo ya existe';
//         }
//         const newProduct = {
//             title: product.title,
//             description: product.description,
//             price: product.price,
//             status: true,
//             thumbnail: product.thumbnail,
//             code: product.code,
//             stock: product.stock,
//             category: product.category,
//             id: nanoid(2)
//         };
//         productsOld.push(newProduct);
//         await this.writeProducts(productsOld);
//         console.log ('Producto agregado con éxito');
//         return "Producto agregado con éxito";
//     };

//     getProducts = async () => {
//         return await this.readProducts()
//     };

//     getProductsById = async (id) => {
//         let productById = await this.exist(id);
//         if (!productById) {
//             return "Producto no encontrado";
//         }
//         return productById;
//     };


//     updateProducts = async (id, product) => {
//         let productById = await this.exist(id);
//         if (!productById) return "Producto no encontrado";
//         await this.deleteProducts(id);
//         let productOld = await this.readProducts();
//         let products = [{ ...product, id: id }, ...productOld];
//         await this.writeProducts(products);
//         return "Producto actualizado con éxito";
//     }

//     deleteProducts = async (id) => {
//         let products = await this.readProducts();
//         let existProducts = products.some(prod => prod.id === id)
//         if (existProducts) {
//             let filterProducts = products.filter(prod => prod.id != id)
//             await this.writeProducts(filterProducts);
//             return "Producto eliminado con éxito";
//         }
//         return "Producto no encontrado";
//     }
// }

// export default ProductManager;
