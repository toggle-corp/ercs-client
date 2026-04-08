import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import airbnb from "eslint-config-airbnb";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importNewlines from "eslint-plugin-import-newlines";
import reactPlugin from 'eslint-plugin-react'
import reactCompiler from "eslint-plugin-react-compiler";


export default defineConfig([
  globalIgnores([
    "dist",
    "node_modules/",
    "build/",
    "coverage/",
    "codegen.ts",
    "generated/types/",
  ]),
  {
    files: ["app/**/*.tsx", "app/**/*.jsx", "app/**/*.ts", "app/**/*.js"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      'import-newlines': importNewlines,
      'import': importPlugin,
      "airbnb": airbnb,
      "react": reactPlugin,
      "react-compiler": reactCompiler, 
    },
    settings: {
      "react": {
        "version": "detect",
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"],
        },
      },
    },
    rules: {
      "react-refresh/only-export-components": "warn",

      "no-unused-vars": 0,
      "@typescript-eslint/no-unused-vars": 1,

      "no-use-before-define": 0,
      "@typescript-eslint/no-use-before-define": 1,

      "no-shadow": 0,
      "@typescript-eslint/no-shadow": ["error"],

      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.{ts,tsx}",
            "eslint.config.js",
            "postcss.config.cjs",
            "stylelint.config.cjs",
            "vite.config.ts",
          ],
          optionalDependencies: false,
        },
      ],

      indent: ["error", 4, { SwitchCase: 1 }],

      "import/no-cycle": [
        "error",
        { allowUnsafeDynamicCyclicDependency: true },
      ],

      "react/react-in-jsx-scope": "off",
      camelcase: "off",

      "react/jsx-indent": ["error", 4],
      "react/jsx-indent-props": ["error", 4],
      "react/jsx-filename-extension": [
        "error",
        { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      ],

      "import/extensions": ["off", "never"],
      "import/named": "warn",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "react/require-default-props": [
        "warn",
        { ignoreFunctionalComponents: true },
      ],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Side effect imports
            ["^\\u0000"],
            // React related packages come first
            ["^react", "^@?\\w"],
            // Internal packages
            ["^#.+$"],
            // Parent imports, other relative imports
            [
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
            ],
            // Style/asset imports
            ["^.+\\.json$", "^.+\\.module.css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "warn",
      "import-newlines/enforce": ["warn", 1],

      "react/jsx-props-no-spreading": "warn",
    },

  }
])
