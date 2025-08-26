import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
	PORT: string;
	MONGODB_URI: string;
	NODE_ENV: string;
	BCRYPT_SALT_ROUND: string;
	JWT_ACCESS_SECRET_TOKEN: string;
	JWT_ACCESS_EXPIRES_IN: string;
	JWT_REFRESH_SECRET_TOKEN: string;
	JWT_REFRESH_EXPIRES_IN: string;
	EXPRESS_SESSION_SECRET: string;
	AGENT_COMMISSION_RATE: string;
	SUPER_ADMIN_PHONE: string;
	SUPER_ADMIN_PASSWORD: string;
	FRONTEND_URL: string;
}

const localEnvVariables = (): EnvConfig => {
	const requiredEnvVariables: string[] = [
		"PORT",
		"MONGODB_URI",
		"NODE_ENV",
		"BCRYPT_SALT_ROUND",
		"JWT_ACCESS_SECRET_TOKEN",
		"JWT_ACCESS_EXPIRES_IN",
		"JWT_REFRESH_SECRET_TOKEN",
		"JWT_REFRESH_EXPIRES_IN",
		"EXPRESS_SESSION_SECRET",
		"AGENT_COMMISSION_RATE",
		"SUPER_ADMIN_PHONE",
		"SUPER_ADMIN_PASSWORD",
		"FRONTEND_URL"
	];

	requiredEnvVariables.forEach((key) => {
		if (!process.env[key]) {
			throw new Error(`Required environment variable "${key}" is missing`);
		}
	});

	return {
		PORT: process.env.PORT as string,
		MONGODB_URI: process.env.MONGODB_URI as string,
		NODE_ENV: process.env.NODE_ENV as string,
		BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
		JWT_ACCESS_SECRET_TOKEN: process.env.JWT_ACCESS_SECRET_TOKEN as string,
		JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
		JWT_REFRESH_SECRET_TOKEN: process.env.JWT_REFRESH_SECRET_TOKEN as string,
		JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
		EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
		AGENT_COMMISSION_RATE: process.env.AGENT_COMMISSION_RATE as string,
		SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE as string,
		SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
		FRONTEND_URL: process.env.FRONTEND_URL as string
	};
};

export const envVars = localEnvVariables();
