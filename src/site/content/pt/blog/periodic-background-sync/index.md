---
layout: post
title: Experiências offline mais ricas com a API Periodic Background Sync
subhead: Sincronize os dados do seu aplicativo da web em segundo plano para uma experiência mais parecida
authors:
  - jeffposnick
  - joemedley
date: 2019-11-10
updated: 2020-08-18
hero: image/admin/Bz7MndcsUGPLAnQwIMfJ.jpg
alt: Aviões coloridos voando em sincronia
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/4048736065006075905"
description: |2

  A sincronização periódica em segundo plano permite que os aplicativos da web periodicamente

  sincronizar dados em segundo plano, aproximando os aplicativos da web do comportamento

  de um aplicativo iOS / Android / desktop.
tags:
  - capabilities
  - blog
  - progressive-web-apps
  - service-worker
  - chrome-80
feedback:
  - api
---

{% Aside %} Os aplicativos da web devem ser capazes de fazer tudo que os aplicativos iOS/Android/desktop conseguem. O [projeto Capabilities](https://developer.chrome.com/blog/capabilities/) , do qual Periodic Background Sync é apenas uma parte, visa fazer exatamente isso. Para aprender sobre outros recursos e acompanhar seu progresso, siga [Desbloqueando novos recursos para a web](https://developer.chrome.com/blog/capabilities/) . {% endAside %}

Você já esteve em alguma das seguintes situações?

- Andar de trem ou metrô com conectividade instável ou sem conectividade
- Foi estrangulado pela sua operadora depois de assistir a muitos vídeos
- Morar em um país onde a largura de banda apresenta obstáculos para atender à demanda

Se sim, então você certamente sentiu a frustração de fazer certas coisas na web e se perguntou por que aplicativos específicos de plataforma costumam se sair melhor nesses cenários. Aplicativos específicos de plataforma podem buscar conteúdo novo, como artigos de notícias ou informações meteorológicas com antecedência. Mesmo que não haja rede no metrô, você ainda pode ler as notícias.

A Sincronização periódica em segundo plano permite que os aplicativos da web sincronizem periodicamente os dados em segundo plano, aproximando os aplicativos da web do comportamento de um aplicativo específico da plataforma.

## Status atual

A tabela abaixo explica o status atual da API Periodic Background Sync.

<table>
<tr>
<th markdown="block">Etapa</th>
<th markdown="block">Status</th>
</tr>
<tr>
<td markdown="block">1. Crie um explicador</td>
<td markdown="block"><a href="https://github.com/WICG/BackgroundSync/tree/master/explainers">Completo</a></td>
</tr>
<tr>
<td markdown="block">2. Crie o rascunho inicial das especificações</td>
<td markdown="block"><a href="https://wicg.github.io/periodic-background-sync/" rel="noopener">Completo</a></td>
</tr>
<tr>
<td markdown="block">3. Reúna feedback e repita o design</td>
<td markdown="block">Em progresso</td>
</tr>
<tr>
<td markdown="block">4. Teste de origem</td>
<td markdown="block">Completo</td>
</tr>
<tr>
<td markdown="block"><strong>5. Lançamento</strong></td>
<td markdown="block"><strong>Chrome 80</strong></td>
</tr>
</table>

## Tente

Você pode tentar a sincronização periódica em segundo plano com o [aplicativo de demonstração ao vivo](https://webplatformapis.com/periodic_sync/periodicSync_improved.html). Antes de usá-lo, certifique-se de que:

- Você está usando o Chrome 80 ou posterior.
- Você [instalou](https://developers.google.com/web/fundamentals/app-install-banners/) o aplicativo da web antes de habilitar a sincronização periódica em segundo plano.

## Conceitos e uso

A sincronização periódica em segundo plano permite que você mostre conteúdo novo quando um aplicativo da web progressivo ou página apoiada pelo service worker é iniciado. Ele faz isso baixando dados em segundo plano quando o aplicativo ou página não está sendo usado. Isso evita que o conteúdo do aplicativo seja atualizado após o lançamento enquanto está sendo visualizado. Melhor ainda, evita que o aplicativo mostre um botão giratório de conteúdo antes de atualizar.

Sem a sincronização periódica em segundo plano, os aplicativos da web devem usar métodos alternativos para baixar dados. Um exemplo comum é usar uma notificação push para despertar um service worker. O usuário é interrompido por uma mensagem como 'novos dados disponíveis'. Atualizar os dados é essencialmente um efeito colateral. Você ainda tem a opção de usar notificações push para atualizações realmente importantes, como notícias de última hora significativas.

A sincronização periódica em segundo plano é facilmente confundida com a sincronização em segundo plano. Embora tenham nomes semelhantes, seus casos de uso são diferentes. Entre outras coisas, a sincronização em segundo plano é mais comumente usada para reenviar dados a um servidor quando uma solicitação anterior falha.

### Conseguir o engajamento do usuário da maneira certa

Feito incorretamente, a sincronização periódica em segundo plano pode ser um desperdício de recursos dos usuários. Antes de lançá-lo, o Chrome o colocou em um período de teste para se certificar de que estava certo. Esta seção explica algumas das decisões de design que o Chrome tomou para tornar esse recurso o mais útil possível.

A primeira decisão de design que o Chrome fez é que um aplicativo da web só pode usar a sincronização periódica em segundo plano depois que uma pessoa o instala em seu dispositivo e o abre como um aplicativo distinto. A sincronização periódica em segundo plano não está disponível no contexto de uma guia normal no Chrome.

Além disso, uma vez que o Chrome não quer que aplicativos da web não usados ou raramente usados consumam gratuitamente bateria ou dados, o Chrome projetou uma sincronização periódica em segundo plano de modo que os desenvolvedores terão que obtê-la fornecendo valor aos seus usuários. Concretamente, o Chrome está usando uma [pontuação de engajamento do site](https://www.chromium.org/developers/design-documents/site-engagement) ( `about://site-engagement/` ) para determinar se e com que frequência as sincronizações periódicas de segundo plano podem acontecer para um determinado aplicativo da web. Em outras palavras, um `periodicsync` não será disparado, a menos que a pontuação de engajamento seja maior que zero e seu valor afete a frequência com que o `periodicsync` disparado. Isso garante que os únicos aplicativos sincronizados em segundo plano sejam aqueles que você está usando ativamente.

A sincronização periódica em segundo plano compartilha algumas semelhanças com APIs e práticas existentes em plataformas populares. Por exemplo, a sincronização única em segundo plano, bem como notificações push, permitem que a lógica de um aplicativo da web viva um pouco mais (por meio de seu service worker) depois que uma pessoa fecha a página. Na maioria das plataformas, é comum que as pessoas instalem aplicativos que acessam periodicamente a rede em segundo plano para fornecer uma melhor experiência do usuário para atualizações críticas, pré-busca de conteúdo, sincronização de dados e assim por diante. Da mesma forma, a sincronização periódica em segundo plano também estende a vida útil da lógica de um aplicativo da web para ser executado em períodos regulares por alguns minutos.

Se o navegador permitir que isso ocorra com frequência e sem restrições, isso pode resultar em algumas questões de privacidade. Veja como o Chrome abordou esse risco de sincronização periódica em segundo plano:

- A atividade de sincronização em segundo plano ocorre apenas em uma rede à qual o dispositivo já se conectou. O Chrome recomenda conectar-se apenas a redes operadas por partes confiáveis.
- Como acontece com todas as comunicações pela Internet, a sincronização periódica em segundo plano revela os endereços IP do cliente, o servidor com o qual está se comunicando e o nome do servidor. Para reduzir essa exposição a aproximadamente o que seria se o aplicativo sincronizasse apenas quando estivesse em primeiro plano, o navegador limita a frequência das sincronizações de plano de fundo de um aplicativo para se alinhar com a frequência com que a pessoa o usa. Se a pessoa parar de interagir com frequência com o aplicativo, a sincronização periódica em segundo plano deixará de ser acionada. Esta é uma melhoria líquida em relação ao status quo em aplicativos específicos da plataforma.

### Quando pode ser usado?

As regras de uso variam de acordo com o navegador. Resumindo, o Chrome coloca os seguintes requisitos na sincronização periódica em segundo plano:

- Uma pontuação específica de engajamento do usuário.
- Presença de rede utilizada anteriormente.

O tempo das sincronizações não é controlado pelos desenvolvedores. A frequência de sincronização será alinhada com a frequência com que o aplicativo é usado. (Observe que os aplicativos específicos da plataforma atualmente não fazem isso.) Isso também leva ao estado de energia e conectividade do dispositivo.

### Quando deve ser usado?

Quando seu service worker acorda para lidar com um `periodicsync` , você tem a *oportunidade* de solicitar dados, mas não a *obrigação* de fazê-lo. Ao lidar com o evento, você deve levar em consideração as condições da rede e o armazenamento disponível e fazer o download de diferentes quantidades de dados em resposta. Você pode usar os seguintes recursos para ajudar:

- [API de informações de rede](https://developer.mozilla.org/docs/Web/API/Network_Information_API)
- [Detectando o modo de economia de dados](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data/#detecting_the_save-data_setting)
- [Estimando o armazenamento disponível](https://developers.google.com/web/updates/2017/08/estimating-available-storage-space)

### Permissões

Depois que o service worker estiver instalado, use a [API de permissões](https://developer.mozilla.org/docs/Web/API/Permissions_API) para consultar a `periodic-background-sync` . Você pode fazer isso a partir de uma janela ou de um contexto de service worker.

```js
const status = await navigator.permissions.query({
  name: 'periodic-background-sync',
});
if (status.state === 'granted') {
  // Periodic background sync can be used.
} else {
  // Periodic background sync cannot be used.
}
```

### Registrando uma sincronização periódica

Como já declarado, a sincronização periódica em segundo plano requer um service worker. Recupere um `PeriodicSyncManager` usando `ServiceWorkerRegistration.periodicSync` e chame `register()` nele. O registro requer um tag e um intervalo mínimo de sincronização ( `minInterval` ). A tag identifica a sincronização registrada para que várias sincronizações possam ser registradas. No exemplo abaixo, o nome da tag é `'content-sync'` e o `minInterval` é um dia.

```js/3-5
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  try {
    await registration.periodicSync.register('content-sync', {
      // An interval of one day.
      minInterval: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    // Periodic background sync cannot be used.
  }
}
```

### Verificando um registro

Chame `periodicSync.getTags()` para recuperar uma matriz de marcas de registro. O exemplo abaixo usa nomes de tag para confirmar que a atualização do cache está ativa para evitar a atualização novamente.

```js/2,4
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  const tags = await registration.periodicSync.getTags();
  // Only update content if sync isn't set up.
  if (!tags.includes('content-sync')) {
    updateContentOnPageLoad();
  }
} else {
  // If periodic background sync isn't supported, always update.
  updateContentOnPageLoad();
}
```

Você também pode usar `getTags()` para mostrar uma lista de registros ativos na página de configurações do seu aplicativo da web para que os usuários possam habilitar ou desabilitar tipos específicos de atualizações.

### Respondendo a um evento periódico de sincronização em segundo plano

Para responder a um evento periódico de sincronização em segundo plano, adicione um `periodicsync` ao seu service worker. O `event` passado a ele conterá um `tag` correspondente ao valor usado durante o registro. Por exemplo, se uma sincronização periódica em segundo plano foi registrada com o nome `'content-sync'` , então `event.tag` será `'content-sync'` .

```js
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    // See the "Think before you sync" section for
    // checks you could perform before syncing.
    event.waitUntil(syncContent());
  }
  // Other logic for different tags as needed.
});
```

### Cancelando o registro de uma sincronização

Para encerrar uma sincronização registrada, chame `periodicSync.unregister()` com o nome da sincronização que deseja cancelar.

```js
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  await registration.periodicSync.unregister('content-sync');
}
```

## Interfaces

Aqui está um resumo rápido das interfaces fornecidas pela API Periodic Background Sync.

- `PeriodicSyncEvent` . Passado para o `ServiceWorkerGlobalScope.onperiodicsync` em um momento de escolha do navegador.
- `PeriodicSyncManager` . Registra e cancela o registro de sincronizações periódicas e fornece tags para sincronizações registradas. Recupere uma instância desta classe da propriedade ServiceWorkerRegistration.periodicSync`.
- `ServiceWorkerGlobalScope.onperiodicsync` . Registra um manipulador para receber o `PeriodicSyncEvent` .
- `ServiceWorkerRegistration.periodicSync` . Retorna uma referência ao `PeriodicSyncManager` .

## Exemplo

### Atualizando conteúdo

O exemplo a seguir usa sincronização periódica em segundo plano para baixar e armazenar em cache artigos atualizados para um site de notícias ou blog. Observe o nome da tag, que indica o tipo de sincronização ( `'update-articles'` ). A chamada para `updateArticles()` é `event.waitUntil()` para que o service worker não seja encerrado antes que os artigos sejam baixados e armazenados.

```js/7
async function updateArticles() {
  const articlesCache = await caches.open('articles');
  await articlesCache.add('/api/articles');
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-articles') {
    event.waitUntil(updateArticles());
  }
});
```

### Adicionar sincronização periódica em segundo plano a um aplicativo da web existente

[Este conjunto de alterações](https://github.com/GoogleChromeLabs/so-pwa/pull/11) foi necessário para adicionar sincronização periódica em segundo plano a um [PWA existente](https://so-pwa.firebaseapp.com/) . Este exemplo inclui várias declarações de registro úteis que descrevem o estado de sincronização periódica em segundo plano no aplicativo da web.

## Depurando

Pode ser um desafio obter uma visão ponta a ponta da sincronização periódica em segundo plano durante o teste local. Informações sobre registros ativos, intervalos de sincronização aproximados e logs de eventos de sincronização anteriores fornecem um contexto valioso ao depurar o comportamento do seu aplicativo da web. Felizmente, você pode encontrar todas essas informações por meio de um recurso experimental no Chrome DevTools.

{% Aside %} A depuração periódica da sincronização em segundo plano está ativada no Chrome 81 e posterior. {% endAside %}

### Gravando atividade local

A **seção Sincronização periódica em segundo plano** do DevTools é organizada em torno dos principais eventos do ciclo de vida da sincronização periódica em segundo plano: registrar para sincronização, executar uma sincronização em segundo plano e cancelar o registro. Para obter informações sobre esses eventos, clique em **Iniciar gravação** .

<figure>{% Img src = "image/admin/wcl5Bm6Pe9xn5Dps6IN6.png", alt = "O botão de gravação em DevTools", width = "708", height = "90" %}<figcaption> O botão de gravação no DevTools</figcaption></figure>

Durante a gravação, as entradas aparecerão no DevTools correspondentes aos eventos, com contexto e metadados registrados para cada um.

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/m92Art0OwiM0VyI7czFB.png", alt = "Um exemplo de dados de sincronização periódica de fundo gravados", width = "800", height = "357", style = "max-width: 75%"%}<figcaption> Um exemplo de dados de sincronização periódica em segundo plano registrados</figcaption></figure>

Depois de habilitar a gravação uma vez, ela permanecerá habilitada por até três dias, permitindo que o DevTools capture informações de depuração local sobre sincronizações em segundo plano que podem ocorrer, mesmo em horas no futuro.

### Simulando eventos

Embora a gravação da atividade em segundo plano possa ser útil, há momentos em que você deseja testar seu `periodicsync` imediatamente, sem esperar que um evento seja disparado em sua cadência normal.

Você pode fazer isso por meio da **seção Service Workers** no painel Application no Chrome DevTools. O **campo Periódica Sincronização** permite fornecer uma tag para o evento usar e acioná-lo quantas vezes desejar.

{% Aside %} O acionamento manual de um `periodicsync` requer o Chrome 81 ou posterior. {% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BQ5QdjwaRDP42cHqW98W.png", alt="A seção 'Service Workers' do painel Application mostra um campo de texto e botão 'Periodic Sync'.", width="800", height=" 321 ", style="max-width: 75%"%}</figure>

## Usando a interface DevTools

A partir do Chrome 81, você verá uma seção **Periodic Background Sync** no painel do *aplicativo DevTools.*

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eYJtJfZ9Qo145lUQe4Ur.png", alt="O painel do aplicativo mostrando a seção de sincronização periódica de fundo", width="382", height="253", style="max-width: 90%"%}</figure>
