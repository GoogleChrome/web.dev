---
layout: post
title: アプリはインストールされていますか？ getInstalledRelatedApps（）が教えます！
subhead: "`getInstalledRelatedApps（）`方法を使用することにより、WebサイトでiOS / Android /desktopアプリまたはPWAがユーザーのデバイスにインストールされているか確認できます。"
authors:
  - petelepage
description: getInstalledRelatedApps（）APIは、WebプラットフォームAPIで、 iOS / Android /desktopアプリまたはPWAがユーザーのデバイスににインストールされているか確認できます。
date: 2018-12-20
updated: 2021-09-16
tags:
  - blog
  - capabilities
hero: image/admin/v9t93rXITPqFe3L0qlTN.jpg
alt: アプリパネルが開いている状態のモバイルデバイス
feedback:
  - api
---

## getInstalledRelatedApps() APIとは何ですか？ {: ＃何 }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vjamv2uyz6NxBPxPIm11.jpg", alt="", width="550", height="486" %}Webサイトが<code>getInstalledRelatedApps()</code>を使用してAndroidアプリが既にインストールされているか確認します。</figure>

[`getInstalledRelatedApps()`](https://wicg.github.io/get-installed-related-apps/spec/)は*あなたの*ページで*あなたの*Mobile/Desktopアプリが、または場合によって、Progresssive Web App (PWA)がユーザーのデバイスに既にインストールされているかを確認でき、ユーザーエクスペリエンスをカスタマイズできます。

たとえば、アプリがすでにインストールされている場合：

- ユーザーを商品マーケティングページからアプリに直接リダイレクトします。
- 通知が重複しないように、他のアプリでの通知など一部の機能を一元化します。
- 他のアプリがすでにインストールされている場合は、PWA[のインストール](/customize-install/)を宣伝しません。

`getInstalledRelatedApps()`  APIを使用するには、アプリにサイトについて通知してから、サイトにアプリについて通知する必要があります。 2つの関係を定義したら、アプリがインストールされているかどうかを確認できます。

### 確認できる対応Appの種類

<div>
  <table data-alignment="top">
    <thead>
      <tr>
        <th>アプリの種類</th>
        <th>からチェック可能</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="#check-android">Androidアプリ</a></td>
        <td>Androidのみ<br>Chrome80またはそれ以降</td>
      </tr>
      <tr>
        <td><a href="#check-windows">Windows（UWP）アプリ</a></td>
        <td>Windowsのみ<br>Chrome85またはそれ以降<br>Edge85またはそれ以降</td>
      </tr>
      <tr>
        <td>プログレッシブウェブアプリ<br><a href="#check-pwa-in-scope">同じスコープ</a>または<a href="#check-pwa-out-of-scope">別のスコープに</a>インストールされています。</td>
        <td>Androidのみ<br>Chrome84またはそれ以降</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} `getInstalledRelatedApps()` *APIでは、アプリがインストールされているかどうかのみを確認できます。インストールされたアプリのリストを取得すること、他のサードパーティのアプリがインストールされているかどうかを確認したりすることはできません。* {% endAside %}

<!--  Android App -->

## Androidアプリがインストールされているかどうかを確認します{: #check-android}

WebサイトはAndroidアプリがインストールされているか確認できます。

{% Compare 'better', 'Supported on' %} Android：Chrome80またそれ以降{% endCompare %}

### WebサイトについてAndroid アプリに通知します。

