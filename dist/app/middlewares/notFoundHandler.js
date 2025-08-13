"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const notFoundHandler = (req, res) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Cannot find ${req.originalUrl} on this server!`,
    });
};
exports.notFoundHandler = notFoundHandler;
