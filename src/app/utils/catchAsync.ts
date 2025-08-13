import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>;

export const catchAsync =
	(fn: AsyncHandler) => (_req: Request, _res: Response, next: NextFunction) => {
		Promise.resolve(fn(_req, _res, next)).catch((error) => {
			next(error);
		});
	};
