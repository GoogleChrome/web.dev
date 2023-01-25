---
title: Usando a API HTML5 Drag and Drop
authors:
  - ericbidelman
  - rachelandrew
date: 2010-09-30
updated: 2021-08-30
description: |2-

  A API HTML5 Drag and Drop (DnD) significa que podemos tornar quase qualquer elemento em nossa página arrastável. Nesta postagem, vamos explicar
  os conceitos básicos de arrastar e soltar.
tags:
  - blog
  - html
  - javascript
  - file-system
---

A API HTML5 Drag and Drop (DnD) significa que podemos tornar quase qualquer elemento em nossa página arrastável. Nesta postagem, explicaremos os fundamentos de arrastar e soltar.

## Criação de conteúdo arrastável

É importante notar que, na maioria dos navegadores, as seleções de texto, imagens e links são arrastáveis por padrão. Por exemplo, se arrastar o logotipo do Google na [Pesquisa Google](https://google.com), você verá a imagem fantasma. Em seguida, a imagem pode ser solta na barra de endereço, um elemento `<input type="file" />` ou até mesmo a área de trabalho. Para tornar outros tipos de conteúdo arrastáveis, você precisa usar as APIs DnD HTML5.

Para tornar um objeto arrastável, defina `draggable=true` nesse elemento. Quase tudo pode ser habilitado para arrastar, imagens, arquivos, links, arquivos ou qualquer marcação em sua página.

Em nosso exemplo, estamos criando uma interface para reorganizar algumas colunas, que foram dispostas com CSS Grid. A marcação básica para minhas colunas é semelhante a esta, com cada uma tendo o atributo `draggable` definido como `true` .

```html
<div class="container">
  <div draggable="true" class="box">A</div>
  <div draggable="true" class="box">B</div>
  <div draggable="true" class="box">C</div>
</div>
```

Aqui está o CSS para meus elementos de contêiner e caixa. Observe que o único CSS relacionado à funcionalidade DnD é a propriedade [`cursor: move`](https://developer.mozilla.org/docs/Web/CSS/cursor). O resto do código apenas controla o layout e o estilo dos elementos do contêiner e da caixa.

```css/11
.container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.box {
  border: 3px solid #666;
  background-color: #ddd;
  border-radius: .5em;
  padding: 10px;
  cursor: move;
}
```

Neste ponto, você descobrirá que pode arrastar os itens, mas nada mais acontecerá. Para adicionar a funcionalidade DnD, precisamos usar a API JavaScript.

## Ouvindo eventos de arrastar

Existem vários eventos diferentes para anexar e monitorar todo o processo de arrastar e soltar.

- [`dragstart`](https://developer.mozilla.org/docs/Web/API/Document/dragstart_event)
- [`drag`](https://developer.mozilla.org/docs/Web/API/Document/drag_event)
- [`dragenter`](https://developer.mozilla.org/docs/Web/API/Document/dragenter_event)
- [`dragleave`](https://developer.mozilla.org/docs/Web/API/Document/dragleave_event)
- [`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event)
- [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event)
- [`dragend`](https://developer.mozilla.org/docs/Web/API/Document/dragend_event)

Para lidar com o fluxo DnD, você precisa de algum tipo de elemento de origem (de onde se origina o arraste), a carga útil de dados (o que você está tentando soltar) e um destino (uma área para soltar). O elemento de origem pode ser uma imagem, lista, link, objeto de arquivo, bloco de HTML, etc. O destino é a zona para soltar (ou conjunto de zonas para soltar) que aceita os dados que o usuário está tentando eliminar. Lembre-se de que nem todos os elementos podem ser destino. Por exemplo, uma imagem não pode ser destino.

## Iniciando e terminando uma sequência de arrastar e soltar

Depois de ter os atributos `dragstart` `draggable="true"` definidos em seu conteúdo, anexe um manipulador de evento dragstart para iniciar a sequência DnD para cada coluna.

Este código definirá a opacidade da coluna para 40% quando o usuário começar a arrastá-la e, em seguida, retornará para 100% quando o evento de arrastar terminar.

```js
function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });
```

O resultado pode ser visto na demonstração do Glitch abaixo. Arraste um item e ele se tornará opaco. Como o destino do evento `dragstart` é o elemento de origem, definir `this.style.opacity` como 40% fornece ao usuário um feedback visual de que o elemento é a seleção atual que está sendo movida. Depois de soltar o item, embora a funcionalidade de soltar não esteja em vigor, o elemento de origem retorna para 100% de opacidade.

{% Glitch {id: 'simple-drag-and-drop-1', path: 'style.css'}%}

## Adicione pistas visuais adicionais com `dragenter` , `dragover` e `dragleave`

Para ajudar o usuário a entender como interagir com sua interface, use os manipuladores de evento `dragenter`, `dragover` e `dragleave`. Neste exemplo, as colunas são destinos para soltar, além de serem arrastáveis. Ajude o usuário a entender isso fazendo a borda tracejada enquanto segura um item arrastado sobre uma coluna. Por exemplo, em seu CSS, você pode criar uma `over` para representar os elementos que são destinos de soltar:

```css
.box.over {
  border: 3px dotted #666;
}
```

Em seguida, no seu JavaScript, configure os manipuladores de eventos, adicione a classe `over` quando a coluna for arrastada e remova ao sair. No manipulador `dragend`, também removemos as classes no final do arraste.

```js/9-11,14-28,34-36
document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
});
```

{% Glitch { id: 'simple-drag-drop2', path: 'dnd.js' } %}

Existem alguns pontos que valem a pena cobrir neste código:

- No caso de arrastar algo como um link, você precisa evitar o comportamento padrão do navegador, que é navegar até esse link. Para fazer isso, chame `e.preventDefault()` no evento `dragover`. Outra boa prática é retornar `false` nesse mesmo manipulador.
- O `dragenter` é usado para ativar ou desativar a classe `over` em vez de `dragover`. Se você usar `dragover`, a classe CSS será alternada várias vezes enquanto o evento `dragover` continua a disparar em um foco de coluna. Em última análise, isso faria com que o renderizador do navegador fizesse uma grande quantidade de trabalho desnecessário. Manter os redesenhos no mínimo é sempre uma boa ideia. Se você precisar usar o evento `dragover` para algo, considere [restringir ou eliminar o ouvinte de evento](https://css-tricks.com/debouncing-throttling-explained-examples/).

## Terminando de soltar

Para processar a ação de soltar, adicione um ouvinte de evento ao evento de `drop`. No manipulador `drop`, você precisará evitar o comportamento padrão do navegador para ações de soltar, que normalmente é algum tipo de redirecionamento irritante. Você pode evitar o surgimento do evento ao chamar `e.stopPropagation()`.

```js
function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  return false;
}
```

Registre o novo manipulador entre os outros manipuladores:

```js/7-7
  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
```

Se você executar o código neste ponto, o item não será solto no novo local. Para isso, você precisa usar o objeto [`DataTransfer`](https://developer.mozilla.org/docs/Web/API/DataTransfer).

A propriedade `dataTransfer` é onde toda a mágica da DnD acontece. Contém os dados enviados em uma ação de arraste. `dataTransfer` é definida no `dragstart` e lida/manipulada no evento de soltar. Chamar `e.dataTransfer.setData(mimeType, dataPayload)` permite definir o tipo MIME do objeto e a carga de dados.

Neste exemplo, vamos permitir que os usuários reorganizem a ordem das colunas. Para fazer isso, primeiro você precisa armazenar o HTML do elemento de origem quando o arraste começar:

  <figure>
    <video controls autoplay loop muted>
      <source src="https://storage.googleapis.com/web-dev-assets/drag-and-drop/webdev-dnd.mp4" type="video/mp4">
    </source></video>
  </figure>

```js/3-6
function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}
```

No evento `drop`, você processa a ação de soltar a coluna, configurando o HTML da coluna de origem como o HTML da coluna de destino em que você soltou, primeiro verificando se o usuário não está caindo de volta na mesma coluna da qual foi arrastado.

```js/5-8
function handleDrop(e) {
  e.stopPropagation();

  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  return false;
}
```

Você pode ver o resultado na demonstração a seguir. Arraste e solte a coluna A no topo da coluna B e observe como mudam de lugar:

{% Glitch { id: 'arrastar e soltar simplificado', path: 'dnd.js' } %}

## Mais propriedades de arraste

O objeto `dataTransfer` expõe propriedades para fornecer feedback visual ao usuário durante o processo de arraste. Essas propriedades também podem ser usadas para controlar como cada destino da ação de soltar responde a um determinado tipo de dados.

- [`dataTransfer.effectAllowed`](https://developer.mozilla.org/docs/Web/API/DataTransfer/effectAllowed) restringe o "tipo de arraste" que o usuário pode executar no elemento. Ele é usado no modelo de processamento de arrastar e soltar para inicializar o `dropEffect` durante os eventos `dragenter` e `dragover`. A propriedade pode ser definida com os seguintes valores: `none`, `copy`, `copyLink`, `copyMove`, `link`, `linkMove`, `move`, `all` e `uninitialized`.
- [`dataTransfer.dropEffect`](https://developer.mozilla.org/docs/Web/API/DataTransfer/dropEffect) controla o feedback que o usuário recebe durante os eventos `dragenter` e `dragover`. Quando o usuário passa o mouse sobre um elemento de destino, o cursor do navegador indica que tipo de operação ocorrerá (por exemplo, uma cópia, uma movimentação, etc.). O efeito pode assumir um dos seguintes valores: `none`, `copy`, `link`, `move`.
- [`e.dataTransfer.setDragImage(imgElement, x, y)`](https://developer.mozilla.org/docs/Web/API/DataTransfer/setDragImage) significa que em vez de usar o feedback de "imagem fantasma" padrão do navegador, você pode, opcionalmente, definir um ícone de arrastar.

## Upload de arquivo com arrastar e soltar

Este exemplo simples usa uma coluna como origem e destino do arraste. Isso pode ser visto em uma IU em que o usuário é solicitado a reorganizar os itens. Em algumas situações, o destino e a origem do arraste podem ser diferentes, como uma interface em que o usuário precisa selecionar uma imagem para ser a imagem principal de um produto arrastando a imagem selecionada para um destino.

Arrastar e soltar é usado frequentemente para permitir que os usuários arrastem itens de sua área de trabalho para um aplicativo. A principal diferença está em seu gerenciador de `drop` Em vez de usar `dataTransfer.getData()` para acessar os arquivos, seus dados estarão contidos na propriedade `dataTransfer.files`:

```js
function handleDrop(e) {
  e.stopPropagation(); // Stops some browsers from redirecting.
  e.preventDefault();

  var files = e.dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    // Read the File objects in this FileList.
  }
}
```

Você pode encontrar mais informações sobre isso em [arrastar e soltar personalizado](/read-files/#select-dnd).

## Mais recursos

- [Especificação de arrastar e soltar](https://html.spec.whatwg.org/multipage/dnd.html#dnd)
- [API de arrastar e soltar HTML MDN](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)
- [Como fazer um carregador de arrastar e soltar com o Vanilla JavaScript](https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/)
- [Como criar um jogo de estacionamento com a API HTML Drag and Drop](https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/)
- [Como usar a API de arrastar e soltar do HTML no React](https://www.smashingmagazine.com/2020/02/html-drag-drop-api-react/)
