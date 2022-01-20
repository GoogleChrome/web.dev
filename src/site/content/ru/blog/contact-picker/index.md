---
layout: post
title: Окно выбора контактов для веб-страниц
subhead: Contact Picker API дает пользователям возможность легко делиться данными из списка контактов.
authors:
  - petelepage
description: С давних времен в приложениях для iOS и Android была функция доступа к контактам пользователя. Contact Picker API — это работающий «по запросу» API, который дает пользователю возможность выбирать записи из списка контактов и передавать ограниченный набор данных из них на веб-сайт. Посетители сами решают, какую информацию и когда передавать. Такая функция упрощает поиск друзей и членов семьи на сайте и общение с ними.
date: 2019-08-07
updated: 2021-02-23
tags:
  - blog
  - capabilities
hero: image/admin/K1IN7zWIjFLjZzJ4Us3J.jpg
alt: Телефон на желтом фоне
feedback:
  - api
---

## Что представляет собой Contact Picker API {: #what }

&lt;style&gt;   #video-demo { max-height: 600px; } &lt;/style&gt;

<figure data-float="right">   {% Video     src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZYR1SBlPglRDE69Xt2xl.mp4", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RbG1WcYhSLn0MQoQjZe.webm"],     poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rif9Fh8w8SR78PcVXCO1.jpg",     loop=true,     autoplay=true,     muted=true,     linkTo=true,     id="video-demo",     playsinline=true   %}</figure>

С давних времен в приложениях для iOS и Android на мобильных устройствах была функция доступа к контактам пользователя. Это одна из самых запрашиваемых разработчиками функций и часто — основная причина, по которой они разрабатывают приложение для iOS или Android.

