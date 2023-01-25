---
layout: post
title: WebP 画像の使用
authors:
  - katiehempenius
description: WebP 画像は、JPEG および PNG の画像よりも小さく、通常はファイルサイズが 25〜35 ％も減少します。これにより、ページサイズは小さくなり、パフォーマンスは向上します。
date: 2018-11-05
updated: 2020-04-06
codelabs:
  - codelab-serve-images-webp
tags:
  - performance
feedback:
  - api
---

## なぜ重要視するべきか？

WebP 画像は、JPEG や PNGの 画像よりも小さく、通常はファイルサイズが 25〜35 ％も縮小されます。これにより、ページサイズは小さくなり、パフォーマンスは向上します。

- YouTube は、WebP のサムネイルに切り替えると、[ページの読み込みが10％ 速くなる](https://www.youtube.com/watch?v=rqXMwLbYEE4)ことを発見しました。
- Facebook では、WebP に切り替えた際に、JPEG は 25〜35％、PNG は 80％ もファイルサイズが縮小されました。

WebP は、JPEG、PNG、および GIF 画像に取って代わる優れた選択肢です。さらに、WebP は可逆圧縮と非可逆圧縮の両方を提供します。可逆圧縮では、データが失われることはありません。非可逆圧縮はファイルサイズを縮小しますが、画質を低下させる可能性があります。

## 画像を WebP に変換する

一般的に、画像を WebP に変換するためのアプローチとして、[cwebp コマンドラインツール](https://developers.google.com/speed/webp/docs/using)または [Imagemin WebP プラグイン](https://github.com/imagemin/imagemin-webp) (npm パッケージ) のいずれかが使用されます。通常、プロジェクトでビルドスクリプトまたはビルドツール (WebpackやGulpなど) を使用する場合は、Imagemin WebP プラグインが最適な一方で、シンプルなプロジェクトや画像を 1 回だけ変換する必要がある場合は、CLI が適切な選択肢とされています。

画像を WebP に変換する場合、さまざまな圧縮設定をセットアップするオプションがありますが、ほとんどの人にとって、配慮する必要があるのは品質設定だけと思われます。品質レベルは 0 (最低) から 100 (最高) まで指定できます。どのレベルがニーズに合った画像品質とファイルサイズの適切なトレードオフであるかを見い出すために、いろいろなレベルを試してみる価値はあるでしょう。

### cwebp を使用する

cwebp のデフォルトの圧縮設定を使用して、ファイルを 1 つ変換します。

```bash
cwebp images/flower.jpg -o images/flower.webp
```

品質レベル `50` を使用して、ファイルを 1 つ変換します。

```bash
cwebp -q 50 images/flower.jpg -o images/flower.webp
```

ディレクトリ内のすべてのファイルを変換します。

```bash
for file in images/*; do cwebp "$file" -o "${file%.*}.webp"; done
```

### Imagemin を使用する

Imagemin WebP プラグインは、単独で使用することも、お気に入りのビルドツール (Webpack / Gulp / Grunt など) と一緒に使用することもできます。通常は、ビルドスクリプトまたはビルドツールの構成ファイルに最大 10 行のコードを追加することが必要になります。以下に、これを [Webpack](https://glitch.com/~webp-webpack)、[Gulp](https://glitch.com/~webp-gulp)、および [Grunt](https://glitch.com/~webp-grunt) で行う方法の例をいくつか紹介します。

これらのビルドツールを使用していない場合は、Imagemin を Node スクリプトとして単独で使用できます。 こちらのスクリプトは、`images` ディレクトリ内のファイルを変換し、`compressed_images` ディレクトリに保存します。

```js
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

imagemin(['images/*'], {
  destination: 'compressed_images',
  plugins: [imageminWebp({quality: 50})]
}).then(() => {
  console.log('Done!');
});
```

## WebP 画像を提供する

サイトが WebP と互換性のある[ブラウザ](https://caniuse.com/#search=webp)のみをサポートしている場合は、読み込みを停止できます。それ以外の場合は、WebP を新しいブラウザーに、フォールバックイメージを古いブラウザーに提供します。

**ビフォー:**

```html
<img src="flower.jpg" alt="">
```

**アフター:**

```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

[`<picture>`](https://developer.mozilla.org/docs/Web/HTML/Element/picture) 、 [`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source) 、および`<img>`タグは、それらが相互にどのように順序付けられているかを含め、すべて相互作用してこの最終結果を達成します。

### 写真

`<picture>` タグは、0 個以上の `<source>` タグと 1 つの`<img>` タグに対してラッパーを提供します。

### ソース

`<source>`タグは、メディアリソースを指定します。

ブラウザは、サポートする形式で記述される一番最初のソースを使用します。ブラウザは、`<source>` タグに記述されているいずれの形式もサポートしていない場合、`<img>` タグで指定された画像の読み込みにフォールバックします。

{% Aside 'gotchas' %}

- 「好ましい」画像形式 (この場合は WebP) の `<source>` タグは、他の `<source>` タグよりも先に記述する必要があります。

- `type` 属性の値は、画像形式に対応する MIME タイプでなければいけません。画像の [MIME タイプ](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)とそのファイル拡張子はよく似ていますが、必ずしも同じではありません (たとえば、`.jpg` と `image/jpeg`)。

{% endAside %}

### img

`<picture>`タグがサポートされていないブラウザでもこのコードが機能するのは、`<img>`タグがあるためです。`<picture>`タグをサポートしないブラウザは、サポートしていないタグを無視します。したがい、唯一「認識」できる画像`<img src="flower.jpg" alt="">`を読み込みます。

{% Aside 'gotchas' %}

- `<img>`タグはいつも含める必要があり、常にすべての`<source>`タグの後に続いて一番最後に記述する必要があります。
- `<img>`タグで指定されるリソースは、フォールバックとして使用できるように、一般的にサポートされている形式 (JPEGなど) である必要があります。{% endAside %}

## WebP が使用されていることを確認する

Lighthouse を使用すれば、サイト上のすべての画像が WebP を使用して提供されていることを確認できます。Lighthouse Performance Auditを実行し (**Lighthouse&gt; Options&gt; Performance**)、**Serve images in next-gen formats (次世代フォーマットで画像を提供)** 監査の結果を探します。Lighthouse は、WebP で提供されていない画像をリストアップします。
