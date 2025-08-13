"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const express_session_1 = __importDefault(require("express-session"));
const env_1 = require("./app/config/env");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const passport_1 = __importDefault(require("passport"));
const notFoundHandler_1 = require("./app/middlewares/notFoundHandler");
require("./app/config/passport");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1", routes_1.router);
app.get("/", (_req, res) => {
    res.status(200).json({
        message: "Server health is OK",
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFoundHandler_1.notFoundHandler);
exports.default = app;
