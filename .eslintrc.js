module.exports = {
  root: true,
  extends: [
    // "prettier",
    // "plugin:prettier/recommended"
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  plugins: [
    // "prettier",
    "react"
  ],
  env: {
    node: true,
    browser: true,
    es6: true
  },
  parser: "babel-eslint",
  parserOptions: {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  globals: {
    "M7PREFIX": true,
    "m7": true,
    "require": true,
    "module": true
  },
  /* 0:off 1:warn 2:error */
  rules: {
    // "prettier/prettier": "error",
    "no-console": 0,
    "no-alert": 1,
    "no-duplicate-case": 1,
    "semi": [1, "always"], // 必须在语句后面加分号
    "react/no-deprecated": 1,
    "react/no-typos": 1,
    "react/no-unknown-property": 1,
    "react/prefer-es6-class": [1, "always"],
    "react/prop-types": 0,
    "react/jsx-no-undef": 1,
  },
  "parserOptions": {
    "ecmaFeatures": {
      "legacyDecorators": true
    }
  }
};