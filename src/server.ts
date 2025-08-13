/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedAdmin } from "./app/utils/seedAdmin";

let server: Server;

const startServer = async () => {
	try {
		await mongoose.connect(`${envVars.MONGODB_URI}`);
		console.log("🟢 Database Connected");
		server = app.listen(envVars.PORT, () => {
			console.log(`🟢 Server is listening on PORT: ${envVars.PORT}`);
		});
	} catch (error) {
		console.log("error from server file", error);
	}
};

(async () => {
	await startServer();
	await seedAdmin();
})();

/**
 * Handles graceful shutdown on SIGTERM signal (e.g., from process managers or system shutdown)
 * - If the server is running, it closes the server and then exits the process with code 1.
 * - If the server is not running, it immediately exits the process with code 1.
 */

process.on("SIGTERM", () => {
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}

	process.exit(1);
});

/**
 * Handles unhandled promise rejections
 * - Logs the error message for debugging purposes.
 * - Attempts a graceful shutdown by closing the server if it is running.
 * - Exits the process with code 1 to indicate an abnormal termination.
 * - Test - Promise.reject(Error("unhandled error"))
 */

process.on("unhandledRejection", (error) => {
	console.log(
		"From Server File: UnHandled rejection detected. Server shutting down......",
		error
	);

	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}

	process.exit(1);
});

/**
 * Handles uncaught exceptions
 * - Logs the error message for debugging purposes.
 * - Attempts a graceful shutdown by closing the server if it is running.
 * - Exits the process with code 1 to indicate an abnormal termination.
 * - Test - throw new Error("un caught error")
 */

process.on("uncaughtException", (error) => {
	console.log(
		"From Server File: UnCaught error detected. Server shutting down....",
		error
	);

	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}

	process.exit(1);
});
