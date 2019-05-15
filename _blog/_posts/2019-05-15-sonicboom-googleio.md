---
layout: post
title: Sonic Boom! (Google I/O'19)
description: ""
date: 2019-05-15 00:00:00 +0900
modified: 2019-05-15
tags: [Web Audio API, Web MIDI API, Web Music, Android, Google I/O 2019]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
---

<br>
2019年5月7〜9日まで、毎年Google社が米国カリフォルニア州で開催している開発者会議「Google I/O」に参加してきました。  
<br>
その中でも**「これは！！」**と感じたセッションを紹介していこうと思います。
<br>  
第一弾は**「[Sonic Boom! Audio Programming on Android and Chrome](https://events.google.com/io/schedule/events/ad90afc2-bf1f-4318-abc0-d7e8df67bf07)」**です。<br>
「Step by StepでAndroid、Webでのコーディング方法を追うことができる」という意味で、開発を行うのには非常に参考になると思っています。<br>
（[デジタルハーツ](https://www.digitalhearts.com/)所属としての参加なのに、アプリケーションテストの内容でなくてごめんなさい😅）
<br>  
セッションの動画は↓です。  
<div class="post-image-center" style="box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);">
<iframe width="560" height="315" src="https://www.youtube.com/embed/-GaD0RCp-Q0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## セッションの概要
端的に説明すると、UIパーツはそれぞれのプラットフォーム（AndroidとWeb）で開発するものの、オーディオエンジンはC++で書かれたコードを共有して同じアプリを
ライブコーディングで作ってしまう、という内容です。  
C++で書かれたオーディオエンジンを走らせる部分を技術用語で表現すると、
- Android：[NDK（Native Development Kit）](https://ja.wikipedia.org/wiki/Native_development_Kit)
- Web（Chrome）：[WebAssembly(WASM)](https://ja.wikipedia.org/wiki/WebAssembly)

で実行することになります。
  
それでは、内容を説明してきます。（動画のタイムラインと前後する部分があります）

## プレゼンター
- [Magnus Berger](https://events.google.com/io/schedule/events/speakers/6f16d338-6253-4322-a12c-bef1ffb12d0e)：CTO at Propellerhead Software
- [Hongchan Choi](https://events.google.com/io/schedule/events/speakers/ec237b6e-e701-464f-933e-a3a11324231d)：Software Engineer(Chrome) at Google
- [Don Turner](https://events.google.com/io/schedule/events/speakers/364a11ff-ba21-423c-9730-5aa9347c2c29)：Developer Advocate(Android) at Google

## 背景など
AndroidとChromeの話を同時にするのは少し奇妙だが以下のような同じ構造だったり、背景があるとのことです。

- システム：Callbackを基本としたオーディオを再生する仕組みを持っている
- 遅延：Audio Latency（往復の）が約20ミリ秒（Pixelデバイス）
- MIDIサポート：AndroidはMidiManagerAPI、またAndroid QからはハイパフォーマンスなAMidiが搭載され、Chromeでは2015年からWeb MIDI APIでサポートされている
- Activeユーザー：AndroidもChromeもそれぞれ20億人以上

そしてこれらの利点を活かしている1つの良い例が[BandLab](https://www.bandlab.com/)というマルチプラットフォームで提供されている音楽制作アプリっとのことで
紹介されています。（2:49）  
BandLabはSocial Music Platformで、クロスプラットフォーム（スマホ、Web向け）に提供しており、録音、編集の作業を物理的な場所、プラットフォームを問わず
どこでも行うことが可能。そして作成したデータはクラウドに保存される仕組みです。現在**700万のユーザ**が登録しており、**200万の曲が毎月**がこのプラットフォームに
保存されているそうです。<br>
BandLabが目指す世界は、**どこにいても物理的場所、デバイス、時間等の境界を考えることなく音楽を作ることのできる環境を提供し、
音楽制作を更に民主化すること**、とのこと。

## ライブコーディング
実装する対象の条件はは以下の通りです。

- オーディオエンジンはC++のコード[Oboe](https://github.com/google/oboe)を利用
- MIDIで操作できるように実装

また、プラットフォームはAndroidとWeb（Chrome）です。  
  
実装完了しているコードではありませんが、コードが[GitHub](https://github.com/googlesamples/io19-sonic-boom)に公開されていますので、
細かく説明するよりもコードを片手に動画を見たほうがわかりやすいと思うので時間を記録していきます。  
  
### ＊ Android側のコーディング
オーディオエンジンを実装 (7:05 - )  
- [[Android/app/src/main/cpp/AudioEngine.h]](https://github.com/googlesamples/io19-sonic-boom/blob/master/Android/app/src/main/cpp/AudioEngine.h)
- [[Android/app/src/main/cpp/AudioEngine.cpp]](https://github.com/googlesamples/io19-sonic-boom/blob/master/Android/app/src/main/cpp/AudioEngine.cpp) 

MIDIデバイスと接続 (27:27 - )
- [[Android/app/src/main/cpp/AudioEngine.cpp]](https://github.com/googlesamples/io19-sonic-boom/blob/master/Android/app/src/main/cpp/AudioEngine.cpp) 
- [[Android/app/src/main/java/com/example/io19/sonicboom/MainActivity.java]](https://github.com/googlesamples/io19-sonic-boom/blob/master/Android/app/src/main/java/com/example/io19/sonicboom/MainActivity.java)


### ＊ ブラウザ側の説明とコーディング
ここでブラウザとC++で何が起こるのか？についての説明が入ります。(12:15 - )  
先程Android側で実装した`Synthesizer.h`を使うけど、これをLLVMベースのコンパイラであるEmscriptenにコンパイルしWeb Assemblyの`synthesizer.wasm.js`を生成する。
この`synthesizer.wasm.js`は`Synthesizer.h`で公開メソッドとして持っていた`synth.noteOn()`, `synth.noteOff()`, `synth.render()`を同じく
公開メソッドとしてして持つことになるが、残念ながらここだけは自動では生成してくれないので[EmscriptenでAPIをバインドするC++のコード](https://github.com/googlesamples/io19-sonic-boom/blob/master/Chrome/wasm/synth_bind.cc)を1つ追加することになります。  
<br>
続いてブラウザ側で鳴らす方法、それはJavaSciptからWeb Audio APIでAudioレンダリングを可能にするAudio Workletを使います。
なお、このAudio Workletはブラウザのメインスレッド上で動作はしないが、メインスレッドと同調して動作するスレッドです。  
具体的には以下の流れで動作をさせることになります。  

- `synthesizer.wasm.js`をAudio Worklet ProcessorでWrap
- Audioスレッドで動作している↑とメインスレッドとはPortと呼ばれる仕組みでデータのやり取りを行いブラウザで発声

<br>
ここからがコーディング。  
  
- Wrapしてコンパイル (15:04 - ) [[Synthesizer.hをバインドするC++]](https://github.com/googlesamples/io19-sonic-boom/blob/master/Chrome/wasm/synth_bind.cc)
- Audio Workletの実装 (17:20 - ) [[SynthProcessor.js]](https://github.com/googlesamples/io19-sonic-boom/blob/master/Chrome/SynthProcessor.js)
- メインファイルの実装 (20:39 - ) [[index.js]](https://github.com/googlesamples/io19-sonic-boom/blob/master/Chrome/index.js)
- MIDIデバイスと接続する (23:31 - ) [[index.js]](https://github.com/googlesamples/io19-sonic-boom/blob/master/Chrome/index.js)



## 出来上がったところでセッション
同じオーディオエンジンで作製したAndroidとWebのアプリでのセッション。(32:05 - )
<div class="post-image-center">
<img src="{{ site.url }}/images/2019/05/20190515_io19_02.png" />
</div>


## 事例の紹介
物理的場所を問わず、どこからでも、誰でも、また共有前提として利用できるプラットフォームであるWeb、
そしてそのプラットフォーム上の音楽制作ツール、とてつもなく大きなコミュニティを持つAndroidが音楽という国境のないツールに対して
音楽制作、またハイエンド・オーディオの分野でどれだけのポテンシャルを持っているか、の裏付けの説明が主でした。

### ・Propellerhead
25年間、音楽向けのアプリを作っている会社でReasonがもっとも知られているソフトウェア。WindowsとmacOS向けのソフトウェアがあり、このソフトウェアシンセサイザをWeb Assenblyを使ってブラウザ上で動作するように移植した。
ブラウザで動くことによって、より多くの人が音を使って自らを表現する機会が増えるといいな、というのが希望がPropellerheadにはあるとのこと。

### ・IZOTOPR
信号処理のプラグインを開発する会社であるが、Spire Studioという**モバイルの録音デバイス**を発売した。
このデバイス向けのAndroidアプリも公開したところ40％売上が上がった。この事実からもAndroidユーザがハイエンドのオーディオハードウェアを手にすることを
求めていることが分かると思う。

### ・Music World Media
数年前にパリで生まれたとても小さい（tiny）Startupで、いろいろなアプリを作っている。
その結果として過去12ヶ月間で235カ国の4500万のAndroidユーザに新規でリーチすることができた。
このことからもAndroidには音楽業界においても多くのユーザにリーチできるポテンシャルを持っていることが証明できていると思う。

### ・Ableton
Web上での音楽制作ツールは増えてきている。そしてAbletonは[音楽制作の教育ツール](learningmusic.ableton.com)を公開している。
ここから市販の制作ツールであるAbleton Liveも学ぶことができる。

## 終わりに
まとめです。
- AndroidもWeb（Chrome）の両方がリアルタイムオーディオレンダリング、そしてMIDIサポートが可能
- AndroidとChromeで同じソースコードを使うことが可能
- 商業的にも、Android、そしてWebから多くのユーザにリーチすることが可能
- **音楽には国境はない。どこにいようとも、文化背景・経済状態がどうであろうとも境界はなく、だからこそ人々が境界なく対話することが可能**
- 皆さんのプログラミングスキルでどんな音楽を作ることだってサポートすることが可能  

ということから、聞くだけでなく、それを使ってコミュニケーションをすることをしてきましょう！と締めています。

## 個人的な感想
C++のコードからWeb Assemblyに移植するのにはヒトテマ必要であることはライブコーディングからは分かりました。
そして「Web Audioでは音楽アプリはレイテンシーが・・・」と指摘されている部分にWeb Assemblyは一石を投じるのも遠い未来ではないように感じる、
同時にWeb Assemblyを使うことは、そこまで難しいことでもないことを感じることができたセッションであった、
という意味では非常に意味のあるセッションだったと感じています。<br>
<br>
さてセッションの主役のWeb Assenbly、Web Audio/MIDIの仕様を決めるW3C、その年次会議である[TPACの2019年開催は日本の福岡](https://www.w3.org/2019/09/TPAC/)です。
その前後にいろいろなイベントが日本で開催されるかもで、今からワクワクしちゃいますね！
