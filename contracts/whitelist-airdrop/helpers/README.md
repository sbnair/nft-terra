merkle-airdrop-cli
==================

This is a helper client shipped along contract.
Use this to generate root, generate proofs and verify proofs

## Installation

```shell
yarn install
yarn link
```

Binary will be placed to path.

## Airdrop file format

```json
[
  { "address": "terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v", "amount": "1"},
  { "address": "terra1g3xwktwa6a3x7ynekz3nfqrglty59h5957m6v2", "amount": "1"},
]
```

## Commands

**Generate Root:**
```shell
~/.yarn/bin/merkle-airdrop-cli generateRoot --file ../testdata/airdrop_stage_1_list.json
```

**Generate proof:**
```shell
~/.yarn/bin/merkle-airdrop-cli generateProofs --file ../testdata/airdrop_stage_1_list.json \
  --address terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v \
  --amount 1
```

**Verify proof:**
```shell
PROOFS='[ "27e9b1ec8cb64709d0a8d3702344561674199fe81b885f1f9c9b2fb268795962","280777995d054081cbf208bccb70f8d736c1766b81d90a1fd21cd97d2d83a5cc","3946ea1758a5a2bf55bae1186168ad35aa0329805bc8bff1ca3d51345faec04a"
]'
merkle-airdrop-cli verifyProofs --file ../testdata/airdrop.json \
  --address terra1tt66jqq5u4xygxdw69nhk98jvrz0hjd4xaz766 \
  --amount 1 \
  --proofs $PROOFS
```
