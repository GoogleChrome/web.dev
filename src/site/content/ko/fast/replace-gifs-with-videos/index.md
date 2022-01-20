---
layout: post
title: 애니메이션 GIF를 비디오로 대체하여 페이지를 더 빠르게 로드
authors:
  - houssein
description: Imgur 또는 Gfycat와 같은 서비스에서 애니메이션 GIF를 보고 개발 도구에서 검사해보니 GIF가 실제로 비디오라는 사실을 알게 된 적이 있었나요? 여기에는 그럴 만한 이유가 있습니다. 애니메이션 GIF는 용량이 정말 클 수 있습니다! 대용량 GIF를 동영상으로 변환하면 사용자의 대역폭을 크게 절약할 수 있습니다.
date: 2018-11-05
updated: 2019-08-29
codelabs:
  - codelab-replace-gifs-with-video
tags:
  - performance
feedback:
  - api
---

Imgur 또는 Gfycat와 같은 서비스에서 애니메이션 GIF를 보고 개발 도구에서 검사해보니 GIF가 실제로 비디오라는 사실을 알게 된 적이 있었나요? 여기에는 그럴 만한 이유가 있습니다. 애니메이션 GIF는 용량이 *정말 클 수 있습니다*.

{% Img src="image/admin/3UZ0b9dDotVIXWQT5Auk.png", alt="13.7MB gif를 보여주는 DevTools 네트워크 패널.", width="800", height="155" %}

고맙게도 로딩 성능과 관련된 이 영역은 비교적 적은 노력으로 큰 효과를 거둘 수 부분입니다! **대용량 GIF를 동영상으로 변환하면 사용자의 대역폭을 크게 절약할 수 있습니다**.

## 먼저 측정하기

Lighthouse를 사용하여 사이트에서 비디오로 변환할 수 있는 GIF가 있는지 확인하세요. DevTools에서 Audits(감사) 탭을 클릭하고 Performance(성능) 확인란을 선택합니다. 그런 다음 Lighthouse를 실행하고 보고서를 확인합니다. 변환할 수 있는 GIF가 있으면 "애니메이션 콘텐츠에 비디오 형식 사용"이라는 제안이 표시될 것입니다.

{% Img src="image/admin/KOSr9IivnkyaFk6RJ5u1.png", alt="애니메이션 콘텐츠에 비디오 형식 사용 Lighthouse 감사 실패.", width="800", height="173" %}

## MPEG 비디오 만들기

GIF를 비디오로 변환하는 방법에는 여러 가지가 있습니다. 이 가이드에서 사용하는 도구는 **[FFmpeg](https://www.ffmpeg.org/)**입니다. FFmpeg를 사용하여 GIF인 `my-animation.gif`를 MP4 비디오로 변환하려면 콘솔에서 다음 명령을 실행하세요.

```bash
ffmpeg -i my-animation.gif -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p my-animation.mp4
```

이 명령은 FFmpeg에 `my-animation.gif`를 **입력**으로 받아서(`-i` 플래그로 지정됨) `my-animation.mp4`라는 비디오로 변환할 것을 지시합니다.

libx264 인코더는 320x240픽셀과 같이 크기가 짝수인 파일에서만 작동합니다. 입력 GIF의 크기가 홀수인 경우 FFmpeg에서 '높이/너비를 2로 나눌 수 없음' 오류를 반환하지 않도록 자르기 필터를 포함시킬 수 있습니다.

```bash
ffmpeg -i my-animation.gif -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2" -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p my-animation.mp4
```

## WebM 비디오 만들기

MP4는 1999년부터 사용되었지만 WebM은 2010년에 처음 출시된 비교적 새로운 파일 형식입니다. WebM 비디오는 MP4 비디오보다 훨씬 작지만 모든 브라우저가 WebM을 지원하는 것은 아니므로 둘 모두 만드는 것이 좋습니다.

FFmpeg를 사용하여 `my-animation.gif`를 WebM 비디오로 변환하려면 콘솔에서 다음 명령을 실행하세요.

```bash
ffmpeg -i my-animation.gif -c vp9 -b:v 0 -crf 41 my-animation.webm
```

## 차이점 비교

GIF와 비디오 간의 비용 절감 효과는 상당히 클 수 있습니다.

{% Img src="image/admin/LWzvOWaOdMnNLTPWjayt.png", alt="gif의 경우 3.7MB, mp4의 경우 551KB, webm의 경우 341KB를 보여주는 파일 크기 비교.", width="800", height="188" %}

이 예에서 초기 GIF는 3.7MB인 것에 비해 MP4 버전은 551KB, WebM 버전은 341KB에 불과합니다!

## GIF 이미지를 비디오로 대체

애니메이션 GIF에는 비디오가 그대로 재현해야 하는 세 가지 주요 특성이 있습니다.

- 자동으로 재생됩니다.
- 계속해서 반복됩니다(보통은 그렇지만 반복되지 않게 할 수 있음).
- 소리가 나지 않습니다.

다행스럽게도 `<video>` 요소를 사용하여 이러한 동작을 재현할 수 있습니다.

```bash
<video autoplay loop muted playsinline></video>
```

이러한 특성을 가진 `<video>` 요소는 자동으로 재생되고, 끝없이 반복되며, 오디오를 재생하지 않고, 인라인으로 재생(전체 화면이 아닌)되는 등, 애니메이션 GIF에서 예상되는 모든 특징이 그대로 동작합니다! 🎉

마지막으로 `<video>` 요소에는 브라우저의 형식 지원에 따라 브라우저가 선택할 수 있는 다른 비디오 파일을 가리키는 `<source>` 하위 요소가 필요합니다. 브라우저가 WebM을 지원하지 않는 경우 MP4로 대체할 수 있도록 WebM과 MP4를 모두 제공하세요.

```html
<video autoplay loop muted playsinline>
  <source src="my-animation.webm" type="video/webm">
  <source src="my-animation.mp4" type="video/mp4">
</video>
```

{% Aside 'codelab' %} [애니메이션 GIF를 비디오로 대체하세요](/codelab-replace-gifs-with-video). {% endAside %}

{% Aside %} 브라우저는 어떤 `<source>`가 최적인지 판단하지 않으므로 `<source>`의 순서가 중요합니다. 예를 들어, MP4 비디오를 먼저 지정하고 브라우저가 WebM을 지원하는 경우 브라우저는 WebM `<source>`를 건너뛰고 MPEG-4를 대신 사용합니다. WebM `<source>`가 먼저 사용되도록 하려면 이를 먼저 지정하세요! {% endAside %}
