---
layout: post
title: Подтверждайте номера телефонов в Интернете с помощью API WebOTP
subhead: Упростите для пользователей процедуру подтверждения телефона с помощью одноразовых паролей, полученных через СМС
authors:
  - agektmr
date: 2019-10-07
updated: 2021-06-04
hero: image/admin/iVHsQYbBj8qNYZeSZKwK.png
alt: Изображение женщины, использующей OTP для входа в веб-приложение.
description: Поиск, запоминание и ввод одноразовых паролей, отправленных через СМС, обременительны для пользователей. API WebOTP упрощает этот процесс.
tags:
  - identity
  - capabilities
feedback:
  - api
---

{% Aside 'gotchas' %} Если вы хотите узнать больше о передовых методах использования форм SMS OTP, включая API WebOTP, прочитайте статью [«Передовые методы использования форм SMS OTP»](/sms-otp-form). {% endAside %}

## Что такое API WebOTP?

В наши дни большинство людей в мире владеют мобильными устройствами, и разработчики обычно используют телефонные номера для идентификации пользователей услуг.

Существует множество способов проверки телефонных номеров, но один из наиболее распространенных — случайный одноразовый пароль (OTP), отправленный по СМС. Отправка этого кода обратно на сервер разработчика подтверждает, что данный номер телефона контролируется пользователем.

Эта идея уже используется во многих сценариях:

- **Номер телефона как идентификатор пользователя.** При подписке на новую услугу некоторые веб-сайты запрашивают номер телефона вместо адреса электронной почты и используют его в качестве идентификатора учетной записи.
- **Двухфакторная проверка.** При входе в систему веб-сайт запрашивает одноразовый код, отправленный по СМС, в дополнение к паролю или другому фактору проверки в качестве дополнительной меры безопасности.
- **Подтверждение об оплате.** Запрос одноразового кода, отправленного по СМС при совершении платежа, помогает проверить намерение пользователя.

Текущий процесс неудобен пользователям, ведь нужно найти OTP в СМС-сообщениях, затем скопировать его и вставить в форму. Неудобство снижает конверсию на критически важных этапах пути потребителя. Многие крупнейшие мировые разработчики давно просили облегчить эту задачу. Для Android уже существует [соответствующий API](https://developers.google.com/identity/sms-retriever/), как и для [iOS](https://developer.apple.com/documentation/security/password_autofill/about_the_password_autofill_workflow) и [Safari](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element).

API WebOTP позволяет приложению получать специальным образом форматированные сообщения, привязанные к домену  приложения. Это делает возможным программное получение OTP из СМС и упрощает проверку номера телефона пользователя.

{% Aside 'warning' %} Злоумышленники могут подделать СМС и перехватить номер телефона человека. Операторы также могут передавать телефонные номера новым пользователям после блокировки сим-карты. Хотя SMS OTP полезен для проверки номера телефона в описанных выше случаях, мы рекомендуем использовать дополнительные и более надежные формы аутентификации (например, многофакторную аутентификацию и [Web Authentication API](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API)) для создания новых сессий для этих пользователей. {% endAside %}

## Практический пример

Допустим, пользователь хочет подтвердить свой номер телефона на веб-сайте. Веб-сайт отправляет пользователю СМС-сообщение, и пользователь вводит OTP из сообщения, чтобы подтвердить принадлежность номера телефона.

С помощью API WebOTP эти действия выполняются легко, одним нажатием кнопки, как показано в видеоролике. Когда приходит текстовое сообщение, внизу появляется всплывающее окно, предлагающее пользователю подтвердить свой номер телефона. После нажатия кнопки **Verify (Подтвердить)** в нижнем окне браузер вставляет OTP  в форму и происходит отправка, пользователю даже не нужно нажимать **Continue (Продолжить)**.<br>endAside %}

<video autoplay loop muted playsinline>
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.mp4" type="video/mp4">
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.webm" type="video/webm"></source></source></video>

Весь процесс показан на изображении ниже.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GrFHzEg98jxCOguAQwHe.png", alt="", width="494", height="391" %} <figcaption> Схема API WebOTP </figcaption></figure>

