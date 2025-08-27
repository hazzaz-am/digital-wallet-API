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
exports.TransactionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../helpers/appError"));
const transaction_service_1 = require("./transaction.service");
const transaction_model_1 = require("./transaction.model");
const user_interface_1 = require("../user/user.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const getAllTransactions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.getAllTransactions(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Transactions retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getTransactionStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let userId = user.userId;
    if (user.role === user_interface_1.Role.ADMIN) {
        userId = null;
    }
    // If not admin → convert to ObjectId
    const baseMatch = userId
        ? {
            $or: [
                { initiatedBy: new mongoose_1.default.Types.ObjectId(userId) },
                { receiverId: new mongoose_1.default.Types.ObjectId(userId) },
            ],
        }
        : {};
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    const stats = yield transaction_model_1.TransactionModel.aggregate([
        { $match: baseMatch },
        {
            $facet: {
                overall: [
                    {
                        $group: {
                            _id: null,
                            totalTransactions: { $sum: 1 },
                            totalAmount: { $sum: "$amount" },
                        },
                    },
                ],
                monthlyTypes: [
                    {
                        $match: Object.assign(Object.assign({}, baseMatch), { createdAt: { $gte: monthStart, $lte: monthEnd } }),
                    },
                    {
                        $group: {
                            _id: "$type",
                            count: { $sum: 1 },
                            totalAmount: { $sum: "$amount" },
                        },
                    },
                ],
                yearly: [
                    {
                        $match: Object.assign(Object.assign({}, baseMatch), { createdAt: { $gte: yearStart, $lte: yearEnd } }),
                    },
                    {
                        $group: {
                            _id: { $month: "$createdAt" },
                            count: { $sum: 1 },
                            totalAmount: { $sum: "$amount" },
                        },
                    },
                    { $sort: { _id: 1 } },
                ],
            },
        },
    ]);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Transaction stats retrieved successfully",
        data: stats[0],
    });
}));
const getMyTransactions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.getMyTransactions(req.user, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Transactions retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleTransaction = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const transactionId = req.params.id;
    const result = yield transaction_service_1.TransactionService.getSingleTransaction(req.user, transactionId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Transaction retrieved successfully",
        data: result,
    });
}));
exports.TransactionController = {
    getAllTransactions,
    getMyTransactions,
    getSingleTransaction,
    getTransactionStats,
};
