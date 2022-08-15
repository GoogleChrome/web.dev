---
layout: post
title: 웹 개발자의 관점에서 미니앱에 대한 생각을 정리하며
authors:
  - thomassteiner
date: 2021-03-03
updated: 2021-06-12
description: |
  틀에서 벗어난 사고와 또다른 곳에서의 영감을 수용하는 것은 웹의 더 나은 미래를 위해서 반드시 도움이 된다는 관찰과 함께 미니앱에 대한 글타래를 마무리해요.
tags:
  - mini-apps
---

{% Aside %}
이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 그래서 어떻게 되는건가요?

미니앱에 대해서 조사하고 글을 작성하는 것은 상당히 힘들었지만, 후회하진 않아요.
한편으로는 미니앱의 성공은 그 창조자들의 접근 방식이 옳았음을 증명해요.
또다른 한편으로 그들의 성공은 슈퍼앱이 성공한 아주 일부 지역에서만 성공했어요.
분명한 사실은, 이 생태계가 엄청나게 흥미로우며 알아볼 가치가 있다는 점이에요.
이 글타래는 미니앱을 사용하고 만드는 다양한 면에 대해서 깊이 알아봤어요.
[개발자 도구](/mini-app-devtools/) 경험부터
[마크업](/mini-app-markup-styling-and-scripting/#markup-languages),
[스타일링](/mini-app-markup-styling-and-scripting/#styling), 그리고
[스크립팅](/mini-app-markup-styling-and-scripting/#scripting)에 대한 접근, 그리고
[컴포넌트 모델](/mini-app-components/), 그리고 마지막으로 전체적인
[아키텍처](/mini-app-project-structure-lifecycle-and-bundling/)에 대해서 다뤘어요.
미니앱은 앱과 웹 개발자들에게 영감과 가르침을 줄 기회를 제공해요.

[웹 앱을 미니앱 방식으로 만드는](/mini-app-example-project/) 제 첫 실험은 성공적이었어요.
향후 연구 과제로 이 모델이 얼마나 성능을 내는지, 그리고 웹앱의 다양한 형태를 수용할만큼 유연한지 알아봐야 해요.
제 현재 임시방편 접근은 각종 코드를 `mini-app.js`라는 전용 라이브러리로 묶는 방식이라 할 수 있겠네요.
흥미로운 점으로, 이런 방식의 프로그래밍은 `frameset`이라는 과거 프로그래밍 방식과 유사하다는거예요.
그게 단지 오늘날에는 문서가 아니라 앱에 대한 것일 뿐이고요.

저는 미니앱 개발자 도구에서 배우는 것으로 전체 웹 개발 경험을 향상 시킬 수 있는 대담한 가능성을 확인했어요.

간단한 [(원격) 기기 상 테스트 기능](/mini-app-devtools/#simulator-and-real-device-testing-and-debugging)과
패키징, [빌딩](/mini-app-project-structure-lifecycle-and-bundling/#the-build-process) 경험,
[IDE](/mini-app-devtools/#mini-app-ides)와 개발자 도구의 결합 등은 개발자의 삶을 편하게 할만한 많은 환경을 제공해요.

## 마무리하며

기능 관점으로 볼때, 웹은 브라우저를 막론하고 릴리즈를 거듭하며 점점 더 강력해지고 있어요.
계속해서 자라나는 [기능들의 목록](https://developer.chrome.com/blog/fugu-status/)은 우리가 수년 전 상상하지 못했던 가능성들을 열고 있어요.
동시에, [미니앱 표준화](/mini-app-standardization/)의 필요성은 미니앱 개발자들이 동일한 미니앱을
여러 슈퍼앱에 걸쳐 재개발할 여력이나 의사가 없다는 것을 보여줘요.
웹은 특히나 브라우저 간의 구현 차이로 인해 파편화로부터 자유롭지 않지만,
머지 않은 미래에 브라우저 단에서 미니앱을 웹에서 구동할 수 있는 추상화를 제공할지도 모르고요.
결론적ㅇ으로, 이 모든 것들이 어디로 나아갈지 궁금해요.
틀에서 벗어난 사고와 또다른 곳에서의 영감을 수용하는 것은 웹의 더 나은 미래를 위해서 반드시 도움이 된다는 관찰과 함께 미니앱에 대한 글타래를 마무리할게요.

{% Aside 'success' %}
축하해요. [미니앱 모음집](/mini-apps/)의 마지막에 이르렀어요.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
