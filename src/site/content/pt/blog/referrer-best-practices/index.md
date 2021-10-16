---
title: Melhores práticas no uso dos cabeçalhos Referer e Referrer-Policy
subhead: Melhores práticas para definir seu Referrer-Policy e usar o referenciador nas solicitações de entrada.
authors:
  - maudn
date: 2020-07-30
updated: 2020-09-23
hero: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
thumbnail: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
description: |
  Considere definir uma política de referenciamento de `strict-origin-when-cross-origin`. Ela retém grande parte da utilidade do referenciador, ao mesmo tempo que reduz o risco de vazamento de dados entre origens.
tags:
  - blog
  - security
  - privacy
feedback:
  - api
---

## Resumo

- O vazamento inesperado de informações de origem cruzada prejudica a privacidade dos usuários da web. Uma política de referenciamento pode ajudar como forma de proteção.
- Considere definir uma política de referenciamento `strict-origin-when-cross-origin`. Ela retém grande parte da utilidade do referenciador, ao mesmo tempo que reduz o risco de vazamento de dados entre origens.
- Não use referenciadores para proteção Cross-Site Request Forgery (CSRF). Em [vez disso, use tokens CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation) e outros cabeçalhos como uma camada extra de segurança.

{% Aside %} Antes de começar:

- Se você tiver dúvidas quanto à diferença entre "site" e "origem", consulte [Noções básicas sobre "same-site" e "same-origin"](/same-site-same-origin/) .
- O cabeçalho `Referer` está sem um R, devido a um erro de ortografia original na especificação. O cabeçalho `Referrer-Policy`, `referrer` em JavaScript e no DOM estão escritos corretamente. {% endAside %}

## Fundamentos de Referer e Referrer-Policy

As solicitações HTTP podem incluir o [cabeçalho `Referer`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referer), que indica a origem ou URL da página da web a partir da qual a solicitação foi feita. O [cabeçalho `Referrer-Policy`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy) define quais dados são disponibilizados no cabeçalho `Referer`

No exemplo abaixo, o cabeçalho `Referer` inclui a URL completa da página no `site-one` partir do qual a solicitação foi feita.

<figure class="w-figure"> {% Img src="image/admin/cXgqJfmD5OPdzqXl9RNt.jpg", alt="Solicitação HTTP incluindo um cabeçalho Referer.", width="800", height="573" %}</figure>

O cabeçalho `Referer` pode estar presente em diferentes tipos de solicitações:

- Solicitações de navegação, quando um usuário clica num link
- Solicitações de sub-recursos, quando um navegador solicita imagens, iframes, scripts e outros recursos de que uma página precisa.

Para navegações e iframes, esses dados também podem ser acessados via JavaScript usando `document.referrer`.

O `Referer` pode ser esclarecedor. Por exemplo, um serviço analítico pode usar o valor para determinar que 50% dos visitantes no `site-two.example` vieram de `social-network.example`.

Mas quando a URL completa, incluindo o caminho e a string de consulta, é enviada no cabeçalho `Referer` **entre origens**, isto pode **prejudicar a privacidade** e também representar **riscos à segurança**. Dê uma olhada nessas URLs:

<figure class="w-figure"> {% Img src="image/admin/oTUtfrwaGYYjlOJ6KRs6.jpg", alt="URLs com caminhos, mapeados para diferentes riscos de privacidade e segurança.", width="800", height="370" %}</figure>

As URLs de número 1 a 5 contêm informações privadas, às vezes até com informações de identificação ou confidenciais. Vazá-los silenciosamente entre origens pode comprometer a privacidade dos usuários da web.

