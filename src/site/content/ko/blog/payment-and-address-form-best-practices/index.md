---
title: 지불 및 주소 양식 모범 사례
subhead: 사용자가 가능한 한 빠르고 쉽게 주소 및 지불 양식을 작성할 수 있도록 하여 전환을 극대화하십시오.
authors:
  - samdutton
scheduled: 'true'
date: 2020-12-09
updated: 2021-11-30
description: 사용자가 가능한 한 빠르고 쉽게 주소 및 지불 양식을 작성할 수 있도록 하여 전환을 극대화하십시오.
hero: image/admin/dbYeeV2PCRZNY6RRvQd2.jpg
thumbnail: image/admin/jy8z8lRuLmmnyytD5xwl.jpg
alt: 노트북 컴퓨터에서 지불하기 위해 지불 카드를 사용하는 사업가.
tags:
  - blog
  - forms
  - identity
  - layout
  - mobile
  - payments
  - security
  - ux
codelabs:
  - codelab-payment-form-best-practices
  - codelab-address-form-best-practices
---

{% YouTube 'xfGKmvvyhdM' %}

효과적으로 설계된 양식은 사용자를 돕고 전환율을 높입니다. 약간만 수정하더라도 큰 차이를 만들 수 있습니다!

{% Aside 'codelab' %} 실습 가이드를 통해 이러한 모범 사례를 배우고 싶다면 이 게시물의 두 코드랩을 확인하세요.

- [결제 양식 모범 사례 Codelab](/codelab-payment-form-best-practices)
- [주소 양식 모범 사례 Codelab](/codelab-address-form-best-practices) {% endAside %}

다음은 모든 모범 사례를 보여주는 간단한 지불 양식의 예입니다.

{% Glitch { id: 'payment-form', path: 'index.html', height: 720 } %}

다음은 모든 모범 사례를 보여주는 간단한 주소 양식의 예입니다.

{% Glitch { id: 'address-form', path: 'index.html', height: 980 } %}

## 체크리스트

