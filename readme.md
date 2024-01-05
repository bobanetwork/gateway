<h1 align="center">Boba Gateway</h1>

<br />

<p align="center">
  <a href="https://gateway.boba.network/">
    <img alt="boba-logo" src="./boba-logo.svg" width="50%"/>
  </a>
</p>

<br />

<p align="center">The Boba Gateway helps users to bridge cryptos tokens from L1 to L2 and vice versa. </p>

<br />

# Contributing

Follow these instructions to set up your local development environment.

## :rocket: Getting started

Clone the repo

```bash
$ git clone git@github.com:bobanetwork/gateway.git
$ cd gateway
```

## Dependencies

You'll need the following:

- [Git](https://git-scm.com/downloads)
- [NodeJS](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

Ensure that you have installed and are using nodejs v16.16.0:

```bash
$ node --version
v16.16.0
```

If you have multiple versions of node installed and use nvm, ensure you are using nodejs v16.16.0

```bash
$ nvm use
```

Install nodejs packages with `yarn`:

```bash
$ yarn
$ yarn prepare # to setup husky on your local.
```

## Environment variable configuration.

Copy `.env.example` file and name by excluding `.example` and populate the variables listed below

| Environment Vars              | Required | Default Valu | Description                                                                                                                                                                                |
| ----------------------------- | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| REACT_APP_POLL_INTERVAL       | Yes      | 20000        | Interval to poll the fetch api about the records                                                                                                                                           |
| REACT_APP_WALLET_VERSION      | Yes      | N/A          | This will be useful while prepare the build.                                                                                                                                               |
| REACT_APP_ENV                 | Yes      | dev          | This will be used in case of sentry configuration.                                                                                                                                         |
| REACT_APP_GA4_MEASUREMENT_ID  | Yes      | N/A          | Google analytics api key                                                                                                                                                                   |
| REACT_APP_SENTRY_DSN          | Yes      | N/A          | Sentry DSN url to catch the error on frontend                                                                                                                                              |
| REACT_APP_GAS_POLL_INTERVAL   | Yes      | 30000        | Poll interval to fetch the gas price and verifier status                                                                                                                                   |
| REACT_APP_WC_PROJECT_ID=      | Yes      | N/A          | Wallet Connect project ID                                                                                                                                                                  |
| CYPRESS_REMOTE_DEBUGGING_PORT | Yes      | 9222         | Debugging port for Cypress                                                                                                                                                                 |
| NETWORK_NAME                  | Yes      | goerli       | Starting network for wallet                                                                                                                                                                |
| SECRET_WORDS                  | Yes      | N/A          | Secret phrase for wallet to be used by Cypress e2e test. Please note that this wallet should have at least .1 Goerli ETH and 40 Boba Testnet Token on the Goerli and Boba Goerli Networks. |
| CYPRESS_TEST_HASH             | Yes      | N/A          | Txn hash that has occured on the wallet in the last 6 months                                                                                                                               |

### To start local dev-server

```bash
$ yarn start
```

### To start the storybook server for previwing demo page

```bash
$ yarn start
```

### To fix formating

```bash
$ yarn format:fix
```

### To fix linting

```bash
$ yarn lint:fix
```

## Running Tests

Tests are executed via `yarn`:

```shell
$ yarn test
```

Run specific tests by giving a path to the file you want to run:

```shell
$ yarn test ./path-to-file/file.spec.ts
```

Watch for test file change with coverage report locally at same time.

```bash

$ yarn test:w <path-to-test-file> --coverage --collectCoverageFrom=<path-to-component/class>

```

eg.

```bash

$ yarn test:w src/components/layout/Footer/GasWatcher/index.test.tsx --coverage --collectCoverageFrom=src/components/layout/Footer/GasWatcher/index.tsx

```

## Measuring test coverage:

```bash
$ yarn test:coverage
```

The output is most easily viewable by opening the html file in your browser:

```bash
$ open ./coverage/index.html
```

## Integration Tests

To run the integration test against the gateway execute the command below

```bash
$ yarn test:integration
```

## Directory Structure

```
┌── .github/workflows          # Settings for GitHub Actions
├── .storybook                 # Storybook settings
├── .vscode                    # VSCode settings for ESLint auto-fix function
├── demo                       # Storybook static file
├── build                      # Bundled JS and TS declaration file for deployed npm package
├── public                     # Public file which
├── src                        # All source code
│    ├── src/actions           # Redux Actions.
│    ├── src/api               # React axios instance of api
│    ├── src/assets            # React assets includes files and images.
│    ├── src/components        # React components
│    ├── src/containers        # React containers
│    ├── src/deployment        # Contracts ABI
│    ├── src/fonts             # Application fonts
│    ├── src/hooks             # React hooks
│    ├── src/layout            # React Layout
│    ├── src/reducers          # Redux reducers
│    ├── src/selectors         # Redux selectors
│    ├── src/services          # React services
│    ├── src/store             # Redux Store
│    ├── src/stories           # React Stories
│    ├── src/themes            # Application theme
│    ├── src/types             # Custom typings for js modules if corresponding types are not found
│    ├── src/util              # Util files
│    └── index.tsx              # Production entry that exports all components
├── .babelrc.json              # babel configuration
├── .env.example               # Sample env file
├── .eslintignore              # Excluded files for ignoring Eslint
├── .eslintrc.js               # ESLint settings
├── .gitignore                 # Excluded files for ignoring Git version control
├── .prettierignore            # Excluded files for ignoring while running Prettier
├── .prettierrc.js             # Prettier settings
├── README.md                  # README
├── yarn.json                  # Package settings that locked the version of dependencies packages
├── package.json               # Package settings that listed dependencies packages, npm scripts, project name etc.
├── config-overrides.js        # settings for react app rewired
└── tsconfig.json              # TypeScript settings

```

## Naming branches

We are following branch names like `<type>/<issue>-<change-hint>`

```shell
# Type can be one of the following
add/ #adding new stuff
feat/ #adding new feature
chore/ #refactoring, removing, cleanup or documentation update
fix/ #fix for breaking changes
```

example

```shell
add/14-includes-readme
```

## Abi to Human readable abi.

Install boba network contracts and core contracts node packages.

```shell

yarn add @bobanetwork/core_contracts bobanetwork/contracts

```

```shell

node ./bin/abiCompressor.ts
```
