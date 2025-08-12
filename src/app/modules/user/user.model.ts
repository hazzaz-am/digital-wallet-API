import { model, Schema } from "mongoose";
import { IApprovalStatus, IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>(
	{
		name: { type: String },
		phone: { type: String, required: true, unique: true },
		password: { type: String },
		isDeleted: { type: Boolean, default: false },
		role: {
			type: String,
			enum: Object.values(Role),
			required: true,
		},
		agentData: {
			commissionRate: { type: Number, default: 0 },
			approvalStatus: {
				type: String,
				enum: Object.values(IApprovalStatus),
				default: IApprovalStatus.PENDING,
			},
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const UserModel = model<IUser>("UserModel", userSchema);
