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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const appError_1 = __importDefault(require("../../helpers/appError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, password } = payload, rest = __rest(payload, ["phone", "password"]);
    const isPhoneExist = yield user_model_1.UserModel.findOne({ phone: phone });
    if (isPhoneExist) {
        throw new appError_1.default(http_status_codes_1.default.CONFLICT, "Account already exists with this phone number");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const user = yield user_model_1.UserModel.create(Object.assign({ phone, password: hashPassword }, rest));
    const updatedUser = user.toObject();
    if (updatedUser.role === user_interface_1.Role.AGENT && updatedUser.agentData) {
        updatedUser.agentData.commissionRate = 0.2;
    }
    delete updatedUser["password"];
    return updatedUser;
});
const updateUser = (payload, userId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted, cannot update");
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.agentData) {
        if (decodedToken.role === user_interface_1.Role.AGENT || decodedToken.role === user_interface_1.Role.USER) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized access to agent data");
        }
    }
    const updatedUser = yield user_model_1.UserModel.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    let result;
    if (updatedUser) {
        result = updatedUser.toObject();
        delete result["password"];
    }
    return result;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.UserModel.find();
    const totalUsers = yield user_model_1.UserModel.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
});
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const result = user.toObject();
    delete result["password"];
    return result;
});
exports.UserService = {
    createUser,
    updateUser,
    getUserById,
    getAllUsers,
};
