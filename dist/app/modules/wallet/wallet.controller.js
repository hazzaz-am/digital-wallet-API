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
exports.WalletController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_service_1 = require("./wallet.service");
const appError_1 = __importDefault(require("../../helpers/appError"));
const createWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized access");
    }
    const newWallet = yield wallet_service_1.WalletService.createWallet(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Wallet created successfully",
        data: newWallet,
    });
}));
const topUpWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    if (!decodedToken) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized access");
    }
    const result = yield wallet_service_1.WalletService.topUpWallet(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Wallet topped up successfully",
        data: result,
    });
}));
const sendMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized access");
    }
    const { phone, amount } = req.body;
    const sender = req.user;
    const result = yield wallet_service_1.WalletService.sendMoney(sender, phone, amount);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Money sent successfully",
        data: result,
    });
}));
const cashIn = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized access");
    }
    const { phone, amount } = req.body;
    const agent = req.user;
    const result = yield wallet_service_1.WalletService.cashIn(agent, phone, amount);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Cash in successful",
        data: result,
    });
}));
const cashOut = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized access");
    }
    const { phone, amount } = req.body;
    const user = req.user;
    const result = yield wallet_service_1.WalletService.cashOut(user, phone, amount);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Cash out successful",
        data: result,
    });
}));
const getAllWallets = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wallet_service_1.WalletService.getAllWallets();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All wallets retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getMyWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized access");
    }
    const wallet = yield wallet_service_1.WalletService.getMyWallet(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "My wallet retrieved successfully",
        data: wallet,
    });
}));
exports.WalletController = {
    createWallet,
    topUpWallet,
    sendMoney,
    cashIn,
    cashOut,
    getAllWallets,
    getMyWallet
};
