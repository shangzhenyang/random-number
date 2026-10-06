import eslintConfig from "@shangzhen/eslint-config/react";

export default [
	...eslintConfig,
	{
		settings: {
			react: {
				version: "19.3",
			},
		},
	},
];
