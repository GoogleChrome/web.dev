---
layout: post
title: Центрирование в CSS
subhead: Следуйте 5 методам центрирования, когда они проходят серию тестов, чтобы определить, какой из них наиболее устойчив к изменениям.
authors:
  - adamargyle
description: Следуйте 5 методам центрирования, когда они проходят серию тестов, чтобы определить, какой из них наиболее устойчив к изменениям.
date: 2020-12-16
hero: image/admin/uz0bDoJvK4kbtjozekGA.png
thumbnail: image/admin/4NFENgpVrXHi2O42mv0K.png
codelabs: codelab-centering-in-css
tags:
  - blog
  - css
  - layout
  - intl
---

Центрирование в CSS — печально известная проблема, обросшая массой шуток. Но к 2020 году CSS уже достаточно развился, и теперь мы можем посмеяться над этими шутками искренне, а не сквозь зубы.

Если вы предпочитаете видео, можете посмотреть видеоверсию этой статьи на YouTube:

{% YouTube 'ncYzTvEMCyE' %}

## Суть проблемы

**Существует множество видов центрирования**. Они различаются в зависимости от вариантов использования, количества элементов, которые нужно центрировать, и т. д. Чтобы обосновать «выигрышную» технику центрирования, я создал The Resilience Ringer. Это серия стресс-тестов, позволяющих сбалансировать каждую стратегию центрирования, наблюдая за их эффективностью. В конце статьи я раскрою наиболее результативную технику, а также «самую ценную». Надеюсь, вы почерпнете из статьи новые методики и решения для центрирования.

### Указание устойчивости

Указание устойчивости (Resilience Ringer) — это проекция моей уверенности в том, что алгоритм центрирования должен быть устойчивым к международным макетам, окнам просмотра переменного размера, редактированию текста и динамическому контенту. Эти принципы помогли сформировать следующие тесты устойчивости для выдержки техник центрирования:

1. **Сжатый:** центрирование должно выдерживать изменения ширины
2. **Сжатие:** центрирование должно выдерживать изменение высоты
3. **Дублировать:** центрирование должно быть динамическим по количеству элементов
4. **Изменить:** центрирование должно быть динамическим по длине и языку контента
5. **Поток:** центрирование должно быть независимым от направления документа и режима письма

Выигрышное решение должно продемонстрировать свою устойчивость, удерживая содержимое в центре при сжатии, сжатии, дублировании, редактировании и переключении на различные языковые режимы и направления. Надежный и жизнеспособный центр, надежный центр.

#### Легенда

Я предоставил несколько визуальных цветовых подсказок, чтобы помочь вам сохранить некоторую метаинформацию в контексте:

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4K35cL1tVpEsGqb4FgKp.png", alt="", width="800", height="438", class="w-screenshot" %} <figcaption class="w-figcaption"></figcaption></figure>

- Розовая рамка указывает на владение стилями центрирования.
- Серый прямоугольник - это фон на контейнере, на котором необходимо разместить элементы по центру.
- Каждый ребенок имеет белый цвет фона, поэтому вы можете увидеть любые эффекты, которые техника центрирования оказывает на размеры дочернего блока (если таковые имеются).

## 5 участников

В Звонок стойкости входят 5 техник центрирования, только один получит Корону стойкости 👸.

### 1. Центр содержимого

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/content-center-ringer-cycle.mp4">
  </source></video>
  <figcaption>Редактирование и копирование контента с помощью <a href="https://github.com/GoogleChromeLabs/ProjectVisBug#visbug">VisBug</a></figcaption></figure>

1. **Squish** : отлично!
2. **Сквош** : отлично!
3. **Дубликат** : отлично!
4. **Изменить** : отлично!
5. **Расход** : отличный!

Будет сложно превзойти краткость `display: grid` и сокращение `place-content` Поскольку он центрирует и оправдывает детей коллективно, это надежный метод центрирования для групп элементов, предназначенных для чтения.

```css
.content-center {
  display: grid;
  place-content: center;
  gap: 1ch;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} - Контент центрируется даже в условиях ограниченного пространства и переполнения - Центрирование, редактирование и обслуживание - все в одном месте - Gap гарантирует равное расстояние между _n_ дочерними элементами - Grid создает строки по умолчанию</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true"><li data-md-type="list_item" data-md-list-type="unordered">Самый широкий дочерний элемент ( <code data-md-type="codespan">max-content</code> ) устанавливает ширину для всех остальных. Подробнее об этом мы поговорим в <a href="#gentle-flex" data-md-type="link">Gentle Flex</a> .</li></ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

**Отлично** подходит для макетов макросов, содержащих абзацы и заголовки, прототипов или других вещей, требующих четкого центрирования.

`place-content` {% Aside %} не является эксклюзивным для `display: grid` . `display: flex` также может извлечь выгоду из [сокращений](https://codepen.io/argyleink/pen/PoqWOPZ) `place-content` и `place-item` . {% endAside %}

### 2. Нежный изгиб

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gentle-flex-ringer-cycle.mp4">
  </source></video></figure>

1. **Squish:** отлично!
2. **Сквош:** отлично!
3. **Дубликат:** отлично!
4. **Изменить:** отлично!
5. **Расход:** отличный!

Gentle Flex - более точная стратегия, *основанная только на центрировании.* Он мягкий и нежный, потому что в отличие от `place-content: center` , при центрировании размеры детской коробки не меняются. По возможности аккуратно складывайте все предметы в стопку, по центру и на расстоянии друг от друга.

```css
.gentle-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} - обрабатывает только выравнивание, направление и распределение - редактирование и обслуживание - все в одном месте - Gap гарантирует равные интервалы между _n_ дочерними элементами</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true"><li data-md-type="list_item" data-md-list-type="unordered">Большинство строк кода</li></ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

