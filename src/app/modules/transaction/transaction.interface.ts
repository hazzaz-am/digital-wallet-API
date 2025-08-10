import { Types } from "mongoose";
import { Role } from "../user/user.interface";

export enum ITransactionType {
	TOP_UP = "TOP_UP",
	SEND_MONEY = "SEND_MONEY",
	CASH_IN = "CASH_IN",
	CASH_OUT = "CASH_OUT",
}

export interface ITransaction {
	_id?: string;
	type: ITransactionType;
	amount: number;
	initiatedBy: Types.ObjectId;
	initiatedByRole: Role;
	receiverId?: Types.ObjectId;
	receiverRole?: Role;
	fromWalletId?: Types.ObjectId;
	toWalletId?: Types.ObjectId;
}
