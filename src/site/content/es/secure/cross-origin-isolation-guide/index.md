---
layout: post
title: Una guía para habilitar el aislamiento de origen cruzado
authors:
  - agektmr
date: 2021-02-09
updated: 2021-08-05
subhead: El aislamiento de origen cruzado permite que una página web utilice funciones potentes como SharedArrayBuffer. Este artículo explica cómo habilitar aislamiento del origen cruzado en su sitio web.
description: El aislamiento de origen cruzado permite que una página web utilice funciones potentes como SharedArrayBuffer. Este artículo explica cómo habilitar aislamiento del origen cruzado en su sitio web.
tags:
  - security
---

Esta guía le muestra cómo habilitar el aislamiento de origen cruzado. Se requiere aislamiento de origen cruzado si desea utilizar [`SharedArrayBuffer`](/monitor-total-page-memory-usage/), [`performance.measureUserAgentSpecificMemory()`](https://developer.chrome.com/blog/cross-origin-isolated-hr-timers/) o [high resolution timer with better precision](https://developer.chrome.com/blog/cross-origin-isolated-hr-timers/).

Si tiene la intención de habilitar el aislamiento de origen cruzado, evalúe el impacto que esto tendrá en otros recursos de origen cruzado en su sitio web, como la ubicación de anuncios.

{% Details %} {% DetailsSummary %} Determine en qué lugar de su sitio web se usa `SharedArrayBuffer`

A partir de Chrome 92, las funcionalidades que utilizan `SharedArrayBuffer` ya no funcionarán sin el aislamiento de origen cruzado. Si llegó a esta página debido a un `SharedArrayBuffer`, es probable que su sitio web o uno de los recursos integrados en él esté utilizando `SharedArrayBuffer`. Para asegurarse de que nada se interrumpa en su sitio web debido a la depreciación, comience por identificar dónde se utiliza.

{% endDetailsSummary %}

{% Aside 'objective' %}

- Active el aislamiento de origen cruzado para seguir utilizando `SharedArrayBuffer`.
- Si depende del código de terceros que utiliza `SharedArrayBuffer`, notifique al proveedor de terceros para que tome medidas. {% endAside %}

Si no está seguro de en qué parte de su sitio se utiliza un `SharedArrayBuffer`, hay dos maneras de averiguarlo:

- Usando Chrome DevTools
- (Avanzado) Uso de informes de depreciación

Si ya sabe dónde está utilizando `SharedArrayBuffer`, pase a [Analizar el impacto del aislamiento de origen cruzado](#analysis).

### Cómo utilizar Chrome DevTools

[Chrome DevTools](https://developer.chrome.com/docs/devtools/open/) permite que los desarrolladores inspeccionen sitios web.

1. [Abra Chrome DevTools](https://developer.chrome.com/docs/devtools/open/) en la página que sospecha que podría estar usando `SharedArrayBuffer`.
2. Seleccione el panel **Consola.**
3. Si la página usa `SharedArrayBuffer`, aparecerá el siguiente mensaje:
    ```text
    [Deprecation] SharedArrayBuffer will require cross-origin isolation as of M92, around May 2021. See https://developer.chrome.com/blog/enabling-shared-array-buffer/ for more details. common-bundle.js:535
    ```
4. El nombre del archivo y el número de línea al final del mensaje (por ejemplo, `common-bundle.js:535`) indican de dónde proviene `SharedArrayBuffer`. Si se trata de una biblioteca de terceros, comuníquese con el desarrollador para solucionar el problema. Si se implementa como parte de su sitio web, siga la guía que se indica a continuación para habilitar el aislamiento de origen cruzado.

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/GOgkyjAabePTc8AG22F7.png", alt="Advertencia de la consola DevToools cuando se utiliza SharedArrayBuffer sin aislamiento de origen cruzado", width="800", height="163" %} <figcaption>  Advertencia de la consola DevToools cuando se utiliza SharedArrayBuffer sin aislamiento de origen cruzado.</figcaption></figure>

### (Avanzado) Uso de informes de depreciación

Algunos navegadores tienen [una función de generación de informes en las API de depreciación](https://wicg.github.io/deprecation-reporting/) para un endpoint específico.

1. [Configure un servidor de informes de depreciación y obtenga la URL de informes](/coop-coep/#set-up-reporting-endpoint). Puede conseguir esto utilizando un servicio público o construyendo uno usted mismo.
2. Utilizando la URL, establezca el siguiente encabezado HTTP en las páginas que potencialmente utilizan `SharedArrayBuffer`.
    ```http
    Report-To: {"group":"default","max_age":86400,"endpoints":[{"url":"THE_DEPRECATION_ENDPOINT_URL"}]}
    ```
3. Una vez que el encabezado comienza a propagarse, el endpoint en el que se registró debería comenzar a recopilar informes de depreciación.

Consulte un ejemplo de implementación aquí: [https://cross-origin-isolation.glitch.me](https://cross-origin-isolation.glitch.me).

{% endDetails %}

## Cómo analizar el impacto del aislamiento de origen cruzado {: #analysis}

¿No sería fantástico si pudiera evaluar el impacto que tendría la habilitación del aislamiento de origen cruzado en su sitio sin realmente interrumpir nada? Los encabezados HTTP [`Cross-Origin-Opener-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) y [`Cross-Origin-Embedder-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) permiten hacer precisamente eso.

1. Establezca [`Cross-Origin-Opener-Policy-Report-Only: same-origin`](/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document) en su documento de nivel superior. Como su nombre lo indica, este encabezado solo envía informes sobre el impacto que `COOP: same-origin` **tendría** en su sitio. En realidad, no deshabilitará la comunicación con las ventanas emergentes.
2. Establezca los informes y configure un servidor web para recibir y guardar los informes.
3. Establezca [`Cross-Origin-Embedder-Policy-Report-Only: require-corp`](/coop-coep/#3.-use-the-coep-report-only-http-header-to-assess-embedded-resources) en su documento de nivel superior. Nuevamente, este encabezado le permite ver el impacto de habilitar `COEP: require-corp` sin afectar realmente el funcionamiento de su sitio. Puede configurar este encabezado para enviar informes al mismo servidor de informes que configuró en el paso anterior.

{% Aside %} También puede [habilitar la columna **Dominio**](https://developer.chrome.com/docs/devtools/network/#information) en el panel de la **Red** de Chrome DevTools para obtener una visualización general de los recursos que se verían afectados. {% endAside %}

{% Aside 'caution' %}

Habilitar el aislamiento de origen cruzado bloqueará la carga de recursos de origen cruzado que no se opten explícitamente y evitará que su documento de nivel superior pueda comunicarse con ventanas emergentes.

Hemos estado explorando formas de implementar la `Cross-Origin-Resource-Policy` de origen cruzado a escala, ya que el aislamiento de origen cruzado requiere que todos los subrecursos se inscriban explícitamente. Y se nos ha ocurrido la idea de ir en la dirección opuesta: [un nuevo modo COEP "sin credenciales"](https://github.com/mikewest/credentiallessness/) que permite cargar recursos sin el encabezado CORP eliminando todas sus credenciales. Estamos averiguando los detalles de cómo debería funcionar, pero esperamos que esto alivie su carga de asegurarse de que los subrecursos envíen el encabezado de la `Cross-Origin-Resource-Policy`.

Además, se sabe que el encabezado `Cross-Origin-Opener-Policy: same-origin` interrumpirá las integraciones que requieren interacciones de ventana de origen cruzado como OAuth y los pagos. Para mitigar este problema, estamos explorando [relajar la condición](https://github.com/whatwg/html/issues/6364) para habilitar el aislamiento entre orígenes `Cross-Origin-Opener-Policy: same-origin-allow-popups`. De esta forma será posible la comunicación con la ventana abierta.

Si desea habilitar el aislamiento de origen cruzado, pero estos desafíos lo bloquean, le recomendamos que se [registre para una prueba de origen](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial) y espere hasta que los nuevos modos estén disponibles. No tenemos previsto finalizar la prueba de origen hasta que estos nuevos modos estén disponibles.

{% endAside %}

## Mitigar el impacto del aislamiento de origen cruzado

Una vez que haya determinado qué recursos se verán afectados por el aislamiento de origen cruzado, aquí hay pautas generales sobre cómo optar por esos recursos de origen cruzado:

1. En recursos de origen cruzado como imágenes, scripts, hojas de estilo, iframes y otros, establezca el encabezado [`Cross-Origin-Resource-Policy: cross-origin`](https://resourcepolicy.fyi/#cross-origin) En los recursos del mismo sitio, establezca el encabezado [`Cross-Origin-Resource-Policy: same-site`](https://resourcepolicy.fyi/#same-origin).
2. Establezca el atributo `crossorigin` en la etiqueta HTML del documento de nivel superior si el recurso se presenta con [CORS](/cross-origin-resource-sharing/) (por ejemplo, `<img src="ejemplo.jpg" crossorigin>`).
3. Si los recursos de origen cruzado cargados en iframes involucran otra capa de iframes, aplique de forma recursiva los pasos descritos en esta sección antes de seguir adelante.
4. Una vez que confirme que todos los recursos de origen cruzado estén habilitados `Cross-Origin-Embedder-Policy: require-corp` en los recursos de origen cruzado cargados en iframes.
5. Asegúrese de que no haya ventanas emergentes de origen cruzado que requieran comunicación a través de `postMessage()`. No hay forma de que sigan funcionando cuando el aislamiento de origen cruzado esté habilitado. Puede mover la comunicación a otro documento que no esté aislado de origen cruzado o utilizar un método de comunicación diferente (por ejemplo, solicitudes HTTP).

## Habilitar el aislamiento de origen cruzado

Una vez que haya mitigado el impacto mediante el aislamiento de origen cruzado, aquí hay pautas generales para habilitar el aislamiento de origen cruzado:

1. Establezca el encabezado `Cross-Origin-Opener-Policy: same-origin` en su documento de nivel superior. Si había establecido `Cross-Origin-Opener-Policy-Report-Only: same-origin`, reemplácelo. Esto bloquea la comunicación entre su documento de nivel superior y sus ventanas emergentes.
2. Establezca el encabezado `Cross-Origin-Embedder-Policy: require-corp` en su documento de nivel superior. Si estableció `Cross-Origin-Embedder-Policy-Report-Only: require-corp`, reemplácelo. Esto bloqueará la carga de recursos de origen cruzado que no estén habilitados.
3. Verifique que `self.crossOriginIsolated` devuelva `true` en la consola para verificar que su página tenga un origen cruzado aislado.

{% Aside 'gotchas' %}

Habilitar el aislamiento de origen cruzado en un servidor local puede ser una molestia, ya que los servidores simples no admiten el envío de encabezados. Puede ejecutar Chrome con un indicador de línea de comandos `--enable-features=SharedArrayBuffer` para habilitar `SharedArrayBuffer` sin habilitar el aislamiento de origen cruzado. Aprenda [a ejecutar Chrome con una marca de línea de comando en las respectivas plataformas](https://www.chromium.org/developers/how-tos/run-chromium-with-flags).

{% endAside %}

## Recursos

- [Cómo hacer que su sitio web sea "aislado y de origen cruzado" utilizando COOP y COEP](/coop-coep/)
- [Actualizaciones de SharedArrayBuffer en Android Chrome 88 y Desktop Chrome 92](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