**Отлично** подходит как для макро, так и для микро макетов.

{% Aside "key-term" %} Макеты **макросов** похожи на штаты или территории страны: очень высокоуровневые, большие зоны покрытия. Зоны, созданные макетами макросов, обычно содержат больше макетов. Чем меньше площадь покрывает макет, тем меньше он становится макетом макроса. Поскольку макет покрывает меньшую площадь поверхности или содержит меньше макетов, он становится в большей степени микромакетом. {% endAside %}

### 3. Автобот

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/autobot-ringer-cycle.mp4">
  </source></video></figure>

1. **Squish:** отлично
2. **Сквош:** отличный
3. **Дубликат:** отлично
4. **Изменить:** отлично
5. **Расход:** отличный

Контейнер настроен на гибкость без стилей выравнивания, в то время как прямые дочерние элементы имеют автоматические поля. В марже есть что-то ностальгическое и чудесное `margin: auto` работает со всех сторон элемента.

```css
.autobot {
  display: flex;
}
.autobot > * {
  margin: auto;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} - Веселые трюки - Быстро и грязно</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">Неудобные результаты при переполнении</li>
<li data-md-type="list_item" data-md-list-type="unordered">Использование раздачи вместо зазора означает, что при раскладке дети могут касаться сторон.</li>
<li data-md-type="list_item" data-md-list-type="unordered">"Толкать" в нужное положение не кажется оптимальным и может привести к изменению размера детской коробки.</li>
</ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

**Отлично** подходит для центрирования значков или псевдоэлементов.

### 4. Пушистый центр

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/fluffy-center-ringer-cycle.mp4">
  </source></video></figure>

1. **Squish:** плохо
2. **Сквош:** плохо
3. **Дубликат:** плохо
4. **Изменить:** отлично!
5. **Расход:** отличный! (если вы используете логические свойства)

Конкурсный «пушистый центр» - безусловно, наш самый вкусный по звучанию соперник и единственная техника центрирования, полностью принадлежащая элементу / ребенку. Видите нашу внутреннюю розовую границу !?

```css
.fluffy-center {
  padding: 10ch;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} - Защищает контент - Атомарно - Каждый тест тайно содержит эту стратегию центрирования - Слово пробел</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">Иллюзия бесполезности</li>
<li data-md-type="list_item" data-md-list-type="unordered">Между контейнером и предметами возникает противоречие, естественно, поскольку каждый из них очень твердо придерживается своих размеров.</li>
</ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

**Отлично** подходит для центрирования по словам или фразам, меток, таблеток, кнопок, фишек и многого другого.

### 5. Pop &amp; Plop

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/popnplop-ringer-cycle.mp4">
  </source></video></figure>

1. **Squish:** хорошо
2. **Сквош:** хорошо
3. **Дубликат:** плохо
4. **Изменить:** хорошо
5. **Расход:** отлично

Это "всплывает", потому что абсолютное позиционирование выталкивает элемент из нормального потока. Часть имен "шлепок" происходит от того, когда я считаю его наиболее полезным: шлепать его поверх других вещей. Это классический и удобный метод центрирования наложения, который гибок и динамичен в зависимости от размера содержимого. Иногда вам просто нужно поставить UI поверх другого UI.

<div class="switcher">{% Compare 'better', 'Pros' %} - Полезно - Надежно - Когда вам это нужно, это бесценно</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">Код с отрицательными процентными значениями</li>
<li data-md-type="list_item" data-md-list-type="unordered">Требуется <code data-md-type="codespan">position: relative</code> принудительного включения содержащего блока</li>
<li data-md-type="list_item" data-md-list-type="unordered">Ранние и неудобные разрывы строк</li>
<li data-md-type="list_item" data-md-list-type="unordered">Без дополнительных усилий может быть только 1 на содержащий блок</li>
</ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

**Отлично** подходит для модальных окон, тостов и сообщений, стеков и эффектов глубины, всплывающих окон.

## Победитель

Если бы я был на острове и мог бы иметь только 1 технику центрирования, это было бы…

[барабанная дробь]

**Нежная** гибкость 🎉

```css
.gentle-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
```

Вы всегда можете найти его в моих таблицах стилей, потому что он полезен как для макро, так и для микро макетов. Это универсальное надежное решение с результатами, соответствующими моим ожиданиям. Кроме того, поскольку я врожденный наркоман по размерам, я склонен переходить к этому решению. Конечно, печатать много, но преимущества, которые он дает, перевешивают дополнительный код.

### MVP

**Пушистый центр**

```css
.fluffy-center {
  padding: 2ch;
}
```

Пушистый центр настолько микро, что его легко упустить из виду как метод центрирования, но он является основным продуктом моих стратегий центрирования. Он настолько атомарен, что иногда я забываю, что использую его.

### Заключение

Какие вещи нарушают вашу стратегию центрирования? Какие еще проблемы можно добавить к звонку устойчивости? Я рассматривал перевод и автоматический переключатель высоты на контейнере… что еще !?

Теперь, когда вы знаете, как я это сделал, как бы вы ?! Давайте разнообразим наши подходы и изучим все способы создания веб-сайтов. Следуйте кодовой таблице с этим постом, чтобы создать свой собственный пример центрирования, как и в этом посте. [Напишите мне в Твиттере](https://twitter.com/argyleink) свою версию, и я добавлю ее в [раздел ремиксов сообщества](#community-remixes) ниже.

## Ремиксы от сообщества

- [CSS-хитрости](https://css-tricks.com/) с [сообщением в блоге](https://css-tricks.com/centering-in-css/)
