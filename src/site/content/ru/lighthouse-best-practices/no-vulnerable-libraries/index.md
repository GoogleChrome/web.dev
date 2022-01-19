---
layout: post-old
title: Страница включает интерфейсные библиотеки JavaScript с известными уязвимостями безопасности
description: Узнайте, как сделать свою страницу более безопасной, заменив библиотеки JavaScript, которые имеют известные уязвимости.
web_lighthouse:
  - no-vulnerable-libraries
date: 2019-05-02
updated: 2020-06-04
---

У злоумышленников есть автоматические поисковые роботы, которые могут сканировать ваш сайт на предмет известных уязвимостей. Когда поисковый робот обнаруживает уязвимость, он предупреждает злоумышленника. Дальше злоумышленнику достаточно просто выяснить, как использовать уязвимость на вашем сайте.

## Причины плохих результатов этого аудита в Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) помечает интерфейсные библиотеки JavaScript с известными уязвимостями безопасности:

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7xN0qVP92s6g1XrNru1f.png", alt="Аудит Lighthouse, показывающий все интерфейсные библиотеки JavaScript с известными уязвимостями безопасности, используемые на странице", width="800", height="190", class="w-screenshot" %}</figure>

Чтобы обнаружить уязвимые библиотеки, Lighthouse:

- Запускает [детектор библиотек для Chrome](https://www.npmjs.com/package/js-library-detector).
- Проверяет список обнаруженных библиотек по [базе данных уязвимостей snyk](https://snyk.io/vuln?packageManager=all).

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Прекратите использовать небезопасные библиотеки JavaScript

Прекратите использовать библиотеки, помеченные Lighthouse. Если была выпущена более новая версия библиотеки, в которой уязвимость исправлена, обновитесь до этой версии. Если новая версия библиотеки не выпускалась или библиотека больше не поддерживается, рассмотрите возможность использования другой библиотеки.

Нажмите на ссылки в столбце «**Версия библиотеки**» своего отчета, чтобы узнать больше об уязвимостях каждой библиотеки.

## Ресурсы

- [Исходный код для аудита «**Включает интерфейсные библиотеки JavaScript с известными уязвимостями безопасности**» (Includes front-end JavaScript libraries with known security vulnerabilities)](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-vulnerable-libraries.js)
- [База данных уязвимостей snyk](https://snyk.io/vuln?packageManager=all)
