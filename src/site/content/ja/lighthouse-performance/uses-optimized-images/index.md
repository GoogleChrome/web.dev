---
layout: post
title: 画像を効率的にエンコードする
description: uses-optimized-images監査について学びます。
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - uses-optimized-images
---

Lighthouseレポートの[Opportunities]セクションには、最適化されていないすべての画像が表示され、節約できると考えられるデータ量が[キビバイト (KiB)](https://en.wikipedia.org/wiki/Kibibyte) で表示されます。こうした画像を最適化することにより、ページの読み込み速度を改善し、消費するデータ量を減らします。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZbPSZtjpa7j4I1k8DylI.png", alt="Lighthouseによる「画像を効率的にエンコードする」監査のスクリーンショット", width="800", height="263" %}</figure>

## Lighthouseが画像を最適化可能とフラグする仕組み

Lighthouseは、ページ上のすべてのJPEGまたはBMP画像を収集し、各画像の圧縮レベルを85に設定してから、元のバージョンと圧縮されたバージョンを比較します。節約可能と思われるデータ量が4KiB以上ある場合、Lighthouseは画像が最適化可能であるとフラグします。

## 画像を最適化する方法

画像を最適化するためのステップは、以下を含め、実践できることがたくさんあります。

- [画像CDNを使用する](/image-cdns/)
- [画像を圧縮する](/use-imagemin-to-compress-images)
- [アニメーションGIFを動画に置き換える](/replace-gifs-with-videos)
- [画像を遅延読みする](/use-lazysizes-to-lazyload-images)
- [レスポンシブ画像を提供する](/serve-responsive-images)
- [正しいサイズの画像を提供する](/serve-images-with-correct-dimensions)
- [WebP画像を使用する](/serve-images-webp)

## GUIツールを使用して画像を最適化する

もう1つのアプローチは、コンピューターにインストールしてGUIとして実行するオプティマイザ―を使って画像を最適化するという方法です。たとえば、[ImageOptim](https://imageoptim.com/mac)を使用する場合は、そのUIに画像をドラッグアンドドロップすると、その画像はクオリティを失わずに自動的に圧縮されます。小規模なサイトを運営していて、すべての画像を手動で最適化できるという方にとっては、この選択肢で事足りると思います。

別の選択肢に[Squoosh](https://squoosh.app/)というものがあります。Squooshは、Google Web DevRelチームが管理しています。

## スタック固有のガイダンス

### Drupal

品質を維持しながら、サイトを通じてアップロードされた画像のサイズを自動的に最適化および縮小する[モジュール](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=optimize+images&solrsort=iss_project_release_usage+desc&op=Search)の使用を検討してください。また、Drupalに組み込まれた[レスポンシブ画像スタイル](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8) (Drupal 8以降で使用可能) をサイトでレンダリングされるすべての画像に使用していることを確認してください。

### Joomla

品質を維持しながら画像を圧縮する[画像最適化プラグイン](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance)の使用を検討してください。

### Magento

[画像を最適化するサードパーティのMagento拡張機能](https://marketplace.magento.com/catalogsearch/result/?q=optimize%20image)を使用することを検討してください。

### WordPress

品質を維持しながら画像を圧縮する[WordPressの画像最適化用プラグイン](https://wordpress.org/plugins/search/optimize+images/)を使用することを検討してください。

## リソース

- [**Efficiently encode images (画像を効率的にエンコードする)** 監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-optimized-images.js)
