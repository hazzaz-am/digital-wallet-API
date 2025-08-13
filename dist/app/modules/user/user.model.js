"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    name: { type: String },
    phone: { type: String, required: true, unique: true },
    password: { type: String },
    isDeleted: { type: Boolean, default: false },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        required: true,
    },
    agentData: {
        commissionRate: { type: Number, default: 0 },
        approvalStatus: {
            type: String,
            enum: Object.values(user_interface_1.IApprovalStatus),
            default: user_interface_1.IApprovalStatus.PENDING,
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.UserModel = (0, mongoose_1.model)("UserModel", userSchema);
