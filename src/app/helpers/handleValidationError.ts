/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorSource, IGenericErrorResponse } from "../interfaces/error";

export const handleValidationError = (err: any): IGenericErrorResponse => {
	const errorSources: IErrorSource[] = [];

	const errors = Object.values(err.errors);
	errors.forEach((errorObject: any) =>
		errorSources.push({
			path: errorObject.path,
			message: errorObject.message,
		})
	);

	return {
		statusCode: 400,
		message: "Validation Error",
		errorSources,
	};
};