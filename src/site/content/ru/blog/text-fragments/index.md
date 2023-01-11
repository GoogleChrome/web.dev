---
title: 'Смело размещайте ссылки на то, на что еще никто не ссылался: текстовые фрагменты'
subhead: |-
  Текстовые фрагменты позволяют указать отрывок текста во фрагменте URL-адреса.
  При переходе по URL-адресу с таким отрывком браузер может выделить его и привлечь к нему внимание пользователя.
authors:
  - thomassteiner
date: 2020-06-17
updated: 2021-05-17
hero: image/admin/Y4NLEbOwgTWdMNoxRYXw.jpg
alt: ''
description: |-
  Текстовые фрагменты позволяют указать отрывок текста во фрагменте URL-адреса.
  При переходе по URL-адресу с таким отрывком браузер может выделить его и привлечь к нему внимание пользователя.
tags:
  - blog
  - capabilities
feedback:
  - api
---

## Идентификаторы фрагментов

Версия Chrome 80 содержала множество важных изменений. Был реализован ряд долгожданных функций, таких как [модули ECMAScript в веб-воркерах](/module-workers/), [нулевое слияние](https://v8.dev/features/nullish-coalescing), [опциональная последовательность](https://v8.dev/features/optional-chaining) и другие. О выпуске, как обычно, было объявлено в [блоге](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html) Chromium. Отрывок из публикации в блоге приведен на скриншоте ниже.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/egsW6tkKWYI8IHE6JyMZ.png", alt="", width="400", height="628" %}<figcaption> Публикация в блоге Chromium с красными рамками вокруг элементов с атрибутом <code>id</code>.</figcaption></figure>

Вы, вероятно, задаетесь вопросом, что это за красные прямоугольники. Они являются результатом выполнения следующего фрагмента в DevTools. Он выделяет все элементы, у которых есть атрибут `id`.

```js
document.querySelectorAll('[id]').forEach((el) => {
  el.style.border = 'solid 2px red';
});
```

Я могу разместить внешнюю ссылку на любой элемент, выделенный красной рамкой, благодаря [идентификатору фрагмента](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Fragment), который я затем использую в [хэше](https://developer.mozilla.org/docs/Web/API/URL/hash) URL-адреса страницы. Допустим, я решил добавить внешнюю ссылку на блок «*Оставить отзыв в разделе [Форумы по продукту](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)*» сбоку. Это можно сделать вручную, создав URL-адрес <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1</code></a>. Как видно на панели «Элементы» в инструментах разработчика, рассматриваемый элемент имеет атрибут `id` со значением `HTML1`.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/whVXhhrYwA55S3i4J3l5.png", alt="", width="600", height="97" %} <figcaption> Отображение <code>id</code> элемента в Dev Tools.</figcaption></figure>

Если проанализировать этот URL-адрес с помощью конструктора JavaScript `URL()`, будут обнаружены различные компоненты. Обратите внимание на свойство `hash` со значением `#HTML1`.

```js/3
new URL('https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1');
/* Создаем новый объект `URL`
URL {
  hash: "#HTML1"
  host: "blog.chromium.org"
  hostname: "blog.chromium.org"
  href: "https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"
  origin: "https://blog.chromium.org"
  password: ""
  pathname: "/2019/12/chrome-80-content-indexing-es-modules.html"
  port: ""
  protocol: "https:"
  search: ""
  searchParams: URLSearchParams {}
  username: ""
}
*/
```

Впрочем, чтобы найти `id` элемента, мне пришлось открыть инструменты разработчика. Это многое говорит о том, с какой вероятностью автор публикации собирался разместить ссылку конкретно на этот раздел страницы.

А что, если мне нужно опубликовать ссылку на что-то, не имеющее `id`? Скажем, я хочу сделать ссылку на заголовок *ECMAScript Modules in Web Workers*. Как видно на скриншоте ниже, у рассматриваемого элемента `<h1>` нет `id`, а это значит, что я не могу ссылаться на этот заголовок. Как раз эту проблему решают текстовые фрагменты.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1g4rTS1q5LKHEHnDoF9o.png", alt="", width="600", height="71" %} <figcaption> Заголовок без <code>id</code> в Dev Tools.</figcaption></figure>

## Текстовые фрагменты

Предложение «[Фрагменты текста](https://wicg.github.io/ScrollToTextFragment/)» добавляет поддержку для указания фрагмента текста в хэше URL-адреса. При переходе по URL-адресу с таким фрагментом текста пользовательский агент может выделить его и привлечь внимание пользователя.

### Совместимость с браузерами

Функция текстовых фрагментов поддерживается в браузерах на базе Chromium 80 и более поздних версий. На момент написания этой статьи Safari и Firefox не заявляли публично о намерении реализовать эту функцию. Перейти к обсуждениям Safari и Firefox можно из раздела «[Ссылки по теме](#related-links)».

{% Aside 'success' %} Эти ссылки раньше не работали при [переадресации на стороне клиента](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Alternative_way_of_specifying_redirections), которую используют некоторые распространенные сервисы, например, Twitter. Эта проблема была задокументирована по адресу [crbug.com/1055455](https://crbug.com/1055455) и на данный момент уже исправлена. Обычные [перенаправления HTTP](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Principle) всегда работали нормально. {% endAside %}

По [соображениям безопасности](#security) функция требует, чтобы ссылки открывались в контексте [`noopener`](https://developer.mozilla.org/docs/Web/HTML/Link_types/noopener). Поэтому не забывайте указывать параметр [`rel="noopener"`](https://developer.mozilla.org/docs/Web/HTML/Element/a#attr-rel) для якорей `<a>` и добавлять [`noopener`](https://developer.mozilla.org/docs/Web/API/Window/open#noopener) к списку функций окна `Window.open()`.

### `textStart`

В простейшей форме синтаксис текстовых фрагментов выглядит следующим образом: символ `#`, за которым следует выражение `:~:text=`, а затем — `textStart`, который представляет собой [закодированный в процентах](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) текст, на который я хочу создать ссылку.

```bash
#:~:text=textStart
```

Допустим, я хочу сделать ссылку на заголовок *ECMAScript Modules in Web Workers* [в публикации в блоге, где описаны новые функции Chrome 80](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html). URL-адрес в этом случае будет таким:

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers</code></a>

Текстовый фрагмент выделен <mark class="highlight-line highlight-line-active">вот так</mark>. Если вы нажмете на ссылку в браузере с поддержкой этой функции, например, Chrome, фрагмент текста будет выделен, а экран прокрутится до него:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D3jwPrJlvN3FmJo3pADt.png", alt="", width="400", height="208" %} <figcaption> Экран прокручен до выделенного фрагмента текста.</figcaption></figure>

### `textStart` и `textEnd`

А что, если я хочу сделать ссылку на весь *раздел* *ECMAScript Modules in Web Workers*, а не только на его заголовок? Процентное кодирование всего текста раздела сделало бы URL-адрес неприменимо длинным.

К счастью, есть способ получше. Вместо того, чтобы передавать весь текст, можно задать его границы, используя синтаксис `textStart,textEnd`. Так что я укажу по несколько слов с процентным кодированием в начале и в конце нужного текста, разделив их запятой `,`.

Это выглядит так:

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers.</code></a>.

Значением `textStart` будет `ECMAScript%20Modules%20in%20Web%20Workers`, затем идет запятая `,`, за которой следует `ES%20Modules%20in%20Web%20Workers.` —значение `textEnd`. Когда вы нажмете на такую ссылку в браузере с соответствующей поддержкой, например, Chrome, весь раздел будет выделен, а экран прокрутится до него:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2yTYmKnjHTnqXkcmHF1F.png", alt="", width="400", height="343" %} <figcaption> Экран прокручен до выделенного фрагмента текста.</figcaption></figure>

Здесь вы можете усомниться в моем выборе значений `textStart` и `textEnd`. На самом деле, чуть более короткий URL-адрес <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules,Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules,Web%20Workers.</code></a> с двумя словами с каждой стороны тоже подойдет. Сравните `textStart` и `textEnd` с предыдущими значениями.

Но если я сделаю еще один шаг и использую лишь по одному слову в `textStart` и `textEnd`, вы увидите, что у меня проблемы. URL-адрес <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript,Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript,Workers.</code></a> стал еще короче, но выделенный фрагмент текста уже не соответствует тому, что планировался изначально. Выделение прекращается при первом появлении слова `Workers.`, что технически верно, но это не то, что я собирался выделить. Проблема в том, что нужный раздел не идентифицируется однозначно текущими значениями `textStart` и `textEnd`, содержащими по одному слову:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GGbbtHBpsoFyubnISyZw.png", alt="", width="400", height="342" %} <figcaption> Экран прокручен, но выделенный фрагмент текста не тот, что нужно.</figcaption></figure>

### `prefix-` и `-suffix`

Используя достаточно длинные значения для `textStart` и `textEnd`, можно получить уникальную ссылки. Однако в некоторых ситуациях это невозможно. Кстати, почему я выбрал в качестве примера публикацию в блоге о выпуске Chrome 80? Дело в том, что в этой версии были представлены текстовые фрагменты:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yA1p3CijeDbTRwMys9Hq.png", alt="Текст публикации в блоге: фрагменты текста URL. Пользователи и авторы теперь могут ссылаться на определенную часть страницы, используя фрагмент текста, указанный в URL. При загрузке страницы браузер выделяет текст и прокручивает область просмотра до нужного фрагмента. Например, указанный ниже URL загружает вики-страницу для 'Cat' и прокручивает экран до контента, указанного в параметре `text`.", width="800", height="200" %} <figcaption>Отрывок из публикации в блоге с объявлением о текстовых фрагментах.</figcaption></figure>

Обратите внимание, что на скриншоте выше слово «text» появляется четыре раза. Четвертое вхождение написано зеленым кодовым шрифтом. Если бы я хотел создать ссылку на это конкретное слово, я бы установил для `textStart` значение `text`. Поскольку «text» — это всего лишь одно слово, параметр `textEnd` неприменим. Что же делать? URL-адрес <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=text"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=text</code></a> совпадает с первым вхождением слова «Text» уже в заголовке:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nXxCskUwdCxwxejPSSZW.png", alt="", width="800", height="209" %} <figcaption> Фрагмент текста соответствует первому вхождению «Text».</figcaption></figure>

{% Aside 'caution' %} Обратите внимание, что при сопоставлении фрагментов текста регистр не учитывается. {% endAside %}

К счастью, решение есть. В подобных случаях можно указать параметры `prefix​-` и `-suffix`. Слово перед написанным зеленым кодовым шрифтом «text» — это «the», а слово после него — «parameter». Ни одно из трех других вхождений слова «text» не окружают те же слова. Вооружившись этими знаниями, я могу настроить предыдущий URL и добавить `prefix-` и `-suffix`. Как и другие параметры, они также должны быть закодированы в процентах и ​​могут содержать более одного слова. <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=the-,text,-parameter"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=the-,text,-parameter</code></a>. Чтобы синтаксический анализатор мог четко распознать `prefix-` и `-suffix`, их необходимо отделять от `textStart` и необязательного `textEnd` при помощи дефиса `-`.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J3L5BVSMmzGY6xdkabP6.png", alt="", width="800", height="203" %} <figcaption>Фрагмент текста соответствует желаемому вхождению «text».</figcaption></figure>

### Полный синтаксис

Полный синтаксис текстовых фрагментов показан ниже. (Квадратные скобки указывают на необязательный параметр.) Значения всех параметров должны быть закодированы в процентах. Особенно это касается символов дефиса `-`, амперсанда `&` и запятой `,`, чтобы они не интерпретировались как часть синтаксиса текстовой директивы.

```bash
#:~:text=[prefix-,]textStart[,textEnd][,-suffix]
```

Каждый из параметров `prefix-` , `textStart`, `textEnd` и `-suffix` будет соответствовать только тексту в пределах одного [элемента уровня блока](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements#Elements), но полные диапазоны `textStart,textEnd` *могут* охватывать несколько блоков. Например, `:~:text=The quick,lazy dog` не найдет соответствия в следующем примере, потому что начальная строка «The quick» не появляется в одном непрерывном элементе уровня блока:

```html
<div>
  The
  <div></div>
  quick brown fox
</div>
<div>jumped over the lazy dog</div>
```

Однако в этом примере соответствие будет найдено:

```html
<div>The quick brown fox</div>
<div>jumped over the lazy dog</div>
```

### Создание URL-адресов с текстовыми фрагментами с помощью расширений браузера

Создавать URL-адреса с текстовыми фрагментами вручную — утомительный процесс, особенно когда дело доходит до обеспечения их уникальности. Если вы действительно этого хотите — в спецификации есть несколько советов и перечислены точные [шаги для создания URL-адресов с текстовыми фрагментами](https://wicg.github.io/ScrollToTextFragment/#generating-text-fragment-directives). Мы предоставляем расширение для браузера с открытым исходным кодом под названием [Link to Text Fragment](https://github.com/GoogleChromeLabs/link-to-text-fragment), которое позволяет создавать ссылки на любой текст, выделяя его, а затем выбирая «Копировать ссылку на выбранный текст» в контекстном меню. Это расширение доступно для следующих браузеров:

- [Link to Text Fragment для Google Chrome](https://chrome.google.com/webstore/detail/link-to-text-fragment/pbcodcjpfjdpcineamnnmbkkmkdpajjg)
- [Link to Text Fragment для Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/link-to-text-fragment/pmdldpbcbobaamgkpkghjigngamlolag)
- [Link to Text Fragment для Mozilla Firefox](https://addons.mozilla.org/firefox/addon/link-to-text-fragment/)
- [Link to Text Fragment для Apple Safari](https://apps.apple.com/app/link-to-text-fragment/id1532224396)

<figure>Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASLtFCPoHvyTKrAtKAv4.png", alt="", width="800", height="500" %} <figcaption> Расширение браузера <a href="https://github.com/GoogleChromeLabs/link-to-text-fragment">Link to Text Fragment</a>.</figcaption></figure>

### Несколько фрагментов текста в одном URL

Обратите внимание, что в одном URL-адресе может отображаться несколько фрагментов текста. Отдельные фрагменты текста необходимо разделять символом амперсанда `&`. Вот пример ссылки с тремя текстовыми фрагментами: <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet</code></a>.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ffsq7aoSoVd9q6r5cquY.png", alt="", width="800", height="324" %} <figcaption> Три текстовых фрагмента в одном URL.</figcaption></figure>

### Смешивание элемента и текстовых фрагментов

Фрагменты традиционных элементов можно комбинировать с фрагментами текста. Совершенно нормально использовать и то, и другое в одном и том же URL-адресе, например, чтобы обеспечить осмысленный запасной вариант на случай, если исходный текст на странице изменится и текстовый фрагмент перестанет соответствовать параметрам. URL-адрес <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums.</code></a>, ведущий к разделу *Give us feedback in our [Product Forums](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)*, содержит как фрагмент элемента (`HTML1`), так и текстовый фрагмент `text=Give%20us%20feedback%20in%20our%20Product%20Forums.`):

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/JRKCM6Ihrq8sgRZRiymr.png", alt="", width="237", height="121" %} <figcaption> Ссылка с фрагментом элемента и текстовым фрагментом.</figcaption></figure>

### Директива фрагмента

Есть элемент синтаксиса, который я еще не объяснил: директива фрагмента `:~:`. Чтобы избежать проблем совместимости с существующими фрагментами элементов URL, как показано выше, в [спецификации текстовых фрагментов](https://wicg.github.io/ScrollToTextFragment/) вводится директива фрагмента. Директива фрагмента — это часть фрагмента URL-адреса, ограниченная кодовой последовательностью `:~:`. Она зарезервирована для инструкций пользовательского агента, таких как `text=`, и удаляется из URL-адреса во время загрузки, чтобы авторские скрипты не могли взаимодействовать с ним напрямую. Инструкции пользовательского агента также называются *директивами*. Поэтому в данном случае `text=` называется *текстовой директивой*.

### Обнаружение функций

Чтобы определить, поддерживается ли функция, проверьте доступное только для чтения свойство `fragmentDirective` на элементе `document`. Директива фрагмента — это механизм, позволяющий URL-адресам указывать инструкции, направленные браузеру, а не документу. Это предназначено для того, чтобы избежать прямого взаимодействия с авторскими скриптами, так что будущие инструкции пользовательского агента могут быть добавлены без опасений, что в существующий контент будут внесены критические изменения. Потенциальный пример таких будущих дополнений — подсказки для перевода.

```js
if ('fragmentDirective' in document) {
  // Текстовые фрагменты поддерживаются.
}
```

{% Aside %} Начиная с Chrome 80 до Chrome 85 свойство `fragmentDirective` было определено в `Location.prototype`. Подробнее об этом изменении: [WICG/scroll-to-text-fragment#130](https://github.com/WICG/scroll-to-text-fragment/issues/130). {% endAside %}

Обнаружение функций в основном предназначено для случаев, когда ссылки генерируются динамически (например, поисковыми системами), чтобы избежать передачи ссылок на фрагменты текста браузерам, которые их не поддерживают.

### Стилизация фрагментов текста

По умолчанию браузеры задают стиль фрагментам текста так же, как и [`mark`](https://developer.mozilla.org/docs/Web/HTML/Element/mark) (обычно это черный текст на желтом фоне, [системные цвета](https://developer.mozilla.org/docs/Web/CSS/color_value#system_colors) CSS для `mark`). Таблица стилей пользовательского агента содержит CSS, который выглядит следующим образом:

```css
:root::target-text {
  color: MarkText;
  background: Mark;
}
```

Как видите, браузер предоставляет псевдоселектор [`::target-text`](https://drafts.csswg.org/css-pseudo/#selectordef-target-text), который можно использовать для настройки применяемого выделения. Например, вы можете оформить свои текстовые фрагменты в виде черного текста на красном фоне. Как обычно, не забудьте [проверить цветовой контраст](https://developer.chrome.com/docs/devtools/accessibility/reference/#contrast), чтобы ваш переопределенный стиль не вызвал проблем с доступностью, и убедитесь, что выделение действительно визуально отличается от остального контента.

```css
:root::target-text {
  color: black;
  background-color: red;
}
```

### Возможность полизаполнения

Функцию текстовых фрагментов можно до некоторой степени полизаполнить. Мы предоставляем [полизаполнение](https://github.com/GoogleChromeLabs/text-fragments-polyfill), которое внутренне используется [расширением](https://github.com/GoogleChromeLabs/link-to-text-fragment), для браузеров без встроенной поддержки текстовых фрагментов, где функциональность реализована на JavaScript.

### Программная генерация ссылки на фрагмент текста

[Полизаполнение](https://github.com/GoogleChromeLabs/text-fragments-polyfill) содержит файл `fragment-generation-utils.js`, который можно импортировать и использовать для создания ссылок на фрагменты текста. Это показано в примере кода ниже:

```js
const { generateFragment } = await import('https://unpkg.com/text-fragments-polyfill/dist/fragment-generation-utils.js');
const result = generateFragment(window.getSelection());
if (result.status === 0) {
  let url = `${location.origin}${location.pathname}${location.search}`;
  const fragment = result.fragment;
  const prefix = fragment.prefix ?
    `${encodeURIComponent(fragment.prefix)}-,` :
    '';
  const suffix = fragment.suffix ?
    `,-${encodeURIComponent(fragment.suffix)}` :
    '';
  const textStart = encodeURIComponent(fragment.textStart);
  const textEnd = fragment.textEnd ?
    `,${encodeURIComponent(fragment.textEnd)}` :
    '';
  url += `#:~:text=${prefix}${textStart}${textEnd}${suffix}`;
  console.log(url);
}
```

### Получение фрагментов текста для аналитических целей

Многие сайты используют фрагменты для роутинга, поэтому браузеры исключают текстовые фрагменты, чтобы не нарушать работу этих страниц. Признана [необходимость](https://github.com/WICG/scroll-to-text-fragment/issues/128) поддержки ссылок на фрагменты текста для страниц, например, для аналитических целей, но предлагаемое решение еще не реализовано. В качестве временного решения вы можете использовать приведенный ниже код для извлечения нужной информации.

```js
new URL(performance.getEntries().find(({ type }) => type === 'navigate').name).hash;
```

### Безопасность

Директивы текстовых фрагментов вызываются только при полных переходах (не в рамках одной страницы), которые являются результатом [активации пользователя](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation). Кроме того, для переходов из источника, отличного от пункта назначения, потребуется, чтобы переход происходил в контексте [`noopener`](https://html.spec.whatwg.org/multipage/links.html#link-type-noopener), чтобы целевая страница была достаточно изолирована. Директивы фрагмента текста применяются только к основному фрейму. Это означает, что поиск текста внутри окон iframe не будет выполняться, а переход в iframe не вызовет фрагмент текста.

### Конфиденциальность

Важно, чтобы реализации спецификации текстовых фрагментов не допускали утечек независимо от того, был ли текстовый фрагмент найден на странице или нет. В то время как фрагменты элементов полностью контролируются автором исходной страницы, текстовые фрагменты могут быть созданы кем угодно. Помните, как в моем примере выше не было возможности создать ссылку на заголовок *ECMAScript Modules in Web Workers*, поскольку у элемента `<h1>` не было `id`, но при этом любой, включая меня, мог просто ссылаться на любое место, подобрав подходящий фрагмент текста?

Представьте, что я запустил чудовищную рекламную сеть `evil-ads.example.com`. Далее представьте, что в одном из моих рекламных фреймов при взаимодействии пользователя с объявлением я динамически создаю скрытый iframe с другим источником, ведущий на `dating.example.com` с URL-адресом с текстовым фрагментом <code>dating.example.com#:~:text=Log%20Out</code>. Если обнаружен текст «Log Out», я знаю, что жертва в настоящее время выполнила вход в систему на сайте `dating.example.com`, который я могу использовать для профилирования пользователей. Простая реализация текстовых фрагментов может решить, что успешное совпадение должно вызвать переключение фокуса. Соответственно, на `evil-ads.example.com` я могу прослушивать событие `blur` и благодаря этому знать, когда произойдет совпадение. Мы реализовали фрагменты текста в Chrome таким образом, чтобы описанный выше сценарий не мог произойти.

Другой вариант злого умысла — эксплуатация сетевого трафика на основе положения прокрутки. Предположим, у меня был доступ к журналам сетевого трафика моей жертвы, например, как у администратора внутренней сети компании. А теперь представьте, что существует длинный документ отдела по работе с персоналом под названием «*Что делать, если вы страдаете от…*», в котором перечислен список состояний, таких как *выгорание*, *тревога* и т. д. Я мог бы разместить веб-маяк рядом с каждым пунктом списка. Далее, если я увижу, что загрузка документа совпадает по времени с загрузкой веб-маяка рядом, скажем, с пунктом «*выгорание*», то как администратор интрасети я могу определить, что сотрудник нажал на ссылку на текстовый фрагмент с `:~:text=burn%20out`, полагая, что это конфиденциально и никому не видно. Поскольку этот пример изначально несколько надуманный и его использование требует выполнения *чрезвычайно* специфических предварительных условий, команда безопасности Chrome сочла контролируемым риск реализации прокрутки при навигации. Другие пользовательские агенты могут решить вместо этого показать элемент пользовательского интерфейса с ручной прокруткой.

Для сайтов, где требуется исключить применение этого функционала, Chromium поддерживает значение заголовка [Document Policy](https://wicg.github.io/document-policy/), которое можно отправлять, чтобы пользовательские агенты не обрабатывали URL-адреса с текстовыми фрагментами.

```bash
Document-Policy: force-load-at-top
```

## Отключение текстовых фрагментов

Проще всего отключить эту функцию, используя расширение, которое может вставлять заголовки HTTP-ответа, например, [ModHeader](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj) (не является продуктом Google), чтобы вставить заголовок ответа (*не* запроса) следующим образом:

```bash
Document-Policy: force-load-at-top
```

Еще один способ, посложнее — применить корпоративную настройку [`ScrollToTextFragmentEnabled`](https://cloud.google.com/docs/chrome-enterprise/policies/?policy=ScrollToTextFragmentEnabled). Чтобы сделать это в macOS, вставьте в терминал приведенную ниже команду.

```bash
defaults write com.google.Chrome ScrollToTextFragmentEnabled -bool false
```

В Windows следуйте документации на сайте [справки Google Chrome Enterprise](https://support.google.com/chrome/a/answer/9131254?hl=en).

{% Aside 'warning' %} Пробуйте это, только если знаете, что делаете. {% endAside %}

## Текстовые фрагменты в веб-поиске

Для некоторых запросов поисковая система Google дает быстрый ответ или сводку с фрагментом контента с соответствующего веб-сайта. Эти *избранные фрагменты* чаще всего появляются, когда поиск выполняется в форме вопроса. Нажав на избранный фрагмент, пользователь переходит прямо к его тексту на исходной веб-странице. Это работает благодаря автоматически созданным URL-адресам фрагментов текста.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KbZgnGxZOOymLxYPZyGH.png", alt="", width="800", height="451" %}<figcaption> Страница результатов поисковой системы Google с избранным фрагментом. В строке состояния отображается URL-адрес с фрагментом текста.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4Q7zk9xBnb2uw8GRaLnU.png", alt="", width="800", height="451" %} <figcaption> После нажатия экран прокручивается до соответствующего раздела страницы.</figcaption></figure>

## Заключение

URL-адреса с текстовыми фрагментами — это мощное средство для создания ссылок на произвольный текст на веб-страницах. С его помощью научное сообщество может приводить точные цитаты или ссылки на источники, поисковые системы могут создавать внешние ссылки на текстовые результаты на страницах, а социальные сети могут позволить пользователям делиться определенными фрагментами веб-страницы вместо недоступных скриншотов. Надеюсь, что вы начнете [пользоваться URL-адресами с текстовыми фрагментами](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&text=text,-parameter&text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%%20of%20a%20cat's%20diet) и, как и я, сочтете их полезными. Обязательно установите расширение браузера [Link to Text Fragment](https://github.com/GoogleChromeLabs/link-to-text-fragment).

## Ссылки по теме

- [Черновая спецификация](https://wicg.github.io/scroll-to-text-fragment/)
- [Обзор TAG](https://github.com/w3ctag/design-reviews/issues/392)
- [Запись состояния платформы Chrome](https://chromestatus.com/feature/4733392803332096)
- [Отслеживание ошибок Chrome](https://crbug.com/919204)
- [Ветка обсуждения «Intent to Ship»](https://groups.google.com/a/chromium.org/d/topic/blink-dev/zlLSxQ9BA8Y/discussion)
- [Ветка обсуждения на WebKit-Dev](https://lists.webkit.org/pipermail/webkit-dev/2019-December/030978.html)
- [Позиция стандартов Mozilla](https://github.com/mozilla/standards-positions/issues/194)

## Благодарности

Текстовые фрагменты были реализованы и описаны [Ником Беррисом](https://github.com/nickburris) и [Дэвидом Боканом](https://github.com/bokand) при участии [Гранта Вана](https://github.com/grantjwang). Отдельная благодарность [Джо Медли](https://github.com/jpmedley) за тщательное рецензирование этой статьи. Баннер взят у [Грега Ракози](https://unsplash.com/@grakozy) на [Unsplash](https://unsplash.com/photos/oMpAz-DN-9I).
