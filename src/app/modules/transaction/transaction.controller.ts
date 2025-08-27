import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../helpers/appError";
import { TransactionService } from "./transaction.service";
import { TransactionModel } from "./transaction.model";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";
import mongoose from "mongoose";

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


const getTransactionStats = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  let userId = user.userId;

  if (user.role === Role.ADMIN) {
    userId = null;
  }

  // If not admin → convert to ObjectId
  const baseMatch = userId
    ? {
        $or: [
          { initiatedBy: new mongoose.Types.ObjectId(userId) },
          { receiverId: new mongoose.Types.ObjectId(userId) },
        ],
      }
    : {};

  const now = new Date();

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const stats = await TransactionModel.aggregate([
    { $match: baseMatch },
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,
              totalTransactions: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
            },
          },
        ],
        monthlyTypes: [
          {
            $match: {
              ...baseMatch,
              createdAt: { $gte: monthStart, $lte: monthEnd },
            },
          },
          {
            $group: {
              _id: "$type",
              count: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
            },
          },
        ],
        yearly: [
          {
            $match: {
              ...baseMatch,
              createdAt: { $gte: yearStart, $lte: yearEnd },
            },
          },
          {
            $group: {
              _id: { $month: "$createdAt" },
              count: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
            },
          },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction stats retrieved successfully",
    data: stats[0],
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
	getTransactionStats,
};
