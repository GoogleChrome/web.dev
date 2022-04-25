---
layout: post
title: Verifique números de telefone na web com a API WebOTP
subhead: Ajude os usuários com OTPs (senhas de uso único) recebidos por SMS
authors:
  - agektmr
date: 2019-10-07
updated: 2021-06-04
hero: image/admin/iVHsQYbBj8qNYZeSZKwK.png
alt: Desenho de uma mulher usando OTP para fazer login num aplicativo web.
description: Encontrar, memorizar e digitar OTPs enviadas por SMS é complicado. A API WebOTP simplifica o workflow do processo OTP para os usuários.
tags:
  - identity
  - capabilities
feedback:
  - api
---

{% Aside 'gotchas' %} Se você quiser conhecer mais práticas recomendadas gerais relacionadas a SMS OTP, incluindo a API WebOTP, veja as [Práticas recomendadas para SMS OTP](/sms-otp-form). {% endAside %}

## O que é a API WebOTP?

Hoje em dia, a maioria das pessoas no mundo possui um dispositivo móvel e os desenvolvedores geralmente usam números de telefone como um identificador de usuários de seus serviços.

Existem diversas maneiras de verificar números de telefone, mas uma senha de uso único (OTP - "One-Time Password") gerada aleatoriamente e enviada por SMS é uma das mais comuns. O envio desse código de volta ao servidor do desenvolvedor demonstra o controle do número de telefone.

Esta ideia já foi implantada em diversos cenários para obter:

- **Número de telefone como identificador para o usuário.** Ao se inscrever em um novo serviço, alguns sites pedem um número de telefone em vez de um endereço de e-mail e o usam como um identificador de conta.
- **Verificação em duas etapas.** Ao fazer login, um site pede um código de uso único enviado via SMS além de uma senha ou outro fator de conhecimento para segurança adicional.
- **Confirmação de pagamento.** Quando um usuário está fazendo um pagamento, solicitar um código de uso único enviado por SMS pode ajudar a verificar a intenção da pessoa.

