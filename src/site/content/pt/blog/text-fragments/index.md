---
title: |2-

  Vincule com ousadia a onde ninguém vinculou antes: fragmentos de texto
subhead: |2-

  Fragmentos de texto permitem que você especifique um trecho de texto no fragmento de URL.

  Ao navegar para um URL com tal fragmento de texto, o navegador pode enfatizar e/ou chamar a atenção do usuário.
authors:
  - thomassteiner
date: 2020-06-17
updated: 2021-05-17
hero: image/admin/Y4NLEbOwgTWdMNoxRYXw.jpg
alt: ''
description: |2-

  Fragmentos de texto permitem que você especifique um trecho de texto no fragmento de URL.

  Ao navegar para um URL com tal fragmento de texto, o navegador pode enfatizar e/ou chamar a atenção do usuário.
tags:
  - blog
  - capabilities
feedback:
  - api
---

## Identificadores de fragmento

O Chrome 80 foi um grande lançamento. Ele continha uma série de recursos altamente esperados, como [Módulos ECMAScript em Web Workers](/module-workers/), [coalescência nula](https://v8.dev/features/nullish-coalescing), [encadeamento opcional](https://v8.dev/features/optional-chaining) e muito mais. O lançamento foi, como de costume, anunciado por meio de uma [postagem](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html) no blog do Chromium. Você pode ver um trecho da postagem do blog na imagem abaixo.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/egsW6tkKWYI8IHE6JyMZ.png", alt="", width="400", height="628" %} <figcaption>Postagem de blog do Chromium com caixas vermelhas ao redor de elementos com um atributo <code>id</code></figcaption>.</figure>

Você provavelmente está se perguntando o que todas as caixas vermelhas significam. Eles são o resultado da execução do seguinte fragmento no DevTools. Ele destaca todos os elementos que possuem um atributo `id`.

```js
document.querySelectorAll('[id]').forEach((el) => {
  el.style.border = 'solid 2px red';
});
```

Posso colocar um link direto para qualquer elemento destacado com uma caixa vermelha graças ao [identificador de fragmento](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Fragment) que uso no [hash](https://developer.mozilla.org/docs/Web/API/URL/hash) do URL da página. Supondo que eu quisesse criar um link direto para a caixa *Envie-nos seus comentários em nossos [Fóruns de produto](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)* à parte, poderia fazer isso criando manualmente o URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#HTML1&lt;/mark&gt;</code></a>. Como você pode ver no painel Elementos das Ferramentas do Desenvolvedor, o elemento em questão possui um `id` com o valor `HTML1`.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/whVXhhrYwA55S3i4J3l5.png", alt="", width="600", height="97" %} <figcaption>Ferramentas de desenvolvimento mostrando o <code>id</code> de um elemento.</figcaption></figure>

Se eu analisar este URL com o `URL()` do JavaScript, os diferentes componentes serão revelados. Observe a `hash` com o valor `#HTML1` .

```js/3
new URL('https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1');
/* Creates a new `URL` object
URL {
  hash: "#HTML1"
  host: "blog.chromium.org"
  hostname: "blog.chromium.org"
  href: "https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"
  origin: "https://blog.chromium.org"
  password: ""
  pathname: "/2019/12/chrome-80-content-indexing-es-modules.html"
  port: ""
  protocol: "https:"
  search: ""
  searchParams: URLSearchParams {}
  username: ""
}
*/
```

No entanto, o fato de eu ter que abrir as Ferramentas do desenvolvedor para encontrar o `id` de um elemento diz muito sobre a probabilidade de essa seção específica da página ter um link para o autor da postagem do blog.

E se eu quiser fazer um link para algo sem `id`? Digamos que eu queira criar um link para o título *Módulos ECMAScript em Web Workers*. Como você pode ver na imagem abaixo, o `<h1>` em questão não tem um `id`, o que significa que não há como vincular a este título. Esse é o problema que os fragmentos de texto resolvem.

<figure>% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1g4rTS1q5LKHEHnDoF9o.png", alt="", width="600", height="71" %} <figcaption>Ferramentas de desenvolvimento mostrando um título sem um <code>id</code>.</figcaption></figure>

## Fragmentos de texto

A proposta de [fragmentos de texto](https://wicg.github.io/ScrollToTextFragment/) adiciona suporte para a especificação de um trecho de texto no hash de URL. Ao navegar para uma URL com tal fragmento de texto, o agente do usuário pode enfatizar e/ou chamar a atenção do usuário.

### Compatibilidade do navegador

O recurso Fragmentos de texto é compatível com a versão 80 e posteriores dos navegadores baseados em Chromium. No momento em que este artigo foi escrito, o Safari e o Firefox não sinalizaram publicamente a intenção de implementar o recurso. Consulte os [links relacionados](#related-links) para obter dicas sobre as discussões do Safari e Firefox.

{% Aside 'success' %} Esses links costumavam não funcionar quando servidos por [redirecionamentos do lado do cliente](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Alternative_way_of_specifying_redirections) usados por alguns serviços comuns, como o Twitter. Esse problema foi rastreado como [crbug.com/1055455](https://crbug.com/1055455) e agora foi corrigido. [Redirecionamentos HTTP](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Principle) regulares sempre funcionaram bem. {% endAside %}

Por [razões de segurança](#security) , o recurso requer que os links sejam abertos em um contexto [`noopener`](https://developer.mozilla.org/docs/Web/HTML/Link_types/noopener). Portanto, certifique-se de incluir [`rel="noopener"`](https://developer.mozilla.org/docs/Web/HTML/Element/a#attr-rel) em sua `<a>` marcação de âncora ou adicione [`noopener`](https://developer.mozilla.org/docs/Web/API/Window/open#noopener) à sua `Window.open()` de recursos de funcionalidade de janela.

### `textStart`

Em sua forma mais simples, a sintaxe de fragmentos de texto é a seguinte: o símbolo hash `#` seguido por `:~:text=` e finalmente `textStart` , que representa o [texto codificado por cento](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) ao qual desejo um link.

```bash
#:~:text=textStart
```

Por exemplo, digamos que eu queira criar um link para o título *Módulos ECMAScript em Web Workers* na [postagem do blog anunciando recursos no Chrome 80](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html), o URL neste caso seria:

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules%20in%20Web%20Workers&lt;/mark&gt;</code></a>

O fragmento do texto é enfatizado<mark class="highlight-line highlight-line-active"> assim</mark>. Se você clicar no link em um navegador compatível como o Chrome, o fragmento de texto será destacado e aparecerá na tela:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D3jwPrJlvN3FmJo3pADt.png", alt="", width="400", height="208" %} <figcaption>Fragmento de texto rolado para exibição e destacado.</figcaption></figure>

### `textStart` e `textEnd`

Agora, e se eu quiser criar um link para toda a *seção* intitulada *Módulos ECMAScript em Web Workers*, não apenas seu título? A codificação percentual de todo o texto da seção tornaria a URL resultante impraticavelmente longa.

Felizmente, existe uma maneira melhor. Em vez de todo o texto, posso enquadrar o texto desejado usando a sintaxe `textStart,textEnd`. Portanto, eu especificar um par de palavras codificado por cento no início do texto desejado, e um par de palavras codificado por cento no final do texto desejado, separadas por uma vírgula `,`.

Isso se parece com isto:

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers.&lt;/mark&gt;</code></a>.

Para `textStart`, tenho `ECMAScript%20Modules%20in%20Web%20Workers`, depois uma vírgula `,` seguida por `ES%20Modules%20in%20Web%20Workers.` como `textEnd`. Quando você clica em um navegador compatível como o Chrome, toda a seção é destacada e rolada para a visualização:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D3jwPrJlvN3FmJo3pADt.png", alt="", width="400", height="208" %} <figcaption>Fragmento de texto rolado para exibição e destacado.</figcaption></figure>

Agora você pode se perguntar sobre minha escolha de `textStart` e `textEnd`. Na verdade, o URL um pouco mais curto <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules,Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules,Web%20Workers.&lt;/mark&gt;</code></a> com apenas duas palavras em cada lado também teria funcionado. Compare `textStart` e `textEnd` com os valores anteriores.

Se eu der um passo adiante e usar apenas uma palavra para `textStart` e `textEnd`, você verá que estou com problemas. O URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript,Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript,Workers.&lt;/mark&gt;</code></a> é ainda mais curto agora, mas o fragmento de texto destacado não é mais o originalmente desejado. O destaque para na primeira ocorrência da palavra `Workers.`, o que é correto, mas não o que pretendo destacar. O problema é que a seção desejada não é identificada exclusivamente pelos valores atuais `textStart` e `textEnd` uma palavra:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GGbbtHBpsoFyubnISyZw.png", alt="", width="400", height="342" %} <figcaption>Fragmento de texto não pretendido rolado para exibição e destacado.</figcaption></figure>

### `prefix-` e `-suffix`

Usar valores longos o suficiente para `textStart` e `textEnd` é uma solução para obter um link exclusivo. Em algumas situações, no entanto, isso não é possível. Por outro lado, por que escolhi a postagem do blog sobre o lançamento do Chrome 80 como meu exemplo? A resposta é que nesta versão foram introduzidos fragmentos de texto:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yA1p3CijeDbTRwMys9Hq.png", alt="Texto da postagem do blog: Fragmentos de URL de texto. Os usuários ou autores agora podem criar um link para uma parte específica de uma página usando um fragmento de texto fornecido em um URL. página é carregada, o navegador destaca o texto e rola o fragmento para exibição. Por exemplo, a URL abaixo carrega uma página wiki para 'Cat' e rola para o conteúdo listado no parâmetro `text`.", width="800", height="200" %} <figcaption>Trecho da postagem do blog do anúncio de fragmentos de texto.</figcaption></figure>

Observe como na imagem acima a palavra "texto" aparece quatro vezes. A quarta ocorrência é escrita em uma fonte de código verde. Se eu quisesse criar um link para essa palavra específica, `textStart` como `text` . Visto que a palavra "texto" é, bem, apenas uma palavra, não pode haver um `textEnd`. E agora? O URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=text"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=text&lt;/mark&gt;</code></a> corresponde à primeira ocorrência da palavra "Texto" já no cabeçalho:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nXxCskUwdCxwxejPSSZW.png", alt="", width="800", height="209" %} <figcaption>Correspondência de fragmentos de texto na primeira ocorrência de "Texto".</figcaption></figure>

{% Aside 'caution' %} Observe que a correspondência de fragmentos de texto não diferencia maiúsculas de minúsculas. {% endAside %}

Felizmente, existe uma solução. Em casos como este, posso especificar um `prefix​-` e um `-suffix`. A palavra antes da fonte do código verde "texto" é "o" e a palavra depois é "parâmetro". Nenhuma das outras três ocorrências da palavra "texto" tem as mesmas palavras circundantes. Armado com este conhecimento, eu posso ajustar o URL anterior e adicione o `prefix-` e o `-suffix`. Como os outros parâmetros, eles também precisam ser codificados por porcentagem e podem conter mais de uma palavra. <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=the-,text,-parameter"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=the-,text,-parameter&lt;/mark&gt;</code></a>. Para permitir que o analisador para identificar claramente o `prefix-` e o `-suffix`, eles precisam ser separados do `textStart` e o opcional `textEnd` com um hífen `-`.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J3L5BVSMmzGY6xdkabP6.png", alt="", width="800", height="203" %} <figcaption>Correspondência de fragmentos de texto na ocorrência desejada de "texto".</figcaption></figure>

### A sintaxe completa

A sintaxe completa dos fragmentos de texto é mostrada abaixo. (Os colchetes indicam um parâmetro opcional.) Os valores de todos os parâmetros precisam ser codificados por porcentagem. Isto é especialmente importante para os caracteres hífen `-`, e comercial `&` e vírgula `,` para que eles não estão sendo interpretados como parte da sintaxe diretiva de texto.

```bash
#:~:text=[prefix-,]textStart[,textEnd][,-suffix]
```

Cada `prefix-` , `textStart` , `textEnd` e `-suffix` só vai coincidir com o texto dentro de um único [elemento nível de bloco](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements#Elements), mas faixas completas `textStart,textEnd` *podem* abranger vários blocos. Por exemplo `:~:text=The quick,lazy dog` não corresponderá ao exemplo a seguir, porque a string inicial "O rápido" não aparece em um único elemento de nível de bloco ininterrupto:

```html
<div>
  The
  <div></div>
  quick brown fox
</div>
<div>jumped over the lazy dog</div>
```

No entanto, corresponde a este exemplo:

```html
<div>The quick brown fox</div>
<div>jumped over the lazy dog</div>
```

### Criação de URLs de fragmento de texto com uma extensão de navegador

Criar URLs de fragmentos de texto manualmente é entediante, especialmente quando se trata de garantir que sejam exclusivos. Se você realmente quiser, a especificação traz algumas dicas e lista as [etapas exatas para gerar URLs de fragmentos de texto](https://wicg.github.io/ScrollToTextFragment/#generating-text-fragment-directives). Fornecemos uma extensão de navegador de código aberto chamada [Link para fragmento de texto](https://github.com/GoogleChromeLabs/link-to-text-fragment), que permite criar um link para qualquer texto selecionando-o e clicando em "Copiar link para texto selecionado" no menu de contexto. Esta extensão está disponível para os seguintes navegadores:

- [Link para fragmento de texto para Google Chrome](https://chrome.google.com/webstore/detail/link-to-text-fragment/pbcodcjpfjdpcineamnnmbkkmkdpajjg)
- [Link para fragmento de texto para Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/link-to-text-fragment/pmdldpbcbobaamgkpkghjigngamlolag)
- [Link para fragmento de texto para Mozilla Firefox](https://addons.mozilla.org/firefox/addon/link-to-text-fragment/)
- [Link para fragmento de texto para Apple Safari](https://apps.apple.com/app/link-to-text-fragment/id1532224396)

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASLtFCPoHvyTKrAtKAv4.png", alt="", width="800", height="500" %} <figcaption> Extensão de navegador com <a href="https://github.com/GoogleChromeLabs/link-to-text-fragment">Link para fragmento de texto</a>.</figcaption></figure>

### Vários fragmentos de texto em um URL

Observe que vários fragmentos de texto podem aparecer em um URL. Os fragmentos de texto específicos precisam ser separados por um caractere de e comercial `&`. Aqui está um exemplo de link com três fragmentos de texto: <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet&lt;mark class="highlight-line highlight-line-active"&gt;</code></a>.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ffsq7aoSoVd9q6r5cquY.png", alt="", width="800", height="324" %} <figcaption>Três fragmentos de texto em um URL.</figcaption></figure>

### Mistura de elementos e fragmentos de texto

Fragmentos de elementos tradicionais podem ser combinados com fragmentos de texto. É perfeitamente normal ter ambos no mesmo URL, por exemplo, para fornecer um fallback significativo no caso de o texto original na página mudar, de modo que o fragmento de texto não corresponda mais. O URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums.&lt;/mark&gt;</code></a> vinculado à seção *Dê-nos feedback em nossos [Fóruns de produto](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)* contém um fragmento de elemento (`HTML1`), bem como um fragmento de `text=Give%20us%20feedback%20in%20our%20Product%20Forums.`):

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/JRKCM6Ihrq8sgRZRiymr.png", alt = "", width = "237", height = "121"%}<figcaption> Vinculando com fragmento de elemento e fragmento de texto.</figcaption></figure>

### A diretiva do fragmento

Há um elemento da sintaxe que ainda não expliquei: a diretiva fragment `:~:`. Para evitar problemas de compatibilidade com fragmentos de elemento de URL existentes, conforme mostrado acima, a [especificação de Fragmentos de Texto](https://wicg.github.io/ScrollToTextFragment/) apresenta a diretiva de fragmento. A diretiva de fragmento é uma parte do fragmento de URL delimitada pela sequência de código `:~:`. Ele é reservado para instruções do agente do usuário, como `text=` e é retirado do URL durante o carregamento para que os scripts do autor não possam interagir diretamente com ele. As instruções do agente do usuário também são chamadas de *diretivas*. No caso concreto, `text=` é, portanto, chamado de *diretiva de texto*.

### Detecção de recursos

Para detectar o suporte, teste a propriedade `fragmentDirective` `document`. A diretiva de fragmento é um mecanismo para URLs especificarem instruções direcionadas ao navegador ao invés do documento. Destina-se a evitar a interação direta com o script do autor, de forma que futuras instruções do agente do usuário possam ser adicionadas sem medo de introduzir alterações significativas no conteúdo existente. Um exemplo potencial de tais adições futuras poderia ser dicas de tradução.

```js
if ('fragmentDirective' in document) {
  // Text Fragments is supported.
}
```

{% Aside %} Do Chrome 80 ao Chrome 85, a `fragmentDirective` foi definida em `Location.prototype`. Para obter detalhes sobre essa mudança, consulte [WICG / scroll-to-text-fragment # 130](https://github.com/WICG/scroll-to-text-fragment/issues/130). {% endAside %}

A detecção de recursos destina-se principalmente a casos em que os links são gerados dinamicamente (por exemplo, por mecanismos de pesquisa) para evitar o envio de links de fragmentos de texto para navegadores que não os suportam.

### Estilização de fragmentos de texto

Por padrão, os navegadores estilizam fragmentos de texto da mesma forma que estilizam a [`mark`](https://developer.mozilla.org/docs/Web/HTML/Element/mark) (normalmente preto em amarelo, as [cores do sistema](https://developer.mozilla.org/docs/Web/CSS/color_value#system_colors) CSS para `mark`). A folha de estilo do agente do usuário contém CSS parecido com este:

```css
:root::target-text {
  color: MarkText;
  background: Mark;
}
```

Como você pode ver, o navegador expõe um pseudo seletor [`::target-text`](https://drafts.csswg.org/css-pseudo/#selectordef-target-text) que você pode usar para personalizar o realce aplicado. Por exemplo, você pode projetar seus fragmentos de texto para serem texto preto em um fundo vermelho. Como sempre, certifique-se de [verificar o contraste da cor](https://developer.chrome.com/docs/devtools/accessibility/reference/#contrast) para que seu estilo de substituição não cause problemas de acessibilidade e certifique-se de que o realce realmente se destaque visualmente do resto do conteúdo.

```css
:root::target-text {
  color: black;
  background-color: red;
}
```

### "Polyfillability"

O recurso Fragmentos de texto pode ser polyfilled até certo ponto. Fornecemos um [polyfill](https://github.com/GoogleChromeLabs/text-fragments-polyfill), que é usado internamente pela [extensão](https://github.com/GoogleChromeLabs/link-to-text-fragment), para navegadores que não oferecem suporte integrado para fragmentos de texto em que a funcionalidade é implementada em JavaScript.

### Geração de link de fragmento de texto programático

O [polyfill](https://github.com/GoogleChromeLabs/text-fragments-polyfill) contém um arquivo `fragment-generation-utils.js` que você pode importar e usar para gerar links de fragmento de texto. Isso é descrito no exemplo de código abaixo:

```js
const { generateFragment } = await import('https://unpkg.com/text-fragments-polyfill/dist/fragment-generation-utils.js');
const result = generateFragment(window.getSelection());
if (result.status === 0) {
  let url = `${location.origin}${location.pathname}${location.search}`;
  const fragment = result.fragment;
  const prefix = fragment.prefix ?
    `${encodeURIComponent(fragment.prefix)}-,` :
    '';
  const suffix = fragment.suffix ?
    `,-${encodeURIComponent(fragment.suffix)}` :
    '';
  const textStart = encodeURIComponent(fragment.textStart);
  const textEnd = fragment.textEnd ?
    `,${encodeURIComponent(fragment.textEnd)}` :
    '';
  url += `#:~:text=${prefix}${textStart}${textEnd}${suffix}`;
  console.log(url);
}
```

### Obtenção de fragmentos de texto para fins analíticos

Muitos sites usam o fragmento para roteamento, e é por isso que os navegadores retiram os fragmentos de texto para não quebrar essas páginas. Há uma [necessidade reconhecida](https://github.com/WICG/scroll-to-text-fragment/issues/128) de expor links de fragmentos de texto para páginas, por exemplo, para fins analíticos, mas a solução proposta ainda não foi implementada. Por enquanto, como solução alternativa, você pode usar o código a seguir para extrair as informações desejadas.

```js
new URL(performance.getEntries().find(({ type }) => type === 'navigate').name).hash;
```

### Segurança

As diretivas de fragmento de texto são chamadas apenas em navegações completas (não na mesma página) que são o resultado de uma [ativação do usuário](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation). Além disso, as navegações originadas de uma origem diferente do destino exigirão que a navegação ocorra em um [`noopener`](https://html.spec.whatwg.org/multipage/links.html#link-type-noopener), de forma que a página de destino seja conhecida como suficientemente isolada. As diretivas de fragmento de texto são aplicadas apenas ao quadro principal. Isso significa que o texto não será pesquisado dentro de iframes e a navegação de iframe não invocará um fragmento de texto.

### Privacidade

É importante que as implementações da especificação de fragmentos de texto não vazem se um fragmento de texto foi encontrado em uma página ou não. Embora os fragmentos de elementos estejam totalmente sob o controle do autor da página original, os fragmentos de texto podem ser criados por qualquer pessoa. Lembre-se de como no meu exemplo acima não havia como vincular ao título *Módulos ECMAScript em Web Workers*, uma vez que o `<h1>` não tinha um `id`, mas como qualquer um, inclusive eu, poderia simplesmente vincular a qualquer lugar, elaborando cuidadosamente o fragmento de texto?

Imagine que eu administrasse uma rede de anúncios do mal `evil-ads.example.com`. Além disso, imagine que em um de meus iframes de anúncios eu criei dinamicamente um iframe de origem cruzada oculto para `dating.example.com` com um URL de fragmento de texto <code>dating.example.com&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=Log%20Out&lt;/mark&gt;</code> uma vez que o usuário interage com o anúncio. Se o texto "Logout" for encontrado, sei que a vítima está atualmente conectada a `dating.example.com`, que eu poderia usar para criar o perfil do usuário. Como uma implementação ingênua de fragmentos de texto pode decidir que uma correspondência bem-sucedida deve causar uma troca de foco, em `evil-ads.example.com` eu poderia escutar o `blur` e, assim, saber quando uma correspondência ocorreu. No Chrome, implementamos fragmentos de texto de forma que o cenário acima não aconteça.

Outro ataque pode ser explorar o tráfego de rede com base na posição de rolagem. Suponha que eu tivesse acesso aos logs de tráfego de rede da minha vítima, como administrador da intranet de uma empresa. Agora imagine que existisse um longo documento de recursos humanos *O que fazer se você sofrer de …* e uma lista de condições como *esgotamento* , *ansiedade*, etc. Eu poderia colocar um pixel de rastreamento próximo a cada item da lista. Se eu determinar que o carregamento do documento ocorre simultaneamente com o carregamento do pixel de rastreamento ao lado, digamos, do *item queimado* , posso então, como administrador da intranet, determinar que um funcionário clicou em um link de fragmento de texto com `:~:text=burn%20out` que o funcionário pode ter assumido que era confidencial e não estava visível para ninguém. Uma vez que este exemplo é um tanto artificial para começar e como sua exploração requer pré-condições *muito* específicas para serem atendidas, a equipe de segurança do Chrome avaliou o risco de implementar a rolagem na navegação para ser gerenciável. Outros agentes de usuário podem decidir mostrar um elemento de IU de rolagem manual.

Para sites que desejam desistir, o Chromium oferece suporte a um [valor de cabeçalho de Política de Documento](https://wicg.github.io/document-policy/) que eles podem enviar para que os agentes do usuário não processem URLs de Fragmentos de Texto.

```bash
Document-Policy: force-load-at-top
```

## Desativando fragmentos de texto

A maneira mais fácil de desativar o recurso é usando uma extensão que pode injetar cabeçalhos de resposta HTTP, por exemplo, [ModHeader](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj) (não um produto do Google), para inserir um *cabeçalho de resposta (não* solicitação) da seguinte maneira:

```bash
Document-Policy: force-load-at-top
```

Outra forma mais envolvente de cancelar é usando a configuração corporativa [`ScrollToTextFragmentEnabled`](https://cloud.google.com/docs/chrome-enterprise/policies/?policy=ScrollToTextFragmentEnabled). Para fazer isso no macOS, cole o comando abaixo no terminal.

```bash
defaults write com.google.Chrome ScrollToTextFragmentEnabled -bool false
```

No Windows, siga a documentação no site de suporte da [Ajuda do Google Chrome Enterprise.](https://support.google.com/chrome/a/answer/9131254?hl=en)

{% Aside 'warning' %} Só tente fazer isso quando souber o que está fazendo. {% endAside %}

## Fragmentos de texto na pesquisa na web

Para algumas pesquisas, o mecanismo de busca Google fornece uma resposta rápida ou resumo com um snippet de conteúdo de um site relevante. É *mais provável que esses trechos em destaque* apareçam quando uma pesquisa é feita na forma de uma pergunta. Clicar em um snippet em destaque leva o usuário diretamente ao texto do snippet em destaque na página da web de origem. Isso funciona graças aos URLs de fragmentos de texto criados automaticamente.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KbZgnGxZOOymLxYPZyGH.png", alt="", width="800", height="451" %} <figcaption>Página de resultados do mecanismo de pesquisa do Google mostrando um snippet em destaque. A barra de status mostra o URL de fragmentos de texto.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4Q7zk9xBnb2uw8GRaLnU.png", alt="", width="800", height="451" %}Depois de clicar, a seção relevante da página é exibida na tela.</figure>

## Conclusão

URL de fragmentos de texto é um recurso poderoso para vincular a texto arbitrário em páginas da web. A comunidade acadêmica pode usá-lo para fornecer citações altamente precisas ou links de referência. Os mecanismos de pesquisa podem usá-lo para criar links diretos para resultados de texto nas páginas. Os sites de redes sociais podem usá-lo para permitir que os usuários compartilhem passagens específicas de uma página da web, em vez de capturas de tela inacessíveis. Espero que você comece a [usar URLs de fragmentos de texto](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&text=text,-parameter&text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%%20of%20a%20cat's%20diet) e os ache tão úteis quanto eu. Certifique-se de instalar a extensão do navegador [Link para fragmento de texto.](https://github.com/GoogleChromeLabs/link-to-text-fragment)

## Links Relacionados

- [Rascunho de especificações](https://wicg.github.io/scroll-to-text-fragment/)
- [Revisão de TAG](https://github.com/w3ctag/design-reviews/issues/392)
- [Entrada de status da plataforma Chrome](https://chromestatus.com/feature/4733392803332096)
- [Bug de rastreamento do Chrome](https://crbug.com/919204)
- [Intenção de enviar fio](https://groups.google.com/a/chromium.org/d/topic/blink-dev/zlLSxQ9BA8Y/discussion)
- [Tópico WebKit-Dev](https://lists.webkit.org/pipermail/webkit-dev/2019-December/030978.html)
- [Tópico de posição dos padrões da Mozilla](https://github.com/mozilla/standards-positions/issues/194)

## Reconhecimentos

Fragmentos de texto foi implementado e especificado por [Nick Burris](https://github.com/nickburris) e [David Bokan](https://github.com/bokand), com contribuições de [Grant Wang](https://github.com/grantjwang). Agradecimentos a [Joe Medley](https://github.com/jpmedley) pela revisão completa deste artigo. Imagem do herói por [Greg Rakozy](https://unsplash.com/@grakozy) em [Unsplash](https://unsplash.com/photos/oMpAz-DN-9I).
