---
layout: post
title: Veicule imagens com dimensões corretas
authors:
  - katiehempenius
description: |2

  Todos nós já passamos por isso   - você se esqueceu de diminuir a escala de uma imagem antes de adicioná-la ao

  página. A imagem parece boa, mas está desperdiçando dados dos usuários e prejudicando a página

  atuação.
date: 2018-11-05
wf_blink_components: N / D
codelabs:
  - codelab-serve-images-correct-dimensions
tags:
  - performance
---

Todos nós já passamos por isso: você se esqueceu de diminuir a escala de uma imagem antes de adicioná-la à página. A imagem parece boa, mas está desperdiçando dados dos usuários e prejudicando o desempenho da página.

## Identifique imagens de tamanho incorreto

O Lighthouse facilita a identificação de imagens de tamanhos incorretos. Execute a Auditoria de Desempenho (**Lighthouse &gt; Opções &gt; Desempenho**) e procure os resultados da auditoria de **imagens de tamanho adequado.** A auditoria lista todas as imagens que precisam ser redimensionadas.

## Determine o tamanho correto da imagem

O dimensionamento da imagem pode ser extremamente complicado. Por esse motivo, fornecemos duas abordagens: a "boa" e a "melhor". Ambas vão melhorar o desempenho, mas a abordagem "melhor" pode demorar um pouco mais para ser entendida e implementada. No entanto, também o recompensará com melhorias de desempenho maiores. A melhor escolha para você é aquela que você se sente confortável em implementar.

### Uma nota rápida sobre unidades CSS

Existem dois tipos de unidades CSS para especificar o tamanho dos elementos HTML, incluindo imagens:

- Unidades absolutas: os elementos estilizados com unidades absolutas sempre serão exibidos no mesmo tamanho, independentemente do dispositivo. Exemplos de unidades CSS absolutas e válidas: px, cm, mm, pol.
- Unidades relativas: os elementos estilizados com unidades relativas serão exibidos em tamanhos variados, dependendo do comprimento relativo especificado. Exemplos de unidades CSS relativas válidas: %, vw (1vw = 1% da largura da janela de visualização), em (1,5 em = 1,5 vezes o tamanho da fonte).

### A abordagem "boa"

Para imagens com dimensionamento baseado em …

- **Unidades relativas**: redimensione a imagem para um tamanho que funcione em todos os dispositivos.

Pode ser útil verificar seus dados analíticos (por exemplo, Google Analytics) para ver quais tamanhos de tela são comumente usados por seus usuários. Como alternativa, [screensiz.es](http://screensiz.es/) fornece informações sobre as telas de muitos dispositivos comuns.

- **Unidades absolutas**: redimensione a imagem para corresponder ao tamanho em que ela é exibida.

O painel DevTools Elements pode ser usado para determinar o tamanho de exibição de uma imagem.

{% Img src="image/admin/pKQa0Huu0KGInOekdz6M.png", alt="Painel do elemento DevTools", width="800", height="364" %}

### A abordagem "melhor"

Para imagens com dimensionamento baseado em…

- **Unidades absolutas:** use os atributos [srcset](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-srcset) e [sizes](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-sizes) para servir diferentes imagens para diferentes densidades de exibição. (Leia o guia sobre imagens responsivas [aqui](/serve-responsive-images).)

"Densidade de exibição" refere-se ao fato de que diferentes exibições têm diferentes densidades de pixels. Todas as outras coisas sendo iguais, uma tela de alta densidade de pixels parecerá mais nítida do que uma tela de baixa densidade de pixels.

Como resultado, várias versões de imagem são necessárias se você deseja que os usuários experimentem as imagens mais nítidas possíveis, independentemente da densidade de pixels do dispositivo.

{% Aside %} Alguns sites acham que essa diferença na qualidade da imagem é importante, outros acham que não. {% endAside %}

Técnicas de imagem responsiva tornam isso possível, permitindo que você liste várias versões de imagem e para o dispositivo escolher a imagem que funciona melhor para ele.

- **Unidades relativas:** use imagens responsivas para exibir imagens diferentes em tamanhos de exibição. (Leia o guia [aqui](/serve-responsive-images).)

Uma imagem que funciona em todos os dispositivos será desnecessariamente grande para dispositivos menores. Técnicas de imagem responsiva, especificamente [srcset](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-srcset%22) e [sizes](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-sizes), permitem que você especifique várias versões de imagem e que o dispositivo escolha o tamanho que funciona melhor para ela.

## Redimensionar imagens

Independentemente da abordagem que você escolher, pode ser útil usar o ImageMagick para redimensionar suas imagens. [ImageMagick](https://www.imagemagick.org/script/index.php) é a ferramenta de linha de comando mais popular para criar e editar imagens. A maioria das pessoas pode redimensionar imagens muito mais rapidamente ao usar a CLI do que um editor de imagens baseado em GUI.

Redimensione a imagem para 25% do tamanho do original:

```bash
convert flower.jpg -resize 25% flower_small.jpg
```

Dimensione a imagem para caber em "200 px de largura por 100 px de altura":

```bash
# macOS/Linux
convert flower.jpg -resize 200x100 flower_small.jpg

# Windows
magick convert flower.jpg -resize 200x100 flower_small.jpg
```

Se for redimensionar muitas imagens, talvez seja mais conveniente usar um script ou serviço para automatizar o processo. Você pode aprender mais sobre isso no guia de Imagens responsivas.

## Verificar

Depois de redimensionar todas as suas imagens, execute novamente o Lighthouse para verificar se você não perdeu nada.
