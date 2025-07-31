import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
	PORT: string;
	MONGODB_URI: string;
	NODE_ENV: string;
}

const localEnvVariables = (): EnvConfig => {
	const requiredEnvVariables: string[] = ["PORT", "MONGODB_URI", "NODE_ENV"];

	requiredEnvVariables.forEach((key) => {
		if (!process.env[key]) {
			throw new Error(`Required environment variable "${key}" is missing`);
		}
	});

	return {
		PORT: process.env.PORT as string,
		MONGODB_URI: process.env.MONGODB_URI as string,
		NODE_ENV: process.env.NODE_ENV as string,
	};
};

export const envVars = localEnvVariables();
