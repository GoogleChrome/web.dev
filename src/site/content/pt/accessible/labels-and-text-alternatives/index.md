---
layout: post
title: Rótulos e alternativas de texto
authors:
  - robdodson
date: 2018-11-18
description: |2-
  Para que um leitor de tela apresente uma IU falada ao usuário,
  os elementos devem ter rótulos adequados ou alternativas de texto. Um rótulo ou texto
  alternativa proporciona a um elemento seu nome acessível, uma das propriedades-chave
  para expressar a semântica do elemento na árvore de acessibilidade.
---

Para que um leitor de tela apresente uma IU falada ao usuário, os elementos significativos devem ter rótulos adequados ou alternativas de texto. Um rótulo ou texto alternativo fornece a um elemento seu **nome** acessível, uma das principais propriedades para [expressar a semântica do elemento na árvore de acessibilidade](/semantics-and-screen-readers/#semantic-properties-and-the-accessibility-tree).

Quando o nome de um elemento é combinado com a **função** do elemento, ele fornece o contexto do usuário para que ele possa entender com qual tipo de elemento está interagindo e como é representado na página. Se um nome não estiver presente, um leitor de tela apenas anunciará a função do elemento. Imagine tentar navegar em uma página e ouvir "botão", "caixa de seleção", "imagem" sem qualquer contexto adicional. É por isso que a rotulagem e as alternativas de texto são cruciais para uma experiência boa e acessível.

## Inspecionar o nome de um elemento

É fácil verificar o nome acessível de um elemento usando o Chrome DevTools:

1. Clique com o botão direito em um elemento e escolha **Inspecionar**. Isso abre o painel DevTools Elements.
2. No painel Elementos, procure o painel **Acessibilidade.** Ele pode estar oculto por trás de um símbolo `»`.
3. No menu suspenso **Propriedades computadas**, procure a propriedade **Nome**.

<figure>{% Img src="image/admin/38c68DmamTCqt2LFxTmu.png", alt="", width="800", height="471" %} <figcaption> Painel de acessibilidade do DevTools mostrando o nome calculado para um botão.</figcaption></figure>

{% Aside %} Para saber mais, consulte a [Referência de acessibilidade](https://developer.chrome.com/docs/devtools/accessibility/reference/) do DevTools. {% endAside %}

Quer você esteja olhando para um `img` com `alt` ou uma `input` com um `label`, todos esses cenários resultam no mesmo resultado: dar a um elemento seu nome acessível.

## Verificar se faltam nomes

Há diferentes maneiras de adicionar um nome acessível a um elemento, dependendo de seu tipo. A tabela a seguir lista os tipos de elemento mais comuns que precisam de nomes e links acessíveis para explicações sobre como adicioná-los.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Tipo de elemento</th>
        <th>Como adicionar um nome</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Documento HTML</td>
        <td><a href="#label-documents-and-frames">Rotular documentos e frames</a></td>
      </tr>
      <tr>
        <td>Elementos <code>&lt;frame&gt;</code> ou <code>&lt;iframe&gt;</code>
</td>
        <td><a href="#label-documents-and-frames">Rotular documentos e frames</a></td>
      </tr>
      <tr>
        <td>Elementos de imagem</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">Incluir alternativas de texto para imagens e objetos</a></td>
      </tr>
      <tr>
        <td>
<code>&lt;input type="image"&gt;</code> elementos</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">Incluir alternativas de texto para imagens e objetos</a></td>
      </tr>
      <tr>
        <td>elementos <code>&lt;object&gt;</code>
</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">Incluir alternativas de texto para imagens e objetos</a></td>
      </tr>
      <tr>
        <td>Botões</td>
        <td><a href="#label-buttons-and-links">Botões e links de rótulos</a></td>
      </tr>
      <tr>
        <td>Links</td>
        <td><a href="#label-buttons-and-links">Botões e links de rótulos</a></td>
      </tr>
      <tr>
        <td>Elementos de formulário</td>
        <td><a href="#label-form-elements">Rotular os elementos do formulário</a></td>
      </tr>
    </tbody>
  </table>
</div>

## Rotular documentos e frames

Cada página deve ter um [`title`](https://developer.mozilla.org/docs/Web/HTML/Element/title) que explica resumidamente do que trata a página. O `title` dá à página seu nome acessível. Quando um leitor de tela entra na página, este é o primeiro texto anunciado.

Por exemplo, a página abaixo tem o título "Mary's Maple Bar Fast-Baking Recipe":

```html/3
<!doctype html>
  <html lang="en">
    <head>
      <title>Mary's Maple Bar Fast-Baking Recipe</title>
    </head>
  <body>
    …
  </body>
</html>
```

{% Aside %} Para dicas sobre como escrever títulos eficazes, consulte o [guia Escrever títulos descritivos](/write-descriptive-text). {% endAside %}

Da mesma forma, qualquer `frame` ou `iframe` deve ter atributos de `title`:

```html
<iframe title="An interactive map of San Francisco" src="…"></iframe>
```

Embora o `iframe` possa conter seu próprio `title` interno, um leitor de tela geralmente para no limite do quadro e anuncia a função do elemento - "frame" - e seu nome acessível, fornecido pelo atributo `title` Isso permite que o usuário decida se deseja entrar no frame ou ignorá-lo.

## Incluir alternativas de texto para imagens e objetos

Um `img` deve sempre ser acompanhado por um [`alt`](https://developer.mozilla.org/docs/Web/HTML/Element/img#Attributes) para dar à imagem seu nome acessível. Se a imagem não carregar, o `alt` é usado como um espaço reservado para que os usuários tenham uma ideia do que a imagem estava tentando transmitir.

Escrever um bom `alt` é um pouco uma arte, mas existem algumas diretrizes que você pode seguir:

1. Determine se a imagem fornece conteúdo que, de outra forma, seria difícil de obter com a leitura do texto ao redor.
2. Em caso afirmativo, transmita o conteúdo da forma mais sucinta possível.

Se a imagem atuar como decoração e não fornecer nenhum conteúdo útil, você pode atribuir a ela um `alt=""` vazio para removê-la da árvore de acessibilidade.

{% Aside %} Saiba mais sobre como escrever um `alt` eficaz, verificando [o guia de texto alternativo do WebAIM](https://webaim.org/techniques/alttext/). {% endAside %}

### Imagens como links e entradas

Uma imagem envolvida em um link deve usar o `alt` da `img` para descrever para onde o usuário será direcionado se clicar no link:

```html
<a href="https://en.wikipedia.org/wiki/Google">
  <img alt="Google's wikipedia page" src="google-logo.jpg">
</a>
```

Da mesma forma, se um elemento `<input type="image">` for usado para criar um botão de imagem, ele deve conter um `alt` que descreve a ação que ocorre quando o usuário clica no botão:

```html/5
<form>
  <label>
    Username:
    <input type="text">
  </label>
  <input type="image" alt="Sign in" src="./sign-in-button.png">
</form>
```

### Objetos integrados

Elementos `<object>`, que normalmente são usados para integrações como Flash, PDFs ou ActiveX, também devem conter texto alternativo. Semelhante às imagens, este texto é exibido se o elemento falhar na renderização. O texto alternativo vai dentro do `object` como texto normal, como "Relatório anual" abaixo:

```html
<object type="application/pdf" data="/report.pdf">
Annual report.
</object>
```

## Botões e links de rótulos

Botões e links costumam ser cruciais para a experiência de um site, e é importante que ambos tenham nomes acessíveis.

### Botões

Um `button` sempre tenta calcular seu nome acessível usando seu conteúdo de texto. Para botões que não fazem parte de um `form`, escrever uma ação clara como o conteúdo do texto pode ser tudo de que você precisa para criar um bom nome acessível.

```html
<button>Book Room</button>
```

{% Img src="image/admin/tcIDzNpCHS9AlfwflQjI.png", alt="Um formulário móvel com um botão 'Reservar sala'.", width="800", height="269" %}

Uma exceção comum a essa regra são os botões de ícone. Um botão de ícone pode usar uma imagem ou uma fonte de ícone para fornecer o conteúdo de texto para o botão. Por exemplo, os botões usados em um editor O que você vê é o que você obtém (WYSIWYG) para formatar texto são normalmente apenas símbolos gráficos:

{% Img src="image/admin/ZmQ77kLPbqd5iFOmn4SU.png", alt="Um botão de ícone de alinhamento à esquerda.", width="800", height="269" %}

Ao trabalhar com botões de ícone, pode ser útil dar a eles um nome acessível explícito usando o atributo `aria-label`. O atributo `aria-label` substitui qualquer conteúdo de texto dentro do botão, permitindo que você descreva claramente a ação para qualquer pessoa que use um leitor de tela.

```html
<button aria-label="Left align"></button>
```

### Links

Semelhante aos botões, os links recebem seu nome acessível principalmente de seu conteúdo de texto. Um bom truque ao criar um link é colocar a parte mais significativa do texto no próprio link, em vez de palavras de preenchimento como "Aqui" ou "Leia mais".

{% Compare 'worse', 'Not descriptive enough' %}

```html
Check out our guide to web performance <a href="/guide">here</a>.
```

{% endCompare %}

{% Compare 'better', 'Useful content!' %}

```html
Check out <a href="/guide">our guide to web performance</a>.
```

{% endCompare %}

Isso é especialmente útil para leitores de tela que oferecem atalhos para listar todos os links na página. Se os links estiverem cheios de textos de preenchimento repetitivos, esses atalhos se tornam muito menos úteis:

<figure>{% Img src="image/admin/IPxS2dwHMyGRvGxGi5n2.jpg", alt="Menu de links de narração preenchida com a palavra 'Aqui'.", width="519", height="469" %} <figcaption>  Exemplo de narração, um leitor de tela para macOS, mostrando o menu navegar por links.</figcaption></figure>

## Rotular os elementos do formulário

Existem duas maneiras de associar um rótulo a um elemento de formulário, como uma caixa de seleção. Qualquer um dos métodos faz com que o texto do rótulo também se torne um alvo de clique para a caixa de seleção, o que também é útil para usuários de mouse ou touchscreen. Para associar um rótulo a um elemento:

- Coloque o elemento de entrada dentro de um elemento de rótulo

```html
<label>
  <input type="checkbox">Receive promotional offers?</input>
</label>
```

- Ou use o rótulo `for` atributo e consulte o `id`

```html
<input id="promo" type="checkbox"></input>
<label for="promo">Receive promotional offers?</label>
```

Quando a caixa de seleção está marcada corretamente, o leitor de tela pode relatar que o elemento tem uma função de caixa de seleção, está em um estado marcado e é denominado "Receber ofertas promocionais?" como no exemplo do VoiceOver abaixo:

<figure>{% Img src="image/admin/WklT2ymrCmceyrGUNizF.png", alt="Saída de texto de narração mostrando 'Receber ofertas promocionais?'", width="640", height="174" %}<br>{% Assessment 'self-assessment' %}</figure>

{% Assessment 'self-assessment' %}
