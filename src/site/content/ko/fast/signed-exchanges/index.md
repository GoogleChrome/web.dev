---
layout: post
title: SXG(Signed Exchanges)
subhead: SXG는 리소스가 전달된 방식에 관계없이 리소스의 출처를 인증할 수 있도록 하는 전달 메커니즘입니다.
authors:
  - katiehempenius
date: 2020-10-14
updated: 2021-04-21
hero: image/admin/6ll3P8MYWxvtb1ZjXIzb.jpg
alt: 봉투 더미.
description: SXG는 리소스가 전달된 방식에 관계없이 리소스의 출처를 인증할 수 있도록 하는 전달 메커니즘입니다.
tags:
  - blog
  - performance
---

SXG(Signed Exchanges)는 리소스가 전달된 방식에 관계없이 리소스의 출처를 인증할 수 있도록 하는 전달 메커니즘입니다. 이러한 분리는 개인정보 보호 프리페치, 오프라인 인터넷 경험 및 타사 캐시에서 제공과 같은 다양한 사용 사례를 발전시킵니다. 또한 SXG를 구현하면 일부 사이트에 대한 LCP(Large Contentful Paint)를 개선할 수 있습니다.

본 문서에서는 SXG의 작동 방식, 사용 사례 및 도구에 대한 포괄적 개요 정보를 제공합니다.

## 브라우저 호환성 {: #browser-compatibility }

