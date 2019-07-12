---
layout: post
title: AndroidアプリでのUnit Testについての解説
description: ""
date: 2019-07-10 00:00:00 +0900
modified: 2019-07-12
tags: [Android, Unit Test]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
---

## これは何？
「[AndroidアプリをCircleCIでCIする。]({{ site.url }}/2019/07/03/ci-android-00.html)」のUnit Testを説明した記事です。
[サンプルアプリ](https://github.com/ryoyakawai/uitest_sample_android)のUnit Testについて解説していきます。


## 概要
### CIの流れでUnit Testが実行されている箇所
「[AndroidアプリをCircleCIでCIする。]({{ site.url }}/2019/07/03/ci-android-00.html)」のCIの流れでは **(2) Build** で実行されています。
<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190703-circleci_firebase_00.png" width="80%" />
</div>
ここで使うコードは以下の通りです。
- [サンプルアプリのリポジトリ](https://github.com/ryoyakawai/uitest_sample_android/tree/master/app/src/test/java/com/example/uitestsample)
- [Unit Testのスクリプト](https://github.com/ryoyakawai/uitest_sample_android/blob/master/app/src/test/java/com/example/uitestsample/MainActivityUnitTest.kt)

[公式ドキュメントはこれ](https://developer.android.com/training/testing/unit-testing/local-unit-tests)です。

### ポイント、条件など
[Unit Testについて（AndroidアプリをCircleCIでCIする。）]({{ site.url }}/2019/07/03/ci-android-00.html#aboutunittest)にも書いていますがポイントは以下です。
- MVP（Model-View-Presenter）のアーキテクチャに対してのUnit Testを実行する
- [JUnit](https://junit.org/junit4/)を使ってUnit Testを実行する
- [Mockito](https://site.mockito.org/)でViewをモックする
- HTTPでのアクセスをモックする
- テストする場所は以下の図の **Point for Unit Testing**

<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190703-mvp-diagram-00.png" width="90%"/>
</div>

アーキテクチャはMVPに限っている訳ではありませんが、Interfaceを定義しているとテストを書くのが楽になることから
ここではMVPを採用しています。

### テストのシナリオ
アプリの機能としては無駄に実装された[JSONPlaceholder](https://jsonplaceholder.typicode.com/)
のREST APIに接続をしてJSONを取得し、Viewに反映させる部分の動作に関してテストを実施します。  
具体的に説明すると上図の **Data Interaction** をモックしてJSONを固定し、**UI Behavior** をモックして
指定されている振る舞いを行うか、を確認します。
<br>
よって、今回はこのシナリオを確認する為に以下の2つのテストのケースを用意しました。
- HTTPレスポンスコード200でJSONを正しく受け取った場合の値の確認とViewに対する動作確認
- HTTPレスポンスコード500を受け取った場合のViewに対する動作確認

### 準備
`build.gradle`に追記、`org.mockito.plugins.MockMaker` の作成の2つが必要です。

#### ＞ `build.gradle`に追記
`app/build.gradle` に以下を追記します。

```kotlin
....
dependencies {
....
    // Unit and UI Test
    testImplementation 'junit:junit:4.12'
    testImplementation "org.jetbrains.kotlin:kotlin-reflect:$kotlin_version"
    testImplementation "com.android.support:support-annotations:${android.defaultConfig.targetSdkVersion}"
    testImplementation 'org.robolectric:robolectric:4.0'
    testImplementation 'com.nhaarman:mockito-kotlin-kt1.1:1.5.0'
    testImplementation 'com.squareup.retrofit2:converter-moshi:2.2.0'
    testImplementation 'com.squareup.retrofit2:retrofit-mock:2.3.0'
    testImplementation 'com.squareup.okhttp3:mockwebserver:3.10.0'
....
}
....
```

`build.gradle` に以下が書かれていることが前提です。

```kotlin
....
buildscript {
....
    ext.kotlin_version = '1.3.31'
....
}
....
```

#### ＞ `org.mockito.plugins.MockMaker` を作成
`app/src/test/resources/mockito-extensions/org.mockito.plugins.MockMaker` を新規で作成して、以下の1行を書き込みます。

```
mock-maker-inline
```

### Unit Testを書く

#### ＞ REST APIをモックして出力を固定する
**Data Interaction** の部分をモックして出力を固定します。具体的には[JSONPlaceholder](https://jsonplaceholder.typicode.com/)のREST APIの出力を固定する為に
HTTPのクライアント[OkHttp](https://square.github.io/okhttp/)をモックします。
扱いやすいように、 **Unit Test本体** と、 **モック** を1つのファイルにまとめちゃっています。

- [MainActivityUnitTest.kt](https://github.com/ryoyakawai/uitest_sample_android/blob/master/app/src/test/java/com/example/uitestsample/MainActivityUnitTest.kt)

`MockServerDispatcher`のクラスがそれになります。  
ここでは、`Resp200`、`Resp400`、`Resp500` の3つのClassを定義することで、以下の用に出力を固定します。

- `Resp200`：正常系の場合で、JSONを返す
- `Resp400`：異常系で、HTTP Statusの400を返す
- `Resp500`：異常系で、HTTP Statusの500を返す

#### ＞ Unit Testを書く
2つのテストケースのうちの「HTTPレスポンスコード200でJSONを正しく受け取った場合の値の確認とViewに対する動作の確認」
の説明を、以下にインラインで行います。。
以下は、
```kotlin
class MainActivityUnitTest {
    private var mMockTestUtils = UnitTestUtils()

    @Test
    fun sampleUnitDataFetchSuccessTest() {
        // vvv 正常系でJSONを返すよう指定
        mMockTestUtils.mockServerBehaviorSwitcher = {
            MockServerDispatcher().Resp200()
        }
        val expectedResponse = MockServerDispatcher().mockedResponse

        var mMainActivityPresenter = MainActivityPresenter()
        // vvv Viewに対する動作の確認の為にMainActivityViewContract()のClassをモック
        var mMainActivityViewContract = mock<MainActivityViewContract>()

        // vvv PresentorにモックしたMainActivityViewContract()を叩かせるようにセット
        mMainActivityPresenter.setView(mMainActivityViewContract)

        // vvv 非同期での処理を同期で動作させるように変更
        mMockTestUtils.prepareRxForTesting()

        // vvv ここでMockしたサーバを起動する
        mMockTestUtils.startMockServer()

        // vvv 以下の2行で、サンプルアプリの接続先をMockしたサーバに入れ替える
        var mApiConnection = mMockTestUtils.setupMockServer()
        setConnection(mApiConnection)

        // vvv PresenterのMethodを叩いて、動作させる
        mMainActivityPresenter.getJsonSampleResponse()
        // vvv MainActivityViewContractのhandleSuccess()が叩かれれ、
        // 固定したデータ（JSON）の取得ができているかを確認
        argumentCaptor<Array<SinglePostResponse>>().apply {
            verify(mMainActivityViewContract, times(1)).handleSuccess(capture())

            for (i in 0 until expectedResponse.size) {
                val expected = expectedResponse[i]
                val actual = this.firstValue[i]
                mMockTestUtils.assertDataClass(expected, actual)
            }

        }
        // vvv ここでMockしたサーバを停止
        mMockTestUtils.shutdownMockServer()
    }
....
}
```

### 実行してみる
実行方法には「コマンドラインから」、また「Android Studioから」の2つがあります。

#### > コマンドラインから実行

Unit Testの全てを実行する

```shell
$ ./gradlew testDebugUnitTest;
```

指定したClass、MethodのUnit Testを実行る

```bash
// Classを指定
// --tests のパラメータとして [Package Name].[Class Name] を指定
$ ./gradlew testDebugUnitTest --tests com.example.uitestsample.MainActivityUnitTest;

// ClassとMethodを指定
// --tests のパラメータとして [Package Name].[Class Name].[Method Name] を指定
$ ./gradlew testDebugUnitTest --tests com.example.uitestsample.MainActivityUnitTest.sampleUnitDataFetchSuccessTest;
```


#### > Android Studioから
`@Test`のアノテーションかを書くとTestとして認識されます。
するとAndroid Studioだと下図の赤丸のように、その左側に <span style="color:green">▶︎</span>（再生マーク）が表示されるので、
それをクリックすると実行することが可能です。  

<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190710-unittest-androidstudio-00.png" width="80%" style="border-radius:4px;border:1px solid #eeeeee" />
</div>


## おわりに
「Cloneしたらすぐに試せる」を目標に書きましたので、興味を持たれた方は試してみていただえると嬉しいです。  
間違ってる！とかありましたらPR、またご指摘ください。

