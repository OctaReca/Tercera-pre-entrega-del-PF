const crearCarrito = async () => {
    try {
        if (localStorage.getItem("carrito")) {
            return JSON.parse(localStorage.getItem("carrito"));
        } else {
            const response = await fetch("/api/cart/", {
                method: "POST",
                headers: {"Content-type": "application/json; charset=UTF-8"}
            });
            const data = await response.json();
            localStorage.setItem("carrito", JSON.stringify({ id: data.id }));
    
            return { id: data.id};
        }
    } catch(error) {
        console.log("Error en Crear el Carrito! " + error);
    }
}

const obtenerIdCarrito = async () => {
    try {
        let cart = await crearCarrito();
        return cart.id;
    } catch(error) {
        console.log("Error en obtener el Id del Carrito! " + error);
    }
}

const agregarProductoAlCarrito = async (pid) => {
    try {
        let cid = await obtenerIdCarrito();
    
        const response = await fetch("/api/cart/" + cid + "/products/" + pid, {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })

        const data = await response.json()
        if (response.ok) {
            console.log("Se agregó al carrito!");
        } else {
            console.log("Error al agregar el producto al carrito! Status:",
            response.status,
            data);
        }
    } catch(error) {
        console.log("Error en agregar el Producto al Carrito! " + error);
    }
}