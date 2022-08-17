---
title: FLoC란 무엇입니까?
subhead: FLoC는 개별 사용자의 브라우징 행동을 공유하지 않고 광고 선택을 가능하게 합니다.
authors:
  - samdutton
date: 2021-03-30
updated: 2021-10-29
hero: image/80mq7dk16vVEg8BBhsVe42n6zn82/GA543wiVTwpbwp6Zmw0H.jpg
thumbnail: image/80mq7dk16vVEg8BBhsVe42n6zn82/OuORgPSvN06ntXT5xOii.jpg
alt: 브라이튼 부두 위 찌르레기의 중얼거림
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside %} 이 게시물은 FLoC의 첫 번째 원본 평가판을 위해 Chrome에 구현된 API 설계를 간략하게 설명합니다.

제3자 쿠키 또는 기타 사이트 간 추적 메커니즘 없이 관심 기반 광고를 가능하게 하는 API의 향후 버전은 현재 개발 중입니다. {% endAside %}

FLoC는 관심 기반 광고 선택을 위한 개인 정보 보호 메커니즘을 제공합니다.

사용자가 웹에서 이동할 때 브라우저는 FLoC 알고리즘을 사용하여 유사한 최근 검색 기록을 가진 수천 개의 브라우저에서 동일한 "관심 집단"을 계산합니다. 브라우저는 개별 브라우징 데이터를 브라우저 공급업체나 다른 사람과 공유하지 않고 사용자의 장치에서 주기적으로 해당 집단을 다시 계산합니다.

{% Aside %} 초기 FLoC 평가판 동안 페이지 방문은 다음 두 가지 이유 중 하나로 인해 브라우저의 FLoC 계산에만 포함되었습니다.

