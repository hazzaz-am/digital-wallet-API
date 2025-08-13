"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModel = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
const user_interface_1 = require("../user/user.interface");
const walletSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "UserModel", required: true },
    type: {
        type: String,
        enum: Object.values(user_interface_1.Role),
    },
    status: {
        type: String,
        enum: wallet_interface_1.IWalletStatus,
        default: wallet_interface_1.IWalletStatus.ACTIVE,
    },
    balance: { type: Number, default: 50 },
    currency: { type: String, default: "BDT" },
}, {
    versionKey: false,
    timestamps: true,
});
exports.WalletModel = (0, mongoose_1.model)("WalletModel", walletSchema);
