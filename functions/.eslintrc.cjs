module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    commonjs: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
    "*.cjs",
    "*.js"
  ],
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "quotes": ["error", "single"],
    "indent": ["error", 2],
    "@typescript-eslint/no-explicit-any": "warn"
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
};