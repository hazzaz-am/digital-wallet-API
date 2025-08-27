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
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const wallet_model_1 = require("../wallet/wallet.model");
const wallet_interface_1 = require("../wallet/wallet.interface");
const transaction_model_1 = require("../transaction/transaction.model");
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
    if (payload.isDeleted === undefined) {
        if (user.isDeleted) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted, cannot update");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.phone) {
        const isPhoneExist = yield user_model_1.UserModel.findOne({ phone: payload.phone });
        if (isPhoneExist) {
            throw new appError_1.default(http_status_codes_1.default.CONFLICT, "Account already exists with this phone number");
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
    if (payload.isDeleted === true) {
        yield wallet_model_1.WalletModel.findOneAndUpdate({ userId: userId }, { status: wallet_interface_1.IWalletStatus.BLOCKED }, { new: true });
    }
    let result;
    if (updatedUser) {
        result = updatedUser.toObject();
        delete result["password"];
    }
    return result;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.UserModel.find(), query);
    const users = yield queryBuilder.filter().sort().paginate().search(["phone", "name", "role"]);
    const [data, meta] = yield Promise.all([
        users.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const isWalletExist = yield wallet_model_1.WalletModel.findOne({ userId: userId });
    if (!isWalletExist && user.role !== user_interface_1.Role.ADMIN) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    const walletAmount = isWalletExist === null || isWalletExist === void 0 ? void 0 : isWalletExist.balance;
    const walletStatus = isWalletExist === null || isWalletExist === void 0 ? void 0 : isWalletExist.status;
    const totalTransactions = yield transaction_model_1.TransactionModel.find({
        $or: [{ initiatedBy: user._id }, { receiverId: user._id }],
    }).countDocuments();
    const totalTransactionAmount = yield transaction_model_1.TransactionModel.aggregate([
        {
            $match: {
                $or: [{ initiatedBy: user._id }, { receiverId: user._id }],
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" },
            },
        },
    ]);
    const result = user.toObject();
    delete result["password"];
    return {
        data: result,
        meta: {
            walletAmount,
            walletStatus,
            totalTransactions,
            totalTransactionAmount: ((_a = totalTransactionAmount[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        },
    };
});
const getMyProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId).select("-password");
    return {
        data: user,
    };
});
exports.UserService = {
    createUser,
    updateUser,
    getUserById,
    getAllUsers,
    getMyProfile,
};
