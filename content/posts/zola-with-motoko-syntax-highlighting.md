+++
title = "zola with motoko syntax highlighting"
date = 2021-12-03
[taxonomies]
tags = ["dfinity", "motoko"]
+++

zola に motoko の syntax highlight がなかったので追加する方法

1.　`motoko.sublime-syntax`ファイルを追加

```sh
.
├── content
├── public
├── sass
├── static
├── syntaxes
│   └── motoko.sublime-syntax # <- here
├── templates
└── themes
```

中身はこちらを拝借させていただく

<https://github.com/jingyuexing/sublime-Motoko/blob/master/Syntaxes/motoko.sublime-syntax>

2. `config.toml`に`extra_syntaxes = ["syntaxes"]`を追加

```toml
[markdown]
extra_syntaxes = ["syntaxes"]
```

これで下記のように書けば反映されるようになる

````
```motoko
let x = 42 + (1 * 37) / 12: Nat
```
````

```motoko
let x = 42 + (1 * 37) / 12: Nat
```

参考:

- [jingyuexing/sublime-Motoko](https://github.com/jingyuexing/sublime-Motoko)
- [Syntax Highlighting | Zola](https://www.getzola.org/documentation/content/syntax-highlighting/)

以上
