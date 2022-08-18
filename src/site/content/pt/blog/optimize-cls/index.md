---
title: Otimize a Cumulative Layout Shift
subhead: Aprenda como evitar mudanças repentinas de layout para melhorar a experiência do usuário
authors:
  - addyosmani
date: 2020-05-05
updated: 2021-08-17
hero: image/admin/74TRx6aETydsBGa2IZ7R.png
description: Cumulative Layout Shift  (CLS) é uma métrica que quantifica a frequência com que os usuários experimentam mudanças repentinas no conteúdo da página. Neste guia, abordaremos a otimização de causas comuns de CLS, como imagens e iframes sem dimensões ou conteúdo dinâmico.
alt: Deslocamentos de layout podem empurrar repentinamente o conteúdo que você está lendo ou está prestes a clicar mais para baixo na página, levando a uma experiência do usuário insatisfatória. Reservar espaço para conteúdo dinâmico causando mudanças de layout leva a uma experiência do usuário mais agradável.
tags:
  - blog
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='88' %}

"Eu estava prestes a clicar nisso! Por que ele se moveu? 😭"

Os deslocamentos de layout podem distrair os usuários. Imagine que você começou a ler um artigo quando, de repente, os elementos mudam de posição na página, fazendo você perder a posição da leitura e fazendo que você pare para procurar o lugar onde parou. Isto é muito comum na web, inclusive ao ler notícias ou tentar clicar nos botões 'Pesquisar' ou 'Adicionar ao carrinho'. Essas experiências são visualmente chocantes e frustrantes. Freqüentemente, elas são causadas quando elementos visíveis são forçados a se mover porque outro elemento foi adicionado repentinamente à página ou foi redimensionado.

A [Cumulative Layout Shift](/cls) - CLS (deslocamento cumulativo de layout), que é uma métrica [Core Web Vitals](/vitals), mede a instabilidade do conteúdo ao somar pontuações de deslocamentos nas alterações de layout que não ocorrem dentro de 500 ms da interação do usuário. Ela observa quanto conteúdo visível mudou dentro da janela de visualização, bem como a distância em que os elementos impactados foram deslocados.

Neste guia, veremos como otimizar causas comuns de deslocamentos de layout.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="Bons valores de CLS estão abaixo de 0,1, valores baixos são maiores que 0,25 e qualquer coisa entre precisa de melhorias", width="384", height="96" %}
</picture>

As causas mais comuns de uma CLS ruim são:

- Imagens sem dimensões
- Anúncios, incorporações e iframes sem dimensões
- Conteúdo injetado dinamicamente
- Fontes da Web que causam FOIT/FOUT
- Ações que aguardam uma resposta da rede antes de atualizar o DOM

## Imagens sem dimensões 🌆

**Resumo:** sempre inclua os atributos de tamanho `width` e `height` nas suas imagens e elementos de vídeo. Como alternativa, reserve o espaço necessário com as [caixas de proporção de aspecto do CSS](https://css-tricks.com/aspect-ratio-boxes/). Essa abordagem garante que o navegador possa alocar a quantidade correta de espaço no documento enquanto a imagem é carregada.

  <figure>
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/10TEOBGBqZm1SEXE7KiC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOQn6K6OQcoElRw0NCkZ.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8wKRITUkK3Zrp5jvQ1Xw.jpg",
      controls=true,
      loop=true,
      muted=true %}
   <figcaption>
      Imagens sem especificação de width e height.
    </figcaption>
  </figure>

  <figure>
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/38UiHViz44OWqlKFe1VC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/sFxDb36aEMvTPIyZHz1O.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wm4VqJtKvove6qjiIjic.jpg",
      controls=true,
      loop=true,
      muted=true %}
   <figcaption>
      Imagens com especificação de width e height.
    </figcaption>
  </figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/A2OyrzSXuW1qYGWAarGx.png", alt="Lighthouse report showing the before/after impact to Cumulative Layout Shift after setting dimensions on images", width="800", height="148" %}
  <figcaption>
  Impacto na CLS mostrado pelo Lighthouse 6.0 ao especificar dimensões nas imagens.
  </figcaption>
