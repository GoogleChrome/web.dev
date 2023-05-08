---
layout: post
title: Imagemin を使用して画像を圧縮する
authors:
  - katiehempenius
date: 2018-11-05
updated: 2020-04-06
description: 圧縮されていない画像は、不要なバイトを増やし、ページを肥大化させます。画像を圧縮することによりページの読み込みを改善するチャンスを探るべく、Lighthouse を実行します。
codelabs:
  - codelab-imagemin-webpack
  - codelab-imagemin-gulp
  - codelab-imagemin-grunt
tags:
  - performance
---

## これが大切な理由とは？

圧縮されていない画像は、不要なバイトを増やし、ページを肥大化させます。右側の写真は左側の写真よりも 40％ 小さいのですが、一般的なユーザーには同じように見えるのではないでしょうか。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>
<p>{% Img src="image/admin/LRE2JJAuShXTjQF5ZSaR.jpg", alt="", width="376", height="250" %}</p> 20 KB</th>
        <th>
<p>{% Img src="image/admin/u9hncwN4TsT7zw2ObU10.jpg", alt="", width="376", height="250" %}</p> 12 KB</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>

## 評価

Lighthouse を実行して、画像を圧縮することでページの読み込みを改善するチャンスを探ります。圧縮が可能な場合は、「Efficiently encode images」の欄にその手段が表示されます。

{% Img src="image/admin/LnIukPEZHuVJwBtuJ7mc.png", alt="image", width="800", height="552" %}

{% Aside %} 現在 Lighthouse では、画像を JPEG 形式で圧縮する方法だけが報告されます。{% endAside %}

## Imagemin

Imagemin は、さまざまな画像形式をサポートし、簡単にビルドスクリプトやビルドツールと連携できるため、画像圧縮にもってこいの選択肢です。Imagemin は、[CLI](https://github.com/imagemin/imagemin-cli) と [npm モジュール](https://www.npmjs.com/package/imagemin)の両方として利用できます。一般的に、npm モジュールは、設定オプションが多く用意されているので最適な選択肢とされていますが、コードをいじらずに Imagemin を試してみたいという方は、CLI も使用できます。

### プラグイン

Imagemin は「プラグイン」を中心に構築されています。プラグインは、特定の画像形式を圧縮する npm パッケージです (たとえば、「mozjpeg」は JPEG を圧縮します)。人気の高い画像形式では、プラグインの選択肢が複数個ある場合があります。

プラグインを選択する際に考慮すべき点として、特に重要なのは、プラグインが「ロッシー」なのか「ロスレス」なのかという点です。後者の圧縮で、データが失われることはありません。前者の圧縮は、ファイルサイズを縮小できますが、画質が損なわれる可能性があります。プラグインが「ロッシー」なのか「ロスレス」なのかを示さない場合は、その API を見れば判断できます。出力の画質を指定できる場合は、「ロッシー」です。

多くの人にとっては、ロッシーなプラグインがベストでしょう。ファイルサイズを大幅に縮小し、ニーズに合わせて圧縮レベルをカスタマイズできます。下の表は、人気の高い Imagemin プラグインを示したものです。利用できるプラグインは他にもありますが、プロジェクトに使う選択肢としては、どれも申し分ありません。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>画像形式</th>
        <th>ロッシープラグイン</th>
        <th>ロスレスプラグイン</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>JPEG</td>
        <td><a href="https://www.npmjs.com/package/imagemin-mozjpeg">imagemin-mozjpeg</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-jpegtran">imagemin-jpegtran</a></td>
      </tr>
      <tr>
        <td>PNG</td>
        <td><a href="https://www.npmjs.com/package/imagemin-pngquant">imagemin-pngquant</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-optipng">imagemin-optipng</a></td>
      </tr>
      <tr>
        <td>GIF</td>
        <td><a href="https://www.npmjs.com/package/imagemin-giflossy">imagemin-giflossy</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-gifsicle">imagemin-gifsicle</a></td>
      </tr>
      <tr>
        <td>SVG</td>
        <td><a href="https://www.npmjs.com/package/imagemin-svgo">imagemin-svgo</a></td>
        <td></td>
      </tr>
      <tr>
        <td>WebP</td>
        <td><a href="https://www.npmjs.com/package/imagemin-webp">imagemin-webp</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-webp">imagemin-webp</a></td>
      </tr>
    </tbody>
  </table>
</div>

### Imagemin CLI

Imagemin CLI は、imagemin-gifsicle、imagemin-jpegtran、imagemin-optipng、imagemin-pngquant、imagemin-svgo という 5つのプラグインで動作します。Imagemin は、入力の画像形式に基づいて適切なプラグインを使用します。

「images/」ディレクトリにある画像を圧縮して、同じディレクトリに保存するには、次のコマンドを実行します (元のファイルは上書きされます)。

```bash
$ imagemin images/* --out-dir=images
```

### Imagemin npm モジュール

こうしたビルトツールの 1 つ使用する場合は、コードラボで [webpack](/codelab-imagemin-webpack)、[gulp](/codelab-imagemin-gulp)、または [grunt](/codelab-imagemin-grunt) のいずれかが搭載された Imaginemin をご覧ください。

Imagemin は、ノードスクリプトとして単独で使用することもできます。下のコードでは、"imagemin-mozjpeg" プラグインを使って、JPEG ファイルを 50 の品質レベルに圧縮しています  (「０」が最低、「１００」が最高) 。

```js
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async() => {
  const files = await imagemin(
      ['source_dir/*.jpg', 'another_dir/*.jpg'],
      {
        destination: 'destination_dir',
        plugins: [imageminMozjpeg({quality: 50})]
      }
  );
  console.log(files);
})();
```
