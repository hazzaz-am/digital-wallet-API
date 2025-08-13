"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedAdmin_1 = require("./app/utils/seedAdmin");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(`${env_1.envVars.MONGODB_URI}`);
        console.log("🟢 Database Connected");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`🟢 Server is listening on PORT: ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log("error from server file", error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
    yield (0, seedAdmin_1.seedAdmin)();
}))();
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
    console.log("From Server File: UnHandled rejection detected. Server shutting down......", error);
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
    console.log("From Server File: UnCaught error detected. Server shutting down....", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
