const eslintConfig = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
  },
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  ignorePatterns: [
    "dist",
    "node_modules",
    "webpack.config.js",
    "jest.config.js",
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
  },
};

export default eslintConfig;
