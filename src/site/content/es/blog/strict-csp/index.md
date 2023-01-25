---
layout: post
title: Mitiga las secuencias de comandos entre sitios (XSS) con una política de seguridad de contenido (CSP) estricta
subhead: Cómo implementar un CSP basado en nonces de scripts o hashes como defensa en profundidad contra el scripting entre sitios.
description: |2

  Aprenda a implementar un CSP basado en nonces de scripts o hashes como defensa en profundidad

  contra las secuencias de comandos entre sitios.
authors:
  - lwe
date: 2021-03-15
hero: image/3lmWcR1VGYVMicNlBh4aZWBTcSg1/mhE0NYvP3JFyvNyiQ1dj.jpg
alt: Una captura de pantalla del código JavaScript que establece una política estricta de seguridad de contenido.
tags:
  - blog
  - security
---

## ¿Por qué deberías implementar una política de seguridad de contenido (CSP) estricta?

[Cross-site scripting (XSS)](https://www.google.com/about/appsecurity/learning/xss/) o secuencias de comandos en sitios cruzados, definida como la capacidad de inyectar scripts maliciosos en una aplicación web, ha sido una de las mayores vulnerabilidades de seguridad web durante más de una década.

[La Política de seguridad de contenido (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP) es una capa adicional de seguridad que ayuda a mitigar XSS. La configuración de un CSP implica agregar el encabezado HTTP Content-Security-Policy a una página web y establecer valores para controlar qué recursos puede cargar el agente de usuario para esa página. Este artículo explica cómo usar un CSP basado en nonces o hashes para mitigar XSS en lugar de los CSP basados en listas de permisos de host de uso común que a menudo dejan la página expuesta a XSS, ya que se pueden [omitir en la mayoría de las configuraciones](https://research.google.com/pubs/pub45542.html).

{% Aside 'key-term' %} Un *nonce* es un número aleatorio que se usa solo una vez y que se puede usar para marcar un `<script>` como confiable. {% endAside %}

{% Aside 'key-term' %} Una función hash es una función matemática que convierte un valor de entrada en un valor numérico comprimido: un hash. Se *puede usar un hash* (como [SHA-256](https://en.wikipedia.org/wiki/SHA-2) ) para marcar una etiqueta inline `<script>` como confiable. {% endAside %}

Una política de seguridad de contenido basada en nonces o hashes a menudo se denomina *CSP estricto* . Cuando una aplicación usa un CSP estricto, los atacantes que encuentran fallas en la inyección de HTML generalmente no podrán usarlos para forzar al navegador a ejecutar scripts maliciosos en el contexto del documento vulnerable. Esto se debe a que el CSP estricto solo permite scripts hash o scripts con el valor de nonce correcto generado en el servidor, por lo que los atacantes no pueden ejecutar el script sin conocer el nonce correcto para una respuesta determinada.

{% Aside %} Para proteger tu sitio de XSS, asegúrate de desinfectar la entrada del usuario *y* usa CSP como una capa de seguridad adicional. CSP es una [técnica de defensa en profundidad](https://en.wikipedia.org/wiki/Defense_in_depth_(computing)) que puede prevenir la ejecución de scripts maliciosos, pero no es un sustituto para evitar (y corregir rápidamente) errores XSS. {% endAside %}

### Por qué se recomienda un CSP estricto en lugar de los CSP de lista de permitidos

Si tu sitio ya tiene un CSP con este aspecto: `script-src www.googleapis.com`, ¡es posible que no sea eficaz contra las secuencias de comandos entre sitios (cross-site scripting)! Este tipo de CSP se denomina CSP de lista de permitidos y tiene un par de desventajas:

- Requiere mucha personalización.
- Se puede [omitir en la mayoría de las configuraciones](https://research.google.com/pubs/pub45542.html) .

Esto hace que los CSP de listas de permisos sean generalmente ineficaces para evitar que los atacantes exploten XSS. Es por eso que se recomienda utilizar un CSP estricto basado en nonces o hashes criptográficos, lo que evita las trampas descritas anteriormente.

<div class="switcher">{% Compare 'worse', 'Allowlist CSP' %}: no protege eficazmente su sitio. ❌ - Debe ser altamente personalizado. 😓 {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better', 'Strict CSP' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">Protege eficazmente su sitio. ✅</li>
<li data-md-type="list_item" data-md-list-type="unordered">Siempre tiene la misma estructura. 😌 {% endCompare %}</li>
</ul>
<div data-md-type="block_html"></div>

## ¿Qué es una política de seguridad de contenido estricta?

Una política de seguridad de contenido estricta tiene la siguiente estructura y se habilita configurando uno de los siguientes encabezados de respuesta HTTP:

- **CSP estricto basado en nonce**

```text
Content-Security-Policy:
  script-src 'nonce-{RANDOM}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';

```

{% Img src = "image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/er4BaGCJzBwDaESFKfZd.jpg", alt = "", width = "800", height = "279"%}

- **CSP estricto basado en hash**

```text
Content-Security-Policy:
  script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';

```

{% Aside warning %} Esta es la versión más simplificada de un CSP estricto. Deberás modificarlo para que sea efectivo en todos los navegadores. Consulta [agregar una alternativa para admitir Safari y navegadores más antiguos](#step-4:-add-fallbacks-to-support-safari-and-older-browsers) para obtener más detalles. {% endAside %}

Las siguientes propiedades hacen que un CSP como el anterior sea "estricto" y, por lo tanto, seguro:

- Utiliza nonces `'nonce-{RANDOM}'` o hashes `'sha256-{HASHED_INLINE_SCRIPT}'` para indicar qué `<script>` son confiables para el desarrollador del sitio y deben poder ejecutarse en el navegador del usuario.

- Establece [`'strict-dynamic'`](https://www.w3.org/TR/CSP3/#strict-dynamic-usage) para reducir el esfuerzo de implementar un CSP basado en hash o nonce al permitir automáticamente la ejecución de scripts creados por un script que ya es de confianza. Esto también desbloquea el uso de la mayoría de las bibliotecas y widgets de JavaScript de terceros.

- No se basa en listas de URL permitidas y, por lo tanto, no sufre omisiones de [CSP comunes](https://speakerdeck.com/lweichselbaum/csp-is-dead-long-live-strict-csp-deepsec-2016?slide=15).

- Bloquea scripts en línea que no son de confianza, como controladores de eventos en línea o `javascript:` URIs.

- Restringe `object-src` para deshabilitar complementos peligrosos como Flash.

- Restringe la `base-uri` para bloquear la inyección de etiquetas `<base>` Esto evita que los atacantes cambien la ubicación de los scripts cargados desde URL relativas.

{% Aside %} Otra ventaja de un CSP estricto es que el CSP siempre tiene la misma estructura y no es necesario personalizarlo para su aplicación. {% endAside %}

## Adopción de un CSP estricto

Para adoptar un CSP estricto, debes:

1. Decidir si tu aplicación debe establecer un CSP basado en hash o nonce.
2. Copia el CSP de la [sección ¿Qué es una política de seguridad de contenido estricta? Y configúralo](#what-is-a-strict-content-security-policy) como un encabezado de respuesta en tu aplicación.
3. Refactorizar las plantillas HTML y el código del lado del cliente para eliminar patrones que sean incompatibles con CSP.
4. Agregar alternativas para admitir Safari y navegadores más antiguos.
5. Implementar tu CSP.

Puedes utilizar la **auditoría de prácticas** [recomendadas Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) (v7.3.0 y superior con flag `--preset=experimental` ) a lo largo de este proceso para comprobar si tu sitio tiene un CSP y si es lo suficientemente estricto como para ser eficaz contra XSS.

{% Img src="image/9B7J9oWjgsWbuE84mmxDaY37Wpw2/42a4iEEKsD4T3yU47vNQ.png", alt="Lighthouse report warning that no CSP is found in enforcement mode.", width="730", height="78" %}

### Paso 1: Decide si necesitas un CSP basado en hash o en nonce

Hay dos tipos de CSP estrictos, basados en hash y basados en nonce. Así es como funcionan:

- **CSP basado en Nonce**: generas un número aleatorio *en tiempo de ejecución*, lo incluyes en tu CSP y lo asocias con cada etiqueta de secuencia de comandos en tu página. Un atacante no puede incluir y ejecutar un script malicioso en su página, porque necesitaría adivinar el número aleatorio correcto para ese script. Esto solo funciona si el número no se puede adivinar y se genera nuevamente en tiempo de ejecución para cada respuesta.
- **CSP basado en hash**: el hash de cada etiqueta de secuencia de comandos en línea se agrega al CSP. Ten en cuenta que cada secuencia de comandos tiene un hash diferente. Un atacante no puede incluir y ejecutar un script malicioso en tu página, porque el hash de ese script debería estar presente en tu CSP.

Criterios para elegir un enfoque de CSP estricto:

<div>
  <table>
      <caption>Criterios para elegir un enfoque de CSP estricto</caption>
      <thead>
      <tr>
        <th>CSP basado en Nonce</th>
        <td>Para páginas HTML renderizadas en el servidor donde puedes crear un nuevo token aleatorio (nonce) para cada respuesta.</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>CSP basado en hash</th>
        <td>Para páginas HTML servidas estáticamente o aquellas que necesitan ser almacenadas en caché. Por ejemplo, aplicaciones web de una sola página creadas con marcos como Angular, React u otros, que se sirven estáticamente sin renderizado del lado del servidor.</td>
      </tr>
    </tbody>
  </table>
</div>

### Paso 2: Establece un CSP estricto y prepara tus scripts

Al configurar un CSP, tienes algunas opciones:

- Modo de solo informe ( `Content-Security-Policy-Report-Only` ) o modo de aplicación (`Content-Security-Policy`). En el modo de solo informe, el CSP no bloqueará los recursos todavía, nada se romperá, pero podrá ver errores y recibir informes de lo que se habría bloqueado. Localmente, cuando estás en el proceso de configurar un CSP, esto realmente no importa, porque ambos modos te mostrarán los errores en la consola del navegador. En todo caso, el modo de aplicación te facilitará aún más ver los recursos bloqueados y modificar tu CSP, ya que tu página se verá rota. El modo de solo informe se vuelve más útil más adelante en el proceso (consulte el [Paso 5](#step-5:-deploy-your-csp) ).
- Encabezado o etiqueta HTML `<meta>`. Para el desarrollo local, una `<meta>` puede ser más conveniente para ajustar tu CSP y ver rápidamente cómo afecta tu sitio. Sin embargo:
    - Más adelante, al implementar tu CSP en producción, se recomienda configurarlo como un encabezado HTTP.
    - Si deseas configurar tu CSP en modo de solo informe, deberás configurarlo como un encabezado; las metaetiquetas de CSP no admiten el modo de solo informe.

<span id="nonce-based-csp"></span>

{% Details %}

{% DetailsSummary %} Opción A: CSP basado en Nonce {% endDetailsSummary %}

Establece el siguiente encabezado de respuesta HTTP `Content-Security-Policy`

```text
Content-Security-Policy:
  script-src 'nonce-{RANDOM}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

{% Aside 'caution' %}

Reemplaza el marcador de posición `{RANDOM}` *con un nonce aleatorio* que se regenera **en cada respuesta del servidor**. {% endAside %}

#### Generar un nonce para CSP

Un nonce es un número aleatorio que se usa solo una vez por carga de página. Un CSP basado en nonce solo puede mitigar XSS si un atacante **no puede adivinar el valor de nonce.** Un nonce para CSP debe ser:

- Un **valor aleatorio** criptográficamente fuerte (idealmente 128+ bits de longitud)
- Recién **generado para cada respuesta**
- Codificado en Base64

A continuación, se muestran algunos ejemplos sobre cómo agregar un nonce CSP en marcos del lado del servidor:

- [Django (pitón)](https://django-csp.readthedocs.io/en/latest/nonce.html)
- Express (JavaScript):

```javascript
const app = express();
app.get('/', function(request, response) {
    // Generate a new random nonce value for every response.
    const nonce = crypto.randomBytes(16).toString("base64");
    // Set the strict nonce-based CSP response header
    const csp = `script-src 'nonce-${nonce}' 'strict-dynamic' https:; object-src 'none'; base-uri 'none';`;
    response.set("Content-Security-Policy", csp);
    // Every <script> tag in your application should set the `nonce` attribute to this value.
    response.render(template, { nonce: nonce });
  });
}
```

#### Agregar un `nonce` a los elementos `<script>`

Con un CSP basado en nonce, cada `<script>` debe tener un `nonce` que coincida con el valor nonce aleatorio especificado en el encabezado del CSP (todos los scripts pueden tener el mismo nonce). El primer paso es agregar estos atributos a todos los scripts:

{% Compare 'worse', 'Blocked by CSP'%}

```html
<script src="/path/to/script.js"></script>
<script>foo()</script>
```

{% CompareCaption %} CSP bloqueará estos scripts porque no tienen atributos `nonce` {% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Allowed by CSP' %}

```html
<script nonce="${NONCE}" src="/path/to/script.js"></script>
<script nonce="${NONCE}">foo()</script>
```

{% CompareCaption %} CSP permitirá la ejecución de estos scripts si `${NONCE}` se reemplaza con un valor que coincida con el nonce en el encabezado de respuesta de CSP. Ten en cuenta que algunos navegadores ocultarán el `nonce` al inspeccionar la fuente de la página. {% endCompareCaption %}

{% endCompare %}

{% Aside 'gotchas' %} Con `'strict-dynamic'` en su CSP, solo tendrá que agregar nonces a las `<script>` que están presentes en la respuesta HTML inicial. `'strict-dynamic'` permite la ejecución de scripts añadidos dinámicamente a la página, siempre que hayan sido cargados por un script seguro y de confianza (consulte la [especificación](https://www.w3.org/TR/CSP3/#strict-dynamic-usage) ). {% endAside %}

{% endDetails %}

<span id="hash-based-csp"></span>

{% Details %}

{% DetailsSummary %} Opción B: Encabezado de respuesta de CSP basado en hash {% endDetailsSummary %}

Establece el siguiente encabezado de respuesta HTTP `Content-Security-Policy`

```text
Content-Security-Policy:
  script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

Para varios scripts en línea, la sintaxis es la siguiente: `'sha256-{HASHED_INLINE_SCRIPT_1}' 'sha256-{HASHED_INLINE_SCRIPT_2}'` .

{% Aside 'caution' %} El `{HASHED_INLINE_SCRIPT}` debe reemplazarse con un hash SHA-256 codificado en base64 de una secuencia de comandos en línea que se puede usar para cargar otras secuencias de comandos (consulta la siguiente sección). Puedes calcular hashes SHA de `<script>` estáticos en línea con esta [herramienta](https://strict-csp-codelab.glitch.me/csp_sha256_util.html). Una alternativa es inspeccionar las advertencias de violación de CSP en la consola de desarrollador de Chrome, que contiene hashes de scripts bloqueados, y agregar estos hashes a la política como 'sha256-…'.

Una secuencia de comandos inyectada por un atacante será bloqueada por el navegador, ya que solo la secuencia de comandos en línea con hash y cualquier secuencia de comandos que agregue dinámicamente podrán ejecutarse por el navegador. {% endAside %}

#### Cargar scripts de origen dinámicamente

Todas las secuencias de comandos de origen externo deben cargarse dinámicamente a través de una secuencia de comandos en línea, ya que los hashes CSP sólo son compatibles con los navegadores para las secuencias de comandos en línea (los hashes para las secuencias de comandos de origen [no son compatibles con los navegadores](https://wpt.fyi/results/content-security-policy/script-src/script-src-sri_hash.sub.html?label=master&label=experimental&aligned)).

{% Img src = "image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/B2YsfJDYw8PRI6kJI7Bs.jpg", alt = "", width = "800", height = "333"%}

{% Compare 'worse', 'Blocked by CSP' %}

```html
<script src="https://example.org/foo.js"></script>
<script src="https://example.org/bar.js"></script>
```

{% CompareCaption %} CSP bloqueará estas secuencias de comandos, ya que solo se pueden aplicar hash a las secuencias de comandos en línea. {% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Allowed by CSP' %}

```html
<script>
var scripts = [ 'https://example.org/foo.js', 'https://example.org/bar.js'];
scripts.forEach(function(scriptUrl) {
  var s = document.createElement('script');
  s.src = scriptUrl;
  s.async = false; // to preserve execution order
  document.head.appendChild(s);
});
</script>
```

{% CompareCaption %} Para permitir la ejecución de esta secuencia de comandos, el hash de la secuencia de comandos en línea debe calcularse y agregarse al encabezado de respuesta de CSP, reemplazando el marcador de posición `{HASHED_INLINE_SCRIPT}`. Para reducir la cantidad de hashes, opcionalmente puedes combinar todos los scripts en línea en un solo script. Para ver esto en la práctica, consulta el [ejemplo](https://strict-csp-codelab.glitch.me/solution_hash_csp#) y examine el [código](https://glitch.com/edit/#!/strict-csp-codelab?path=demo%2Fsolution_hash_csp.html%3A1%3A). {% endCompareCaption %}

{% endCompare %}

{% Aside 'gotchas' %} Al calcular un hash CSP para scripts en línea, los caracteres de espacio en blanco entre las etiquetas de apertura y cierre `<script>` son importantes. Puedes calcular hashes CSP para scripts en línea usando esta [herramienta](https://strict-csp-codelab.glitch.me/csp_sha256_util.html). {% endAside %}

{% Details %}

{% DetailsSummary %} Acerca de `async = false` y la carga de scripts `async = false` no bloquea en este caso, pero utilízalo con cuidado. {% endDetailsSummary %}

En el fragmento de código anterior, se añade `s.async = false` para garantizar que foo se ejecute antes que bar (incluso si bar se carga primero). <strong data-md-type="double_emphasis">En este fragmento, `s.async = false` no bloquea el analizador mientras se cargan los scripts</strong>; eso es porque los scripts se agregan dinámicamente. El analizador solo se detendrá mientras se ejecutan los scripts, tal como se comportaría con los scripts `async`. Sin embargo, con este fragmento, ten en cuenta:

- Uno o ambos scripts pueden ejecutarse antes de que el documento haya terminado de descargarse. Si deseas que el documento esté listo para cuando se ejecuten los scripts, debes esperar al [evento `DOMContentLoaded`](https://developer.mozilla.org/docs/Web/API/Window/DOMContentLoaded_event) antes de agregar los scripts. Si esto causa un problema de rendimiento (porque los scripts no comienzan a descargarse lo suficientemente temprano), puedes usar [etiquetas de precarga](https://developer.mozilla.org/docs/Web/HTML/Preloading_content) anteriormente en la página.
- `defer = true` no hará nada. Si necesitas ese comportamiento, tendrás que ejecutar manualmente el script en el momento en que desees ejecutarlo. {% endDetails %}

{% endDetails %}

### Paso 3: Refactoriza las plantillas HTML y el código del lado del cliente para eliminar patrones incompatibles con CSP

Los controladores de eventos en línea (como `onclick="…"`, `onerror="…"` ) y los URI de JavaScript ( `<a href="javascript:…">` ) se pueden utilizar para ejecutar scripts. Esto significa que un atacante que encuentre un error XSS podría inyectar este tipo de HTML y ejecutar JavaScript malicioso. Un CSP basado en hash o nonce no permite el uso de dicho marcado. Si tu sitio utiliza alguno de los patrones descritos anteriormente, deberás refactorizarlos en alternativas más seguras.

Si habilitaste CSP en el paso anterior, podrás ver las infracciones de CSP en la consola cada vez que CSP bloquee un patrón incompatible.

{% Img src = "image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/mRWfNxAhQXzInOLCgtv8.jpg", alt = "Informes de infracción de CSP en la consola de desarrollador de Chrome.", width = "800", height = "235"%}

En la mayoría de los casos, la solución es sencilla:

#### Para refactorizar los controladores de eventos en línea, vuelve a escribirlos para agregarlos desde un bloque de JavaScript

{% Compare 'worse', 'Blocked by CSP' %}

```html
<span onclick="doThings();">A thing.</span>
```

{% CompareCaption %} CSP bloqueará los controladores de eventos en línea. {% endCompareCaption%}

{% endCompare %}

{% Compare 'better', 'Allowed by CSP' %}

```html
<span id="things">A thing.</span>
<script nonce="${nonce}">
  document.getElementById('things')
          .addEventListener('click', doThings);
</script>
```

{% CompareCaption %} CSP permitirá controladores de eventos que se registren a través de JavaScript. {% endCompareCaption %}

{% endCompare %}

#### Para `javascript:` URIs, puedes usar un patrón similar

{% Compare 'worse', 'Blocked by CSP' %}

```html
<a href="javascript:linkClicked()">foo</a>
```

{% CompareCaption %} CSP bloqueará javascript: URIs. {% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Allowed by CSP' %}

```html
<a id="foo">foo</a>
<script nonce="${nonce}">
  document.getElementById('foo')
          .addEventListener('click', linkClicked);
</script>
```

{% CompareCaption %} CSP permitirá controladores de eventos que se registren a través de JavaScript. {% endCompareCaption %}

{% endCompare %}

#### Uso de `eval()` en JavaScript

Si tu aplicación usa `eval()` para convertir las serializaciones de cadenas JSON en objetos JS, debes refactorizar dichas instancias a `JSON.parse()`, que también es [más rápido](https://v8.dev/blog/cost-of-javascript-2019#json).

Si no puede eliminar todos los usos de `eval()`, aún puedes establecer un CSP estricto basado en nonce, pero tendrás que usar `'unsafe-eval'` que hará que tu política sea un poco menos segura.

Puedes encontrar estos y más ejemplos de refactorización de este tipo en este estricto CSP Codelab: {% Glitch {id: 'strict-csp-codelab', path: 'demo/solution_nonce_csp.html', highlights: '14,20,28,39,40,41,42,43,44,45,54,55,56,57,58,59,60', previewSize: 35, allow: [] } %}

### Paso 4: Agrega alternativas para admitir Safari y navegadores más antiguos

CSP es compatible con todos los navegadores principales, pero necesitará dos alternativas:

- El uso de `'strict-dynamic'` requiere agregar `https:` como respaldo para Safari, el único navegador importante sin soporte para `'strict-dynamic'`. Al hacerlo:

    - Todos los navegadores que admiten `'strict-dynamic'` ignorarán `https:` fallback, por lo que esto no reducirá la solidez de la política.
    - En Safari, los scripts de fuentes externas solo podrán cargarse si provienen de un origen HTTPS. Esto es menos seguro que un CSP estricto, es una alternativa, pero aún evitaría ciertas causas comunes de XSS como inyecciones de `javascript:` URIs porque `'unsafe-inline'` no está presente o se ignora en presencia de un hash o un nonce.

- Para garantizar la compatibilidad con versiones de navegador muy antiguas (más de 4 años), puedes agregar `'unsafe-inline'` como respaldo. Todos los navegadores recientes ignorarán `'unsafe-inline'` si hay un código de acceso o un hash de CSP.

```text
Content-Security-Policy:
  script-src 'nonce-{random}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

{% Aside %} `https:` y `unsafe-inline` no hacen que tu política sea menos segura porque serán ignorados por los navegadores que admiten `strict-dynamic`. {% endAside %}

### Paso 5: Implementa tu CSP

Después de confirmar que CSP no está bloqueando scripts legítimos en tu entorno de desarrollo local, puedes continuar con la implementación de tu CSP en su (puesta en escena, luego) entorno de producción:

1. (Opcional) Implementa tu CSP en modo de solo informe mediante el `Content-Security-Policy-Report-Only`. Puedes obtener más información sobre la [API de informes](/reporting-api/). El modo de solo informe es útil para probar un cambio potencialmente importante como un nuevo CSP en producción, antes de aplicar las restricciones de CSP. En el modo de solo informe, tu CSP no afecta el comportamiento de tu aplicación (nada realmente se romperá). Pero el navegador seguirá generando errores de consola e informes de infracción cuando se encuentren patrones incompatibles con CSP (para que pueda ver lo que habría fallado para sus usuarios finales).
2. Una vez que estés seguro de que tu CSP no provocará daños para tus usuarios finales, implementa tu CSP utilizando el encabezado de respuesta `Content-Security-Policy` **Solo una vez que hayas completado este paso, CSP comenzará a proteger tu aplicación de XSS**. Configurar tu CSP a través de un encabezado HTTP del lado del servidor es más seguro que configurarlo como una etiqueta `<meta>`; usa un encabezado si puedes.

{% Aside 'gotchas' %} Asegúrate de que el CSP que estás utilizando sea "estricto" verificándolo con el [evaluador de CSP](https://csp-evaluator.withgoogle.com) o Lighthouse. Esto es muy importante, ya que incluso pequeños cambios en una política pueden reducir significativamente tu seguridad. {% endAside %}

{% Aside 'caution' %} Al habilitar CSP para el tráfico de producción, es posible que veas algo de ruido en los informes de infracción de CSP debido a extensiones de navegador y malware. {% endAside %}

## Limitaciones

En términos generales, un CSP estricto proporciona una fuerte capa adicional de seguridad que ayuda a mitigar XSS. En la mayoría de los casos, CSP reduce significativamente la superficie de ataque (patrones peligrosos como `javascript:` URIs están completamente desactivados). Sin embargo, según el tipo de CSP que estés utilizando (nonces, hashes, con o sin `'strict-dynamic'`), hay casos en los que CSP no protege:

- Si ingresas un script, pero hay una inyección directamente en el cuerpo o en el `src` de ese elemento `<script>`.
- Si hay inyecciones en las ubicaciones de scripts creados dinámicamente (`document.createElement('script')` ), incluso en cualquier función de biblioteca que cree `script` basados en el valor de sus argumentos. Esto incluye algunas API comunes como `.html()` jQuery, así como `.get()` y `.post()` en jQuery &lt;3.0.
- Si hay inyecciones de plantilla en aplicaciones antiguas de AngularJS. Un atacante que pueda inyectar una plantilla AngularJS puede usarla para [ejecutar JavaScript arbitrario](https://sites.google.com/site/bughunteruniversity/nonvuln/angularjs-expression-sandbox-bypass).
- Si la política contiene `'unsafe-eval'`, inyecciones en `eval()`, `setTimeout()` y algunas otras API de uso poco frecuente.

Los desarrolladores y los ingenieros de seguridad deben prestar especial atención a estos patrones durante las revisiones de código y las auditorías de seguridad. Puedes encontrar más detalles sobre los casos descritos anteriormente en [esta presentación de CSP](https://static.sched.com/hosted_files/locomocosec2019/db/CSP%20-%20A%20Successful%20Mess%20Between%20Hardening%20and%20Mitigation%20%281%29.pdf#page=27).

{% Aside %} Trusted Types complementa muy bien el CSP estricto y puedes proteger de manera eficiente contra algunas de las limitaciones enumeradas anteriormente. Puedes obtener más información sobre [cómo utilizar Trusted Types en web.dev](/trusted-types). {% endAside %}

## Otras lecturas

- [La CSP ha muerto, ¡viva la CSP! Sobre la inseguridad de las listas blancas y el futuro de la política de seguridad del contenido](https://research.google/pubs/pub45542/)
- [Evaluador de CSP](https://csp-evaluator.withgoogle.com/)
- [Conferencia LocoMoco: Política de seguridad de contenido: un lío exitoso entre el endurecimiento y la mitigación](https://static.sched.com/hosted_files/locomocosec2019/db/CSP%20-%20A%20Successful%20Mess%20Between%20Hardening%20and%20Mitigation%20%281%29.pdf)
- [Charla de I/O de Google: protección de aplicaciones web con funciones de plataforma modernas](https://webappsec.dev/assets/pub/Google_IO-Securing_Web_Apps_with_Modern_Platform_Features.pdf)
