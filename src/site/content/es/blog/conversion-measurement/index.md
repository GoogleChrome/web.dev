---
layout: post
title: Una forma más privada de medir las conversiones de anuncios, la API para evaluar conversiones de eventos
subhead: Una nueva API web disponible como prueba de origen mide cuando un clic en un anuncio genera una conversión, sin usar identificadores de sitios cruzados.
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

{% Aside 'caution' %} La API para evaluar conversiones se llamará *API de informes de atribuciones* y ofrecerá más funciones.

- Si está experimentando con la ([API para evaluar conversiones](https://github.com/WICG/conversion-measurement-api/blob/3e0ef7d3cee8d7dc5a4b953e70cb027b0e13943b/README.md)) en [Chrome 91](https://chromestatus.com/features/schedule) y versiones posteriores, lea esta publicación para encontrar más información, casos de uso e instrucciones sobre cómo utilizar la API.
- Si está interesado en la próxima versión de esta API (Informes de atribuciones), que estará disponible para experimentar en Chrome (prueba de origen), [únase a la lista de correo](https://groups.google.com/u/1/a/chromium.org/g/attribution-reporting-api-dev) para recibir actualizaciones sobre los experimentos disponibles.

{% endAside %}

Para medir la eficacia de las campañas publicitarias, los anunciantes y los editores deben saber cuándo un clic en un anuncio o una visualización genera una [conversión](/digging-into-the-privacy-sandbox/#conversion), como una compra o un registro. Históricamente, esto se ha hecho con **cookies de terceros**. Ahora, la API para evaluar conversiones de eventos permite la correlación de un evento en el sitio web de un editor con una conversión posterior en el sitio de un anunciante sin involucrar mecanismos que se puedan utilizar para reconocer a un usuario en distintos sitios.

{% Aside %} **Esta propuesta necesita sus comentarios.** Si tiene comentarios, [cree un problema](https://github.com/WICG/conversion-measurement-api/issues/) en el repositorio de la propuesta de la API. {% endAside %}

{% Aside %} Esta API es parte de Privacy Sandbox, una serie de propuestas para satisfacer los casos de uso de terceros sin cookies de terceros u otros mecanismos de seguimiento entre sitios. Consulte [Profundizar en la zona de pruebas de privacidad](/digging-into-the-privacy-sandbox) para obtener una descripción general de todas las propuestas. {% endAside %}

## Glosario

- **Plataformas de tecnología para hacer anuncios**: empresas que proporcionan software y herramientas para permitir que las marcas o agencias orienten, entreguen y analicen su publicidad digital.
- **Anunciantes**: empresas que pagan por publicidad.
- **Editores**: empresas que muestran anuncios en sus sitios web.
- **Conversión a través de un clic**: conversión que se atribuye a un clic en un anuncio.
- **Conversión a través de una visualización**: conversión que se atribuye a la impresión de un anuncio (si el usuario no interactúa con el anuncio, este después se convierte).

## Quién debe conocer esta API: plataformas de tecnología para hacer anuncios, anunciantes y editores

- **Las plataformas de tecnología para hacer anuncios** como las **[plataformas del lado de la demanda](https://en.wikipedia.org/wiki/Demand-side_platform)** probablemente estén interesadas en utilizar esta API para admitir la funcionalidad que actualmente se basa en cookies de terceros. Si está trabajando en sistemas de evaluación de conversiones: [pruebe la demostración](#demo), [experimente con la API](#experiment-with-the-api), y [comparta sus comentarios](#share-your-feedback).
- **Los anunciantes y editores que dependen del código personalizado para evaluar la publicidad o las conversiones** también pueden estar interesados en utilizar esta API para sustituir las técnicas existentes.
- **Los anunciantes y editores que dependen de plataformas de tecnología para hacer anuncios para evaluar la publicidad o las conversiones** no necesitan utilizar la API directamente, pero la [razón de ser de esta API](#why-is-this-needed) puede ser de interés, especialmente si se trabaja con plataformas de tecnología para hacer anuncios que pueden integrar la API.

## Descripción general de la API

### ¿Por qué es necesario esto?

Hoy en día, la evaluación las conversiones de los anuncios con frecuencia se basa en [cookies de terceros](https://developer.mozilla.org/docs/Web/HTTP/Cookies#Third-party_cookies). **Pero los navegadores están restringiendo el acceso a las mismas.**

Chrome planea [eliminar la compatibilidad con las cookies de terceros](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html) y [ofrece a los usuarios formas de bloquearlas si así lo desean](https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en). Safari [bloquea las cookies de terceros](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/), Firefox [bloquea las cookies de seguimiento conocidas de terceros](https://blog.mozilla.org/blog/2019/09/03/todays-firefox-blocks-third-party-tracking-cookies-and-cryptomining-by-default), y Edge [ofrece prevención de seguimiento](https://support.microsoft.com/help/4533959/microsoft-edge-learn-about-tracking-prevention?ocid=EdgePrivacySettings-TrackingPrevention).

Las cookies de terceros se están convirtiendo en una solución heredada. **Están surgiendo nuevas API con diseños específicos**, como esta, para abordar de manera que preserve la privacidad los casos de uso que resolvían las cookies de terceros.

**¿Cómo se compara la API de evaluación de conversiones de eventos con las cookies de terceros?**

- A diferencia de las cookies, está **diseñada específicamente** para medir conversiones. Esto, a su vez, puede permitir que los navegadores apliquen una mayor protección de la privacidad.
- Es **más privada**: dificulta el reconocimiento de un usuario a través de dos sitios diferentes de nivel superior, por ejemplo para vincular los perfiles de usuario del lado del editor y del lado del anunciante. Consulte [Cómo esta API preserva la privacidad del usuario](#how-this-api-preserves-user-privacy).

### Una primera iteración

Esta API se encuentra en una **etapa experimental anticipada**. Lo que está disponible como prueba de origen es la **primera iteración** de la API. Las cosas pueden cambiar sustancialmente en [futuras iteraciones](#use-cases).

### Solo clics

Esta iteración de la API solo admite la **evaluación de conversiones a través de un clic**, pero la [evaluación de conversiones a través de una visualización](https://github.com/WICG/conversion-measurement-api/blob/main/event_attribution_reporting.md) está en fase de incubación pública.

### Cómo funciona

<figure>{% Img src="image/admin/Xn96AVosulGisR6Hoj4J.jpg", alt="Diagrama: descripción general de los pasos de la API para evaluar conversiones", width="800", height="496" %}</figure>

Esta API se puede utilizar con dos tipos de enlaces (`<a>` elementos) utilizados para publicidad:

- Enlaces en un contexto de **origen**, como anuncios en una red social o una página de resultados de un motor de búsqueda
- Enlaces en un **frame de terceros**, como en el sitio de un editor que utiliza un proveedor de tecnología para hacer anuncios de terceros.

Con esta API, dichos enlaces salientes se pueden configurar con atributos que son específicos de las conversiones de anuncios:

- Datos personalizados para adjuntar a un clic en un anuncio en el lado del editor, por ejemplo, un ID de clic o un ID de campaña.
- El sitio web para el que se espera una conversión para este anuncio.
- El endpoint de informes al que se deben notificar las conversiones exitosas.
- La fecha y hora límite en la que las conversiones ya no se pueden contabilizar para este anuncio.

Cuando el usuario hace clic en un anuncio, el navegador (en el dispositivo local del usuario) registra este evento, junto con la configuración de conversión y los datos de clic especificados por los atributos para evaluar conversiones en el elemento `<a>`.

Más tarde, el usuario puede visitar el sitio web del anunciante y realizar una acción que el anunciante o su proveedor de tecnología para hacer anuncios clasifica como una **conversión**. Si esto sucede, el clic del anuncio y el evento de conversión coinciden en el navegador del usuario.

Finalmente, el navegador programa un **informe de conversiones** que se enviará al endpoint especificado en los atributos del elemento `<a>`. Este informe incluye datos sobre el clic del anuncio que generó esta conversión, así como datos sobre la conversión.

Si se registran varias conversiones para un clic en un anuncio determinado, se programará el envío de tantos informes correspondientes (hasta un máximo de tres por clic en el anuncio).

Los informes se envían después de una demora: días o, a veces, semanas después de la conversión (consulte el motivo en el [calendario de informes](#report-timing) ).

## Compatibilidad con navegadores y API similares

### Soporte del navegador

La API para evaluar conversiones de eventos puede ser compatible:

- Como una [prueba de origen](/origin-trials/). Las pruebas de origen habilitan la API para **todos los visitantes** de un determinado [origen](/same-site-same-origin/#origin). **Debe registrar su origen en la prueba de origen para poder probar la API con los usuarios finales**. Consulte [Uso de la API para evaluar conversiones](/using-conversion-measurement) para obtener más información sobre la prueba de origen.
- Activando marcas, en Chrome 86 y versiones posteriores. Las marcas habilitan la API en el navegador de **un solo usuario.** **Las marcas son <br>útiles cuando se desarrollan localmente**.

Consulte los detalles sobre el estado actual en la [entrada de funciones de Chrome](https://chromestatus.com/features/6412002824028160).

### Estandarización

Esta API se está diseñando en código abierto, en el Grupo comunitario de incubadoras de plataformas web  ([Web Platform Incubator Community Group, WICG](https://www.w3.org/community/wicg/)). Está disponible para experimentar en Chrome.

### API similares

WebKit, el motor del navegador web utilizado por Safari, tiene una propuesta con objetivos similares, la [Evaluación de clics privados](https://github.com/privacycg/private-click-measurement). Se está trabajando en el Grupo de la Comunidad Privada ([PrivacyCG](https://www.w3.org/community/privacycg/)).

## Cómo esta API preserva la privacidad del usuario

Con esta API, se pueden evaluar las conversiones protegiendo la privacidad de los usuarios: no se puede reconocer a los usuarios en los distintos sitios. Esto es posible gracias a los **límites de datos**, el **ruido de los datos de conversión**, y los mecanismos de **sincronización de los informes**.

Veamos con más detalle cómo funcionan estos mecanismos y qué significan en la práctica.

### Límites de datos

A continuación, los **datos de tiempo de clic o tiempo de visualización** son los datos de los que dispone `adtech.example` por ejemplo cuando el usuario recibe el anuncio y hace clic en él o lo visualiza. Los datos de cuando se produce una conversión son **datos de tiempo de conversión**.

Veamos un **editor** `news.example` y un **anunciante** `shoes.example`. Los scripts de terceros de la **plataforma de tecnología para hacer anuncios** `adtech.example` están presentes en el sitio del editor `news.example` para incluir anuncios del anunciante `shoes.example`. `shoes.example` incluye también scripts de `adtech.example` para detectar conversiones.

¿Cuánto puede conocer `adtech.example` sobre los usuarios de la web?

#### Con cookies de terceros

<figure>{% Img src="image/admin/kRpuY2r7ZSPtADz7e1P5.jpg", alt="Diagrama: cómo las cookies de terceros permiten el reconocimiento de usuarios entre sitios", width="800", height="860" %}</figure>

`adtech.example` basa en una **cookie de terceros que se utiliza como un identificador único entre sitios** para **reconocer a un usuario entre sitios**. Además, `adtech.example` puede acceder a **ambos** datos detallados de clics o visualizaciones y datos detallados de conversiones, y vincularlos.

Como resultado, `adtech.example` puede rastrear el comportamiento de un solo usuario en todos los sitios, entre la visualización de un anuncio, los clics y las conversiones.

Dado que `adtech.example` probablemente esté presente en una gran cantidad de sitios de editores y anunciantes, y no solo en `news.example` y `shoes.example`, se puede rastrear el comportamiento del usuario en la web.

#### Con la API para evaluar conversiones de eventos

<figure>{% Img src="image/admin/X6sfyeKGncVm0LJSYJva.jpg", alt="Diagrama: cómo la API permite evaluar conversiones sin reconocimiento de usuarios entre sitios", width="800", height="643" %} <figcaption>"ID de anuncios" en el diagrama de cookies y "ID de clics" son identificadores que permiten la asignación de datos detallados. En este diagrama, se denomina "ID de clics" porque solo es compatible con la evaluación de conversiones a través de clics.</figcaption></figure>

`adtech.example` no puede utilizar un identificador entre sitios y, por tanto, **no puede reconocer a un usuario entre sitios**.

- Se puede adjuntar un identificador de 64 bits a un clic en un anuncio.
- Solo se pueden adjuntar 3 bits de datos de conversión al evento de conversión. En 3 bits pueden ajustarse a un valor entero entre 0 y 7. No son muchos datos, pero son suficientes para que los anunciantes puedan aprender a tomar buenas decisiones sobre dónde gastar su presupuesto publicitario en el futuro (por ejemplo, modelos de datos de capacitación).

{% Aside %} Los datos de clics y los datos de conversión nunca se exponen a un entorno de JavaScript en el mismo contexto. {% endAside %}

#### Sin alternativa a las cookies de terceros

Sin una alternativa para las cookies de terceros, como la API para evaluar conversiones de eventos, las conversiones no se pueden atribuir: si `adtech.example` está presente tanto en el sitio del editor como en el del anunciante, puede acceder a los datos de tiempo de clic o de tiempo de conversión, pero no puede vincularlos del todo.

En este caso, se conserva la privacidad del usuario, pero los anunciantes no pueden optimizar su inversión publicitaria. Es por eso que se necesita una alternativa como la API para evaluar conversión por eventos.

### Ruido en los datos de conversión

Los 3 bits recopilados en el momento de la conversión se **emiten con ruido**.

Por ejemplo, en la implementación de Chrome, el ruido de datos funciona de la siguiente manera: el 5% de las veces, la API informa un valor aleatorio de 3 bits en vez de los datos de conversión reales.

Esto protege a los usuarios de los ataques a la privacidad. Un actor que intente hacer un mal uso de los datos de varias conversiones para crear un identificador no tendrá plena confianza en los datos que recibe, lo que complica este tipo de ataques.

Tenga en cuenta que es posible [recuperar el verdadero recuento de conversiones](/using-conversion-measurement/#(optional)-recover-the-corrected-conversion-count).

Resumen de datos de clics y datos de conversión:

<div>
  <table data-alignment="top">
    <thead>
      <tr>
        <th>Datos</th>
        <th>Tamaño</th>
        <th>Ejemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Datos de clics (atributo de <code>impressiondata</code>
</td>
        <td>64 bits</td>
        <td>Un ID de anuncios o un ID de clics</td>
      </tr>
      <tr>
        <td>Datos de conversión</td>
        <td>3 bits, ruido</td>
        <td>Un número entero entre 0 y 7 que se puede asignar a un tipo de conversión: registro, proceso de revisión completo, etc.</td>
      </tr>
    </tbody>
  </table>
</div>

### Sincronizador de informes

Si se registran varias conversiones para un clic en un anuncio determinado, **se envía un informe correspondiente para cada conversión, hasta un máximo de tres por clic**.

Para evitar que el tiempo de conversión se utilice para obtener más información del lado de la conversión y, por tanto, obstaculizar la privacidad de los usuarios, esta API especifica que los informes de conversión no se envían inmediatamente después de que se produzca una conversión. Después del clic inicial en el anuncio, comienza un calendario de **ventanas de informes** asociadas a este clic. Cada ventana de informes tiene una fecha límite, y las conversiones registradas antes de esa fecha límite se enviarán al final de esa ventana.

Es posible que los informes no se envíen exactamente en estas fechas y horas programadas: si el navegador no se está ejecutando cuando programó el envío de un informe, este se envía al iniciar el navegador, lo que podría suceder días o semanas después de la hora programada.

Después del vencimiento (tiempo de clic + `impressionexpiry`), no se contabiliza ninguna conversión. `impressionexpiry` es la fecha y hora límite en la que ya no se pueden contabilizar las conversiones para este anuncio.

En Chrome, la programación de informes funciona de la siguiente manera:

<div>
  <table data-alignment="top">
    <thead>
      <tr>
        <th><code>impressionexpiry</code></th>
        <th>Dependiendo del tiempo de conversión, se envía un informe de conversión (si el navegador está abierto)…</th>
        <th>Número de ventanas de informes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>30 días, el valor predeterminado y máximo</td>
        <td>
          <ul>
            <li>2 días después de que se hizo clic en el anuncio</li>
            <li>o 7 días después de hacer clic en el anuncio</li>
            <li>o <code>impressionexpiry</code> = 30 días después de hacer clic en el anuncio.</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> es de entre 7 y 30 días.</td>
        <td>
          <ul>
            <li>2 días después de hacer clic en el anuncio</li>
            <li>o 7 días después de hacer clic en el anuncio</li>
            <li>o <code>impressionexpiry</code> después de hacer clic en el anuncio.</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> es de entre 2 y 7 días.</td>
        <td>
          <ul>
            <li>2 días después de hacer clic en el anuncio</li>
            <li>o <code>impressionexpiry</code> después de hacer clic en el anuncio.</li>
          </ul>
        </td>
        <td>2</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> es inferior a 2 días.</td>
        <td>
          <li>2 días después de hacer clic en el anuncio</li>
        </td>
        <td>1</td>
      </tr>
    </tbody>
  </table>
</div>

<figure>{% Img src="image/admin/bgkpW6Nuqs5q1ddyMG8X.jpg", alt="Cronología de los informes que se enviaron", width="800", height="462" %}</figure>

Consulte [Envío de informes programados](https://github.com/WICG/conversion-measurement-api#sending-scheduled-reports) para obtener más detalles sobre la sincronización.

## Ejemplo

{% Aside %} Para ver esto en acción, pruebe la [demostración](https://goo.gle/demo-event-level-conversion-measurement-api) ⚡️ y vea el [código](https://github.com/GoogleChromeLabs/trust-safety-demo/tree/main/conversion-measurement) correspondiente. {% endAside %}

Así es como la API registra e informa de una conversión. Tenga en cuenta que así es como funcionaría un flujo de conversión a través de un clic con la API actual. Las futuras iteraciones de esta API [pueden ser diferentes](#use-cases).

### Clic en el anuncio (pasos 1 al 5)

<figure>{% Img src="image/admin/FvbacJL6u37XHuvQuUuO.jpg", alt="Diagrama: clics en anuncios y almacenamiento de clics", width="800", height="694" %}</figure>

Un elemento publicitario `<a>` se carga en el sitio de un editor mediante `adtech.example` dentro de un iframe.

Los desarrolladores de la plataforma de tecnología para hacer anuncios configuraron el elemento `<a>` con atributos de evaluación de la conversiones:

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

Este código especifica lo siguiente:

<div>
  <table data-alignment="top">
    <thead>
      <tr>
        <th>Atributo</th>
        <th>Valor predeterminado, máximo, mínimo</th>
        <th>Ejemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>impressiondata</code> (obligatorio): un identificador de <b>64 bits</b> para adjuntar a un clic en un anuncio.</td>
        <td>(ningún valor predeterminado)</td>
        <td>Un ID de clic generado de forma dinámica, como un número entero de 64 bits: <code>200400600</code>
</td>
      </tr>
      <tr>
        <td>
<code>conversiondestination</code> (obligatorio): el <b><a href="/same-site-same-origin/#site" noopener="">eTLD + 1</a></b> donde se espera una conversión para este anuncio.</td>
        <td>(ningún valor predeterminado)</td>
        <td>
<code>https://advertiser.example</code>.<br> Si el <code>conversiondestination</code> es <code>https://advertiser.example</code> , se atribuirán las conversiones tanto en <code>https://advertiser.example</code> como en <code>https://shop.advertiser.example</code>. <br> Lo mismo ocurre si el <code>conversiondestination</code> es <code>https://shop.advertiser.example</code> conversiones tanto en <code>https://advertiser.example</code> como en <code>https://shop.advertiser.example</code>.</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code> (opcional): en milisegundos, la hora límite para que las conversiones se pueden atribuir a este anuncio.</td>
        <td>
<code>2592000000</code> = 30 días (en milisegundos).<br><br> Máximo: 30 días (en milisegundos).<br><br> Mínimo: 2 días (en milisegundos).</td>
        <td>Diez días después del clic: <code>864000000</code>
</td>
      </tr>
      <tr>
        <td>
<code>reportingorigin</code> (opcional): el destino para informar conversiones confirmadas.</td>
        <td>Origen de nivel superior de la página donde se agrega el elemento de enlace.</td>
        <td><code>https://adtech.example</code></td>
      </tr>
      <tr>
        <td>
<code>href</code> : el destino previsto del clic del anuncio.</td>
        <td><code>/</code></td>
        <td><code>https://advertiser.example/shoes07</code></td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} Algunas notas sobre el ejemplo:

- Encontrará el término "impresión" utilizado en los atributos de la API o en la propuesta de API, aunque por ahora solo se admiten clics. Los nombres pueden actualizarse en futuras iteraciones de la API.
- El anuncio no tiene que estar en un iframe, pero es en lo que se basa este ejemplo.

{% endAside %}

{% Aside 'gotchas' %}

- Los flujos basados en la navegación a través de `window.open` o `window.location` no serán elegibles para la atribución.

{% endAside %}

Cuando el usuario pulsa o hace clic en el anuncio, navega al sitio del anunciante. Una vez que se realiza la navegación, el navegador almacena un objeto que incluye `impressiondata`, `conversiondestination`, `reportingorigin`, y `impressionexpiry`:

```json
{
  "impression-data": "200400600",
  "conversion-destination": "https://advertiser.example",
  "reporting-origin": "https://adtech.example",
  "impression-expiry": 864000000
}
```

### Conversión y programación de informes (pasos 6 al 9)

<figure>{% Img src="image/admin/2fFVvAwyiXSaSDp8XVXo.jpg", alt="Diagrama: conversión y programación de informes", width="800", height="639" %}</figure>

Ya sea directamente después de hacer clic en el anuncio o más tarde (por ejemplo, al día siguiente), el usuario visita `advertiser.example` Por ejemplo, busca zapatos deportivos, encuentra un par que desea comprar y procede a pagar. `advertiser.example` incluyó un pixel en la página para realizar pagos:

```html
<img
  height="1"
  width="1"
  src="https://adtech.example/conversion?model=shoe07&type=checkout&…"
/>
```

`adtech.example` recibe esta solicitud y decide que califica como una conversión. Ahora deben solicitar al navegador que registre una conversión. `adtech.example` comprime todos los datos de conversión en 3 bits, un número entero entre 0 y 7, por ejemplo, podrían asignar una acción de **pago** a un valor de conversión de 2.

`adtech.example` luego envía un redireccionamiento de conversión de registro específico al navegador:

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

{% Aside %} `.well-known` Las URL son direcciones especiales. Facilitan que las herramientas de software y los servidores descubran información o recursos comúnmente necesarios para un sitio, por ejemplo, en qué página un usuario puede [cambiar su contraseña](/change-password-url/). Aquí, `.well-known` solo se utiliza para que el navegador reconozca que se trata de una solicitud de conversión especial. En realidad, esta solicitud se cancela internamente por el navegador. {% endAside %}

El navegador recibe esta solicitud. Al detectar `.well-known/register-conversion`, el navegador:

- Busca todos los clics en anuncios almacenados que coinciden con este `conversiondestination` (porque recibe esta conversión en una URL que se registró como `conversiondestination` cuando el usuario hizo clic en el anuncio). Encuentre el clic en el anuncio que se produjo en el sitio del editor un día antes.
- Registre una conversión para este clic en el anuncio.

Varios clics en anuncios pueden coincidir con una conversión, es posible que el usuario haya hecho clic en un anuncio de `shoes.example` tanto en `news.example` como en `weather.example`. En este caso, se registran varias conversiones.

Ahora, el navegador sabe que debe informar al servidor de tecnología para hacer anuncios de esta conversión, más específicamente, el navegador debe informar al `reportingorigin` que se especifica tanto en el elemento `<a>` como en la solicitud de pixeles (`adtech.example`).

Para ello, el navegador programa el envío de un **informe de conversión**, un bloque de datos que contiene los datos de los clics (del sitio del editor) y los datos de las conversiones (del anunciante). En este ejemplo, el usuario realizó la conversión un día después de hacer clic. Por lo tanto, el informe está programado para ser enviado al día siguiente, en la marca de dos días después del clic si el navegador se está ejecutando.

### Envío del informe (pasos 10 y 11)

<figure>{% Img src="image/admin/Er48gVzK5gHUGdDHWHz1.jpg", alt="Diagrama: navegador enviando el informe", width="800", height="533" %}</figure>

Una vez que se alcanza la hora programada para enviar el informe, el navegador envía el **informe de conversión** : envía un HTTP POST al origen del informe que se especificó en el elemento `<a>` `adtech.example` ). Por ejemplo:

`https://adtech.example/.well-known/register-conversion?impression-data=200400600&conversion-data=2&credit=100`

Se incluyen como parámetros:

- Los datos asociados con el clic del anuncio original (`impression-data`).
- Los datos asociados con una conversión, [potencialmente ruidosos](#noising-of-conversion-data).
- El crédito de conversión atribuido al clic. Esta API sigue un modelo de <strog>atribución al último clic: el clic en el anuncio que coincide de forma más reciente recibe un crédito de 100, a todos los demás clics en anuncios que coincidan recibirán un crédito de 0.</strog>

A medida que el servidor de tecnología para hacer anuncios recibe esta solicitud, puede extraer los `impression-data` y `conversion-data`, es decir, el informe de conversión:

```json
{"impression-data": "200400600", "conversion-data": 3, "credit": 100}
```

### Conversiones posteriores y vencimiento

Más adelante, el usuario puede volver a realizar la conversión, por ejemplo, comprando una raqueta de tenis en el `advertiser.example` para acompañar a su calzado. Se produce un flujo similar:

- El servidor de tecnología para hacer anuncios envía una solicitud de conversión al navegador.
- El navegador relaciona esta conversión con el clic del anuncio, programa un informe y posteriormente lo envía al servidor de tecnología para hacer anuncios.

Después de `impressionexpiry`, las conversiones de este clic en el anuncio dejan de contarse y el clic en el anuncio se elimina del almacenamiento del navegador.

## Casos de uso

### Lo que se admite actualmente

- Medir las conversiones de los clics: determinar qué clics del anuncio conducen a conversiones y acceder a información aproximada sobre la conversión.
- Reunir datos para optimizar la selección de anuncios, por ejemplo, entrenando modelos de aprendizaje automático.

### Qué no se admite en esta iteración

Las siguientes funciones no son compatibles, pero pueden estar en futuras iteraciones de esta API o en informes [agrupados:](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md)

- Evaluación de conversiones a través de una visualización
- [Múltiples endpoints de informes](https://github.com/WICG/conversion-measurement-api/issues/29).
- [Conversiones web que comenzaron en una aplicación iOS/Android](https://github.com/WICG/conversion-measurement-api/issues/54).
- Evaluación/incremento de la conversión: evaluación de las diferencias causales en el comportamiento de conversión, al evaluar la diferencia entre un grupo de prueba que vio un anuncio y un grupo de control que no lo vio.
- Modelos de atribución que no son de último clic.
- Casos de uso que requieren una mayor cantidad de información sobre el evento de conversión. Por ejemplo, precios de compra detallados o categorías de productos.

Antes de que estas características y otras se puedan admitir, **más protecciones de privacidad** (ruido, menos bits u otras limitaciones) deben añadirse a la API.

La discusión de las posibles características adicionales se lleva a cabo en código abierto, en el [repositorio de **problemas** de propuestas de la API](https://github.com/WICG/conversion-measurement-api/issues).

{% Aside %} ¿Falta su caso de uso? ¿Tiene comentarios sobre la API? [Compártalo](#share-your-feedback). {% endAside %}

### ¿Qué más puede cambiar en futuras iteraciones?

- Esta API se encuentra en una etapa experimental inicial. En futuras iteraciones, esta API podrá sufrir cambios sustanciales que incluyen, incluyendo los que se enumeran a continuación. Su objetivo es medir las conversiones mientras se preserva la privacidad del usuario, y se realizará cualquier cambio que ayude a abordar mejor este caso de uso.
- La API y la denominación de los atributos pueden evolucionar.
- Posiblemente los datos de los clics y de la conversión no requieran codificación.
- El límite de 3 bits para los datos de conversión se puede aumentar o disminuir.
- [Se pueden agregar más funciones](#what-is-not-supported-in-this-iteration) y **más protecciones de privacidad** (ruido/menos bits/otras limitaciones) si es necesario para admitir estas nuevas funciones.

Para seguir y participar en las discusiones sobre las nuevas funciones, vea el [repositorio de GitHub](https://github.com/WICG/conversion-measurement-api/issues) de la propuesta y envíe ideas.

## Pruébelo

### Demostración

Pruebe la [demostración](https://goo.gle/demo-event-level-conversion-measurement-api). Asegúrese de seguir las instrucciones "Antes de comenzar".

Envíe un tweet a [@maudnals](https://twitter.com/maudnals?lang=en) o a [@ChromiumDev](https://twitter.com/ChromiumDev) para realizar cualquier pregunta sobre la demostración.

### Experimente con la API

Si planea experimentar con la API (localmente o con usuarios finales), consulte [Uso de la API para evaluar conversiones](/using-conversion-measurement).

### Comparta sus comentarios

**Sus comentarios son cruciales** para que las nuevas API para evaluar conversiones puedan ser compatibles con sus casos de uso y brindar una buena experiencia a los desarrolladores.

- Para informar un error en la implementación de Chrome, [abra un error](https://bugs.chromium.org/p/chromium/issues/entry?status=Unconfirmed&components=Internals%3EConversionMeasurement&description=Chrome%20Version%3A%20%28copy%20from%20chrome%3A%2F%2Fversion%29%0AOS%3A%20%28e.g.%20Win10%2C%20MacOS%2010.12%2C%20etc...%29%0AURLs%20%28if%20applicable%29%20%3A%0A%0AWhat%20steps%20will%20reproduce%20the%20problem%3F%0A%281%29%0A%282%29%0A%283%29%0A%0AWhat%20is%20the%20expected%20result%3F%0A%0A%0AWhat%20happens%20instead%3F%0A%0AIf%20applicable%2C%20include%20screenshots%2Finfo%20from%20chrome%3A%2F%2Fconversion-internals%20or%20relevant%20devtools%20errors.%0A).
- Para compartir comentarios y discutir casos de uso en la API de Chrome, cree un nuevo problema o participe en los existentes en el [repositorio de propuestas de la API](https://github.com/WICG/conversion-measurement-api/issues). Del mismo modo, puede analizar la API de WebKit/Safari y sus casos de uso en el [repositorio de propuestas de la API](https://github.com/privacycg/private-click-measurement/issues).
- Para discutir casos de uso de publicidad e intercambiar puntos de vista con expertos de la industria: únase al [Grupo empresarial para mejorar publicidad web](https://www.w3.org/community/web-adv/). Únase al [Grupo de la comunidad privada](https://www.w3.org/community/privacycg/) para discutir sobre la API de WebKit/Safari.

### Manténgase atento

- A medida que se recopilan los comentarios de los desarrolladores y los casos de uso, la API para evaluar conversiones de eventos evolucionará con el tiempo. Vea la propuesta del [repositorio de GitHub de](https://github.com/WICG/conversion-measurement-api/).
- Siga la evolución de la [API para evaluar conversiones agrupadas](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md) que complementará esta API.

*Muchas gracias por las contribuciones y comentarios a todos los revisores, especialmente a Charlie Harrison, John Delaney, Michael Kleber y Kayce Basques.*

*Imagen hero de William Warby/@wawarby editada en [Unsplash](https://unsplash.com/photos/WahfNoqbYnM).*
