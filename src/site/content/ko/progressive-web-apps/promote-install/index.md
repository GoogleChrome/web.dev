---
layout: post
title: PWA 설치 촉진 패턴
authors:
  - pjmclachlan
  - mustafakurtuldu
date: 2019-06-04
updated: 2020-06-17
description: PWA 설치를 촉진하고 모범 사례를 홍보하는 방법.
tags:
  - progressive-web-apps
feedback:
  - api
---

PWA(Progressive Web App)를 설치하면 사용자가 더 쉽게 찾고 사용할 수 있습니다. 브라우저 홍보를 사용하더라도 일부 사용자는 자신이 PWA를 설치할 수 있다는 사실을 인식하지 못하므로 PWA를 홍보하고 설치를 활성화하는 데 사용할 수 있는 인앱 경험을 제공하는 것이 도움이 될 수 있습니다.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PtJp54jasjOYyh9Soqzu.png", alt="PWA의 간단한 설치 버튼 스크린샷", width="800", height="368" %}<figcaption> PWA 내에서 제공되는 간단한 설치 버튼입니다.</figcaption></figure>

이 목록이 완전한 것은 아니지만 PWA 설치를 촉진하는 다양한 방법을 위한 출발점을 제공합니다. 사용하는 *패턴*에 관계 없이 [나만의 인앱 설치 경험을 제공하는 방법](/customize-install/)에 나온 대로 설치 흐름을 트리거하는 같은 코드로 이어집니다.

<div class="w-clearfix"> </div>

## PWA 설치 홍보 모범 사례 {: #best-practices }

사이트에서 사용하는 홍보 패턴에 관계없이 적용되는 몇 가지 모범 사례가 있습니다.

- 사용자 여정의 흐름을 벗어나 프로모션을 유지하세요. 예를 들어, PWA 로그인 페이지에서 클릭 유도문안을 로그인 양식과 제출 버튼 아래에 두십시오. 홍보 패턴이 사용자에게 방해가 되도록 사용하면 PWA의 사용성을 감소시키고 참여 지표에 부정적인 영향을 미칩니다.
- 홍보를 취소하거나 거부할 수 있는 기능을 포함합니다. 사용자가 이 작업을 수행하는 경우 사용자의 기본 설정을 기억하고 로그인하거나 구매를 완료한 경우와 같이 콘텐츠와 사용자의 관계에 변경 사항이 있는 경우에만 다시 확인하십시오.
- PWA의 다른 부분에서 이러한 기술 중 하나 이상을 결합하되 설치 홍보로 사용자를 압도하거나 짜증나게 하지 않도록 주의하십시오.
- [`beforeinstallprompt` 이벤트](/customize-install/#beforeinstallprompt)가 발생한 **후**에 만 프로모션을 표시합니다.

## 자동 브라우저 홍보 {: #browser-promotion }

[특정 기준](/install-criteria/) 이 충족되면 대부분의 브라우저에서 사용자에게 PWA를 설치할 수 있음을 자동으로 표시합니다. 예를 들어 데스크톱 Chrome은 검색주소창에 설치 버튼을 표시합니다.

<div class="switcher">
  <figure id="browser-install-promo">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zIfRss5zOrZ49c4VdJ52.png", alt="설치 표시기가 표시된 검색주소창의 스크린샷.", width="800", height="307" %}<figcaption> 브라우저 제공 설치 홍보(데스크톱)</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kRjcsxlHDZa9Nqg2Fpei.png", alt="브라우저 제공 설치 홍보 스크린샷", width="800", height="307" %}<figcaption> 브라우저 제공 설치 홍보(모바일)</figcaption></figure>
</div>

<div class="w-clearfix"> </div>

Android용 Chrome은 사용자에게 미니 정보 표시줄을 표시하지만 이는 `beforeinstallprompt` 이벤트에서 `preventDefault()`을 호출하면 막을 수 있습니다. `preventDefault()`를 호출하지 않으면 사용자가 사이트를 처음 방문할 때 배너가 표시되고 Android에서 설치 가능성 기준을 충족한 다음 약 90일 후에 다시 표시됩니다.

## 애플리케이션 UI 홍보 패턴 {: #app-ui-patterns }

애플리케이션 UI 홍보 패턴은 거의 모든 종류의 PWA에 사용할 수 있으며 사이트 탐색 및 배너와 같은 애플리케이션 UI에 표시됩니다. 다른 유형의 홍보 패턴과 마찬가지로 사용자 여정의 중단을 최소화하려면 사용자의 컨텍스트를 인식하는 것이 중요합니다.

