---
layout: post
title: Lighthouse 성능 점수
description: Lighthouse가 페이지에 대한 전체 성능 점수를 생성하는 방법을 알아봅니다.
subhead: Lighthouse가 전체 성능 점수를 계산하는 방법
date: 2019-09-19
updated: 2021-02-26
---

일반적으로, 기회 또는 진단 결과가 아닌 [메트릭](/lighthouse-performance/#metrics)만 Lighthouse 성능 점수에 영향을 미칩니다. 다만, 기회와 진단을 개선하면 메트릭 값이 개선될 가능성이 높으므로 간접적인 관계가 있습니다.

아래에서 점수가 변동할 수 있는 이유, 점수가 구성되는 방식 및 Lighthouse가 각 개별 메트릭에 점수를 매기는 방법을 간략하게 설명했습니다.

## 점수가 변동하는 이유 {: #fluctuations }

전체 성능 점수 및 메트릭 값의 많은 변동성은 Lighthouse 때문이 아닙니다. 성능 점수가 변동하는 것은 일반적으로 기본 조건의 변화 때문입니다. 일반적인 문제는 다음과 같습니다.

- A/B 테스트 또는 서비스 중인 광고의 변경
- 인터넷 트래픽 라우팅의 변경
- 고성능 데스크탑 및 낮은 성능의 노트북과 같은 다양한 장치에서 테스트
- JavaScript를 삽입하고 네트워크 요청을 추가/수정하는 브라우저 확장
- 바이러스 백신 소프트웨어

[가변성에 대한 Lighthouse 문서](https://github.com/GoogleChrome/lighthouse/blob/master/docs/variability.md)에서 이에 대해 더 자세히 설명합니다.

또한 Lighthouse가 전체 성능 점수를 종합적으로 제공할 수 있지만 사이트 성능을 단일 숫자가 아닌 점수 분포로 생각하는 것이 더 유용할 수 있습니다. 그 이유를 이해하려면 [사용자 중심적 성능 메트릭](/user-centric-performance-metrics/)의 소개 내용을 참조하세요.

## 성능 점수에 가중치가 부여되는 방식 {: #weightings }

성능 점수는 *메트릭 점수*의 [가중치 평균](https://www.wikihow.com/Calculate-Weighted-Average#Weighted_Averages_without_Percentages_sub)입니다. 당연히 가중치가 더 높은 메트릭이 전체 성능 점수에 더 큰 영향을 미칩니다. 메트릭 점수는 보고서에 표시되지 않지만 내부적으로 계산됩니다.

{% Aside %} 가중치는 성능에 대한 사용자의 인식을 균형 있게 표현하기 위해 선택되었습니다. 사용자가 인식하는 성능에 가장 큰 영향을 미치는 요소가 무엇인지 이해하기 위해 Lighthouse 팀이 정기적으로 연구를 수행하고 피드백을 수집하기 때문에 가중치는 시간이 지나면서 변경됩니다. {% endAside %}

<figure>
  <p data-md-type="paragraph"><a href="https://googlechrome.github.io/lighthouse/scorecalc/">     {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rLftIdSA8JJYruHOHrOn.png", alt="Lighthouse 점수 계산기 웹앱", width="600", height="414" %}   </a></p>
  <figcaption><a href="https://googlechrome.github.io/lighthouse/scorecalc/">Lighthouse 점수 계산기</a>로 점수 매기기 살펴보기</figcaption></figure>

### Lighthouse 8

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>감사</th>
        <th>가중치</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">최초 콘텐츠가 포함된 페인트</a></td>
        <td>10%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">속도 지수</a></td>
        <td>10%</td>
      </tr>
      <tr>
        <td><a href="/lcp/">가장 큰 콘텐츠가 포함된 페인트</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">상호 작용까지의 시간</a></td>
        <td>10%</td>
      </tr>
      <tr>
        <td><a href="/lighthouse-total-blocking-time/">총 차단 시간</a></td>
        <td>30%</td>
      </tr>
      <tr>
        <td><a href="/cls/">누적 레이아웃 이동</a></td>
        <td>15%</td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 6

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>감사</th>
        <th>가중치</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">최초 콘텐츠가 포함된 페인트</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">속도 지수</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td>Largest Contentful Paint(최대 콘텐츠풀 페인트, LCP)</td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">상호 작용까지의 시간</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td>Total Blocking Time(총 차단 시간, TBT)</td>
        <td>25%</td>
      </tr>
      <tr>
        <td>Cumulative Layout Shift(누적 레이아웃 이동, CLS)</td>
        <td>5%</td>
      </tr>
    </tbody>
  </table>
</div>

### 메트릭 점수가 결정되는 방식 {: #metric-scores }

Lighthouse가 성능 메트릭 수집을 완료하면(대부분 수 밀리초 후에 보고됨) Lighthouse 점수 분포에서 메트릭 값이 속하는 위치를 확인하여 각 원시 메트릭 값을 0에서 100 사이의 메트릭 점수로 변환합니다. 점수 분포는 [HTTP 아카이브](https://httparchive.org/)에 있는 실제 웹사이트 성능 데이터의 성능 메트릭에서 파생된 로그 정규 분포입니다.

예를 들어, LCP(Large Contentful Paint)는 사용자가 페이지의 가장 큰 콘텐츠가 표시되는 것을 감지하는 시점을 측정합니다. LCP에 대한 메트릭 값은 사용자가 페이지 로드를 시작하고 페이지가 기본 콘텐츠를 렌더링하는 사이의 시간을 나타냅니다. 실제 웹사이트 데이터를 기반으로 할 때, 최고 성능을 나타내는 사이트는 약 1,220ms만에 LCP를 렌더링하므로 메트릭 값은 99점에 매핑됩니다.

좀 더 깊이 들어가면, Lighthouse 점수 곡선 모델은 HTTPArchive 데이터를 사용하여 두 개의 제어점을 결정한 다음, 이로부터 [로그 정규](https://en.wikipedia.org/wiki/Weber%E2%80%93Fechner_law) 곡선의 모양을 설정합니다. HTTPArchive 데이터의 25번째 백분위수는 50점(중앙 제어점)이 되고 8번째 백분위수는 90점(양호/녹색 제어점)이 됩니다. 아래의 점수 곡선 플롯을 살펴보면서 0.50과 0.92 사이에는 메트릭 값과 점수 사이에 거의 선형적 관계가 있다는 점에 주목하세요. 약 0.96의 점수는 위와 같이 "이득이 감소하는 지점"으로, 곡선이 멀어지므로 이미 높은 점수를 개선하기 위해 점점 더 많은 메트릭 개선이 필요합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/y321cWrLLbuY4SHlvYCc.png", alt="TTI 점수 곡선 이미지", width="600", height="329" %}<figcaption> <a href="https://www.desmos.com/calculator/o98tbeyt1t">TTI에 대한 점수 곡선을 살펴보세요</a>.</figcaption></figure>

### 데스크톱과 모바일이 처리되는 방식 비교 {: #desktop }

위에서 언급했듯이 점수 곡선은 실제 성능 데이터로부터 결정됩니다. Lighthouse v6 이전에는 모든 점수 곡선이 모바일 성능 데이터를 기반으로 했지만 데스크톱 Lighthouse 실행에서도 이를 사용했습니다. 이 때문에 실제로 데스크톱 점수가 인위적으로 부풀려졌습니다. Lighthouse v6은 특정 데스크톱 점수를 사용하여 이 버그를 수정했습니다. 5에서 6으로 성능 점수의 전반적인 변화를 확실히 예상할 수 있지만 데스크톱의 모든 점수는 크게 다를 것입니다.

### 점수가 색상으로 구분되는 방식 {: #color-coding }

메트릭 점수와 성능 점수는 다음 범위에 따라 색상이 지정됩니다.

- 0~49(빨간색): 나쁨
- 50~89(주황색): 개선 필요
- 90~100(녹색): 양호

좋은 사용자 경험을 제공하기 위해 사이트는 양호한 점수(90-100)를 얻기 위해 노력해야 합니다. 100점의 "완벽한" 점수는 달성하기가 매우 어렵고 기대되지 않습니다. 예를 들어, 99에서 100까지 점수를 올리려면 90에서 94까지 점수를 올리는 것과 동일한 정도의 메트릭 개선이 필요합니다.

### 개발자는 성능 점수를 향상시키기 위해 무엇을 할 수 있나요?

먼저, [Lighthouse 점수 계산기](https://googlechrome.github.io/lighthouse/scorecalc/)를 사용하여 특정 Lighthouse 성능 점수를 달성하기 위해 목표로 삼아야 하는 한계치를 보다 잘 이해하세요.

Lighthouse 보고서의 **기회** 섹션에는 이를 구현하는 방법에 대한 자세한 제안과 문서가 소개되어 있습니다. 또한 **진단** 섹션에는 개발자가 성능을 더욱 향상시키기 위해 탐색할 수 있는 추가 지침이 나열되어 있습니다.

<!--
We don't think users care about the historical scoring rubrics, but we'd still prefer to keep them around because X
## Historical versions

### Lighthouse 5

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>20%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>13%</td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 3 and 4

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>23%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 2

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>29%</td>
      </tr>
    </tbody>
  </table>
</div>

-->
