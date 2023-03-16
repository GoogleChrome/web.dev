---
layout: post
title: Как предоставлять собственный процесс установки в приложении
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: Используйте событие beforeinstallprompt для предоставления пользователям индивидуального бесперебойного процесса установки в приложении.
tags:
  - progressive-web-apps
---

Многие браузеры позволяют возможность активировать и продвигать установку прогрессивного веб-приложения (PWA) непосредственно в пользовательском интерфейсе PWA. Установка (иногда называемая Add to Home Screen или «Добавить на главный экран») позволяет пользователям легко установить PWA на мобильные или настольные устройства. Установка PWA добавляет приложение в программу запуска пользователя, что позволяет запускать PWA как любое другое установленное приложение.

Помимо возможностей [установки, предоставляемых браузером](/promote-install/#browser-promotion), можно создать собственный процесс установки непосредственно в приложении.

<figure data-float="right">{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SW3unIBfyMRTZNK0DRIw.png", alt = "Кнопка установки приложения, предусмотренная в PWA Spotify", width = "491", height = "550"%}<figcaption> Кнопка Install App (Установить приложение) в PWA Spotify.</figcaption></figure>

При рассмотрении вопроса о том, стоит ли продвигать установку, подумайте о том, как пользователи обычно используют ваше PWA. Например, если есть группа пользователей, которые используют PWA несколько раз в неделю, им будет удобней запускать приложение с главного экрана смартфона или из меню «Пуск» настольной операционной системы. Некоторые приложения для работы и развлечений также выигрывают от дополнительной площади экрана, созданной за счет удаления панелей инструментов браузера из окна при установленных режимах отображения `standalone` или `minimal-ui`.

## Содействие установке {: #promotion-installation}

Чтобы указать, что ваше прогрессивное веб-приложение можно устанавливать, и чтобы обеспечить настраиваемый процесс установки в приложении:

1. Прослушивайте событие `beforeinstallprompt`.
2. Сохраняйте событие `beforeinstallprompt`, чтобы его можно было использовать для запуска процесса установки позже.
3. Предупреждайте пользователя, что PWA можно установить, и предоставляйте кнопку или другой элемент для запуска процесса установки в приложении.

{% Aside %} События `beforeinstallprompt` и `appinstalled` были перемещены из спецификации манифеста веб-приложений в [инкубатор](https://github.com/WICG/beforeinstallprompt). Команда Chrome продолжает поддерживать их и не планирует прекращать поддержку или отказываться от нее. Команда Google Web DevRel по-прежнему рекомендует использовать их для обеспечения индивидуального процесса установки. {% endAside %}

### Прослушивайте событие `beforeinstallprompt`

Если ваше прогрессивное веб-приложение соответствует требуемым [критериям установки](/install-criteria/), браузер запускает событие `beforeinstallprompt`. Сохраните ссылку на событие и обновите свой пользовательский интерфейс, чтобы указать, что пользователь может установить ваше PWA. Код приведен ниже.

```js
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});
```

{% Aside %} Существует множество различных [шаблонов](/promote-install/), которые можно использовать для уведомления пользователя о возможности установки вашего приложения и обеспечения процесса установки в приложении, например, кнопка в заголовке, элемент в меню навигации или элемент в вашей новостной ленте. {% endAside %}

### Процесс установки в приложении {: #in-app-flow}

Чтобы обеспечить установку в приложении, предоставьте кнопку или другой элемент интерфейса, который пользователь может нажать, чтобы установить ваше приложение. При нажатии по элементу вызовите `prompt()` для сохраненного события `beforeinstallprompt` (хранящегося в `deferredPrompt`). В результате пользователь увидит модальное диалоговое окно установки с просьбой подтвердить установку PWA.

```js
buttonInstall.addEventListener('click', async () => {
  // Hide the app provided install promotion
  hideInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
});
```

Свойство `userChoice` — это обещание, которое разрешается по выбору пользователя. Вы можете вызвать метод `prompt()` для отложенного события только один раз. Если пользователь отклоняет его, нужно дождаться события`beforeinstallprompt`, обычно сразу после разрешения свойства `userChoice`.

{% Aside 'codelab' %} [Сделайте сайт доступным для установки с помощью события beforeinstallprompt](/codelab-make-installable) . {% endAside %}

## Определяйте, когда PWA было успешно установлено {: #detect-install}

Вы можете использовать свойство `userChoice`, чтобы определить, установил ли пользователь ваше приложение из вашего пользовательского интерфейса. Но если пользователь устанавливает PWA из адресной строки или другого компонента браузера, `userChoice` не поможет. Вместо этого вы должны прослушивать событие `appinstalled`. Оно запускается всякий раз, когда устанавливается ваше PWA, независимо от того, какой механизм используется для установки.

```js
window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
});
```

## Определяйте, как было запущено PWA {: #detect-launch-type}

Медиа-запрос CSS `display-mode` указывает, как было запущено PWA: во вкладке браузера или как установленное PWA. Это позволяет применять различные стили в зависимости от типа запуска. Например, при запуске установленного PWA всегда скрывать кнопку установки и предоставлять кнопку «Назад».

### Отслеживайте, как было запущено PWA

Чтобы отслеживать, как пользователи запускают ваше PWA, используйте `matchMedia()` для проверки медиа-запроса `display-mode`. Safari на iOS пока не поддерживает эту функцию, поэтому потребуется проверять свойство `navigator.standalone`, которое возвращает логическое значение, указывающее, работает ли браузер в режиме standalone.

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

### Отслеживайте, когда меняется режим отображения

Чтобы отслеживать, переключается ли пользователь между режимами `standalone` и `browser`, прослушивайте изменения в медиа-запросе `display-mode`.

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

### Обновите пользовательский интерфейс в зависимости от текущего режима отображения

Чтобы применить другой цвет фона для PWA при запуске в качестве установленного PWA, используйте условную конструкцию CSS:

```css
@media all and (display-mode: standalone) {
  body {
    background-color: yellow;
  }
}
```

## Обновите значок и название вашего приложения

Что если вам нужно обновить название приложения или добавить новые значки? Прочитайте о том, [как Chrome обрабатывает обновления манифеста веб-приложения](/manifest-updates/), чтобы узнать, когда и как эти изменения отражаются в Chrome.
