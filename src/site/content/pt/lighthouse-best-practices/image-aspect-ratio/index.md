---
layout: post
title: Exibe imagens com proporção incorreta
description: |2

  Aprenda a exibir imagens responsivas com a proporção correta.
web_lighthouse:
  - image-aspect-ratio
date: 2019-05-02
updated: 2020-04-29
---

Se uma imagem renderizada tem uma [proporção de aspecto](https://en.wikipedia.org/wiki/Aspect_ratio_(image)) significativamente diferente da proporção de seu arquivo de origem (a proporção de aspecto *natural*), a imagem renderizada pode parecer distorcida, possivelmente criando uma experiência desagradável para o usuário.

## Como a auditoria da proporção da imagem do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza qualquer imagem com uma dimensão renderizada com mais do que alguns pixels de diferença da dimensão esperada quando renderizada em sua proporção natural:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OSV0HmZeoy84Tf0Vrt9o.png", alt="A auditoria do Lighthouse mostra as imagens exibidas com proporção incorreta", width="800", height="198" %}</figure>

Existem duas causas comuns para uma proporção de imagem incorreta:

- Uma imagem é definida para valores explícitos de largura e altura que diferem das dimensões da imagem de origem.
- Uma imagem é definida para uma largura e altura como uma porcentagem de um contêiner de tamanho variável.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Certifique-se de que as imagens sejam exibidas com a proporção correta

### Use um CDN de imagem

Um CDN de imagem pode facilitar a automatização do processo de criação de versões de tamanhos diferentes de suas imagens. Confira [Usar CDNs de imagem para otimizar imagens](/image-cdns/) para ter uma visão geral e [Como instalar o CDN de imagem Thumbor](/install-thumbor/) para ver um codelab prático.

### Verifique o CSS que afeta a proporção da imagem

Se você estiver tendo problemas para encontrar o CSS que está causando a proporção incorreta, o Chrome DevTools pode mostrar as declarações CSS que afetam uma determinada imagem. Consulte a página do Google [Ver apenas o CSS que está realmente aplicado a um elemento](https://developer.chrome.com/docs/devtools/css/reference/#computed) para obter mais informações.

### Verifique os atributos`width` e `height` da imagem

Quando possível, é uma boa prática especificar os `width` e `height` de cada imagem em seu HTML para que o navegador possa alocar espaço para a imagem. Essa abordagem ajuda a garantir que o conteúdo abaixo da imagem não se desloque depois que a imagem for carregada.

No entanto, especificar as dimensões da imagem em HTML pode ser difícil se você estiver trabalhando com imagens responsivas, porque não há como saber a largura e a altura até que você saiba as dimensões da janela de visualização. Considere o uso da biblioteca de [proporções CSS](https://www.npmjs.com/package/css-aspect-ratio) ou [caixas de proporções](https://css-tricks.com/aspect-ratio-boxes/) para ajudar a preservar as proporções das imagens responsivas.

Por fim, confira a postagem [Exibir imagens com dimensões corretas](/serve-images-with-correct-dimensions) para aprender como exibir imagens com o tamanho certo para o dispositivo de cada usuário.

## Recursos

- [Código-fonte para a auditoria **Exibe imagens com proporção incorreta**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/image-aspect-ratio.js)
- [Proporção CSS](https://www.npmjs.com/package/css-aspect-ratio)
- [Caixas de proporção de aspecto](https://css-tricks.com/aspect-ratio-boxes/)
- [Sirva imagens com dimensões corretas](/serve-images-with-correct-dimensions)
