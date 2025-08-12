import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwtToken";
import { UserModel } from "../modules/user/user.model";
import AppError from "../helpers/appError";
import httpStatus from "http-status-codes";

export const createUserTokens = (user: Partial<IUser>) => {
	const jwtPayload = {
		userId: user._id,
		phone: user.phone,
		role: user.role,
	};

	const accessToken = generateToken(
		jwtPayload,
		envVars.JWT_ACCESS_SECRET_TOKEN,
		envVars.JWT_ACCESS_EXPIRES_IN
	);

	const refreshToken = generateToken(
		jwtPayload,
		envVars.JWT_REFRESH_SECRET_TOKEN,
		envVars.JWT_REFRESH_EXPIRES_IN
	);

	return {
		accessToken,
		refreshToken,
	};
};

export const createAccessTokenWithRefreshToken = async (
	refreshToken: string
) => {
	const verifiedRefreshToken = verifyToken(
		refreshToken,
		envVars.JWT_REFRESH_SECRET_TOKEN
	) as JwtPayload;

	const isUserExist = await UserModel.findOne({
		phone: verifiedRefreshToken.phone,
	});

	if (!isUserExist) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (isUserExist.isDeleted) {
		throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
	}

	const jwtPayload = {
		userId: isUserExist._id,
		phone: isUserExist.phone,
		role: isUserExist.role,
	};

	const accessToken = generateToken(
		jwtPayload,
		envVars.JWT_ACCESS_SECRET_TOKEN,
		envVars.JWT_ACCESS_EXPIRES_IN
	);

	return accessToken;
};
