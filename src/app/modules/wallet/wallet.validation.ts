import z from "zod";
import { IWalletStatus, IWalletType } from "./wallet.interface";

export const createWalletZodSchema = z.object({
	userId: z.string({
		error: "User ID must be a string",
	}),
	type: z.enum(Object.values(IWalletType), {
		error: "Type must be one of USER, AGENT, SYSTEM",
	}),
});

export const topUpWalletZodSchema = z.object({
	walletId: z.string({
		error: "Wallet ID must be a string",
	}),
	amount: z.number({
		error: "Amount must be a number",
	}),
});

export const sendMoneyZodSchema = z.object({
	recipientId: z.string().min(1, "Recipient is required"),
	amount: z.number().positive("Amount must be greater than zero"),
});

export const cashInZodSchema = z.object({
	recipientId: z.string().min(1, "Recipient is required"),
	amount: z.number().positive("Amount must be greater than zero"),
});

export const cashOutZodSchema = z.object({
	    agentId: z.string().min(1, "Agent is required"),
    amount: z.number().positive("Amount must be greater than zero"),
});
