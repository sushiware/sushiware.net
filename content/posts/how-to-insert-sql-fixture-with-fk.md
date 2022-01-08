+++
title = "how to insert sql fixture with foreign key"
date = 2022-01-08
[taxonomies]
tags = ["sql", "go"]
+++

GoでDB周りのテストツールを作りたくなり、fixtureの機能を作っていたときのこと。。。

外部キー制約のあるDBの場合、INSERTの順番を気にしたりするのだろうか、と思い。

既存の[go-testfixtures](https://github.com/go-testfixtures)を覗いてみた。

[mysql.go](https://github.com/go-testfixtures/testfixtures/blob/master/mysql.go#L75-L103)

```go
func (h *mySQL) disableReferentialIntegrity(db *sql.DB, loadFn loadFunction) (err error) {
	...
	tx, err := db.Begin()
	...
	if _, err = tx.Exec("SET FOREIGN_KEY_CHECKS = 0"); err != nil {
		return err
	}

	err = loadFn(tx)
	_, err2 := tx.Exec("SET FOREIGN_KEY_CHECKS = 1")
	...
	return tx.Commit()
}
```

`SET FOREIGN_KEY_CHECKS = 0`を実行して、外部キー制約を無効にして、テストデータをロードしていた。

そのあと`SET FOREIGN_KEY_CHECKS = 1`で戻す。

ニャルほどです。

以上
