+++
title = "fleek with zola"
date = 2021-11-28
[taxonomies]
tags = ["zola", "fleek", "dfinity"]
+++

dfinity ネットワーク上の netlify である、[fleek](https://fleek.co/)にこのブログをデプロイしてみたので、その時のメモ

## fleek の雰囲気

- netlify とほとんど変わらない使用感
- docker image を使用した build を前提としている
- custom domain の設定も可能
- API キーの生成がプロジェクトごとではなく、共通で使用できるのが少し不安
- ipfs と dfinity いずれかを選択できる
  - 静的サイトは ipfs、それ以外は dfinity という形になるだろう
  - このブログは静的サイトだが、気分で dfinity を採用

## 詰まったポイント

fleek の Build 設定で、Build command を設定する箇所があるのだが、これは Dockerfile の CMD をオーバライドしていると思われる。

```dockerfile
FROM hoge

...

CMD ["hoge"]
```

おそらくこんな感じのプロセスが fleek で動いている

```sh
docker run -v $PWD:/app --workdir /app {docker_image} /bin/sh -c "{build_cmd}"
```

しかし、下記のような ENTRYPOINT の設定がある Dockerfile の場合、それが優先されるのでうまくいかない

```dockerfile
FROM hoge

...

ENTRYPOINT ["hoge"]
```

実際に実行されるコマンドは`hoge /bin/sh -c "{build_cmd}"` となってしまう。

このブログで使用している zola の[Dockerfile](https://github.com/getzola/zola/blob/master/Dockerfile)も ENTRYPOINT を使用しているので、うまくいかなかった。

なので、ENTRYPOINT を使用しない下記の Dockerfile を作成し、ビルドした image を fleek で設定することで解決

```dockerfile
FROM alpine:3.14

RUN apk add zola --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/
```

使用している image は[こちら](https://github.com/orgs/sushiware/packages/container/package/zola/zola)

## 思ったこと

github action で build => ipfs に build 済みのファイルをデプロイとできると良いのだが

fleek ではまだできないっぽい。

internet computer 上に build のパイプラインがあった方が良いということなのだろうか。

以上
