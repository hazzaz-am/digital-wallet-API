/* eslint-disable no-console */
import mongoose from "mongoose";
import { IGenericErrorResponse } from "../interfaces/error";
import { envVars } from "../config/env";

export const handleCastError = (
	err: mongoose.Error.CastError
): IGenericErrorResponse => {
	if (envVars.NODE_ENV === "development") {
		console.log(err);
	}
	return {
		statusCode: 400,
		message: "Please provide a valid id",
	};
};