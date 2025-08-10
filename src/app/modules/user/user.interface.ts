import { Types } from "mongoose";

export enum Role {
	USER = "USER",
	ADMIN = "ADMIN",
	AGENT = "AGENT",
}

export enum IsActive {
	ACTIVE = "ACTIVE",
	BLOCKED = "BLOCKED",
}

export enum IApprovalStatus {
	PENDING = "PENDING",
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
}


export interface IUser {
	_id?: Types.ObjectId;
	name: string;
	phone: string;
	password?: string;
	isDeleted?: boolean;
	role: Role;
	agentData?: {
		commissionRate?: number;
		approvalStatus?: IApprovalStatus;
	};
}
