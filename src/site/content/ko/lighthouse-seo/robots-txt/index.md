---
layout: post
title: "`robots.txt`가 유효하지 않습니다"
description: |2

  "robots.txt가 유효하지 않음" Lighthouse 감사에 대해 알아보세요.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - robots-txt
---

`robots.txt` 파일은 검색 엔진에 사이트 페이지 중 크롤링할 수 있는 페이지를 알려줍니다. 잘못된 `robots.txt` 구성은 두 가지 유형의 문제를 일으킬 수 있습니다.

- 검색 엔진이 공개 페이지를 크롤링하지 못하게 하여 콘텐츠가 검색 결과에 덜 자주 표시되도록 할 수 있습니다.
- 검색 엔진이 검색 결과에 표시하지 않으려는 페이지를 크롤링할 수 있습니다.

## `robots.txt` 감사가 실패하는 이유

[Lighthouse는](https://developer.chrome.com/docs/lighthouse/overview/) `robots.txt` 파일에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/X29ztochZPiUVwPo2rg3.png", alt="Lighthouse 감사에서 잘못된 robots.txt가 표시됨", width="800", height="203" %}</figure>

{% Aside %} 대부분의 Lighthouse 감사는 현재 보고 있는 페이지에만 적용됩니다. 그러나 `robots.txt`는 호스트 이름 수준에서 정의되므로 이 감사는 전체 도메인(또는 하위 도메인)에 적용됩니다. {% endAside %}

보고서에서 **`robots.txt`가 유효하지 않음** 감사를 확장하여 `robots.txt`에 어떤 문제가 있는지 알아보세요.

일반적인 오류는 다음과 같습니다.

- `No user-agent specified`
- `Pattern should either be empty, start with "/" or "*"`
- `Unknown directive`
- `Invalid sitemap URL`
- `$ should only be used at the end of the pattern`

`robots.txt` 파일이 올바른 위치에 있는지 확인하지 않습니다. 올바르게 작동하려면 파일이 도메인 또는 하위 도메인의 루트에 있어야 합니다.

{% include 'content/lighthouse-seo/scoring.njk' %}

## `robots.txt` 관련 문제를 해결하는 방법

### `robots.txt`가 HTTP 5XX 상태 코드를 반환하지 않는지 확인

`robots.txt`에 대해 서버 오류(500초의 [HTTP 상태 코드](/http-status-code))를 반환하면 검색 엔진은 어떤 페이지를 크롤링해야 하는지 알 수 없습니다. 전체 사이트 크롤링이 중지되어 새 콘텐츠의 색인이 생성되지 않을 수 있습니다.

HTTP 상태 코드를 확인하려면 Chrome에서 `robots.txt`를 열고 [Chrome DevTools에서 요청을 확인](https://developer.chrome.com/docs/devtools/network/reference/#analyze)하십시오.

### `robots.txt`를 500 KiB보다 작게 유지

파일이 500KiB보다 큰 경우 `robots.txt` 처리를 중간에 중지할 수 있습니다. 이는 검색 엔진을 혼란스럽게 하여 사이트의 잘못된 크롤링으로 이어질 수 있습니다.

`robots.txt`를 작게 유지하려면 개별적으로 제외된 페이지보다는 더 광범위한 패턴에 집중하세요. 예를 들어, PDF 파일의 크롤링을 차단해야 하는 경우 각 개별 파일을 허용하지 마십시오. `disallow: /*.pdf`를 사용하여 `.pdf`가 포함된 모든 URL을 허용하지 않습니다.

### 형식 오류 수정

- `robots.txt`에서는 "이름: 값" 형식과 일치하는 빈 줄, 주석 및 지시문만 사용할 수 있습니다.
- `allow` 및 `disallow` 값이 비어 있거나 `/` 또는 `*`로 시작하는지 확인하십시오.
- 값 중간에 `$`를 사용하지 마십시오(예: `allow: /file$html`).

#### `user-agent` 대한 값이 있는지 확인

검색 엔진 크롤러에게 따라야 할 지시문을 알려주는 사용자 에이전트 이름입니다. 검색 엔진이 관련 지시문 집합을 따를지 여부를 알 수 있도록 `user-agent`의 각 인스턴스에 대한 값을 제공해야 합니다.

특정 검색 엔진 크롤러를 지정하려면 게시된 목록에서 사용자 에이전트 이름을 사용하십시오(예를 들어, 다음은 [크롤링에 사용되는 Google의 사용자 에이전트 목록](https://support.google.com/webmasters/answer/1061943)입니다).

일치하지 않는 모든 크롤러를 일치시키려면 `*`를 사용하십시오.

{% Compare 'worse', 'Don\'t' %}

```text
user-agent:
disallow: /downloads/
```

사용자 에이전트가 정의되어 있지 않습니다. {% endCompare %}

{% Compare 'better', 'Do' %}

```text
user-agent: *
disallow: /downloads/

user-agent: magicsearchbot
disallow: /uploads/
```

일반 사용자 에이전트와 `magicsearchbot` 사용자 에이전트가 정의되어 있습니다. {% endCompare %}

#### `user-agent` 전에 `allow` 또는 `disallow` 지시문이 없는지 확인

사용자 에이전트 이름은 `robots.txt` 파일의 섹션을 정의합니다. 검색 엔진 크롤러는 이러한 섹션을 사용하여 따라야 할 지시문을 결정합니다. 첫 번째 사용자 에이전트 이름 *앞에* 지시문을 배치하면 어떤 크롤러도 따라오지 않습니다.

{% Compare 'worse', 'Don\'t' %}

```text
# start of file
disallow: /downloads/

user-agent: magicsearchbot
allow: /
```

검색 엔진 크롤러는 `disallow: /downloads` 지시문을 읽지 않습니다. {% endCompare %}

{% Compare 'better', 'Do' %}

```text
# start of file
user-agent: *
disallow: /downloads/
```

`/downloads` 폴더를 크롤링할 수 없습니다. {% endCompare %}

검색 엔진 크롤러는 가장 구체적인 사용자 에이전트 이름이 있는 섹션의 지시문만 따릅니다. 예를 들어 `user-agent: *` 및 `user-agent: Googlebot-Image`에 대한 지시문이 있는 경우 Googlebot 이미지는 `user-agent: Googlebot-Image` 섹션의 지시문만 따릅니다.

#### `sitemap`의 절대 URL 제공

[사이트맵](https://support.google.com/webmasters/answer/156184) 파일은 검색 엔진에 웹사이트의 페이지에 대해 알릴 수 있는 좋은 방법입니다. 사이트맵 파일에는 일반적으로 웹사이트의 URL 목록과 마지막으로 변경된 시간에 대한 정보가 포함됩니다.

`robots.txt` 사이트맵 파일을 제출하기로 선택한 경우 [절대 URL](https://tools.ietf.org/html/rfc3986#page-27)을 사용해야 합니다.

{% Compare 'worse', 'Don\'t' %}

```text
sitemap: /sitemap-file.xml
```

{% endCompare %}

{% Compare 'better', 'Do' %}

```text
sitemap: https://example.com/sitemap-file.xml
```

{% endCompare %}

## 참고자료

- [**`robots.txt`가 유효하지 않음** 소소 코드 감사](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/robots-txt.js)
- [`robots.txt file` 만들기](https://support.google.com/webmasters/answer/6062596)
- [Robots.txt](https://moz.com/learn/seo/robotstxt)
- [로봇 메타 태그 및 X-Robots-Tag HTTP 헤더 사양](https://developers.google.com/search/reference/robots_meta_tag)
- [사이트맵에 대해 알아보기](https://support.google.com/webmasters/answer/156184)
- [Google 크롤러(사용자 에이전트)](https://support.google.com/webmasters/answer/1061943)
