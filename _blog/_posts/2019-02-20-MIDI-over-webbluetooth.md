---
layout: post
title: Web Bluetooth経由でBluetooth MIDIデバイスを使う
description: ""
date: 2019-02-20 00:00:00 +0900
modified: 2019-02-20
tags: [WebMusic, WebBluetooth, MIDI]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
---

<div> </div>

2019年2月19日に[「JSで制御するBluetoothと基板の勉強会（html5jロボット部 第11回 勉強会）」](https://html5j-robot.connpass.com/event/117812/)というイベントでBluetooth MIDI機器をWeb Bluetooth経由で利用に関してLTさせていただきました！
久々でとても緊張でしたがデモも無事に動いてホッとしました。制限時間5分のところを1分超過してしまいすみませんでした＞＜  
ありがとうございました！＆スタッフの皆様お疲れ様でした！

今回の[アプリはこちら](https://ryoyakawai.com/apps/midimsgv/)です。[コードはここ](https://github.com/ryoyakawai/midimessageviewer)。  
以前作成したアプリをWeb BluetoothでもMIDIに対応してみました。
<div class="post-image-center">
<a href="https://ryoyakawai.com/apps/midimsgv/">
<img src="{{ site.url }}/images/2019/02/20190219_webbluetooth.png" width="100%" />
</a>
</div>

技術的な詳細は[Qiitaに記事としてこちら](https://qiita.com/ryoyakawai/items/200b3b05d8bd0096f68d)にまとめたので、気になる方はそちらを御覧ください！気がついたら結局ライブラリにしていたので公開することにしました。ご自由にお使い下さい。

日進月歩でブラウザでできることが増えて来て本当にうれしいです。  
ウェブって本当にいいですねっ👍
