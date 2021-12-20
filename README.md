# Cosmons - An NFT Example for Managing Digital Collectibles

## How to Build

In order to optimize your smart contracts, you have to use:

```shell
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/workspace-optimizer:0.12.3
```
```Run
node deploy.js
```


