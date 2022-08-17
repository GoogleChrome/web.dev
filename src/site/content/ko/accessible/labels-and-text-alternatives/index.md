---
layout: post
title: 레이블 및 대체 텍스트
authors:
  - robdodson
date: 2018-11-18
description: 스크린 리더가 사용자에게 음성 UI를 제공하기 위해서는 의미 있는 요소에 적절한 레이블이나 대체 텍스트가 있어야 합니다. 레이블 또는 대체 택스트는 요소에 액세스 가능한 이름을 제공합니다. 이는 액세스 가능성 트리에서 요소 의미론을 표현하기 위한 주요 속성 중 하나입니다.
---

스크린 리더가 사용자에게 음성 UI를 제공하기 위해서는 의미 있는 요소에 적절한 레이블이나 대체 텍스트가 있어야 합니다. 레이블 또는 대체 택스트는 요소에 액세스 가능한 **이름**을 제공합니다. 이는 [액세스 가능성 트리에서 요소 의미론을 표현](/semantics-and-screen-readers/#semantic-properties-and-the-accessibility-tree)하기 위한 주요 속성 중 하나입니다.

요소의 이름이 요소의 **역할**과 결합되면 사용자 컨텍스트를 제공하므로 사용자가 상호 작용하는 요소의 유형과 페이지에 표시되는 방식을 이해할 수 있습니다. 이름이 없으면 스크린 리더는 요소의 역할만 표시합니다. 페이지를 탐색하고 추가 컨텍스트 없이 "버튼", "체크상자", "이미지"가 표시되기를 기다린다고 상상해 보세요. 이러한 이유로 라벨링 및 대체 텍스트가 우수하고 접근 가능한 경험에 중요합니다.

## 요소의 이름 검사

Chrome의 DevTools를 사용하여 요소의 액세스 가능한 이름을 쉽게 확인할 수 있습니다.

1. 요소를 마우스 오른쪽 버튼으로 클릭하고 **검사**를 선택합니다. 그러면 DevTools 요소 패널이 열립니다.
2. 요소 패널에서 **접근성** 창을 찾습니다. `»` 기호 뒤에 숨겨져 있을 수 있습니다.
3. **계산된 속성** 드롭다운에서 **이름** 속성을 찾습니다.

<figure>{% Img src="image/admin/38c68DmamTCqt2LFxTmu.png", alt="", width="800", height="471" %} <figcaption> 버튼의 계산된 이름을 보여주는 DevTools 접근 가능성 창. </figcaption></figure>

{% Aside %} 자세히 알아보려면 [DevTools 접근 가능성 참조](https://developer.chrome.com/docs/devtools/accessibility/reference/)를 확인하세요. {% endAside %}

`alt{/code1 텍스트가 있는 <code data-md-type="codespan">img` 또는 `label`이 있는 `input`을 찾고 있든지 관계 없이 이러한 모든 시나리오에서 동일한 결과가 나타납니다. 요소에 액세스 가능한 이름을 부여합니다.

## 누락된 이름 확인

요소의 유형에 따라 액세스 가능한 이름을 요소에 추가하는 방법은 다양합니다. 다음 표에는 액세스 가능한 이름이 필요한 가장 일반적인 요소 유형과 추가 방법에 대한 설명 링크가 나와 있습니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>요소 유형</th>
        <th>이름 추가 방법</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>HTML 문서</td>
        <td><a href="#label-documents-and-frames">문서 및 프레임에 레이블 지정</a></td>
      </tr>
      <tr>
        <td>
<code>&lt;frame&gt;</code> 또는 <code>&lt;iframe&gt;</code> 요소</td>
        <td><a href="#label-documents-and-frames">문서 및 프레임에 레이블 지정</a></td>
      </tr>
      <tr>
        <td>이미지 요소</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">이미지 및 개체에 대한 대체 텍스트 포함</a></td>
      </tr>
      <tr>
        <td>
<code>&lt;input type="image"&gt;</code> 요소</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">이미지 및 개체에 대한 대체 텍스트 포함</a></td>
      </tr>
      <tr>
        <td>
<code>&lt;object&gt;</code> 요소</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">이미지 및 개체에 대한 대체 텍스트 포함</a></td>
      </tr>
      <tr>
        <td>버튼</td>
        <td><a href="#label-buttons-and-links">레이블 버튼 및 링크</a></td>
      </tr>
      <tr>
        <td>링크</td>
        <td><a href="#label-buttons-and-links">레이블 버튼 및 링크</a></td>
      </tr>
      <tr>
        <td>양식 요소</td>
        <td><a href="#label-form-elements">레이블 양식 요소</a></td>
      </tr>
    </tbody>
  </table>
</div>

## 문서 및 프레임 레이블 지정

모든 페이지에는 페이지 내용을 간략하게 설명하는 [`title`](https://developer.mozilla.org/docs/Web/HTML/Element/title) 요소가 있어야 합니다. `title` 요소는 페이지에 액세스 가능한 이름을 제공합니다. 스크린 리더가 페이지에 들어가면 다음 텍스트가 가장 먼저 표시됩니다.

예를 들어, 아래 페이지는 "Mary's Maple Bar Fast-Baking Recipe"라는 제목을 갖습니다.

```html/3
<!doctype html>
  <html lang="en">
    <head>
      <title>Mary's Maple Bar Fast-Baking Recipe</title>
    </head>
  <body>
    …
  </body>
</html>
```

{% Aside %} 효과적인 제목 작성에 대한 팁은 [설명이 포함된 제목 작성 가이드](/write-descriptive-text)를 참조하십시오. {% endAside %}

마찬가지로 모든 `frame` 또는 `iframe` 요소에는 `title` 속성이 있어야 합니다.

```html
<iframe title="An interactive map of San Francisco" src="…"></iframe>
```

`iframe`의 콘텐츠에는 자체 내부 `title` 요소가 포함될 수 있지만 스크린 리더는 일반적으로 프레임 경계에서 멈추고 요소의 역할("프레임")과 `title` 속성에서 제공하는 액세스 가능한 이름을 표시합니다. 이를 통해 사용자는 프레임에 들어갈지 아니면 우회할지 결정할 수 있습니다.

## 이미지 및 개체에 대한 대체 텍스트 포함

`img`는 이미지에 접근 가능한 이름을 부여하기 위해 항상 [`alt`](https://developer.mozilla.org/docs/Web/HTML/Element/img#Attributes) 속성을 동반해야 합니다. 이미지가 로드되지 않으면 `alt` 텍스트가 자리 표시자로 사용되므로 사용자는 이미지가 전달하려는 내용을 알 수 있습니다.

좋은 `alt` 텍스트를 작성하는 것은 약간의 기교가 필요하지만 따를 수 있는 몇 가지 가이드라인이 있습니다.

1. 이미지가 주변 텍스트를 읽으면 얻기 어려운 콘텐츠를 제공하는지 확인합니다.
2. 그렇다면 가능한 한 간결하게 콘텐츠를 전달합니다.

이미지가 장식 역할을 하고 유용한 콘텐츠를 제공하지 않는 경우 빈 `alt=""` 속성을 지정하여 접근성 트리에서 이미지를 제거할 수 있습니다.

{% Aside %} [WebAIM의대체 텍스트 가이드](https://webaim.org/techniques/alttext/)를 확인하여 효과적인 `alt` 텍스트 작성 방법에 대해 알아보세요. {% endAside %}

### 링크 및 입력으로서의 이미지

링크에 래핑된 이미지는 `img`의 `alt` 속성을 사용하여 사용자가 링크를 클릭할 경우 탐색할 위치를 설명해야 합니다.

```html
<a href="https://en.wikipedia.org/wiki/Google">
  <img alt="Google's wikipedia page" src="google-logo.jpg">
</a>
```

마찬가지로 `<input type="image">` 요소를 사용하여 이미지 버튼을 생성하는 경우 사용자가 버튼을 클릭할 때 발생하는 동작을 설명하는 `alt` 텍스트를 포함해야 합니다.

```html/5
<form>
  <label>
    Username:
    <input type="text">
  </label>
  <input type="image" alt="Sign in" src="./sign-in-button.png">
</form>
```

### 내장된 개체

일반적으로 Flash, PDF 또는 ActiveX와 같은 내장된 기능에 사용되는 `<object>` 요소도 대체 텍스트를 포함해야 합니다. 이미지와 유사하게 이 텍스트는 요소가 렌더링되지 않으면 표시됩니다. 대체 텍스트는 아래의 "연례 보고서"와 같이 `object` 요소 내부에 일반 텍스트로 들어갑니다.

```html
<object type="application/pdf" data="/report.pdf">
Annual report.
</object>
```

## 레이블 버튼 및 링크

버튼과 링크는 사이트 경험에 결정적인 역할을 하는 경우가 많으며 두 가지 모두 접근하기 좋은 이름을 갖는 것이 중요합니다.

### 버튼

`button` 요소는 항상 텍스트 콘텐츠를 사용하여 액세스 가능한 이름을 계산하려고 시도합니다. `form`의 일부가 아닌 버튼의 경우 텍스트 콘텐츠로 명확한 작업을 작성하는 것만으로도 액세스할 수 있는 좋은 이름을 만들 수 있습니다.

```html
<button>Book Room</button>
```

{% Img src="image/admin/tcIDzNpCHS9AlfwflQjI.png", alt="'방 예약' 버튼이 있는 모바일 양식.", width="800", height="269" %}

이 규칙의 한 가지 일반적인 예외는 아이콘 버튼입니다. 아이콘 버튼은 이미지 또는 아이콘 글꼴을 사용하여 버튼에 대한 텍스트 콘텐츠를 제공할 수 있습니다. 예를 들어, WYSIWYG(What You See Is What You Get) 편집기에서 텍스트 서식을 지정하는 데 사용한 버튼은 일반적으로 그래픽 기호일 뿐입니다.

{% Img src="image/admin/ZmQ77kLPbqd5iFOmn4SU.png", alt="왼쪽 정렬 아이콘 버튼.", width="800", height="269" %}

아이콘 버튼을 사용하여 작업할 때 `aria-label` 속성을 사용하여 명시적으로 액세스 가능한 이름을 지정하는 것이 유용할 수 있습니다. `aria-label`은 버튼 안의 모든 텍스트 콘텐츠를 재정의하므로 스크린 리더를 사용하는 모든 사람에게 작업을 명확하게 설명할 수 있습니다.

```html
<button aria-label="Left align"></button>
```

### 링크

버튼과 마찬가지로 링크는 주로 텍스트 콘텐츠에서 액세스 가능한 이름을 얻습니다. 링크를 생성할 때 사용하기 좋은 방법은 "여기" 또는 "자세히 알아보기"와 같은 채우기 단어 대신 가장 의미 있는 텍스트를 링크 자체에 넣는 것입니다.

{% Compare 'worse', 'Not descriptive enough' %}

```html
Check out our guide to web performance <a href="/guide">here</a>.
```

{% endCompare %}

{% Compare 'better', 'Useful content!' %}

```html
Check out <a href="/guide">our guide to web performance</a>.
```

{% endCompare %}

이는 페이지의 모든 링크를 나열할 수 있는 단축키를 제공하는 스크린 리더에 특히 유용합니다. 링크가 반복적인 채우기 텍스트로 가득 차 있으면 다음 단축키가 훨씬 덜 유용합니다.

<figure>{% Img src="image/admin/IPxS2dwHMyGRvGxGi5n2.jpg", alt="'여기'라는 단어로 채워진 VoiceOver 링크 메뉴.", width="519", height="469" %} <figcaption> 링크 메뉴에 의한 탐색 결과를 나타내는 macOS 용 스크린 리더 VoiceOver에 대한 예. </figcaption></figure>

## 레이블 양식 요소

레이블을 확인란과 같은 양식 요소와 연결하는 두 가지 방법이 있습니다. 두 가지 방법 중 하나를 사용하면 레이블 텍스트도 확인란의 클릭 대상이 되며, 이는 마우스 또는 터치스크린 사용자에게도 유용합니다. 레이블을 요소와 연결하려면 다음 중 하나를 수행하세요.

- 레이블 요소 내부에 입력 요소 배치

```html
<label>
  <input type="checkbox">Receive promotional offers?</input>
</label>
```

- 또는 라벨의 `for` 속성 사용 및 요소의 `id` 참조

```html
<input id="promo" type="checkbox"></input>
<label for="promo">Receive promotional offers?</label>
```

확인란 레이블이 올바르게 지정된 경우, 스크린 리더는 요소가 확인란 역할을 하고, 선택된 상태이며, 아래의 VoiceOver 예제와 같이 "홍보 제안을 수신하시겠습니까?"라는 이름을 가진 요소를 보고할 수 있습니다.

<figure>{% Img src="image/admin/WklT2ymrCmceyrGUNizF.png", alt="'홍보 제안을 수신하시겠습니까?'를 나타내는 VoiceOver 텍스트 출력", width="640", height="174" %}</figure>

{% Assessment 'self-assessment' %}
