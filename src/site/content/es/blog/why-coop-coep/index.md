---
title: Por qué necesita un "origen cruzado aislado" para funciones potentes
subhead: |
  Descubra por qué es necesario el aislamiento de origen cruzado para utilizar funciones potentes como
  `SharedArrayBuffer`,` performance.measureUserAgentSpecificMemory () `y temporizador de alta resolución con mejor precisión.
description: |
  Algunas API web aumentan el riesgo de ataques de canal lateral como Spectre. Parta mitigar ese riesgo, los navegadores ofrecen un entorno aislado basado opcional llamado aislamiento de origen cruzado. Descubra por qué es necesario utilizar el aislamiento de origen cruzado para funciones potentes como `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory() `
  y temporizador de alta resolución con mayor precisión.
authors:
  - agektmr
  - domenic
hero: image/admin/h8g1TQjkfkJSpWJrPakB.jpg
date: 2020-05-04
updated: 2021-08-05
tags:
  - blog
  - security
feedback:
  - api
---

## Introducción

En [Cómo hacer que su sitio web tenga "aislamiento de origen cruzado" usando COOP y COEP](/coop-coep/), explicamos cómo adoptar el estado "aislamiento de origen cruzado" usando COOP y COEP. Este es un artículo complementario que explica por qué se requiere el aislamiento de origen cruzado para habilitar funciones potentes en el navegador.

{% Aside 'key-term' %} Este artículo utiliza muchas terminologías que suenan similares. Para aclarar las cosas, definámoslas:

