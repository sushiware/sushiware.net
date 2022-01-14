+++
title = "VisualStudio build tools C++ Compiler on Mac OS"
date = 2022-01-12
draft = true
[taxonomies]
tags = ["mac", "visual studio", "build tools", "c++", "compiler"]
+++

Mac OS 上で

```sh
brew install vagrant virtualbox
git clone github.com/StefanScherer/windows-docker-machine
cd github.com/StefanScherer/windows-docker-machine
vagrant up 2019-box
docker context ls
docker context use 2019-box
docker run -it -v C:$(pwd):C:$(pwd) -w C:$(pwd) mcr.microsoft.com/windows/servercore:ltsc2019 powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')) # https://chocolatey.org/install
choco install bazel -y
```

vagrant up 2019-box
