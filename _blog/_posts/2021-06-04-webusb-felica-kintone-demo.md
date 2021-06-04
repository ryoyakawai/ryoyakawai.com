---
layout: post
title: Web USBを使ってSuicaを読み取りWebアプリに入力する。
description: ""
date: 2021-06-04 00:00:00 +0900
modified: 2021-06-04
tags: [Web USB, felica, kintone]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
---

<div> </div>

## これは何？
Web USBで接続したNFCカードリーダからSuicaの情報を読み取ってWebアプリに入力するデモです。  
入力先のWebアプリは開発者向けのアカウントを用意してくださっている<a href="https://www.cybozu.com/" target="_blank">サイボウズ社</a>の<a href="https://kintone.cybozu.co.jp/" target="_blank">kintone</a>を利用しました。

## 経緯
1年ほど前にSuicaを読む<a href="https://ryoyakawai.com/apps/nfccardreader/" target="_blank">[Webアプリ]</a> <a href="https://ryoyakawai.com/blog/2020/05/06/nfccardreader.html" target="_blank">[Blog]</a> を公開しています。今回はその続編で「現実的なユースケース」を入れてより身近に感じられるようにしてみた、という感じです。
  
あっ、それからGoogle I/O 2021にも刺激されて「何かしたい」と感じたのも1つの経緯ですね（汗）この辺りを観て刺激されています。  

- <a href="https://www.youtube.com/watch?v=0UiaD059eqM" target="_blank">What's new for the web platform | Keynote</a>
- <a href="https://www.youtube.com/watch?v=EK1AkxgQwro" target="_blank">Excalidraw and Fugu: Improving core user journeys | Session</a>

「NativeアプリでできることをWebでも可能にしたい！」という考えで動いている Project Fugu🐡（Web Capabilities Project） は個人的にとても良いなー、っていつも思っています。Web MIDIに思い入れが強いし、Web＆デバイスが好きだからこそかもしれませんけど、とにかくWebの未来を感じるしワクワクしますw  
ちなみに、Project Fuguの現在の状況はこんな感じです → <a href="https://fugu-tracker.web.app/" target="_blank">Fugu API Tracker</a>


## デモ動画
デモの中では<a href="https://www.sony.co.jp/Products/felica/business/products/RC-S380.html" target="_blank">Sony社のRC-S380/sというカードリーダ</a>を使っていまして、入力は以下の3ステップ。

1. カードリーダを接続
2. 読み込みたいカードをカードリーダに乗せる
2. kintoneアプリ内の読み込みボタンをタップ
3. 入力したいテキストエリアにフォーカスして、入力したい項目をクリック

扱いはとても簡単です。こんな機能が出張精算のアプリにに組み込まれたら便利だなー、と思います。  
「現代は多くの人がモバイルSuicaだよねーっ！」という難点はありますw
<div class="post-image-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/P6vl_s74_kU?start=51" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
  
動画内の右上のカメラの映像は<a href="https://twitter.com/massie_g" target="_blanl">@massie_g</a>の<a href="https://qiita.com/massie_g/items/b9863e4366cfed339528" target="_blank">「WebRTCに使うデバイスを選択するには（＋おまけ）」</a>に書いてあったWebアプリを使わせていただきました。PinPもできてすごく便利でした！ありがとうございました！

## 感想
いろいろありコードが公開できないのが残念ですが、Webの未来が少しでも見てもらえたなら嬉しいです。  
そして、Web USBじゃないけど、、、kintoneの柔軟性に驚きました。JavaScriptを使うことはできるけど、何か制約があってWeb USBとか使えないかも、、、と思ってましたがあっさり動作してビックリ。kintoneは業務用途のアプリケーションプラットフォームなので、バーコードを読むハンディースキャナとか、その他のデバイスをWeb USBだったり、Web Bluetoothなどを経由して使えるようになると、もっともっと業務効率化のネタが出てきてをおもしろいんじゃないかな？なんてWebとデバイス好きな自分は感じました。


