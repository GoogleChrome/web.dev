---
layout: post
title: 올바른 크기의 이미지 제공
authors:
  - katiehempenius
description: 우리 모두 봤습니다. 페이지에 이미지를 추가하기 전에 축소하는 것을 잊으셨습니다. 이미지는 괜찮아 보이지만, 사용자의 데이터를 낭비하고 페이지 성능을 저하시키고 있습니다.
date: 2018-11-05
wf_blink_components: 해당 없음
codelabs:
  - codelab-serve-images-correct-dimensions
tags:
  - performance
---

우리 모두 봤습니다. 페이지에 이미지를 추가하기 전에 축소하는 것을 잊으셨습니다. 이미지는 괜찮아 보이지만, 사용자의 데이터를 낭비하고 페이지 성능을 저하시키고 있습니다.

## 잘못된 크기의 이미지 식별

Lighthouse를 사용하면 크기가 잘못된 이미지를 쉽게 식별할 수 있습니다. 성능 감사(**Lighthouse &gt; 옵션 &gt; 성능**)를 실행하고 **적절한 크기의 이미지** 감사 결과를 찾습니다. 감사에는 크기를 조정해야 하는 모든 이미지가 나열됩니다.

## 올바른 이미지 크기 결정

이미지 크기 조정은 매우 복잡할 수 있습니다. 이러한 이유로 우리는 "좋음"과 "더 좋음"의 두 가지 접근 방식을 제공했습니다. 둘 다 성능이 향상되지만 "더 나은" 접근 방식을 이해하고 구현하는 데 시간이 조금 더 걸릴 수 있습니다. 그러나 더 큰 성능 향상으로 보상을 받을 수도 있습니다. 귀하를 위한 최선의 선택은 편안하게 구현할 수 있는 것입니다.

### CSS 단위에 대한 간략한 참고 사항

이미지를 포함하여 HTML 요소의 크기를 지정하기 위한 두 가지 유형의 CSS 단위가 있습니다.

- 절대 단위: 절대 단위를 사용하여 스타일이 지정된 요소는 장치에 관계없이 항상 동일한 크기로 표시됩니다. 유효한 절대 CSS 단위의 예: px, cm, mm, in.
- 상대 단위: 상대 단위를 사용하여 스타일이 지정된 요소는 지정된 상대 길이에 따라 다양한 크기로 표시됩니다. 유효한 상대 CSS 단위의 예: %, vw(1vw = 뷰포트 너비의 1%), em(1.5em = 글꼴 크기의 1.5배).

### "좋은" 접근 방식

다음을 기반으로 크기 조정이 있는 이미지의 경우…

- **상대 단위**: 모든 장치에서 작동하는 크기로 이미지 크기를 조정합니다.

분석 데이터(예: Google Analytics)를 확인하여 사용자가 일반적으로 사용하는 디스플레이 크기를 확인하는 것이 도움이 될 수 있습니다. 또는 [screensiz.es](http://screensiz.es/)는 많은 일반 장치의 디스플레이에 대한 정보를 제공합니다.

- **절대 단위**: 이미지가 표시되는 크기와 일치하도록 이미지 크기를 조정합니다.

DevTools Elements 패널을 사용하여 이미지가 표시되는 크기를 결정할 수 있습니다.

{% Img src="image/admin/pKQa0Huu0KGInOekdz6M.png", alt="DevTools 요소의 패널", width="800", height="364" %}

### "더 나은" 접근 방식

다음을 기반으로 크기 조정이 있는 이미지의 경우…

- **절대 단위:** [srcset](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-srcset) 및 [크기](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-sizes) 속성을 사용하여 다양한 디스플레이 밀도에 대해 다양한 이미지를 제공합니다. [(여기](/serve-responsive-images)에서 반응형 이미지에 대한 가이드를 읽어보세요.)

"디스플레이 밀도"는 디스플레이마다 픽셀 밀도가 다르다는 사실을 나타냅니다. 다른 모든 조건이 동일하면 높은 픽셀 밀도 디스플레이가 낮은 픽셀 밀도 디스플레이보다 더 선명하게 보입니다.

결과적으로 사용자가 장치의 픽셀 밀도에 관계없이 가능한 가장 선명한 이미지를 경험하게 하려면 여러 이미지 버전이 필요합니다.

{% Aside %} 일부 사이트에서는 이러한 이미지 품질 차이가 중요하다고 생각하고 일부 사이트에서는 그렇지 않습니다. {% endAside %}

반응형 이미지 기술을 사용하면 여러 이미지 버전을 나열하고 장치에서 가장 적합한 이미지를 선택할 수 있습니다.

- **상대 단위:** 반응형 이미지를 사용하여 표시 크기에 따라 다양한 이미지를 제공합니다. [(여기](/serve-responsive-images)에서 가이드를 읽으십시오.)

모든 장치에서 작동하는 이미지는 더 작은 장치의 경우 불필요하게 커집니다. 반응형 이미지 기술, 특히 [srcset](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-srcset%22) 및 [크기](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-sizes)를 사용하면 여러 이미지 버전을 지정하고 장치에서 가장 적합한 크기를 선택할 수 있습니다.

## 이미지 크기 조정

어떤 접근 방식을 선택하든 ImageMagick을 사용하여 이미지 크기를 조정하는 것이 도움이 될 수 있습니다. [ImageMagick](https://www.imagemagick.org/script/index.php)은 이미지를 만들고 편집하는 데 가장 널리 사용되는 명령줄 도구입니다. 대부분의 사람들은 GUI 기반 이미지 편집기보다 CLI를 사용할 때 훨씬 빠르게 이미지 크기를 조정할 수 있습니다.

원본 크기의 25%로 이미지 크기 조정:

```bash
convert flower.jpg -resize 25% flower_small.jpg
```

"너비 200px x 높이 100px"에 맞게 이미지 크기 조정:

```bash
# macOS/Linux
convert flower.jpg -resize 200x100 flower_small.jpg

# Windows
magick convert flower.jpg -resize 200x100 flower_small.jpg
```

많은 이미지의 크기를 조정하는 경우 스크립트나 서비스를 사용하여 프로세스를 자동화하는 것이 더 편리할 수 있습니다. 반응형 이미지 가이드에서 이에 대해 자세히 알아볼 수 있습니다.

## 확인하기

모든 이미지의 크기를 조정했으면 Lighthouse를 다시 실행하여 누락된 항목이 없는지 확인하십시오.