O processo atual cria atrito para os usuários. Encontrar uma OTP numa mensagem SMS e, em seguida, ter que copiá-la e colá-la no formulário é complicado, reduzindo as taxas de conversão em jornadas críticas do usuário. Facilitar esse processo tem sido um pedido de longa data para a web de muitos dos maiores desenvolvedores globais. O Android tem [uma API que faz exatamente isso](https://developers.google.com/identity/sms-retriever/). O mesmo acontece com o [iOS](https://developer.apple.com/documentation/security/password_autofill/about_the_password_autofill_workflow) e o [Safari](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element).

A API WebOTP permite que seu aplicativo receba mensagens especialmente formatadas vinculadas ao domínio de seu aplicativo. A partir daí, você pode extrair programaticamente uma OTP a partir de uma mensagem SMS e verificar um número de telefone para o usuário com mais facilidade.

{% Aside 'warning' %} Invasores podem falsificar um SMS e sequestrar o número de telefone de uma pessoa. As operadoras também podem reciclar números de telefone para novos usuários depois do encerramento de uma conta. Embora a técnica SMS OTP seja útil para verificar um número de telefone para os casos de uso acima, recomendamos a utilização de formas adicionais e mais fortes de autenticação (como múltiplos fatores e a [Web Authentication API](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API) para estabelecer novas sessões para esses usuários. {% endAside %}

## Veja em ação

Vamos supor que um usuário queira verificar seu número de telefone com um site. O site envia uma mensagem de texto ao usuário por SMS e o usuário insere a OTP da mensagem para verificar a propriedade do número de telefone.

Para o usuário, com a API WebOTP, essas etapas são tão fáceis quanto um toque, conforme mostrado no vídeo. Quando a mensagem de texto chega, uma folha inferior aparece e solicita que o usuário verifique seu número de telefone. Depois de clicar no botão **Verificar** da folha inferior, o navegador cola a OTP no formulário e ela é enviada sem que o usuário precise clicar em **Continuar**.

<video autoplay loop muted playsinline>
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.mp4" type="video/mp4">
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.webm" type="video/webm"></source></source></video>

Todo o processo está diagramado na imagem abaixo.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GrFHzEg98jxCOguAQwHe.png", alt="", width="494", height="391" %}   <figcaption>     Diagrama da WebOTP API   </figcaption></figure>

Experimente a [demonstração](https://web-otp.glitch.me) você mesmo. Ela não pede seu número de telefone ou envia um SMS para o seu dispositivo, mas você pode enviar um de outro dispositivo copiando o texto exibido na demonstração. Isto funciona porque, ao usar a API WebOTP, não importa quem é o remetente .

1. Acesse [https://web-otp.glitch.me](https://web-otp.glitch.me) no Chrome 84 ou posterior em um dispositivo Android.
2. Envie para o seu telefone a seguinte mensagem de texto SMS a partir de outro telefone.

```text
Your OTP is: 123456.

@web-otp.glitch.me #12345
```

Você recebeu o SMS e viu o prompt para inserir o código na área de entrada? É assim que a API WebOTP funciona para os usuários.

{% Aside 'gotchas' %}

Se a caixa de diálogo não aparecer para você, dê uma olhada nas [Perguntas Frequentes](#no-dialog).

{% endAside %}

O uso da API WebOTP consiste em três partes:

- Uma tag `<input>` devidamente anotada
- JavaScript em sua aplicação web
- Mensagem de texto formatada enviada por SMS.

Primeiro vou falar da tag `<input>`.

## Anote uma tag `<input>`

A WebOTP funciona sozinha sem qualquer anotação HTML, mas para compatibilidade entre navegadores, eu recomendo fortemente que você adicione `autocomplete="one-time-code"` à tag `<input>` onde você espera que o usuário insira uma OTP.

Isto permite que o Safari 14 ou posterior sugira que o usuário preencha automaticamente o `<input>` com uma OTP ao receber um SMS no formato descrito em [Formate a mensagem SMS](#format), embora ele não suporte WebOTP.

{% Label %}HTML{% endLabel %}

```html
<form>
  <input autocomplete="one-time-code" required/>
  <input type="submit">
</form>
```

## Use a API WebOTP

Como a WebOTP é simples, basta copiar e colar o código a seguir. Seja como for, eu explicarei o que está acontecendo.

{% Label %}JavaScript{% endLabel %}

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

### Detecção de recursos

A detecção de recursos é a mesma que para muitas outras APIs. Escutar o evento `DOMContentLoaded` vai esperar que a árvore DOM esteja pronta para a consulta.

{% Label %}JavaScript{% endLabel %}

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

A API WebOTP requer uma origem segura (HTTPS). A detecção de recurso num site usando HTTP irá falhar.

{% endAside %}

### Processe a OTP

A própria API WebOTP é bastante simples. Use [`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get) para obter a OTP. A WebOTP adiciona uma nova opção `otp` a esse método. Ela possui apenas uma propriedade: `transport`, cujo valor deve ser um array com a string `'sms'`.

{% Label %}JavaScript{% endLabel %}

```js/1-2
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
    …
```

Isto dispara o fluxo de permissão do navegador quando uma mensagem SMS chegar. Se a permissão for concedida, a promessa retornada será resolvida com um objeto `OTPCredential`.

{% Label %} Conteúdo do objeto `OTPCredential` obtido {% endLabel %}

```json
{
  code: "123456" // Obtained OTP
  type: "otp"  // `type` is always "otp"
}
```

Em seguida, passe o valor da OTP para o campo `<input>`. O envio direto do formulário eliminará a etapa que exige que o usuário toque num botão.

{% Label %}JavaScript{% endLabel %}

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

### Abortando a mensagem {: #aborting}

Caso o usuário insira manualmente uma OTP e envie o formulário, você pode cancelar a chamada `get()` usando uma instância `AbortController` no objeto [`options`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get#Parameters).

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

## Formate a mensagem SMS {: #format}

A API em si deve parecer bastante simples, mas há algumas coisas que você deve saber antes de usá-la. A mensagem deve ser enviada depois que `navigator.credentials.get()` for chamado e deve ser recebida no dispositivo onde `get()` foi chamado. Por fim, a mensagem deve respeitar a seguinte formatação:

- A mensagem começa com um texto legível (opcional) que contém uma sequência alfanumérica de quatro a dez caracteres com pelo menos um número deixando a última linha para a URL e a OTP.
- A parte do domínio da URL do site que chamou a API deve ser precedida por `@`.
- A URL deve conter um sinal de hash ('`#`') seguido pela OTP.

Por exemplo:

```text
Your OTP is: 123456.

@www.example.com #123456
```

Eis alguns exemplos ruins:

Exemplo de texto SMS malformado | Por que não funciona
--- | ---
`Here is your code for @example.com #123456` | `@` deve ser o primeiro caractere da última linha.
`Your code for @example.com is #123456` | `@` deve ser o primeiro caractere da última linha.
`Your verification code is 123456`<br><br>`@example.com\t#123456` | Espera-se um único espaço entre `@host` e `#code`.
`Your verification code is 123456`<br><br>`@example.com`<code>  </code>`#123456` | Espera-se um único espaço entre `@host` e `#code`.
`Your verification code is 123456`<br><br>`@ftp://example.com #123456` | O esquema de URL não pode ser incluído.
`Your verification code is 123456`<br><br>`@https://example.com #123456` | O esquema de URL não pode ser incluído.
`Your verification code is 123456`<br><br>`@example.com:8080 #123456` | A porta não pode ser incluída.
`Your verification code is 123456`<br><br>`@example.com/foobar #123456` | O caminho não pode ser incluído.
`Your verification code is 123456`<br><br>`@example .com #123456` | Não pode haver espaços em branco no domínio.
`Your verification code is 123456`<br><br>`@domain-forbiden-chars-#%/:<>?@[] #123456` | Não pode haver  [caracteres proibidos](https://url.spec.whatwg.org/#forbidden-host-code-point) no domínio.
`@example.com #123456`<br><br>`Mambo Jumbo` | `@host` e `#code` devem ser a última linha.
`@example.com #123456`<br><br>`App hash #oudf08lkjsdf834` | `@host` e `#code` devem ser a última linha.
`Your verification code is 123456`<br><br>`@example.com 123456` | Falta `#`.
`Your verification code is 123456`<br><br>`example.com #123456` | Falta `#`.
`Hi mom, did you receive my last text` | Falta `@` e `#`.

## Demos

Experimente várias mensagens com a demonstração: [https://web-otp.glitch.me](https://web-otp.glitch.me)

Você também pode fazer um fork e criar sua própria versão: [https://glitch.com/edit/#!/web-otp](https://glitch.com/edit/#!/web-otp).

{% Glitch { id: 'web-otp', path: 'views/index.html', previewSize: 0, allow: [] } %}

## Use WebOTP de um iframe de origem cruzada

A inserção de uma SMS OTP para um iframe de origem cruzada é tipicamente usada para confirmação de pagamento, principalmente com 3D Secure. Tendo o formato comum para suportar iframes de origem cruzada, a API WebOTP entrega OTPs vinculados a origens aninhadas. Por exemplo:

- Um usuário visita `shop.example` para comprar um par de sapatos com cartão de crédito.
- Depois de inserir o número do cartão de crédito, o provedor de pagamento integrado mostra um formulário do site `bank.example` num iframe solicitando que o usuário verifique seu número de telefone para um checkout rápido.
- O site `bank.example` envia um SMS que contém uma OTP ao usuário para que ele possa inseri-la e verificar sua identidade.

Para usar a API WebOTP de um iframe de origem cruzada, você precisa fazer duas coisas:

- Anotar tanto a origem do frame superior como a origem do iframe na mensagem de texto SMS.
- Configure a política de permissões para permitir que o iframe de origem cruzada receba a OTP diretamente do usuário.

<figure> {% Video   src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/Ba3OSkSsB4NwFkHGOuvc.mp4",   autoplay="true",   controls="true",   loop="true",   muted="true",   preload="auto",   width="300",   height="600" %}   <figcaption>     WebOTP API num iframe em ação.   </figcaption></figure>

Você pode experimentar a demonstração em [https://web-otp-iframe-demo.stackblitz.io](https://web-otp-iframe-demo.stackblitz.io) .

### Anote origens vinculadas à mensagem de texto SMS

Quando a API WebOTP é chamada de dentro de um iframe, a mensagem de texto SMS deve incluir a origem do frame de nível superior precedida por `@` seguida pela OTP precedida por `#` e a origem do iframe precedida por `@` na última linha.

```text
Your verification code is 123456

@shop.example #123456 @bank.exmple
```

### Configure a política de permissões

Para usar a WebOTP num iframe de origem cruzada, o incorporador deve conceder acesso a essa API por meio da [política de permissões](https://www.w3.org/TR/permissions-policy-1) otp-credentials para evitar comportamento indesejado. Em geral, existem duas maneiras de atingir esse objetivo:

{% Label %}via cabeçalho HTTP:{% endLabel %}

```http
Permissions-Policy: otp-credentials=(self "https://bank.example")
```

{% Label %}via atributo iframe `allow`:{% endLabel %}

```html
<iframe src="https://bank.example/…" allow="otp-credentials"></iframe>
```

Veja [mais exemplos de como especificar uma política de permissões](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/).

{% Aside %}

Atualmente o Chrome só suporta chamadas da API WebOTP a partir de iframes de origem cruzada que **não têm mais do que uma** origem única em sua cadeia de ancestrais. Nos seguintes cenários:

- `a.com` -&gt; `b.com`
- `a.com` -&gt; `b.com` -&gt; `b.com`
- `a.com` -&gt; `a.com` -&gt; `b.com`
- `a.com` -&gt; `b.com` -&gt; `c.com`

o uso de WebOTP em `b.com` é suportado, mas não em `c.com`.

Observe que o cenário a seguir também não é suportado devido à falta de demanda e às complexidades da UX.

- `a.com` -&gt; `b.com` -&gt; `a.com` (chama a API WebOTP)

{% endAside %}

## Perguntas frequentes

### A caixa de diálogo não aparece, embora eu esteja enviando uma mensagem formatada corretamente. O que há de errado? {: #no-dialog}

Existem algumas questões que devem ser observadas ao testar a API:

- Se o número de telefone do remetente estiver incluído na lista de contatos do destinatário, esta API não será acionada devido ao design da [SMS User Consent API](https://developers.google.com/identity/sms-retriever/user-consent/request#2_start_listening_for_incoming_messages) subjacente.
- Se você estiver usando um perfil de trabalho em seu dispositivo Android e a WebOTP não funcionar, tente instalá-la e usar o Chrome no seu perfil pessoal (ou seja, o mesmo perfil que você recebe mensagens SMS).

Verifique novamente o [formato](#format) para ver se seu SMS está formatado corretamente.

### Esta API é compatível entre navegadores diferentes?

O Chromium e o WebKit concordaram com [o formato de mensagem de texto SMS](https://wicg.github.io/sms-one-time-codes) e a [Apple anunciou o suporte do Safari para ele](https://developer.apple.com/news/?id=z0i801mg) a partir do iOS 14 e macOS Big Sur. Embora o Safari não suporte a API JavaScript do WebOTP, ao anotar o elemento `input` com `autocomplete=["one-time-code"]`, o teclado padrão sugere automaticamente que você insira o OTP se a mensagem SMS estiver em conformidade com o formato.

### É seguro usar SMS como forma de autenticação?

Embora a SMS OTP seja útil para verificar um número de telefone quando o número é fornecido pela primeira vez, a verificação do número de telefone via SMS deve ser usada com cuidado na reautenticação, pois os números de telefone podem ser sequestrados e reciclados pelas operadoras. A WebOTP é um mecanismo de reautenticação e recuperação conveniente, mas os serviços devem combiná-lo com fatores adicionais, como um desafio de conhecimento ou usar a [Web Authentication API](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API) para autenticação forte.

### Onde posso relatar bugs na implementação do Chrome?

Você encontrou um bug na implementação do Chrome?

- Registre um bug em [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ESMS). Inclua o máximo de detalhes que puder, instruções simples para reproduzi-lo e defina **Componentes** para `Blink>WebOTP`.

### Como posso ajudar neste recurso?

Você planeja usar a API WebOTP? Seu apoio público nos ajuda a priorizar os recursos e mostra a outros fornecedores de navegadores como é importante apoiá-los. Envie um tweet para [@ChromiumDev](https://twitter.com/chromiumdev) usando a hashtag [`#WebOTP`](https://twitter.com/search?q=%23WebOTP&src=typed_query&f=live) e diga-nos onde e como você está usando.

{% Aside %} Encontre mais perguntas na [seção Perguntas \frequentes do explicador](https://github.com/WICG/WebOTP/blob/master/FAQ.md). {% endAside %}