홍보 UI를 실행할 때를 고려한 사이트는 더 많은 설치를 달성하고 설치에 관심이 없는 사용자의 여정을 방해하지 않습니다.

<div class="w-clearfix"> </div>

### 간단한 설치 버튼 {: #simple-button }

가장 간단한 UX는 웹 콘텐츠의 적절한 위치에 '설치' 또는 '앱 가져오기' 버튼을 포함하는 것입니다. 버튼이 다른 중요한 기능을 차단하지 않고 애플리케이션을 통해 사용자의 여정을 방해하지 않는지 확인합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kv0x9hxZ0TLVaIiP4Bqx.png", alt="사용자 지정 설치 버튼", width="800", height="448" %} <figcaption> 간단한 설치 버튼 </figcaption></figure>

<div class="w-clearfix"> </div>

### 고정 헤더 {: #header }

이것은 사이트 헤더의 일부인 설치 버튼입니다. 다른 헤더 콘텐츠에는 종종 로고 및 햄버거 메뉴와 같은 사이트 브랜딩이 포함됩니다. 헤더는 사이트의 기능과 사용자 요구에 따라 `position:fixed`이거나 아닐 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GPJdkXcpNLR30r2zo7RR.png", alt="헤더의 사용자 지정 설치 버튼", width="800", height="448" %}<figcaption> 헤더의 사용자 정의 설치 버튼</figcaption></figure>

적절하게 사용할 경우 사이트 헤더에서 PWA 설치를 홍보하는 것은 가장 충성도가 높은 고객이 귀하의 경험으로 더 쉽게 돌아올 수 있도록 하는 좋은 방법입니다. PWA 헤더의 픽셀은 소중하므로 설치 클릭 유도문안의 크기가 적절하고 다른 가능한 헤더 콘텐츠보다 중요하며 방해가 되지 않는지 확인하십시오.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/L01AoSoy7LNk1ttMMax0.png", alt="헤더의 사용자 지정 설치 버튼", width="800", height="430" %} <figcaption> 헤더의 사용자 정의 설치 버튼</figcaption></figure>

다음을 확인하십시오.

- `beforeinstallprompt`가 실행되지 않는 한 설치 버튼을 표시하지 마십시오.
- 사용자를 위해 설치된 사용 사례의 가치를 평가하십시오. 혜택을 받을 가능성이 있는 사용자에게만 프로모션을 제공하려면 선택적 타겟팅을 고려하십시오.
- 소중한 헤더 공간을 효율적으로 사용하십시오. 헤더에서 사용자에게 제공하는 데 도움이 될 다른 것이 무엇인지 고려하고 다른 옵션에 비해 설치 프로모션의 우선 순위를 평가하십시오.

<div class="w-clearfix"> </div>

### 탐색 메뉴 {: #nav }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aT7NHi8lbsZW8TOm3Gaw.png", alt="탐색 메뉴의 사용자 지정 설치 버튼", width="800", height="1117" %}<figcaption> 슬라이드 아웃 탐색 메뉴에 설치 버튼/프로모션을 추가합니다.</figcaption></figure>

탐색 메뉴는 메뉴를 여는 사용자가 경험에 대한 참여를 표시하기 때문에 앱 설치를 홍보하기에 좋은 장소입니다.

다음을 확인하십시오.

- 중요한 탐색 콘텐츠를 방해하지 마십시오. PWA 설치 홍보를 다른 메뉴 항목 아래에 두십시오.
- 사용자가 PWA를 설치하면 이점을 얻을 수 있는 이유에 대한 관련성 있는 짧은 프레젠테이션을 제공합니다.

<div class="w-clearfix"> </div>

### 방문 페이지 {: #landing }

랜딩 페이지의 목적은 제품과 서비스를 홍보하는 것이므로 PWA 설치의 이점을 홍보하는 데 적합합니다.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7q09M12HFxgIiWhKPGma.png", alt="방문 페이지의 사용자 지정 설치 프롬프트", width="800", height="1117" %}<figcaption> 방문 페이지의 사용자 지정 설치 프롬프트</figcaption></figure>

먼저 사이트의 가치 제안을 설명한 다음 방문자에게 설치를 통해 얻을 수 있는 이점을 알립니다.

다음을 확인하십시오.

