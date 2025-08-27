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
exports.TransactionService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../helpers/appError"));
const user_model_1 = require("../user/user.model");
const transaction_model_1 = require("./transaction.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const getAllTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(transaction_model_1.TransactionModel.find(), query);
    const transactions = yield queryBuilder
        .filter()
        .sort()
        .paginate()
        .search(["receiverRole", "initiatedByRole"]);
    const [data, meta] = yield Promise.all([
        transactions.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getMyTransactions = (payload, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(payload.userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User is deleted");
    }
    const queryBuilder = new QueryBuilder_1.QueryBuilder(transaction_model_1.TransactionModel.find({
        $or: [{ initiatedBy: user._id }, { receiverId: user._id }],
    }), query);
    const transactions = yield queryBuilder
        .filter()
        .sort()
        .paginate()
        .search(["receiverRole", "initiatedByRole"]);
    const [data, meta] = yield Promise.all([
        transactions.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleTransaction = (payload, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(payload.userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User is deleted");
    }
    const transaction = yield transaction_model_1.TransactionModel.findOne({
        _id: transactionId,
    });
    if (!transaction) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Transaction not found");
    }
    return transaction;
});
exports.TransactionService = {
    getAllTransactions,
    getMyTransactions,
    getSingleTransaction,
};
