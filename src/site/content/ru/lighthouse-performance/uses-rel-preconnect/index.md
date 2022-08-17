---
layout: post
title: Используйте предварительное подключение к необходимым доменам
description: Узнайте о проверке uses-rel-preconnect.
date: 2019-05-02
updated: 2020-05-06
web_lighthouse:
  - uses-rel-preconnect
---

В разделе Opportunities (Возможности) отчета Lighthouse перечислены все ключевые запросы, для которых еще не установлен приоритет запросов на выборку с помощью `<link rel=preconnect>`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K5TLz5LOyRjffxJ6J9zl.png", alt="Скриншот проверки Preconnect to required origins (Используйте предварительное подключение к необходимым доменам) в Lighthouse", width="800", height="226" %}</figure>

## Совместимость с браузерами

`<link rel=preconnect>` поддерживается большинством браузеров. См. [совместимость с браузерами](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility).

## Увеличьте скорость загрузки страницы с помощью предварительного подключения

Подумайте о добавлении ресурсных подсказок `preconnect` или `dns-prefetch`, чтобы установить предварительные подключения к важным сторонним источникам.

`<link rel="preconnect">` сообщает браузеру, что страница намеревается создать подключение к другому источнику и что нужно начать этот процесс как можно скорее.

В медленных сетях установление соединения часто занимает много времени, особенно когда речь идет о безопасном соединении, поскольку оно может включать в себя поиск DNS, перенаправление и несколько циклов обращения к конечному серверу, который обрабатывает запрос пользователя.

Позаботившись обо всем этом заранее, вы сможете сделать так, чтобы ваше приложение казалось пользователю гораздо более быстрым без негативного влияния на использование полосы пропускания. Большую часть времени при установлении соединения занимает ожидание, а не обмен данными.

Проинформировать браузер о своем намерении так же просто, как добавить тег ссылки на свою страницу:

`<link rel="preconnect" href="https://example.com">`

Таким образом вы сообщаете браузеру, что страница намерена подключиться к `example.com` и получить оттуда содержимое.

Имейте в виду, что, хотя `<link rel="preconnect">` довольно дешев, он всё же может отнимать драгоценное время процессора, особенно при защищенных соединениях. Это особенно плохо, если соединение не используется в течение 10 секунд, поскольку браузер закрывает его, зря выполняя всю эту работу по предварительному подключению.

В общем, попробуйте использовать `<link rel="preload">`, так как это более комплексная настройка производительности, но держите `<link rel="preconnect">` в своем арсенале для крайних случаев, например:

- [Пример использования: знать, откуда, но не знать, что вы получаете](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching).
- [Пример использования: потоковое мультимедиа](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching).

`<link rel="dns-prefetch">` — еще один тип `<link>`, связанный с подключениями. Он обрабатывает только поиск DNS, но более широко поддерживается браузерами, поэтому может служить хорошим запасным вариантом. Применяется он точно так же:

```html
<link rel="dns-prefetch" href="https://example.com">.
```

## Рекомендации по стекам

### Drupal

Используйте [модуль, который поддерживает ресурсные подсказки пользовательского агента](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=dns-prefetch&solrsort=iss_project_release_usage+desc&op=Search), чтобы вы могли устанавливать и настраивать ресурсные подсказки preconnect или dns-prefetch.

### Magento

[Измените макет ваших тем](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html) и добавьте ресурсные подсказки preconnect или dns-prefetch.

## Ресурсы

- [Исходный код проверки **Preconnect to required origins (Используйте предварительное подключение к необходимым доменам)**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/uses-rel-preconnect.js).
- [Приоритизация ресурсов — как заставить браузер помочь вам](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect).
- [Устанавливайте сетевые подключения заранее, чтобы улучшить воспринимаемую скорость загрузки страницы](/preconnect-and-dns-prefetch/).
- [Типы ссылок: preconnect](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility).
