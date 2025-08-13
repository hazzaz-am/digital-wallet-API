"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const env_1 = require("../config/env");
const handleCastError = (err) => {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log(err);
    }
    return {
        statusCode: 400,
        message: "Please provide a valid id",
    };
};
exports.handleCastError = handleCastError;
