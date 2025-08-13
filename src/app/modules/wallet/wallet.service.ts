import AppError from "../../helpers/appError";
import { UserModel } from "../user/user.model";
import { IWallet, IWalletStatus, IWalletType } from "./wallet.interface";
import httpStatus from "http-status-codes";
import { WalletModel } from "./wallet.model";
import mongoose, { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { TransactionModel } from "../transaction/transaction.model";
import { ITransactionType } from "../transaction/transaction.interface";
import { Role } from "../user/user.interface";

interface ITopUpWallet {
	walletId: Types.ObjectId;
	amount: number;
}

const createWallet = async (
	walletData: Partial<IWallet>,
	payload: JwtPayload
) => {
	const user = await UserModel.findById(walletData.userId);
	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.isDeleted) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"User is deleted, cannot create wallet"
		);
	}

	if (walletData.userId !== payload.userId) {
		throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
	}

	const newWallet = await WalletModel.create({
		userId: user._id,
		type: user.role,
	});

	return newWallet;
};

const topUpWallet = async (payload: ITopUpWallet, decodedToken: JwtPayload) => {
	const { walletId, amount } = payload;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const wallet = await WalletModel.findById(walletId).session(session);
		if (!wallet) {
			throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
		}

		if (wallet.status === IWalletStatus.BLOCKED) {
			throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked");
		}

		if (wallet.userId.toString() !== decodedToken.userId) {
			throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
		}

		wallet.balance += Number(amount);
		await wallet.save();

		await TransactionModel.create(
			[
				{
					type: ITransactionType.TOP_UP,
					amount,
					initiatedBy: wallet.userId,
					initiatedByRole: wallet.type,
				},
			],
			{
				session,
			}
		);

		await session.commitTransaction();

		return wallet;
	} catch (error) {
		await session.abortTransaction();
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Failed to top up wallet"
		);
	} finally {
		session.endSession();
	}
};

