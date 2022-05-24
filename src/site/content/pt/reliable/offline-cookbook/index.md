---
layout: post
title: O guia off-line
description: Algumas receitas comuns para fazer seu aplicativo funcionar off-line.
authors:
  - jakearchibald
date: 2014-12-09
updated: 2020-09-28
---

Com o [Trabalho de Serviço](/service-workers-cache-storage/), desistimos de tentar resolver problemas off-line e demos aos desenvolvedores os componentes móveis para que resolvessem por conta própria. Você obtém controle do armazenamento em cache e de como as solicitações são tratadas. Isso significa que é possível criar seus próprios padrões. Vamos dar uma olhada em alguns padrões possíveis de forma isolada. Mas, na prática, provavelmente você usará muitos deles em conjunto, dependendo da URL e do contexto.

Para obter uma demonstração do trabalho de alguns desses padrões, consulte [Treinamento para surpreender](https://jakearchibald.github.io/trained-to-thrill/) e [este vídeo](https://www.youtube.com/watch?v=px-J9Ghvcx4) que mostra o impacto no desempenho.

## A máquina de cache — quando armazenar recursos

O [Trabalho de Serviço](/service-workers-cache-storage/) permite que você lide com solicitações independentemente do armazenamento em cache. Portanto, irei demonstrá-los separadamente. Em primeiro lugar, o armazenamento em cache, quando deve ser feito?

### Na instalação — como uma dependência {: #on-install-as-dependency }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CLdlCeKfoOPfpYDx1s0p.png", alt="Na instalação — como uma dependência.", width="800", height="498" %}<figcaption>Na instalação — como uma dependência.</figcaption></figure>

O Trabalho de Serviço oferece um evento `install` Você pode usar isso para preparar as coisas, coisas que devem estar prontas antes de lidar com outros eventos. Enquanto isso acontece, qualquer versão anterior do seu Trabalho de Serviço ainda está em execução e atendendo páginas, então as coisas que você faz aqui não devem atrapalhar.

**Ideal para:** CSS, imagens, fontes, JS, templates… basicamente tudo que você consideraria estático para essa "versão" do seu site.

São elementos que tornariam seu site totalmente não funcional se não fossem buscadas, coisas que um aplicativo específico de plataforma equivalente tornaria parte do download inicial.

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mysite-static-v3').then(function (cache) {
      return cache.addAll([
        '/css/whatever-v3.css',
        '/css/imgs/sprites-v6.png',
        '/css/fonts/whatever-v8.woff',
        '/js/all-min-v4.js',
        // etc.
      ]);
    }),
  );
});
```

`event.waitUntil` assume a promessa de definir a duração e o sucesso da instalação. Se a promessa for rejeitada, a instalação será considerada uma falha e este Trabalho de Serviço será abandonado (se uma versão mais antiga estiver em execução, será deixada intacta). `caches.open()` e `cache.addAll()` retornam promessas. Se algum dos recursos falhar ao ser buscado, a `cache.addAll()` rejeitada.

No [treinamento para surpreender,](https://jakearchibald.github.io/trained-to-thrill/) eu uso isso para [armazenar ativos estáticos em cache](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L3).

### Na instalação — não como uma dependência {: #on-install-not }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/S5L9hw95GKGWS1l0ImGl.png", alt = "Na instalação — não como uma dependência.", width="800", height="500" %}<figcaption> Na instalação — não como uma dependência.</figcaption></figure>

Isso é semelhante ao anterior, mas não atrasará a conclusão da instalação e não fará com que a instalação falhe se o cache falhar.

**Ideal para:** recursos maiores que não são necessários imediatamente, como ativos para níveis posteriores de um jogo.

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mygame-core-v1').then(function (cache) {
      cache
        .addAll
        // levels 11–20
        ();
      return cache
        .addAll
        // core assets and levels 1–10
        ();
    }),
  );
});
```

O exemplo acima não passa a promessa `cache.addAll` para os níveis 11–20 de volta para `event.waitUntil`. Então, mesmo se falhar, o jogo ainda estará disponível off-line. Claro, você terá que cuidar da possível ausência desses níveis e tentar armazená-los novamente em cache, se estiverem ausentes.

