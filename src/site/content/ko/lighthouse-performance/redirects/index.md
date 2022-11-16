---
layout: post
title: 여러 페이지 리디렉션 방지
description: 페이지 리디렉션이 웹 페이지의 로드 속도를 늦추는 이유와 이를 피하는 방법을 배웁니다.
web_lighthouse:
  - redirects
date: 2019-05-04
updated: 2019-09-19
---

리디렉션은 페이지 로드 속도를 느리게 합니다. 브라우저가 리디렉션된 리소스를 요청하면 서버는 일반적으로 다음과 같은 HTTP 응답을 반환합니다.

```js
HTTP/1.1 301 Moved Permanently
Location: /path/to/new/location
```

그런 다음 브라우저는 리소스를 검색하기 위해 새 위치에서 또 다른 HTTP 요청을 해야 합니다. 네트워크를 통한 이 추가 이동으로 인해 리소스 로드가 수백 밀리초만큼 지연될 수 있습니다.

## Lighthouse 다중 리디렉션 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 여러 리디렉션이 있는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uGOmnhqZoJnMoBgAiFJj.png", alt="", width="800", height="276" %}</figure>

두 개 이상의 리디렉션이 있는 페이지는 이 감사에 실패합니다.

## 리디렉션을 제거하는 방법

플래그가 지정된 리소스에 대한 링크를 리소스의 현재 위치로 지정합니다. [중요한 렌더링 경로](/critical-rendering-path/)에 필요한 리소스의 리디렉션을 피하는 것이 특히 중요합니다.

리디렉션을 사용하여 모바일 사용자를 페이지의 모바일 버전으로 전환하는 경우 [반응형 디자인](/responsive-web-design-basics/)을 사용하도록 사이트를 다시 디자인하는 것이 좋습니다.

## 스택별 지침

### React

React Router를 사용하는 경우 [경로 탐색](https://reacttraining.com/react-router/web/api/Redirect)을 `<Redirect>` 구성 요소의 사용을 최소화하십시오.

## 참고 자료

- [**다중 페이지 리디렉션 방지** 감사의 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/redirects.js)
- [HTTP의 리디렉션](https://developer.mozilla.org/docs/Web/HTTP/Redirections)
- [방문 페이지 리디렉션 방지](https://developers.google.com/speed/docs/insights/AvoidRedirects)