- FLoC API(`document.interestCohort()`)가 페이지에서 사용됩니다.
- Chrome은 페이지에서 [광고 또는 광고 관련 리소스를 로드](https://github.com/WICG/floc/issues/82)하는 것을 감지합니다.

다른 클러스터링 알고리즘의 경우 실험에서 다른 포함 기준을 사용하여 실험할 수 있습니다. 이는 원본 실험 프로세스의 일부입니다.

Chrome 89부터 91에서 실행되었던 FLoC의 초기 버전에 대한 원본 평가판이 [이제 종료되었습니다](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561). {% endAside %}

광고주(광고 비용을 지불하는 사이트)는 코호트 데이터를 수집하여 광고기술 플랫폼(광고 제공을 위한 소프트웨어 및 도구를 제공하는 회사)에 제공하기 위해 자신의 웹사이트에 코드를 포함할 수 있습니다. 예를 들어, 광고기술 플랫폼은 집단 1101 및 1354의 브라우저가 상점의 하이킹 장비에 관심이 있는 것으로 보이는 온라인 신발 상점으로부터 학습할 수 있습니다. 다른 광고주로부터 광고기술 플랫폼은 해당 집단의 다른 관심사에 대해 학습합니다.

결과적으로 광고 플랫폼은 해당 집단 중 하나의 브라우저가 뉴스 웹사이트와 같이 광고를 표시하는 사이트에서 페이지를 요청할 때 이 데이터를 사용하여 관련 광고(예: 신발 가게의 등산화 광고)를 선택할 수 있습니다.

프라이버시 샌드박스는 제3자 쿠키 또는 기타 추적 메커니즘 없이 제3자 사용 사례를 충족하기 위한 일련의 제안입니다. 모든 제안에 대한 개요는 [개인 정보 보호 샌드박스 자세히 보기](/digging-into-the-privacy-sandbox)를 참조하세요.

**이 제안은 귀하의 피드백이 필요합니다.** 의견이 있는 경우 [FLoC Explainer](https://github.com/WICG/floc/issues/new) 저장소에 [문제를 생성하십시오](https://github.com/WICG/floc). Chrome이 이 제안을 실험에 하는 것해 피드백이 있는 경우 [실험 의도](https://groups.google.com/a/chromium.org/g/blink-dev/c/MmijXrmwrJs)에 회신을 게시하세요.

## FLoC가 필요한 이유는 무엇입니까?

많은 기업이 광고에 의존하여 트래픽을 사이트로 유도하고 많은 게시자 웹사이트에서 광고 인벤토리를 판매하여 콘텐츠 자금을 조달합니다. 사람들은 일반적으로 자신에게 관련성 있고 유용한 광고를 보고 싶어하며 관련성 있는 광고는 광고주에게 더 많은 비즈니스를 제공하고 [해당 광고를 호스팅하는 웹사이트에 더 많은 수익을 가져다 줍니다](https://services.google.com/fh/files/misc/disabling_third-party_cookies_publisher_revenue.pdf). 즉, 광고 공간은 관련성 높은 광고를 보여줄 때 더 가치가 있습니다. 따라서 관련 광고를 선택하면 광고 지원 웹사이트의 수익이 증가합니다. 이는 다시 관련 광고가 사용자에게 이익이 되는 콘텐츠 제작 자금을 지원한다는 것을 의미합니다.

그러나 사람들은 현재 쿠키 추적 및 장치 지문과 같은 기술에 의존하는 맞춤형 광고가 개인 정보 보호에 미치는 영향에 대해 우려하고 있습니다. FLoC 제안은 개인 정보를 더 잘 보호하는 방식으로 광고 선택을 허용하는 것을 목표로 합니다.

## FLoC는 무엇에 사용할 수 있습니까?

- 광고주의 사이트를 자주 방문하거나 관련 주제에 관심을 보이는 집단에 속하는 브라우저를 사용하는 사람들에게 광고를 게재합니다.
- 광고 경매 입찰과 관련된 행동을 알리기 위해 기계 학습 모델을 사용하여 사용자 집단을 기반으로 사용자가 전환할 확률을 예측합니다.
- 사용자에게 콘텐츠를 추천합니다. 예를 들어, 뉴스 사이트에서 스포츠 팟캐스트 페이지가 집단 1234 및 7의 방문자에게 특히 인기가 있다는 것을 관찰했다고 가정합니다. 해당 콘텐츠를 해당 집단의 다른 방문자에게 추천할 수 있습니다.

## FLoC는 어떻게 작동합니까?

아래 예는 FLoC를 사용하여 광고를 선택하는 다양한 역할을 설명합니다.

- 이 예에서 **광고주**(광고 비용을 지불하는 회사)는 온라인 신발 소매업체입니다.<br> **<u>shoestore.example</u>**

- 예에서 **게시자**(광고 공간을 판매하는 사이트)는 뉴스 사이트입니다.<br> **<u>dailynews.example</u>**

- **광고기술 플랫폼**(광고 전달을 위한 소프트웨어 및 도구 제공)은 다음과 같습니다.<br> **<u>adnetwork.example</u>**

{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/wnJ1fSECf5STngywgE7V.png", alt="FLoC를 사용하여 광고를 선택하고 전달하는 다양한 역할을 단계별로 보여주는 다이어그램: FLoC 서비스, 브라우저, 광고주, 게시자(집단 관찰용), 광고기술 제공자, 게시자(광고 표시용)", width="800", height="359" %}

이 예에서 우리는 사용자를 **Yoshi** 및 **Alex**라고 불렀습니다. 처음에는 두 브라우저 모두 동일한 집단인 1354에 속합니다.

{% Aside %} 여기에서는 사용자를 Yoshi와 Alex라고 불렀지만 이는 예시를 위한 것일 뿐입니다. 이름과 개인의 신원은 FLoC를 사용하는 광고주, 게시자 또는 애드테크 플랫폼에 공개되지 않습니다.

집단을 사람들의 집합체로 생각하지 마십시오. 대신, 집단을 브라우징 활동의 그룹으로 생각하십시오. {% endAside %}

### 1. FLoC 서비스

1. 브라우저에서 사용하는 FLoC 서비스는 수천 개의 "집단(cohort)"으로 수학적 모델을 생성하며, 각각은 유사한 최근 검색 기록을 가진 수천 개의 웹 브라우저에 해당합니다. [아래](#floc-server)에서 작동 방식에 대해 자세히 알아보세요.
2. 각 집단에는 번호가 부여됩니다.

### 2. 브라우저

1. FLoC 서비스에서 Yoshi의 브라우저는 FLoC 모델을 설명하는 데이터를 얻습니다.
2. Yoshi의 브라우저 는 [FLoC 모델의 알고리즘을 사용](#floc-algorithm)하여 자신의 검색 기록에 가장 근접한 집단을 계산하여 집단을 계산합니다. 이 예에서는 집단 1354가 됩니다. Yoshi의 브라우저는 FLoC 서비스와 데이터를 공유하지 않습니다.
3. 같은 방식으로 Alex의 브라우저는 집단 ID를 계산합니다. Alex의 검색 기록은 Yoshi의 검색 기록과 다르지만 두 브라우저가 모두 집단 1354에 속할 정도로 비슷합니다.

### 3. 광고주: <span style="font-weight:normal">shoestore.example</span>

1. Yoshi가 <u>shoestore.example을</u> 방문합니다.
2. 이 사이트는 Yoshi의 브라우저에 집단 1354를 요청합니다.
3. Yoshi가 등산화를 살펴봅니다.
4. 이 사이트는 집단 1354의 브라우저가 등산화에 관심을 보였다고 기록합니다.
5. 이 사이트는 나중에 집단 1354와 다른 집단의 제품에 대한 추가 관심을 기록합니다.
6. 이 사이트는 adtech 플랫폼 <u>adnetwork.example</u>을 사용하여 집단 및 제품 관심 분야에 대한 정보를 주기적으로 집계하고 공유합니다.

이제 Alex 차례입니다.

### 4. 게시자: <span style="font-weight:normal">dailynews.example</span>

1. Alex는 <u>dailynews.example을</u> 방문합니다.
2. 이 사이트는 Alex의 브라우저에 해당 집단을 요청합니다.
3. 그런 다음 사이트는 Alex의 브라우저 집단인 1354를 포함하여 adtech 플랫폼 <u>adnetwork.example</u>에 광고를 요청합니다.

### 5. 광고기술 플랫폼: <span style="font-weight:normal">adnetwork.example</span>

1. <u>adnetwork.example</u>은 게시자 <u>dailynews.example</u>과 광고주 <u>shoestore.example</u>의 데이터를 결합하여 Alex에게 적합한 광고를 선택할 수 있습니다.

- <u>Dailynews.example</u>에서 제공한 Alex가 사용하는 브라우저의 집단: 1354.
- <u>shoestore.example의</u> 집단 및 제품 관심분야에 대한 데이터: "집단 1354 의 브라우저가 등산화에 관심이 있을 수 있습니다."

1. <u>adnetwork.example</u>은 Alex에게 적합한 광고인 <u>shoestore.example</u>의 하이킹 부츠 광고를 선택합니다.
2. <u>Dailynews.example</u>은 광고🥾를 표시합니다.

{% Aside %} 광고 선택에 대한 현재 접근 방식은 쿠키 및 기기 지문 추적과 같은 기술에 의존하며, 이는 광고주와 같은 제3자가 개별 탐색 행동을 추적하는 데 사용합니다.

FLoC를 사용하면 브라우저는 FLoC 서비스 또는 다른 사람과 검색 기록을 **공유하지 않습니다.** 사용자 기기의 브라우저는 어느 집단에 속하는지 알아냅니다. 사용자의 검색 기록은 장치를 떠나지 않습니다. {% endAside %}

## FLoC 모델을 생성하는 백엔드 서비스는 누가 실행합니까?

모든 브라우저 공급업체는 브라우저를 집단으로 그룹화하는 방법을 스스로 선택해야 합니다. Chrome은 자체 FLoC 서비스를 실행하고 있습니다. 다른 브라우저는 다른 클러스터링 접근 방식으로 FLoC를 구현하도록 선택할 수 있으며 그렇게 하기 위해 자체 서비스를 실행할 것입니다.

## FLoC 서비스를 통해 브라우저가 해당 집단을 파악할 수 있는 방법은 무엇입니까? {: #floc-서버 }

1. 브라우저에서 사용하는 FLoC 서비스는 모든 잠재적인 웹 검색 기록에 대한 다차원 수학적 표현을 생성합니다. 우리는 이 모델을 "집단 공간"이라고 부를 것입니다.
2. 서비스는 이 공간을 수천 개의 세그먼트로 나눕니다. 각 세그먼트는 수천 개의 유사한 검색 기록 클러스터를 나타냅니다. 이러한 그룹화는 실제 검색 기록을 아는 것을 기반으로 하지 않습니다. 그들은 단순히 "집단 공간"에서 임의의 중심을 선택하거나 임의의 선으로 공간을 자르는 것을 기반으로 합니다.
3. 각 세그먼트에는 집단 번호가 지정됩니다.
4. 웹 브라우저는 FLoC 서비스에서 "집단 공간"을 설명하는 이 데이터를 가져옵니다.
5. 사용자가 웹에서 이동할 때 브라우저는 [알고리즘을 사용](#floc-algorithm)하여 자신의 검색 기록과 가장 근접하게 일치하는 "집단 공간"의 영역을 주기적으로 계산합니다.

<figure style="text-align: center">{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/32k5jByqLrgwSMwb9mqo.png", alt="FLoC 서버에 의해 생성된 '탐색 기록 공간'의 다이어그램으로, 각각 집단 번호가 있는 여러 세그먼트를 보여줍니다.", width="400", height="359" %}<figcaption> FLoC 서비스는 "코호트 공간"을 수천 개의 세그먼트로 나눕니다(여기에는 몇 개만 표시됨).</figcaption></figure>

{% Aside %} 이 과정에서 사용자의 검색 기록은 FLoC 서비스나 제3자와 공유되지 않습니다. 브라우저의 집단은 사용자의 기기에서 브라우저에 의해 계산됩니다. FLoC 서비스는 사용자 데이터를 수집하거나 저장하지 않습니다. {% endAside %}

## 브라우저의 집단이 변경될 수 있습니까?

*예* ! 브라우저의 집단은 확실히 바뀔 수 있습니다! 당신은 매주 같은 웹사이트를 방문하지 않을 것이고, 당신의 브라우저 집단은 이를 반영할 것입니다.

집단은 사람들의 집합이 아니라 탐색 활동의 집합을 나타냅니다. 집단의 활동 특성은 일반적으로 시간이 지남에 따라 일관되며 집단은 유사한 최근 탐색 행동을 그룹화하기 때문에 광고 선택에 유용합니다. 개별 사용자의 브라우저는 브라우징 행동이 변경됨에 따라 집단 안팎으로 떠돌아다니게 됩니다. 처음에는 브라우저가 7일마다 해당 집단을 다시 계산할 것으로 예상합니다.

위의 예에서 Yoshi와 Alex의 브라우저 집단은 모두 1354입니다. 향후 Yoshi의 브라우저와 Alex의 브라우저는 관심사가 변경되면 다른 집단으로 이동할 수 있습니다. 아래 예에서 Yoshi의 브라우저는 집단 1101로 이동하고 Alex의 브라우저는 집단 1378로 이동합니다. 다른 사람들의 브라우저는 탐색 관심 분야가 변경됨에 따라 집단 안팎으로 이동합니다.

<figure style="text-align: center">{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/LMkb62V3iJTqkOrFACnM.png", alt="FLoC 서버에 의해 생성된 '탐색 기록 공간'의 다이어그램으로, 각각 코호트 번호가 있는 여러 브라우저 세그먼트를 보여줍니다. 다이어그램이 시간이 지나면서 탐색 관심사가 변경됨에 따라 Yoshi와 Alex가 한 집단에서 다른 집단으로 이동하는 것을 보여줍니다.", width="800", height="533" %}<figcaption> Yoshi와 Alex의 브라우저 집단은 관심사가 바뀌면 바뀔 수 있습니다.</figcaption></figure>

{% Aside %} 집단은 사람들의 그룹이 아니라 탐색 활동의 그룹을 정의합니다. 브라우저는 활동이 변경됨에 따라 코호트 안팎으로 이동합니다. {% endAside %}

## 브라우저는 해당 집단을 어떻게 처리합니까? {: #floc-algorithm }

위에서 설명한 것처럼 사용자의 브라우저는 집단에 대한 수학적 모델을 설명하는 FLoC 서비스에서 데이터를 가져옵니다. 즉, 모든 사용자의 탐색 활동을 나타내는 다차원 공간입니다. 그런 다음 브라우저는 알고리즘을 사용하여 이 "집단 공간"의 어느 영역(즉, 어느 집단)이 자신의 최근 탐색 동작과 가장 근접하게 일치하는지 알아냅니다.

## FLoC는 집단의 적절한 크기를 어떻게 계산합니까?

각 집단에는 수천 개의 브라우저가 있습니다.

집단 크기가 작을수록 광고를 개인화하는 데 더 유용할 수 있지만 사용자 추적을 중지할 가능성은 낮고 반대의 경우도 마찬가지입니다. 브라우저를 집단에 할당하는 메커니즘은 개인 정보 보호와 유용성 사이에서 균형을 유지해야 합니다. 프라이버시 샌드박스는 [k-익명성](https://en.wikipedia.org/wiki/K-anonymity)을 사용하여 사용자가 "군중 속에 숨을 수 있도록" 합니다. 집단은 최소 k명의 사용자가 공유하는 경우 k-익명성을 갖습니다. k 숫자가 높을수록 집단이 더 많이 개인 정보를 보호합니다.

## FLoC를 사용하여 민감한 카테고리를 기반으로 사람들을 그룹화할 수 있습니까?

FLoC 코호트 모델을 구성하는 데 사용되는 클러스터링 알고리즘은 카테고리가 민감한 이유를 배우지 않고 코호트가 민감한 카테고리와 상관 관계가 있는지 여부를 평가하도록 설계되었습니다. 인종, 성, 병력 등 민감한 카테고리를 노출할 수 있는 집단은 차단됩니다. 다시 말해, 해당 집단을 구성할 때 브라우저는 민감한 카테고리를 표시하지 않는 집단 중에서만 선택합니다.

## FLoC는 온라인에서 사람들을 분류하는 또 다른 방법입니까?

FLoC를 사용하면 사용자의 브라우저가 수천 개의 다른 사용자 브라우저와 함께 수천 개의 집단 중 하나에 속하게 됩니다. 타사 쿠키 및 기타 타겟팅 메커니즘과 달리 FLoC는 개별 사용자 ID가 아닌 사용자 브라우저가 속한 집단만 표시합니다. 다른 사람들은 집단 내에서 개인을 구별할 수 없습니다. 또한 브라우저 집단을 구성하는 데 사용되는 탐색 활동에 대한 정보는 브라우저나 장치에 로컬로 보관되며 다른 곳에 업로드되지 않습니다. 브라우저는 [차등 개인 정보 보호](https://en.wikipedia.org/wiki/Differential_privacy)와 같은 다른 익명화 방법을 추가로 활용할 수 있습니다.

## 웹사이트가 참여하고 정보를 공유해야 합니까?

웹사이트는 FLoC를 선택하거나 선택 해제할 수 있으므로 민감한 주제에 대한 사이트는 해당 사이트 방문이 FLoC 계산에 포함되는 것을 방지할 수 있습니다. 추가적인 보호조치로 FLoC 서비스의 분석은 해당 집단이 민감한 이유를 알지 못한 채 사용자에 대한 민감한 정보를 집단이 공개할 수 있는지 여부를 평가합니다. 집단이 민감한 범주의 사이트를 방문하는 일반 사용자 수보다 많을 수 있는 경우 해당 집단 전체가 제거됩니다. 부정적인 재정 상태와 정신 건강은 이 분석에서 다루는 민감한 범주에 속합니다.

웹사이트는 해당 페이지에 대한 [Permissions-Policy](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/) 헤더 `interest-cohort=()`를 설정하여 [FLoC 계산에서 페이지를 제외할 수 있습니다.](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/) 제외되지 않은 페이지의 경우 `document.interestCohort()`가 페이지에서 사용되면 페이지 방문이 브라우저의 FLoC 계산에 포함됩니다. 현재 [FLoC 원본 평가판](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561) 동안 Chrome에서 페이지가 [광고 또는 광고 관련 리소스를 로드](https://github.com/WICG/floc/issues/82)하는 것을 감지하면 페이지도 계산에 포함됩니다. ([Chromium의 광고 태그 지정은](https://chromium.googlesource.com/chromium/src/+/master/docs/ad_tagging.md) Chrome의 광고 감지 메커니즘이 작동하는 방식을 설명합니다.)

인트라넷 페이지와 같은 개인 IP 주소에서 제공되는 페이지는 FLoC 계산의 일부가 아닙니다.

## FLoC JavaScript API는 어떻게 작동합니까?

{% Aside %} Chrome 89에서 91까지 실행되었던 FLoC 초기 버전의 원본 평가판이 [종료되었습니다](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561) . {% endAside %}

FLoC API는 매우 간단합니다. 집단 `id`와 `version`을 제공하는 객체로 해소되는 promise를 반환하는 단일 메서드입니다.

```javascript
const { id, version } = await document.interestCohort();
console.log('FLoC ID:', id);
console.log('FLoC version:', version);
```

사용 가능한 집단 데이터는 다음과 같습니다.

```js
{
  id: "14159",
  version: "chrome.2.1"
}
```

`version` 값을 사용하면 FLoC를 사용하는 사이트에서 집단 ID가 참조하는 브라우저와 FLoC 모델을 알 수 있습니다. 아래에 설명된 대로 `document.interestCohort()`가 반환하는 promise는 `interest-cohort` 권한이 허용되지 않는 모든 프레임을 거부합니다.

## 웹사이트가 FLoC 계산에 포함되지 않도록 선택할 수 있습니까?

`interest-cohort` 권한 정책을 통해 사이트는 집단 계산을 위해 사용자의 사이트 목록에 포함되는 것을 원하지 않는다고 선언할 수 있습니다. 정책은 기본값으로`allow` 됩니다. `document.interestCohort()`에 의해 반환된 promise는 `interest-cohort` 권한이 허용되지 않는 모든 프레임을 거부합니다. 메인 프레임에 `interest-cohort` 권한이 없으면 페이지 방문은 관심 집단 계산에 포함되지 않습니다.

예를 들어 사이트는 다음 HTTP 응답 헤더를 전송하여 모든 FLoC 집단 계산에 포함되지 않도록 할 수 있습니다.

```text
  Permissions-Policy: interest-cohort=()
```

## 사용자가 사이트에서 브라우저의 FLoC 집단을 가져오는 것을 중지할 수 있습니까?

`chrome://settings/privacySandbox`에서 개인 정보 보호 샌드박스를 비활성화하면 브라우저는 JavaScript를 통해 요청할 때 사용자 집단을 제공하지 않습니다. `document.interestCohort()`에 의해 반환된 promise가 거부합니다.

## 제안을 하거나 피드백을 제공하려면 어떻게 해야 합니까?

API에 대한 의견이 있는 경우 [FLoC Explainer](https://github.com/WICG/floc/issues/new) 저장소에 [문제를 생성](https://github.com/WICG/floc/issues/new)하십시오.

## 더 찾아 보기

- [프라이버시 샌드박스 자세히 알아보기](/digging-into-the-privacy-sandbox/)
- [FLoC Explainer](https://github.com/WICG/floc)
- [FLoC 원본 평가판 및 클러스터링](https://sites.google.com/a/chromium.org/dev/Home/chromium-privacy/privacy-sandbox/floc)
- [FLoC API를 위한 집단 평가 알고리즘](https://github.com/google/ads-privacy/blob/master/proposals/FLoC/README.md)

---

[Unsplash](https://unsplash.com/photos/I5AYxsxSuVA)에 있는 [Rhys Kentish](https://unsplash.com/@rhyskentish)의 사진.