A URL número 6 é uma [capability URL](https://www.w3.org/TR/capability-urls/). Você não vai querer que ela seja vista por ninguém além do usuário pretendido. Se isto acontecer, um agente mal-intencionado poderá sequestrar a conta desse usuário.

**Para restringir quais dados de referenciador são disponibilizados para solicitações de seu site, você pode definir uma política de referenciamento.**

## Quais políticas estão disponíveis e como elas diferem?

Você pode selecionar uma dentre oito políticas. Dependendo da política, os dados disponíveis no `Referer` (e `document.referrer`) podem ser:

- Vazios (nenhum cabeçalho `Referer` estará presente)
- Apenas a [origem](/same-site-same-origin/#origin)
- A URL completa: origem, caminho e string de consulta (query string)

<figure class="w-figure"> {% Img src="image/admin/UR1U0HRP0BOF1e0XnyWA.jpg", alt="Dados que podem estar contidos no cabeçalho Referer e document.referrer.", width="800", height="255" %}</figure>

Algumas políticas são projetadas para se comportar de maneira diferente dependendo do **contexto**: origens cruzadas (cross-origin) ou solicitação da mesma origem (same-origin), segurança (se o destino da solicitação for tão seguro quanto a origem) ou ambos. Isto é útil para limitar a quantidade de informações compartilhadas entre origens ou para origens menos seguras, enquanto mantém a riqueza de informações do referenciador em seu próprio site.

Aqui está uma visão geral que mostra como as políticas de referenciamento restringem os dados de URL disponíveis no cabeçalho Referer e `document.referrer`:

<figure class="w-figure"> {% Img src="image/admin/BIHWDY60CI317O7IzmQs.jpg", alt="Políticas de referenciador diferentes e seu comportamento, dependendo da segurança e do contexto de origem cruzada.", width="800", height="537" %}</figure>

O MDN fornece uma [lista completa de políticas e exemplos de comportamento](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Directives) .

Algumas observações:

- Todas as políticas que levam o esquema (HTTPS vs. HTTP) em consideração (`strict-origin`, `no-referrer-when-downgrade` e `strict-origin-when-cross-origin`) tratam as solicitações de uma origem HTTP para outra origem HTTP da mesma forma como são tratadas as solicitações de uma origem HTTPS para outra origem HTTPS, mesmo sendo o HTTP menos seguro. Isto é porque, para essas políticas, o que importa é se ocorre uma **diminuição** da segurança, ou seja, se a solicitação puder expor dados de uma origem criptografada para uma não criptografada. Uma solicitação HTTP → HTTP não é criptografada o tempo todo, portanto, não há diminuição de segurança. As solicitações HTTPS → HTTP, ao contrário, apresentam essa diminuição.
- Uma solicitação da **mesma origem** significa que o esquema (HTTPS ou HTTP) é o mesmo; portanto, não há diminuição da segurança.

## Políticas de referenciamento default em navegadores

*Em julho de 2020*

**Se nenhuma política de referenciamento for definida, a política default do navegador será usada.**

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Navegador</th>
        <th>
<code>Referrer-Policy</code> / comportamento default</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Chrome</td>
        <td>Planejando mudar para <code>strict-origin-when-cross-origin</code> na <a href="https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default">versão 85</a> (anteriormente <code>no-referrer-when-downgrade</code>)</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>
          <ul>
            <li>
<code>strict-origin-when-cross-origin</code> (<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1589074">ver bug fechado</a>)</li>
            <li>
<code>strict-origin-when-cross-origin</code> no modo navegação privada e para rastreadores</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Edge</td>
        <td>
          <ul>
            <li><code>no-referrer-when-downgrade</code></li>
            <li>
<a href="https://github.com/privacycg/proposals/issues/13">Experimentando</a> com <code>strict-origin-when-cross-origin</code>
</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>Semelhante a <code>strict-origin-when-cross-origin</code>. Veja <a href="https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/">Preventing Tracking Prevention Tracking</a> para mais detalhes.</td>
      </tr>
    </tbody>
  </table>
</div>

## Definindo sua política de referenciamento: práticas recomendadas

{% Aside 'objective' %} Definir explicitamente uma política de melhoria de privacidade, como `strict-origin-when-cross-origin` (ou mais rigorosa). {% endAside %}

Existem diferentes maneiras de definir políticas de referenciamento para seu site:

- Como um cabeçalho HTTP
- Em seu [HTML](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Integration_with_HTML)
- Em JavaScript, [por solicitação](https://javascript.info/fetch-api#referrer-referrerpolicy)

Você pode definir políticas diferentes para páginas, solicitações ou elementos diferentes.

O cabeçalho HTTP e o elemento meta são ambos elementos de nível de página. A ordem de precedência ao determinar a política efetiva de um elemento é:

1. Política de nível de elemento
2. Política de nível de página
3. Default do navegador

**Exemplo:**

`index.html` :

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
<img src="..." referrerpolicy="no-referrer-when-downgrade" />
```

A imagem será solicitada com uma `no-referrer-when-downgrade`, enquanto todas as outras solicitações de sub-recursos desta página seguirão a política de `strict-origin-when-cross-origin`

## Como saber qual a política de referenciamento usada?

O site [securityheaders.com](https://securityheaders.com/) é útil para determinar a política que um site ou página específica está usando.

Você também pode usar as ferramentas de desenvolvedor do Chrome, Edge ou Firefox para saber qual é a política de referenciamento usada para uma solicitação específica. No momento da redação deste artigo, o Safari não mostra o `Referrer-Policy` mas mostra o `Referer` que foi enviado.

<figure class="w-figure"> {% Img src="image/admin/8Qlu6ZzSVgL2f9iYIplJ.jpg", alt=" Uma captura de tela do painel Rede do Chrome DevTools, mostrando Referer e Referrer-Policy.", width="800", height="416" %}   <figcaption class="w-figcaption">  Chrome DevTools, <b>painel de rede</b> com uma solicitação selecionada.   </figcaption></figure>

## Qual política você deve definir para seu site?

Resumo: Defina explicitamente uma política de melhoria da privacidade, como `strict-origin-when-cross-origin` (ou mais rigorosa).

### Por que "explicitamente"?

Se nenhuma política de referência for definida, será usada a política default do navegador. Na verdade, os sites muitas vezes seguem o default do navegador. Mas isto não é o ideal, porque:

- As políticas default do navegador são `no-referrer-when-downgrade`, `strict-origin-when-cross-origin` ou mais rigorosas, dependendo do navegador e do modo (privado/anônimo). Assim, seu site não terá um comportamento previsível em todos os navegadores.
- Os navegadores estão adotando padrões mais rígidos, como `strict-origin-when-cross-origin` e mecanismos, como [referrer trimming](https://github.com/privacycg/proposals/issues/13) para solicitações de origem cruzada. Optar explicitamente por uma política de aumento de privacidade antes que os defaults do navegador sejam alterados lhe dá controle e ajuda a executar testes conforme achar adequado.

### Por que usar `strict-origin-when-cross-origin` (ou algo mais rigoroso)?

Você precisa de uma política que seja segura, que aprimore a privacidade e seja útil - o que "útil" significa depende do que você deseja do referenciador:

- **Segurança**: se o seu site usa HTTPS ([se não usa, faça disto uma prioridade](/why-https-matters/)), você não vai querer que as URLs do seu site vazem em solicitações não HTTPS. Já que qualquer pessoa na rede poderá vê-las, isto iria expor seus usuários a ataques de intermediários. As políticas `no-referrer-when-downgrade` , `strict-origin-when-cross-origin`, `no-referrer` e `strict-origin` resolvem esse problema.
- **Melhoria de privacidade**: para uma solicitação de origem cruzada, `no-referrer-when-downgrade` compartilha a URL completa: isto não aumenta a privacidade. `strict-origin-when-cross-origin` e `strict-origin` compartilham apenas a origem, e `no-referrer` não compartilha nada. Com isso você tem `strict-origin-when-cross-origin` `strict-origin` e `no-referrer` como opções para melhorar a privacidade.
- **Utilidade**: `no-referrer` e `strict-origin` nunca compartilham a URL completa, mesmo para solicitações da mesma origem, portanto, se você precisar disso, `strict-origin-when-cross-origin` é a melhor opção.

Tudo isso significa que **`strict-origin-when-cross-origin`** é geralmente uma escolha sensata.

**Exemplo: definição de uma política `strict-origin-when-cross-origin`**

`index.html` :

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

Ou do lado do servidor, por exemplo, no Express:

```javascript
const helmet = require('helmet');
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));
```

### E se `strict-origin-when-cross-origin` (ou algo mais rigoroso) não acomodar todos os seus casos de uso?

Nesse caso, adote uma **abordagem progressiva**: defina uma política de proteção como `strict-origin-when-cross-origin` para seu site e, se necessário, uma política mais permissiva para solicitações específicas ou elementos HTML.

### Exemplo: política aplicada no nível do elemento

`index.html` :

```html/6
<head>
  <!-- política do nível do documento: strict-origin-when-cross-origin -->
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <head>
    <body>
      <!-- política deste elemento <a>: no-referrer-when-downgrade -->
      <a src="…" href="…" referrerpolicy="no-referrer-when-downgrade"></a>
      <body></body>
    </body>
  </head>
</head>
```

Observe que o Safari/WebKit pode limitar `document.referrer` ou o cabeçalho `Referer` para solicitações [cross-site.](/same-site-same-origin/#same-site-cross-site) Veja [detalhes](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) .

### Exemplo: política aplicada no nível da solicitação

`script.js` :

```javascript
fetch(url, {referrerPolicy: 'no-referrer-when-downgrade'});
```

### O que mais você deve considerar?

Sua política deve depender do seu site e dos casos de uso: isto depende de você, sua equipe e sua empresa. Se algumas URLs contiverem dados de identificação ou confidenciais, defina uma política de proteção.

{% Aside 'warning' %} Dados que podem não parecer confidenciais para você podem ser confidenciais para seus usuários ou simplesmente não são dados que eles desejam ou esperam que vazem silenciosamente entre origens. {% endAside %}

## Usando o referenciador de solicitações recebidas: práticas recomendadas

### O que fazer se a funcionalidade do seu site depende da URL referenciadora das solicitações recebidas?

#### Proteja os dados dos usuários

O `Referer` pode conter dados privados, pessoais ou de identificação, portanto, garanta que você o trate levando isso em consideração.

#### Lembre-se que o `Referer` você recebe pode mudar

Usar referenciadores das solicitações de origem cruzada de entrada tem algumas limitações:

- Se você não tem controle sobre a implementação do emissor da solicitação, não pode fazer suposições sobre o `Referer` (nem `document.referrer` ) que você recebe. O emissor da solicitação pode decidir a qualquer momento mudar para uma política `no-referrer` ou ainda para uma política mais rígida do que a que eles usavam antes. Isto significa que você receberá menos dados por meio do `Referer` do que antes.
- Os navegadores estão cada vez mais usando a Referrer-Policy `strict-origin-when-cross-origin` por default. Isto significa que agora você pode receber apenas a origem (em vez da URL referenciadora completo) nas solicitações de origem cruzada que chegarem, se o site que as envia não tiver uma política definida.
- Os navegadores podem mudar a maneira como gerenciam o `Referer`; por exemplo, no futuro, eles podem decidir sempre reduzir os referenciadores de origens em solicitações de sub-recursos de origem cruzada, a fim de proteger a privacidade do usuário.
- O `Referer` (e `document.referrer`) pode conter mais dados do que você precisa, por exemplo, uma URL completa quando você deseja apenas saber se a solicitação é de origem cruzada.

#### Alternativas ao `Referer`

Você pode precisar considerar alternativas se:

- Uma funcionalidade essencial do seu site usa a URL referenciadora das solicitações de origem cruzada que são recebidas;
- E/ou se seu site não estiver mais recebendo a parte da URL referenciadora de que precisa em uma solicitação de origem cruzada. Isto acontece quando o emissor da solicitação altera sua política ou quando não há uma política definida e a política padrão do navegador é alterada (como no [Chrome 85](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default)).

Para definir alternativas, analise primeiro que parte do referenciador você está usando.

**Se você só precisa da origem (`https://site-one.example`):**

- Se você estiver usando o referenciador em um script que tem acesso de nível superior à página, `window.location.origin` é uma alternativa.
- Se disponíveis, cabeçalhos como [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) e [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site) fornecem a `Origin` ou descrevem se a solicitação é de origem cruzada, que pode ser exatamente o que você precisa.

**Se você precisar de outros elementos da URL (caminho, parâmetros de query…):**

- Os parâmetros de solicitação podem fornecer o que seu caso de uso precisa e isto economiza o trabalho de processar o referenciador.
- Se você estiver usando o referenciador num script que tem acesso de nível superior à página, `window.location.pathname` pode ser uma alternativa. Extraia apenas a seção da URL que contém o caminho e repasse como argumento, de forma que qualquer informação potencialmente sensível nos parâmetros da URL não seja passada adiante.

**Se você não puder usar essas alternativas:**

- Verifique se seus sistemas podem ser alterados para esperar que o emissor da solicitação (`site-one.example`) defina explicitamente as informações que você precisa em algum tipo de configuração. Vantagens: mais explícito e mais preservador de privacidade para usuários do `site-one.example`. Desvantagens: potencialmente mais trabalho para você ou para os usuários do seu sistema.
- Verifique se o site que emite as solicitações pode concordar em definir um Referrer-Policy por elemento ou por solicitação de `no-referrer-when-downgrade`. Desvantagem: potencialmente menos preservação da privacidade para usuários do `site-one.example`, potencialmente sem suporte em todos os navegadores.

### Proteção contra Cross-Site Request Forgery (CSRF)

Observe que um emissor de solicitação sempre pode decidir não enviar o referenciador, definindo uma política `no-referrer` (e um agente malicioso pode até mesmo falsificar o referenciador).

Use [tokens CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation) como sua proteção primária. Para proteção extra, use [SameSite](/samesite-cookie-recipes/#%22unsafe%22-requests-across-sites) - e em vez de `Referer`, use cabeçalhos como [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) (disponível em solicitações POST e CORS) e [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site) (se disponível).

### Registro em log

Certifique-se de proteger os dados pessoais ou confidenciais dos usuários que possam estar no `Referer`.

Se você estiver usando apenas a origem, verifique se o cabeçalho [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) pode ser uma alternativa. Isto pode fornecer as informações que você precisa para fins de depuração de uma maneira mais simples e sem a necessidade de analisar o referenciador.

### Pagamentos

Os provedores de pagamento podem depender do cabeçalho `Referer` de solicitações que chegam para verificações de segurança.

Por exemplo:

- O usuário clica num botão **Comprar** `online-shop.example/cart/checkout` .
- `online-shop.example` redireciona para `payment-provider.example` para gerenciar a transação.
- `payment-provider.example` verifica o `Referer` desta solicitação contra uma lista de valores de `Referer` permitidos configurados pelos comerciantes. Se não corresponder a nenhuma entrada da lista, `payment-provider.example` rejeitará a solicitação. Se corresponder, o usuário pode prosseguir para a transação.

#### Melhores práticas para verificações de segurança do fluxo de pagamento

**Resumo: como provedor de pagamento, você pode usar o `Referer` como uma verificação básica contra ataques ingênuos - mas você deve sempre ter outro método de verificação mais confiável instalado.**

O cabeçalho `Referer` por si só não é base confiável para uma verificação: o site solicitante, seja ele um comerciante legítimo ou não, pode definir uma política `no-referrer` que deixará as informações de `Referer` indisponíveis para o provedor de pagamento. No entanto, como provedor de pagamento, olhar para o `Referer` pode lhe ajudar a detectar invasores ingênuos que não definiram uma política `no-referrer`. Portanto, você pode decidir usar o `Referer` como uma primeira verificação básica. Se você fizer isto, então:

- **Não espere que o `Referer` esteja sempre presente; e, se estiver presente, verifique apenas o mínimo de dados que ele deverá conter: a origem**. Ao definir a lista de valores `Referer` permitidos, certifique-se de que nenhum caminho seja incluído, mas apenas a origem. Exemplo: os valores de `Referer` permitiros para `online-shop.example` devem ser `online-shop.example`, não `online-shop.example/cart/checkout`. Por quê? Porque ao não esperar nenhum `Referer` ou valor de `Referer` que seja a origem do site solicitante, você evita erros inesperados, já que você **não está fazendo suposições sobre a `Referrer-Policy`** que seu comerciante definiu, nem sobre o comportamento do navegador se o comerciante não tiver nenhuma política definida. Tanto o site quanto o navegador poderão retirar o `Referer` enviado na solicitação recebida e limitá-lo a apenas a origem ou simplesmente não enviar o `Referer`.
- Se o `Referer` estiver ausente ou se estiver presente e sua verificação básica da origem do `Referer` tiver sido bem-sucedida: você pode passar para o outro método de verificação mais confiável (veja abaixo).

**Qual é o método de verificação mais confiável?**

Um método de verificação confiável é permitir que o solicitante faça o **hash dos parâmetros da solicitação** junto com uma chave exclusiva. Como provedor de pagamento, você pode **calcular o mesmo hash do seu lado** e aceitar a solicitação apenas se ela corresponder ao seu cálculo.

**O que acontece com o `Referer` quando um site comercial HTTP sem política de referenciador redireciona para um provedor de pagamento HTTPS?**

Nenhum `Referer` ficará visível na solicitação para o provedor de pagamento HTTPS, porque a [maioria dos navegadores](#default-referrer-policies-in-browsers) usa `strict-origin-when-cross-origin` ou `no-referrer-when-downgrade` por default quando um site não tem política definida. Observe também que [a mudança do Chrome para uma nova política default](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default) não mudará esse comportamento.

{% Aside %}

Se o seu site usa HTTP, [migre para HTTPS](/why-https-matters/).

{% endAside %}

## Conclusão

Uma política de referenciamento protetora é uma ótima maneira de garantir mais privacidade aos seus usuários.

Para saber mais sobre diferentes técnicas para proteger seus usuários, consulte a coleção do web.dev [Safe and secure](/secure/)!

*Com muitos agradecimentos por contribuições e feedback a todos os revisores - especialmente Kaustubha Govind, David Van Cleve, Mike West, Sam Dutton, Rowan Merewood, Jxck e Kayce Basques.*

## Recursos

- [Noções básicas sobre "same-site" e "same-origin"](/same-site-same-origin/)
- [Um novo cabeçalho de segurança: Referrer Policy (2017)](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
- [Referrer-Policy no MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)
- [Cabeçalho Referer: questões de privacidade e segurança no MDN](https://developer.mozilla.org/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
- [Alteração no Chrome: Blink intent to implement](https://groups.google.com/a/chromium.org/d/msg/blink-dev/aBtuQUga1Tk/n4BLwof4DgAJ)
- [Alteração do Chrome: Blink intent to send](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/lqFuqwZDDR8)
- [Alteração do Chrome: status entry](https://www.chromestatus.com/feature/6251880185331712)
- [Alteração do Chrome: 85 beta blogpost](https://blog.chromium.org/2020/07/chrome-85-upload-streaming-human.html)
- [Thread do GitHub sobre referrer trimming: como se comportam diferentes navegadores](https://github.com/privacycg/proposals/issues/13)
- [Especificação da Referrer-Policy](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-delivery)
