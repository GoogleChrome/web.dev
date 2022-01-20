---
title: 'ResizeObserver: é como document.onresize para elementos'
subhead: "`ResizeObserver` permite que você saiba quando o tamanho de um elemento muda."
authors:
  - surma
  - joemedley
date: 2016-10-07
updated: 2020-05-26
hero: image/admin/WJ69aw9UMPwsc7ShYvif.jpg
alt: Cultivo de plantas em caixas.
description: |2

  `ResizeObserver` notifica você quando o retângulo de conteúdo de um elemento muda

  tamanho para que você possa reagir de acordo.
tags:
  - blog
  - dom
  - javascript
  - layout
  - rendering
feedback:
  - api
---

Antes de `ResizeObserver`, você tinha que anexar um ouvinte ao `resize` do documento para ser notificado sobre qualquer alteração nas dimensões da janela de visualização. No manipulador de eventos, você teria que descobrir quais elementos foram afetados por aquela mudança e chamar uma rotina específica para reagir apropriadamente. Se você precisava das novas dimensões de um elemento após um redimensionamento, você teve que chamar `getBoundingClientRect()` ou `getComputedStyle()`, que pode causar goleada de layout, se você não cuidar de dosagem *toda* a sua lê e *todas as* suas gravações.

Isso nem mesmo abrange os casos em que os elementos mudam de tamanho sem que a janela principal tenha sido redimensionada. Por exemplo, anexar novos filhos, definir o estilo de `display` `none` ou ações semelhantes podem alterar o tamanho de um elemento, seus irmãos ou ancestrais.

É por isso que `ResizeObserver` é um primitivo útil. Ele reage às mudanças no tamanho de qualquer um dos elementos observados, independentemente do que causou a mudança. Ele também fornece acesso ao novo tamanho dos elementos observados.

## API

Todas as APIs com o `Observer` que mencionamos acima compartilham um design de API simples. `ResizeObserver` não é exceção. Você cria um `ResizeObserver` e passa um retorno de chamada para o construtor. O retorno de chamada é passado para uma matriz de `ResizeObserverEntry` - uma entrada por elemento observado - que contém as novas dimensões para o elemento.

```js
var ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    const cr = entry.contentRect;
    console.log('Element:', entry.target);
    console.log(`Element size: ${cr.width}px x ${cr.height}px`);
    console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
  }
});

// Observe one or multiple elements
ro.observe(someElement);
```

## Alguns detalhes

### O que está sendo relatado?

