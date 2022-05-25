---
layout: post
title: Как сделать PWA-приложение похожим на обычное
subhead: Сделайте ваше прогрессивное веб-приложение похожим на «настоящее» приложение, а не на сайт
authors:
  - thomassteiner
description: Узнайте, как сделать прогрессивное веб-приложение похожим на «настоящее», используя веб-технологии для реализации «родной» функциональности.
date: 2020-06-15
updated: 2020-07-23
tags:
  - capabilities
---

Если спросить любого человека, что такое PWA, скорее всего, вам ответят, что это обыкновенный сайт. То же самое говорится и [в документации Microsoft](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/#progressive-web-apps-on-windows:~:text=PWAs%20are%20just%20websites), и [на нашем сайте](/progressive-web-apps/#content:~:text=Progressive%20Web%20Apps,Websites), и даже Фрэнсис Берриман и Алекс Рассел, которым принадлежит само авторство термина «PWA», это [не отрицают](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/#post-2263:~:text=they%E2%80%99re%20just%20websites). Да, PWA — это простые сайты, но у них гораздо больше возможностей. При правильном подходе к разработке PWA будет ощущаться не как сайт, а как «настоящее» приложение. Давайте разберемся, что это значит.

Мы рассмотрим этот вопрос на примере приложения Apple [Podcasts](https://support.apple.com/en-us/HT201859). Оно доступно на настольных ПК под управлением macOS, а также на мобильных устройствах под управлением iOS и iPadOS. Хотя Podcasts — это мультимедийное приложение, его основные особенности, которые мы здесь рассмотрим, применимы и к другим категориям приложений.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aNYiT2EkVkjNplAIKbLU.png", alt="iPhone и MacBook, стоящие рядом; на обоих запущено приложение Podcasts.", width="800", height="617" %} <figcaption>Apple Podcasts на iPhone и macOS (<a href="https://support.apple.com/en-us/HT201859">источник</a>).</figcaption></figure>

{% Aside 'caution' %} В каждом описании функции, доступной на iOS/Android/ПК, есть раздел **Как реализовать эту функцию в веб-приложении**, который можно открыть для получения дополнительных сведений. Обратите внимание, что описываемые API и функции поддерживаются не всеми сочетаниями браузеров и операционных систем. Внимательно ознакомьтесь с примечаниями о совместимости в прикрепленных ссылках. {% endAside %}

## Работа в офлайн-режиме

Если вы попытаетесь вспомнить родные приложения, которые стоят у вас на смартфоне или компьютере, у всех приложений будет важное сходство: они никогда не показывают пустой экран. Приложение Podcasts работает даже в офлайн-режиме: когда нет подключения к сети, оно по-прежнему открывается. В разделе **Топ-чарты** ничего нет; вместо содержимого отображается сообщение **Нет подключения к сети** и кнопка **Повторить попытку**. Не очень удобно, но приложением по-прежнему можно пользоваться.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMbGLQkbLROxmUMdxLET.png", alt="Приложение Podcasts, отображающее сообщение «Нет подключения к сети», когда интернет-соединение недоступно.", width="800", height="440" %} <figcaption>Приложение Podcasts без подключения к сети.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Приложение Podcasts следует так называемой модели «оболочки приложения». Все необходимые для работы приложения статические данные кешируются локально, включая декоративные изображения, такие как иконки меню слева или кнопки встроенного проигрывателя. Динамический контент, такой как содержимое раздела <b>Топ-чарты</b>, загружается по запросу; при этом в случае сбоя загрузки остается доступным резервный контент из локального кеша. Прочитайте статью <a href="https://developers.google.com/web/fundamentals/architecture/app-shell">Модель оболочки приложения</a>, чтобы узнать, как применить эту архитектурную модель к вашему веб-приложению. {% endDetails %}

## Доступ к контенту и воспроизведение медиафайлов в офлайн-режиме

Находясь офлайн, я по-прежнему могу открыть в левой боковой панели раздел «Загрузки» и прослушать скачанные выпуски подкастов, готовые к воспроизведению и отображаемые со всеми метаданными, такими как обложки и описания.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/onUIDiaFNNHOmnwXzRh1.png", alt="Приложение Podcasts, воспроизводящее скачанный выпуск подкаста.", width="800", height="440" %} <figcaption>Скачанные выпуски подкастов можно воспроизводить даже без подключения к сети.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Ранее скачанный мультимедийный контент можно воспроизводить из кеша, например при помощи рецепта <a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">Serve cached audio and video</a> («Воспроизведение кешированного аудио и видео») из библиотеки <a href="https://developer.chrome.com/docs/workbox/">Workbox</a>. Другие типы контента всегда можно сохранить либо в кеше, либо в IndexedDB. Подробнее о том, в каких случаях следует использовать различные технологии хранения данных, см. в статье <a href="/storage-for-the-web/">Хранение данных в веб-браузере</a>. Если вам нужно хранить данные без риска их потери при нехватке доступного объема памяти, используйте <a href="/persistent-storage/">Persistent Storage API</a>. {% endDetails %}

## Автоматическое фоновое скачивание

Когда я нахожусь в сети, я без проблем могу найти в приложении контент, например введя запрос `http 203`, и если я подпишусь на [подкаст HTTP 203](/podcasts/), высветившийся в результатах, то его последний выпуск мгновенно скачается, не требуя дополнительных действий.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WbCk4nPpBS3zwkPVRGuo.png", alt="Приложение Podcasts скачивает последний выпуск подкаста, после того как пользователь подписался.", width="800", height="658" %} <figcaption>Если подписаться на подкаст, тут же начинается скачивание последнего выпуска.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Скачивание выпуска подкаста — это процесс, который может занять много времени. <a href="https://developers.google.com/web/updates/2018/12/background-fetch">Background Fetch API</a> позволяет делегировать скачивание браузеру, который выполнит его в фоновом режиме. Более того, в Android браузер может, в свою очередь, делегировать процесс скачивания операционной системе, чтобы ему не пришлось непрерывно оставаться запущенным. Как только скачивание завершится, произойдет пробуждение сервис-воркера приложения и вы сможете обработать полученный ответ. {% endDetails %}

## Обмен и взаимодействие с другими приложениями

Приложение Podcasts естественным образом интегрируется с другими приложениями. Например, когда я щелкаю правой кнопкой мыши понравившийся выпуск, я могу поделиться им с другими приложениями на своем устройстве, например с приложением «Сообщения». Оно также легко взаимодействует с системным буфером обмена. Я могу щелкнуть правой кнопкой мыши любой выпуск и скопировать ссылку на него.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gKeFGOAZ2muuYeDNFbBW.png", alt="Контекстное меню при нажатии на подкаст в приложении Podcasts; выделен пункт «Поделиться выпуском &gt; Сообщения».", width="800", height="392" %} <figcaption>Как поделиться выпуском подкаста с приложением «Сообщения».</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} <a href="/web-share/">Web Share API</a> и <a href="/web-share-target/">Web Share Target API</a> позволяют приложению обмениваться текстами, файлами и ссылками с другими приложениями на устройстве. Хотя веб-приложения пока не могут добавлять пункты во встроенное контекстное меню операционной системы, существует множество других способов обмена данными с приложениям на устройстве. При помощи <a href="/image-support-for-async-clipboard/">Async Clipboard API</a> можно программно управлять текстовыми и графическими данными (PNG-изображениями) в системном буфере обмена. На Android можно использовать <a href="/contact-picker/">Contact Picker API</a> для выбора записей из списка контактов устройства. Если у вас есть как родное приложение, так и PWA, вы можете воспользоваться <a href="/get-installed-related-apps/">Get Installed Related Apps API</a>, чтобы проверить наличие установленного родного приложения. Если оно установлено, нет необходимости предлагать пользователю установить PWA или разрешить push-уведомления в веб-приложении. {% endDetails %}

## Фоновое обновление приложения

В настройках приложения Podcasts можно настроить автоматическое скачивание новых выпусков. Вам даже не нужно об этом помнить — у вас всегда будет самый свежий контент. Разве это не волшебство?

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iTKgVVjX0EM0RQS3ap4X.png", alt="Меню настроек приложения Podcasts; в разделе «Общие» параметр «Обновление подкастов» установлен в значение «Каждый час».", width="800", height="465" %} <figcaption>Приложение Podcasts, настроенное для проверки новых выпусков каждый час.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} <a href="/periodic-background-sync/">Periodic Background Sync API</a> позволяет приложению регулярно обновлять содержимое в фоновом режиме без необходимости его запуска. Это означает, что свежий контент всегда доступен заранее и пользователи смогут ознакомиться с ним сразу же, когда им будет удобно. {% endDetails %}

## Синхронизация состояния через облако

В то же время мои подписки синхронизируются между всеми моими устройствами. В эпоху цифровых технологий мне не нужно синхронизировать их вручную. Мне также не нужно бояться, что память моего мобильного устройства будут занимать выпуски, которые уже были просмотрены на компьютере, и наоборот. Состояние воспроизведения синхронизируется, а прослушанные выпуски автоматически удаляются.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uVJJ40Zxi5jx1AP1jd9U.png", alt="Меню настроек приложения Podcasts; в разделе «Дополнения» установлен флажок «Синхронизировать подписки между устройствами».", width="800", height="525" %} <figcaption>Состояние приложения синхронизируется через облако.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Синхронизация данных о состоянии приложения — это задача, которую можно делегировать <a href="https://developers.google.com/web/updates/2015/12/background-sync">Background Sync API</a>. Сама синхронизация не обязательно должна выполняться сразу; это можно сделать <em>потом</em>, даже если пользователь закрыл приложение. {% endDetails %}

## Управление с помощью физических мультимедийных клавиш

Когда я нахожусь в другом приложении, например читаю новости в браузере Chrome, я по-прежнему могу управлять приложением Podcasts при помощи мультимедийных клавиш ноутбука. Нет необходимость переключаться на приложение для того, чтобы промотать запись вперед или назад.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TqRtzNtfhahjX93hI1P6.png", alt="Клавиатура Apple MacBook Pro Magic Keyboard с подписанными мультимедийными клавишами.", width="800", height="406" %} <figcaption>При помощи мультимедийных клавиш можно управлять приложением Podcast (<a href="https://support.apple.com/guide/macbook-pro/magic-keyboard-apdd0116a6a2/mac">источник</a>).</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Для обеспечения поддержки мультимедийных клавиш используется <a href="/media-session/">Media Session API</a>. Он позволяет управлять приложением с помощью мультимедийных клавиш на физической клавиатуре, наушниках или даже с помощью экранных кнопок на умных часах. Кроме того, вы можете дополнительно повысить удобство прокрутки, генерируя <a href="https://developer.mozilla.org/docs/Web/API/Vibration_API">тактильный отклик</a>, когда пользователь пролистывает важную отметку, такую как окончание вступительной заставки или начало новой главы. {% endDetails %}

## Многозадачность и значок приложения

Разумеется, я всегда могу переключиться к приложению Podcasts, где бы ни находился. У приложения есть легкоузнаваемый значок, который можно поместить на рабочий стол или панель приложений, чтобы запускать сразу, как только приложение понадобится.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l5EzElV5BGweYXLAqF4u.png", alt="Переключатель приложений macOS с несколькими запущенными приложениями; одно из них — Podcasts.", width="800", height="630" %} <figcaption>Переход к приложению Podcasts.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Как на ПК, так и на мобильных устройствах прогрессивные веб-приложения устанавливаются на экран «Домой», в меню «Пуск» или в панель приложений. Установка может выполняться при помощи автоматически отображаемого запроса или полностью контролироваться разработчиком. В статье <a href="/install-criteria/">Что нужно для возможности установки?</a> есть вся необходимая информация. При переключении задач PWA-приложения отображаются отдельно от браузера. {% endDetails %}

## Быстрые действия в контекстном меню

Наиболее часто используемые действия в приложении — **Поиск** нового контента и **Проверка новых выпусков** — доступны прямо из контекстного меню приложения в Dock. В меню **Параметры** также можно включить запуск приложения при входе в систему.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SnA6Thz5xaopuTWRzWgQ.png", alt="Контекстное меню приложения Podcasts, показывающее пункты «Поиск» и «Проверить новые выпуски».", width="534", height="736" %} <figcaption>Быстрые действия доступны прямо из значка приложения.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Указав в манифесте PWA-приложения <a href="/app-shortcuts/">быстрые действия при нажатии на значок</a>, можно зарегистрировать быстрые пути к часто используемым функциям, чтобы пользователи могли обращаться к ним напрямую через значок приложения. В таких операционных системах, как macOS, пользователи также могут щелкнуть правой кнопкой мыши на значок приложения и настроить его запуск при входе в систему. В настоящее время ведется работа над предложением <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/RunOnLogin/Explainer.md">поддержки запуска при входе</a>. {% endDetails %}

## Использование в качестве приложения по умолчанию

С приложением Podcasts можно взаимодействовать из других приложений iOS и даже сайтов или электронных писем, используя схему URL-адресов `podcasts://`. Если, находясь в браузере, я перейду по ссылке [`podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903`](podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903), я попаду прямо в приложение Podcasts, где смогу подписаться на подкаст или прослушать его.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/x8mjOWiMO4CVigvtV8Kg.png", alt="Браузер Chrome просит пользователя подтвердить запуск приложения Podcasts.", width="800", height="492" %} <figcaption>Приложение Podcasts можно открыть прямо из браузера.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Обработка произвольных схем URL-адресов пока невозможна, но уже ведется работа над предложением по <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">обработке протоколов URL-адресов</a> для PWA-приложений. В настоящее время наилучшая альтернатива — это <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a> со схемой, начинающейся на <code>web+</code>. {% endDetails %}

## Интеграция с локальной файловой системой

На первый взгляд это неочевидно, но приложение Podcasts хорошо интегрируется с локальной файловой системой. Когда я скачиваю выпуск подкаста на ноутбук, он сохраняется в каталог `~/Library/Group Containers/243LU875E5.groups.com.apple.podcasts/Library/Cache`. В отличие, скажем, от `~/Documents`, этот каталог не предназначен для прямого доступа обычных пользователей, однако доступ к нему возможен. Другие механизмы хранения данных, помимо файлов, описываются в разделе об [офлайн-контенте](#offline-content-available-and-media-playable).

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Og60tp5kB9lVZsi3Prdt.png", alt="macOS Finder, в котором открыт системный каталог приложения Podcasts.", width="800", height="337" %} <figcaption>Выпуски подкастов хранятся в специальном системном каталоге приложения.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} <a href="/file-system-access/">File System Access API</a> позволяет разработчикам получать доступ к локальной файловой системе устройства. Вы можете использовать его либо напрямую, либо через <a href="https://github.com/GoogleChromeLabs/browser-fs-access">библиотеку-прослойку browser-fs-access</a>, которая прозрачно для пользователя предоставляет альтернативный режим, если браузер не поддерживает API. В целях безопасности веб-приложениям не разрешен доступ к системным каталогам. {% endDetails %}

## Внешний вид, соответствующий платформе

Есть менее очевидный признак, по которому сразу можно опознать родное приложение, такое как Podcasts: подписи элементов управления невозможно выделить мышью, а шрифт текста совпадает с системным. Кроме того, приложение учитывает выбранную в системе (темную) тему оформления.

<div class="w-columns">
  <figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OApP9uGUje6CkS7cKcZh.png", alt="Приложение Podcasts в темном режиме.", width="800", height="463" %} <figcaption>Приложение Podcasts поддерживает светлую и темную тему.</figcaption></figure>
  <figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cnVihfFR2anSBlIVfCSW.png", alt="Приложение Podcasts в светлом режиме.", width="800", height="463" %} <figcaption>Приложение использует стандартный системный шрифт.</figcaption></figure>
</div>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} При помощи CSS-свойства <a href="https://developer.mozilla.org/docs/Web/CSS/user-select"><code>user-select</code></a> со значением <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>none</code></a> можно защитить элементы пользовательского интерфейса от случайного выделения. Однако не злоупотребляете этим свойством, запрещая выделять <em>контент приложения</em>. Его следует применять только по отношению к элементам пользовательского интерфейса, таким как подписи кнопок и т. д. Значение <a href="https://developer.mozilla.org/docs/Web/CSS/font-family#&lt;generic-name&gt;:~:text=system%2Dui,-Glyphs"><code>system-ui</code></a> свойства <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family</code></a> позволяет использовать в приложении стандартный системный шрифт интерфейса. Наконец, приложение может учитывать выбранную пользователем тему оформления, руководствуясь значением <a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a>, но при этом в нем может быть реализован дополнительный <a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">переключатель темной темы</a> для ее переопределения. Еще один момент, с которым следует определиться, — это поведение браузера при достижении границы области прокрутки; например, можно реализовать собственный жест <em>pull to refresh</em>, используя CSS-свойство <a href="https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior"><code>overscroll-behavior</code></a>. {% endDetails %}

## Нестандартная строка заголовка

Взглянув на окно приложения Podcasts, можно заметить, что у него нет стандартной строки заголовка, совмещенной с панелью инструментов, как, например, в окне Safari; но есть свой индивидуальный интерфейс с боковой панелью, прикрепленной к главному окну проигрывателя.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cB7G2e31JXU71EfvhG3i.png", alt="Строка заголовка браузера Safari, совмещенная с панелью инструментов.", width="800", height="40" %} <figcaption></figcaption></figure>

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mFvLbyQ90wsDPQ9l86s3.png", alt="Нестандартная строка заголовка приложения Podcasts, разделенная на две части.", width="800", height="43" %} <figcaption>Нестандартные строки заголовка в Safari и Podcasts.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Хотя в настоящее время такой возможности не предусмотрено, ведутся работы над <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">возможностью видоизменения строки заголовка</a>. Однако вы можете (и должны) указать в манифесте веб-приложения свойства <a href="/add-manifest/#display"><code>display</code></a> и <a href="/add-manifest/#theme-color"><code>theme-color</code></a>, чтобы определить внешний вид окна приложения и решить, какие из стандартных элементов управления браузера должны отображаться (если вообще должны). {% endDetails %}

## Плавная анимация

Анимация в приложении Podcasts быстрая и плавная. Например, если открыть расположенную справа панель **Примечания к выпуску**, она выдвигается с красивой анимацией. Если удалить выпуск из загрузок, остальные выпуски плавно сдвигаются вверх, занимая его место.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ucob9t4Ga3jMK20RVvSD.png", alt="Приложение Podcasts с открытой панелью «Примечания к выпуску».", width="800", height="463" %} <figcaption>Анимации в приложениях, например при открытии панели, отрисовываются плавно.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} В высокопроизводительной анимации на веб-страницах, безусловно, нет ничего невозможно, если следовать советам, приведенным в статье <a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">Анимация и производительность</a>. Анимацию прокрутки, которую можно наблюдать при перелистывании кольцевых галерей или контента, разбитого на страницы, можно существенно улучшить при помощи функции <a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSS Scroll Snap</a>. Для полного контроля можно использовать <a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">Web Animations API</a>. {% endDetails %}

## Отображение контента за пределами приложения

Podcasts на iOS может отображать контент за пределами самого приложения, например на системном экране виджетов или в виде предложений Siri. Своевременное отображение призывов к действию, по которым можно перейти в одно касание, может значительно повысить уровень повторного вовлечения для такого приложения, как Podcasts.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w8zhRHcKzRfgjXZu7y4h.png", alt="Экран виджетов iOS. В приложении Podcasts показывается рекомендация нового выпуска подкаста.", width="751", height="1511" %} <figcaption>Контент из приложения показывается за пределами самого приложения Podcasts.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} <a href="/content-indexing-api/">Content Index API</a> позволяет приложению сообщать браузеру, какое содержимое PWA доступно в офлайн-режиме, что даёт возможность браузеру отображать его содержимое за пределами основного приложения. Помечая интересный контент в приложении при помощи свойства <a href="https://developers.google.com/search/docs/data-types/speakable">speakable</a>, а также <a href="https://developers.google.com/search/docs/guides/search-gallery">структурированной разметки</a> в целом, можно добиться, чтобы поисковые системы и виртуальные помощники, такие как Google Ассистент, показывали ваши предложения в лучшем виде. {% endDetails %}

## Виджет управления мультимедиа на экране блокировки

Когда воспроизводится выпуск подкаста, приложение Podcasts отображает на экране блокировки красивый виджет управления с метаданными: обложкой и названием выпуска, а также названием подкаста.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Lr9R2zpjDEgHtyJ7hjHf.png", alt="Виджет воспроизведения медиафайла на экране блокировки iOS. Показывается выпуск подкаста с метаданными.", width="751", height="1511" %} <figcaption>Воспроизведением медиаконтента в приложении можно управлять с экрана блокировки.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} При помощи <a href="/media-session/">Media Session API</a> можно указывать метаданные, такие как обложки, названия треков и т. д., которые будут отображаться на экране блокировки, умных часах и других мультимедийных виджетах браузера. {% endDetails %}

## Push-уведомления

Push-уведомления в Интернете стали довольно назойливыми (хотя [запросы уведомлений теперь гораздо менее шумные](https://blog.chromium.org/2020/01/introducing-quieter-permission-ui-for.html)), но при правильном использовании они могут принести большую пользу. Например, приложение Podcasts для iOS при необходимости может уведомлять меня о новых выпусках подкастов, на которые я подписан, или рекомендовать новые, а также сообщать о новых функциях приложения.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IFnNRo6BnHL6BxDmiqF7.png", alt="Настройки приложения Podcasts для iOS. В разделе «Уведомления» включена настройка «Новые выпуски».", width="751", height="1511" %} <figcaption>Приложения могут сообщать пользователю о новом контенте при помощи push-уведомлений.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} <a href="https://developers.google.com/web/fundamentals/push-notifications">Push API</a> позволяет приложению получать push-уведомления, чтобы держать пользователей в курсе происходящего в вашем PWA. Отображать уведомления по расписанию без использования сети можно при помощи <a href="/notification-triggers/">Notification Triggers API</a>. {% endDetails %}

## Наклейки возле значка приложения

Когда выходят новые выпуски подкастов, на которые я подписан, возле значка приложения Podcasts на экране «Домой» возникает наклейка, ненавязчиво приглашая меня вернуться в приложение.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3smO2sJz5oMwy4RYpQoF.png", alt="Экран настроек iOS со включенной настройкой «Наклейки».", width="751", height="1511" %} <figcaption>Наклейки — это ненавязчивый способ уведомить пользователя о новом контенте в приложении.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Отображать наклейки возле значка приложения можно при помощи <a href="/badging-api/">Badging API</a>. Это особенно полезно, если вашему PWA нужно показывать число «непрочитанных» элементов или вам нужен способ ненавязчиво привлекать внимание пользователя к приложению. {% endDetails %}

## Приоритет воспроизведения мультимедиа над настройками энергосбережения

При воспроизведении подкастов экран может выключиться, но система не будет переходить в режим ожидания. Кроме того, приложения также могут удерживать во включенном состоянии экран, например для отображения текстов песен или субтитров.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CRkipfmdkLJrND83qvQw.png", alt="Настройки macOS, раздел «Экономия энергии».", width="800", height="573" %} <figcaption>Приложения могут удерживать экран во включенном состоянии.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} <a href="/wakelock/">Screen Wake Lock API</a> позволяет удерживать экран во включенном состоянии. Воспроизведение медиаконтента на веб-странице автоматически предотвращает переход системы в режим ожидания. {% endDetails %}

## Поиск приложений через магазины

В macOS приложение Podcasts является частью системы, но на iOS оно устанавливается из App Store. При поиске по запросу `podcast`, `podcasts` или `apple podcasts` приложение тут же появится в списке результатов.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZLr5quaQWA9VJGAHNrLd.png", alt="App Store на iOS: при поиске «podcasts» показывается приложение Podcasts.", width="751", height="1511" %} <figcaption>Пользователи научились искать приложения в магазинах.</figcaption></figure>

{% Details %} {% DetailsSummary %} Как реализовать эту функцию в веб-приложении {% endDetailsSummary %} Apple не позволяет публиковать PWA-приложения в App Store, в то время как на Android вы можете отправлять их на публикацию <a href="/using-a-pwa-in-your-android-app/">в виде Trusted Web Activity</a>. Скрипт <a href="https://github.com/GoogleChromeLabs/bubblewrap"><code>bubblewrap</code></a> делает эту операцию безболезненной. Этот же скрипт лежит в основе встроенной в <a href="https://www.pwabuilder.com/">PWABuilder</a> функции экспорта Android-приложений, для использования которой не нужно уметь пользоваться командной строкой. {% endDetails %}

## Краткий список функций

В таблице ниже представлен краткий список всех функций, а также ссылок на ресурсы, которые помогут реализовать эти функции в веб-приложениях.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Характерная черта</th>
        <th>Полезные ресурсы для этого в сети</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="#capable-of-running-offline">Работа в офлайн-режиме</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/architecture/app-shell">Модель оболочки приложения</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#offline-content-available-and-media-playable">Доступ к контенту и воспроизведение медиафайлов в офлайн-режиме</a></td>
        <td>
          <ul>
            <li><a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">Воспроизведение кешированного аудио и видео</a></li>
            <li><a href="https://developer.chrome.com/docs/workbox/">Библиотека Workbox</a></li>
            <li><a href="/storage-for-the-web/">Storage API</a></li>
            <li><a href="/persistent-storage/">Persistent Storage API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#proactive-background-downloading">Автоматическое фоновое скачивание</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2018/12/background-fetch">Background Fetch API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#sharing-to-and-interacting-with-other-applications">Обмен и взаимодействие с другими приложениями</a></td>
        <td>
          <ul>
            <li><a href="/web-share/">Web Share API</a></li>
            <li><a href="/web-share-target/">Web Share Target API</a></li>
            <li><a href="/image-support-for-async-clipboard/">Async Clipboard API</a></li>
            <li><a href="/contact-picker/">Contact Picker API</a></li>
            <li><a href="/get-installed-related-apps/">Get Installed Related Apps API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#background-app-refreshing">Фоновое обновление приложения</a></td>
        <td>
          <ul>
            <li><a href="/periodic-background-sync/">Periodic Background Sync API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#state-synchronized-over-the-cloud">Синхронизация состояния через облако</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2015/12/background-sync">Background Sync API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#hardware-media-key-controls">Управление с помощью физических мультимедийных клавиш</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">Media Session API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#multitasking-and-app-shortcut">Многозадачность и значок приложения</a></td>
        <td>
          <ul>
            <li><a href="/install-criteria/">Критерии возможности установки</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#quick-actions-in-context-menu">Быстрые действия в контекстном меню</a></td>
        <td>
          <ul>
            <li><a href="/app-shortcuts/">быстрые действия при нажатии на значок</a></li>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/tree/master/RunOnLogin">Запуск при входе в систему</a> (ранняя стадия)</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#act-as-default-app">Использование в качестве приложения по умолчанию</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">Обработка протоколов URL-адресов</a> (ранняя стадия)</li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#local-file-system-integration">Интеграция с локальной файловой системой</a></td>
        <td>
          <ul>
            <li><a href="/file-system-access/">File System Access API</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/browser-fs-access">Библиотека browser-fs-access</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#platform-look-and-feel">Внешний вид, соответствующий платформе</a></td>
        <td>
          <ul>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>user-select: none</code></a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family: system-ui</code></a>
            </li>
            <li>
              <a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a>
            </li>
            <li><a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">Переключатель темной темы</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#customized-title-bar">Нестандартная строка заголовка</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">Видоизменение строки заголовка</a> (ранний этап)</li>
            <li><a href="/add-manifest/#display">Режим отображения</a></li>
            <li><a href="/add-manifest/#theme-color">Цвет темы</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#snappy-animations">Плавная анимация</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">Советы по анимации и производительности</a></li>
            <li><a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSS Scroll Snap</a></li>
            <li><a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">Web Animations API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#content-surfaced-outside-of-app">Отображение контента за пределами приложения</a></td>
        <td>
          <ul>
            <li><a href="/content-indexing-api/">Content Index API</a></li>
            <li><a href="https://developers.google.com/search/docs/data-types/speakable">Speakable-контент</a></li>
            <li><a href="https://developers.google.com/search/docs/guides/search-gallery">Структурированная разметка</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#lock-screen-media-control-widget">Виджет управления мультимедиа на экране блокировки</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">Media Session API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#push-notifications">Push-уведомления</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/push-notifications">Push API</a></li>
            <li><a href="/notification-triggers/">Notification Triggers API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-icon-badging">Наклейки возле значка приложения</a></td>
        <td>
          <ul>
            <li><a href="/badging-api/">Badging API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#media-playback-takes-precedence-over-energy-saver-settings">Приоритет воспроизведения мультимедиа над настройками энергосбережения</a></td>
        <td>
          <ul>
            <li><a href="/wakelock/">Screen Wake Lock API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-discovery-through-an-app-store">Поиск приложений через магазины</a></td>
        <td>
          <ul>
            <li> <a href="/using-a-pwa-in-your-android-app/">Trusted Web Activity</a>
</li>
            <li><a href="https://github.com/GoogleChromeLabs/bubblewrap">библиотека <code>bubblewrap</code></a></li>
            <li><a href="https://www.pwabuilder.com/">Инструмент PWABuilder</a></li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Заключение

С момента своего появления в 2015 году PWA-приложения сильно эволюционировали. В рамках [Project Fugu 🐡](https://developer.chrome.com/blog/fugu-status) команда Chromium, в которую входят разработчики из разных компаний, работает над устранением последних оставшихся слабых мест. Воспользовавшись хотя бы некоторыми советами из этой статьи, вы сможете вплотную приблизиться к «родным» приложениям по уровню комфорта, заставив пользователей забыть, что они имеют дело с «обыкновенным сайтом». Ведь кого на самом деле волнует, как приложение устроено внутри? Гораздо важнее то, как оно работает.

## Благодарности

Эту статью проверили [Кейси Баскес](/authors/kaycebasques/), [Джо Медли](/authors/joemedley/), [Джошуа Белл](https://github.com/inexorabletash), [Дион Алмаер](https://blog.almaer.com/), [Эйд Ошинай](https://blog.oshineye.com/), [Пит Лепейдж](/authors/petelepage/), [Сэм Торогуд](/authors/samthor/), [Райли Грант](https://github.com/reillyeon) и [Джеффри Ясскин](https://github.com/jyasskin).
