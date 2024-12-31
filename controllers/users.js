const User = require("../models/user");

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "Email is already registered.");
            return res.render("users/signup.ejs", { errorMessage: "Email is already registered." });
        }

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Login error:", err);
                req.flash("error", "Login failed!");
                return res.redirect("/login");
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.render("users/signup.ejs", { errorMessage: e.message });
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    if (!redirectUrl.startsWith("/")) redirectUrl = "/listings"; // Avoid unsafe redirects
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};