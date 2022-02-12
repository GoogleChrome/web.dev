---
layout: codelab
title: Да установится сайт!
authors:
  - petelepage
date: 2018-11-05
updated: 2021-02-12
description:
  В этом практическом задании вы научитесь делать сайт устанавливаемым — с помощью события «beforeinstallprompt».
glitch: make-it-installable?path=script.js
related_post: customize-install
tags:
  - progressive-web-apps
---

В этом фрагменте на Glitch уже есть компоненты, необходимые, чтобы обеспечить возможность установки современного веб-приложения, в том числе — [очень простой сервис-воркер](https://glitch.com/edit/#!/make-it-installable?path=service-worker.js) и [манифест веб-приложения](https://glitch.com/edit/#!/make-it-installable?path=manifest.json). Там также есть кнопка установки, которая по умолчанию скрыта.

## Прослушивание события «beforeinstallprompt»

Когда браузер запускает событие `beforeinstallprompt`, это означает, что что можно установить современное веб-приложение (Progressive Web App, PWA) и показать пользователю кнопку установки. Событие `beforeinstallprompt` запускается, когда PWA видит [критерии возможности установки](/install-criteria/).

{% Instruction 'remix', 'ol' %}

1. Добавьте в объект `window` обработчик событий `beforeinstallprompt`.
2. Сохраните `event` как глобальную переменную: она понадобится позже, чтобы показать запрос.
3. Отобразите кнопку установки.

Код:

```js
window.addEventListener('beforeinstallprompt', (event) => {
  // Запрет показа информационной мини-панели на мобильных устройствах.
  event.preventDefault();
  console.log('👍', 'beforeinstallprompt', event);
  // Убираем событие, чтобы его можно было активировать позже.
  window.deferredPrompt = event;
  // Убираем класс «hidden» из контейнера кнопки установки.
  divInstall.classList.toggle('hidden', false);
});
```

## Обработка нажатия на кнопку установки

Для показа запроса на установку вызовите `prompt()` на сохраненном событии `beforeinstallprompt`. Вызов `prompt()` выполняется в обработчике нажатия на кнопку установки, поскольку `prompt()` необходимо вызывать с помощью жеста пользователя.

1. Добавьте обработчик события клика для кнопки установки.
2. Вызовите `prompt()` на сохраненном событии `beforeinstallprompt`.
3. Запишите результаты запроса в журнал.
4. Установите для сохраненного события `beforeinstallprompt` значение «null».
5. Скройте кнопку установки.

Код:

```js
butInstall.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked');
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // Отложенный запрос недоступен.
    return;
  }
  // Показать запрос на установку.
  promptEvent.prompt();
  // Записать результат в журнал.
  const result = await promptEvent.userChoice;
  console.log('👍', 'userChoice', result);
  // Сбросить переменную отложенного запроса:
  // prompt() можно вызвать только один раз.
  window.deferredPrompt = null;
  // Скрыть кнопку установки.
  divInstall.classList.toggle('hidden', true);
});
```

## Отслеживание события установки

Использование кнопки установки — не единственный способ установить современное веб-приложение. Это можно сделать из меню Chrome, информационной мини-панели и с помощью [значка в омнибоксе](/promote-install/#browser-promotion). Отслеживать все эти способы установки можно, прослушивая вызов `appinstalled`.

1. Добавьте в объект `window` обработчик событий `appinstalled`.
2. Запишите информацию о событии установки в инструмент аналитики или иным способом.

Код:

```js
window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);
  // Очистить «deferredPrompt» для сборщика мусора
  window.deferredPrompt = null;
});
```

## Дополнительные материалы

Поздравляем: теперь ваше приложение можно установить!

Что можно сделать еще:

- [Определить, запущено ли приложение с главного экрана](/customize-install/#detect-mode).
- [Показать запрос об установке приложения средствами операционной системы](https://developers.google.com/web/fundamentals/app-install-banners/native).
