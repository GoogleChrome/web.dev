---
title: 마스크 가능한 아이콘이 있는 PWA의 적응형 아이콘 지원
subhead: 지원 플랫폼에서 적응형 아이콘을 사용하는 새로운 아이콘 형식입니다.
description: 마스크 가능한 아이콘은 더 많은 제어를 제공하고 PWA가 적응형 아이콘을 사용할 수 있게 하는 새로운 아이콘 형식입니다. 마스크 가능한 아이콘을 제공하면 모든 Android 장치에서 아이콘이 멋지게 보일 수 있습니다.
authors:
  - tigeroakes
  - thomassteiner
date: 2019-12-19
updated: 2021-05-19
hero: image/admin/lzLo9JCh6bcehH2nSH0n.png
alt: 전체 원을 덮는 아이콘과 비교하여 흰색 원 안에 포함된 아이콘
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

## 마스크 가능한 아이콘은 무엇입니까? {: #what }

최근 Android 휴대폰에 PWA를 설치한 경우 아이콘이 흰색 배경으로 표시되는 것을 알 수 있습니다. Android Oreo는 다양한 기기 모델에서 다양한 모양으로 앱 아이콘을 표시하는 적응형 아이콘을 도입했습니다. 이 새로운 형식을 따르지 않는 아이콘에는 흰색 배경이 제공됩니다.

<figure>{% Img src="image/admin/jzjx6dGkXN9EdqnUzAeg.png", alt="Android의 흰색 원 안에 있는 PWA 아이콘", width="400", height="100" %}<figcaption> Android에서 투명한 PWA 아이콘이 흰색 원 안에 나타남</figcaption></figure>

마스크 가능한 아이콘은 더 많은 제어를 제공하고 PWA에서 적응형 아이콘을 사용할 수 있도록 하는 새로운 아이콘 형식입니다. 마스크 가능한 아이콘을 제공하면 아이콘이 전체 모양을 채우고 모든 Android 기기에서 멋지게 보일 수 있습니다. Firefox와 Chrome은 최근 이 새로운 형식에 대한 지원을 추가했으며 앱에서 이를 채택할 수 있습니다.

<figure>{% Img src="image/admin/J7gkg9ylP2ANlFawblze.png", alt="Android에서 전체 원을 덮는 PWA 아이콘", width="400", height="100" %}<figcaption> 마스크 가능한 아이콘이 대신 전체 원을 덮습니다.</figcaption></figure>

## 현재 아이콘이 준비되었습니까?

마스크 가능한 아이콘은 다양한 모양을 지원해야 하므로 브라우저에서 나중에 원하는 모양과 크기로 자를 수 있는 일부 패딩이 있는 불투명 이미지를 제공합니다. 궁극적으로 선택한 모양은 브라우저와 플랫폼마다 다를 수 있으므로 특정 모양에 의존하지 않는 것이 가장 좋습니다.

<figure data-float="right">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/mx1PEstODUy6b5TXjo4S.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tw7QbXq9SBjGL3UYW0Fq.mp4"], autoplay=true, loop=true, muted=true, playsinline=true %} <figcaption> 특정 플랫폼용 모양 </figcaption></figure>