O Trabalho de Serviço pode ser eliminado durante o download dos níveis 11–20, uma vez que concluiu o tratamento de eventos, o que significa que eles não serão armazenados em cache. No futuro, a [API Web Periodic Background Synchronization](https://developer.mozilla.org/docs/Web/API/Web_Periodic_Background_Synchronization_API) tratará casos como este e de downloads maiores, como filmes. Essa API atualmente é compatível apenas com bifurcações Chromium.

### Na ativaçao {: #on-activate }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/pUH91vKtMTLXNgpHmID2.png", alt = "Ativado.", width="800", height="500" %}<figcaption>Ativado.</figcaption></figure>

**Ideal para:** limpeza e migração.

Depois que um novo Trabalho de Serviço é instalado e uma versão anterior não está sendo usada, a nova é ativada e você obtém um evento `activate`. Como a versão antiga não está atrapalhando, é um bom momento para lidar com [migrações de esquema no IndexedDB](/indexeddb-best-practices/) e também excluir caches não utilizados.

```js
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          }),
      );
    }),
  );
});
```

Durante a ativação, outros eventos, como `fetch` são colocados em uma fila. Portanto, uma ativação longa pode bloquear potencialmente os carregamentos de página. Mantenha sua ativação o mais enxuta possível e use-a apenas para coisas que você *não poderia* fazer enquanto a versão antiga estava ativa.

No [treinamento para surpreender,](https://jakearchibald.github.io/trained-to-thrill/) eu uso isso para [remover caches antigos](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L17).

### Na interação do usuário {: #on-user-interaction }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/q5uUUHvxb3Is8N5Toxja.png", alt="Na interação do usuário.", width="800", height="222" %}<figcaption> Na interação do usuário.</figcaption></figure>

**Ideal para:** quando o site inteiro não pode ser colocado off-line e você opta por permitir que o usuário selecione o conteúdo que deseja disponibilizar off-line. Por exemplo, um vídeo em algo como o YouTube, um artigo na Wikipedia, uma galeria particular no Flickr.

Dê ao usuário um botão "Ler mais tarde" ou "Salvar para offline". Quando for clicado, busque o que você precisa da rede e coloque-o no cache.

```js
document.querySelector('.cache-article').addEventListener('click', function (event) {
  event.preventDefault();

  var id = this.dataset.articleId;
  caches.open('mysite-article-' + id).then(function (cache) {
    fetch('/get-article-urls?id=' + id)
      .then(function (response) {
        // /get-article-urls returns a JSON-encoded array of
        // resource URLs that a given article depends on
        return response.json();
      })
      .then(function (urls) {
        cache.addAll(urls);
      });
  });
});
```

A [API de caches](https://developer.mozilla.org/docs/Web/API/Cache) está disponível nas páginas e também nos trabalhos de serviço, o que significa que você não precisa envolvê-lo para adicionar coisas ao cache.

### Na resposta da rede {: #on-network-response }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/86mv3BK2kjWi8Dm1KWpr.png", alt="Na resposta da rede.", width="800", height="390" %}<figcaption>Na resposta da rede.</figcaption></figure>

**Ideal para:** atualizar recursos com frequência, como a caixa de entrada de um usuário ou conteúdo de artigo. Também é útil para conteúdo não essencial, como avatares, mas é preciso ter cuidado.

Se uma solicitação não corresponder a nada no cache, obtenha-a na rede, envie-a para a página e adicione-a ao cache ao mesmo tempo.

Se fizer isso para uma variedade de URLs, como avatares, você precisará ter cuidado para não sobrecarregar o armazenamento de sua origem. Se o usuário precisa recuperar espaço em disco, você não quer ser o principal candidato. Não se esqueça de eliminar os itens do cache de que não precisa mais.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    }),
  );
});
```

Para permitir o uso eficiente da memória, você só pode ler o corpo de uma resposta/solicitação uma vez. O código acima usa [`.clone()`](https://fetch.spec.whatwg.org/#dom-request-clone) para criar cópias adicionais que podem ser lidas separadamente.

No [treinamento para surpreender,](https://jakearchibald.github.io/trained-to-thrill/) eu uso isso para [armazenar imagens do Flickr em cache](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L109).

### Obsoleto na revalidação {: #stale-while-revalidate }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6GyjQkG2pI5tV1xirXSX.png", alt="Obsoleto na revalidação.", width="800", height="388" %}<figcaption>Obsoleto na revalidação.</figcaption></figure>

**Ideal para:** atualização frequente de recursos em que não é necessário ter a versão mais recente. Os avatares podem se enquadrar nesta categoria.

Se houver uma versão em cache disponível, use-a, mas busque uma atualização para a próxima vez.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
});
```

