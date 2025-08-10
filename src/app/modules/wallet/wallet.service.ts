import AppError from "../../helpers/appError";
import { UserModel } from "../user/user.model";
import { IWallet, IWalletStatus, IWalletType } from "./wallet.interface";
import httpStatus from "http-status-codes";
import { WalletModel } from "./wallet.model";
import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

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

	if (walletData.userId !== payload._id) {
		throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
	}

	let wallet: IWallet = {
		userId: user._id,
		type: walletData.type as IWalletType,
		status: IWalletStatus.ACTIVE,
		balance: 50,
		currency: "BDT",
	};

	const newWallet = await WalletModel.create({
		...wallet,
	});

	return newWallet;
};

const topUpWallet = async (payload: ITopUpWallet) => {
	const { walletId, amount } = payload;

	const wallet = await WalletModel.findById(walletId);
	if (!wallet) {
		throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
	}

	if (wallet.status === IWalletStatus.BLOCKED) {
		throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked");
	}

	wallet.balance += amount;
	await wallet.save();

	return wallet;
};

const sendMoney = async (
	sender: JwtPayload,
	recipientId: string,
	amount: number
) => {
	if (sender._id === recipientId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You cannot send money to yourself"
		);
	}
	const senderWallet = await WalletModel.findOne({
		userId: sender._id,
	});

	if (!senderWallet) {
		throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
	}

	if (senderWallet.status === IWalletStatus.BLOCKED) {
		throw new AppError(httpStatus.BAD_REQUEST, "Sender wallet is blocked");
	}

	if (senderWallet.balance < amount) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Insufficient balance in sender wallet"
		);
	}

	const recipientWallet = await WalletModel.findOne({
		userId: recipientId,
	});

	if (!recipientWallet) {
		throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found");
	}

	if (recipientWallet.status === IWalletStatus.BLOCKED) {
		throw new AppError(httpStatus.FORBIDDEN, "Recipient wallet is blocked");
	}

	senderWallet.balance -= amount;
	recipientWallet.balance += amount;
	await senderWallet.save();
	await recipientWallet.save();
	return null;
};

const cashIn = async (
	agent: JwtPayload,
	recipientId: string,
	amount: number
) => {
	if (agent._id === recipientId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You cannot cash in to yourself"
		);
	}

	if (agent.type !== IWalletType.AGENT) {
		throw new AppError(httpStatus.FORBIDDEN, "Only agents can cash in");
	}

	const agentWallet = await WalletModel.findOne({
		userId: agent._id,
		type: IWalletType.AGENT,
	});

	if (!agentWallet) {
		throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
	}

	if (agentWallet.status === IWalletStatus.BLOCKED) {
		throw new AppError(httpStatus.BAD_REQUEST, "Agent wallet is blocked");
	}

	if (agentWallet.balance < amount) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Insufficient balance in agent wallet"
		);
	}

	const recipientWallet = await WalletModel.findOne({
		userId: recipientId,
	});

	if (!recipientWallet) {
		throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found");
	}

	if (recipientWallet.status === IWalletStatus.BLOCKED) {
		throw new AppError(httpStatus.FORBIDDEN, "Recipient wallet is blocked");
	}

	agentWallet.balance -= amount;
	recipientWallet.balance += amount;
	await agentWallet.save();
	await recipientWallet.save();
	return null;
};

const cashOut = async (user: JwtPayload, agentId: string, amount: number) => {
	if (user._id === agentId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You cannot cash out to yourself"
		);
	}

	if (user.type !== IWalletType.USER) {
		throw new AppError(httpStatus.FORBIDDEN, "Only users can cash out");
	}

	const userWallet = await WalletModel.findOne({
		userId: user._id,
		type: IWalletType.USER,
	});

	if (!userWallet) {
		throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
	}

	if (userWallet.status === IWalletStatus.BLOCKED) {
		throw new AppError(httpStatus.BAD_REQUEST, "User wallet is blocked");
	}

	if (userWallet.balance < amount) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Insufficient balance in user wallet"
		);
	}

	const agentWallet = await WalletModel.findOne({
		userId: agentId,
		type: IWalletType.AGENT,
	});

	if (!agentWallet) {
		throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
	}

	if (agentWallet.status === IWalletStatus.BLOCKED) {
		throw new AppError(httpStatus.FORBIDDEN, "Agent wallet is blocked");
	}

	userWallet.balance -= Number(amount);
	agentWallet.balance += Number(amount);
	await userWallet.save();
	await agentWallet.save();
	return null;
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
		userId: user._id,
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
