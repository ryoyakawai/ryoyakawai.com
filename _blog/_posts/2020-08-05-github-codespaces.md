---
layout: post
title: GitHub Codespacesを使ってみた。
description: ""
date: 2020-08-05 00:00:00 +0900
modified: 2020-08-05
tags: [GitHub, Tool]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
---

<div> </div>

## 短いまとめ
GitHub Codespacesを使ってみた時の感想です。

## 経緯
いつだったか忘れたけど「ブラウザ上のエディタで修正できりようになるよ〜。まずは招待制で始めるよん。」ってのを聞いてWaiting Listに入りました。
8月5日に「You're now in the Codespaces beta!」ってメールがGitHubさんから来たのですけど、私自身はメールの本文を読むまでは「なんだっけ？」というレベルの認識度でした。

## YouTubeで説明を聞いてみた

<div class="post-image-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/fQbH3meWNQ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

ビデオの中で自分で気になったところをまとめるとこんな感じでした。

- コンテナ内で動く
- GitHubのUIから起動できる
- エディタは今はVS Code（Visual Studio Code）だけだけど今後使えるIDE増やしていく予定
- Terminalも開ける
- Terminalからlocalhostとして実行したサーバにもアクセスできる

## 何に使おうか？
「このブログで使ってる[Jekyll](https://jekyllrb.com/)のコンパイルもできないかな？」とか考えていじってみました。まずはOS何？ってところでコレしてみたら、

```bash
$ cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
VERSION_CODENAME=stretch
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

ってことだったので、

```
$ apt-get update
```

してみて、Rubyをインストール（[インストール方法](https://qiita.com/ryoyakawai/items/63528990d1624a4a3bb0)）してみたら、無事に動きましたので、この記事は早速そこで書いてます。  
なお、ネットワークが問題なのかもしれないのだけど、接続が切れて再接続を要求されることがまれに発生しております。

## 感想
まだJekyllしか試してないけど、込み入った開発は厳しいかもだけど使い方に依っては便利に使えそう、という感想です。あと、VS CodeでPackageを公開することに対しては未来がありそう、という印象です。  
何はともあれ今後に期待。というか「emacsだったりviはIDEですか？」って聞いてみたいw
あと、このコンテナっていつまで保持されるんだろう？というのも気になるところですが、追って調査するということにします。