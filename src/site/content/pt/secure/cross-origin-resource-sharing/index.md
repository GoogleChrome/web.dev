---
layout: post
title: Cross-Origin Resource Sharing   - CORS (compartilhamento de recursos de origem cruzada)
subhead: Compartilhe recursos de origem cruzada com segurança
authors:
  - kosamari
date: 2018-11-05
description: A política de mesma origem (same-origin) do navegador bloqueia a leitura de um recurso de uma origem diferente. Esse mecanismo impede que um site malicioso leia os dados de outro site, mas também impede usos legítimos. E se você quisesse obter dados meteorológicos de outro país? A ativação do CORS permite que o servidor diga ao navegador que está permitido usar uma origem adicional.
tags:
  - security
---

A política de mesma origem (same-origin) do navegador bloqueia a leitura de um recurso de uma origem diferente. Esse mecanismo impede que um site malicioso leia os dados de outro site, mas também impede usos legítimos. E se você quisesse obter dados meteorológicos de outro país?

Numa aplicação web moderna, é comum desejar obter recursos de uma origem diferente. Por exemplo, você pode desejar recuperar dados JSON de um outro domínio ou carregar imagens de um site para um elemento `<canvas>`.

Em outras palavras, existem **recursos públicos** que deveriam estar disponíveis para qualquer pessoa ler, mas a política de mesma origem bloqueia isso. Os desenvolvedores têm usado soluções [alternativas](https://stackoverflow.com/questions/2067472/what-is-jsonp-all-about) como JSONP, mas o **Cross-Origin Resource Sharing (CORS)** corrige isso de uma forma padrão.

A ativação do **CORS** permite que o servidor informe ao navegador que é permitido usar uma origem adicional.

## Como funciona uma solicitação de recurso na web?

<figure data-float="right">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8J6A0Bk5YXdvyoj8HVzs.png", alt="solicitação e resposta", width="668", height="327" %}   <figcaption>     Figura: solicitação ilustrada do cliente e resposta do servidor </figcaption></figure>

Um navegador e um servidor podem trocar dados pela rede usando o protocolo HTTP (**Hypertext Transfer Protocol**). O HTTP define as regras de comunicação entre o solicitante e o respondente, incluindo quais informações são necessárias para obter um recurso.

O cabeçalho HTTP é usado para negociar o tipo de troca de mensagens entre o cliente e o servidor e é usado para determinar o acesso. Tanto a solicitação do navegador quanto a mensagem de resposta do servidor são divididas em duas partes: **cabeçalho** e **corpo** :

### cabeçalho

Informações sobre a mensagem, como o tipo de mensagem ou a codificação da mensagem. Um cabeçalho pode incluir uma [variedade de informações](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields) expressas como pares chave-valor. O cabeçalho da solicitação e o cabeçalho da resposta contêm informações diferentes.

{% Aside %} É importante observar que os cabeçalhos não podem conter comentários. {% endAside %}

**Exemplo de cabeçalho de solicitação**

```text
Accept: text/html
Cookie: Version=1
```

O cabeçalho acima é equivalente a dizer "Desejo receber HTML como resposta. Aqui está um cookie que possuo."

**Exemplo de cabeçalho de resposta**

```text
Content-Encoding: gzip
Cache-Control: no-store
```

O texto acima é equivalente a dizer "Os dados estão codificados com gzip. Não armazene isso em cache, por favor."

### corpo

A própria mensagem. Pode ser texto simples, um binário de imagem, JSON, HTML e assim por diante.

## Como funciona o CORS?

Lembre-se de que a política de mesma origem informa ao navegador para bloquear solicitações de origem cruzada. Quando você deseja obter um recurso público de uma origem diferente, o servidor provedor de recursos precisa informar ao navegador "Esta origem de onde a solicitação está vindo pode acessar meu recurso". O navegador lembra disso e permite o compartilhamento de recursos de origem cruzada.

### Passo 1: solicitação do cliente (navegador)

Quando o navegador está fazendo uma solicitação de origem cruzada, o navegador adiciona um cabeçalho `Origin` com a origem atual (esquema, host e porta).

### Passo 2: resposta do servidor

Do lado do servidor, quando um servidor vê este cabeçalho e deseja permitir o acesso, ele precisa adicionar um cabeçalho `Access-Control-Allow-Origin` à resposta especificando a origem da solicitação (ou `*` para permitir qualquer origem).

### Passo 3: o navegador recebe a resposta

Quando o navegador vê essa resposta com um `Access-Control-Allow-Origin`, ele permite que os dados de resposta sejam compartilhados com o site do cliente.

## Veja o CORS em ação

Aqui está um pequeno servidor web usando o Express.

{% Glitch { id: 'cors-demo', path: 'server.js', height: 480 } %}

O primeiro endpoint (linha 8) não tem nenhum cabeçalho de resposta definido, ele apenas envia um arquivo em resposta.

{% Instruction 'devtools' %} {% Instruction 'devtools-console', 'ul' %}

- Experimente o comando a seguir:

```js
fetch('https://cors-demo.glitch.me/', {mode:'cors'})
```

Você deverá ver uma mensagem de erro dizendo:

```bash
request has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
is present on the requested resource.
```

O segundo endpoint (linha 13) envia o mesmo arquivo em resposta, mas adiciona `Access-Control-Allow-Origin: *` no cabeçalho. A partir do console, tente

```js
fetch('https://cors-demo.glitch.me/allow-cors', {mode:'cors'})
```

Desta vez, sua solicitação não deve ser bloqueada.

## Compartilhe credenciais com CORS

Por motivos de privacidade, o CORS é normalmente usado para "solicitações anônimas" - aquelas em que a solicitação não identifica o solicitante. Se quiser enviar cookies ao usar CORS (que podem identificar o remetente), você precisa adicionar cabeçalhos adicionais à solicitação e resposta.

### Solicitação

Adicione `credentials: 'include'` nas opções de requisição como mostrado abaixo. Isto incluirá o cookie com a solicitação.

```js
fetch('https://example.com', {
  mode: 'cors',
  credentials: 'include'
})
```

### Resposta

`Access-Control-Allow-Origin` deve ser definido como uma origem específica (sem curinga usando `*`) e deve definir `Access-Control-Allow-Credentials` como `true`.

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

## Solicitações de comprovação para chamadas HTTP complexas

Se um aplicativo da web precisa de uma solicitação HTTP complexa, o navegador adiciona uma **[solicitação de comprovação](https://developer.mozilla.org/docs/Web/HTTP/CORS#preflighted_requests) (preflight request)** na frente da cadeia de solicitação.

A especificação CORS define uma **solicitação complexa** como

- Uma solicitação que usa métodos diferentes de GET, POST ou HEAD
- Uma solicitação que inclui cabeçalhos diferentes de `Accept` , `Accept-Language` ou `Content-Language`
- Uma solicitação que tem um `Content-Type` diferente de `application/x-www-form-urlencoded`, `multipart/form-data` ou `text/plain`

Os navegadores criam uma solicitação de comprovação, se necessário. É uma solicitação `OPTIONS`, como mostrada abaixo, e é enviada antes da mensagem de solicitação real.

```text
OPTIONS /data HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: DELETE
```

Do lado do servidor, uma aplicação precisa responder à solicitação de comprovação com informações sobre os métodos que o aplicativo aceita dessa origem.

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, DELETE, HEAD, OPTIONS
```

A resposta do servidor também pode incluir um cabeçalho `Access-Control-Max-Age` para especificar a duração (em segundos) que devem ser armazenados em cache os resultados da comprovação, para que o cliente não precise fazer uma solicitação de comprovação sempre que enviar uma solicitação complexa.
