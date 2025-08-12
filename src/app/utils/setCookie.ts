import { Response } from "express";

interface IAuthTokens {
	accessToken?: string;
	refreshToken?: string;
}

export const setCookie = async (res: Response, tokenInfo: IAuthTokens) => {
	const options = {
		httpOnly: true,
		secure: false,
	};

	if (tokenInfo.accessToken) {
		res.cookie("accessToken", tokenInfo.accessToken, options);
	}

	if (tokenInfo.refreshToken) {
		res.cookie("refreshToken", tokenInfo.refreshToken, options);
	}
};