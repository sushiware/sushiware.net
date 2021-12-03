+++
title = "print debug on motoko"
date = 2021-12-04
[taxonomies]
tags = ["dfinity", "motoko"]
+++

毎回 `motoko` でプリントデバッグをする方法を忘れてしまうのでメモ

```mo
import D "mo:base/Debug";
D.print(debug_show(("hello", 42, "world")))
```

参考:

- [Basic concepts and terms :: Internet Computer](https://smartcontracts.org/docs/language-guide/basic-concepts.html#intro-stdlib)

以上
