---
layout: post
title: CSS에서 센터링
subhead: 5가지 센터링 기술을 따라 일련의 테스트를 거치면서 어떤 것이 변경에 가장 탄력적인지 확인하십시오.
authors:
  - adamargyle
description: 5가지 센터링 기술에 따라 일련의 테스트를 거쳐 어떤 것이 변경에 가장 탄력적인지 확인하십시오.
date: 2020-12-16
hero: image/admin/uz0bDoJvK4kbtjozekGA.png
thumbnail: image/admin/4NFENgpVrXHi2O42mv0K.png
codelabs: codelab-centering-in-css
tags:
  - blog
  - css
  - layout
  - intl
---

CSS에서 센터링은 농담과 조롱으로 가득 찬 악명 높은 도전입니다. 2020 CSS는 모두 성장했으며 이제 이를 악물면서가 아니라 그 농담에 정직하게 웃을 수 있습니다.

비디오를 선호하는 경우 이 게시물의 YouTube 버전이 있습니다.

{% YouTube 'ncYzTvEMCyE' %}

## 당면 과제

다양한 사용 사례에서부터  센터링 수 등 **센터링에는 다양한 유형이 있습니다.** "승리" 센터링 기술의 근거를 설명하기 위해 Resilience Ringer를 만들었습니다. 각 센터링 전략에 대한 일련의 스트레스 테스트로 내부 균형을 유지하고 성능을 관찰할 수 있습니다. 마지막으로 '가장 가치 있는' 기술은 물론 최고 득점 기술까지 공개합니다. 새로운 센터링 기술과 솔루션을 알아보십시오.

### Resilience Ringer

Resilience Ringer는 센터링 전략이 국제 레이아웃, 다양한 크기의 뷰포트, 텍스트 편집 및 동적 콘텐츠에 탄력적이어야 한다는 신념을 나타냅니다. 이러한 원칙은 센터링 기술이 견딜 수 있도록 다음과 같은 탄력성 테스트를 형성하는 데 도움이 되었습니다.

1. **스퀴시:** 센터링은 너비의 변경 사항을 처리할 수 있어야 합니다.
2. **스퀴시:** 센터링은 너비의 변경 사항을 처리할 수 있어야 합니다.
3. **복제:** 가운데 맞춤은 항목 수에 따라 동적이어야 합니다.
4. **편집:** 센터링은 콘텐츠의 길이와 언어에 따라 동적이어야 합니다.
5. **흐름:** 센터링은 문서 방향 및 쓰기 모드에 구애받지 않아야 합니다.

승리 솔루션은 뭉개지고, 찌그러지고, 복제되고, 편집되고, 다양한 언어 모드와 방향으로 바뀌면서 콘텐츠를 중앙에 유지하여 탄력성을 보여야 합니다. 믿을 수 있고 탄력적이며 안전한 센터.

#### 범례

컨텍스트에서 일부 메타 정보를 유지하는 데 도움이 되는 몇 가지 시각적 색상 힌트를 제공했습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4K35cL1tVpEsGqb4FgKp.png", alt="", width="800", height="438" %}<figcaption></figcaption></figure>

- 분홍색 테두리는 센터링 스타일의 소유권을 나타냅니다.
- 회색 상자는 항목을 중앙에 배치하려는 컨테이너의 배경입니다.
- 각 하위 항목의 배경색은 흰색이므로 센터링 기술이 하위 상자 크기에 미치는 영향을 확인할 수 있습니다(있는 경우).

## 5명의 참가자

5가지 센터링 테크닉이 Resilience Ringer에 들어가고, 오직 하나만 Resilience Crown 👸을 받게 됩니다.

### 1. 콘텐츠 센터

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/content-center-ringer-cycle.mp4">
  </source></video>
  <figcaption><a href="https://github.com/GoogleChromeLabs/ProjectVisBug#visbug">VisBug</a>로 콘텐츠 편집 및 복제</figcaption></figure>

1. **스퀴시** : 굉장해!
2. **스쿼시** : 좋아!
3. **중복** : 훌륭합니다!
4. **편집** : 훌륭합니다!
5. **흐름** : 좋아!

`display: grid`와 `place-content` 약칭의 간결함을 이기기는 어려울 것입니다. 하위 항목을 집합적으로 중앙에 정렬하고 양쪽 맞춤하므로 읽을 요소 그룹에 대한 견고한 중앙 정렬 기술입니다.

