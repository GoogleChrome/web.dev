---
layout: post
title: パフォーマンス予算にLighthouseを使用する
authors:
  - katiehempenius
description: 現在　LighthouseはPerformance Budgetをサポートできるようになりました。この機能、LightWalletは、5分以内に設定し、ページリソースのサイズと量に関するフィードバックを提供します。
date: 2019-06-14
updated: 2020-04-03
tags:
  - blog
  - performance
---

現在　[Lighthouse](https://github.com/GoogleChrome/lighthouse)は、performance budgetをサポートできるようになりました。この機能である[LightWalletは](https://developers.google.com/web/tools/lighthouse/audits/budgets)、5分以内にセットアップでき、パフォーマンスメトリックとページリソースのサイズと量に関するフィードバックを提供します。

## Lighthouseをインストールします

LightWalletは、Lighthouse v5 +のコマンドラインバージョンで使用できます。

開始するには、Lighthouseをインストールします。

```bash
npm install -g lighthouse
```

## Budgetを作成する

`budget.json`というファイルを作成します。このファイルに次のJSONを追加します。

```json
[
  {
    "path": "/*",
    "timings": [
      {
        "metric": "interactive",
        "budget": 3000
      },
      {
        "metric": "first-meaningful-paint",
        "budget": 1000
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 125
      },
      {
        "resourceType": "total",
        "budget": 300
      }
    ],
    "resourceCounts": [
      {
        "resourceType": "third-party",
        "budget": 10
      }
    ]
  }
]
```

この例の`budget.json`ファイルは、5つの個別のbudgetを設定します。

- 3000ミリ秒であるTime to Interactiveのbudget
- 100ミリ秒であるFirst Meaningful Paintのbudget
- 125KBであるページ上のJavaScriptの合計量のbudget
- 300KBであるページ全体のサイズのbudget
- 10リクエストであるサードパーティのオリジンに対して行われたリクエストの数に対するbudget

サポートしたパフォーマンスメトのリクスとリソース種類の完全なリストについては、Lighthouseドキュメントの[Performance Budgets](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md)セクションを参照してください。

## 灯台を実行します

`--budget-path`フラグを使用してLighthouseを実行します。このフラグは、Lighthouseにbudgetファイルの場所を通知します。

```bash
lighthouse https://example.com --budget-path=./budget.json
```

{% Aside %}**注**：budgetファイルの名前は`budget.json`ではなくても問題ありません。 {% endAside %}

## 結果を確認します

LightWalletが正しく構成されている場合、Lighthouseレポートには**Performance** カテゴリ内の**Budgets**セクションが含まれます。

{% Img src="image/admin/FdUeI8rKZtJB3Ol624S3.png", alt="'Lighthouse レポートのBudgetセクション", width="800", height="289" %}

LighthouseレポートのJSONバージョンでは、Lightwalletの結果は、 `performance-budget`監査の監査結果内にあります。
