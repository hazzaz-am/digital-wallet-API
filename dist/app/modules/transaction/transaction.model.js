"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const user_interface_1 = require("../user/user.interface");
const transactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Object.values(transaction_interface_1.ITransactionType),
        required: true,
    },
    initiatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    initiatedByRole: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        required: true,
    },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "UserModel" },
    receiverRole: { type: String, enum: Object.values(user_interface_1.Role) },
    fromWalletId: { type: mongoose_1.Schema.Types.ObjectId, ref: "WalletModel" },
    toWalletId: { type: mongoose_1.Schema.Types.ObjectId, ref: "WalletModel" },
    amount: { type: Number, required: true },
}, {
    versionKey: false,
    timestamps: true,
});
exports.TransactionModel = (0, mongoose_1.model)("TransactionModel", transactionSchema);