Isso é muito semelhante ao [obsoleto na revalidação](https://www.mnot.net/blog/2007/12/12/stale) do HTTP.

### Na mensagem por push {: #on-push-message }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bshuBXOyD2A4zveXQMul.png", alt="Na mensagem por push.", width="800", height="498" %}<figcaption>Na mensagem por push.</figcaption></figure>

A [API Push](/push-notifications/) é outro recurso criado com base no Trabalho de Serviço. Isso permite que o Trabalho de Serviço seja despertado em resposta a uma mensagem do serviço de mensagens do sistema operacional. Isso acontece mesmo quando o usuário não tem uma guia aberta no seu site. Apenas o Trabalho de Serviço é despertado. Você solicita permissão para fazer isso a partir de uma página e o usuário será solicitado.

**Ideal para:** conteúdo relacionado a uma notificação, como uma mensagem de bate-papo, uma notícia de última hora ou um e-mail. Também não muda com frequência o conteúdo que se beneficia da sincronização imediata, como uma atualização da lista de tarefas ou uma alteração do calendário.

{% YouTube '0i7YdSEQI1w' %}

O resultado final comum é uma notificação que, ao tocar nela, abre/focaliza uma página relevante, mas para a qual a atualização dos caches é *extremamente* importante antes que isso aconteça. O usuário está obviamente on-line no momento que receber a mensagem por push, mas pode não estar quando finalmente interagir com a notificação. Portanto, disponibilizar esse conteúdo off-line é importante.

Este código atualiza os caches antes de mostrar uma notificação:

```js
self.addEventListener('push', function (event) {
  if (event.data.text() == 'new-email') {
    event.waitUntil(
      caches
        .open('mysite-dynamic')
        .then(function (cache) {
          return fetch('/inbox.json').then(function (response) {
            cache.put('/inbox.json', response.clone());
            return response.json();
          });
        })
        .then(function (emails) {
          registration.showNotification('New email', {
            body: 'From ' + emails[0].from.name,
            tag: 'new-email',
          });
        }),
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  if (event.notification.tag == 'new-email') {
    // Assume that all of the resources needed to render
    // /inbox/ have previously been cached, e.g. as part
    // of the install handler.
    new WindowClient('/inbox/');
  }
});
```

### Na sincronização em segundo plano {: #on-background-sync }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tojpjg0cvZZVvZWStG81.png", alt="Na sincronização em segundo plano.", width="800", height="219" %}<figcaption>Na sincronização em segundo plano.</figcaption></figure>

A [sincronização em segundo plano](https://developer.chrome.com/blog/background-sync/) é outro recurso criado com base no Trabalho de Serviço. Ele permite que você solicite a sincronização de dados em segundo plano como um intervalo único ou em um intervalo (extremamente heurístico). Isso acontece mesmo quando o usuário não tenha uma guia aberta no seu site. Apenas o Trabalho de Serviço é despertado. Você solicita permissão para fazer isso a partir de uma página e o usuário será solicitado.

**Ideal para:** atualizações não urgentes, especialmente aquelas que acontecem tão regularmente que uma mensagem por push a cada atualização seria muito frequente para os usuários, como cronogramas sociais ou artigos de notícias.

```js
self.addEventListener('sync', function (event) {
  if (event.id == 'update-leaderboard') {
    event.waitUntil(
      caches.open('mygame-dynamic').then(function (cache) {
        return cache.add('/leaderboard.json');
      }),
    );
  }
});
```

## Persistência de cache {: #cache-persistence }

Sua origem recebe uma certa quantidade de espaço livre para fazer o que quiser. Esse espaço livre é compartilhado entre todo o armazenamento de origem: [(local) Storage](https://developer.mozilla.org/docs/Web/API/Storage), [IndexedDB](https://developer.mozilla.org/docs/Glossary/IndexedDB), [File System Access](/file-system-access/) e, obviamente [Caches](https://developer.mozilla.org/docs/Web/API/Cache).

O valor que você recebe não é especificado. Vai ser diferente dependendo do dispositivo e das condições de armazenamento. Você pode descobrir quanto você tem via:

```js
navigator.storageQuota.queryInfo('temporary').then(function (info) {
  console.log(info.quota);
  // Result: <quota in bytes>
  console.log(info.usage);
  // Result: <used data in bytes>
});
```

No entanto, como todo armazenamento de navegador, o navegador está livre para jogar fora seus dados se o dispositivo estiver sob pressão de armazenamento. Infelizmente, o navegador não consegue diferenciar os filmes que você deseja manter a todo custo e o jogo com o qual você realmente não se importa.

Para contornar isso, use a interface [StorageManager:](https://developer.mozilla.org/docs/Web/API/StorageManager)

```js
// From a page:
navigator.storage.persist()
.then(function(persisted) {
  if (persisted) {
    // Hurrah, your data is here to stay!
  } else {
   // So sad, your data may get chucked. Sorry.
});
```

Claro que o usuário deve conceder permissão. Para isso, use a API de permissões.

Tornar o usuário parte desse fluxo é importante, pois agora podemos esperar que ele esteja no controle da exclusão. Se o dispositivo ficar sob pressão de armazenamento e a limpeza de dados não essenciais não resolver o problema, o usuário poderá avaliar quais itens manter e remover.

Para que isso funcione, é necessário que os sistemas operacionais tratem as origens "duráveis" como equivalentes aos aplicativos específicos da plataforma em suas análises de uso de armazenamento, em vez de relatar o navegador como um único item.

## Atendendo sugestões — respondendo a solicitações {: #serving-suggestions }

Não importa quanto cache você faça, o trabalho de serviço não usará o cache, a menos que você diga quando e como. Aqui estão alguns padrões para lidar com solicitações:

### Apenas cache {: #cache-only }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ppXImAnXW7Grk4igLRTj.png", alt="Apenas cache.", width="800", height="272" %}<figcaption>Apenas cache.</figcaption></figure>

**Ideal para:** qualquer coisa que você considere estática para uma "versão" específica de seu site. Você deve ter armazenado em cache no evento de instalação, para que possa contar com sua presença.

```js
self.addEventListener('fetch', function (event) {
  // If a match isn't found in the cache, the response
  // will look like a connection error
  event.respondWith(caches.match(event.request));
});
```

… Embora você não precise lidar com esse caso especificamente, [Cache, fazendo fallback para a rede](#cache-falling-back-to-network) aborda esse assunto.

### Apenas rede {: #network-only }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5piPzi4NRGcgy1snmlEW.png", alt="Apenas rede.", width="800", height="272" %}<figcaption>Apenas rede.</figcaption></figure>

**Ideal para:** coisas que não têm equivalente off-line, como pings analíticos, solicitações não GET.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
  // or simply don't call event.respondWith, which
  // will result in default browser behavior
});
```

… Embora você não precise lidar com esse caso especificamente, [Cache, fazendo fallback para a rede](#cache-falling-back-to-network) aborda esse assunto.

### Cache, fazendo fallback para a rede{: #cache-falling-back-to-network }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMXq6ya5HdjkNeGjTlAN.png", alt="Cache, fazendo fallback para a rede.", width="800", height="395"%}<figcaption>Cache, fazendo fallback para a rede.</figcaption></figure>

**Ideal para:** construir o primeiro projeto off-line. Nesses casos, é assim que você lidará com a maioria das solicitações. Outros padrões serão exceções com base na solicitação recebida.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

Isso fornece o comportamento "somente cache" para itens no cache e o comportamento "somente rede" para qualquer coisa não armazenada em cache (o que inclui todas as solicitações não GET, já que não podem ser armazenadas em cache).

### Cache e corrida de rede {: #cache-and-network-race }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/j6xbmOpm4GbayBJHChNW.png", alt="Cache e corrida de rede.", width="800", height="427 "%}<figcaption>Cache e corrida de rede.</figcaption></figure>

**Ideal para:** pequenos ativos em que você busca desempenho em dispositivos com acesso lento ao disco.

Com algumas combinações de discos rígidos mais antigos, antivírus e conexões de internet mais rápidas, obter recursos da rede pode ser mais rápido do que ir para o disco. No entanto, ir para a rede quando o usuário tem o conteúdo em seu dispositivo pode ser um desperdício de dados. Portanto, tenha isso em mente.

```js
// Promise.race is no good to us because it rejects if
// a promise rejects before fulfilling. Let's make a proper
// race function:
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map((p) => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach((p) => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b)).catch(() => reject(Error('All failed')));
  });
}

