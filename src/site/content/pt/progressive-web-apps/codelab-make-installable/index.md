---
layout: codelab
title: Torne-o instalável
authors:
  - petelepage
date: 2018-11-05
updated: 2021-02-12
description: |2

  Neste codelab, aprenda como tornar um site instalável usando o

  evento beforeinstallprompt.
glitch: make-it-installable?path=script.js
related_post: customize-install
tags:
  - progressive-web-apps
---

Esse glitch já contém os componentes críticos necessários para tornar instalável um Progressive Web App, incluindo um [service worker muito simples](https://glitch.com/edit/#!/make-it-installable?path=service-worker.js) e um [manifesto de aplicativo web](https://glitch.com/edit/#!/make-it-installable?path=manifest.json). Ele também possui um botão de instalação que está oculto por padrão.

## Fique à escuta do evento beforeinstallprompt

Quando o navegador dispara o `beforeinstallprompt`, é a indicação de que o Progressive Web App pode ser instalado e um botão de instalação pode ser mostrado ao usuário. O `beforeinstallprompt` é disparado quando o PWA atender [aos critérios de](/install-criteria/) instalabilidade.

{% Instruction 'remix', 'ol' %}

1. Adicione um manipulador de eventos `beforeinstallprompt` ao objeto `window`
2. Salve o `event` como uma variável global; vamos precisar dele mais tarde para mostrar o prompt.
3. Exiba o botão de instalação.

Código:

```js
window.addEventListener('beforeinstallprompt', (event) => {
  // Impedir que o mini-infobar apareça no celular.
  event.preventDefault();
  console.log('👍', 'beforeinstallprompt', event);
  // Esconder o evento para que possa ser acionado mais tarde.
  window.deferredPrompt = event;
  // Remover a classe 'oculta' do contêiner do botão de instalação.
  divInstall.classList.toggle('hidden', false);
});
```

## Tratar o clique do botão de instalação

Para mostrar o prompt de instalação, chame `prompt()` no evento `beforeinstallprompt` Chamar `prompt()` é feito no manipulador de clique do botão de instalação porque `prompt()` deve ser chamado a partir de um gesto do usuário.

1. Adicione um manipulador de eventos de clique para o botão de instalação.
2. Call `prompt()` no evento `beforeinstallprompt`
3. Registre os resultados do prompt.
4. Defina o `beforeinstallprompt` salvo como null.
5. Oculte o botão de instalação.

Código:

```js
butInstall.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked');
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // The deferred prompt isn't available.
    return;
  }
  // Show the install prompt.
  promptEvent.prompt();
  // Log the result
  const result = await promptEvent.userChoice;
  console.log('👍', 'userChoice', result);
  // Reset the deferred prompt variable, since
  // prompt() can only be called once.
  window.deferredPrompt = null;
  // Hide the install button.
  divInstall.classList.toggle('hidden', true);
});
```

## Acompanhe o evento de instalação

Instalar um Progressive Web App por meio de um botão de instalação é apenas uma maneira de os usuários instalarem um PWA. Eles também podem usar o menu do Chrome, a minibarra de informações e através de [um ícone na caixa geral](/promote-install/#browser-promotion) . Você pode acompanhar todas essas formas de instalação escutando o evento `appinstalled`

1. Adicione um manipulador de eventos `appinstalled` ao objeto de `window`
2. Registre o evento de instalação em análises ou outro mecanismo.

Código:

```js
window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);
  // Limpa o deferredPrompt para que possa ser coletado como lixo
  window.deferredPrompt = null;
});
```

## Leitura adicional

Parabéns, seu aplicativo agora pode ser instalado!

Aqui estão mais coisas que você pode fazer:

- [Detecte se seu aplicativo é iniciado na tela inicial](/customize-install/#detect-mode)
- [Mostrar em vez disso o prompt de instalação do aplicativo do sistema operacional](https://developer.chrome.com/blog/app-install-banners-native/)
