import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import expressSession from "express-session";
import { envVars } from "./app/config/env";

const app = express();

app.use(
	expressSession({
		secret: envVars.EXPRESS_SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
	res.status(200).json({
		message: "Server health is OK",
	});
});

export default app;
