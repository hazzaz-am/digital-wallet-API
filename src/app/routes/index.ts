import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";

export const router = Router();

const moduleRoutes = [
	{
		path: "/auth",
		route: AuthRoutes,
	},
	{
		path: "/user",
		route: UserRoutes,
	},
	{
		path: "/wallet",
		route: WalletRoutes,
	},
];

moduleRoutes.forEach((route) => {
	router.use(route.path, route.route);
});
