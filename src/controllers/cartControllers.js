import CartService from "../services/cartServices.js";

class CartController {
    constructor() {
        this.cartService = new CartService();
    }

    async createCart(req, res) {
        try {
            const newCart = await this.cartService.createCart();
            res.send(newCart);
        } catch (error) {
            res.status(500).send({
                status: "error",
                message: error.message,
            });
        }
    }

    async getCart(req, res) {
        try {
            const cart = await this.cartService.getCart(req.params.cid);
            res.send({ products: cart.products });
        } catch (error) {
            res.status(400).send({
                status: "error",
                message: error.message,
            });
        }
    }

    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const result = await this.cartService.addProductToCart(cid, pid);
            res.send(result);
        } catch (error) {
            res.status(400).send({
                status: "error",
                message: error.message,
            });
        }
    }

    async updateQuantityProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const result = await this.cartService.updateQuantityProductFromCart(
                cid,
                pid,
                quantity
            );
            res.send(result);
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    async updateCart(req, res) {
        try {
            const cid = req.params.cid;
            const products = req.body.products;
            await this.cartService.updateCart(cid, products);
            res.send({
                status: "ok",
                message: "El producto se agregó correctamente!",
            });
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const result = await this.cartService.deleteProductFromCart(cid, pid);
            res.send(result);
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    }

    async deleteProductsFromCart(req, res) {
        try {
            const cid = req.params.cid;
            const result = await this.cartService.deleteProductsFromCart(cid);
            res.send(result);
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    }
}

export default new CartController();
