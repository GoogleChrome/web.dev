---
title: |2-

  Construindo um PWA no Google, parte 1
subhead: |2-

  O que a equipe Bulletin aprendeu sobre os service workers durante o desenvolvimento de um PWA.
date: 2020-07-29
authors:
  - joelriley
  - douglasparker
  - msdikla
hero: image/admin/mgB3j6NZa6F1CkoD9YI4.jpg
alt: Um grupo de pessoas trabalhando em seus computadores em uma mesa.
description: |2-

  O que a equipe Bulletin aprendeu sobre os service workers durante o desenvolvimento de um PWA.
tags:
  - blog
  - progressive-web-apps
  - service-worker
  - performance
  - storage
  - testing
---

Esta é a primeira de uma série de postagens de blog sobre as lições que a equipe do Google Bulletin aprendeu ao construir um PWA externo. Nessas postagens, compartilharemos alguns dos desafios que enfrentamos, as abordagens que adotamos para superá-los e conselhos gerais para evitar armadilhas. Esta não é, de forma alguma, uma visão geral completa dos PWAs. O objetivo é compartilhar aprendizados com a experiência de nossa equipe.

Nesta primeira postagem, cobriremos primeiro algumas informações básicas e, em seguida, nos aprofundaremos em todas as coisas que aprendemos sobre os service workers.

{% Aside %} O Bulletin foi encerrado em 2019 devido à falta de adequação do produto/mercado. Mesmo assim, aprendemos muito sobre PWAs ao longo do caminho! {% endAside %}

## Histórico {: #background }

O Bulletin esteve em desenvolvimento ativo de meados de 2017 a meados de 2019.

### Por que escolhemos construir um PWA {: #why-pwa }

Antes de nos aprofundarmos no processo de desenvolvimento, vamos examinar por que construir um PWA foi uma opção atraente para este projeto:

- **Capacidade de iterar rapidamente**. Especialmente valioso porque o Bulletin seria testado em vários mercados.
- **Base de código única**. Nossos usuários estavam divididos quase uniformemente entre Android e iOS. Um PWA significava que poderíamos construir um único aplicativo da web que funcionasse em ambas as plataformas. Isso aumentou a velocidade e o impacto da equipe.
- **Atualizado rapidamente e independente do comportamento do usuário**. Os PWAs podem ser atualizados automaticamente, o que reduz a quantidade de clientes desatualizados. Conseguimos realizar alterações de back-end com um tempo de migração muito curto para os clientes.
- **Facilmente integrado com aplicativos próprios e de terceiros.** Essas integrações eram um requisito para o aplicativo. Com um PWA, muitas vezes significava simplesmente abrir um URL.
- **Sem o atrito de instalação de um aplicativo.**

### Nossa estrutura {: #framework}

