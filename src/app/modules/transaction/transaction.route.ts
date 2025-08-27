import { Router } from "express";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";
import { checkAuthorization } from "../../middlewares/checkAuthorization";

const router = Router();

router.get(
	"/get-all-transactions",
	checkAuthorization(Role.ADMIN),
	TransactionController.getAllTransactions
);

router.get(
	"/stats",
	checkAuthorization(...Object.values(Role)),
	TransactionController.getTransactionStats
);

router.get(
	"/my-transactions",
	checkAuthorization(...Object.values(Role)),
	TransactionController.getMyTransactions
);

router.get(
	"/:id",
	checkAuthorization(...Object.values(Role)),
	TransactionController.getSingleTransaction
);

export const TransactionRoutes = router;
