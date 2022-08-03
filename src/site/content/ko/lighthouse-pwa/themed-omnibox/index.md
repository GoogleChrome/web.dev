---
layout: post
title: 주소 표시줄의 테마 색상을 설정하지 않습니다.
description: |2-

  프로그레시브 웹 앱의 주소 표시줄 테마 색상을 설정하는 방법을 알아봅니다.
web_lighthouse:
  - themed-omnibox
date: 2019-05-04
updated: 2020-06-17
---

[프로그레시브 웹앱(PWA)](/discover-installable)의 브랜드 색상과 일치하도록 브라우저의 주소 표시줄 테마를 지정하면 더욱 몰입도 높은 사용자 환경을 제공합니다.

## 브라우저 호환성

작성 당시에 브라우저 주소 표시줄 테마는 Android 기반 브라우저에서 지원됩니다. 업데이트는 [브라우저 호환성](https://developer.mozilla.org/docs/Web/Manifest/theme_color#Browser_compatibility)을 참조하세요.

## Lighthouse 테마 색상 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 주소 표시줄에 테마를 적용하지 않은 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YadFSuw8denjl1hhnvFs.png", alt="주소 표시줄을 표시하는 Lighthouse 감사는 페이지 색상을 테마로 하지 않습니다.", width="800", height="98" %}</figure>

Lighthouse가 페이지의 HTML에서 `theme-color` 메타 태그를, [웹앱 매니페스트](/add-manifest)에서 `theme_color` 속성을 찾지 못하면 감사가 실패합니다.

Lighthouse는 값이 유효한 CSS 색상 값인지 테스트하지 않습니다.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 주소 표시줄의 테마 색상을 설정하는 방법

### 1단계: 브랜드화하려는 모든 페이지에 `theme-color` 메타 태그 추가

`theme-color` 메타 태그는 사용자가 일반 웹페이지로 여러분의 사이트를 방문할 때 주소 표시줄에 브랜드가 표시되도록 합니다. 태그의 `content` 속성을 모든 유효한 CSS 색상 값으로 설정합니다.

```html/4
<!DOCTYPE html>
<html lang="en">
<head>
  …
  <meta name="theme-color" content="#317EFB"/>
  …
</head>
…
```

Google의 [Android용 Chrome 39의 `theme-color` 지원](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android)에서 `theme-color` 메타 태그에 대해 자세히 알아보세요.

### 2단계: 웹앱 매니페스트에 `theme_color` 속성 추가

웹앱 매니페스트의 `theme_color` 속성은 사용자가 홈 화면에서 PWA를 시작할 때 주소 표시줄에 브랜드가 표시되도록 합니다. `theme-color` 메타 태그와는 달리 [매니페스트](/add-manifest)에서 한 번만 정의하면 됩니다. 속성을 유효한 CSS 색상 값으로 설정합니다.

```html/1
{
  "theme_color": "#317EFB"
  …
}
```

브라우저는 매니페스트의 `theme_color`에 따라 앱의 모든 페이지에 주소 표시줄 색상을 설정합니다.

## 참고자료

- [**주소 표시줄의 테마 색상을 설정하지 않음** 감사용 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/themed-omnibox.js)
- [웹앱 매니페스트 추가](/add-manifest)
- [Android용 Chrome 39의 `theme-color` 지원](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android)
