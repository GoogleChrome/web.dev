---
title: |2

  아무도 링크한 적이 없는 과감한 링크: 텍스트 조각
subhead: 텍스트 조각을 사용하면 URL 조각에 텍스트 조각을 지정할 수 있습니다. 이러한 텍스트 조각이 있는 URL로 이동할 때 브라우저를 강조하거나 사용자의 주의를 끌 수 있습니다.
authors:
  - thomassteiner
date: 2020-06-17
updated: 2021-05-17
hero: image/admin/Y4NLEbOwgTWdMNoxRYXw.jpg
alt: ''
description: 텍스트 조각을 사용하면 URL 조각에 텍스트 조각을 지정할 수 있습니다. 이러한 텍스트 조각이 있는 URL로 이동할 때 브라우저를 강조하거나 사용자의 주의를 끌 수 있습니다.
tags:
  - blog
  - capabilities
feedback:
  - api
---

## 조각 식별자

Chrome 80은 커다란 릴리스였습니다. 여기에는 웹 작업자의 [ECMAScript 모듈](/module-workers/), [무효 병합](https://v8.dev/features/nullish-coalescing), [선택적 연결](https://v8.dev/features/optional-chaining) 등과 같이 매우 기대되는 기능이 많이 포함되어 있습니다. 릴리스는 평소와 같이 Chromium 블로그의 [블로그 게시물](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html)을 통해 발표되었습니다. 아래 스크린샷에서 블로그 게시물의 발췌문을 볼 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/egsW6tkKWYI8IHE6JyMZ.png", alt="", width="400", height="628" %} <figcaption><code>id</code> 속성이 있는 요소 주위에 빨간색 상자가 있는 Chromium 블로그 게시물.</figcaption></figure>

아마도 모든 빨간 상자가 무엇을 의미하는지 스스로에게 묻고 있을 것입니다. DevTools에서 다음 스니펫을 실행한 결과입니다. `id` 속성이 있는 모든 요소를 강조 표시합니다.

```js
document.querySelectorAll('[id]').forEach((el) => {
  el.style.border = 'solid 2px red';
});
```

페이지 URL의 [해시](https://developer.mozilla.org/docs/Web/API/URL/hash)에서 사용하는 [조각 식별자](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Fragment) 덕분에 빨간색 상자로 강조 표시된 모든 요소에 대한 딥 링크를 배치할 수 있습니다. *옆에 있는 [제품 포럼](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)의 피드백 제공* 상자에 딥 링크를 하고 싶다고 가정하고 URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#HTML1&lt;/mark&gt;</code></a>을 직접 제작해서 할 수 있습니다. 개발자 도구의 요소 패널에서 볼 수 있듯이 문제의 요소에는 값이 `id` 속성이 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/whVXhhrYwA55S3i4J3l5.png", alt="", width="600", height="97" %} <figcaption>요소의 <code>id</code>를 표시하는 개발 도구.</figcaption></figure>

JavaScript's `URL()` 생성자로 이 URL을 구문 분석하면 다른 구성 요소가 표시됩니다. `#HTML1` 값을 가진 `hash` 속성을 확인하세요.

```js/3
new URL('https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1');
/* Creates a new `URL` object
URL {
  hash: "#HTML1"
  host: "blog.chromium.org"
  hostname: "blog.chromium.org"
  href: "https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"
  origin: "https://blog.chromium.org"
  password: ""
  pathname: "/2019/12/chrome-80-content-indexing-es-modules.html"
  port: ""
  protocol: "https:"
  search: ""
  searchParams: URLSearchParams {}
  username: ""
}
*/
```

`id`를 찾기 위해 개발자 도구를 열어야 한다는 사실은 페이지의 이 특정 섹션이 블로그 게시물 작성자에 의해 링크될 가능성에 대해 많은 것을 말해줍니다.

`id` 없는 항목에 연결하려면 어떻게 합니까? *웹 작업자의 ECMAScript 모듈* 헤딩에 연결하는 것으로 가정해 보겠습니다. 아래 스크린샷에서 볼 수 있듯이 `<h1>`에 `id` 속성이 없습니다. 즉, 이 제목에 연결할 수 있는 방법이 없습니다. 이것이 텍스트 조각이 해결하는 문제입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1g4rTS1q5LKHEHnDoF9o.png", alt="", width="600", height="71" %} <figcaption><code>id</code> 없는 제목을 표시하는 개발 도구.</figcaption></figure>

## 텍스트 조각

[텍스트 조각](https://wicg.github.io/ScrollToTextFragment/) 제안은 URL 해시에 텍스트 조각을 지정하기 위한 지원을 추가합니다. 이러한 텍스트 조각이 있는 URL로 이동할 때 사용자 에이전트는 이를 강조하거나 사용자의 주의를 끌 수 있습니다.

### 브라우저 호환성

텍스트 조각 기능은 Chromium 기반 브라우저 버전 80 이상에서 지원됩니다. 글을 쓰는 시점에서 Safari와 Firefox는 이 기능을 구현하려는 의도를 공개적으로 알리지 않았습니다. Safari 및 Firefox 토론에 대한 포인터는 [관련 링크](#related-links)를 참조하십시오.

{% Aside 'success' %} 이 링크는 Twitter와 같은 일부 일반 서비스에서 사용하는 [클라이언트 측 리디렉션](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Alternative_way_of_specifying_redirections)을 통해 제공될 때 작동하지 않았습니다. 이 문제는 [crbug.com/1055455](https://crbug.com/1055455)로 추적되었으며 현재 수정되었습니다. 일반 [HTTP 리디렉션](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Principle)은 항상 제대로 작동했습니다. {% endAside %}

[보안](#security) 상의 이유로 이 기능을 사용하려면 [`noopener`](https://developer.mozilla.org/docs/Web/HTML/Link_types/noopener) 컨텍스트에서 링크를 열어야 합니다. `<a>` 앵커 마크업에 [`rel="noopener"`](https://developer.mozilla.org/docs/Web/HTML/Element/a#attr-rel)를 포함하거나 창 기능 기능의 `Window.open()` [`noopener`](https://developer.mozilla.org/docs/Web/API/Window/open#noopener)를 추가해야 합니다.

### `textStart`

가장 간단한 형태의 텍스트 조각 구문은 다음과 같습니다. 해시 기호 `#` 뒤에 `:~:text=`와 마지막으로 `textStart` 있으며 이는 링크하려는 [백분율로 인코딩된](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) 텍스트를 나타냅니다.

```bash
#:~:text=textStart
```

예를 들어 [Chrome 80의 기능을 발표](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html) 하는 블로그 게시물 제목에 있는 *웹 작업자의 ECMAScript 모듈*에 연결하고 싶다고 가정해 보겠습니다. 이 경우 URL은 다음과 같습니다.

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules%20in%20Web%20Workers&lt;/mark&gt;</code></a>

텍스트 조각이 <mark class="highlight-line highlight-line-active">이와 같이</mark> 강조됩니다. Chrome과 같은 지원 브라우저에서 링크를 클릭하면 텍스트 조각이 강조 표시되고 보기로 스크롤됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D3jwPrJlvN3FmJo3pADt.png", alt="", width="400", height="208" %} <figcaption>텍스트 조각이 보기로 스크롤되어 강조 표시되었습니다.</figcaption></figure>

### `textStart` 및 `textEnd`

이제 제목뿐만 아니라 *웹 작업자의 ECMAScript 모듈*이라는 전체 *섹션*에 연결하려면 어떻게 해야 합니까? 섹션의 전체 텍스트를 백분율로 인코딩하면 결과 URL이 비현실적으로 길어집니다.

다행히 더 좋은 방법이 있습니다. `textStart,textEnd` 구문을 사용하여 원하는 텍스트의 프레임을 지정할 수 있습니다. 따라서, I는 원하는 텍스트의 시작 퍼센트 인코딩 단어 쌍 및 쉼표 `,`로 구분하여 원하는 텍스트의 끝에 퍼센트 인코딩 된 단어 쌍을 지정합니다.

다음과 같습니다.

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers.&lt;/mark&gt;</code></a> .

`textStart`의 경우 `ECMAScript%20Modules%20in%20Web%20Workers`, 쉼표 `,` 다음에 `ES%20Modules%20in%20Web%20Workers.` `textEnd`가 옵니다. Chrome과 같은 지원 브라우저를 클릭하면 전체 섹션이 강조 표시되고 보기로 스크롤됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2yTYmKnjHTnqXkcmHF1F.png", alt="", width="400", height="343" %} <figcaption>텍스트 조각이 보기로 스크롤되어 강조 표시되었습니다.</figcaption></figure>

이제 `textStart` 및 `textEnd` 선택에 관해 궁금증이 생길 것입니다. 실제로 URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules,Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules,Web%20Workers.&lt;/mark&gt;</code></a>는 약간 더 짧으며, 양쪽에 두 단어만 있으면 작동했을 것입니다. `textStart` 및 `textEnd`를 이전 값과 비교합니다.

`textStart`와 textEnd 모두에 대해 한 단어만 사용 `textEnd`을 알 수 있습니다. URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript,Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript,Workers.&lt;/mark&gt;</code></a> 는 이제 더 짧아졌지만 강조 표시된 텍스트 조각은 더 이상 원래 원하는 것이 아닙니다. `Workers.` 단어가 처음 나오는 위치에서 멈춥니다. , 정확하지만 강조하려고 한 것은 아닙니다. 문제는 원하는 섹션이 현재 한 단어로 된 `textStart` 및 `textEnd` 값으로 고유하게 식별되지 않는다는 것입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GGbbtHBpsoFyubnISyZw.png", alt="", width="400", height="342" %} <figcaption>의도하지 않은 텍스트 조각이 보기로 스크롤되어 강조 표시되었습니다.</figcaption></figure>

### `prefix-` 및 `-suffix`

`textStart` 및 `textEnd` 대해 충분히 긴 값을 사용하는 것은 고유한 링크를 얻기 위한 한 가지 솔루션입니다. 그러나 일부 상황에서는 이것이 불가능합니다. 참고로 Chrome 80 릴리스 블로그 게시물을 예로 선택한 이유는 무엇인가요? 대답은 이번 릴리스에서 텍스트 조각이 도입되었다는 것입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yA1p3CijeDbTRwMys9Hq.png", alt="블로그 게시물 텍스트: 텍스트 URL 조각. 사용자 또는 작성자는 이제 URL에 제공된 텍스트 조각을 사용하여 페이지의 특정 부분에 연결할 수 있습니다. 페이지가 로드되면 브라우저는 텍스트를 강조 표시하고 조각을 스크롤하여 보기에 표시합니다. 예를 들어 아래 URL은 'Cat'에 대한 Wiki 페이지를 로드하고 'text' 매개변수에 나열된 콘텐츠로 스크롤합니다.", width="800", height="200" %} <figcaption>텍스트 조각 발표 블로그 게시물 발췌.</figcaption></figure>

위의 스크린샷에서 "텍스트"라는 단어가 네 번 나타나는 것을 확인하십시오. 네 번째 항목은 녹색 코드 글꼴로 작성됩니다. 이 특정 단어에 연결하려면 `textStart`를 `text`로 설정합니다. "text"라는 단어는 하나의 단어이므로 `textEnd`가 될 수 없습니다. 그렇다면 어떻게 될까요? URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=text"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=text&lt;/mark&gt;</code></a>는 제목에 이미 있는 "Text"라는 단어가 처음 나타날 때 일치합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nXxCskUwdCxwxejPSSZW.png", alt="", width="800", height="209" %} <figcaption>"텍스트"가 처음 나타날 때 일치하는 텍스트 조각.</figcaption></figure>

{% Aside 'caution' %} 텍스트 조각 일치는 대소문자를 구분하지 않습니다. {% endAside %}

다행히 해결책이 있습니다. 이런 경우에, `prefix​-`와 `-suffix`를 지정할 수 있습니다. 녹색 코드 글꼴 "text" 앞의 단어는 "the"이고 뒤의 단어는 "parameter"입니다. "텍스트"라는 단어의 다른 세 항목 중 어느 것도 동일한 주변 단어를 가지고 있지 않습니다. 이 지식을 바탕으로, 이전 URL을 조정하고 `prefix-`와 `-suffix`를 추가할 수 있습니다. 다른 매개변수와 마찬가지로 이 매개변수도 백분율로 인코딩되어야 하며 둘 이상의 단어를 포함할 수 있습니다. <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=the-,text,-parameter"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=the-,text,-parameter&lt;/mark&gt;</code></a>. 구문 분석에서 `prefix-`와 `-suffix`를 명확하게 식별하기 위해서 `textStart` 및 선택적 `textEnd`로부터 대시 `-`를 사용해 구분할 필요가 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J3L5BVSMmzGY6xdkabP6.png", alt="", width="800", height="203" %} <figcaption>"텍스트"의 원하는 발생에서 일치하는 텍스트 조각.</figcaption></figure>

### 전체 구문

텍스트 조각의 전체 구문은 아래와 같습니다. (대괄호는 선택적 매개변수를 나타냅니다.) 모든 매개변수의 값은 퍼센트로 인코딩되어야 합니다. 이것은 대시 `-` , 앰퍼샌드 `&` 및 쉼표 `,` 문자에 특히 중요하므로 텍스트 지시문 구문의 일부로 해석되지 않습니다.

```bash
#:~:text=[prefix-,]textStart[,textEnd][,-suffix]
```

각 `prefix-` , `textStart` , `textEnd` 및 `-suffix`는 단일 [블록 수준 요소](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements#Elements) 내의 텍스트와만 일치하지만 전체 `textStart,textEnd` 범위는 여러 블록에 걸쳐 있을 *수 있습니다.* 예를 들어 `:~:text=The quick,lazy dog`은 시작 문자열 "The quick"이 중단되지 않은 단일 블록 수준 요소 내에 나타나지 않기 때문에 다음 예에서 일치하지 않습니다.

```html
<div>
  The
  <div></div>
  quick brown fox
</div>
<div>jumped over the lazy dog</div>
```

그러나 다음 예에서는 일치합니다.

```html
<div>The quick brown fox</div>
<div>jumped over the lazy dog</div>
```

### 브라우저 확장 프로그램으로 텍스트 조각 URL 만들기

텍스트 조각 URL을 손으로 만드는 것은 특히 고유한지 확인하는 경우 지루합니다. 정말로 원하는 경우 사양에 몇 가지 팁이 있으며 [텍스트 조각 URL을 생성하기 위한](https://wicg.github.io/ScrollToTextFragment/#generating-text-fragment-directives) 정확한 단계가 나열되어 있습니다. 텍스트를 선택한 다음 컨텍스트 메뉴에서 "선택한 텍스트로 링크 복사"를 클릭하여 링크할 수 있는 [텍스트 조각에 링크](https://github.com/GoogleChromeLabs/link-to-text-fragment)라는 오픈 소스 브라우저 확장을 제공합니다. 이 확장은 다음 브라우저에서 사용할 수 있습니다.

- [Chrome용 텍스트 조각에 대한 링크](https://chrome.google.com/webstore/detail/link-to-text-fragment/pbcodcjpfjdpcineamnnmbkkmkdpajjg)
- [Microsoft Edge용 텍스트 조각에 대한 링크](https://microsoftedge.microsoft.com/addons/detail/link-to-text-fragment/pmdldpbcbobaamgkpkghjigngamlolag)
- [Mozilla Firefox용 텍스트 조각에 대한 링크](https://addons.mozilla.org/firefox/addon/link-to-text-fragment/)
- [Apple Safari용 텍스트 조각에 대한 링크](https://apps.apple.com/app/link-to-text-fragment/id1532224396)

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASLtFCPoHvyTKrAtKAv4.png", alt="", width="800", height="500" %}<figcaption> <a href="https://github.com/GoogleChromeLabs/link-to-text-fragment">Text Fragment</a> 브라우저 확장에 대한 링크.</figcaption></figure>

### 하나의 URL에 있는 여러 텍스트 조각

여러 텍스트 조각이 하나의 URL에 나타날 수 있습니다. 특정 텍스트 조각은 앰퍼샌드 문자 `&`로 구분해야 합니다. 다음은 3개의 텍스트 조각이 있는 링크의 예입니다. <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet&lt;mark class="highlight-line highlight-line-active"&gt;</code></a> .

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ffsq7aoSoVd9q6r5cquY.png", alt="", width="800", height="324" %}<figcaption> 하나의 URL에 3개의 텍스트 조각이 있습니다.</figcaption></figure>

### 요소 및 텍스트 조각 혼합

전통적인 요소 조각은 텍스트 조각과 결합될 수 있습니다. 예를 들어 페이지의 원본 텍스트가 변경되는 경우 의미 있는 대체를 제공하여 텍스트 조각이 더 이상 일치하지 않도록 하기 위해 동일한 URL에 둘 다 있으면 완벽합니다. URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums.&lt;/mark&gt;</code></a> *[제품 포럼](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs) 섹션의 피드백 제공* 링크에는 요소 단편(`HTML1`)과 텍스트 조각(`text=Give%20us%20feedback%20in%20our%20Product%20Forums.`)을 포함합니다:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/JRKCM6Ihrq8sgRZRiymr.png", alt="", width="237", height="121" %}<figcaption> 요소 조각과 텍스트 조각 모두와 연결합니다.</figcaption></figure>

### 조각 지시문

나는 아직 설명하지 않은 구문의 한 요소가있다 : 조각 지침 `:~:` . 위에 표시된 기존 URL 요소 단편과의 호환성 문제를 피하기 위해 [텍스트 단편 사양](https://wicg.github.io/ScrollToTextFragment/)은 단편 지시문을 도입합니다. `:~:` 구분된 URL 조각의 일부입니다. `text=`와 같은 사용자 에이전트 지침을 위해 예약되어 있으며 작성자 스크립트가 직접 상호 작용할 수 없도록 로드하는 동안 URL에서 제거됩니다. 사용자 에이전트 지침은 *지시문*이라고도 합니다. 따라서 구체적인 경우에는 `text=` *텍스트 지시문*이라고 합니다.

### 특징 감지

지원을 감지하려면 `document` `fragmentDirective` 속성을 테스트하십시오. 조각 지시문은 URL이 문서가 아닌 브라우저로 지시되는 지침을 지정하는 메커니즘입니다. 이는 작성자 스크립트와의 직접적인 상호 작용을 피하기 위한 것이므로 기존 콘텐츠에 주요 변경 사항을 도입하는 것을 두려워하지 않고 향후 사용자 에이전트 지침을 추가할 수 있습니다. 그러한 미래 추가의 한 가지 잠재적인 예는 번역 힌트가 될 수 있습니다.

```js
if ('fragmentDirective' in document) {
  // Text Fragments is supported.
}
```

{% Aside %} Chrome 80부터 Chrome 85까지, `fragmentDirective` `Location.prototype`에 정의되었습니다. 이 변경 사항에 대한 자세한 내용은 [WICG/scroll-to-text-fragment#130](https://github.com/WICG/scroll-to-text-fragment/issues/130)을 참조하십시오. {% endAside %}

기능 감지는 링크를 지원하지 않는 브라우저에 대한 텍스트 조각 링크 제공을 피하기 위해 링크가 동적으로 생성되는 경우(예: 검색 엔진에 의해) 주로 사용됩니다.

### 텍스트 조각 스타일 지정

기본적으로 브라우저는 표시 스타일과 동일한 방식으로 텍스트 조각의 스타일을 지정 [`mark`](https://developer.mozilla.org/docs/Web/HTML/Element/mark) (일반적으로 노란색 바탕에 검은색, CSS [시스템 색상](https://developer.mozilla.org/docs/Web/CSS/color_value#system_colors) `mark`). 사용자 에이전트 스타일시트에는 다음과 같은 CSS가 포함되어 있습니다.

```css
:root::target-text {
  color: MarkText;
  background: Mark;
}
```

보시다시피 브라우저는 적용된 강조 표시를 사용자 지정하는 데 사용할 수 가상 선택기(pseudo selector) [`::target-text`](https://drafts.csswg.org/css-pseudo/#selectordef-target-text)를 내포합니다. 예를 들어 텍스트 조각을 빨간색 배경에 검은색 텍스트로 디자인할 수 있습니다. 항상 그렇듯이, 재정의 스타일로 인해 접근성 문제가 발생하지 않도록 [색상 대비를 확인](https://developer.chrome.com/docs/devtools/accessibility/reference/#contrast)하고 강조 표시가 나머지 콘텐츠와 시각적으로 뚜렷하게 구분되는지 확인하십시오.

```css
:root::target-text {
  color: black;
  background-color: red;
}
```

### 폴리필 가능성

텍스트 조각 기능은 어느 정도 폴리필할 수 있습니다. JavaScript에서 기능이 구현되는 텍스트 조각에 대한 기본 제공 지원을 제공하지 않는 브라우저를 위해 [확장 프로그램](https://github.com/GoogleChromeLabs/link-to-text-fragment)에서 내부적으로 사용하는 [polyfill](https://github.com/GoogleChromeLabs/text-fragments-polyfill)을 제공합니다.

### 프로그래밍 방식 텍스트 조각 링크 생성

[폴리필](https://github.com/GoogleChromeLabs/text-fragments-polyfill)에는 가져와 텍스트 조각 링크를 생성하는 데 사용할 수 있는 `fragment-generation-utils.js` 파일이 포함되어 있습니다. 이는 아래 코드 샘플에 설명되어 있습니다.

```js
const { generateFragment } = await import('https://unpkg.com/text-fragments-polyfill/dist/fragment-generation-utils.js');
const result = generateFragment(window.getSelection());
if (result.status === 0) {
  let url = `${location.origin}${location.pathname}${location.search}`;
  const fragment = result.fragment;
  const prefix = fragment.prefix ?
    `${encodeURIComponent(fragment.prefix)}-,` :
    '';
  const suffix = fragment.suffix ?
    `,-${encodeURIComponent(fragment.suffix)}` :
    '';
  const textStart = encodeURIComponent(fragment.textStart);
  const textEnd = fragment.textEnd ?
    `,${encodeURIComponent(fragment.textEnd)}` :
    '';
  url += `#:~:text=${prefix}${textStart}${textEnd}${suffix}`;
  console.log(url);
}
```

### 분석 목적으로 텍스트 조각 얻기

많은 사이트가 라우팅을 위해 조각을 사용합니다. 이것이 브라우저가 해당 페이지를 손상시키지 않기 위해 텍스트 조각을 제거하는 이유입니다. 예를 들어 분석 목적을 위해 페이지에 대한 텍스트 조각 링크를 노출해야 할 [필요성이 인정](https://github.com/WICG/scroll-to-text-fragment/issues/128)되었지만 제안된 솔루션은 아직 구현되지 않았습니다. 현재 해결 방법으로 아래 코드를 사용하여 원하는 정보를 추출할 수 있습니다.

```js
new URL(performance.getEntries().find(({ type }) => type === 'navigate').name).hash;
```

### 보안

텍스트 조각 지시문은 [사용자 활성화](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation)의 결과인 전체(동일 페이지가 아닌) 탐색에서만 호출됩니다. 또한 목적지와 다른 출발지에서 시작하는 탐색은 목적지 페이지가 충분히 격리된 것으로 알려진 [`noopener`](https://html.spec.whatwg.org/multipage/links.html#link-type-noopener) 텍스트 조각 지시문은 메인 프레임에만 적용됩니다. 즉, iframe 내에서 텍스트가 검색되지 않고 iframe 탐색이 텍스트 조각을 호출하지 않습니다.

### 프라이버시

페이지에서 텍스트 조각이 발견되었는지 여부에 관계없이 텍스트 조각 사양의 구현이 누출되지 않는 것이 중요합니다. 요소 조각은 원래 페이지 작성자가 완전히 제어하지만 텍스트 조각은 누구나 만들 수 있습니다. 위의 예에서 `<h1>`에 `id`가 없었기 때문에 웹 작업자의 *ECMAScript 모듈* 제목에 연결할 수 있는 방법이 없었지만 누구나 텍스트 조각을 세심히 제작하여 연결할 수 있었던 방법을 기억하십시오.

악의적인 광고 네트워크 `evil-ads.example.com`을 실행했다고 생각해 보십시오. 광고 iframe 중 하나에서 텍스트 조각 URL <code>dating.example.com&amp;lt;mark class="highlight"를 사용하여 &lt;code data-md-type="codespan"&gt;dating.example.com</code>에 대한 숨겨진 교차 출처 iframe을 동적으로 생성했다고 가정해 보겠습니다. -line Highlight-line-active"&gt;#:~:text=Log%20Out&lt;/mark&gt; 사용자가 광고와 상호작용하면 "Log Out"이라는 텍스트가 발견되면 피해자가 현재 `dating.example.com`에 로그인되어 있다는 것을 알고 있으며 이를 사용자 프로파일링에 사용할 수 있습니다. 순진한 텍스트 조각 구현은 성공적인 일치가 포커스 전환을 유발해야 한다고 결정할 수 있으므로 `evil-ads.example.com`에서 `blur` 이벤트를 수신하고 매칭이 발생한 때를 알 수 있습니다. Chrome에서는 위와 같은 시나리오가 발생하지 않도록 텍스트 조각을 구현했습니다.

또 다른 공격은 스크롤 위치를 기반으로 하는 네트워크 트래픽을 악용하는 것일 수 있습니다. 회사 인트라넷 관리자와 같이 피해자의 네트워크 트래픽 로그에 액세스했다고 가정합니다. 이제 긴 인적 자원 문서에 *What to Do If You Suffer From…* 그리고 *번아웃* , *불안* 등과 같은 조건 목록이 있다고 상상해 보십시오. 목록의 각 항목 옆에 추적 픽셀을 배치할 수 있습니다. 그런 다음 문서 로드가 *번아웃* 항목 옆에 있는 추적 픽셀의 로드와 일시적으로 동시에 발생한다고 판단하면 인트라넷 관리자로서 직원이 텍스트 조각 링크를 클릭했다고 결정할 수 있습니다. `:~:text=burn%20out`을 사용하여 직원이 기밀이며 누구에게도 표시되지 않는다고 가정했을 수 있습니다. 이 예는 처음부터 다소 인위적으로 만들어졌고 악용하려면 *매우* 구체적인 전제 조건이 충족되어야 하기 때문에 Chrome 보안 팀은 탐색 시 스크롤을 구현하는 위험을 관리하기 쉽게 평가했습니다. 다른 사용자 에이전트는 대신 수동 스크롤 UI 요소를 표시하기로 결정할 수 있습니다.

선택 해제하려는 사이트의 경우 Chromium은 보낼 수 있는 [문서 정책](https://wicg.github.io/document-policy/) 헤더 값을 지원하므로 사용자 에이전트가 텍스트 조각 URL을 처리하지 않습니다.

```bash
Document-Policy: force-load-at-top
```

## 텍스트 조각 비활성화

이 기능을 사용하지 않도록 설정하기 위한 가장 쉬운 방법은 예를 들어 [ModHeader](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj)(Google 제품 아님)와 같이, HTTP 응답 헤더를 삽입 할 수 있는 확장 기능을 사용하여 응답(*not* 요청)을 삽입하는 것입니다:

```bash
Document-Policy: force-load-at-top
```

더 복잡한 또 다른 옵트아웃 방법은 엔터프라이즈 설정 [`ScrollToTextFragmentEnabled`](https://cloud.google.com/docs/chrome-enterprise/policies/?policy=ScrollToTextFragmentEnabled)를 사용하는 것입니다. macOS에서 이 작업을 수행하려면 터미널에 아래 명령을 붙여넣습니다.

```bash
defaults write com.google.Chrome ScrollToTextFragmentEnabled -bool false
```

Windows의 경우 [Google Chrome Enterprise 도움말](https://support.google.com/chrome/a/answer/9131254?hl=en) 지원 사이트의 설명서를 따르십시오.

{% Aside 'warning' %} 수행하는 작업을 확실히 알고 있을 때만 이것을 시도하십시오. {% endAside %}

## 웹 검색의 텍스트 조각

일부 검색의 경우 검색 엔진 Google은 관련 웹사이트의 콘텐츠 스니펫으로 빠른 답변이나 요약을 제공합니다. 이러한 *추천 스니펫* 은 검색이 질문 형식일 때 표시될 가능성이 가장 높습니다. 추천 스니펫을 클릭하면 사용자가 소스 웹 페이지의 추천 스니펫 텍스트로 바로 이동합니다. 이것은 자동으로 생성된 텍스트 조각 URL 덕분에 작동합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KbZgnGxZOOymLxYPZyGH.png", alt="", width="800", height="451" %} <figcaption>추천 스니펫을 보여주는 Google 검색 엔진 결과 페이지. 상태 표시줄에 텍스트 조각 URL이 표시됩니다.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4Q7zk9xBnb2uw8GRaLnU.png", alt="", width="800", height="451" %} <figcaption>클릭하면 페이지의 관련 섹션이 스크롤되어 표시됩니다.</figcaption></figure>

## 결론

텍스트 조각 URL은 웹페이지의 임의의 텍스트에 연결하는 강력한 기능입니다. 학계에서는 이를 사용하여 매우 정확한 인용 또는 참조 링크를 제공할 수 있습니다. 검색 엔진은 이를 사용하여 페이지의 텍스트 결과에 딥링크할 수 있습니다. 소셜 네트워킹 사이트는 이를 사용하여 사용자가 액세스할 수 없는 스크린샷 대신 웹페이지의 특정 구절을 공유할 수 있습니다. [텍스트 조각 URL](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&text=text,-parameter&text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%%20of%20a%20cat's%20diet)을 유용하게 사용하시기 바랍니다. [Link to Text Fragment](https://github.com/GoogleChromeLabs/link-to-text-fragment) 브라우저 확장을 반드시 설치해야 합니다.

## 관련된 링크

- [사양 초안](https://wicg.github.io/scroll-to-text-fragment/)
- [태그 검토](https://github.com/w3ctag/design-reviews/issues/392)
- [Chrome 플랫폼 상태 항목](https://chromestatus.com/feature/4733392803332096)
- [크롬 추적 버그](https://crbug.com/919204)
- [배송 의도 스레드](https://groups.google.com/a/chromium.org/d/topic/blink-dev/zlLSxQ9BA8Y/discussion)
- [WebKit-Dev 스레드](https://lists.webkit.org/pipermail/webkit-dev/2019-December/030978.html)
- [Mozilla 표준 위치 스레드](https://github.com/mozilla/standards-positions/issues/194)

## 감사의 말

텍스트 조각은 [Grant Wang](https://github.com/grantjwang)의 공헌으로 [Nick Burris](https://github.com/nickburris)와 [David Bokan](https://github.com/bokand)이 구현하고 지정했습니다. 이 기사의 철저한 검토에 애써준 [Joe Medley](https://github.com/jpmedley)에게 감사 인사를 전합니다. 영웅 이미지 제공: [Unsplash](https://unsplash.com/photos/oMpAz-DN-9I)에서 [Greg Rakozy](https://unsplash.com/@grakozy).
