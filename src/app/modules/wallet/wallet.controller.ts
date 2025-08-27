import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { WalletService } from "./wallet.service";
import AppError from "../../helpers/appError";

const createWallet = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
	}

	const newWallet = await WalletService.createWallet(req.body, req.user);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Wallet created successfully",
		data: newWallet,
	});
});

const updateWallet = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
	}

	const wallet = await WalletService.updateWallet(req.body, req.params.id, req.user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Wallet updated successfully",
		data: wallet,
	});
});


const topUpWallet = catchAsync(async (req: Request, res: Response) => {
	const decodedToken = req.user;

	if (!decodedToken) {
		throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
	}
	const result = await WalletService.topUpWallet(req.body, decodedToken);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Wallet topped up successfully",
		data: result,
	});
});

const sendMoney = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
	}
	const { phone, amount } = req.body;
	const sender = req.user;
	const result = await WalletService.sendMoney(sender, phone, amount);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Money sent successfully",
		data: result,
	});
});

const cashIn = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
	}
	const { phone, amount } = req.body;
	const agent = req.user;
	const result = await WalletService.cashIn(agent, phone, amount);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Cash in successful",
		data: result,
	});
});

const cashOut = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
	}
	const { phone, amount } = req.body;
	const user = req.user;
	const result = await WalletService.cashOut(user, phone, amount);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Cash out successful",
		data: result,
	});
});

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const result = await WalletService.getAllWallets(
		query as Record<string, string>
	);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "All wallets retrieved successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getMyWallet = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
	}

	const wallet = await WalletService.getMyWallet(req.user);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "My wallet retrieved successfully",
		data: wallet,
	});
});

export const WalletController = {
	createWallet,
	topUpWallet,
	sendMoney,
	cashIn,
	cashOut,
	getAllWallets,
	getMyWallet,
	updateWallet
};
