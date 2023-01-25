---
layout: post
title: 서비스 워커 캐싱 및 HTTP 캐싱
subhead: 서비스 워커 캐시 및 HTTP 캐시 계층 전반에 걸쳐 일관되거나 다른 만료 논리를 사용할 경우의 장단점.
authors:
  - jonchen
date: 2020-07-17
description: 서비스 워커 캐시 및 HTTP 캐시 계층 전반에 걸쳐 일관되거나 다른 만료 논리를 사용할 경우의 장단점.
tags:
  - blog
  - network
  - service-worker
  - offline
---

서비스 워커와 PWA가 최신 웹 애플리케이션의 표준이 되는 동안 리소스 캐싱은 그 어느 때보다 복잡해졌습니다. 이 기사에서는 다음을 포함하여 브라우저 캐싱의 큰 그림을 다룹니다.

- 서비스 워커 캐싱과 HTTP 캐싱의 사용 사례와 차이점.
- 일반 HTTP 캐싱 전략과 비교하여 다양한 서비스 워커 캐싱 만료 전략의 장단점.

## 캐싱 흐름 개요

상위 수준에서 브라우저는 리소스를 요청할 때 아래의 캐싱 순서를 따릅니다.

1. **서비스 워커 캐시** : 서비스 워커는 리소스가 캐시에 있는지 확인하고 프로그래밍된 캐싱 전략에 따라 리소스 자체를 반환할지 여부를 결정합니다. 이것은 자동으로 발생하지 않습니다. 서비스 워커에서 fetch 이벤트 핸들러를 만들고 네트워크 요청을 가로채서 네트워크가 아닌 서비스 워커의 캐시에서 요청이 제공되도록 해야 합니다.
2. **HTTP 캐시(브라우저 캐시라고도 함)**: 리소스가 [HTTP 캐시](/http-cache)에 있고 아직 만료되지 않은 경우 브라우저는 자동으로 HTTP 캐시의 리소스를 사용합니다.
3. **서버 측:** 서비스 워커 캐시 또는 HTTP 캐시에 아무것도 없으면 브라우저는 네트워크로 이동하여 리소스를 요청합니다. 리소스가 CDN에 캐시되지 않은 경우 요청은 원본 서버로 다시 돌아가야 합니다.

{% Img src="image/admin/vtKWC9Bg9dAMzoFKTeAM.png", alt="캐싱 흐름", width="800", height="585" %}

{% Aside %}Chrome과 같은 일부 브라우저에는 서비스 워커 캐시 앞에 **메모리 캐시** 레이어가 있습니다. 메모리 캐시의 세부 사항은 각 브라우저의 구현에 따라 다릅니다. 유감스럽게도 아직 이 부분에 대한 명확한 사양이 없습니다.{% endAside %}

## 캐싱 레이어

### 서비스 워커 캐싱

