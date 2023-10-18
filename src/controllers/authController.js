import AuthService from "../services/authServices.js";

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async login(req, res) {
        const { email, password } = req.body;
        const userData = await this.authService.login(email, password);
        console.log("User data retrieved:", userData);

        if (!userData || !userData.user) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        req.session.user = {
            id: userData.user._id,
            email: userData.user.email,
            first_name: userData.user.first_name,
            last_name: userData.user.last_name,
            role: userData.user.role,
        };

        res.cookie('coderCookieToken', userData.token, { httpOnly: true, secure: false });

        console.log('Role retrieved:', userData.user.role);

        return res.status(200).json({ status: "success", user: userData.user, redirect: "/products" });
    }

    async githubCallback(req, res) {
        console.log("Inside AuthController githubCallback");
        try {
            if (req.user) {
                req.session.user = req.user;
                req.session.loggedIn = true;
                return res.redirect("/products");
            } else {
                return res.redirect("/login");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            return res.redirect("/login");
        }
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.redirect("/profile");
            }
            return res.redirect("/login");
        });
    }
}

export default AuthController;
