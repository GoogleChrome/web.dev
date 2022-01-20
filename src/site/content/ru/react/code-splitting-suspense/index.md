---
layout: post
title: Разделение кода с помощью React.lazy и Suspense
subhead: |
  Чем меньше вы отправляете пользователям кода, тем лучше, поэтому разделяйте пакеты, чтобы не отправлять ненужный код!
hero: image/admin/Lk8KvDZcWntc7rtQzvv9.jpg
date: 2019-04-29
description: |
  Метод React.lazy упрощает разделение кода для приложения React на уровне компонентов с помощью динамического импорта. Вместе с Suspense он позволяет отображать пользователям соответствующее состояние загрузки.
authors:
  - houssein
  - jeffposnick
feedback:
  - api
---

{% Aside %}
Если вы еще не разобрались в том, для чего нужно разделение кода, сначала
ознакомьтесь со статьей
[Сокращение полезной нагрузки JavaScript за счет разделения кода](/reduce-javascript-payloads-with-code-splitting).
{% endAside %}

Метод **`React.lazy`** упрощает разделение кода для приложения React на уровне
компонентов с помощью динамического импорта.

```jsx
import React, { lazy } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));

const DetailsComponent = () => (
  <div>
    <AvatarComponent />
  </div>
)
```

## Какая от этого польза?

Большое приложение React обычно состоит из множества компонентов,
служебных методов и сторонних библиотек. Если не пытаться загружать
различные части приложения только по необходимости, то при загрузке
первой страницы пользователям будет отправлен один большой
пакет JavaScript, что может существенно повлиять на скорость работы страницы.

Функция `React.lazy` — это встроенное средство разделения компонентов
в приложении на отдельные фрагменты кода JavaScript с минимальными усилиями. После
разделения можно будет настроить состояния загрузки — используя компонент
`Suspense`.

## Suspense

При отправке пользователям большого объема полезной нагрузки JavaScript
на загрузку страницы требуется много времени, особенно на слабых устройствах
и при медленном подключении. В таких случаях на помощь приходит разделение кода
и отложенная загрузка.

Однако при получении компонента с разделением кода по сети всегда будет
небольшая задержка, поэтому важно отображать понятное для пользователей
состояние загрузки. В решении этой задачи помогает `React.lazy` с компонентом
**`Suspense`**.

```jsx
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));

const renderLoader = () => <p>Loading</p>;

const DetailsComponent = () => (
  <Suspense fallback={renderLoader()}>
    <AvatarComponent />
  </Suspense>
)
```

`Suspense` принимает компонент `fallback`, который позволяет отображать
любой компонент React как состояние загрузки. В следующем примере показано, как это работает.
Аватар отрисовывается только при нажатии кнопки: при этом делается
запрос на получение кода, необходимого для приостановленного `AvatarComponent`,
а отображается компонент загрузки fallback.

{% Glitch {
id: 'react-lazy-suspense',
path: 'src/index.css',
height: 480
} %}

В этом примере код `AvatarComponent` небольшой, поэтому
счетчик загрузки отображается недолго. На загрузку
более объемных компонентов может потребоваться гораздо
больше времени, особенно при медленном подключении.

Разберемся подробнее, как это работает:

{% Instruction 'preview' %}
{% Instruction 'devtools-network' %}
- Откройте список **Throttling** (Ограничение) — по умолчанию там **Без ограничения**. Выберите **Fast 3G** (3G (высокая скорость)).
- Нажмите кнопку **Click Me** в приложении.

Индикатор загрузки будет отображаться дольше. Обратите внимание, что весь код
`AvatarComponent` передается как отдельный фрагмент.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ga9IsnuJoJdnUfE6sGee.png", alt="Панель «Сеть» в DevTools. Загружается файл chunk.js", width="800", height="478" %}
</figure>

