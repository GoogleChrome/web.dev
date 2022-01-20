---
layout: post
title: "Пользовательские маркеры с помощью CSS ::marker"
subhead: Теперь можно легко настроить цвет, размер и тип пункта или маркера при использовании <ul> или <ol>.
authors:
  - adamargyle
  - loirooriol
description: Теперь можно легко настроить цвет, размер и тип пункта или маркера при использовании <ul> или <ol>.
tags:
  - blog
  - css
date: 2020-09-02
updated: 2020-09-02
scheduled: 'true'
hero: image/admin/GPGTyXJOh0cH0wa1PvXH.png
thumbnail: image/admin/jbdOq0tGGzobMtaBsajn.png
alt: Отображение анатомии одного элемента списка путем помещения отдельных рамок вокруг маркера и текста
feedback:
  - api
---

Благодаря Igalia при поддержке Bloomberg мы наконец-то можем избавиться от костылей для стилей списков. Посмотрите!

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOmqXrog0YoriZqqIzEZ.png", alt="", width="665", height="384" %} <figcaption> <a href="https://glitch.com/edit/#!/marker-fun-example">Посмотреть в источнике</a> </figcaption></figure>

Благодаря селектору [CSS `::marker`](https://www.w3.org/TR/css-lists-3/#marker-pseudo) мы можем изменять содержимое и некоторые стили маркеров и чисел.

## Совместимость с браузерами

`::marker` поддерживается в Firefox для настольных компьютеров и Android, Safari для настольных компьютеров и iOS (только свойства `color` и `font-*`, см. [ошибку 204163](https://bugs.webkit.org/show_bug.cgi?id=204163)), а также в браузерах для настольных компьютеров и Android на базе Chromium. См. обновления в таблице [совместимости с браузерами](https://developer.mozilla.org/docs/Web/CSS/::marker#Browser_compatibility) MDN.

## Псевдоэлементы

Рассмотрим следующий базовый маркированный список HTML:

```html
<ul>
  <li>Lorem ipsum dolor sit amet consectetur adipisicing elit</li>
  <li>Dolores quaerat illo totam porro</li>
  <li>Quidem aliquid perferendis voluptates</li>
  <li>Ipsa adipisci fugit assumenda dicta voluptates nihil reprehenderit consequatur alias facilis rem</li>
  <li>Fuga</li>
</ul>
```

В результате получается такой ожидаемый рендеринг:

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-plain-list?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Точка в начале каждого элемента `<li>` является произвольной! Браузер рисует и создает за вас сгенерированную рамку маркера.

Сегодня мы рады поговорить о псевдоэлементе `::marker`, который дает возможность стилизовать элемент маркера, который браузер создает за вас.

{% Aside 'key-term' %} Псевдоэлемент представляет элемент в документе, отличный от тех, которые существуют в дереве документа. Например, вы можете выбрать первую строку абзаца с помощью псевдоэлемента `p::first-line`, даже если нет HTML-элемента, обертывающего эту строку текста. {% endAside %}

### Создание маркера

Блок псевдоэлемента маркера `::marker` автоматически создается внутри каждого элемента списка перед фактическим содержимым и псевдоэлементом `::before`.

```css
li::before {
  content: "::before";
  background: lightgray;
  border-radius: 1ch;
  padding-inline: 1ch;
  margin-inline-end: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 340px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-before-example?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Обычно элементы списка являются элементами HTML `<li>`, но другие элементы также могут стать элементами списка с помощью `display: list-item` .

```html
<dl>
  <dt>Lorem</dt>
  <dd>Lorem ipsum dolor sit amet consectetur adipisicing elit</dd>
  <dd>Dolores quaerat illo totam porro</dd>

  <dt>Ipsum</dt>
  <dd>Quidem aliquid perferendis voluptates</dd>
</dl>
```

```css/1
dd {
  display: list-item;
  list-style-type: "🤯";
  padding-inline-start: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-definition-list?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### Стилизация маркера

До `::marker` списки можно было стилизовать с помощью `list-style-type` и `list-style-image`, чтобы изменить символ элемента списка с помощью одной строки CSS:

```css
li {
  list-style-image: url(/right-arrow.svg);
  /* ИЛИ */
  list-style-type: '👉';
  padding-inline-start: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-list-style-type?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Это удобно, но нам нужно больше. А как насчет изменения цвета, размера, интервала и т. д.?! Вот где на помощь приходит `::marker`. Он позволяет индивидуально и глобально выбирать эти псевдоэлементы из CSS:

```css
li::marker {
  color: hotpink;
}

li:first-child::marker {
  font-size: 5rem;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-style-introduction?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

{% Aside 'caution' %} Если в приведенном выше списке нет розовых маркеров, значит, `::marker` не поддерживается вашим браузером. {% endAside %}

Свойство `list-style-type` дает очень ограниченные возможности для стилизации. Псевдоэлемент `::marker` означает, что можно настроить таргетинг самого маркера и применить стили непосредственно к нему. Это дает гораздо больший контроль.

Тем не менее, вы не можете использовать все свойства CSS для `::marker`. Список разрешенных и запрещенных свойств четко указан в спецификации. Если вы экспериментируете с этим псевдоэлементом, а результата нет, ознакомьтесь с приведенным ниже списком — он описывает, что можно и что нельзя сделать с помощью CSS:

#### Допустимые свойства CSS для `::marker`

- `animation-*`
- `transition-*`
- `color`
- `direction`
- `font-*`
- `content`
- `unicode-bidi`
- `white-space`

Изменение содержимого `::marker` выполняется с помощью `content` вместо `list-style-type`. В следующем примере для первого элемента используется стиль `list-style-type`, а для второго — `::marker`.Свойства в первом случае применяются ко всему элементу списка, а не только к маркеру, что означает, что текст анимируется так же, как и маркер. При использовании `::marker` мы можем выбирать только блок маркера, а не текст.

Также обратите внимание на то, что отключенное свойство `background` не действует.

<div class="switcher">{% Compare 'worse', 'Стили списков' %} ```css li:nth-child(1) { list-style-type: '?'; font-size: 2rem; background: hsl(200 20% 88%); animation: color-change 3s ease-in-out infinite; } ```</div>
<p data-md-type="paragraph">{% CompareCaption %} Смешанный результат для маркера и элемента списка {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'better', 'Стили маркеров' %}</p>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">li:nth-child(2)::marker {
  content: '!';
  font-size: 2rem;
  background: hsl(200 20% 88%);
  animation: color-change 3s ease-in-out infinite;
}
</code></pre>
<p data-md-type="paragraph">{% CompareCaption %} Акцентированный результат для маркера и элемента списка {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

<br>

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-style-vs-list-style-type?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

{% Aside 'gotchas' %} В Chromium `white-space` работает только с внутренними маркерами. Для внешних маркеров регулятор стиля всегда принудительно задает `white-space: pre`, чтобы сохранить завершающий пробел. {% endAside %}

#### Изменение содержимого маркера

Вот несколько способов стилизации маркеров.

**Изменение всех пунктов списка**

```css
li {
  list-style-type: "😍";
}

/* ИЛИ */

li::marker {
  content: "😍";
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-change-all?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**Изменение только одного пункта списка**

```css
li:last-child::marker {
  content: "😍";
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-change-one?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**Замена маркера списка на SVG**

```css
li::marker {
  content: url(/heart.svg);
  content: url(#heart);
  content: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='24' width='24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='none' stroke='hotpink' stroke-width='3'/></svg>");
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-inline-svg?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**Изменение нумерованных списков** А что насчет `<ol>`? Маркер в элементе нумерованного списка по умолчанию является числом, а не маркером. В CSS это называется [счетчиками](https://developer.mozilla.org/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters), и у них довольно широкие возможности. У счетчиков даже есть свойства для установки и сброса начала и конца нумерации или переключения цифр на римские. Можем ли мы это стилизовать? Да, и мы можем даже использовать значение содержимого маркера для создания собственного представления нумерации.

```css
li::marker {
  content: counter(list-item) "› ";
  color: hotpink;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-numbered-lists?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### Отладка

Chrome DevTools помогут вам проверить, отладить и изменить стили, применяемые к псевдоэлементам `::marker`.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PYKVXEzycrMhQujXsNxQ.png", alt="DevTools открыты и показывают стили из пользовательского агента и пользовательских стилей", width="776", height="574", style="max-inline-size: 480px" %}</figure>

### Будущие стили псевдоэлементов

Вы можете узнать больше о :: marker здесь:

- [Списки, маркеры и счетчики CSS](https://www.smashingmagazine.com/2019/07/css-lists-markers-counters/) от [журнала Smashing Magazine](https://www.smashingmagazine.com/)
- [Подсчет с помощью счетчиков CSS и сетки CSS](https://css-tricks.com/counting-css-counters-css-grid/) от [CSS-Tricks](https://css-tricks.com/)
- [Использование счетчиков CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters) от [MDN](https://developer.mozilla.org/)

Приятно получить контроль над чем-то, что раньше было сложно стилизовать. Возможно, вы захотите стилизовать другие автоматически сгенерированные элементы. Вещи наподобие `<details>` или индикатора автозаполнения поискового ввода, реализация которых различается от браузера к браузеру, могут вас напрягать. Есть способ поделиться тем, что вам нужно — создать желание на [https://webwewant.fyi](https://webwewant.fyi).
