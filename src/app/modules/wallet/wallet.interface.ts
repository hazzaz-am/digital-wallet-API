import { Types } from "mongoose";

export enum IWalletType {
	USER = "USER",
	AGENT = "AGENT",
	SYSTEM = "SYSTEM",
}

export enum IWalletStatus {
	ACTIVE = "ACTIVE",
	BLOCKED = "BLOCKED",
}

export interface IWallet {
	_id?: Types.ObjectId;
	userId: Types.ObjectId;
	type: IWalletType;
  status: IWalletStatus;
	balance: number;
  currency?: "BDT";
}
