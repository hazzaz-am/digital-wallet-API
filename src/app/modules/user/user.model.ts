import { model, Schema } from "mongoose";
import { IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		phone: { type: String, required: true, unique: true },
		password: { type: String },
		isDeleted: { type: Boolean, default: false },
		role: {
			type: String,
			enum: Object.values(Role),
			default: Role.USER,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const UserModel = model<IUser>("UserModel", userSchema);
