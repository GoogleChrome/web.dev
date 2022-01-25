---
layout: post
title: HTTP Cache로 불필요한 네트워크 요청 방지
authors:
  - jeffposnick
  - ilyagrigorik
date: 2018-11-05
updated: 2020-04-17
description: |-
  불필요한 네트워크 요청을 어떻게 피할 수 있습니까? 브라우저의 HTTP 캐시는
  첫 번째 방어선입니다. 이 방법이 반드시 가장 강력하고 유연한 방법은 아니며 캐시된 응답의 수명을 제한적으로 제어할 수는 있지만 효과적이며 모든 브라우저에서 지원되며 작업이 많이 필요하지 않습니다.
codelabs:
  - codelab-http-cache
feedback:
  - api
---

네트워크를 통해 리소스를 가져오는 것은 느리고 비용이 많이 듭니다.

- 빠른 응답을 위해서는 브라우저와 서버 간에 많은 왕복이 필요합니다.
- [중요한 리소스](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)가 모두 완전히 다운로드될 때까지 페이지가 로드되지 않습니다.
- 한 개인이 제한된 모바일 데이터 요금제로 사이트에 액세스하는 경우 불필요한 모든 네트워크 요청은 비용 낭비입니다.

불필요한 네트워크 요청을 어떻게 피할 수 있습니까? 브라우저의 HTTP 캐시는<br>첫 번째 방어선입니다. 이 방법이 반드시 가장 강력하고 유연한 방법은 아니며 캐시된 응답의 수명을 제한적으로 제어할 수는 있지만 효과적이며 모든 브라우저에서 지원되며 작업이 많이 필요하지 않습니다.

이 가이드는 효과적인 HTTP 캐싱 구현의 기본 사항을 보여줍니다.

## 브라우저 호환성 {: #browser-compatibility }

실제로 HTTP 캐시라는 단일 API는 존재하지 않습니다. 웹 플랫폼 API 집합에 대한 일반적인 이름입니다. 이러한 API는 모든 브라우저에서 지원됩니다.

