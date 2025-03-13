const app = require("../src/app/app");
require("dotenv").config();
module.exports = {
    app:require("./app"),
    db:require("./db"),
    mail:require("./mail"),
};
