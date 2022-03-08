---
title: Cookies SameSite explicados
subhead: Proteja seu site aprendendo como marcar explicitamente cookies cross-site.
authors:
  - rowan_m
date: 2019-05-07
updated: 2020-05-28
hero: image/admin/UTOC41rgCccAqVNbJlyK.jpg
description: Saiba como marcar seus cookies para uso primário e de terceiros com o atributo SameSite. Você pode melhorar a segurança do seu site usando os valores Lax e Strict do SameSite para melhorar a proteção contra ataques CSRF. Especificar o novo atributo None permite que você marque explicitamente seus cookies para uso entre sites (cross-site).
tags:
  - blog
  - security
  - cookies
  - chrome-80
feedback:
  - api
---

{% Aside %} Este artigo faz parte de uma série sobre alterações em atributos do cookie `SameSite`

- [Cookies SameSite explicados](/samesite-cookies-explained/)
- [Receitas de cookies SameSite](/samesite-cookie-recipes/)
- [Schemeful Same-Site](/schemeful-samesite) {% endAside %}

Cookies são um dos métodos disponíveis para adicionar estado persistente a sites. Com o passar dos anos, suas capacidades cresceram e evoluíram, mas deixaram a plataforma com alguns problemas legados problemáticos. Para resolver isso, os navegadores (incluindo Chrome, Firefox e Edge) estão mudando seu comportamento para impor mais padrões de preservação da privacidade.

Cada cookie é um par chave=valor (`key=value`) junto com uma série de atributos que controlam quando e onde o cookie é usado. Você provavelmente já usou esses atributos para definir coisas como datas de expiração ou indicar que o cookie só deve ser enviado por HTTPS. Os servidores definem cookies enviando o cabeçalho `Set-Cookie` na sua resposta. Para saber todos os detalhes, você pode mergulhar no [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1), mas aqui você pode ter uma introdução rápida.

Digamos que você tenha um blog no qual deseja exibir uma promoção "O que há de novo" para seus usuários. Os usuários podem dispensar a promoção e assim eles não irão vê-la novamente por um tempo. Você pode armazenar essa preferência em um cookie, configurá-lo para expirar em um mês (2.600.000 segundos) e enviá-lo apenas por HTTPS. O cabeçalho ficaria assim:

```text
Set-Cookie: promo_shown=1; Max-Age=2600000; Secure
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jJ1fqcsAk9Ig3hManFBO.png", alt="Três cookies sendo enviados para um navegador por um servidor em uma resposta HTTP", width="800", height="276", style="max-width: 35vw" %}   <figcaption>Servers set cookies using the <code>Set-Cookie</code> header.</figcaption></figure>

Quando o leitor visualizar uma página que atende a esses requisitos, ou seja, quando estiver numa conexão segura e o cookie tenha menos de um mês de vida, o navegador enviará este cabeçalho na sua solicitação HTTP:

```text
Cookie: promo_shown=1
```

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rq21WQpOZFvfgS9bbjmc.png", alt="Três cookies sendo enviados de um navegador para um servidor numa solicitação HTTP", width="800", height="165", style="max-width: 35vw" %}   <figcaption>Seu navegador devolve os cookies através do cabeçalho <code>Cookie</code>.</figcaption></figure>

Você também pode adicionar e ler os cookies disponíveis para esse site em JavaScript através de `document.cookie`. Atribuir um par chave=valor a `document.cookie` cria ou substitui um cookie com essa chave. Por exemplo, você pode experimentar o seguinte código no console JavaScript do seu navegador:

```text
→ document.cookie = "promo_shown=1; Max-Age=2600000; Secure"
← "promo_shown=1; Max-Age=2600000; Secure"
```

A leitura de `document.cookie` devolve todos os cookies acessíveis no contexto atual, com cada cookie separado por um ponto e vírgula:

```text
→ document.cookie;
← "promo_shown=1; color_theme=peachpuff; sidebar_loc=left"
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mbV00Gy5VAPTUls0i7cM.png", alt="JavaScript acessando cookies no navegador", width="600", height="382", style="max-width: 35vw" %}<figcaption>JavaScript pode accessar cookies usando <code>document.cookie</code>.</figcaption></figure>

Se você tentar isso numa seleção de sites populares, notará que a maioria deles define muito mais do que apenas três cookies. Na maioria dos casos, esses cookies são enviados a cada solicitação para esse domínio, o que tem uma série de implicações. A largura de banda de upload geralmente é mais restrita que o download para seus usuários, de modo que a sobrecarga em todas as solicitações de saída estará adicionando um atraso no seu tempo para o primeiro byte. Seja conservador no número e no tamanho dos cookies que você define. Use o atributo `Max-Age` para ajudar a garantir que os cookies não durem mais do que o necessário.

