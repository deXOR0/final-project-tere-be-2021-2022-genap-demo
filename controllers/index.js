const bcrypt = require("bcrypt");
const moment = require("moment");
const { Op } = require("sequelize");
const User = require("../models").User;

const validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
    );
};

const home = (req, res) => {
    const { loggedIn, fullName } = req.session;
    res.render("home.ejs", {
        loggedIn,
        fullName,
    });
};

const about = (req, res) => {
    const { loggedIn, fullName } = req.session;
    res.render("about.ejs", {
        loggedIn,
        fullName,
    });
};

const profile = async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
        return;
    }
    const { loggedIn, fullName, userId } = req.session;
    const user = await User.findOne({
        attributes: ["FullName", "Email", "DOB", "Gender"],
        where: { UserID: userId },
    });
    if (user) {
        const userData = {
            FullName: user.FullName,
            Email: user.Email,
            DOB: moment(user.DOB).format("DD MMMM YYYY"),
            Gender: user.Gender,
        };
        res.render("profile/profile.ejs", {
            loggedIn,
            fullName,
            userData,
        });
    }
};

const editProfile = async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
        return;
    }
    const { loggedIn, fullName, userId } = req.session;
    const user = await User.findOne({
        attributes: ["FullName", "Email", "DOB", "Gender"],
        where: { UserID: userId },
    });
    if (user) {
        const userData = {
            FullName: user.FullName,
            Email: user.Email,
            DOB: moment(user.DOB).format("YYYY-MM-DD"),
            Gender: user.Gender,
        };
        res.render("profile/edit-profile.ejs", {
            loggedIn,
            fullName,
            userData,
            messages: req.flash("messages"),
        });
    }
};

const editProfileAction = async (req, res) => {
    const { userId } = req.session;
    const { fullName, email, dob, gender } = req.body;

    const user = await User.findOne({ where: { UserID: userId } });

    if (!fullName || !email || !dob || !gender) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Please fill out all required fields!",
        });
        res.redirect("/profile/edit");
        return;
    }

    if (email !== user.Email) {
        const existingUser = await User.findOne({
            where: { email, UserID: { [Op.ne]: userId } },
        });
        if (existingUser) {
            req.flash("messages", {
                type: "alert-danger",
                info: "Email is already taken!",
            });
            res.redirect("/profile/edit");
            return;
        }
    }
    if (!validateEmail(email)) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Invalid email format!",
        });
        res.redirect("/profile/edit");
        return;
    }

    user.set({
        FullName: fullName,
        Email: email,
        DOB: dob,
        Gender: gender,
    });

    await user.save();

    res.redirect("/profile");
};

const createClass = (req, res) => {
    const { loggedIn, fullName } = req.session;
    res.render("class/create-class.ejs", { loggedIn, fullName });
};

const createStudent = (req, res) => {
    const { loggedIn, fullName } = req.session;
    res.render("class/create-student.ejs", { loggedIn, fullName });
};

const editClass = (req, res) => {
    const { loggedIn, fullName } = req.session;
    res.render("class/edit-class.ejs", { loggedIn, fullName });
};

const viewClass = (req, res) => {
    const { loggedIn, fullName } = req.session;
    res.render("class/view-class.ejs", { loggedIn, fullName });
};

const login = (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
    res.render("auth/login.ejs", { messages: req.flash("messages") });
};

const loginAction = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Please fill out all required fields!",
        });
        return;
    }

    const user = await User.findOne({
        where: { email },
    });

    if (!user) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Wrong login credentials!",
        });
        res.redirect("/login");
    } else {
        const isValidPassword = await bcrypt.compare(password, user.Password);
        if (isValidPassword) {
            req.session.loggedIn = true;
            req.session.fullName = user.FullName;
            req.session.userId = user.UserID;
            res.redirect("/");
            return;
        }
        req.flash("messages", {
            type: "alert-danger",
            info: "Wrong login credentials!",
        });
        res.redirect("/login");
    }
};

const register = (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
    res.render("auth/register.ejs", { messages: req.flash("messages") });
};

const registerAction = async (req, res) => {
    const { fullName, email, dob, gender, password, confirmPassword } =
        req.body;
    if (
        !fullName ||
        !email ||
        !dob ||
        !gender ||
        !password ||
        !confirmPassword
    ) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Please fill out all required fields!",
        });
        res.redirect("/register");
        return;
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Email is already taken!",
        });
        res.redirect("/register");
        return;
    } else if (!validateEmail(email)) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Invalid email format!",
        });
        res.redirect("/register");
        return;
    } else if (!validatePassword(password)) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Password must be at least 8 characters, contains uppercase and lowercase, and special character!",
        });
        res.redirect("/register");
        return;
    } else if (password !== confirmPassword) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Password does not match!",
        });
        res.redirect("/register");
        return;
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            FullName: fullName,
            Email: email,
            DOB: dob,
            Gender: gender,
            Password: hashedPassword,
        });
        if (newUser) {
            req.flash("messages", {
                type: "alert-success",
                info: "New User Succesfully Added!",
            });
            res.redirect("/login");
        }
    }
};

const changePassword = (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
        return;
    }
    res.render("auth/change-password.ejs", { messages: req.flash("messages") });
};

const changePasswordAction = async (req, res) => {
    const { userId } = req.session;
    const { oldPassword, password, confirmPassword } = req.body;

    const user = await User.findOne({
        where: { UserID: userId },
    });

    if (!oldPassword || !password || !confirmPassword) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Please fill all required fields!",
        });
        res.redirect("/change-password");
        return;
    }

    const validOldPassword = await bcrypt.compare(oldPassword, user.Password);

    if (!validOldPassword) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Wrong credentials!",
        });
        res.redirect("/change-password");
        return;
    } else if (!validatePassword(password)) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Password must be at least 8 characters, contains uppercase and lowercase, and special character!",
        });
        res.redirect("/change-password");
        return;
    } else if (password !== confirmPassword) {
        req.flash("messages", {
            type: "alert-danger",
            info: "Password does not match!",
        });
        res.redirect("/change-password");
        return;
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.set({
            Password: hashedPassword,
        });
        await user.save();
        res.redirect("/profile");
    }
};

const logoutAction = (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy((err) => {
            console.log(err);
        });
    }
    res.redirect("/");
};

module.exports = {
    home,
    about,
    profile,
    editProfile,
    editProfileAction,
    createClass,
    createStudent,
    editClass,
    viewClass,
    changePassword,
    changePasswordAction,
    login,
    loginAction,
    register,
    registerAction,
    logoutAction,
};