SXG는 Chromium 기반 브라우저(버전: Chrome 73, Edge 79 및 Opera 64부터)에서 [지원](https://caniuse.com/#feat=sxg)됩니다.

## 개요

SXG(서명된 교환)를 사용하면 브라우저가 콘텐츠 배포 방식과 관계없이 콘텐츠의 출처와 무결성을 확인할 수 있는 방식으로 사이트에서 요청/응답 쌍("HTTP 교환")에 암호로 서명할 수 있습니다. 결과적으로, 브라우저는 콘텐츠를 전달한 서버의 URL이 아닌 주소창에 원본 사이트 URL을 표시할 수 있습니다.

SXG의 광범위한 의미는 콘텐츠를 휴대 가능하도록 만든다는 것입니다. SXG를 통해 전달된 콘텐츠는 출처의 완전한 보증과 속성을 그대로 유지하면서 제3자가 쉽게 배포할 수 있습니다. 이전에 사이트가 속성을 그대로 유지하면서 제3자를 활용하여 콘텐츠를 배포하는 유일한 방법은 사이트가 배포자와 SSL 인증서를 공유하는 것이었습니다. 여기에는 보안상의 단점이 있습니다. 게다가 컨텐츠를 진정으로 휴대할 수 있게 만드는 것과는 거리가 멉니다.

장기적으로 볼 때, 진정한 휴대 가능 콘텐츠를 활용하여 완전한 오프라인 경험과 같은 사용 사례를 달성할 수 있습니다. 단기적으로 볼 때, SXG의 주요 사용 사례는 쉽게 캐시할 수 있는 형식으로 콘텐츠를 제공하여 더 빠른 사용자 경험을 제공하는 것입니다. 특히 [Google 검색](#google-search)은 SXG를 캐시하고 미리 가져오는 경우가 종종 있습니다. Google 검색에서 트래픽의 많은 부분을 수신하는 사이트의 경우 SXG는 사용자에게 더 신속하게 페이지를 로드하는 중요한 도구가 될 수 있습니다.

### SXG 형식

SXG는 HTTP 교환과 [서명](https://cbor.io/)이라는 두 가지 기본 구성 요소가 있는 [바이너리 인코딩](https://cbor.io/) 파일로 캡슐화됩니다. HTTP 교환은 요청 URL, 콘텐츠 협상 정보 및 HTTP 응답으로 구성됩니다.

다음은 디코딩된 SXG 파일의 예입니다.

```html
format version: 1b3
request:
  method: GET
  uri: https://example.org/
  headers:
response:
  status: 200
  headers:
    Cache-Control: max-age=604800
    Digest: mi-sha256-03=kcwVP6aOwYmA/j9JbUU0GbuiZdnjaBVB/1ag6miNUMY=
    Expires: Mon, 24 Aug 2020 16:08:24 GMT
    Content-Type: text/html; charset=UTF-8
    Content-Encoding: mi-sha256-03
    Date: Mon, 17 Aug 2020 16:08:24 GMT
    Vary: Accept-Encoding
signature:
    label;cert-sha256=*ViFgi0WfQ+NotPJf8PBo2T5dEuZ13NdZefPybXq/HhE=*;
    cert-url="https://test.web.app/ViFgi0WfQ-NotPJf8PBo2T5dEuZ13NdZefPybXq_HhE";
    date=1597680503;expires=1598285303;integrity="digest/mi-sha256-03";sig=*MEUCIQD5VqojZ1ujXXQaBt1CPKgJxuJTvFlIGLgkyNkC6d7LdAIgQUQ8lC4eaoxBjcVNKLrbS9kRMoCHKG67MweqNXy6wJg=*;
    validity-url="https://example.org/webpkg/validity"
header integrity: sha256-Gl9bFHnNvHppKsv+bFEZwlYbbJ4vyf4MnaMMvTitTGQ=

The exchange has a valid signature.
payload [1256 bytes]:
<!doctype html>
<html>
<head>
    <title>SXG example</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
    }
    </style>
</head>
<body>
<div>
    <h1>Hello</h1>
</div>
</body>
</html>
```

서명의 `expires` 매개변수는 SXG의 만료 날짜를 나타냅니다. SXG는 최대 7일 동안 유효합니다. SXG의 만료 날짜가 향후 7일 이상이면 브라우저에서 이를 거부합니다. [Signed HTTP Exchanges 사양](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-3.1)에서 서명 헤더에 대한 자세한 정보를 찾아보세요.

### 웹 패키징

SXG는 광범위한 [Web Packaging](https://github.com/WICG/webpackage) 사양 제안 제품군의 일부입니다. SXG 외에도 Web Packaging 사양의 다른 주요 구성 요소는 [Web Bundles](/web-bundles/)("번들 HTTP 교환")입니다. 웹 번들은 번들을 해석하는 데 필요한 HTTP 리소스와 메타데이터의 모음입니다.

SXG와 Web Bundles 간의 관계는 일반적으로 혼동하기 쉽습니다. SXG와 웹 번들은 서로 의존하지 않는 두 가지 별개의 기술입니다. Web Bundles은 서명된 교환과 서명되지 않은 교환 모두에서 사용할 수 있습니다. SXG와 Web Bundles에 의해 진보된 공통 목표는 오프라인 사용을 위해 사이트 전체를 공유할 수 있는 "웹 패키징" 형식을 만드는 것입니다.

SXG는 Chromium 기반 브라우저가 구현할 Web Packaging 사양의 첫 번째 부분입니다.

## SXG 로드

처음에는 SXG의 주요 사용 사례가 페이지의 기본 문서에 대한 전달 메커니즘이 될 가능성이 있습니다. 이 사용 사례의 경우  `<link>` 또는 `<a>` 태그와 [`Link` 헤더](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link)를 사용하여 SXG를 참조할 수 있습니다. 다른 리소스와 마찬가지로 SXG는 브라우저의 주소 표시줄에 해당 URL을 입력하여 로드할 수 있습니다.

```html
<a href="https://example.com/article.html.sxg">
```

```html
<link rel="prefetch" as="document" href="https://example.com/article.html.sxg">
```

SXG를 사용하여 하위 리소스를 제공할 수도 있습니다. 자세한 내용은 [Signed Exchange 하위 리소스 대체](https://github.com/WICG/webpackage/blob/main/explainers/signed-exchange-subresource-substitution.md)를 참조하십시오.

## SXG 제공

### 콘텐츠 협상

[콘텐츠 협상](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation)은 클라이언트의 기능 및 기본 설정에 따라 동일한 URL에서 동일한 리소스의 다른 표현을 제공하기 위한 메커니즘입니다. 예를 들어, 리소스의 gzip 버전을 일부 클라이언트에 제공할 수 있지만 Brotli 버전은 다른 클라이언트에 제공할 수 없습니다. 콘텐츠 협상을 통해 브라우저의 기능에 따라 동일한 콘텐츠의 SXG 및 비-SXG 표현을 모두 제공할 수 있습니다.

웹 브라우저는 [`Accept`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept) 요청 헤더를 사용하여 지원하는 [MIME 유형](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types)을 전달합니다. 브라우저가 SXG를 지원하는 경우 MIME 유형 `application/signed-exchange`가 이러한 값 목록에 자동으로 포함됩니다.

예를 들어, 다음은 Chrome 84에서 보낸 `Accept` 헤더입니다.

```json
accept:
text/html,
application/xhtml+xml,
application/xml;q=0.9,
image/webp,image/apng,
\*/\*;q=0.8,
application/signed-exchange;v=b3;q=0.9
```

이 문자열의 `application/signed-exchange;v=b3;q=0.9` 부분은 Chrome이 SXG, 특히 `b3` 버전을 지원한다는 것을 웹 서버에 알립니다. 마지막 부분 `q=0.9`는 [q-value](https://developer.mozilla.org/docs/Glossary/Quality_values)을 나타냅니다.

`q-value`는 `0`에서 `1`까지 십진수 척도를 사용하는 특정한 형식에 대한 브라우저의 상대적 선호도를 나타냅니다. 여기에서 `1`은 가장 높은 우선순위를 나타냅니다. 하나의 형식에 대해 `q-value`이 제공되지 않으면 `1`은 암시 값입니다.

### 모범 사례

`Accept` 헤더가 `application/signed-exchange`에 대한 `q-value`가 `text/html`에 대한 `q-value`보다 크거나 동일할 때 서버는 SXG를 제공해야 합니다. 실제로 이는 본래의 서버가 브라우저가 아닌 크롤러에 SXG를 제공함을 의미합니다.

SXG는 캐싱 또는 프리페칭과 함께 사용할 때 우수한 성능을 제공할 수 있습니다. 하지만 이러한 최적화의 이점 없이 본래의 서버에서 직접 로드되는 콘텐츠의 경우 `text/html`이 SXG보다 더 나은 성능을 제공합니다. 콘텐츠를 SXG로 제공하면 크롤러 및 기타 중개자가 SXG를 캐시하여 사용자에게 더 빠르게 전달할 수 있습니다.

다음 정규식은 SXG로 제공되어야 하는 요청에 대한 `Accept` 헤더를 일치시키는 데 사용할 수 있습니다.

```regex
Accept: /(^|,)\s\*application\/signed-exchange\s\*;\s\*v=[[:alnum:]\_-]+\s\*(,|$)/
```

하위 표현식 `(,|$)`은 SXG에 대한 `q-value`이 생략된 헤더와 일치합니다. 이러한 생략은 SXG에 대한 `q-value`가 `1`임을 의미합니다. `Accept` 헤더가 이론적으로 하위 문자열 `q=1`을 포함할 수 있지만 [실제로](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation/List_of_default_Accept_values) 브라우저는 기본값이 `1`일 때 형식의 `q-value`를 정확하게 나열하지 않습니다.

## Chrome DevTools로 SXG 디버깅{: #debugging }

Signed Exchanges는 Chrome DevTools **네트워크** 패널의 **유형** 열에서 `signed-exchange`를 찾아 식별할 수 있습니다.

<figure>{% Img src="image/admin/cNdohSaeXqGHFBwD7L3B.png", alt="DevTools '네트워크' 패널 내의 SXG 요청을 보여주는 스크린샷", width="696", height="201" %} <figcaption>DevTools의 <b>네트워크</b> 패널</figcaption></figure>

**미리보기** 탭은 SXG의 내용에 대한 자세한 정보를 제공합니다.

<figure>{% Img src="image/admin/E0rBwuxk4BxFmLJ3gXhP.png", alt="SXG에 대한 '미리보기' 탭 스크린샷", width="800", height="561" %} <figcaption> DevTools의 <b>미리보기</b> 탭</figcaption></figure>

SXG를 직접 보려면 [}SXG를 지원하는 브라우저 중 하나](https://signed-exchange-testing.dev/) 에서 이 [데모](#browser-compatibility)를 방문하세요.

## 사용 사례

SXG를 사용하여 본래의 서버에서 사용자에게 직접 콘텐츠를 전달할 수 있지만 이는 SXG의 목적을 크게 상쇄합니다. 오히려 원본 서버에서 생성된 SXG가 캐시되어 중개자가 사용자에게 제공할 때 SXG의 의도된 사용 및 이점이 주로 달성됩니다.

이 섹션에서는 주로 Google 검색을 통한 SXG의 캐싱 및 제공에 대해 설명하지만 아웃링크에 더 빠른 사용자 경험 또는 제한된 네트워크 액세스에 대한 더 큰 복원성을 제공하려는 모든 사이트에 적용할 수 있는 기술입니다. 여기에는 검색 엔진과 소셜 미디어 플랫폼뿐만 아니라 오프라인 소비를 위한 콘텐츠를 제공하는 정보 포털도 포함됩니다.

### Google 검색

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/oMtUUAVj5hAGwBZMDwct.png", alt="캐시에서 제공되는 미리 가져온 SXG를 보여주는 다이어그램.", width="800", height="396" %}

Google 검색은 SXG를 사용하여 사용자에게 검색 결과 페이지에서 로드된 페이지에 대한 더 빠른 페이지 로드 경험을 제공합니다. Google 검색에서 상당한 트래픽을 수신하는 사이트는 콘텐츠를 SXG로 제공하여 잠재적으로 상당한 성능 향상을 볼 수 있습니다.

Google 검색은 이제 해당되는 경우 SXG를 크롤, 캐시 및 미리 가져옵니다. Google과 다른 검색 엔진은 사용자가 방문할 가능성이 있는 콘텐츠 예를 들어, 첫 번째 검색 결과에 상응하는 페이지를 [미리 가져오는](https://developer.mozilla.org/docs/Web/HTTP/Link_prefetching_FAQ) 경우가 종종 있습니다. SXG는 비-SXG 형식에 비해 개인정보 보호 이점이 있기 때문에 미리 가져오기 작업에 특히 적합합니다.

{% Aside %} 모든 네트워크 요청에는 어떻게 또는 왜 만들어졌는지에 관계없이 일정량의 사용자 정보가 내재되어 있습니다. 여기에는 IP 주소, 쿠키의 유무, `Accept-Language`와 같은 헤더 값 등의 정보가 포함됩니다. 이 정보는 요청이 있을 때 대상 서버에 "공개"됩니다. SXG는 본래의 서버가 아닌 캐시에서 미리 가져오기 때문에 미리 가져오는 시점이 아니라 사용자가 사이트를 탐색한 후에만 사이트에 대한 사용자의 관심이 원본 서버에 공개됩니다. 또한 SXG를 통해 미리 가져온 콘텐츠는 사용자가 콘텐츠를 로드하지 않는 한 쿠기로 설정되거나 `localStorage`에 액세스하지 않습니다. 또한 이것은 SXG 참조자에 대한 새로운 사용자 정보를 드러내지 않습니다. 미리 가져오는 동안 SXG를 사용하는 것은 개인정보 보호 미리 가져오기 개념의 한 예입니다. {% endAside %}

#### 크롤링

Google 검색 크롤러가 전송한 [`Accept`](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation) 헤더는 `text/html` 및 `application/signed-exchange`에 대한 동일한 선호도를 나타냅니다.  [이전 섹션](#best-practices)에서 설명한 대로 SXG를 사용하려는 사이트는 `Accept` 요청 헤더가 `text/html`에서 SXG에 대해 동일하거나 더 높은 선호도를 나타낼 때 이를 제공해야 합니다. 실제로, 크롤러만 `text/html`에서 SXG에 대한 선호도를 나타냅니다.

#### 색인화

페이지의 SXG 및 비SXG 표현은 Google 검색에서 별도로 순위를 매기거나 색인화하지 않습니다. SXG는 궁극적으로 전달 메커니즘이며 기본 콘텐츠를 변경하지 않습니다. 이를 감안할 때 Google 검색이 다른 방식으로 제공되는 동일한 콘텐츠를 별도로 색인화하거나 순위를 매기는 것은 이치에 맞지 않습니다.

#### 웹 바이탈

Google 검색에서 트래픽의 상당 부분을 수신하는 사이트의 경우 SXG를 사용하여 [Web Vitals](/vitals/), 즉 [LCP](/lcp/)를 개선할 수 있습니다. 캐시 및 미리 불러온 SXG는 사용자에게 매우 빠르게 제공될 수 있으며 이로 인해 LCP가 더 빨리 생성됩니다. SXG가 강력한 도구가 될 수 있지만 CDN 사용 및 렌더링 차단 하위 리소스 감소와 같은 다른 성능 최적화와 결합할 때 가장 효과적입니다.

### AMP

AMP 콘텐츠는 SXG를 사용하여 전달할 수 있습니다. SXG를 사용하면 AMP URL이 아닌 표준 URL을 사용하여 AMP 콘텐츠를 미리 가져와 표시할 수 있습니다.

이 문서에 설명된 모든 개념은 여전히 AMP 사용 사례에 적용되지만 AMP에는 SXG 생성을 위한 별도의 [도구](https://github.com/ampproject/amppackager)가 있습니다.

{% Aside%} [amp.dev](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/signed-exchange/)에서 서명 교환을 사용하여 AMP를 제공하는 방법에 대해 알아 봅니다. {% endAside %}

## 도구

SXG 구현 절차는 특정 URL에 해당하는 SXG를 생성한 다음 해당 SXG를 요청자(일반적으로 크롤러)에게 제공하는 절차로 구성됩니다. SXG를 생성하려면 SXG에 서명할 수 있는 인증서가 필요합니다.

### 인증서

프로덕션 과정에서 SXG를 사용하기 위해서는`CanSignHttpExchanges` 확장자를 지원하는 인증서가 필요합니다. [사양](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-4.2)에 따라 이 확장자가 있는 인증서의 유효 기간은 90일을 넘지 않아야 하며 요청하는 도메인에 구성된 [DNS CAA 레코드](https://en.wikipedia.org/wiki/DNS_Certification_Authority_Authorization)가 있어야 합니다.

[이 페이지](https://github.com/google/webpackager/wiki/Certificate-Authorities)에는 이러한 유형의 인증서를 발급할 수 있는 인증 기관이 나열되어 있습니다. SXG용 인증서는 상업용 인증서 발급 기관을 통해서만 사용할 수 있습니다.

### 플랫폼별 SXG 도구

이러한 도구는 특정 기술 스택을 지원합니다. 이러한 도구 중 하나가 지원하는 플랫폼을 이미 사용하고 있다면 범용 도구보다 더 쉽게 설정할 수 있을 것입니다.

- [`sxg-rs/cloudflare_worker`](https://github.com/google/sxg-rs/tree/main/cloudflare_worker)는 [Cloudflare Workers](https://workers.cloudflare.com/)에서 실행됩니다.

- [`sxg-rs/fastly_compute`](https://github.com/google/sxg-rs/tree/main/fastly_compute)는 [Fastly Compute@Edge](https://www.fastly.com/products/edge-compute/serverless)에서 실행됩니다.

- [자동 Signed Exchanges](https://blog.cloudflare.com/automatic-signed-exchanges/)는 자동으로 인증서를 획득하고 Signed Exchanges를 생성하는 Cloudflare 기능입니다.

- [NGINX SXG 모듈](https://github.com/google/nginx-sxg-module)은 [nginx](https://nginx.org/)를 사용하는 사이트에 대한 SXG를 생성하고 제공합니다. 설정 지침은 [여기](/how-to-set-up-signed-http-exchanges/)에서 찾을 수 있습니다.

- [Envoy SXG 필터](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/sxg_filter)는 [Envoy](https://www.envoyproxy.io/)를 사용하는 사이트에 대한 SXG를 생성하고 제공합니다.

### 범용 SXG 도구

#### Web Packager CLI

[Web Packager CLI](https://github.com/google/webpackager)는 특정 URL에 해당하는 SXG를 생성합니다.

```shell
webpackager \
    --private\_key=private.key \
    --cert\_url=https://example.com/certificate.cbor \
    --url=https://example.com
```

SXG 파일이 생성되면 서버에 업로드하고 `application/signed-exchange;v=b3` MIME 유형과 함께 제공하세요. 더불어 SXG 인증서를 `application/cert-chain+cbor`로 제공해야 합니다.

#### Web Packager 서버

[Web Packager 서버](https://github.com/google/webpackager/blob/main/cmd/webpkgserver/README.md)인 `webpkgserver`는 SXG를 제공하기 위한 [역 프록시](https://en.wikipedia.org/wiki/Reverse_proxy) 역할을 합니다. URL이 주어지면 `webpkgserver`가 URL의 내용을 가져와 SXG로 패키징하고 응답으로 SXG를 제공합니다. Web Packager 서버 설정에 대한 지침은 [Web Packager를 사용하여 서명된 교환을 설정하는 방법](/signed-exchanges-webpackager)을 참조하십시오.

### SXG 라이브러리

다음 라이브러리를 사용하여 고유한 SXG 생성기를 만들 수 있습니다.

- [`sxg_rs`](https://github.com/google/sxg-rs/tree/main/sxg_rs)는 SXG를 생성하기 위한 Rust 라이브러리입니다. 가장 강력한 기능을 갖춘 SXG 라이브러리이며 `cloudflare_worker` 및 `fastly_compute` 도구에 대한 기반으로 사용합니다.

- [`libsxg`](https://github.com/google/libsxg)는 SXG를 생성하기 위한 최소 C 라이브러리입니다. NGINX SXG 모듈 및 Envoy SXG 필터 대한 기반으로 사용됩니다.

- [`go/signed-exchange`](https://github.com/WICG/webpackage/tree/main/go/signedexchange) [는 SXG 생성의 참조 구현](https://en.wikipedia.org/wiki/Reference_implementation) 으로 웹 패키지 사양에서 제공하는 최소 Go 라이브러리입니다. 이는 참조 CLI 도구, [`gen-signedexchange`](https://github.com/WICG/webpackage/tree/main/go/signedexchange) 및 보다 기능적인 Web Packager 도구의 기초로 사용합니다.

## 결론

서명된 교환은 리소스가 전달된 방식과 관계없이 리소스의 출처와 유효성을 확인할 수 있는 전달 메커니즘입니다. 결과적으로 SXG는 전체 게시자 속성을 유지하면서 제3자에 의해 배포될 수 있습니다.

## 추가 읽기

- [Signed HTTP Exchanges를 위한 초안 사양](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html)
- [Web Packaging 설명자](https://github.com/WICG/webpackage/tree/main/explainers)
- [Google 검색에서 Signed Exchanges 시작하기](https://developers.google.com/search/docs/advanced/experience/signed-exchange)
- [Web Packager를 사용하여 Signed Exchanges를 설정하는 방법](/signed-exchanges-webpackager)
- [Signed Exchanges 데모](https://signed-exchange-testing.dev/)
