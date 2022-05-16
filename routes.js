const express = require("express");
const router = express.Router();
const {
    home,
    about,
    profile,
    editProfile,
    editProfileAction,
    createClass,
    createStudent,
    editClass,
    viewClass,
    login,
    loginAction,
    register,
    registerAction,
    changePassword,
    changePasswordAction,
    logoutAction,
} = require("./controllers");

router.get("/", home);
router.get("/about", about);

// Profile
router.get("/profile", profile);
router.get("/profile/edit", editProfile);
router.post("/profile/edit", editProfileAction);

router.get("/class/create", createClass);
router.get("/student/create", createStudent);
router.get("/class/edit", editClass);
router.get("/class/view", viewClass);

// Auth
router.get("/login", login);
router.post("/loginAuth", loginAction);

router.get("/register", register);
router.post("/register", registerAction);

router.get("/change-password", changePassword);
router.post("/change-password", changePasswordAction);

router.post("/logout", logoutAction);

module.exports = router;
