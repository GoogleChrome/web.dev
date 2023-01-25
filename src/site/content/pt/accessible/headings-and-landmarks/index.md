---
layout: post
title: Títulos e pontos de referência
authors:
  - robdodson
date: 2018-11-18
description: |2-
  Usando os elementos corretos para títulos e pontos de referência, você pode
  melhorar expressivamente a experiência de navegação para usuários de tecnologia assistiva.
---

{% include 'content/why-headings.njk' %}

## Use títulos para delinear a página

Use os `h1` - `h6` para criar um esboço *estrutural* para sua página. O objetivo é criar um esqueleto ou estrutura da página de forma que qualquer pessoa que navegue pelos títulos possa formar uma imagem mental.

Uma prática comum é usar um único `h1` para o título principal ou logotipo em uma página, `h2` s para designar as seções principais e `h3` 's nas subseções de apoio:

```html
<h1>Company name</h1>
<section>
  <h2>Section Heading</h2>
  …
  <h3>Sub-section Heading</h3>
</section>
```

## Não ignore níveis de títulos

Os desenvolvedores costumam ignorar níveis de título para usar os estilos padrão do navegador que correspondem ao seu design. Isso é considerado um anti-padrão porque quebra o modelo de contorno.

Em vez de depender do tamanho de fonte padrão do navegador para títulos, use seu próprio CSS e não pule níveis.

Por exemplo, este site tem uma seção chamada "NAS NOTÍCIAS", seguida por duas manchetes:

{% Img src="image/admin/CdBjBuUo2yVVHWVFnQzx.png", alt="Um site de notícias com título, imagem principal e subseções.", width="800", height="414" %}

O título da seção, "NAS NOTÍCIAS", pode ser `h2`, e as manchetes de apoio podem ser `h3`.

Como o `font-size` "NA NOTÍCIA" é *menor* do que o título, pode ser tentador transformar o título da primeira história em `h2` e fazer "NAS NOTÍCIAS" em `h3`. Embora isso possa corresponder ao estilo padrão do navegador, quebraria o contorno transmitido a um usuário de leitor de tela!

{% Aside %} Embora possa parecer contra-intuitivo, não importa se *visualmente* `h3` 's e `h4` 's são maiores do que seus equivalentes `h2` ou `h1` O que importa é o contorno transmitido pelos elementos e a ordenação dos elementos. {% endAside %}

Você pode usar o Lighthouse para verificar se sua página pula algum nível de título. Execute a auditoria de acessibilidade (**Lighthouse &gt; Opções &gt; Acessibilidade**) e procure os resultados da auditoria de **títulos não ignore níveis**.

## Use pontos de referência para auxiliar a navegação

Os elementos HTML5, como `main`, `nav` e `aside` agem como **pontos de referência** ou regiões especiais na página para as quais um leitor de tela pode ignorar.

Use tags de pontos de referência para definir as seções principais de sua página, em vez de depender de `div`s. Tenha cuidado para não exagerar, pois ter *muitos* pontos de referência pode ser opressor. Por exemplo, concentre-se em apenas um `main`, em vez de 3 ou 4.

A Lighthouse recomenda auditar manualmente seu site para verificar se "os elementos de referência HTML5 são usados para melhorar a navegação". Você pode usar esta [lista de elementos de referência](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/landmarks/HTML5.html) para verificar sua página.

## Ignore o conteúdo repetitivo com links para pular

Muitos sites contêm navegação repetitiva em seus cabeçalhos, o que pode ser irritante para navegar com tecnologia de assistência. Use um **link** para ignorar para permitir que os usuários ignorem esse conteúdo.

Um link de pular é uma âncora fora da tela que é sempre o primeiro item focalizável no DOM. Normalmente, ele contém um link in-page para o conteúdo principal da página. Por ser o primeiro elemento no DOM, basta uma única ação da tecnologia assistiva para focalizá-lo e contornar a navegação repetitiva.

```html
<!-- index.html -->
<a class="skip-link" href="#main">Skip to main</a>
…
<main id="main">
  [Main content]
</main>
```

```css
/* style.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

{% Aside 'codelab' %} [Exemplo de pular link ao vivo.](https://skip-link.glitch.me/) {% endAside %}

Muitos sites populares, como [GitHub](https://github.com/), [The NY Times](https://www.nytimes.com/) e [Wikipédia,](https://wikipedia.org/) contêm links para ignorar. Experimente visitá-los e pressionar a `TAB` teclado algumas vezes.

O Lighthouse pode ajudá-lo a verificar se sua página contém um link para ignorar. Execute a auditoria de acessibilidade novamente e procure os resultados da auditoria **A página contém um título, link para ignorar ou região de referência**.

{% Aside %} Tecnicamente, este teste também será aprovado se o seu site contiver qualquer `h1` - `h6` ou qualquer um dos elementos de referência HTML5. Mas embora o teste seja vago em seus requisitos, ainda é bom passá-lo, se você puder! {% endAside %}
