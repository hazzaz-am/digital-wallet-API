import { Router } from "express";
import { AuthController } from "./auth.controller";
import { Role } from "../user/user.interface";
import { checkAuthorization } from "../../middlewares/checkAuthorization";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/logout", AuthController.logout);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post(
	"/reset-password",
	checkAuthorization(...Object.values(Role)),
	AuthController.resetPassword
);

export const AuthRoutes = router;
