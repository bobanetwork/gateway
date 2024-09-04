# Integration Test : Boba Gateway!

Integration test are only running against the chromium browser!

# Prerequesitis.

`nvm v 18+`

## How to run

- `nvm use`
- `pnpm install`
- `pnpm install:chromium`
- `pnpm start:server`
- `pnpm test` or `pnpm test:headless`


## Generating Tests.
 playwright has ability to generate tests out of the box using codegen.
 
```ssh
pnpm codegen
```

## To run the test
 playwright has ability to generate tests out of the box using codegen.
 
```ssh
pnpm test
```

## To run the test in UI mode.
 playwright has ability to generate tests out of the box using codegen.
 
```ssh
pnpm test:ui
```

## To run the test in headless mode
 playwright has ability to generate tests out of the box using codegen.
 
```ssh
pnpm test:headless
```

Reference for chains to be listed.
[chains list](https://github.com/wevm/viem/blob/main/src/chains/index.ts)
