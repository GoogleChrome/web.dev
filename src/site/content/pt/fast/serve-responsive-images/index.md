---
layout: post
title: Exiba imagens responsivas
authors:
  - katiehempenius
description: Exibir em dispositivos móveis imagens com tamanho para desktop pode usar de 2 a 4x mais dados do que o necessário. Em vez de usar uma abordagem generalizada para as imagens, exiba tamanhos de imagem para dispositivos diferentes.
date: 2018-11-05
updated: 2021-06-05
codelabs:
  - codelab-specifying-multiple-slot-widths
  - codelab-art-direction
  - codelab-density-descriptors
tags:
  - performance
---

Exibir em dispositivos móveis imagens com tamanho para desktop pode usar de 2 a 4x mais dados do que o necessário. Em vez de uma abordagem generalizada para imagens, exiba tamanhos de imagem diferentes para dispositivos diferentes.

## Redimensione imagens

Duas das ferramentas mais populares de redimensionamento de imagens são o [pacote npm sharp](https://www.npmjs.com/package/sharp) e a [ferramenta ImageMagick CLI](https://www.imagemagick.org/script/index.php) .

O pacote sharp é uma boa escolha para automatizar o redimensionamento de imagens (por exemplo, gerando vários tamanhos de miniaturas para todos os vídeos em seu site). Ele é rápido e facilmente integrado com ferramentas e build scripts. Por outro lado, o ImageMagick é conveniente para o redimensionamento de imagem único pois é usado totalmente através de linha de comando.

### sharp

Para usar o sharp como um script Node, salve este código como um script separado em seu projeto e execute-o para converter suas imagens:

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

Para redimensionar uma imagem para 33% de seu tamanho original, execute o seguinte comando em seu terminal:

```bash
convert -resize 33% flower.jpg flower-small.jpg
```

Para redimensionar uma imagem para caber em 300px de largura por 200px de altura, execute o seguinte comando:

```bash
# macOS/Linux
convert flower.jpg -resize 300x200 flower-small.jpg

# Windows
magick convert flower.jpg -resize 300x200 flower-small.jpg
```

### Quantas versões de imagem você deve criar?

Não há uma única resposta "certa" para essa pergunta. No entanto, é comum exibir de 3 a 5 tamanhos diferentes de uma imagem. Exibir mais tamanhos de imagem é melhor para o desempenho, mas ocupará mais espaço em seus servidores e exigirá a escrita de um pouco mais de HTML.

### Outras opções

Serviços de imagem como [Thumbor](https://github.com/thumbor/thumbor) (open-source) e [Cloudinary](https://cloudinary.com/) também valem a pena conferir. Os serviços de imagem fornecem imagens responsivas (e manipulação de imagens) sob demanda. O Thumbor é configurado instalando-o em um servidor; o Cloudinary cuida desses detalhes para você e não requer configuração de servidor. as duas alternativas são maneiras fáceis de criar imagens responsivas.

## Exibir várias versões de imagem

Especifique várias versões da imagem e o navegador escolherá a melhor para usar:


<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><strong>Antes</strong></th>
        <th><strong>Depois</strong></th>
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

O `<img>` tag de [`src`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-src) , [`srcset`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-srcset) e [`sizes`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-sizes) todos os atributos interagem para atingir este resultado final.

### O atributo "src"

O atributo src faz esse código funcionar para navegadores que não [oferecem suporte](https://caniuse.com/#search=srcset) aos atributos `srcset` e `sizes` Se um navegador não suportar esses atributos, ele voltará a carregar o recurso especificado pelo atributo `src`

{% Aside 'gotchas' %} O recurso especificado por `src` deve ser grande o suficiente para funcionar bem em todos os tamanhos de dispositivo. {% endAside %}

### O atributo "srcset"

O `srcset` é uma lista separada por vírgulas de nomes de arquivos de imagem e seus descritores de largura ou densidade.

Este exemplo usa [descritores de largura](https://www.w3.org/TR/html5/semantics-embedded-content.html#width-descriptor) . `480w` é um descritor de largura que informa ao navegador que `flower-small.jpg` tem 480px de largura; `1080w` é um descritor de largura que informa ao navegador que `flower-large.jpg` tem 1080px de largura.

"Descritor de largura" parece sofisticado, mas é apenas uma maneira de informar ao navegador a largura de uma imagem. Isso evita que o navegador precise fazer o download da imagem para determinar seu tamanho.

{% Aside 'gotchas' %} Use a `w` (em vez de `px` ) para escrever descritores de largura. Por exemplo, uma imagem de 1024 px de largura seria escrita como `1024w` . {% endAside %}

**Crédito extra:** você não precisa saber sobre descritores de densidade para exibir diferentes tamanhos de imagem. No entanto, se você estiver curioso sobre como funcionam os descritores de densidade, confira o [laboratório de código de Alternância de Resolução](/codelab-density-descriptors). Descritores de densidade são usados para exibir imagens diferentes com base na [densidade de pixels](https://en.wikipedia.org/wiki/Pixel_density) do dispositivo.

### O atributo "sizes"

O atributo sizes - tamanhos - informa ao navegador a largura da imagem quando ela é exibida. No entanto, o atributo de tamanhos não tem efeito no tamanho da tela; você ainda precisa de CSS para fazer isso.

O navegador usa essas informações, junto com o que sabe sobre o dispositivo do usuário (ou seja, suas dimensões e densidade de pixels), para determinar qual imagem carregar.

Se um navegador não reconhecer o "`sizes`", ele voltará a carregar a imagem especificada pelo atributo "`src`". (Os navegadores proveram suporte para os atributos "`sizes`" e "`srcset`" simultaneamente, então um navegador suportará ambos os atributos ou nenhum.)

{% Aside 'gotchas' %} A largura do slot pode ser especificada usando uma variedade de unidades. A seguir estão todos os tamanhos válidos:

- `100px`
- `33vw`
- `20em`
- `calc(50vw-10px)`

O seguinte não é um tamanho válido:

- `25%` (as porcentagens não podem ser usadas com o atributo de tamanhos) {% endAside %}

**Crédito extra:** se você quiser sofisticar, também pode usar o atributo tamanhos para especificar vários tamanhos de slot. Ele atende a sites que usam layouts diferentes para tamanhos de janela de visualização diferentes. Confira este [exemplo de código de vários slots](/codelab-specifying-multiple-slot-widths) para aprender como fazer isso.

### (Ainda mais) Crédito Extra

Além de todos os créditos extras já listados (as imagens são complexas!), Você também pode usar esses mesmos conceitos para [direção de arte](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction). A direção de arte é a prática de exibir imagens de aparência completamente diferente (em vez de versões diferentes da mesma imagem) para janelas de exibição diferentes. Você pode aprender mais no [laboratório de código de Direção de Arte](/codelab-art-direction) .

## Verificar

Depois de implementar as imagens responsivas, você pode usar o Lighthouse para se certificar de que não tenha perdido nenhuma imagem. Execute a Auditoria de desempenho do Lighthouse (**Lighthouse > Opções > Desempenho** ) e procure os resultados da auditoria de **imagens do tamanho adequado.** Esses resultados listarão as imagens que precisam ser redimensionadas.
