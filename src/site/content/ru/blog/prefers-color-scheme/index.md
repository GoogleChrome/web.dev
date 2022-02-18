---
layout: post
title: "«И опять приходит тьма»: prefers-color-scheme"
subhead: Переоцененная возможность или необходимость? Всё о тёмном режиме и о том, как обеспечить его поддержку на благо пользователей!
authors:
  - thomassteiner
date: 2019-06-27
updated: 2020-08-02
hero: image/admin/dgDcIJUyuWB5xNn9CODd.jpg
hero_position: bottom
alt:
  Фото силуэта горы ночью, автор — Натан Андерсон (Nathan Anderson), платформа Unsplash.
description:
  Сегодня во многих устройствах есть тёмный режим в рамках всей ОС или просто тёмные темы.
  В этой статье рассказывается о поддержке тёмного режима на веб-страницах, приведены соответствующие рекомендации и описывается специальный элемент «dark-mode-toggle», благодаря которому пользователи могут переопределять настройки операционной системы на конкретных веб-страницах.
tags:
  - blog
  - css
feedback:
  - api
---

## Введение

{% Aside 'note' %} Я много изучал историю и теорию тёмного режима, поэтому если вас интересует только практическая работа с ним, смело [пропускайте введение](#activating-dark-mode-in-the-operating-system). {% endAside %}

### Тёмный режим до появления термина *тёмный режим*

<figure data-float="right">   {% Img src="image/admin/fmdRPm6K5SXiIRLgyz4y.jpg", alt="Компьютерный монитор с зеленым экраном", width="233", height="175" %}   <figcaption>Зеленый экран (<a href="https://commons.wikimedia.org/wiki/File:Compaq_Portable_and_Wordperfect.JPG">источник</a>) </figcaption></figure>

История с тёмным режимом замкнулась. На заре персональных компьютеров «тёмный режим» был не вопросом выбора, а единственной возможностью: монохромные <abbr title="Cathode-Ray Tube">ЭЛТ</abbr> в компьютерных мониторах испускали электронные лучи на фосфоресцирующий экран с зеленым люминофором. Текст отображался зеленым цветом на черном фоне, поэтому такие мониторы часто назывались [зелеными экранами](https://commons.wikimedia.org/wiki/File:Schneider_CPC6128_with_green_monitor_GT65,_start_screen.jpg).

<figure data-float="left">   {% Img src="image/admin/l9oDlIO59oyJiXVegxIV.jpg", alt="Обработка текста в режиме «тёмный текст на белом фоне»", width="222", height="175" %}   <figcaption>Тёмный текст на белом фоне (<a href="https://www.youtube.com/watch?v=qKkABzt0Zqg">источник</a>)</figcaption></figure>

Появившиеся впоследствии цветные ЭЛТ отображали несколько цветов — за счет использования красного, зеленого и синего люминофоров. Белый цвет формировался при одновременной активации всех трех люминофоров. С появлением более сложных <a>настольных издательских систем</a>, работающих по принципу <abbr>WYSIWYG</abbr>, стала популярной идея делать виртуальный документ похожим на физический лист бумаги.

<figure data-float="right">   {% Img src="image/admin/lnuLLcQzIF7r08lt479k.png", alt="Браузер WorldWideWeb с веб-страницей в режиме «тёмный текст на белом фоне»", width="233", height="175" %}   <figcaption>Браузер WorldWideWeb (<a href="https://commons.wikimedia.org/wiki/File:WorldWideWeb_FSF_GNU.png">источник</a>)</figcaption></figure>

Концепция *темный текст на белом фоне* прижилась и была перенесена в [ранний интернет](http://info.cern.ch/hypertext/WWW/TheProject.html), поскольку тогда веб-страницы представляли собой в первую очередь документ. Самый первый браузер — [WorldWideWeb](https://en.wikipedia.org/wiki/WorldWideWeb) (помните: [CSS еще не изобрели](https://en.wikipedia.org/wiki/Cascading_Style_Sheets#History)) [отображал веб-страницы](https://commons.wikimedia.org/wiki/File:WorldWideWeb_FSF_GNU.png) именно так. Интересно, что второй браузер — [Line Mode Browser](https://en.wikipedia.org/wiki/Line_Mode_Browser), работавший в терминале — отображал страницы зеленым текстом на тёмном фоне. В наши дни на веб-страницах и в веб-приложениях обычно используется тёмный текст на светлом фоне — это базовое предположение, которое, к тому же, жестко закодировано в таблицах стилей браузеров, включая [Chrome](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css).

<figure data-float="left">   {% Img src="image/admin/zCdyRdnAnbrB7aAB0TQi.jpg", alt="Человек использует смартфон, лежа в постели", width="262", height="175" %}   <figcaption>Человек использует смартфон, лежа в постели (источник: Unsplash)</figcaption></figure>

Времена ЭЛТ давно прошли. Мы начали потреблять и создавать контент на мобильных устройствах, в которых используются <abbr title="Liquid Crystal Display">ЖК</abbr>-дисплеи с подсветкой и энергоэффективные <abbr title="Active-Matrix Organic Light-Emitting Diode">AMOLED</abbr>-экраны. Уменьшение габаритов компьютеров, появление планшетов и смартфонов привело к новым моделям использования. Мы часто проводим досуг — просматриваем веб-страницы, программируем «для себя», запускаем игры, — после окончания рабочего дня в условиях низкой освещенности и даже в постели ночью. Чем больше людей используют гаджеты в темноте, тем популярней становится идея вернуться к отображению контента в режиме *светлый текст на тёмном фоне*.

### Зачем нужен тёмный режим

#### Использование тёмного режима по эстетическим соображениям

Если поспрашивать, [почему люди предпочитают тёмный режим](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d), самым популярным ответом будет *«меньше нагрузка на глаза»*, а на втором месте — *«это элегантно и красиво»*. Apple в [документации по тёмному режиму для разработчиков](https://developer.apple.com/documentation/appkit/supporting_dark_mode_in_your_interface) так и пишут: *«Выбор между тёмным и светлым внешним видом для большинства пользователей — вопрос эстетики и может не иметь отношения к условиям освещения».*

{% Aside 'note' %} Можете почитать [исследование о причинах, по которым пользователи выбирают тёмный режим, и вариантах его использования](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d). {% endAside %}

<figure data-float="right">   {% Img src="image/admin/WZ9I5g1YGG6S1TjygEIq.png", alt="CloseView в Mac OS System 7 с режимом «Черный на белом» (Black on White)", width="193", height="225" %}   <figcaption>System 7 CloseView (<a href="https://archive.org/details/mac_Macintosh_System_7_at_your_Fingertips_1992">источник</a>)</figcaption></figure>

#### Тёмный режим как инструмент специальных возможностей

Есть люди (например, пользователи со слабым зрением), которым тёмный режим *нужен* и которые используют его как инструмент специальных возможностей. Самый ранний вариант такого применения, который я смог найти, — это функция <em>CloseView</em> в <a>System 7</a>, в которой был переключатель режимов *Черный на белом* (Black on White) и *Белый на черном* (White on Black). System 7 поддерживала цветной режим, но интерфейс по умолчанию оставался черно-белым.

Недостатки основанных на инверсии вариантов стали очевидны с началом использования цветного режима. Проведенное Szpiro *et al.* исследование аудитории [об использовании вычислительных устройств людьми со слабым зрением](https://dl.acm.org/citation.cfm?id=2982168) показало, что всем опрошенным инвертированные изображения не нравились, но многие предпочитали светлый текст на тёмном фоне. Apple учитывает такое предпочтение пользователем посредством функции [Smart Invert](https://www.apple.com//accessibility/iphone/vision/), которая инвертирует цвета на экране, за исключением изображений, мультимедийных файлов и некоторых приложений, использующих стили с тёмными цветами.

Существует особая форма слабого зрения — «синдром компьютерного зрения», также известный как зрительное утомление от цифровых устройств и [определяемый](https://onlinelibrary.wiley.com/doi/full/10.1111/j.1475-1313.2011.00834.x) как *«сочетание проблем с глазами и зрением, связанных с использованием компьютеров (включая настольные, портативные и планшеты) и других электронных дисплеев (например, смартфонов и электронных устройств для чтения)»*. [Предполагают](https://bmjopen.bmj.com/content/5/1/e006748), что использование электронных устройств подростками, особенно в ночное время, повышает риск снижения продолжительности сна, задержку начала сна и дефицит сна. Кроме того, неоднократно [сообщалось](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4254760/), что воздействие синего света влияет на регуляцию [циркадного ритма](https://en.wikipedia.org/wiki/Circadian_rhythm) и цикла сна, причем нерегулярные условия освещения могут приводить к депривации сна, что будет влиять на настроение и эффективность работы (см. [исследование Розенфилда](https://www.college-optometrists.org/oip-resource/computer-vision-syndrome--a-k-a--digital-eye-strain.html). Снизить эти отрицательные эффекты можно, если уменьшить количество синего цвета посредством настройки цветовой температуры дисплея с помощью таких функций, как [Night Shift](https://support.apple.com/en-us/HT207570) в iOS или [Ночная подсветка](https://support.google.com/pixelphone/answer/7169926?) (Night Light) в Android. Также следует избегать яркого и нерегулярного освещения в целом — с помощью тёмного режима (или темы).

#### Энергосбережение в тёмном режиме на AMOLED-экранах

Наконец, тёмный режим позволяет *существенно* экономить энергию на <abbr title="Active-Matrix Organic Light-Emitting Diode">AMOLED</abbr>-экранах. Практические исследования популярных приложений Google на устройствах Android (например, YouTube) показали, что экономия может достигать 60 %. В видео ниже рассказывается подробнее об этих исследованиях и об экономии энергии для различных приложений.

<figure data-size="full">   {% YouTube id='N_6sPd0Jd3g', startTime='305' %}</figure>

## Активация тёмного режима в операционной системе

Итак, мы рассмотрели предысторию тёмного режима и разобрались, почему его наличие важно для многих пользователей. Теперь давайте посмотрим, как обеспечить его поддержку.

<figure data-float="left">   {% Img src="image/admin/Yh6SEoWDK1SbqcGjlL6d.png", alt="Настройки тёмной темы в Android Q", width="218", height="250" %}   <figcaption>Настройки тёмной темы в Android Q</figcaption></figure>

Если операционная система поддерживает тёмный режим (или тему), обычно где-нибудь в настройках есть соответствующий переключатель. В macOS X он находится в разделе *Основные* системных настроек и называется *Оформление* (<a href="%7B%7B%20'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lUAnDhiGiZxigDbCqfn1.png'%20%7C%20imgix%20%7D%7D">скриншот</a>), а в Windows 10 его можно найти в разделе *Цвета*: пункт *Выберите свой цвет* (<a href="%7B%7B%20'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ahr8nkFttRPCe4RH8IEk.png'%20%7C%20imgix%20%7D%7D">скриншот</a>). В Android Q нужно перейти в раздел *Экран* и активировать переключатель *Тёмная тема* (<a href="%7B%7B%20'image/admin/Yh6SEoWDK1SbqcGjlL6d.png'%20%7C%20imgix%20%7D%7D">скриншот</a>), а на iOS 13 — в *Оформление* в разделе *Экран и яркость* в настройках (<a href="%7B%7B%20'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K0QTu4Elw1ETabtoJjZ1.jpg'%20%7C%20imgix%20%7D%7D">скриншот</a>).

## Запрос медиа `prefers-color-scheme`

Еще немного теории, прежде чем мы двинемся дальше. [Запросы медиа](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries) позволяют тестировать и запрашивать значения и функции агента пользователя или устройства отображения независимо от того, какой документ отрисовывается. Они используются в CSS-правиле `@media` для условного применения стилей к документу, а также в других контекстах и языках (например, HTML и JavaScript). Спецификация [запросов медиа, уровень 5](https://drafts.csswg.org/mediaqueries-5/), вводит так называемые функции медиа для пользовательских предпочтений, которые позволяют сайту определить предпочитаемый пользователем способ отображения контента.

{% Aside 'note' %} ☝️ Среди функций медиа для предпочтений пользователя есть `prefers-reduced-motion`, которая указывает на то, что пользователь хочет видеть на странице меньше движения. Я уже <a href="https://developers.google.com/web/updates/2019/03/prefers-reduced-motion" data-md-type="link">писал о `prefers-reduced-motion`</a> раньше. {% endAside %}

Функция медиа [`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme) позволяет узнать, какую цветовую тему запросил пользователь для страницы: тёмную или светлую. Значения могут быть следующими:

- `light`: пользователь уведомил систему о том, что предпочитает светлую тему на странице (тёмный текст на светлом фоне);
- `dark`: пользователь уведомил систему о том, что предпочитает тёмную тему на странице (светлый текст на тёмном фоне).

{% Aside 'note' %} В ранней версии спецификации было и третье значение — `no-preference`, означавшее, что системе неизвестно о предпочтениях пользователя. Однако ни один браузер его не реализовал, поэтому оно было [удалено](https://github.com/w3c/csswg-drafts/issues/3857#issuecomment-634779976) из спецификации. {% endAside%}

## Поддержка тёмного режима

### Выясняем, поддерживает ли браузер тёмный режим

Сообщение о поддержке тёмного режима передается через запрос медиа, поэтому можно легко проверить, поддерживает ли текущий браузер тёмный режим: для этого достаточно запросить `prefers-color-scheme`. Обратите внимание: я не указываю значение, а просто проверяю запрос медиа на соответствие.

```js
if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
  console.log('🎉 Тёмный режим поддерживается');
}
```

На момент написания статьи `prefers-color-scheme` поддерживается на настольных ПК и мобильных устройствах (где это возможно) браузерами Chrome и Edge с версии 76, Firefox — с версии 67, Safari — с версии 12.1 для macOS и с версии 13 для iOS. Данные о поддержке в остальных браузерах смотрите в таблицах на [Can I use](https://caniuse.com/#feat=prefers-color-scheme).

{% Aside 'note' %} Есть специальный элемент [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle), который добавляет поддержку тёмного режима в старые браузеры (см. [далее в статье](#the-lessdark-mode-togglegreater-custom-element)). {% endAside%}

### Данные о предпочтениях пользователя в момент запроса

Заголовок состояния клиента [`Sec-CH-Prefers-Color-Scheme`](/user-preference-media-features-headers/) позволяет сайтам получать предпочтения по цветовой схеме в момент запроса, благодаря чему сервер может встроить нужный CSS и, следовательно, избежать неправильной цветовой темы.

### Тёмный режим на практике

Теперь наконец посмотрим, как поддержка тёмного режима обеспечивается на практике. Как и в [Горце](https://en.wikipedia.org/wiki/Highlander_(film)), цветовой режим *должен быть только один*: или тёмный, или светлый! Почему я об этом упоминаю? Потому что это будет влиять на стратегию загрузки. **Браузер в пути критичной отрисовки не должен скачивать CSS для режима, который пользователю сейчас не нужен**. В примере, который на практике демонстрирует следующие рекомендации, я для повышения скорости загрузки разделил CSS на три части — чтобы [отложить некритичные стили](/defer-non-critical-css/):

- `style.css` — общие правила, которые используются на сайте в целом;
- `dark.css` — правила, необходимые только для тёмного режима;
- `light.css` — правила, необходимые только для светлого режима.

### Стратегия загрузки

Две последних таблицы стилей — `light.css` и `dark.css` — загружаются условно с помощью запроса `<link media>`. Поначалу [не все браузеры будут поддерживать `prefers-color-scheme`](https://caniuse.com/#feat=prefers-color-scheme) (как определить, есть ли поддержка, [см. выше](#finding-out-if-dark-mode-is-supported-by-the-browser)). Поэтому я загружаю файл по умолчанию `light.css` через условно вставленный элемент `<link rel="stylesheet">` в небольшом встроенном скрипте (резервным вариантом по умолчанию может быть и тёмная тема — это не принципиально). Чтобы избежать [кратковременного показа контента без стилей](https://en.wikipedia.org/wiki/Flash_of_unstyled_content), я скрываю содержимое страницы до тех пор, пока не загрузится `light.css`.

```html
<script>
  // Если `prefers-color-scheme` не поддерживается, переходим в светлый режим.
  // В этом случае `light.css` будет скачан с приоритетом `highest` (самый высокий).
  if (window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') {
    document.documentElement.style.display = 'none';
    document.head.insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="/light.css" onload="document.documentElement.style.display = \'\'">',
    );
  }
</script>
<!--
  Условная загрузка светлой или тёмной таблицы стилей. Соответствующий запросу файл
  будет скачан с приоритетом `highest` (самый высокий), не соответствующий — с приоритетом `lowest`
  (самый низкий). Если браузер не поддерживает `prefers-color-scheme`, ответ на запрос медиа
  неизвестен и файлы скачиваются с приоритетом `lowest` (но
  выше я уже установил `highest` для светлой темы по умолчанию).
-->
<link rel="stylesheet" href="/dark.css" media="(prefers-color-scheme: dark)" />
<link
  rel="stylesheet"
  href="/light.css"
  media="(prefers-color-scheme: light)"
/>
<!-- Основная таблица стилей -->
<link rel="stylesheet" href="/style.css" />
```

### Структура таблицы стилей

Я широко использую [переменные CSS](https://developer.mozilla.org/docs/Web/CSS/var): это позволяет моему универсальному `style.css` быть… универсальным. Настройка для светлого и тёмного режимов производится в двух других файлах: `dark.css` и `light.css`. Ниже приведен фрагмент самих стилей — по нему общая идея должна быть понятна. Я объявляю две переменные: `-⁠-⁠color` и `-⁠-⁠background-color`, которые, по сути, задают базовые темы *тёмный на светлом* и *светлый на тёмном*.

```css
/* light.css: 👉 тёмный на светлом */
:root {
  --color: rgb(5, 5, 5);
  --background-color: rgb(250, 250, 250);
}
```

```css
/* dark.css: 👉 светлый на тёмном */
:root {
  --color: rgb(250, 250, 250);
  --background-color: rgb(5, 5, 5);
}
```

Затем в `style.css` я использую эти переменные в правиле `body { … }`. Они определены в [псевдоклассе CSS `:root`](https://developer.mozilla.org/docs/Web/CSS/:root) — селекторе, который в HTML представляет собой элемент `<html>` и идентичен селектору `html`, за исключением того, что его специфичность выше. Благодаря этому переменные проходят по иерархии вниз, что позволяет объявлять глобальные переменные CSS.

```css
/* style.css */
:root {
  color-scheme: light dark;
}

body {
  color: var(--color);
  background-color: var(--background-color);
}
```

В примере кода выше вы наверняка заметили свойство [`color-scheme`](https://drafts.csswg.org/css-color-adjust-1/#propdef-color-scheme) со значением `light dark` (пробел в качестве разделителя).

Оно сообщает браузеру, какие цветовые темы поддерживает приложение, и позволяет активировать специальные варианты таблицы стилей в агенте пользователя, что полезно, например, чтобы браузер мог отрисовывать поля формы с тёмным фоном и светлым текстом, настроить полосы прокрутки, или использовать цвет выделения с учетом темы. Подробнее свойство `color-scheme` описано в [модуле настройки цвета CSS, уровень 1](https://drafts.csswg.org/css-color-adjust-1/).

{% Aside 'note' %} 🌒 Можете почитать [подробнее о работе `color-scheme`](/color-scheme/). {% endAside %}

Всё остальное — это просто определение переменных CSS для элементов на сайте. При работе с тёмным режимом очень помогает семантическая организация стилей. Например, вместо `-⁠-⁠highlight-yellow` можно использовать переменную `-⁠-⁠accent-color`, поскольку «yellow» (желтый) может и не быть желтым в тёмном режиме. Ниже — еще нескольких переменных, которые я использовал в примере.

```css
/* dark.css */
:root {
  --color: rgb(250, 250, 250);
  --background-color: rgb(5, 5, 5);
  --link-color: rgb(0, 188, 212);
  --main-headline-color: rgb(233, 30, 99);
  --accent-background-color: rgb(0, 188, 212);
  --accent-color: rgb(5, 5, 5);
}
```

```css
/* light.css */
:root {
  --color: rgb(5, 5, 5);
  --background-color: rgb(250, 250, 250);
  --link-color: rgb(0, 0, 238);
  --main-headline-color: rgb(0, 0, 192);
  --accent-background-color: rgb(0, 0, 238);
  --accent-color: rgb(250, 250, 250);
}
```

### Полный пример

В следующем [фрагменте на Glitch](https://dark-mode-baseline.glitch.me/) можно ознакомиться с полным примером, реализующим изложенные выше концепции. Попробуйте включить (выключить) тёмный режим в [настройках операционной системы](#activating-dark-mode-in-the-operating-system) и посмотрите, как отреагирует страница.

<div style="height: 900px; width: 100%;">   {% IFrame {     allow: 'geolocation; microphone; camera; midi; vr; encrypted-media',     src: 'https://glitch.com/embed/#!/embed/dark-mode-baseline?path=style.css&amp;previewSize=100&amp;attributionHidden=true'   } %}</div>

### Влияние на загрузку

Поиграв с моим примером, вы увидите, почему я загружаю `dark.css` и `light.css` через запросы медиа. Попробуйте переключить цветовой режим и перезагрузить страницу: не соответствующие запросу таблицы стилей будут загружаться, но уже с самым низким приоритетом, и поэтому не будут мешать ресурсам, которые нужны сайту в данный момент.

{% Aside 'note' %} 😲 Можете почитать [о том, почему браузеры загружают таблицы стилей, не соответствующие запросам медиа](https://blog.tomayac.com/2018/11/08/why-browsers-download-stylesheets-with-non-matching-media-queries-180513). {% endAside %}

<figure>   {% Img src="image/admin/flTdLliru6GmqqlOKjNx.png", alt="Диаграмма сетевой загрузки: в светлом режиме CSS-файл тёмного режима загружается с самым низким приоритетом", width="800", height="417" %}   <figcaption>Сайт в светлом режиме загружает CSS для тёмного режима с самым низким приоритетом.</figcaption></figure>

<figure>   {% Img src="image/admin/IDs6Le0VBhHu9QEDdxL6.png", alt="Диаграмма сетевой загрузки: в тёмном режиме CSS-файл светлого режима загружается с самым низким приоритетом", width="800", height="417" %}   <figcaption>Сайт в тёмном режиме загружает CSS для светлого режима с самым низким приоритетом.</figcaption></figure>

<figure>   {% Img src="image/admin/zJqu5k3TIgcZf1OHWWIq.png", alt="Диаграмма сетевой загрузки: в используемом по умолчанию светлом режиме CSS-файл тёмного режима загружается с самым низким приоритетом", width="800", height="417" %}   <figcaption>Сайт в используемом по умолчанию светлом режиме в браузере, который не поддерживает <code>prefers-color-scheme</code>, загружает CSS для тёмного режима с самым низким приоритетом.</figcaption></figure>

### Реакция на включение (выключение) тёмного режима

На изменение состояния тёмного режима можно подписаться через JavaScript, как и на любое другое изменение запроса медиа. Так можно, например, динамически изменять [значок сайта](https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#provide_great_icons_tiles) на странице или значение [`<meta name="theme-color">`](https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#meta_theme_color_for_chrome_and_opera), которое определяет цвет панели адреса в Chrome. [Полный пример](#full-example) выше показывает эту возможность в действии: чтобы увидеть изменение значка и цвета темы, откройте [демонстрацию в отдельной вкладке](https://dark-mode-baseline.glitch.me/).

```js
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addListener((e) => {
  const darkModeOn = e.matches;
  console.log(`Тёмный режим ${darkModeOn ? '🌒 включен' : '☀️ выключен'}.`);
});
```

В браузерах Chromium (с версии 93) и Safari (с версии 15) цвет можно настраивать на основе запроса медиа с атрибутом `media` элемента цвета темы `meta`. При этом будет выбрано первое совпадение. Например, у вас может быть один цвет для светлого режима и другой — для тёмного. На момент написания статьи определить это в манифесте нельзя. См. [проблему w3c/manifest № 975 на GitHub](https://github.com/w3c/manifest/issues/975).

```html
<meta
  name="theme-color"
  media="(prefers-color-scheme: light)"
  content="white"
/>
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
```

## Отладка и тестирование тёмного режима

### Эмуляция `prefers-color-scheme` в DevTools

Переключать цветовую схему операционной системы быстро надоедает, поэтому теперь DevTools в Chrome позволяют эмулировать предпочитаемую цветовую схему пользователя так, что это влияет только на текущую вкладку. Откройте [командное меню](https://developers.google.com/web/tools/chrome-devtools/command-menu), начните вводить слово `Отрисовка` (`Rendering`) и запустите команду <code>Показать "Отрисовка"</code> (<code>Show Rendering</code>), а затем измените параметр <strong>Эмулировать медиафункцию CSS prefers-color-scheme</strong> (Emulate CSS media feature prefers-color-scheme).

<figure>   {% Img src="image/admin/RIq2z6Ja1zSzfNTHic5z.png", alt="Скриншот с параметром «Эмулировать медиафункцию CSS prefers-color-scheme» (Emulate CSS media feature prefers-color-scheme) на вкладке «Отрисовка» (Rendering) в DevTools браузера Chrome", width="800", height="552" %}</figure>

### Как делать скриншоты для `prefers-color-scheme` с помощью Puppeteer

[Puppeteer](https://github.com/GoogleChrome/puppeteer/) — это библиотека Node.js, которая дает высокоуровневый API для управления Chrome (Chromium) по [протоколу DevTools](https://chromedevtools.github.io/devtools-protocol/). Пакет [`dark-mode-screenshot`](https://www.npmjs.com/package/dark-mode-screenshot) представляет собой скрипт Puppeteer, позволяющий делать скриншоты страниц в тёмном и светлом режиме. Его можно запускать по необходимости, а можно добавить в набор тестов для непрерывной интеграции (CI).

```bash
npx dark-mode-screenshot --url https://googlechromelabs.github.io/dark-mode-toggle/demo/ --output screenshot --fullPage --pause 750
```

## Советы по реализации тёмного режима

### Избегайте чисто белого цвета

Вы могли заметить, что я использую не чистый белый цвет, а слегка более тёмный оттенок — чтобы не было свечения на фоне тёмного контента. Значение вроде `rgb(250, 250, 250)` отлично подойдет.

### Перекрашивание и затемнение фото

Сравнив скриншоты ниже, вы заметите, что изменилась не только основная тема (от *тёмного на светлом* к *светлому на тёмном*): главное изображение также выглядит иначе. Мое [исследование](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b) показало, что большинство опрошенных, работая в тёмном режиме, предпочитают чуть менее яркие изображения. Именно в этом смысле я использую термин *перекрашивание*.

<div class="switcher">
  <figure>     {% Img src="image/admin/qzzYCKNSwoJr9BBEQlR7.png", alt="Главное изображение в тёмном режиме слегка затемнено", width="800", height="618" %}     <figcaption>       Главное изображение в тёмном режиме слегка затемнено     </figcaption></figure>
  <figure>     {% Img src="image/admin/41RbLRZ5wzkoVnIRJkNl.png", alt="Главное изображение в светлом режиме", width="800", height="618" %}     <figcaption>       Главное изображение в светлом режиме     </figcaption></figure>
</div>

Перекрасить изображения можно с помощью CSS-фильтра. Я использую селектор, выбирающий все изображения, в URL-адресе которых нет `.svg`: векторную графику (значки) можно перекрасить по-другому — подробнее об этом в [следующем абзаце](#vector-graphics-and-icons). Обратите внимание, что я снова использую [переменную CSS](https://developer.mozilla.org/docs/Web/CSS/var) — чтобы позже фильтр можно было легко изменить.

{% Aside 'note' %} 🎨 Можете почитать [исследование аудитории о предпочтениях по «перекрашиванию» в тёмном режиме](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b). {% endAside %}

Перекрашивание нужно только в тёмном режиме, то есть когда активен `dark.css`, поэтому в `light.css` соответствующих правил нет.

```css
/* dark.css */
--image-filter: grayscale(50%);

img:not([src*='.svg']) {
  filter: var(--image-filter);
}
```

#### Настройка интенсивности перекрашивания с помощью JavaScript

Все мы разные, и у всех разные требования к тёмному режиму. Используя описанный выше способ перекрашивания, интенсивность оттенков серого можно сделать пользовательской настройкой [и изменять ее через JavaScript](https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties#Values_in_JavaScript). А установив значение `0%`, можно полностью отключить перекрашивание. Помните, что [`document.documentElement`](https://developer.mozilla.org/docs/Web/API/Document/documentElement) дает ссылку на корневой элемент документа — то есть, на тот же элемент, на который я могу ссылаться посредством [псевдокласса CSS `:root`](https://developer.mozilla.org/docs/Web/CSS/:root).

```js
const filter = 'grayscale(70%)';
document.documentElement.style.setProperty('--image-filter', value);
```

### Инверсия векторной графики и значков

Для векторной графики (в моем случае это значки, на которые я ссылаюсь через элементы `<img>`) способ перекрашивания другой. Согласно [исследованию людей со слабым зрением](https://dl.acm.org/citation.cfm?id=2982168), инверсия фото пользователям не нравится, но для большинства значков она работает хорошо. Здесь я также использую переменные CSS для задания степени инверсии в обычном состоянии и при наведении курсора — [`:hover`](https://developer.mozilla.org/docs/Web/CSS/:hover).

<div class="switcher">
  <figure>     {% Img src="image/admin/JGYFpAPi4233HrEKTQZp.png", alt="Инвертированные значки в тёмном режиме", width="744", height="48" %}     <figcaption>       Инвертированные значки в тёмном режиме     </figcaption></figure>
  <figure>     {% Img src="image/admin/W8AWbuqWthI6CfFsYunk.png", alt="Обычные значки в светлом режиме", width="744", height="48" %}     <figcaption>       Обычные значки в светлом режиме     </figcaption></figure>
</div>

Заметьте, что инвертирую значки я тоже только в `dark.css`, но не в `light.css`. Кроме того, у `:hover` интенсивность инверсии для двух случаев различается: в зависимости от выбранного пользователем режима значок отображается или немного темнее, или немного ярче.

```css
/* dark.css */
--icon-filter: invert(100%);
--icon-filter_hover: invert(40%);

img[src*='.svg'] {
  filter: var(--icon-filter);
}
```

```css
/* light.css */
--icon-filter_hover: invert(60%);
```

```css
/* style.css */
img[src*='.svg']:hover {
  filter: var(--icon-filter_hover);
}
```

### Использование `currentColor` для встроенных SVG

Для *встроенных* SVG вместо [фильтров инверсии](#invert-vector-graphics-and-icons) можно использовать ключевое слово CSS [`currentColor`](https://developer.mozilla.org/docs/Web/CSS/color_value#currentColor_keyword), которое представляет значение свойства `color` элемента. Это позволяет применять `color` для свойств, которые не получают это значение по умолчанию. Удобно, что если `currentColor` используется как значение [атрибутов `fill` и `stroke`](https://developer.mozilla.org/docs/Web/SVG/Tutorial/Fills_and_Strokes#Fill_and_Stroke_Attributes), оно берет свое значение из унаследованного значения свойства цвета. А что еще лучше, так это то, что такой подход работает и для [`<svg><use href="…"></svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/use), поэтому даже для отдельных ресурсов `currentColor` может применяться в контексте. Помните, что это работает только для SVG, которые *встроены* или используются через `<use href="…">`, но не для SVG, используемых по ссылке `src` в элементе изображения или иным образом через CSS. Пример смотрите в демонстрации ниже.

```html/2
<!-- Встроенный SVG -->
<svg xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
>
  […]
</svg>
```

<div style="height: 950px; width: 100%;">   {% IFrame {     allow: 'geolocation; microphone; camera; midi; vr; encrypted-media',     src: 'https://glitch.com/embed/#!/embed/dark-mode-currentcolor?path=light.css&amp;previewSize=100',     title: 'dark-mode-currentcolor на Glitch'   } %}</div>

### Плавные переходы между режимами

Переключение из тёмного режима в светлый и наоборот можно сгладить: у `color` и `background-color` есть [анимируемые CSS-свойства](https://www.quackit.com/css/css3/animations/animatable_properties/). Чтобы создать анимацию, достаточно объявить два перехода (`transition`) для двух свойств. В примере ниже проиллюстрирована общая идея. Как это работает, можно посмотреть [в демонстрации](https://dark-mode-baseline.glitch.me/).

```css
body {
  --duration: 0.5s;
  --timing: ease;

  color: var(--color);
  background-color: var(--background-color);

  transition: color var(--duration) var(--timing), background-color var(
        --duration
      ) var(--timing);
}
```

### Выбор художественного оформления в тёмном режиме

В целом из соображений скорости загрузки я рекомендую работать с `prefers-color-scheme` исключительно в атрибуте `media` элементов `<link>` (а не со встроенными элементами в таблицах стилей). Однако бывают случаи, когда `prefers-color-scheme` лучше использовать и во встроенных элементах HTML-кода: например, когда нужно задать художественное оформление — то есть, общий визуальный стиль страницы и ее визуальный «язык», то, как она влияет на настроение, противопоставляет элементы и психологически обращается к целевой аудитории.

В нашем случае дизайнер должен решить, какое изображение лучше всего будет работать в конкретном режиме, и может быть <em>недостаточно</em> просто <a>перекрасить изображения</a>. К счастью, элемент `<source>` показываемого изображения при использовании с `<picture>` может зависеть от атрибута `media`. В примере ниже для тёмного режима показано западное полушарие, а для светлого — восточное. Если предпочтение не указано, в остальных случаях также отображается восточное. Понятно, что это сделано исключительно в иллюстративных целях. Чтобы посмотреть, как меняется изображение, попереключайте тёмный режим на устройстве.

```html
<picture>
  <source srcset="western.webp" media="(prefers-color-scheme: dark)" />
  <source srcset="eastern.webp" media="(prefers-color-scheme: light)" />
  <img src="eastern.webp" />
</picture>
```

<div style="height: 600px; width: 100%;">   {% IFrame {     allow: 'geolocation; microphone; camera; midi; vr; encrypted-media',     src: 'https://glitch.com/embed/#!/embed/dark-mode-picture?path=index.html&amp;previewSize=100',     title: 'dark-mode-picture на Glitch'   } %}</div>

### Тёмный режим с возможностью отмены

Как упоминалось выше в разделе [Зачем нужен тёмный режим](#why-dark-mode), основная причина его выбора для большинства пользователей — эстетическая. Поэтому кому-то может быть удобно, чтобы интерфейс операционной системы использовал тёмный режим, а веб-страницы отображались обычным образом. Следовательно, хорошим решением будет учитывать сигнал, отправляемый браузером посредством `prefers-color-scheme`, но давать пользователям возможность переопределить системную настройку.

#### Специальный элемент `<dark-mode-toggle>`

Я не сомневаюсь, что вы можете и сами написать соответствующий код, но проще и быстрее использовать готовый элемент (веб-компонент), который я написал специально для этой цели, — [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle): он добавляет переключатель тёмного режима (вкл./выкл.) или темы (светлая или тёмная) на страницу, и его можно настроить под себя. В примере ниже этот элемент показан в в действии (ой! 🤫 оказывается, я затащил его и во все [остальные](https://dark-mode-baseline.glitch.me/) [примеры](https://dark-mode-currentcolor.glitch.me/) [выше](https://dark-mode-picture.glitch.me/)).

```html
<dark-mode-toggle
  legend="Переключатель тем"
  appearance="switch"
  dark="Тёмная"
  light="Светлая"
  remember="Запомнить"
></dark-mode-toggle>
```

<div class="switcher">
  <figure>     {% Img src="image/admin/Xy3uus69HnrkRPO4EuRu.png", alt="{dark-mode-toggle0} в светлом режиме", width="140", height="76" %}     <figcaption>       <code><dark-mode-toggle></code> в светлом режиме     </figcaption>   {/dark-mode-toggle0}</figure>
  <figure>     {% Img src="image/admin/glRVRJpQ9hMip6MbqY9N.png", alt="{dark-mode-toggle0} в тёмном режиме", width="140", height="76" %}     <figcaption>       <code><dark-mode-toggle></code> в тёмном режиме     </figcaption>   {/dark-mode-toggle0}</figure>
</div>

Понажимайте на элементы управления тёмным режимом справа вверху в демонстрации ниже. Если установить флажок в третьем и четвертом элементах, выбранный режим сохранится, даже если перезагрузить страницу. Так посетители сайта смогут использовать интерфейс системы в тёмном режиме, а сайт просматривать в светлом — и наоборот.

<div style="height: 800px; width: 100%;">   {% IFrame {     allow: 'geolocation; microphone; camera; midi; vr; encrypted-media',     src: 'https://googlechromelabs.github.io/dark-mode-toggle/demo/index.html'   } %}</div>

## Заключение

Работать с тёмным режимом и реализовывать его поддержку интересно; это открывает новые дизайнерские возможности. Если раньше кто-то не мог пользоваться вашим сайтом из-за отсутствия тёмного режима, то теперь у вас будет еще один счастливый пользователь. Безусловно, вы обнаружите подводные камни и вам придется тщательно всё протестировать, но в любом случае тёмный режим — это отличная возможность показать, что вы заботитесь обо всех посетителях. Рекомендации в этой статье и удобства вроде специального элемента [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle) помогут вам с легкостью реализовать продуманный и удобный тёмный режим. Если статья вам пригодилась, [твитните об этом](https://twitter.com/tomayac) мне. Если если предложения, как ее улучшить, — тоже пишите. Спасибо за то, что уделили внимание! 🌒

## Ссылки по теме

Материалы для запроса медиа `prefers-color-scheme`:

- [Страница состояния платформы Chrome](https://chromestatus.com/feature/5109758977638400).
- [Ошибка в Chromium](https://crbug.com/889087).
- [Спецификация запросов медиа, уровень 5](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme).

Материалы для свойства CSS и метатега `color-scheme`:

- [Метатег и свойство CSS `color-scheme`](/color-scheme/).
- [Страница состояния платформы Chrome](https://chromestatus.com/feature/5330651267989504).
- [Ошибка в Chromium](http://crbug.com/925935).
- [Спецификация модуля настройки цвета CSS, уровень 1](https://drafts.csswg.org/css-color-adjust-1/).
- [Проблема с метатегом и свойством CSS в CSS WG (GitHub)](https://github.com/w3c/csswg-drafts/issues/3299).
- [Проблема с метатегом в HTML WHATWG (GitHub)](https://github.com/whatwg/html/issues/4504).

Общая информация по тёмному режиму:

- [Тёмная тема в Material Design](https://material.io/design/color/dark-theme.html).
- [Тёмный режим в Web Inspector](https://webkit.org/blog/8892/dark-mode-in-web-inspector/).
- [Поддержка тёмного режима в WebKit](https://webkit.org/blog/8840/dark-mode-support-in-webkit/).
- [Тёмный режим в руководстве Human Interface Guidelines от Apple](https://developer.apple.com/design/human-interface-guidelines/macos/visual-design/dark-mode/).

Статьи по истории использования тёмного режима:

- [Что делает "supported-color-schemes"? 🤔](https://medium.com/dev-channel/what-does-dark-modes-supported-color-schemes-actually-do-69c2eacdfa1d)
- [Да будет тьма! 🌚 Или нет…](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d)
- [Перекрашивание для тёмного режима](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b).

## Благодарности

Реализация функции медиа `prefers-color-scheme`, свойства CSS `color-scheme` и соответствующего метатега — это работа 👏 [Руне Лиллесвена](https://twitter.com/runeli). Руне также соредактор спецификации [модуля настройки цвета CSS, уровень 1](https://drafts.csswg.org/css-color-adjust-1/). Мне хотелось бы 🙏 поблагодарить [Лукаша Збылута](https://www.linkedin.com/in/lukasz-zbylut/), [Роуэна Меревуда](https://twitter.com/rowan_m), [Чирага Десаи](https://www.linkedin.com/in/chiragd/), и [Роба Додсона](https://twitter.com/rob_dodson) за детальную проверку этой статьи. [Стратегия загрузки](#loading-strategy) — детище [Джейка Арчибальда](https://twitter.com/jaffathecake). [Эмилио Кобос Альварес](https://twitter.com/ecbos_) указал мне правильный метод обнаружения `prefers-color-scheme`. Подсказку для SVG по ссылкам и `currentColor` я получил от [Тимоти Хэтчера](https://twitter.com/xeenon). Наконец, я благодарю анонимных участников различных исследований аудитории, которые помогли сформировать рекомендации, изложенные в этой статье. Автор главного изображения — [Натан Андерсон](https://unsplash.com/photos/kujXUuh1X0o).
