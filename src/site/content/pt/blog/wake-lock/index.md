---
title: Fique acordado com a API Screen Wake Lock
subhead: A API Screen Wake Lock fornece uma maneira de evitar que os dispositivos escurecem ou bloqueiem a tela quando um aplicativo precisa continuar em execução.
authors:
  - petelepage
  - thomassteiner
description: Para evitar esgotar da bateria, a maioria dos dispositivos entra em descanso rapidamente quando fica ociosa. Embora isso seja normal na maioria das vezes, alguns aplicativos precisam manter a tela ativada para concluir algum trabalho. A API Screen Wake Lock fornece uma maneira de evitar que o dispositivo escureça ou bloqueie a tela quando um aplicativo precisa continuar em execução.
date: 2018-12-18
updated: 2021-02-23
hero: image/admin/zMncl9cgWdAc8W24yav3.jpg
hero_position: Centro
alt: |2

  Gato dormindo. Foto de Kate Stone Matheson no Unsplash.
tags:
  - blog
  - capabilities
feedback:
  - api
---

{% Aside 'success' %} A API Screen Wake Lock, parte do [projeto de recursos](https://developer.chrome.com/blog/capabilities/) do Google, lançada no Chrome 84. {% endAside %}

## O que é a API Screen Wake Lock? {: #what }

Para evitar esgotar a bateria, a maioria dos dispositivos adormece rapidamente quando fica ociosa. Embora isso seja normal na maioria das vezes, alguns aplicativos precisam manter a tela ativada para concluir seu trabalho. Os exemplos incluem aplicativos de culinária que mostram as etapas de uma receita ou um jogo como o [Ball Puzzle](https://ball-puzzle.appspot.com/), que usa as APIs de movimento do dispositivo para entrada.

A [API Screen Wake Lock](https://w3c.github.io/wake-lock/) fornece uma maneira de evitar que o dispositivo escureça e bloqueie a tela. Esse recurso permite novas experiências que, até agora, exigiam um aplicativo específico da plataforma.

A API Screen Wake Lock reduz a necessidade de soluções alternativas que consomem muita energia. Ele aborda as deficiências de uma API mais antiga que se limitava a simplesmente manter a tela ligada e tinha uma série de problemas de segurança e privacidade.

## Casos de uso sugeridos para a API Screen Wake Lock {: #use-cases}

O [RioRun](https://www.theguardian.com/sport/2016/aug/06/rio-running-app-marathon-course-riorun), um aplicativo da web desenvolvido pelo [The Guardian](https://www.theguardian.com/), era um caso de uso perfeito (embora não esteja mais disponível). O aplicativo leva você por um áudio tour virtual pelo Rio de Janeiro, acompanhando o percurso da maratona olímpica de 2016. Sem os wake locks, as telas dos usuários desligariam com frequência durante o tour, tornando-o difícil de usar.

Claro, há muitos outros casos de uso:

- Um aplicativo de receitas que mantém a tela ligada enquanto você assa um bolo ou prepara o jantar
- Um aplicativo de cartão de embarque ou bilhete que mantém a tela ligada até que o código de barras seja lido
- Um aplicativo estilo quiosque que mantém a tela continuamente
- Um aplicativo de apresentação baseado na web que mantém a tela ligada durante uma apresentação

{% Aside 'success' %} Depois de implementar a API Screen Wake Lock, *Betty Crocker*, um grande site de culinária dos EUA, observou um aumento de 300% nos indicadores de intenção de compra de seus usuários. Leia mais no [estudo de caso 🍰 Betty Crocker](/betty-crocker/). {% endAside %}

## Status atual {: #status}

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Degrau</th>
<th data-md-type="table_cell">Status</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crie um explicador</td>
<td data-md-type="table_cell">N / D</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crie o rascunho inicial das especificações</td>
<td data-md-type="table_cell"><a href="https://w3c.github.io/wake-lock/" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Reúna feedback e repita o design</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Teste de origem</td>
<td data-md-type="table_cell">Completo</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Lançamento</strong></td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">Completo</strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

{% Aside %} Muito obrigado ao pessoal da Intel, especificamente Mrunal Kapade e Raphael Kubo da Costa, por implementar esta API. O Chrome depende de uma comunidade de committers trabalhando juntos para levar o projeto Chromium adiante. Nem todo committer do Chromium é um Googler, e esses colaboradores merecem um reconhecimento especial! {% endAside %}

## Usando a API Screen Wake Lock {: #use}

### Tipos de wake lock {: #wake-lock-types}

A API Screen Wake Lock fornece atualmente apenas um tipo de wake lock: a `screen`.

#### `screen` wake lock

Um `screen` evita que a tela do dispositivo desligue para que o usuário possa ver as informações que são exibidas na tela.

{% Aside 'caution' %} Uma versão anterior da especificação permitia um `system` que evita que a CPU do dispositivo entre no modo de espera para que seu aplicativo possa continuar em execução. Decidimos não prosseguir com esse tipo no momento. {% endAside %}

### Detecção de recursos

O suporte do navegador para a API Screen Wake Lock pode ser testado da seguinte forma:

```js
if ('wakeLock' in navigator) {
  // Screen Wake Lock API supported 🎉
}
```

### Como obter um wake lock da tela {: #get-wake-lock}

Para solicitar um bloqueio de ativação da tela, você precisa chamar o `navigator.wakeLock.request()` que retorna um objeto `WakeLockSentinel` Você passa este método o tipo de wake lock desejado como um parâmetro, que *atualmente* é limitado apenas a `'screen'` e, portanto, é *opcional*. O navegador pode recusar a solicitação por vários motivos (por exemplo, porque o nível de carga da bateria está muito baixo), portanto, é uma boa prática encerrar a chamada em uma instrução `try…catch`. A mensagem de exceção conterá mais detalhes em caso de falha.

### Liberando um wake lock da tela {: #release-wake-lock}

Você também precisa de uma maneira de liberar o bloqueio de ativação da tela, que é obtido chamando o método `release()` do objeto `WakeLockSentinel`. Se você não armazenar uma referência ao `WakeLockSentinel`, não há como liberar o bloqueio manualmente, mas ele será liberado assim que a guia atual ficar invisível.

Se desejar liberar automaticamente o bloqueio de ativação da tela após um certo período de tempo, você pode usar `window.setTimeout()` para chamar `release()`, conforme mostrado no exemplo abaixo.

```js
// The wake lock sentinel.
let wakeLock = null;

// Function that attempts to request a screen wake lock.
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request();
    wakeLock.addEventListener('release', () => {
      console.log('Screen Wake Lock released:', wakeLock.released);
    });
    console.log('Screen Wake Lock released:', wakeLock.released);
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

// Request a screen wake lock…
await requestWakeLock();
// …and release it again after 5s.
window.setTimeout(() => {
  wakeLock.release();
  wakeLock = null;
}, 5000);
```

O `WakeLockSentinel` tem uma propriedade chamada `released` que indica se uma sentinela já foi liberada. Seu valor é inicialmente `false` e muda para `true` assim que um `"release"` é despachado. Esta propriedade ajuda os desenvolvedores da web a saber quando um bloqueio foi liberado, para que não precisem controlar isso manualmente. Ele está disponível a partir do Chrome 87.

### O ciclo de vida do wake lock da tela {: #wake-lock-lifecycle}

Ao jogar com a [demonstração do bloqueio de ativação](https://wake-lock-demo.glitch.me/) da tela, você notará que os bloqueios de ativação da tela são sensíveis à [visibilidade da página](https://developer.mozilla.org/docs/Web/API/Page_Visibility_API). Isso significa que o bloqueio de ativação da tela será liberado automaticamente quando você minimizar uma guia ou janela ou sair de uma guia ou janela onde um bloqueio de ativação da tela está ativo.

Para readquirir o bloqueio de ativação da tela, ouça o [`visibilitychange`](https://developer.mozilla.org/docs/Web/API/Document/visibilitychange_event) e solicite um novo bloqueio de ativação da tela quando eles ocorrerem:

```js
const handleVisibilityChange = async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
```

## Minimize o seu impacto nos recursos do sistema {: #melhores práticas}

Você deve usar um bloqueio de ativação de tela em seu aplicativo? A abordagem que você adota depende das necessidades do seu aplicativo. Independentemente disso, você deve usar a abordagem mais leve possível para seu aplicativo para minimizar seu impacto nos recursos do sistema.

Antes de adicionar um wake lock de tela ao seu aplicativo, considere se seus casos de uso podem ser resolvidos com uma das seguintes soluções alternativas:

- Se seu aplicativo estiver realizando downloads de longa duração, considere o uso de [busca em segundo plano](https://developer.chrome.com/blog/background-fetch/).
- Se seu aplicativo estiver sincronizando dados de um servidor externo, considere o uso de [sincronização em segundo plano](https://developer.chrome.com/blog/background-sync/).

{% Aside %} Como a maioria das outras APIs da web poderosas, a API Screen Wake Lock está disponível apenas quando servida por **HTTPS**. {% endAside %}

### Demo

Confira a [demonstração do Screen Wake Lock](https://wake-lock-demo.glitch.me/) e o [código-fonte da demonstração](https://wake-lock-demo.glitch.me/). Observe como o bloqueio de ativação da tela é liberado automaticamente quando você alterna entre guias ou aplicativos.

### Screen Wake Locks no gerenciador de tarefas do sistema operacional

Você pode usar o gerenciador de tarefas do sistema operacional para ver se um aplicativo está impedindo o computador de hibernar. O vídeo abaixo mostra o macOS [Activity Monitor](https://support.apple.com/guide/activity-monitor/welcome/mac) indicando que o Chrome tem um wake lock de tela ativo que mantém o sistema ativo.

{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/YDlxREcGrnBUGC8plN15.mp4", autplay="true", loop="true", width="800" %}

## Feedback {: #feedback}

O [Web Platform Incubator Community Group (WICG)](https://www.w3.org/community/wicg/) e a equipe do Chrome desejam saber mais sobre seus pensamentos e experiências com a API Screen Wake Lock.

### Conte-nos sobre o design da API

Existe algo na API que não funciona conforme o esperado? Ou faltam métodos ou propriedades de que você precisa para implementar sua ideia?

- Registre um problema de especificação no [repositório GitHub da API Screen Wake Lock](https://github.com/w3c/wake-lock/issues) ou adicione suas ideias a um problema existente.

### Comunicar um problema com a implementação

Você encontrou um bug na implementação do Chrome? Ou a implementação é diferente da especificação?

- Registre um bug em [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EWakeLock). Certifique-se de incluir o máximo de detalhes possível, fornecer instruções simples para reproduzir o bug e definir *Componentes* como `Blink>WakeLock`. O [Glitch](https://glitch.com) funciona muito bem para compartilhar reproduções rápidas e fáceis.

### Mostrar suporte para a API

Você está planejando usar a API Screen Wake Lock? Seu apoio público ajuda a equipe do Chrome a priorizar os recursos e mostra a outros fornecedores de navegadores como é fundamental apoiá-los.

- Compartilhe como você planeja usar a API no [thread do WICG Discourse](https://discourse.wicg.io/t/wake-lock-api-suppressing-power-management-screensavers/769).
- Envie um tweet para [@ChromiumDev](https://twitter.com/chromiumdev) usando a hashtag [`#WakeLock`](https://twitter.com/search?q=%23WakeLock&src=typed_query&f=live) e diga-nos onde e como você está usando a API.

## Links úteis {: #helpful}

- Especificação da [recomendação do candidato](https://www.w3.org/TR/wake-lock/) | [Rascunho do Editor](https://w3c.github.io/wake-lock/)
- [Demonstração do Screen Wake Lock](https://wake-lock-demo.glitch.me/) | [Código-fonte da demonstração do Screen Wake Lock](https://glitch.com/edit/#!/wake-lock-demo?path=script.js:1:0)
- [Bug de rastreamento](https://bugs.chromium.org/p/chromium/issues/detail?id=257511)
- [Entrada ChromeStatus.com](https://www.chromestatus.com/feature/4636879949398016)
- [Experimentando a API Wake Lock](https://medium.com/dev-channel/experimenting-with-the-wake-lock-api-b6f42e0a089f)
- Componente Blink: [`Blink>WakeLock`](https://chromestatus.com/features#component%3ABlink%3EWakeLock)

## Reconhecimentos

[Imagem do herói](https://unsplash.com/photos/uy5t-CJuIK4) por [Kate Stone Matheson](https://unsplash.com/@kstonematheson) no Unsplash. Vídeo do gerenciador de tarefas cortesia de [Henry Lim](https://twitter.com/henrylim96/status/1359914993399959559).
