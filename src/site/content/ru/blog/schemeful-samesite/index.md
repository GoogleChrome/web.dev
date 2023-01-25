---
layout: post
title: Same-Site с учетом схемы
subhead: |-
  Определение «того же сайта» (Same-Site) меняется и будет учитывать схему URL-адреса,
  поэтому ссылки между HTTP- и HTTPS-версиями теперь считаются
  межсайтовыми запросами. Перейдя на HTTPS по умолчанию, вы избежите возможных проблем.
  В статье рассказывается о том, какие значения атрибутов SameSite необходимы.
description: |-
  Определение «того же сайта» (Same-Site) меняется и будет учитывать схему URL-адреса,
  поэтому ссылки между HTTP- и HTTPS-версиями теперь считаются
  межсайтовыми запросами. Перейдя на HTTPS по умолчанию, вы избежите возможных проблем.
  В статье рассказывается о том, какие значения атрибутов SameSite необходимы.
authors:
  - bingler
  - rowan_m
date: 2020-11-20
hero: image/admin/UMxBPy0AKAfbzxwgTroV.jpg
thumbnail: image/admin/3J33n1o98vnkO6fdDFwP.jpg
alt: |-
  Две отдельные тарелки с печеньем, которые представляют собой разные схемы:
  HTTP и HTTPS. Печение — файлы cookie.
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside %} Эта статья входит в серии об изменениях атрибута `SameSite` файлов cookie:

- [Что такое файлы cookie SameSite](/samesite-cookies-explained/).
- [Примеры использования файлов cookie SameSite](/samesite-cookie-recipes/).
- [Same-Site с учетом схемы](/schemeful-samesite). {% endAside %}

