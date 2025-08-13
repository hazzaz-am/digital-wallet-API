import { envVars } from "../config/env";
import { IUser, Role } from "../modules/user/user.interface";
import { UserModel } from "../modules/user/user.model";
import bcryptjs from 'bcryptjs'

export const seedAdmin = async () => {
	try {
		const isAdminExist = await UserModel.findOne({
			phone: envVars.SUPER_ADMIN_PHONE,
		});

		if (isAdminExist) {
			console.log("ADMIN ALREADY EXIST");
			return;
		}

		const hashPassword = await bcryptjs.hash(
			envVars.SUPER_ADMIN_PASSWORD,
			Number(envVars.BCRYPT_SALT_ROUND)
		);

		const payload: IUser = {
			name: "Admin",
			role: Role.ADMIN,
			phone: envVars.SUPER_ADMIN_PHONE,
			password: hashPassword,
			isDeleted: false
		};

		const admin = await UserModel.create(payload);
		console.log("Admin created successfully");
		console.log(admin);
	} catch (error) {
		console.log(error);
	}
};