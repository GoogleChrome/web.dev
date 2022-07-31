---
layout: post
title: 파사드를 사용하여 타사 리소스를 지연 로드
description: |2

  파사드를 사용하여 타사 리소스를 지연 로드할 수 있는 기회에 대해 알아보세요.
date: 2020-12-01
web_lighthouse:
  - third-party-facades
---

[타사 리소스](/third-party-javascript/)는 종종 광고 또는 동영상을 표시하고 소셜 미디어와 통합하는 데 사용됩니다. 기본 접근 방식은 페이지가 로드되는 즉시 타사 리소스를 로드하는 것이지만 이렇게 하면 페이지 로드가 불필요하게 느려질 수 있습니다. 타사 콘텐츠가 중요하지 않은 경우 [지연 로드](/fast/#lazy-load-images-and-video)를 통해 이 성능 하락을 줄일 수 있습니다.

이 감사는 상호 작용 시 느리게 로드될 수 있는 타사 임베드를 강조합니다. 이 경우 사용자가 상호 작용할 때까지 타사 콘텐츠 대신 *파사드*가 사용됩니다.

{% Aside 'key-term' %}

*파사드*는 실제 내장된 타사 요소와 유사해 보이지만 작동하지 않는 정적 요소이므로 페이지 로드에 대한 부담이 훨씬 적습니다.

{% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cvQ4fxFUG5MIXtUfi77Z.jpg", alt="파사드와 함께 YouTube 내장 플레이어를 로드하는 예입니다. 파사드의 무게는 3KB이고 무게가 540KB인 플레이어는 상호작용 시 로드됩니다.", width="800", height="521" %}<figcaption> 파사드가 있는 YouTube 내장 플레이어를 로드 중입니다.</figcaption></figure>

## Lighthouse가 지연 가능한 타사 콘텐츠를 감지하는 방법

Lighthouse는 소셜 버튼 위젯 또는 비디오 콘텐츠(예: YouTube 내장 플레이어)와 같이 지연될 수 있는 타사 제품을 찾습니다.

연기 가능한 제품 및 사용 가능한 외관에 대한 데이터는 [타사 웹에서 유지 관리됩니다](https://github.com/patrickhulce/third-party-web/).

페이지가 이러한 타사 콘텐츠 중 하나에 속한 리소스를 로드하면 감사가 실패합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/R0osncucBqYCIZfC85Hu.jpg", alt="Vimeo 내장 플레이어 및 Drift 라이브 채팅을 강조하는 Lighthouse 타사 파사드 감사.", width="800", height="517", class=" w-스크린샷" %}<figcaption> Lighthouse 타사 파사드 감사.</figcaption></figure>

## 파사드로 타사 콘텐츠를 연기하는 방법

HTML에 직접 타사 임베드를 추가하는 대신 실제 포함된 타사와 유사한 정적 요소가 있는 페이지를 로드합니다. 상호작용 패턴은 다음과 같아야 합니다.

1. 로드 시: 페이지에 파사드를 추가합니다.

2. 마우스 오버 시: 파사드는 타사 리소스에 미리 연결됩니다.

3. 클릭 시: 외관이 타사 제품으로 교체됩니다.

## 추천 파사드

일반적으로 비디오 임베드, 소셜 버튼 위젯 및 채팅 위젯은 모두 파사드 패턴을 사용할 수 있습니다. 아래 목록은 오픈 소스 파사드에 대한 권장 사항을 제공합니다. 정면을 선택할 때 크기와 기능 세트 간의 균형을 고려하십시오. [vb/lazyframe](https://github.com/vb/lazyframe) 과 같은 지연 iframe 로더를 사용할 수도 있습니다.

### YouTube 내장 플레이어

- [paulirish/lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed)

- [justinribeiro/lite-youtube](https://github.com/justinribeiro/lite-youtube)

- [Daugilas/lazyYT](https://github.com/Daugilas/lazyYT)

### Vimeo 내장 플레이어

- [luwes/lite-vimeo-embed](https://github.com/luwes/lite-vimeo-embed)

- [slightlyoff/lite-vimeo](https://github.com/slightlyoff/lite-vimeo)

### 실시간 채팅(Intercom, Drift, Help Scout, Facebook Messenger)

- [calibreapp/react-live-chat-loader](https://github.com/calibreapp/react-live-chat-loader)([블로그 게시물](https://calibreapp.com/blog/fast-live-chat))

{% Aside 'caution' %}

파사드가 실제 콘텐츠의 모든 기능을 갖고 있지 않기 때문에 파사드가 있는 타사 콘텐츠를 지연 로드할 때 몇 가지 절충점이 있습니다. 예를 들어, Drift Live Chat 풍선에는 새 메시지 수를 나타내는 배지가 있습니다. `requestIdleCallback`을 실행한 후 실제 채팅 위젯이 로드될 때 말풍선이 나타납니다. 비디오 삽입의 경우 느리게 로드되면 자동 재생이 일관되게 작동하지 않을 수 있습니다.

{% endAside %}

## 나만의 파사드 쓰기

위에서 설명한 상호 작용 패턴을 사용하는 [맞춤형 파사드 솔루션을 구축](https://wildbit.com/blog/2020/09/30/getting-postmark-lighthouse-performance-score-to-100#:~:text=What%20if%20we%20could%20replace%20the%20real%20widget)하도록 선택할 수 있습니다. 파사드는 지연된 타사 제품과 비교하여 훨씬 작아야 하며 제품의 모양을 모방할 수 있는 충분한 코드만 포함해야 합니다.

위 목록에 솔루션을 포함시키려면 [제출 프로세스](https://github.com/patrickhulce/third-party-web/blob/master/facades.md)를 확인하세요.

## 참고 자료

[파사드 감사를 사용하여 타사 리소스를 지연 로드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/third-party-facades.js)하는 소스 코드.
