---
layout: post
title: Otimizar imagens de fundo CSS com consultas de mídia
authors:
  - demianrenzulli
description: |2-

  Use consultas de mídia para enviar imagens com o tamanho necessário,

  uma técnica comumente conhecida como imagens responsivas.
date: 2020-03-05
updated: 2020-03-05
tags:
  - performance
---

Muitos sites solicitam recursos pesados, como imagens, que não são otimizados para determinadas telas, e enviam grandes arquivos CSS contendo estilos que alguns dispositivos jamais usarão. O uso de consultas de mídia é uma técnica popular para fornecer folhas de estilo e ativos personalizados para diferentes telas para reduzir a quantidade de dados transferidos para os usuários e melhorar o desempenho do carregamento da página. Este guia mostra como usar consultas de mídia para enviar imagens que têm o tamanho necessário, uma técnica comumente conhecida como **imagens responsivas**.

## Pré-requisitos

Este guia pressupõe que você esteja familiarizado com o [Chrome DevTools](https://developer.chrome.com/docs/devtools/). Você pode usar DevTools de outro navegador, se preferir. Você só precisa mapear as capturas de tela do Chrome DevTools neste guia de volta aos recursos relevantes no navegador de sua escolha.

## Compreenda as imagens de fundo responsivas

Primeiro, analise o tráfego de rede da demonstração não otimizada:

1. Abra a [demonstração não otimizada](https://use-media-queries-unoptimized.glitch.me/) em uma nova guia do Chrome. {% Instruction 'devtools-network', 'ol' %} {% Instruction 'reload-page', 'ol' %}

{% Aside %} Confira [Inspecionar atividade de rede com Chrome DevTools](https://developer.chrome.com/docs/devtools/network/) se precisar de mais ajuda com DevTools. {% endAside %}

Você verá que a única imagem solicitada é `background-desktop.jpg`, que tem um tamanho de **1006 KB**:

<figure>{% Img src="image/admin/K8P4MHp2FSnZYTw3ZVkG.png", alt="Rastreamento de rede DevTools para a imagem de fundo não otimizada.", width="800", height="126" %}</figure>

Redimensione a janela do navegador e observe que o log de rede não está mostrando nenhuma nova solicitação feita pela página. Isso significa que a mesma imagem de fundo está sendo usada para todos os tamanhos de tela.

Você pode ver os estilos que controlam a imagem de fundo em [style.css](https://use-media-queries-unoptimized.glitch.me/style.css):

```css
body {
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat; background-size: cover;
  background-image: url(images/background-desktop.jpg);
}
```

Aqui está o significado de cada uma das propriedades usadas:

- `background-position: center center`: Centralize a imagem verticalmente e horizontalmente.
- `background-repeat: no-repeat`: Mostrar a imagem apenas uma vez.
- `background-attachment: fixed`: Evite fazer a rolagem da imagem de fundo.
- `background-size: cover`: redimensione a imagem para cobrir todo o contêiner.
- `background-image: url(images/background-desktop.jpg)`: O URL da imagem.

Quando combinados, esses estilos instruem o navegador a adaptar a imagem de fundo a diferentes alturas e larguras de tela. Este é o primeiro passo para obter um background responsivo.

Usar uma única imagem de plano de fundo para todos os tamanhos de tela tem algumas limitações:

- A mesma quantidade de bytes é enviada, independentemente do tamanho da tela, mesmo quando, para alguns dispositivos, como telefones, uma imagem de fundo menor e mais leve pareceria igualmente boa. Em geral, você deseja enviar a menor imagem possível que ainda pareça boa na tela do usuário para melhorar o desempenho e salvar os dados do usuário.
- Em dispositivos menores, a imagem será esticada ou cortada para cobrir a tela inteira, potencialmente escondendo partes relevantes do plano de fundo para os usuários.

Na próxima seção, você aprenderá como aplicar uma otimização para carregar diferentes imagens de fundo, de acordo com o dispositivo do usuário.

## Usar consultas de mídia

O uso de consultas de mídia é uma técnica comum para declarar folhas de estilo que se aplicam apenas a determinados tipos de mídia ou dispositivo. Eles são implementados usando [@media rules](https://developer.mozilla.org/docs/Web/CSS/@media), que permitem definir um conjunto de pontos de interrupção, onde estilos específicos são definidos. Quando as condições definidas pela `@media` são atendidas (por exemplo, uma certa largura de tela), o grupo de estilos definido dentro do breakpoint será aplicado.

As etapas a seguir podem ser usadas para aplicar consultas de mídia ao [site](https://use-media-queries-unoptimized.glitch.me/) para que diferentes imagens sejam usadas, dependendo da largura máxima do dispositivo que está solicitando a página.

- Em `style.css` remova a linha que contém o URL da imagem de plano de fundo:

```css//4
body {
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat; background-size: cover;
  background-image: url(images/background-desktop.jpg);
}
```

- Em seguida, crie um ponto de interrupção para cada largura de tela, com base nas dimensões comuns em pixels que as telas de celulares, tablets e desktops geralmente têm:

Para celular:

```css
@media (max-width: 480px) {
    body {
        background-image: url(images/background-mobile.jpg);
    }
}
```

Para tablets:

```css
@media (min-width: 481px) and (max-width: 1024px) {
    body {
        background-image: url(images/background-tablet.jpg);
    }
}
```

Para desktops:

```css
@media (min-width: 1025px) {
    body {
	    background-image: url(images/background-desktop.jpg);
   }
}
```

Abra a versão otimizada de [style.css](https://use-media-queries-optimized.glitch.me/style.css) em seu navegador para ver as alterações feitas.

{% Aside %} As imagens usadas na demonstração otimizada já foram redimensionadas para caber em diferentes tamanhos de tela. Mostrar como redimensionar imagens está fora do escopo deste guia, mas se você quiser saber mais sobre isso, o [guia veicular imagens responsivas](/serve-responsive-images/) cobre algumas ferramentas úteis, como o [pacote npm sharp](https://www.npmjs.com/package/sharp) e o [ImageMagick CLI](https://www.imagemagick.org/script/index.php). {% endAside %}

## Medida para diferentes dispositivos

Em seguida, visualize o site resultante em diferentes tamanhos de tela e em dispositivos móveis simulados:

1. Abra o [site otimizado](https://use-media-queries-optimized.glitch.me/) em uma nova guia do Chrome.
2. Torne sua janela de visualização estreita (menos de `480px`). {% Instruction 'devtools-network', 'ol' %} {% Instruction 'reload-page', 'ol' %} Observe como a imagem `background-mobile.jpg` foi solicitada.
3. Aumente a sua janela de visualização. Quando for maior que `480px` observe como `background-tablet.jpg` é solicitado. Quando for maior que `1025px` observe como `background-desktop.jpg` é solicitado.

Quando a largura da tela do navegador é alterada, novas imagens são solicitadas.

Em particular, quando a largura está abaixo do valor definido no ponto de interrupção móvel (480px), você vê o seguinte Log de rede:

<figure>{% Img src="image/admin/jd2kHIefYf91udpFEmvx.png", alt="Rastreamento de rede DevTools para a imagem de fundo otimizada.", width="800", height="125" %}</figure>

O tamanho do novo plano de fundo do celular é **67% menor do** que o do desktop.

## Resumo

Neste guia, você aprendeu a aplicar consultas de mídia para solicitar imagens de fundo personalizadas para tamanhos de tela específicos e economizar bytes ao acessar o site em dispositivos menores, como telefones celulares. Você usou a `@media` para implementar um plano de fundo responsivo. Esta técnica é amplamente suportada por todos os navegadores. Um novo recurso CSS: [image-set ()](https://www.w3.org/TR/css-images-4/#image-set-notation), pode ser usado para o mesmo propósito com menos linhas de código. No momento em que este artigo foi escrito, esse recurso não era compatível com todos os navegadores, mas você pode querer ficar de olho em como a adoção evolui, pois pode representar uma alternativa interessante a essa técnica.