- 방문자에게 가장 중요한 기능을 홍보하고 방문자를 방문 페이지로 유도했을 수 있는 키워드를 강조합니다.
- 눈길을 사로잡는 설치 홍보와 클릭 유도문안을 만들되 가치 제안을 명확하게 한 후에만 하십시오. 이것은 결국 귀하의 방문 페이지입니다.
- 사용자가 대부분의 시간을 보내는 앱 부분에 설치 홍보를 추가하는 것이 좋습니다.

<div class="w-clearfix"> </div>

### 배너 설치 {: #banner }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7fLCQQhdk2OzrQD3Xh4E.png", alt="페이지 상단에 배너를 맞춤 설치합니다.", width="800", height="1000" %}<figcaption> 페이지 상단의 닫을 수 있는 배너입니다.</figcaption></figure>

대부분의 사용자는 모바일 환경에서 설치 배너를 접하고 배너가 제공하는 상호 작용에 익숙합니다. 배너는 사용자에게 방해가 될 수 있으므로 신중하게 사용해야 합니다.

다음을 확인하십시오.

- 배너를 표시하기 전에 사용자가 귀하의 사이트에 관심을 보일 때까지 기다리십시오. 사용자가 배너를 닫은 경우 사용자가 전자 상거래 사이트에서 구매하거나 계정에 가입하는 것과 같이 콘텐츠에 대한 더 높은 참여 수준을 나타내는 전환 이벤트를 트리거하지 않는 한 배너를 다시 표시하지 마십시오.
- 배너에 PWA를 설치하는 것의 가치에 대한 간략한 설명을 제공하십시오. 예를 들어 PWA 설치는 사용자 장치의 저장소를 거의 사용하지 않거나 스토어 리디렉션 없이 즉시 설치된다는 점을 언급하여 iOS/Android 앱과 구별할 수 있습니다.

<div class="w-clearfix"> </div>

### 임시 UI {: #temporary-ui }

