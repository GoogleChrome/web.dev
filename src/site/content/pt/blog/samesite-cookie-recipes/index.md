---
title: Receitas de cookies do SameSite
subhead: |-
  Atualize os cookies do seu site para se preparar para as mudanças futuras no SameSite
  comportamento do atributo.
authors:
  - rowan_m
date: 2019-10-30
updated: 2020-05-28
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/5f56hyvtMT6Dymo839tc.png
description: Com a introdução do novo valor de atributo SameSite = None, os sites agora podem marcar explicitamente seus cookies para uso entre sites. Os navegadores estão mudando para fazer cookies sem um atributo SameSite atuarem como primários por padrão, uma opção de preservação de privacidade mais segura e mais do que o comportamento aberto atual. Aprenda como marcar seus cookies para garantir que seus cookies primários e terciários continuem a funcionar assim que essa alteração entrar em vigor.
tags:
  - blog
  - security
  - cookies
  - chrome-80
  - test-post
feedback:
  - api
---

{% Aside %} Este artigo faz parte de uma série sobre as alterações de atributo do cookie `SameSite`

- [Cookies SameSite explicados](/samesite-cookies-explained/)
- [Receitas de cookies SameSite](/samesite-cookie-recipes/)
- [Schemeful Same-Site](/schemeful-samesite) {% endAside %}

