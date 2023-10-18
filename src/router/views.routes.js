import express from 'express';
import ProductManager from '../dao/ProductManager.js';
import CartManager from '../dao/CartManager.js';

const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
};

const checkAlreadyLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        console.log("Usuario ya autenticado, redirigiendo a /productos");
        res.redirect("/products");
    } else {
        console.log("Usuario no autenticado");
        next();
    }
};

const router = express.Router();
const PM = new ProductManager();
const CM = new CartManager

router.get('/', checkSession, async (req, res) => {
    try {
        const products = await PM.getProducts(req.query);
        res.render("home", { products });
    } catch (error) {
        console.error("Error al obtener los productos: ", error);
        res.status(500).send("Error al obtener los productos");
    }
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await PM.getProducts(req.query);
    res.render("realTimeProducts", { products });
});

router.get("/products", checkSession, async (req, res) => {
    const products = await PM.getProducts(req.query);
    const user = req.session.user;
    res.render("products", { products, user });
});

router.get("/products/:pid", async (req, res) => {
    const pid = req.params.pid;
    const product = await PM.getProductById(pid);

    res.render("product", { product });
});

router.get("/cart/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);

    if (cart) {
        res.render("cart", { products: cart.products });
    } else {
        res.status(400).send({ status: "error", message: "Error! No se encuentra el ID de Carrito!" });
    }
});

router.post("/products", checkSession, async (req, res) => {
    const newProduct = await PM.addProducts(req.body);
    if (newProduct) {
        req.app.get("socketServer").emit("product_created", newProduct);
        res.json(newProduct);
    } else {
        res.status(500).send({
            status: "error",
            message: "Error al crear el producto",
        })
    }
});
router.delete("/products/:id", async (req, res) => {
    let id = req.params.id;
    const deletedProduct = await PM.deleteProducts(id);

    if (deletedProduct) {
        req.app.get("socketServer").emit("product_deleted", deletedProduct);
        res.send({
            status: "ok",
            message: "Producto eliminado correctamente",
            deletedProduct: deletedProduct,
        })
    } else {
        res.status(404).send({
            status: "error",
            message: "El producto no existe y no puede ser eliminado",
        });
    }
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

router.get("/login", checkAlreadyLoggedIn, (req, res) => {
    res.render("login");
});

router.get("/register", checkAlreadyLoggedIn, (req, res) => {
    res.render("register");
});

router.get("/profile", checkSession, (req, res) => {
    const userData = req.session.user;
    res.render("profile", { user: userData });
});

router.get("/restore", async (req, res) => {
    res.render("restore")
})

router.get("/faillogin", (req, res) => {
    res.status(401).send({ status: "Error", message: "Usuario y/o contraseña incorrectos" });
});

router.get("/failregister", async (req, res) => {
    res.send({
        status: "Error",
        message: "Error! No se pudo registar el Usuario!",
    });
});

export default router;
