import z from "zod";
import { IApprovalStatus, Role } from "./user.interface";

export const createUserZodSchema = z.object({
	name: z
		.string({
			error: "Name must be a string",
		})
		.min(2, { error: "Name is required" })
		.max(100, { error: "Name must be less than 100 characters" }),
	phone: z
		.string({ error: "Phone Number must be string" })
		.regex(/^(?:\+8801\d{9}|01\d{9})$/, {
			error:
				"Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
		}),
	password: z
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

export const updateUserZodSchema = z.object({
	name: z
		.string({ error: "Name must be string" })
		.min(2, { error: "Name must be at least 2 characters long." })
		.max(50, { error: "Name cannot exceed 50 characters." })
		.optional(),
	password: z
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
	isDeleted: z.boolean({ error: "isDeleted must be true or false" }).optional(),
	role: z
		.enum(Role, {
			error: "Role must be one of the following: USER, ADMIN, AGENT",
		})
		.optional(),
	agentData: z
		.object({
			commissionRate: z
				.number({ error: "Commission rate must be a number" })
				.min(0, { error: "Commission rate cannot be negative" })
				.optional(),
			approvalStatus: z
				.enum(Object.values(IApprovalStatus), {
					error: "Approval status must be one of PENDING, APPROVED, REJECTED",
				})
				.optional(),
		})
		.optional()
});
