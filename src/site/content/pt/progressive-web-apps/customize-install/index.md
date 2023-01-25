---
layout: post
title: Como fornecer sua própria experiência de instalação in-app
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: Use o evento beforeinstallprompt para fornecer uma experiência de instalação in-app personalizada, simples e eficiente para seus usuários.
tags:
  - progressive-web-apps
---

Muitos navegadores possibilitam que você ative e promova a instalação do seu Progressive Web App (PWA) diretamente a partir da própria interface do usuário do seu PWA. A instalação (às vezes conhecida como "Adicionar à tela inicial") torna mais fácil para os usuários instalarem seu PWA em seus dispositivos móveis ou desktop. A instalação de um PWA adiciona-o ao inicializador do usuário, permitindo que seja executado como qualquer outra aplicação instalada.

Além da [experiência de instalação proporcionada pelo navegador](/promote-install/#browser-promotion), é possível fornecer seu próprio processo de instalação personalizado, diretamente a partir da sua aplicação.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SW3unIBfyMRTZNK0DRIw.png", alt="Botão Instalar aplicativo fornecido no Spotify PWA", width="491", height="550" %} <figcaption> Botão "Instalar aplicativo" fornecido no Spotify PWA </figcaption></figure>

Ao considerar se deve ou não promover a instalação, é melhor pensar em como os usuários normalmente usam seu PWA. Por exemplo, se houver um conjunto de usuários que usam seu PWA muitas vezes por semana, esses usuários poderão se beneficiar com a conveniência adicional de iniciar seu aplicativo a partir da tela inicial de um smartphone ou do menu Iniciar de um sistema operacional de desktop. Alguns aplicativos de produtividade e entretenimento também se beneficiam do espaço extra da tela criado pela remoção das barras de ferramentas do navegador da janela nos modos `standalone` ou `minimal-ui`

<div class="w-clearfix"></div>

## Promovendo a instalação {: #promote-installation}

Para indicar que seu Progressive Web App é instalável e para fornecer um processo de instalação in-app personalizado:

1. Escute o evento `beforeinstallprompt`
2. Salve o evento `beforeinstallprompt`, para que ele possa ser usado para disparar o processo de instalação posteriormente.
3. Avise ao usuário de que seu PWA pode ser instalado e forneça um botão ou outro elemento para iniciar o processo de instalação no aplicativo.

{% Aside %} O evento `beforeinstallprompt` e o evento `appinstalled` foram transferidos da especificação do manifesto web app para sua própria [incubadora](https://github.com/WICG/beforeinstallprompt). A equipe do Chrome continua comprometida em apoiá-los e não tem planos de remover ou suspender seu uso. A equipe Web DevRel do Google continua recomendando seu uso para proporcionar uma experiência de instalação personalizada. {% endAside %}

### Escute o `beforeinstallprompt` {: #beforeinstallprompt}

Se seu Progressive Web App atender aos [critérios de instalação](/install-criteria/) necessários, o navegador disparará um evento `beforeinstallprompt`. Salve uma referência ao evento e atualize sua interface de usuário para indicar que o usuário pode instalar seu PWA. Isso está destacado abaixo.

```js
// Inicialize o deferredPrompt para posteriormente mostrar o prompt de instalação do navegador.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Impede que o mini-infobar apareça em mobile
  e.preventDefault();
  // Guarda evento para que possa ser disparado depois.
  deferredPrompt = e;
  // Atualiza UI notifica usuário que pode instalar PWA
  showInstallPromotion();
  // Opcionalmente, enviar eventos de analytics que promo de instalação PWA foi mostrado.
  console.log(`'beforeinstallprompt' event was fired.`);
});
```

{% Aside %} Existem diversos [padrões](/promote-install/) diferentes que você pode usar para notificar o usuário de que sua aplicação pode ser instalada e fornecer um processo de instalação na aplicação, por exemplo, um botão no cabeçalho, um item no menu de navegação ou um item em seu feed de conteúdo. {% endAside %}

### Processo de instalação in-app {: #in-app-flow}

Para fornecer uma instalação in-app, forneça um botão ou outro elemento de interface no qual um usuário possa clicar para instalar sua aplicação. Quando o elemento for clicado, chame `prompt()` no evento `beforeinstallprompt` salvo (armazenado na `deferredPrompt`). Ele mostra ao usuário uma caixa de diálogo de instalação modal, solicitando a confirmação de que deseja instalar o PWA.

```js
buttonInstall.addEventListener('click', async () => {
  // Esconde a promoção de instalação fornecida pelo app
  hideInstallPromotion();
  // Mostra prompt de instalação
  deferredPrompt.prompt();
  // Espera usuário responder ao prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Opcionalmente, enviar evento analytics com resultado da escolha do usuário
  console.log(`User response to the install prompt: ${outcome}`);
  // Usamos o prompt e não podemos usar de novo; jogue fora
  deferredPrompt = null;
});
```

A propriedade `userChoice` é uma promessa que se resolve com a escolha do usuário. Você só pode chamar `prompt()` no evento adiado uma única vez. Se o usuário dispensá-lo, você precisará esperar até que o `beforeinstallprompt` seja disparado novamente. Isto ocorre geralmente logo após a resolução da propriedade `userChoice`.

{% Aside 'codelab' %} [Torne um site instalável usando o evento beforeinstallprompt](/codelab-make-installable). {% endAside %}

## Detecte quando o PWA foi instalado com sucesso {: #detect-install }

Você pode usar a propriedade `userChoice` para determinar se o usuário instalou sua aplicação a partir da sua interface de usuário. Mas, se o usuário instalar seu PWA a partir da barra de endereços ou outro componente do navegador, a propriedade `userChoice` não ajudará. Em vez disso, você precisa escutar o evento `appinstalled`. Ele é disparado sempre que o PWA é instalado, independentemente do mecanismo usado para instalá-lo.

```js
window.addEventListener('appinstalled', () => {
  // Esconder a promoção de instalação fornecida pela app
  hideInstallPromotion();
  // Limpar o deferredPrompt para que seja coletado
  deferredPrompt = null;
  // Opcionalmente, enviar evento de analytics para indicar instalação com sucesso
  console.log('PWA was installed');
});
```

## Detecte como o PWA foi iniciado {: #detect-launch-type }

A media query CSS `display-mode` indica como o PWA foi iniciado, em uma aba do navegador ou como um PWA instalado. Isto permite aplicar estilos diferentes, dependendo de como o aplicativo foi iniciado. Por exemplo, sempre oculte o botão de instalação e forneça um botão Voltar quando iniciado como um PWA instalado.

### Monitore como o PWA foi lançado

Para rastrear como os usuários iniciam seu PWA, use `matchMedia()` para testar a media query `display-mode`. O Safari no iOS ainda não suporta esse recurso, então você precisa verificar `navigator.standalone`: ele retorna um valor booleano indicando se o navegador está sendo executado no modo independente.

```js
function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if (navigator.standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}
```

### Monitore quando o modo de exibição mudar

Para rastrear se o usuário muda entre `standalone` e `browser tab`, escute as mudanças na media query `display-mode`

```js
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
  let displayMode = 'browser';
  if (evt.matches) {
    displayMode = 'standalone';
  }
  // Log display mode change to analytics
  console.log('DISPLAY_MODE_CHANGED', displayMode);
});
```

### Atualize a IU com base no modo de exibição atual

Para aplicar uma cor de fundo diferente para um PWA quando iniciado como um PWA instalado, use CSS condicional:

```css
@media all and (display-mode: standalone) {
  body {
    background-color: yellow;
  }
}
```

## Atualizando o ícone e o nome da sua aplicação

E se você precisar modificar o nome da sua aplicação ou fornecer novos ícones? Confira [Como o Chrome lida com as atualizações do manifesto web app](/manifest-updates/) para saber quando e como essas mudanças são refletidas no Chrome.