[Chrome](https://www.chromium.org/updates/same-site), [Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ), [Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) e outros mudarão seu comportamento padrão de acordo com a proposta da IETF, [Cookies Incrementalmente Melhores,](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) para que:

- Cookies sem um atributo `SameSite` sejam tratados como `SameSite=Lax`, ou seja, o comportamento padrão será para restringir cookies para **apenas** contextos primários.
- Os cookies para uso entre sites **devem** especificar `SameSite=None; Secure` para permitir a inclusão no contexto de terceiros.

Este recurso é o [comportamento padrão do Chrome 84 estável em diante](https://blog.chromium.org/2020/05/resuming-samesite-cookie-changes-in-july.html). Se você ainda não o fez, deve atualizar os atributos dos cookies de terceiros para que não sejam bloqueados no futuro.

## Suporte para vários navegadores

Consulte a seção de [compatibilidade](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie#Browser_compatibility) do navegador da página [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)

## Casos de uso para cookies de sites ou de terceiros

Existem vários casos de uso e padrões comuns em que os cookies precisam ser enviados em um contexto de terceiros. Se você fornecer ou depender de um desses casos de uso, certifique-se de que você ou o provedor atualizem seus cookies para garantir que o serviço continue a funcionar corretamente.

### Conteúdo em um `<iframe>`

O conteúdo de um site diferente exibido em um `<iframe>` está em um contexto de terceiros. Os casos de uso padrão aqui são:

- Conteúdo incorporado compartilhado de outros sites, como vídeos, mapas, exemplos de código e publicações sociais.
- Widgets de serviços externos, como pagamentos, calendários, reservas e funcionalidade de reserva.
- Widgets como botões sociais ou serviços antifraude que criam `<iframes>` menos óbvios.

Os cookies podem ser usados aqui para, entre outras coisas, manter o estado da sessão, armazenar preferências gerais, habilitar estatísticas ou personalizar conteúdo para usuários com contas existentes.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fTUQP4SffHHcexSipvlz.png", alt="Diagrama de uma janela do navegador em que o URL do conteúdo incorporado não corresponde ao URL da página.", width="468", height="383", style="max-width: 35vw;" %} <figcaption> Se o conteúdo incorporado não vier do mesmo site que o contexto de navegação de nível superior, é conteúdo de terceiros. </figcaption></figure>

Além disso, como a web é inerentemente combinável, `<iframes>` são usados para incorporar conteúdo que também é visualizado em um contexto de nível superior ou próprio. Todos os cookies usados por esse site serão considerados cookies de terceiros quando o site for exibido dentro do quadro. Se você estiver criando sites que pretende incorporar facilmente por outras pessoas, ao mesmo tempo em que também depende de cookies para funcionar, você também precisará garantir que eles sejam marcados para uso entre sites ou que você possa fazer um fallback sem eles.

### Solicitações "inseguras" em diferentes sites

Embora "inseguro" possa soar um pouco preocupante aqui, isso se refere a qualquer solicitação que possa ter a intenção de mudar de estado. Na web, isso é principalmente solicitações POST. Os cookies marcados como `SameSite=Lax` serão enviados em navegações seguras de nível superior, por exemplo, clicar em um link para ir para um site diferente. No entanto, algo como um `<form>` via POST para um site diferente não incluiria cookies.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vddDg7f9Gp93OgaqWwHu.png", alt="Diagrama de uma solicitação passando de uma página para outra.", width="719", height="382", style="max-width: 35vw;" %} <figcaption> Se a solicitação recebida usar um método "seguro", os cookies serão enviados. </figcaption></figure>

Esse padrão é usado em sites que podem redirecionar o usuário para um serviço remoto para realizar alguma operação antes de retornar, por exemplo, redirecionando para um provedor de identidade de terceiros. Antes de o usuário deixar o site, um cookie é definido contendo um token de uso único com a expectativa de que esse token possa ser verificado na solicitação de retorno para mitigar ataques [Cross Site Request Forgery (CSRF).](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) Se essa solicitação de retorno vier via POST, será necessário marcar os cookies como `SameSite=None; Secure`.

### Recursos remotos

Todo recurso remoto em uma página pode depender de cookies a serem enviados com uma solicitação, de tags `<img>`, tags `<script>` e assim por diante. Casos de uso comuns incluem rastreamento de pixels e personalização de conteúdo.

Isso também se aplica a solicitações iniciadas em seu JavaScript por `fetch` ou `XMLHttpRequest` . Se `fetch()` for chamado com as [credenciais: opção `credentials: 'include'`](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch#Sending_a_request_with_credentials_included) este é um bom indicativo de que podem ser esperados cookies nessas solicitações. Para `XMLHttpRequest` você deve procurar instâncias da propriedade [`withCredentials`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/withCredentials) definida como `true`. Este é um bom indicativo de que cookies podem ser esperados nessas solicitações. Esses cookies precisarão ser marcados adequadamente para serem incluídos nas solicitações entre sites.

### Conteúdo em um WebView

Um WebView em um aplicativo específico de plataforma é alimentado por um navegador e você precisará testar se as mesmas restrições ou problemas se aplicam. No Android, se o WebView for baseado no Chrome, os novos padrões **não** serão aplicados imediatamente com o Chrome 84. No entanto, a intenção é aplicá-los no futuro, então você ainda assim deve testar e se preparar para isso. Além disso, o Android permite que seus aplicativos específicos de plataforma definam cookies diretamente por meio da [API CookieManager](https://developer.android.com/reference/android/webkit/CookieManager). Assim como acontece com os cookies definidos por meio de cabeçalhos ou JavaScript, considere incluir `SameSite=None; Secure` se forem destinados ao uso entre sites.

## Como implementar o `SameSite` hoje

Para cookies em que eles são necessários apenas em um contexto original, você deve marcá-los como `SameSite=Lax` ou `SameSite=Strict`, dependendo de suas necessidades. Você também pode optar por não fazer nada e apenas permitir que o navegador imponha seu padrão, mas isso vem junto com o risco de comportamento inconsistente entre os navegadores e possíveis avisos de console para cada cookie.

```text
Set-Cookie: first_party_var=value; SameSite=Lax
```

Para cookies necessários em um contexto de terceiros, você precisará garantir que eles sejam marcados como `SameSite=None; Secure`. Observe que você precisa de ambos os atributos juntos. Se você apenas especificar `None` sem `Secure` o cookie será rejeitado. No entanto, existem algumas diferenças mutuamente incompatíveis nas implementações do navegador, portanto, pode ser necessário usar algumas das estratégias de atenuação descritas a seguir em [Tratamento de clientes incompatíveis](#handling-incompatible-clients).

```text
Set-Cookie: third_party_var=value; SameSite=None; Secure
```

### Tratamento de clientes incompatíveis

Como essas alterações para incluir `None` e atualizar o comportamento padrão ainda são relativamente novas, há inconsistências entre os navegadores quanto à forma como essas alterações são tratadas. Você pode consultar a [página de atualizações em chromium.org](https://www.chromium.org/updates/same-site/incompatible-clients) para se informar sobre os problemas conhecidos atualmente, no entanto, não é possível dizer se isso é completo. Embora isso não seja o ideal, existem soluções alternativas que você pode empregar durante esta fase de transição. A regra geral, porém, é tratar clientes incompatíveis como o caso especial. Não crie uma exceção para navegadores que implementam as regras mais recentes.

A primeira opção é definir os cookies de estilo novo e antigo:

```text
Set-cookie: 3pcookie=value; SameSite=None; Secure
Set-cookie: 3pcookie-legacy=value; Secure
```

Os navegadores que implementam o comportamento mais recente `SameSite` o cookie com o valor SameSite, enquanto outros navegadores podem ignorá-lo ou defini-lo incorretamente. No entanto, esses mesmos navegadores definirão o cookie `3pcookie-legacy` Ao processar os cookies incluídos, o site deve primeiro verificar a presença do cookie de novo estilo e, se ele não for encontrado, voltar para o cookie legado.

O exemplo abaixo mostra como fazer isso em Node.js, usando a [estrutura Express](https://expressjs.com) e seu middleware [analisador de cookies.](https://www.npmjs.com/package/cookie-parser)

```javascript
const express = require('express');
const cp = require('cookie-parser');
const app = express();
app.use(cp());

app.get('/set', (req, res) => {
  // Define o novo estilo de cookie
  res.cookie('3pcookie', 'value', { sameSite: 'none', secure: true });
  // E define o mesmo valor no cookie legado
  res.cookie('3pcookie-legacy', 'value', { secure: true });
  res.end();
});

app.get('/', (req, res) => {
  let cookieVal = null;

  if (req.cookies['3pcookie']) {
    // verifique o novo cookie de estilo primeiro
    cookieVal = req.cookies['3pcookie'];
  } else if (req.cookies['3pcookie-legacy']) {
    // caso contrário, volte para o cookie legado
    cookieVal = req.cookies['3pcookie-legacy'];
  }

  res.end();
});

app.listen(process.env.PORT);
```

A desvantagem é que isso envolve a configuração de cookies redundantes para cobrir todos os navegadores e requer alterações tanto no ponto de configuração quanto na leitura do cookie. No entanto, essa abordagem deve abranger todos os navegadores, independentemente de seu comportamento, e garantir que os cookies de terceiros continuem a funcionar como antes.

Como alternativa, no momento de enviar o `Set-Cookie` , você pode escolher detectar o cliente por meio da string do agente do usuário. Consulte a [lista de clientes incompatíveis](https://www.chromium.org/updates/same-site/incompatible-clients) e, a seguir, use uma biblioteca apropriada para sua plataforma, por exemplo, [biblioteca ua-parser-js](https://www.npmjs.com/package/ua-parser-js) em Node.js. É aconselhável encontrar uma biblioteca para lidar com a detecção do agente do usuário, pois provavelmente você não irá querer escrever essas expressões regulares você mesmo.

O benefício dessa abordagem é que ela exige apenas uma alteração no momento da configuração do cookie. No entanto, o aviso necessário aqui é que a detecção do agente do usuário é inerentemente frágil e pode não capturar todos os usuários afetados.

{% Aside %}

Independentemente da opção que você escolher, é aconselhável garantir que você tenha uma maneira de registrar os níveis de tráfego que estiverem passando pela rota legada. Certifique-se de ter um lembrete ou alerta para remover esta solução alternativa assim que os níveis caírem abaixo de um limite aceitável para o seu site.

{% endAside %}

## Suporte para `SameSite=None` em linguagens, bibliotecas e estruturas

A maioria das linguagens e bibliotecas suporta o `SameSite` para cookies, no entanto, a adição de `SameSite=None` ainda é relativamente nova, o que significa que você pode precisar contornar alguns dos comportamentos padrão por enquanto. Eles estão documentados no <a href="https://github.com/GoogleChromeLabs/samesite-examples" data-md-type="link">repositório exemplos `SameSite` no GitHub</a> .

## Obtendo ajuda

Os cookies estão em todos os lugares e é raro que qualquer site tenha completamente auditado onde eles estão definidos e usados, especialmente quando se incluir casos de uso cross-site entre as combinações. Quando você encontra um problema, pode muito bem ser a primeira vez que alguém o encontra. Então, não hesite em entrar em contato:

- Relate um problema no [repositório de exemplos `SameSite` no GitHub](https://github.com/GoogleChromeLabs/samesite-examples) .
- faça uma pergunta com a [tag "samesite" no StackOverflow](https://stackoverflow.com/questions/tagged/samesite) .
- Para problemas com o comportamento do Chromium, relate um bug por meio do [modelo de problema [cookies do SameSite]](https://bit.ly/2lJMd5c) .
- Siga o progresso do Chrome na [página de atualizações `SameSite`](https://www.chromium.org/updates/same-site) .

