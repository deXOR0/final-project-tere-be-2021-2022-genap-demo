const express = require("express");
const routes = require("./routes");
const { Sequelize } = require("sequelize"); // Import sequelize
const session = require("express-session");
const flash = require("connect-flash");
const app = express();

const PORT = 8000;

// Connect to SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "class-management.db",
});

// Authenticate / Connect to DB
sequelize
    .authenticate()
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(`DB Connection Error - ${err}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "sdadasddsadsadzxcz asdad a23o- ",
    })
);
app.use(flash());
app.set("view-engine", "ejs");

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});
