+++
title = "terraform plan by file"
date = 2022-02-25
[taxonomies]
tags = ["terraform"]
+++

`terraform`では現状、リソースあるいはモジュールを指定してしか、限定した `plan`,`apply` を行うことができない。

ファイルに記述されたすべてのリソースとモジュールに対して `plan`,`apply` を実行できるようにしたい。

なのでスクリプトを書いた。

```sh
#!/usr/bin/bash

filename=$1

target_resource_flags=$(cat ${filename} | terraform fmt - | grep -E 'resource ' | tr -d '"' | awk '{printf("-target=%s.%s ",$2,$3);}')
target_module_flags=$(cat ${filename} | terraform fmt - | grep -E 'module ' | tr -d '"' | awk '{printf("-target=%s.%s ",$1,$2);}')

echo "Running 'terraform plan ${target_resource_flags} ${target_module_flags} | landscape'"
terraform plan ${target_flags} | landscape
```

これを`plan_file.sh`として保存し、`./plan_file.sh hoge.tf`を実行すれば快適な`plan`生活を手にすることが可能。

以上