Запустите [демонстрационный пример](https://web-otp.glitch.me). Он не запрашивает номер телефона и не отправляет СМС на ваше устройство, но вы можете отправить СМС с другого устройства, скопировав текст, отображаемый в демонстрации. Это работает, потому что при использовании API WebOTP не имеет значения, кто отправитель.

1. Перейдите на [https://web-otp.glitch.me](https://web-otp.glitch.me) в Chrome 84 или более поздней версии на устройстве Android.
2. Отправьте на свой телефон следующее СМС-сообщение с другого телефона.

```text
Your OTP is: 123456.

@web-otp.glitch.me #12345
```

Получили ли вы СМС-сообщение и увидели ли подсказку о необходимости ввести код в поле ввода? Именно так работает API WebOTP для пользователей.

{% Aside 'gotchas' %}

Если диалоговое окно не появилось, ознакомьтесь с разделом [«Часто задаваемые вопросы»](#no-dialog).

{% endAside %}

Использование WebOTP API состоит из трех частей:

- правильно аннотированный тег `<input>`;
- JavaScript в вашем веб-приложении;
- форматированный текст СМС-сообщения.

Начнем с тега `<input>`.

## Аннотируйте тег `<input>`

Сам WebOTP работает без какой-либо HTML-аннотации, но для кросс-браузерной совместимости я настоятельно рекомендую добавить `autocomplete="one-time-code"` в тег `<input>`, в который пользователь должен ввести OTP.

Это дает возможность Safari 14 или более поздней версии браузера предлагать пользователю автоматически вставить OTP в поле `<input>` при получении СМС в формате, описанном в разделе [«Отформатируйте СМС-сообщение»](#format), даже если браузер не поддерживает WebOTP.

{% Label %} HTML {% endLabel %}

```html
<form>
  <input autocomplete="one-time-code" required/>
  <input type="submit">
</form>
```

## Используйте API WebOTP

WebOTP несложный, поэтому просто скопируйте и вставьте следующий код. Далее я подробно объясню работу кода.

{% Label %} JavaScript {% endLabel %}

```js
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    const ac = new AbortController();
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        ac.abort();
      });
    }
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
      if (form) form.submit();
    }).catch(err => {
      console.log(err);
    });
  });
}
```

### Обнаружение функции

Обнаружение функции происходит так же, как и для многих других API. Прослушиватель события `DOMContentLoaded` будет ждать, когда дерево DOM будет готово к запросу.

{% Label %} JavaScript {% endLabel %}

```js
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    …
    const form = input.closest('form');
    …
  });
}
```

{% Aside 'caution' %}

Для работы API WebOTP требуется безопасный источник (HTTPS). Обнаружение функции на веб-сайте с протоколом HTTP завершится ошибкой.

{% endAside %}

### Обработайте OTP

Сам API WebOTP достаточно прост. Используйте [`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get) для получения OTP. WebOTP добавляет к этому методу новый параметр `otp`. У него есть только одно свойство: `transport`, значением которого должен быть массив со строкой `'sms'`.

{% Label %} JavaScript {% endLabel %}

```js/1-2
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
    …
```

Это запускает поток разрешений браузера при получении СМС-сообщения. Если разрешение предоставлено, возвращаемое обещание разрешается с помощью объекта `OTPCredential`.

{% Label %}Содержание полученного объекта `OTPCredential`{% endLabel %}

```json
{
  code: "123456" // Obtained OTP
  type: "otp"  // `type` is always "otp"
}
```

Затем передайте значение OTP в поле `<input>`. Отправка формы напрямую устранит шаг, требующий от пользователя нажатия кнопки.

{% Label %} JavaScript {% endLabel %}

```js/5-6
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
      input.value = otp.code;
      if (form) form.submit();
    }).catch(err => {
      console.error(err);
    });
    …
```

### Прерывание сообщения {: #aborting}

В случае если пользователь вручную вводит OTP и отправляет форму, вы можете отменить вызов `get()`, используя экземпляр `AbortController` в [объекте `options`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get#Parameters).

{% Label %} JavaScript {% endLabel %}

```js/1,5,11
    …
    const ac = new AbortController();
    …
    if (form) {
      form.addEventListener('submit', e => {
        ac.abort();
      });
    }
    …
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
    …
```

## Отформатируйте СМС-сообщение {: #format}

Сам API выглядит простым, но есть несколько моментов, которые необходимо знать перед его использованием. Сообщение должно быть отправлено после вызова `navigator.credentials.get()` и должно быть получено на устройстве, на котором была вызвана функция `get()`. Наконец, сообщение должно соответствовать следующему формату:

- сообщение начинается с удобочитаемого текста  (необязательно), который содержит буквенно-цифровую строку из 4–10 символов с как минимум одной цифрой, а в последней строке указываются URL-адрес и одноразовый пароль (OTP);
- символ `@` должен предшествовать доменной части URL-адреса веб-сайта, вызвавшего API;
- URL-адрес должен содержать знак решетки (' `#` '), за которым следует OTP.

Например:

```text
Your OTP is: 123456.

@www.example.com #123456
```

Вот плохие примеры:

Пример неправильно оформленного СМС | Почему это не сработает
--- | ---
`Here is your code for @example.com #123456` | `@` должен быть первым символом последней строки.
`Your code for @example.com is #123456` | `@` должен быть первым символом последней строки.
`Your verification code is 123456`<br><br>`@example.com\t#123456` | Между `@host` и `#code` должен стоять одинарный пробел.
`Your verification code is 123456`<br><br>`@example.com`<code>  </code>`#123456` | Между `@host` и `#code` должен стоять одинарный пробел.
`Your verification code is 123456`<br><br>`@ftp://example.com #123456` | Схема URL не должна включаться в сообщение.
`Your verification code is 123456`<br><br>`@https://example.com #123456` | Схема URL не должна включаться в сообщение.
`Your verification code is 123456`<br><br>`@example.com:8080 #123456` | Порт не должен включаться в сообщение.
`Your verification code is 123456`<br><br>`@example.com/foobar #123456` | Путь не должен включаться в сообщение.
`Your verification code is 123456`<br><br>`@example .com #123456` | В доменном имени не должно быть пробелов.
`Your verification code is 123456`<br><br>`@domain-forbiden-chars-#%/:<>?@[] #123456` | В доменном имени не должно быть [запрещенных символов](https://url.spec.whatwg.org/#forbidden-host-code-point).
`@example.com #123456`<br><br>`Mambo Jumbo` | `@host` и `#code` должны быть в последней строке.
`@example.com #123456`<br><br>`App hash #oudf08lkjsdf834` | `@host` и `#code` должны быть в последней строке.
`Your verification code is 123456`<br><br>`@example.com 123456` | Отсутствует `#` .
`Your verification code is 123456`<br><br>`example.com #123456` | Отсутствует `@` .
`Hi mom, did you receive my last text` | Отсутствуют `@` и `#` .

## Демонстрации

Попробуйте различные сообщения с демонстрацией: [https://web-otp.glitch.me](https://web-otp.glitch.me)

Вы также можете «форкнуть» пример и создать свою версию: [https://glitch.com/edit/#!/web-otp](https://glitch.com/edit/#!/web-otp).

{% Glitch { id: 'web-otp', path: 'views/index.html', previewSize: 0, allow: [] } %}

## Используйте WebOTP из iframe с перекрестным происхождением

Ввод SMS OTP в iframe с перекрестным происхождением обычно используется для подтверждения платежа, особенно с использованием протокола 3D Secure. API WebOTP предоставляет OTP с привязкой к вложенным источникам, используя стандартный формат для поддержки iframes с перекрестным происхождением. Например:

- Пользователь заходит на сайт `shop.example`, чтобы купить пару обуви с помощью кредитной карты.
- После ввода номера кредитной карты интегрированный поставщик платежей показывает форму из `bank.example` в окне iframe, предлагающую пользователю подтвердить свой номер телефона для быстрой оплаты.
- `bank.example` отправляет СМС с OTP пользователю, чтобы он мог ввести OTP для подтверждения своей личности.

Чтобы использовать API WebOTP из iframe с перекрестным происхождением, нужно предпринять следующие два действия:

- аннотировать в СМС-сообщении источник iframe верхнего уровня и источник iframe;
- настроить политику разрешений, чтобы разрешить iframe с перекрестным происхождением напрямую получать OTP от пользователя.

<figure>{% Video src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/Ba3OSkSsB4NwFkHGOuvc.mp4", autoplay="true", controls="true", loop="true", muted="true", preload="auto", width="300", height="600" %} <figcaption> API WebOTP в iframe в действии. </figcaption></figure>

Попробуйте демонстрацию на [https://web-otp-iframe-demo.stackblitz.io](https://web-otp-iframe-demo.stackblitz.io).

### Аннотируйте связанные источники (bound-origins) в текстовом СМС-сообщении

Когда WebOTP API вызывается из iframe, СМС-сообщение в последней строке должно содержать источник iframe верхнего уровня (начинается с символа `@`), затем OTP (начинается с символа `#`) и источник iframe (начинается с символа `@`).

```text
Your verification code is 123456

@shop.example #123456 @bank.exmple
```

### Настройте политику разрешений

Чтобы использовать WebOTP в iframe с перекрестным происхождением, эмбеддер должен предоставить доступ к этому API через [политику разрешений](https://www.w3.org/TR/permissions-policy-1) otp-credentials, чтобы избежать непреднамеренного поведения. В общем, есть два способа достичь этой цели:

{% Label %} через заголовок HTTP: {% endLabel %}

```http
Permissions-Policy: otp-credentials=(self "https://bank.example")
```

{% Label %} через атрибут `allow` тега iframe: {% endLabel %}

```html
<iframe src="https://bank.example/…" allow="otp-credentials"></iframe>
```

См. [другие примеры того, как указать политику разрешений](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/).

{% Aside %}

На данный момент Chrome поддерживает вызовы API WebOTP только из iframe с перекрестным происхождением, которые имеют **не более одного** уникального источника в цепочке предков. В следующих сценариях:

- `a.com` -&gt; `b.com`
- `a.com` -&gt; `b.com` -&gt; `b.com`
- `a.com` -&gt; `a.com` -&gt; `b.com`
- `a.com` -&gt; `b.com` -&gt; `c.com`

использование WebOTP на `b.com` поддерживается, а на `c.com` — нет.

Обратите внимание, что следующий сценарий также не поддерживается из-за отсутствия спроса и сложностей UX.

- `a.com` -&gt; `b.com` -&gt; `a.com` (вызывает API WebOTP)

{% endAside %}

## Часто задаваемые вопросы

### Диалог не появляется, хотя я отправляю правильно отформатированное сообщение. Что не так? {: #no-dialog}

При тестировании API учтите следующие моменты:

- Если номер телефона отправителя включен в список контактов получателя, этот API не будет запускаться из-за конструкции базового [API SMS User Consent](https://developers.google.com/identity/sms-retriever/user-consent/request#2_start_listening_for_incoming_messages).
- Если вы используете рабочий профиль на своем устройстве Android и WebOTP не работает, попробуйте вместо этого установить и использовать Chrome в своем личном профиле (т. е. в том же профиле, в котором вы получаете СМС).

Вернитесь к разделу [о формате](#format), чтобы проверить, правильно ли отформатировано ваше СМС.

### Обладает ли этот API кросс-браузерной совместимостью?

Chromium и WebKit согласовали [формат текстовых СМС-сообщений](https://wicg.github.io/sms-one-time-codes), и [Apple объявила о его поддержке в Safari](https://developer.apple.com/news/?id=z0i801mg), начиная с iOS 14 и macOS Big Sur. Хотя Safari не поддерживает API WebOTP JavaScript, аннотируя `input` с помощью `autocomplete=["one-time-code"]`, клавиатура по умолчанию автоматически предлагает ввести OTP, если СМС-сообщение соответствует формату.

### Насколько безопасно использовать СМС для аутентификации?

Хотя SMS OTP полезен для проверки номера телефона при его первом предоставлении, следует с осторожностью использовать проверку номера телефона через СМС для повторной аутентификации, поскольку телефонные номера могут быть перехвачены и повторно использованы операторами связи. WebOTP — удобный механизм повторной аутентификации и восстановления доступа, но службы должны сочетать его с дополнительными факторами, такими как аутентификация на основе знаний (KBA), или использовать [API Web Authentication](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API) для надежной аутентификации.

### Куда сообщать об ошибках в реализации Chrome?

Вы нашли ошибку в реализации Chrome?

- Сообщите об ошибке на [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ESMS). Укажите как можно больше подробностей, простые инструкции по воспроизведению и установите **Components** в значение `Blink>WebOTP`.

### Чем я могу помочь с этой функцией?

Планируете ли вы использовать API WebOTP? Ваша публичная поддержка поможет нам определить приоритетность функций и покажет другим производителям браузеров, насколько важно реализовать поддержку данных функций. Отправьте твит на [@ChromiumDev](https://twitter.com/chromiumdev) с хештегом [`#WebOTP`](https://twitter.com/search?q=%23WebOTP&src=typed_query&f=live) и сообщите нам, где и как вы его используете.

{% Aside %} Больше вопросов можно найти в [разделе часто задаваемых вопросов в поясняющей статье](https://github.com/WICG/WebOTP/blob/master/FAQ.md). {% endAside %}
