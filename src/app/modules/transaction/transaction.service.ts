import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import AppError from "../../helpers/appError";
import { UserModel } from "../user/user.model";
import { TransactionModel } from "./transaction.model";

const getAllTransactions = async () => {
	const transactions = await TransactionModel.find();
	const totalTransactions = await TransactionModel.countDocuments();
	return {
		data: transactions,
		meta: {
			total: totalTransactions,
		},
	};
};

const getMyTransactions = async (payload: JwtPayload) => {
	const user = await UserModel.findById(payload.userId);

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "User is deleted");
	}

	const transactions = await TransactionModel.find({
		$or: [{ initiatedBy: user._id }, { receiverId: user._id }],
	});

	const totalTransactions = await TransactionModel.find({
		$or: [{ initiatedBy: user._id }, { receiverId: user._id }],
	}).countDocuments();

	return {
		data: transactions,
		meta: {
			total: totalTransactions,
		},
	};
};

const getSingleTransaction = async (
	payload: JwtPayload,
	transactionId: string
) => {
	const user = await UserModel.findById(payload.userId);

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "User is deleted");
	}

	const transaction = await TransactionModel.findOne({
		_id: transactionId,
	});

	if (!transaction) {
		throw new AppError(httpStatus.NOT_FOUND, "Transaction not found");
	}

	return transaction;
};

export const TransactionService = {
	getAllTransactions,
	getMyTransactions,
	getSingleTransaction,
};
