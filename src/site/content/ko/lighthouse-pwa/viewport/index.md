---
layout: post
title: '`width` 또는 `initial-scale`이 있는 `<meta name="viewport">` 태그 없음'
description: '"너비 또는 초기 규모가 있는 <meta name="viewport"> 태그 없음" Lighthouse 감사에 대한 정보'
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - 뷰포트
---

많은 검색 엔진은 페이지가 모바일 친화적인 정도에 따라 페이지 순위를 매깁니다. [뷰포트 메타 태그](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag)가 없으면 휴대기기는 페이지를 일반적인 데스크톱 화면 너비로 렌더링한 다음 페이지를 축소하여 읽기 어렵게 만듭니다.

뷰포트 메타 태그를 설정하면 뷰포트의 너비와 크기를 제어하여 모든 기기에서 올바른 크기로 조정할 수 있습니다.

## Lighthouse 뷰포트 메타 태그 감사가 실패하는 방법

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 표시 영역 메타 태그가 없는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/g9La56duNlpHZntDnzY9.png", alt="Lighthouse 감사는 페이지에 표시 영역이 누락되었음을 보여줍니다", width="800", height="76" %}</figure>

다음 조건이 모두 충족되지 않으면 페이지는 감사에 실패합니다.

- 문서의 `<head>` 에는 `<meta name="viewport">` 태그가 포함되어 있습니다.
- 뷰포트 메타 태그에는 `content` 속성이 포함되어 있습니다.
- `content` 속성의 값에는 `width=` 텍스트가 포함됩니다.

Lighthouse `width`가 `device-width`와 같은지 확인하지 *않습니다*. `initial-scale` 키-값 쌍을 확인하지 않습니다. 그러나 모바일 장치에서 페이지가 올바르게 렌더링되도록 두 가지를 모두 포함해야 합니다.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 뷰포트 메타 태그를 추가하는 방법

적절한 키-값 쌍이 있는 뷰포트 `<meta>` 태그를 `<head>`에 추가합니다.

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …
```

각 키-값 쌍이 하는 일은 다음과 같습니다.

- `width=device-width`는 뷰포트의 너비를 장치의 너비로 설정합니다.
- `initial-scale=1`은 사용자가 페이지를 방문할 때 초기 확대/축소 수준을 설정합니다.

## 자원

- [**`너비` 또는 `최초 규모`가 있는 `<meta name="viewport">` 태그** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/viewport.js)
- [반응형 웹 디자인 기초](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#set-the-viewport)
- [뷰포트 메타 태그를 사용하여 모바일 브라우저에서 레이아웃 제어](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag)
