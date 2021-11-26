+++
title = "getting started with dfinity"
date = 2021-11-26
[taxonomies]
tags = ["dfinity"]
+++

[difinity](https://dfinity.org) を触って local 開発を進めるためのメモ書き

# 1. プロジェクト作成

`dfx new hoge`

`dfx new`で作成したデフォルトプロジェクトには`dfx.json`という設定ファイルがあり、フロントエンドとバックエンドの設定が既に記述されている

```jsonc
// cat dfx.json | jq '.canisters | keys'
[
  "hoge", // バックエンド
  "hoge_assets" // フロントエンド
]
```

`dfx.json`を眺めてるとなんとなく全体感が掴める

# 2. canister を作成

`dfx canister create`

ネットワークにデプロイするアプリケーションの単位である canister を作成する

フロントエンドとバックエンドは別々に作成する

`dfx canister create --all`でいっぺんに作れる

# 3. build

`dfx build`

コードを wasm に build する

# 4. deploy

`dfx canister install --all`

これで canister を呼び出せる状態になる

```sh
dfx canister call hoge greet '("everyone": text)'
("Hello, everyone!")
```

# 5. run frontend

npm start でフロントエンドを起動する

# 6. access frontend

canister の id を指定してアクセスする

`http://127.0.0.1:8080?canisterId={canisterId}`

local では frontend と backend の canisterId は同じになるので下記にアクセスすれば OK

```sh
echo "http://127.0.0.1:8080?canisterId=$(dfx canister id $(basename $(pwd)))"
```

以上
