---
title: CSS para Web Vitals
subhead: Técnicas relacionadas a CSS para otimizar o Web Vitals
authors:
  - katiehempenius
  - una
date: 2021-06-02
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/uq7JQlKJo7KBETXnVuTf.jpg
alt: Gradiente multicolorido
description: Este artigo cobre técnicas relacionadas a CSS para otimizar Web Vitals.
tags:
  - blog
  - performance
  - css
---

A maneira como você escreve seus estilos e cria layouts pode ter um grande impacto no [Core Web Vitals](/learn-core-web-vitals/). Isso é particularmente verdadeiro para o [Deslocamento cumulativo de layout (CLS)](/cls) e a [Tinta com maior conteúdo (LCP)](/lcp).

Este artigo abrange técnicas relacionadas a CSS para otimizar o Web Vitals. Essas otimizações são divididas por diferentes aspectos de uma página: layout, imagens, fontes, animações e carregamento. Ao longo do artigo, exploraremos como melhorar uma [página de exemplo](https://codepen.io/una/pen/vYyLKvY):

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/pgmpMOmweK7BVBsVkQ5g.png", alt="Captura de tela do site de exemplo", width="800", height="646" %}

## Layout

### Inserindo conteúdo no DOM

Inserir conteúdo em uma página depois que o conteúdo circundante já foi carregado empurra todo o resto da página para baixo. Isso causa [mudanças de layout](/cls/#layout-shifts-in-detail).

[Avisos de cookies](/cookie-notice-best-practices/), especialmente aqueles colocados no topo da página, são um exemplo comum desse problema. Outros elementos da página que costumam causar esse tipo de mudança de layout quando são carregados incluem anúncios e incorporações.

#### Identificação

A auditoria do Lighthouse "Evite grandes mudanças de layout" identifica os elementos da página que foram alterados. Para esta demonstração, os resultados são os seguintes:

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/jaHtgwzDXCjx3vAFOO33.png", alt="Auditoria do Lighthouse 'Evitar grandes mudanças de layout'", width="800", height="500" %}

O aviso de cookies não está listado nessas descobertas porque o aviso de cookies em si não muda quando carrega. Em vez disso, faz com que os itens abaixo dele na página (ou seja, `div.hero` e `article`) mudem. Para obter mais informações sobre como identificar e corrigir mudanças de layout, consulte [Depuração de mudanças de layout](/debugging-layout-shifts).

{% Aside %}

O Lighthouse apenas analisa o desempenho de uma página até o evento "carregamento da página". Banners de cookies, anúncios e outros widgets às vezes não carregam até depois do carregamento da página. Essas mudanças de layout ainda afetam os usuários, mesmo se eles não forem sinalizados pelo Lighthouse.

{% endAside %}

#### Solução

Coloque o aviso de cookies na parte inferior da página usando posicionamento absoluto ou fixo.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/YBYLT9jJ9AXrbsaRNVoa.png", alt="Aviso de cookies exibido na parte inferior da página", width="800", height="656" %}

Antes:

```css
.banner {
  position: sticky;
  top: 0;
}
```

Depois:

```css
.banner {
  position: fixed;
  bottom: 0;
}
```

Outra maneira de corrigir essa mudança de layout seria reservar espaço para o aviso do cookies na parte superior da tela. Essa abordagem é igualmente eficaz. Para obter mais informações, consulte [Práticas recomendadas de aviso de cookies](/cookie-notice-best-practices/).

{% Aside %}

O aviso de cookies é um dos vários elementos de página que acionam mudanças de layout quando carrega. Para nos ajudar a examinar em detalhes esses elementos da página, as etapas subsequentes de demonstração não incluirão o aviso de cookies.

{% endAside %}

## Imagens

### Imagens e tinta com maior conteúdo (LCP)

As imagens são geralmente o elemento de tinta com maior conteúdo (LCP) em uma página. Outros [elementos da página que podem ser o elemento LCP](/lcp/#what-elements-are-considered) incluem blocos de texto e imagens de pôster de vídeo. O tempo que demora para o elemento LCP carregar determina o LCP.

É importante observar que o elemento LCP de uma página pode variar de carregamento de página para carregamento de página, dependendo do conteúdo que é visível para o usuário quando a página é exibida pela primeira vez. Por exemplo, nesta demonstração, o plano de fundo do aviso de cookies, a imagem principal e o texto do artigo são alguns dos elementos potenciais do LCP.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/bMoAoohyLOgTqV6B7lHr.png", alt="Diagrama destacando o elemento LCP da página em diferentes cenários.", width="800", height="498" %}

No site de exemplo, a imagem de fundo do aviso de cookies é, na verdade, uma imagem grande. Para melhorar o LCP, você pode pintar o gradiente em CSS, em vez de carregar uma imagem para criar o efeito.

#### Solução

Altere o CSS `.banner` para usar um gradiente CSS em vez de uma imagem:

Antes:

```css
background: url("https://cdn.pixabay.com/photo/2015/07/15/06/14/gradient-845701\_960\_720.jpg")
```

Depois:

```css
background: linear-gradient(135deg, #fbc6ff 20%, #bdfff9 90%);
```

### Imagens e mudanças de layout

Os navegadores só podem determinar o tamanho de uma imagem depois que ela carrega. Se o carregamento da imagem ocorrer após a página ter sido renderizada, mas nenhum espaço foi reservado para a imagem, uma mudança de layout ocorre quando a imagem aparece. Na demonstração, a imagem principal está causando uma mudança de layout ao carregar.

{% Aside %} O fenômeno das imagens que causam mudanças de layout é mais óbvio em situações em que as imagens demoram para carregar - por exemplo, em uma conexão lenta ou ao carregar uma imagem com um tamanho de arquivo particularmente grande. {% endAside %}

#### Identificação

Para identificar imagens sem `width` e `height` explícitas, use a auditoria do Lighthouse "Elementos de imagem têm largura e altura explícitas".

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wDGRVi7JaUOTjD9ODOk9.png", alt="Auditoria do Lighthouse Elementos de imagem têm largura e altura explícitas'", width="800", height="274" %}

Neste exemplo, a imagem principal e a imagem do artigo estão sem os atributos de `width` e `height`.

#### Solução

Defina os `width` e `height` nessas imagens para evitar mudanças de layout.

Antes:

```html
<img src="https://source.unsplash.com/random/2000x600" alt="image to load in">
<img src="https://source.unsplash.com/random/800x600" alt="image to load in">
```

Depois:

```html
<img src="https://source.unsplash.com/random/2000x600" width="2000" height="600" alt="image to load in">
<img src="https://source.unsplash.com/random/800x600" width="800" height="600" alt="image to load in">
```

<figure>{% Video src="video/j2RDdG43oidUy6AL6LovThjeX9c2/fLUscMGOlGhKnNHef2py.mp4"%} <figcaption> A imagem agora carrega sem causar uma mudança de layout. </figcaption></figure>

{% Aside %} Outra abordagem para o carregamento de imagens é usar os atributos [`srcset`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) e [`sizes`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) em conjunto com a especificação dos atributos `width` e `height`. Isso tem a vantagem de desempenho adicional de permitir que você veicule imagens de tamanhos diferentes para dispositivos diferentes. Para obter mais informações, consulte [Veicular imagens responsivas](/serve-responsive-images/). {% endAside %}

## Fontes

As fontes podem atrasar a renderização do texto e causar mudanças no layout. Como resultado, é importante fornecer fontes rapidamente.

### Renderização de texto atrasada

Por padrão, um navegador não renderizará imediatamente um elemento de texto se as fontes da web associadas ainda não tiverem sido carregadas. Isso é feito para evitar uma ["piscada de texto sem estilo" (FOUT)](https://en.wikipedia.org/wiki/Flash_of_unstyled_content). Em muitas situações, isso atrasa a [primeira tinta com conteúdo(FCP)](/fcp). Em algumas, isso atrasa a tinta com maior conteúdo(LCP).

{% Aside %}

Por padrão, os navegadores baseados em Chromium e Firefox [bloquearão a renderização de texto por até 3 segundos](https://developers.google.com/web/updates/2016/02/font-display) se a fonte da web associada não tiver sido carregada. O Safari bloqueará a renderização do texto indefinidamente. O [período de bloqueio](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#the_font_display_timeline) começa quando o navegador solicita uma fonte da web. Se a fonte ainda não tiver sido carregada no final do período de bloco, o navegador renderizará o texto usando uma fonte substituta e trocará pela fonte da web assim que disponível.

{% endAside %}

### Mudanças de layout

A troca de fontes, embora excelente para exibir conteúdo ao usuário rapidamente, tem o potencial de causar mudanças de layout. Essas mudanças de layout ocorrem quando uma fonte da web e sua fonte substituta ocupam diferentes quantidades de espaço na página. O uso de fontes com proporções semelhantes minimizará o tamanho dessas mudanças de layout.

<figure>{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/g0892nhvz3SnSaasaO1b.png", alt="Diagrama mostrando uma mudança de layout causada por uma troca de fonte", width="800", height="452" %} <figcaption> Nests exemplo, a troca de fonte fez com que os elementos da página se deslocassem cinco pixels para cima.</figcaption></figure>

#### Identificação

Para ver as fontes que estão sendo carregadas em uma página específica, abra a aba **Rede** no DevTools e filtre por **Fonte**. As fontes podem ser arquivos grandes. Portanto, usar apenas menos fontes geralmente é melhor para o desempenho.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/Ts38bQtR6x0SDgufA9vz.png", alt="Captura de tela de uma fonte exibida no DevTools", width="800", height="252" %}

Para ver quanto tempo leva para a fonte ser solicitada, clique na aba **Tempo**. Quanto antes uma fonte for solicitada, mais cedo ela poderá ser carregada e usada.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wfS7qVThKMkGA7SHd439.png", alt="Captura de tela da aba 'Tempo' no DevTools", width="800", height="340" %}

Para ver a cadeia de solicitação de uma fonte, clique na aba **Iniciador**. De modo geral, quanto mais curta a cadeia de solicitação, mais cedo a fonte pode ser solicitada.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/0tau1GQnZfj5vPhzwnIQ.png", alt="Captura de tela da aba 'Iniciador' no DevTools", width="800", height="189" %}

#### Solução

Esta demonstração usa a API Google Fonts. O Google Fonts oferece a opção de carregar fontes por meio de `<link>` ou uma instrução `@import`. O fragmento de código `<link>` inclui uma dica de recurso de `preconnect`. Isso deve resultar em uma entrega mais rápida da folha de estilo do que usar a versão `@import`.

Em um nível muito alto, você pode pensar nas [dicas de recursos](https://www.w3.org/TR/resource-hints/#resource-hints) como uma forma de indicar ao navegador que precisará configurar uma conexão específica ou fazer download de um recurso específico. Como resultado, o navegador priorizará essas ações. Ao usar dicas de recursos, lembre-se de que priorizar uma ação específica tira os recursos do navegador de outras ações. Portanto, as dicas de recursos devem ser usadas com atenção e não para tudo. Para obter mais informações, consulte [Estabelecer conexões de rede antecipadamente para melhorar a velocidade percebida da página](/preconnect-and-dns-prefetch/).

Remova a seguinte declaração `@import` de sua folha de estilo:

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&family=Roboto:wght@300&display=swap');
```

Adicione o seguinte `<link>` ao `<head>` do documento:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet">
```

Essas tags de link instruem o navegador a estabelecer uma conexão inicial com as origens usadas pelo Google Fonts e a carregar a folha de estilo que contém a declaração da fonte para Montserrat e Roboto. Estas marcas `<link>` devem ser colocadas o mais cedo possível no `<head>`.

{% Aside %}

Para carregar apenas um subconjunto de uma fonte do Google Fonts, adicione o parâmetro [`?text=`](https://developers.google.com/fonts/docs/getting_started) da API. Por exemplo, `?text=ABC` carrega apenas os caracteres necessários para renderizar "ABC". Essa é uma boa maneira de reduzir o tamanho do arquivo de uma fonte.

{% endAside %}

## Animações

A principal maneira pela qual as animações afetam o Web Vitals é quando causam mudanças de layout. Existem dois tipos de animações que você deve evitar usar: [animações que acionam o layout](/animations-guide/#triggers) e efeitos "semelhantes a animação" que movem os elementos da página. Normalmente, essas animações podem ser substituídas por equivalentes de maior desempenho usando propriedades do CSS, como [`transform`](https://developer.mozilla.org/docs/Web/CSS/transform), [`opacity`](https://developer.mozilla.org/docs/Web/CSS/opacity) e [`filter`](https://developer.mozilla.org/docs/Web/CSS/filter). Para obter mais informações, consulte [Como criar animações CSS de alto desempenho](/animations/).

### Identificação

A auditoria do Lighthouse "Evitar animações não compostas" pode ser útil para identificar animações sem desempenho.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/mXgypW9x3qgvmWDLbIZx.png", alt="Auditoria do Lighthouse 'Evitar animações não compostas'", width="512", height="132" %}

{% Aside 'caution' %}

A auditoria do Lighthouse "Evitar animações não compostas" identifica apenas *animações CSS* sem desempenho. As animações baseadas em JavaScript (por exemplo, usando [`setInterval()`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) para "animar" um elemento) são ruins para o desempenho, mas não serão sinalizadas por esta auditoria.

{% endAside %}

### Solução

Altere a sequência de animação `slideIn` para usar `transform: translateX()` vez de fazer a transição da propriedade `margin-left`.

Antes:

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    margin-left: -100%;
  }
  to {
    margin-left: 0;
  }
}
```

Depois de:

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}
```

## CSS crítico

As folhas de estilo bloqueiam a renderização. Isso significa que o navegador encontra uma folha de estilo, ele irá parar de baixar outros recursos até que tenha baixado e analisado a folha de estilo. Isso pode atrasar o LCP. Para melhorar o desempenho, considere [remover o CSS não utilizado](https://css-tricks.com/how-do-you-remove-unused-css-from-a-site/), [embutir o CSS crítico embutido](/extract-critical-css/) e [adiar o CSS não crítico](/defer-non-critical-css/#optimize).

## Conclusão

Embora ainda haja espaço para melhorias adicionais (por exemplo, usando [compactação de imagem](/use-imagemin-to-compress-images/) para fornecer imagens mais rapidamente), essas alterações melhoraram significativamente os Web Vitals deste site. Se este fosse um site real, a próxima etapa seria [coletar dados de desempenho de usuários reais](/vitals-measurement-getting-started/#measuring-web-vitals-using-rum-data) para avaliar se ele está [atendendo aos limites do Web Vitals para a maioria dos usuários](/vitals-measurement-getting-started/#data-interpretation). Para obter mais informações sobre Web Vitals, consulte [Saiba mais  sobre o Web Vitals](/learn-core-web-vitals/).
