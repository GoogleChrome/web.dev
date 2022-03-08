---
title: Explicación de las cookies de SameSite
subhead: Mantenga protegido su sitio aprendiendo a establecer explícitamente sus cookies entre sitios.
authors:
  - rowan_m
date: 2019-05-07
updated: 2020-05-28
hero: image/admin/UTOC41rgCccAqVNbJlyK.jpg
description: Aprenda a marcar sus cookies para uso propio y de terceros con el atributo SameSite. Tambén puede mejorar la seguridad de su sitio utilizando los valores Lax y Strict de SameSite para mejorar la protección contra ataques de tipo CSRF. Especificar el nuevo atributo None le permite marcar explícitamente sus cookies para usarlas entre varios sitios.
tags:
  - blog
  - security
  - cookies
  - chrome-80
feedback:
  - api
---

{% Aside %} Este artículo es parte de una serie de artículos que hablan sobre los cambios en los atributos para cookies de `SameSite`

- [Explicación sobre las cookies de SameSite](/samesite-cookies-explained/)
- [Recetas para usar las cookies en SameSite](/samesite-cookie-recipes/)
- [Esquema en el mismo sitio](/schemeful-samesite) {% endAside %}

Las cookies son uno de los métodos disponibles para agregar un estado persistente a los sitios web. A lo largo de los años, sus capacidades han crecido y evolucionado significativamente, pero también dejaron algunos problemas heredados importantes en la plataforma. Para solucionar esta situación, los navegadores (incluidos Chrome, Firefox y Edge) están modificando su comportamiento a fin de hacer cumplir más valores predeterminados que ayuden a preservar la privacidad.

Cada cookie consiste en un par de variables `key=value` que incluyen una serie de atributos, los cuales controlan cuándo y dónde se utiliza esa cookie en particular. Probablemente ya haya usado estos atributos para establecer cosas como fechas de vencimiento o indicar que la cookie solo debe enviarse a través de HTTPS. Los servidores establecen las cookies cuando envían el encabezado `Set-Cookie` apropiado en su respuesta. Para obtener más información sobre este tema, puede consultar la extensión [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1), pero aquí encontrará un resumen rápido.

Supongamos que tiene un blog en el que desea mostrar un promocional de "Novedades" a sus usuarios. Los usuarios pueden ignorar el promocional y entonces no lo volverán a ver por un tiempo. Sin embargo, usted puede almacenar esa preferencia en una cookie, configurarla para que caduque en un mes (2,600,000 segundos) y solo enviarla a través de HTTPS. Ese encabezado se vería de la siguiente manera:

```text
Set-Cookie: promo_shown=1; Max-Age=2600000; Secure
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jJ1fqcsAk9Ig3hManFBO.png", alt="Se envían tres cookies a un navegador desde la respuesta contenida en un servidor", width="800", height="276", style="max-width: 35vw" %} <figcaption> Los servidores deben establecer las cookies mediante el encabezado <code>Set-Cookie</code>. </figcaption></figure>

Cuando su lector vea una página que cumpla con esos requisitos, es decir, se encuentra en una conexión segura y la cookie tiene menos de un mes de antigüedad, entonces su navegador enviará el siguiente encabezado en su solicitud:

```text
Cookie: promo_shown=1
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rq21WQpOZFvfgS9bbjmc.png", alt="Se envían tres cookies desde un navegador a un servidor mediante una solicitud", width="800", height="165", style="max-width: 35vw" %} <figcaption> Su navegador devuelve las cookies con el encabezado <code>Cookie</code>.</figcaption></figure>

También puede agregar y leer las cookies disponibles para ese sitio en JavaScript usando `document.cookie` . Hacer una asignación hacia `document.cookie` creará o anulará una cookie con esa clave. Por ejemplo, intente hacer lo siguiente en la consola JavaScript de su navegador:

```text
→ document.cookie = "promo_shown=1; Max-Age=2600000; Secure"
← "promo_shown=1; Max-Age=2600000; Secure"
```

