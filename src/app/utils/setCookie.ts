import { Response } from "express";
import { envVars } from "../config/env";

interface IAuthTokens {
	accessToken?: string;
	refreshToken?: string;
}

export const setCookie = (res: Response, tokenInfo: IAuthTokens) => {
	if (tokenInfo.accessToken) {
		res.cookie("accessToken", tokenInfo.accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			// maxAge: COOKIE_EXPIRE_TIME,
		});
	}

	if (tokenInfo.refreshToken) {
		res.cookie("refreshToken", tokenInfo.refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			// maxAge: COOKIE_EXPIRE_TIME,
		});
	}
};
