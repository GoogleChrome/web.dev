---
layout: post
title: Práticas recomendadas de formulário OTP de SMS
subhead: Aprenda como otimizar seu formulário OTP de SMS e melhorar a experiência do usuário.
authors:
  - agektmr
date: 2020-12-09
updated: 2020-12-09
hero: image/admin/J3XT84NDBPLlsRN0PhLl.jpg
alt: Um sinal de bolha de néon de chat.
description: |2-

  Pedir a um usuário para fornecer uma OTP (senha de uso único) entregue via SMS é uma

  maneira comum de confirmar o número de telefone de um usuário. Esta publicação fornece a você o

  práticas recomendadas para construir um formulário SMS OTP com ótima experiência do usuário.
tags:
  - identity
  - security
  - forms
---

{% YouTube 'sU4MpWYrGSI' %}

Solicitar a um usuário que forneça a OTP (senha descartável) fornecida por SMS é uma forma comum de confirmar o número de telefone de um usuário. Existem alguns casos de uso para SMS OTP:

- **Autenticação de dois fatores.** Além do nome de usuário e da senha, o SMS OTP pode ser usado como um forte sinal de que a conta pertence à pessoa que recebeu o SMS OTP.
- **Verificação do número de telefone.** Alguns serviços usam um número de telefone como o identificador principal do usuário. Nesses serviços, o usuário pode inserir seu número de telefone e a OTP recebida por SMS para comprovar sua identidade. Às vezes, ele é combinado com um PIN para constituir uma autenticação de dois fatores.
- **Recuperação de conta.** Quando um usuário perde o acesso à sua conta, deve haver uma maneira de recuperá-la. Enviar um e-mail para o endereço de e-mail registrado ou um SMS OTP para o número de telefone são métodos comuns de recuperação de conta.
- **Confirmação de** pagamento Em sistemas de pagamento, alguns bancos ou emissores de cartão de crédito solicitam autenticação adicional do pagador por motivos de segurança. O SMS OTP é comumente usado para esse fim.

Esta postagem explica as práticas recomendadas para construir um formulário SMS OTP para os casos de uso acima.