まず、[Digital AssetLinksシステム](https://developers.google.com/digital-asset-links/v1/getting-started)を使用して、WebサイトとAndroidアプリの関係を定義することにAndroidアプリを更新する必要があります。これにより、AndroidアプリがインストールされているかどうかをWebサイトのみが確認できるようになります。

Androidアプリの`AndroidManifest.xml`に `asset_statements`エントリを追加します。

```xml
<manifest>
  <application>
   …
    <meta-data android:name="asset_statements" android:resource="@string/asset_statements" />
   …
  </application>
</manifest>
```

次に、 `strings.xml`に次のアセットステートメントを追加し、ドメインで `site`を更新します。エスケープ文字を含めるようにしてください。

```xml
<string name="asset_statements">
  [{
    \"relation\": [\"delegate_permission/common.handle_all_urls\"],
    \"target\": {
      \"namespace\": \"web\",
      \"site\": \"https://example.com\"
    }
  }]
</string>
```

完了したら、更新したAndroidアプリをPlay storeに公開します。

### Androidアプリについてwebsiteに通知します。

次に、[Webアプリマニフェストをページに追加](/add-manifest/) して、 AndroidアプリについてWebサイトに通知します。 マニフェストには、`related_applications`プロパティ、つまり `platform`や`id`などのアプリに関する詳細を提供する配列を含める必要があります。

- `platform`が `play`必要があります
- `id`はAndroidアプリのGooglePlayアプリケーションIDです

```json
{
  "related_applications": [{
    "platform": "play",
    "id": "com.android.chrome",
  }]
}
```

### アプリがインストールされているかどうかを確認します

最後に、 [`navigator.getInstalledRelatedApps()`](#use)を呼び出して、Androidアプリがインストールされているかどうかを確認します。

[デモ](https://get-installed-apps.glitch.me/)をお試しください

<!--  Windows App -->

## Windows（UWP）アプリがインストールされているかどうかを確認します{: #check-windows}

Webサイトでは、Windowsアプリ（UWPを使用して構築）がインストールされているかどうかを確認できます。

{% Compare 'better', 'Supported on' %} Windows：Chrome 85またはそれ以降、Edge85またはそれ以降{% endCompare %}

### WebサイトについてWindowsアプリに通知します。

[URIハンドラー](https://docs.microsoft.com/windows/uwp/launch-resume/web-to-app-linking)を使用して、WebサイトとWindowsアプリケーション間の関係を定義するには、Windowsアプリを更新する必要があります。これにより、あなたのWebサイトでしかWindowsアプリがインストールされているかを確認できません。

`Windows.appUriHandler`拡張機能登録をアプリのマニフェストファイル`Package.appxmanifest`追加します。たとえば、ウェブサイトのアドレスが`example.com`場合、アプリのマニフェストに次のエントリを追加します。

```xml
<Applications>
  <Application Id="App" ... >
      ...
      <Extensions>
         <uap3:Extension Category="windows.appUriHandler">
          <uap3:AppUriHandler>
            <uap3:Host Name="example.com" />
          </uap3:AppUriHandler>
        </uap3:Extension>
      </Extensions>
  </Application>
</Applications>
```

`<Package>`属性に[`uap3`名前空間](https://docs.microsoft.com/uwp/schemas/appxpackage/uapmanifestschema/element-uap3-extension-manual#examples)を追加する必要がある場合があることに注意してください。

`windows-app-web-link`という名前で`.json`ファイル（.jsonファイル拡張子なし）を作成し、アプリのパッケージファミリー名を指定します。そのファイルをサーバールートまたは`/.well-known/`ディレクトリに配置します。パッケージファミリー名は、アプリケーションマニフェストデザイナのパッケージングセクションにあります。

```json
[{
  "packageFamilyName": "MyApp_9jmtgj1pbbz6e",
  "paths": [ "*" ]
}]
```

URIハンドラーの設定の詳細については、「 [アプリURIハンドラーを使用してWebサイトでアプリ](https://docs.microsoft.com/windows/uwp/launch-resume/web-to-app-linking)を有効にする」を参照してください。

### WindowsアプリについてWebサイトに通知します。

次に、Webアプリマニフェストをページに[追加して、](/add-manifest/) WindowsアプリについてWebサイトに通知します。 マニフェストには、`related_applications`プロパティ、つまり `platform`や`id`などのアプリに関する詳細を提供する配列を含める必要があります。

- `platform`には`windows`必要があります
- `id`は、アプリのパッケージファミリ名であり、 `Package.appxmanifest`ファイルの`<Application>` `Id`値が追加されます。

```json
{
  "related_applications": [{
    "platform": "windows",
    "id": "MyApp_9jmtgj1pbbz6e!App",
  }]
}
```

### アプリがインストールされているかを確認します

最後に、 [`navigator.getInstalledRelatedApps()`](#use)を呼び出して、Windowsアプリがインストールされているかどうかを確認します。

<!--  PWA - in scope -->

## Progressive Web Appがすでにインストールされているかを確認します（範囲内{: #check-pwa-in-scope}

PWAは、すでにインストールされているかどうかを確認できます。この場合、リクエストを行うページは同じドメイン上にあり、Webアプリマニフェストの範囲で定義されているように、PWA[のスコープ内にある必要があります。](/add-manifest/#scope)

{% Compare 'better', 'Supported on' %} Android：Chrome84以降{% endCompare %}

### PWA にそれ自体を伝えください

PWAの[Webアプリマニフェストに](/add-manifest/)`related_applications`エントリを追加して、PWAにそれ自体について通知します。

- `platform` は`webapp`である必要があります
- `url`は、PWAのWebアプリマニフェストへのフルパスです。

```json
{
  …
  "scope": "/",
  "start_url": "/",
  "related_applications": [{
    "platform": "webapp",
    "url": "https://example.com/manifest.json",
  }],
  …
}
```

### PWAがインストールされているかどうかを確認します

最後に、 [PWAの範囲](/add-manifest/#scope)内から[`navigator.getInstalledRelatedApps()`](#use)を呼び出して、インストールされているかどうかを確認します。 `getInstalledRelatedApps()`がPWAの範囲外で呼び出された場合、falseが返されます。詳細については、次のセクションを参照してください。

[デモ](https://gira-same-domain.glitch.me/pwa/)をお試しください

<!--  PWA - NOT in scope -->

## Progressive Web Appがインストールされているかどうかを確認します（範囲外）{: #check-pwa-out-of-scope}

ページがPWAの[範囲](/add-manifest/#scope)外であっても、WebサイトはPWAがインストールされているかどうかを確認できます。 例えば、`/landing/`から提供されるランディングページは、 `/pwa/`から提供されるPWAがインストールされているかどうか、またはランディングページが`www.example.com`から提供され、PWAが`app.example.com`から提供されるかどうかを確認できます。

{% Compare 'better', 'Supported on' %} Android：Chrome84またはそれ以降{% endCompare %}

### WebサイトについてPWAに通知します。

まず、PWAが提供されているサーバーにデジタルアセットLinkを追加する必要があります。これは、WebサイトとPWAの関係を定義するのに役立ち、WebサイトのみがPWAがインストールされているかどうかを確認できます。

追加`assetlinks.json`にファイルを[`/.well-known/`](https://tools.ietf.org/html/rfc5785)例えば、PWAが住んでいるドメインのディレクトリ`app.example.com` 。 `site`プロパティで、チェックを実行するWebアプリマニフェストへのフルパスを指定します（PWAのWebアプリマニフェストではありません）。

```json
// Served from https://app.example.com/.well-known/assetlinks.json
[
  {
    "relation": ["delegate_permission/common.query_webapk"],
    "target": {
      "namespace": "web",
      "site": "https://www.example.com/manifest.json"
    }
  }
]
```
{% Aside %}
`assetlinks.json`ファイルを作成するときにファイル名を再確認してください。デバッグに何時間もかかってしまい、ファイル名に「s」を追加したことに気づきました。 {% endAside %}

### PWAについてWebサイトに伝えます

次に、Webアプリマニフェストをページに[追加して、](/add-manifest/) PWAアプリについてWebサイトに通知します。 マニフェストには、`related_applications` プロパティ、つまり`platform`や`url`などのPWAに関する詳細を提供する配列を含める必要があります。

- `platform` は`webapp`である必要があります
- `url`は、PWAのWebアプリマニフェストへのフルパスです。

```json
{
  "related_applications": [{
    "platform": "webapp",
    "url": "https://app.example.com/manifest.json",
  }]
}
```

### PWAがインストールされているかどうかを確認します

最後に、 [`navigator.getInstalledRelatedApps()`](#use)を呼び出して、PWAがインストールされているかどうかを確認します。

[デモ](https://gira-same-domain.glitch.me/)をお試しください

<!--  Use the API-->

## getInstalledRelatedApps() を呼び出す {: #use }

`navigator.getInstalledRelatedApps()`呼び出すと、ユーザーのデバイスにインストールされているアプリの配列で解決されるPromiseが返されます。

```js
const relatedApps = await navigator.getInstalledRelatedApps();
relatedApps.forEach((app) => {
  console.log(app.id, app.platform, app.url);
});
```

サイトが独自のアプリを幅広くテストすることを防ぐために、Webアプリマニフェストで宣言された最初の3つのアプリのみが実施できます。

他のほとんどの強力なWebAPIと同様に、 `getInstalledRelatedApps()` **APIは、HTTPS経由で**提供される場合にのみ使用できます。

## まだ質問がありますか？ {: #questions }

まだ質問がありますか？ StackOverflowの [`getInstalledRelatedApps`タグ](https://stackoverflow.com/search?q=getinstalledrelatedapps)を取得して、他に同じ質問があるかを確認してください。ない場合は、[そこで質問](https://stackoverflow.com/questions/tagged/progressive-web-apps)し、必ず[`progressive-web-apps`](https://stackoverflow.com/questions/tagged/progressive-web-apps)タグを付けてください。私たちのチームはそのタグを頻繁に監視し、質問に答えようとします。

## フィードバック{: #feedback }

Chromeの実装にバグを見つけましたか？それとも、実装は仕様とは異なりますか？

- [https://new.crbug.comで](https://bugs.chromium.org/p/chromium/issues/entry?components=Mobile%3EWebAPKs)バグを報告してください。できるだけ詳細を含め、バグを再現するための簡単な手順を提供し、**コンポーネント**ボックスに`Mobile>WebAPKs`[Glitch](https://glitch.com)は、すばやく簡単に再現を共有するのに最適です。

## APIのサポートを表示する

`getInstalledRelatedApps()` APIを使用する予定ですか？パブリックサポートは、Chromeチームが機能に優先順位を付けること、他のブラウザベンダーにそれらをサポートの重要性を示すのに役立ちます。

- [WICG Discourseスレッド](https://discourse.wicg.io/t/proposal-get-installed-related-apps-api/1602)でAPIをどのように使用する予定かを共有します。
- ハッシュタグ[<code>#getInstalledRelatedApps</code>](https://twitter.com/chromiumdev)を使用して<a>@ChromiumDev</a>にツイートを送信し、どこでどのようにそれを使用しているか私たちにお知らせください。

## 役立つリンク{: #helpful }

- [`getInstalledRelatedApps()` APIの公開説明者](https://github.com/WICG/get-installed-related-apps/blob/main/EXPLAINER.md)
- [スペックドラフト](https://wicg.github.io/get-installed-related-apps/spec/)
- [バグの追跡](https://bugs.chromium.org/p/chromium/issues/detail?id=895854)
- [ChromeStatus.comエントリ](https://www.chromestatus.com/feature/5695378309513216)
- 点滅コンポーネント： [`Mobile>WebAPKs`](https://chromestatus.com/features#component%3A%20Mobile%3EWebAPKs)

## ご感謝

Windowsアプリテストの詳細をご努力頂いたMicrosoftのSunggookChue氏と、Chrome の詳細についてのご協力頂いたRayanKanso氏には、特に感謝いたします。
