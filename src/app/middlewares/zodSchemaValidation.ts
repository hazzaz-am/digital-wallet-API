import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const zodSchemaValidation =
	(zodSchema: ZodObject) =>
	async (req: Request, _res: Response, next: NextFunction) => {
		try {
			req.body = await zodSchema.parseAsync(req.body);
			next();
		} catch (error) {
			next(error);
		}
	};
