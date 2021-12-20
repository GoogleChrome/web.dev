---
layout: post
title: "Аудит «Недопустимый файл 'robots.txt'»"
description: "Узнайте об аудите Lighthouse «Недопустимый файл 'robots.txt'»."
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - robots-txt
---

Файл `robots.txt` сообщает поисковым системам, какие страницы вашего сайта они могут сканировать. Недопустимый файл `robots.txt` может вызвать проблемы двух типов:

- Это может помешать поисковым системам сканировать общедоступные страницы, в результате чего ваш контент будет реже отображаться в результатах поиска.
- Это может привести к тому, что поисковые системы будут сканировать страницы, которые вы не хотите показывать в результатах поиска.

## Причины плохих результатов аудита `robots.txt` в Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) отмечает недопустимые файлы `robots.txt`:

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/X29ztochZPiUVwPo2rg3.png", alt="Аудит Lighthouse показывает недопустимый файл robots.txt", width="800", height="203", class="w-screenshot w-screenshot" %}</figure>

{% Aside %} Большинство аудитов Lighthouse применяется только к той странице, на которой вы сейчас находитесь. Однако, поскольку `robots.txt` определяется на уровне имени хоста, этот аудит применяется ко всему вашему домену (или субдомену). {% endAside %}

Разверните аудит «**Недопустимый файл `robots.txt`**» (robots.txt is not valid) в своем отчете, чтобы узнать, что не так с вашим `robots.txt`.

К распространенным ошибкам относятся:

- `No user-agent specified (директива user-agent не задана)`
- `Pattern should either be empty, start with "/" or "*" (правило начинается не с символа / и не с символа *)`
- `Unknown directive (неизвестная директива)`
- `Invalid sitemap URL (некорректный формат URL файла Sitemap)`
- `$ should only be used at the end of the pattern (символ $ можно использовать только в конце правила)`

Lighthouse не проверяет правильность расположения файла `robots.txt`. Для правильной работы файл должен находиться в корне вашего домена или субдомена.

{% include 'content/lighthouse-seo/scoring.njk' %}

## Как исправить проблемы с `robots.txt`

### Убедитесь, что `robots.txt` не возвращает код состояния HTTP 5XX

Если ваш сервер возвращает ошибку сервера ([код состояния HTTP](/http-status-code) 5xx) для `robots.txt`, поисковые системы не будут знать, какие страницы следует сканировать. Они могут перестать сканировать весь ваш сайт, что предотвратит индексацию нового контента.

Чтобы проверить код состояния HTTP, откройте `robots.txt` в Chrome и [проверьте запрос в Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/network/reference#analyze).

### Размер `robots.txt` не должен превышать 500 КиБ

Поисковые системы могут прекратить обработку `robots.txt` на середине, если размер файла превышает 500 КиБ. Это может сбить с толку поисковую систему и привести к некорректному сканированию вашего сайта.

Чтобы `robots.txt` не превышал допустимый размер, старайтесь меньше исключать индивидуальные страницы и больше внимания уделяйте более широким шаблонам. Например, если вам нужно заблокировать сканирование файлов PDF, не запрещайте каждый отдельный файл. Вместо этого запретите все URL-адреса, содержащие `.pdf`, используя `disallow: /*.pdf`.

### Исправьте ошибки форматирования

- В `robots.txt` допускаются только пустые строки, комментарии и директивы, соответствующие формату «имя: значение».
- Убедитесь, что значения `allow` и `disallow` либо пусты, либо начинаются с `/` или `*`.
- Не используйте `$` в середине значения (например, `allow: /file$html`).

#### Убедитесь, что для `user-agent` есть значение

Имена пользовательских агентов сообщают сканерам поисковых систем, каким директивам следует следовать. Вы должны указать значение для каждого экземпляра `user-agent`, чтобы поисковые системы знали, нужно ли следовать соответствующему набору директив.

Чтобы указать конкретный сканер поисковой системы, используйте имя пользовательского агента из ее опубликованного списка. (Например, вот [список пользовательских агентов Google, используемых для сканирования](https://support.google.com/webmasters/answer/1061943).)

Используйте символ `*`, чтобы указать все поисковые роботы, не указанные иным способом.

{% Compare 'worse', 'Неправильно' %}

```text
user-agent:
disallow: /downloads/
```

Пользовательский агент не определен. {% endCompare %}

{% Compare 'better', 'Правильно' %}

```text
user-agent: *
disallow: /downloads/

user-agent: magicsearchbot
disallow: /uploads/
```

Определены общий пользовательский агент и пользовательский агент `magicsearchbot`. {% endCompare %}

#### Убедитесь, что директивы `allow` или `disallow` не предшествуют `user-agent`

Имена пользовательских агентов определяют разделы файла `robots.txt`. Сканеры поисковых систем используют эти разделы, чтобы определить, каким директивам следовать. Размещение директивы *перед* именем первого пользовательского агента означает, что никакие сканеры не будут ей следовать.

{% Compare 'worse', 'Неправильно' %}

```text
# начало файла
disallow: /downloads/

user-agent: magicsearchbot
allow: /
```

Директиву `disallow: /downloads` не прочитает ни один поисковый робот. {% endCompare %}

{% Compare 'better', 'Правильно' %}

```text
# начало файла
user-agent: *
disallow: /downloads/
```

Всем поисковым системам запрещено сканировать папку `/downloads` {% endCompare %}

Сканеры поисковых систем следуют директивам только в разделе с более точно указанным именем пользовательского агента. Например, если у вас есть директивы для `user-agent: *` и `user-agent: Googlebot-Image` , робот Googlebot Images будет следовать только директивам в разделе `user-agent: Googlebot-Image`.

#### Укажите абсолютный URL-адрес для `sitemap`

[Файлы Sitemap](https://support.google.com/webmasters/answer/156184) нужны для того, чтобы сообщать поисковым системам о страницах вашего сайта. Файл sitemap обычно включает в себя список URL-адресов на вашем веб-сайте вместе с информацией о том, когда они в последний раз были изменены.

Если вы решили отправить файл sitemap в `robots.txt`, убедитесь, что используете [абсолютный URL](https://tools.ietf.org/html/rfc3986#page-27).

{% Compare 'worse', 'Неправильно' %}

```text
sitemap: /sitemap-file.xml
```

{% endCompare %}

{% Compare 'better', 'Правильно' %}

```text
sitemap: https://example.com/sitemap-file.xml
```

{% endCompare %}

## Ресурсы

- [Исходный код для аудита «**Недопустимый файл `robots.txt`**» (robots.txt is not valid)](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/robots-txt.js)
- [Создание `файла robots.txt`](https://support.google.com/webmasters/answer/6062596)
- [Robots.txt](https://moz.com/learn/seo/robotstxt)
- [Спецификации метатега robots и HTTP-заголовка X-Robots-Tag](https://developers.google.com/search/reference/robots_meta_tag)
- [Узнайте о файлах Sitemap](https://support.google.com/webmasters/answer/156184)
- [Сканеры Google (пользовательские агенты)](https://support.google.com/webmasters/answer/1061943)
