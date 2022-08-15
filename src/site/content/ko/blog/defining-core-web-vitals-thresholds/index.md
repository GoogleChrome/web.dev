---
layout: post
title: Core Web Vitals 메트릭 및 임계값 정의
subhead: Core Web Vitals 임계값에 대한 연구 및 방법론
authors:
  - bmcquade
description: Core Web Vitals 임계값에 대한 연구 및 방법론
date: 2020-05-21
updated: 2022-07-18
hero: image/admin/WNrgCVjmp8Gyc8EbZ9Jv.png
alt: Core Web Vitals 임계값에 대한 연구 및 방법론
tags:
  - blog
  - performance
  - web-vitals
---

[Core Web Vital](/vitals/#core-web-vitals)은 웹에서 실제 사용자 경험의 중요한 측면을 측정하는 필드 메트릭 세트입니다. Core Web Vitals에는 메트릭과 각 메트릭에 대한 대상 임계값이 포함되어 있어 개발자가 사이트 경험 품질이 "양호(good)", "개선 필요(needs improvement)" 또는 "나쁨(poor)" 중 어디에 속하는지 이해하는 데 도움이 됩니다. 이 게시물에서는 일반적으로 Core Web Vitals 메트릭에 대한 임계값을 선택하는 데 사용되는 접근 방식과 특정 Core Web Vitals 메트릭에 대한 임계값이 어떻게 선택되었는지 설명합니다.

## 다시 짚어보기: Core Web Vitals 메트릭 및 임계값

2020년 Core Web Vitals은 Large Contentful Paint(최대 콘텐츠풀 페인트, LCP), First Input Delay(최초 입력 지연, FID), Cumulative Layout Shift(누적 레이아웃 이동, CLS) 메트릭입니다. 각 메트릭은 사용자 경험의 다른 측면을 측정합니다. LCP는 인지된 로드 속도를 측정하고 페이지 로드 타임라인에서 페이지의 메인 콘텐츠가 로드된 지점을 표시합니다. FID는 응답성을 측정하고 사용자가 페이지와 처음 상호 작용을 시도할 때 느끼는 경험을 수량화합니다. CLS는 시각적 안정성을 측정하고 시각적 페이지 콘텐츠의 예기치 못한 레이아웃 이동을 수치화하여 표현합니다.

각 Core Web Vitals 메트릭에는 성능을 "양호(good)", "개선 필요(needs improvement)" 또는 "나쁨(poor)"으로 분류하는 관련 임계값이 있습니다.


<style>
  .cluster > img {
    max-width: 30%;
  }
</style>
<div class="cluster">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg", alt="최대 콘텐츠풀 페인트 권장 임계값", width="400", height="350" %}
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg", alt="최초 입력 지연 권장 임계값", width="400", height="350" %}
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg", alt="누적 레이아웃 이동 권장 임계값", width="400", height="350" %}
</div>

<div>
  <table>
    <tr>
      <th> </th>
      <th>양호</th>
      <th>나쁨</th>
      <th>백분위수</th>
    </tr>
    <tr>
      <td>최대 콘텐츠풀 페인트</td>
      <td>≤2500ms</td>
      <td>&gt;4000ms</td>
      <td>75</td>
    </tr>
    <tr>
      <td>최초 입력 지연</td>
      <td>≤100ms</td>
      <td>&gt;300ms</td>
      <td>75</td>
    </tr>
    <tr>
      <td>누적 레이아웃 이동</td>
      <td>≤0.1</td>
      <td>&gt;0.25</td>
      <td>75</td>
    </tr>
</table>
</div>
<p data-md-type="paragraph">추가적으로 페이지 또는 사이트의 전반적인 성능을 분류하기 위해 해당 페이지 또는 사이트에 대한 모든 페이지 조회수의 75번째 백분위수 값을 사용합니다. 즉, 사이트에 대한 페이지 조회수의 75% 이상이 "양호" 임계값을 충족하는 경우 해당 사이트는 해당 메트릭에 대해 "양호"한 성능을 보이는 것으로 간주됩니다. 반대로 페이지 보기의 25% 이상이 "나쁨" 임계값을 충족하면 해당 사이트의 성능은 "나쁜" 것으로 간주됩니다. 예를 들어 2초의 75번째 백분위수 LCP는 "양호"로 분류되고 5초의 75번째 백분위수 LCP는 "나쁨"으로 분류됩니다.</p>
<h2 data-md-type="header" data-md-header-level="2">Core Web Vitals 메트릭 및 임계값 기준</h2>
<p data-md-type="paragraph">Core Web Vitals 메트릭에 대한 임계값을 설정하기 위해 우리는 먼저 각 임계값이 충족해야 하는 기준을 식별했습니다. 아래에서는 2020년 Core Web Vitals 메트릭 임계값을 평가하기 위해 Google에서 사용한 기준을 설명합니다. 다음 섹션에서는 2020년에 각 메트릭에 대한 임계값을 선택하기 위해 이러한 기준이 어떻게 적용되었는지 자세히 설명하겠습니다. 이후 몇 년 동안 이러한 기준 및 임계값을 개선하고 추가해 나가며 웹에서의 우수한 사용자 경험 측정을 더욱 발전시켜 나갈 수 있을 것으로 예상합니다.</p>
<h3 data-md-type="header" data-md-header-level="3">고품질 사용자 경험</h3>
<p data-md-type="paragraph">핵심 목표는 사용자 및 사용자 경험 품질을 최적화하는 것입니다. 이를 감안할 때 Core Web Vitals의 "양호" 임계값을 충족하는 페이지가 고품질 사용자 경험을 제공하도록 하는 것을 목표로 합니다.</p>
<p data-md-type="paragraph">고품질 사용자 경험과 관련된 임계값을 식별하기 위해 우리는 인간의 인식과 HCI 연구를 살펴봅니다. 이 연구는 고정된 단일 임계값을 사용하여 요약되는 경우가 있지만, 기본 연구는 일반적으로 값의 범위로 표현된다는 점을 알 수 있었습니다. 예를 들어, 사용자가 초점을 잃기 전에 일반적으로 대기하는 시간에 대한 연구는 1초로 설명되는 반면, 기본 연구는 실제로 수백 밀리초에서 수 초의 범위로 표현됩니다. 인식 임계값이 사용자 및 컨텍스트에 따라 다르다는 사실은 익명화된 Chrome 메트릭 데이터 집계가 뒷받침하며 사용자가 페이지 로드를 중단하기 전에 웹페이지에 콘텐츠가 표시될 때까지 기다리는 시간이 단 한 번도 없음을 보여줍니다. 오히려 이 데이터는 원활하고 연속적인 분포를 보여줍니다. 인간의 인식 임계값 및 관련 HCI 연구에 대한 더 자세한 내용은 <a href="https://blog.chromium.org/2020/05/the-science-behind-web-vitals.html" data-md-type="link">Web Vitals의 과학</a>을 참조하세요.</p>
<p data-md-type="paragraph">주어진 메트릭에 대해 관련 사용자 경험 연구를 이용할 수 있고 자료의 값 범위에 대해 합당한 합의가 있는 경우 우리는 이 범위를 임계값 선택 프로세스를 안내하는 입력으로 사용합니다. 누적 레이아웃 이동과 같은 새로운 메트릭처럼 관련 사용자 경험 연구를 사용할 수 없는 경우 대신 메트릭에 대한 서로 다른 후보 임계값을 충족하는 실제 페이지를 평가하여 우수한 사용자 경험을 제공하는 임계값을 식별합니다.</p>
<h3 data-md-type="header" data-md-header-level="3">기존 웹 콘텐츠로 달성 가능</h3>
<p data-md-type="paragraph">또한 사이트 소유자가 "양호" 임계값을 충족하도록 사이트를 최적화려면 웹의 기존 콘텐츠에 대해 이러한 임계값을 달성할 수 있어야 합니다. 예를 들어, 0밀리초는 즉각적인 로드 경험을 제공하는 이상적인 LCP "양호" 임계값이지만 네트워크 및 장치 처리 지연으로 인해 대부분의 경우 0밀리초 임계값을 실제로 달성할 수는 없습니다. 따라서 0밀리초는 Core Web Vitals에 대한 합리적인 LCP "양호" 임계값이라고 할 수 없습니다.</p>
<p data-md-type="paragraph">Core Web Vitals의 "양호" 임계값 후보를 평가할 때는 <a href="https://developer.chrome.com/docs/crux/" data-md-type="link">Chrome User Experience Report</a>(CrUX)의 데이터를 기반으로 해당 임계값을 달성할 수 있는지 확인합니다. 임계값을 달성할 수 있는지 확인하려면 현재 <a href="/same-site-same-origin/#origin" data-md-type="link">원본</a>의 10% 이상이 "양호" 임계값을 충족해야 합니다. 또한, 최적화가 제대로 이루어진 사이트가 필드 데이터의 가변성으로 인해 잘못 분류되지 않도록 이러한 최적화 콘텐츠가 일관되게 "양호" 임계값을 충족하는지 확인합니다.</p>
<p data-md-type="paragraph">반대로, "나쁨" 임계값을 설정할 때는 현재 소수의 출처만이 충족하지 못하는 성능 수준을 식별합니다. "나쁨" 임계값을 정의하는 것과 관련해 사용 가능한 연구가 없는 한, 기본적으로 가장 성능이 좋지 않은 원본의 10~30%가 "나쁨"으로 분류됩니다.</p>
<h3 data-md-type="header" data-md-header-level="3">기준에 대한 마지막 정리</h3>
<p data-md-type="paragraph">후보 임계값을 평가하면서 우리는 기준이 서로 충돌하는 경우가 있음을 발견했습니다. 예를 들어, 지속적으로 달성할 수 있는 임계값과 지속적으로 우수한 사용자 경험을 보장하는 것 사이에 충돌이 있을 수 있습니다. 또한 인간의 인지와 관련한 연구는 일반적으로 다양한 값을 제공하며 사용자 행동 메트릭은 행동의 점진적인 변화를 보여주기 때문에 메트릭에 대한 단일 "올바른" 임계값이 없는 경우가 많습니다. 따라서 2020년 Core Web Vitals에 대한 우리의 접근 방식은 완벽한 임계값은 없으며 때로는 여러 가지 합리적인 임계값 중 선택해야 할 수도 있음을 인지하면서 위의 기준을 가장 잘 충족하는 임계값을 선택하는 것이었습니다. "완벽한 임계계값"을 찾는 것보다는 "우리 기준을 최적으로 달성하는 후보 임계값"을 찾는 데 집중했습니다.</p>
<h2 data-md-type="header" data-md-header-level="2">백분위수 선택</h2>
<p data-md-type="paragraph">앞서 언급했듯이 페이지 또는 사이트의 전반적인 성능을 분류하기 위해 해당 페이지 또는 사이트에 대한 모든 방문의 75번째 백분위수 값을 사용합니다. 75번째 백분위수는 두 가지 기준에 따라 선택되었습니다. 첫째, 백분위수는 페이지 또는 사이트 방문의 대부분이 목표 수준의 성능을 경험했음을 보증해야 합니다. 둘째, 선택된 백분위수의 값이 이상값에 의해 지나치게 영향을 받아서는 안 됩니다.</p>
<p data-md-type="paragraph">이러한 목표는 다소 상충됩니다. 첫 번째 목표를 충족하려면 일반적으로 더 높은 백분위수를 선택하는 것이 좋습니다. 그러나 백분위수가 높을수록 결과 값이 이상적인 값의 영향을 받을 가능성도 높아집니다. 사이트에 대한 몇 번의 방문이 비정상적인 네트워크 연결을 통해 발생하여 LCP 샘플이 지나치게 큰 경우 이러한 이상값 샘플에 의해 사이트 분류가 결정되도록 할 수는 없었습니다. 예를 들어, 95번째와 같은 높은 백분위수를 사용하여 100번의 방문이 있는 사이트의 성능을 평가하는 경우 95번째 백분위수 값에 대해 이상값의 영향을 받는 이상값 샘플은 5개뿐입니다.</p>
<p data-md-type="paragraph">분석 후 이러한 목표가 조금 상충한다는 점을 감안하여 우리는 75번째 백분위수가 합리적인 균형을 이룬다는 결론을 내렸습니다. 75번째 백분위수를 사용하면 대부분의 사이트 방문(3/4)이 목표 수준 이상의 성능을 경험했다는 것을 알 수 있습니다. 또한 75번째 백분위수 값은 이상값의 영향을 덜 받습니다. 다시 예시로 돌아가 보죠. 100회의 방문이 있는 사이트의 경우 이러한 방문 중 25회는 이상값의 영향을 받는 75번째 백분위수 값에 대해 큰 이상값 샘플을 보고해야 합니다. 100개 샘플 중 25개가 이상값일 가능성이 있지만 95번째 백분위수를 사용하는 경우보다 가능성이 훨씬 적습니다.</p>
<h2 data-md-type="header" data-md-header-level="2">최대 콘텐츠풀 페인트</h2>
<h3 data-md-type="header" data-md-header-level="3">경험의 질</h3>
<p data-md-type="paragraph">1초는 사용자가 작업에 대한 집중을 잃기 시작하기까지 대기하는 시간이라고 언급되는 경우가 많습니다. 관련 연구를 자세히 살펴보면 1초가 대략 수백 밀리초에서 몇 초에 이르는 값 범위를 설명하는 근사치라는 것을 알 수 있습니다.</p>
<p data-md-type="paragraph">일반적으로 1초라는 값의 인용 출처는 <a href="https://dl.acm.org/doi/10.1145/108844.108874" data-md-type="link">Card et al</a>과 <a href="https://dl.acm.org/doi/10.1145/1476589.1476628" data-md-type="link">Miller</a>입니다. Card는 Newell의 <a href="https://dl.acm.org/doi/book/10.5555/86564" data-md-type="link">Unified Theories of Gocnition(통합 인지 이론)</a>을 인용하며 "즉각적 응답"의 임계값을 1초로 정의합니다. Newell은 즉각적인 반응을 "어떤 자극에 대해 <em data-md-type="emphasis">약 1초</em>(즉, 대략 ~0.3초에서 ~3초) 이내에 이루어져야 하는 반응"이라고 설명합니다. 이것은 "인지에 대한 실시간 제약"에 대한 Newell의 논의를 따릅니다. 여기에서는 "인지 고려 사항을 불러일으키는 환경과의 상호 작용은 대략 0.5초에서 2-3초 사이에 발생"한다고 이야기합니다. 1초라는 임계값에 대해 일반적으로 인용되는 또 다른 출처인 Miller는 "인간이 기계 통신으로 수행할 수 있고 수행할 작업은 응답 지연이 2초 이상일 경우 그 성격이 크게 바뀌며, 1초 정도 더 확대될 수 있다"고 말합니다.</p>
<p data-md-type="paragraph">Miller와 Card의 연구에서는 사용자가 집중을 잃기 전에 대기하는 시간을 대략 0.3초에서 3초 범위로 설명하며, 이는 LCP에 대한 "양호" 임계값이 이 범위에 있어야 함을 시사합니다. 또한 기존의 최초 콘텐츠풀 페인트에 대한 "양호" 임계값이 1초이며, 최대 콘텐츠풀 페인트가 일반적으로 최초 콘텐츠풀 페인트 이후에 발생한다는 점을 감안하면 후보 LCP 임계값의 범위를 1초에서 3초로 추가로 제한할 수 있습니다. 이 범위에서 기준에 가장 잘 맞는 임계값을 선택하기 위해 우리는 아래와 같이 이러한 후보 임계값의 달성 가능성을 살펴보았습니다.</p>
<h3 data-md-type="header" data-md-header-level="3">달성 가능성</h3>
<p data-md-type="paragraph">CrUX의 데이터를 사용하여 후보 LCP에 대한 "양호" 임계값을 충족하는 웹에서의 원본 백분율을 결정할 수 있습니다.</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">"양호"로 분류된 CrUX 원본의 %(후보 LCP 임계값용)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>1초</th>
      <th>1.5초</th>
      <th>2초</th>
      <th>2.5초</th>
      <th>3초</th>
    </tr>
    <tr>
      <td><strong>휴대폰</strong></td>
      <td>3.5%</td>
      <td>13%</td>
      <td>27%</td>
      <td>42%</td>
      <td>55%</td>
    </tr>
    <tr>
      <td><strong>데스크톱</strong></td>
      <td>6.9%</td>
      <td>19%</td>
      <td>36%</td>
      <td>51%</td>
      <td>64%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">10% 미만의 원본은 1초 임계값을 충족하는 반면, 1.5초에서 3초 사이의 다른 모든 임계값은 최소 10%의 원본이 "양호" 임계값을 충족해야 한다는 요건을 충족하므로 유효한 후보입니다.</p>
<p data-md-type="paragraph">또한 최적화가 잘 이루어진 사이트에 대해 선택한 임계값을 일관되게 달성할 수 있도록 웹 전반에서 최고 성능 사이트에 대한 LCP 성능을 분석하여 이러한 사이트에 대해 일관되게 달성할 수 있는 임계값을 결정합니다. 특히, 최고 성능 사이트에 대해 75번째 백분위수에서 일관되게 달성할 수 있는 임계값을 식별하는 것을 목표로 합니다. 1.5초 및 2초 임계값은 일관되게 달성할 수 없는 반면 2.5초는 일관되게 달성할 수 있습니다.</p>
<p data-md-type="paragraph">LCP에 대한 "불량" 임계값을 식별하기 위해 CrUX 데이터를 사용하여 대부분의 출처에서 충족되는 임계값을 식별합니다.</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">"나쁨"으로 분류된 CrUX 원본의 %(후보 LCP 임계값용)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>3초</th>
      <th>3.5초</th>
      <th>4초</th>
      <th>4.5초</th>
      <th>5 초</th>
    </tr>
    <tr>
      <td><strong>휴대폰</strong></td>
      <td>45%</td>
      <td>35%</td>
      <td>26%</td>
      <td>20%</td>
      <td>15%</td>
    </tr>
    <tr>
      <td><strong>데스크톱</strong></td>
      <td>36%</td>
      <td>26%</td>
      <td>19%</td>
      <td>14%</td>
      <td>10%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">4초 임계값의 경우 휴대폰 원본의 약 26%, 데스크톱 원본의 약 21%가 나쁨으로 분류됩니다. 이는 목표 범위인 10-30%에 속하므로 4초가 허용 가능한 "나쁨" 임계값이라는 결론을 내렸습니다.</p>
<p data-md-type="paragraph">따라서 합리적인 "양호" 임계값은 2.5초이고 최대 콘텐츠풀 페인트에 대한 합리적인 "나쁨" 임계값은 4초라는 결론을 내릴 수 있습니다.</p>
<h2 data-md-type="header" data-md-header-level="2">최초 입력 지연</h2>
<h3 data-md-type="header" data-md-header-level="3">경험의 질</h3>
<p data-md-type="paragraph">연구는 최대 약 100ms의 시각적 피드백 지연이 사용자 입력과 같은 관련 소스로 인해 발생하는 것으로 인식된다는 합리적이고 일관적인 결론으로 이어집니다. 이는 100ms라는 최초 입력 지연에 대한 "양호" 임계값이 최소 기준으로 적절할 수 있음을 시사합니다. 입력 처리 지연이 100ms를 초과하는 경우 다른 처리 및 렌더링 단계가 제시간에 완료될 수 없기 때문입니다.</p>
<p data-md-type="paragraph">일반적으로 인용되는 Jakob Nielsen의 <a href="https://www.nngroup.com/articles/response-times-3-important-limits/" data-md-type="link">Response Times: The 3 Important Limits</a>에서는 사용자가 시스템이 즉각적으로 반응하고 있다고 느끼는 제한이 0.1초라고 정의합니다. Nielsen은 Michotte가 1962년에 발표한 <a href="https://psycnet.apa.org/record/1964-05029-000" data-md-type="link">The Perception of Causality</a>를 인용한 Miller와 Card를 언급합니다. Michotte의 연구에서는 실험 참가자에게 두 개의 물체가 표시되는 화면을 보여줍니다. 물체 A는 출발하여 물체 B를 향해 이동하다가 B와 접촉하는 순간 멈추고, 이후 B는 A에서 멀어지기 시작합니다. Michotte는 물체 A가 멈추고 물체 B가 움직이기 시작할 때 사이의 시간 간격을 변경하면서 참가자가 물체 A가 물체 B의 움직임을 유발한다는 인상을 받는 시간은 최대 100ms인 것을 발견했습니다. 100ms에서 200ms 사이일 경우 인과 관계의 인식이 혼합되며 200ms 이상일 경우 물체 B가 움직인 것이 물체 A로 인한 것이었다고 인지하지 않았습니다.</p>
<p data-md-type="paragraph">이와 유사하게 Miller는 "제어 활성화에 대한 응답"에 대한 응답 임계값을 "키, 스위치, 기타 컨트롤의 움직임 등 일반적으로 물리적 활성화가 있음을 알리는 신호"라고 정의합니다. 또한 이 응답은 작업자가 유발한 기계적 활동의 일부로 인지되어야 하며 시간 지연은 0.1초보다 커서는 안 된다고 말합니다. 이후에는 키 누름과 시각적 피드백의 간격은 0.1~0.2초를 초과해서는 안 된다고 이야기하기도 합니다.</p>
<p data-md-type="paragraph">보다 최근에 Kaaresoja et al은 <a href="https://dl.acm.org/doi/10.1145/2611387" data-md-type="link">Towards Temporally Perfect Virtual Button</a>에서 다양한 지연에 대해 터치스크린에서 가상 버튼을 터치하는 것과 버튼이 터치되었음을 나타내는 후속 시각적 피드백 사이의 동시성에 대한 인식을 조사했습니다. 버튼 누름과 시각적 피드백 사이의 지연이 85ms 이하인 경우 75%의 참가자는 버튼을 누르는 것과 동시에 시각적 피드백이 나타났다고 보고했습니다. 또한, 지연 시간이 100ms 이하인 경우 실험 참가자는 일관적으로 버튼 누름의 반응 품질이 높다고 인지했으며, 100ms~150ms인 경우에는 품질이 떨어진다는 것을 인지하고, 300ms의 지연에 대해 매우 좋지 않은 반응을 보였습니다.</p>
<p data-md-type="paragraph">위의 내용을 감안하여 Web Vitals에 대한 적절한 최초 입력 지연 임계값은 약 100ms의 값 범위라는 결론을 내릴 수 있었습니다. 또한 사용자가 300ms 이상의 지연에 대해 낮은 품질 수준을 보고했으므로 합리적인 "나쁨" 임계값은 300ms로 정했습니다.</p>
<h3 data-md-type="header" data-md-header-level="3">달성 가능성</h3>
<p data-md-type="paragraph">CrUX의 데이터를 사용하여 웹의 다양한 출처가 75번째 백분위수에서 100ms라는 FID의 "양호" 임계값을 충족하는지 확인합니다.</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">FID 100ms 임계값에 대해 "양호"로 분류된 CrUX 출처의 %</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th></th>
      <th>100ms</th>
    </tr>
    <tr>
      <td><strong>휴대폰</strong></td>
      <td>78%</td>
    </tr>
    <tr>
      <td><strong>데스크톱</strong></td>
      <td>&gt;99%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">또한 웹 전체에서 상위 사이트가 75번째 백분위수에서 이 임계값을 일관되게 충족할 수 있음을 관찰했습니다(종종 95번째 백분위수에서 충족되는 경우도 있음).</p>
<p data-md-type="paragraph">위의 내용을 감안할 때 100ms가 FID에 대한 합리적인 "양호" 임계값이라는 결론을 내릴 수 있습니다.</p>
<h2 data-md-type="header" data-md-header-level="2">누적 레이아웃 이동</h2>
<h3 data-md-type="header" data-md-header-level="3">경험의 질</h3>
<p data-md-type="paragraph">누적 레이아웃 이동(CLS)은 페이지의 시각적 콘텐츠가 이동하는 정도를 측정하는 새로운 메트릭입니다. CLS는 새로운 메트릭이므로 이에 대한 메트릭을 직접적으로 알려주는 연구는 없습니다. 따라서 사용자 기대에 부합하는 임계값을 식별할 수 있도록 우리는 페이지 콘텐츠를 소비할 때 심각한 중단을 유발하기 전 허용 가능한 정도로 인지되는 이동의 최대 수를 확인하고자 레이아웃 이동 수를 달리한 실시간 페이지를 평가했습니다. 내부 테스트 결과 0.15 이상의 이동 수준은 지속적으로 방해가 되는 것으로 인지되는 반면 0.1 이하의 이동은 눈에 띄지만 과도하게 방해가 되지는 않다고 인지하는 것으로 나타났습니다. 따라서 이상적인 상황은 레이아웃 이동이 없는 것이지만, "양호"로 볼 수 있는 후보 CLS 임계값은 최대 0.1이라는 결론을 내렸습니다.</p>
<h3 data-md-type="header" data-md-header-level="3">달성 가능성</h3>
<p data-md-type="paragraph">CrUX 데이터를 기반으로 하면 거의 50%에 달하는 출처의 CLS가 0.05 이하임을 알 수 있습니다.</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">"양호"로 분류된 CrUX 출처의 %(후보 CLS 임계값용)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>0.05</th>
      <th>0.1</th>
      <th>0.15</th>
    </tr>
    <tr>
      <td><strong>휴대폰</strong></td>
      <td>49%</td>
      <td>60%</td>
      <td>69%</td>
    </tr>
    <tr>
      <td><strong>데스크톱</strong></td>
      <td>42%</td>
      <td>59%</td>
      <td>69%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">CrUX 데이터는 0.05가 합리적인 CLS "양호" 임계값일 수 있음을 시사하지만 우리는 현재 방해가 되는 레이아웃 이동을 피하기 어려운 사용 사례가 있다는 것도 알고 있습니다. 예를 들어 소셜 미디어 임베드와 같은 타사 임베딩 콘텐츠의 경우 임베드된 콘텐츠의 높이는 로드가 완료될 때까지 알 수 없으며, 이로 인해 0.05보다 큰 레이아웃 이동이 발생할 수 있습니다. 따라서 우리는 대부분 출처가 0.05 임계값을 충족하지만 0.1이라는 보다 완화된 CLS 임계값이 경험의 품질과 달성 가능성 사이에서 더 나은 균형을 유지한다고 결론지었습니다. 앞으로 웹 생태계에서 타사 임베드로 인한 레이아웃 이동에 대한 해결책을 찾아 향후 Core Web Vitals 반복에서 0.05 또는 0이라는 엄격한 CLS "양호" 임계값을 사용할 수 있기를 바랍니다.</p>
<p data-md-type="paragraph">또한 CLS에 대한 "나쁨" 임계값을 결정하기 위해 CrUX 데이터를 사용하여 대부분의 출처에서 충족되는 임계값을 식별했습니다.</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">"나쁨"으로 분류된 CrUX 출처의 %(후보 CLS 임계값용)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>0.15</th>
      <th>0.2</th>
      <th>0.25</th>
      <th>0.3</th>
    </tr>
    <tr>
      <td><strong>휴대폰</strong></td>
      <td>31%</td>
      <td>25%</td>
      <td>20%</td>
      <td>18%</td>
    </tr>
    <tr>
      <td><strong>데스크톱</strong></td>
      <td>31%</td>
      <td>23%</td>
      <td>18%</td>
      <td>16%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">임계값이 0.25인 경우 휴대폰 출처의 약 20%, 데스크톱 출처의 약 18%가 "나쁨"으로 분류됩니다. 이는 목표 범위인 10-30%에 속하므로 0.25가 허용 가능한 "나쁨" 임계값이라는 결론을 내내렸습니다.</p>
