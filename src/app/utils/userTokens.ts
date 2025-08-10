import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwtToken";

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
