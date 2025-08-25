import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../helpers/appError";
import { UserModel } from "../user/user.model";
import { TransactionModel } from "./transaction.model";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllTransactions = async (query: Record<string, string>) => {
	const queryBuilder = new QueryBuilder(TransactionModel.find(), query);

	const transactions = await queryBuilder.filter().sort().paginate();

	const [data, meta] = await Promise.all([
		transactions.build(),
		queryBuilder.getMeta(),
	]);
	return {
		data,
		meta,
	};
};

const getMyTransactions = async (
	payload: JwtPayload,
	query: Record<string, string>
) => {
	const user = await UserModel.findById(payload.userId);

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "User is deleted");
	}
	const queryBuilder = new QueryBuilder(
		TransactionModel.find({
			$or: [{ initiatedBy: user._id }, { receiverId: user._id }],
		}),
		query
	);

	const transactions = await queryBuilder.filter().sort().paginate();

	const [data, meta] = await Promise.all([
		transactions.build(),
		queryBuilder.getMeta(),
	]);

	return {
		data,
		meta,
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
