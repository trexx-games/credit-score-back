module.exports = {
  "root": true,

  "env": {
    node: true,
  },

  "parser": "@typescript-eslint/parser",

  "plugins": ["@typescript-eslint/eslint-plugin", "prettier", "eslint-plugin-import-helpers"],

  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],

  "rules": {
    "import-helpers/order-imports": [
      "warn",
      {
        newlinesBetween: "always",
        groups: ["module", "/^@src/", ["parent", "sibling", "index"]],
        alphabetize: { order: "asc", ignoreCase: true },
      },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },

  "prettier/prettier": [
    "error",
    {
      endOfLine: "auto",
    },
  ],
}