La lectura de `document.cookie` generará todas las cookies a las que se tiene acceso en el contexto actual, donde cada cookie estará separada por un punto y coma:

```text
→ document.cookie;
← "promo_shown=1; color_theme=peachpuff; sidebar_loc=left"
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mbV00Gy5VAPTUls0i7cM.png", alt="JavaScript tiene acceso a las cookies dentro del navegador", width="600", height="382", style="max-width: 35vw" %} <figcaption> JavaScript puede acceder a las cookies mediante <code>document.cookie</code>. </figcaption></figure>

Si prueba esto en una selección de sitios populares, notará que la mayoría de ellos establecen significativamente más de tres cookies. En la mayoría de los casos, esas cookies se envían a ese dominio a partir de cada solicitud, lo cual tiene varias implicaciones. El ancho de banda que se emplea para la carga suele estar más restringido para sus usuarios que la descarga, de modo que la sobrecarga en todas las solicitudes que salen agrega un retraso en el tiempo que transcurre hasta llegar al primer byte. Por este motivo, sugerimos que sea conservador en la cantidad y el tamaño de las cookies que establezca. Utilice el atributo `Max-Age` para garantizar que las cookies no permanezcan más tiempo del necesario.

## ¿Qué son las cookies propias y de terceros?

Si regresa a la misma selección de sitios que veía antes, probablemente notó que había cookies para una gran variedad de dominios, no solo el que visitaba en ese momento. A las cookies que coinciden con el dominio del sitio actual, es decir, el que se muestra en la barra de direcciones del navegador, se les conoce como **cookies propias**. De manera similar, las cookies cuyos dominios son distintos al del sitio que se visita en ese momento se denominan cookies de **terceros**. Esta no es una una forma para denominarlas que pueda usarse en todos los casos, pero es relativa al contexto del usuario. Es decir, la misma cookie puede ser propia o de terceros, según el sitio donde se encuentre el usuario en ese momento.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zjXpDz2jAdXMT83Nm3IT.png", alt="Se envían tres cookies a un navegador desde diferentes solicitudes en la misma página", width="800", height="346", style="max-width: 35vw" %}
  <figcaption>
    Las cookies pueden provenir de una gran variedad de dominios diferentes en una misma página.
  </figcaption>
</figure>

Para continuar con el ejemplo anterior, digamos que una de las publicaciones de su blog tiene la imagen de un gato particularmente asombroso y está alojada en `/blog/img/amazing-cat.png` . Debido a que es una imagen bastante sorprendente, otra persona la usa directamente en su sitio. Si un visitante estuvo en su blog y tiene la cookie `promo_shown` , cuando vea la imagen `amazing-cat.png` en el sitio de la otra persona, esa cookie **se enviará** en la solicitud de esa imagen. Esto no es particularmente útil para nadie, ya que `promo_shown` no se usa de ninguna forma en el sitio de esta otra persona, solo agrega una forma de sobrecargar la solicitud.

Si ese es un efecto no deseado, ¿por qué querría hacer eso? Este es el mecanismo que permite a los sitios mantener su estado cuando se utilizan en un contexto de terceros. Por ejemplo, si inserta un video de YouTube en su sitio, los visitantes verán la opción "Ver más tarde" en el reproductor. Si su visitante ya inició sesión en YouTube, esa sesión estará disponible en el reproductor integrado mediante una cookie de terceros, lo cual significa que el botón "Ver más tarde" simplemente guardará el video, en lugar de pedirle que inicie sesión o sea necesario que navegue fuera de su página y regrese de nuevo a YouTube.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/u9chHBLm3i27yFRwHx5W.png", alt="La misma cookie se envía en tres contextos diferentes", width="800", height="433", style="max-width: 35vw" %} <figcaption> Cuando visita diferentes páginas se envía una cookie en el contexto de terceros. </figcaption></figure>

Una de las propiedades culturales de la web es que tiende a estar abierta de forma predeterminada. Esto es parte de lo que ha hecho posible que muchas personas creen allí su propio contenido y aplicaciones. Sin embargo, esto también ha generado una serie de problemas relacionados con la seguridad y la privacidad. Los ataques de falsificación de solicitudes entre sitios (CSRF) se basan en el hecho de que las cookies se adjuntan a cualquier solicitud con un origen determinado, sin importar quién inicie la solicitud. Por ejemplo, si visita `evil.example`, esto puede desencadenar solicitudes en `your-blog.example`, y su navegador adjuntará con gusto las cookies asociadas. Si su blog no tiene cuidado con la forma en que valida esas solicitudes, entonces la visita a `evil.example` podría desencadenar acciones como la eliminación de publicaciones o la adición de su propio contenido.

Además, los usuarios cada vez son más conscientes sobre cómo se pueden utilizar las cookies para realizar un seguimiento de la actividad en varios sitios. Sin embargo, hasta ahora no ha habido una forma de indicar explícitamente cuál es su intención con la cookie. La cookie `promo_shown` solo debe enviarse en un contexto propio, mientras que una cookie de sesión para un widget que esté destinada a incrustarse en otros sitios, se coloca allí de manera intecional para proporcionar el estado de inicio de sesión en un contexto de terceros.

## Indique explícitamente el uso de las cookies con el atributo `SameSite`

La introducción del atributo `SameSite` (como se definió en la extensión [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00) ), le permite declarar si su cookie debe restringirse a un contexto propio o del mismo sitio. Es útil comprender exactamente lo que significa "sitio" en este contexto. El sitio es una combinación entre el sufijo del dominio y la parte del dominio que se encuentra justo antes de él. Por ejemplo, el dominio `www.web.dev` es parte del sitio `web.dev`.

{% Aside 'key-term' %}

Si el usuario está en `www.web.dev` y solicita una imagen de `static.web.dev`, entonces esa es una solicitud **same-site**.

{% endAside %}

La [lista de sufijos públicos](https://publicsuffix.org/) define esto, por lo que no se trata solo de dominios de nivel superior como `.com` sino que también incluye servicios como `github.io` . Eso permite que `your-project.github.io` y `my-project.github.io` se consideren como sitios separados.

{% Aside 'key-term' %}

Si el usuario está en `your-project.github.io` y solicita una imagen de `my-project.github.io` esa es una solicitud **cross-site**.

{% endAside %}

La introducción del atributo `SameSite` en una cookie proporciona tres formas diferentes de controlar este comportamiento. Puede optar por no especificar el atributo, o puede utilizar `Strict` o `Lax` para limitar dicha cookie a las solicitudes same-site.

Si configura `SameSite` en `Strict` , su cookie solo se enviará en un contexto propio. En términos del usuario, la cookie solo se enviará si el sitio de la cookie coincide con el sitio que se muestra actualmente en la barra URL del navegador. Entonces, si la cookie `promo_shown` se establece de la siguiente manera:

```text
Set-Cookie: promo_shown=1; SameSite=Strict
```

Cuando el usuario esté en su sitio, la cookie se enviará con la solicitud tal y como se esperaba. Sin embargo, al seguir un enlace a su sitio, digamos desde otro sitio o mediante el correo electrónico de un amigo, en esa solicitud inicial no se enviará la cookie. Esto es bueno cuando tiene cookies relacionadas con la funcionalidad, las cuales siempre estarán detrás de una navegación inicial, como cambiar una contraseña o realizar una compra, pero es demasiado restrictiva para la cookie `promo_shown` . Si su lector sigue el enlace que aparece en el sitio, entonces quiere que se le envíe la cookie para que puedan aplicarse sus preferencias.

Ahí es donde `SameSite=Lax` entra en juego al permitir que la cookie se envíe con esta navegación de nivel superior. Revisemos el ejemplo del artículo sobre los gatos que mencionamos anteriormente, donde otro sitio hace referencia a su contenido. Ellos utilizan directamente su foto del gato y proporcionan un enlace hacia su artículo original.

```html
<p>Look at this amazing cat!</p>
<img src="https://blog.example/blog/img/amazing-cat.png" />
<p>Read the <a href="https://blog.example/blog/cat.html">article</a>.</p>
```

Y la cookie se configuró de esta manera:

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

Cuando el lector esté en el blog de la otra persona, la cookie **no se enviará** en el momento en que el navegador solicite la imagen `amazing-cat.png`. Sin embargo, cuando el lector siga el enlace hacia `cat.html` en su blog, esa solicitud **incluirá** la cookie. Esto hace que `Lax` sea una buena opción para las cookies que afectan la visualización del sitio con `Strict`, debido a que es útil para las cookies relacionadas con las acciones que efectúa su usuario.

{% Aside 'caution' %}

Ni `Strict` ni `Lax` son una solución integral para mantener la seguridad de su sitio. Las cookies se envían como parte de las solicitudes del usuario y debe tratarlas de la misma forma en que lo haría con cualquier otra entrada de él. Eso significa que debe desinfectar y validar la entrada. Nunca utilice una cookie para almacenar datos que considere un secreto del lado del servidor.

{% endAside %}

Finalmente existe la opción de no especificar el valor, que hasta el momento era la forma de indicar implícitamente que la cookie debe enviarse en todos los contextos. En el último borrador de la extensión [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03) esto se hace explícito al introducir un nuevo valor para `SameSite=None`. De modo que puede usar `None` para comunicar claramente que la cookie debe enviarse intencionalmente en un contexto de terceros.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1MhNdg9exp0rKnHpwCWT.png", alt="Las tres cookies se etiquetaron como None, Lax, o Strict dependiendo de su contexto", width="800", height="456", style="max-width: 35vw" %} <figcaption> El contexto de una cookie se indica explícitamente como <code>None</code>, <code>Lax</code>, o <code>Strict</code>. </figcaption></figure>

{% Aside %}

Si proporciona un servicio que otros sitios consumen, como widgets, contenido incrustado, programas para afiliados, publicidad o inicios de sesión en varios sitios, debe usar `None` para asegurarse de que su intención sea clara.

{% endAside %}

## Cambios en el comportamiento predeterminado cuando no se usa SameSite

Si bien el atributo `SameSite` cuenta con bastante apoyo, desafortunadamente no tuvo demasiada aceptación por parte de los desarrolladores. La configuración abierta en la que se envían cookies a todas partes de forma predeterminada implica que todos los casos de uso funcionan, pero se deja vulnerable al usuario ante los CSRF y a las fugas de información de manera involuntaria. Para alentar a los desarrolladores a manifestar su intención y brindarles a los usuarios una experiencia más segura, la propuesta de IETF, [Incrementally Better Cookies](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00), establece dos cambios fundamentales:

- Las cookies que no tienen un atributo `SameSite` se tratarán como `SameSite=Lax` .
- Las cookies con `SameSite=None` también deben especificar a `Secure`, esto significa que requieren de un contexto seguro.

Chrome implementa estos comportamientos predeterminados a partir de la versión 84. En [Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ) están disponibles para probarlos a partir de la versión Firefox 69 y, en el futuro, los convertirá en comportamientos predeterminados. Para probar estos comportamientos en Firefox, abra [`about:config`](http://kb.mozillazine.org/About:config) y configure `network.cookie.sameSite.laxByDefault`. [Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) también planea cambiar sus comportamientos predeterminados.

{% Aside %}

Este artículo se actualizará a medida que los navegadores adicionales anuncien su compatibilidad.

{% endAside %}

### Cuando `SameSite=Lax` se encuentra de forma predeterminada

{% Compare 'worse', 'No attribute set' %}

```text
Set-Cookie: promo_shown=1
```

{% CompareCaption %}

Si envía una cookie sin especificar ningún atributo `SameSite`

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Default behavior applied' %}

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

{% CompareCaption %}

El navegador tratará esa cookie como si se hubiera especificado `SameSite=Lax`.

{% endCompareCaption %}

{% endCompare %}

Si bien la intención es implementar un valor predeterminado más seguro, lo ideal sería establecer un atributo `SameSite` de manera explícita en vez de confiar en que el navegador lo aplicará por usted. Esto hace que su intención para la cookie sea explícita y aumenta la probabilidad de tener una experiencia uniforme en todos los navegadores.

{% Aside 'caution' %}

El comportamiento predeterminado que implementó Chrome es un poco más permisivo que un `SameSite=Lax` explícito, pues permitirá que ciertas cookies se envíen en las solicitudes POST de nivel superior. Puede ver los detalles exactos en [el anuncio de blink-dev](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/YKBxPCScCwAJ). La intención de estas medidas es convertirse en una mitigación temporal, sin embargo, aún debe corregir sus cookies entre sitios para usar `SameSite=None; Secure`.

{% endAside %}

### El atributo `SameSite=None` debe ser seguro

{% Compare 'worse', 'Rejected' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None
```

