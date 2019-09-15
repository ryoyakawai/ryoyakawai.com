---
layout: post
title: Immersive Web Meetupを開催したよ！
description: ""
date: 2019-09-13 00:00:00 +0900
modified: 2019-09-15
tags: [Web Music, WebXR,  Meetup]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
#---------------------
# 2010年9月：AudioContextの実装がChromiumにコミットされる(WebKitへ)
# 2011年6月：W3CのAudio WGへ仕様がコミットされる
# 2012年12月：Web MIDI APIがChromiumにコミットされる
# 2013年7月：W3Cでのレビュー（TAGによる）されるがScriptProcessorNode等の問題が指摘される
# 2015年4月：Audio WorkerがScriptProcessorNodeで置き換える議論が始まったものの動作時の問題でボツとなる
# 2016年6月：Audio Workletが考案されてAudio WGに受け入れられ、TAGに指摘された大きな問題が解決された
# 2017年11月 TAGにも受け入れられ、12月にAudio WorkletがChromeに公開された（M64）
# 2018年9月：W3Cの標準化プロセスのゴール3つ前（とはいえほぼ仕様は完成したとなる段階）のCandidate Recomandationに進む
---

<div style="margin-bottom:5px"> </div>

2019年9月13日（金）にメルカリさんで「Immersive Web Meetup」を開催しました。  
9月16日から1週間の日程でTPAC（W3C年次会議）が福岡であり、せっかくの機会なのでTPACに参加されるついでに東京に立ち寄るW3C関係者の方々をお招きして
コミュニティに向けてお話をしていていただきたい！と想いを込めて企画しました。2015年にTPACが札幌であったときにも[Web Music Developer Meetup@札幌](https://dev.classmethod.jp/event/web-music-developer-meetup-sapporo-report/)と題して札幌で開催しています。懐かしいです。  

## 展示も行いました！
映像のXRと音楽のAudi、MIDIという区分で切らず、2つを混ぜ合わせたMeetupにすることで「Immersiveな世界はウェブでも実現できる」をより実感ことを目標にして展示枠も設け、当日は以下の5つが展示していただきました。

- AR切り絵 - AR Clock Tower, 着せ替え天気予報 by <a href="https://www.twitter.com/kageori_w" target="_blank">@kageori_w</a>
- webARであそぶ！デジタルファッション by <a href="https://www.twitter.com/saharu54" target="_blank">@saharu54</a>
- Web360Square by <a href="https://www.twitter.com/AtonKish" target="_blank">@AtonKish</a>
- Sound Engine for Web Based Novel Game by <a href="https://www.twitter.com/g200kg" target="_blank">@g200kg</a>
- 音に反応して動くMIDIコンバータ by <a href="https://www.twitter.com/sascacci" target="_blank">@sascacci</a>
- Web360Square by <a href="https://www.twitter.com/AtonKish" target="_blank">@AtonKish</a>

Meetupでの展示というのは、個人的には初の試みでしたがやはり対象のAPIが「見て、聞いて」という感じるが主体なこともありかなりの人だかりで盛り上がってて大成功でした！なのですが、非常に残念ながら写真撮影を失念、、、、という大失態。写真でのご紹介ができなくて非常に残念です・・・ごめんなさい。

## Talk Session
お話をしてくださったのは、[Hongchan Choi](https://twitter.com/hochsays)、[Chris Wilson](https://twitter.com/cwilso)、それから[羽賀 流登](https://twitter.com/Mxcn3)さんの3名です。

###  「9 Years of Web Audio」 - Hongchan Choi
[（スライドはこちら）](https://docs.google.com/presentation/d/1dlZ3ThCDsYqv6QEuDi07tkK0KC3D3IxfNY4uhHa2KPc/)  
<div class="post-image-center" style="display:flex;flex-direction:row;align-items:flex-start; margin-bottom:0">
<div>
<img src="{{ site.url }}/images/2019/09/20190913_01.png" width="180px" style="margin-top:10px"/>
</div>
<div style="margin-left: 20px; width:80%">
Web Audioが最初に実装された2010年から今までの経緯、そしてこれから議論が始まる <b>Audio Device Client</b> の紹介と続きました。  
英語ではありますが、スライドにコメントが完璧に書かれているので、詳細はそちらで！
  
身近で見ていたこともあり、自分自身は、現在に至る歴史、W3Cでのプロセスに関する内容を改めて振り返ると、標準化の難しさ、大変さを改めて感じました。
</div>
</div>


###  「WebXR: AR and VR on the Web」 - Chris Wilson
[（スライドはこちら）](https://docs.google.com/presentation/d/1ukRQLp1H_gl7NMB5UZR8JMtH-qlcy37-lyNeXtGjyhE/)  
<div class="post-image-center" style="display:flex;flex-direction:row;align-items:flex-start; margin-bottom:0">
<div>
<img src="{{ site.url }}/images/2019/09/20190913_02.png" width="180px" style="margin-top:10px" />
</div>
<div style="margin-left: 20px; width:80%">
WebXRのキーとなるピース、そしてウェブでのVR、ARの状況（実装方法も含む）、そしてW3CのでのVR、ARを扱うImmersive Web WGの状況、
そして最後に音がImmersiveを広める大きなキー技術になる。そしてWeb Audioはすでに3Dオーディオが実装されていて、
WebXRを簡単に実装できるThree.jsやA Frame経由でも利用できることが紹介されました。  
  
3Dオーディオも含めて、Three.jsやA Frame経由で手軽に実装できるという点はサクッと作るときにはホントに便利だと感じます。今後、事例が増えることに期待しています。
</div>
</div>

###  「PlayCanvasで始めるWebXR」 - 羽賀 流登
<div class="post-image-center" style="display:flex;flex-direction:row;align-items:flex-start; margin-bottom:0">
<div>
<img src="{{ site.url }}/images/2019/09/20190913_03.png" width="180px" style="margin-top:10px" />
</div>
<div style="margin-left: 20px; width:80%">
WebXRやるならPlayCanvasががとても良い、というお話。実例、またそのデモも含めた内容でした。  
  
第三者が体験しているVRな世界を、各自がもっている端末のブラウザを通して皆で同時に共有して眺めるシステムが非常に印象的で、ここまでできるのか？！とビックリしました。
</div>
</div>

# おわりに
Web Audio、WebXRの両面からのTalk Session、また展示を行うことで、WebのImmersiveに関して更なる可能性を自分自身が感じ「ウェブはいい」というのを改めて認識したMeetupになりました。
WebXRとWebAudio(Music)が一緒にMeetupを行い、展示枠も設けるという初の試みばかりでどうなるのかという心配はありましたが、結果的には「見て、聞いて、感じてもらう」という目標を実現できたと感じていて、ホッとしております。  
こういった別のコミュニティとのジョイントでMeetupを行い、未来を見る、というのはホントによいですね！！また機会がありましたら検討したいと思っています。
  
  
なお、今回会場をご提供いただきましたメルカリさん、そして軽食のスポンサーをしていただきましたGoogleさんには心から感謝申し上げます。ありがとうございました。


<div class="post-image-center" style="display:flex;flex-direction:row;align-items:flex-start;margin-bottom:0">
  <div style="display:flex;flex-direction:column;align-items:flex-start;width:45%;text-align:center">
    <div><img src="{{ site.url }}/images/2019/09/20190913_chris_hongchan.jpg" style="margin-bottom:0px" /></div>
    <div>左2人目から、Hongchan、Chris、えーじさん</div>
  </div>
  <div style="width:45%;margin-left:10px">
    <div><img src="{{ site.url }}/images/2019/09/20190913_haga.jpg" style="margin-bottom:0px" /></div>
    <div>羽賀さん</div>
  </div>
</div>

<div class="post-image-center" style="display:flex;flex-direction:row;align-items:flex-start;margin-bottom:0">
  <div style="display:flex;flex-direction:column;align-items:flex-start;width:45%;text-align:center">
    <div><img src="{{ site.url }}/images/2019/09/20190913_ikkou_manpuku.jpg" style="margin-bottom:0px" /></div>
    <div><a href="https://www.twitter.com/ikkou" target="_blank">WebXRの@ikkouさん</a></div>
  </div>
  <div style="float:none;width:45%;margin-left:10px">
    <div><img src="{{ site.url }}/images/2019/09/20190913_musubi.jpg" style="margin-bottom:0px" /></div>
    <div style="margin:auto">オススメの<a href="http://www.manpukumusubi.com/" target="_blank">「まんぷくにぎり」のおむすび</a></div>
  </div>
</div>

<div class="post-image-center" style="display:flex;flex-direction:row;align-items:flex-start;margin-bottom:0">
  <div style="display:flex;flex-direction:column;align-items:flex-start;width:60%;text-align:center">
  <blockquote class="twitter-tweet"><p lang="en" dir="ltr">The receptionists at yesterday&#39;s event were famous people <a href="https://twitter.com/sisidovski?ref_src=twsrc%5Etfw">@sisidovski</a> and <a href="https://twitter.com/kosamari?ref_src=twsrc%5Etfw">@kosamari</a> <a href="https://t.co/AzVL3d6nEL">pic.twitter.com/AzVL3d6nEL</a></p>&mdash; Eiji Kitamura / えーじ (@agektmr) <a href="https://twitter.com/agektmr/status/1172862027162800128?ref_src=twsrc%5Etfw">September 14, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  <div>豪華受付の方々！ありがとうございました！</div>
  </div>
</div>
