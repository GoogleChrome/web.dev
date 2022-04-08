---
layout: post
title: Lighthouse 6.0의 새로운 기능
subhead: 새로운 지표, 성과 점수 업데이트, 새로운 감사 등.
authors:
  - cjamcl
date: 2020-05-19
hero: image/admin/93kZL2w49CLIc514qojJ.svg
alt: Lighthouse 로고.
tags:
  - blog
  - performance
  - lighthouse
---

오늘 Lighthouse 6.0을 출시합니다!

[Lighthouse](https://github.com/GoogleChrome/lighthouse/)는 개발자가 사이트의 사용자 경험을 개선할 수 있는 기회와 진단을 제공하는 자동화된 웹사이트 감사 도구입니다. Chrome DevTools, npm(Node 모듈 및 CLI) 또는 브라우저 확장([Chrome](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk) 및 [Firefox](https://addons.mozilla.org/en-US/firefox/addon/google-lighthouse/))에서 사용할 수 있습니다. [web.dev/measure](/measure/) 및 [PageSpeed Insights](https://pagespeed.web.dev/)를 비롯한 많은 Google 서비스를 지원합니다.

Lighthouse 6.0은 npm과 [Chrome Canary](https://www.google.com/chrome/canary/)에서 즉시 사용할 수 있습니다. Lighthouse를 활용하는 다른 Google 서비스는 이달 말까지 업데이트됩니다. Chrome 84(7월 중순)의 Chrome Stable에 상륙합니다.

Lighthouse Node CLI를 시도하려면 다음 명령을 사용하십시오.

```bash
npm install -g lighthouse
lighthouse https://www.example.com --view
```

이 버전의 Lighthouse에는 [6.0 변경 로그에 나열된](https://github.com/GoogleChrome/lighthouse/releases/tag/v6.0.0) 많은 변경 사항이 포함되어 있습니다. 이 글에서 다음과 같은 주요 내용을 다룹니다.

- [새로운 측정항목](#new-metrics)
- [성능 점수 업데이트](#score)
- [새로운 감사](#new-audits)
- [Lighthouse CI](#ci)
- [이름이 변경된 Chrome DevTools 패널](#devtools)
- [모바일 에뮬레이션](#emulation)
- [브라우저 확장](#extension)
- [예산](#budgets)
- [소스 위치 링크](#source-location)
- [수평선에](#horizon)
- [감사합니다!](#thanks)

## 새 측정항목 {: #new-metrics }

<figure>{% Img src="image/admin/Yo1oNtdfEF4PhD7zHDHQ.png", alt="Lighthouse 6.0 측정항목", width="600", height="251" %}</figure>

Lighthouse 6.0은 보고서에 세 가지 새로운 메트릭을 도입합니다. 이러한 새로운 측정항목 중 LCP(Largest Contentful Paint) 및 CLS(Cumulative Layout Shift)는 [Core Web Vitals](/vitals/)의 실험실 구현입니다.

### 가장 큰 내용이 포함된 페인트(LCP) {: #lcp }

[LCP(Large Contentful Paint)](https://www.web.dev/lcp/)는 인지된 로딩 경험을 측정한 것입니다. 기본 또는 "가장 큰" 콘텐츠가 로드되어 사용자에게 표시될 때 페이지 로드 중 지점을 표시합니다. LCP는 로딩 경험의 맨 처음만 포착하는 FCP(First Contentful Paint)를 보완하는 중요한 요소입니다. LCP는 사용자가 실제로 페이지의 콘텐츠를 얼마나 빨리 볼 수 있는지에 대한 신호를 개발자에게 제공합니다. 2.5초 미만의 LCP 점수는 '양호'로 간주됩니다.

자세한 내용은 Paul Irish의 [LCP에 대한 심층 분석을 시청](https://youtu.be/diAc65p15ag)하십시오.

### 누적 레이아웃 시프트(CLS) {: #cls }

[CLS(Cumulative Layout Shift)](https://www.web.dev/cls/)는 시각적 안정성을 측정한 것입니다. 페이지의 콘텐츠가 시각적으로 이동하는 정도를 수량화합니다. 낮은 CLS 점수는 개발자에게 사용자가 과도한 콘텐츠 이동을 경험하고 있지 않다는 신호입니다. 0.10 미만의 CLS 점수는 '양호'로 간주됩니다.

랩 환경의 CLS는 페이지 로드가 끝날 때까지 측정됩니다. 반면 필드에서는 첫 번째 사용자 상호 작용까지 또는 모든 사용자 입력을 포함하여 CLS를 측정할 수 있습니다.

자세한 내용은 Annie Sullivan의 [CLS에 대한 심층 분석을 시청](https://youtu.be/zIJuY-JCjqw)하십시오.

### 총 차단 시간(TBT) {: #tbt }

[총 차단 시간(TBT)](https://www.web.dev/tbt/)은 로드 응답성을 수량화하여 기본 스레드가 입력 응답성을 방지할 만큼 충분히 오랫동안 차단된 총 시간을 측정합니다. TBT는 FCP(First Contentful Paint)와 TTI(Time to Interactive) 사이의 총 시간을 측정합니다. 이는 TTI의 동반 메트릭이며 페이지와 상호 작용하는 사용자의 기능을 차단하는 기본 스레드 활동을 정량화하는 데 더 많은 뉘앙스를 제공합니다.

또한 TBT는 핵심 Web Vital인 필드 메트릭 [FID(First Input Delay)](/fid/)와 잘 연관됩니다.

## 실적 점수 업데이트 {: #score }

Lighthouse의 [성능 점수](/performance-scoring/)는 페이지 속도를 요약하기 위해 여러 메트릭의 가중치 혼합에서 계산됩니다. 6.0 성능 점수 공식은 다음과 같습니다.

&lt;style&gt; .lh-table { min-width: unset; } .lh-table td { min-width: unset; } &lt;/style&gt;

<table class="lh-table">
<thead><tr>
<th><strong>단계</strong></th>
<th><strong>측정항목 이름</strong></th>
<th><strong>메트릭 무게</strong></th>
</tr></thead>
<tbody>
<tr>
<td>초기(15%)</td>
<td>첫 번째 콘텐츠가 포함된 페인트(FCP)</td>
<td>15%</td>
</tr>
<tr>
<td>중기(40%)</td>
<td>속도 지수(SI)</td>
<td>15%</td>
</tr>
<tr>
<td></td>
<td>최대 함량 페인트(LCP)</td>
<td>25%</td>
</tr>
<tr>
<td>후기(15%)</td>
<td>인터랙티브 시간(TTI)</td>
<td>15%</td>
</tr>
<tr>
<td>메인 스레드(25%)</td>
<td>총 차단 시간(TBT)</td>
<td>25%</td>
</tr>
<tr>
<td>예측 가능성(5%)</td>
<td>누적 레이아웃 시프트(CLS)</td>
<td>5%</td>
</tr>
</tbody>
</table>

세 가지 새로운 메트릭이 추가되었지만 첫 번째 의미 있는 페인트, 첫 번째 CPU 유휴 및 최대 잠재적 FID의 세 가지 이전 메트릭이 제거되었습니다. 나머지 메트릭의 가중치는 메인 스레드 상호 작용 및 레이아웃 예측 가능성을 강조하도록 수정되었습니다.

비교를 위해 버전 5 점수는 다음과 같습니다.

<table class="lh-table">
<thead><tr>
<th><strong>단계</strong></th>
<th><strong>측정항목 이름</strong></th>
<th><strong>무게</strong></th>
</tr></thead>
<tbody>
<tr>
<td>초기(23%)</td>
<td>첫 번째 콘텐츠가 포함된 페인트(FCP)</td>
<td>23%</td>
</tr>
<tr>
<td>중기(34%)</td>
<td>속도 지수(SI)</td>
<td>27%</td>
</tr>
<tr>
<td></td>
<td>첫 번째 의미 있는 페인트(FMP)</td>
<td>7%</td>
</tr>
<tr>
<td>완료(46%)</td>
<td>인터랙티브 시간(TTI)</td>
<td>33%</td>
</tr>
<tr>
<td></td>
<td>첫 번째 CPU 유휴(FCI)</td>
<td>13%</td>
</tr>
<tr>
<td>메인 스레드</td>
<td>최대 잠재적 FID</td>
<td>0%</td>
</tr>
</tbody>
</table>

{% Img src="image/admin/gJnkac5fOfjOvmeLXdPO.png", alt="Lighthouse 점수가 버전 5와 6 사이에서 변경되었습니다.", width="800", height="165" %}

Lighthouse 버전 5와 6 사이의 점수 변경 사항에 대한 몇 가지 주요 사항:

- **TTI의 무게가 33%에서 15%로 감소했습니다**. 이는 TTI 변동성에 대한 사용자 피드백과 사용자 경험 개선으로 이어지는 메트릭 최적화의 불일치에 대한 직접적인 응답이었습니다. TTI는 페이지가 완전히 상호작용할 때 여전히 유용한 신호이지만 TBT를 보완으로 사용하면 [변동성이 줄어듭니다](https://docs.google.com/document/d/1xCERB_X7PiP5RAZDwyIkODnIXoBk-Oo7Mi9266aEdGg/edit#heading=h.vkfjuiyx1s5l). 이 점수 변경으로 개발자가 사용자 상호 작용을 최적화하도록 더 효과적으로 권장되기를 바랍니다.
- **FCP의 무게가 23%에서 15%로 감소했습니다.** 첫 번째 픽셀이 칠해진 경우에만 측정(FCP)하여 완전한 그림을 얻을 수 없었습니다. 사용자가 가장 관심을 가질 만한 것(LCP)을 볼 수 있을 때 측정과 결합하면 로딩 경험을 더 잘 반영합니다.
- **Max Potential FID** **는 더 이상 사용되지 않습니다**. 더 이상 보고서에 표시되지 않지만 JSON에서는 계속 사용할 수 있습니다. 이제 mpFID 대신 TBT를 확인하여 상호 작용성을 정량화하는 것이 좋습니다.
- **첫 번째 의미 있는 페인트는 더 이상 사용되지 않습니다.** 이 측정항목은 너무 변종이었고 구현이 Chrome 내부 렌더링에 따라 다르기 때문에 실행 가능한 표준화 경로가 없었습니다. 일부 팀은 사이트에서 FMP 타이밍이 가치가 있다고 생각하지만 메트릭은 추가 개선을 받지 못합니다.
- **첫 번째 CPU 유휴**는 TTI와 충분히 구별되지 않기 때문에 더 이상 사용되지 않습니다. TBT와 TTI는 이제 상호 작용을 위한 필수 지표입니다.
- CLS의 가중치는 상대적으로 낮지만 향후 주요 버전에서 증가할 것으로 예상됩니다.

### 점수 변동 {: #score-shifts }

이러한 변경 사항이 실제 사이트의 점수에 어떤 영향을 줍니까? 우리는 두 개의 데이터 세트를 사용하여 점수 변경에 대한 [분석](https://docs.google.com/spreadsheets/d/1BZFh7AyyaLHCj5LGAbrn3m72ysu4yv8okyHG-f3MoXI/edit?usp=sharing)을 게시했습니다. 하나는 [일반 사이트 세트](https://gist.github.com/connorjclark/8afe673d4e7c6e17204834a256e7caf1)이고 다른 하나는 [Eleventy](https://www.11ty.dev/)로 구축된 [정적 사이트 세트](https://gist.github.com/connorjclark/0be52464887ae3a6f29ad5a798122e0c#file-readme-md)입니다. 요약하면, 사이트의 ~20%는 눈에 띄게 더 높은 점수를 보고, ~30%는 거의 변화가 없으며, ~50%는 최소 5점 감소를 봅니다.

점수 변경은 세 가지 주요 구성 요소로 나눌 수 있습니다.

- 점수 가중치 변경
- 기본 메트릭 구현에 대한 버그 수정
- 개별 점수 곡선 변경

점수 가중치 변경과 세 가지 새로운 측정항목의 도입으로 인해 전체 점수 변경의 대부분이 이루어졌습니다. 개발자가 아직 최적화하지 않은 새로운 메트릭은 버전 6 성능 점수에서 상당한 비중을 차지합니다. 버전 5에서 테스트 말뭉치의 평균 성능 점수는 약 50인 반면, 새로운 총 차단 시간 및 최대 콘텐츠가 포함된 페인트 메트릭의 평균 점수는 약 30이었습니다. 이 두 메트릭을 함께 사용하면 Lighthouse 버전 6에서 가중치의 50%를 차지합니다. 성능 점수가 떨어지므로 당연히 많은 비율의 사이트가 감소했습니다.

기본 메트릭 계산에 대한 버그 수정으로 인해 점수가 달라질 수 있습니다. 이는 비교적 적은 수의 사이트에 영향을 미치지만 특정 상황에서는 상당한 영향을 미칠 수 있습니다. 전반적으로 사이트의 약 8%는 메트릭 구현 변경으로 인해 점수가 향상되었으며 사이트의 약 4%는 메트릭 구현 변경으로 인해 점수가 감소했습니다. 약 88%의 사이트가 이러한 수정 사항의 영향을 받지 않았습니다.

개별 점수 곡선의 변화는 아주 약간이지만 전체 점수 변화에도 영향을 미쳤습니다. 우리는 주기적으로 점수 곡선이 [HTTPArchive 데이터 세트](http://httparchive.org/)에서 관찰된 메트릭과 일치하는지 확인합니다. 주요 구현 변경 사항의 영향을 받는 사이트를 제외하고 개별 메트릭에 대한 점수 곡선을 약간 조정하면 사이트의 약 3% 점수가 향상되고 사이트의 약 4% 점수가 감소했습니다. 약 93%의 사이트가 이 변경의 영향을 받지 않았습니다.

### 점수 계산기 {: #calculator }

성과 채점을 탐색하는 데 도움이 되는 [점수 계산기](https://googlechrome.github.io/lighthouse/scorecalc/)를 게시했습니다. 계산기는 또한 Lighthouse 버전 5와 6 점수를 비교합니다. Lighthouse 6.0으로 감사를 실행하면 보고서에 결과가 채워진 계산기에 대한 링크가 포함됩니다.

<figure>{% Img src="image/admin/N8cRFUnM526m3fB4GQVf.png", alt="Lighthouse 점수 계산기.", width="600", height="319" %} <figcaption>게이지 업그레이드에 대해 <a href="https://twitter.com/anatudor">Ana Tudor</a>에게 큰 감사를 드립니다!</figcaption></figure>

## 새 감사 {: #new-audits }

### 미사용 자바스크립트 {: #unused-javascript }

새로운 감사: [**Unused JavaScript**](/remove-unused-code/)에서 [DevTools 코드 적용 범위](https://developer.chrome.com/docs/devtools/coverage/)를 활용하고 있습니다.

이 감사는 *완전히* 새로운 것은 아닙니다. [2017년 중기](https://github.com/GoogleChrome/lighthouse/issues/1852#issuecomment-306900595)에 추가되었지만 성능 오버헤드 때문에 Lighthouse를 최대한 빠르게 유지하기 위해 기본적으로 비활성화되어 있습니다. 이 범위 데이터를 수집하는 것이 이제 훨씬 더 효율적이므로 기본적으로 활성화하는 것이 좋습니다.

### 접근성 감사 {: #a11y }

Lighthouse는 접근성 카테고리를 강화하기 위해 멋진 [axe-core](https://github.com/dequelabs/axe-core) 라이브러리를 사용합니다. Lighthouse 6.0에는 다음 감사가 추가되었습니다.

- [aria-hidden-body](/aria-hidden-body/)
- [aria-hidden-focus](/aria-hidden-focus/)
- [aria-input-field-name](/aria-input-field-name/)
- [aria-toggle-field-name](/aria-toggle-field-name/)
- [form-field-multiple-labels](/form-field-multiple-labels/)
- [heading-order](/heading-order/)
- [duplicate-id-active](/duplicate-id-active/)
- [duplicate-id-aria](/duplicate-id-aria/)

### 마스크 가능 아이콘 {: #maskable-icon }

[마스크 가능한 아이콘](/maskable-icon/)은 모든 유형의 장치에서 PWA 아이콘을 멋지게 보이게 하는 새로운 아이콘 형식입니다. PWA가 가능한 한 좋게 보이도록 하기 위해 manifest.json이 이 새로운 형식을 지원하는지 확인하는 새로운 감사를 도입했습니다.

### 문자 집합 선언 {: #charset }

[meta charset 요소](/charset/)는 HTML 문서를 해석하는 데 사용해야 하는 문자 인코딩을 선언합니다. 이 요소가 없거나 문서에서 늦게 선언된 경우 브라우저는 여러 경험적 방법을 사용하여 어떤 인코딩을 사용해야 하는지 추측합니다. 브라우저가 잘못 추측하고 늦은 메타 문자 집합 요소가 발견되면 일반적으로 파서는 지금까지 수행한 모든 작업을 버리고 다시 시작하여 사용자에게 좋지 않은 경험을 선사합니다. 이 새로운 감사는 페이지에 유효한 문자 인코딩이 있고 초기에 미리 정의되어 있는지 확인합니다.

## Lighthouse CI {: #ci }

[지난 11월 CDS](/lighthouse-evolution-cds-2019/#lighthouse-ci-alpha-release)에서 우리는 지속적 통합 파이프라인의 모든 커밋에 대해 Lighthouse 결과를 추적하는 오픈 소스 Node CLI 및 서버인 [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)를 발표했으며 알파 릴리스 이후로 먼 길을 왔습니다. Lighthouse CI는 이제 Travis, Circle, GitLab 및 GitHub Actions를 비롯한 다양한 CI 제공업체를 지원합니다. 바로 배포할 수 있는 [도커 이미지](https://github.com/GoogleChrome/lighthouse-ci/tree/master/docs/recipes)를 사용하면 쉽게 설정할 수 있으며, 포괄적인 대시보드 재설계를 통해 이제 Lighthouse의 모든 카테고리 및 메트릭에 대한 추세를 보여주어 자세한 분석을 할 수 있습니다.

[시작 안내서](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/getting-started.md)에 따라 지금 바로 프로젝트에서 Lighthouse CI를 사용하십시오.

<figure data-float="left">{% Img src="image/admin/sXnTzewqGuc84MOCzFJe.png", alt="Lighthouse CI.", width="600", height="413", linkTo=true %}</figure>

<figure data-float="left">{% Img src="image/admin/uGT7AUJEQeqK1vlKySLb.png", alt="Lighthouse CI.", width="600", height="412", linkTo=true %}</figure>

<figure>{% Img src="image/admin/ZR48KZebW43eyAvB1RkT.png", alt="Lighthouse CI.", width="600", height="354", linkTo=true %}</figure>

## Chrome DevTools 패널의 이름 변경 {: #devtools }

**감사** 패널의 이름을 **Lighthouse** 패널로 변경했습니다. 이거면 충분하죠!

DevTools 창 크기에 따라 패널이 `»` 버튼 뒤에 있을 수 있습니다. 탭을 끌어 순서를 변경할 수 있습니다.

[명령 메뉴](https://developer.chrome.com/docs/devtools/command-menu/)를 사용 하여 패널을 빠르게 표시하려면 다음을 수행하십시오.

1. {% Instruction 'devtools', 'none' %}
2. {% Instruction 'devtools-command', 'none' %}
3. "Lighthouse"를 입력하기 시작합니다.
4. `Enter`를 누릅니다.

## 모바일 에뮬레이션 {: #emulation }

Lighthouse는 모바일 우선 사고방식을 따릅니다. 성능 문제는 일반적인 모바일 조건에서 더 분명하지만 개발자는 종종 이러한 조건에서 테스트하지 않습니다. 이것이 Lighthouse의 기본 구성이 모바일 에뮬레이션을 적용하는 이유입니다. 에뮬레이션은 다음으로 구성됩니다.

- 느린 네트워크 및 CPU 조건을 시뮬레이션했습니다([Lantern](https://github.com/GoogleChrome/lighthouse/blob/master/docs/lantern.md)이라는 시뮬레이션 엔진을 통해).
- 기기 화면 에뮬레이션(Chrome DevTools에 있는 것과 동일).

Lighthouse는 처음부터 Nexus 5X를 참조 장치로 사용했습니다. 최근 몇 년 동안 대부분의 성능 엔지니어는 테스트 목적으로 Moto G4를 사용해 왔습니다. 이제 Lighthouse는 이를 따르고 참조 장치를 Moto G4로 변경했습니다. 실제로 이 변경 사항은 그다지 눈에 띄지 않지만 다음은 웹 페이지에서 감지할 수 있는 모든 변경 사항입니다.

- 화면 크기가 412x660픽셀에서 360x640픽셀로 변경되었습니다.
- 사용자 에이전트 문자열이 약간 변경되어 이전에 `Nexus 5 Build/MRA58N` 이었던 장치 부분은 이제 `Moto G (4)`가 됩니다.

Chrome 81부터 Moto G4는 Chrome DevTools 기기 에뮬레이션 목록에서도 사용할 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wMyHDbxs49CTJ831UBp7.png", alt="Moto G4가 포함된 Chrome DevTools 장치 에뮬레이션 목록.", width="800", height="653" %}</figure>

## 브라우저 확장자 {: #extension }

[Lighthouse용 Chrome 확장 프로그램](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)은 Lighthouse를 로컬에서 실행하는 편리한 방법이었습니다. 불행히도 지원하기가 복잡했습니다. Chrome DevTools **Lighthouse** 패널이 더 나은 경험(보고서가 다른 패널과 통합됨)이기 때문에 Chrome 확장 프로그램을 단순화하여 엔지니어링 오버헤드를 줄일 수 있다고 느꼈습니다.

Lighthouse를 로컬로 실행하는 대신 확장 프로그램은 이제 [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)를 사용합니다. 우리는 이것이 일부 사용자에게 충분하지 않다는 것을 알고 있습니다. 주요 차이점은 다음과 같습니다.

- PageSpeed Insights는 로컬 Chrome 인스턴스가 아닌 원격 서버를 통해 실행되기 때문에 비공개 웹사이트를 감사할 수 없습니다. 비공개 웹 사이트를 감사해야 하는 경우 DevTools **Lighthouse** 패널 또는 Node CLI를 사용하십시오.
- PageSpeed Insights는 최신 Lighthouse 릴리스 사용을 보장하지 않습니다. 최신 릴리스를 사용하려면 Node CLI를 사용하세요. 브라우저 확장은 릴리스 후 ~1-2주 후에 업데이트됩니다.
- PageSpeed Insights는 Google API이며 이를 사용하면 Google API 서비스 약관에 동의하는 것으로 간주됩니다. 서비스 약관에 동의하지 않거나 동의할 수 없는 경우 DevTools **Lighthouse** 패널 또는 Node CLI를 사용하십시오.

좋은 소식은 제품 스토리를 단순화하여 다른 엔지니어링 문제에 집중할 수 있다는 것입니다. 그 결과 [Lighthouse Firefox 확장 기능](https://addons.mozilla.org/en-US/firefox/addon/google-lighthouse/)을 출시했습니다!

## 예산 {: #budgets }

Lighthouse 5.0 은 페이지가 제공할 수 있는 [각 리소스 유형](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md#resource-budgets)(예: 스크립트, 이미지 또는 CSS)에 대한 임계값 추가를 지원하는 [성능 예산](/performance-budgets-101/)을 도입했습니다.

Lighthouse 6.0은 [예산 메트릭에 대한 지원](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md#timing-budgets)을 추가하므로 이제 FCP와 같은 특정 메트릭에 대한 임계값을 설정할 수 있습니다. 현재 예산은 Node CLI 및 Lighthouse CI에서만 사용할 수 있습니다.

## 소스 위치 링크 {: #source-location }

Lighthouse가 페이지에 대해 찾은 문제 중 일부는 소스 코드의 특정 줄로 다시 추적될 수 있으며 보고서에는 관련 있는 정확한 파일과 줄이 표시됩니다. DevTools에서 이를 쉽게 탐색할 수 있도록 보고서에 지정된 위치를 클릭하면 **소스** 패널에서 관련 파일이 열립니다.

<figure>
  <video autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/lighthouse-whats-new-6.0/lighthouse-source-location.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/lighthouse-whats-new-6.0/lighthouse-source-location.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>DevTools는 문제를 일으키는 정확한 코드 라인을 보여줍니다.</figcaption></figure>

## 곧 발생 {: #horizon }

Lighthouse는 다음과 같은 새로운 기능을 강화하기 위해 소스 맵을 수집하는 실험을 시작했습니다.

- JavaScript 번들에서 중복 모듈을 감지합니다.
- 최신 브라우저로 전송되는 코드에서 과도한 폴리필 또는 변환을 감지합니다.
- 미사용 JavaScript 감사를 강화하여 모듈 수준의 세분성을 제공합니다.
- 조치가 필요한 모듈을 강조 표시하는 트리맵을 시각화합니다.
- "소스 위치"가 있는 보고서 항목에 대한 원래 소스 코드를 표시합니다.

<figure>{% Img src="image/admin/iZPhM3KNQebgwCsgXTuf.png", alt="소스 맵의 모듈을 표시하는 사용되지 않는 JavaScript.", width="600", height="566" %}<figcaption> 소스 맵을 사용하여 사용하지 않는 JavaScript 감사는 특정 번들 모듈에서 사용되지 않는 코드를 표시합니다.</figcaption></figure>

이러한 기능은 Lighthouse의 향후 버전에서 기본적으로 활성화됩니다. 지금은 다음 CLI 플래그를 사용하여 Lighthouse의 실험적 감사를 볼 수 있습니다.

```bash
lighthouse https://web.dev --view --preset experimental
```

## 감사합니다! {: #thanks }

Lighthouse를 사용하고 피드백을 제공해 주셔서 감사합니다. 귀하의 피드백은 Lighthouse를 개선하는 데 도움이 되며 Lighthouse 6.0을 통해 웹 사이트의 성능을 더 쉽게 개선할 수 있기를 바랍니다.

다음에 무엇을 할 수 있습니까?

- Chrome Canary를 열고 **Lighthouse** 패널을 사용해 보세요.
- 노드 CLI 사용: `npm install -g lighthouse && lighthouse https://yoursite.com --view`.
- 프로젝트와 함께 [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci#lighthouse-ci)를 실행하십시오.
- [Lighthouse 감사 문서](/learn/#lighthouse)를 검토하십시오.
- 더 나은 웹을 만드는 즐거움을 누리세요!

우리는 웹에 열정적이며 개발자 커뮤니티와 협력하여 웹을 개선하는 데 도움이 되는 도구를 구축하는 것을 좋아합니다. Lighthouse는 오픈 소스 프로젝트이며 오타 수정에서 문서 리팩터링, 새로운 감사에 이르기까지 모든 것을 도와주는 모든 기여자에게 큰 감사를 드립니다. [기여에 관심](https://github.com/GoogleChrome/lighthouse/blob/master/CONTRIBUTING.md)이 있으십니까? [Lighthouse GitHub 리포지토리](https://github.com/GoogleChrome/lighthouse)에서 살펴보세요.
