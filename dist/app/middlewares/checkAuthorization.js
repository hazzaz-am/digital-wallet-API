"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorization = void 0;
const appError_1 = __importDefault(require("../helpers/appError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jwtToken_1 = require("../utils/jwtToken");
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const checkAuthorization = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authorized");
        }
        const verifiedUser = (0, jwtToken_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET_TOKEN);
        const user = yield user_model_1.UserModel.findOne({
            phone: verifiedUser.phone,
        });
        if (!user) {
            throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not found");
        }
        if (user.isDeleted) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
        }
        if (!authRoles.includes(verifiedUser.role)) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You do not have permission to access this resource");
        }
        req.user = verifiedUser;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuthorization = checkAuthorization;
