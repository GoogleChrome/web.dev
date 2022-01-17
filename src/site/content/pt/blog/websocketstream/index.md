---
title: 'WebSocketStream: integração de streams com a API WebSocket'
subhead: Evite que seu aplicativo seja afogado em mensagens WebSocket ou inunde um servidor WebSocket com mensagens aplicando contrapressão.
authors:
  - thomassteiner
date: 2020-03-27
updated: 2021-02-23
hero: image/admin/8SrIq5at2bH6i98stCgs.jpg
alt: Uma mangueira de incêndio com água pingando.
description: WebSocketStream integra streams com a API WebSocket. Isto permite que seu aplicativo aplique contrapressão às mensagens recebidas.
tags:
  - blog
  - capabilities
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745"
feedback:
  - api
---

## Histórico

### A API WebSocket

A [API WebSocket](https://developer.mozilla.org/docs/Web/API/WebSockets_API) fornece uma interface JavaScript para o [protocolo WebSocket](https://tools.ietf.org/html/rfc6455), que torna possível abrir uma sessão de comunicação interativa bidirecional entre o navegador do usuário e um servidor. Com essa API, você pode enviar mensagens a um servidor e receber respostas orientadas a eventos sem consultar o servidor para obter uma resposta.

### A API Streams

A [API Streams](https://developer.mozilla.org/docs/Web/API/Streams_API) permite que o JavaScript acesse programaticamente streams de blocos de dados recebidos pela rede e os processe conforme desejado. Um conceito importante no contexto de streams é a [contrapressão](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts#Backpressure). Este é o processo pelo qual um único stream ou pipeline regula a velocidade de leitura ou escrita. Quando o próprio stream ou um stream posterior no pipeline ainda estiver ocupado e ainda não estiver pronto para aceitar mais blocos, ele envia um sinal de volta através do pipeline para retardar a entrega conforme apropriado.

### O problema com a API WebSocket atual

#### Aplicar contrapressão às mensagens recebidas é impossível

Com a API WebSocket atual, a reação a uma mensagem acontece em [`WebSocket.onmessage`](https://developer.mozilla.org/docs/Web/API/WebSocket/onmessage), um `EventHandler` chamado quando uma mensagem é recebida do servidor.

Vamos supor que você tenha um aplicativo que precisa realizar operações pesadas de processamento de dados sempre que uma nova mensagem é recebida. Você provavelmente configuraria o stream de forma semelhante ao código abaixo e, já que chama `await` para esperar o resultado da `process()`, certo?

```js
// A heavy data crunching operation.
const process = async (data) => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      console.log('WebSocket message processed:', data);
      return resolve('done');
    }, 1000);
  });
};

webSocket.onmessage = async (event) => {
  const data = event.data;
  // Await the result of the processing step in the message handler.
  await process(data);
};
```

Errado! O problema com a API WebSocket atual é que não há como aplicar contrapressão. Quando as mensagens chegam mais rápido do que o método `process()` é capaz de manipulá-las, o processo de renderização ou vai encher a memória armazenando em buffer essas mensagens ou irá parar de responder devido ao uso de 100% da CPU, ou as duas coisas.

#### Aplicar contrapressão às mensagens enviadas não é ergonômico

Aplicar contrapressão às mensagens enviadas é possível, mas envolve a monitoração da propriedade [`WebSocket.bufferedAmount`](https://developer.mozilla.org/docs/Web/API/WebSocket/bufferedAmount), que é ineficiente e não ergonômica. Esta propriedade somente-leitura retorna o número de bytes de dados que foram enfileirados usando chamadas para [`WebSocket.send()`](https://developer.mozilla.org/docs/Web/API/WebSocket/send), mas ainda não foram transmitidos para a rede. Este valor é zerado quando todos os dados enfileirados são enviados, mas se você continuar chamando `WebSocket.send()`, ele continuará a subir.

## O que é a API WebSocketStream? {: #what }

A API WebSocketStream lida com o problema de contrapressão inexistente ou não ergonômica integrando streams com a API WebSocket. Isto significa que a contrapressão pode ser aplicada "gratuitamente", sem nenhum custo extra.

### Casos de uso sugeridos para a API WebSocketStream {: # use-cases}

Exemplos de sites que podem usar essa API incluem:

- Aplicativos WebSocket de alta largura de banda que precisam manter a interatividade, em particular vídeo e compartilhamento de tela.
- Da mesma forma, capturas de vídeo e outros aplicativos que geram muitos dados no navegador que precisam ser transferidos para o servidor. Com a contrapressão, o cliente pode interromper a produção de dados em vez de ficar acumulando dados na memória.

## Status atual {: #status}

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Passo</th>
<th data-md-type="table_cell">Status</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Criar um explicador</td>
<td data-md-type="table_cell"><a href="https://github.com/ricea/websocketstream-explainer/blob/master/README.md" data-md-type="link">Concluído</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Criar o rascunho inicial das especificações</td>
<td data-md-type="table_cell"><a href="https://github.com/ricea/websocketstream-explainer/blob/master/README.md" data-md-type="link">Em andamento</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Obter feedback e repetir o design</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">Em andamento</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Prova de origem</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745" data-md-type="link">Concluída</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. Lançamento</td>
<td data-md-type="table_cell">Não iniciado</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Como usar a API WebSocketStream {: #use}

### Exemplo introdutório

A API WebSocketStream é baseada em promessas, o que faz com que a forma de usá-la seja natural num mundo JavaScript moderno. Você começa construindo um novo `WebSocketStream` e passando a ele a URL do servidor WebSocket. Em seguida, você espera que a `connection` seja estabelecida, o que resulta num [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream) e/ou um [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream/WritableStream).

Ao chamar o método [`ReadableStream.getReader()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/getReader), você finalmente obtém um [`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader), do qual pode chamar [`read()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/read) para ler dados até que o stream seja concluído, ou seja, até que ele retorne um objeto da forma `{value: undefined, done: true}`.

Da mesma forma, ao chamar o método [`WritableStream.getWriter()`](https://developer.mozilla.org/docs/Web/API/WritableStream/getWriter), você finalmente obtém um [`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter), onde você pode chamar [`write()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/write) para gravar dados.

```js
  const wss = new WebSocketStream(WSS_URL);
  const {readable, writable} = await wss.connection;
  const reader = readable.getReader();
  const writer = writable.getWriter();

  while (true) {
    const {value, done} = await reader.read();
    if (done) {
      break;
    }
    const result = await process(value);
    await writer.write(result);
  }
```

#### Contrapressão

E o prometido recurso de contrapressão? Como escrevi acima, você o obtém "de graça", sem a necessidade de passos adicionais. Se `process()` demorar mais, a mensagem seguinte só será consumida quando o pipeline estiver pronto. Da mesma forma, o passo  `WritableStreamDefaultWriter.write()` só será realizado se for seguro fazê-lo.

### Exemplos avançados

O segundo argumento para WebSocketStream é um pacote de opções para permitir extensões futuras. Atualmente, a única opção é `protocols`, que se comporta da mesma forma que o [segundo argumento passado para o construtor WebSocket](https://developer.mozilla.org/docs/Web/API/WebSocket/WebSocket#Parameters:~:text=respond.-,protocols):

```js
const chatWSS = new WebSocketStream(CHAT_URL, {protocols: ['chat', 'chatv2']});
const {protocol} = await chatWSS.connection;
```

O `protocol` selecionado, bem como as `extensions` potenciais, fazem parte do dicionário disponível por meio da promessa `WebSocketStream.connection`. Todas as informações sobre a conexão ao vivo são fornecidas por esta promessa, uma vez que elas não são relevantes se a conexão falhar.

```js
const {readable, writable, protocol, extensions} = await chatWSS.connection;
```

### Informações sobre a conexão WebSocketStream fechada

A informação que estava disponível a partir dos eventos [`WebSocket.onclose`](https://developer.mozilla.org/docs/Web/API/WebSocket/onclose) e [`WebSocket.onerror`](https://developer.mozilla.org/docs/Web/API/WebSocket/onerror) na API WebSocket está agora disponível através da promessa  `WebSocketStream.closed`. A promessa rejeita no caso de um fechamento impuro, caso contrário, resolve para o código e motivo enviado pelo servidor.

Todos os códigos de status possíveis e seus significados são explicados na [lista de códigos de status `CloseEvent`](https://developer.mozilla.org/docs/Web/API/CloseEvent#Status_codes).

```js
const {code, reason} = await chatWSS.closed;
```

### Fechando uma conexão WebSocketStream

Um WebSocketStream pode ser fechado com um [`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController). Portanto, passe um [`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal) para o construtor `WebSocketStream`.

```js
const controller = new AbortController();
const wss = new WebSocketStream(URL, {signal: controller.signal});
setTimeout(() => controller.abort(), 1000);
```

Como alternativa, você também pode usar o método `WebSocketStream.close()`, mas seu objetivo principal é permitir especificar o [código](https://developer.mozilla.org/docs/Web/API/CloseEvent#Status_codes) e o motivo que é enviado ao servidor.

```js
wss.close({code: 4000, reason: 'Game over'});
```

### Aprimoramento progressivo e interoperabilidade

O Chrome é atualmente o único navegador a implementar a API WebSocketStream. Para interoperabilidade com a API WebSocket clássica, não é possível aplicar contrapressão às mensagens recebidas. Aplicar contrapressão às mensagens enviadas é possível, mas envolve monitorar a propriedade [`WebSocket.bufferedAmount`](https://developer.mozilla.org/docs/Web/API/WebSocket/bufferedAmount), que é ineficiente e não ergonômica.

#### Detecção de recursos

Para verificar se a API WebSocketStream é suportada, use:

```javascript
if ('WebSocketStream' in window) {
  // `WebSocketStream` is supported!
}
```

## Demonstração

Em navegadores compatíveis, você pode ver a API WebSocketStream em ação no iframe incorporado ou [diretamente no Glitch](https://websocketstream-demo.glitch.me/).

{% Glitch { id: 'websocketstream-demo', path: 'public/index.html' } %}

## Feedback {: #feedback }

A equipe do Chrome quer saber mais sobre suas experiências com a API WebSocketStream.

### Conte-nos sobre o design da API

Existe algo na API que não funciona conforme o esperado? Ou faltam propriedades de que você precisa para implementar sua ideia? Registre um issue de especificação no repositório do GitHub correspondente ou acrescente suas ideias a um issue existente.

### Relate um problema com a implementação

Você encontrou um bug na implementação do Chrome? Ou a implementação é diferente da especificação? Informe um bug em [new.crbug.com](https://new.crbug.com). Certifique-se de incluir o máximo de detalhes possível, fornecer instruções simples para reproduzir o bug e configurar os <strong>Componentes</strong> <code>Blink&gt;PerformanceAPIs</code>. [Glitch](https://glitch.com/) funciona muito bem para compartilhar reproduções rápidas e fáceis.

### Mostre seu apoio à API

Você está planejando usar a API WebSocketStream? Seu suporte público ajuda a equipe do Chrome a priorizar os recursos e mostra a outros fornecedores de navegadores como o apoio é fundamental.

Envie um tweet para [@ChromiumDev](https://twitter.com/ChromiumDev) usando a hashtag [`#WebSocketStream`](https://twitter.com/search?q=%23WebSocketStream&src=typed_query&f=live) e diga-nos onde e como você está usando a API.

## Links úteis {: #helpful }

- [Explicador público](https://github.com/ricea/websocketstream-explainer/blob/master/README.md)
- [Demonstração da API WebSocketStream](https://websocketstream-demo.glitch.me/) | [Código-fonte da demonstração da API WebSocketStream](https://glitch.com/edit/#!/websocketstream-demo)
- [Tracking bug](https://bugs.chromium.org/p/chromium/issues/detail?id=983030)
- [Entrada em ChromeStatus.com](https://chromestatus.com/feature/5189728691290112)
- Componente Blink: [`Blink>Network>WebSockets`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3ENetwork%3EWebSockets)

## Agradecimentos

A API WebSocketStream foi implementada por [Adam Rice](https://github.com/ricea) e [Yutaka Hirano](https://github.com/yutakahirano). Imagem herói por [Daan Mooij](https://unsplash.com/@daanmooij) no [Unsplash](https://unsplash.com/photos/91LGCVN5SAI).
