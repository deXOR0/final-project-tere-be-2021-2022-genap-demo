const express = require("express");
const router = express.Router();
const {
    home,
    about,
    profile,
    editProfile,
    editProfileAction,
    createClass,
    createClassAction,
    createStudent,
    createStudentAction,
    deleteStudentAction,
    editClass,
    editClassAction,
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

// Class
router.get("/class/create", createClass);
router.post("/class/create", createClassAction);

router.get("/student/:id/create", createStudent);
router.post("/student/:id/create", createStudentAction);
router.post("/student/:id/delete", deleteStudentAction);

router.get("/class/:id/edit", editClass);
router.post("/class/:id/edit", editClassAction);
router.get("/class/:id/view", viewClass);

// Auth
router.get("/login", login);
router.post("/login", loginAction);

router.get("/register", register);
router.post("/register", registerAction);

router.get("/change-password", changePassword);
router.post("/change-password", changePasswordAction);

router.post("/logout", logoutAction);

module.exports = router;