</figure>

### Historia

No início da web, os desenvolvedores adicionavam os atributos `width` e `height` `<img>` para garantir que espaço suficiente fosse alocado na página antes que o navegador começasse a buscar imagens. Isso reduziria a necessidade de refazer o fluxo e o layout.

```html
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons" />
```

Você deve ter observado que os atributos `width` e a `height` acima não incluem unidades. Essas dimensões em "pixels" garantiriam a reserva de uma área de 640 x 360. A imagem seria esticada para caber neste espaço, independentemente da correspondência ou não de suas verdadeiras dimensões.

Quando o [Web Design Responsivo](https://www.smashingmagazine.com/2011/01/guidelines-for-responsive-web-design/) foi introduzido, os desenvolvedores começaram a omitir `width` e `height` e passaram a usar CSS para redimensionar imagens:

```css
img {
  width: 100%; /* or max-width: 100%; */
  height: auto;
}
```

Uma desvantagem dessa abordagem é que o espaço só pode ser alocado para uma imagem depois que ela começar a ser baixada e o navegador tiver condições de determinar suas dimensões. À medida que as imagens são carregadas, a página se recompõe para posicionar cada imagem que aparece na tela. Tornou-se comum o texto de repente rolar para baixo na tela. Isto não trouxe uma boa experiência para o usuário.

É aqui que entra a questão da proporção. A proporção de uma imagem é um valor que representa sua largura em relação à sua altura. É comum ver esse valor expresso como dois números separados por dois pontos (por exemplo 16:9 ou 4:3). Para uma proporção x:y, a imagem tem x unidades de largura e y unidades de altura.

Isso significa que, se conhecermos uma das dimensões, a outra pode ser calculada. Para uma proporção de 16:9:

- Se puppy.jpg tem 360 px de altura, a largura é 360 x (16/9) = 640 px
- Se puppy.jpg tem uma largura de 640 px, a altura é 640 x (9/16) = 360 px

Conhecer a proporção da imagem permite que o navegador calcule e reserve espaço suficiente para a altura e a área associada.

### Melhores práticas atuais

Os navegadores modernos agora definem a proporção padrão das imagens com base nos atributos de largura e altura de uma imagem, portanto, é importante defini-las para evitar deslocamentos no layout. Graças ao CSS Working Group, os desenvolvedores só precisam definir os atributos `width` e `height` normalmente:

```html
<!-- set a 640:360 i.e a 16:9 - aspect ratio -->
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons" />
```

… que as [folhas de estilo UA](https://developer.mozilla.org/docs/Web/CSS/Cascade#User-agent_stylesheets) de todos os navegadores adicionam uma [proporção default com](https://html.spec.whatwg.org/multipage/rendering.html#attributes-for-embedded-content-and-images) base nos atributos de `width` e `height` já existentes no elemento:

```css
img {
  aspect-ratio: attr(width) / attr(height);
}
```

Isso calcula uma proporção com base nos atributos `width` e `height` antes que a imagem seja carregada. Essas informações são fornecidas bem no início do cálculo do layout. Assim que o navegador sabe que uma imagem deve ter uma certa largura (por exemplo, `width: 100%`), a proporção da imagem é usada para calcular a altura.

Dica: se você está tendo dificuldades para entender a proporção, temos disponível uma [calculadora](https://aspectratiocalculator.com/16-9.html) útil que pode lhe ajudar.

As alterações na proporção da imagem acima foram implementadas no [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1547231) e [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=979891) e estão chegando ao [WebKit](https://twitter.com/smfr/status/1220051332767174656) (Safari).

Para um aprofundamento fantástico no tópico da proporção de aspecto, com mais detalhes acerca das imagens responsivas, veja [Carregamento de páginas sem interrupções com proporções de mídia](https://blog.logrocket.com/jank-free-page-loading-with-media-aspect-ratios/).

Se sua imagem estiver em um container, você pode usar CSS para redimensionar a imagem para ocupar a largura desse container. Definimos `height: auto;` para evitar que a altura da imagem seja um valor fixo (por exemplo, `360px`).

```css
img {
  height: auto;
  width: 100%;
}
```

**E as imagens responsivas?**

Ao trabalhar com [imagens responsivas](/serve-responsive-images), `srcset` define quais as imagens que você permite que o navegador selecione e o tamanho de cada imagem. Para garantir que os atributos width e height de `<img>` possam ser definidos, cada imagem deve manter a mesma proporção.

```html
<img
  width="1000"
  height="1000"
  src="puppy-1000.jpg"
  srcset="puppy-1000.jpg 1000w, puppy-2000.jpg 2000w, puppy-3000.jpg 3000w"
  alt="Puppy with balloons"
/>
```

E a [direção de arte](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)?

As páginas poderão decidir incluir uma foto recortada de uma imagem em janelas de exibição estreitas com a imagem inteira exibida na área de trabalho.

```html
<picture>
  <source media="(max-width: 799px)" srcset="puppy-480w-cropped.jpg" />
  <source media="(min-width: 800px)" srcset="puppy-800w.jpg" />
  <img src="puppy-800w.jpg" alt="Puppy with balloons" />
</picture>
```

É bem possível que essas imagens tenham proporções diferentes e os navegadores ainda estejam avaliando qual deve ser a solução mais eficiente aqui, inclusive se as dimensões devem ser especificadas em todas as fontes. Até que uma solução seja decidida, poderá ainda ser necessária a alteração do layout.

## Anúncios, incorporações e iframes sem dimensões 📢😱

### Anúncios

Os anúncios são um dos maiores contribuintes para as mudanças de layout na web. Redes de anúncios e editores geralmente oferecem suporte a tamanhos de anúncios dinâmicos. Os tamanhos dos anúncios aumentam o desempenho/receita devido a taxas de cliques mais altas e a mais anúncios competindo no leilão. Infelizmente, isto pode levar a uma experiência do usuário abaixo da ideal devido aos anúncios empurrando o conteúdo visível que você está visualizando para baixo na página.

Durante o ciclo de vida do anúncio, diversos pontos podem causar mudanças de layout:

- Quando um site insere o container do anúncio no DOM
- Quando um site redimensiona o container do anúncio com o código da fonte primária
- Quando a biblioteca de tags do anúncio carrega (e redimensiona o container do anúncio)
- Quando o anúncio preenche um container (e é redimensionado se o anúncio final tiver um tamanho diferente)

A boa notícia é que é possível que os sites sigam as práticas recomendadas para reduzir o deslocamento causado pelos anúncios. Os sites podem atenuar essas alterações de layout através das seguintes estratégias:

- Reservar espaço para o local do anúncio estaticamente.
    - Em outras palavras, aplicar o estilo do elemento antes que a biblioteca de tags do anúncio carregue.
    - Se anúncios forem inseridos no fluxo do conteúdo, certifique-se de que os deslocamentos sejam eliminados reservando o tamanho do local. Esses anúncios *não devem* causar deslocamentos de layout se carregados fora da tela.
- Tomar cuidado ao posicionar anúncios que não sejam fixos próximos à parte superior da janela de visualização.
    - No exemplo abaixo, é recomendado mover o anúncio abaixo do logotipo "world vision" e reservar espaço suficiente para o slot.
- Evitar recolher o espaço reservado se nenhum anúncio for retornado quando o local do anúncio estiver visível, exibindo um placeholder.
- Eliminar deslocamentos reservando o maior tamanho possível para o local do anúncio.
    - Isto funciona, mas corre-se o risco de ter um espaço em branco se um criativo de anúncio menor ocupar o espaço.
- Escolher o tamanho mais provável para o local do anúncio com base em dados históricos.

Alguns sites podem descobrir que o recolhimento inicial do local pode reduzir deslocamentos de layout, caso seja improvável que o local do anúncio seja preenchido. Não existe uma maneira simples de escolher o tamanho exato a cada vez, a menos que você mesmo tenha controle sobre a veiculação do anúncio.

  <figure>
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/bmxqj3kZyplh0ncMAt7x.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/60c4T7aYOsKtZlaWBndS.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg",
      controls=true,
      loop=true,
      muted=true %}
   <figcaption>
      Anúncios sem espaço suficiente reservado.
    </figcaption>
  </figure>

  <figure>
      {% Video
        src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tyUFKrue5vI9o5qKjP42.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/hVxty51kdN1w5BuUvj2O.mp4"],
        poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg",
        controls=true,
        loop=true,
        muted=true %}
   <figcaption>
      Anúncios com espaço suficiente reservado.
    </figcaption>
  </figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cX6R4ACb4uVKlUb0cv1c.png", alt="Lighthouse report showing the before/after impact to Cumulative Layout Shift of reserving space for banners like ads", width="800", height="148" %}
  <figcaption>
    Impacto Lighthouse 6.0 da reserva de espaço para este banner na CLS
  </figcaption>
</figure>

#### Reservar espaço para o local do anúncio estaticamente

Aplicar estilos estaticamente sobre elementos DOM de slot com os mesmos tamanhos passados para sua biblioteca de tags. Isto pode ajudar a garantir que a biblioteca não introduza mudanças de layout ao carregar. Se você não fizer isto, a biblioteca pode alterar o tamanho do elemento do slot após o layout da página.

Considere também os tamanhos de veiculações de anúncios menores. Se um anúncio menor for veiculado, um editor poderá definir o estilo do container (maior) para evitar deslocamentos no layout. A desvantagem dessa abordagem é que ela aumentará a quantidade de espaço em branco, portanto, lembre-se dessa compensação.

#### Evitar colocar anúncios perto do topo da janela de visualização

Anúncios próximos ao topo da janela de visualização podem provocar um deslocamento maior no layout do que aqueles que aparecem no meio. Isto ocorre porque os anúncios na parte superior geralmente fazem com que mais conteúdo desça, o que significa que mais elementos se movem quando o anúncio causa um deslocamento. Por outro lado, os anúncios próximos ao meio da janela de visualização podem não deslocar tantos elementos já que o conteúdo acima dele terá menos probabilidade de se mover.

### Incorporações e iframes

Widgets incorporáveis permitem incluir conteúdo portátil da web na sua página (por exemplo, vídeos do YouTube, mapas do Google Maps, postagens de mídia social e assim por diante). Essas incorporações podem assumir várias formas:

- Fallback de HTML e uma tag JavaScript transformando o substituto numa incorporação sofisticada
- Trecho de HTML inline
- Incorporação de iframe

Essas incorporações muitas vezes não sabem com antecedência qual será o tamanho do seu conteúdo (por exemplo, no caso de uma postagem de mídia social - ela vem com uma imagem incorporada? vídeo? múltiplas linhas de texto?). Como resultado, as plataformas que oferecem incorporações nem sempre reservam espaço suficiente para elas e podem causar deslocamentos de layout quando finalmente carregam.

<figure>
  {% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/NRhY88MbNJxe4o0F52eS.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/PzOpQnPH88Ymbe3MCH7B.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0TM1JilKPQktQgb94un.jpg", controls=true, loop=true, muted=true %}
 <figcaption>
    Incorporação sem reserva de espaço.
  </figcaption>
</figure>

<figure>
  {% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/aA8IoNeQTCEudE45hYzh.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/xjCWjSv4Z3YB29jSDGae.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gtYqKkoEse47ErJPqVjg.jpg", controls=true, loop=true, muted=true %}
 <figcaption>
  Incorporação com reserva de espaço.
  </figcaption>
</figure>

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2XaMbZBmUit1Vz8UBshH.png", alt="Lighthouse report showing the before/after impact to Cumulative Layout Shift of reserving space for this embed on CLS", width="800", height="148" %}
<figcaption>
  Impacto Lighthouse 6.0 na CLS da reserva de espaço para esta incorporação
</figcaption>
</figure>

Para contornar isso, você pode minimizar a CLS pré-computando espaço suficiente para incorporações com um placeholder ou fallback. Um workflow que você pode usar para incorporações é o seguinte:

- Obtenha a altura de sua incorporação final inspecionando-a com as ferramentas de desenvolvimento do seu navegador
- Assim que a incorporação for carregada, o iframe contido será redimensionado para que que seu conteúdo caiba.

Tome nota das dimensões e aplique estilos num placeholder para a incorporação de acordo. Você pode precisar levar em consideração diferenças sutis nos tamanhos dos anúncios / placeholders de posição entre os diferentes formatos usando consultas de mídia (media queries).

### Conteúdo dinâmico 📐

**Resumo:** evite inserir novo conteúdo acima do conteúdo existente, a menos que seja em resposta a uma interação do usuário. Isto garante que quaisquer mudanças de layout que ocorram sejam esperadas.

Você provavelmente já experimentou mudanças de layout devido à IU que surge na parte superior ou inferior da janela de visualização quando você está tentando carregar um site. Semelhante aos anúncios, isto geralmente acontece com banners e formulários que deslocam o restante do conteúdo da página:

- "Inscreva-se no nosso boletim!" (uau, vamos com calma! Acabamos de nos conhecer!)

- "Conteúdo relacionado"

- "Instale nosso aplicativo [iOS/Android]"

- "Ainda estamos recebendo pedidos"

- "Aviso RGPD"

  <figure>
    {% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/LEicZ7zHqGFrXl67Olve.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/XFvOHc2OB8vUD9GbpL2w.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PF9ulVHDQOvoWendb6ea.jpg", controls=true, loop=true, muted=true %}
   <figcaption>
        Conteúdo dinâmico sem reserva de espaço.
   </figcaption>
    </figure>

Se você precisar exibir esse tipo de recurso, reserve espaço suficiente na janela de visualização para ele com antecedência (por exemplo, usando um placeholder ou uma interface esqueleto) para que, quando carregar, não faça com que o conteúdo da página se desloque de repente.

Em alguns casos, adicionar conteúdo dinamicamente é uma parte importante da experiência do usuário. Por exemplo, ao carregar mais produtos para uma lista de itens ou ao atualizar o conteúdo do feed ao vivo. Existem várias maneiras de evitar mudanças inesperadas de layout nesses casos:

- Substitua o conteúdo antigo pelo novo conteúdo em um container de tamanho fixo ou use um carrossel e remova o conteúdo antigo após a transição. Lembre-se de desativar todos os links e controles até que a transição seja concluída para evitar cliques ou toques acidentais enquanto o novo conteúdo está chegando.
- Faça com que o usuário inicie o carregamento do novo conteúdo, para que ele não se surpreenda com a mudança (por exemplo, com um botão "Carregar mais" ou "Atualizar"). É recomendado pré-buscar o conteúdo antes da interação do usuário para que ele apareça imediatamente. Lembre-se que mudanças de layout que ocorrem dentro de 500 ms da entrada do usuário não são contadas para o CLS.
- Carregue totalmente o conteúdo fora da tela e sobreponha um aviso ao usuário de que as informações estão disponíveis (por exemplo, com um botão "Rolar para cima").

<figure>
  {% Img src="image/OcYv93SYnIg1kfTihK6xqRDebvB2/TjsYVkcDf03ZOVCcsizv.png", alt="Examples of dynamic content loading without causing unexpected layout shifts from Twitter and the Chloé website", width="800", height="458" %}
  <figcaption>Exemplos de carregamento de conteúdo dinâmico sem causar mudanças inesperadas de layout. Esquerda: Carregamento de conteúdo de feed ao vivo no Twitter. À direita: exemplo "Carregar mais" no site da Chloé. Confira como a equipe YNAP <a href="https://medium.com/ynap-tech/how-to-optimize-for-cls-when-having-to-load-more-content-3f60f0cf561c">otimizou para CLS ao carregar mais conteúdo</a>.</figcaption>
</figure>

### Fontes da Web que causam FOIT/FOUT

Baixar e renderizar fontes da web pode causar mudanças de layout de duas maneiras:

- A fonte de fallback foi trocada por uma nova fonte (FOUT - flash de texto sem estilo)
- Texto "invisível" é exibido até que uma nova fonte seja renderizada (FOIT - flash de texto invisível)

As seguintes ferramentas podem ajudá-lo a minimizar o problema:

- <code>[font-display](/font-display/)</code> permite que você modifique o comportamento da renderização de fontes personalizadas usando valores como <code>auto</code> , <code>swap</code> , <code>block</code> , <code>fallback</code> e <code>optional</code>. Infelizmente, todos esses valores (exceto [opcional](http://crrev.com/749080)) podem causar uma alteração de layout de uma das maneiras acima.
- A [Font Loading API](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#the_font_loading_api) pode reduzir o tempo necessário para obter as fontes necessárias.

Em relação ao Chrome 83, posso recomendar também o seguinte:

- Usar `<link rel=preload>` nas principais fontes da web: uma fonte pré-carregada terá uma chance maior de encontrar a primeira renderização, e nesse caso não haverá mudança de layout.
- Combinar `<link rel=preload>` e `font-display: optional`

Leia [Impedindo o deslocamento de layout e flashes de texto invisível (FOIT) ao carregar fontes opcionais](/preload-optional-fonts/) para mais detalhes.

### Animações 🏃‍♀️

**Resumo:** Prefira animações com `transform` em vez de animar propriedades que causam alterações de layout.

Mudanças nos valores das propriedades CSS podem exigir que o navegador reaja a essas alterações. Uma série de valores provocam um novo layout, renderização e composições, como `box-shadow` ,`box-sizing`. Diversas propriedades CSS podem ser alteradas de maneira menos onerosa.

Para saber mais sobre quais propriedades CSS causam alterações no layout, veja [Gatilhos CSS](https://csstriggers.com/) e [Animações de alto desempenho](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/).

### Ferramentas de desenvolvimento 🔧

Há uma série de ferramentas disponíveis para medir e depurar a Cumulative Layout Shift (CLS).

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) [6.0](https://github.com/GoogleChrome/lighthouse/releases) e superior inclui suporte a medição de CLS em ambiente de laboratório. Esta versão também destaca os nós que causam a maior parte dos deslocamentos no layout.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J11KOGFVAOjRMdihwX5t.jpg", alt="O Lighthouse 6.0 inclui suporte à medição de CLS na seção de métricas", width="800", height="309" %}

O painel [Performance](https://developer.chrome.com/docs/devtools/evaluate-performance/) no DevTools destaca os deslocamentos de layout na seção **Experience** a partir do Chrome 84. A tela **Summary** para um registro de `Layout Shift` inclui a pontuação do deslocamento cumulativo layout cumulativa, bem como uma sobreposição de retângulo mostrando as regiões afetadas.

<figure>{% Img src="image/admin/ApDKifKCRNGWI2SXSR1g.jpg", alt="Registros de mudança de layout exibidos no painel de desempenho do Chrome DevTools ao expandir a seção Experiência", width="800", height="438" %} <figcaption> Depois de registrar um novo registro no painel Performance, a seção <b>Experience</b> dos resultados é preenchida com uma barra tingida de vermelho exibindo um registro de <code>Layout Shift</code> Clicar no registro permite detalhar os elementos impactados (por exemplo, observe as entradas de movimento de/para).</figcaption></figure>

A medição da CLS no mundo real agregado num nível de origem também é possível usando o [Relatório de Experiência do Usuário Chrome](/chrome-ux-report-bigquery/) (CrUX). Os dados do CrUX para CLS estão disponíveis por meio do BigQuery e um [exemplo de consulta](https://github.com/GoogleChrome/CrUX/blob/master/sql/cls-summary.sql) está disponível para monitorar o desempenho da CLS.

É só isso para este guia. Espero que ele ajude a manter suas páginas um pouco menos evasivas :)

*Com agradecimentos a Philip Walton, Kenji Baheux, Warren Maresca, Annie Sullivan, Steve Kobes e Gilberto Cocchi por suas avaliações úteis.*
