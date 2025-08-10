import { model, Schema } from "mongoose";
import { IWallet, IWalletStatus, IWalletType } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
		type: {
			type: String,
			enum: Object.values(IWalletType),
			required: true,
		},
		status: { type: String, enum: IWalletStatus, required: true },
		balance: { type: Number, required: true, default: 50 },
		currency: { type: String, default: "BDT" },
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

export const WalletModel = model<IWallet>("WalletModel", walletSchema);
