import { cartModel } from "../models/cart.model.js";
import mongoose from "mongoose";

class CartManager {
    async newCart() {
        let cart = await cartModel.create({ products: [] });
        console.log("Cart created:", cart);
        return {
            status: "ok",
            message: "El Carrito se creó correctamente!",
            id: cart._id,
        };
    }

    async getCart(id) {
        try {
            return await cartModel.findOne({ _id: id }) || null;
        } catch (error) {
            console.log("Not found!");

            return null;
        }
    }

    async getCarts() {
        return await cartModel.find().lean();
    }

    async addProduct(cid, pid) {
        try {
            if (await cartModel.exists({ _id: cid, products: { $elemMatch: { product: pid } } })) {
                await cartModel.updateOne({ _id: cid, products: { $elemMatch: { product: pid } } }, { $inc: { "products.$.quantity": 1 } }, { new: true, upsert: true });
            } else {
                await cartModel.updateOne({ _id: cid }, { $push: { products: { "product": pid, "quantity": 1 } } }, { new: true, upsert: true });
            }

            console.log("Product added!");

            return true;
        } catch (error) {
            console.log("Not found!");

            return false;
        }
    }

    async updateProducts(cid, products) {
        try {
            await cartModel.updateOne({ _id: cid }, { products: products }, { new: true, upsert: true });
            console.log("Product updated!");

            return true;
        } catch (error) {
            console.log("Not found!");

            return false;
        }
    }

    async updateQuantityProductFromCart(cid, pid, quantity) {
        try {
            if (this.validateId(cid)) {
                const cart = await this.getCart(cid);
                if (!cart) {
                    console.log("Cart not found!");
                    return false;
                }

                console.log('PID:', pid);
                console.log('Cart products:', cart.products.map(item => item.product._id ? item.product._id.toString() : item.product.toString()));

                const product = cart.products.find((item) =>
                    (item.product._id ? item.product._id.toString() : item.product.toString()) === pid.toString()
                );

                if (product) {
                    product.quantity = quantity;

                    await cartModel.updateOne({ _id: cid }, { products: cart.products });
                    console.log("Product updated!");

                    return true;
                } else {
                    console.log("Product not found in cart");
                    return false;
                }
            } else {
                console.log("Invalid cart ID!");
                return false;
            }
        } catch (error) {
            console.error("Error while updating product:", error);
            return false;
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            if (mongoose.Types.ObjectId.isValid(cid)) {
                const updateResult = await cartModel.updateOne(
                    { _id: cid },
                    { $pull: { products: { product: pid } } }
                );

                if (updateResult.matchedCount > 0) {
                    console.log("Product deleted!");
                    return true;
                }
            } else {
                console.log("Invalid cart ID!");
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async deleteProductsFromCart(cid) {
        try {
            if (this.validateId(cid)) {
                const cart = await this.getCart(cid);

                await cartModel.updateOne({ _id: cid }, { products: [] });
                console.log("Products deleted!");

                return true;
            } else {
                console.log("Not found!");

                return false;
            }
        } catch (error) {
            return false;
        }
    }

    validateId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }
}

export default CartManager;