Para o Bulletin, usamos o [Polymer](https://www.polymer-project.org/), mas qualquer estrutura moderna e bem suportada funciona.

## O que aprendemos sobre os service-workers {: #lessons-learned }

Você não pode ter um PWA sem um [service worker](https://developer.chrome.com/docs/workbox/service-worker-overview/). Os service workers oferecem muito poder, como estratégias avançadas de cache, recursos offline, sincronização em segundo plano etc. Embora os service workers tragam alguma complexidade, descobrimos que seus benefícios superam a complexidade adicionada.

### Gere-o se puder {: #generate }

Evite escrever um script de service worker manualmente. Escrever service workers manualmente requer o gerenciamento manual de recursos em cache e reescrever a lógica que é comum à maioria das bibliotecas de service workers, como o [Workbox](https://developer.chrome.com/docs/workbox/).

Dito isso, devido à nossa pilha de tecnologia interna, não podíamos usar uma biblioteca para gerar e gerenciar nosso service worker. Nossos aprendizados abaixo às vezes refletem isso. Acesse [Armadilhas para service workers não gerados](#pitfalls) para ler mais.

### Nem todas as bibliotecas são compatíveis com service-workers {: #libraries }

Algumas bibliotecas JS fazem suposições que não funcionam conforme o esperado quando executadas por um service worker. Por exemplo, supondo que `window` ou `document` estejam disponíveis, ou usando uma API não disponível para service workers ( `XMLHttpRequest` , armazenamento local, etc). Certifique-se de que todas as bibliotecas críticas de que você precisa para o seu aplicativo sejam compatíveis com o service worker. Para este PWA específico, queríamos usar [gapi.js](https://github.com/google/google-api-javascript-client) na autenticação, mas não foi possível porque ele não tinha suporte a service workers. Os autores da biblioteca também devem reduzir ou remover suposições desnecessárias sobre o contexto do JavaScript, sempre que possível, para dar suporte aos casos de uso do service worker, como evitar APIs incompatíveis com o service worker e [evitar o estado global](#global-state).

### Evite acessar a IndexedDB durante a inicialização {: #idb }

Não leia a [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) ao inicializar seu script de service worker, ou então você pode entrar nesta situação indesejada:

1. O usuário possui aplicativo da web com IndexedDB (IDB) versão N
2. Novo aplicativo da web lançado com versão N+1 do BID
3. O usuário visita o PWA, que aciona o download de um novo service worker
4. Novo service worker lê do BID antes de registrar o `install`, acionando um ciclo de atualização do BID para ir de N para N+1.
5. Como o usuário tem um cliente antigo com a versão N, o processo de atualização do service worker trava, pois as conexões ativas ainda estão abertas para a versão antiga do banco de dados
6. O service worker trava e nunca instala

Em nosso caso, o cache foi invalidado na instalação do service worker, portanto, se o service worker nunca foi instalado, os usuários jamais receberam o aplicativo atualizado.

### Torne-o resiliente {: #resilient }

Embora os scripts do service worker sejam executados em segundo plano, eles também podem ser encerrados a qualquer momento, mesmo quando no meio de operações de E/S (rede, BID etc.). Qualquer processo de longa execução deve ser recuperável a qualquer instante.

No caso de um processo de sincronização que carregava arquivos grandes no servidor e salvos no BID, nossa solução para carregamentos parciais interrompidos era aproveitar as vantagens do sistema recuperável de nossa biblioteca interna de upload, salvando o URL de upload recuperável para o BID antes do upload e usando esse URL para retomar um upload, caso não tenha sido concluído da primeira vez. Além disso, antes de qualquer operação de E/S de longa duração, o estado foi salvo no IDB para indicar em que parte do processo estávamos para cada registro.

### Não dependa do estado global {: #global-state }

Como os service workers existem em um contexto diferente, muitos símbolos que você espera que existam não estão presentes. Muito do nosso código foi executado em um `window`, bem como um contexto de service-worker (como registro, sinalizadores, sincronização etc.). O código precisa ser defensivo sobre os serviços que usa, como armazenamento local ou cookies. Você pode usar [`globalThis`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis) para se referir ao objeto global de uma maneira que funcione em todos os contextos. Use também os dados armazenados em variáveis globais com moderação, pois não há garantia de quando o script será encerrado e o estado despejado.

### Desenvolvimento local {: #local-development }

Um dos principais componentes dos service workers é o armazenamento em cache de recursos localmente. No entanto, durante o desenvolvimento, isso é exatamente o *oposto* do que você deseja, principalmente quando as atualizações são feitas lentamente. Você ainda deseja que o servidor de trabalho seja instalado para poder depurar problemas com ele ou trabalhar com outras APIs, como sincronização em segundo plano ou notificações. No Chrome, você pode fazer isso por meio do Chrome DevTools habilitando a caixa de seleção **Ignorar para rede**, **(painel Aplicativo** &gt; painel **Service workers** ), além de habilitar a caixa de seleção **Desabilitar cache** no painel **Rede** para desabilitar também o cache de memória. A fim de abranger mais navegadores, optamos por uma solução diferente, incluindo um sinalizador para desativar o cache em nosso service worker, que é ativado por padrão em compilações de desenvolvedor. Isso garante que os desenvolvedores sempre obtenham as alterações mais recentes sem problemas de cache. Também é importante incluir o `Cache-Control: no-cache` para [evitar que o navegador armazene quaisquer ativos em cache](/http-cache/#unversioned-urls).

### Lighthouse {: #lighthouse }

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) fornece várias ferramentas de depuração úteis para PWAs. Ele verifica um site e gera relatórios que abrangem PWAs, desempenho, acessibilidade, SEO e outras práticas recomendadas. Recomendamos [executar o Lighthouse em integração contínua](https://github.com/GoogleChrome/lighthouse-ci) para alertá-lo se você quebrar um dos critérios para ser um PWA. Na verdade, isso aconteceu conosco uma vez em que o service worker não estava instalando e não percebemos antes de um impulso para produção. Ter o Lighthouse como parte da nossa CI teria evitado isso.

### Adote a entrega contínua {: #continuous-delivery }

Como os service workers podem atualizar automaticamente, os usuários não conseguem limitar as atualizações. Isso reduz significativamente a quantidade de clientes desatualizados já publicados. Quando o usuário abrisse nosso aplicativo, o service worker serviria o cliente antigo enquanto baixava o novo cliente vagarosamente. Após o download do novo cliente, ele solicitaria que o usuário atualizasse a página para acessar os novos recursos. Mesmo se o usuário ignorasse essa solicitação, na próxima vez que atualizasse a página, receberia a nova versão do cliente. Como resultado, é muito difícil para um usuário recusar atualizações da mesma forma que pode para aplicativos iOS/Android.

Conseguimos realizar alterações de back-end com um tempo de migração muito curto para os clientes. Normalmente, daríamos um mês para que os usuários atualizassem para clientes mais novos antes de fazer alterações significativas. Como o aplicativo seria disponibilizado enquanto estava desatualizado, era de fato possível que clientes mais antigos existissem se o usuário não abrisse o aplicativo por muito tempo. No iOS, os service workers são [despejados após algumas semanas](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/#post-10218:~:text=7%2DDay%20Cap%20on%20All%20Script%2DWriteable%20Storage), portanto, esse caso não acontece. Para o Android, esse problema pode ser atenuado não disponibilizando enquanto estiver desatualizado ou expirando manualmente o conteúdo após algumas semanas. Na prática, nunca encontramos problemas com clientes obsoletos. O grau de rigidez de uma determinada equipe depende de seu caso de uso específico, mas os PWAs oferecem muito mais flexibilidade do que os aplicativos iOS/Android.

### Obtendo valores de cookie em um service worker {: #cookies }

Às vezes, é necessário acessar os valores dos cookies em um contexto de service worker. Em nosso caso, precisávamos acessar os valores do cookie para gerar um token para autenticar as solicitações de API primárias. Em um service worker, APIs síncronas, como `document.cookies` não estão disponíveis. Você sempre pode enviar uma mensagem para clientes ativos (em janela) do service worker para solicitar os valores do cookie, embora seja possível para o service worker ser executado em segundo plano sem nenhum cliente em janela disponível, como durante uma sincronização em segundo plano. Para contornar isso, criamos um endpoint em nosso servidor front-end que simplesmente ecoava o valor do cookie de volta para o cliente. O service worker fazia uma solicitação de rede para este endpoint e lia a resposta para obter os valores do cookie.

Com o lançamento da [API de armazenamento de cookies](https://developers.google.com/web/updates/2018/09/asynchronous-access-to-http-cookies), essa solução alternativa não deve mais ser necessária para navegadores que a suportam, pois oferece acesso assíncrono aos cookies do navegador e pode ser usada diretamente pelo service worker.

## Armadilhas para service workers não gerados {: #pitfalls}

### Certifique-se de que o script do service worker mude se algum arquivo estático em cache for alterado {: #regeneration}

Um padrão PWA comum é um service worker instalar todos os arquivos de aplicativos estáticos durante sua `install`, o que permite que os clientes acessem o cache da API de armazenamento em cache diretamente para todas as visitas subsequentes. Os service workers são instalados apenas quando o navegador detecta que o script do service worker mudou de alguma forma, portanto, tínhamos que garantir que o próprio arquivo de script do service worker mudasse de alguma forma quando um arquivo em cache fosse alterado. Fizemos isso manualmente incorporando um hash do conjunto de arquivos de recursos estáticos em nosso script do service worker, de forma que cada versão produzisse um arquivo JavaScript distinto do service worker. As bibliotecas de service workers, como [Workbox,](https://developer.chrome.com/docs/workbox/) automatizam esse processo para você.

### Teste de unidades {: #unit-testing}

As APIs de service workers funcionam adicionando ouvintes de eventos ao objeto global. Por exemplo:

```js
self.addEventListener('fetch', (evt) => evt.respondWith(fetch('/foo')));
```

Pode ser difícil testar isso porque você precisa simular o gatilho do evento, o objeto do evento, aguardar o `respondWith()` e, em seguida, aguardar a promise antes de finalmente afirmar o resultado. Uma maneira mais fácil de estruturar isso é delegar toda a implementação a outro arquivo, que é testado com mais facilidade.

```js
import fetchHandler from './fetch_handler.js';
self.addEventListener('fetch', (evt) => evt.respondWith(fetchHandler(evt)));
```

Devido às dificuldades de testar a unidade de um script de service worker, mantivemos o script do service worker core o mais básico possível, dividindo a maior parte da implementação em outros módulos. Como esses arquivos eram apenas módulos JS padrão, eles poderiam ser mais facilmente testados em unidades com bibliotecas de teste padrão.

## Fique ligado nas partes 2 e 3 {: #stay-tuned }

Nas partes 2 e 3 desta série, falaremos sobre gerenciamento de mídia e problemas específicos do iOS. Se você quiser nos perguntar mais sobre a construção de um PWA no Google, visite nossos perfis de autor para saber como entrar em contato conosco:

- [Joel](/authors/joelriley)
- [Douglas](/authors/douglasparker)
- [Dikla](/authors/msdikla)
