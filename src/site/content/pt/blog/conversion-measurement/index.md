---
title: Uma forma de medir as conversões de anúncios com mais privacidade, a Event Conversion Measurement API
subhead: Uma nova API web disponível como teste de origem mede quando o clique num anúncio leva a uma conversão, sem usar identificadores entre sites (cross-site).
authors:
  - maudn
  - samdutton
hero: image/admin/wRrDtHNikUNqgdDewvYG.jpg
date: 2020-10-06
updated: 2020-05-04
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

## Glossário

- **Plataformas Adtech**: empresas que fornecem software e ferramentas para permitir que marcas ou agências direcionem, entreguem e analisem sua publicidade digital.
- **Anunciantes**: empresas que pagam por publicidade.
- **Editores**: empresas que exibem anúncios em seus sites.
- **Conversão click-through**: conversão que é atribuída a um clique num anúncio.
- **Conversão view-through**: conversão que é atribuída a uma impressão de anúncio (quando o usuário não interage com o anúncio, mas posteriormente converte).

## Quem precisa saber sobre esta API: plataformas adtech, anunciantes e editores

- **Plataformas Adtech**, tais como as **[plataformas de demanda,](https://en.wikipedia.org/wiki/Demand-side_platform)** provavelmente terão interesse em usar essa API para oferecer suporte à funcionalidade que atualmente depende de cookies de terceiros. Se você estiver trabalhando em sistemas de medição de conversão: [experimente rodar a demonstração](#demo), [experimente com a API](#experiment-with-the-api) e [compartilhe sua experiência](#share-your-feedback).
- **Anunciantes e editores que dependem de código personalizado para publicidade ou medição de conversão** podem, da mesma forma, estar interessados em usar essa API para substituir as técnicas existentes.
- **Anunciantes e editores que contam com plataformas adtech para publicidade ou medição de conversão** não precisam usar a API diretamente, mas a [justificativa para esta API](#why-is-this-needed) pode ser de interesse, especialmente se você estiver trabalhando com plataformas adtech que poderão integrar a API.

## Visão geral da API

### Por que ela é necessária?

Hoje, a medição de conversão de anúncios geralmente depende [de cookies de terceiros](https://developer.mozilla.org/docs/Web/HTTP/Cookies#Third-party_cookies). **Mas os navegadores estão restringindo o acesso a eles.**

O Chrome planeja [descontinuar o suporte para cookies de terceiros](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html) e [oferece maneiras para que os usuários os bloqueiem, se desejarem](https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en). O Safari [bloqueia cookies de terceiros](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/), o Firefox [bloqueia cookies de rastreamento de terceiros conhecidos](https://blog.mozilla.org/blog/2019/09/03/todays-firefox-blocks-third-party-tracking-cookies-and-cryptomining-by-default) e o Edge [oferece prevenção de rastreamento](https://support.microsoft.com/en-us/help/4533959/microsoft-edge-learn-about-tracking-prevention?ocid=EdgePrivacySettings-TrackingPrevention).

Os cookies de terceiros estão se tornando uma solução legada. **Novas APIs criadas para fins específicos**, como esta, estão surgindo para lidar com os casos de uso resolvidos por cookies de terceiros de uma forma que preserve a privacidade dos usuários.

**Como a Event Conversion Measurement API se compara aos cookies de terceiros?**

- Ela foi **construída com um propósito** que é medir as conversões, ao contrário dos cookies. Isto, por sua vez, pode permitir que os navegadores apliquem melhores proteções de privacidade.
- Tem **mais privacidade**: ela dificulta o reconhecimento de um usuário entre dois sites de nível superior diferentes, para por exemplo vincular perfis de usuário do lado do editor e do lado do anunciante. Veja como em [Como esta API preserva a privacidade do usuário](#how-this-api-preserves-user-privacy).

### Uma primeira iteração

Esta API está num **estágio experimental inicial**. O que está disponível como um ensaio de origem é a **primeira iteração** da API. Ela pode mudar substancialmente em [iterações futuras](#use-cases) .

### Apenas cliques

Esta iteração da API só oferece suporte **à medição de conversões click-through**, mas a [medição de conversões view-through](https://github.com/WICG/conversion-measurement-api/blob/main/event_attribution_reporting.md) está sob incubação pública.

### Como funciona

<figure class="w-figure">
  {% Img src="image/admin/Xn96AVosulGisR6Hoj4J.jpg", alt="Diagrama: visão geral das etapas da API de medição de conversão", width="800", height="496" %}
</figure>

Esta API pode ser usada com dois tipos de links (elementos `<a>`) usados para publicidade:

- Links em um contexto **primário**, como anúncios em uma rede social ou página de resultados de busca;
- Links em um **iframe de terceiros**, como em um site de editor que usa um provedor adtech de terceiros.

Com esta API, esses links externos podem ser configurados com atributos que são específicos para conversões de anúncios:

- Dados personalizados para anexar a um clique de anúncio no lado do editor, por exemplo, um ID de clique ou ID de campanha.
- O site para o qual uma conversão é esperada para este anúncio.
- O endpoint de relatório que deve ser notificado sobre conversões bem-sucedidas.
- A data e hora de corte para quando as conversões não puderem mais ser contadas para este anúncio.

Quando o usuário clica num anúncio, o navegador - no dispositivo local do usuário - registra esse evento, junto com a configuração de conversão e os dados de clique especificados pelos atributos de Mensuração de Conversão no elemento `<a>`

Posteriormente, o usuário pode visitar o site do anunciante e executar uma ação que o anunciante ou seu provedor de adtech categoriza como uma **conversão**. Se isto acontecer, o clique no anúncio e o evento de conversão serão correspondidos pelo navegador do usuário.

O navegador finalmente programa um **relatório de conversão** a ser enviado ao endpoint especificado nos atributos do elemento `<a>`. Este relatório inclui dados sobre o clique no anúncio que levou a essa conversão, bem como dados sobre a conversão.

Se várias conversões forem registradas para um determinado clique no anúncio, tantos relatórios correspondentes serão programados para serem enviados (até no máximo três por clique no anúncio).

Os relatórios são enviados após um atraso: dias ou às vezes semanas após a conversão (veja o porquê em [Programação de relatórios](#report-timing) ).

## Suporte dos navegadores e APIs semelhantes

### Suporte dos navegadores

A API Event Conversion Measurement pode ser suportada:

- Como [ensaio de origem](/origin-trials/). Os ensaios de origem habilitam a API para **todos os visitantes** de uma determinada [origem](/same-site-same-origin/#origin). **Você precisa registrar sua origem para o ensaio de origem para testar a API com os usuários finais**. Veja [Usando a API de medição de conversão](/using-conversion-measurement) para detalhes sobre o ensaio de origem.
- Ativando sinalizadores (flags), no Chrome 86 e posterior. Os sinalizadores habilitam a API no navegador de **um único usuário.** **Os sinalizadores são úteis ao desenvolver localmente**.

Veja os detalhes sobre o status atual na [Chrome feature entry](https://chromestatus.com/features/6412002824028160).

### Padronização

Esta API está sendo desenvolvida de forma aberta, no Web Platform Incubator Community Group ([WICG](https://www.w3.org/community/wicg/)). Ela está disponível para experimentação no Chrome.

### APIs semelhantes

O WebKit, mecanismo de navegador usado pelo Safari, tem uma proposta com objetivos semelhantes, a [Private Click Measurement](https://github.com/privacycg/private-click-measurement). Ela está sendo desenvolvida no Privacy Community Group ([PrivacyCG](https://www.w3.org/community/privacycg/)).

## Como esta API preserva a privacidade do usuário

Com esta API, as conversões podem ser medidas ao mesmo tempo em que protege a privacidade dos usuários: os usuários não podem ser reconhecidos nos sites. Isto é possível devido a **limites de dados**, **introdução de ruído em dados de conversão** e mecanismos de **programação de relatórios.**

Vamos dar uma olhada mais de perto em como esses mecanismos funcionam e o que eles significam na prática.

### Limites de dados

A seguir, os dados de **tempo de clique (click-time) ou tempo de visualização (view-time)** são dados disponíveis para `adtech.example` quando o anúncio é servido para o usuário e, em seguida, clicado ou visualizado. Os dados de quando uma conversão aconteceu são **dados do tempo de conversão (conversion-time)**.

Vejamos um **editor** `news.example` e um **anunciante** `shoes.example`. Scripts de terceiros da **plataforma adtech** `adtech.example` estão presentes no site do editor `news.example` para incluir anúncios para o anunciante `shoes.example`. `shoes.example` inclui `adtech.example` também, para detectar conversões.

Quanto `adtech.example` pode aprender sobre os usuários da web?

#### Com cookies de terceiros

<figure class="w-figure">
  {% Img src="image/admin/kRpuY2r7ZSPtADz7e1P5.jpg", alt="Diagrama: como cookies de terceiros permitem o reconhecimento de usuário entre sites", width="800", height="860" %}
</figure>

`adtech.example` depende de um **cookie de terceiros usado como identificador único entre sites** para **reconhecer um usuário entre sites**. Além disso, `adtech.example` pode acessar **ambos** os tipos de dados em detalhes: tempo de clique (click-time) ou de visualização (view-time) e tempo de conversão (conversion-time), e vinculá-los.

Como resultado, `adtech.example` pode rastrear o comportamento de um único usuário nos sites, entre uma exibição do anúncio, clique e conversão.

Como `adtech.example` está provavelmente presente num grande número de sites de editores e anunciantes, e não apenas em `news.example` e `shoes.example`, o comportamento de um  usuário pode ser rastreado por toda a web.

#### Com a API Event Conversion Measurement

<figure class="w-figure">
  {% Img src="image/admin/X6sfyeKGncVm0LJSYJva.jpg", alt="Diagrama: como a API permite a medição de conversão sem reconhecimento de usuário entre sites", width="800", height="643" %}
  <figcaption class="w-figcaption">"Ad ID" no diagrama de cookies e "Click ID" são ambos identificadores que permitem o mapeamento para dados detalhados. Neste diagrama, é chamado de "Click ID" porque ele suporta apenas a medição de conversão do tipo click-through.</figcaption>
</figure>

`adtech.example` não pode usar um identificador cross-site e, portanto, **não é capaz de reconhecer um usuário entre sites**.

- Um identificador de 64 bits pode ser anexado a um clique no anúncio.
- Apenas 3 bits de dados de conversão podem ser anexados ao evento de conversão. 3 bits podem ajustar um valor inteiro de 0 a 7. Isto não é muito, mas é o suficiente para que os anunciantes possam aprender como tomar boas decisões sobre onde gastar seu orçamento de publicidade no futuro (por exemplo, treinando modelos de dados).

{% Aside %} Os dados de clique e de conversão nunca são expostos a um ambiente JavaScript no mesmo contexto. {% endAside %}

#### Sem uma alternativa aos cookies de terceiros

Sem uma alternativa para cookies de terceiros, como a Event Conversion Measurement API, as conversões não podem ser atribuídas: se `adtech.example` estiver presente no site do editor e do anunciante, ele pode acessar os dados de tempo de clique (click-time) ou de conversão (conversion-time), mas não pode vinculá-los de forma alguma.

Nesse caso, a privacidade do usuário é preservada, mas os anunciantes não podem otimizar seus gastos com publicidade. É por isso que uma alternativa como a Event Conversion Measurement API é necessária.

### Introdução de ruído em dados de conversão

Os 3 bits coletados no momento da conversão são **ruídos**.

Por exemplo, na implementação do Chrome, o ruído de dados funciona da seguinte maneira: 5% do tempo, a API relata um valor aleatório de 3 bits em vez dos dados de conversão reais.

Isto protege os usuários de ataques de privacidade. Um ator que tenta usar indevidamente os dados de várias conversões para criar um identificador não terá total confiança nos dados que recebe - tornando esses tipos de ataques mais complicados.

Observe que é possível [recuperar a contagem de conversões verdadeira](/using-conversion-measurement/#(optional)-recover-the-corrected-conversion-count).

A tabela a seguir resume os dados de clique (click-data) e de conversão (conversion-data):

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th>Dados</th>
        <th>Tamanho</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dados de clique (atributo <code>impressiondata</code>
</td>
        <td>64 bits</td>
        <td>Um ID de anúncio ou ID de clique</td>
      </tr>
      <tr>
        <td>Dados de conversão</td>
        <td>3 bits, com ruído</td>
        <td>Um número inteiro de 0 a 7 que pode ser mapeado para um tipo de conversão: inscrição, checkout completo, etc.</td>
      </tr>
    </tbody>
  </table>
</div>

### Programação de relatórios

Se várias conversões forem registradas para um determinado clique de anúncio, **um relatório correspondente é enviado para cada conversão, até um máximo de três por clique** .

Para evitar que o tempo de conversão seja usado para obter mais informações do lado da conversão e, portanto, prejudicar a privacidade dos usuários, esta API especifica que os relatórios de conversão não são enviados imediatamente após a ocorrência de uma conversão. Após o clique inicial no anúncio, é iniciada uma programação de **janelas de relatório** associadas a esse clique. Cada janela de relatório tem um prazo, e as conversões registradas antes desse prazo serão enviadas ao final dessa janela.

Os relatórios podem não ser enviados exatamente nessas datas e horários programados: se o navegador não estiver em execução quando um relatório estiver programado para ser enviado, o relatório será enviado na inicialização do navegador - o que pode ocorrer dias ou semanas após o horário programado.

Após a expiração (tempo de clique + `impressionexpiry`), nenhuma conversão é contada`impressionexpiry` é a data e hora de corte depois da qual as conversões não podem mais ser contadas para este anúncio.

No Chrome, a programação de relatórios funciona da seguinte maneira:

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th><code>impressionexpiry</code></th>
        <th>Dependendo do tempo de conversão, um relatório de conversão é enviado (se o navegador estiver aberto) ...</th>
        <th>Número de janelas de relatórios</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>30 dias, o valor default e máximo</td>
        <td>
          <ul>
            <li>2 dias depois que o anúncio foi clicado</li>
            <li>ou 7 dias após o clique no anúncio</li>
            <li>ou <code>impressionexpiry</code> = 30 dias após o clique no anúncio.</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> é entre 7 e 30 dias</td>
        <td>
          <ul>
            <li>2 dias após o clique no anúncio</li>
            <li>ou 7 dias após o clique no anúncio</li>
            <li>ou <code>impressionexpiry</code> após o clique no anúncio.</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> é entre 2 e 7 dias</td>
        <td>
          <ul>
            <li>2 dias após o clique no anúncio</li>
            <li>ou <code>impressionexpiry</code> após o clique no anúncio.</li>
          </ul>
        </td>
        <td>2</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> é inferior a 2 dias</td>
        <td>
          <li>2 dias após o clique no anúncio</li>
        </td>
        <td>1</td>
      </tr>
    </tbody>
  </table>
</div>

<figure class="w-figure">
  {% Img src="image/admin/bgkpW6Nuqs5q1ddyMG8X.jpg", alt="Cronologia de quais relatórios são enviados quando", width="800", height="462" %}
</figure>

Consulte [Envio de relatórios programados](https://github.com/WICG/conversion-measurement-api#sending-scheduled-reports) para obter mais detalhes sobre a programação.

## Exemplo

{% Banner 'info', 'body' %} Para ver este exemplo em ação, experimente a [demo](https://goo.gle/demo-event-level-conversion-measurement-api) ⚡️ e veja o [código](https://github.com/GoogleChromeLabs/trust-safety-demo/tree/main/conversion-measurement) correspondente. {% endBanner %}

Veja como a API registra e relata uma conversão. Observe que é dessa forma que um fluxo click-to-convert funcionaria com a API atual. As iterações futuras desta API [podem ser diferentes](#use-cases) .

### Clique no anúncio (etapas 1 a 5)

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

Este código especifica o seguinte:

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th>Atributo</th>
        <th>Valor padrão, máximo, mínimo</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>impressiondata</code> (obrigatório): um <b>identificador de 64 bits</b> para anexar a um clique no anúncio.</td>
        <td>(nenhum padrão)</td>
        <td>Um ID de clique gerado dinamicamente, como um número inteiro de 64 bits: <code>200400600</code>
</td>
      </tr>
      <tr>
        <td>
<code>conversiondestination</code> (obrigatório): o <b><a href="/same-site-same-origin/#site" noopener="">eTLD + 1</a></b> onde uma conversão é esperada para este anúncio.</td>
        <td>(nenhum default)</td>
        <td>
<code>https://advertiser.example</code>.<br> Se o <code>conversiondestination</code> for <code>https://advertiser.example</code>, as conversões em <code>https://advertiser.example</code> e <code>https://shop.advertiser.example</code> serão atribuídas.<br> O mesmo acontece se o <code>conversiondestination</code> for <code>https://shop.advertiser.example</code>: serão atribuídas conversões em <code>https://advertiser.example</code> e <code>https://shop.advertiser.example</code>
</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> (opcional): em milissegundos, o tempo limite para quando as conversões podem ser atribuídas a este anúncio.</td>
        <td>
<code>2592000000</code> = 30 dias (em milissegundos).<br><br> Máximo: 30 dias (em milissegundos).<br><br> Mínimo: 2 dias (em milissegundos).</td>
        <td>Dez dias após o clique: <code>864000000</code>
</td>
      </tr>
      <tr>
        <td>
<code>reportingorigin</code> (opcional): o destino para relatórios de conversões confirmadas.</td>
        <td>Origem de nível superior da página onde o elemento de link é adicionado.</td>
        <td><code>https://adtech.example</code></td>
      </tr>
      <tr>
        <td>
<code>href</code> : o destino pretendido do clique no anúncio.</td>
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

- Fluxos baseados na navegação por `window.open` ou `window.location` não serão elegíveis para atribuição.

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

### Conversão e programação de relatórios (etapas 6 a 9)

<figure class="w-figure">
  {% Img src="image/admin/2fFVvAwyiXSaSDp8XVXo.jpg", alt="Diagrama: conversão e programação de relatório", width="800", height="639" %}
</figure>

Logo depois de clicar no anúncio ou mais tarde - por exemplo, no dia seguinte - o usuário visita o `advertiser.example`, procura por calçados esportivos, encontra um par que deseja comprar e prossegue com a finalização da compra. O `advertiser.example` incluiu um pixel na página de checkout:

```html
<img
  height="1"
  width="1"
  src="https://adtech.example/conversion?model=shoe07&type=checkout&…"
/>
```

`adtech.example` recebe essa solicitação e decide que ela se qualifica como uma conversão. Eles agora precisam solicitar ao navegador para registrar uma conversão. `adtech.example` compacta todos os dados de conversão em 3 bits - um número inteiro entre 0 e 7. Por exemplo, eles podem mapear uma ação de **Checkout** para um valor de conversão de 2.

`adtech.example` então envia um redirecionamento de conversão de registro específico para o navegador:

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
- Registra uma conversão para este clique no anúncio.

Vários cliques no anúncio podem corresponder a uma conversão: o usuário pode ter clicado num anúncio para `shoes.example` em ambos `news.example` e `weather.example`. Neste caso, várias conversões são registradas.

Agora, o navegador sabe que precisa informar o servidor adtech sobre essa conversão - mais especificamente, o navegador precisa informar a origem do `reportingorigin` que é especificada no elemento `<a>` e na solicitação do pixel (`adtech.example`).

Para isto, o navegador programa o envio de um **relatório de conversão**, um blob de dados contendo os dados de clique (do site do editor) e os dados de conversão (do site do anunciante). Para este exemplo, o usuário converteu um clique no dia seguinte. Portanto, o relatório está programado para ser enviado no dia seguinte, na marca de dois dias após o clique, se o navegador estiver em execução.

### Enviando o relatório (etapas 10 e 11)

<figure class="w-figure">
  {% Img src="image/admin/Er48gVzK5gHUGdDHWHz1.jpg", alt="Diagrama: navegador enviando o relatório", width="800", height="533" %}
</figure>

Uma vez atingido o horário programado para enviar o relatório, o navegador envia o **relatório de conversão**: ele envia um HTTP POST para a origem do relatório que foi especificada no elemento `<a>` `adtech.example`). Por exemplo:

`https://adtech.example/.well-known/register-conversion?impression-data=200400600&conversion-data=2&credit=100`

Incluídos como parâmetros estão:

- Os dados associados ao clique no anúncio original ( `impression-data` ).
- Os dados associados a uma conversão, [potencialmente com ruído](#noising-of-conversion-data) .
- O crédito de conversão atribuído ao clique. Esta API segue um modelo de atribuição de **último clique**: o clique em anúncio correspondente mais recente recebe um crédito de 100; todos os outros cliques em anúncios correspondentes recebem um crédito de 0.

Conforme o servidor adtech recebe essa solicitação, ele pode extrair os `impression-data` e `conversion-data`, ou seja, o relatório de conversão:

```json
{"impression-data": "200400600", "conversion-data": 3, "credit": 100}
```

### Conversões subsequentes e expiração

Mais tarde, o usuário pode converter novamente - por exemplo, comprando uma raquete de tênis no `advertiser.example`. Um fluxo semelhante acontece:

- O servidor adtech envia uma solicitação de conversão ao navegador.
- O navegador faz a correspondência dessa conversão com o clique no anúncio, programa um relatório e o envia ao servidor adtech posteriormente.

Após a `impressionexpiry`, as conversões para esse clique no anúncio param de ser contadas e o clique no anúncio é excluído do armazenamento do navegador.

## Casos de uso

### O que é atualmente suportado

- Mensuração das conversões de clique: determine quais cliques em anúncios levam a conversões e acesse informações gerais sobre a conversão.
- Obtenção de dados para otimizar a seleção de anúncios, por exemplo, treinando modelos de aprendizado de máquina.

### O que não é suportado nesta iteração

Os seguintes recursos não são suportados, mas podem estar em iterações futuras desta API ou em relatórios [agregados:](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md)

- Mensuração de conversão do tipo view-through.
- [Múltiplos endpoints de relatório](https://github.com/WICG/conversion-measurement-api/issues/29).
- [Conversões web que começam em aplicativo iOS/Android](https://github.com/WICG/conversion-measurement-api/issues/54) .
- Medição de aumento de conversão / incrementalidade: medição de diferenças causais no comportamento de conversão, medindo a diferença entre um grupo de teste que viu um anúncio e um grupo de controle que não viu.
- Modelos de atribuição que não são de último clique (last-click).
- Casos de uso que requerem grandes quantidades de informações sobre o evento de conversão. Por exemplo, valores de compra granulares ou categorias de produtos.

Antes que esses recursos e outros possam ser suportados, **mais proteções de privacidade** (ruído, menos bits ou outras limitações) devem ser adicionadas à API.

A discussão de possíveis recursos adicionais ocorre de forma aberta, no [repositório de propostas de **issues**](https://github.com/WICG/conversion-measurement-api/issues) da API.

{% Aside %} Seu caso de uso está faltando? Você tem comentários sobre a API? [Compartilhe](#share-your-feedback). {% endAside %}

### O que mais pode mudar em iterações futuras

- Esta API está em um estágio experimental inicial. Em iterações futuras, esta API poderá sofrer alterações substanciais, incluindo, mas não se limitando às listadas abaixo. Seu objetivo é medir as conversões e, ao mesmo tempo, preservar a privacidade do usuário, e qualquer mudança que ajude a lidar melhor com esse caso de uso será feita.
- API e nomenclatura de atributos podem evoluir.
- Os dados de clique e os dados de conversão podem não exigir codificação.
- O limite de 3 bits para dados de conversão pode ser aumentado ou diminuído.
- [Mais recursos podem ser adicionados](#what-is-not-supported-in-this-iteration) e **mais proteções de privacidade** (ruído / menos bits / outras limitações) se forem necessários para oferecer suporte a esses novos recursos.

Para acompanhar e participar de discussões sobre novos recursos, acompanhe o [repositório GitHub](https://github.com/WICG/conversion-measurement-api/issues) da proposta e envie ideias.

## Experimente

### Demo

Experimente a [demo](https://goo.gle/demo-event-level-conversion-measurement-api). Certifique-se de seguir as instruções "Antes de começar".

Envie tweets para [@maudnals](https://twitter.com/maudnals?lang=en) ou [@ChromiumDev](https://twitter.com/ChromiumDev) com qualquer pergunta sobre a demo!

### Experimente a API

Se você planeja experimentar a API (localmente ou com usuários finais), consulte [Usando a API de mensuração de conversão](/using-conversion-measurement).

### Compartilhe seu feedback

**Seu feedback é crucial** para que novas APIs de medição de conversão possam oferecer suporte a seus casos de uso e fornecer uma boa experiência de desenvolvedor.

- Para relatar um bug na implementação do Chrome, [registre um bug](https://bugs.chromium.org/p/chromium/issues/entry?status=Unconfirmed&components=Internals%3EConversionMeasurement&description=Chrome%20Version%3A%20%28copy%20from%20chrome%3A%2F%2Fversion%29%0AOS%3A%20%28e.g.%20Win10%2C%20MacOS%2010.12%2C%20etc...%29%0AURLs%20%28if%20applicable%29%20%3A%0A%0AWhat%20steps%20will%20reproduce%20the%20problem%3F%0A%281%29%0A%282%29%0A%283%29%0A%0AWhat%20is%20the%20expected%20result%3F%0A%0A%0AWhat%20happens%20instead%3F%0A%0AIf%20applicable%2C%20include%20screenshots%2Finfo%20from%20chrome%3A%2F%2Fconversion-internals%20or%20relevant%20devtools%20errors.%0A) .
- Para compartilhar feedback e discutir casos de uso na API do Chrome, crie um novo issue ou envolva-se com os issues existentes no [repositório de propostas de API](https://github.com/WICG/conversion-measurement-api/issues). Da mesma forma, você pode discutir a API WebKit/Safari e seus casos de uso no [repositório de propostas de API](https://github.com/privacycg/private-click-measurement/issues) .
- Para discutir casos de uso de publicidade e discutir visões com especialistas do setor: participe do [Improving Web Advertising Business Group](https://www.w3.org/community/web-adv/). Participe do [Privacy Community Group](https://www.w3.org/community/privacycg/) para discussões sobre a API WebKit/Safari.

### Fique de olho

- À medida em que recebemos feedback dos desenvolvedores e os casos de uso, a API Event Conversion Measurement irá evoluir com o tempo. Acompanhe o [repositório GitHub](https://github.com/WICG/conversion-measurement-api/) da proposta.
- Acompanhe a evolução da [API Aggregate Conversion Measurement](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md) que complementará esta API.

*Com muitos agradecimentos por contribuições e feedback a todos os revisores - especialmente Charlie Harrison, John Delaney, Michael Kleber e Kayce Basques.*

*Imagem hero por William Warby / @wawarby em [Unsplash](https://unsplash.com/photos/WahfNoqbYnM), editada.*
