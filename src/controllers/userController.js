import UserService from "../services/userServices.js";

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async register(req, res) {
        const { first_name, last_name, email, age, password, role } = req.body;
        const response = await this.userService.registerUser({
            first_name,
            last_name,
            email,
            age,
            password,
            role
        });

        return res.status(response.status === "success" ? 200 : 400).json(response);
    }

    async restorePassword(req, res) {
        const { user, pass } = req.query;
        try {
            const passwordRestored = await this.userService.restorePassword(
                user,
                createHash(pass)
            );
            if (passwordRestored) {
                return res.send({
                    status: "OK",
                    message: "La contraseña se ha actualizado correctamente!",
                });
            } else {
                return res.status(401).send({
                    status: "Error",
                    message: "No se pudo actualizar la contraseña!",
                });
            }
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }

    currentUser(req, res) {
        if (req.user) {
            return res.send({ status: "OK", payload: req.user });
        } else {
            return res
                .status(401)
                .send({ status: "Error", message: "No authorized" });
        }
    }
}

export default UserController;
