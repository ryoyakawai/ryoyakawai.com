---
layout: post
title: Immersive Web Meetupを開催したよ！
description: ""
date: 2019-08-04 00:00:00 +0900
modified: 2019-01-20
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

<div> </div>

2019年9月13日（金）にメルカリさんで「Immersive Web Meetup」を開催しました。  
開催の経緯は9月16日から1週間の日程でTPAC（W3C年次会議）が福岡であり、せっかくの機会なので、東京に立ち寄る方々をお招きしてお話を聞きたい
コミュニティに向けていていただきたい！ということで企画しました。2015年にTPACが札幌であったときにも[Web Music Developer Meetup@札幌](https://dev.classmethod.jp/event/web-music-developer-meetup-sapporo-report/)と題して札幌で開催しています。  
    
またせっかくなのでXRとMusicという区分で切らず、あえて2つを一緒にして、展示も行うことで「見て、聞いて、感じてもらう」を目標に企画しました。
  
今回お話をしてくださったのは、[Hongchan Choi](https://twitter.com/hochsays)、[Chris Wilson](https://twitter.com/cwilso)、それから[羽賀 流登](https://twitter.com/Mxcn3)さんの3名です。

##  「9 Years of Web Audio」 - Hongchan Choi
[（スライドはこちら）](https://docs.google.com/presentation/d/1dlZ3ThCDsYqv6QEuDi07tkK0KC3D3IxfNY4uhHa2KPc/)  
<div class="post-image-center" style="margin-bottom:0">
<div>
<img src="{{ site.url }}/images/2019/09/20190913_01.png" width="180px" />
</div>
<div style="margin-left: 20px; width:80%">
Web Audioが最初に実装された2010年から今までの経緯、そしてこれから議論が始まる <b>Audio Device Client</b> の紹介と続きました。  
英語ではありますが、スライドにコメントが完璧にかかれているので、詳細はそちらで！
  
身近で見ていたこともあり、自分自身は、現在に至る歴史、W3Cでのプロセスに関する内容を改めて振り返ると、標準化の難しさ、大変さを改めて感じました。
</div>
</div>


##  「WebXR: AR and VR on the Web」 - Chris Wilson
[（スライドはこちら）](https://docs.google.com/presentation/d/1ukRQLp1H_gl7NMB5UZR8JMtH-qlcy37-lyNeXtGjyhE/)  
<div class="post-image-center" style="margin-bottom:0">
<div>
<img src="{{ site.url }}/images/2019/09/20190913_02.png" width="180px" />
</div>
<div style="margin-left: 20px; width:80%">
WebXRのキーとなるピース、そしてウェブでのVR、ARの状況（実装方法も含む）、そしてW3CのでのVR、ARを扱うImmersive Web WGの状況、
そして最後に音がImmersiveを広める大きなキーとなること、またWeb Audioにはすでに3Dオーディオが実装されていて、Three.jsやA Frame経由でも
利用できることが紹介された。  
  
3Dオーディオも含めて、Three.jsやA Frame経由で手軽に実装できるという点はサクッと作るときにはホントに便利だと感じます。
</div>
</div>

##  「ScriptProcessorNode」 - 羽賀 流登
<div class="post-image-center" style="margin-bottom:0">
<div>
<img src="{{ site.url }}/images/2019/09/20190913_03.png" width="180px" />
</div>
<div style="margin-left: 20px; width:80%">
WebXRやるならPlayCanvasががとても良い、というお話。実例、またそのデモも含めた内容。  
  
第三者が体験しているVRな世界を、各自がもっている端末のブラウザを通して皆で同時に共有して眺めるシステムが非常に印象的でした。
</div>
</div>

# おわりに
Web Audio、WebXRの両面からの発表、また展示を行うことで、Webの更なる可能性を自分自身が感じ「ウェブはいい」というのを改めて認識したMeetupになりました。
WebXRとWebAudio(Music)が一緒にMeetupを行う点、あた展示がどうなるのかという心配はありましたが、結果的には「見て、聞いて、感じてもらう」という目標
を実現できたと感じていて、ホッと一安心しています。  
またこういった別のコミュニティとのジョイントでMeetupを行い、未来を見る、というのが今後も企画できると嬉しいですので、機会がありましたらご参加を検討ください！
  
  
なお、今回会場をご提供いただきましたメルカリさん、それから軽食のスポンサーをしていただきましたGoogleさんに心から感謝申し上げます。ありがとうございました。


<div class="post-image-center" style="margin-bottom:0">
<img src="{{ site.url }}/images/2019/09/20190913_chris_hongchan.jpg" width="45%" style="margin-right:10px"/>
<img src="{{ site.url }}/images/2019/09/20190913_haga.jpg" width="45%" />
</div>
<div class="post-image-center" style="margin:0;">
<div>[写真左] Hongchan（左から2人目）、Chris（左から3人目）、えーじさん（右）</div>
</div>
<div class="post-image-center" style="margin-top:0;">
<div>[写真右] 羽賀さん</div>
</div>

<div class="post-image-center" style="margin-bottom:0">
<img src="{{ site.url }}/images/2019/09/20190913_musubi.jpg" width="45%" />
</div>
<div class="post-image-center" style="margin:0;">
<div>かなり美味しかった <a href="http://www.manpukumusubi.com/" target="_blank">「まんぷくにぎり」のおむすび</a></div>
</div>
