---
title: Detecte usuários inativos com a Idle Detection API
subhead: Use a Idle Detection API para descobrir quando o usuário não está usando ativamente o dispositivo.
authors:
  - thomassteiner
description: |2

  A Idle Detection API notifica os desenvolvedores quando um usuário está inativo, indicando coisas como a falta de

  interação com o teclado, mouse, tela, ativação de um protetor de tela, bloqueio da tela,

  ou passando para uma tela diferente. Um limite definido pelo desenvolvedor aciona a notificação.
date: 2020-05-18
updated: 2021-08-25
tags:
  - blog
  - capabilities
hero: image/admin/FXoKxeVCmPgEStieWKm2.jpg
alt: Computador abandonado em uma cama com a perna de alguém ao lado.
feedback:
  - api
---

## O que é a Idle Detection API? {: #what }

A Idle Detection API notifica os desenvolvedores quando um usuário está inativo, indicando coisas como falta de interação com o teclado, mouse, tela, ativação de um protetor de tela, bloqueio da tela ou movimentação para uma tela diferente. Um limite definido pelo desenvolvedor aciona a notificação.

### Casos de uso sugeridos para a Idle Detection API {: #use-cases}

Exemplos de sites que podem usar esta API incluem:

- Aplicativos de bate-papo ou sites de redes sociais online podem usar essa API para permitir que o usuário saiba se seus contatos estão acessíveis no momento.
- Aplicativos de quiosque expostos publicamente, por exemplo em museus, podem usar essa API para retornar à visualização "inicial" se ninguém mais interagir com o quiosque.
- Aplicativos que exigem cálculos caros, por exemplo, para desenhar gráficos, podem limitar esses cálculos aos momentos em que o usuário interage com seu dispositivo.

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
<td data-md-type="table_cell"><a href="https://github.com/wicg/idle-detection/blob/master/README.md" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crie o rascunho inicial das especificações</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/idle-detection" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Reúna feedback e repita o design</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">Em andamento</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Teste de origem</td>
<td data-md-type="table_cell">Concluído</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. <strong data-md-type="double_emphasis">Lançamento</strong>
</td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">Chromium 94</strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Como usar a Idle Detection API {: #use}

### Detecção de recursos

Para verificar se a Idle Detection API é compatível, use:

```javascript
if ('IdleDetector' in window) {
  // Idle Detector API suportada
}
```

### Conceitos da Idle Detection API

A Idle Detection API pressupõe que haja algum nível de envolvimento entre o usuário, o agente do usuário (ou seja, o navegador) e o sistema operacional do dispositivo em uso. Isso é representado em duas dimensões:

- **O estado inativo do usuário:** `active` ou `idle` : o usuário interagiu ou não com o agente do usuário por algum tempo.
- **O estado de tela ociosa:** `locked` ou `unlocked` : o sistema possui um bloqueio de tela ativo (como um protetor de tela) impedindo a interação com o agente do usuário.