const sendMoney = async (sender: JwtPayload, phone: string, amount: number) => {
	const user = await UserModel.findOne({ phone });

	if (!user) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Account does not exist for this phone number"
		);
	}

	if (user.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "Account is deleted");
	}

	if (user.role === Role.AGENT) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"User cannot send money to agents"
		);
	}

	if (sender.userId === user._id.toString()) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You cannot send money to yourself"
		);
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const senderWallet = await WalletModel.findOne({
			userId: sender.userId,
		}).session(session);

		if (!senderWallet) {
			throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
		}

		if (senderWallet.status === IWalletStatus.BLOCKED) {
			throw new AppError(httpStatus.BAD_REQUEST, "Sender wallet is blocked");
		}

		if (senderWallet.balance < Number(amount)) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"Insufficient balance in sender wallet"
			);
		}

		const recipientWallet = await WalletModel.findOne({
			userId: user._id,
		}).session(session);

		if (!recipientWallet) {
			throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found");
		}

		if (recipientWallet.status === IWalletStatus.BLOCKED) {
			throw new AppError(httpStatus.FORBIDDEN, "Recipient wallet is blocked");
		}

		senderWallet.balance -= Number(amount);
		recipientWallet.balance += Number(amount);
		await senderWallet.save({ session });
		await recipientWallet.save({ session });

		await TransactionModel.create(
			[
				{
					type: ITransactionType.SEND_MONEY,
					amount,
					initiatedBy: sender.userId,
					initiatedByRole: sender.role,
					receiverId: user._id,
					receiverRole: user.role,
					fromWalletId: senderWallet._id,
					toWalletId: recipientWallet._id,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		return null;
	} catch (error) {
		await session.abortTransaction();
		if (error instanceof AppError) {
			throw error;
		}

		if (error instanceof mongoose.Error.ValidationError) {
			throw error;
		}
	} finally {
		session.endSession();
	}
};

const cashIn = async (agent: JwtPayload, phone: string, amount: number) => {
	const recipient = await UserModel.findOne({ phone });
	if (!recipient) {
		throw new AppError(httpStatus.NOT_FOUND, "Recipient account not found");
	}

	if (recipient.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "Recipient account is deleted");
	}

	if (agent.userId === recipient._id.toString()) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You cannot cash in to yourself"
		);
	}

	if (agent.role !== Role.AGENT) {
		throw new AppError(httpStatus.FORBIDDEN, "Only agents can cash in");
	}

	if (recipient.role !== Role.USER) {
		throw new AppError(httpStatus.FORBIDDEN, "Only users can cash in");
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const agentWallet = await WalletModel.findOne({
			userId: agent.userId,
		}).session(session);

		if (!agentWallet) {
			throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
		}

		if (agentWallet.status === IWalletStatus.BLOCKED) {
			throw new AppError(httpStatus.BAD_REQUEST, "Agent wallet is blocked");
		}

		if (agentWallet.balance < Number(amount)) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"Insufficient balance in agent wallet"
			);
		}

		const recipientWallet = await WalletModel.findOne({
			userId: recipient._id,
		}).session(session);

		if (!recipientWallet) {
			throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found");
		}

		if (recipientWallet.status === IWalletStatus.BLOCKED) {
			throw new AppError(httpStatus.FORBIDDEN, "Recipient wallet is blocked");
		}

		agentWallet.balance -= Number(amount);
		recipientWallet.balance += Number(amount);
		await agentWallet.save({ session });
		await recipientWallet.save({ session });

		await TransactionModel.create(
			[
				{
					type: ITransactionType.CASH_IN,
					amount,
					initiatedBy: agent.userId,
					initiatedByRole: agent.role,
					receiverId: recipient._id,
					receiverRole: recipient.role,
					fromWalletId: agentWallet._id,
					toWalletId: recipientWallet._id,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		return null;
	} catch (error) {
		await session.abortTransaction();
		if (error instanceof AppError) {
			throw error;
		}

		if (error instanceof mongoose.Error.ValidationError) {
			throw error;
		}
	} finally {
		session.endSession();
	}
};

const cashOut = async (user: JwtPayload, phone: string, amount: number) => {
	const agent = await UserModel.findOne({ phone });

	if (!agent) {
		throw new AppError(httpStatus.NOT_FOUND, "agent account not found");
	}

	if (agent.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "agent account is deleted");
	}

	if (user.userId === agent._id.toString()) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You cannot cash out to yourself"
		);
	}

	if (user.role !== Role.USER) {
		throw new AppError(httpStatus.FORBIDDEN, "Only users can cash out");
	}

	if (agent.role !== Role.AGENT) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"User cannot cash out to another user"
		);
	}
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const userWallet = await WalletModel.findOne({
			userId: user.userId,
		}).session(session);

		if (!userWallet) {
			throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
		}

		if (userWallet.status === IWalletStatus.BLOCKED) {
			throw new AppError(httpStatus.BAD_REQUEST, "User wallet is blocked");
		}

		if (userWallet.balance < Number(amount)) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"Insufficient balance in user wallet"
			);
		}

		const agentWallet = await WalletModel.findOne({
			userId: agent._id,
		}).session(session);

		if (!agentWallet) {
			throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
		}

		if (agentWallet.status === IWalletStatus.BLOCKED) {
			throw new AppError(httpStatus.FORBIDDEN, "Agent wallet is blocked");
		}

		userWallet.balance -= Number(amount);
		agentWallet.balance += Number(amount);
		await userWallet.save({ session });
		await agentWallet.save({ session });

		await TransactionModel.create(
			[
				{
					type: ITransactionType.CASH_OUT,
					amount,
					initiatedBy: user.userId,
					initiatedByRole: user.role,
					receiverId: agent._id,
					receiverRole: agent.role,
					fromWalletId: userWallet._id,
					toWalletId: agentWallet._id,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		return null;
	} catch (error) {
		await session.abortTransaction();
		if (error instanceof AppError) {
			throw error;
		}

		if (error instanceof mongoose.Error.ValidationError) {
			throw error;
		}
	} finally {
		session.endSession();
	}
};

const getAllWallets = async () => {
	const wallets = await WalletModel.find();
	const totalWallets = await WalletModel.countDocuments();

	return {
		data: wallets,
		meta: {
			total: totalWallets,
		},
	};
};

const getMyWallet = async (user: JwtPayload) => {
	const wallet = await WalletModel.findOne({
		userId: user.userId,
	});

	if (!wallet) {
		throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
	}

	return wallet;
};

export const WalletService = {
	createWallet,
	topUpWallet,
	cashOut,
	sendMoney,
	cashIn,
	getAllWallets,
	getMyWallet,
};
