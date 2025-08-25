import z from "zod";

export const createWalletZodSchema = z.object({
	userId: z.string({
		error: "User ID must be a string",
	}),
	balance: z.number().optional(),
});

export const topUpWalletZodSchema = z.object({
	walletId: z.string({
		error: "Wallet ID must be a string",
	}),
	amount: z
		.number({
			error: "Amount must be a number",
		})
		.min(50, "Amount must be at least 50 BDT"),
});

export const sendMoneyZodSchema = z.object({
	phone: z
		.string({ error: "Phone Number must be string" })
		.regex(/^(?:\+8801\d{9}|01\d{9})$/, {
			error:
				"Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
		}),
	amount: z.number().positive("Amount must be greater than zero"),
});

export const cashInZodSchema = z.object({
	phone: z
		.string({ error: "Phone Number must be string" })
		.regex(/^(?:\+8801\d{9}|01\d{9})$/, {
			error:
				"Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
		}),
	amount: z.number().positive("Amount must be greater than zero"),
});

export const cashOutZodSchema = z.object({
	phone: z
		.string({ error: "Phone Number must be string" })
		.regex(/^(?:\+8801\d{9}|01\d{9})$/, {
			error:
				"Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
		}),
	amount: z.number().positive("Amount must be greater than zero"),
});
