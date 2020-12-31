---
layout: post
title: AndroidアプリをBitriseでCIする。
description: ""
date: 2019-07-25 00:00:00 +0900
modified: 2019-07-25
tags: [Android, Espresso, Bitrise, Firebase Test Lab]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
---

## これは何？
「[AndroidアプリをCircleCIでCIする。]({{ site.url }}/2019/07/03/ci-android-00.html)」のCircleCIをBitriseに変更した時のメモです。  
Bitriseの設定のみを書いていこうと思いますので、詳細は「[AndroidアプリをCircleCIでCIする。]({{ site.url }}/2019/07/03/ci-android-00.html)」を御覧ください。

## 概要
### Bitrise
[Bitrise](https://go.bitrise.io/bitrise-japan)はCircleCIと同じ種類のクラウド型のCIサービスです。
ロンドンと[ブダペスト（ハンガリー）](https://goo.gl/maps/Yi3Q5G6hDY6qgyAK8)にオフィスを持っています。シリコンバレーじゃないのが新鮮でした。  
<br>

#### できること
BitriseはiOS、Android、Swift、React Nativeをビルド、テスト、デプロイすることが可能です。本記事では、Androidのビルド、テストをみていきます。

#### 価格
[詳しいテーブルはこちら](https://www.bitrise.io/pricing/teams)です。小さな組織向けとエンタープライズ向けが用意されてます。
小さな組織向けの1部はこんな感です。（2019年7月現在）
- Hobby（無料）：複数同時ビルドは不可、ビルド時間は10分、月に200回ビルドまで、使えるのは標準マシーン、追加可能なメンバーは2名
- Developer（$36/mo）：複数同時ビルドは不可、ビルド時間は45分、ビルド回数は無制限、使えるのは標準マシーン、メンバーの無制限追加可能


## さっそく使ってみる
GitHubとBitriseのアカウントが必須ですのでご用意してください。  
この記事では[このリポジトリのコード](https://github.com/ryoyakawai/uitest_sample_android/)をサンプルとして使いますので、
ForkもしくはCloneしてリポジトリに追加しておいてください。  
それでは追加していきます。

### アプリを追加する
下右図のように、ターゲットになるリポジトリを指定してアプリを追加します。
<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190726_bitrise_00.png" width="48%" style="border-radius:4px; border:1px solid #eeeeee; margin-right: 5px" />
<img src="{{ site.url }}/images/2019/07/20190726_bitrise_01.png" width="48%"/>
</div>

### Workflowの設定画面を表示する
アプリの追加が完了すると同時にビルドを走らせてくれます。  
が、取り急ぎWorkflowの設定画面を開いてしまいます。プロジェクト名をクリック（下図(1)）して
次にWorkflowのタブをクリック（下図(2)）して表示します。

<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190726_bitrise_workflow00.png" width="80%" style="border-radius:4px; border:1px solid #eeeeee;" />
</div>


### タスクを追加する
アプリを追加した状態ではUIテストは追加されませんので、UIテストされるように設定する必要があります。
追加するタスクは以下の2つです。

- Gradle Runner
- [BETA] Virtual Device Testing for Android

赤四角の中の2つを追加する。
<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190725_bitrise_addtask00.png" width="30%" style="border-radius:4px; border:1px solid #eeeeee;" />
</div>


#### ＞ Gradle Runnerの追加
**Android Unit Test** のアイコンの直下にある「＋」ボタン（下図（1））をクリックして、「Gradle Runner」で検索すると絞込まれて表示されますので
クリックして追加します。（下図(2)）
<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190726_bitrise_gradlerunner00.png" width="80%" style="border-radius:4px; border:1px solid #eeeeee;" />
</div>
  
追加すると設定画面が表示されますので以下の2つの四角を変更します。  
  
- **Gradle task to run** ： `assembleDebug assembleDebugAndroidTest`
- **gradlew file path** ： `./gradlew`

<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190726_bitrise_gradlerunner01.png" width="80%" style="border-radius:4px; border:1px solid #eeeeee;" />
</div>

#### ＞ [BETA] Virtual Device Testing for Androidの追加
先程追加した**Gradle Runner** の次に追加しますので、直下にある「＋」ボタン（下図（1））をクリックして、「[BETA] Virtual」で検索します。すると絞込まれて表示されますので
クリックして追加します。（下図(2)）
<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190726_bitrise_virtualdevice00.png" width="80%" style="border-radius:4px; border:1px solid #eeeeee;" />
</div>
  
追加すると設定画面が表示されますので以下の2つの四角を変更します。  
  
- **Test devices** ： `Pixel2,28,en,portrait`
- **Test type** ： `instrumentation`

<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190726_bitrise_virtualdevice01.png" width="80%" style="border-radius:4px; border:1px solid #eeeeee;" />
</div>

なお、**Test devices** はサンプルアプリに `minSdkVersion 26` と指定しているので26以上に設定しています。  
また、先程変更した **Gradle Runner** の **Gradle task to run** の `assembleDebug assembleDebugAndroidTest` がデフォルトの `assemble` のままになっていると
テスト用のAPK(`app-debug-androidTest.apk`)が作成されず、**API path** で使う環境変数の **$BITRISE_APK_PATH** に `app-release-unsigned.apk`等に指定あれてしまい
**[BETA] Virtual Device Testing for Android** が動作できずエラーになりますので、確実に変更するようにしてください。  
  
  
ちなみに、この **[BETA] Virtual Device Testing for Android** は「[Firebase Test LabでUI Testを実行する]({{ site.url }}/2019/07/16/ci-android-firebase-00.html)」
でも紹介しているのと同じくGCPコマンドから [Cloud Testing API(Firebase Test Lab)](https://console.cloud.google.com/marketplace/details/google/testing.googleapis.com) をラップして使っているようです。


### 実行する
以上でUI Testまで実行できるようになったはずなので画面内にある **[Start/Schedule a Build]** ボタンをクリックしてビルドを実行します。

<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190726_bitrise_start_button00.png" width="30%" style="border-radius:4px; border:1px solid #eeeeee;" />
</div>

## おわりに
ガガっとリポジトリを読んで、設定作ってくれるところは楽チンでよかったですが、
**Gradle Runner** の **Gradle task to run**  環境変数 **$BITRISE_APK_PATH** の設定で
ハマりました。Firebase Test Labからのエラーメッセージ見られると良いかもな〜、と感じています。


#### 今回の`bitrise.yml`
今回できあがった `bitrise.yml` もココに貼っておきます。参考になれば幸いです。

```yml
---
format_version: '8'
default_step_lib_source: https://github.com/bitrise-io/bitrise-steplib.git
project_type: android
trigger_map:
- push_branch: "*"
  workflow: primary
- pull_request_source_branch: "*"
  workflow: primary
workflows:
  deploy:
    steps:
    - activate-ssh-key@4.0.3:
    - git-clone@4.0.14: {}
    - cache-pull@2.0.1: {}
    - script@1.1.5:
        title: Do anything with Script step
    - install-missing-android-tools@2.3.5:
        inputs:
        - gradlew_path: "$PROJECT_LOCATION/gradlew"
    - change-android-versioncode-and-versionname@1.1.1:
        inputs:
        - build_gradle_path: "$PROJECT_LOCATION/$MODULE/build.gradle"
    - android-lint@0.9.6:
        inputs:
        - project_location: "$PROJECT_LOCATION"
        - module: "$MODULE"
        - variant: "$VARIANT"
    - android-unit-test@0.11.1:
        inputs:
        - project_location: "$PROJECT_LOCATION"
        - module: "$MODULE"
        - variant: "$VARIANT"
    - android-build@0.10.0:
        inputs:
        - project_location: "$PROJECT_LOCATION"
        - module: "$MODULE"
        - variant: "$VARIANT"
    - sign-apk@1.3.1:
    - deploy-to-bitrise-io@1.6.0: {}
    - cache-push@2.2.0: {}
  primary:
    steps:
    - activate-ssh-key@4.0.3:
    - git-clone@4.0.14: {}
    - cache-pull@2.0.1: {}
    - script@1.1.5:
        title: Do anything with Script step
    - install-missing-android-tools@2.3.5:
        inputs:
        - gradlew_path: "$PROJECT_LOCATION/gradlew"
    - android-lint@0.9.6:
        inputs:
        - project_location: "$PROJECT_LOCATION"
        - module: "$MODULE"
        - variant: "$VARIANT"
    - android-unit-test@0.11.1:
        inputs:
        - project_location: "$PROJECT_LOCATION"
        - module: "$MODULE"
        - variant: "$VARIANT"
    - gradle-runner@1.9.0:
        inputs:
        - gradlew_path: "./gradlew"
        - gradle_task: assembleDebug assembleDebugAndroidTest
    - virtual-device-testing-for-android@1.0.5:
        inputs:
        - test_type: instrumentation
        - test_devices: Pixel2,28,en,portrait
    - deploy-to-bitrise-io@1.6.0: {}
    - cache-push@2.2.0: {}
app:
  envs:
  - opts:
      is_expand: false
    PROJECT_LOCATION: "."
  - opts:
      is_expand: false
    MODULE: app
  - opts:
      is_expand: false
    VARIANT: ''
```
