---
layout: post
title: Firebase Test LabでUI Testを実行する
description: ""
date: 2019-07-16 00:00:00 +0900
modified: 2019-07-16
tags: [Android, Firebase Test Lab, UI Test]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
---

## これは何？
「[AndroidアプリをCircleCIでCIする。]({{ site.url }}/2019/07/03/ci-android-00.html)」のUI TestをCircleCIから実行する方法について説明した記事です。
[サンプルアプリ](https://github.com/ryoyakawai/uitest_sample_android)のUI Testを走らせるFirebase Test Lab（UI Testを実行するインフラ）について解説していきます。

## 概要
### Ciの流れでUI Testが実行されている箇所
「[AndroidアプリをCircleCIでCIする。]({{ site.url }}/2019/07/03/ci-android-00.html)」のCIの流れでは **(3) UI Test** でUI Testを実行、
**(4) Report** でレポートアップロードしています。
<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190703-circleci_firebase_00.png" width="80%" />
</div>
ここで使うコードは以下の通りです。
- [サンプルアプリのリポジトリ](https://github.com/ryoyakawai/uitest_sample_android/tree/master/app/src/test/java/com/example/uitestsample)
- UI Testのスクリプト：[MainActivityInstrumentedTest.kt](https://github.com/ryoyakawai/uitest_sample_android/blob/master/app/src/androidTest/java/com/example/uitestsample/MainActivityInstrumentedTest.kt)

### ポイント、条件など
CIで使うCircleCIは2.0からAndroidのエミュレータを動かすことができなくなったことから、
CircleCI単体でのUI Testの実行が不可能になりました。（[公式ドキュメント](https://support.circleci.com/hc/en-us/articles/360000028928-Testing-with-Android-emulator-on-CircleCI-2-0)）
ですので、UI Testを含めるとすると、AndroidアプリのCIは外部サービスを利用することが必須となっています。  
  
今回は[公式ドキュメント](https://support.circleci.com/hc/en-us/articles/360000028928-Testing-with-Android-emulator-on-CircleCI-2-0)にオススメされている
Firebase Test Labを使うことにしました。

### Firebase Test Labとは
Firebase Test LabはFirebaseがのサービスの1つとして提供しているクラウドでUI Testを行うプラットフォームです。Android(Espresso、UI Automator)、iOS(XCTest)で書かれたテストの実行に対応しています。  
  
（詳しくは「AndroidアプリをCircleCIでCIする。」の[Firebase Test Labとは]({{ site.url }}/2019/07/03/ci-android-00.html#aboutfirebasetestlab)を御覧ください。）

[公式ドキュメントはこちら](https://firebase.google.com/docs/test-lab)です。
  
それではアカウント等の準備を説明します。

#### 料金体系（2019年7月現在）
料金は無料枠が、物理デバイスでのテスト実行5回まで、Virtual（仮想）デバイスでのテスト実行10回まで。  
無料枠を超えると、物理デバイス1台1時間$5、Virtual（仮想）デバイス1台1時間$1となります。
また、テスト実行時間の上限もあり、物理デバイスが30分、Virtual（仮想）デバイスが60分と決められていますので、
Firebase Test Labでテストを実行する場合はそこに収まるようにテストケースを考えましょう。  
この時間はデフォルトでは物理デバイスもVirtual（仮想）デバイスも同じく15分で設定されています。

[詳細はここのTest Lab](https://firebase.google.com/pricing)の項目を御覧ください。  


#### ＞ Firebaseのアカウントの準備
[console.firebase.google.com](https://console.firebase.google.com)からアカウントを作成します。

### ＞ GCPのアカウントとプロジェクトを準備
Circle CIからは gcloud コマンドを使って Firebase Test Lab 実行するので、GCPのアカウントも必須となります。
またプロジェクトの必要となりますので作成していきます。  

- [console.firebase.google.com](https://console.cloud.google.com) からGCPのアカウントを作成
- GCPの [新規プロジェクトを作成する](https://console.cloud.google.com/projectcreate)
- 引き続きGCPで [Cloud Testing API](https://console.cloud.google.com/marketplace/details/google/testing.googleapis.com)と[Cloud Tool Results API](https://console.cloud.google.com/marketplace/details/google/toolresults.googleapis.com) を有効にする（下図左：画面上部でプロジェクトの選択を忘れずに！）
- [console.firebase.google.com](https://console.cloud.google.com) に戻りGCPのプロジェクトとリンクする。画像内の(1)からプロジェクトを選択する。（下図右）

<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190717-gcp-activateapi-00.png" width="47%" style="margin-right:15px;border-radius:4px;border:1px solid #eeeeee" />
<img src="{{ site.url }}/images/2019/07/20190717-firebase-linkproject-00.png" width="47%" style="border-radius:4px;border:1px solid #eeeeee" />
</div>

続いて、gcloud コマンドは[この公式ドキュメント](https://cloud.google.com/sdk/downloads)の通りインストールを行ってください。  
最後にAndroidのBuild環境をセットアップしてください。[Android Studioをインストール](https://developer.android.com/studio/install)するのがよいと思います。

### ＞ コマンドから動かしてみる

まずは、ターゲットのプロジェクトを指定を行います。

```shell
# コマンドラインでGCPにログイン
$ gcloud auth;

# 設定可能なプロジェクトをリストする
$ gcloud projects list;
PROJECT_ID                 NAME                   PROJECT_NUMBER
my-test-project-00-2xxxx5  My-Test-Project-00     6xxxx4xxxxx6

# 「my-test-project-00-24690」をプロジェクトとして指定する
$ gcloud config set project my-test-project-00-2xxxx5;

# 設定内容を確認する(account, projectが指定した内容であるか確認)
$ gcloud config list;
[compute]
region = us-central1
zone = us-central1-c
[core]
account = xxxxx.xxxx.xxxx.xxxx@example.com
disable_usage_reporting = True
project = my-test-project-00-2xxxx5

Your active configuration is: [default]
```

### ＞ ローカルで動作させてみる
```shell
# コードをCloneする
$ git clone https://github.com/ryoyakawai/uitest_sample_android.git;
$ cd uitest_sample_android/;

# Build
# Emulatorが動作していない場合エラーとなりますが、以下の2つが生成されていればOKです。
# - app/build/outputs/apk/debug/app-debug.apk
# - app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
$ ./gradlew connectedAndroidTest;

# 環境変数を指定する
$ GOOGLE_PROJECT_ID="my-test-project-00-2xxxx5";
$ BK_OBJ_NAME="${GOOGLE_PROJECT_ID}/uitest-$(date "+%Y%m%d_%H%M")";

# コマンドを改行するときは末尾のスペースを忘れずに入れてください。
$ gcloud firebase test android run \
 --type instrumentation \
 --app ./app/build/outputs/apk/debug/app-debug.apk \
 --test ./app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk \
 --test-targets "class com.example.uitestsample.MainActivityInstrumentedTest" \
 --results-dir $BK_OBJ_NAME \
 --results-bucket cloud-test-${GOOGLE_PROJECT_ID} \
 --directories-to-pull /sdcard/uitest/ \
 --device model=Pixel2,version=26,locale=en_US,orientation=portrait \
 --use-orchestrator \
 --timeout 120s;

# 無事に開始されると以下が出力さる
Have questions, feedback, or issues? Get support by visiting:
  https://firebase.google.com/support/

Uploading [./app/build/outputs/apk/debug/app-debug.apk] to Firebase Test Lab...
Uploading [./app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk] to Firebase Test Lab...
Raw results will be stored in your GCS bucket at [https://console.developers.google.com/storage/browser/cloud-test-my-test-project-00-2xxxx5/my-test-project-00-2xxxx5/uitest-20190716_1603/]

Test [matrix-1gpbgxrsx8fag] has been created in the Google Cloud.
Firebase Test Lab will execute your instrumentation test on 1 device(s).
Creating individual test executions...done.

Test results will be streamed to [https://console.firebase.google.com/project/my-test-project-00-2xxxx5/testlab/histories/bh.xxxxxxxxxxxx/matrices/8xxxxxxxxxxxx11].
16:17:55 Test is Pending
16:18:23 Starting attempt 1.
16:18:23 Test is Running
16:19:17 Started logcat recording.
16:19:17 Preparing device.
16:19:52 Logging in to Google account on device.
16:19:52 Installing apps.
16:20:06 Retrieving Pre-Test Package Stats information from the device.
16:20:06 Retrieving Performance Environment information from the device.
16:20:06 Started crash detection.
16:20:06 Started crash monitoring.
16:20:06 Started performance monitoring.
16:20:19 Started video recording.
16:20:19 Starting instrumentation test.
16:20:53 Completed instrumentation test.
16:21:07 Stopped performance monitoring.
16:21:14 Stopped crash monitoring.
16:21:14 Stopped logcat recording.
16:21:14 Retrieving Post-test Package Stats information from the device.
16:21:14 Logging out of Google account on device.
16:21:21 Done. Test time = 36 (secs)
16:21:21 Starting results processing. Attempt: 1
16:21:28 Completed results processing. Time taken = 6 (secs)
16:21:28 Test is Finished

Instrumentation testing complete.

More details are available at [https://console.firebase.google.com/project/my-test-project-00-2xxxx5/testlab/histories/bh.xxxxxxxxxxxx/matrices/8xxxxxxxxxxxx11].
┌─────────┬──────────────────────────┬─────────────────────┐
│ OUTCOME │     TEST_AXIS_VALUE      │     TEST_DETAILS    │
├─────────┼──────────────────────────┼─────────────────────┤
│ Passed  │ Pixel2-26-en_US-portrait │ 3 test cases passed │
└─────────┴──────────────────────────┴─────────────────────┘

```

コマンドに出力されるFirebaseのURLにアクセスすると結果が見られます。以下の1行のように表示されているはずで、ブラウザからアクセスすると下図が表示されます。
```shell
Test results will be streamed to [https://console.firebase.google.com/project/my-test-project-00-2xxxx5/testlab/histories/bh.xxxxxxxxxxxx/matrices/8xxxxxxxxxxxx11]
```

<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190717-firebase-result-00.png" width="80%" style="border-radius:4px;border:1px solid #eeeeee" />
</div>

静止画、動画を一覧で表示することができるので、テストで何がされていたかも後から確認することが可能です。
ちなみに、デフォルトで動画は撮影してくれる設定になっていますが、静止画に関しては自前で撮影する処理を書き、タイミングを決めてテストスクリプトに埋め込む必要があります。
テスト失敗時の静止画も自前で設定する必要がありますが、今回の[サンプルアプリのUiTestUtils](https://github.com/ryoyakawai/uitest_sample_android/blob/master/app/src/androidTest/java/com/example/uitestsample/uitestutils/UiTestUtils.kt)に含んでいますので試してみたい場合は利用してみてください。

## おわりに
CIの流れの中ではもちろん、また「日々の開発と並行してテストしたい場合にローカルで環境を用意する」ことはコスト的に厳しかったり、
「他端末の実デバイスを使ってまずはテストを動かしてみたい」というのも同じくコスト的に厳しいことが少なくないと思います。
全ては無理かもしれませんが、そんなときに心配の塊の1部だけでも取り除くべきFirebase Test Labを使う、というのもとても有効だと思います。  
気になっている方は使ってみてはいかがでしょうか？  

## Reference

- [Get started with Firebase Test Lab from the gcloud Command Line](https://firebase.google.com/docs/test-lab/android/command-line)
- [gcloud firebase test android run(Cloud SDK:Google Cloud)](https://cloud.google.com/sdk/gcloud/reference/firebase/test/android/run)
