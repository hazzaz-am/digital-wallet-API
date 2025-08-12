import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../helpers/appError";
import { Role } from "./user.interface";

const createUser = catchAsync(async (req: Request, res: Response) => {
	const user = await UserService.createUser(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "User created successfully",
		data: user,
	});
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
	}

	const user = await UserService.updateUser(req.body, req.params.id, req.user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User updated successfully",
		data: user,
	});
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const result = await UserService.getAllUsers();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Users retrieved successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
	const user = await UserService.getUserById(req.params.id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User retrieved successfully",
		data: user,
	});
});

export const UserController = {
	createUser,
	updateUser,
	getAllUsers,
	getUserById,
};
