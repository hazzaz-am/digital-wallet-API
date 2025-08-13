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
exports.WalletService = void 0;
const appError_1 = __importDefault(require("../../helpers/appError"));
const user_model_1 = require("../user/user.model");
const wallet_interface_1 = require("./wallet.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_model_1 = require("./wallet.model");
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const user_interface_1 = require("../user/user.interface");
const createWallet = (walletData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(walletData.userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted, cannot create wallet");
    }
    if (walletData.userId !== payload.userId) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized access");
    }
    const newWallet = yield wallet_model_1.WalletModel.create({
        userId: user._id,
        type: user.role,
    });
    return newWallet;
});
const topUpWallet = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { walletId, amount } = payload;
    const user = yield user_model_1.UserModel.findById(decodedToken.userId);
    if ((user === null || user === void 0 ? void 0 : user.role) === user_interface_1.Role.AGENT) {
        if (((_a = user.agentData) === null || _a === void 0 ? void 0 : _a.approvalStatus) !== "APPROVED") {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Agent is not approved to top up wallet");
        }
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const wallet = yield wallet_model_1.WalletModel.findById(walletId).session(session);
        if (!wallet) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
        }
        if (wallet.status === wallet_interface_1.IWalletStatus.BLOCKED) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is blocked");
        }
        if (wallet.userId.toString() !== decodedToken.userId) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthorized access");
        }
        wallet.balance += Number(amount);
        yield wallet.save();
        yield transaction_model_1.TransactionModel.create([
            {
                type: transaction_interface_1.ITransactionType.TOP_UP,
                amount,
                initiatedBy: wallet.userId,
                initiatedByRole: wallet.type,
            },
        ], {
            session,
        });
        yield session.commitTransaction();
        return wallet;
    }
    catch (error) {
        yield session.abortTransaction();
        if (error instanceof appError_1.default) {
            throw error;
        }
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw error;
        }
    }
    finally {
        session.endSession();
    }
});
const sendMoney = (sender, phone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.UserModel.findOne({ phone });
    const senderData = yield user_model_1.UserModel.findById(sender.userId);
    if ((senderData === null || senderData === void 0 ? void 0 : senderData.role) === user_interface_1.Role.AGENT) {
        if (((_a = senderData.agentData) === null || _a === void 0 ? void 0 : _a.approvalStatus) !== "APPROVED") {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Agent is not approved to send money");
        }
    }
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Account does not exist for this phone number");
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Account is deleted");
    }
    if (user.role === user_interface_1.Role.AGENT) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "User cannot send money to agents");
    }
    if (sender.userId === user._id.toString()) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You cannot send money to yourself");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const senderWallet = yield wallet_model_1.WalletModel.findOne({
            userId: sender.userId,
        }).session(session);
        if (!senderWallet) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender wallet not found");
        }
        if (senderWallet.status === wallet_interface_1.IWalletStatus.BLOCKED) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sender wallet is blocked");
        }
        if (senderWallet.balance < Number(amount)) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance in sender wallet");
        }
        const recipientWallet = yield wallet_model_1.WalletModel.findOne({
            userId: user._id,
        }).session(session);
        if (!recipientWallet) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Recipient wallet not found");
        }
        if (recipientWallet.status === wallet_interface_1.IWalletStatus.BLOCKED) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Recipient wallet is blocked");
        }
        senderWallet.balance -= Number(amount);
        recipientWallet.balance += Number(amount);
        yield senderWallet.save({ session });
        yield recipientWallet.save({ session });
        yield transaction_model_1.TransactionModel.create([
            {
                type: transaction_interface_1.ITransactionType.SEND_MONEY,
                amount,
                initiatedBy: sender.userId,
                initiatedByRole: sender.role,
                receiverId: user._id,
                receiverRole: user.role,
                fromWalletId: senderWallet._id,
                toWalletId: recipientWallet._id,
            },
        ], { session });
        yield session.commitTransaction();
        return null;
    }
    catch (error) {
        yield session.abortTransaction();
        if (error instanceof appError_1.default) {
            throw error;
        }
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw error;
        }
    }
    finally {
        session.endSession();
    }
});
const cashIn = (agent, phone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const recipient = yield user_model_1.UserModel.findOne({ phone });
    const agentPayload = yield user_model_1.UserModel.findById(agent.userId);
    if (((_a = agentPayload === null || agentPayload === void 0 ? void 0 : agentPayload.agentData) === null || _a === void 0 ? void 0 : _a.approvalStatus) !== "APPROVED") {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Agent is not approved to cash in");
    }
    if (!recipient) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Recipient account not found");
    }
    if (recipient.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Recipient account is deleted");
    }
    if (agent.userId === recipient._id.toString()) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You cannot cash in to yourself");
    }
    if (agent.role !== user_interface_1.Role.AGENT) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Only agents can cash in");
    }
    if (recipient.role !== user_interface_1.Role.USER) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Only users can cash in");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const agentWallet = yield wallet_model_1.WalletModel.findOne({
            userId: agent.userId,
        }).session(session);
        if (!agentWallet) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent wallet not found");
        }
        if (agentWallet.status === wallet_interface_1.IWalletStatus.BLOCKED) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent wallet is blocked");
        }
        if (agentWallet.balance < Number(amount)) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance in agent wallet");
        }
        const recipientWallet = yield wallet_model_1.WalletModel.findOne({
            userId: recipient._id,
        }).session(session);
        if (!recipientWallet) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Recipient wallet not found");
        }
        if (recipientWallet.status === wallet_interface_1.IWalletStatus.BLOCKED) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Recipient wallet is blocked");
        }
        agentWallet.balance -= Number(amount);
        recipientWallet.balance += Number(amount);
        yield agentWallet.save({ session });
        yield recipientWallet.save({ session });
        yield transaction_model_1.TransactionModel.create([
            {
                type: transaction_interface_1.ITransactionType.CASH_IN,
                amount,
                initiatedBy: agent.userId,
                initiatedByRole: agent.role,
                receiverId: recipient._id,
                receiverRole: recipient.role,
                fromWalletId: agentWallet._id,
                toWalletId: recipientWallet._id,
            },
        ], { session });
        yield session.commitTransaction();
        return null;
    }
    catch (error) {
        yield session.abortTransaction();
        if (error instanceof appError_1.default) {
            throw error;
        }
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw error;
        }
    }
    finally {
        session.endSession();
    }
});
const cashOut = (user, phone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const agent = yield user_model_1.UserModel.findOne({ phone });
    if (!agent) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "agent account not found");
    }
    if (((_a = agent.agentData) === null || _a === void 0 ? void 0 : _a.approvalStatus) !== "APPROVED") {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Agent is not approved to cash out");
    }
    if (agent.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "agent account is deleted");
    }
    if (user.userId === agent._id.toString()) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You cannot cash out to yourself");
    }
    if (user.role !== user_interface_1.Role.USER) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Only users can cash out");
    }
    if (agent.role !== user_interface_1.Role.AGENT) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "User cannot cash out to another user");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userWallet = yield wallet_model_1.WalletModel.findOne({
            userId: user.userId,
        }).session(session);
        if (!userWallet) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet not found");
        }
        if (userWallet.status === wallet_interface_1.IWalletStatus.BLOCKED) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User wallet is blocked");
        }
        if (userWallet.balance < Number(amount)) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance in user wallet");
        }
        const agentWallet = yield wallet_model_1.WalletModel.findOne({
            userId: agent._id,
        }).session(session);
        if (!agentWallet) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent wallet not found");
        }
        if (agentWallet.status === wallet_interface_1.IWalletStatus.BLOCKED) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Agent wallet is blocked");
        }
        userWallet.balance -= Number(amount);
        agentWallet.balance += Number(amount);
        yield userWallet.save({ session });
        yield agentWallet.save({ session });
        yield transaction_model_1.TransactionModel.create([
            {
                type: transaction_interface_1.ITransactionType.CASH_OUT,
                amount,
                initiatedBy: user.userId,
                initiatedByRole: user.role,
                receiverId: agent._id,
                receiverRole: agent.role,
                fromWalletId: userWallet._id,
                toWalletId: agentWallet._id,
            },
        ], { session });
        yield session.commitTransaction();
        return null;
    }
    catch (error) {
        yield session.abortTransaction();
        if (error instanceof appError_1.default) {
            throw error;
        }
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw error;
        }
    }
    finally {
        session.endSession();
    }
});
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_model_1.WalletModel.find();
    const totalWallets = yield wallet_model_1.WalletModel.countDocuments();
    return {
        data: wallets,
        meta: {
            total: totalWallets,
        },
    };
});
const getMyWallet = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.WalletModel.findOne({
        userId: user.userId,
    });
    if (!wallet) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    return wallet;
});
exports.WalletService = {
    createWallet,
    topUpWallet,
    cashOut,
    sendMoney,
    cashIn,
    getAllWallets,
    getMyWallet,
};
