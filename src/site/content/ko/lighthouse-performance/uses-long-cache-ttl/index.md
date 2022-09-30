---
layout: post
title: 효율적인 캐시 정책으로 정적 자산 제공
description: 웹 페이지의 정적 리소스를 캐싱하여 반복 방문자의 성능과 안정성을 향상시키는 방법을 알아보세요.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - use-long-cache-ttl
---

HTTP 캐싱은 반복 방문 시 페이지 로드 시간을 단축할 수 있습니다.

브라우저가 리소스를 요청할 때 리소스를 제공하는 서버는 브라우저에 리소스를 임시로 저장하거나 *캐시*해야 하는 기간을 알려줄 수 있습니다. 해당 리소스에 대한 후속 요청에 대해 브라우저는 네트워크에서 가져오는 대신 로컬 복사본을 사용합니다.

## Lighthouse 캐시 정책 감사가 실패하는 방식

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 캐시되지 않은 모든 정적 리소스에 플래그를 지정합니다.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vtRp9i6zzD8EDlHYkHtQ.png", alt="효율적인 캐시 정책 감사가 포함된 Lighthouse Serve 정적 자산을 보여주는 스크린샷", width="800", height="490" %}</figure>

Lighthouse는 다음 조건이 모두 충족되는 경우 리소스를 캐시 가능한 것으로 간주합니다.

- 리소스가 글꼴, 이미지, 미디어 파일, 스크립트 또는 스타일시트입니다.
- 리소스에 `200`, `203` 또는 `206` [HTTP 상태 코드](https://developer.mozilla.org/docs/Web/HTTP/Status)가 있습니다.
- 리소스에 명시적인 캐시 없음 정책이 없습니다.

페이지가 감사에 실패하면 Lighthouse는 세 개의 열이 있는 테이블에 결과를 나열합니다.

<div class="table-wrapper scrollbar">
  <table>
    <tbody>
      <tr>
        <td><strong>URL</strong></td>
        <td>캐시 가능한 리소스의 위치</td>
      </tr>
      <tr>
        <td><strong>캐시 TTL</strong></td>
        <td>리소스의 현재 캐시 기간</td>
      </tr>
      <tr>
        <td><strong>크기</strong></td>
        <td>플래그가 지정된 리소스가 캐시된 경우 사용자가 저장할 추정 데이터</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## HTTP 캐싱을 사용하여 정적 리소스를 캐시하는 방법

`Cache-Control` HTTP 응답 헤더를 반환하도록 서버를 구성합니다.

```js
Cache-Control: max-age=31536000
```

`max-age` 지시문은 브라우저가 리소스를 캐시해야 하는 시간(초)을 알려줍니다. 이 예에서는 기간을 `31536000`으로 설정합니다. 이는 1년에 해당합니다: 60초 × 60분 × 24시간 × 365일 = 31536000초.

가능하면 1년 이상과 같이 장기간 동안 변경할 수 없는 정적 자산을 캐시하세요.

{% Aside %} 캐시 기간이 길 때의 위험 중 하나는 사용자가 정적 파일에 대한 업데이트를 보지 못한다는 것입니다. 각 버전이 고유하도록 정적 자산 파일 이름에 해시를 포함하도록 빌드 도구를 구성하고 브라우저가 서버로부터 새 버전을 가져오도록 하여 이 문제를 방지할 수 있습니다. (웹팩을 사용하여 해시를 포함하는 방법을 알아보려면 웹팩의 [캐싱](https://webpack.js.org/guides/caching/) 가이드를 참조하세요.) {% endAside %}

리소스가 변경되고 최신성이 중요하지만 여전히 캐싱의 속도 이점을 얻고 싶다면 `no-cache`를 사용하세요. 브라우저는 `no-cache`로 설정된 리소스를 계속 캐시하지만 리소스가 여전히 최신 상태인지 확인하기 위해 먼저 서버를 확인합니다.

캐시 기간이 길다고 항상 좋은 것은 아닙니다. 궁극적으로 리소스에 대한 최적의 캐시 기간을 결정하는 것은 사용자의 몫입니다.

브라우저가 다양한 리소스를 캐시하는 방식을 사용자 정의하기 위한 많은 지시문이 있습니다. [HTTP 캐시: 첫 방어선 가이드라인](/http-cache) 및 [HTTP 캐싱 동작 구성 codelab](/codelab-http-cache)에서 리소스 캐싱에 대해 자세히 알아보세요.

## Chrome DevTools에서 캐시된 응답을 확인하는 방법

브라우저가 캐시에서 어떤 리소스를 가져오는지 확인하려면 Chrome DevTools에서 **Network(네트워크)** 탭을 엽니다.

{% Instruction 'devtools-network', 'ol' %}

Chrome DevTools의 **Size(크기)** 열에서 리소스가 캐시되었는지 쉽게 확인할 수 있습니다.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dc7QffBFDTcTHyUNNevi.png", alt="Size 열", width="800", height="565" %}</figure>

Chrome은 메모리 캐시에서 가장 많이 요청된 리소스를 제공하여 빠른 작동을 가능하게 하지만 브라우저를 닫으면 캐시가 지워집니다.

리소스의 `Cache-Control` 헤더가 예상대로 설정되었는지 확인하려면 해당 HTTP 헤더 데이터를 확인하세요.

1. 요청 테이블의 **Name(이름)** 열에서 요청 URL을 클릭합니다.
2. **Headers(헤더)** 탭을 클릭합니다.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dGDjkwsoUBwFVLYM0sVy.png", alt="Headers 탭을 통해 캐시 제어 헤더 검사", width="800", height="597" %}   <figcaption>     <b>Headers</b> 탭을 통해 <code>Cache-Control</code> 헤더 검사.   </figcaption></figure>

## 스택별 지침

### Drupal

**Administration(관리)** &gt; **Configuration(구성)** &gt; **Development(개발)** 페이지에서 **Browser and proxy cache maximum age(브라우저 및 프록시 캐시 최대 수명)**을 설정합니다. [Drupal 성능 리소스](https://www.drupal.org/docs/7/managing-site-performance-and-scalability/caching-to-improve-performance/caching-overview#s-drupal-performance-resources)를 참조하세요.

### Joomla

[캐시](https://docs.joomla.org/Cache)를 참조하세요.

### WordPress

[브라우저 캐싱](https://wordpress.org/support/article/optimization/#browser-caching)을 참조하세요.

## 리소스

- [**효율적인 캐시 정책으로 정적 자산 제공** 감사를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-long-cache-ttl.js)
- [캐시 제어 사양](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)
- [캐시 제어(MDN)](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control)