{% Aside %}
Пока что React не поддерживает Suspense, если компоненты отрисовываются
на сервере — в этом случае можно попробовать другую библиотеку,
например
[`loadable-components`](https://www.smooth-code.com/open-source/loadable-components/docs/server-side-rendering/),
которую рекомендуют в документации React.
{% endAside %}

## Приостановка нескольких компонентов

Еще одна возможность `Suspense` — приостановка загрузки нескольких
компонентов, **даже в случае отложенной загрузки**.

Например:

```jsx
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));
const InfoComponent = lazy(() => import('./InfoComponent'));
const MoreInfoComponent = lazy(() => import('./MoreInfoComponent'));

const renderLoader = () => <p>Loading</p>;

const DetailsComponent = () => (
  <Suspense fallback={renderLoader()}>
    <AvatarComponent />
    <InfoComponent />
    <MoreInfoComponent />
  </Suspense>
)
```

Это позволяет удобным образом откладывать отрисовку нескольких компонентов,
показывая только одно состояние загрузки. Как только все компоненты будут получены,
пользователь увидит их все одновременно.

Увидеть это можно на следующей вставке:

{% Glitch {
id: 'react-lazy-suspense-multiple',
path: 'src/index.css',
height: 480
} %}

{% Aside %}
Индикатор загрузки исчезает слишком быстро?
Попробуйте снова ограничить скорость подключения в DevTools.
{% endAside %}

Если не использовать такой подход, можно столкнуться с проблемой
_несинхронной загрузки_: разные части интерфейса будут появляться
друг за другом, и у каждого будет собственный индикатор загрузки — пользователя это наверняка будет раздражать.

{% Aside %}
Suspense уже позволяет разделять компоненты и сокращать размер пакетов,
но команда React продолжает работать над другими функциями, которые
дадут еще больше возможностей. Подробнее —
в
[дорожной карте React 16.x](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html).
{% endAside %}

## Обработка сбоев загрузки

`Suspense` позволяет отображать временное состояние загрузки,
пока выполняются сетевые запросы. Но что, если эти сетевые запросы
по какой-либо причине не срабатывают? Возможно, пользователь офлайн, или веб-приложение пытается
отложить загрузку устаревшего [версионированного URL-адреса](/http-cache/#long-lived-caching-for-versioned-urls),
который после повторного развертывания сервера перестал быть доступен.

Для этого в React есть стандартный шаблон работы с такими проблемами загрузки:
использование границы ошибок. Как описано [в документации](https://reactjs.org/docs/error-boundaries.html), любой
границей ошибок может быть любой компонент React, если он реализует один или оба
метода жизненного цикла: `static getDerivedStateFromError()` или
`componentDidCatch()`.

Для обнаружения и обработки сбоев при отложенной загрузке можно обернуть компонент
`Suspense` родительскими компонентами, которые будут служить границей ошибок. В методе
границы ошибок `render()` в случае нормальной работы дочерние элементы можно
отрисовывать как есть, при сбое отображать заданное сообщение об ошибке:

```js
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));
const InfoComponent = lazy(() => import('./InfoComponent'));
const MoreInfoComponent = lazy(() => import('./MoreInfoComponent'));

const renderLoader = () => <p>Loading</p>;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return <p>Loading failed! Please reload.</p>;
    }

    return this.props.children;
  }
}

const DetailsComponent = () => (
  <ErrorBoundary>
    <Suspense fallback={renderLoader()}>
      <AvatarComponent />
      <InfoComponent />
      <MoreInfoComponent />
    </Suspense>
  </ErrorBoundary>
)
```

## Заключение

Если вы не знаете, как подступиться к разделению кода в приложении React,
действуйте следующим образом:

1. Начните с уровня маршрута. Маршруты — самый простой способ определить точки,
   в которых приложение можно разделить. В
   [документации React](https://reactjs.org/docs/code-splitting.html#route-based-code-splitting)
   показано, как использовать `Suspense` в сочетании с
   [`react-router`](https://github.com/ReactTraining/react-router).
2. Найдите на странице сайта большие компоненты, которые отрисовываются только
   при определенных действиях пользователя (например, при нажатии кнопки). Отделив их,
   вы уменьшите размера полезных нагрузок JavaScript.
3. Попробуйте разделить всё, что находится «за кадром» и не критично
   для пользователя.
