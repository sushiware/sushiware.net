+++
title = "long time no see, pandas. 2"
date = 2022-01-16
[taxonomies]
tags = ["python", "pandas"]
+++

[前回](./../long-time-no-see-pandas/)の続き、No.25 から No.50 まで。

## agg({'col2': ['sum', 'mean']})

同一のカラムに別の計算をしたい場合は、`agg`の引数`dict`の値を List にする。

適用するとカラムが[['col1', ''], ['col2', 'sum'], ['col2', 'mean']]のようになるのに注意。

## 統計関連

完全に専攻分野だが、ふわっとなっていたので一応メモ

- mean : 平均値
- median : 中央値
- mode : 最頻値
- 分散 : var
- 標準偏差 : std
  - ddof を 0 にすることで、標本偏差を計算する。
  - ddof を 1 にすることで、母標準偏差を計算する。

## query

`query`のメリットを新たに発見したのでメモ。

```diff
- s = df_receipt.groupby('store_cd')['amount'].mean().reset_index()
- s[s['amount'] >= 330]
+ df_receipt.groupby('store_cd').amount.mean().reset_index().query('amount >= 330')
```

途中まで色々いじった状態で絞り込みしたいときなのでは一時変数に保存する必要があるが、`query`は一時変数に保存する必要がない。

これはでかい。

## `~`

```diff
- hoge == False
+ ~hoge
```

これ忘れとった。

## duplicated

`duplicated`は重複している行を True で返却する

```python
df_receipt[~df_receipt.duplicated(subset=['customer_id', 'sales_ymd'])]
```

これで重複がなくなる。

## pivot_table

```python
pd.pivot_table(df, index='era', columns='gender_cd', values='amount', aggfunc='sum')
# 	era	male	female	unknown
# 0	10	1591.0	149836.0	4317.0
# 1	20	72940.0	1363724.0	44328.0
# 2	30	177322.0	693047.0	50441.0
# 3	40	19355.0	9320791.0	483512.0
# 4	50	54320.0	6685192.0	342923.0
# 5	60	272469.0	987741.0	71418.0
# 6	70	13435.0	29764.0	2427.0
# 7	80	46360.0	262923.0	5111.0
# 8	90	NaN	6260.0	NaN
```

こりゃ便利だ。

## set_index('col')

`col`がなくなることに注意。

## stack()

`stack()`は、カラムをすべて行に押し込む

これが

```
    unknown	female	male
era
10  4317.0	149836.0	1591.0
20  44328.0	1363724.0	72940.0
30  50441.0	693047.0	177322.0
40  483512.0	9320791.0	19355.0
50  342923.0	6685192.0	54320.0
60  71418.0	987741.0	272469.0
70  2427.0	29764.0	13435.0
80  5111.0	262923.0	46360.0
90  NaN	6260.0	NaN
```

こうなる

```
era
10   unknown       4317.0
     female      149836.0
     male          1591.0
20   unknown      44328.0
     female     1363724.0
     male         72940.0
30   unknown      50441.0
     female      693047.0
     male        177322.0
40   unknown     483512.0
     female     9320791.0
     male         19355.0
50   unknown     342923.0
     female     6685192.0
     male         54320.0
60   unknown      71418.0
     female      987741.0
     male        272469.0
70   unknown       2427.0
     female       29764.0
     male         13435.0
80   unknown       5111.0
     female      262923.0
     male         46360.0
90   female        6260.0
```

## pd.to_datetime

pandas にこんなのも入ってるなんてもりもり便利だなあ。

[100knocks-preprocess/preprocess_knock_Python.ipynb at nasjp/learn · nasjp/100knocks-preprocess](https://github.com/nasjp/100knocks-preprocess/blob/nasjp/learn/docker/work/preprocess_knock_Python.ipynb)

ここに自分がやったやつをおいておく。

以上
