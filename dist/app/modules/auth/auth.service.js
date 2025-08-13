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
exports.AuthService = void 0;
const user_model_1 = require("../user/user.model");
const appError_1 = __importDefault(require("../../helpers/appError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const userTokens_1 = require("../../utils/userTokens");
const resetPassword = (decodedToken, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(decodedToken.userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const isPassMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isPassMatch) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old password is incorrect");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    yield user.save();
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, userTokens_1.createAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: token,
    };
});
exports.AuthService = {
    resetPassword,
    getNewAccessToken
};
