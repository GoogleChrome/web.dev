---
layout: post
title: '"동일 사이트" 및 "동일 출처" 이해하기'
authors:
  - agektmr
date: 2020-04-15
updated: 2020-06-10
description: '"동일 사이트"와 "동일 출처"는 자주 인용되지만 종종 오해됩니다. 이 기사는 이 둘이 무엇이며 어떻게 다른지 이해하는 데 도움이 됩니다.'
tags:
  - security
---

"동일 사이트"와 "동일 출처"는 자주 인용되지만 종종 오해되는 용어입니다. 예를 들어 페이지 전환, `fetch()` 요청, 쿠키, 팝업 열기, 포함된 리소스 및 iframe과 관련하여 언급됩니다.

## 출처

{% Img src="image/admin/PX5HrIMPlgcbzYac3FHV.png", alt="출처", width="680", height="100" %}

"출처"은 [체계](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol) [(프로토콜](https://developer.mozilla.org/docs/Glossary/Protocol) 이라고도 하는 [HTTP](https://developer.mozilla.org/docs/Glossary/HTTP) 또는 [HTTPS](https://developer.mozilla.org/docs/Glossary/HTTPS) ), [호스트 이름](https://en.wikipedia.org/wiki/Hostname) 및 [포트](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Port) (지정된 경우)의 조합입니다. 예를 들어, URL이 `https://www.example.com:443/foo` 인 경우 "출처"는 `https://www.example.com:443` 입니다.

### "동일 출처"와 "교차 출처" {: #same-origin-and-cross-origin }

동일한 구성표, 호스트 이름 및 포트가 조합된 웹 사이트는 "동일 출처"로 간주됩니다. 다른 모든 것은 "교차 출처"로 간주됩니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>출처 A</th>
        <th>출처 B</th>
        <th>출처 A와 B가 "동일 출처"인지 "교차 출처"인지에 대한 설명</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="7">https://www.example.com:443</td>
        <td>
<strong>https://www.evil.com</strong> :443</td>
        <td>교차 출처: 다른 도메인</td>
      </tr>
      <tr>
        <td>https://<strong>example.com</strong>:443</td>
        <td>교차 출처: 다른 하위 도메인</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td>교차 출처: 다른 하위 도메인</td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td>교차 출처: 다른 체계</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td>교차 출처: 다른 포트</td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>동일 출처: 정확히 일치</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>동일 출처: 암시적 포트 번호(443) 일치</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## 사이트

{% Img src="image/admin/oSRJzCJIr4OjGzUhcNDP.png", alt="사이트", width="680", height="142" %}

`.com` 및 `.org`와 같은 최상위 도메인(TLD)은 [루트 영역 데이터베이스](https://www.iana.org/domains/root/db)에 나열됩니다. 위의 예에서 "사이트"는 TLD와 그 바로 앞의 도메인 부분의 조합입니다. 예를 들어 URL이 `https://www.example.com:443/foo` 인 경우 "사이트"는 `example.com` 입니다.

`.co.jp` 또는 `.github.io` 와 같은 `.jp` 또는 `.io` 의 TLD를 사용하는 것만으로는 "사이트"를 식별할 수 있을 만큼 세분화되지 않습니다. 또한 특정 TLD에 대해 등록 가능한 도메인 수준을 알고리즘 방식으로 결정할 수 있는 방법이 없습니다. 이것이 "유효 TLD"(eTLD) 목록이 생성된 이유입니다. 이것들은 [공개 접미사 목록](https://wiki.mozilla.org/Public_Suffix_List)에 정의되어 있습니다. eTLDs의 목록은 유지됩니다 [publicsuffix.org/list](https://publicsuffix.org/list/).

전체 사이트 이름은 eTLD+1로 알려져 있습니다. 예를 들어 URL이 `https://my-project.github.io`인 경우 eTLD는 `.github.io`이고 eTLD+1은 `my-project.github.io`이며 "사이트"로 간주됩니다. 즉, eTLD+1은 유효 TLD이며 바로 앞의 도메인 부분입니다.

{% Img src="image/admin/qmr35hpnIvpouOe9591g.png", alt="eTLD+1", width="695", height="136" %}

### "same-site"와 "cross-site" {: #same-site-cross-site }

동일한 eTLD+1이 있는 웹사이트는 "same-site"로 간주됩니다. 다른 eTLD+1이 있는 웹사이트는 "cross-site"입니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>출처 A</th>
        <th>출처 B</th>
        <th>출처 A와 B가 "동일 사이트"인지 "교차 사이트"인지에 대한 설명</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>교차 사이트: 다른 도메인</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>동일 사이트: 다른 하위 도메인은 중요하지 않습니다.</strong></td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td><strong>동일 사이트: 다른 체계는 중요하지 않습니다.</strong></td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td><strong>동일 사이트: 다른 포트는 중요하지 않습니다.</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>동일 사이트: 정확히 일치</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>동일 사이트: 포트는 중요하지 않습니다.</strong></td>
      </tr>
    </tbody>
  </table>
</div>

### "schemeful 동일 사이트"

{% Img src="image/admin/Y9LbVyxYzg4k6mwSEqyE.png", alt="schemeful same-site", width="677", height="105" %}

"동일 사이트"의 정의는 HTTP가 [약한 채널](https://tools.ietf.org/html/draft-west-cookie-incrementalism-01#page-8)로 사용되는 것을 방지하기 위해 URL 체계를 사이트의 일부로 간주하도록 진화하고 있습니다. 브라우저가 이 해석으로 이동함에 따라 이전 정의를 참조할 때 "scheme-less 동일 사이트"에 대한 참조와 더 엄격한 정의를 참조하는 "[schemeful 동일 사이트](/schemeful-samesite/)"에 대한 참조를 볼 수 있습니다. 이 경우 `http://www.example.com` 및 `https://www.example.com`이 교차 사이트로 간주됩니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>출처 A</th>
        <th>Origin B</th>
        <th>출처 A와 B가 "schemeful 동일 사이트"인지 여부에 대한 설명</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>
<strong>https://www.evil.com</strong> :443</td>
        <td>cross-site: 다른 도메인</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>schemeful 동일 사이트: 다른 하위 도메인은 중요하지 않습니다.</strong></td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td>교차 출처: 다른 체계</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td><strong>schemeful 동일 사이트: 다른 포트는 중요하지 않습니다.</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>schemeful 동일 사이트: 정확히 일치</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>schemeful 동일 사이트: 포트는 중요하지 않습니다.</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## 요청이 "동일 사이트", "동일 출처" 또는 "교차 사이트"인지 확인하는 방법

`Sec-Fetch-Site` HTTP 헤더와 함께 요청을 보냅니다. 다른 브라우저는 2020년 4월 현재 `Sec-Fetch-Site` 를 지원하지 않습니다. 이것은 더 큰 [Fetch Metadata Request Headers](https://www.w3.org/TR/fetch-metadata/) 제안의 일부입니다. 헤더에는 다음 값 중 하나가 있습니다.

- `cross-site`
- `same-site`
- `same-origin`
- `none`

`Sec-Fetch-Site`의 값을 검사하여 요청이 "동일 사이트", "동일 출처" 혹은 "교차 사이트"인지 확인할 수 있습니다("schemeful-same-site는 `Sec-Fetch-Site`에서 포착되지 않습니다).