다행히도 모든 플랫폼이 존중하는 잘 정의되고 [표준화된](https://w3c.github.io/manifest/#icon-masks) "최소 안전 지대"가 있습니다. 로고와 같은 아이콘의 중요한 부분은 아이콘 너비의 40%와 동일한 반경을 가진 아이콘 중앙의 원형 영역 내에 있어야 합니다. 바깥쪽 10% 가장자리는 잘릴 수 있습니다.

Chrome DevTools를 사용하여 아이콘의 어느 부분이 안전 영역 내에 있는지 확인할 수 있습니다. PWA를 연 상태에서 DevTools를 시작하고 **애플리케이션** 패널로 이동합니다. **아이콘** 섹션에서 **마스크 가능한 아이콘의 최소 안전 영역만 표시**를 선택할 수 있습니다. 안전 영역만 보이도록 아이콘이 잘립니다. 이 안전한 영역 내에서 로고가 보이면 잘 진행한 것입니다.

<figure>{% Img src="image/admin/UeKTJM2SE0SQhgnnyaQG.png", alt="가장자리가 잘린 PWA 아이콘을 표시하는 DevTools의 응용 프로그램 패널", width="762", height="423" %}<figcaption> 애플리케이션 패널</figcaption></figure>

다양한 Android 모양으로 마스크 가능한 아이콘을 테스트하려면 제가 만든 [Maskable.app](https://maskable.app/) 도구를 사용하세요. 아이콘을 열면 Maskable.app에서 다양한 모양과 크기를 시도할 수 있으며 팀의 다른 사람들과 미리보기를 공유할 수 있습니다.

## 마스크 가능한 아이콘을 어떻게 채택합니까?

기존 아이콘을 기반으로 마스크 가능한 아이콘을 만들려면 [Maskable.app 편집기](https://maskable.app/editor)를 사용할 수 있습니다. 아이콘을 업로드하고 색상과 크기를 조정한 다음 이미지를 내보냅니다.

<figure>{% Img src="image/admin/MDXDwH3RWyj4po6daeXw.png", alt="Maskable.app 편집기 스크린샷", width="670", height="569" %}<figcaption> Maskable.app Editor에서 아이콘 만들기</figcaption></figure>

마스크 가능한 아이콘 이미지를 만들고 DevTools에서 테스트했으면 새 자산을 가리키도록 [웹 앱 매니페스트](/add-manifest/)를 업데이트해야 합니다. 웹 앱 매니페스트는 웹 앱에 대한 정보를 JSON 파일로 제공하며[`icons` 배열을](/add-manifest/#icons) 포함합니다.

마스크 가능한 아이콘을 포함하여 웹 앱 매니페스트에 나열된 이미지 리소스에 대한 새 속성 값이 추가되었습니다. `purpose` 필드는 브라우저에 아이콘을 어떻게 사용해야 하는지 알려줍니다. 기본적으로 아이콘의 목적은 `"any"` 입니다. 이 아이콘은 Android의 흰색 배경 위에서 크기가 조정됩니다.

마스크 가능한 아이콘은 `"maskable"`과 같은 다른 용도를 사용해야 합니다. 이는 이미지가 아이콘 마스크와 함께 사용되어 결과를 더 잘 제어할 수 있음을 나타냅니다. 이렇게 하면 아이콘의 배경이 흰색이 아닙니다. 마스크 가능한 아이콘을 다른 장치에서 마스크 없이 사용하려는 경우 공백으로 구분된 여러 용도(예: `"any maskable"`)를 지정할 수 있습니다.

{% Aside %} `"any maskable"` 과 같이 공백으로 구분된 여러 목적을 *지정할 수 있지만* 실제로는 *해서는 안 됩니다*. `"maskable"` 아이콘을 `"any"` 아이콘으로 사용하는 것은 아이콘이 있는 그대로 사용되기 때문에 차선책입니다. 이상적으로는 `"any"` 목적을 위한 아이콘은 투명 영역을 가져야 하며 브라우저에서 추가하지 않을 것이기 때문에 사이트의 파비콘과 같은 추가 여백이 없어야 합니다. {% endAside %}

```json
{
  …
  "icons": [
    …
    {
      "src": "path/to/regular_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "path/to/maskable_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "maskable" // <-- New property value `"maskable"`
    },
    …
  ],
  …
}
```

이를 통해 자신만의 마스크 가능한 아이콘을 만들어 앱이 가장자리에서 가장자리로 멋지게 보이도록 할 수 있습니다.

## 감사의 말

이 기사는 [Joe Medley](https://github.com/jpmedley)가 검토했습니다.