## O que são cookies primários e de terceiros?

Se você voltar para a mesma seleção de sites que estava olhando antes, deve ter percebido que havia cookies para uma variedade de domínios, não apenas aquele que você estava visitando no momento. Os cookies que correspondem ao domínio do site atual (o domínio exibido na barra de endereços do navegador) são chamados de cookies **primários.** Da mesma forma, os cookies de domínios diferentes do site atual são chamados de cookies de **terceiros.** Isto não é um rótulo absoluto, mas relativo ao contexto do usuário; o mesmo cookie pode ser original ou de terceiros, dependendo do site no qual o usuário se encontra no momento.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zjXpDz2jAdXMT83Nm3IT.png", alt="Três cookies sendo enviados para um navegador a partir de solicitações diferentes na mesma página", width="800", height="346", style="max-width: 35vw" %}<figcaption>Os cookies podem vir de uma variedade de domínios diferentes em uma página.</figcaption></figure>

Continuando o exemplo acima, vamos supor que uma de suas postagens de blog tenha uma foto de um gato particularmente incrível e está hospedada em `/blog/img/amazing-cat.png`. Por ser uma imagem tão incrível, outra pessoa a usa diretamente em seu site. Se um visitante esteve no seu site e possui o cookie `promo_shown`, quando ele visualizar o `amazing-cat.png` no site da outra pessoa, esse cookie **será enviado** como parte da solicitação de imagem. Isso é completamente inútil, já que `promo_shown` não é usado para nada no site dessa outra pessoa, ele apenas acrescenta uma sobrecarga à solicitação.

Se for um efeito não intencional, por que alguém o faria? É esse mecanismo que permite que os sites mantenham o estado quando estão sendo usados num contexto de terceiros. Por exemplo, se você incorporar um vídeo do YouTube no seu site, os visitantes verão uma opção "Assistir mais tarde" no player. Se o seu visitante já estiver conectado ao YouTube, essa sessão está sendo disponibilizada no player incorporado por um cookie de terceiros, o que significa que o botão "Assistir mais tarde" salvará o vídeo de uma vez ao invés de solicitar que ele faça login ou tenha que navegar para fora de sua página e de volta para o YouTube.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/u9chHBLm3i27yFRwHx5W.png", alt="O mesmo cookie sendo enviado em três contextos diferentes", width="800", height="433", style="max-width: 35vw" %}<figcaption>Um cookie em um contexto de terceiros é enviado ao visitar páginas diferentes.</figcaption></figure>

Uma das propriedades culturais da web é que ela tende a ser aberta por default. Isto é parte do que tem permitido que tantas pessoas criassem seus próprios conteúdos e aplicativos nela. No entanto, isso também trouxe uma série de questões relacionadas a segurança e privacidade. Os ataques de falsificação de solicitação entre sites (CSRF - Cross-Site Request Forgery) baseiam-se no fato de que os cookies são anexados a qualquer solicitação para uma determinada origem, independentemente de quem inicia a solicitação. Por exemplo, se você visitar `evil.example`, ele pode acionar solicitações para `your-blog.example`, e seu navegador anexará imediatamente os cookies associados. Se o seu blog não tiver cuidado com a forma como valida essas solicitações, o site `evil.example` poderá desencadear ações como excluir postagens ou adicionar conteúdo.

Os usuários também estão se conscientizando de como cookies podem ser usados para rastrear as atividades deles através de múltiplos sites. No entanto, até agora não houve uma maneira de declarar explicitamente sua intenção com o cookie. Seu `promo_shown` só pode ser enviado num contexto primário, enquanto um cookie de sessão para um widget que deve ser incorporado em outros sites está intencionalmente lá para fornecer o estado de usuário logado num contexto de terceiros.

## Declare explicitamente o uso de cookies com o atributo `SameSite`

A introdução do `SameSite` (definido em [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00) ) permite que você declare se seu cookie deve ser restrito a um contexto primário ou do mesmo site. É útil entender exatamente o que 'site' significa aqui. O site é a combinação do sufixo do domínio e a parte do domínio imediatamente anterior. Por exemplo, o `www.web.dev` faz parte do site `web.dev`

{% Aside 'key-term' %}

Se o usuário estiver em `www.web.dev` e solicitar uma imagem de `static.web.dev`, isto será considerado uma solicitação do **mesmo site.**

{% endAside %}

