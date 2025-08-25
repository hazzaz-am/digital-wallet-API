import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../helpers/appError";
import { TransactionService } from "./transaction.service";

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const result = await TransactionService.getAllTransactions(
		query as Record<string, string>
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Transactions retrieved successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const query = req.query;

	const result = await TransactionService.getMyTransactions(
		req.user,
		query as Record<string, string>
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Transactions retrieved successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getSingleTransaction = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const transactionId = req.params.id;
	const result = await TransactionService.getSingleTransaction(
		req.user,
		transactionId
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Transaction retrieved successfully",
		data: result,
	});
});

export const TransactionController = {
	getAllTransactions,
	getMyTransactions,
	getSingleTransaction,
};