Спецификация [Same-Site с учетом схемы](https://mikewest.github.io/cookie-incrementalism/draft-west-cookie-incrementalism.html#rfc.section.3.3) определяет (веб-)сайт не как регистрируемый домен, а как схему + регистрируемый домен. Более подробную информацию и примеры см. в статье [Что такое «same-site» и «same-origin»](/same-site-same-origin/#%22schemeful-same-site%22).

{% Aside 'key-term' %} Это означает, что незащищенная HTTP-версия сайта (например, **http**://website.example) и защищенная HTTPS-версия (**https**://website.example) считаются **различными сайтами** друг по отношению к другу. {% endAside %}

Если ваш сайт уже полностью перешел на HTTPS, то вам повезло: волноваться не о чем, для вас ничего не изменится.

Если вы еще не полностью обновили сайт, то это нужно сделать в первую очередь. Однако если в некоторых случаях посетители сайта будут переходить между HTTP и HTTPS, то вам будет полезно знать о приведенных ниже сценариях и поведении соответствующего файла cookie `SameSite`.

{% Aside 'warning' %} Долгосрочная цель — [постепенно прекратить поддержку сторонних файлов cookie полностью](https://blog.chromium.org/2020/10/progress-on-privacy-sandbox-and.html) и заменить их альтернативными решениями, которые сохраняют конфиденциальность. Значение `SameSite=None; Secure` в файле cookie, которое позволяет отправлять его по различным схемам, должно считаться временным решением при переходе на полный HTTPS. {% endAside %}

Включить эти изменения и протестировать их можно и в Chrome, и в Firefox.

- В Chrome 86 включите `about://flags/#schemeful-same-site`. Следить за прогрессом можно на [странице состояния Chrome](https://chromestatus.com/feature/5096179480133632).
- В Firefox 79 установите для параметра `network.cookie.sameSite.schemeful` значение `true` на странице `about:config`. Следить за прогрессом можно на странице [проблемы в Bugzilla](https://bugzilla.mozilla.org/show_bug.cgi?id=1651119).

Одна из основных причин изменений в `SameSite=Lax` по умолчанию для файлов cookie — это защита от [подделки межсайтовых запросов (CSRF)](https://developer.mozilla.org/docs/Glossary/CSRF). Однако незащищенный HTTP-трафик дает возможность злоумышленникам подделать файлы cookie, которые затем будут использованы в защищенной HTTPS-версии сайта. Дополнительное межсайтовое разграничение между схемами позволяет обеспечить бо́льшую защиту от таких атак.

## Распространенные сценарии межсхемных переходов

{% Aside 'key-term' %} В примерах ниже, где у всех URL-адресов одинаковый регистрируемый домен (например site.example), но разные схемы (например,  **http**://site.example и **https**://site.example), они считаются **межсхемными** друг по отношению к другу. {% endAside %}

### Переходы

При переходе между версиями веб-сайта на различных схемах (например, по ссылке с **http**://site.example на **https**://site.example) раньше разрешалось отправлять файлы cookie `SameSite=Strict`. Теперь это рассматривается как межсайтовый переход, поэтому файлы cookie `SameSite=Strict` будут заблокированы.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yDViqKg9eeEeAEiCNqe4.png", alt="Межсхемный переход по ссылке в незащищенной HTTP-версии сайта, ведущей на защищенную HTTPS-версию. Файлы cookie «SameSite=Strict» заблокированы, «SameSite=Lax» и «SameSite=None; Secure» разрешены", width="800", height="342" %}   <figcaption>     Межсхемный переход с HTTP на HTTPS   </figcaption></figure>

<table>
  <tr>
   <td>
   </td>
   <td>
<strong>HTTP → HTTPS</strong>
   </td>
   <td>
<strong>HTTPS → HTTP</strong>
   </td>
  </tr>
  <tr>
   <td>
<code>SameSite=Strict</code>
   </td>
   <td>⛔ Блокируется</td>
   <td>⛔ Блокируется</td>
  </tr>
  <tr>
   <td>
<code>SameSite=Lax</code>
   </td>
   <td>✓ Разрешено</td>
   <td>✓ Разрешено</td>
  </tr>
  <tr>
   <td>
<code>SameSite=None;Secure</code>
   </td>
   <td>✓ Разрешено</td>
   <td>⛔ Блокируется</td>
  </tr>
</table>

### Загрузка подресурсов

{% Aside 'warning' %} Все основные браузеры блокируют [активный смешанный контент](https://developer.mozilla.org/docs/Web/Security/Mixed_content), например скрипты и окна iframe. Кроме того, в браузерах, в том числе в [Chrome](https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html) и [Firefox](https://groups.google.com/g/mozilla.dev.platform/c/F163Jz32oYY), ведется работа над блокировкой пассивного смешанного контента (и переключением его на HTTPS). {% endAside %}

Вносимые согласно рекомендациям в статье изменения следует рассматривать как заплатку на время, пока вы переходите на полный HTTPS.

Подресурсами могут быть изображения, окна iframe и сетевые запросы, сделанные через XHR или Fetch.

Раньше загрузка межсхемного подресурса на странице позволяла отправлять и устанавливать файлы cookie `SameSite=Strict` и `SameSite=Lax`. Теперь этот случай обрабатывается так же, как любой иной сторонний или межсайтовый подресурс: все файлы cookie `SameSite=Strict` и `SameSite=Lax` блокируются.

Кроме того, даже если браузер разрешает загрузку ресурсов из незащищенных схем на защищенной странице, все файлы cookie по этим запросам будут блокироваться, поскольку сторонние и межсайтовые файлы cookie требуют `Secure`.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GgR6Yln1f9JGkt04exRC.png", alt="Межсхемный подресурс, полученный в результате включения ресурса из защищенной HTTPS-версии сайта в незащищенную HTTP-версию. Файлы cookie «SameSite=Strict» и «SameSite=Lax» блокируются, «SameSite=None; Secure» разрешены", width="800", height="285" %}   <figcaption>     Страница HTTP, использующая межсхемный подресурс через HTTPS   </figcaption></figure>

<table>
  <tr>
   <td>
   </td>
   <td>
<strong>HTTP → HTTPS</strong>
   </td>
   <td>
<strong>HTTPS → HTTP</strong>
   </td>
  </tr>
  <tr>
   <td>
<code>SameSite=Strict</code>
   </td>
   <td>⛔ Блокируется</td>
   <td>⛔ Блокируется</td>
  </tr>
  <tr>
   <td>
<code>SameSite=Lax</code>
   </td>
   <td>⛔ Блокируется</td>
   <td>⛔ Блокируется</td>
  </tr>
  <tr>
   <td>
<code>SameSite=None;Secure</code>
   </td>
   <td>✓ Разрешено</td>
   <td>⛔ Блокируется</td>
  </tr>
</table>

### Отправка формы запросом POST

Отправка запроса POST между версиями веб-сайта с различными схемами раньше позволяла отправлять файлы cookie со значениями `SameSite=Lax` и `SameSite=Strict`. Теперь этот случай обрабатывается как межсайтовый POST: отправлять можно только `SameSite=None`. Примером такого случая могут быть сайты, которые по умолчанию дают незащищенную версию, но переводят пользователей на защищенную при отправке формы входа или оформления заказа.

Как и в случае с подресурсами, если запрос идет из защищенного контекста (например, HTTPS) на незащищенный (например, HTTP), то все файлы cookie в нем будут блокироваться, поскольку сторонние и межсайтовые файлы cookie требуют `Secure`.

{% Aside 'warning' %} Лучшее решение здесь — сделать так, чтобы страница формы и целевой ресурс были на защищенном подключении, например HTTPS. Это особенно важно, если пользователь вводит в форме конфиденциальную информацию. {% endAside %}

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ud9LkDeGJUWHObifD718.png", alt="Межсхемная отправка формы в результате отправки формы из незащищенной HTTP-версии сайта в защищенную HTTPS-версию. Файлы cookie «SameSite=Strict» и «SameSite=Lax» блокируются, «SameSite=None; Secure» разрешены", width="800", height="376" %}   <figcaption>     Межсхемная отправка формы из HTTP в HTTPS   </figcaption></figure>

<table>
  <tr>
   <td>
   </td>
   <td>
<strong>HTTP → HTTPS</strong>
   </td>
   <td>
<strong>HTTPS → HTTP</strong>
   </td>
  </tr>
  <tr>
   <td>
<code>SameSite=Strict</code>
   </td>
   <td>⛔ Блокируется</td>
   <td>⛔ Блокируется</td>
  </tr>
  <tr>
   <td>
<code>SameSite=Lax</code>
   </td>
   <td>⛔ Блокируется</td>
   <td>⛔ Блокируется</td>
  </tr>
  <tr>
   <td>
<code>SameSite=None;Secure</code>
   </td>
   <td>✓ Разрешено</td>
   <td>⛔ Блокируется</td>
  </tr>
</table>

## Как проверить свой сайт

В Chrome и Firefox можно использовать инструменты разработчика и передачи сообщений.

В Chrome 86 на [вкладке «Проблемы» (Issues) в DevTools](https://developer.chrome.com/docs/devtools/issues/) будут показаны проблемы, относящиеся к Same-Site с учетом схемы. Возможные проблемы приведены ниже.

Проблемы с переходами:

- «Чтобы файлы cookie в будущем могли отправляться с запросами Same-Site, перейдите полностью на HTTPS» (Migrate entirely to HTTPS to continue having cookies sent on same-site requests) — предупреждение о том, что файл cookie  **будет заблокирован** в будущей версии Chrome.
- «Чтобы отправлять файлы cookie с запросами Same-Site, перейдите полностью на HTTPS» (Migrate entirely to HTTPS to have cookies sent on same-site requests) — предупреждение о том, что файл cookie **был заблокирован**.

Проблемы с загрузкой подресурсов:

- «Чтобы файлы cookie в будущем могли отправляться на подресурсы Same-Site, перейдите полностью HTTPS» (Migrate entirely to HTTPS to continue having cookies sent to subresources) или «Чтобы файлы cookie в будущем могли устанавливаться подресурсами Same-Site, перейдите полностью HTTPS» (Migrate entirely to HTTPS to continue allowing cookies tobe set by same-site subresources) — предупреждения о том, что файл cookie  **будет заблокирован** в будущей версии Chrome.
- «Чтобы отправлять файлы cookie на подресурсы Same-Site, перейдите полностью на HTTPS» (Migrate entirely to HTTPS to have cookies sent to same-site subresources) и «Чтобы устанавливать файлы cookie подресурсами Same-Site, перейдите полностью HTTPS» (Migrate entirely to HTTPS to allow cookies to be set by same-site subresources) — предупреждения о том, что файл cookie **был заблокирован**. Последнее предупреждение также может появиться при отправке формы запросом POST.

Подробнее — в статье [Советы по тестированию и отладке Same-Site с учетом схемы](https://www.chromium.org/updates/schemeful-same-site/testing-and-debugging-tips-for-schemeful-same-site).

В Firefox 79 и выше, если для параметра `network.cookie.sameSite.schemeful` установлено `true` (на странице `about:config`), в консоли будет отображаться сообщение о проблемах, относящихся к Same-Site с учетом схемы. Возможные проблемы:

- «Файл cookie `cookie_name` **скоро будет обрабатываться** как межсайтовый по отношению к `http://site.example/`, потому что схемы не совпадают» (Cookie <code>cookie_name</code> <strong>will be soon</strong> treated as cross-site cookie against `http://site.example/` because the scheme does not match).
- «Файл cookie `cookie_name` **был обработан** как межсайтовый по отношению к `http://site.example/`, потому что схемы не совпадают» (Cookie <code>cookie_name</code> <strong>has been</strong> treated as cross-site cookie against `http://site.example/` because the scheme does not match).

## Часто задаваемые вопросы

### Сайт уже полностью на HTTPS. Почему в инструментах разработчика браузера показаны проблемы?

Возможно, некоторые ссылки и подресурсы по-прежнему ведут на незащищенные URL-адреса.

Один из способов решить эту проблему — использовать [HTTP Strict-Transport-Security](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security) (HSTS) и директиву `includeSubDomain`. Если использовать HSTS в сочетании с `includeSubDomain`, то даже если на одной из страниц случайно окажется незащищенная ссылка, браузер будет автоматически использовать ее защищенную версию.

### Что делать, если перейти на HTTPS нет возможности?

Мы настоятельно рекомендуем полностью перевести сайт на HTTPS, поскольку это позволит защитить пользователей. Если вы не можете сделать это сами, рекомендуем обратиться к хостинг-провайдеру: возможно, у него есть такая услуга. Если у вас собственный хостинг, установите и настройте сертификат с помощью инструментов [Let's Encrypt](https://letsencrypt.org/). Также можете изучить вопрос о переносе сайта в CDN или использовании прокси-сервера, который обеспечивает подключение по HTTPS.

Если предложенные варианты не подходят, попробуйте ослабить защиту `SameSite` на соответствующих файлах cookie.

- Если блокируются только файлы cookie `SameSite=Strict`, можно снизить защиту до `Lax`.
- Если блокируются и `Strict`, и `Lax`, причем эти файлы cookie отправляются на защищенный URL (или устанавливаются с него), можно снизить защиту до `None`.
    - Такой подход **не сработает**, если URL-адрес, на который файлы cookie отправляются (или с которого устанавливаются), является незащищенным: для `SameSite=None` нужен атрибут `Secure` на файлах cookie, который означает, что их нельзя отправлять и устанавливать по незащищенному подключению. В этом случае вы не сможете получить доступ к такому файлу cookie, пока сайт не перейдет на HTTPS.
    - Помните, что это временное решение: через некоторое время поддержка сторонних файлов cookie будет прекращена полностью.

### Как это повлияет на файлы cookie, для которых не указан атрибут `SameSite`?

Файлы cookie без атрибута `SameSite` обрабатываются так, как если бы для них было указано `SameSite=Lax`, и к ним применяется тот же межсхемный алгоритм поведения. При этом помните, что для небезопасных методов всё еще действует временное исключение. Подробнее — на странице <a href="https://www.chromium.org/updates/same-site/faq" data-md-type="link">о случае Lax + POST в ответах на вопросы о `SameSite` для Chromium</a>.

### Как это влияет на WebSocket?

Подключения WebSocket будут по-прежнему считаться Same-Site, если у них такой же уровень защищенности, как у страницы.

Same-Site:

- подключение `wss://` с `https://`;
- подключение `ws://` с `http://`.

Не Same-Site:

- подключение `wss://` с `http://`;
- подключение `ws://` с `https://`.

*Автор фото — [Джулисса Капдевилла](https://unsplash.com/photos/wNjgWrEXAL0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText), платформа [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*
