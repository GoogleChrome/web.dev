---
layout: post
title: 프로그레시브 웹 앱이 비즈니스 성공을 주도하는 방법
authors:
  - sfourault
date: 2020-05-20
updated: 2020-05-20
description: PWA를 위한 견고한 비즈니스 사례를 구축하십시오. 언제 투자해야 하는지, 그리고 그 성공을 어떻게 측정할 수 있는지 알아보십시오.
tags:
  - progressive-web-apps
---

Progressive Web Apps는 웹 사이트를 현대화하고 사용자의 새로운 기대에 적응하기 위한 많은 회사의 로드맵에 있습니다. 모든 새로운 개념 및 기술 기능과 마찬가지로, 그들은 다음과 같은 질문을 제기합니다. 고객이 원하는 것, 이것이 내 비즈니스를 얼마나 성장시킬 것인지, 기술적으로 실현 가능한 것은 무엇입니까?

{% Img src="image/admin/o70RxMcAQVPrjxH34a8r.jpg", alt="이해관계자 식별", width="800", height="254" %}

디지털 전략을 수립하기 위해 여러 이해 관계자가 참여하는 경우가 많습니다. 제품 관리자와 CMO는 각 기능의 비즈니스 영향에 대한 공동 소유자이고, CTO는 기술의 실현 가능성과 신뢰성을 평가하고, UX 연구원은 기능이 실제 응답하는지 확인합니다. 고객 문제.

이 기사는 이 세 가지 질문에 답하고 PWA 프로젝트를 구성하는 데 도움이 되는 것을 목표로 합니다. 고객 요구 사항에서 시작하여 이를 PWA 기능으로 변환하고 각 기능이 테이블에 가져오는 비즈니스 영향을 측정하는 데 중점을 둡니다.

## 고객의 요구사항을 해결하는 PWA {: #solve-customer-needs }

제품을 만들 때 Google에서 따르고 싶은 한 가지 규칙은 "[사용자에게 초점을 맞추면 나머지는 모두 따를 것](https://www.google.com/about/philosophy.html)"입니다. *사용자 우선* 생각: 고객의 요구 사항은 무엇이며 PWA는 어떻게 제공합니까?

{% Img src="image/admin/TcmXmWb5mSUqal98NIAH.jpg", alt="고객 요구 사항 파악", width="800", height="262" %}

사용자 조사를 수행할 때 몇 가지 흥미로운 패턴을 찾습니다.

