"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const localEnvVariables = () => {
    const requiredEnvVariables = [
        "PORT",
        "MONGODB_URI",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "JWT_ACCESS_SECRET_TOKEN",
        "JWT_ACCESS_EXPIRES_IN",
        "JWT_REFRESH_SECRET_TOKEN",
        "JWT_REFRESH_EXPIRES_IN",
        "EXPRESS_SESSION_SECRET",
        "AGENT_COMMISSION_RATE",
        "SUPER_ADMIN_PHONE",
        "SUPER_ADMIN_PASSWORD",
        "FRONTEND_URL"
    ];
    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Required environment variable "${key}" is missing`);
        }
    });
    return {
        PORT: process.env.PORT,
        MONGODB_URI: process.env.MONGODB_URI,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        JWT_ACCESS_SECRET_TOKEN: process.env.JWT_ACCESS_SECRET_TOKEN,
        JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
        JWT_REFRESH_SECRET_TOKEN: process.env.JWT_REFRESH_SECRET_TOKEN,
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        AGENT_COMMISSION_RATE: process.env.AGENT_COMMISSION_RATE,
        SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        FRONTEND_URL: process.env.FRONTEND_URL
    };
};
exports.envVars = localEnvVariables();
