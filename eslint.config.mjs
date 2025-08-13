import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	{
		rules: {
			"no-console": "warn",
			"no-unused-vars": "warn",
			"prefer-const": "warn",
			"@typescript-eslint/no-explicit-any": "off",
		},
	}
);
