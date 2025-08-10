import { model, Schema } from "mongoose";
import { ITransaction, ITransactionType } from "./transaction.interface";
import { Role } from "../user/user.interface";

const transactionSchema = new Schema<ITransaction>(
	{
		type: {
			type: String,
			enum: Object.values(ITransactionType),
			required: true,
		},
		initiatedBy: {
			type: Schema.Types.ObjectId,
			ref: "UserModel",
			required: true,
		},
		initiatedByRole: {
			type: String,
			enum: Object.values(Role),
			required: true,
		},
		receiverId: { type: Schema.Types.ObjectId, ref: "UserModel" },
		receiverRole: { type: String, enum: Object.values(Role) },
		fromWalletId: { type: Schema.Types.ObjectId, ref: "WalletModel" },
		toWalletId: { type: Schema.Types.ObjectId, ref: "WalletModel" },
		amount: { type: Number, required: true },
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

export const TransactionModel = model<ITransaction>(
	"TransactionModel",
	transactionSchema
);
