---
layout: post
title: 색상 및 대비 접근성
authors:
  - dgash
  - megginkearney
  - rachelandrew
  - robdodson
date: 2020-03-31
updated: 2020-03-31
description: |2

  시력이 좋은 경우 모든 사람이 동일한 방식으로 색상 또는 텍스트 가독성을 인식한다고 가정하기 쉽지만 물론 그렇지 않습니다.
tags:
  - accessibility
---

시력이 좋은 경우 모든 사람이 동일한 방식으로 색상 또는 텍스트 가독성을 인식한다고 가정하기 쉽지만 물론 그렇지 않습니다.

여러분들 생각대로 어떤 사람들에게는 읽기 쉬운 색상 조합이 다른 사람들에게는 어렵거나 불가능합니다. 이것은 일반적으로 전경색과 배경색의 휘도 사이의 관계인 색상 대비로 귀결됩니다. 색상이 비슷하면 명암비가 낮습니다. 색상이 서로 다를 때 명암비가 높습니다.

[WebAIM 지침](https://webaim.org/standards/wcag/)은 모든 텍스트에 대해 4.5:1의 AA(최소) 명암비를 권장합니다. 비율이 3:1로 낮아질 수 있는 경우인 매우 큰 텍스트(기본 본문 텍스트보다 120-150% 더 큼)는 예외입니다. 아래 표시된 명암비의 차이를 확인하십시오.

<figure>{% Img src="image/admin/DcYclKelVqhQ2CWlIG97.jpg", alt="다른 명암비를 보여주는 이미지", width="800", height="328" %}</figure>

4.5:1의 명암비는 약 20/40 시력에 해당하는 시력 손실을 가진 사용자가 일반적으로 경험하는 대비 감도 손실을 보상하기 때문에 레벨 AA에 대해 선택되었습니다. 일반적으로 20/40은 약 80세의 사람들의 전형적인 시력으로 보고됩니다. 저시력 장애 또는 색약이 있는 사용자의 경우 본문 텍스트의 대비를 최대 7:1까지 높일 수 있습니다.

Lighthouse의 접근성 감사를 사용하여 색상 대비를 확인할 수 있습니다. DevTools를 열고 감사를 클릭한 다음 접근성을 선택하여 보고서를 실행합니다.

<figure>{% Img src="image/admin/vSFzNOurQO6z2xV6qWuW.png", alt="색상 대비 감사 출력 스크린샷", width="800", height="218" %}</figure>

Chrome에는 [페이지의 모든 저대비 텍스트](https://developers.google.com/web/updates/2020/10/devtools#css-overview)를 감지하는 데 도움이 되는 실험 기능도 포함되어 있습니다. [접근 가능한 색상 제안](https://developers.google.com/web/updates/2020/08/devtools#accessible-color)을 사용하여 대비가 낮은 텍스트를 수정할 수도 있습니다.

<figure>{% Img src="image/admin/VYZeK2l2vs6pIoWhH2hO.png", alt="Chrome 저대비 텍스트 실험 기능의 출력 스크린샷.", width="800", height="521" %}</figure>

보다 완전한 보고서를 보려면 [접근성 인사이트 확장](https://accessibilityinsights.io/)을 설치하십시오. Fastpass 보고서에서 확인하는 것 중 하나는 색상 대비입니다. 실패한 요소에 대한 자세한 보고서를 받게 됩니다.

<figure>{% Img src="image/admin/CR21TFMZw8gWsSTWOGIF.jpg", alt="접근성 통계 보고서", width="800", height="473" %}</figure>

## 고급 지각 대비 알고리즘(APCA)

[APCA(Advanced Perceptual Contrast Algorithm)](https://w3c.github.io/silver/guidelines/methods/Method-font-characteristic-contrast.html)는 색상 인식에 대한 현대적 연구를 기반으로 하여 대비를 계산하는 새로운 방법입니다.

[AA](https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum)/[AAA](https://www.w3.org/WAI/WCAG21/quickref/#contrast-enhanced) 가이드라인과 비교하여 APCA는 컨텍스트 종속적입니다.

대비는 다음 기능을 기반으로 계산됩니다.

- 공간 속성(글꼴 두께 및 텍스트 크기)
- 텍스트 색상(텍스트와 배경의 인지된 밝기 차이)
- 컨텍스트(주변 조명, 환경 및 텍스트의 의도된 목적)

Chrome에는 [AA/AAA 명암비 지침을 APCA로 대체하는 실험적 기능](https://developers.google.com/web/updates/2021/01/devtools#apca)이 포함되어 있습니다.

<figure>{% Img src="image/admin/YhGKRLYvt37j3ldlwiXE.png", alt="Chrome의 APCA 기능 출력 스크린샷", width="800", height="543" %}</figure>

## 색상만으로 정보를 전달하지 마십시오

전 세계적으로 약 3억 2천만 명에게 색각 이상이 있습니다. 남성 12명 중 1명, 여성 200명 중 1명이 일종의 "색맹"을 가지고 있습니다. 이는 사용자의 약 1/20 또는 5%가 의도한 대로 사이트를 경험하지 못할 것임을 의미합니다. 정보를 전달하기 위해 색상에 의존할 때 우리는 그 수치를 허용할 수 없는 수준으로 끌어 올립니다.

{% Aside %} 참고: "색맹"이라는 용어는 종종 사람이 색을 구별하는 데 문제가 있는 시각 상태를 설명하는 데 사용되지만 실제로는 극소수의 사람들이 진정한 색맹입니다. 색 결핍이 있는 대부분의 사람들은 일부 또는 대부분의 색을 볼 수 있지만 빨간색과 녹색(가장 일반적임), 갈색과 주황색, 파란색과 보라색과 같은 특정 색을 구별하는 데 어려움을 겪습니다. {% endAside %}

예를 들어, 입력 양식에서 전화 번호가 잘못되었음을 나타내기 위해 빨간색 밑줄이 그어질 수 있습니다. 그러나 색상이 부족하거나 화면 판독기 사용자에게는 해당 정보가 제대로 전달되지 않습니다. 따라서 사용자가 중요한 정보에 액세스할 수 있는 여러 경로를 항상 제공해야 합니다.

<figure style="width: 200px">{% Img src="image/admin/MKmlhejyjNpk7XE9R2KV.png", alt="잘못된 전화번호가 빨간색으로만 강조 표시된 입력 양식의 이미지입니다.", width="293", height="323" %}</figure>

[WebAIM 체크리스트는 섹션 1.4.1](https://webaim.org/standards/wcag/checklist#sc1.4.1) 에 "색상이 콘텐츠를 전달하거나 시각적 요소를 구별하는 유일한 방법으로 사용되어서는 안 된다"고 명시되어 있습니다. 또한 특정 대비 요구 사항을 충족하지 않는 한 "주변 텍스트와 링크를 구별하기 위해 색상만 사용해서는 안 된다"고 언급합니다. 대신 체크리스트는 링크가 활성화된 시기를 나타내기 위해 밑줄과 같은 추가 표시기를(CSS `text-decoration` 속성 사용을 사용하여) 추가할 것을 권장합니다.

이전 예제를 수정하는 쉬운 방법은 필드에 추가 메시지를 추가하여 유효하지 않으며 그 이유를 알리는 것입니다.

<figure style="width: 200px">{% Img src="image/admin/FLQPcG16akNRoElx3pnz.png", alt="지난 예에서와 동일한 입력 양식입니다. 이번에는 필드 문제를 나타내는 텍스트 레이블이 있습니다.", width="292", height="343" %}</figure>

앱을 빌드할 때 이러한 종류의 사항을 염두에 두고 중요한 정보를 전달하기 위해 색상에 너무 많이 의존할 수 있는 영역에 주의하십시오.

사이트가 다른 사람들에게 어떻게 보이는지 궁금하거나 UI의 색상 사용에 크게 의존하는 경우 DevTools를 사용하여 다양한 유형의 색맹을 비롯한 다양한 형태의 시각 장애를 시뮬레이션할 수 있습니다. Chrome에는 [시각 장애 에뮬레이션 기능](https://developers.google.com/web/updates/2020/03/devtools#vision-deficiencies)이 포함되어 있습니다. 액세스하려면 DevTools를 연 다음 Drawer에서 **Rendering** 탭을 열면 다음과 같은 색약을 에뮬레이션할 수 있습니다.

- Protanopia: 붉은 빛을 감지할 수 없음.
- Deuteranopia: 녹색 빛을 감지할 수 없습니다.
- Tritanopia: 청색광을 감지할 수 없음.
- Achromatopsia: 회색 음영을 제외한 모든 색상을 인식할 수 없음(매우 드물게).

<figure>{% Img src="image/admin/VAnFxYhzFcpovdTCToPl.jpg", alt="색맹이 있는 사람의 시력을 모방하면 페이지가 회색조로 표시됩니다.", width="800", width="800", height="393" %}</figure>

## 고대비 모드

고대비 모드를 사용하면 사용자가 전경색과 배경색을 반전할 수 있으며, 이는 종종 텍스트를 더 잘 돋보이게 하는 데 도움이 됩니다. 시각 장애가 있는 사용자의 경우 고대비 모드를 사용하면 페이지의 콘텐츠를 훨씬 쉽게 탐색할 수 있습니다. 컴퓨터에서 고대비 설정을 얻는 몇 가지 방법이 있습니다.

Mac OSX 및 Windows와 같은 운영 체제는 시스템 수준에서 모든 항목에 대해 활성화할 수 있는 고대비 모드를 제공합니다.

고대비 설정을 켜고 애플리케이션의 모든 UI가 여전히 표시되고 사용 가능한지 확인하는 것도 유용합니다.

예를 들어 탐색 모음은 현재 선택된 페이지를 나타내기 위해 미묘한 배경색을 사용할 수 있습니다. 고대비 확장 프로그램으로 보면 그 미묘함이 완전히 사라지고 어떤 페이지가 활성화되어 있는지 독자가 이해하게 됩니다.

<figure style="width: 500px">{% Img src="image/admin/dgmA4W1Qu8JmcgsH80HD.png", alt="활성 탭을 읽기 어려운 고대비 모드의 탐색 모음 스크린샷", width="640", height="57" %}</figure>

마찬가지로 이전 단원의 예를 고려하면 잘못된 전화 번호 필드의 빨간색 밑줄이 구별하기 어려운 청록색으로 표시될 수 있습니다.

<figure>{% Img src="image/admin/HtlXwmHQHBcAO4LYSfAA.jpg", alt="이번에는 고대비 모드에서 사용되는 이전 주소 형식의 스크린샷입니다. 잘못된 요소의 색상 변경을 읽기 어렵습니다.", width="700", height="328" %}</figure>

앞서 다룬 명암비를 충족한다면 고대비 모드를 지원하는 데 문제가 없을 것입니다. 그러나 확실히 하기 위해 [고대비 Chrome 확장 프로그램을](https://chrome.google.com/webstore/detail/high-contrast/djcfdncoelnlbldjfhinnjlhdjlikmph) 설치하고 모든 것이 예상대로 작동하고 보이는지 확인하기 위해 페이지를 한 번 더 확인하는 것이 좋습니다.