[Contact Picker API](https://wicg.github.io/contact-api/spec/) реализован в Chrome 80 на Android. Это работающий «по запросу» API, который дает пользователю возможность выбирать записи из списка контактов и передавать ограниченный набор данных из них на веб-сайт. Посетители сами решают, какую информацию и когда передавать. Такая функция упрощает поиск друзей и членов семьи на сайте и общение с ними.

Например, в почтовом веб-клиенте Contact Picker API позволит выбрать получателей письма, в приложении для передачи голоса по IP (VoIP) — найти, по какому номеру звонить, а в соцсети поможет пользователю найти друзей и знакомых.

{% Aside 'caution' %} Команда Chrome тщательно продумала дизайн и реализацию Contact Picker API, чтобы браузер передавал только те данные, которые выбрал пользователь. См. раздел [Безопасность и разрешения](#security-considerations) ниже. {% endAside %}

## Текущее состояние {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Этап</th>
<th data-md-type="table_cell">Состояние</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Написание пояснения</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/contact-api/" data-md-type="link">Готово</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Создание первоначального проекта спецификации</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/contact-api/spec/" data-md-type="link">Готово</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Сбор отзывов и доработка проекта</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/contact-api/spec/" data-md-type="link">Готово</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Испытание в Origin</td>
<td data-md-type="table_cell"><a>Готово</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Запуск</strong></td>
<td data-md-type="table_cell">
<strong data-md-type="double_emphasis">Chrome 80</strong><br>Доступно только на Android</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Использование Contact Picker API {: #how-to-use }

Для использования Contact Picker API нужно вызывать метод с параметром <code>options</code>, который определяет типы запрашиваемой контактной информации. Второй метод сообщает, какую информацию даст базовая система.

{% Aside %} Посмотрите [демонстрацию Contact Picker API](https://contact-picker.glitch.me) и ее [исходный код](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0). {% endAside %}

### Обнаружение функции

Как проверить, поддерживается ли Contact Picker API:

```js
const supported = ('contacts' in navigator && 'ContactsManager' in window);
```

Кроме того, для Contact Picker API требуется Android M или более поздняя версия.

### Открытие окна выбора контактов

Точка входа в Contact Picker API — `navigator.contacts.select()`. При вызове этот метод возвращает промис и показывает окно выбора контактов, в котором пользователь может выбрать контакты для передачи на сайт. После выбора контактов и нажатия на кнопку **Готово** промис разрешается и дает массив соответствующих контактов.

При вызове `select()` в качестве первого параметра нужно указать массив свойств, которые должны быть возвращены (допустимые значения: `'name'`, `'email'`, `'tel'`, `'address'` и `'icon'`). Вторым параметром можно указать, разрешается ли выбрать несколько контактов.

```js
const props = ['name', 'email', 'tel', 'address', 'icon'];
const opts = {multiple: true};

try {
  const contacts = await navigator.contacts.select(props, opts);
  handleResults(contacts);
} catch (ex) {
  // Обработка ошибок.
}
```

{% Aside 'caution' %} Для поддержки `'address'` и `'icon'` требуется Chrome 84 или более поздняя версия. {% endAside %}

Contact Picker API можно вызвать только из [безопасного](https://w3c.github.io/webappsec-secure-contexts/) веб-контекста верхнего уровня. Как и другим API с широкими возможностями, ему требуется жест пользователя.

### Обнаружение имеющихся свойств

Чтобы узнать, какие свойства есть, вызовите метод `navigator.contacts.getProperties()`. Он возвращает промис, которое разрешается с массивом строк, указывающих, какие свойства доступны, например: `['name', 'email', 'tel', 'address']`. Далее эти значения можно передать в `select()`.

Помните, что некоторые свойства иногда могут быть недоступны. Кроме того, могут добавляться новые. В будущем другие платформы и источники контактов смогут определять, какие свойства можно передавать.

### Обработка результатов

Contact Picker API возвращает массив из контактов, каждый из которых содержит массив запрошенных свойств. Если у контакта нет данных для запрошенного свойства или пользователь решает не передавать определенное свойство, API возвращает пустой массив. (Выбор свойств пользователем описывается в разделе [Пользовательский контроль](#security-control).)

Например, если сайт запрашивает имя (`name`), адрес электронной почты (`email`) и телефон (`tel`), а пользователь выбирает один контакт, у которого есть данные в поле <code>name</code>, два номера телефонов, но нет электронной почты, ответ будет следующим:

```json
[{
  "email": [],
  "name": ["Queen O'Hearts"],
  "tel": ["+1-206-555-1000", "+1-206-555-1111"]
}]
```

{% Aside 'caution' %} Ярлыки и другие семантические данные в полях контактов отбрасываются. {% endAside %}

## Безопасность и разрешения {: #security-considerations }

Команда Chrome разработала и внедрила Contact Picker API согласно принципам, определенным в в [Контроле доступа к функциям веб-платформы с широкими возможностями](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md), включая пользовательский контроль, прозрачность и удобство. Разъяснение по каждому из этих принципов — ниже.

### Пользовательский контроль {: #security-control }

Доступ к контактам пользователей осуществляется через окно выбора, которое можно вызвать только жестом пользователя в [безопасном](https://w3c.github.io/webappsec-secure-contexts/) веб-контексте верхнего уровня. Благодаря этому сайт не сможет вывести окно выбора при загрузке страницы или случайным образом показать его без какого-либо контекста.

<figure data-float="right">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EiHIOYdno52DZ6TNHcfI.jpg", alt="Скриншот. Пользователи могут выбрать, какое свойство передать", width="800", height="639" %}   <figcaption>     Пользователи могут не передавать определенные свойства. На скриншоте     пользователь снял выделение с кнопки «Номера телефонов» (Phone numbers), поэтому     они не будут переданы, хотя сайт их запрашивал   </figcaption></figure>

Выбрать все контакты сразу нельзя — это сделано для того, чтобы поощрять пользователей выбирать только те контакты, которые нужно передать конкретному сайту. Пользователи также определяют, какие свойства передать, — с помощью кнопок свойств в верхней части окна выбора.

### Прозрачность {: #security-transparency }

Чтобы пользователь в точности знал, какие контактные данные передаются, окно выбора всегда отображает имя и значок контакта, а также все свойства, запрошенные сайтом. Например, если сайт запрашивает имя (`name`), адрес электронной почты (`email`) и телефон (`tel`), в окне выбора будут показаны все три свойства. А если сайт запрашивает только телефон (`tel`), то будет показано только имя и номера телефонов.

<div class="switcher">
  <figure>     {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ig9SBKtJPlSE3mCjR2Go.jpg", alt="Скриншот окна выбора для сайта, запрашивающего все свойства", width="800", height="639" %}     <figcaption>       Окно выбора, сайт запрашивает имя (<code>name</code>), адрес электронной почты (<code>email</code>) и       телефон (<code>tel</code>), выбран один контакт     </figcaption></figure>
  <figure>     {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vOB2nPSrfi1GnmtitElf.jpg", alt="Скриншот окна выбора для сайта, запрашивающего только номера телефонов", width="800", height="639" %}     <figcaption>       Окно выбора, сайт запрашивает только телефон (<code>tel</code>), выбран один контакт     </figcaption></figure>
</div>

<figure data-float="right">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qLxdnKZwW0e4teyw2OOU.jpg", alt="Скриншот окна выбора для сайта; долгое нажатие на контакт", width="800", height="389" %}   <figcaption>     Результат долгого нажатия на контакт   </figcaption></figure>

При долгом нажатии на контакт отображается вся информация, которая будет передана, если выбрать этот контакт. (См. изображение с контактом «Cheshire Cat».)

### Разрешение не сохраняется {: #security-persistence }

Доступ к контактам дается по запросу и не сохраняется. Каждый раз, когда сайту нужен доступ к контактам, он должен вызвать `navigator.contacts.select()` жестом пользователя, а пользователь должен по одному выбрать контакты для передачи сайту.

## Отзывы {: #feedback }

Команде Chrome хотелось бы услышать ваши отзывы о работе с Contact Picker API.

### Проблема с реализацией?

Нашли ошибку в реализации функции в браузере Chrome? Реализация отличается от спецификации?

- Сообщите об ошибке на странице [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EContacts). Опишите проблему как можно подробнее, дайте простые инструкции по ее воспроизведению и в поле *Components* укажите `Blink>Contacts`. Для демонстрации этапов воспроизведения ошибки удобно использовать [Glitch](https://glitch.com).

### Планируете использовать этот API?

Планируете использовать Contact Picker API? Ваш публичный интерес помогает команде Chrome определять приоритет функций и показывает важность их поддержки разработчикам других браузеров.

- Расскажите, как вы планируете использовать API, в [обсуждении WICG на Discourse](https://discourse.wicg.io/t/proposal-contact-picker-api/3507).
- Упомяните в твите [@ChromiumDev](https://twitter.com/chromiumdev), поставьте хештег [`#ContactPicker`](https://twitter.com/search?q=%23ContactPicker&src=typed_query&f=live) и расскажите, как вы используете этот API.

## Полезные ссылки {: #helpful }

- [Публичное пояснение](https://github.com/WICG/contact-api/).
- [Спецификация Contact Picker](https://wicg.github.io/contact-api/spec/).
- [Демонстрация Contact Picker API](https://contact-picker.glitch.me) и ее [исходный код](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0).
- [Отслеживание ошибок](https://bugs.chromium.org/p/chromium/issues/detail?id=860467).
- [Запись на ChromeStatus.com](https://www.chromestatus.com/feature/6511327140904960).
- Компонент Blink: `Blink>Contacts`.

### Благодарности

Большой привет и спасибо Финнуру Тораринссону (Finnur Thorarinsson) и Райану Кансо (Rayan Kanso), которые реализовали эту функцию, а также Питеру Беверлоо (Peter Beverloo), чей [код](https://tests.peter.sh/contact-api/) я бессовестно <strike>украл и</strike> подправил для демонстрации.

P. S. Имена в моем окне выбора контактов — это персонажи из «Алисы в стране чудес».
