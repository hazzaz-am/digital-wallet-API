/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../helpers/appError";
import passport from "passport";
import { createUserTokens } from "../../utils/userTokens";
import { setCookie } from "../../utils/setCookie";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";

const credentialsLogin = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const passportAuthenticateHandler = async (
			err: any,
			user: any,
			info: any
		) => {
			if (err) {
				return next(new AppError(401, "Authentication failed"));
			}

			if (!user) {
				return next(new AppError(401, info.message));
			}

			const userTokens = createUserTokens(user);

			const updatedUser = user.toObject();
			delete updatedUser["password"];

			setCookie(res, userTokens);

			sendResponse(res, {
				statusCode: httpStatus.OK,
				message: "Log in successful",
				success: true,
				data: {
					accessToken: userTokens.accessToken,
					refreshToken: userTokens.refreshToken,
					user: updatedUser,
				},
			});
		};

		passport.authenticate("local", passportAuthenticateHandler)(req, res, next);
	}
);

const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const decodedToken = req.user;
	if (!decodedToken) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}
	const { oldPassword, newPassword } = req.body;
	await AuthService.resetPassword(decodedToken, oldPassword, newPassword);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Password reset successful",
		success: true,
		data: null,
	});
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Authorization denied");
	}

	const tokenInfo = await AuthService.getNewAccessToken(refreshToken);
	setCookie(res, tokenInfo);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Login successfully",
		success: true,
		data: tokenInfo,
	});
});

const logout = catchAsync(async (_req: Request, res: Response) => {
	res.clearCookie("accessToken", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Logout successful",
		success: true,
		data: null,
	});
});

export const AuthController = {
	credentialsLogin,
	logout,
	resetPassword,
	getNewAccessToken
};
