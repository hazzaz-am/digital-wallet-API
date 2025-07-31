import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
	res.status(200).json({
		message: "Server health is OK",
	});
});

export default app;