- [COEP: Política de incrustación de origen cruzado](https://wicg.github.io/cross-origin-embedder-policy/)
- [COOP: Política de apertura de origen cruzado](https://github.com/whatwg/html/pull/5334/files)
- [CORP: Política de recursos de origen cruzado](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
- [CORS: Uso compartido de recursos de origen cruzado](https://developer.mozilla.org/docs/Web/HTTP/CORS)
- [CORB: Bloqueo de lectura de origen cruzado](https://www.chromium.org/Home/chromium-security/corb-for-developers) {% endAside %}

## Antecedentes

La web se basa en la [política del mismo origen](/same-origin-policy/): una característica de seguridad que restringe la forma en que los documentos y los scripts pueden interactuar con recursos de otro origen. Este principio restringe las formas en que los sitios web pueden acceder a recursos de origen cruzado. Por ejemplo, un documento de `https://a.example` no puede acceder a los datos alojados en `https://b.example`.

Sin embargo, la política del mismo origen ha tenido algunas excepciones históricas. Cualquier sitio web puede:

- Incrustar iframes de origen cruzado
- Incluir recursos de origen cruzado, como imágenes o scripts
- Abrir ventanas emergentes de origen cruzado con una referencia DOM

Si la web pudiera diseñarse desde cero, estas excepciones no existirían. Desafortunadamente, cuando la comunidad web se dio cuenta de los beneficios clave de una política estricta del mismo origen, la web ya estaba basada en estas excepciones.

Los efectos secundarios de seguridad de una política tan laxa del mismo origen se corrigieron de dos maneras. Una fue mediante la introducción de un nuevo protocolo llamado [Cross Origin Resource Sharing (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS) cuyo propósito es asegurarse de que el servidor permitía compartir un recurso con un origen determinado. La otra es eliminando implícitamente el acceso directo del script a los recursos de origen cruzado mientras se conserva la compatibilidad con versiones anteriores. Estos recursos de origen cruzado se denominan recursos "opacos". Por ejemplo, esta es la razón por la que la manipulación de píxeles de una imagen de origen cruzado a través de `CanvasRenderingContext2D` falla a menos que se aplique CORS a la imagen.

Todas estas decisiones sobre políticas están sucediendo dentro de un grupo de contexto de navegación.

{% Img src="image/admin/z1Gr4mmJMo383dR9FQUk.png", alt="Grupo de contexto de exploración", width="800", height="469" %}

Durante mucho tiempo, la combinación de CORS y recursos opacos fue suficiente para hacer que los navegadores fueran seguros. A veces, se descubrieron casos extremos (como las [vulnerabilidades JSON](https://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/)) y se necesitaron parches, pero en general, el principio de no permitir el acceso de lectura directo a los bytes sin procesar de los recursos de origen cruzado fue exitoso.

Todo esto cambió con [Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)), que hace que cualquier dato que se cargue en el mismo grupo de contexto de navegación que su código sea potencialmente legible. Al medir el tiempo que toman ciertas operaciones, los atacantes pueden adivinar el contenido de los cachés de la CPU y, a través de eso, el contenido de la memoria del proceso. Dichos ataques de tiempo son posibles con temporizadores de baja granularidad que existen en la plataforma, pero pueden acelerarse con temporizadores de alta granularidad, tanto explícitos (como `performance.now()` ) como implícitos (como `SharedArrayBuffer`s). Si `evil.com` incrusta una imagen de origen cruzado, pueden usar un ataque Spectre para leer sus datos de píxeles, lo que hace que las protecciones que se basan en la "opacidad" sean ineficaces.

{% Img src="image/admin/wN636enwMtBrrOfhzEoq.png", alt="Spectr", width="800", height="500" %}

Idealmente, todas las solicitudes de origen cruzado deben ser examinadas explícitamente por el servidor propietario del recurso. Si el servidor propietario de los recursos no da la verificación, los datos nunca llegarán al grupo de contexto de navegación de un actor maligno y, por lo tanto, permanecerán fuera del alcance de cualquier ataque Spectre que pueda llevar a cabo una página web. Lo llamamos estado de aislamiento de origen cruzado. De eso se trata exactamente COOP + COEP.

En un estado aislado de origen cruzado, el sitio solicitante se considera menos peligroso y esto desbloquea características poderosas como `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()` y [temporizadores de alta resolución](https://www.w3.org/TR/hr-time/) con mayor precisión que de otro modo podrían usarse para ataques tipo Spectre. También evita la modificación de `document.domain`.

### Política de incrustación de origen cruzado {: #coep }

La [política de incrustación de origen cruzado(COEP)](https://wicg.github.io/cross-origin-embedder-policy/) evita que un documento cargue recursos de origen cruzado que no otorguen explícitamente el permiso del documento (mediante CORP o CORS). Con esta función, puede declarar que un documento no puede cargar dichos recursos.

{% Img src="image/admin/MAhaVZdShm8tRntWieU4.png", alt="How COEP works", width="800", height="410" %}

Para activar esta política, agregue el siguiente encabezado HTTP al documento:

```http
Cross-Origin-Embedder-Policy: require-corp
```

La palabra clave `require-corp` es el único valor aceptado para COEP. Esto aplica la política de que el documento solo puede cargar recursos del mismo origen o recursos marcados explícitamente como cargables desde otro origen.

Para que los recursos se puedan cargar desde otro origen, deben admitir el uso compartido de recursos de origen cruzado (CORS) o la Política de recursos de origen cruzado (CORP).

### Uso compartido de recursos de origen cruzado {: #cors}

Si un recurso de origen cruzado admite el [Uso compartido de recursos de origen cruzado (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS), puede usar el [atributo `crossorigin`](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin) para cargarlo en su página web sin que el COEP lo bloquee.

```html
<img src="https://third-party.example.com/image.jpg" crossorigin>
```

Por ejemplo, si este recurso de imagen se entrega con encabezados CORS, use el atributo `crossorigin` para que la solicitud para obtener el recurso use el [modo CORS](https://developer.mozilla.org/docs/Web/API/Request/mode). Esto también evita que se cargue la imagen a menos que establezca encabezados CORS.

De manera similar, puede obtener datos de origen cruzado a través del método `fetch()`, que no requiere un manejo especial siempre que el servidor responda con [los encabezados HTTP correctos](https://developer.mozilla.org/docs/Web/HTTP/CORS#The_HTTP_response_headers).

### Política de recursos de origen cruzado {: #corp }

La [Política de recursos de origen cruzado(CORP)](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP)) se introdujo originalmente como una opción para proteger sus recursos de ser cargados por otro origen. En el contexto de COEP, CORP puede especificar la política del propietario del recurso sobre quién puede cargar un recurso.

El encabezado `Cross-Origin-Resource-Policy` toma tres valores posibles:

```http
Cross-Origin-Resource-Policy: same-site
```

Los recursos que están marcados como `same-site` solo se pueden cargar desde el mismo sitio.

```http
Cross-Origin-Resource-Policy: same-origin
```

Los recursos que están marcados con el `same-origin` solo se pueden cargar desde el mismo origen.

```http
Cross-Origin-Resource-Policy: cross-origin
```

Cualquier sitio web puede cargar los recursos marcados como `cross-origin`. ([Este valor](https://mikewest.github.io/corpp/#integration-fetch) se agregó a la especificación CORP junto con COEP).

{% Aside %} Una vez que agregue el encabezado COEP, no podrá omitir la restricción mediante el uso de trabajadores de servicio. Si el documento está protegido por un encabezado COEP, la política se respeta antes de que la respuesta ingrese al proceso del documento, o antes de que ingrese al trabajador de servicio que está controlando el documento. {% endAside %}

### Política de apertura de origen cruzado {: #coop }

La [Política de apertura de origen cruzado (COOP)](https://github.com/whatwg/html/pull/5334/files) le permite asegurarse de que una ventana de nivel superior esté aislada de otros documentos colocándolos en un grupo de contexto de exploración diferente, de modo que no puedan interactuar directamente con la ventana de nivel superior. Por ejemplo, si un documento con COOP abre una ventana emergente, su propiedad `window.opener` sería `null`. Además, la propiedad `.closed` de la referencia del aperturador a él devolverá `true`.

{% Img src="image/admin/eUu74n3GIlK1fj9ACxF8.png", alt="COOP", width="800", height="452" %}

El encabezadoi `Cross-Origin-Opener-Policy` toma tres valores posibles:

```http
Cross-Origin-Opener-Policy: same-origin
```

Los documentos que están marcados como del `same-origin` pueden compartir el mismo grupo de contexto de exploración con documentos del mismo origen que también están explícitamente marcados como del `same-origin`.

{% Img src="image/admin/he8FaRE2ef67lamrFG60.png", alt="COOP", width="800", height="507" %}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

Un documento de nivel superior con `same-origin-allow-popups` conserva referencias a cualquiera de sus ventanas emergentes que no establecen COOP o que optan por salir del aislamiento al establecer un COOP de `unsafe-none`.

{% Img src="image/admin/AJdm6vFq4fQXUWOTFeFa.png", alt="COOP", width="800", height="537" %}

```http
Cross-Origin-Opener-Policy: unsafe-none
```

`unsafe-none` es el valor predeterminado y permite que el documento se agregue al grupo de contexto de exploración de su aperturador, a menos que éste tenga un COOP del `same-origin`.

{% Aside %} El atributo [`noopener`](https://developer.mozilla.org/docs/Web/API/Window/open#Window_features) tiene un efecto similar al que se esperaría de COOP excepto que funciona solo desde el lado del aperturador. (No puede disociar su ventana cuando la abre un tercero.) Cuando adjunta `noopener` haciendo algo como `window.open(url, '_blank', 'noopener')` o `<a target="_blank" rel="noopener">`, puede desvincular deliberadamente su ventana de la ventana abierta.

Si bien `noopener` puede ser reemplazado por COOP, sigue siendo útil cuando desea proteger su sitio web en navegadores que no son compatibles con COOP. {% endAside %}

## Resumen {: #summary }

Si desea acceso garantizado a funciones potentes como `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()` o [temporizadores de alta resolución](https://www.w3.org/TR/hr-time/) con mayor precisión, recuerde que su documento debe usar tanto COEP con el valor de `require-corp` como COOP con el valor de `same-origin`. En ausencia de cualquiera de ellos, el navegador no garantizará el aislamiento suficiente para habilitar de forma segura esas potentes funciones. Puede determinar la situación de su página comprobando si [`self.crossOriginIsolated`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated) devuelve `true`.

Conozca los pasos para implementar esto en [Cómo hacer que su sitio web sea "aislado de origen cruzado" usando COOP y COEP](/coop-coep/).

## Recursos

- [COOP y COEP explicados](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/edit)
- [Cambios planificados a la memoria compartida - JavaScript | MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes)
