---
layout: codelab
title: コマンドラインを使用した WebP 画像の作成
authors:
  - katiehempenius
description: |2-

  このコードラボでは、WebP を使用して最適化された画像を提供する方法について学びます。
date: 2018-11-05
glitch: webp-cli
related_post: serve-images-webp
tags:
  - performance
---

webp <a href="https://developers.google.com/speed/webp/docs/precompiled">コマンドラインツール</a>はすでにインストールされているので、すぐに作業を開始できます。このツールは、JPG、PNG、および TIFF 画像を WebP に変換します。

## 画像を WebP に変換する

{% Instruction 'remix', 'ol' %} {% Instruction 'console', 'ol' %}

1. 次のコマンドを入力します。

```bash
cwebp -q 50 images/flower1.jpg -o images/flower1.webp
```

このコマンドは `images/flower1.jpg` ファイルを品質レベル `50` (`0` が最低、`100` が最高) で変換し、`images/flower1.webp` として保存します。

{% Aside %} どうして `webp` の代わりに `cwebp` と記述する理由が気になる方に説明すると、WebP には、WebP 画像をエンコードするコマンドとデコードするコマンドが別に用意されています。`cwebp` は画像を WebP にエンコードし、`dwebp` は画像を WebP からデコードします。{% endAside %}

これを実行すると、コンソールに次のようなものが表示されます。

```bash
Saving file 'images/flower1.webp'
File:      images/flower1.jpg
Dimension: 504 x 378
Output:    29538 bytes Y-U-V-All-PSNR 34.57 36.57 36.12   35.09 dB
           (1.24 bpp)
block count:  intra4:        750  (97.66%)
              intra16:        18  (2.34%)
              skipped:         0  (0.00%)
bytes used:  header:            116  (0.4%)
             mode-partition:   4014  (13.6%)
 Residuals bytes  |segment 1|segment 2|segment 3|segment 4|  total
    macroblocks:  |      22%|      26%|      36%|      17%|     768
      quantizer:  |      52 |      42 |      33 |      24 |
   filter level:  |      16 |       9 |       6 |      26 |
```

これで、画像が正常に WebP に変換されました。

しかし、1 つの画像ごとにいちいち `cwebp` コマンドを実行していたのでは、多くの画像を変換するには時間がかかってしまうため、その場合は、代わりにスクリプトを使用するとよいでしょう。

- コンソールで以下のスクリプトを実行します (バッククォートをお忘れなく)。

```bash
`for file in images/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done`
```

このスクリプトは、`images/` ディレクトリ内のすべてのファイルを品質レベル `50` で変換し、それらを新しいファイルとして同じディレクトリに保存します (同じ名前を使うが拡張子は `.webp` にする)。

### ✔ チェックイン

結果、`images/` ディレクトリに以下 6 つのファイルが作成されます。

```shell
flower1.jpg
flower1.webp
flower2.jpg
flower2.webp
flower3.png
flower3.webp
```

次に、WebP 画像をサポートするブラウザに WebP 画像を提供するように Glitch を更新します。

## `<picture>`タグを使用して WebP 画像を追加します

`<picture>`タグを使用すると、古いブラウザのサポートを維持しながら、新しいブラウザに WebP を提供できます。

- `index.html` 内で、`<img src="images/flower1.jpg"/>` を次の HTML に置き換えます。

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
```

- 次に、`flower2.jpg`と `flower2.jpg` と `flower3.png` の `<img>` タグを `<picture>` タグに置き換えます。

### ✔ チェックイン

完了すると、 `index.html` の `<picture>` タグは以下のようになります。

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
<picture>
  <source type="image/webp" srcset="images/flower2.webp">
  <source type="image/jpeg" srcset="images/flower2.jpg">
  <img src="images/flower2.jpg">
</picture>
<picture>
  <source type="image/webp" srcset="images/flower3.webp">
  <source type="image/png" srcset="images/flower3.png">
  <img src="images/flower3.png">
</picture>
```

次に、Lighthouse を使用して、WebP 画像がサイトに正しく実装されていることを確認します。

##  WebP が使用されていることを Lighthouse で確認する

Lighthouse の**Serve images in next-gen formats (画像を次世代フォーマットで提供する)** パフォーマンス監査を使用すると、サイト上のすべての画像に WebP のような次世代フォーマットが使用されているかどうかを確認できます。

{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

1. **Serve images in next-gen formats** 監査に合格していることを確認します。

{% Img src="image/admin/Y8x0FLWs1Xsf32DX20DG.png", alt="Lighthouse の 'Serve images in next-gen formats' 監査に合格", width="701", height="651" %}

うまく出来ましたね！これで、サイトに WebP 画像が表示されるようになりました。
