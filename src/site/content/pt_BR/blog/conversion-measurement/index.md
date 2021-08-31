---
title: Uma forma de medir as conversões de anúncios com mais privacidade, a Event Conversion Measurement API
subhead: Uma nova API web disponível como teste de origem mede quando o clique num anúncio leva a uma conversão, sem usar identificadores entre sites (cross-site).
authors:
  - maudn
  - samdutton
hero: image/admin/wRrDtHNikUNqgdDewvYG.jpg
date: '2020-10-06'
updated: '2020-05-04'
tags:
  - blog
  - privacy
---

{% Banner 'caution', 'body' %} A Conversion Measurement API será renomeada para *Attribution Reporting API* e oferecerá mais recursos.

- Se você estiver experimentando a [Conversion Measurement API](https://github.com/WICG/conversion-measurement-api/blob/3e0ef7d3cee8d7dc5a4b953e70cb027b0e13943b/README.md) no [Chrome 91](https://chromestatus.com/features/schedule) ou menos, leia este artigo para encontrar mais detalhes, casos de uso e instruções sobre como usar a API.
- Se você estiver interessado na próxima iteração desta API (Attribution Reporting), que estará disponível para experimentação no Chrome (ensaio de origem), [participe da lista de e-mail](https://groups.google.com/u/1/a/chromium.org/g/attribution-reporting-api-dev) para ser informado de novidades sobre os experimentos disponíveis.

{% endBanner %}

Para medir a eficácia das campanhas publicitárias, os anunciantes e editores precisam saber quando um clique ou visualização no anúncio leva a uma [conversão](/digging-into-the-privacy-sandbox/#conversion), como uma compra ou inscrição. Historicamente, isto é feito com **cookies de terceiros**. Agora, a Event Conversion Measurement API permite a correlação de um evento no site de um editor com uma conversão subsequente no site de um anunciante, sem envolver mecanismos que poderiam ser usados para reconhecer um usuário entre sites.

{% Banner 'info', 'body' %} **Esta proposta precisa de seu feedback!** Se você quiser enviar comentários, [crie um issue](https://github.com/WICG/conversion-measurement-api/issues/) no repositório da proposta de API. {% endBanner %}

{% Aside %} Esta API é parte do Privacy Sandbox, uma série de propostas para satisfazer os casos de uso de terceiros sem cookies de terceiros ou outros mecanismos de rastreamento cross-site. Veja [Explorando a Privacy Sandbox](/digging-into-the-privacy-sandbox) para uma visão geral de todas as propostas. {% endAside %}

## Glossary

- **Plataformas Adtech**: empresas que fornecem software e ferramentas para permitir que marcas ou agências direcionem, entreguem e analisem sua publicidade digital.
- **Anunciantes**: empresas que pagam por publicidade.
- **Editores**: empresas que exibem anúncios em seus sites.
- **Conversão click-through**: conversão que é atribuída a um clique num anúncio.
- **Conversão view-through**: conversão que é atribuída a uma impressão de anúncio (quando o usuário não interage com o anúncio, mas posteriormente converte).

## Who needs to know about this API: adtech platforms, advertisers, and publishers

- **Plataformas Adtech**, tais como as **[plataformas de demanda,](https://en.wikipedia.org/wiki/Demand-side_platform)** provavelmente terão interesse em usar essa API para oferecer suporte à funcionalidade que atualmente depende de cookies de terceiros. Se você estiver trabalhando em sistemas de medição de conversão: [experimente rodar a demonstração](#demo), [experimente com a API](#experiment-with-the-api) e [compartilhe sua experiência](#share-your-feedback).
- **Advertisers and publishers relying on custom code for advertising or conversion measurement** may similarly be interested in using this API to replace existing techniques.
- **Anunciantes e editores que contam com plataformas adtech para publicidade ou medição de conversão** não precisam usar a API diretamente, mas a [justificativa para esta API](#why-is-this-needed) pode ser de interesse, especialmente se você estiver trabalhando com plataformas adtech que poderão integrar a API.

## API overview

### Por que ela é necessária?

Hoje, a medição de conversão de anúncios geralmente depende [de cookies de terceiros](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Third-party_cookies). **Mas os navegadores estão restringindo o acesso a eles.**

O Chrome planeja [descontinuar o suporte para cookies de terceiros](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html) e [oferece maneiras para que os usuários os bloqueiem, se desejarem](https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en). O Safari [bloqueia cookies de terceiros](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/), o Firefox [bloqueia cookies de rastreamento de terceiros conhecidos](https://blog.mozilla.org/blog/2019/09/03/todays-firefox-blocks-third-party-tracking-cookies-and-cryptomining-by-default) e o Edge [oferece prevenção de rastreamento](https://support.microsoft.com/en-us/help/4533959/microsoft-edge-learn-about-tracking-prevention?ocid=EdgePrivacySettings-TrackingPrevention).

Os cookies de terceiros estão se tornando uma solução legada. **Novas APIs criadas para fins específicos**, como esta, estão surgindo para lidar com os casos de uso resolvidos por cookies de terceiros de uma forma que preserve a privacidade dos usuários.

**How does the Event Conversion Measurement API compare to third-party cookies?**

- Ela foi **construída com um propósito** que é medir as conversões, ao contrário dos cookies. Isto, por sua vez, pode permitir que os navegadores apliquem melhores proteções de privacidade.
- Tem **mais privacidade**: ela dificulta o reconhecimento de um usuário entre dois sites de nível superior diferentes, para por exemplo vincular perfis de usuário do lado do editor e do lado do anunciante. Veja como em [Como esta API preserva a privacidade do usuário](#how-this-api-preserves-user-privacy).

### A first iteration

Esta API está num **estágio experimental inicial**. O que está disponível como um ensaio de origem é a **primeira iteração** da API. Ela pode mudar substancialmente em [iterações futuras](#use-cases) .

### Only clicks

Esta iteração da API só oferece suporte **à medição de conversões click-through**, mas a [medição de conversões view-through](https://github.com/WICG/conversion-measurement-api/blob/main/event_attribution_reporting.md) está sob incubação pública.

### How it works

<figure class="w-figure">   {% Img src="image/admin/Xn96AVosulGisR6Hoj4J.jpg", alt="Diagrama: visão geral das etapas da API de medição de conversão", width="800", height="496" %}</figure>

Esta API pode ser usada com dois tipos de links (elementos `<a>`) usados para publicidade:

- Links em um contexto **primário**, como anúncios em uma rede social ou página de resultados de busca;
- Links em um **iframe de terceiros**, como em um site de editor que usa um provedor adtech de terceiros.

Com esta API, esses links externos podem ser configurados com atributos que são específicos para conversões de anúncios:

- Custom data to attach to an ad click on the publisher's side, for example a click ID or campaign ID.
- The website for which a conversion is expected for this ad.
- The reporting endpoint that should be notified of successful conversions.
- A data e hora de corte para quando as conversões não puderem mais ser contadas para este anúncio.

Quando o usuário clica num anúncio, o navegador - no dispositivo local do usuário - registra esse evento, junto com a configuração de conversão e os dados de clique especificados pelos atributos de Mensuração de Conversão no elemento `<a>`

Posteriormente, o usuário pode visitar o site do anunciante e executar uma ação que o anunciante ou seu provedor de adtech categoriza como uma **conversão**. Se isto acontecer, o clique no anúncio e o evento de conversão serão correspondidos pelo navegador do usuário.

O navegador finalmente programa um **relatório de conversão** a ser enviado ao endpoint especificado nos atributos do elemento `<a>`. Este relatório inclui dados sobre o clique no anúncio que levou a essa conversão, bem como dados sobre a conversão.

If several conversions are registered for a given ad click, as many corresponding reports are scheduled to be sent (up to a maximum of three per ad click).

Os relatórios são enviados após um atraso: dias ou às vezes semanas após a conversão (veja o porquê em [Programação de relatórios](#report-timing) ).

## Suporte dos navegadores e APIs semelhantes

### Suporte dos navegadores

A API Event Conversion Measurement pode ser suportada:

- Como [ensaio de origem](/origin-trials/). Os ensaios de origem habilitam a API para **todos os visitantes** de uma determinada [origem](/same-site-same-origin/#origin). **Você precisa registrar sua origem para o ensaio de origem para testar a API com os usuários finais**. Veja [Usando a API de medição de conversão](/using-conversion-measurement) para detalhes sobre o ensaio de origem.
- Ativando sinalizadores (flags), no Chrome 86 e posterior. Os sinalizadores habilitam a API no navegador de **um único usuário.** **Os sinalizadores são úteis ao desenvolver localmente**.

Veja os detalhes sobre o status atual na [Chrome feature entry](https://chromestatus.com/features/6412002824028160).

### Padronização

Esta API está sendo desenvolvida de forma aberta, no Web Platform Incubator Community Group ([WICG](https://www.w3.org/community/wicg/)). Ela está disponível para experimentação no Chrome.

### Similar APIs

O WebKit, mecanismo de navegador usado pelo Safari, tem uma proposta com objetivos semelhantes, a [Private Click Measurement](https://github.com/privacycg/private-click-measurement). Ela está sendo desenvolvida no Privacy Community Group ([PrivacyCG](https://www.w3.org/community/privacycg/)).

## How this API preserves user privacy

Com esta API, as conversões podem ser medidas ao mesmo tempo em que protege a privacidade dos usuários: os usuários não podem ser reconhecidos nos sites. Isto é possível devido a **limites de dados**, **introdução de ruído em dados de conversão** e mecanismos de **programação de relatórios.**

Let's take a closer look at how these mechanisms work, and what they mean in practice.

### Data limits

A seguir, os dados de **tempo de clique (click-time) ou tempo de visualização (view-time)** são dados disponíveis para `adtech.example` quando o anúncio é servido para o usuário e, em seguida, clicado ou visualizado. Os dados de quando uma conversão aconteceu são **dados do tempo de conversão (conversion-time)**.

Vejamos um **editor** `news.example` e um **anunciante** `shoes.example`. Scripts de terceiros da **plataforma adtech** `adtech.example` estão presentes no site do editor `news.example` para incluir anúncios para o anunciante `shoes.example`. `shoes.example` inclui `adtech.example` também, para detectar conversões.

How much can `adtech.example` learn about web users?

#### With third-party cookies

<figure class="w-figure">   {% Img src="image/admin/kRpuY2r7ZSPtADz7e1P5.jpg", alt="Diagrama: como cookies de terceiros permitem o reconhecimento de usuário entre sites", width="800", height="860" %}</figure>

`adtech.example` depende de um **cookie de terceiros usado como identificador único entre sites** para **reconhecer um usuário entre sites**. Além disso, `adtech.example` pode acessar **ambos** os tipos de dados em detalhes: tempo de clique (click-time) ou de visualização (view-time) e tempo de conversão (conversion-time), e vinculá-los.

Como resultado, `adtech.example` pode rastrear o comportamento de um único usuário nos sites, entre uma exibição do anúncio, clique e conversão.

Como `adtech.example` está provavelmente presente num grande número de sites de editores e anunciantes, e não apenas em `news.example` e `shoes.example`, o comportamento de um  usuário pode ser rastreado por toda a web.

#### With the Event Conversion Measurement API

<figure class="w-figure">{% Img src="image/admin/X6sfyeKGncVm0LJSYJva.jpg", alt="Diagrama: como a API permite a medição de conversão sem reconhecimento de usuário entre sites", width="800", height="643" %} <figcaption class="w-figcaption">"Ad ID" no diagrama de cookies e "Click ID" são ambos identificadores que permitem o mapeamento para dados detalhados. Neste diagrama, é chamado de "Click ID" porque ele suporta apenas a medição de conversão do tipo click-through.</figcaption></figure>

`adtech.example` não pode usar um identificador cross-site e, portanto, **não é capaz de reconhecer um usuário entre sites**.

- A 64 bit-identifier can be attached to an ad click.
- Apenas 3 bits de dados de conversão podem ser anexados ao evento de conversão. 3 bits podem ajustar um valor inteiro de 0 a 7. Isto não é muito, mas é o suficiente para que os anunciantes possam aprender como tomar boas decisões sobre onde gastar seu orçamento de publicidade no futuro (por exemplo, treinando modelos de dados).

{% Aside %} The click data and conversion data are never exposed to a JavaScript environment in the same context. {% endAside %}

#### Without an alternative to third-party cookies

Sem uma alternativa para cookies de terceiros, como a Event Conversion Measurement API, as conversões não podem ser atribuídas: se `adtech.example` estiver presente no site do editor e do anunciante, ele pode acessar os dados de tempo de clique (click-time) ou de conversão (conversion-time), mas não pode vinculá-los de forma alguma.

In this case, user privacy is preserved but advertisers can't optimize their ad spend. This is why an alternative like the Event Conversion Measurement API is needed.

### Introdução de ruído em dados de conversão

Os 3 bits coletados no momento da conversão são **ruídos**.

For example, in Chrome's implementation, data noising works as follows: 5% of the time, the API reports a random 3-bit value instead of the actual conversion data.

Isto protege os usuários de ataques de privacidade. Um ator que tenta usar indevidamente os dados de várias conversões para criar um identificador não terá total confiança nos dados que recebe - tornando esses tipos de ataques mais complicados.

Observe que é possível [recuperar a contagem de conversões verdadeira](/using-conversion-measurement/#(optional)-recover-the-corrected-conversion-count).

A tabela a seguir resume os dados de clique (click-data) e de conversão (conversion-data):

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th>Data</th>
        <th>Size</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Click data (<code>impressiondata</code> attribute)</td>
        <td>64 bits</td>
        <td>An ad ID or click ID</td>
      </tr>
      <tr>
        <td>Conversion data</td>
        <td>3 bits, noised</td>
        <td>Um número inteiro de 0 a 7 que pode ser mapeado para um tipo de conversão: inscrição, checkout completo, etc.</td>
      </tr>
    </tbody>
  </table>
</div>

### Programação de relatórios

Se várias conversões forem registradas para um determinado clique de anúncio, **um relatório correspondente é enviado para cada conversão, até um máximo de três por clique** .

Para evitar que o tempo de conversão seja usado para obter mais informações do lado da conversão e, portanto, prejudicar a privacidade dos usuários, esta API especifica que os relatórios de conversão não são enviados imediatamente após a ocorrência de uma conversão. Após o clique inicial no anúncio, é iniciada uma programação de **janelas de relatório** associadas a esse clique. Cada janela de relatório tem um prazo, e as conversões registradas antes desse prazo serão enviadas ao final dessa janela.

Reports may not be exactly sent at these scheduled dates and times: if the browser isn't running when a report is scheduled to be sent, the report is sent at browser startup—which could be days or weeks after the scheduled time.

Após a expiração (tempo de clique + `impressionexpiry`), nenhuma conversão é contada — `impressionexpiry` é a data e hora de corte depois da qual as conversões não podem mais ser contadas para este anúncio.

In Chrome, report scheduling works as follows:

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th><code>impressionexpiry</code></th>
        <th>Depending on conversion time, a conversion report is sent (if the browser is open)...</th>
        <th>Number of reporting windows</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>30 dias, o valor default e máximo</td>
        <td>
          <ul>
            <li>2 days after the ad was clicked</li>
            <li>or 7 days after ad click</li>
            <li>or <code>impressionexpiry</code> = 30 days after ad click.</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> is between 7 and 30 days</td>
        <td>
          <ul>
            <li>2 days after ad click</li>
            <li>or 7 days after ad click</li>
            <li>or <code>impressionexpiry</code> after ad click.</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> is between 2 and 7 days</td>
        <td>
          <ul>
            <li>2 days after ad click</li>
            <li>or <code>impressionexpiry</code> after ad click.</li>
          </ul>
        </td>
        <td>2</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> is under 2 days</td>
        <td>
          <li>2 days after ad click</li>
        </td>
        <td>1</td>
      </tr>
    </tbody>
  </table>
</div>

<figure class="w-figure">   {% Img src="image/admin/bgkpW6Nuqs5q1ddyMG8X.jpg", alt="Cronologia de quais relatórios são enviados quando", width="800", height="462" %}</figure>

Consulte [Envio de relatórios programados](https://github.com/WICG/conversion-measurement-api#sending-scheduled-reports) para obter mais detalhes sobre a programação.

## Example

{% Banner 'info', 'body' %} Para ver este exemplo em ação, experimente a [demo](https://goo.gle/demo-event-level-conversion-measurement-api) ⚡️ e veja o [código](https://github.com/GoogleChromeLabs/trust-safety-demo/tree/main/conversion-measurement) correspondente. {% endBanner %}

Veja como a API registra e relata uma conversão. Observe que é dessa forma que um fluxo click-to-convert funcionaria com a API atual. As iterações futuras desta API [podem ser diferentes](#use-cases) .

### Ad click (steps 1 to 5)

<figure class="w-figure">{% Img src="image/admin/FvbacJL6u37XHuvQuUuO.jpg", alt="Diagrama: clique no anúncio e armazenamento de cliques", width="800", height="694" %}</figure>

Um elemento `<a>` de anúncio é carregado no site de um editor por `adtech.example` dentro de um iframe.

Os desenvolvedores da plataforma adtech configuraram o elemento `<a>` com atributos de mensuração de conversão:

```html
<a
  id="ad"
  impressiondata="200400600"
  conversiondestination="https://advertiser.example"
  reportingorigin="https://adtech.example"
  impressionexpiry="864000000"
  href="https://advertiser.example/shoes07"
>
  <img src="/images/shoe.jpg" alt="shoe" />
</a>
```

This code specifies the following:

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th>Attribute</th>
        <th>Default value, maximum, minimum</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>impressiondata</code> (required): a <b>64-bit</b> identifier to attach to an ad click.</td>
        <td>(no default)</td>
        <td>A dynamically generated click ID  such as a 64-bit integer:           <code>200400600</code>         </td>
      </tr>
      <tr>
        <td>
<code>conversiondestination</code> (required): the <b><a href="/same-site-same-origin/#site" noopener="">eTLD+1</a></b> where a conversion is expected for this ad.</td>
        <td>(nenhum default)</td>
        <td>
<code>https://advertiser.example</code>.<br> Se o <code>conversiondestination</code> for <code>https://advertiser.example</code>, as conversões em <code>https://advertiser.example</code> e <code>https://shop.advertiser.example</code> serão atribuídas.<br> O mesmo acontece se o <code>conversiondestination</code> for <code>https://shop.advertiser.example</code>: serão atribuídas conversões em <code>https://advertiser.example</code> e <code>https://shop.advertiser.example</code>
</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> (optional): in milliseconds, the cutoff time for when conversions can be attributed to this ad.</td>
        <td>           <code>2592000000</code> = 30 days (in milliseconds).<br><br>           Maximum: 30 days (in milliseconds).<br><br>           Minimum: 2 days (in milliseconds).         </td>
        <td>Ten days after click: <code>864000000</code>
</td>
      </tr>
      <tr>
        <td>
<code>reportingorigin</code> (optional): the destination for reporting confirmed conversions.</td>
        <td>Top-level origin of the page where the link element is added.</td>
        <td><code>https://adtech.example</code></td>
      </tr>
      <tr>
        <td>
<code>href</code>: the intended destination of the ad click.</td>
        <td><code>/</code></td>
        <td><code>https://advertiser.example/shoes07</code></td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} Algumas observações sobre o exemplo:

- Você encontrará o termo "impression" usado nos atributos da API ou na proposta da API, embora apenas cliques sejam suportados por enquanto. Os nomes podem ser atualizados em iterações futuras da API.
- O anúncio não precisa estar num iframe, mas é nisto que este exemplo se baseia.

{% endAside %}

{% Aside 'gotchas' %}

- Flows based on navigating via `window.open` or `window.location` won't be eligible for attribution.

{% endAside %}

Quando o usuário toca ou clica no anúncio, ele navega até o site do anunciante. Depois que a navegação é confirmada, o navegador armazena um objeto que inclui `impressiondata`, `conversiondestination`, `reportingorigin` e `impressionexpiry`:

```json
{
  "impression-data": "200400600",
  "conversion-destination": "https://advertiser.example",
  "reporting-origin": "https://adtech.example",
  "impression-expiry": 864000000
}
```

### Conversion and report scheduling (steps 6 to 9)

<figure class="w-figure">   {% Img src="image/admin/2fFVvAwyiXSaSDp8XVXo.jpg", alt="Diagrama: conversão e programação de relatório", width="800", height="639" %}</figure>

Logo depois de clicar no anúncio ou mais tarde - por exemplo, no dia seguinte - o usuário visita o `advertiser.example`, procura por calçados esportivos, encontra um par que deseja comprar e prossegue com a finalização da compra. O `advertiser.example` incluiu um pixel na página de checkout:

```html
<img
  height="1"
  width="1"
  src="https://adtech.example/conversion?model=shoe07&type=checkout&…"
/>
```

`adtech.example` recebe essa solicitação e decide que ela se qualifica como uma conversão. Eles agora precisam solicitar ao navegador para registrar uma conversão. `adtech.example` compacta todos os dados de conversão em 3 bits - um número inteiro entre 0 e 7. Por exemplo, eles podem mapear uma ação de **Checkout** para um valor de conversão de 2.

`adtech.example` then sends a specific register-conversion redirect to the browser:

```js
const conversionValues = {
  signup: 1,
  checkout: 2,
};

app.get('/conversion', (req, res) => {
  const conversionData = conversionValues[req.query.conversiontype];
  res.redirect(
    302,
    `/.well-known/register-conversion?conversion-data=${conversionData}`,
  );
});
```

{% Aside %} URLs `.well-known` são URLs especiais. Elas ajudam as ferramentas de software e servidores descobrirem informações ou recursos que são frequentemente necessários para um site, por exemplo, a página na qual um usuário pode [alterar sua senha](/change-password-url/). Aqui, `.well-known` é usado apenas para que o navegador reconheça isso como uma solicitação de conversão especial. Na verdade, essa solicitação é cancelada internamente pelo navegador. {% endAside %}

O navegador recebe esta solicitação. Ao detectar a `.well-known/register-conversion`, o navegador:

- Pesquisa todos os cliques em anúncios no armazenamento que correspondem a este `conversiondestination` (porque está recebendo essa conversão em uma URL que foi registrada como uma `conversiondestination` quando o usuário clicou no anúncio). Ele encontra o clique do anúncio que ocorreu no site do editor um dia antes.
- Registers a conversion for this ad click.

Vários cliques no anúncio podem corresponder a uma conversão: o usuário pode ter clicado num anúncio para `shoes.example` em ambos `news.example` e `weather.example`. Neste caso, várias conversões são registradas.

Agora, o navegador sabe que precisa informar o servidor adtech sobre essa conversão - mais especificamente, o navegador precisa informar a origem do `reportingorigin` que é especificada no elemento `<a>` e na solicitação do pixel (`adtech.example`).

Para isto, o navegador programa o envio de um **relatório de conversão**, um blob de dados contendo os dados de clique (do site do editor) e os dados de conversão (do site do anunciante). Para este exemplo, o usuário converteu um clique no dia seguinte. Portanto, o relatório está programado para ser enviado no dia seguinte, na marca de dois dias após o clique, se o navegador estiver em execução.

### Sending the report (steps 10 and 11)

<figure class="w-figure">   {% Img src="image/admin/Er48gVzK5gHUGdDHWHz1.jpg", alt="Diagrama: navegador enviando o relatório", width="800", height="533" %}</figure>

Uma vez atingido o horário programado para enviar o relatório, o navegador envia o **relatório de conversão**: ele envia um HTTP POST para a origem do relatório que foi especificada no elemento `<a>` `adtech.example`). Por exemplo:

`https://adtech.example/.well-known/register-conversion?impression-data=200400600&conversion-data=2&credit=100`

Included as parameters are:

- The data associated with the original ad click (`impression-data`).
- The data associated with a conversion, [potentially noised](#noising-of-conversion-data).
- O crédito de conversão atribuído ao clique. Esta API segue um modelo de atribuição de **último clique**: o clique em anúncio correspondente mais recente recebe um crédito de 100; todos os outros cliques em anúncios correspondentes recebem um crédito de 0.

Conforme o servidor adtech recebe essa solicitação, ele pode extrair os `impression-data` e `conversion-data`, ou seja, o relatório de conversão:

```json
{"impression-data": "200400600", "conversion-data": 3, "credit": 100}
```

### Subsequent conversions and expiry

Mais tarde, o usuário pode converter novamente - por exemplo, comprando uma raquete de tênis no `advertiser.example`. Um fluxo semelhante acontece:

- The adtech server sends a conversion request to the browser.
- The browser matches this conversion with the ad click, schedules a report, and sends it to the adtech server later on.

Após a `impressionexpiry`, as conversões para esse clique no anúncio param de ser contadas e o clique no anúncio é excluído do armazenamento do navegador.

## Use cases

### What is currently supported

- Mensuração das conversões de clique: determine quais cliques em anúncios levam a conversões e acesse informações gerais sobre a conversão.
- Obtenção de dados para otimizar a seleção de anúncios, por exemplo, treinando modelos de aprendizado de máquina.

### What is not supported in this iteration

The following features aren't supported, but may be in future iterations of this API, or in [Aggregate](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md) reports:

- Mensuração de conversão do tipo view-through.
- [Múltiplos endpoints de relatório](https://github.com/WICG/conversion-measurement-api/issues/29).
- [Conversões web que começam em aplicativo iOS/Android](https://github.com/WICG/conversion-measurement-api/issues/54) .
- Conversion lift measurement / incrementality: measurement of causal differences in conversion behavior, by measuring the difference between a test group that saw an ad and a control group that didn't.
- Modelos de atribuição que não são de último clique (last-click).
- Use cases that require larger amounts of information about the conversion event. For example, granular purchase values or product categories.

Before these features and more can be supported, **more privacy protections** (noise, fewer bits, or other limitations) must be added to the API.

A discussão de possíveis recursos adicionais ocorre de forma aberta, no [repositório de propostas de **issues**](https://github.com/WICG/conversion-measurement-api/issues) da API.

{% Aside %} Seu caso de uso está faltando? Você tem comentários sobre a API? [Compartilhe](#share-your-feedback). {% endAside %}

### What else may change in future iterations

- Esta API está em um estágio experimental inicial. Em iterações futuras, esta API poderá sofrer alterações substanciais, incluindo, mas não se limitando às listadas abaixo. Seu objetivo é medir as conversões e, ao mesmo tempo, preservar a privacidade do usuário, e qualquer mudança que ajude a lidar melhor com esse caso de uso será feita.
- API and attribute naming may evolve.
- Click data and conversion data may not require encoding.
- The 3-bit limit for conversion data may be increased or decreased.
- [Mais recursos podem ser adicionados](#what-is-not-supported-in-this-iteration) e **mais proteções de privacidade** (ruído / menos bits / outras limitações) se forem necessários para oferecer suporte a esses novos recursos.

Para acompanhar e participar de discussões sobre novos recursos, acompanhe o [repositório GitHub](https://github.com/WICG/conversion-measurement-api/issues) da proposta e envie ideias.

## Try it out

### Demo

Experimente a [demo](https://goo.gle/demo-event-level-conversion-measurement-api). Certifique-se de seguir as instruções "Antes de começar".

Envie tweets para [@maudnals](https://twitter.com/maudnals?lang=en) ou [@ChromiumDev](https://twitter.com/ChromiumDev) com qualquer pergunta sobre a demo!

### Experimente a API

Se você planeja experimentar a API (localmente ou com usuários finais), consulte [Usando a API de mensuração de conversão](/using-conversion-measurement).

### Share your feedback

**Your feedback is crucial**, so that new conversion measurement APIs can support your use cases and provide a good developer experience.

- Para relatar um bug na implementação do Chrome, [registre um bug](https://bugs.chromium.org/p/chromium/issues/entry?status=Unconfirmed&components=Internals%3EConversionMeasurement&description=Chrome%20Version%3A%20%28copy%20from%20chrome%3A%2F%2Fversion%29%0AOS%3A%20%28e.g.%20Win10%2C%20MacOS%2010.12%2C%20etc...%29%0AURLs%20%28if%20applicable%29%20%3A%0A%0AWhat%20steps%20will%20reproduce%20the%20problem%3F%0A%281%29%0A%282%29%0A%283%29%0A%0AWhat%20is%20the%20expected%20result%3F%0A%0A%0AWhat%20happens%20instead%3F%0A%0AIf%20applicable%2C%20include%20screenshots%2Finfo%20from%20chrome%3A%2F%2Fconversion-internals%20or%20relevant%20devtools%20errors.%0A) .
- Para compartilhar feedback e discutir casos de uso na API do Chrome, crie um novo issue ou envolva-se com os issues existentes no [repositório de propostas de API](https://github.com/WICG/conversion-measurement-api/issues). Da mesma forma, você pode discutir a API WebKit/Safari e seus casos de uso no [repositório de propostas de API](https://github.com/privacycg/private-click-measurement/issues) .
- Para discutir casos de uso de publicidade e discutir visões com especialistas do setor: participe do [Improving Web Advertising Business Group](https://www.w3.org/community/web-adv/). Participe do [Privacy Community Group](https://www.w3.org/community/privacycg/) para discussões sobre a API WebKit/Safari.

### Keep an eye out

- À medida em que recebemos feedback dos desenvolvedores e os casos de uso, a API Event Conversion Measurement irá evoluir com o tempo. Acompanhe o [repositório GitHub](https://github.com/WICG/conversion-measurement-api/) da proposta.
- Follow along the evolution of the [Aggregate Conversion Measurement API](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md) that will complement this API.

*With many thanks for contributions and feedback to all reviewers—especially Charlie Harrison, John Delaney, Michael Kleber and Kayce Basques.*

*Imagem hero por William Warby / @wawarby em [Unsplash](https://unsplash.com/photos/WahfNoqbYnM), editada.*
