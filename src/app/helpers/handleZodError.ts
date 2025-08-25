/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorSource, IGenericErrorResponse } from "../interfaces/error";

export const handleZodError = (err: any): IGenericErrorResponse => {
	const errorSources: IErrorSource[] = [];

	err.issues.forEach((issue: any) =>
		errorSources.push({
			path: issue.path[issue.path.length - 1],
			message: issue.message,
		})
	);

	return {
		statusCode: 400,
		message: "Make sure to provide valid input",
		errorSources,
	};
};