---
layout: post
title: Total Blocking Time (TBT)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: この投稿では、Total Blocking Time (合計ブロック時間、TBT) という指標について紹介し、その測定方法に関する説明を行います。
tags:
  - performance
  - metrics
---

{% Aside %}

Total Blocking Time (合計ブロック時間、TBT) は、[読み込みの応答性](/user-centric-performance-metrics/#in-the-lab)を測定するために重要となる[ラボ環境での指標](/user-centric-performance-metrics/#types-of-metrics)です。ページが確実に操作可能になるまでの間の操作不可能性の重大さの数値化に役立ち、TBT が低ければ低いほどページが確実に[使用可能](/user-centric-performance-metrics/#questions)となることを示しています。

{% endAside %}

## TBT とは？

Total Blocking Time (TBT) 指標は、長時間に渡りメイン スレッドがブロックされ、入力の応答性が妨げられることで発生する [First Contentful Paint (視覚コンテンツの初期表示時間、FCP)](/fcp/) と [Time to Interactive (操作可能になるまでの時間、TTI)](/tti/) の間の時間の合計を測定します。

メイン スレッド上で 50 ミリ秒 (ms) 以上実行されているタスクを意味する[長く時間がかかっているタスク](/custom-metrics/#long-tasks-api)がある場合、メイン スレッドは "ブロックされた" とみなされます。メイン スレッドが "ブロックされた" と表現されるのは、ブラウザーが進行中のタスクを中断することができないからです。そのため、長く時間がかかっているタスクの途中でユーザーがページを*操作*した場合、ブラウザーは応答する前にタスクの終了を待たなければなりません。

タスクの処理にかなり長く時間がかかっている場合 (例: 50 ms 以上)、ユーザーはその遅延に気付き、ページが遅い、または質が低いと感じてしまう可能性があります。

特定の長いタスクの*ブロック時間*は、50ミリ秒を超える期間です。また、*ページの合計ブロック時間*は、FCPとTTIの間で発生する各長いタスクの*ブロック時間の合計です。*

たとえば、ページを読み込んでいる最中のブラウザーのメイン スレッドの図は、以下のようになります。

{% Img src="image/admin/clHG8Yv239lXsGWD6Iu6.svg", alt="メイン スレッドでのタスク処理のタイムライン", width="800", height="156", linkTo=true %}

上記のタイムライン上には 5 つのタスクがあり、そのうちの 3 つは継続時間が 50 ms を超えているため、長く時間がかかっているタスクとなります。以下の図は、長く時間がかかっているタスクそれぞれのブロック時間を示しています。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xKxwKagiz8RliuOI2Xtc.svg", alt="ブロック時間を示しているメイン スレッドでのタスク処理のタイムライン", width="800", height="156", linkTo=true %}

このため、メイン スレッドでのタスク実行の総時間は 560 ミリ秒ですが、そのうちの 345 ミリ秒のみがブロック時間としてみなされます。

<table>
  <tr>
    <th></th>
    <th>タスクの継続時間</th>
    <th>タスクのブロック時間</th>
  </tr>
  <tr>
    <td>タスク 1</td>
    <td>250 ミリ秒</td>
    <td>200 ミリ秒</td>
  </tr>
  <tr>
    <td>タスク 2</td>
    <td>90 ミリ秒</td>
    <td>40 ミリ秒</td>
  </tr>
  <tr>
    <td>タスク 3</td>
    <td>35 ミリ秒</td>
    <td>0 ミリ秒</td>
  </tr>
  <tr>
    <td>タスク 4</td>
    <td>30 ミリ秒</td>
    <td>0 ミリ秒</td>
  </tr>
  <tr>
    <td>タスク 5</td>
    <td>155 ミリ秒</td>
    <td>105 ミリ秒</td>
  </tr>
  <tr>
    <td colspan="2"><strong>合計ブロック時間</strong></td>
    <td><strong>345 ミリ秒</strong></td>
  </tr>
</table>

### TBT は TTI にどのように関係していますか？

TBTは、ページが確実に操作可能になる前の操作不可能性の重大さの数値化に役立つため、TTI との相性が非常に良い指標です。

TTI は、メイン スレッドに長く時間がかかっているタスクがない状態が少なくとも 5 秒間続いた場合に、そのページを "確実に操作可能" であるとみなします。つまり、51 ミリ秒のタスクが 10 秒の間に 3 つ散らばっている場合、10 秒間の長く時間がかかっているタスク 1 つと同じように TTI を悪化させてしまいます。この 2 つのシナリオは、ページの操作を試みようとするユーザーにとってはまったく異なるものに感じられるはずです。

最初のケースの場合、51 ミリ秒のタスクが 3 つあれば、TBT は **3 ミリ秒**になります。一方で、10 秒のタスクが 1 つある場合、TBT は **9950 ミリ秒**となります。2 番目のケースで TBT 値が大きくなっているのは、ユーザー体験の悪化を示しています。

## TBT の測定方法

TBT は、[ラボ環境](/user-centric-performance-metrics/#in-the-lab)で測定する場合に最適な指標です。TBT の測定に最適な方法には、サイトでの Lighthouse のパフォーマンス監査の実行が挙げられます。使用方法の詳細については、「[TBT に関する Lighthouse ドキュメント](/lighthouse-total-blocking-time)」を参照してください。

### ラボ測定を実施するためのツール

- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [WebPageTest](https://www.webpagetest.org/)

{% Aside %}実際のユーザー環境での TBT の測定は可能ですが、ユーザーの操作がページの TBT に影響を与え、レポートに多数のばらつきが出てしまう可能性があるため、お勧めできません。実際のユーザー環境でのページのインタラクティブ性を理解するためには、[First Input Delay (FID)](/fid/) を測定する必要があります。{% endAside %}

## TBT における良いスコアとは？

優れたユーザー エクスペリエンスを提供するためには、**平均的なモバイル ハードウェア**でテストを行った場合に、Total Blocking Time を **300 ミリ秒**以下に抑えるよう努力する必要があります。

ページの TBT が Lighthouse のパフォーマンス スコアにどのような影響を及ぼすかについては、「[Lighthouse による TBT スコアの決定方法](/lighthouse-total-blocking-time/#how-lighthouse-determines-your-tbt-score)」を参照してください。

## TBT の改善方法

特定のサイトについて TBT の改善方法を把握するには、Lighthouse でパフォーマンス監査を実行し、そこで推奨される具体的な [Opportunities](/lighthouse-performance/#opportunities) (改善機会) に注目します。

TBT の (あらゆるサイトに共通する) 一般的な改善方法については、以下のパフォーマンス ガイドを参照してください。

- [サードパーティ製コードの影響を減らす](/third-party-summary/)
- [JavaScript の実行にかかる時間を短縮する](/bootup-time/)
- [メイン スレッドの作業を最小限に抑える](/mainthread-work-breakdown/)
- [リクエスト数を少なく、転送サイズを小さく維持する](/resource-summary/)