```css
.content-center {
  display: grid;
  place-content: center;
  gap: 1ch;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} - 제한된 공간과 오버플로에서도 콘텐츠가 중앙에 배치됩니다. - 중앙 정렬 편집 및 유지 관리가 모두 한 곳에서 이루어집니다. - 간격은 _n_개의 하위 항목 간에 동일한 간격을 보장합니다. - 그리드는 기본적으로 행을 생성합니다.</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true"><li data-md-type="list_item" data-md-list-type="unordered">가장 넓은 자식( <code data-md-type="codespan">max-content</code> )은 나머지 모든 항목의 너비를 설정합니다. 이것에 대해서는 <a href="#gentle-flex" data-md-type="link">Gentle Flex</a>에서 자세히 논의할 것입니다.</li></ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

일반적으로 단락과 헤드 라인, 프로토 타입, 또는 읽기 중심 필요한 것을 포함하는 매크로 레이아웃에 **적합합니다.**

{% Aside %} `place-content`는 `display: grid` 전용이 아닙니다. `display: flex` `place-content` 및 `place-item` [약칭](https://codepen.io/argyleink/pen/PoqWOPZ)의 이점을 누릴 수 있습니다. {% endAside %}

### 2. Gentle Flex

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gentle-flex-ringer-cycle.mp4">
  </source></video></figure>

1. **스퀴시:** 굉장해!
2. **스쿼시:** 좋아!
3. **중복:** 훌륭합니다!
4. **편집:** 훌륭합니다!
5. **흐름:** 좋아!

Gentle Flex는 진정한 센터링 *전용* 전략입니다. 부드럽고 온화 `place-content: center`와 달리 센터링 중에 하위 상자 크기가 변경되지 않기 때문입니다. 가능한 한 부드럽게 모든 항목이 쌓이고 중앙에 배치되고 간격이 지정됩니다.

```css
.gentle-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} - 정렬, 방향 및 배포만 처리 - 편집 및 유지 관리가 모두 한 곳에서 수행됨 - 간격은 _n_ 하위 항목 사이에 동일한 간격을 보장합니다.</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true"><li data-md-type="list_item" data-md-list-type="unordered">대부분의 코드 라인</li></ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

매크로 및 마이크로 레이아웃 모두에 **적합합니다.**

{% Aside "key-term" %} **매크로 레이아웃**은 국가의 주 또는 영토와 같습니다. 매우 높은 수준의 넓은 적용 범위입니다. 매크로 레이아웃으로 생성된 영역은 더 많은 레이아웃을 포함하는 경향이 있습니다. 레이아웃이 덮는 표면이 적을수록 매크로 레이아웃이 적어집니다. 레이아웃이 더 적은 표면적을 포함하거나 더 적은 레이아웃을 포함함에 따라 더 마이크로 레이아웃이 됩니다. {% endAside %}

### 3. 오토봇

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/autobot-ringer-cycle.mp4">
  </source></video></figure>

1. **스퀴시:** 굉장해
2. **스쿼시:** 훌륭하다
3. **중복:** 좋아
4. **편집:** 훌륭하다
5. **흐름:** 훌륭하다

컨테이너는 정렬 스타일 없이 flex로 설정되는 반면, 직계 자식은 자동 여백으로 스타일이 지정됩니다. `margin: auto` 요소의 모든 면에서 자동으로 작업하는 데에는 향수를 불러일으키고 멋진 것이 있습니다.

```css
.autobot {
  display: flex;
}
.autobot > * {
  margin: auto;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} - 재미있는 트릭 - 빠르고 더러운</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">넘칠 때 어색한 결과</li>
<li data-md-type="list_item" data-md-list-type="unordered">간격 대신 분포에 대한 의존은 측면에 닿는 하위 항목과 함께 레이아웃이 발생할 수 있음을 의미합니다.</li>
<li data-md-type="list_item" data-md-list-type="unordered">제자리에 "밀어넣는" 것은 최적이 아닌 것처럼 보이며 하위 상자 크기가 변경될 수 있습니다.</li>
</ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

아이콘 또는 의사 요소의 센터링에 **적합합니다.**

### 4. 플러피 센터

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/fluffy-center-ringer-cycle.mp4">
  </source></video></figure>

1. **스퀴시:** 나쁨
2. **스쿼시:** 나쁨
3. **중복:** 나쁨
4. **편집:** 훌륭합니다!
5. **흐름:** 좋아! (논리적 속성을 사용하는 한)

참가자 "플러피 센터"는 단연코 가장 맛있는 소리를 내는 경쟁자이며 전적으로 요소/하위 항목 소유의 유일한 센터링 기술입니다. 우리 솔로 내부 핑크 테두리가 보이시나요!?

```css
.fluffy-center {
  padding: 10ch;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} - 콘텐츠 보호 - Atomic - 모든 테스트에는 이 중심 전략이 비밀리에 포함되어 있습니다. - Word space is gap</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">쓸모가 없다는 착각</li>
