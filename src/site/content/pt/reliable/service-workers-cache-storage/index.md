---
layout: post
title: Service workers e a API Cache Storage
authors:
  - jeffposnick
date: 2018-11-05
updated: 2020-02-27
description: O cache HTTP do navegador é sua primeira linha de defesa. Não é necessariamente a abordagem mais poderosa ou flexível, e você tem controle limitado sobre o tempo de vida das respostas em cache. Mas existem várias regras básicas que oferecem uma implementação de cache sensata sem muito trabalho, então você deveria sempre tentar segui-las.
---

Você está em uma luta pela confiabilidade da rede. O cache HTTP do navegador é sua primeira linha de defesa, mas como você aprendeu, ele só é eficaz de fato ao carregar URLs versionados que você já tenha visitado. Por si só, o cache HTTP não é suficiente.

Felizmente, duas ferramentas mais recentes estão disponíveis para ajudar a fazer a maré virar a seu favor: [service workers](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) e a [API Cache Storage](https://developer.mozilla.org/docs/Web/API/CacheStorage). Pelo fato de os dois serem frequentemente usados juntos, vale a pena aprender sobre os dois ao mesmo tempo.

## Service workers

Um service worker é integrado ao navegador e controlado por um pouco de código JavaScript extra que você é responsável por criar. Você implementa isso junto com os outros arquivos que constituem o seu aplicativo da web real.

Um service worker tem alguns poderes especiais. Entre outras funções, ele espera pacientemente que seu aplicativo da web faça uma solicitação de saída e, em seguida, entra em ação interceptando-o. O que o service worker faz com essa solicitação interceptada é você quem decide.

Para algumas solicitações, o melhor curso de ação pode ser apenas permitir que a solicitação continue na rede, da mesma forma que aconteceria se não houvesse nenhum service worker.

Para outras solicitações, no entanto, você pode tirar proveito de algo mais flexível do que o cache HTTP do navegador e retornar uma resposta rápida e confiável sem ter que se preocupar com a rede. Isso envolve o uso de outra peça do quebra-cabeça: a API Cache Storage.

## A API Cache Storage

A API Cache Storage abre toda uma nova gama de possibilidades, dando aos desenvolvedores controle completo sobre o conteúdo do cache. Em vez de depender de uma combinação de cabeçalhos HTTP e [heurísticas](https://httpwg.org/specs/rfc7234.html#heuristic.freshness) integradas do navegador, a API de armazenamento em cache expõe uma abordagem baseada em código para o armazenamento em cache. A API de armazenamento em cache é particularmente útil quando chamada a partir do JavaScript do seu prestador de serviço.

### Espere aí… agora há outro cache para considerar?

Você provavelmente está se perguntando coisas como "Ainda preciso configurar meus cabeçalhos HTTP?" e "O que posso fazer com este novo cache que não foi possível com o cache HTTP?" Não se preocupe, essas são reações naturais.

Ainda é recomendado que você configure os `Cache-Control` em seu servidor web, mesmo quando você sabe que está usando a API Cache Storage. Normalmente, você pode se safar configurando `Cache-Control: no-cache` para URLs não versionados e/ou `Cache-Control: max-age=31536000` para URLs que contêm informações de versionamento, como hashes.

Ao preencher o cache da API de armazenamento em cache, o [padrão do navegador é verificar as entradas existentes](https://jakearchibald.com/2016/caching-best-practices/#the-service-worker-the-http-cache-play-well-together-dont-make-them-fight) no cache HTTP e usá-las, se encontradas. Se estiver adicionando URLs com versão ao cache da API de armazenamento em cache, o navegador evita novas solicitações de rede. O outro lado disso é que se você estiver usando `Cache-Control` configurados incorretamente, como especificar uma vida útil de cache de longa duração para uma URL não versionada, você pode acabar [piorando as coisas](https://jakearchibald.com/2016/caching-best-practices/#a-service-worker-can-extend-the-life-of-these-bugs) adicionando esse conteúdo obsoleto à API Cache Storage. Classificar o comportamento do cache HTTP é um pré-requisito para o uso eficaz da API Cache Storage.

Quanto ao que agora é possível com esta nova API, a resposta é: muita coisa. Alguns usos comuns que seriam difíceis ou impossíveis apenas com o cache HTTP incluem:

- Usar uma abordagem de "atualização em segundo plano" para o conteúdo em cache, conhecida como stale-while revalidate (obsoleto durante a revalidação).
- Impor um limite ao número máximo de ativos para armazenar em cache e implemente uma política de expiração personalizada para remover itens assim que esse limite for atingido.
- Comparar as respostas da rede armazenadas em cache anteriormente para ver se algo mudou e permitir que o usuário atualize o conteúdo (com um botão, por exemplo) quando os dados forem realmente atualizados.

Confira [A API Cache: um guia rápido](/cache-api-quick-guide/) para saber mais.

### Porcas e parafusos da API

Há algumas coisas a se ter em mente sobre o design da API:

- Objetos [`Request`](https://developer.mozilla.org/docs/Web/API/Request) são usados como chaves exclusivas ao ler e gravar nesses caches. Para sua conveniência, você pode passar uma string de URL como `'https://example.com/index.html'` como a chave em vez de um `Request` real, e a API cuidará disso automaticamente para você.
- Objetos [`Response`](https://developer.mozilla.org/docs/Web/API/Response) são usados como valores nesses caches.
- O `Cache-Control` em uma determinada `Response` é efetivamente ignorado ao armazenar dados em cache. Não há verificações automáticas de expiração ou atualização e, ao armazenar um item no cache, ele persistirá até que seu código o remova explicitamente. (Existem bibliotecas para simplificar a manutenção do cache em seu nome. Elas serão abordadas posteriormente nesta série.)
- Ao contrário de APIs síncronas mais antigas, como[`LocalStorage`](https://developer.mozilla.org/docs/Web/API/Storage/LocalStorage), todas as operações da API Cache Storage são assíncronas.

## Um desvio rápido: promises e async/wait

Os service workers e a API Cache Storage usam [conceitos de programação assíncrona](https://en.wikipedia.org/wiki/Asynchrony_(computer_programming)). Em particular, eles dependem muito de promises para representar o resultado futuro das operações async. Você deve se familiarizar com [promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) e as sintaxes [`async`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)/[`await`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/await) relacionadas antes de se aprofundar.

{% Aside 'codelab' %} [Torne um aplicativo confiável registrando um service worker](/codelab-service-workers) . {% endAside %}

## Não implante esse código… ainda

Embora forneçam uma base importante e possam ser usados no estado em que se encontram, os service workers e a API Cache Storage são blocos de construção de nível inferior, com vários casos extremos e "pegadinhas". Existem algumas ferramentas de nível superior que podem ajudar a suavizar as partes difíceis dessas APIs e fornecer tudo que você precisa para construir um service worker pronto para produção. O próximo guia cobre uma dessas ferramentas: [Workbox](https://developer.chrome.com/docs/workbox/) .

{% Aside 'success' %} Aprenda ao mesmo tempo em que se diverte. Confira o novo [jogo Service Workies!](https://serviceworkies.com/) . {% endAside %}