self.addEventListener('fetch', function (event) {
  event.respondWith(promiseAny([caches.match(event.request), fetch(event.request)]));
});
```

### Rede fazendo fallback para o cache {: #network-falling-back-to-cache }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/efLECR7ZqNiPjmAzvEzO.png", alt="Rede fazendo fallback para o cache.", width="800", height="388" %}<figcaption>Rede fazendo fallback para o cache.</figcaption></figure>

**Ideal para:** uma solução rápida para recursos que se atualizam com frequência, fora da "versão" do site. Por exemplo, artigos, avatares, cronogramas de mídia social e placares de jogos.

Isso significa que você fornece aos usuários online o conteúdo mais atualizado, mas os usuários offline obtêm uma versão em cache mais antiga. Se a solicitação de rede for bem-sucedida, provavelmente você desejará [atualizar a entrada do cache](#on-network-response).

No entanto, esse método tem falhas. Se o usuário tiver uma conexão intermitente ou lenta, terá que esperar que a rede falhe antes de obter o conteúdo perfeitamente aceitável já em seu dispositivo. Isso pode levar muito tempo e é uma experiência frustrante para o usuário. Consulte o próximo padrão, [Cache e rede](#cache-then-network), para obter uma solução melhor.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    }),
  );
});
```

### Cache e rede {: #cache-then-network }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BjxBlbCf14ed9FBQRS6E.png", alt="Cache e rede.", width="800", height="478" %}<figcaption> Cache e rede.</figcaption></figure>

