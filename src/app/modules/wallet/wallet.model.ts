import { model, Schema } from "mongoose";
import { IWallet, IWalletStatus } from "./wallet.interface";
import { Role } from "../user/user.interface";

const walletSchema = new Schema<IWallet>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
		type: {
			type: String,
			enum: Object.values(Role),
		},
		status: {
			type: String,
			enum: IWalletStatus,
			default: IWalletStatus.ACTIVE,
		},
		balance: { type: Number, default: 50 },
		currency: { type: String, default: "BDT" },
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

export const WalletModel = model<IWallet>("WalletModel", walletSchema);
