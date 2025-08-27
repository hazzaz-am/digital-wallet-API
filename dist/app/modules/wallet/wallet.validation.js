"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashOutZodSchema = exports.cashInZodSchema = exports.sendMoneyZodSchema = exports.topUpWalletZodSchema = exports.updateWalletZodSchema = exports.createWalletZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const wallet_interface_1 = require("./wallet.interface");
exports.createWalletZodSchema = zod_1.default.object({
    userId: zod_1.default.string({
        error: "User ID must be a string",
    }),
    balance: zod_1.default.number().optional(),
});
exports.updateWalletZodSchema = zod_1.default.object({
    status: zod_1.default
        .enum(wallet_interface_1.IWalletStatus, {
        error: "Wallet must be a valid status",
    })
        .optional(),
});
exports.topUpWalletZodSchema = zod_1.default.object({
    walletId: zod_1.default.string({
        error: "Wallet ID must be a string",
    }),
    amount: zod_1.default
        .number({
        error: "Amount must be a number",
    })
        .min(50, "Amount must be at least 50 BDT"),
});
exports.sendMoneyZodSchema = zod_1.default.object({
    phone: zod_1.default
        .string({ error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        error: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    amount: zod_1.default.number().positive("Amount must be greater than zero"),
});
exports.cashInZodSchema = zod_1.default.object({
    phone: zod_1.default
        .string({ error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        error: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    amount: zod_1.default.number().positive("Amount must be greater than zero"),
});
exports.cashOutZodSchema = zod_1.default.object({
    phone: zod_1.default
        .string({ error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        error: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    amount: zod_1.default.number().positive("Amount must be greater than zero"),
});
