+++
title = "time to go mysql driver"
date = 2022-02-07
[taxonomies]
tags = ["go", "mysql", "go-mysql-driver"]
+++

[go-sql-driver/mysql](https://github.com/go-sql-driver/mysql)と time.Time についての疑問

MySQL の DATETIME のクエリにはタイムゾーンの指定はできない。

常にタイムゾーンを考慮した上で`YYYY-MM-DD HH:MM:SS[.fraction]`のような形式で指定する必要がある。

例えば、JSON で`RFC3339`形式で受け取った`2022-01-01T10:00:00+09:00`は

MySQL の DATETIME のクエリでは`2022-01-01 01:00:00`に変化して実行しなければならない。(MySQL のタイムゾーンが UTC の場合)

でも

```go
db.Query(`SELECT * FROM users WHERE created_at = ?`, from.UTC())
```

みたいなことはしなくても良い。

なぜだろう。

コードを読んでみたところ下記で、MySQL のタイムゾーンに変換する箇所があった。

```go
buf, err = appendDateTime(buf, v.In(mc.cfg.Loc))
```

[mysql/connection.go](https://github.com/go-sql-driver/mysql/blob/master/connection.go#L249)

これで安心してそのままクエリに放りこめる。