[스낵바](https://material.io/components/snackbars/) 디자인 패턴과 같은 임시 UI는 사용자에게 알리고 쉽게 작업을 완료할 수 있도록 합니다. 이 경우 앱을 설치하십시오. 이러한 종류의 UI 패턴은 적절하게 사용하면 사용자 흐름을 방해하지 않으며 일반적으로 사용자가 무시하면 자동으로 해제됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6DySYRtyegazEfMcWXQL.png", alt="스낵바로 배너를 맞춤 설치합니다.", width="800", height="448" %}<figcaption> PWA를 설치할 수 있음을 나타내는 닫을 수 있는 스낵바입니다.</figcaption></figure>

몇 번의 참여, 앱과의 상호 작용 후에 스낵바를 표시합니다. 페이지 로드 시 또는 컨텍스트 외부에 나타나면 쉽게 놓치거나 인지 과부하로 이어질 수 있습니다. 이런 일이 발생하면 사용자는 단순히 보이는 모든 것을 무시할 것입니다. 그리고 사이트의 신규 사용자가 PWA를 설치할 준비가 되지 않았을 수 있음을 기억하십시오. 따라서 이 패턴을 사용하기 전에 사용자로부터 강력한 관심 신호(예: 반복 방문, 사용자 로그인 또는 유사한 전환 이벤트)가 있을 때까지 기다리는 것이 가장 좋습니다.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/d8dwdIe1rYSgd0JdCGtt.png", alt="배너를 스낵바로 맞춤 설치합니다.", width="800", height="424" %}<figcaption> PWA를 설치할 수 있음을 나타내는 닫을 수 있는 스낵바입니다.</figcaption></figure>

다음을 확인하십시오.

- 사용자가 보고 반응할 수 있는 충분한 시간을 주고 방해가 되지 않도록 4~7초 동안 스낵바를 표시합니다.
- 배너 등과 같은 다른 임시 UI 위에 표시되지 않도록 합니다.
- 이 패턴을 사용하기 전에 사용자로부터 강력한 관심 신호(예: 반복 방문, 사용자 로그인 또는 유사한 전환 이벤트)가 나타날 때까지 기다리세요.

<div class="w-clearfix"> </div>

## 전환 후

사용자 전환 이벤트 직후(예: 전자 상거래 사이트에서 구매한 후)는 PWA 설치를 홍보할 수 있는 좋은 기회입니다. 사용자는 분명히 귀하의 콘텐츠에 참여하고 있으며 전환은 종종 사용자가 귀하의 서비스에 다시 참여할 것이라는 신호입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/DrepSPFAm64d5cvTFoXe.png", alt="전환 후 설치 홍보 스크린샷", width="800", height="448" %}<figcaption> 사용자가 구매를 완료한 후 프로모션을 설치합니다.</figcaption></figure>

### 여행 예약 또는 체크아웃 {: #journey }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bOYZM2UiWK5itVSpjKWO.png", alt="사용자 여정 후 홍보를 설치하세요.", width="800", height="1419" %}<figcaption> 사용자 여정 후 홍보를 설치하세요.</figcaption></figure>

일반적인 예약 또는 결제 흐름과 같이 순차적인 여정 중 또는 이후에 설치 홍보를 표시합니다. 사용자가 여정을 완료한 후 홍보를 표시하는 경우 여정이 완료된 후 홍보를 더 눈에 띄게 만들 수 있습니다.

다음을 확인하십시오.

- 관련 클릭 유도문안을 포함합니다. 앱을 설치하면 어떤 사용자가 혜택을 볼 수 있으며 그 이유는 무엇입니까? 현재 진행 중인 여정과 어떤 관련이 있습니까?
- 브랜드에 설치된 앱 사용자를 위한 고유한 제안이 있는 경우 여기에 언급해야 합니다.
- 홍보가 여정의 다음 단계에 방해가 되지 않도록 하십시오. 그렇지 않으면 여정 완료율에 부정적인 영향을 미칠 수 있습니다. 위의 전자 상거래 예에서 체크아웃에 대한 주요 클릭 유도문안이 앱 설치 홍보 위에 있는 방법을 확인하십시오.

<div class="w-clearfix"> </div>

### 가입, 로그인 또는 로그아웃 흐름 {: #sign-up}

이 프로모션은 프로모션 카드가 더 눈에 띄게 될 수 있는 [여행](#journey) 프로모션 패턴의 특별한 경우입니다.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PQXqSqtwRSwyELdJMjtd.png", alt="가입 페이지의 사용자 지정 설치 버튼입니다.", width="800", height="1117" %}<figcaption> 가입 페이지의 사용자 지정 설치 버튼.</figcaption></figure>

이러한 페이지는 일반적으로 PWA의 가치 제안이 이미 확립된 참여 사용자만 볼 수 있습니다. 또한 이러한 페이지에 배치할 다른 유용한 콘텐츠가 많지 않은 경우가 많습니다. 결과적으로 방해가 되지 않는 한 더 큰 클릭 유도문안을 만드는 것이 덜 방해가 됩니다.

다음을 확인하십시오.

- 가입 양식 내에서 사용자의 여정을 방해하지 마십시오. 다단계 프로세스인 경우 사용자가 여정을 완료할 때까지 기다리는 것이 좋습니다.
- 가입한 사용자와 가장 관련성이 높은 기능을 홍보합니다.
- 앱의 로그인 영역 내에 추가 설치 홍보를 추가하는 것을 고려하십시오.

<div class="w-clearfix"> </div>

## 인라인 프로모션 패턴

인라인 홍보 기술은 홍보와 사이트 콘텐츠를 결합합니다. 이것은 종종 절충점이 있는 애플리케이션 UI 내에서의 홍보보다 더 섬세합니다. 관심 있는 사용자가 알 수 있을 만큼 홍보가 눈에 띄기를 원하지만 사용자 경험의 품질을 떨어뜨리는 정도는 아닙니다.

### 인피드 {: #in-feed }

인피드 설치 프로모션은 PWA의 뉴스 기사 또는 기타 정보 카드 목록 사이에 나타납니다.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/LS5qSE2vicfjRBBkA47a.png", alt="콘텐츠 피드 내 홍보 설치", width="800", height="1000" %}<figcaption> 콘텐츠 피드 내에 홍보를 설치합니다.</figcaption></figure>

여러분의 목표는 사용자이 즐기는 콘텐츠에 더 편리하게 액세스하는 방법을 보여주는 것입니다. 사용자에게 도움이 될 기능을 홍보하는 데 중점을 둡니다.

다음을 확인하십시오.

- 사용자들이 짜증내지 않도록 위해 홍보의 빈도를 제한하십시오.
- 사용자에게 홍보를 취소할 수 있는 기능을 제공합니다.
- 사용자가 닫기로 한 경우 선택을 기억하십시오.
