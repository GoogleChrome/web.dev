---
layout: post
title: Ссылки на пункты назначения из разных источников небезопасны
description: |2

  Узнайте, как безопасно ссылаться на ресурсы на другом хосте.
web_lighthouse:
  - external-anchors-use-rel-noopener
date: 2019-05-02
updated: 2019-08-28
---

Устанавливая ссылку на страницу на другом сайте с помощью атрибута `target="_blank"`, вы можете подвергнуть свой сайт проблемам с производительностью и безопасностью:

- Другая страница может выполняться в рамках того же процесса, что и ваша страница. Если на другой странице выполняется много JavaScript, производительность вашей страницы может снизиться.
- Другая страница может получить доступ к объекту `window` с помощью свойства `window.opener`. Это может позволить другой странице перенаправить вашу страницу на вредоносный URL.

Добавление `rel="noopener"` или `rel="noreferrer"` к ссылкам `target="_blank"` позволяет избежать этих проблем.

{% Aside%} Начиная с Chromium версии 88, якоря с `target="_blank"` по умолчанию получают [поведение `noopener`](https://www.chromestatus.com/feature/6140064063029248). Явное указание `rel="noopener"` помогает защитить пользователей устаревших браузеров, включая Edge Legacy и Internet Explorer. {% endAside%}

## Почему аудит пункта назначения из разных источников Lighthouse завершается неудачей

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) помечает небезопасные ссылки на пункты назначения из разных источников:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ztiQKS8eOfdzONC7bocp.png", alt="Аудит Lighthouse, показывающий небезопасные ссылки на пункты назначения из разных источников", width="800", height="213" %}</figure>

Lighthouse использует следующий процесс для определения ссылок как небезопасных:

1. Сбор всех тегов `<a>`, содержащих атрибут `target="_blank"` без атрибутов `rel="noopener"` или `rel="noreferrer"`.
2. Фильтрация всех ссылок с одинаковым хостом.

Поскольку Lighthouse отфильтровывает ссылки с одним и тем же хостом, есть крайний случай, на который следует обратить внимание при работе с большим сайтом: если одна страница содержит ссылку с `target="_blank"` на другую страницу вашего сайта без использования `rel="noopener"`, последствия этого аудита для производительности по-прежнему остаются в силе. Однако вы не увидите эти ссылки в результатах поиска Lighthouse.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Как повысить производительность вашего сайта и предотвратить уязвимости системы безопасности

Добавьте `rel="noopener"` или `rel="noreferrer"` к каждой ссылке, указанной в вашем отчете Lighthouse. В общем, при использовании `target="_blank"` всегда добавляйте `rel="noopener"` или `rel="noreferrer"`:

```html
<a href="https://examplepetstore.com" target="_blank" rel="noopener">
  Example Pet Store
</a>
```

- `rel="noopener"` предотвращает доступ новой страницы к свойству `window.opener` и обеспечивает ее запуск в отдельном процессе.
- `rel="noreferrer"` имеет тот же эффект, но также предотвращает перенаправление заголовка `Referer` на новую страницу. См. [Тип ссылки "noreferrer"](https://html.spec.whatwg.org/multipage/links.html#link-type-noreferrer).

Дополнительную информацию см. в публикации «[Безопасный общий доступ к ресурсам из разных источников](/cross-origin-resource-sharing/)».

## Ресурсы

- [Исходный код для аудита «**Небезопасные ссылки на пункты назначения из разных источников**»](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/external-anchors-use-rel-noopener.js)
- [Безопасный общий доступ к ресурсам из разных источников](/cross-origin-resource-sharing/)
- [Изоляция сайта для веб-разработчиков](https://developers.google.com/web/updates/2018/07/site-isolation)
