import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { zodSchemaValidation } from "../../middlewares/zodSchemaValidation";
import {
	cashInZodSchema,
	cashOutZodSchema,
	createWalletZodSchema,
	sendMoneyZodSchema,
	topUpWalletZodSchema,
	updateWalletZodSchema,
} from "./wallet.validation";
import { checkAuthorization } from "../../middlewares/checkAuthorization";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
	"/create-wallet",
	zodSchemaValidation(createWalletZodSchema),
	checkAuthorization(...Object.values(Role)),
	WalletController.createWallet
);

router.patch(
	"/update/:id",
	zodSchemaValidation(updateWalletZodSchema),
	checkAuthorization(...Object.values(Role)),
	WalletController.updateWallet
);

router.post(
	"/top-up",
	zodSchemaValidation(topUpWalletZodSchema),
	checkAuthorization(...Object.values(Role)),
	WalletController.topUpWallet
);

router.post(
	"/send-money",
	zodSchemaValidation(sendMoneyZodSchema),
	checkAuthorization(...Object.values([Role.USER, Role.AGENT])),
	WalletController.sendMoney
);

router.post(
	"/cash-in",
	zodSchemaValidation(cashInZodSchema),
	checkAuthorization(Role.AGENT),
	WalletController.cashIn
);

router.post(
	"/cash-out",
	zodSchemaValidation(cashOutZodSchema),
	checkAuthorization(Role.USER),
	WalletController.cashOut
);

router.get(
	"/get-wallets",
	checkAuthorization(Role.ADMIN),
	WalletController.getAllWallets
);

router.delete(
	"/:id",
	checkAuthorization(...Object.values(Role)),
	WalletController.deleteWallet
);

router.get(
	"/my-wallet",
	checkAuthorization(...Object.values(Role)),
	WalletController.getMyWallet
);

export const WalletRoutes = router;