서비스 워커는 네트워크 유형의 HTTP 요청을 가로채고 [캐싱 전략](/offline-cookbook/#serving-suggestions)을 사용하여 브라우저에 반환되어야 하는 리소스를 결정합니다. 서비스 워커 캐시와 HTTP 캐시는 동일한 일반 용도로 사용되지만 서비스 워커 캐시는 정확히 무엇을 캐시하고 어떻게 캐싱을 수행하는지에 대한 세분화된 제어와 같은 더 많은 캐싱 기능을 제공합니다.

#### 서비스 워커 캐시 제어

[서비스 워커는 이벤트 리스너](https://github.com/mdn/sw-test/blob/gh-pages/sw.js#L19)(일반적으로 `fetch` 이벤트)로 HTTP 요청을 가로챕니다. 이 [코드 조각](https://github.com/mdn/sw-test/blob/gh-pages/sw.js#L19)은 [Cache-First](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/#cache-first-cache-falling-back-to-network) 캐싱 전략의 논리를 보여줍니다.

{% Img src="image/admin/INLfnhEpmL4KpMmFXnTL.png", alt="서비스 워커가 HTTP 요청을 가로채는 방법을 보여주는 다이어그램", width="800", height="516" %}

바퀴를 재발명하지 않으려면 [Workbox](https://developer.chrome.com/docs/workbox/)를 사용하는 것이 좋습니다. 예를 들어 [한 줄의 정규식 코드로 리소스 URL 경로를 등록](https://developer.chrome.com/docs/workbox/modules/workbox-routing/#how-to-register-a-regular-expression-route)할 수 있습니다.

```js
import {registerRoute} from 'workbox-routing';

registerRoute(new RegExp('styles/.*\\.css'), callbackHandler);
```

#### 서비스 워커 캐싱 전략 및 사용 사례

다음 표에서는 일반적인 서비스 워커 캐싱 전략과 각 전략이 유용한 경우에 대해 간략하게 설명합니다.

<table>
<thead><tr>
<th><strong>전략</strong></th>
<th><strong>새로움 이유</strong></th>
<th><strong>사용 사례</strong></th>
</tr></thead>
<tbody>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-only">네트워크만</a></p></strong></td>
<td>콘텐츠는 항상 최신 상태여야 합니다.</td>
<td><ul>
<li>결제 및 체크아웃</li>
<li>잔액 명세서</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-falling-back-to-cache">네트워크가 캐시로 폴백</a></p></strong></td>
<td>신선한 콘텐츠를 제공하는 것이 바람직합니다. 그러나 네트워크가 실패하거나 불안정한 경우 약간 오래된 콘텐츠를 제공하는 것이 허용됩니다.</td>
<td><ul>
<li>적시 데이터</li>
<li>가격 및 요금(면책 조항 필요)</li>
<li>주문 상태</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="/stale-while-revalidate/">부실 재검증</a></p></strong></td>
<td>캐시된 콘텐츠를 바로 제공하는 것도 좋지만 향후에는 업데이트된 캐시된 콘텐츠를 사용해야 합니다.</td>
<td><ul>
<li>뉴스 피드</li>
<li>제품 목록 페이지</li>
<li>메시지</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-then-network">먼저 캐시하고 네트워크로 대체</a></p></strong></td>
<td>콘텐츠는 중요하지 않으며 성능 향상을 위해 캐시에서 제공할 수 있지만 서비스 워커는 때때로 업데이트를 확인해야 합니다.</td>
<td><ul>
<li>앱 셸</li>
<li>공통 리소스</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-only">캐시만</a></p></strong></td>
<td>내용은 거의 변경되지 않습니다.</td>
<td><ul><li>정적 콘텐츠</li></ul></td>
</tr>
</tbody>
</table>

#### 서비스 워커 캐싱의 추가 이점

캐싱 로직의 세분화된 제어 외에도 서비스 워커 캐싱은 다음을 제공합니다.

- **오리진을 위한 더 많은 메모리 및 저장 공간:** 브라우저는 [오리진](/same-site-same-origin/#origin) 별로 HTTP 캐시 리소스를 할당합니다. 즉, 여러 하위 도메인이 있는 경우 모두 동일한 HTTP 캐시를 공유합니다. 오리진/도메인의 콘텐츠가 오랫동안 HTTP 캐시에 유지된다는 보장은 없습니다. 예를 들어 사용자는 브라우저의 설정 UI에서 수동으로 정리하거나 페이지에서 강제로 다시 로드하여 캐시를 제거할 수 있습니다. 서비스 워커 캐시를 사용하면 캐시된 콘텐츠가 캐시된 상태로 유지될 가능성이 훨씬 높아집니다. 자세한 내용은 [영구 스토리지](/persistent-storage/)를 참조하세요.
- **불안정한 네트워크 또는 오프라인 경험을 통한 더 높은 유연성:** HTTP 캐시를 사용하면 리소스를 캐시할지 여부를 바이너리 선택만 할 수 있습니다. 서비스 워커 캐싱을 사용하면 약간의 "딸꾹질"을 훨씬 쉽게 완화할 수 있고("stale-while-revalidate" 전략 사용), 완전한 오프라인 경험("캐시 전용" 전략 사용) 또는 그 사이에 있는 사용자 지정 UI 서비스 워커 캐시에서 가져온 페이지의 일부와 해당되는 경우 일부 부분은 제외됩니다("캐치 핸들러 설정" 전략 사용).

### HTTP 캐싱

브라우저는 웹 페이지 및 관련 리소스를 처음 로드할 때 이러한 리소스를 HTTP 캐시에 저장합니다. HTTP 캐시는 최종 사용자가 명시적으로 비활성화하지 않는 한 일반적으로 브라우저에서 자동으로 활성화됩니다.

HTTP 캐싱을 사용한다는 것은 서버에 의존하여 리소스를 캐시할 시기와 기간을 결정하는 것을 의미합니다.

#### HTTP 응답 헤더로 HTTP 캐시 만료 제어

서버가 리소스에 대한 브라우저 요청에 응답하면 서버는 HTTP 응답 헤더를 사용하여 리소스를 캐시해야 하는 기간을 브라우저에 알려줍니다. 자세한 내용은 [응답 헤더: 웹 서버 구성](/http-cache/#response-headers)을 참조하세요.

#### HTTP 캐싱 전략 및 사용 사례

HTTP 캐싱은 서비스 워커 캐싱보다 훨씬 간단합니다. HTTP 캐싱은 TTL(시간 기반) 리소스 만료 논리만 처리하기 때문입니다. [어떤 응답 헤더 값을 사용해야 합니까?](/http-cache/#response-header-strategies)를 참조하십시오. HTTP 캐싱 전략에 대해 자세히 알아보려면 [요약](/http-cache/#summary)을 참조하세요.

## 캐시 만료 논리 설계

이 섹션에서는 서비스 워커 캐시 및 HTTP 캐시 계층에서 일관된 만료 논리를 사용할 때의 장단점과 이러한 계층에서 별도의 만료 논리를 사용할 때의 장단점을 설명합니다.

아래의 결함은 서비스 워커 캐싱과 HTTP 캐싱이 다양한 시나리오에서 작동하는 방식을 보여줍니다.

{% Glitch { id: 'compare-sw-and-http-caching', height: 480 } %}

### 모든 캐시 계층에 대한 일관된 만료 논리

장단점을 설명하기 위해 장기, 중기 및 단기의 3가지 시나리오를 살펴보겠습니다.

<table>
<thead><tr>
<th>시나리오</th>
<th>장기 캐싱</th>
<th>중기 캐싱</th>
<th>단기 캐싱</th>
</tr></thead>
<tbody>
<tr>
<td>서비스 워커 캐싱 전략</td>
<td>캐시, 네트워크로 폴백</td>
<td>부실 재검증</td>
<td>네트워크가 캐시로 폴백</td>
</tr>
<tr>
<td>서비스 워커 캐시 TTL</td>
<td><strong>30일</strong></td>
<td><strong>1일</strong></td>
<td><strong>10분</strong></td>
</tr>
<tr>
<td>HTTP 캐시 최대 사용 기간</td>
<td><strong>30일</strong></td>
<td><strong>1일</strong></td>
<td><strong>10분</strong></td>
</tr>
</tbody>
</table>

#### 시나리오: 장기 캐싱(캐시, 네트워크로 폴백)

- 캐시된 리소스가 유효한 경우(&lt;= 30일): 서비스 워커는 네트워크에 가지 않고 캐시된 리소스를 즉시 반환합니다.
- 캐시된 리소스가 만료된 경우(&gt; 30일): 서비스 워커는 리소스를 가져오기 위해 네트워크로 이동합니다. 브라우저는 HTTP 캐시에 리소스 복사본이 없으므로 리소스에 대해 서버 측으로 이동합니다.

단점: 이 시나리오에서 HTTP 캐싱은 서비스 워커에서 캐시가 만료될 때 브라우저가 항상 서버 측으로 요청을 전달하기 때문에 더 적은 가치를 제공합니다.

#### 시나리오: 중기 캐싱(Stale-while-revalidate)

- 캐시된 리소스가 유효한 경우(&lt;= 1일): 서비스 워커는 캐시된 리소스를 즉시 반환하고 네트워크로 이동하여 리소스를 가져옵니다. 브라우저의 HTTP 캐시에 리소스 복사본이 있으므로 해당 복사본을 서비스 워커에게 반환합니다.
- 캐시된 리소스가 만료된 경우(&gt; 1일): 서비스 워커는 캐시된 리소스를 즉시 반환하고 네트워크로 이동하여 리소스를 가져옵니다. 브라우저는 HTTP 캐시에 리소스 복사본이 없으므로 리소스를 가져오기 위해 서버 측으로 이동합니다.

단점: 서비스 워커는 "재검증" 단계를 최대한 활용하기 위해 HTTP 캐시를 재정의하기 위해 추가 캐시 버스팅이 필요합니다.

#### 시나리오: 단기 캐싱(네트워크가 캐시로 폴백)

- 캐시된 리소스가 유효한 경우(&lt;= 10분): 서비스 워커는 리소스를 가져오기 위해 네트워크로 이동합니다. 브라우저는 HTTP 캐시에 리소스 복사본이 있으므로 서버 측으로 이동하지 않고 서비스 워커에게 반환합니다.
- 캐시된 리소스가 만료된 경우(&gt; 10분): 서비스 워커는 캐시된 리소스를 즉시 반환하고 네트워크로 이동하여 리소스를 가져옵니다. 브라우저는 HTTP 캐시에 리소스 복사본이 없으므로 리소스를 가져오기 위해 서버 측으로 이동합니다.

단점: 중기 캐싱 시나리오와 유사하게 서비스 워커는 서버 측에서 최신 리소스를 가져오기 위해 HTTP 캐시를 재정의하는 추가 캐시 무효화 논리가 필요합니다.

#### 모든 시나리오의 서비스 워커

모든 시나리오에서 서비스 워커 캐시는 네트워크가 불안정할 때 캐시된 리소스를 계속 반환할 수 있습니다. 반면에 HTTP 캐시는 네트워크가 불안정하거나 다운된 경우 신뢰할 수 없습니다.

### 서비스 워커 캐시 및 HTTP 계층에서 다른 캐시 만료 논리

장단점을 설명하기 위해 장기, 중기 및 단기 시나리오를 다시 살펴보겠습니다.

<table>
<thead><tr>
<th>시나리오</th>
<th>장기 캐싱</th>
<th>중기 캐싱</th>
<th>단기 캐싱</th>
</tr></thead>
<tbody>
<tr>
<td>서비스 워커 캐싱 전략</td>
<td>캐시, 네트워크로 폴백</td>
<td>부실 재검증</td>
<td>네트워크가 캐시로 폴백</td>
</tr>
<tr>
<td>서비스 워커 캐시 TTL</td>
<td><strong>90일</strong></td>
<td><strong>30일</strong></td>
<td><strong>1일</strong></td>
</tr>
<tr>
<td>HTTP 캐시 최대 사용 기간</td>
<td><strong>30일</strong></td>
<td><strong>1일</strong></td>
<td><strong>10분</strong></td>
</tr>
</tbody>
</table>

#### 시나리오: 장기 캐싱(캐시, 네트워크로 폴백)

- 서비스 워커 캐시에서 캐시된 리소스가 유효한 경우(&lt;= 90일): 서비스 워커는 캐시된 리소스를 즉시 반환합니다.
- 서비스 워커 캐시에서 캐시된 리소스가 만료된 경우(&gt; 90일): 서비스 워커는 리소스를 가져오기 위해 네트워크로 이동합니다. 브라우저는 HTTP 캐시에 리소스 복사본이 없으므로 서버 측으로 이동합니다.

장점과 단점:

- 장점: 서비스 워커가 캐시된 리소스를 즉시 반환하므로 사용자는 즉각적인 응답을 경험합니다.
- 장점: 서비스 워커가 캐시를 사용할 때와 새 버전의 리소스를 요청할 때를 보다 세밀하게 제어할 수 있습니다.
- 단점: 잘 정의된 서비스 워커 캐싱 전략이 필요합니다.

#### 시나리오: 중간 캐싱(Stale-while-revalidate)

- 캐시된 리소스가 서비스 워커 캐시에서 유효한 경우(&lt;= 30일): 서비스 워커는 캐시된 리소스를 즉시 반환합니다.
- 서비스 워커 캐시에서 캐시된 리소스가 만료된 경우(&gt; 30일): 서비스 워커는 리소스를 위해 네트워크로 이동합니다. 브라우저는 HTTP 캐시에 리소스 복사본이 없으므로 서버 측으로 이동합니다.

장점과 단점:

- 장점: 서비스 워커가 캐시된 리소스를 즉시 반환하므로 사용자는 즉각적인 응답을 경험합니다.
- 장점: 서비스 워커는 "백그라운드에서" 발생하는 재검증 덕분에 주어진 URL에 대한 **다음 요청이 네트워크의 새로운 응답을 사용하도록 할 수 있습니다.**
- 단점: 잘 정의된 서비스 워커 캐싱 전략이 필요합니다.

#### 시나리오: 단기 캐싱(네트워크가 캐시로 폴백)

- 캐시된 리소스가 서비스 워커 캐시에서 유효한 경우(&lt;= 1일): 서비스 워커는 리소스를 위해 네트워크로 이동합니다. 브라우저는 HTTP 캐시가 있는 경우 해당 리소스를 반환합니다. 네트워크가 다운되면 서비스 워커는 서비스 워커 캐시에서 리소스를 반환합니다.
- 서비스 워커 캐시에서 캐시된 리소스가 만료된 경우(&gt; 1일): 서비스 워커는 리소스를 가져오기 위해 네트워크로 이동합니다. 브라우저는 HTTP 캐시의 캐시된 버전이 만료되면 네트워크를 통해 리소스를 가져옵니다.

장점과 단점:

- 장점: 네트워크가 불안정하거나 다운될 때 서비스 워커는 캐시된 리소스를 즉시 반환합니다.
- 단점: 서비스 워커는 HTTP 캐시를 재정의하고 "네트워크 우선" 요청을 만들기 위해 추가 캐시 버스팅이 필요합니다.

## 결론

캐싱 시나리오 조합의 복잡성을 감안할 때 모든 경우를 포괄하는 하나의 규칙을 설계하는 것은 불가능합니다. 그러나 이전 섹션의 결과를 기반으로 캐시 전략을 설계할 때 살펴봐야 할 몇 가지 제안 사항이 있습니다.

- 서비스 워커 캐싱 논리는 HTTP 캐싱 만료 논리와 일치할 필요가 없습니다. 가능하면 서비스 워커에서 더 긴 만료 논리를 사용하여 서비스 워커에 더 많은 제어 권한을 부여합니다.
- HTTP 캐싱은 여전히 중요한 역할을 하지만 네트워크가 불안정하거나 다운된 경우에는 안정적이지 않습니다.
- 각 리소스에 대한 캐싱 전략을 다시 검토하여 HTTP 캐시와 충돌하지 않고 서비스 워커 캐싱 전략이 값을 제공하는지 확인하십시오.

## 더 알아보기

- [네트워크 안정성](/reliable/)
- [HTTP Cache로 불필요한 네트워크 요청 방지](/http-cache)
- [HTTP 캐시 코드랩](/codelab-http-cache/)
- [서비스 워커의 실제 성능 영향 측정](https://developers.google.com/web/showcase/2016/service-worker-perf)
- [캐시 제어와 만료](https://stackoverflow.com/questions/5799906/what-s-the-difference-between-expires-and-cache-control-headers)