Quem define o que é um sufixo de domínio é a [lista de sufixos públicos](https://publicsuffix.org/), portanto, a distinção não se restringe apenas a domínios de nível superior como `.com` mas também inclui serviços como `github.io`. Isto permite que `your-project.github.io` e `my-project.github.io` sejam contados como sites separados.

{% Aside 'key-term' %}

Se o usuário estiver em `your-project.github.io` e solicitar uma imagem de `my-project.github.io`, isto será considerado uma solicitação **entre sites.**

{% endAside %}

A introdução do atributo `SameSite` num cookie fornece três maneiras diferentes de controlar esse comportamento. Você pode optar por não especificar o atributo ou pode usar os valores `Strict` ou `Lax` para restringir o cookie a solicitações do mesmo site.

Se você definir `SameSite` como `Strict`, seu cookie será enviado apenas num contexto primário. Do ponto de vista do usuário, o cookie só será enviado se o site do cookie corresponder ao site atualmente mostrado na barra de URL do navegador. Portanto, se o cookie `promo_shown` for definido da seguinte maneira:

```text
Set-Cookie: promo_shown=1; SameSite=Strict
```

Quando o usuário estiver no seu site, o cookie será enviado junto com a solicitação como esperado. No entanto, ao seguir um link para o seu site, digamos de outro site ou através do e-mail de um amigo, nessa solicitação inicial o cookie não será enviado. Isto é bom quando você tem cookies relacionados à funcionalidade que sempre deve estar associada a uma navegação inicial, como a alteração de uma senha ou a realização de uma compra, mas é muito restritiva para `promo_shown`. Se o seu leitor seguir o link para o site, ele deseja que o cookie seja enviado para que sua preferência possa ser aplicada.

É aí que entra `SameSite=Lax`, que permite que o cookie seja enviado com essas navegações de nível superior. Vamos revisitar o exemplo do artigo sobre gatos acima, onde outro site está referenciando seu conteúdo. Eles usam sua foto do gato diretamente e fornecem um link para o seu artigo original.

```html
<p>Look at this amazing cat!</p>
<img src="https://blog.example/blog/img/amazing-cat.png" />
<p>Read the <a href="https://blog.example/blog/cat.html">article</a>.</p>
```

E o cookie foi definido como:

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

Quando o leitor estiver no blog de outra pessoa, o cookie **não será enviado** quando o navegador solicitar o `amazing-cat.png`. No entanto, quando o leitor seguir o link para `cat.html` no seu blog, essa solicitação **incluirá** o cookie. Isto faz com que o valor `Lax` seja uma boa escolha para cookies que afetam a exibição do site. O valor `Strict` é útil para cookies relacionados às ações que seu usuário está realizando.

{% Aside 'caution' %}

Nem `Strict` nem `Lax` são uma solução completa para a segurança do seu site. Os cookies são enviados como parte da solicitação do usuário e você deve tratá-los da mesma forma que qualquer outra entrada do usuário. Isto significa higienizar e validar a entrada. Nunca use um cookie para armazenar dados que você considera segredo que deveria ficar do lado do servidor.

{% endAside %}

Por último, existe a opção de não especificar o valor. Anteriormente, esta era a forma de indicar implicitamente o desejo de que o cookie fosse enviado em todos os contextos. No último rascunho da [RFC6265bis,](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03) isto foi explicitado pela introdução de um novo valor de `SameSite=None`. Isto significa que você pode usar `None` para comunicar claramente seu desejo intencional de que o cookie seja enviado num contexto de terceiros.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1MhNdg9exp0rKnHpwCWT.png", alt="Três cookies rotulados como None, Lax ou Strict dependendo do contexto", width="800", height="456", style="max-width: 35vw" %}<figcaption> Marque explicitamente o contexto de um cookie como <code>None</code>, <code>Lax</code> ou <code>Strict</code></figcaption></figure>

{% Aside %}

Se você fornece um serviço que outros sites consomem, como widgets, conteúdo incorporado, programas de afiliados, publicidade ou login em vários sites, você deve usar `None` para garantir que sua intenção seja clara.

{% endAside %}

## Mudanças ao comportamento default sem SameSite

Embora o `SameSite` seja amplamente suportado, infelizmente ele não tem sido amplamente adotado pelos desenvolvedores. O padrão default de envio de cookies para todos os lugares significa que todos os casos de uso funcionam, mas deixa o usuário vulnerável a CSRF e vazamento não intencional de informações. Para encorajar os desenvolvedores a declarar suas intenções e fornecer aos usuários uma experiência mais segura, a proposta da IETF, [Incrementally Better Cookies](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) apresenta duas mudanças principais:

- Cookies sem um `SameSite` serão tratados como `SameSite=Lax`.
- Cookies com `SameSite=None` também devem especificar `Secure`, o que significa que requerem um contexto seguro.

O Chrome implementa esse comportamento default a partir da versão 84. O [Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ) suporta experimentalmente a partir do Firefox 69 e será comportamento default no futuro. Para testar esses comportamentos no Firefox, abra [`about:config`](http://kb.mozillazine.org/About:config) e ative `network.cookie.sameSite.laxByDefault`. O [Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) também tem planos de mudar seus comportamentos padrão.

{% Aside %}

Este artigo será atualizado à medida que navegadores adicionais anunciarem suporte.

{% endAside %}

### `SameSite=Lax` por default

{% Compare 'worse', 'No attribute set' %}

```text
Set-Cookie: promo_shown=1
```

{% CompareCaption %}

Se você enviar um cookie sem nenhum atributo `SameSite` especificado…

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Default behavior applied' %}

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

{% CompareCaption %}

O navegador tratará esse cookie como se `SameSite=Lax` tivesse sido especificado.

{% endCompareCaption %}

{% endCompare %}

Embora a intenção seja aplicar um padrão mais seguro, o ideal é definir um `SameSite` explícito, em vez de depender do navegador para aplicá-lo para você. Isto deixa sua intenção para o cookie explícita e aumenta as chances de uma experiência consistente em todos os navegadores.

{% Aside 'caution' %}

O comportamento default aplicado pelo Chrome é ligeiramente mais permissivo do que um `SameSite=Lax` explícito, pois permitirá que certos cookies sejam enviados em solicitações POST de nível superior. Você pode ver exatamente com isto funciona no [anúncio blink-dev](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/YKBxPCScCwAJ). Isto foi proposto como uma mitigação temporária: você deve continuar a corrigir seus cookies cross-site para usar `SameSite=None; Secure`.

{% endAside %}

### `SameSite=None` precisa ser seguro

{% Compare 'worse', 'Rejected' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None
```

{% CompareCaption %}

A configuração de um cookie sem `Secure` **será rejeitada**.

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Accepted' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

{% CompareCaption %}

Você deve garantir que `SameSite=None` seja emparelhado com o atributo `Secure`

{% endCompareCaption %}

{% endCompare %}

Você pode testar esse comportamento a partir do Chrome 76 ativando `about://flags/#cookies-without-same-site-must-be-secure` e no Firefox 69 em [`about:config`](http://kb.mozillazine.org/About:config) definindo `network.cookie.sameSite.noneRequiresSecure`.

Você vai querer aplicar esse recurso ao definir novos cookies e atualizar ativamente os cookies existentes, mesmo que eles não estejam se aproximando da data de expiração.

{% Aside 'note' %}

Se você depende de qualquer serviço que forneça conteúdo de terceiros em seu site, verifique também com o provedor se ele está atualizando seus serviços. Poderá ser necessário atualizar suas dependências ou fragmentos de código para garantir que seu site adote o novo comportamento.

{% endAside %}

Ambas as alterações são compatíveis com os navegadores que implementaram corretamente a versão anterior do atributo `SameSite` ou simplesmente não o suportam. Ao aplicar essas alterações aos seus cookies, você torna explícito o uso pretendido, em vez de confiar no comportamento padrão do navegador. Da mesma forma, qualquer cliente que ainda não reconheça `SameSite=None` deve ignorá-lo e continuar como se o atributo não tivesse sido definido.

{% Aside 'warning' %}

Várias versões mais antigas de navegadores, incluindo Chrome, Safari e navegador UC, são incompatíveis com o novo atributo `None` e podem ignorar ou restringir o cookie. Esse comportamento é corrigido nas versões atuais, mas você deve verificar seu tráfego para saber qual a proporção de seus usuários que foram afetados. Você poderá ver a [lista de clientes incompatíveis conhecidos no site do Chromium](https://www.chromium.org/updates/same-site/incompatible-clients).

{% endAside %}

## Receitas de cookies `SameSite`

Para mais detalhes sobre como atualizar seus cookies para lidar com essas mudanças de `SameSite=None` e as diferenças de comportamento em diferentes navegadores, acesse o artigo seguinte, [Receitas de cookies SameSite](/samesite-cookie-recipes).

_Muito obrigado pelas contribuições e feedback de Lily Chen, Malte Ubl, Mike West, Rob Dodson, Tom Steiner e Vivek Sekhar_

_Imagem do Cookie Hero por [Pille-Riin Priske](https://unsplash.com/photos/UiP3uF5JRWM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) no [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_
