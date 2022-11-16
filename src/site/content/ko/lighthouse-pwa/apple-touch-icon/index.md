---
layout: post
title: 유효한 apple-touch-icon을 제공하지 않음
description: Progressive Web App이 iOS 홈 화면에 표시할 아이콘을 지정하는 방법을 알아봅니다.
web_lighthouse:
  - apple-touch-icon
codelabs: codelab-apple-touch-icon
date: 2019-08-27
updated: 2019-09-19
---

iOS Safari 사용자가 홈 화면에 [PWA(Progressive Web App)](/discover-installable)를 추가하는 경우에 나타나는 아이콘을 *Apple 터치 아이콘*이라고 합니다. 페이지의 `<head>`에 `<link rel="apple-touch-icon" href="/example.png">` 태그를 포함시켜 앱에서 사용해야 하는 아이콘을 지정할 수 있습니다. 페이지에 이 링크 태그가 없으면 iOS가 페이지 콘텐츠의 스크린샷을 찍어 아이콘을 생성합니다. 즉, iOS에 아이콘을 다운로드하도록 지시하면 보다 세련된 사용자 경험을 얻을 수 있습니다.

## Lighthouse Apple 터치 아이콘 감사에 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 `<head>`에 `<link rel="apple-touch-icon" href="/example.png">` 태그가 없는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mXGs4XSr4DXMxLk536wo.png", alt="유효한 apple-touch-icon을 제공하지 않음", width="800", height="95" %}</figure>

{% Aside %} `rel="apple-touch-icon-precomposed"` 링크가 감사를 통과했지만 iOS 7부터는 이 링크가 사용되지 않습니다. 대신 `rel="apple-touch-icon"`을 사용하세요. {% endAside %}

Lighthouse는 아이콘이 실제로 존재하는지, 또는 아이콘이 올바른 크기인지 확인하지 않습니다.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Apple 터치 아이콘을 추가하는 방법

1. 페이지의 `<head>`에 `<link rel="apple-touch-icon" href="/example.png">`를 추가합니다.

    ```html/4
    <!DOCTYPE html>
    <html lang="en">
      <head>
        …
        <link rel="apple-touch-icon" href="/example.png">
        …
      </head>
      …
    ```

2. `/example.png`를 아이콘의 실제 경로로 바꿉니다.

{% Aside 'codelab' %} [Progressive Web App에 Apple 터치 아이콘 추가](/codelab-apple-touch-icon) 코드랩을 확인하여 Apple 터치 아이콘을 추가하면 사용자 경험이 개선되는 이유를 알아보세요. {% endAside %}

개선된 사용자 경험을 제공하려면 다음을 확인하세요.

- 아이콘이 180x180픽셀 또는 192x192픽셀입니다.
- 아이콘에 대한 지정된 경로가 유효합니다.
- 아이콘의 배경이 투명하지 않습니다.

## 리소스

- [**유효한 `apple-touch-icon`을 제공하지 않음** 감사의 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/apple-touch-icon.js)
- [설치 가능하게 하려면 필요한 사항 알아보기](/install-criteria)
- <a href="https://webhint.io/docs/user-guide/hints/hint-apple-touch-icons/" rel="noreferrer">Apple 터치 아이콘 사용</a>
