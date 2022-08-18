---
layout: post
title: 배경색과 전경색의 명암비가 충분하지 않습니다.
description: 모든 텍스트의 색상 대비가 충분한지 확인하여 웹 페이지의 접근성을 향상시키는 방법을 알아봅니다.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - 색 대비
---

명암비가 낮은 텍스트, 즉 밝기가 배경 밝기에 너무 가까운 텍스트는 읽기 어려울 수 있습니다. 예를 들어, 흰색 배경에 밝은 회색 텍스트를 표시하면 사용자가 문자의 모양을 구별하기 어렵게 되어 가독성이 떨어지고 읽는 속도가 느려질 수 있습니다.

이 문제는 시력이 약한 사람들에게 특히 어려운 문제이지만 대비가 낮은 텍스트는 모든 사용자의 읽기 환경에 부정적인 영향을 줄 수 있습니다. 예를 들어 야외에서 모바일 장치로 무언가를 읽은 적이 있다면 충분한 대비를 가진 텍스트가 필요하다는 것을 경험했을 것입니다.

## Lighthouse 색상 대비 감사에 실패하는 방식

Lighthouse는 배경색과 전경색의 명암비가 충분히 높지 않은 텍스트에 플래그를 지정합니다.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hD4Uc22QqAdrBLdRPhJe.png", alt="배경색과 전경색의 명암비가 충분하지 않은 것을 보여주는 Lighthouse 감사", width="800", height="343" %}</figure>

텍스트의 색상 대비를 평가하기 위해 Lighthouse는 <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">WCAG 2.1의 성공 기준 1.4.3</a>을 사용합니다.

- 18pt 또는 14pt이고 굵게 표시된 텍스트는 3:1의 명암비가 필요합니다.
- 다른 모든 텍스트에는 4.5:1의 명암비가 필요합니다.

감사의 특성상 Lighthouse는 이미지에 겹쳐진 텍스트의 색상 대비를 확인할 수 없습니다.

{% Aside 'caution' %} 버전 2.1에서 WCAG는 [사용자 인터페이스 요소와 이미지](https://www.w3.org/TR/WCAG21/#non-text-contrast)를 포함하도록 색상 대비 요구 사항을 확장했습니다. Lighthouse는 이러한 요소를 확인하지 않지만 시력이 약한 사람들도 전체 사이트에 액세스할 수 있도록 직접 확인해야 합니다. {% endAside %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 텍스트의 색상 대비가 충분한지 확인하는 방법

페이지의 모든 텍스트가 <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">WCAG에서 지정한</a> 최소 색상 명암비를 충족하는지 확인하세요.

- 18pt 또는 14pt이고 굵게 표시된 텍스트의 경우 3:1
- 기타 모든 텍스트의 경우 4.5:1

대비 요구 사항을 충족하는 색상을 찾는 한 가지 방법은 Chrome DevTools의 색상 선택기를 사용하는 것입니다.

1. 확인하려는 요소를 마우스 오른쪽 버튼으로 클릭(또는 Mac에서 `Command`-클릭)하고 **Inspect(검사)**를 선택합니다.
2. **Elements(요소)** 창의 **Styles(스타일)** 탭에서 요소의 `color` 값을 찾습니다.
3. 값 옆에 있는 색상 축소판을 클릭합니다.

색상 선택기는 글꼴 크기와 두께를 고려하여 요소가 색상 대비 요구 사항을 충족하는지 여부를 알려줍니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/osaU6NOcyElBALiXmRa5.png", alt="색상 대비 정보가 강조 표시된 Chrome DevTools 색상 선택기를 보여주는 스크린샷", width="298", height="430" %}</figure>

색상 선택기를 사용하여 대비가 충분히 높을 때까지 색상을 조정할 수 있습니다. HSL 색상 형식을 조정하는 것이 가장 쉽습니다. 선택기 오른쪽에 있는 토글 버튼을 클릭하여 해당 형식으로 전환합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uUGdLr7fYCrmqtCrtpJK.png", alt="색상 형식 토글이 강조 표시된 Chrome DevTools 색상 선택기를 보여주는 스크린샷", width="298", height="430" %}</figure>

기준을 통과하는 색상 값을 얻었으면 프로젝트의 CSS를 업데이트하세요.

그라디언트의 텍스트 또는 이미지의 텍스트와 같은 더 복잡한 경우는 UI 요소 및 이미지와 마찬가지로 수동으로 확인해야 합니다. 이미지에 있는 텍스트의 경우, DevTools의 배경색 선택기를 사용하여 텍스트가 나타나는 배경을 확인할 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PFznOtjzMF3nZy3IsCtW.png", alt="Chrome DevTools 배경색 선택기를 보여주는 스크린샷", width="301", height="431" %}</figure>

다른 경우에는 Paciello Group의 <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Color Contrast Analyzer</a>와 같은 도구의 사용을 고려하세요.

## 리소스

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/color-contrast.js" rel="noopener"><strong>배경색과 전경색의 명암비가 충분하지 않음</strong>에 대한 소스 코드</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/color-contrast" rel="noopener">텍스트 요소는 배경과 충분한 색상 대비를 가져야 합니다(Deque University).</a>
- <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Colour Contrast Analyser</a>
