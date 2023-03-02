---
title: Предотвращение DOM XSS-уязвимостей при помощи Trusted Types
subhead: Уменьшите поверхность для атак DOM XSS в вашем приложении.
authors:
  - koto
date: 2020-03-25
hero: image/admin/3Mgu37qU0P4fVdI4NTxM.png
alt: Фрагменты кода, демонстрирующие уязвимости межсайтового скриптинга.
description: Знакомство с Trusted Types — браузерным API для предотвращения DOM XSS в современных веб-приложениях.
tags:
  - blog
  - security
feedback:
  - api
---

## Почему это важно?

Межсайтовый скриптинг на основе DOM (DOM XSS) — одна из наиболее распространенных уязвимостей веб-безопасности, и допустить ее появление в приложении очень легко. API [Trusted Types](https://github.com/w3c/webappsec-trusted-types) («доверенные типы») предоставляет инструменты для разработки, проверки безопасности и сопровождения приложений, свободных от уязвимостей DOM XSS, благодаря тому, что делает «опасные» функции браузерных API безопасными по умолчанию. Доверенные типы поддерживаются в Chrome 83, а для других браузеров доступна [polyfill-библиотека](https://github.com/w3c/webappsec-trusted-types#polyfill). Актуальную информацию о поддержке API в браузерах смотрите в  [соответствующей статье](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types#browser_compatibility).

{% Aside 'key-term' %} Межсайтовый скриптинг на основе DOM становится возможным тогда, когда данные из *источника*, контролируемого пользователем (такого, как имя пользователя или URL-адрес перенаправления, переданный в качестве фрагмента ссылки), попадают в *приемник*, выполняющий произвольный код JavaScript (это может быть функция наподобие `eval()` или сеттер свойства, такой как `.innerHTML`). {% endAside %}

## Предыстория

Вот уже много лет [DOM XSS](https://owasp.org/www-community/attacks/xss/) является одной из наиболее распространенных и опасных уязвимостей в области веб-безопасности.

Существует два отдельных класса межсайтового скриптинга. Некоторые XSS-уязвимости появляются вследствие того, что код, выполняющийся на стороне сервера, генерирует HTML-код страниц сайта небезопасным способом. Другие уязвимости возникают на стороне клиента, когда JavaScript-код вызывает небезопасные функции и передает им контент, поступивший от пользователя.

Чтобы [предотвратить XSS на стороне сервера](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), не создавайте HTML путем конкатенации строк; вместо этого используйте безопасные библиотеки-шаблонизаторы с автоматическим контекстным экранированием строк. В качестве дополнительной меры защиты от ошибок (которые будут неизбежно возникать) используйте [CSP-политику на основе одноразовых номеров](https://csp.withgoogle.com/docs/strict-csp.html).

Теперь браузер может также помогать предотвращать XSS-атаки и на стороне клиента (также известные как  атаки на основе DOM) благодаря [доверенным типам](https://bit.ly/trusted-types).

## Введение в API

Доверенные типы ограничивают использование небезопасных функций-приемников, перечисленных ниже. Возможно, вам уже известны некоторые из них, поскольку разработчики браузеров и [веб-фреймворков](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml) уже предостерегают веб-разработчиков от использования этих функций из-за их небезопасности.

- **Управление скриптами**:<br> [`<script src>`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-src) и установка текстового содержимого элементов [`<script>`](https://developer.mozilla.org/docs/Web/HTML/Element/script).

- **Генерация HTML на основе строк**:<br>

    [`innerHTML`](https://developer.mozilla.org/docs/Web/API/Element/innerHTML), [`outerHTML`](https://developer.mozilla.org/docs/Web/API/Element/outerHTML),[`insertAdjacentHTML`](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML), [`<iframe> srcdoc`](https://developer.mozilla.org/docs/Web/HTML/Element/iframe#attr-srcdoc), [`document.write`](https://developer.mozilla.org/docs/Web/API/Document/write), [`document.writeln`](https://developer.mozilla.org/docs/Web/API/Document/writeln) и [`DOMParser.parseFromString`](https://developer.mozilla.org/docs/Web/API/DOMParser#DOMParser.parseFromString)

- **Выполнение содержимого, использующего плагины**:<br> [`<embed src>`](https://developer.mozilla.org/docs/Web/HTML/Element/embed#attr-src), [`<object data>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-data) and [`<object codebase>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-codebase)

- **Компиляция JavaScript-кода во время выполнения**: <br> `eval`, `setTimeout`, `setInterval`, `new Function()`

При использовании доверенных типов данные, передаваемые в перечисленные выше функции-приемники, должны проходить предварительную обработку. Использовать обычную строку не получится, так как браузер не знает, можно ли ей доверять.

{% Compare 'worse' %}

```javascript
anElement.innerHTML  = location.href;
```

{% CompareCaption %} Если доверенные типы активны, браузер выдаст ошибку *TypeError* и не позволит передать строку в приемник, уязвимый для DOM XSS. {% endCompareCaption %}

{% endCompare %}

Чтобы обозначить, что данные были обработаны безопасным путем, создайте специальный объект: доверенный тип.

{% Compare 'better' %}

```javascript
anElement.innerHTML = aTrustedHTML;
```

{% CompareCaption %} При использовании доверенных типов браузер принимает объекты `TrustedHTML` в приемники, предназначенные для фрагментов HTML-кода. Существуют также объекты `TrustedScript` и `TrustedScriptURL`, предназначенные для других видов небезопасных приемников. {% endCompareCaption %}

{% endCompare %}

Доверенные типы значительно сокращают [поверхность для атак](https://en.wikipedia.org/wiki/Attack_surface) DOM XSS в вашем приложении. Это упрощает проверку кода на предмет уязвимостей, а также позволяет контролировать соблюдение проверок безопасности типов, выполняемых на этапе компиляции, линтинга или объединения в бандлы, непосредственно во время выполнения кода в браузере.

## Как использовать доверенные типы

### Подготовьтесь к получению отчетов о нарушении CSP-политики

Вы можете развернуть средство сбора отчетов (например, [go-csp-collector](https://github.com/jacobbednarz/go-csp-collector) с открытым исходным кодом) или использовать одно из коммерческих решений. Кроме того, отслеживать нарушения можно в самом браузере:

```js
window.addEventListener('securitypolicyviolation',
    console.error.bind(console));
```

### Добавьте заголовок CSP, включающий режим отправки отчетов

Добавьте к документам, для которых хотите использовать доверенные типы, следующий заголовок HTTP-ответа.

```text
Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

Теперь отчеты обо всех нарушениях будут отправляться на `//my-csp-endpoint.example`, но это не помешает работе сайта. В следующем разделе рассказывается, как работает `//my-csp-endpoint.example`.

{% Aside 'caution' %} Доверенные типы доступны только в [безопасных контекстах](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts), таких как HTTPS или `localhost`. {% endAside %}

### Идентифицируйте нарушения при использовании доверенных типов

Теперь каждый раз, когда браузер обнаруживает нарушение, связанное с доверенными типам, он будет сообщать об этом по адресу, указанному в качестве `report-uri`. Например, если приложение попытается передать строку в `innerHTML`, то будет отправлен следующий отчет:

```json/6,8,10
{
"csp-report": {
    "document-uri": "https://my.url.example",
    "violated-directive": "require-trusted-types-for",
    "disposition": "report",
    "blocked-uri": "trusted-types-sink",
    "line-number": 39,
    "column-number": 12,
    "source-file": "https://my.url.example/script.js",
    "status-code": 0,
    "script-sample": "Element innerHTML <img src=x"
}
}
```

В отчете говорится, что в строке 39 файла `https://my.url.example/script.js` произошел вызов `innerHTML` со строкой, начинающейся на `<img src=x`. Эта информация должна помочь выявить те части кода, которые потенциально содержат уязвимости DOM XSS и нуждаются в изменении.

{% Aside %} Большинство подобных нарушений также можно выявить, пропустив код вашего приложения через линтер или [статический анализатор кода](https://github.com/mozilla/eslint-plugin-no-unsanitized). Это помогает быстро выявить существенную часть нарушений.

Однако сообщения о нарушении CSP-политики также следует анализировать, поскольку они возникают при выполнении кода, не соответствующего политике. {% endAside %}

### Исправьте нарушения

Исправить нарушение, связанное с доверенными типами, можно различными способами. Вы можете [удалить код, содержащий нарушение](#remove-the-offending-code), [воспользоваться библиотекой](#use-a-library), [создать политику доверенного типа](#create-a-trusted-type-policy) или, в качестве крайней меры, [создать политику по умолчанию](#create-a-default-policy).

#### Переработка кода, содержащего нарушение

Возможно, что функциональность, являющаяся причиной нарушения, больше не нужна или ее можно реализовать более современным способом без использования уязвимых функций.

{% Compare 'worse' %}

```javascript
el.innerHTML = '<img src=xyz.jpg>';
```

{% endCompare %}

{% Compare 'better' %}

```javascript
el.textContent = '';
const img = document.createElement('img');
img.src = 'xyz.jpg';
el.appendChild(img);
```

{% endCompare %}

#### Использование библиотеки

Некоторые библиотеки уже поддерживают генерацию доверенных типов, которые можно передавать функциям-приемникам. Например, при помощи [DOMPurify](https://github.com/cure53/DOMPurify) можно санитизировать фрагменты HTML-кода, удаляя полезные нагрузки для эксплуатации XSS.

```javascript
import DOMPurify from 'dompurify';
el.innerHTML = DOMPurify.sanitize(html, {RETURN_TRUSTED_TYPE: true});
```

DOMPurify [поддерживает доверенные типы](https://github.com/cure53/DOMPurify#what-about-dompurify-and-trusted-types) и возвращает санитизированный HTML-код в виде объекта `TrustedHTML`, благодаря чему в браузере не будут возникать сообщения о нарушениях. {% Aside 'caution' %} Если логика санитизации в DOMPurify содержит ошибки, появление в приложении уязвимости DOM XSS по-прежнему возможно. Доверенные типы делают обработку значений обязательной, однако не определяют правила такой обработки и не гарантируют ее безопасность. {% endAside %}

#### Создание политики доверенного типа

В некоторых случаях удалить функциональность, являющуюся причиной проблемы, невозможно, а готовой библиотеки для санитизации значения и создания доверенного типа не существует. В таких случаях объект доверенного типа необходимо создать самостоятельно.

Чтобы это сделать, для сначала создайте [политику](https://w3c.github.io/webappsec-trusted-types/dist/spec/#policies-hdr). Политики — это фабричные методы для доверенных типов, которые применяют к входным данным определенные правила для обеспечения безопасности:

```javascript/2
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
    createHTML: string => string.replace(/\</g, '<')
  });
}
```

Этот код создает политику под названием `myEscapePolicy` которая может генерировать объекты `TrustedHTML` при помощи функции `createHTML()`. В соответствии с заданными правилами, к символам `<` будет применяться HTML-экранирование, чтобы предотвратить создание новых HTML-элементов.

Используйте политику следующим образом:

```javascript
const escaped = escapeHTMLPolicy.createHTML('<img src=x onerror=alert(1)>');
console.log(escaped instanceof TrustedHTML);  // true
el.innerHTML = escaped;  // '<img src=x onerror=alert(1)>'
```

{% Aside %} В то время как функция JavaScript, передаваемая в `trustedTypes.createPolicy()` под именем `createHTML()`, возвращает строку, сама функция `createPolicy()` возвращает объект политики, при помощи которого можно обернуть значение в соответствующий тип — в данном случае `TrustedHTML`. {% endAside %}

#### Использование политики по умолчанию

Иногда невозможно изменить код, являющийся причиной проблемы, например если он относится к сторонней библиотеке, загружаемой из CDN. В этом случае используйте [политику по умолчанию](https://w3c.github.io/webappsec-trusted-types/dist/spec/#default-policy-hdr):

```javascript
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  trustedTypes.createPolicy('default', {
    createHTML: (string, sink) => DOMPurify.sanitize(string, {RETURN_TRUSTED_TYPE: true})
  });
}
```

Политика `default` используется для всех строк, попадающих в приемник, который принимает только доверенные типы. {% Aside 'gotchas' %} Не злоупотребляйте использованием политики по умолчанию; вместо этого старайтесь адаптировать код приложения для использования обычных политик. При таком подходе правила безопасности более тесно связаны с обрабатываемыми данными, благодаря чему вы можете учитывать контекст при санитизации значений. {% endAside %}

### Активируйте политику безопасности контента

Как только сообщения об ошибках в вашем приложении устранены, вы можете включить обязательное использование доверенных типов:

```text
Content-Security-Policy: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

Готово! Теперь, каким бы сложным ни было ваше веб-приложение, единственный возможный источник уязвимостей DOM XSS — это код ваших политик (и вы можете еще сильнее ограничить их использование посредством [ограничения создания политик](https://w3c.github.io/webappsec-trusted-types/dist/spec/#trusted-types-csp-directive)).

## Материалы для дальнейшего чтения

- [Trusted Types на GitHub](https://github.com/w3c/webappsec-trusted-types)
- [Черновик спецификации W3C](https://w3c.github.io/webappsec-trusted-types/dist/spec/)
- [Часто задаваемые вопросы](https://github.com/w3c/webappsec-trusted-types/wiki/FAQ)
- [Интеграции](https://github.com/w3c/webappsec-trusted-types/wiki/Integrations)
