---
layout: post
title: x-webmidiをES6 Modulesに変更しxwebmidi.jsにしました
description: ""
date: 2019-03-21 00:00:00 +0900
modified: 2019-03-21
tags: [WebMusic, WebMIDI]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
---

<div> </div>

x-webmidiとして公開していたPolymerのエレメントをES6 Modulesに変更しxwebmidi.jsとすることにました。  
理由は簡単でHTML ImportがChromeから削除されてしまうからです。  

xwebmidi.jsでできることは以下です。

- コンピュータに接続されているMIDIデバイスのリスト化
- 接続・切断したMIDIデバイスを自動でデバイスリストから追加・削除
- MIDI InputデバイスからのMIDIメッセージの受け取り
- MIDI OutputデバイスへのMIDIメッセージの送信
- MIDI Messageを自動でParse

まだあるかもしれませんが、これくらいが主な機能になります。  

できる限り今までのx-webmidiと同じように簡単に実装できるようしています。詳細なREADMEを出来ていませんが、このHTML、JavaScriptを書くとブラウザ上に↑の機能を実装の土台ができあがります。

```html
<html>
  <head>
    <link rel="stylesheet" href="./xwebmidi.css">
  </head>
  <body>
    INPUT: <select id="midiin" class="xwebmidi-select-midi"></select>
    <br>
    OUTPUT: <select id="midiout" class="xwebmidi-select-midi"></select>

    <script type="module">
     import { xWebMIDI } from "./xwebmidi.js";
     (async () => {
       const xwm = new xWebMIDI();
       await xwm.requestMIDIAccess(true);
       xwm.initInput('midiin');
       xwm.initOutput('midiout');

       window.addEventListener('midiin-event:midiin', event => {
         console.log(event.detail.data);
         xwm.sendRawMessage(event.detail.data)
       });
     })();
    </script>
  </body>
</html>
```

ということで、快適なWeb Musicな生活を！！！
