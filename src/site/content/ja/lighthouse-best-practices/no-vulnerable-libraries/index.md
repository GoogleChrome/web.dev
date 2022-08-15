---
layout: post
title: 既知のセキュリティ脆弱性を持つフロントエンド JavaScript ライブラリが含まれる
description: 既知の脆弱性が含まれる JavaScript ライブラリを置き換えることでページをより安全にする方法を学びます。
web_lighthouse:
  - no-vulnerable-libraries
date: 2019-05-02
updated: 2020-06-04
---

侵入者は自動化された Web クローラーを使用してサイトをスキャンし、既知のセキュリティの脆弱性を見つけ出すことができます。Web クローラーが脆弱性を検出すると侵入者に通知することができるため、侵入者はサイトの脆弱性を悪用する方法を探ることができます。

## Lighthouseのこの監査が失敗する原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) は、既知のセキュリティ脆弱性を持つフロントエンド JavaScript ライブラリにフラグを立てます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7xN0qVP92s6g1XrNru1f.png", alt="既知のセキュリティ脆弱性を持つフロントエンド JavaScript ライブラリがページで使用されていることを示す Lighthouse 監査", width="800", height="190" %}</figure>

脆弱なライブラリを検出するために、Lighthouse は以下を実行します。

- [Chrome 用 Library Detector](https://www.npmjs.com/package/js-library-detector) を実行します。
- 検出されたライブラリのリストを [snyk の Vulnerability DB](https://snyk.io/vuln?packageManager=all) と照合します。

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## セキュリティで保護されていない JavaScript ライブラリの使用をやめる

Lighthouse がフラグを立てるすべてのライブラリの使用を停止してください。脆弱性を修正する新しいバージョンのライブラリがリリースされている場合は、そのバージョンにアップグレードしてください。新しいバージョンのライブラリがリリースされていないか、メンテナンスされていない場合は、別のライブラリを使用することを検討してください。

各ライブラリの脆弱性の詳細については、レポートの **Library Version** 列のリンクをクリックしてください。

## リソース

- [「**既知のセキュリティ脆弱性を持つフロントエンド JavaScript ライブラリが含まれる**」監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/no-vulnerable-libraries.js)
- [snyk の Vulnerability DB](https://snyk.io/vuln?packageManager=all)
