+++
title = "long time no see, pandas."
date = 2022-01-14
[taxonomies]
tags = ["python", "pandas"]
+++

プログラミングを初めて間もない頃に、pandas をちょろっと触っていたが、完全に忘れていた。

久しぶりに触って、最初に感じたのとは異なり、「便利やん]となった。

やったのは[nasjp/100knocks-preprocess: データサイエンス 100 本ノック（構造化データ加工編）](https://github.com/nasjp/100knocks-preprocess)

まずは No.25 までやったので、その中でつまずいたり、「へーそだっけ]となったものをメモ

## `df[["col1", "col2"]]`

```diff
- df_receipt.loc[:, ['sales_ymd', 'customer_id', 'product_cd', 'amount']].head(10)
+ df_receipt[['sales_ymd', 'customer_id', 'product_cd', 'amount']].head(10)
```

別に良いのだが、`DataFrame.loc`ではなく、列つまむときは`loc`は使わなくても良い。SQL ライク。

`DataFrame.loc`は行をつまむときに使う。

一つのカラムだけ取って`Series`で返す場合は下記のどれでも良い。

```python
df_receipt['sales_ymd'].head(10)
df_receipt.sales_ymd.head(10)
df_receipt.loc[:, 'sales_ymd'].head(10)
```

## 改行

これは、永遠の問題であり、現代ではどうでも良くなっているのかもしれないが、これはどっちが良いのか僕にはわからない。

```diff
- df_receipt[['sales_ymd', 'customer_id', 'product_cd', 'amount']].rename(columns={'sales_ymd': 'sales_date'}).head(10)
+ df_receipt[['sales_ymd', 'customer_id', 'product_cd', 'amount']]. \
+                       rename(columns={'sales_ymd': 'sales_date'}).head(10)
```

改行は`\`を使ったり、`.`のあとに何も来なかったり気持ち悪いと思ってしまう。

逆に一行は長すぎと思う人もいるだろう。

Go では、メソッドのチェーンが起こることがあまりないから、この問題にはあまりぶち当たらない。

まあ、一旦考えないことにする

## query

回答では`DataFrame.query`を多用している。

```diff
- df_receipt[df_receipt['customer_id'] == 'CS018205000001']
+ df_receipt.query('customer_id == "CS018205000001"')
```

「僕はあまり使いたくないなあ」、と感じた。

型情報が失われてしまうのは抵抗がある。

変数を使いたい場合はこんな感じになるだろうか。

```python
df_receipt.query(f'customer_id == "{customer_id}"')
```

これも結局短くなるので、`DataFrame.query`を使うべきかも。

でも`mypy`の静的解析とかは使えなくなるのかもなあ。

## aggregate

```diff
- pd.concat(
- 	[
- 		df_receipt.groupby('store_cd')['amount'].sum(),
- 		df_receipt.groupby('store_cd')['quantity'].sum(),
- 	],
- 	axis='columns'
- )
+ df_receipt.groupby('store_cd').agg({'amount':'sum',
+                                   'quantity':'sum'}).reset_index()
```

適用したい処理を飛び道具的に適用できる。知らんかった。

## rank

```python
df_receipt.rank()
```

挙動がパッと理解できなかったが、列単位の順位をランキングにして、値をそのランキングに変えたものを返却する。

## reset_index

```diff
- df_receipt.groupby('customer_id')['sales_ymd'].max()
+ df_receipt.groupby('customer_id')['sales_ymd'].reset_index().max()
```

`reset_index`は現在の`index`を新しい列として追加した上で、`index`が付与されるっぽい。

さらに面白いのが、`reset_index`の呼び元が`Series`なら`DataFrame`にして返す。

[100knocks-preprocess/preprocess_knock_Python.ipynb at nasjp/learn · nasjp/100knocks-preprocess](https://github.com/nasjp/100knocks-preprocess/blob/nasjp/learn/docker/work/preprocess_knock_Python.ipynb)

ここに自分がやったやつをおいておく。

以上