{% Aside 'caution' %} Embora esta postagem discuta as práticas recomendadas do formulário SMS OTP, esteja ciente de que o SMS OTP não é o método mais seguro de autenticação por si só, porque os números de telefone podem ser reciclados e, às vezes, sequestrados. E [o próprio conceito de OTP não é resistente a phishing](https://youtu.be/kGGMgEfSzMw?t=1133).

Se você está procurando melhor segurança, considere usar o [WebAuthn](https://www.w3.org/TR/webauthn-2/). Saiba mais na palestra "[Quais as novidades em cadastro e login](https://goo.gle/webauthn-video)" da Chrome Dev Summit 2019 e crie uma experiência de reautenticação usando um sensor biométrico com o codelab ["Desenvolver seu primeiro aplicativo WebAuthn"](https://goo.gle/WebAuthnReauthCodelab). {% endAside %}

## Lista de controle

Para fornecer a melhor experiência do usuário com o SMS OTP, siga estas etapas:

- Use o `<input>` com:
    - `type="text"`
    - `inputmode="numeric"`
    - `autocomplete="one-time-code"`
- Use `@BOUND_DOMAIN #OTP_CODE` como a última linha da mensagem SMS OTP.
- Use a [API WebOTP](/web-otp/).

## Use o elemento `<input>`

Usar um formulário com um `<input>` é a prática recomendada mais importante que você pode seguir porque funciona em todos os navegadores. Mesmo que outras sugestões desta postagem não funcionem em algum navegador, o usuário ainda poderá inserir e enviar o OTP manualmente.

```html
<form action="/verify-otp" method="POST">
  <input type="text"
         inputmode="numeric"
         autocomplete="one-time-code"
         pattern="\d{6}"
         required>
</form>
```

A seguir estão algumas idéias para garantir que um campo de entrada obtenha o melhor da funcionalidade do navegador.

### `type="text"`

Como os OTPs são geralmente números de cinco ou seis dígitos, usar `type="number"` para um campo de entrada pode parecer intuitivo porque altera o teclado móvel para apenas números. Isso não é recomendado porque o navegador espera que um campo de entrada seja um número contável em vez de uma sequência de vários números, o que pode causar um comportamento inesperado. Usar `type="number"` faz com que os botões para cima e para baixo sejam exibidos ao lado do campo de entrada; pressionar esses botões aumenta ou diminui o número e pode remover os zeros anteriores.

Em vez disso, use `type="text"`. Isso não transformará o teclado móvel em apenas números, mas não há problemas já que a próxima dica para usar `inputmode="numeric"` faz esse trabalho.

### `inputmode="numeric"`

Use [`inputmode="numeric"`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode) para alterar o teclado do celular apenas para números.

Alguns sites usam `type="tel"` para campos de entrada OTP, uma vez que também transforma o teclado do celular apenas em números (incluindo `*` e `#`) quando focado. Este hack foi usado no passado quando `inputmode="numeric"` não era amplamente compatível. Uma vez que o <a href="https://github.com/mdn/browser-compat-data/pull/6782" data-md-type="link">Firefox começou a oferecer suporte para `inputmode="numeric"`</a>, não é necessário usar o hack `type="tel"`

### `autocomplete="one-time-code"`

[`autocomplete`](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete) atributo autocomplete permite que os desenvolvedores especifiquem qual permissão o navegador tem para fornecer assistência ao autocomplete e informa o navegador sobre o tipo de informação esperada no campo.

Com `autocomplete="one-time-code"` sempre que um usuário recebe uma mensagem SMS enquanto um formulário está aberto, o sistema operacional irá analisar o OTP no SMS heuristicamente e o teclado irá sugerir o OTP para o usuário inserir. Funciona apenas no Safari 12 e posterior no iOS, iPadOS e macOS, mas é altamente recomendável usá-lo, porque é uma maneira fácil de melhorar a experiência de SMS OTP nessas plataformas.

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/ios-safari.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/ios-safari.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>`autocomplete ="one-time-code"` em ação.</figcaption></figure>

O `autocomplete="one-time-code"` melhora a experiência do usuário, mas você pode fazer mais [garantindo que a mensagem SMS está em conformidade com o formato de mensagem vinculado à origem](#format).

{% Aside %} Atributos opcionais:

- [`pattern`](https://developer.mozilla.org/docs/Web/HTML/Attributes/pattern) especifica o formato que o OTP inserido deve corresponder. Use expressões regulares para especificar o padrão de correspondência, por exemplo, `\d{6}` restringe o OTP a uma string de seis dígitos. Saiba mais sobre o `pattern` em [Use JavaScript para validação mais complexa em tempo real] (https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation)

- [`required`](https://developer.mozilla.org/docs/Web/HTML/Attributes/required) indica que um campo é obrigatório.

Para melhores práticas de formulário mais gerais, as melhores práticas de formulário de [login de](/sign-in-form-best-practices/) [Sam Dutton](/authors/samdutton/) são um excelente ponto de partida. {% endAside %}

## Formate o texto SMS {: #format}

Aprimore a experiência do usuário ao entrar em uma OTP alinhando-se aos [códigos únicos vinculados à origem entregues por meio de especificação de SMS](https://wicg.github.io/sms-one-time-codes/).

A regra de formatação é simples: termine a mensagem SMS com o domínio do destinatário precedido de `@` e o OTP precedido de `#`.

Por exemplo:

```text
Your OTP is 123456

@web-otp.glitch.me #123456
```

Usar um formato padrão para mensagens OTP torna a extração de códigos delas mais fácil e confiável. A associação de códigos OTP a sites torna mais difícil enganar os usuários para que forneçam um código a sites maliciosos.

{% Aside %} As regras precisas são:

- A mensagem começa com um texto legível (opcional) que contém uma sequência alfanumérica de quatro a dez caracteres com pelo menos um número, deixando a última linha para o URL e o OTP.
- A parte do domínio do URL do site que invocou a API deve ser precedida por `@`.
- O URL deve conter um sinal de libra (" `#` ") seguido pelo OTP.

Certifique-se de que o número de caracteres não exceda 140 no total.

Para saber mais sobre as regras específicas do Chrome, leia [a seção Formatar a mensagem SMS da postagem da API WebOTP](/web-otp/#format). {% endAside %}

Usar este formato oferece alguns benefícios:

- O OTP será vinculado ao domínio. Se o usuário estiver em domínios diferentes do especificado na mensagem SMS, a sugestão de OTP não aparecerá. Isso também reduz o risco de ataques de phishing e possíveis sequestros de contas.
- O navegador agora será capaz de extrair o OTP de maneira confiável, sem depender de heurísticas misteriosas e instáveis.

Quando um site usa `autocomplete="one-time-code"`, o Safari com iOS 14 ou posterior irá sugerir o OTP seguindo as regras acima.

{% Aside %} Se o usuário estiver em um desktop com macOS Big Sur com a mesma conta iCloud configurada no iOS, o OTP recebido no dispositivo iOS também estará disponível no Safari para desktop.

Para saber mais sobre outros benefícios e nuances da disponibilidade nas plataformas Apple, leia [Aprimore a segurança do código fornecido por SMS com códigos vinculados ao domínio](https://developer.apple.com/news/?id=z0i801mg). {% endAside %}

Este formato de mensagem SMS também beneficia outros navegadores além do Safari. Chrome, Opera e Vivaldi no Android também oferecem suporte para a regra de códigos únicos vinculados à origem com a API WebOTP, embora não por meio de `autocomplete="one-time-code"`.

## Use a API WebOTP

[A API WebOTP](https://wicg.github.io/web-otp/) fornece acesso ao OTP recebido em uma mensagem SMS. Ao chamar [`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get) com o tipo `otp` `OTPCredential`) onde o `transport` inclui `sms`, o site aguardará que um SMS que está em conformidade com os códigos únicos vinculados à origem seja entregue e tenha acesso concedido pelo usuário. Depois que o OTP é passado para o JavaScript, o site pode usá-lo em um formulário ou POST diretamente no servidor.

{% Aside 'caution' %} A API WebOTP exige uma origem segura (HTTPS). {% endAside %}

```js
navigator.credentials.get({
  otp: {transport:['sms']}
})
.then(otp => input.value = otp.code);
```

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/android-chrome.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/android-chrome.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>API WebOTP em ação.</figcaption></figure>

Aprenda a usar a API WebOTP detalhadamente em [Verificar números de telefone na web com a API WebOTP](/web-otp/) ou copie e cole o seguinte snippet. (Certifique-se de que o `<form>` tenha um `action` e `method` devidamente definido.)

```js
// Feature detection
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    // Cancel the WebOTP API if the form is submitted manually.
    const ac = new AbortController();
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        // Cancel the WebOTP API.
        ac.abort();
      });
    }
    // Invoke the WebOTP API
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
      // Automatically submit the form when an OTP is obtained.
      if (form) form.submit();
    }).catch(err => {
      console.log(err);
    });
  });
}
```

Foto de [Jason Leung](https://unsplash.com/photos/mZNRsYE9Qi4) no [Unsplash](https://unsplash.com).
