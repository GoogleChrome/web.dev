---
layout: post
title: 텍스트 압축 활성화
description: |2-

  텍스트 압축을 활성화하여 웹 페이지 로드 성능을 향상시키는 방법에 대해 알아보십시오.
date: 2019-05-02
updated: 2020-06-04
web_lighthouse:
  - uses-text-compression
---

텍스트 기반 리소스는 총 네트워크 바이트를 최소화하기 위해 압축과 함께 제공해야 합니다. Lighthouse 보고서의 기회 섹션에는 압축되지 않은 모든 텍스트 기반 리소스가 나열되어 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZftZfKlPcEu2cs4ltwK8.png", alt="Lighthouse Enable 텍스트 압축 감사에 대한 스크린샷", width="800", height="271" %}</figure>

## Lighthouse가 텍스트 압축을 처리하는 방법

Lighthouse는 다음과 같은 모든 응답을 수집합니다.

- 텍스트 기반 리소스 유형을 갖는 응답.
- `br`, `gzip` 또는 `deflate`로 설정된 `content-encoding` 헤더는 포함하지 않는 응답.

그런 다음 Lighthouse는 이러한 각 항목을 [GZIP](https://www.gnu.org/software/gzip/)으로 압축하여 잠재적인 절감 효과를 계산합니다.

응답의 원래 크기가 1.4KiB보다 작거나 잠재적 압축 절감 효과가 원래 크기의 10% 미만인 경우 Lighthouse는 결과에서 해당 응답에 플래그를 지정하지 않습니다.

{% Aside 'note' %} Lighthouse가 나열하는 잠재적 절감 효과는 응답이 GZIP으로 인코딩될 때의 잠재적 절감 효과입니다. Brotli를 사용하면 더 많은 절감 효과를 달성할 수 있습니다. {% endAside %}

## 서버에서 텍스트 압축을 활성화하는 방법

이 감사를 통과하려면 이러한 응답을 제공한 서버에서 텍스트 압축을 활성화하십시오.

브라우저가 리소스를 요청하면 [`Accept-Encoding`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Encoding) HTTP 요청 헤더를 사용하여 지원하는 압축 알고리즘을 나타냅니다.

```text
Accept-Encoding: gzip, compress, br
```

브라우저가 [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) (`br`)를 지원하는 경우 다른 압축 알고리즘보다 리소스의 파일 크기를 줄일 수 있으므로 Brotli를 사용해야 합니다. `<X>에서 Brotli 압축 활성화 방법`을 검색하십시오. 여기서 `<X>`는 서버 이름입니다. 2020년 6월 시점으로 Brotli는 Internet Explorer, 데스크탑 Safari 및 iOS의 Safari를 제외한 모든 주요 브라우저에서 지원됩니다. 업데이트는 [브라우저 호환성](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding#Browser_compatibility)을 참조십시오.

Brotli에 대한 폴백으로 GZIP을 사용합니다. GZIP은 모든 주요 브라우저에서 지원되지만 Brotli보다 효율이 떨어집니다. 예제는 [서버 구성](https://github.com/h5bp/server-configs)을 참조하십시오.

서버는 [`Content-Encoding`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding) HTTP 응답 헤더를 반환하여 사용된 압축 알고리즘을 표시해야 합니다.

```text
Content-Encoding: br
```

## Chrome DevTools에서 응답이 압축되었는지 확인

서버가 응답을 압축했는지 확인하려면:

{% Instruction 'devtools-network', 'ol' %}

1. 관심 있는 응답의 원인이 된 요청을 클릭합니다.
2. **헤더** 탭을 클릭합니다.
3. **응답 헤더** 섹션에서 `content-encoding` 헤더를 확인합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jBKe0MYnlcQK9OLzAKTa.svg", alt="콘텐츠 인코딩 응답 헤더", width="800", height="571" %}<figcaption> <code>content-encoding</code> 응답 헤더. </figcaption></figure>

응답의 압축 및 압축 해제 크기를 비교하려면 다음을 수행합니다.

{% Instruction 'devtools-network', 'ol' %}

1. 큰 요청 행을 활성화합니다. [큰 요청 행 사용](https://developer.chrome.com/docs/devtools/network/reference/#request-rows)을 참조하십시오.
2. 관심 있는 응답의 **크기** 열을 확인하십시오. 최상위 값은 압축된 크기입니다. 하단 값은 압축 해제된 크기입니다.

[네트워크 페이로드 축소 및 압축](/reduce-network-payloads-using-text-compression)도 참조하십시오.

## 스택별 지침

### Joomla

Gzip 페이지 압축 설정(**시스템** &gt; **전역 구성** &gt; **서버**)을 활성화합니다.

### WordPress

웹 서버 구성에서 텍스트 압축을 활성화합니다.

## 리소스

- [**텍스트 압축 활성화** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-text-compression.js)
