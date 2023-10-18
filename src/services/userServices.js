import UserManager from "../dao/UserManager.js";
import { ADMIN_PASSWORD, ADMIN_EMAIL } from "../config/config.js";

class UserService {
    constructor() {
        this.userManager = new UserManager();
    }

    async registerUser({ first_name, last_name, email, age, password, role }) {
        try {
            const role =
                email == process.env.ADMIN_EMAIL &&
                    password === process.env.ADMIN_PASSWORD
                    ? "admin"
                    : "user";
            const user = await this.userManager.addUser({
                first_name,
                last_name,
                email,
                age,
                password,
                role,
            });

            if (user) {
                return { status: "success", user, redirect: "/login" };
            } else {
                return { status: "error", message: "User already exists" };
            }
        } catch (error) {
            console.error("Error registering user:", error);
            return { status: "error", message: "Internal Server Error" };
        }
    }

    async restorePassword(user, hashedPassword) {
        return await this.userManager.restorePassword(user, hashedPassword);
    }
}

export default UserService;
