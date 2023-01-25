---
layout: post
title: 앱이 설치되어 있습니까? getInstalledRelatedApps()가 알려줄 것입니다!
subhead: "`getInstalledRelatedApps()` 메서드를 사용하면 웹사이트에서 iOS/Android/데스크톱 앱 또는 PWA가 사용자의 기기에 설치되어 있는지 확인할 수 있습니다."
authors:
  - petelepage
description: "`getInstalledRelatedApps()` 메서드는 웹사이트에서 iOS/Android/데스크톱 앱 또는 PWA가 사용자의 기기에 설치되어 있는지 확인할 수 있게 하는 웹 플랫폼 API입니다."
date: 2018-12-20
updated: 2021-09-16
tags:
  - blog
  - capabilities
hero: image/admin/v9t93rXITPqFe3L0qlTN.jpg
alt: 앱 패널이 열린 휴대기기
feedback:
  - api
---

## getInstalledRelatedApps() API란 무엇입니까? {: #what }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vjamv2uyz6NxBPxPIm11.jpg", alt="", width="550", height="486" %} <figcaption> Android 앱이 이미 설치되어 있는지 확인하기 위해 <code>getInstalledRelatedApps()</code>를 사용하는 웹사이트.</figcaption></figure>

[`getInstalledRelatedApps()`](https://wicg.github.io/get-installed-related-apps/spec/)를 사용하면 *여러분*의 페이지에서 *여러분*의 모바일, 데스크톱 앱 또는 경우에 따라서 PWA가 사용자 장치에 설치되었는지 확인하고 그러한 경우 사용자 경험을 최적화 할 수 있습니다.

예를 들어 앱이 이미 설치된 경우 다음을 할 수 있습니다.

- 사용자를 제품 마케팅 페이지에서 앱으로 직접 리디렉션합니다.
- 중복 알림을 방지하기 위해 다른 앱의 알림과 같은 일부 기능을 중앙 집중화합니다.
- 다른 앱이 이미 설치된 경우 PWA [설치](/customize-install/)를 홍보하지 않습니다.

`getInstalledRelatedApps()` API를 사용하려면 앱에 사이트에 대해 알려준 다음 사이트에 앱에 대해 알려야 합니다. 둘 사이의 관계를 정의하면 앱이 설치되었는지 확인할 수 있습니다.

### 확인할 수 있는 지원 앱 유형

<div>
  <table data-alignment="top">
    <thead>
      <tr>
        <th>앱 유형</th>
        <th>확인 가능 버전</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="#check-android">Android 앱</a></td>
        <td>Android 전용<br> Chrome 80 이상</td>
      </tr>
      <tr>
        <td><a href="#check-windows">Windows(UWP) 앱</a></td>
        <td>Windows 전용<br> Chrome 85 이상<br> Edge 85 이상</td>
      </tr>
      <tr>
        <td>
<br><a href="#check-pwa-in-scope">동일한 범위</a> 또는 <a href="#check-pwa-out-of-scope">다른 범위에 설치된</a> PWA.</td>
        <td>Android 전용<br> Chrome 84 이상</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} 는 `getInstalledRelatedApps()` API는 *여러분의의* 응용 프로그램이 설치되어 있는지 확인할 수 있습니다. 설치된 모든 앱의 목록을 얻거나 다른 타사 앱이 설치되어 있는지 확인할 수 없습니다. {% endAside %}

<!--  Android App -->

## Android 앱이 설치되어 있는지 확인 {: #check-android }

웹사이트에서 Android 앱이 설치되어 있는지 확인할 수 있습니다.

{% Compare 'better', 'Supported on' %} Android: Chrome 80 이상 {% endCompare %}

### 웹사이트에 대해 Android 앱에 알리기

