---
layout: post
title: 탭 대상의 크기가 적절하지 않습니다.
description: '"탭 대상의 크기가 적절하지 않습니다." Lighthouse 감사에 대해 알아보세요.'
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - 탭 대상
---

탭 대상은 터치 장치의 사용자가 상호 작용할 수 있는 웹 페이지 영역입니다. 버튼, 링크 및 양식 요소에 모두 탭 대상이 있습니다.

많은 검색 엔진은 페이지가 모바일 친화적인 정도에 따라 페이지 순위를 매깁니다. 탭 대상이 충분히 크고 서로 충분히 떨어져 있도록 하면 페이지가 모바일 친화적이고 접근성이 높은 것으로 평가됩니다.

## Lighthouse 탭 대상 감사에 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 너무 작거나 너무 가까운 탭 대상이 있는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6Dhlxe7vkj7gX3e5rX4B.png", alt="부적절한 크기의 탭 대상을 나타낸 Lighthouse 감사", width="800", height="206" %}</figure>

48 x 48픽셀보다 작거나 8픽셀보다 가까운 대상은 감사에 실패합니다. 감사가 실패하면 Lighthouse는 세 개의 열이 있는 테이블에 결과를 나열합니다.

<div class="table-wrapper scrollbar">
  <table>
    <tbody>
      <tr>
        <td><strong>탭 대상</strong></td>
        <td>부적절한 크기의 탭 대상입니다.</td>
      </tr>
      <tr>
        <td><strong>크기</strong></td>
        <td>대상 경계 사각형의 크기(픽셀)입니다.</td>
      </tr>
      <tr>
        <td><strong>대상 중첩</strong></td>
        <td>다른 탭 대상이(있는 경우) 너무 가깝습니다.</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-seo/scoring.njk' %}

## 탭 대상을 수정하는 방법

**1단계:** 너무 작은 탭 대상의 크기를 늘립니다. 48 x 48 px인 탭 대상은 절대 감사에 실패하지 않습니다. 더 크게 *표시*되지 않아야 하는 요소(예: 아이콘)가 있는 경우 `padding` 속성을 늘려 보세요.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ggUhPDcAaExFfcmm8kaF.jpg", alt="적절한 크기의 탭 대상", width="800", height="419" %}<figcaption> <code>padding</code>을 사용하여 요소의 모양을 바꾸지 않고 탭 대상을 더 크게 만드세요.</figcaption></figure>

**2단계:** `margin`과 같은 속성을 사용하여 서로 너무 가까운 탭 대상 사이의 간격을 늘리세요. 탭 대상 사이에는 최소 8픽셀이 있어야 합니다.

## 리소스

- [접근 가능한 탭 대상](/accessible-tap-targets): 모든 사용자가 탭 대상에 액세스할 수 있도록 하는 방법에 대한 추가 정보입니다.
- [**탭 대상의 크기가 적절하지 않습니다** Lighthouse 감사의 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/tap-targets.js)
