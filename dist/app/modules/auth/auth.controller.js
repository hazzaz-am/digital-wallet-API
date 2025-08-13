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
exports.AuthController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const appError_1 = __importDefault(require("../../helpers/appError"));
const passport_1 = __importDefault(require("passport"));
const userTokens_1 = require("../../utils/userTokens");
const setCookie_1 = require("../../utils/setCookie");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_service_1 = require("./auth.service");
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const passportAuthenticateHandler = (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new appError_1.default(401, "Authentication failed"));
        }
        if (!user) {
            return next(new appError_1.default(401, info.message));
        }
        const userTokens = (0, userTokens_1.createUserTokens)(user);
        const updatedUser = user.toObject();
        delete updatedUser["password"];
        (0, setCookie_1.setCookie)(res, userTokens);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.OK,
            message: "Log in successful",
            success: true,
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: updatedUser,
            },
        });
    });
    passport_1.default.authenticate("local", passportAuthenticateHandler)(req, res, next);
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    if (!decodedToken) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const { oldPassword, newPassword } = req.body;
    yield auth_service_1.AuthService.resetPassword(decodedToken, oldPassword, newPassword);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Password reset successful",
        success: true,
        data: null,
    });
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Authorization denied");
    }
    const tokenInfo = yield auth_service_1.AuthService.getNewAccessToken(refreshToken);
    (0, setCookie_1.setCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Login successfully",
        success: true,
        data: tokenInfo,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Logout successful",
        success: true,
        data: null,
    });
}));
exports.AuthController = {
    credentialsLogin,
    logout,
    resetPassword,
    getNewAccessToken
};