- `<form>`, `<input>`, `<label>` 및 `<button>`과 같은 [의미 있는 HTML 요소를 사용하세요](#meaningful-html).
- [`<label>`이 있는 각 양식 필드에 레이블 지정하세요](#html-label).
-  HTML 요소 속성을 사용하여 [기본 제공 브라우저 기능](#html-attributes) 특히 적절한 값이 있는 [`type`](#type-attribute) 및 [`autocomplete`](#autocomplete-attribute)에 액세스하세요.
- 지불 카드 번호와 같이 증가하도록 의도되지 않은 번호에 `type="number"`를 사용하지 않도록 하세요. 대신 `type="text"` 및 [`inputmode="numeric"`](#inputmode-attribute)을 사용하세요.
- `input`, `select` 또는 `textarea`에 [적절한 자동 완성 값](#autocomplete-attribute)을 사용할 수 있으면 이를 사용해야 합니다.
- 브라우저가 양식을 자동으로 채우는 데 도움이 되도록 페이지 로드 또는 웹사이트 배치 사이에서 변하지 않는 `name` 및 `id` 속성 [안정 값](#stable-name-id)을 입력하세요.
- 탭하거나 클릭하면 [제출 버튼이 비활성화](#disable-submit)됩니다.
- 입력하는 동안 양식을 제출할 뿐만 아니라 데이터를 [유효성 검사](#validate)하세요.
- 결제가 완료되면 [게스트 결제](#guest-checkout)를 기본값으로 설정하고 계정 생성을 간단하게 만들 수 있습니다.
- 명확한 단계에서 명확한 실행 호출과 함께 [결제 프로세스 진행 과정](#checkout-progress)을 표시합니다.
- 클러터와 방해 요소를 제거하여 [잠재적 결제 출구 지점을 제한](#reduce-checkout-exits)합니다.
- 결제 시 [전체 주문 세부 정보](#checkout-details)를 표시하고 주문을 쉽게 조정할 수 있습니다.
- [필요하지 않은 데이터를 요구하지 마십시오](#unneeded-data) .
- 합당한 이유가 없는 한 [단일 입력으로 이름을 요청하세요.](#single-name-input)
- 이름과 사용자 이름에 [라틴어 전용 문자를 강제로 사용하지 마세요.](#unicode-matching)
- [다양한 주소 형식을 허용합니다](#address-variety).
- [주소에 하나의 `textarea`](#address-textarea)를 사용하는 것을 고려하세요.
- [청구서 수신 주소 자동 완성](#billing-address) 기능을 사용하세요.
- 필요한 경우 [국제화 및 현지화](#internationalization-localization)합니다.
- [우편번호 주소를 조회하는 것](#postal-code-address-lookup)을 피하세요.
- [적절한 지불 카드 값 자동 채우기 기능](#payment-form-autocomplete)을 사용하세요.
- [결제 카드 번호에 하나의 입력 값](#single-number-input)만 사용하세요.
- 자동 채우기 경험을 방해하는 [사용자 지정 요소](#avoid-custom-elements)를 사용하는 것을 피하세요.
- [현장 및 실험실 테스트](#analytics-rum): 페이지 분석, 상호 작용 분석 및 실제 사용자 성능 측정.
- [다양한 브라우저, 장치 및 플랫폼에서 테스트](#test-platforms)합니다.

{% Aside %} 본 문서는 주소 및 결제 양식에 대한 최신 모범 사례에 대한 것입니다. 사이트에서 트랜잭션을 구현하는 방법은 설명되어 있지 않습니다. 웹사이트에 결제 기능을 추가하는 방법에 대해 자세히 알아보려면 [웹 결제](/payments)를 참조하십시오. {% endAside %}

## 의미 있는 HTML 사용하기 {: #meaningful-html}

작업을 위해 빌드된 요소와 속성을 사용합니다.

- `<form>`, `<input>`, `<label>` 및 `<button>`
- `type`, `autocomplete` 및 `inputmode`

이를 통해 기본 제공 브라우저 기능을 활성화하고 접근성을 개선하며 마크업에 의미를 추가할 수 있습니다.

### 의도한 대로 HTML 요소 사용하기 {: #html-elements}

#### 양식을 &lt;form&gt;에 넣기  {: #html-form}

`<input>` 요소를 `<form>`에 래핑하지 않고 순수하게 JavaScript로 데이터 제출을 처리하고 싶을 수 있습니다.

그렇게 하지 마세요!

HTML `<form>`을 사용하면 모든 최신 브라우저에서 강력한 기본 제공 기능 모음에 액세스할 수 있으며 화면 리더 및 기타 보조 장치에서 사이트에 액세스할 수 있습니다. 또한 `<form>`을 사용하면 JavaScript 지원이 제한된 기존 브라우저를 위한 기본 기능을 구축하고 코드에 결함이 있는 경우라도 양식 제출을 활성화하고 실제로 JavaScript를 비활성화하는 소수의 사용자를 위해 더 간단하게 만들 수 있습니다.

사용자 입력 항목을 위한 두 개 이상의 페이지 구성 요소가 있는 경우 각각 고유한 `<form>` 요소에 넣어야 합니다. 예를 들어, 동일한 페이지에서 로그인하고 검색하는 경우 각각을 고유한 `<form>`에 넣으십시오.

#### `<label>`을 사용하여 요소 레이블 지정하기 {: #html-label}

`<input>`, `<select>` 또는 `<textarea>`에 대한 레이블을 지정하려면 [`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label)을 사용하세요.

입력의 `id`와 값이 동일한 레이블의 `for` 속성을 제공하여 입력을 레이블과 연관시킵니다.

```html
<label for="address-line1">Address line 1</label>
<input id="address-line1" …>
```

단일 입력에 단일 레이블을 사용합니다. 하나의 레이블로 여러 입력에 대한 레이블을 지정하지 마십시오. 이것은 브라우저에서 가장 잘 작동하고 스크린 리더에서 가장 효과적입니다. 레이블을 탭하거나 클릭하면 연관된 입력으로 포커스가 이동하고 *레이블* 또는 레이블의 *입력*이 포커스를 받으면 스크린 디더가 레이블 텍스트를 공개합니다.

{% Aside 'caution' %} 레이블 대신 자체적인 [자리 표시자](https://www.smashingmagazine.com/2018/06/placeholder-attribute/)를 사용하지 마세요. 입력 항목에 텍스트를 입력하기 시작하면 자리 표시자가 숨겨져 입력 항목이 무엇을 위한 것인지 잊어버리기 쉽습니다. 날짜와 같은 값의 올바른 형식을 표시하기 위해 자리 표시자를 사용하는 경우에도 마찬가지입니다. 이는 특히 주의가 산만하거나 스트레스를 받는 경우 전화 사용자에게 문제가 될 수 있습니다! {% endAside %}

#### 유용한 버튼 {: #html-button} 만들기

버튼에는 [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button)을 사용하세요! `<input type="submit">`을 사용할 수도 있지만 `div` 또는 버튼 역할을 하는 다른 임의 요소를 사용하지 마십시오. 버튼 요소는 액세스 가능한 동작, 기본 제공 양식 제출 기능을 제공하며 쉽게 스타일을 지정할 수 있습니다.

각 양식 제출 버튼에 기능을 설명하는 값을 지정하십시오. 체크아웃에 대한 각 단계에서 진행 상황을 보여주고 다음 단계를 명확하게 보여주는 설명적 동작 호출 기능을 사용하세요. 예를 들어, 배송 주소 양식의 제출 버튼에 **계속** 또는 **저장**이 아닌 **결제 진행**이라는 레이블을 지정합니다.

{: #disable-submit}

사용자가 제출 버튼을 탭하거나 클릭하면, 특히 사용자가 결제를 하거나 주문할 때 제출 버튼을 비활성화하는 것이 좋습니다. 제대로 작동하는 경우에도 많은 사용자가 버튼을 반복적으로 클릭하기 때문입니다. 이로 인해 결제가 이루어지지 않고 서버에 부하가 발생할 수 있습니다.

반면에 완전하고 유효한 사용자 입력을 기다리는 제출 버튼을 비활성화하지 마십시오. 예를 들어, 무언가가 누락되었거나 유효하지 않다고 해서 **주소 저장** 버튼을 비활성화된 상태로 두지 마십시오. 이는 사용자에게 도움이 되지 않습니다. 사용자는 계속해서 버튼을 탭하거나 클릭하고 버튼이 고장난 것으로 생각할 수 있습니다. 대신 사용자가 유효하지 않은 데이터가 포함된 양식을 제출하려고 하면 무엇이 잘못되었으며 수정하려면 어떻게 해야 하는지 알려주세요. 이는 데이터 입력이 더 어렵고 양식 제출을 시도할 때 사용자의 화면에 누락되거나 잘못된 양식 데이터가 표시되지 않을 수 있는 모바일에서 특히 중요합니다.

{% Aside 'caution' %} 양식에 있는 버튼의 기본 유형은 `submit`입니다. 양식(예: **비밀번호 표시**)에 다른 버튼을 추가하려면 `type="button"`을 추가하세요. 그렇지 않으면 버튼을 클릭하거나 탭하면 양식이 제출됩니다.

양식 필드에 포커스가 있는 동안 `Enter` 키를 누르면 양식의 첫 번째 `submit` 버튼 클릭이 시뮬레이션됩니다. **Submit** 버튼 전에 양식에 버튼을 포함하려면 유형을 지정하지 마십시오. 이 버튼은 양식(`submit`)의 버튼에 대한 기본 유형이며 해당 양식이 제출되기 전에 클릭 이벤트를 수신합니다. 이에 대한 예는 [demo](https://enter-button.glitch.me/)를 참조하세요. 양식을 작성한 다음 `Enter` 키를 누릅니다. {% endAside %}

### HTML 속성 {: #html-attributes} 최대한 활용하기

#### 사용자가 데이터를 쉽게 입력할 수 있도록 합니다

{: #type-attribute}

적절한 입력 [`type` 속성](https://developer.mozilla.org/docs/Web/HTML/Element/input/email)을 사용하여 모바일에서 올바른 키보드를 제공하고 브라우저에서 기본 제공 유효성 검사 기능을 활성화하세요.

예를 들어 이메일 주소에 `type="email"`을 사용하고 전화번호에는 `type="tel"`을 사용하세요.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bi7J9Z1TLP4IsQLyhbQm.jpg", alt="이메일 주소(type=email 사용)를 입력하는 동안 그리고 전화번호(type=tel 포함)를 입력하는 동안 적절한 키보드를 표시하는 Android 전화에 대한 스크린샷 2개.", width="800", height="683" %} <figcaption>이메일 및 전화에 적합한 키보드.</figcaption></figure>

{: #inputmode-attribute}

{% Aside 'warning' %} type="number"를 사용하면 위/아래 화살표를 추가하여 숫자를 증가시키므로 전화, 지불 카드 또는 계좌 번호와 같은 데이터에는 의미가 없습니다.

이와 같은 숫자의 경우, `type="text"`를 설정(또는 `text`가 기본 값이므로 설정을 그대로 남겨 둠)합니다. 전화번호의 경우 `type="tel"`을 사용하여 모바일에서 적절한 키보드를 가져옵니다. 다른 숫자의 경우 `inputmode="numeric"`을 사용하여 모바일에서 숫자 키보드를 가져옵니다.

일부 사이트는 모바일 사용자가 올바른 키보드를 가져올 수 있도록 지불 카드 번호에 `type="tel"`을 여전히 사용합니다. 그러나 `inputmode`는 [현재 매우 광범위하게 지원](https://caniuse.com/input-inputmode)되므로 그렇게 까지 할 필요는 없습니다. 하지만 사용자의 브라우저를 확인하십시오. {% endAside %}

{: #avoid-custom-elements}

날짜의 경우 사용자 지정 `select` 요소를 사용하지 마십시오. 제대로 구현되지 않고 기존 브라우저에서 작동하지 않으면 자동 채우기 경험이 방해를 받습니다. 생년월일과 같은 숫자의 경우, 특히 모바일에서 긴 드롭다운 목록에서 선택하는 것보다 수동으로 숫자를 입력하는 것이 더 쉽고 오류가 덜 발생할 수 있으므로 `select`을 사용하기 보다 `input`을 사용하는 것을 고려하세요. `inputmode="numeric"`을 사용하여 모바일에서 올바른 키보드를 확인하고, 텍스트 또는 자리 표시자와 함께 유효성 검사 및 형식 힌트를 추가하여 사용자가 적절한 형식으로 데이터를 입력할 수 있도록 합니다.

{% Aside %} [`datalist`](https://developer.mozilla.org/docs/Web/HTML/Element/datalist) 요소는 사용자가 사용 가능한 옵션 목록에서 선택할 수 있도록 하고 사용자가 텍스트를 입력할 때 일치하는 제안을 제공합니다. `text`의 경우 `datalist`를 시도하고, [simpl.info/datalist](https://simpl.info/datalist)에서 `range` 및 `color` 입력을 시도하세요. 출생 연도를 입력하는 경우, [datalist-select.glitch.me](https://datalist-select.glitch.me)에서 `select`과 `input` 그리고 `datalist`를 비교할 수 있습니다. {% endAside %}

#### 자동 완성을 사용하여 접근성을 개선하고 사용자가 데이터를 다시 입력하지 않도록 돕습니다 {: #autocomplete-attribute}

적절한 `autocomplete` 값을 사용하면 브라우저에서 데이터를 안전하게 저장하고 `input`, `select` 및 `textarea` 값을 자동으로 완성하여 사용자를 지원할 수 있습니다. 이는 모바일에서 특히 중요하며 [높은 양식 이탈률](https://www.zuko.io/blog/8-surprising-insights-from-zukos-benchmarking-data)을 방지하는 데 중요합니다. 자동 완성 기능은 또한 [여러 접근성 이점](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html)도 제공합니다.

양식 필드에 적절한 자동 완성 값을 사용할 수 있는 경우 이를 사용해야 합니다. [MDN 웹 문서](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete)에는 값의 전체 목록과 이를 올바르게 사용하는 방법에 대한 설명이 있습니다.

{: #stable-name-id}

{% Aside %} 적절한 자동 완성 값을 사용하고 양식 필드 `name` 및 `id` 속성에 페이지 로드 또는 웹사이트 배치 사이를 변경하지 않는 [안정한 값](#stable-name-id)을 제공하여 브라우저가 양식을 자동으로 완성하도록 지원합니다. {% endAside %}

{: #billing-address}

기본적으로 청구서 수신 주소를 배송 주소와 동일하게 설정합니다. 청구서 수신 주소를 양식에 표시하는 대신 청구서 수신 주소를 편집할 수 있는 링크를 제공(또는 [`summary` 및 `details` 요소](https://simpl.info/details/) 사용)하여 시각적 혼란을 줄입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TIan7TU8goyoOXwLPYyd.png", alt="청구서 수신 주소를 변경하는 링크를 나타내는 결제 페이지 예제.", width="800", height="250" %} <figcaption>청구서 검토 링크 추가.</figcaption></figure>

배송 주소와 마찬가지로 청구서 수신 주소에 적절한 자동 완성 값을 사용하면 사용자가 데이터를 두 번 이상 입력할 필요가 없습니다. 다른 섹션에 동일한 이름이 있는 입력에 대한 값이 다를 경우 접두어를 추가하여 속성을 자동으로 완성합니다.

```html
<input autocomplete="shipping address-line-1" ...>
...
<input autocomplete="billing address-line-1" ...>
```

#### 사용자가 올바른 데이터를 입력할 수 있도록 지원 {: #validation}

고객이 "잘못을 저질렀다고" 해서 "비방"하지 마십시오. 대신 문제가 발생하는 즉시 사용자가 수정할 수 있도록 도와줌으로써 양식을 더 빠르고 쉽게 완료할 수 있도록 돕습니다. 고객은 결제 프로세스를 통해 회사에 제품이나 서비스에 대한 비용을 지불하려는 것입니다. 고객을 처벌하는 대신 도와주십시오!

`min`, `max` 및 `pattern`을 포함하여 허용되는 값을 지정하기 위해 양식 요소에 [제약 조건 속성](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation#Intrinsic_and_basic_constraints)을 추가할 수 있습니다. 요소의 [유효성 상태](https://developer.mozilla.org/docs/Web/API/ValidityState)는 요소의 값이 유효한지 여부에 따라 자동으로 설정되며, 유효하거나 유효하지 않은 값으로 요소의 스타일을 지정하는 데 사용할 수 있는 `:valid` 및 `:invalid` CSS 의사 클래스도 마찬가지입니다.

예를 들어, 다음 HTML은 1900년에서 2020년 사이의 출생 연도에 대한 입력 항목을 지정합니다. `type="number"`를 사용하면 입력 값이 `min` 및 `max`에 의해 지정된 범위 내의 숫자로만 제한됩니다. 범위를 벗어난 숫자를 입력하려고 하면 입력 항목이 유효하지 않은 상태로 설정됩니다.

{% Glitch { id: 'constraints', path: 'index.html', height: 170 } %}

다음 예에서는 `pattern="[\d ]{10,30}"`을 사용하여 공백을 허용하면서 유효한 결제 카드 번호를 확인합니다.

{% Glitch { id: 'payment-card-input', path: 'index.html', height: 170 } %}

최신 브라우저는 `email` 또는 `url` 유형의 입력에 대한 기본 유효성 검사도 수행합니다.

{% Glitch { id: 'type-validation', path: 'index.html', height: 250 } %}

{% Aside %} `type="email"`이 있는 입력에 `multiple` 속성을 추가하여 단일 입력에서 쉼표로 구분된 여러 이메일 주소에 대한 기본 제공 유효성 검사 기능을 활성화합니다. {% endAside %}

양식 제출 시 브라우저는 문제가 있거나 필수 값이 누락된 필드에 자동으로 초점을 맞춥니다. JavaScript가 필요하지 않습니다!

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mPyN7THWJNRQIiBezq6l.png", alt="브라우저 프롬프트와 유효하지 않은 이메일 값에 대한 포커스를 보여주는 데스크톱의 Chrome 로그인 양식에 대한 스크린샷.", width="500", height="483" %} <figcaption>브라우저의 기본 제공 유효성 검사 기능.</figcaption></figure>

제출 버튼을 클릭할 때 오류 목록을 제공하는 대신 인라인으로 유효성을 검사하고 사용자가 데이터를 입력할 때 피드백을 제공합니다. 양식 제출 후 서버의 데이터를 유효성 검사해야 하는 경우 발견된 모든 문제를 나열하고 유효하지 않은 값이 있는 모든 양식 필드를 명확하게 강조 표시하고 문제가 있는 각 필드 옆에 수정해야 할 항목을 설명하는 메시지를 인라인으로 표시합니다. 서버 로그 및 분석 데이터에서 일반적인 오류를 확인하십시오. 양식을 다시 디자인해야 할 수도 있습니다.

또한 사용자가 데이터를 입력하고 양식을 제출하는 동안 더 강력한 유효성 검사를 수행하려면 JavaScript를 사용해야 합니다. 포커스를 설정하고 프롬프트 메시지를 표시하는 기본 제공 브라우저 UI를 사용하여 사용자 지정 유효성 검사 기능을 추가하려면 [제약 조건 유효성 검사 API](https://html.spec.whatwg.org/multipage/forms.html#constraints)(이는 [폭넓게 지원됨](https://caniuse.com/#feat=constraint-validation))를 사용하십시오.

[보다 복잡한 실시간 유효성 검사를 위해 JavaScript 사용](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation)에서 자세히 알아보세요.

{% Aside 'warning' %} 클라이언트 측 유효성 검사 및 데이터 입력 제약 조건이 있더라도 백엔드가 사용자의 데이터 입력 및 출력을 안전하게 처리하는지 확인해야 합니다. 사용자 입력을 절대 신뢰하지 마십시오. 악의적일 수 있습니다. [OWASP 입력 유효성 검사 치트 시트](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)에서 자세히 알아보세요. {% endAside %}

#### 사용자가 필수 데이터를 누락하지 않도록 지원 {: #required}

필수 값에 대한 입력에 [`required` 속성](https://developer.mozilla.org/docs/Web/HTML/Attributes/required)을 사용합니다.

양식이 제출되면 [최신 브라우저](https://caniuse.com/mdn-api_htmlinputelement_required)는 자동으로 메시지를 표시하고 누락된 데이터가 있는 `required` 필드에 초점을 맞출 때 [`:required` pseudo-class](https://caniuse.com/?search=required)를 사용하여 필수 필드를 강조 표시할 수 있습니다. JavaScript가 필요하지 않습니다!

모든 필수 필드의 레이블에 별표를 추가하고 양식의 시작 부분에 별표가 의미하는 바를 설명하는 메모를 추가합니다.

## 결제 간소화 {: #checkout-forms}

### 모바일 상거래 격차를 염두에 두십시오! {: #m-commerce-gap}

사용자가 사이트 이용 과정에서 *번거로움*을 느낀다고 상상해 보세요. 사이트를 이용하는 것이 번거로우면 사용자가 사이트를 떠납니다.

특히 모바일에서는 마찰을 줄이고 초점을 유지해야 합니다. 많은 사이트에서 모바일에서 더 많은 *트래픽*이 발생하지만 데스크톱에서는 더 많은 *전환*이 발생합니다. 이러한 현상을 [모바일 상거래 격차](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs)라고 합니다. 고객은 단순히 데스크탑에서 구매를 완료하는 것을 선호할 수 있지만 낮은 모바일 전환율도 좋지 않은 사용자 경험의 결과입니다. 모바일에서 손실된 전환율을 *최소화*하고 데스크탑에서 전환율을 *극대화*하는 것입니다. [연구에 따르면](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs) 더 나은 모바일 양식 경험을 제공하는 것은 엄청난 기회가 있습니다.

무엇보다 사용자는 길고 복잡하며 방향 감각을 잃어버리기 쉬운 양식을 포기할 가능성이 더 큽니다. 이것은 사용자가 더 작은 화면에 있거나 주의가 산만하거나 서두를 때 특히 그렇습니다. 가능한 한 적은 양의 데이터를 요청하세요.

### 게스트 체크아웃을 기본으로 설정하기 {: #guest-checkout}

온라인 상점의 경우 양식 마찰을 줄이는 가장 간단한 방법은 게스트 결제를 기본값으로 설정하는 것입니다. 사용자가 구매하기 전에 계정을 만들도록 강요하지 마십시오. 고객 결제를 허용하지 않는 것이 장바구니 포기의 주요 원인입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/a7OQLnCRb0FZglj07N7z.png", alt="결제하는 동안 장바구니를 포기하는 이유.", width="800", height="503" %} <figcaption>출처: <a href="https://baymard.com/checkout-usability">baymard.com/checkout-usability</a></figcaption></figure>

결제 후 계정 가입을 제안할 수 있습니다. 이 시점에서 계정을 설정하는 데 필요한 대부분의 데이터가 이미 있으므로 사용자를 위해 계정을 빠르고 쉽게 만들 수 있습니다.

{% Aside 'gotchas' %} 결제 후 가입을 제안하는 경우 사용자가 방금 구매한 항목이 새로 생성한 계정에 연결되어 있는지 확인하세요! {% endAside %}

### 결제 진행률 표시 {: #checkout-progress}

진행 상황을 표시하고 다음에 수행해야 할 작업을 명확히 하여 결제 프로세스를 더 쉽게 만들 수 있습니다. 아래 동영상은 영국 소매업체인 [johnlewis.com](https://www.johnlewis.com)이 이를 달성하는 방법을 보여줍니다.

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/6gIb1yWrIMZFiv775B2y.mp4", controls=true, autoplay=true, muted=true, poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ViftAUUUHr4TDXNec0Ch.png", playsinline=true %} <figcaption>결제 진행 과정 보기.</figcaption></figure>

모멘텀을 유지해야 합니다! 결제를 위한 각 단계마다 페이지 제목과 설명 버튼 값을 사용하여 지금 수행해야 할 작업과 결제 후 단계를 명확히 합니다.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/address-form-save.mp4" type="video/mp4">
   </source></video>
  <figcaption>양식 버튼에 다음에 무엇이 표시될지 알려주는 의미 있는 이름을 부여하십시오.</figcaption></figure>

모바일 키보드 입력 키 레이블을 설정하려면 양식 입력에 `enterkeyhint` 속성을 사용하십시오. 예를 들어, 다중 페이지 양식 내에서는 `enterkeyhint="previous"` 및 `enterkeyhint="next"`를 사용하고, 양식의 최종 입력에 대해서는 `enterkeyhint="done"`, 그리고 검색 입력에 대해서는 `enterkeyhint="search"`를 사용하십시오.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QoY8Oynpw0CqjPACtCdG.png", alt="Enterkeyhint 입력 속성이 Enter 키 버튼 아이콘을 변경하는 방법을 보여주는 Android 주소 양식에 대한 두 개의 스크린샷.", width="800", height="684" %} <figcaption>Android의 입력 키 버튼: '다음' 및 '완료'.</figcaption></figure>

`enterkeyhint` 속성은 [Android 및 iOS에서 지원](https://caniuse.com/mdn-html_global_attributes_enterkeyhint)됩니다. [enterkeyhint 설명자](https://github.com/dtapuska/enterkeyhint)에서 자세한 내용을 확인할 수 있습니다.

{: #checkout-details}

사용자가 결제 프로세스 내에서 쉽게 이동하고 심지어 최종 결제 단계에서도 주문 내역을 쉽게 조정할 수 있도록 합니다. 간략한 예약 정보뿐만 아니라 주문에 대한 전체적인 세부 정보를 표시합니다. 사용자가 결제 페이지에서 항목 수량을 쉽게 조정할 수 있도록 합니다. 결제 프로세스에서 가장 우선시해야 하는 것은 전환 진행 과정을 방해하지 않는 데 있습니다.

### 주의 산만 요소 제거 {: #reduce-checkout-exits}

제품 프로모션과 같은 시각적 혼란과 주의를 산만하게 하는 요소를 제거하여 잠재적 출구 지점을 제한합니다. 많은 성공적인 소매업체는 결제에서 탐색 및 검색을 제거하기도 합니다.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UR97R2LqJ5MRkL5H4V0U.png", alt="johnlewis.com 결제를 통한 진행 상황을 보여주는 두 개의 모바일 스크린샷. 검색, 탐색 및 기타 방해 요소가 제거되었습니다.", width="800", height="683" %}
  <figcaption>결제를 위해 제거된 검색, 탐색 및 기타 방해 요소.</figcaption>
</figure>

여정에 집중하세요. 지금은 사용자가 다른 일을 하도록 유혹할 때가 아닙니다!

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lKJwd5e2smBfDjNxV22N.jpg", alt="무료 스티커에 대한 산만한 프로모션을 보여주는 모바일 결제 페이지 스크린샷", width="350", height="735" %} <figcaption> 고객이 구매를 완료하는 데 방해가 되지 않도록 합니다.</figcaption></figure>

재방문 사용자의 경우 볼 필요가 없는 데이터를 숨겨 결제 흐름을 더욱 간순화할 수 있습니다. 예를 들어, 배송 주소를 양식이 아닌 일반 텍스트로 표시하여 사용자가 링크를 통해 배송 주소를 변경할 수 있도록 합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xEAYOeEFYhOZLaB2aeCY.png", alt="표시되지 않은 배송 주소, 지불 방법 및 청구서 수신 주소를 변경하는 링크를 포함하여 일반 텍스트로 텍스트를 표시하는 결제 페이지의 '주문 검토' 섹션에 대한 스크린샷.", width="450", height="219" %} <figcaption>고객이 볼 필요가 없는 데이터를 숨깁니다.</figcaption></figure>

## 이름과 주소를 쉽게 입력할 수 있도록 합니다. {: #address-forms}

### 필요한 데이터만 요청하세요. {: #unneeded-data}

이름 및 주소 양식 코딩을 시작하기 전에 어떤 데이터가 필요한지 이해해야 합니다. 필요하지 않은 데이터를 요청하지 마세요! 양식 복잡성을 줄이는 가장 간단한 방법은 불필요한 필드를 제거하는 것입니다. 이는 고객 개인정보 보호에도 유용하고 백엔드 데이터 비용과 책임을 줄일 수 있습니다.

### 단일 이름 입력 사용 {: #single-name-input}

이름, 성, 존칭 또는 기타 이름 부분을 별도로 저장해야 하는 합당한 이유가 없는 한 사용자가 단일 입력을 사용하여 이름을 입력할 수 있도록 허용하세요. 단일 이름 입력을 사용하면 양식이 덜 복잡해지고 잘라서 붙여넣기가 가능하며 자동 채우기 기능이 더 간단해집니다.

특히, 합당한 이유가 없는 한 접두사 또는 타이틀(예: Mrs, Dr 또는 Lord)에 대해 별도의 입력을 추가하지 않도록 하십시오. 사용자가 원할 경우 이름을 입력할 수 있도록 해야 합니다. 또한 `honorific-prefix` 자동 완성 기능은 현재 대부분의 브라우저에서 작동하지 않으므로 이름 접두사 또는 타이틀 필드를 추가하면 대부분의 사용자들은 주소 양식 자동 채우기 경험이 방해를 받습니다.

### 이름 자동 작성 기능 사용

전체 이름에 대해 `name`을 사용하세요:

```html
<input autocomplete="name" ...>
```

이름 부분을 분할해야 하는 합당한 이유가 있다면 다음과 같은 적절한 자동 완성 값을 사용해야 합니다.

- `honorific-prefix`
- `given-name`
- `nickname`
- `additional-name-initial`
- `additional-name`
- `family-name`
- `honorific-suffix`

### 국제 이름 허용 {: #unicode-matching}

이름 입력을 확인하거나 이름 데이터에 허용되는 문자를 제한할 수 있습니다. 그러나 가능한 한 알파벳에 제한을 두지 않아야 합니다. 고객에게 이름이 "유효하지 않다"고 말하는 것은 실례입니다!

유효성 검사를 위해 라틴 문자와만 일치하는 정규식을 사용하지 않도록 하십시오. 라틴 전용은 라틴 알파벳에 없는 문자를 포함하는 이름이나 주소를 가진 사용자를 배제시킵니다. 대신 유니코드 문자와 일치하는 정규식을 허용하고 백엔드가 입력과 출력 모두에서 유니코드를 안전하게 지원하도록 하십시오. 정규식의 유니코드는 최신 브라우저에서 효과적으로 지원됩니다.

{% Compare 'worse' %}

```html
<!-- Names with non-Latin characters (such as Françoise or Jörg) are 'invalid'. -->
<input pattern="[\w \-]+" ...>
```

{% endCompare %}

{% Compare 'better' %}

```html
<!-- Accepts Unicode letters. -->
<input pattern="[\p{L} \-]+" ...>
```

{% endCompare %}

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/unicode-letter-matching.mp4" type="video/mp4">
   </source></video>
  <figcaption>라틴어 전용 문자 일치와 비교한 유니코드 문자 일치.</figcaption></figure>

{% Aside %} 아래에서 [국제화 및 현지화](#internationalization-localization)에 대해 자세히 알아볼 수 있지만 사용자가 있는 모든 지역의 이름에 대해 양식이 효과적인지 확인하세요. 예를 들어, 일본어 이름의 경우 음성 이름을 위한 필드를 넣는 것을 고려해야 합니다. 이렇게 하면 고객 지원 직원이 전화로 고객의 이름을 말할 수 있습니다. {% endAside %}

### 다양한 주소 형식 허용 {: #address-variety}

주소 양식을 디자인할 때 단일 국가 내에서도 당혹해할 정도로 다양한 주소 형식을 염두에 두십시오. "정상" 주소에 대해 가정하지 않도록 주의하세요. (확실하지 않다면 [UK Address Oddities!](http://www.paulplowman.com/stuff/uk-address-oddities/)를 살펴보세요!)

#### 주소 양식을 유연하게 만들기 {:flexible-address}

사용자가 맞지 않는 양식 필드에 자신의 주소를 입력하도록 강요하지 마세요.

예를 들어, 많은 주소가 해당 형식을 사용하지 않고 불완전한 데이터로 인해 브라우저 자동 채우기 기능이 중단될 수 있으므로 별도의 입력에서 집 번호와 거리 이름을 고집하지 마십시오.

`required` 주소 필드에 특히 주의하세요. 예를 들어 영국의 대도시 주소에는 카운티가 없지만 많은 사이트에서는 여전히 사용자가 카운티를 입력하도록 강요합니다.

두 개의 유연한 주소 입력란을 사용하면 다양한 주소 형식에 대해 충분히 효과적일 수 있습니다.

```html
<input autocomplete="address-line-1" id="address-line1" ...>
<input autocomplete="address-line-2" id="address-line2" ...>
```

일치하는 레이블 추가:

```html/0-2,5-7
<label for="address-line-1">
Address line 1 (or company name)
</label>
<input autocomplete="address-line-1" id="address-line1" ...>

<label for="address-line-2">
Address line 2 (optional)
</label>
<input autocomplete="address-line-2" id="address-line2" ...>
```

아래에 포함된 데모를 리믹스하고 편집하여 이를 시도할 수 있습니다.

{% Aside 'caution' %} 연구에 따르면 [**주소 입력란 2**는 사용자에게 문제가 될 수 있습니다](https://baymard.com/blog/address-line-2). 주소 양식을 디자인할 때 이를 염두에 두십시오. 단일 `textarea`(아래 참조) 또는 다른 옵션을 사용하는 것과 같은 대안을 고려해야 합니다. {% endAside %}

#### 주소에 단일 텍스트 영역을 사용하는 것을 고려하십시오. {: #address-textarea}

주소에 대한 가장 유연한 옵션은 단일 `textarea` 을 제공하는 것입니다.

`textarea` 접근 방식은 모든 주소 형식에 적합하며 잘라내기 및 붙여넣기에 적합하지만 데이터 요구 사항에 부합하지 않을 수 있으며 `address-line1` 및 `address-line2`가 있는 양식만 이전에 사용한 경우 사용자의 자동 채우기 기능이 방해 받을 수 있습니다.

텍스트 영역의 경우 자동 완성 값으로 `street-address`를 사용하세요.

다음은 주소에 `textarea`를 사용하는 방법을 보여주는 양식의 예입니다.

{% Glitch { id: 'address-form', path: 'index.html', height: 980 } %}

#### 주소 양식의 국제화 및 현지화 {: #internationalization-localization}

주소 양식은 사용자의 위치에 따라 [국제화 및 현지화](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites/)를 고려하는 것이 특히 중요합니다.

주소 부분의 이름은 주소 형식과 함께 동일한 언어 내에서도 다양합니다.

```text
    ZIP code: US
 Postal code: Canada
    Postcode: UK
     Eircode: Ireland
         PIN: India
```

주소에 맞지 않거나 기대하는 단어를 사용하지 않는 형식으로 제시되는 것은 짜증스럽거나 당혹스러울 수 있습니다.

[여러 로케일](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites#determining-user-s-language-and-region)에 대한 주소 양식을 사용자 정의하는 것이 귀하의 사이트에 필요할 수 있지만 위에서 설명한 대로 양식 유연성을 극대화하는 기술을 사용하는 것이 적절할 수 있습니다. 주소 형식을 현지화하지 않는 경우 다양한 주소 형식에 대처하기 위한 주요 우선 순위를 이해해야 합니다.

- 거리 이름이나 집 번호를 요구하는 것과 같이 주소 부분에 대해 지나치게 구체적으로 요청하지 마십시오.
- 가능하면 필드를 `required`로 만드는 것을 피하십시오. 예를 들어, 많은 국가의 주소에는 우편번호가 없으며 시골 주소에는 거리 또는 도로 이름이 없을 수 있습니다.
- '국가'가 아닌 '국가/지역' 'ZIP'이 아닌 'ZIP/우편번호' 등 포괄적인 이름을 사용하세요.

유연하게 유지하세요! 많은 로케일에서 '충분히 효과적으로' 사용되도록 [위의 간단한 주소 형식 예제](#address-textarea)를 채택할 수 있습니다.

#### 우편번호 주소 조회를 피하는 것을 고려하십시오. {: #postal-code-address-lookup}

일부 웹사이트는 우편번호 또는 ZIP을 기반으로 주소를 조회하는 서비스를 사용합니다. 이는 일부 사용 사례에서는 합리적일 수 있지만 잠재적인 단점을 알고 있어야 합니다.

우편번호 주소 제안은 모든 국가에서 효과적이지 않으며 일부 지역에서는 우편번호에 상당히 많은 잠재적 주소가 될 수 있습니다.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/long-list-of-addresses.mp4" type="video/mp4">
   </source></video>
  <figcaption>ZIP 또는 우편번호에는 많은 주소가 포함될 수 있습니다!</figcaption></figure>

사용자가 긴 주소 목록에서 선택하기가 어렵습니다. 특히 사용자가 서두르거나 스트레스를 받는 모바일에서는 더욱 그렇습니다. 사용자가 자동 채우기 기능을 활용하고 한 번의 탭이나 클릭으로 채워진 전체 주소를 입력하도록 하는 것이 더 쉽고 오류가 덜 발생할 수 있습니다.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/full-name-autofill.mp4" type="video/mp4">
   </source></video>
  <figcaption>단일 이름 입력으로 원 탭(원 클릭) 주소 입력이 가능합니다.</figcaption></figure>

## 결제 양식 간소화 {: #general-guidelines}

지불 양식은 결제 프로세스에서 가장 중요한 부분입니다. 잘못된 지불 양식 디자인은 [장바구니 포기](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs)의 일반적인 원인입니다. [문제는 세부 사항에 있습니다](https://en.wikipedia.org/wiki/The_devil_is_in_the_detail#cite_note-Titelman-1). 작은 결함만으로 특히 모바일에서 사용자가 구매를 포기하도록 유도할 수 있습니다. 사용자가 데이터를 가능한 한 쉽게 입력할 수 있도록 양식을 디자인해야 합니다.

### 사용자가 지불 데이터를 다시 입력하지 않도록 지원하세요. {: #payment-form-autocomplete}

지불 카드 번호, 카드 이름, 만료 월 및 연도를 포함하여 지불 카드 양식에 `autocomplete` 값을 추가해야 합니다.

- `cc-number`
- `cc-name`
- `cc-exp-month`
- `cc-exp-year`

이를 통해 브라우저는 지불 카드 세부 정보를 안전하게 저장하고 양식 데이터를 올바르게 입력하여 사용자를 지원할 수 있습니다. 자동 완성 기능이 없으면 사용자는 지불 카드 세부 정보의 물리적 기록을 유지하거나 지불 카드 데이터를 장치에 안전하지 않게 저장할 가능성이 더 큽니다.

{% Aside 'caution' %} 지불 카드 번호에서 항상 추론할 수 있기 때문에 지불 카드 유형에 선택기를 추가하지 마세요. {% endAside %}

### 지불 카드 날짜에 사용자 정의 요소를 사용하지 마세요

적절히 디자인되지 않은 경우 [사용자 정의 요소](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements)는 자동 채우기를 중단하여 결제 흐름을 방해할 수 있으며 이전 브라우저에서는 효과적이지 않을 수 있습니다. 자동 완성 기능에서 다른 모든 지불 카드 세부 정보를 사용할 수 있지만 자동 채우기가 사용자 지정 요소에 효과적이지 않았기 때문에 사용자는 만료 날짜를 찾기 위해 자신의 실제 지불 카드를 찾아야 합니다. 따라서 구매하지 않고 사이트를 떠날 수 있습니다. 대신 표준 HTML 요소를 사용하고 그에 따라 스타일을 지정하는 것을 고려하십시오.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1LIQm2Jt5PHxN0I7tni3.jpg", alt="자동 채우기를 방해하는 카드 만료 날짜에 대한 사용자 정의 요소를 보여주는 지불 양식 스크린샷.", width="800", height="916" %} <figcaption>만료 날짜를 제외한 모든 필드가 채워진 자동 완성 기능!</figcaption></figure>

### 지불 카드 및 전화번호 숫자에 단일 입력 사용 {: #single-number-input}

지불 카드 및 전화번호의 경우 단일 입력을 사용합니다. 번호를 여러 부분으로 나누지 마십시오. 그러면 사용자가 데이터를 더 쉽게 입력할 수 있고 유효성 검사가 더 간단해지며 브라우저에서 자동 채우기 기능을 사용할 수 있습니다. PIN 및 은행 코드와 같은 다른 숫자 데이터에 대해서도 동일한 작업을 수행하는 것을 고려하십시오.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7cUwamPstwSQTlbmQ4CT.jpg", alt="4가지 입력 요소로 나누어진 신용카드 필드를 표시하는 지불 양식 스크린샷.", width="800", height="833" %} <figcaption>신용카드 번호에 여러 개의 입력을 사용하지 마세요.</figcaption></figure>

### 신중하게 유효성 검사 {: #validate}

실시간으로 그리고 양식을 제출하기 전에 데이터 입력 항목에 대한 유효성을 검사해야 합니다. 유효성 검사를 수행하는 한 가지 방법은 지불 카드 입력에 `pattern` 속성을 추가하는 것입니다. 사용자가 잘못된 값으로 지불 양식을 제출하려고 하면 브라우저는 경고 메시지를 표시하고 입력에 초점을 맞춥니다. JavaScript는 필요하지 않습니다!

{% Glitch { id: 'payment-card-input', path: 'index.html', height: 170 } %}

그러나 `pattern` 정규식은 14자리(또는 그 이하)에서 20(또는 그 이상)까지의 [지불 카드 번호 길이 범위](https://github.com/jaemok/credit-card-input/blob/master/creditcard.js#L35)를 처리할 수 있을 만큼 충분히 유연해야 합니다. 결제 카드 번호 구조화에 대한 자세한 내용은 [LDAPwiki](https://ldapwiki.com/wiki/Bank%20Card%20Number)에서 확인할 수 있습니다.

사용자가 새 지불 카드 번호를 입력할 때 공백을 포함할 수 있도록 허용하세요. 실제 카드에 숫자가 표시되는 방식이기 때문입니다. 이는 사용자에게 더 친숙하고("뭔가 잘못했습니다"라고 말할 필요가 없음) 변환 흐름을 방해할 가능성이 적으며 처리하기 전에 숫자에서 공백을 쉽게 제거할 수 있습니다.

{% Aside %} 신원 확인 또는 지불 확인을 위해 일회성 비밀번호를 사용할 수 있습니다. 하지만 사용자에게 코드를 수동으로 입력하거나 이메일 또는 SMS 텍스트에서 복사하도록 요청하는 것은 오류가 발생하기 쉽고 마찰의 원인이 됩니다. [SMS OTP 양식 모범 사례](/sms-otp-form)에서 일회성 암호를 활성화하는 더 나은 방법에 대해 알아보세요. {% endAside %}

## 다양한 기기, 플랫폼, 브라우저 및 버전에서 테스트하기 {: #test-platforms}

양식 요소의 기능과 모양이 다를 수 있고 표시 영역 크기의 차이로 인해 위치 문제가 발생할 수 있으므로 사용자에게 가장 일반적인 플랫폼에서 주소 및 지불 양식을 테스트하는 것이 특히 중요합니다. BrowserStack을 사용하면 다양한 장치와 브라우저에서 [오픈 소스 프로젝트를 무료로 테스트](https://www.browserstack.com/open-source)할 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Uk7WhpDMuHtvjmWlFnJE.jpg", alt="iPhone 7 및 11에서 지불 양식 payment-form.glitch.me에 대한 스크린샷. 전체적인 지불 버튼은 iPhone 11에는 표시되지만 7에서는 표시되지 않습니다.", width="800", height="707" %} <figcaption>iPhone 7 및 iPhone 11의 동일한 페이지.<br><strong>지불 완료</strong> 버튼이 숨겨지지 않도록 더 작은 모바일 표시 영역의 패딩을 줄이십시오.</figcaption></figure>

## 분석 및 RUM 구현 {: #analytics-rum}

사용 가능성 및 성능을 로컬에서 테스트하는 것이 유용할 수 있지만 사용자가 지불 및 주소 양식을 경험하는 방식을 올바르게 이해하려면 실제 데이터가 필요합니다.

이를 위해서는 결제 페이지를 로드하는 데 소요되는 시간 또는 결제를 완료하는 데 소요되는 시간과 같은 실제 사용자 경험에 대한 데이터인 분석 및 실제 사용자 모니터링이 필요합니다.

- **페이지 분석**: 양식이 있는 모든 페이지에 대한 페이지 조회수, 이탈률 및 종료율.
- **상호 작용 분석**: [목표 유입 경로](https://support.google.com/analytics/answer/6180923?hl=en) 및 [이벤트](https://developers.google.com/analytics/devguides/collection/gtagjs/events)는 사용자가 결제 흐름을 포기한 위치와 양식과 상호 작용할 때 취하는 작업을 나타냅니다.
- **웹사이트 성능**: [사용자 중심 매트릭](/user-centric-performance-metrics)을 통해 결제 페이지가 느리게 로드되는지 알려줄 수 있고 만약 느리게 로드될 경우 그 원인이 무엇인지 알려줄 수 있습니다.

페이지 분석, 상호 작용 분석 및 실제 사용자 성능 측정은 서버 로그, 전환 데이터 및 A/B 테스트와 결합될 때 특히 유용하므로 할인 코드가 수익을 늘리는지 또는 양식 레이아웃의 변경이 전환을 개선하는지 여부와 같은 질문에 답할 수 있습니다.

이는 결과적으로 노력의 우선순위를 정하고, 변화를 일으키며, 성공에 대한 보상을 제공할 수 있는 견고한 기반을 제공합니다.

## 학습 계속 {: #resources}

- [로그인 양식 모범 사례](/sign-in-form-best-practices)
- [가입 양식 모범 사례](/sign-up-form-best-practices)
- [WebOTP API로 웹에서 전화번호 확인](/web-otp)
- [놀라운 양식 만들기](/learn/forms/)
- [모바일 양식 디자인 모범 사례](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [더 많은 기능을 갖춘 양식 컨트롤](/more-capable-form-controls)
- [액세스 가능한 양식 만들기](https://webaim.org/techniques/forms/)
- [Credential Management API를 사용하여 가입 흐름 간소화](https://developer.chrome.com/blog/credential-management-api/)
- [Frank의 우편 주소에 대한 필수 가이드(Frank's Compulsive Guide to Postal Addresses)](http://www.columbia.edu/~fdc/postal/)는 200개가 넘는 국가의 주소 형식에 대한 유용한 링크와 광범위한 지침을 제공합니다.
- [국가 목록](http://www.countries-list.info/Download-List)에는 국가 코드와 이름을 여러 언어로, 그리고 여러 형식으로 다운로드할 수 있는 도구가 있습니다.

사진 제공: [Unsplash](https://unsplash.com/photos/Q59HmzK38eQ)에서 [@rupixen](https://unsplash.com/@rupixen)