- 사용자는 모바일에서 지연과 불안정성을 싫어합니다. 모바일 지연으로 인한 스트레스 수준은 [공포 영화를 보는 것과 비슷합니다](https://blog.hubspot.com/marketing/mobile-website-load-faster).
- [스마트폰 사용자의 50%는 앱 다운로드를 원하지](https://www.thinkwithgoogle.com/data/smartphone-user-mobile-shopping-preferences/) 않기 때문에 검색하거나 쇼핑할 때 회사의 모바일 사이트를 사용할 가능성이 더 큽니다.
- 앱을 제거하는 가장 큰 이유 중 하나는[제한된 저장 공간입니다](https://www.thinkwithgoogle.com/data/why-users-uninstall-travel-apps/) (설치된 PWA는 일반적으로 1MB 미만 사용).
- [스마트폰 사용자는 제품에 대한 관련 추천](https://www.thinkwithgoogle.com/data/smartphone-mobile-app-and-site-purchase-data/)을 제공하는 모바일 사이트에서 구매할 가능성이 더 높으며 스마트폰 사용자의 85%는 [모바일 알림이 유용](https://www.thinkwithgoogle.com/data/smartphone-user-notification-preferences/)하다고 말합니다.

이러한 관찰에 따르면 고객은 빠르고 설치 가능하며 신뢰할 수 있고 매력적인(FIRE) 경험을 선호한다는 사실을 알게 되었습니다!

## 최신 웹 기능을 활용하는 PWA {: #modern-capabilities }

PWA는 사이트를 빠르고 설치 가능하며 안정적이고 매력적으로 만들어 고객의 요구 사항을 충족하는 것을 목표로 하는 일련의 모범 사례 및 최신 웹 API를 제공합니다.

예를 들어 서비스 워커를 [사용하여 리소스](/service-workers-cache-storage/)를 캐시하고 [예측 프리페치](/precache-with-workbox/)를 수행하면 사이트가 더 빠르고 안정적으로 만들어집니다. 사이트를 설치 가능하게 만들면 고객이 홈 화면이나 앱 실행기에서 직접 액세스할 수 있는 쉬운 방법을 제공합니다. 그리고 [웹 푸시 알림](https://developer.mozilla.org/docs/Web/API/Push_API/Best_Practices)과 같은 새로운 API를 사용하면 충성도를 생성하기 위해 개인화된 콘텐츠로 사용자를 쉽게 다시 참여시킬 수 있습니다.

{% Img src="image/admin/rP0eNCflNYOhzjPi1Lq5.jpg", alt="새로운 기능으로 사용자 경험 개선", width="800", height="393" %}

## 비즈니스 영향 이해 {: #business-impact }

비즈니스 성공의 정의는 귀하의 활동에 따라 여러 가지가 될 수 있습니다.

- 서비스에 더 많은 시간을 보내는 사용자
- 리드의 이탈률 감소
- 개선된 전환율
- 재방문자 증가

대부분의 PWA 프로젝트는 더 높은 모바일 전환율로 이어지며 수많은 [PWA 사례 연구](https://www.pwastats.com/)에서 더 많은 것을 배울 수 있습니다. 목표에 따라 비즈니스에 더 적합한 PWA의 일부 측면에 우선 순위를 지정할 수 있으며 완전히 문제가 없습니다. PWA 기능은 선별하여 별도로 실행할 수 있습니다.

이러한 각각의 뛰어난 F.I.R.E 기능이 비즈니스에 미치는 영향을 측정해 보겠습니다.

### 빠른 웹사이트의 비즈니스 영향 {: #impact-fast }

[Deloitte Digital](https://www2.deloitte.com/ie/en/pages/consulting/articles/milliseconds-make-millions.html)의 최근 연구에 따르면 페이지 속도는 비즈니스 지표에 상당한 영향을 미칩니다.

모든 사용자의 중요한 사용자 여정을 최적화하기 위해 사이트 속도를 최적화하기 위해 할 수 있는 일은 많습니다. 어디서부터 시작해야 할지 모르겠다면 [빠른](/fast/) 섹션을 살펴보고 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)를 사용하여 가장 중요한 수정 사항의 우선 순위를 지정하십시오.

속도 최적화 작업을 할 때 진행 상황을 모니터링하기 위해 적절한 도구와 측정항목을 사용하여 사이트 속도를 자주 측정하십시오. 예를 들어 [Lighthouse를](https://developer.chrome.com/docs/lighthouse/overview/) 사용하여 측정항목을 측정하고 ["좋은" 핵심 Web Vitals 점수](/vitals/#core-web-vitals)를 갖는 것과 같은 명확한 목표를 수정하고 [성능 예산을 빌드 프로세스에 통합](/incorporate-performance-budgets-into-your-build-tools/)합니다. 일일 측정값과 ["속도의 가치" 방법론](/value-of-speed/) 덕분에 증분 속도 변경의 영향을 분리하고 작업으로 생성된 추가 수익을 계산할 수 있습니다.

{% Img src="image/admin/yyRfQaDL3NcGhB0f79RN.jpg", alt="속도의 가치를 측정하고 이를 전환과 연관시키십시오", width="800", height="306" %}

Ebay는 [속도를 2019년 회사 목표](/shopping-for-speed-on-ebay/)로 삼았습니다. 그들은 성능 예산, 임계 경로 최적화, 예측 프리페칭과 같은 기술을 사용했습니다. 그들은 검색 페이지 로딩 시간이 100밀리초 개선될 때마다 카드에 추가 횟수가 0.5% 증가한다는 결론을 내렸습니다.

{% Img src="image/admin/Qq3wo5UOqzC1ugnTzdqT.jpg", alt="로드 시간이 100ms 개선되어 eBay의 장바구니에 담기 수가 0.5% 증가했습니다.", width="800", height="184" %}

### 설치 가능한 웹사이트의 비즈니스 영향 {: #impact-installable }

사용자가 PWA를 설치하기를 원하는 이유는 무엇입니까? 귀하의 사이트를 더 쉽게 방문할 수 있도록 합니다. Android 앱 설치가 최소 3단계(Play 스토어로 리디렉션, 다운로드, 깔때기 상단에서 Android 앱 다시 실행)를 추가하는 경우 PWA 설치는 클릭 한 번으로 원활하게 완료되며 사용자가 다른 곳으로 이동하지 않습니다. 현재 전환 유입경로

{% Img src="image/admin/u1jcKrBBOHEzSz3SqhEB.jpg", alt="설치 환경이 원활해야 합니다", width="800", height="239" %}

일단 설치되면 사용자는 홈 화면의 아이콘에서 한 번의 클릭으로 실행하거나 앱 간에 전환할 때 앱 트레이에서 보거나 앱 검색 결과를 통해 찾을 수 있습니다. 우리는 이 앱을 동적 Discover-Launch-Switch라고 부르며 PWA를 설치 가능하게 만드는 것이 액세스 잠금을 해제하는 열쇠입니다.

PWA는 장치의 친숙한 검색 및 실행 표면에서 액세스할 수 있을 뿐만 아니라 브라우저와 별도의 독립 실행형 환경에서 플랫폼별 앱과 똑같이 실행됩니다. 또한 앱 전환기 및 설정과 같은 OS 수준 장치 서비스의 이점을 누릴 수 있습니다.

PWA를 설치한 사용자는 가장 참여도가 높은 사용자일 가능성이 높으며, 재방문 횟수가 많고 사이트에 머문 시간이 길며 전환율이 더 높으며 종종 모바일 장치의 플랫폼별 앱 사용자와 동등하게 일반 방문자보다 더 나은 참여 지표가 있습니다.

PWA를 설치 가능하게 하려면 [기본 기준](/install-criteria/)을 충족해야 합니다. 이러한 기준을 충족하면 iOS를 포함한 [데스크톱 및 모바일 사용자 환경 내에서 설치](/promote-install/)를 홍보할 수 있습니다.

{% Img src="image/admin/5sH5YX7kFrwv4f6duqVf.jpg", alt="PWA는 어디에나 설치할 수 있습니다.", width="800", height="227" %}

PWA 설치를 홍보하기 시작했다면 PWA를 설치하는 사용자 수와 PWA 사용 방법을 측정해야 합니다.

사이트를 설치하는 사용자 수를 최대화하려면 [다양한](https://pwa-book.awwwards.com/chapter-4) 프로모션 메시지(예: "1초 안에 설치" 또는 "주문을 따르기 위한 바로 가기 추가"), 다양한 게재위치(헤더 배너, 인피드)를 테스트할 수 있습니다. , 유입경로의 다른 단계(방문한 두 번째 페이지 또는 예약 후)에서 제안해 보세요.

사용자가 떠나는 위치와 유지율을 높이는 방법을 이해하기 위해 설치 유입경로를 4가지 방법으로 [측정](https://pwa-book.awwwards.com/chapter-8)할 수 있습니다.

- 설치할 수 있는 사용자 수
- UI 설치 프롬프트를 클릭한 사용자 수
- 설치를 수락 및 거부한 사용자 수
- 성공적으로 설치한 사용자 수

모든 사용자에게 PWA 설치를 홍보하거나 소수의 사용자에게만 실험하여 보다 신중한 접근 방식을 사용할 수 있습니다.

며칠 또는 몇 주가 지나면 비즈니스에 미치는 영향을 측정할 데이터가 이미 확보되어 있을 것입니다. 설치된 바로가기에서 오는 사람들의 행동은 무엇입니까? 그들은 더 많이 참여하고 더 많이 전환합니까?

PWA를 설치한 사용자를 분류하려면 [`appinstalled` 이벤트를](/customize-install/#detect-install) 추적하고 JavaScript를 사용하여 [사용자가 독립 실행형 모드](/customize-install/#detect-launch-type)(설치된 PWA 사용을 나타냄)인지 확인하십시오. 그런 다음 이를 분석 추적을 위한 변수 또는 차원으로 사용합니다.

{% Img src="image/admin/H2U4jKTmATNzVJQ3WNCO.jpg", alt="설치 가치 측정", width="800", height="253" %}

Weekendesk의 [사례 연구](https://www.thinkwithgoogle.com/_qs/documents/8971/Weekendesk_PWA_-_EXTERNAL_CASE_STUDY.pdf)는 흥미롭습니다. 그들은 설치율을 최대화하기 위해 방문한 두 번째 페이지에 설치를 제안하고 홈 화면의 아이콘을 통해 다시 오는 고객이 숙박을 예약할 가능성이 두 배 이상 높다는 것을 관찰했습니다.

{% Img src="image/admin/eR23C2o1adHq5tATNw34.jpg", alt="설치된 사용자의 전환율이 2.5배 더 높았습니다.", width="800", height="201" %}

설치는 사람들이 사이트를 다시 방문하게 하고 고객 충성도를 높이는 좋은 방법입니다. 프리미엄 사용자를 위한 경험을 개인화할 수도 있습니다.

플랫폼별 앱이 이미 있더라도 먼저 테스트하여 앱을 제안한 다음 앱 설치 배너를 거부하거나 참여하지 않은 사람들을 위해 나중에 PWA를 푸시할 수 있습니다. "반 참여" 사용자 중 일부는 앱 스토어 기반 설치 임계값을 충족하지 못할 수 있습니다. 이 집단은 종종 더 가볍고 마찰이 적은 것으로 인식되는 PWA 설치 가능성으로 해결할 수 있습니다.

{% Img src="image/admin/iNQalNPhjdBueuqPHiad.jpg", alt="PWA는 반 참여 사용자에게 도달할 수 있습니다", width="800", height="229" %}

### 신뢰할 수 있는 웹사이트의 비즈니스 영향 {: #impact-reliable }

사용자가 오프라인일 때 제공되는 크롬 다이노 게임은 한 달에 [2억 7천만 번](https://www.blog.google/products/chrome/chrome-dino/) 이상 플레이됩니다. 이 인상적인 수치는 네트워크 안정성이 특히 인도, 브라질, 멕시코 또는 인도네시아와 같이 신뢰할 수 없거나 값비싼 모바일 데이터가 있는 시장에서 상당한 기회임을 보여줍니다.

앱 스토어에서 설치된 앱이 실행되면 사용자는 인터넷 연결 여부에 관계없이 앱이 열리길 기대합니다. 프로그레시브 웹 앱도 다르지 않아야 합니다.

최소한 네트워크 연결 없이는 앱을 사용할 수 없음을 사용자에게 알리는 간단한 오프라인 페이지가 제공되어야 합니다. [그런 다음 오프라인 상태에서 의미가 있는 몇 가지 기능](https://pwa-book.awwwards.com/chapter-6)을 제공하여 경험을 한 단계 더 발전시키는 것을 고려해 보세요. 예를 들어 티켓이나 탑승권, 오프라인 위시리스트, 콜센터 연락처 정보, 사용자가 최근에 본 기사 또는 레시피 등에 대한 액세스를 제공할 수 있습니다.

{% Img src="image/admin/ubglZLCoddAfB5cl8JSz.jpg", alt="오프라인에서도 도움이 됩니다", width="800", height="243" %}

[신뢰할 수 있는 사용자 경험](https://pwa-book.awwwards.com/chapter-6)을 구현했다면 이를 측정할 수 있습니다. 얼마나 많은 사용자가 어느 지역에서 오프라인으로 전환하고 있으며 네트워크가 복구되었을 때 웹사이트에 남아 있습니까?

[오프라인 사용량은 사용자가 오프라인 또는 온라인 상태](https://pwa-book.awwwards.com/chapter-8)가 될 때 분석 핑을 기록하여 측정할 수 있습니다. 네트워크가 복구된 후 얼마나 많은 사용자가 웹사이트를 계속 탐색하는지 알려줍니다.

{% Img src="image/admin/UfjYsWQWJjVIk2sp5bnE.jpg", alt="Trivago는 온라인으로 돌아온 사용자의 67%가 탐색을 계속하는 것으로 확인했습니다", width="800", height="272" %}

[Trivago 사례 연구](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/case-studies/trivago-embrace-progressive-web-apps-as-the-future-of-mobile/)는 이것이 비즈니스 목표에 어떤 영향을 미칠 수 있는지 보여줍니다. 오프라인 기간에 세션이 중단된 사용자의 경우(사용자의 약 3%), 온라인으로 돌아온 사용자의 67%가 사이트를 계속 탐색했습니다.

### 매력적인 웹사이트의 비즈니스 영향 {: #impact-engaging }

웹 푸시 알림을 통해 사용자는 자신이 좋아하는 사이트에서 시기적절한 업데이트를 선택하고 관련성 있는 맞춤형 콘텐츠로 사용자를 효과적으로 재참여시킬 수 있습니다.

하지만 조심하세요. 혜택을 노출하지 않고 처음 도착했을 때 웹 알림에 등록하도록 사용자에게 요청하면 스팸으로 인식되어 경험에 부정적인 영향을 미칠 수 있습니다. [알림을 요청할 때 모범 사례](https://developers.google.com/web/fundamentals/push-notifications/permission-ux)를 따르고 기차 지연, 가격 추적, 품절 제품 등과 같은 관련 사용을 통해 수락을 유도하십시오.

기술적으로 [웹상의 푸시 알림](https://developers.google.com/web/fundamentals/push-notifications/)은 서비스 워커 덕분에 백그라운드에서 실행되며 캠페인 관리를 위해 구축된 시스템(예: Firebase)에서 전송되는 경우가 많습니다. 이 기능은 모바일(Android) 및 데스크톱 사용자에게 큰 비즈니스 가치를 제공합니다. 즉, 반복 방문을 증가시키고 결과적으로 판매 및 전환을 증가시킵니다.

푸시 캠페인의 효과를 측정하려면 전체 유입경로를 측정해야 합니다.

- 푸시 알림을 받을 수 있는 사용자 수
- 맞춤 알림 UI 프롬프트를 클릭한 사용자 수
- 푸시 알림 권한을 부여한 사용자 수
- 푸시 알림을 받는 사용자 수
- 알림에 참여하는 사용자 수
- 알림에서 오는 사용자의 전환 및 참여

{% Img src="image/admin/UpzfxBDi3e66cZ9gzkkS.jpg", alt="웹 푸시 알림 값 측정", width="800", height="255" %}

웹 푸시 알림에 대한 훌륭한 사례 연구가 많이 있습니다. Carrefour는 버려진 카트로 사용자를 다시 참여시켜 [전환율을 4.5배로 늘렸습니다.](https://useinsider.com/case-studies/carrefour/)

## PWA의 P: 점진적 출시, 기능별 기능 {: #feature-by-feature }

PWA는 사용자가 Android/iOS/데스크톱 앱에서 좋아하는 모든 사용자 친화적인 기능과 결합된 방대한 웹 도달 범위의 이점을 누리는 최신 웹사이트입니다. 비즈니스 특성 및 우선 순위에 따라 독립적으로 구현할 수 있는 일련의 모범 사례 및 최신 웹 API를 활용합니다.

{% Img src="image/admin/7g1j2z7h5m9QSHQhHceM.jpg", alt="PWA를 점진적으로 실행", width="800", height="253" %}

웹사이트의 현대화를 가속화하고 실제 PWA로 만들려면 민첩하게 기능별로 시작하는 것이 좋습니다. 먼저 사용자와 함께 어떤 기능이 가장 큰 가치를 제공하는지 조사한 다음 디자이너와 개발자에게 제공하고 마지막으로 PWA가 생성한 추가 비용을 정확히 측정하는 것을 잊지 마십시오.
