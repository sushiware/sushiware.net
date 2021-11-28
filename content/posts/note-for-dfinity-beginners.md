+++
title = "a note for dfinity beginners"
date = 2021-11-29
draft = true
[taxonomies]
tags = ["dfinity"]
+++

## canister 全部入り(create, build, install)コマンド

```sh
# dfx canister create && dfx build && dfx canister install
dfx deploy
```

## Candid UI

下記でアクセス

call を試せる

```sh
echo "http://localhost:8000/?canisterId=$(dfx canister id __Candid_UI)&id=$(dfx canister id {{canister name}})" | pbcopy
```