{% CompareCaption %}

Cuando la cookie se establezca sin el atributo `Secure` **&nbsp;será rechazada.**

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Accepted' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

{% CompareCaption %}

Debe asegurarse de conjuntar a `SameSite=None` con el atributo `Secure`.

{% endCompareCaption %}

{% endCompare %}

Puede probar este comportamiento a partir de la versión Chrome 76 si habilita `about://flags/#cookies-without-same-site-must-be-secure`, y desde Firefox 69 en [`about:config`](http://kb.mozillazine.org/About:config) al configurar `network.cookie.sameSite.noneRequiresSecure`.

Es necesario que lo aplique cuando configure nuevas cookies y en caso de que quiera actualizar de manera activa las cookies ya existentes, incluso si estas no están cerca de su fecha de vencimiento.

{% Aside 'note' %}

Si confía en algún servicio que proporcione contenido de terceros en su sitio, también debe verificar con dicho proveedor que sus servicios se actualizan continuamente. Es posible que usted también deba actualizar sus dependencias o fragmentos para garantizar que su sitio acepta el nuevo comportamiento.

{% endAside %}

Ambos cambios son compatibles con las versiones previas de los navegadores que implementaron correctamente la versión anterior del atributo `SameSite`, o que simplemente no lo implementaron en absoluto. Al aplicar estos cambios a sus cookies, hace explícito el uso que se tenía previsto de las mismas, en lugar de confiar en el comportamiento predeterminado del navegador. Del mismo modo, cualquier cliente que no reconozca a `SameSite=None` hasta este momento debería ignorarlo y continuar como si el atributo no se hubiera establecido.

{% Aside 'warning' %}

Varias versiones antiguas de los navegadores, entre los que se incluyen Chrome, Safari y UC, no son compatibles con el nuevo atributo `None` y pueden ignorar o restringir la cookie. Este comportamiento se corrige en las versiones actuales, pero es necesario que compruebe su tráfico para determinar qué proporción de sus usuarios se ven afectados. Puede ver la [lista de clientes conocidos que no son compatibles en el sitio de Chromium](https://www.chromium.org/updates/same-site/incompatible-clients).

{% endAside %}

## Recetas para usar las cookies en `SameSite`

Si desea obtener más información sobre la manera exacta para actualizar sus cookies e implementar con éxito estos cambios en `SameSite=None`, así como la diferencia en el comportamiento del navegador, vaya al artículo de seguimiento, [Recetas para usar las cookies en SameSite](/samesite-cookie-recipes).

_Me gustaría agradecer a Lily Chen, Malte Ubl, Mike West, Rob Dodson, Tom Steiner y Vivek Sekhar por todas sus contribuciones y valiosos comentarios._

_Imagen Cookie hero realizada por [Pille-Riin Priske](https://unsplash.com/photos/UiP3uF5JRWM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) en [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_
