import AppError from "../../helpers/appError";
import { IUser, Role } from "./user.interface";
import { UserModel } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
	const { phone, password, ...rest } = payload;

	const isPhoneExist = await UserModel.findOne({ phone: phone });

	if (isPhoneExist) {
		throw new AppError(
			httpStatus.CONFLICT,
			"Account already exists with this phone number"
		);
	}

	const hashPassword = await bcryptjs.hash(
		password as string,
		Number(envVars.BCRYPT_SALT_ROUND)
	);

	const user = await UserModel.create({
		phone,
		password: hashPassword,
		...rest,
	});

	return user;
};

const updateUser = async (
	payload: Partial<IUser>,
	userId: string,
	decodedToken: JwtPayload
) => {
	const user = await UserModel.findById(userId);

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.isDeleted) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"User is deleted, cannot update"
		);
	}

	if (payload.password) {
		payload.password = await bcryptjs.hash(
			payload.password,
			Number(envVars.BCRYPT_SALT_ROUND)
		);
	}

	if (payload.role) {
		if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
			throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
		}
	}

	if (payload.agentData) {
		if (decodedToken.role === Role.AGENT || decodedToken.role === Role.USER) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"Unauthorized access to agent data"
			);
		}
	}

	const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, {
		new: true,
		runValidators: true,
	});

	return updatedUser;
};

const getAllUsers = async () => {
	const users = await UserModel.find();
	const totalUsers = await UserModel.countDocuments();

	return {
		data: users,
		meta: {
			total: totalUsers,
		},
	};
};

export const UserService = {
	createUser,
	updateUser,
	getAllUsers,
};