- [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Browser_compatibility)
- [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag#Browser_compatibility)
- [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified#Browser_compatibility)

## HTTP 캐시 작동 방식 {: #overview }

브라우저가 제공하는 모든 HTTP 요청은 먼저 브라우저 캐시로 라우팅되어 요청을 수행하는 데 사용할 수 있는 유효한 캐시 응답이 있는지 확인합니다. 일치하는 항목이 있으면 캐시에서 응답을 읽어 네트워크 대기 시간과 전송으로 인해 발생하는 데이터 비용을 모두 제거합니다.

HTTP 캐시의 동작은 [요청 헤더](https://developer.mozilla.org/docs/Glossary/Request_header)와 [응답 헤더](https://developer.mozilla.org/docs/Glossary/Response_header)의 조합에 의해 제어됩니다. 이상적인 시나리오에서는 웹 애플리케이션의 코드(요청 헤더를 결정함)와 웹 서버의 구성(응답 헤더를 결정함)을 모두 제어할 수 있습니다.

보다 심층적인 개념 개요는 MDN의 [HTTP 캐싱](https://developer.mozilla.org/docs/Web/HTTP/Caching) 기사를 확인하십시오.

## 요청 헤더: 기본값 유지(일반) {: #request-headers }

웹 앱의 송신 요청에 포함되어야 하는 중요한 헤더가 많지만, 브라우저는 요청을 할 때 거의 항상 사용자 대신 헤더를 설정합니다. [`If-None-Match`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match) 및 [`If-Modified-Since`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-Modified-Since)처럼 새로 고침 검사에 영향을 미치는 요청 헤더는 HTTP 캐시의 현재 값에 대한 브라우저의 이해를 기반으로 표시됩니다.

이는 좋은 소식입니다. HTML에 `<img src="my-image.png">`과 같은 태그를 계속 포함할 수 있다는 의미이며, 브라우저는 별도의 작업 없이 사용자를 위해 자동으로  HTTP 캐시를 처리합니다.

{% Aside %} 웹 애플리케이션에서 HTTP 캐시를 더 많이 제어해야 하는 개발자에게는 대안이 있습니다. 수준을 "드롭다운"하고 수동으로 [Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API)를 사용하고, 특정한 [`cache`](https://developer.mozilla.org/docs/Web/API/Request) 오버라이드 세트와 함께 [`Request`](https://developer.mozilla.org/docs/Web/API/Request/cache) 개체를 전달할 수 있습니다. 이는 본 가이드의 범위를 벗어납니다! {% endAside %}

## 응답 헤더: 웹 서버 구성 {: #response-headers }

HTTP 캐싱 설정에서 가장 중요한 부분은 웹 서버가 각 발신 응답에 추가하는 헤더입니다. 다음 헤더는 모두 효과적인 캐싱 동작에 영향을 미칩니다.

- [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control). 서버는 `Cache-Control` 지시문을 반환하여 브라우저 및 기타 중간 캐시가 개별 응답을 캐시하는 방법과 기간을 지정할 수 있습니다.
- [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag). 브라우저가 만료된 캐시 응답을 찾으면 작은 토큰(일반적으로 파일 내용의 해시)을 서버로 보내 파일이 변경되었는지 확인할 수 있습니다. 서버가 동일한 토큰을 반환하면 파일이 동일하므로 다시 다운로드할 필요가 없습니다.
- [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified). 이 헤더는 `ETag`와 동일한 목적을 위해 사용되지만 시간 기반 전략을 사용하여 `ETag`의 콘텐츠 기반 전략과 반대로 리소스가 변경되었는지 여부를 판단합니다.

일부 웹 서버는 기본적으로 해당 헤더를 설정할 수 있도록 지원하는 기능이 내장되어 있는 반면, 다른 웹 서버는 헤더를 명시적으로 구성하지 않는 한 헤더를 완전히 생략합니다. 헤더를 구성하는 *방법*에 대한 구체적인 세부 정보는 사용하는 웹 서버에 따라 상당히 달라지며 가장 정확한 세부 정보를 얻으려면 서버 설명서를 참조해야 합니다.

검색 시간을 절약하기 위해 자주 사용하는 웹 서버를 구성하는 방법은 다음과 같습니다.

- [Express](https://expressjs.com/en/api.html#express.static)
- [Apache](https://httpd.apache.org/docs/2.4/caching.html)
- [nginx](http://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Firebase Hosting](https://firebase.google.com/docs/hosting/full-config)
- [Netlify](https://www.netlify.com/blog/2017/02/23/better-living-through-caching/)

`Cache-Control` 응답 헤더를 생략하더라도 HTTP 캐싱이 비활성화되지 않습니다! 대신, 브라우저는 어떤 유형의 캐싱 동작이 주어진 유형의 내용에 가장 적합한지 [효과적으로 추측](https://www.mnot.net/blog/2017/03/16/browser-caching#heuristic-freshness)합니다. 응답 헤더를 구성하는 것보다 더 많은 제어 권한을 원할 수 있으므로 시간을 들여 응답 헤더를 구성하십시오.

## 어떤 응답 헤더 값을 사용해야 할까요? {: #response-header-strategies }

웹 서버의 응답 헤더를 구성할 때 다루어야 하는 두 가지 중요한 시나리오가 있습니다.

### 버전 지정된 URL {: #versioned-urls }에 대한 장기 캐싱

{% Details %} {% DetailsSummary 'h4' %} 버전 지정된 URL이 버전 지정된 URL 캐싱 전략에 도움이 되는 방법은 캐싱된 응답을 더 쉽게 무효화하므로 좋은 방법입니다. {% endDetailsSummary %} 서버가 브라우저에 CSS 파일을 1년 동안 캐시하도록 지시(<code>Cache-Control: max-age=31536000</code>)했지만 디자이너가 즉시 출시해야 하는 긴급 업데이트를 방금 수행했다고 가정하도록 하겠습니다. 파일의 "stale" 캐시 사본을 업데이트하도록 브라우저에 알리려면 어떻게 해야 합니까? 적어도 리소스의 URL을 변경하지 않고는 불가능합니다. 브라우저가 응답을 캐시한 후 캐싱된 버전은 <code>max-age</code> 또는 <code>expires</code>에 의해 더 이상 최신 상태가 아닐 때까지 사용되거나 예를 들어 사용자가 브라우저 캐시를 삭제하는 것과 같은 다른 이유로 캐시에서 제거될 때까지 사용됩니다. 따라서 페이지가 구성될 때 서로 다른 사용자가 다른 버전의 파일을 사용하게 될 수 있습니다. 리소스를 방금 가져온 사용자는 새 버전을 사용하는 반면, 이전(그러나 여전히 유효한) 복사본을 캐시한 사용자는 이전 버전의 응답을 사용합니다. 클라이언트 측 캐싱과 빠른 업데이트의 두 가지 장점을 모두 활용하려면 어떻게 해야 합니까? 리소스 URL을 변경하고 사용자가 콘텐츠가 변경될 때마다 새로운 응답을 다운로드하도록 강요합니다. 일반적으로 파일 이름 예를 들어 <code>style.x234dff.css</code>에서 파일 지문 또는 버전 번호를 내장하여 이를 수행합니다.{% endDetails %}

["지문](https://en.wikipedia.org/wiki/Fingerprint_(computing))" 또는 버전 정보가 포함되어 있고 내용이 변경되지 않는 URL에 대한 요청에 응답할 때 응답에 `Cache-Control: max-age=31536000`을 추가하십시오.

이 값을 설정하면 향후 1년(31,536,000초, 지원되는 최대값) 동안 동일한 URL을 로드해야 할 때 웹 서버에 네트워크를 요청할 필요 없이 HTTP 캐시의 값을 즉시 사용할 수 있습니다. 네트워크를 피함으로써 얻을 수 있는 신뢰성과 속도를 즉시 얻을 수 있습니다!

webpack과 같은 빌드 도구는 자산 URL에 해시 지문을 할당하는 [프로세스를 자동화](https://webpack.js.org/guides/caching/#output-filenames)할 수 있습니다.

{% Aside %} 비록 일부 브라우저에서 [무시](https://www.keycdn.com/blog/cache-control-immutable#browser-support)되더라도 [`immutable` 속성](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Revalidation_and_reloading)을 추가 최적화로 `Cache-Control` 헤더에 추가할 수도 있습니다. {% endAside %}

### 버전 없는 URL {: #unversioned-urls }에 대한 서버 재검증

불행히도 로드하는 모든 URL의 버전이 지정되는 것은 아닙니다. 웹 앱을 배포하기 전에 빌드 단계를 포함할 수 없으므로 자산 URL에 해시를 추가할 수 없습니다. 그리고 모든 웹 애플리케이션에는 HTML 파일이 필요합니다. 이 파일에는 (거의!) 버전 정보가 포함되어 있지 않습니다. 방문할 URL이 `https://example.com/index.34def12.html`임을 기억해야 하는 경우 어느 누구도 웹 앱을 사용하지 않기 때문입니다. 그렇다면 해당 URL에 대해 무엇을 할 수 있습니까?

이것은 패배를 인정해야 하는 시나리오 중 하나입니다. HTTP 캐싱만으로는 네트워크를 완전히 피할 수 있을 만큼 강력하지 않습니다. (걱정하지 마세요. 곧 [서비스 워커](/service-workers-cache-storage/)에 대해 배우게 될 것입니다. 이 서비스 워커는 전투를 유리하게 되돌리는 데 필요한 지원을 제공할 것입니다.) 그러나 네트워크 요청이 최대한 빨리 가능한 효율적으로 이루어지도록 하기 위해 취할 수 있는 몇 가지 단계가 있습니다.

다음 `Cache-Control` 값은 버전이 지정되지 않은 URL이 캐시되는 위치와 방법을 미세 조정하는 데 도움이 될 수 있습니다.

- `no-cache`. 이는 캐시된 URL 버전을 사용하기 전에 매번 서버에서 유효성을 다시 확인해야 한다고 브라우저에 지시합니다.
- `no-store`. 이는 브라우저와 다른 중간 캐시(예: CDN)가 파일의 어떤 버전도 저장하지 않도록 지시합니다.
- `private`. 브라우저는 파일을 캐시할 수 있지만 중간 캐시는 캐시할 수 없습니다.
- `public`. 응답은 모든 캐시에 의해 저장될 수 있습니다.

[부록: `Cache-Control` 순서도](#flowchart)를 확인하여 어떠한 `Cache-Control` 값을 사용할지 결정하는 프로세스를 시각화하십시오. 또한 `Cache-Control`은 쉼표로 구분된 지시문 목록을 허용할 수 있습니다. <a href="#examples" data-md-type="link">부록: `Cache-Control` 예제</a>를 참조하십시오.

이와 함께 [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag) 또는 [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified) 두 개의 추가 응답 헤더 중 하나를 설정하는 것도 도움이 될 수 있습니다. [응답 헤더](#response-headers)에서 언급했듯이 `ETag`와 `Last-Modified` 모두 브라우저가 만료된 캐시된 파일을 다시 다운로드해야 하는지 여부를 결정하는 동일한 목적을 수행합니다. `ETag`가 더 정확하기 때문에 권장되는 접근 방식입니다.

{% Details %} {% DetailsSummary 'h4' %} ETag 예시 {% endDetailsSummary %} 처음 가져온 후 120초가 경과했고 브라우저가 동일한 리소스에 대한 새 요청을 시작했다고 가정하겠습니다. 먼저 브라우저는 HTTP 캐시를 확인하고 이전 응답을 찾습니다. 불행하게도 응답이 이제 만료되었기 때문에 브라우저가 이전 응답을 사용할 수 없습니다. 이 시점에서 브라우저는 새 요청을 전달하고 새로운 전체 응답을 가져올 수 있습니다. 그러나 리소스가 변경되지 않은 경우 이미 캐시에 있는 동일한 정보를 다운로드할 이유가 없기 때문에 비효율적입니다! <code>ETag</code> 헤더에 지정된 검증 토큰이 해결하도록 설계된 문제입니다. 서버는 일반적으로 파일 내용의 해시 또는 기타 지문인 임의의 토큰을 생성하고 반환합니다. 브라우저는 지문이 어떻게 생성되는지 알 필요가 없습니다. 다음 요청 시에만 서버로 보내면 됩니다. 지문이 여전히 동일하면 리소스가 변경되지 않았으며 브라우저는 다운로드를 건너뛸 수 있습니다. {% endDetails %}

`ETag` 또는 `Last-Modified`를 설정하면 재검증 요청을 훨씬 더 효율적으로 만들 수 있습니다.  [요청 헤더](#request-headers)에 언급되어 있는 [`If-Modified-Since`](#request-headers) 또는 [`If-None-Match`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match) 요청 헤더를 트리거할 수 있습니다.

적절하게 구성된 웹 서버가 수신 요청 헤더를 볼 때, 브라우저가 HTTP 캐시에 이미 가지고 있는 리소스의 버전이 웹 서버의 최신 버전과 일치하는지 확인할 수 있습니다. 일치하는 항목이 있는 경우 서버는 [`304 Not Modified`](https://developer.mozilla.org/docs/Web/HTTP/Status/304) HTTP 응답으로 응답할 수 있습니다. 이는 "이미 가지고 있는 것을 계속 사용하라는" 것과 동일합니다. 이러한 유형의 응답을 보낼 때 전송할 데이터가 거의 없으므로 요청되는 실제 리소스의 복사본을 실제로 다시 보내는 것보다 훨씬 빠릅니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/e2bN6glWoVbWIcwUF1uh.png", alt="304 헤더로 리소스 및 서버 응답을 요청하는 클라이언트 다이어그램.", width="474", height="215" %} <figcaption> 브라우저는 서버에서 <code>/file</code>을 요청하고 서버의 파일에 대한 <code>ETag</code>가 브라우저의 <code>If-None-Match</code> 값과 동일하지 않을 경우 전체 파일만 반환하도록 서버에 지시하는 <code>If-None-Match</code> 헤더를 포함합니다. 이 경우, 2 값이 일치하지 않으므로 서버는 파일이 얼마나 오래 캐싱(<code>Cache-Control: max-age=120</code>)되어야 하는지에 대한 지시를 받아 <code>304 Not Modified</code> 응답을 반환합니다. </figcaption></figure>

## 요약 {: #summary }

HTTP 캐시는 불필요한 네트워크 요청을 줄이기 때문에 로드 성능을 향상시키는 효과적인 방법입니다. 모든 브라우저에서 지원되며 설정하는 데 그리 많은 작업이 필요하지 않습니다.

다음 `Cache-Control` 구성을 시작하는 것이 좋습니다.

- 사용하기 전에 서버에서 재검증해야 하는 리소스의 경우 `Cache-Control: no-cache`.
- 캐싱되지 않아야 하는 리소스의 경우 `Cache-Control: no-store`.
- 버전 지정된 리소스의 경우 `Cache-Control: max-age=31536000`.

그리고 `ETag` 또는 `Last-Modified` 헤더를 사용하면 만료된 캐시 리소스를 보다 효율적으로 재검증할 수 있습니다.

{% Aside 'codelab' %} [HTTP 캐시 코드랩](/codelab-http-cache)을 사용하여 Express에서 `Cache-Control` 및 `ETag`에 대한 실습 경험을 얻으십시오. {% endAside %}

## 자세히 알아보기 {: #learn-more }

`Cache-Control` 헤더 사용에 대해 더 자세히 알고 싶은 경우 Jake Archibald의 [캐싱 모범 사례 및 최대 연령 문제](https://jakearchibald.com/2016/caching-best-practices/) 가이드를 확인하세요.

방문자를 위한 캐시 사용 최적화 방법에 대한 지침은 [Love your cache](/love-your-cache)를 참조하십시오.

## 부록: 추가 팁 {: #tips }

시간이 더 있을 경우 여기에 제공되어 있는 HTTP 캐시 사용을 최적화할 수 있는 방법을 살펴보세요.

- 일관된 URL을 사용하세요. 다른 URL에서 동일한 콘텐츠를 제공하는 경우 해당 콘텐츠를 여러 번 가져와서 저장합니다.
- 이탈을 최소화합니다. 리소스(예: CSS 파일)의 일부가 자주 업데이트되는 반면 나머지 파일(예: 라이브러리 코드)은 그렇지 않은 경우 자주 업데이트되는 코드를 별도의 파일로 분할하고 자주 업데이트되는 코드는 짧은 기간 캐싱 전략을 사용하고 자주 변경되지 않는 코드는 긴 캐시 지속 시간 전략을 사용하는 것이 좋습니다.
- `Cache-Control` 정책에서 약간의 부실한 정도가 허용될 경우 새로운 [`stale-while-revalidate`](/stale-while-revalidate/) 지시 사항을 확인하십시오.

## 부록: `Cache-Control` 흐름도 {: #flowchart }

{% Img src="image/admin/htXr84PI8YR0lhgLPiqZ.png", alt="흐름도", width="595", height="600" %}

## 부록: `Cache-Control` 예제 {: #examples }

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>
<code>Cache-Control</code> 값</th>
        <th>설명</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>max-age=86400</code></td>
        <td>응답은 최대 1일(60초 x 60분 x 24시간) 동안 브라우저 및 중간 캐시가 캐싱할 수 있습니다.</td>
      </tr>
      <tr>
        <td><code>private, max-age=600</code></td>
        <td>응답은 최대 10분(60초 x 10분) 동안 (중간 캐시가 아닌) 브라우저가 캐싱할 수 있습니다.</td>
      </tr>
      <tr>
        <td><code>public, max-age=31536000</code></td>
        <td>응답은 1년 동안 모든 캐시가 저장할 수 있습니다.</td>
      </tr>
      <tr>
        <td><code>no-store</code></td>
        <td>응답은 캐시할 수 없으며 모든 요청에서 전체를 가져와야 합니다.</td>
      </tr>
    </tbody>
  </table>
</div>
