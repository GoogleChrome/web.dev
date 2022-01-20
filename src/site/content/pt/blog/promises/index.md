---
title: 'Promessas (Promises) em JavaScript: uma introdução'
subhead: |-
  As promises (promessas) simplificam as computações adiadas e assíncronas. Uma promessa representa
  uma operação que ainda não foi concluída.
description: |-
  As promises (promessas) simplificam as computações adiadas e assíncronas. Uma promessa representa
  uma operação que ainda não foi concluída.
date: 2013-12-16
updated: 2021-01-18
tags:
  - javascript
authors:
  - jakearchibald
feedback:
  - api
---

Desenvolvedores, preparem-se para um momento crucial na história do desenvolvimento web.

<em>[Rufam os tambores]</em>

O JavaScript agora tem promessas!

<em>[Fogos de artifício explodem, chuvas de papel cintilante, a multidão enlouquece]</em>

Nessa hora, você provavelmente se enquadra numa destas categorias:

- As pessoas estão torcendo ao seu redor, mas você não tem ideia da razão de tanto barulho. Talvez você nem tenha ideia do que seja uma "promessa". Você daria de ombros, mas o peso do papel brilhante está pesando sobre seus ombros. Se for assim, não se preocupe, eu mesmo demorei muito para descobrir por que deveria me importar com isso. Você provavelmente vai querer começar do [início](#whats-all-the-fuss-about).
- Você dá um soco no ar! Viva! Já era hora, hein? Você já usou essas coisas que chamam de Promises antes, mas acha chato porque todas as implementações têm uma API ligeiramente diferente. Qual será a API que foi adotada na versão oficial do JavaScript? Nesse caso, você provavelmente vai querer começar com a [terminologia](#promise-terminology).
- Você já conhecia tudo sobre isso e zomba daqueles que estão pulando para cima e para baixo como se fosse uma grande novidade. Reserve um momento para se deleitar com sua própria superioridade e, em seguida, vá direto para a [referência](#promise-api-reference) da API.

## Por que tanto barulho? {: #whats-all-the-fuss-about }

JavaScript é uma linguagem de thread único, o que significa que dois bits de script não podem ser executados ao mesmo tempo; eles têm que executar um depois do outro. Nos navegadores, o JavaScript ainda compartilha um mesmo thread com um monte de outras coisas que diferem de navegador para navegador. Mas normalmente o JavaScript está na mesma fila que operações de renderização de tela, atualização de estilos e resposta às ações do usuário (como realce de texto e interação com controles de formulário). Qualquer atividade numa dessas áreas atrasa as outras.

Como ser humano, você é multithreaded. Você pode digitar com vários dedos, pode dirigir e manter uma conversa ao mesmo tempo. A única função de bloqueio com a qual temos de lidar é o espirro, onde toda a atividade atual precisa ser suspensa durante o espirro. Isso é muito chato, especialmente quando você está dirigindo e tentando manter uma conversa. Você não vai querer escrever um código que espirra.

Você provavelmente já usou eventos e callbacks para contornar situações desse tipo. Aqui estão alguns eventos:

```js
var img1 = document.querySelector('.img-1');

img1.addEventListener('load', function() {
  // woo yey imagem carregou
});

img1.addEventListener('error', function() {
  // argh tudo deu errado
});
```

Esse código não causa nenhum espirro. Pegamos a imagem, adicionamos alguns ouvintes e o JavaScript pode parar de executar até que um desses ouvintes seja chamado.

Infelizmente, no exemplo acima, é possível que os eventos tenham acontecido antes de começarmos a dar atenção a eles, então precisamos contornar essa situação usando a propriedade "complete" das imagens:

```js
var img1 = document.querySelector('.img-1');

function loaded() {
  // woo yey imagem carregou
}

if (img1.complete) {
  loaded();
}
else {
  img1.addEventListener('load', loaded);
}

img1.addEventListener('error', function() {
  // argh tudo deu errado
});
```

Isto não captura imagens que deram erro antes de serem ouvidas; infelizmente, o DOM não fornece uma maneira de lidar com esse problema. Além disso, esse código está carregando apenas uma imagem. As coisas ficam ainda mais complexas se quisermos saber quando um conjunto de imagens foi carregado.

## Os eventos nem sempre são a melhor alternativa

Eventos são ótimos para coisas que podem acontecer várias vezes no mesmo objeto: `keyup`, `touchstart`, etc. Com esses eventos você não precisa se preocupar com o que aconteceu antes do ouvinte ser registrado. Mas quando se trata de uma situação de sucesso/falha assíncrona, o ideal é que você tenha algo assim:

```js
img1.callThisIfLoadedOrWhenLoaded(function() {
  // carregou
}).orIfFailedCallThis(function() {
  // falhou
});

// e…
whenAllTheseHaveLoaded([img1, img2]).callThis(function() {
  // tudo carregou
}).orIfSomeFailedCallThis(function() {
  // um ou mais falharam
});
```

Isso é o que fazem as promessas, mas com uma nomenclatura melhor. Se os elementos de imagem HTML tivessem um método "ready" que retornasse uma promessa, poderíamos fazer o seguinte:

```js
img1.ready()
.then(function() {
  // carregou
}, function() {
  // falhou
});

// e…
Promise.all([img1.ready(), img2.ready()])
.then(function() {
  // tudo carregou
}, function() {
  // um ou mais falharam
});
```

Basicamente, as promessas são um pouco como ouvintes de eventos, exceto que:

- Uma promessa só pode ter sucesso ou falhar uma única vez. Ela não pode ter sucesso ou falhar duas vezes, nem pode mudar de sucesso para falha ou vice-versa.
- Se uma promessa foi bem-sucedida ou falhou e mais tarde você adicionar um callback de sucesso/falha, o callback correto será chamado, mesmo que o evento tenha ocorrido antes.

Isto é extremamente útil para situações de sucesso/falha assíncronas, porque você está menos interessado no momento exato em que algo foi disponibilizado e mais interessado em reagir ao resultado.

## Terminologia das promessas {: #promise-terminology }

[Domenic Denicola](https://twitter.com/domenic) revisou o primeiro rascunho deste artigo e me deu nota "F" pela terminologia. Ele me colocou de castigo, me forçou a copiar [States and Fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md) 100 vezes e escreveu uma carta preocupante para meus pais. Apesar disso, ainda confundo muito a terminologia, mas aqui estão seus princípios básicos:

Uma promessa pode ser:

- **cumprida** (fulfilled) - a ação relativa à promessa foi bem-sucedida
- **rejeitada** (rejected) - a ação relativa à promessa falhou
- **pendente** (pending) - ainda não cumprida ou rejeitada
- **resolvida** (settled) - cumpriu ou rejeitou

[A especificação](https://www.ecma-international.org/ecma-262/#sec-promise-objects) também usa o termo **thenable** para descrever um objeto que é semelhante a uma promessa, no sentido que possui um método `then`. Este termo me lembra o ex-técnico da seleção inglesa [Terry Venables](https://en.wikipedia.org/wiki/Terry_Venables), então vou usá-lo o mínimo possível.

## O JavaScript agora tem promessas!

As promessas já existem há bastante tempo na forma de bibliotecas, como:

- [Q](https://github.com/kriskowal/q)
- [when](https://github.com/cujojs/when)
- [WinJS](https://msdn.microsoft.com/library/windows/apps/br211867.aspx)
- [RSVP.js](https://github.com/tildeio/rsvp.js)

As bibliotecas acima e as promessas do JavaScript compartilham um comportamento comum e padronizado chamado [Promises/A+](https://github.com/promises-aplus/promises-spec). Se você é um usuário jQuery, eles têm algo parecido que chamam de [Deferreds](https://api.jquery.com/category/deferred-object/). No entanto, os Deferreds não são compatíveis com Promise/A+, o que os torna [sutilmente diferentes e menos úteis](https://thewayofcode.wordpress.com/tag/jquery-deferred-broken/), portanto, tome cuidado. O jQuery também tem [um tipo Promise](https://api.jquery.com/Types/#Promise), mas é apenas um subconjunto de Deferred e tem os mesmos problemas.

Embora as implementações de promessas sigam um comportamento padronizado, suas APIs em geral diferem. As Promises do JavaScript são semelhantes na API ao RSVP.js. Veja como você cria uma promessa usando JavaScript:

```js
var promise = new Promise(function(resolve, reject) {
  // fazer algo, possivelmente async, depois…

  if (/* tudo deu certo */) {
    resolve("Funcionou!");
  }
  else {
    reject(Error("Deu errado"));
  }
});
```

O construtor Promise recebe um argumento, que é um callback com dois parâmetros, resolve e reject, acima. Faça algo dentro do callback, talvez algo assíncrono, e depois chame resolve() se tudo deu certo; caso contrário, chame reject().

Assim como `throw` no JavaScript clássico, é comum, mas não obrigatório, chamar reject() com um objeto Error. A vantagem dos objetos Error é que eles capturam um rastreamento de pilha, facilitando a vida das ferramentas de depuração.

Eis como você poderia usar essa promessa:

```js
promise.then(function(result) {
  console.log(result); // "Funcionou!"
}, function(err) {
  console.log(err); // Error: "Deu errado"
});
```

O método `then()` recebe dois argumentos, um callback para um caso de sucesso e outro para o caso de falha. Ambos são opcionais, portanto, você pode, se quiser, adicionar um retorno de chamada apenas para o caso de sucesso ou falha.

As promessas JavaScript apareceram inicialmente no DOM como "Futures", depois foram renomeadas para "Promises" e finalmente entraram na linguagem JavaScript. Tê-las na linguagem JavaScript em vez de no DOM é muito bom porque elas também estarão disponíveis nos contextos JS sem navegador, como o Node.js (se eles fazem uso delas em suas APIs principais é outra questão).

Embora sejam um recurso JavaScript, o DOM não tem medo de usá-los. Na verdade, todas as novas APIs DOM com métodos assíncronos de sucesso/falha usarão promessas. Isto já está acontecendo com [Quota Management](https://dvcs.w3.org/hg/quota/raw-file/tip/Overview.html#idl-def-StorageQuota), [Font Load Events](http://dev.w3.org/csswg/css-font-loading/#font-face-set-ready), [ServiceWorker](https://github.com/slightlyoff/ServiceWorker/blob/cf459d473ae09f6994e8539113d277cbd2bce939/service_worker.ts#L17), [Web MIDI](https://webaudio.github.io/web-midi-api/#widl-Navigator-requestMIDIAccess-Promise-MIDIOptions-options), [Streams](https://github.com/whatwg/streams#basereadablestream) e muito mais.

## Suporte a navegadores e polyfills

Hoje já existem implementações de promessas em vários navegadores.

No Chrome 32, Opera 19, Firefox 29, Safari 8 e Microsoft Edge, as promessas são ativadas por default.

Para navegadores que não possuem uma implementação completa de promessas em conformidade com as especificações, ou para adicionar o recurso de promessas para outros navegadores e Node.js, dê uma olhada no [polyfill](https://github.com/jakearchibald/ES6-Promises#readme) (2k gzipado).

## Compatibilidade com outras bibliotecas

A API Promises do JavaScript vai tratar qualquer coisa que tenha um `then()` como sendo parecido com promessa, "promise-like" (ou `thenable`, no, *argh*, linguajar de promessa), então se você usar uma biblioteca que retorna uma promessa Q, tudo bem, ela funcionará bem com as novas promessas do JavaScript.

Embora, como mencionei, os Deferreds do jQuery são um tanto … inúteis. Por sorte você pode transformá-los em promessas padrão, o que vale a pena fazer o quanto antes:

```js
var jsPromise = Promise.resolve($.ajax('/whatever.json'))
```

Aqui, o `$.ajax` do jQuery retorna um Deferred. Já que ele tem um método `then()`, `Promise.resolve()` poderá transformá-lo numa promessa JavaScript. No entanto, às vezes os deferreds passam múltiplos argumentos para seus callbacks, por exemplo:

```js
var jqDeferred = $.ajax('/whatever.json');

jqDeferred.then(function(response, statusText, xhrObj) {
  // ...
}, function(xhrObj, textStatus, err) {
  // ...
})
```

Enquanto que JS promete ignorar todos, exceto o primeiro:

```js
jsPromise.then(function(response) {
  // ...
}, function(xhrObj) {
  // ...
})
```

Felizmente, isto geralmente é o que você quer ou, pelo menos, dá acesso ao que você quer. Além disso, esteja ciente de que o jQuery não segue a convenção de passar objetos Error para rejeições.

## Código assíncrono complexo facilitado

Certo, vamos então escrever um pouco de código. Digamos que queremos:

1. Iniciar um spinner para indicar o carregamento
2. Baixar alguns JSON para uma história, de onde obteremos o título e as urls de cada capítulo
3. Adicionar um título à página
4. Baixar cada capítulo
5. Adicionar a história à página
6. Parar o spinner

… mas também informar ao usuário se algo deu errado ao longo do processo. Também queremos parar o spinner nesse ponto, caso contrário, ele vai continuar girando, ficará tonto e colidirá com alguma outra interface.

Claro que você não usaria JavaScript para entregar uma história. [Servir como HTML é bem mais rápido](https://jakearchibald.com/2013/progressive-enhancement-is-faster/), mas esse padrão é bastante comum ao lidar com APIs: múltiplos acessos para baixar dados e, em seguida, fazer algo quando estiver tudo pronto.

Para começar, vamos lidar com a busca de dados da rede:

## Fazendo XMLHttpRequest cumprir promessas

APIs antigas serão atualizadas para usar promessas, se for possível de uma maneira compatível com versões anteriores. O objeto `XMLHttpRequest` é um candidato importante, mas por enquanto vamos escrever uma função simples para fazer uma solicitação GET:

```js
function get(url) {
  // Retorne uma nova promessa.
  return new Promise(function(resolve, reject) {
    // Faça o trabalho usual do XHR
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // Chamado em caso de 404 etc
      // então verifique o status
      if (req.status == 200) {
        // resolva a promessa com o texto em response
        resolve(req.response);
      }
      else {
        // Caso contrário rejeite com o texto do status
        // que esperamos que seja um erro que possamos entender
        reject(Error(req.statusText));
      }
    };

    // Lide com erros de rede
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Faça a requisição
    req.send();
  });
}
```

Agora vamos usá-la:

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
})
```

Agora podemos fazer solicitações HTTP sem digitar manualmente `XMLHttpRequest`, o que é ótimo, porque quanto menos eu tiver que ver a cara irritante do `XMLHttpRequest`, mais feliz será minha vida.

## Encadeamento

O `then()` não é o fim da história. Você pode encadear vários `then` um no outro para transformar valores ou executar ações assíncronas adicionais uma depois da outra.

### Transformando valores

Você pode transformar valores simplesmente retornando o novo valor:

```js
var promise = new Promise(function(resolve, reject) {
  resolve(1);
});

promise.then(function(val) {
  console.log(val); // 1
  return val + 2;
}).then(function(val) {
  console.log(val); // 3
})
```

Como um exemplo prático, vamos voltar a:

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
})
```

A resposta (response) é JSON, mas ela está aqui sendo recebida como texto simples. Poderíamos alterar nossa função get para usar o [`responseType`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest#responseType) JSON, mas também podemos deixar para resolver isto na terra das promessas:

```js
get('story.json').then(function(response) {
  return JSON.parse(response);
}).then(function(response) {
  console.log("Yey JSON!", response);
})
```

Como `JSON.parse()` recebe um único argumento e retorna um valor transformado, podemos usar um atalho:

```js
get('story.json').then(JSON.parse).then(function(response) {
  console.log("Yey JSON!", response);
})
```

Na verdade, poderíamos criar uma função `getJSON()` de forma relativamente simples:

```js
function getJSON(url) {
  return get(url).then(JSON.parse);
}
```

A função `getJSON()` ainda retorna uma promessa. Uma promessa que busca uma url e depois processa a resposta como JSON.

### Enfileirando ações assíncronas

Você também pode encadear vários `then` para executar ações assíncronas em sequência.

Quando você retorna alguma coisa de um callback `then()`, é meio mágico. Se você retornar um valor, o próximo `then()` será chamado com esse valor. No entanto, se você retornar algo que pareça uma promessa, o próximo `then()` espera por ele e só é chamado quando a promessa for cumprida (sucesso/falha). Por exemplo:

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  console.log("Got chapter 1!", chapter1);
})
```

Aqui, fazemos uma solicitação assíncrona para `story.json`, que nos dá um conjunto de URLs a serem solicitadas e, em seguida, solicitamos a primeira delas. É nesse ponto em que promessas realmente começam a ganhar destaque em relação ao uso clássico de callbacks.

Você pode até criar um método de atalho para obter os capítulos:

```js
var storyPromise;

function getChapter(i) {
  storyPromise = storyPromise || getJSON('story.json');

  return storyPromise.then(function(story) {
    return getJSON(story.chapterUrls[i]);
  })
}

// é fácil de usar:
getChapter(0).then(function(chapter) {
  console.log(chapter);
  return getChapter(1);
}).then(function(chapter) {
  console.log(chapter);
})
```

Nós não baixamos o `story.json` até que `getChapter` seja chamado, mas da próxima vez que `getChapter` for chamado, reutilizamos a promessa de história, portanto, `story.json` é baixado apenas uma vez. Viva as promessas!

## Tratamento de erros

Como vimos anteriormente, `then()` recebe dois argumentos, um para lidar com o sucesso, outro para a falha (ou fulfill e reject, no linguajar das promessas):

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.log("Failed!", error);
})
```

Você também pode usar `catch()`:

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).catch(function(error) {
  console.log("Failed!", error);
})
```

Não há nada de especial em usar `catch()`, é apenas uma alternativa equivalente a `then(undefined, func)`, mas é mais legível. Observe que os dois exemplos de código acima não se comportam da mesma forma, o último é equivalente a:

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).then(undefined, function(error) {
  console.log("Failed!", error);
})
```

A diferença é sutil, mas extremamente útil. As rejeições da promessa passam para o próximo `then()` com um callback de rejeição (ou `catch()`, já que é equivalente). Com `then(func1, func2)`, será chamada ou a função `func1` ou `func2`, mas nunca as duas. Mas com `then(func1).catch(func2)`, ambas serão chamadas se `func1` rejeitar, pois são etapas separadas na cadeia. Considere o seguinte:

```js
asyncThing1().then(function() {
  return asyncThing2();
}).then(function() {
  return asyncThing3();
}).catch(function(err) {
  return asyncRecovery1();
}).then(function() {
  return asyncThing4();
}, function(err) {
  return asyncRecovery2();
}).catch(function(err) {
  console.log("Don't worry about it");
}).then(function() {
  console.log("All done!");
})
```

O fluxo acima é muito parecido com o try/catch típico do JavaScript, os erros que acontecem em um "try" vão imediatamente para o bloco `catch()`. Aqui está o fluxograma do código acima (porque eu amo fluxogramas):

<div style="position: relative; padding-top: 93%;">
  <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden"
   src="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/simQvoUExWisIW0XxToH.svg" | imgix }}" frameborder="0" allowtransparency="true"></iframe>
</div>

Siga as linhas azuis para as promessas que se cumprem, ou as vermelhas para as que são rejeitadas.

### Exceções e promessas em JavaScript

As rejeições acontecem quando uma promessa é rejeitada explicitamente, mas também implicitamente se um erro for lançado no callback do construtor:

```js
var jsonPromise = new Promise(function(resolve, reject) {
  // JSON.parse provoca um erro se você alimentá-lo com
  // JSON inválido, então isto implicitamente causa rejeição:
  resolve(JSON.parse("Isto não é JSON"));
});

jsonPromise.then(function(data) {
  // Isto nunca acontece:
  console.log("Funcionou!", data);
}).catch(function(err) {
  // Isto acontece:
  console.log("Falhou!", err);
})
```

Isto significa que é útil fazer todo o seu trabalho relacionado à promessa dentro do callback do construtor da promessa, para que os erros sejam detectados automaticamente e se tornem rejeições.

O mesmo vale para erros lançados em callbacks `then()`

```js
get('/').then(JSON.parse).then(function() {
  // Isto nunca acontece, '/' é uma página HTML, não JSON
  // então JSON.parse lança exceção
  console.log("Funcionou!", data);
}).catch(function(err) {
  // Isto aqui acontece:
  console.log("Falhou!", err);
})
```

### Tratamento de erros na prática

Com nossa história e capítulos, podemos usar catch para exibir um erro ao usuário:

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  addHtmlToPage(chapter1.html);
}).catch(function() {
  addTextToPage("Falha ao mostrar o capítulo");
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

Se a busca de `story.chapterUrls[0]` falhar (por exemplo, http 500 ou se o usuário estiver offline), todos os callbacks de sucesso seguintes serão ignorados. Isto inclui aquele que está no `getJSON()` que tenta processar a resposta como JSON. Também será ignorado o callback que adiciona capítulo1.html à página. Em vez disso, será executado o callback do catch. Como resultado, "Falha ao mostrar o capítulo" será adicionado à página se qualquer uma das ações anteriores falhar.

Assim como o try/catch do JavaScript, o erro é detectado e o código subsequente continua, então o spinner estará sempre oculto, que é o que queremos. O código acima se torna uma versão assíncrona sem bloqueio de:

```js
try {
  var story = getJSONSync('story.json');
  var chapter1 = getJSONSync(story.chapterUrls[0]);
  addHtmlToPage(chapter1.html);
}
catch (e) {
  addTextToPage("Falha ao mostrar o capítulo");
}
document.querySelector('.spinner').style.display = 'none'
```

Você talvez queira executar o `catch()` simplesmente para fins de registro, sem se recuperar do erro. Para isto, basta relançar o erro. Podemos fazer isto no nosso método `getJSON()`:

```js
function getJSON(url) {
  return get(url).then(JSON.parse).catch(function(err) {
    console.log("getJSON failed for", url, err);
    throw err;
  });
}
```

Dessa forma, conseguimos buscar um capítulo, mas nós queremos todos eles. Vamos fazer isto acontecer agora.

## Paralelismo e sequenciamento: obtendo o melhor dos dois mundos

Pensar de forma assíncrona não é fácil. Se você está tendo dificuldades, tente escrever o código como se fosse síncrono. Nesse caso:

```js
try {
  var story = getJSONSync('story.json');
  addHtmlToPage(story.heading);

  story.chapterUrls.forEach(function(chapterUrl) {
    var chapter = getJSONSync(chapterUrl);
    addHtmlToPage(chapter.html);
  });

  addTextToPage("All done");
}
catch (err) {
  addTextToPage("Argh, broken: " + err.message);
}

document.querySelector('.spinner').style.display = 'none'
```

{% Glitch { id: 'promises-sync-example', height: 480 } %}

Isto funciona! Mas é síncrono e bloqueia o navegador enquanto os dados são baixados. Para deixar essa tarefa assíncrona, usamos `then()` para fazer com que as coisas aconteçam uma depois da outra.

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // TODO: para cada url em story.chapterUrls, pegue e mostre
}).then(function() {
  // E pronto!
  addTextToPage("Tudo feito");
}).catch(function(err) {
  // Capture qualquer erro que ocorra pelo caminho
  addTextToPage("Argh, quebrou: " + err.message);
}).then(function() {
  // Sempre esconda o spinner
  document.querySelector('.spinner').style.display = 'none';
})
```

Mas como podemos percorrer as urls dos capítulos e buscá-los em ordem? Isto **não funciona** :

```js
story.chapterUrls.forEach(function(chapterUrl) {
  // Pegar capítulo
  getJSON(chapterUrl).then(function(chapter) {
    // e acrescentar na página
    addHtmlToPage(chapter.html);
  });
})
```

O `forEach` não foi criado para lidar com código assíncrono, então nossos capítulos iriam aparecer na ordem em que forem baixados, que é basicamente como Pulp Fiction foi escrito. Isto não é Pulp Fiction, então vamos consertar.

### Criando uma sequência

Queremos transformar nosso array `chapterUrls` numa sequência de promessas. Podemos fazer isto usando `then()`:

```js
// Comece com uma promise que sempre resolve
var sequence = Promise.resolve();

// Passe pela url de cada capítulo
story.chapterUrls.forEach(function(chapterUrl) {
  // Acrescente estas ações ao final da sequence
  sequence = sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
})
```

Esta é a primeira vez que vimos um `Promise.resolve()`, que cria uma promessa que é resolvida seja qual for o valor que você passar para ela. Se você passar uma instância de `Promise` ela vai simplesmente retorná-la (**observação:** esta é uma mudança na especificação que algumas implementações ainda não seguem). Se você passar algo parecido com uma promessa (algo que tem um `then()`), ela cria uma `Promise` genuína que cumpre/rejeita da mesma maneira. Se você passar qualquer outro valor, por exemplo, `Promise.resolve('Hello')`, ela cria uma promessa que cumpre com esse valor. Se você chamá-la sem valor algum, como acima, ela será cumprida com o valor "indefinido".

Também existe o `Promise.reject(val)`, que cria uma promessa que rejeita com o valor que você passar para ela (ou undefined).

Podemos organizar o código acima usando [`array.reduce`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce):

```js
// Passar pelas urls dos capítulos
story.chapterUrls.reduce(function(sequence, chapterUrl) {
  // Acrescentar estas ações ao final da sequence
  return sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
}, Promise.resolve())
```

Isto faz o mesmo que o exemplo anterior, mas não precisa da variável "sequence" separada. Nosso callback reduce é chamado para cada item do array. O "sequence" é `Promise.resolve()` na primeira vez, mas para o restante das chamadas "sequence" é o que foi retornado da chamada anterior. O `array.reduce` é bastante útil para reduzir um array a um valor único, o que, neste caso, é uma promessa.

Vamos juntar tudo:

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  return story.chapterUrls.reduce(function(sequence, chapterUrl) {
    // Quando a promessa do último capítulo estiver pronta…
    return sequence.then(function() {
      // …pegue o próximo capítulo
      return getJSON(chapterUrl);
    }).then(function(chapter) {
      // e acrescente na página
      addHtmlToPage(chapter.html);
    });
  }, Promise.resolve());
}).then(function() {
  // E estamos feitos!
  addTextToPage("All done");
}).catch(function(err) {
  // Pegue qualquer erro que aconteça pelo caminho
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Sempre esconda o spinner
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-example', height: 480 } %}

E aí está, uma versão totalmente assíncrona de um código originalmente sequencial. Mas nós podemos fazer melhor que isso. No momento, nossa página está baixando assim:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise1.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise1.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

Os navegadores são muito bons em baixar várias coisas de uma vez, então estamos desperdiçando desempenho ao baixar os capítulos um após o outro. O que queremos fazer é fazer o download de todos ao mesmo tempo e, em seguida, processá-los à medida em que forem chegando. Felizmente, já existe uma API para isso:

```js
Promise.all(arrayOfPromises).then(function(arrayOfResults) {
  //...
})
```

O `Promise.all` pega uma série de promessas e cria uma promessa que se cumpre no momento em que todas as outras forem concluídas com sucesso. Você recebe um array de resultados (independente dos resultados de cada promessa) na mesma ordem das promessas que você recebeu.

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // Pegue um array de promessas e espere por todas
  return Promise.all(
    // Mapear nosso array de urls de capítulos a
    // um array de promessas de capítulo json
    story.chapterUrls.map(getJSON)
  );
}).then(function(chapters) {
  // Agora temos os jsons de capítulo em ordem! Loop por eles…
  chapters.forEach(function(chapter) {
    // …e acrescente na página
    addHtmlToPage(chapter.html);
  });
  addTextToPage("All done");
}).catch(function(err) {
  // pegue qualquer erro que tenha ocorrido
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-all-example', height: 480 } %}

Dependendo da conexão, isto pode ser alguns segundos mais rápido do que carregar um por um e ainda requer menos código do que nossa primeira tentativa. Os capítulos podem ser baixados em qualquer ordem, mas eles irão aparecer na tela na ordem correta.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise2.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

No entanto, ainda podemos melhorar ainda mais o desempenho percebido. Quando o capítulo um chegar, devemos adicioná-lo à página. Isto permite que o usuário comece a ler antes que o restante dos capítulos chegue. Quando o capítulo três chegar, ele não será adicionado à página porque o usuário pode não perceber que o capítulo dois está faltando. Quando o capítulo dois chegar, podemos adicionar os capítulos dois e três, etc, etc.

Para fazer isso, baixamos o JSON para todos os nossos capítulos ao mesmo tempo e, em seguida, criamos uma sequência para adicioná-los ao documento:

```js
getJSON('story.json')
.then(function(story) {
  addHtmlToPage(story.heading);

  // Mapeie nosso array de urls de capítulo para
  // um array de promessas de capítulo json
  // Isto garante que são baixadas em paralelo.
  return story.chapterUrls.map(getJSON)
    .reduce(function(sequence, chapterPromise) {
      // Use reduce para encadear as promises,
      // adicionando conteúdo à página para cada capítulo
      return sequence
      .then(function() {
        // Espere por tudo na sequencia até agora,
        // depois espere este capítulo chegar.
        return chapterPromise;
      }).then(function(chapter) {
        addHtmlToPage(chapter.html);
      });
    }, Promise.resolve());
}).then(function() {
  addTextToPage("Tudo feito");
}).catch(function(err) {
  // capture qualquer erro que tenha acontecido no caminho
  addTextToPage("Argh, quebrou: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-best-example', height: 480 } %}

E pronto, o melhor de ambos os mundos! Leva a mesma quantidade de tempo para entregar todo o conteúdo, mas o usuário recebe a primeira parte do conteúdo mais cedo.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise3.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise3.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

Neste exemplo trivial, todos os capítulos chegam mais ou menos ao mesmo tempo, mas a vantagem de exibir um de cada vez será exagerada com mais capítulos maiores.

Fazer o que mostramos acima com [callbacks ou eventos no estilo Node.js](https://gist.github.com/jakearchibald/0e652d95c07442f205ce) requer quase o dobro do código e fica muito mais difícil de entender. No entanto, este não é o fim da história para as promessas. Quando elas são combinadas com outros recursos do ES6, elas ficam ainda mais fáceis de usar.

## Rodada de bônus: capacidades expandidas

Desde que escrevi este artigo originalmente, a capacidade de usar a API de Promises aumentou muito. Desde o Chrome 55, as funções assíncronas têm permitido que o código baseado em promessas fosse escrito como se fosse um código síncrono, mas sem bloquear o thread principal. Você pode ler mais sobre isto no [meu artigo sobre funções assíncronas](/async-functions). Hoje existe amplo suporte para Promises e funções assíncronas nos principais navegadores. Você pode encontrar os detalhes nas referências do MDN sobre [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) [funções assíncronas](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function).

Muito obrigado a Anne van Kesteren, Domenic Denicola, Tom Ashworth, Remy Sharp, Addy Osmani, Arthur Evans e Yutaka Hirano que revisaram este texto e fizeram correções/recomendações.

Agradeço também a [Mathias Bynens](https://mathiasbynens.be/) por [atualizar várias partes](https://github.com/html5rocks/www.html5rocks.com/pull/921/files) do artigo.
