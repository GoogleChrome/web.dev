---
layout: post
title: 알려진 보안 취약점이 있는 프런트 엔드 JavaScript 라이브러리 포함
description: |2

  JavaScript 라이브러리를 교체하여 페이지를 더 안전하게 만드는 방법 알아보기

  알려진 취약점이 있습니다.
web_lighthouse:
  - 취약하지 않은 라이브러리
date: 2019-05-02
updated: 2020-06-04
---

침입자는 사이트에서 알려진 보안 취약점을 스캔할 수 있는 자동화된 웹 크롤러를 포함하고 있습니다. 웹 크롤러가 취약점을 감지하면 침입자에게 경고합니다. 거기에서 침입자는 사이트의 취약점을 악용하는 방법을 파악하기만 하면 됩니다.

## 이 Lighthouse 감사가 실패하는 방법

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 알려진 보안 취약점이 있는 프런트 엔드 JavaScript 라이브러리에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7xN0qVP92s6g1XrNru1f.png", alt="페이지에서 사용되는 알려진 보안 취약점이 있는 프런트 엔드 JavaScript 라이브러리를 보여주는 Lighthouse 감사", width="800", height="190" %}</figure>

취약한 라이브러리를 감지하기 위해 Lighthouse는 다음을 수행합니다.

- [Chrome용 라이브러리 감지기](https://www.npmjs.com/package/js-library-detector)를 실행합니다.
- [snyk의 Vulnerability DB](https://snyk.io/vuln?packageManager=all)에 대해 감지된 라이브러리 목록을 확인합니다.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 안전하지 않은 JavaScript 라이브러리 사용 중지

Lighthouse에서 플래그를 지정하는 각 라이브러리 사용을 중지합니다. 라이브러리에서 취약점을 수정하는 최신 버전이 출시된 경우 해당 버전으로 업그레이드하십시오. 라이브러리가 새 버전을 출시하지 않았거나 더 이상 유지 관리되지 않는 경우 다른 라이브러리를 사용하는 것이 좋습니다.

**보고서의 라이브러리 버전** 열에 있는 링크를 클릭하여 각 라이브러리의 취약점에 대해 자세히 알아보세요.

## 참고자료

- [**알려진 보안 취약점 감사를 포함한 프런트 엔드 JavaScript 라이브러리**를 포함하는 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-vulnerable-libraries.js)
- [snyk의 취약점 DB](https://snyk.io/vuln?packageManager=all)