**Ideal para:** conteúdo que é atualizado com frequência. Por exemplo, artigos, cronogramas de mídia social e jogos, além de placares.

Isso exige que a página faça duas solicitações, uma para o cache e outra para a rede. A ideia é mostrar primeiro os dados armazenados em cache e, em seguida, atualizar a página quando/se os dados da rede chegarem.

Às vezes, você pode simplesmente substituir os dados atuais quando novos dados chegarem (por exemplo, placar do jogo), mas isso pode gerar falhas com partes maiores de conteúdo. Basicamente, não "desapareça" algo que o usuário possa estar lendo ou interagindo.

O Twitter adiciona o novo conteúdo acima do conteúdo antigo e ajusta a posição de rolagem para que o usuário não seja interrompido. Isso é possível porque o Twitter retém principalmente uma ordem linear para o conteúdo. Copiei esse padrão para que o [Treinamento para supreender](https://jakearchibald.github.io/trained-to-thrill/) coloque conteúdo na tela o mais rápido possível, enquanto exibe o conteúdo atualizado assim que chega.

**Código na página:**

```js
var networkDataReceived = false;

startSpinner();

// fetch fresh data
var networkUpdate = fetch('/data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    updatePage(data);
  });

// fetch cached data
caches
  .match('/data.json')
  .then(function (response) {
    if (!response) throw Error('No data');
    return response.json();
  })
  .then(function (data) {
    // don't overwrite newer network data
    if (!networkDataReceived) {
      updatePage(data);
    }
  })
  .catch(function () {
    // we didn't get cached data, the network is our last hope:
    return networkUpdate;
  })
  .catch(showErrorMessage)
  .then(stopSpinner);
```

**Código no Trabalho de Serviço:**

Você deve sempre acessar a rede e atualizar o cache durante o processo.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return fetch(event.request).then(function (response) {
        cache.put(event.request, response.clone());
        return response;
      });
    }),
  );
});
```

No [Treinamento para supreender](https://jakearchibald.github.io/trained-to-thrill/), contornei isso usando [XHR em vez de buscar](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/utils.js#L3) e abusando do cabeçalho Aceitar para informar ao Trabalho de Serviço onde obter o resultado do [código da página](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/index.js#L70), [código do Trabalho de Serviço](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L61)).

### Fallback genérico {: #generic-fallback}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URF7IInbQtWL6GZK9GW3.png", alt="Fallback genérico.", width="800", height="389" %}<figcaption>Substituto genérico.</figcaption></figure>

Se você falhar em atender algo do cache e/ou rede, você pode querer fornecer um fallback genérico.

**Ideal para:** imagens secundárias, como avatares, solicitações POST com falha e "Indisponível enquanto off-line", página.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // Try the cache
    caches
      .match(event.request)
      .then(function (response) {
        // Fall back to network
        return response || fetch(event.request);
      })
      .catch(function () {
        // If both fail, show a generic fallback:
        return caches.match('/offline.html');
        // However, in reality you'd have many different
        // fallbacks, depending on URL and headers.
        // Eg, a fallback silhouette image for avatars.
      }),
  );
});
```

