import { Router } from "express";
import { UserController } from "./user.controller";
import { zodSchemaValidation } from "../../middlewares/zodSchemaValidation";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuthorization } from "../../middlewares/checkAuthorization";
import { Role } from "./user.interface";

const router = Router();

router.post(
	"/register",
	zodSchemaValidation(createUserZodSchema),
	UserController.createUser
);

router.get(
	"/all-users",
	checkAuthorization(Role.ADMIN),
	UserController.getAllUsers
);

router.get(
	"/me",
	checkAuthorization(...Object.values(Role)),
	UserController.getMyProfile
);

router.get(
	"/:id",
	checkAuthorization(...Object.values(Role)),
	UserController.getUserById
);

router.patch(
	"/:id",
	zodSchemaValidation(updateUserZodSchema),
	checkAuthorization(...Object.values(Role)),
	UserController.updateUser
);

export const UserRoutes = router;