<li data-md-type="list_item" data-md-list-type="unordered">컨테이너와 품목 사이에 충돌이 있습니다. 자연스럽게 각각의 크기가 매우 확고하기 때문입니다.</li>
</ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

단어나 구문 중심의 센터링, 태그, 알약, 버튼, 칩 등에 **적합합니다.**

### 5. 팝 &amp; 플롭

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/popnplop-ringer-cycle.mp4">
  </source></video></figure>

1. **스퀴시:** 양호
2. **스쿼시:** 양호
3. **중복:** 나쁨
4. **편집:** 좋음
5. **흐름:** 좋음

이것은 절대 위치가 정상적인 흐름에서 요소가 불쑥 튀어나오기 때문에 "팝"이라고 합니다. 이름의 "플롭" 부분은 내가 가장 유용하다고 생각하는 부분에서 유래했습니다. 콘텐츠 크기에 유연하고 역동적인 고전적이고 편리한 오버레이 센터링 기술입니다. 때로는 다른 UI 위에 UI를 배치해야 하는 경우가 있습니다.

<div class="switcher">{% Compare 'better', 'Pros' %} - 유용함 - 신뢰할 수 있음 - 필요할 때 매우 유용합니다.</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">음수 백분율 값이 있는 코드</li>
<li data-md-type="list_item" data-md-list-type="unordered">
<code data-md-type="codespan">position: relative</code> 필요: 포함하는 블록을 강제로 기준</li>
<li data-md-type="list_item" data-md-list-type="unordered">초기 및 어색한 줄 바꿈</li>
<li data-md-type="list_item" data-md-list-type="unordered">추가 노력 없이 포함 블록당 1개만 있을 수 있습니다.</li>
</ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

조동사, 토스트와 메시지, 스택 및 깊이 효과, 팝오버에 **적합합니다.**

## 승자

섬에서 1개의 센터링 기술만 가질 수 있다면 그것은…

[드럼 롤]

**젠틀 플렉스** 🎉

```css
.gentle-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
```

매크로 및 마이크로 레이아웃 모두에 유용하기 때문에 내 스타일시트에서 항상 찾을 수 있습니다. 내 기대와 일치하는 결과를 제공하는 신뢰할 수 있는 만능 솔루션입니다. 또한 나는 본질적인 크기 조정 중독자이기 때문에 이 솔루션으로 졸업하는 경향이 있습니다. 사실, 입력해야 할 것이 많지만 이것이 제공하는 이점은 추가 코드보다 큽니다.

### MVP

**플러피 센터**

```css
.fluffy-center {
  padding: 2ch;
}
```

플러피 센터는 너무 미세해서 센터링 기술로 간과하기 쉽지만 제 센터링 전략의 핵심입니다. 너무 원자적이어서 가끔 그것을 사용하고 있다는 사실을 잊어버립니다.

### 결론

어떤 유형의 것들이 센터링 전략을 깨뜨립니까? 탄력성 링거에 추가할 수 있는 다른 과제는 무엇입니까? 컨테이너의 해석과 자동 높이 스위치를 고려했습니다. 그 외에는 무엇이 있을까요!?

이제 방법을 알았으니 어떻게 하시겠습니까?! 접근 방식을 다양화하고 웹에서 구축하는 모든 방법을 알아보겠습니다. 이 게시물의 코드랩을 따라 이 게시물에 있는 것처럼 자신만의 센터링 예제를 만드십시오. 버전을 [트윗](https://twitter.com/argyleink)하면 아래 [커뮤니티 리믹스](#community-remixes) 섹션에 추가하겠습니다.

## 커뮤니티 리믹스

- [블로그 게시물](https://css-tricks.com/centering-in-css/)을 사용한 [CSS 트릭](https://css-tricks.com/)
