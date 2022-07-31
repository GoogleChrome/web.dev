---
layout: post
title: 필수 원본에 사전 연결
description: |2-

  uses-rel-preconnect 감사에 대해 알아보세요.
date: 2019-05-02
updated: 2020-05-06
web_lighthouse:
  - use-rel-preconnect
---

Lighthouse 보고서의 기회 섹션에는 `<link rel=preconnect>`로 아직 가져오기 요청의 우선 순위를 지정하지 않은 모든 주요 요청이 나열되어 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K5TLz5LOyRjffxJ6J9zl.png", alt="Lighthouse 필수 원본 사전 연결 감사에 대한 스크린샷", width="800", height="226" %}</figure>

## 브라우저 호환성

`<link rel=preconnect>`는 대부분의 브라우저에서 지원됩니다. [브라우저 호환성](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility)을 참조하십시오.

## 사전 연결로 페이지 로드 속도 향상

중요한 타사 원본에 조기 연결을 설정하려면 `preconnect` 또는 `dns-prefetch` 리소스 힌트를 추가하는 것이 좋습니다.

`<link rel="preconnect">`는 페이지가 다른 원본에 대한 연결을 설정하고 가능한 한 빨리 프로세스가 시작되기를 원한다는 것을 브라우저에 알립니다.

특히 보안 연결의 경우 DNS 조회, 리디렉션 및 사용자의 요청을 처리하는 최종 서버로 여러 번 왕복하는 것과 관련이 있을 수 잇으므로, 속도가 느린 네트워크에서 연결을 설정하는 데 상당한 시간이 걸립니다.

이 모든 것을 미리 처리하면 대역폭 사용에 부정적인 영향을 미치지 않으면서 애플리케이션이 사용자에게 훨씬 더 빠르게 느껴질 수 있습니다. 연결을 설정하는 대부분의 시간은 데이터를 교환하는 것보다 기다리는 데 소비됩니다.

브라우저에 의도를 알리는 것은 페이지에 링크 태그를 추가하는 것만큼 간단합니다.

`<link rel="preconnect" href="https://example.com">`

이를 통해 브라우저는 페이지가 `example.com`에 연결되고 거기에서 콘텐츠를 검색할 것임을 알 수 있습니다.

`<link rel="preconnect">`는 매우 저렴하지만 특히 보안 연결에서 여전히 귀중한 CPU 시간을 차지할 수 있음에 유의하십시오. 10초 이내에 연결을 사용하지 않으면 특히 바람직하지 않습니다. 이는 브라우저가 연결을 닫고 조기 연결 작업을 모두 낭비하기 때문입니다.

일반적으로 `<link rel="preload">`이 더 포괄적인 성능 조정이므로 이를 사용하려고 시도하되 다음과 같은 사용 사례에서 툴벨트에 `<link rel="preconnect">`를 유지하십시오.

- [사용 사례: 어디에서 왔는지는 알지만 무엇을 가져오는지는 알 수 없는 경우](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)
- [사용 사례: 스트리밍 미디어](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)

`<link rel="dns-prefetch">`는 연결과 관련된 또 다른 `<link>` 유형입니다. 이것은 DNS 조회만 처리하지만 브라우저 지원이 더 광범위하므로 좋은 대체 수단으로 사용할 수 있습니다. 사용자는 정확히 같은 방식으로 사용할 수 있습니다.

```html
<link rel="dns-prefetch" href="https://example.com">.
```

## 스택별 지침

### Drupal

[사용자 에이전트 리소스 힌트를 지원하는 모듈](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=dns-prefetch&solrsort=iss_project_release_usage+desc&op=Search)을 사용하여 사전 연결 또는 DNS 사전 패치 리소스 힌트를 설치 및 구성할 수 있습니다.

### Magento

[테마 레이아웃을 수정](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html)하고 사전 연결 또는 DNS 사전 패치 리소스 힌트를 추가합니다.

## 리소스

- [**필수 원본에 대한 사전 연결** 감사를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/uses-rel-preconnect.js)
- [리소스 우선 순위 지정 - 브라우저에서 도움 받기](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect)
- [조기에 네트워크 연결을 설정하여 인지된 페이지 속도 개선](/preconnect-and-dns-prefetch/)
- [링크 유형: 사전 연결](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility)