Distinguir `active` de `idle` requer heurísticas que podem diferir entre usuário, agente de usuário e sistema operacional. Também deve ser um limite razoavelmente grosseiro (consulte [Segurança e Permissões](#security-and-permissions) ).

O modelo intencionalmente não distingue formalmente entre a interação com um conteúdo específico (ou seja, a página da web em uma guia usando a API), o agente do usuário como um todo ou o sistema operacional; esta definição é deixada para o agente do usuário.

### Usando a Idle Detection API

A primeira etapa ao usar a API de detecção de inatividade é garantir que a `'idle-detection'` seja concedida. Se a permissão não for concedida, você precisa solicitá-la por meio de `IdleDetector.requestPermission()` . Observe que chamar este método requer um gesto do usuário.

```js
// Certifique-se de que a permissão 'idle-detection' seja concedida.
const state = await IdleDetector.requestPermission();
if (state !== 'granted') {
  // Precisa solicitar permissão primeiro.
  return console.log('Idle detection permission not granted.');
}
```

{% Aside %} Inicialmente, a detecção de inatividade foi bloqueada pela permissão de notificações. Embora muitos, mas não todos, os casos de uso dessa API envolvam notificações, os editores de especificações de detecção de ociosidade decidiram protegê-la com uma permissão de detecção de ociosidade dedicada. {% endAside %}

A segunda etapa é instanciar o `IdleDetector`. O `threshold` mínimo é 60.000 milissegundos (1 minuto). Você pode finalmente iniciar a detecção de inatividade chamando o  método `start()` do `IdleDetector`. Isto leva um objeto com o `threshold` de inatividade desejado em milissegundos e um `signal` opcional com um [`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal), para abortar a detecção de inatividade, como parâmetros.

```js
try {
  const controller = new AbortController();
  const signal = controller.signal;

  const idleDetector = new IdleDetector();
  idleDetector.addEventListener('change', () => {
    const userState = idleDetector.userState;
    const screenState = idleDetector.screenState;
    console.log(`Idle change: ${userState}, ${screenState}.`);
  });

  await idleDetector.start({
    threshold: 60000,
    signal,
  });
  console.log('IdleDetector is active.');
} catch (err) {
  // Lidar com erros de inicialização como permissão negada,
  // funcionando fora do frame de nível superior, etc.
  console.error(err.name, err.message);
}
```

Você pode abortar a detecção de inatividade chamando o método [`abort()`](https://developer.mozilla.org/docs/Web/API/AbortController/abort) do [`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController).

```js
controller.abort();
console.log('IdleDetector is stopped.');
```

### Suporte para DevTools

A partir do Chromium 94, você pode emular eventos ociosos no DevTools sem realmente ficar ocioso. Em DevTools, abra a **guia Sensores** e procure o **Emular estado de Detector Inativo**. Você pode ver as várias opções no vídeo abaixo.

<figure>{% Video src = "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/2OEuuTRnBdDoxARFejNN.mp4", controls = true, autoplay = true, loop = true, muted = true, playsinline = true%}<figcaption> Emulação de estado de detector inativo no DevTools.</figcaption></figure>

### Suporte para Puppeteer

A partir da versão 5.3.1 do Puppeteer, você pode [emular os vários estados inativos](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pageemulateidlestateoverrides) para testar programaticamente como o comportamento do seu aplicativo da web muda.

### Demo

Você pode ver a Idle Detection API em ação com a [demonstração do Ephemeral Canvas](https://idle-detection.glitch.me/) que apaga seu conteúdo após 60 segundos de inatividade. Você pode imaginar isso sendo implantado em uma loja de departamentos para as crianças rabiscarem.

{% Img src="image/admin/n0ysuaHUCcrRRf4b7pU0.png", alt="demonstração do Ephemeral Canvas", width="800", height="953" %}

### Polyfilling

Alguns aspectos da API de detecção de ociosidade são polyfillable e [existem bibliotecas de detecção de ociosidade como idle.ts](https://github.com/dropbox/idle.ts), mas essas abordagens são restritas à área de conteúdo do próprio aplicativo da web: A biblioteca em execução no contexto do aplicativo da web precisa pesquisar eventos de entrada de maneira cara ou escutar as mudanças de visibilidade. Mais restritivamente, porém, as bibliotecas não podem dizer, hoje, quando um usuário fica inativo fora de sua área de conteúdo (por exemplo, quando um usuário está em uma guia diferente ou totalmente desconectado de seu computador).

## Segurança e permissões {: #security-and-permissions}

A equipe do Chrome projetou e implementou a Idle Detection API usando os princípios básicos definidos em [Controle de Acesso a Recursos Poderosos da Plataforma da Web](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md) , incluindo controle do usuário, transparência e ergonomia. A capacidade de usar esta API é controlada pela [permissão `'idle-detection'`](https://w3c.github.io/permissions/#permission-registry). Para usar a API, um aplicativo também deve ser executado em um [contexto seguro de nível superior](https://www.w3.org/TR/secure-contexts/#examples-top-level) .

### Controle do usuário e privacidade

Sempre queremos evitar que agentes mal-intencionados façam mau uso de novas APIs. Sites aparentemente independentes, mas que na verdade são controlados pela mesma entidade, podem obter informações ociosas do usuário e correlacionar os dados para identificar usuários únicos nas origens. Para mitigar esse tipo de ataque, a Idle Detection API limita a granularidade dos eventos de inatividade relatados.

## Feedback {: #feedback}

A equipe do Chrome quer ouvir sobre suas experiências com a Idle Detection API.

### Conte-nos sobre o design da API

Existe algo na API que não funciona como você esperava? Ou faltam métodos ou propriedades de que você precisa para implementar sua ideia? Tem uma pergunta ou comentário sobre o modelo de segurança? Registre um problema de especificação no [repositório GitHub](https://github.com/samuelgoto/idle-detection/issues) correspondente ou adicione suas ideias a um problema existente.

### Comunicar um problema com a implementação

Você encontrou um bug na implementação do Chrome? Ou a implementação é diferente da especificação? Registre um bug em [new.crbug.com](https://new.crbug.com). Certifique-se de incluir o máximo de detalhes que puder, instruções simples para reproduzir e insira `Blink>Input` na caixa **Componentes.** [Glitch](https://glitch.com/) funciona muito bem para compartilhar reproduções rápidas e fáceis.

### Mostrar suporte para a API

Você está planejando usar a Idle Detection API? Seu suporte público ajuda a equipe do Chrome a priorizar os recursos e mostra a outros fornecedores de navegadores como é fundamental apoiá-los.

- Compartilhe como você planeja usá-lo no [tópico do discurso do WICG](https://discourse.wicg.io/t/idle-detection-api/2959).
- Envie um tweet para [@ChromiumDev](https://twitter.com/ChromiumDev) usando a hashtag[`#IdleDetection`](https://twitter.com/search?q=%23IdleDetection&src=typed_query&f=live) e diga-nos onde e como você está usando.

## Links úteis {: #helpful}

- [Explicador público](https://github.com/wicg/idle-detection/blob/master/README.md)
- [Rascunho de especificação](https://wicg.github.io/idle-detection)
-  [Demonstração da Idle Detection API](https://idle-detection.glitch.me/) | [Fonte de demonstração da Idle Detection API](https://glitch.com/edit/#!/idle-detection)
- [Bug de rastreamento](https://crbug.com/878979)
- [Entrada ChromeStatus.com](https://chromestatus.com/feature/4590256452009984)
- Componente Blink: [`Blink>Input`](https://chromestatus.com/features#component%3ABlink%3EInput)

## Reconhecimentos

A Idle Detection API foi implementada por [Sam Goto](https://twitter.com/samuelgoto) . Suporte para DevTools foi adicionado por [Maksim Sadym](https://www.linkedin.com/in/sadym/) . Agradecimentos a [Joe Medley](https://github.com/jpmedley) , [Kayce Basques](https://github.com/kaycebasques) e [Reilly Grant](https://github.com/reillyeon) por suas revisões deste artigo. A imagem do herói é de [Fernando Hernandez](https://unsplash.com/@_ferh97) no [Unsplash](https://unsplash.com/photos/8Facxtxqojc) .
