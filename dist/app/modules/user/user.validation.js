"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    role: zod_1.default.enum(user_interface_1.Role, {
        error: "Role must be one of the following: USER, ADMIN, AGENT",
    }),
    phone: zod_1.default
        .string({ error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        error: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    password: zod_1.default
        .string({
        error: "Password must be string",
    })
        .min(8, {
        error: "Password must be at least 8 characters long.",
    })
        .regex(/^(?=.*[A-Z])/, {
        error: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        error: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        error: "Password must contain at least 1 number.",
    }),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { error: "Name must be at least 2 characters long." })
        .max(50, { error: "Name cannot exceed 50 characters." })
        .optional(),
    password: zod_1.default
        .string({ error: "Password must be string" })
        .min(8, { error: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        error: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        error: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        error: "Password must contain at least 1 number.",
    })
        .optional(),
    isDeleted: zod_1.default.boolean({ error: "isDeleted must be true or false" }).optional(),
    role: zod_1.default
        .enum(user_interface_1.Role, {
        error: "Role must be one of the following: USER, ADMIN, AGENT",
    })
        .optional(),
    agentData: zod_1.default
        .object({
        commissionRate: zod_1.default
            .number({ error: "Commission rate must be a number" })
            .min(0, { error: "Commission rate cannot be negative" })
            .optional(),
        approvalStatus: zod_1.default
            .enum(Object.values(user_interface_1.IApprovalStatus), {
            error: "Approval status must be one of PENDING, APPROVED, REJECTED",
        })
            .optional(),
    })
        .optional(),
});
