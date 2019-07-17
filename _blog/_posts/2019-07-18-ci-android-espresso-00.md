---
layout: post
title: Espresso, UI AutomatorでAndroidのUI Testを書く
description: ""
date: 2019-07-18 00:00:00 +0900
modified: 2019-07-18
tags: [Android, UI Test, Espresso, UI Automator]
image:
#  feature: abstract-3.jpg
#  credit: dargadgetz
#  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
---

## これは何？
「[AndroidアプリをCircleCIでCIする。]({{ site.url }}/2019/07/03/ci-android-00.html)」のUI Testの書き方について説明した記事です。
具体的には[サンプルアプリ](https://github.com/ryoyakawai/uitest_sample_android)の[UI Testであるこれ](https://github.com/ryoyakawai/uitest_sample_android/blob/master/app/src/androidTest/java/com/example/uitestsample/MainActivityInstrumentedTest.kt)の説明です。

## 概要
### AndroidでUI Testを書く
Androidが公式にサポートしているUI Testのツールは [Espresso](https://developer.android.com/training/testing/espresso)、
[UI Automator](https://developer.android.com/training/testing/ui-automator) の2種類あります。
それぞれ以下の特徴がありますので「どちらを使うか？」については「どちらも併用して使う」のがいいように感じています。

#### Espresso
「to write concise, beautiful, and reliable Android UI tests」と公式サイトには説明されています。特定のアプリのUIに対してのスクリプトで動作をさせることを可能にするテストフレームワークです。単一のアプリの操作を自動化する場合に使うとよいでしょう。Google社が開発していますので、Anroidの公式のテストツールと言ってよいでしょう。  
サンプルアプリではアプリの操作のすべてをEspressoで書いています。

#### UI Automator
「suitable for cross-app functional UI testing across system and installed apps.」と公式サイトに説明されている通りで、Espressoと比べると、よりAndroidのOSに近い側に位置しているテストフレームワークで、複数アプリを行き来するよう動作をスクリプトで定義することの可能です。Espressoとは違い、複数のアプリの操作を自動化する場合に使うとよいでしょう。こちらもEspressoと同じくGoogle社が開発していますので、Anroidの公式のテストツールと言ってよいでしょう。  
サンプルアプリではスクリーンショットの撮影、Permissionリクエストのウィンドウの操作の2つをUI Automatorで書いています。

<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190703-uitesttool_00.png" width="50%"/>
</div>

### Espresso、UI AutomatorでTestを書く準備をする
以下の2つのファイルに追加して準備完了です。

#### ＞ `build.gradle` に以下を追加
```kotlin
....
allprojects {
....
  tasks.matching {it instanceof Test}.all {
    testLogging.events = ["failed", "passed", "skipped"]
  }
....
}
....
```

#### `＞ app/build.gradle` に以下を追加
```kotlin
....
dependencies {
....
  // for connected Android test
  androidTestUtil 'com.android.support.test:orchestrator:1.0.2'
  androidTestImplementation 'com.android.support.test:runner:1.0.2'
  androidTestImplementation 'com.android.support.test.espresso:espresso-core:3.0.2'
  androidTestImplementation 'com.android.support.test.espresso:espresso-intents:3.0.2'
  androidTestImplementation 'com.android.support.test.uiautomator:uiautomator-v18:2.1.3'
  androidTestImplementation 'com.android.support.test:rules:1.0.2'
  androidTestImplementation 'junit:junit:4.12'
....
}
```

### テストを書く
テストは`app/src/androidTest/[Package名]`以下に書いていきます。  
今回のパッケージ名は `com.example.uitestsample` 
ですので [`app/src/androidTest/java/com/example/uitestsample/`](app/src/androidTest/java/com/example/uitestsample/)
以下にコードを書いていきます。  
ファイル作成の粒度はActivity毎、Fragment毎、機能毎等、自由にまとめてしまって問題ありません。
サンプルアプリではActivity毎でまとめて[MainActivityInstrumentedTest.kt](https://github.com/ryoyakawai/uitest_sample_android/blob/master/app/src/androidTest/java/com/example/uitestsample/MainActivityInstrumentedTest.kt)に書いています。

#### 前準備
```kotlin
@RunWith(AndroidJUnit4::class)
@SdkSuppress(minSdkVersion = 26)
@LargeTest
class MainActivityInstrumentedTest {

    private val _packageName = "com.example.uitestsample"
    private val mUTs: UiTestUtils = UiTestUtils()
    // ^^^ ツールをインスタンス化 ^^^

    @Rule
    @JvmField
    val mActivityTestRule: ActivityTestRule<MainActivity> =
        ActivityTestRule(MainActivity::class.java)

    @Rule
    @JvmField
    val cGrantPermissionRule: GrantPermissionRule =
        GrantPermissionRule.grant(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
    // ^^^ スクリーンショット保存の為にSTORAGEへのアクセスを強制的に許可 ^^^

    @Rule
    @JvmField
    val screenshotRule = ScreenshotTakingRule(this.mUTs)
    // ^^^ Test失敗時をスクリーンショットを撮影するように指定 ^^^

    @Before
    fun setup() {
        this.mUTs.setActivity(mActivityTestRule.activity)
    }

    @After
    fun teardown() { }

....

}
```
「Test失敗時をスクリーンショット」の動作は `uitestutils/UiTestUtils.kt` の最後に定義されています。

```kotlin
....
class ScreenshotTakingRule(mUTs: UiTestUtils) : TestWatcher() {
    private var mUTs = mUTs

    override fun failed(e: Throwable?, description: org.junit.runner.Description?) {
        super.failed(e, description)
        val path = mUTs.screenShot("FAIL-$description")
        mUTs.log_d(">>> !!! TEST FAILED !!! <<< ScreenShot Taken method=[$description] filename=[$path]")
    }
}

```
#### テストケース
サンプルアプリではテストケースは以下の3つです。
「ケースとして足りない！」とかツッコミはありかもしれませんが、UI Testを動かすことを目的としていますのでご容赦ください。

- `useAppContext()`：テストしているアプリのパッケージ名を確認
- `checkTextHelloWorld()`：アプリ起動時、中心の「Hello World!」の表示を確認
- `checkButtonIncrementFloating()`：画面右下のボタンをタップすると表示している数字がカウントアップしSnackbarが表示され、またメニューからResetするとゼロになることを確認

`checkButtonIncrementFloating()` のポイントをインラインで説明します。  
[Testのコード全体はこちら](https://github.com/ryoyakawai/uitest_sample_android/blob/master/app/src/androidTest/java/com/example/uitestsample/MainActivityInstrumentedTest.kt)になりますので合わせて御覧ください。
```kotlin
....
@Test
fun checkButtonIncrementFloating() {
    // false にすることでTestが成功した場合でもスクリーンショットを残せます。
    // デフォルトでは、Testが成功するとスクリーンショットは全削除となります。
    this.mUTs.prepareScreenShot(false)

....

    val willTap = 5
    // 右下の赤色のFabを指定
    val incrementButton =  withId(R.id.increment_fab_text)

    // カウンターを増加させて表示が想定通りであるか確認する
    for(i in 1..willTap) {
        // スクリーンショットを撮影
        mUTs.screenShot("", "BEFORE >>> カウンター：インクリメント IDX=[$i]")
        // 指定した赤色のFabをタップ
        onView(incrementButton).perform(click())

        // Permissionリクエストが出てたら許可（このテスト中は出ないはず）
        mUTs.allowPermissionsIfNeeded()

        // スクリーンショットを撮影
        mUTs.screenShot("", "AFTER >>> カウンター：インクリメント IDX=[$i]")
        // 要素内の文字列を取得
        actualCount = this.mUTs.getText(withId(R.id.main_content_text))
        // ログを残す
        this.mUTs.log_d("[Counter SEQ] 🍏🍎 expected=[$i] actual=[$actualCount]")
        // 文字列をAssert
        assertEquals("[Counter SEQ] 🍏🍎", i.toString(), actualCount)

        // Snackbarの文言チェック
        val snackBarTapped = allOf(withId(android.support.design.R.id.snackbar_text), withText("Tapped $i times."))
        // Snackbarがから消えるのを待つ
        waitForSnackbarDisappear(snackBarTapped)
        // Sleepする
        this.mUTs.sleep("SHR")
    }

....

    // this.mUTs.prepareScreenShot() に false をセットしていなければ
    // スクリーンショットを削除する（）
    this.mUTs.removeSuccessScreenShots()

....

}
....
```


### IDが指定されていないエレメントの指定方法
エレメントに対してIDが振られている場合は大抵の場合そのIDを使うことで指定することが可能ですが、
指定されていない場合は **Layout Inspector** （[公式ドキュメント](https://developer.android.com/studio/debug/layout-inspector)）で階層構造を取得
して解析をしてから、以下のように指定を行います。

<div class="post-image-center">
<img src="{{ site.url }}/images/2019/07/20190718-layoutinspector-00.png" width="90%"/>
</div>

Fragmentの重なり方が操作によって変化する場合があり、表示は同じでも階層が違う場合が多々発生します。
ですので、Layout Inspectorで階層構造を取得するときはUI Testでのシナリオ通りに一度画面を遷移させて、それから取得すると良いでしょう。

## おわりに
iOS標準のUI Testツールである[XCTest](https://developer.apple.com/documentation/xctest)に比べると
癖が少し強いです。とっつきにくいところもありますが、そこまで難しくはないので気になっている場合は挑戦してみてください。  
自分の作ったアプリが自動で動くのを見るのも楽しいと思います。

## Reference
- [Espresso -  Android Developers](https://developer.android.com/training/testing/espresso)
- [UI Automator - Android Developers](https://developer.android.com/training/testing/ui-automator)
