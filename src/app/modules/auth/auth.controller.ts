/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../helpers/appError";
import passport from "passport";

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
		};

    passport.authenticate("local", passportAuthenticateHandler)(req, res, next)
	}
);

export const AuthController = {
	credentialsLogin,
};
