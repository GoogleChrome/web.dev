---
layout: codelab
title: Criação de imagens WebP com a linha de comando
authors:
  - katiehempenius
description: |2

  Neste codelab, aprenda como exibir imagens otimizadas usando WebP.
date: 2018-11-05
glitch: webp-cli
related_post: serve-images-webp
tags:
  - performance
---

A <a href="https://developers.google.com/speed/webp/docs/precompiled">ferramenta de linha de comando</a> webp já foi instalada para você, então você está pronto para começar. Esta ferramenta converte imagens JPG, PNG e TIFF em WebP.

## Converta imagens para WebP

{% Instruction 'remix', 'ol' %} {% Instruction 'console', 'ol' %}

1. Digite o seguinte comando:

```bash
cwebp -q 50 images/flower1.jpg -o images/flower1.webp
```

Este comando converte, com uma qualidade de `50` ( `0` é a pior; `100` é a melhor), o arquivo `images/flower1.jpg` e o salva como `images/flower1.webp` .

{% Aside %} Você está se perguntando por que digitar `cwebp` vez de `webp`? WebP tem dois comandos separados para codificar e decodificar imagens WebP. `cwebp` codifica imagens para WebP, enquanto `dwebp` decodifica imagens de WebP. {% endAside %}

Depois de fazer isso, você deve ver algo assim no console:

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

Você acabou de converter com sucesso a imagem para WebP.

No entanto, executar o `cwebp` uma imagem por vez como este demoraria muito para converter muitas imagens. Se precisar fazer isso, você pode usar um script.

- Execute este script no console (não se esqueça dos crases):

```bash
`for file in images/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done`
```

Este script converte, com uma qualidade de `50` todos os arquivos no `images/` e os salva como um novo arquivo (mesmo nome de arquivo, mas com uma `.webp`) no mesmo diretório.

### ✔︎ Check-in

Agora você deve ter 6 arquivos em seu diretório `images/`:

```shell
flower1.jpg
flower1.webp
flower2.jpg
flower2.webp
flower3.png
flower3.webp
```

Em seguida, atualize este Glitch para servir imagens WebP aos navegadores que o suportam.

## Adicione imagens WebP usando a tag `<picture>`

Uma tag `<picture>` permite que você veicule WebP para navegadores mais novos ao mesmo tempo em que mantém o suporte para navegadores mais antigos.

- Em `index.html` substitua `<img src="images/flower1.jpg"/>` pelo seguinte HTML:

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
```

- Em seguida, substitua as tags `<img>` para `flower2.jpg` e `flower3.png` pelas tags `<picture>`

### ✔︎ Check-in

Depois de concluídas, as tags `<picture>` em <br>`index.html` devem ter a seguinte aparência:

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

Em seguida, use o Lighthouse para verificar se você implementou corretamente as imagens WebP no site.

## Verifique o uso do WebP com o Lighthouse

A auditoria de desempenho do Lighthouse **Servir imagens em formatos de última geração** permite que você saiba se todas as imagens em seu site estão usando formatos de próxima geração, como o WebP.

{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

1. Verifique se a auditoria **Servir imagens em formatos de próxima geração** foi aprovada.

{% Img src="image/admin/Y8x0FLWs1Xsf32DX20DG.png", alt="Aprovação da auditoria 'Servir imagens em formatos de última geração' no Lighthouse", width="701", height="651" %}

Sucesso! Agora você está servindo imagens WebP em seu site.
