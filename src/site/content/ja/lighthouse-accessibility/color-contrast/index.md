---
layout: post
title: 背景色と前景色のコントラスト比が不十分である
description: すべてのテキストのカラーコントラストが十分であることを確認して、ウェブベースにアクセシビリティを改善する方法について学びます。
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - color-contrast
---

コントラスト比が低いテキスト、つまり明るさが背景の明るさに近すぎるテキストは、読みにくい場合があります。たとえば、白い背景に薄い灰色のテキストを表示すると、ユーザーが文字の形を区別するのが難しくなるため、文章が理解しにくくなり、読むスピードも遅くなってしまいます。

この問題は視力の弱い人にとっては特に辛いものですが、テキストのコントラストが低いことは、すべてのユーザーの読書体験に悪影響を与えかねません。たとえば、屋外でモバイルデバイスを使って何を読もうとしたことがある方なら、テキストのコントラストが不十分で困ったという経験をしたことがあるのではないでしょうか。

## Lighthouse によるカラーコントラスト監査が失敗する原因

Lighthouse は、背景色と前景色のコントラスト比の高さが不十分なテキストをフラグします。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hD4Uc22QqAdrBLdRPhJe.png", alt="背景色と前景色のコントラスト比が不十分であることを示す Lighthouse 監査", width="800", height="343" %}</figure>

Lighthouse は <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">WCAG2.1 の成功基準 1.4.3</a> を使ってテキストのカラーコントラストを評価します。

- 18 pt、または14 ptで太字のテキストには、3：1のコントラスト比が必要です。
- 他のすべてのテキストには、4.5 : 1 のコントラスト比が必要です。

本監査の性質上、Lighthouse は画像の上に表示されるテキストのカラーコントラストは確認できません。

{% Aside 'caution' %}バージョン 2.1 で、WCAG はカラーコントラストの要件の幅を広げ、[ユーザーインターフェイス要素と画像](https://www.w3.org/TR/WCAG21/#non-text-contrast)が含まれるようになりました。Lighthouse はそうした要素をチェックしませんが、サイト全体が視力の弱い人にとって利用しやすいものであるように、私たちは手動でチェックしておく必要があります。{% endAside %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## テキストのカラーコントラストが十分であることを確認する方法

ページ上のすべてのテキストが、<a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">WCAGで指定されている</a>最小のカラーコントラスト比を満たしていることを確認してください。

- 18 pt または 14pt で太字のテキストの場合は 3 : 1
- 他のすべてのテキストは 4.5 : 1

コントラストの要件を満たす色を見つける方法に、Chrome DevTools のカラーピッカーを使用するという方法があります。

1. チェックする要素を右クリック (Mac の場合は `Command`キーを押しながらクリック) して、**Inspect** (検査) を選択します。
2. {**Elements** (要素) ウィンドウの **Styles** (スタイル) タブで、対象の要素の `color` 値を見つけます。
3. 値の横にあるカラーサムネイルをクリックします。

カラーピッカーは、フォントのサイズと太さを考慮して、対象の要素がカラーコントラストの要件を満たしているかどうかを示します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/osaU6NOcyElBALiXmRa5.png", alt="Chrome DevTools のカラーピッカーのカラーコントラスト情報が強調表示された状態を示したスクリーンショット", width="298", height="430" %}</figure>

カラーピッカーを使用して、コントラストが十分に高くなるまで色を調整できます。HSLカラー形式で調整するのが最も簡単です。ピッカーの右側にあるトグルボタンをクリックして、その形式に切り替えます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uUGdLr7fYCrmqtCrtpJK.png", alt="Chrome DevTools のカラーピッカーのカラーフォーマットトグルが強調表示された状態を示したスクリーンショット", width="298", height="430" %}</figure>

基準を満たす color 値を見つけたら、プロジェクトのCSSを更新します。

グラデーションのテキストや画像のテキストといった、より複雑なケースは、UI要素や画像と同様に手動でチェックする必要があります。画像上のテキストの場合は、DevTools の背景色ピッカーを使用すれば、テキストが表示される背景を確認できます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PFznOtjzMF3nZy3IsCtW.png", alt="Chrome DevTools の背景カラーピッカーのスクリーンショット", width="301", height="431" %}</figure>

他の例では、Paciello グループの <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Colour Contrast Analyser</a> といったツールを使用することを検討してください。

## リソース

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/color-contrast.js" rel="noopener"><strong>Background and foreground colors do not have a sufficient contrast ratio (背景色と前景色のコントラスト比が不十分である)</strong></a> 監査のソースコード
- <a href="https://dequeuniversity.com/rules/axe/3.3/color-contrast" rel="noopener">Text elements must have sufficient color contrast against the background (テキスト要素は、背景に対する十分なカラーコントラストが必要である) (Deque University)</a>
- <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Colour Contrast Analyser (カラーコントラストアナライザー)</a>
