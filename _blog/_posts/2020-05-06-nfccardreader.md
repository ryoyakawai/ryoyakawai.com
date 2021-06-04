---
layout: post
title: ブラウザで動く「交通系カードリーダアプリ」を作ってみた。
description: ""
date: 2020-05-06 00:00:00 +0900
modified: 2020-05-06
tags: [Web USB, Web, Google I/O]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
---

<div> </div>

[Web NFC](https://w3c.github.io/web-nfc/)を調べてて、実はWebUSBで[Sony PaSoRi（パソリ） RC-S380](https://bit.ly/35wE8nl)を読む為の[ドライバ](https://www.sony.co.jp/Products/felica/business/products/ICS-DCWC1.html)があることを知り、せっかく見つけたし、スマホ版のリーダはあるけど、ブラウザから読み取れるのは出会ったことがないので作り始めました。  
以下がアプリへのリンクですが、動作には「Sony PaSoRi（パソリ） RC-S380」が必須です。このリーダは公的認証にも使えるものなので、もしかすると最近は持ってる人は少なくないかも？とか思ってます。  
  
[交通系カードリーダ （ブラウザ版）](https://ryoyakawai.com/apps/nfccardreader/)  


<div class="post-image-center">
<a href="//ryoyakawai.com/apps/nfccardreader/" target="_blank" style="align-items:center; justify-content:center; display:flex;">
<img src="{{ site.url }}/images/2020/05/20200506-nfccardreader-00.png" width="48%" style="border-radius:4px; margin-right:2px"/>
</a>
</div>

仕様に関してはSonyさんが多くを公開してくださっていますし、その他はググる、GitHubのスマホアプリのコードを読んだりすることで何とかなりました。  
利用した資料等は以下です。ありがとうございます！！また参考にさせていただきます🙂  
- [技術情報 - Sony Japan - FeliCa ](https://www.sony.co.jp/Products/felica/business/tech-support/)
- [codebutler/farebot: Read data from public transit cards using your NFC Android phone!](https://github.com/codebutler/farebot)
- [[PASMO] FeliCa から情報を吸い出してみる - FeliCaの仕様編 - Qiita](https://qiita.com/YasuakiNakazawa/items/3109df682af2a7032f8d)

CSVエクスポートの機能だったり、他のカード、例えばサンフランシスコ周辺で使わるClipperカードを次に挑戦してみようかなと思ってます。