Geralmente, um [`ResizeObserverEntry`](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry) relata a caixa de conteúdo de um elemento por meio de uma propriedade chamada `contentRect` , que retorna um objeto [`DOMRectReadOnly`](https://developer.mozilla.org/docs/Web/API/DOMRectReadOnly). A caixa de conteúdo é a caixa na qual o conteúdo pode ser colocado. É a caixa da borda sem o preenchimento.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CKxpe8LNq2CMPFdtLtVK.png", alt="Um diagrama do modelo de caixa CSS.", width="727", height="562" %}</figure>

É importante observar que, embora `ResizeObserver` *relate* as dimensões do `contentRect` e do preenchimento, ele apenas *observa* o `contentRect`. *Não* confunda `contentRect` com a caixa delimitadora do elemento. A caixa delimitadora, conforme relatado por `getBoundingClientRect()`, é a caixa que contém o elemento inteiro e seus descendentes. Os SVGs são uma exceção à regra, em que `ResizeObserver` relatará as dimensões da caixa delimitadora.

A partir do Chrome 84, `ResizeObserverEntry` tem três novas propriedades para fornecer informações mais detalhadas. Cada uma dessas propriedades retorna um `ResizeObserverSize` contendo uma `blockSize` e uma propriedade `inlineSize` Essas informações são sobre o elemento observado no momento em que o retorno de chamada é invocado.

- `borderBoxSize`
- `contentBoxSize`
- `devicePixelContentBoxSize`

Todos esses itens retornam matrizes somente leitura porque, no futuro, espera-se que possam oferecer suporte a elementos com vários fragmentos, que ocorrem em cenários de várias colunas. Por enquanto, essas matrizes conterão apenas um elemento.

O suporte da plataforma para essas propriedades é limitado, mas o [Firefox já oferece suporte](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry#Browser_compatibility) para as duas primeiras.

### Quando está sendo relatado?

A especificação proíbe que `ResizeObserver` deve processar todos os eventos de redimensionamento antes de pintar e depois do layout. Isso torna o retorno de chamada de um `ResizeObserver` o lugar ideal para fazer alterações no layout da sua página. Como o `ResizeObserver` ocorre entre o layout e a pintura, isso apenas invalidará o layout, não a pintura.

### Peguei vocês

Você deve estar se perguntando: o que acontece se eu alterar o tamanho de um elemento observado dentro do retorno de chamada para `ResizeObserver`? A resposta é: você ativará outra chamada para o retorno de chamada imediatamente. Felizmente, `ResizeObserver` tem um mecanismo para evitar loops de retorno de chamada infinitos e dependências cíclicas. As alterações só serão processadas no mesmo quadro se o elemento redimensionado for mais profundo na árvore DOM do que o *elemento mais superficial* processado no retorno de chamada anterior. Caso contrário, eles serão adiados para o próximo quadro.

## Aplicativo

Uma coisa que `ResizeObserver` permite que você faça é implementar consultas de mídia por elemento. Ao observar os elementos, você pode definir imperativamente os pontos de interrupção do projeto e alterar os estilos de um elemento. [No exemplo](https://googlechrome.github.io/samples/resizeobserver/) a seguir, a segunda caixa mudará o raio da borda de acordo com sua largura.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_vp8.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_x264.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    entry.target.style.borderRadius =
        Math.max(0, 250 - entry.contentRect.width) + 'px';
  }
});
// Only observe the second box
ro.observe(document.querySelector('.box:nth-child(2)'));
```

Outro exemplo interessante de se ver é uma janela de bate-papo. O problema que surge em um layout típico de conversa de cima para baixo é o posicionamento da rolagem. Para evitar confundir o usuário, é útil se a janela ficar no final da conversa, onde as mensagens mais recentes aparecem. Além disso, qualquer tipo de mudança de layout (pense em um telefone passando de paisagem para retrato ou vice-versa) deve ter o mesmo resultado.

`ResizeObserver` permite que você escreva uma *única* parte do código que cuida de *ambos os* cenários. Redimensionar a janela é um evento que um `ResizeObserver` pode capturar por definição, mas chamar `appendChild()` também redimensiona esse elemento (a menos que `overflow: hidden` esteja definido), porque ele precisa abrir espaço para os novos elementos. Com isso em mente, são necessárias poucas linhas para atingir o efeito desejado:

<figure>
 <video controls autoplay loop muted>
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_vp8.webm" type="video/webm; codecs=vp8">
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_x264.mp4" type="video/mp4; codecs=h264">
 </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  document.scrollingElement.scrollTop =
    document.scrollingElement.scrollHeight;
});

// Observe the scrollingElement for when the window gets resized
ro.observe(document.scrollingElement);
// Observe the timeline to process new messages
ro.observe(timeline);
```

Muito legal, hein?

A partir daqui, eu poderia adicionar mais código para lidar com o caso em que o usuário rolou para cima manualmente e deseja rolar para manter *essa* mensagem quando uma nova mensagem chegar.

Outro caso de uso é para qualquer tipo de elemento personalizado que esteja fazendo seu próprio layout. Até `ResizeObserver`, não havia uma maneira confiável de ser notificado quando suas dimensões mudam para que seus filhos possam ser dispostos novamente.

## Conclusão

`ResizeObserver` está disponível na [maioria dos principais navegadores](https://developer.mozilla.org/docs/Web/API/ResizeObserver#Browser_compatibility). Em alguns casos, essa disponibilidade é bastante recente. Existem [alguns polyfills disponíveis,](https://github.com/WICG/ResizeObserver/issues/3) mas não é possível duplicar completamente a funcionalidade do `ResizeObserver`. As implementações atuais dependem da pesquisa ou da adição de elementos sentinela ao DOM. O primeiro irá drenar sua bateria no celular, mantendo a CPU ocupada, enquanto o último modifica seu DOM e pode bagunçar o estilo e outros códigos dependentes de DOM.

Foto de [Markus Spiske](https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) no [Unsplash](https://unsplash.com/s/photos/observe-growth?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).