O item para o qual você faz fallback provavelmente é uma [dependência de instalação](#on-install-as-dependency).

Se sua página estiver postando um e-mail, seu trabalho de serviço pode voltar a armazenar o e-mail em uma "caixa de saída" do IndexedDB e responder informando à página que o envio falhou, mas os dados foram retidos com sucesso.

### Templates no trabalho de serviço {: #Service Worker-side-templating }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/o5SqtDczlvhw6tPJkr2z.png", alt="Template no trabalho de serviço.", width="800", height="463"%}<figcaption>Template no trabalho de serviço.</figcaption></figure>

**Ideal para:** páginas que não podem ter a resposta do servidor em cache.

[Renderizar páginas no servidor torna as coisas mais rápidas](https://jakearchibald.com/2013/progressive-enhancement-is-faster/), mas isso pode significar incluir dados de estado que podem não fazer sentido em um cache, por exemplo, "Conectado como…". Se sua página for controlada por um trabalho de serviço, você pode optar por solicitar dados JSON junto com um template e renderizar.

```js
importScripts('templating-engine.js');

self.addEventListener('fetch', function (event) {
  var requestURL = new URL(event.request.url);

  event.respondWith(
    Promise.all([
      caches.match('/article-template.html').then(function (response) {
        return response.text();
      }),
      caches.match(requestURL.path + '.json').then(function (response) {
        return response.json();
      }),
    ]).then(function (responses) {
      var template = responses[0];
      var data = responses[1];

      return new Response(renderTemplate(template, data), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }),
  );
});
```

## Conclusão

Você não está limitado a um desses métodos. Na verdade, você provavelmente usará muitos deles, dependendo da URL de solicitação. Por exemplo, [Treinamento para surpreender](https://jakearchibald.github.io/trained-to-thrill/) usa:

- [cache na instalação](#on-install-as-dependency), para a interface do usuário estática e comportamento
- [cache na resposta da rede](#on-network-response), para as imagens e dados do Flickr
- [buscar do cache, fazendo fallback para a rede](#cache-falling-back-to-network), na maioria das solicitações
- [buscar do cache e rede](#cache-then-network), para os resultados de pesquisa do Flickr

Basta olhar para a solicitação e decidir o que fazer:

```js
self.addEventListener('fetch', function (event) {
  // Parse the URL:
  var requestURL = new URL(event.request.url);

  // Handle requests to a particular host specifically
  if (requestURL.hostname == 'api.example.com') {
    event.respondWith(/* some combination of patterns */);
    return;
  }
  // Routing for local URLs
  if (requestURL.origin == location.origin) {
    // Handle article URLs
    if (/^\/article\//.test(requestURL.pathname)) {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (/\.webp$/.test(requestURL.pathname)) {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (request.method == 'POST') {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (/cheese/.test(requestURL.pathname)) {
      event.respondWith(
        new Response('Flagrant cheese error', {
          status: 512,
        }),
      );
      return;
    }
  }

  // A sensible default pattern
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

… Você entendeu.

### Créditos

… Para os ícones adoráveis:

- [Código](http://thenounproject.com/term/code/17547/), de buzzyrobot
- [Calendário](http://thenounproject.com/term/calendar/4672/), de Scott Lewis
- [Rede](http://thenounproject.com/term/network/12676/), de Ben Rizzo
- [SD](http://thenounproject.com/term/sd-card/6185/), de Thomas Le Bas
- [CPU](http://thenounproject.com/term/cpu/72043/) por iconsmind.com
- [Lixo](http://thenounproject.com/term/trash/20538/), de trasnik
- [Notificação](http://thenounproject.com/term/notification/32514/), de @daosme
- [Layout](http://thenounproject.com/term/layout/36872/), de Mister Pixel
- [Nuvem](http://thenounproject.com/term/cloud/2788/), de PJ Onori

E obrigado a [Jeff Posnick](https://twitter.com/jeffposnick) por detectar muitos erros gritantes antes que eu clicasse em "publicar".

### Leitura adicional

- [Trabalhos de serviço — uma introdução](/service-workers-cache-storage/)
- [O trabalho de serviço está pronto?](https://jakearchibald.github.io/isserviceworkerready/) — monitore o status de implementação nos navegadores principais
- [Promessas do JavaScript — uma introdução](/promises), guia para promessas
