/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../helpers/appError";
import passport from "passport";
import { createUserTokens } from "../../utils/userTokens";
import { setCookie } from "../../utils/setCookie";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';

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

export const AuthController = {
	credentialsLogin,
};
