---
layout: post
title: 모든 리소스에 HTTP/2를 사용하지 않음
description: HTTP/2가 페이지 로드 시간에 중요한 이유와 서버에서 HTTP/2를 활성화하는 방법을 알아봅니다.
web_lighthouse:
  - uses-http2
date: 2019-05-02
updated: 2019-08-28
---

HTTP/2는 유선을 통해 이동하는 데이터를 줄여 페이지 리소스를 더 빠르게 제공합니다.

## Lighthouse HTTP/2 감사가 실패하는 방식

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 HTTP/2를 통해 제공되지 않는 모든 리소스를 나열합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Gs0J63479ELUkMeI8MRS.png", alt="Lighthouse 감사는 HTTP/2를 통해 제공되지 않는 리소스를 보여줍니다", width="800", height="191" %}</figure>

Lighthouse는 페이지에서 요청한 모든 리소스를 수집하고 각각의 HTTP 프로토콜 버전을 확인합니다. 비 HTTP/2 요청이 감사 결과에서 무시되는 경우가 있습니다. 자세한 내용은 [구현을 참조](https://github.com/GoogleChrome/lighthouse/blob/9fad007174f240982546887a7e97f452e0eeb1d1/lighthouse-core/audits/dobetterweb/uses-http2.js#L138)하세요.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 이 감사를 통과하는 방식

HTTP/2를 통해 리소스를 제공합니다.

서버에서 HTTP/2를 활성화하는 방법을 알아보려면 [HTTP/2 설정](https://dassur.ma/things/h2setup/)을 참조하세요.

## 리소스

- [**모든 리소스에 HTTP/2를 사용하지 않음** 감사의 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/uses-http2.js)
- [HTTP/2 소개](/performance-http2/)
- [HTTP/2 자주 묻는 질문](https://http2.github.io/faq/)
