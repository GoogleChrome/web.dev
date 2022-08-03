---
layout: post
title: 매니페스트에 마스크 가능 아이콘 없음
description: |2-

  PWA에 마스크 가능 아이콘 지원을 추가하는 방법을 알아보세요.
web_lighthouse:
  - 마스크 가능 아이콘
date: 2020-05-06
---

[마스크 가능 아이콘](/maskable-icon/)은 모든 Android 기기에서 PWA 아이콘이 멋지게 보이도록 하는 새로운 아이콘 형식입니다. 최신 Android 기기에서 마스크 가능한 아이콘 형식을 따르지 않는 PWA 아이콘에는 흰색 배경이 제공됩니다. 마스크 가능한 아이콘을 사용하면 아이콘이 Android에서 제공하는 모든 공간을 차지하게 됩니다.

## Lighthouse 마스크 가능 아이콘 감사가 실패하는 방법

마스크 가능 아이콘 지원이 없는 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 플래그 페이지:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0lXCcsZdOeLZuAw3wbY.jpg", alt="Lighthouse 보고서 UI의 마스크 가능한 아이콘 감사.", width="800", height="110" %}</figure>

감사 통과 방법:

- 웹 앱 매니페스트가 있어야 합니다.
- 웹 앱 매니페스트에는 `icons` 배열이 있어야 합니다.
- `icons` `purpose` 속성이 있는 하나의 객체가 포함되어야 하고 `purpose` `maskable`이 포함되어야 합니다.

{% Aside 'caution' %} Lighthouse는 마스크 가능 아이콘으로 지정된 이미지를 검사하지 않습니다. 이미지가 잘 표시되는지 수동으로 확인해야 합니다. {% endAside %}

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## PWA에 마스크 가능 아이콘 지원을 추가하는 방법

1. [Maskable.app Editor](https://maskable.app/editor)를 사용하여 기존 아이콘을 마스크 가능 아이콘으로 변환합니다.

2. [웹 앱 매니페스트](/add-manifest/)의 `icons` 개체 중 하나에 `purpose` 속성을 추가합니다. `purpose`의 값을 `maskable` 또는 `any maskable`로 설정하십시오. [값](https://developer.mozilla.org/docs/Web/Manifest/icons#Values)을 참조하십시오.

    ```json/8
    {
      …
      "icons": [
        …
        {
          "src": "path/to/maskable_icon.png",
          "sizes": "196x196",
          "type": "image/png",
          "purpose": "any maskable"
        }
      ]
      …
    }
    ```

3. Chrome DevTools를 사용하여 마스크 가능 아이콘이 올바르게 표시되는지 확인합니다. [현재 아이콘이 준비되었습니까?](/maskable-icon/#are-my-current-icons-ready)를 참조하십시오.

## 자원

- [**매니페스트의 소스 코드에 마스크 가능 아이콘** 감사 없음](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/maskable-icon.js)
- [마스크 가능 아이콘이 있는 PWA의 적응형 아이콘 지원](/maskable-icon/)
- [Maskable.app 편집기](https://maskable.app/editor)
- [웹 앱 매니페스트 추가](/add-manifest/)
- [MDN의 `icons` 속성](https://developer.mozilla.org/docs/Web/Manifest/icons)