먼저 [Digital Asset Links 시스템을](https://developers.google.com/digital-asset-links/v1/getting-started) 사용하여 웹사이트와 Android 애플리케이션 간의 관계를 정의하도록 Android 앱을 업데이트해야 합니다. 이렇게 하면 여러분의 웹사이트만 여러분의 Android 앱이 설치되어 있는지 확인할 수 있습니다.

Android 앱의 `AndroidManifest.xml`에 `asset_statements` 항목을 추가합니다.

```xml
<manifest>
  <application>
   …
    <meta-data android:name="asset_statements" android:resource="@string/asset_statements" />
   …
  </application>
</manifest>
```

그런 다음, `strings.xml`에 다음 자산 설명을 추가하여 `site`를 도메인으로 업데이트하십시오. 이스케이프 문자를 포함해야 합니다.

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

완료되면 업데이트된 Android 앱을 Play 스토어에 게시합니다.

### Android 앱에 대해 웹사이트에 알리기

그런 다음 페이지에 [웹 앱 매니페스트](/add-manifest/)를 추가하여 Android 앱에 대해 웹사이트에 알립니다. `platform` 및 `id`를 포함하여 앱에 대한 세부 정보를 제공하는 배열인 `related_applications` 속성이 포함되어야 합니다.

- `platform`은 `play`이어야 합니다
- `id` 는 Android 앱의 GooglePlay 애플리케이션 ID입니다

```json
{
  "related_applications": [{
    "platform": "play",
    "id": "com.android.chrome",
  }]
}
```

### 앱이 설치되어 있는지 확인

마지막으로 [`navigator.getInstalledRelatedApps()`](#use)를 호출하여 Android 앱이 설치되었는지 확인합니다.

[데모](https://get-installed-apps.glitch.me/) 사용해보기

<!--  Windows App -->

## Windows(UWP) 앱이 설치되어 있는지 확인 {: #check-windows }

웹 사이트는 Windows 앱(UWP를 사용하여 빌드)이 설치되어 있는지 확인할 수 있습니다.

{% Compare 'better', 'Supported on' %} Windows: Chrome 85 이상, Edge 85 이상 {% endCompare %}

### 웹 사이트에 대해 Windows 앱에 알리기

[URI 처리기](https://docs.microsoft.com/en-us/windows/uwp/launch-resume/web-to-app-linking)를 사용하여 웹 사이트와 Windows 애플리케이션 간의 관계를 정의하려면 Windows 앱을 업데이트해야 합니다. 이렇게 하면 여러분의 웹 사이트만 여러분의 Windows 앱이 설치되어 있는지 확인할 수 있습니다.

앱의 매니페스트 파일 `Package.appxmanifest` `Windows.appUriHandler` 확장 등록을 추가합니다. 예를 들어 웹사이트 주소가 `example.com` 인 경우 앱의 매니페스트에 다음 항목을 추가합니다.

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

`<Package>` 속성에 [`uap3` 네임스페이스](https://docs.microsoft.com/en-us/uwp/schemas/appxpackage/uapmanifestschema/element-uap3-extension-manual#examples) 를 추가해야 할 수도 있습니다.

`windows-app-web-link`라는 JSON 파일(`.json` 파일 확장자 제외)을 만들고 앱의 패키지 제품군 이름을 제공합니다. 해당 파일을 서버 루트나 `/.well-known/` 디렉토리에 두십시오. 앱 매니페스트 디자이너의 패키징 섹션에서 패키지 패밀리 이름을 찾을 수 있습니다.

```json
[{
  "packageFamilyName": "MyApp_9jmtgj1pbbz6e",
  "paths": [ "*" ]
}]
```

URI 처리기 설정에 대한 자세한 내용은 [앱 URL 처리기를 사용하여 웹 사이트용 앱 활성화](https://docs.microsoft.com/en-us/windows/uwp/launch-resume/web-to-app-linking)를 참조하세요.

### 웹 사이트에 Windows 앱에 대해 알리기

그런 다음 페이지에 [웹 앱 매니페스트](/add-manifest/)를 추가하여 Windows 앱에 대해 웹사이트에 알립니다. `platform` 및 `id` 포함하여 앱에 대한 세부 정보를 제공하는 배열인 `related_applications` 속성이 포함되어야 합니다.

- `platform`은 `windows`이어야 합니다
- `id`는 `Package.appxmanifest`의 `<Application>` `Id` 값이 추가된 앱의 패키지 패밀리 이름입니다.

```json
{
  "related_applications": [{
    "platform": "windows",
    "id": "MyApp_9jmtgj1pbbz6e!App",
  }]
}
```

### 앱이 설치되어 있는지 확인

마지막으로 [`navigator.getInstalledRelatedApps()`](#use)를 호출하여 Windows 앱이 설치되었는지 확인합니다.

<!--  PWA - in scope -->

## PWA가 이미 설치되어 있는지 확인(범위 내) {: #check-pwa-in-scope }

PWA가 이미 설치되어 있는지 확인할 수 있습니다. 이 경우 요청하는 페이지는 웹 앱 매니페스트의 범위에 의해 정의된 대로 동일한 도메인에 있어야 하고 PWA [범위](/add-manifest/#scope) 내에 있어야 합니다.

{% Compare 'better', 'Supported on' %} Android: Chrome 84 이상 {% endCompare %}

### 자신에 대해 PWA에 알리십시오

[PWA 웹 앱 매니페스트](/add-manifest/)에 `related_applications` 항목을 추가하여 PWA에 대해 알립니다.

- `platform`은 `webapp`이어야 합니다
- `url`은 PWA의 웹 앱 매니페스트에 대한 전체 경로입니다

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

### PWA가 설치되어 있는지 확인

마지막으로 PWA [범위](/add-manifest/#scope) 내에서 [`navigator.getInstalledRelatedApps()`](/add-manifest/#scope)를 호출하여 설치되었는지 확인합니다. `getInstalledRelatedApps()`가 PWA 범위 밖에서 호출되면 false를 반환합니다. 자세한 내용은 다음 섹션을 참조하십시오.

[데모](https://gira-same-domain.glitch.me/pwa/) 사용해보기

<!--  PWA - NOT in scope -->

## PWA가 설치되어 있는지 확인(범위 외) {: #check-pwa-out-of-scope }

페이지가 PWA [범위](/add-manifest/#scope)를 벗어나더라도 웹사이트에서 PWA가 설치되어 있는지 확인할 수 있습니다. `/landing/`에서 제공되는 방문 페이지는 `/pwa/`에서 제공되는 PWA가 설치되어 있는지 또는 방문 페이지가 `www.example.com`에서 제공되고 PWA가 `app.example.com`에서 제공되는지 확인할 수 있습니다.

{% Compare 'better', 'Supported on' %} Android: Chrome 84 이상 {% endCompare %}

### 웹사이트에 대해 PWA에 알리세요

먼저 PWA가 제공되는 서버에 디지털 자산 링크를 추가해야 합니다. 이렇게 하면 웹사이트와 PWA 간의 관계를 정의하는 데 도움이 되며 여러분의 웹사이트만 여러분의 PWA가 설치되어 있는지 확인할 수 있습니다.

`assetlinks.json` 파일을 PWA가 있는 도메인의 [`/.well-known/`](https://tools.ietf.org/html/rfc5785) 디렉터리에 추가합니다(예: `app.example.com`). `site` 속성에서 검사를 수행할 웹 앱 매니페스트의 전체 경로를 제공합니다(PWA의 웹 앱 매니페스트 아님).

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

{% Aside %} `assetlinks.json` 파일을 생성할 때 파일 이름을 다시 확인하세요. 저는 디버깅에 많은 시간을 낭비하다가 파일 이름에 's'를 추가했다는 사실을 깨달았습니다. {% endAside %}

### 웹사이트에 PWA에 대해 알리세요

그런 다음 페이지에 [웹 앱 매니페스트](/add-manifest/)를 추가하여 PWA 앱에 대해 웹사이트에 알립니다. `platform` 및 `url`을 포함하여 PWA에 대한 세부 정보를 제공하는 배열인 `related_applications` 속성이 포함되어야 합니다.

- `platform`은 `webapp`이어야 합니다
- `url` 은 PWA의 웹 앱 매니페스트에 대한 전체 경로입니다

```json
{
  "related_applications": [{
    "platform": "webapp",
    "url": "https://app.example.com/manifest.json",
  }]
}
```

### PWA가 설치되어 있는지 확인

마지막으로 [`navigator.getInstalledRelatedApps()`](#use)를 호출하여 PWA가 설치되었는지 확인합니다.

[데모](https://gira-same-domain.glitch.me/) 사용해보기

<!--  Use the API-->

## getInstalledRelatedApps() 호출 {: #use }

`navigator.getInstalledRelatedApps()`를 호출하면 사용자 장치에 설치된 앱 배열로 해결되는 약속이 반환됩니다.

```js
const relatedApps = await navigator.getInstalledRelatedApps();
relatedApps.forEach((app) => {
  console.log(app.id, app.platform, app.url);
});
```

사이트에서 지나치게 광범위한 자체 앱 세트를 테스트하지 못하도록 웹 앱 매니페스트에 선언된 처음 세 개의 앱만 고려됩니다.

대부분의 다른 강력한 웹 API와 마찬가지로 `getInstalledRelatedApps()` **API는 HTTPS를** 통해 제공되는 경우에만 사용할 수 있습니다.

## 아직 질문이 있으신가요? {: #questions }

아직 질문이 있으신가요? [StackOverflow에서 `getInstalledRelatedApps` 태그를](https://stackoverflow.com/search?q=getinstalledrelatedapps) 확인하여 비슷한 질문이 있는 사람이 있는지 확인하세요. 그렇지 않은 경우 거기에서 [질문](https://stackoverflow.com/questions/tagged/progressive-web-apps)을 하되 [`progressive-web-apps`](https://stackoverflow.com/questions/tagged/progressive-web-apps) 태그를 지정하세요. 저희 팀은 해당 태그를 자주 모니터링하고 귀하의 질문에 답변하려고 합니다.

## 피드백 {: #feedback }

Chrome 구현에서 버그를 찾으셨나요? 아니면 구현이 사양과 다른가요?

- [https://new.crbug.com][에서] 버그를 [신고하세요](https://bugs.chromium.org/p/chromium/issues/entry?components=Mobile%3EWebAPKs). 가능한 한 많은 세부 정보를 포함하고 버그를 재현하기 위한 간단한 지침을 제공하고 **구성 요소** 상자에 `Mobile>WebAPKs`를 입력합니다. [Glitch](https://glitch.com) 는 빠르고 쉬운 재현을 공유하는 데 유용합니다.

## API에 대한 지원 표시

`getInstalledRelatedApps()`를 사용할 계획이십니까? Chrome 팀이 기능의 우선 순위를 정하고 브라우저 공급업체에 이 API의 지원이 얼마나 중요한지 보여주기 위해서는 여러분의 공개 지원이 힘이 됩니다.

- [WICG Discourse 스레드](https://discourse.wicg.io/t/proposal-get-installed-related-apps-api/1602)에서 API 사용 계획을 공유하세요.
- [@ChromiumDev](https://twitter.com/chromiumdev)으로 해시태그  [`#getInstalledRelatedApps`](https://twitter.com/search?q=%23getInstalledRelatedApps&src=typed_query&f=live)를 포함한 트윗을 보내서 어디에서 어떻게 활용하고 있는지 알려주세요.

## 유용한 링크 {: #helpful }

- [`getInstalledRelatedApps()` API에 대한 공개 설명](https://github.com/WICG/get-installed-related-apps/blob/main/EXPLAINER.md)
- [사양 초안](https://wicg.github.io/get-installed-related-apps/spec/)
- [버그 추적](https://bugs.chromium.org/p/chromium/issues/detail?id=895854)
- [ChromeStatus.com 항목](https://www.chromestatus.com/feature/5695378309513216)
- Blink 구성 요소: [`Mobile>WebAPKs`](https://chromestatus.com/features#component%3A%20Mobile%3EWebAPKs)

## 감사의 말

Windows 앱 테스트에 대한 세부 정보를 제공한 Microsoft의 Sunggook Chu와 Chrome 세부 정보에 대한 도움을 준 Rayan Kanso에게 특별히 감사드립니다.
