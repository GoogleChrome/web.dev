---
layout: post
title: レスポンシブ画像を提供する
authors:
  - katiehempenius
description: |2-

  デスクトップサイズの画像をモバイルデバイスに配信すると、実際に必要なデータの2〜4倍以上のデータが必要になる場合があります。汎用的なやり方ではなく、それぞれのデバイスに合った異なる画像サイズを提供します。
date: 2018-11-05
updated: 2021-06-04
codelabs:
  - codelab-specifying-multiple-slot-widths
  - codelab-art-direction
  - codelab-density-descriptors
tags:
  - performance
---

デスクトップサイズの画像をモバイルデバイスに配信すると、実際に必要なデータの2〜4倍以上のデータが必要になる場合があります。汎用的なやり方ではなく、それぞれのデバイスに合った異なる画像サイズを提供します。

## 画像のサイズを変更する

画像サイズ変更ツールとして最も人気が高いのは、[sharp npmパッケージ](https://www.npmjs.com/package/sharp)と[ImageMagickCLIツール](https://www.imagemagick.org/script/index.php)の2つです。

sharp パッケージは、画像のサイズ変更を自動化するのに適しています（ウェブサイト上のすべてのビデオに対して複数のサイズのサムネイルを生成するといったことができます）。高速で、ビルドスクリプトやツールと簡単に統合できます。一方のImageMagickは、完全にコマンドラインから使用されるため、1回限りの画像サイズ変更に便利です。

### sharp

sharpをノードスクリプトとして使用するには、こちらのコードをプロジェクトに別のスクリプトとして保存し、それを実行して画像を変換します。

```javascript
const sharp = require('sharp');
const fs = require('fs');
const directory = './images';

fs.readdirSync(directory).forEach(file => {
  sharp(`${directory}/${file}`)
    .resize(200, 100) // width, height
    .toFile(`${directory}/${file}-small.jpg`);
  });
```

### ImageMagick

画像のサイズを元のサイズの33％に相当するサイズに変更するには、ターミナルで次のコマンドを実行します。

```bash
convert -resize 33% flower.jpg flower-small.jpg
```

幅300px、高さ200pxの範囲内に収まるように画像のサイズを変更するには、次のコマンドを実行します。

```bash
# macOS/Linux
convert flower.jpg -resize 300x200 flower-small.jpg

# Windows
magick convert flower.jpg -resize 300x200 flower-small.jpg
```

### イメージのバージョンはいくつ作成するべきですか？

この質問の「正しい」答えは、1つではありません。ただし、3〜5種類のサイズの画像を提供するのが一般的です。より多くの画像サイズを提供することはパフォーマンスにプラスとなりますが、サーバー上で占めるスペースや記述するHTMLの量が増えてしまうのも事実です。

### 別のオプション

[Thumbor](https://github.com/thumbor/thumbor) （オープンソース）や[Cloudinary](https://cloudinary.com/)などの画像サービスもチェックしておく価値があります。画像サービスは、レスポンシブ画像（および画像操作）をオンデマンドで提供します。Thumborは、サーバーにインストールすることでセットアップされます。Cloudinaryの場合は、こうした詳細を処理したり、サーバーをセットアップしたりする必要はありません。どちらもを使っても簡単にレスポンシブ画像を作成できます。

## 画像の複数のバージョンを提供する

画像のバージョンを複数個指定すると、ブラウザは最適なバージョンを選択します。


<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><strong>前</strong></th>
        <th><strong>後</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          &lt;img src="flower-large.jpg"&gt;
        </td>
        <td>
          &lt;img src="flower-large.jpg" srcset="flower-small.jpg 480w,
          flower-large.jpg 1080w" sizes="50vw"&gt;
        </td>
      </tr>
    </tbody>
  </table>
</div>

`<img>`タグの[`src`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-src) 、 [`srcset`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-srcset) 、および[`sizes`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-sizes)属性がそれぞれ相互に作用し合い、この最終結果を生み出します。

### 「src」属性

src属性を使用すると、 `srcset`属性および`sizes`属性を[サポート](https://caniuse.com/#search=srcset)していないブラウザーでこのコードが機能します。ブラウザがこれらの属性をサポートしていない場合は、`src`属性で指定されたリソースの読み込みにフォールバックします。

{% Aside %}
`src`属性で指定されたリソースは、すべてのデバイスサイズで適切に機能するのに十分な大きさでなければいけません。{% endAside %}

### 「srcset」属性

`srcset`属性は、画像ファイル名とその幅または密度記述子をコンマ区切りでまとめたリストです。

この例では、 [幅記述子を](https://www.w3.org/TR/html5/semantics-embedded-content.html#width-descriptor)使用しています。`480w`は幅記述子であり、`flower-small.jpg`幅が480pxであることをブラウザに知らせます。 `1080w`は幅記述子であり、`flower-large.jpg`幅が1080pxであることをブラウザに知らせます。

「幅記述子」という言葉は格好良く聞こえますが、ブラウザに画像の幅を知らせる方法にすぎません。これにより、ブラウザが画像のサイズを決定するために、わざわざその画像をダウンロードする必要がなくなります。

{% Aside 'gotchas' %}幅記述子を書き込むには、（`px{/code1の代わりに)<code data-md-type="codespan">w`単位を使用します。たとえば、幅1024pxの画像は`1024w`のように記述されます。{% endAside %}

**追加情報：** 密度記述子について知らなくても、さまざまな画像サイズを提供することができます。ただし、密度記述子の仕組みについて興味がある方は、[Resolution Switching code lab (解像度切り替えコードラボ)](/codelab-density-descriptors)をご覧ください。密度記述子は、デバイスの[ピクセル密度](https://en.wikipedia.org/wiki/Pixel_density)に基づいてさまざまな画像を提供する際に使用されます。

### 「sizes」属性

「sizes」属性は、画像が表示された時に持つ幅をブラウザに指定するものです。ただし、sizes属性は表示サイズには影響しません。それには、CSSが必要になります。

ブラウザは、この情報とユーザーのデバイスについて分かっている情報（つまり、そのサイズとピクセル密度）を使用して、読み込む画像を決定します。

ブラウザは、「`sizes` 」属性を認識できない場合は、`src` 」属性で指定された画像の読み込みにフォールバックします。(ブラウザは、「`sizes` 」属性と「 `srcset` 」属性のサポートを同時にリリースしているため、両方の属性をサポートする可能性とどちらもサポートしない可能性があります。

{% Aside 'gotchas' %}スロット幅は、さまざまな単位を使用して指定できます。以下はすべて有効なサイズです。

- `100px`
- `33vw`
- `20em`
- `calc(50vw-10px)`

以下は有効なサイズではありません：

- `25%` （パーセンテージはsizes属性では使用できません）{% endAside %}

**追加情報**格好良くやりたい場合は、sizes属性を使用して複数のスロットサイズを指定することもできます。これは、さまざまなビューポートのサイズに応じてさまざまなレイアウトを使用するウェブサイトに対応します。このやり方については、[複数のスロットコードサンプル](/codelab-specifying-multiple-slot-widths)を確認してください。

### (さらなる) 追加情報

上述した追加情報に加えて（そう、画像は複雑なんです！）、 [アートディレクション](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)にもこれらと同じ概念を使用できます。アートディレクションとは、（同じ画像の異なるバージョンではなく）外観が完全に異なる画像を異なるビューポートに提供することを言います。詳細は、[アートディレクションコードラボ](/codelab-art-direction)でご確認いただけます。

## 確認

レスポンシブ画像を実装したら、Lighthouseを使用して、すべての画像が使用されていることを確認できます。Lighthouseのパフォーマンス監査（**Lighthouse &gt; Options &gt; Performance**）を実行し、**Properly size images (適切にサイズ調整された画像)** 監査の結果を探します。結果には、サイズ変更が必要な画像が一覧表示されます。
