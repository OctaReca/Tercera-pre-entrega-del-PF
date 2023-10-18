import ProductService from "../services/productService.js";
import { socketServer } from ".././app.js"

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async getProducts(req, res) {
        try {
            const products = await this.productService.getProducts(req.query);
            res.send(products);
        } catch (error) {
            res
                .status(500)
                .send({ status: "error", message: "Error fetching products." });
            console.log(error);
        }
    }

    async getProductById(req, res) {
        try {
            const pid = req.params.pid;
            console.log("Product ID:", pid);
            const product = await this.productService.getProductById(pid);
            if (product) {
                res.json(product);
                return;
            } else {
                res
                    .status(404)
                    .send({ status: "error", message: "Product not found." });
                return;
            }
        } catch (error) {
            console.error("Error fetching product by id:", error);
            res
                .status(500)
                .send({ status: "error", message: "Error fetching product by id." });
            return;
        }
    }

    async addProduct(req, res) {
        let {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        } = req.body;
        console.log("Received thumbnails:", thumbnails);

        if (!title) {
            res.status(400).send({
                status: "error",
                message: "Error! No se cargó el campo Title!",
            });
            return false;
        }

        if (!description) {
            res.status(400).send({
                status: "error",
                message: "Error! No se cargó el campo Description!",
            });
            return false;
        }

        if (!code) {
            res.status(400).send({
                status: "error",
                message: "Error! No se cargó el campo Code!",
            });
            return false;
        }

        if (!price) {
            res.status(400).send({
                status: "error",
                message: "Error! No se cargó el campo Price!",
            });
            return false;
        }

        status = !status && true;

        if (!stock) {
            res.status(400).send({
                status: "error",
                message: "Error! No se cargó el campo Stock!",
            });
            return false;
        }

        if (!category) {
            res.status(400).send({
                status: "error",
                message: "Error! No se cargó el campo Category!",
            });
            return false;
        }

        if (!thumbnails) {
            res.status(400).send({
                status: "error",
                message: "Error! No se cargó el campo Thumbnails!",
            });
            return false;
        }
        try {
            const wasAdded = await this.productService.addProduct({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails,
            });

            if (wasAdded && wasAdded._id) {
                console.log("Producto añadido correctamente:", wasAdded);
                res.send({
                    status: "ok",
                    message: "El Producto se agregó correctamente!",
                });
                socketServer.emit("product_created", {
                    _id: wasAdded._id,
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnails,
                });
                return;
            } else {
                console.log("Error al añadir producto, wasAdded:", wasAdded);
                res.status(500).send({
                    status: "error",
                    message: "Error! No se pudo agregar el Producto!",
                });
                return;
            }
        } catch (error) {
            console.error("Error en addProduct:", error, "Stack:", error.stack);
            res
                .status(500)
                .send({ status: "error", message: "Internal server error." });
            return;
        }
    }

    async updateProduct(req, res) {
        try {
            const {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails,
            } = req.body;
            const pid = req.params.pid;

            const wasUpdated = await this.productService.updateProduct(pid, {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails,
            });

            if (wasUpdated) {
                res.send({
                    status: "ok",
                    message: "El Producto se actualizó correctamente!",
                });
                socketServer.emit("product_updated");
            } else {
                res.status(500).send({
                    status: "error",
                    message: "Error! No se pudo actualizar el Producto!",
                });
            }
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ status: "error", message: "Internal server error." });
        }
    }

    async deleteProduct(req, res) {
        try {
            const pid = req.params.pid;

            const wasDeleted = await this.productService.deleteProduct(pid);

            if (wasDeleted) {
                res.send({
                    status: "ok",
                    message: "El Producto se eliminó correctamente!",
                });
                socketServer.emit("product_deleted", { _id: pid });
            } else {
                res.status(500).send({
                    status: "error",
                    message: "Error! No se pudo eliminar el Producto!",
                });
            }
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ status: "error", message: "Internal server error." });
        }
    }
}
export default new ProductController();
