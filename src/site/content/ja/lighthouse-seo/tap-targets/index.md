---
layout: post
title: タップターゲットのサイズが適切でない
description: Lighthouse の「タップターゲットのサイズが適切でない」監査について学びます。
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - tap-targets
---

タップターゲットは、タッチデバイスのユーザーが操作できる Web ページの領域です。ボタン、リンク、およびフォーム要素にはすべてタップターゲットがあります。

多くの検索エンジンは、モバイルフレンドリー度に基づいてページをランク付けします。タップターゲットが十分に大きく、互いに十分に離れていることを確認すれば、ページはよりモバイルフレンドリーでアクセスしやすくなります。

## Lighthouse のタップターゲット監査に失敗する原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) は、小さすぎるか互いに近すぎるタップターゲットのあるページにフラグを立てます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6Dhlxe7vkj7gX3e5rX4B.png", alt="不適切なサイズのタップターゲットを示す Lighthouse 監査", width="800", height="206" %}</figure>

48 px × 48 px よりも小さいか間隔が 8 px 未満であるターゲットは、この監査に失敗します。監査に失敗すると、Lighthouse は結果を 3 列構成のテーブルに表示します。

<div class="table-wrapper scrollbar">
  <table>
    <tbody>
      <tr>
        <td><strong>Tap Target</strong></td>
        <td>不適切なサイズに指定されたタップターゲット。</td>
      </tr>
      <tr>
        <td><strong>Size</strong></td>
        <td>ターゲットの境界矩形のサイズ（ピクセル単位）。</td>
      </tr>
      <tr>
        <td><strong>Overlapping Target</strong></td>
        <td>存在する場合に、他のどのタップターゲットに近すぎているか。</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-seo/scoring.njk' %}

## タップターゲットを修正するには

**ステップ 1:** タップターゲットのサイズが小さすぎる場合は、大きくします。48 px x 48 px のタップターゲットは絶対に監査に失敗しません。大きく*表示*されてはいけないアイコンなどの要素の場合は、`padding` プロパティを増やしてみてください。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ggUhPDcAaExFfcmm8kaF.jpg", alt="適切なサイズのタップターゲット", width="800", height="419" %} <figcaption><code>padding</code> を使用すると、要素の外観を変更せずにタップターゲットを大きくできる。</figcaption></figure>

**ステップ 2:** `margin` などのプロパティを使用して、互いに近すぎるタップターゲット間の間隔を広げます。タップターゲット間には少なくとも 8 px が必要です。

## リソース

- [アクセス可能なタップターゲット](/accessible-tap-targets): すべてのユーザーがアクセスできるタップターゲットを得るための方法に関する詳細。
- [「**タップターゲットのサイズが適切でない**」監査のソースコード****](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/tap-targets.js)
