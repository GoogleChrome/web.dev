---
layout: post
title: Создание компонента sidenav
subhead: Фундаментальный обзор того, как создать адаптивный выдвигающийся компонент sidenav
authors:
  - adamargyle
description: Фундаментальный обзор того, как создать адаптивный выдвигающийся компонент sidenav
date: 2021-01-21
hero: image/admin/Zo1KkESK9CfEIYpbWzap.jpg
thumbnail: image/admin/pVZO6FsC9tF3H6QIWpY2.png
codelabs: codelab-building-a-sidenav-component
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

В этой статье я хочу поделиться с вами своим способом создания адаптивной боковой панели навигации (sidenav), которая отслеживает состояние, поддерживает управление с клавиатуры, работает с JavaScript и без него и поддерживается разными браузерами. Попробуйте [демонстрацию](https://gui-challenges.web.app/sidenav/dist/).

Если вы предпочитаете видео, можете посмотреть видеоверсию этой статьи на YouTube:

{% YouTube 'uiZqDLqjGRY' %}

## Обзор

Создать адаптивную систему навигации непросто. Некоторые пользователи могут работать с помощью клавиатуры, одни при входе на сайт будут использовать мощный компьютер, другие — маленькое мобильное устройство. Но каждый из посетителей должен иметь возможность открыть и закрыть меню.

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gui-sidenav/desktop-demo-1080p.mp4">
  </source></video>
  <figcaption>Демонстрация адаптивности макета на десктопе и мобильных</figcaption></figure>

<figure>
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gui-sidenav/mobile-demo-1080p.mp4">
  </source></video>
  <figcaption>Светлая и темная тема на iOS и Android</figcaption></figure>

## Веб-подходы

При исследовании этого компонента я совместил несколько важных концепций веб-разработки:

1. CSS-псевдокласс [`:target`](#target-psuedo-class)
2. CSS [Grid](#grid-stack)
3. CSS-[трансформации](#transforms)
4. CSS-медиазапросы для области просмотра и пользовательских предпочтений
5. JS для [улучшения удобства использования](#ux-enhancements) `focus`

В моем решении присутствует одна боковая панель, которая выдвигается только в «мобильной» области просмотра шириной `540px` или меньше. Размер `540px` будет нашей контрольной точкой для переключения между интерактивным макетом для мобильных и статическим для десктопов.

### CSS-псевдокласс `:target` {: #target-pseudo-class }

Одна ссылка `<a>` устанавливает в URL-хеш значение `#sidenav-open`, а вторая — пустое значение (`''`). У самого элемента имеется `id`, соответствующий этому хешу:

```html
<a href="#sidenav-open" id="sidenav-button" title="Open Menu" aria-label="Open Menu">

<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>

<aside id="sidenav-open">
  …
</aside>
```

Нажатие на каждую из этих ссылок изменяет хеш-состояние URL-адреса нашей страницы, а затем с помощью псевдокласса мы показываем и скрываем боковую навигацию:

```css
@media (max-width: 540px) {
  #sidenav-open {
    visibility: hidden;
  }

  #sidenav-open:target {
    visibility: visible;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/hash-change.mp4">
  </source></video></figure>

### CSS Grid {: #grid-stacks }

Раньше для боковой панели я использовал только макеты и компоненты с абсолютным или фиксированным позиционированием. Технология CSS Grid, однако, с ее синтаксисом `grid-area` позволяет нам назначать несколько элементов одной строке или столбцу.

#### Стопки

Основной элемент макета `#sidenav-container` представляет собой grid-элемент, который создает 1 строку и 2 столбца, 1 из которых получает имя `stack`. Когда пространство ограничено, CSS присваивает всем потомкам элемента `<main>` одно и то же значение grid-области, размещая все элементы в одну и ту же ячейку в виде стопки.

```css
#sidenav-container {
  display: grid;
  grid: [stack] 1fr / min-content [stack] 1fr;
  min-height: 100vh;
}

@media (max-width: 540px) {
  #sidenav-container > * {
    grid-area: stack;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/responsive-stack-demo-1080p.mp4">
  </source></video></figure>

#### Фон меню

`<aside>` — это анимированный элемент, содержащий боковую навигацию. У него есть два дочерних элемента: контейнер навигации `<nav>` с именем `[nav]` и фон `<a>` с именем `[escape]`, который используется для закрытия меню.

```css
#sidenav-open {
  display: grid;
  grid-template-columns: [nav] 2fr [escape] 1fr;
}
```

Изменяя значения `2fr` и `1fr`, можно найти нужное вам соотношение между панелью и кнопкой закрытия на вспомогательном пространстве при открытом боковом меню.

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/overlay-escape-ratio.mp4">
  </source></video>
  <figcaption>Демонстрация того, что происходит при изменении соотношения.</figcaption></figure>

### CSS 3D-преобразования и переходы {: #transforms }

Теперь наш макет умещается и в размер мобильной области просмотра. Пока я не добавлю несколько новых стилей, боковая панель по умолчанию будет накладываться на нашу статью. Вот функционал, к которому я стремлюсь в следующем разделе:

- Анимированное открытие и закрытие
- Анимация только в том случае, если пользователь ее не отключает
- Анимирование `visibility`, чтобы фокус клавиатуры не выходил за пределы экрана

Поскольку я приступаю к реализации анимированного движения, в первую очередь давайте начнем с доступности.

#### Доступная анимация

Не всем захочется видеть анимацию выдвигающегося меню. В нашем решении предпочтение пользователя применяется путем настройки CSS-переменной `--duration` внутри медиазапроса. Значение этого медиазапроса представляет предпочтения операционной системы пользователя в отношении анимации (если они доступны).

```css
#sidenav-open {
  --duration: .6s;
}

@media (prefers-reduced-motion: reduce) {
  #sidenav-open {
    --duration: 1ms;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/prefers-reduced-motion.mp4">
  </source></video>
  <figcaption>Демонстрация работы интерфейса с разными настройками длительности анимации</figcaption></figure>

Теперь, когда наша боковая навигация открывается и закрывается, если пользователь предпочитает ограничить анимацию, я мгновенно перемещаю элемент в область просмотра, поддерживая тем временем состояние без движения.

#### Переход, трансформация, трансляция

##### Боковая панель закрыта (по умолчанию)

Чтобы на мобильных устройствах наша панель боковой навигации по умолчанию находилась за пределами экрана, я позиционирую элемент с помощью `transform: translateX(-110vw)`.

Обратите внимание, я добавил еще `10vw` к типичному закадровому коду `-100vw`, чтобы гарантировать, что тень `box-shadow` блока боковой навигации не видна в основной области просмотра, когда панель скрыта.

```css
@media (max-width: 540px) {
  #sidenav-open {
    visibility: hidden;
    transform: translateX(-110vw);
    will-change: transform;
    transition:
      transform var(--duration) var(--easeOutExpo),
      visibility 0s linear var(--duration);
  }
}
```

##### Панель открыта

Когда элемент `#sidenav` соответствует псевдоклассу `:target`, установите позиционирование с помощью `translateX()` в стандартное значение `0` и посмотрите, как CSS при изменении URL-хеша сместит элемент с его исходной позиции `-110vw` в позицию «открыто», равную `0`, в течение времени, установленного в переменной `var(--duration)`.

```css
@media (max-width: 540px) {
  #sidenav-open:target {
    visibility: visible;
    transform: translateX(0);
    transition:
      transform var(--duration) var(--easeOutExpo);
  }
}
```

#### Переход свойства visibility

Теперь, когда панель находится за пределами области просмотра, ее нужно скрыть от программ чтения с экрана, чтобы они не переводили фокус на элементы закадрового меню. Я реализовал это с помощью перехода свойства visibility при смене псевдокласса `:target` .

- При открытии применять переход не нужно; сразу видимая панель должна выезжать из-за пределов экрана и получать фокус.
- При закрытии для свойства visibility нужно применить переход, но с задержкой, чтобы панель стала невидимой (`hidden`) в конце перехода.

### Улучшения доступности {: #ux-enhancements }

#### Ссылки

Это решение основывается на изменении URL-адреса для управления состоянием панели. Естественно, здесь нужно использовать элемент `<a>`, который имеет некоторые преимущества в плане доступности. Давайте дополним наши интерактивные элементы ярлыками, четко отражающими их назначение.

```html
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>

<a href="#sidenav-open" id="sidenav-button" class="hamburger" title="Open Menu" aria-label="Open Menu">
  <svg>...</svg>
</a>
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/keyboard-voiceover.mp4">
  </source></video>
  <figcaption>Демонстрация озвучивания и взаимодействия с клавиатурой.</figcaption></figure>

Теперь наши основные кнопки взаимодействия содержат четкое обозначение для пользователей как мыши, так и клавиатуры.

#### `:is(:hover, :focus)`

Этот удобный функциональный псевдоселектор CSS позволяет нам задать стили одновременно для состояний hover и focus.

```css
.hamburger:is(:hover, :focus) svg > line {
  stroke: hsl(var(--brandHSL));
}
```

#### Добавление JavaScript

##### `escape` для закрытия

Кнопка `Escape` на клавиатуре должна закрывать меню, верно? Давайте это реализуем.

```js
const sidenav = document.querySelector('#sidenav-open');

sidenav.addEventListener('keyup', event => {
  if (event.code === 'Escape') document.location.hash = '';
});
```

##### История браузера

Чтобы каждое открытие и закрытие панели не создавало отдельную запись в истории браузера, добавьте следующий встроенный JavaScript-код для кнопки закрытия:

```html
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu" onchange="history.go(-1)"></a>
```

Это приведет к удалению записи истории URL-адресов при закрытии панели, как если бы меню никогда не открывалось.

##### Фокус

Следующий фрагмент помогает нам поместить фокус на кнопки открытия и закрытия при соответствующем действии панели. Я хочу упростить переключение.

```js
sidenav.addEventListener('transitionend', e => {
  const isOpen = document.location.hash === '#sidenav-open';

  isOpen
      ? document.querySelector('#sidenav-close').focus()
      : document.querySelector('#sidenav-button').focus();
})
```

Когда боковая панель открывается, фокус попадает на кнопку закрытия. Когда же панель закрывается, фокус попадает на кнопку открытия. Я делаю это с помощью JavaScript, вызывая `focus()` для элемента.

### Заключение

Теперь вы знаете о моем подходе в реализации этого компонента. Как бы его реализовали вы? Тут есть пространство для творчества. Кто же сделает первую версию со слотами? 🙂

Давайте разнообразим наши подходы и найдем все способы создания компонентов. Создайте демонстрацию на [Glitch](https://glitch.com), напишите мне о своей версии в [Твиттере](https://twitter.com/argyleink), и я добавлю ее в раздел [ремиксов сообщества](#community-remixes) ниже.

## Ремиксы сообщества

- [@_developit](https://twitter.com/_developit) с настраиваемыми элементами: [демонстрация и код](https://glitch.com/edit/#!/app-drawer)
- [@mayeedwin1](https://twitter.com/mayeedwin1) с HTML/CSS/JS: [демонстрация и код](https://glitch.com/edit/#!/maye-gui-challenge)
- [@a_nurella](https://twitter.com/a_nurella) с ремиксом на Glitch: [демонстрация и код](https://glitch.com/edit/#!/sidenav-with-adam)
- [@EvroMalarkey](https://twitter.com/EvroMalarkey) с HTML/CSS/JS: [демонстрация и код](https://evromalarkey.github.io/scrollsnap-drawer/index.html)
