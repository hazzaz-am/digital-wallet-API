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
exports.UserController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../helpers/appError"));
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: user,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized access");
    }
    const user = yield user_service_1.UserService.updateUser(req.body, req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User updated successfully",
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getUserById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserService.getUserById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User retrieved successfully",
        data: user,
    });
}));
exports.UserController = {
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
};
