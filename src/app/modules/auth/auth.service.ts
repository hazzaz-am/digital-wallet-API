import { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../user/user.model";
import AppError from "../../helpers/appError";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { createAccessTokenWithRefreshToken } from "../../utils/userTokens";

const resetPassword = async (
	decodedToken: JwtPayload,
	oldPassword: string,
	newPassword: string
) => {
	const user = await UserModel.findById(decodedToken.userId);

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	const isPassMatch = await bcryptjs.compare(
		oldPassword,
		user.password as string
	);

	if (!isPassMatch) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
	}

	user.password = await bcryptjs.hash(
		newPassword,
		Number(envVars.BCRYPT_SALT_ROUND)
	);
	await user.save();
};

const getNewAccessToken = async (refreshToken: string) => {
	const token = await createAccessTokenWithRefreshToken(refreshToken);

	return {
		accessToken: token,
	};
};

export const AuthService = {
	resetPassword,
	getNewAccessToken
};
