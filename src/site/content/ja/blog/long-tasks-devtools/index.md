---
title: 長い JavaScript タスクによって、対話時間が遅延していませんか？
subhead: ユーザー操作を阻止するコストの高いタスクを診断する方法を学びます。
authors:
  - addyosmani
date: 2019-05-29
hero: image/admin/QvWXvBSXsRKtpGOcakb5.jpg
alt: 砂が落ちている砂時計
description: 長いタスクはメインスレッドをビジー状態にし、ユーザーの操作を遅らせる可能性があります。Chrome DevTools では、長いタスクを視覚化し、最適化するタスクを簡単に確認できるようになりました。
tags:
  - blog
  - performance
---

**要約: 長いタスクはメインスレッドをビジー状態にし、ユーザーの操作を遅らせる可能性があります。Chrome DevTools では、長いタスクを視覚化し、最適化するタスクを簡単に確認できるようになりました。**

Lighthouse を使用してページを監査している場合は、ユーザーがページを操作して応答を得ることができるまでの時間を表す [Time to Interactive](/tti/)（TTI/対話時間）という指標に聞き覚えがあるかもしれません。しかし、長い（JavaScript）タスクが  TTI の低下に大きく寄与する可能性があることはご存知ですか？

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4XCzYI9gaUJDTTJu9JxH.png", alt="Lighthouse のレポートに表示される Time to Interactive", width="800", height="169" %}

## 長いタスクとは？

[長いタスク](https://developer.mozilla.org/docs/Web/API/Long_Tasks_API)とは、メインスレッドを長時間独占し、UI を「フリーズ」させる JavaScript コードです。

Web ページの読み込み中、長いタスクがメインスレッドを拘束してしまい、ページの準備ができているように見えてもユーザー入力に応答できない状況を作り出してしまいます。イベントリスナーやクリックハンドラーなどがまだ接続されていないため、クリックやタップが機能しないことがよくあります。

CPU を多用する長いタスクは、50 ミリ秒以上かかる複雑な作業が原因で発生します。なぜ 50 ミリ秒なのでしょうか？[The RAIL model](/rail/) では、100 ミリ秒以内に視覚的な応答を得るには、ユーザー入力イベントを [50 ミリ秒](/rail/#response:-process-events-in-under-50ms)で処理することを推奨しています。そうでない場合、アクションとリアクションの関係が崩れてしまうためです。

## 対話性を遅らせる可能性のある長いタスクが私のページにありますか？

これまでは、[Chrome DevTools](https://developer.chrome.com/docs/devtools/) で 50 ミリ秒を超える長さのスクリプトを示す「長い黄色のブロック」を手動で探すか、[Long Tasks API](https://calendar.perfplanet.com/2017/tracking-cpu-with-long-tasks-api/) を使用して対話性を遅らせているタスクを特定する必要がありました。これでは少し面倒かもしれません。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mSKnMWBcEBHWkXzTGCAH.png", alt="短いタスクと長いタスクの違いを示す DevTools Performance パネルのスクリーンショット", width="800", height="450" %}

パフォーマンス監査ワークフローを容易にするために、[DevTools は長いタスクを視覚化できるようになりました](https://developers.google.com/web/updates/2019/03/devtools#longtasks)。長いタスクである場合、タスク（灰色で表示）には赤いフラグが設定されます。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fyDPyO4XbSINMVpSSY9E.png", alt="Performance パネルで灰色のバーで示される長いタスクに赤いフラグを付けて視覚化する DevTools", width="800", height="450" %}

- [Performance パネル](https://developer.chrome.com/docs/devtools/evaluate-performance/)で、読み込み中の Web ページのトレースを記録します。
- メインスレッドビューで赤いフラグを探します。タスクは灰色で表示されています（「Task」）。
- バーにカーソルを合わせると、タスクに掛かる時間と、それが「長い」と見なされたかどうかがわかります。

## 長いタスクの原因は？

長いタスクを引き起こしている原因を見つけるには、灰色の **Task** バーを選択します。下のドロワーで、［**Bottom-Up**］と［**Group by Activity**］を選択します。これにより、完了までに非常に長い時間がかかるタスクに（合計で）最も貢献したアクティビティを確認できます。以下は、コストのかかる DOM クエリのセットのようです。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7irBiePkFJRmzKMlcJUV.png", alt="DevTools で長いタスク（「Task」ラベル）を選択すると、その原因となったアクティビティにドリルダウンできる。", width="800", height="450" %}

## 長いタスクを最適化する一般的な方法とは？

大規模なスクリプトは多くの場合、長いタスクの主な原因であるため、[それらを分割する](/reduce-javascript-payloads-with-code-splitting)ことを検討してください。また、サードパーティのスクリプトにも注意が必要です。そういったスクリプトの長いタスクは、プライマリコンテンツが対話背を得るまでの時間を遅らせる可能性があります。

すべての作業を小さなチャンク（50 ミリ秒未満で実行できるサイズ）に分割し、これらのチャンクを適切な場所とタイミングで実行します。ワーカーでは、適切な場所がメインスレッドから外れている場合もあります。 Phil Walton の「[Idle Until Urgent](https://philipwalton.com/articles/idle-until-urgent/)」は、このトピックに関する良い参考書と言えます。

ページの応答性を維持します。ユーザーがサイトにアクセスしたときに楽しいエクスペリエンスを提供できるようにするには、長いタスクを最小限に抑えることが優れた方法と言えます。長いタスクに関する詳細については、「[ユーザー中心のパフォーマンス指標](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_long_tasks)」をご覧ください。
