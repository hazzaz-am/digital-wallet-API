import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/appError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwtToken";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../modules/user/user.model";

export const checkAuthorization =
	(...authRoles: string[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const accessToken = req.headers.authorization || req.cookies.accessToken;

			if (!accessToken) {
				throw new AppError(httpStatus.UNAUTHORIZED, "User not authorized");
			}

			const verifiedUser = verifyToken(
				accessToken,
				envVars.JWT_ACCESS_SECRET_TOKEN
			) as JwtPayload;

			const user = await UserModel.findOne({
				phone: verifiedUser.phone,
			});

			if (!user) {
				throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
			}

			if (user.isDeleted) {
				throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
			}

			if (!authRoles.includes(verifiedUser.role)) {
				throw new AppError(
					httpStatus.FORBIDDEN,
					"You do not have permission to access this resource"
				);
			}

			req.user = verifiedUser;
			next();
		} catch (error) {
			next(error);
		}
	};
