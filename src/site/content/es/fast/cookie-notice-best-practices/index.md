---
layout: post
title: Prácticas recomendadas para los avisos de cookies
subhead: Optimizar los avisos de cookies para mejorar el rendimiento y la facilidad de uso.
authors:
  - katiehempenius
date: 2021-03-30
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/V8rNgYUkkAWET3EkBL6H.png
alt: Imagen de los avisos de cookies.
description: Aprenda cómo los avisos de cookies afectan al rendimiento, a la medición del rendimiento y a la UX.
tags:
  - blog
  - performance
  - web-vitals
---

En este artículo se analiza cómo los avisos de cookies pueden afectar al rendimiento, a la medición del rendimiento y a la experiencia del usuario.

## Rendimiento

Los avisos de cookies pueden tener un impacto significativo en el rendimiento de la página debido a que normalmente se cargan al principio del proceso de carga de la página, se muestran a todos los usuarios y potencialmente pueden influir para cargar anuncios y otros contenidos de la página.

Así es como los avisos de cookies pueden afectar a las métricas de Web Vitals:

- **Largest Contentful Paint: Despliegue del contenido más extenso (LCP):** La mayor parte de la información sobre el consentimiento de los avisos de las cookies es bastante pequeña y, por lo tanto, no suele contener el elemento LCP de una página. Sin embargo, esto puede ocurrir, especialmente en los dispositivos móviles. En los dispositivos móviles, un aviso de cookies normalmente ocupa una mayor parte de la pantalla. Esto generalmente ocurre cuando un aviso de cookies contiene un gran bloque de texto (los bloques de texto también pueden ser elementos LCP).

- **First Input Delay: Demora de la primera entrada (FID):** En general, el consentimiento de las cookies en sí mismo debería tener un impacto mínimo en el FID, ya que el consentimiento de las cookies requiere poca ejecución de JavaScript. Sin embargo, las tecnologías que habilitan estas cookies (por ejemplo, la publicidad y los scripts de seguimiento) pueden tener un impacto significativo en la interactividad de la página. Retrasar estos scripts hasta que se acepten las cookies puede servir como técnica para disminuir la Demora de la Primera Entrada (FID).

- **Cumulative Layout Shift: Cambio Acumulativo del diseño (CLS):** Los avisos de consentimiento de cookies es una fuente muy común de cambios de diseño.

En general, se puede esperar que un aviso de cookies de terceros proveedores tenga un mayor impacto en el rendimiento que un aviso de cookies que usted mismo desarrolle. Este no es un problema exclusivo de los avisos de cookies, sino de la naturaleza de los scripts de terceros en general.

### Prácticas recomendadas

Las prácticas recomendadas en esta sección se centran en los avisos de cookies de terceros. Algunas de estas prácticas recomendadas, aunque no todas, también se aplican a los avisos de cookies propios.

#### Cargar scripts de avisos de cookies de forma asíncrona

Los scripts de aviso de cookies deben cargarse de forma asíncrona. Para ello, agregue el atributo [`async`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-async) a la etiqueta script.

```html
<script src="https://cookie-notice.com/script.js" async>
```

Los scripts que no son asíncronos bloquean el analizador del navegador. Esto retrasa la carga de la página y el LCP. Para obtener más información, consulte [Carga eficiente de JavaScript de terceros](/efficiently-load-third-party-javascript/) .

{% Aside %} Si tiene que utilizar scripts síncronos (por ejemplo, algunos avisos de cookies dependen de scripts síncronos para implementar el bloqueo de cookies) debe asegurarse de que esta solicitud se cargue lo más rápidamente posible. Una forma de hacerlo es [utilizar sugerencias de recursos](/preconnect-and-dns-prefetch/). {% endAside %}

#### Cargar directamente los scripts de aviso de cookies

Los scripts de aviso de cookies deben cargarse "directamente" al colocar la etiqueta del script en el HTML del documento principal, en vez de cargarse mediante un administrador de etiquetas u otro script. El uso de un administrador de etiquetas o de un script secundario para inyectar el script de aviso de cookies retrasa la carga del script de aviso de cookies: oculta el script del analizador de búsqueda del navegador y evita que el script se cargue antes de que se ejecute JavaScript.

#### Cómo establecer una conexión anticipada con el origen del aviso de cookies

Todos los sitios que cargan sus scripts de aviso de cookies desde una ubicación de terceros deben utilizar las sugerencias de recursos `dns-prefetch` o `preconnect` para ayudar a establecer una conexión anticipada con el origen que aloja los recursos de aviso de cookies. Para obtener más información, consulte [Cómo establecer conexiones de red anticipadas para mejorar la velocidad que se percibe en una página](/preconnect-and-dns-prefetch/).

```html
<link rel="preconnect" href="https://cdn.cookie-notice.com/">
```

{% Aside %} Es común que los avisos de cookies carguen recursos de varios orígenes, por ejemplo, cargar recursos tanto de `www.cookie-notice.com` como de `cdn.cookie-notice.com`. Los orígenes separados requieren conexiones separadas y, por tanto, sugerencias de recursos independientes. {% endAside %}

#### Cómo precargar los avisos de las cookies según corresponda

Algunos sitios se beneficiarían de utilizar la sugerencia de recurso [`preload`](https://developer.mozilla.org/docs/Web/HTML/Preloading_content) para cargar su script de aviso de cookies. La sugerencia de recurso `preload` informa al navegador para que inicie una solicitud anticipada del recurso especificado.

```html
<link rel="preload" href="https://www.cookie-notice.com/cookie-script.js">
```

`preload` es más potente cuando su uso se limita a obtener un par de recursos clave por página. Por lo tanto, la utilidad de precargar el script de aviso de cookies variará dependiendo de la situación.

#### Tenga en cuenta las disyuntivas de rendimiento al diseñar los avisos de cookies

Personalizar el aspecto de un aviso de cookies de terceros puede suponer un costo adicional en el rendimiento. Por ejemplo, los avisos de cookies de terceros no siempre pueden reutilizar los mismos recursos (por ejemplo, las fuentes web) que se utilizan en otras partes de la página. Además, los avisos de cookies de terceros tienden a cargar el estilo al final de largas cadenas de solicitudes. Para evitar sorpresas, sea consciente de cómo su aviso de cookies carga y aplica el estilo y los recursos relacionados.

#### Evite los cambios de diseño

Estos son algunos de los problemas más comunes en los cambios de diseño asociados a los avisos de cookies:

- **Avisos de cookies en la parte superior de la pantalla:** Los avisos de cookies en la parte superior de la pantalla son una fuente muy común de cambio de diseño. Si un aviso de cookies se inserta en el DOM después de que la página que lo rodea ya se haya renderizado, empujará los elementos de la página que están debajo de él hacia abajo. Este tipo de desplazamiento de diseño puede eliminarse si se reserva un espacio en el DOM para el aviso de consentimiento. Si esto no es una solución factible (por ejemplo, si las dimensiones de su aviso de cookies varían según la geografía), considere la posibilidad de utilizar un pie de página adhesivo o un modal para mostrar el aviso de cookies. Dado que ambos enfoques alternativos muestran el aviso de cookies como una "superposición" sobre el resto de la página, el aviso de cookies no debería causar cambios de contenido cuando se carga.
- **Animaciones**: Muchos avisos de cookies utilizan animaciones (por ejemplo, el "deslizamiento" de un aviso de cookies es un patrón de diseño común). Dependiendo de cómo se implementen estos efectos, pueden causar cambios en el diseño. Para obtener más información, consulte [Depuración de los cambios de diseño](/debugging-layout-shifts/).
- **Fuentes**: Las fuentes que tardan en cargarse pueden bloquear el renderizado o causar cambios en el diseño. Este fenómeno es más evidente en conexiones lentas.

#### Optimizaciones de carga avanzadas

Estas técnicas necesitan más trabajo para implementarse, pero pueden optimizar aún más la carga de los scripts de aviso de cookies:

- El almacenamiento en caché y el servicio de scripts de aviso de cookies de terceros desde sus propios servidores puede mejorar la velocidad de entrega de estos recursos.
- El uso de [service workers](https://developer.mozilla.org/docs/Web/API/Service_Worker_API/Using_Service_Workers) puede permitirle un mayor control sobre la [obtención y almacenamiento del caché de scripts de terceros](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#cross-origin-considerations) como los scripts de aviso de cookies.

## Evaluación del desempeño

Los avisos de cookies pueden afectar a las evaluaciones de desempeño. En esta sección se analizan algunas de estas implicaciones y las técnicas para mitigarlas.

### Monitoreo de usuarios reales (RUM)

Algunas herramientas de análisis y RUM utilizan cookies para recopilar datos de desempeño. En caso de que un usuario rechace el uso de cookies, estas herramientas no podrán capturar datos de desempeño.

Los sitios deben ser conscientes de este fenómeno, también vale la pena entender los mecanismos que su herramienta RUM utiliza para recopilar sus datos. Sin embargo, para el sitio común esta discrepancia probablemente no sea motivo de alarma, dada la dirección y la magnitud de la desviación de los datos. El uso de cookies no es un requisito técnico para la evaluación del desempeño. La biblioteca [web-vitals](https://github.com/GoogleChrome/web-vitals) de JavaScript es un ejemplo de biblioteca que no utiliza cookies.

Según cómo su sitio utilice las cookies para recopilar datos de desempeño (es decir, si las cookies contienen información personal), así como la legislación en cuestión, el uso de cookies para la evaluación del desempeño podría no estar sujeta a los mismos requisitos legislativos que algunas de las cookies que se utilizan en su sitio para otros fines, por ejemplo, las cookies de publicidad. Algunos sitios optan por separar las cookies de desempeño como una categoría separada de cookies al solicitar el consentimiento del usuario.

### Monitoreo sintético

Sin una configuración personalizada, la mayoría de las herramientas sintéticas (como Lighthouse y WebPageTest) solo medirán la experiencia de un usuario que acude por primera vez y que no ha respondido a un aviso de consentimiento de cookies. Sin embargo, no solo hay que tener en cuenta las variaciones en el estado de la caché (por ejemplo, una primera visita frente a una visita repetida) al recopilar los datos de rendimiento, sino también las variaciones en el estado de aceptación de las cookies: aceptadas, rechazadas o sin respuesta.

En las siguientes secciones se analizará la configuración de WebPageTest y Lighthouse que puede ser útil para incorporar los avisos de cookies en los flujos de trabajo de evaluación del desempeño. Sin embargo, las cookies y los avisos de cookies son tan solo uno de los muchos factores que pueden ser difíciles de simular perfectamente en entornos de laboratorio. Por esta razón, es importante hacer que los datos [RUM](/user-centric-performance-metrics/#how-metrics-are-measured) sean la piedra angular de su evaluación comparativa del desempeño, en vez de las herramientas sintéticas.

### Prueba de avisos de cookies con WebPageTest

#### Programación

Puede utilizar la programación para que un [WebPageTest](https://webpagetest.org/) "haga clic" en el banner de consentimiento de cookies mientras se recopila un rastro.

Agregue un script en la pestaña **Script**. El siguiente script navega a la URL que se va a probar y luego hace clic en el elemento DOM con el ID `cookieButton`.

{% Aside 'caution' %} Los scripts de WebPageTest están [delimitados por pestañas](https://github.com/WPO-Foundation/webpagetest-docs/blob/main/src/scripting.md#scripting). {% endAside %}

```shell
combineSteps
navigate    %URL%
clickAndWait    id=cookieButton
```

Cuando utilice este script, tenga en cuenta que:

- `combineSteps` indica a WebPageTest que "combine" los resultados de los pasos de la programación que siguen en un único conjunto de rastros y evaluaciones. Ejecutar este script sin `combineSteps` también puede ser útil: los rastros separados permiten ver fácilmente si los recursos se cargaron antes o después de aceptar las cookies.
- `%URL%` es una convención de WebPageTest que hace referencia a la URL que se está probando.
- `clickAndWait` indica a WebPageTest que haga clic en el elemento indicado por `attribute=value` y espere a que se complete la actividad posterior del navegador. Esto sigue el formato `clickAndWait attribute=Value`.

Si configuró este script correctamente, la captura de pantalla realizada por WebPageTest no debería mostrar un aviso de cookies (el aviso de cookies fue aceptado).

Para obtener más información sobre la programación de WebPageTest, consulte la documentación de [WebPageTest](https://docs.webpagetest.org/scripting/).

#### Configurar cookies

Para ejecutar WebPageTest con una cookie determinada, vaya a la pestaña **Avanzado** y agregue el encabezado de la cookie al campo **Cabezados personalizados**:

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/qSccrAxF0H4yoSzYRYdh.png", alt="Captura de pantalla que muestra el campo denominado 'Encabezados personalizados' en WebPageTest", width="800", height="181" %}

#### Cambiar la ubicación de la prueba

Para cambiar la ubicación de la prueba que utiliza WebPageTest, haga clic en el elemento desplegable **Ubicación de la prueba** situado en la pestaña **Pruebas avanzadas**.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/J27NcDQ5LTtXYloaA1DN.png", alt="Captura de pantalla del elemento desplegable 'Ubicación de la prueba' en WebPageTest", width="800", height="267" %}

### Cómo probar los avisos de cookies con Lighthouse

La configuración de cookies en una ejecución de Lighthouse puede servir como mecanismo para poner una página en un estado determinado para que Lighthouse la pruebe. El comportamiento de las cookies de Lighthouse varía ligeramente según el contexto (DevTools, CLI o PageSpeed Insights).

#### DevTools

Las cookies no se borrarán cuando Lighthouse se ejecute desde DevTools. Sin embargo, otros tipos de almacenamiento se borran automáticamente. Este comportamiento puede modificarse mediante la opción **Borrar almacenamiento** en el panel de control de **Lighthouse**.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/nmNDeSoGEQUVKeTP7q7R.png", alt="Captura de pantalla en la que se destaca la opción 'Borrar almacenamiento' de Lighthouse", width="800", height="304" %}

#### CLI

La ejecución de Lighthouse desde la CLI utiliza una instancia fresca de Chrome, por lo que no se establecen cookies de forma predeterminada. Para ejecutar Lighthouse desde la CLI con una cookie configurada de forma específica, utilice el siguiente [comando](https://github.com/GoogleChrome/lighthouse#cli-options):

```shell
lighthouse <url> --extra-headers "{\"Cookie\":\"cookie1=abc; cookie2=def; \_id=foo\"}"
```

Para obtener más información sobre la configuración de encabezados de solicitud personalizados en la CLI de Lighthouse, consulte [Ejecución de Lighthouse en páginas autenticadas](https://github.com/GoogleChrome/lighthouse/blob/master/docs/authenticated-pages.md).

#### PageSpeed Insights

La ejecución de Lighthouse desde PageSpeed Insights utiliza una instancia de Chrome nueva y no establece ninguna cookie. PageSeed Insights no se puede configurar para establecer cookies particulares.

## Experiencia de usuario

La experiencia del usuario (UX) de los diferentes avisos de consentimiento de cookies es principalmente el resultado de dos decisiones: la ubicación del aviso de cookies dentro de la página y el grado en el que el usuario puede personalizar el uso de cookies de un sitio. En esta sección se analizan los posibles enfoques de estas dos decisiones.

{% Aside 'caution' %} La experiencia de usuario del aviso de cookies a menudo se ve muy influenciada por la legislación que puede variar ampliamente según la geografía. Por lo tanto, algunos de los patrones de diseño que se analizan en esta sección pueden no ser relevantes para su situación particular. Este artículo no debe considerarse un sustituto del asesoramiento legal. {% endAside %}

Al considerar los diseños potenciales para su aviso de cookies, aquí hay algunas cosas en las que debe pensar:

- UX: ¿Es esta una buena experiencia de usuario? ¿Cómo afectará este diseño en particular a los elementos de la página y los flujos de usuarios existentes?
- Empresa: ¿Cuál es la estrategia de cookies de su sitio? ¿Cuáles son sus objetivos para el aviso de cookies?
- Legal: ¿Esto cumple con los requisitos legales?
- Ingeniería: ¿Cuánto trabajo implicaría implementar y mantener? ¿Qué tan difícil sería cambiar?

### Colocación

Los avisos de cookies se pueden mostrar como un encabezado, un elemento de estilos integrados en el código o un pie de página. También se pueden mostrar en la parte superior del contenido de la página mediante un modal o se pueden publicar como un [intersticial](https://en.wikipedia.org/wiki/Interstitial_webpage).

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/LLqHAhp7W6x4E3rZh0Oc.png", alt="Diagrama que muestra ejemplos de diferentes opciones de ubicación para los avisos de cookies", width="800", height="345" %}

#### Avisos de cookies de encabezado, pie de página y de estilos integrados en el código

Los avisos de cookies se colocan comúnmente en el encabezado o pie de página. De estas dos opciones, la ubicación del pie de página es generalmente preferible porque es discreta, no compite por la atención con anuncios publicitarios o notificaciones y, por lo general, no causa CLS. Además, es un lugar común para colocar políticas de privacidad y términos de uso.

Si bien los avisos de cookies de estilos integrados en el código son una opción, pueden ser difíciles de integrar en las interfaces de usuario existentes y, por lo tanto, son poco comunes.

#### Modales

Los modales son avisos de consentimiento de cookies que se muestran en la parte superior del contenido de la página. Los modales pueden verse y funcionar de manera muy diferente dependiendo de su tamaño.

Los modales de pantalla parcial más pequeños pueden ser una buena alternativa para los sitios que tienen dificultades para implementar avisos de cookies de una manera que no provoque [cambios de diseño](/cls/).

Por otro lado, los modales grandes que ocultan la mayor parte del contenido de la página deben usarse con cuidado. En particular, los sitios más pequeños pueden encontrar que los usuarios rechazan en vez de aceptar el aviso de cookies de un sitio desconocido con contenido oculto. Aunque no son necesariamente conceptos sinónimos, si está pensando en utilizar un modal de consentimiento de cookies de pantalla completa, debe conocer la legislación sobre [cookie walls](https://techcrunch.com/2020/05/06/no-cookie-consent-walls-and-no-scrolling-isnt-consent-says-eu-data-protection-body/).

{% Aside %} Los grandes modales pueden considerarse un tipo de intersticial. La Búsqueda de Google [no penaliza](https://developers.google.com/search/blog/2016/08/helping-users-easily-access-content-on) el uso de anuncios intersticiales cuando se utilizan para cumplir con normas legales, como en el caso de los banners de cookies. Sin embargo, el uso de intersticiales en otros contextos, en particular si son intrusivos o crean una mala experiencia para el usuario, puede verse penalizado. {% endAside %}

### Configurabilidad

Las interfaces de aviso de cookies brindan a los usuarios distintos niveles de control sobre qué cookies aceptan.

#### Sin configurabilidad

Estos banners de cookies con estilo de aviso no presentan a los usuarios controles directos de UX para rechazar las cookies. En su lugar, generalmente incluyen un enlace a la política de cookies del sitio que puede proporcionar a los usuarios información sobre cómo administrar las cookies mediante su navegador web. Por lo general, estos avisos incluyen un botón para "descartar" y/o "Aceptar".

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/RlAg8DCjBC0bX7Ki5MuE.png", alt="Diagrama que muestra ejemplos de avisos de cookies sin configurabilidad de cookies", width="800", height="518" %}

#### Algo de configurabilidad

Estos avisos de cookies dan al usuario la opción de rechazar las cookies, pero no admiten controles más detallados. Este enfoque de los avisos de cookies es menos común.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/MOl8u9NcnyjCWogxzjdz.png", alt="Diagrama que muestra ejemplos de avisos de cookies con cierta capacidad de configuración de cookies", width="800", height="508" %}

#### Configurabilidad total

Estos avisos de cookies proporcionan a los usuarios controles más detallados para configurar el uso de cookies que aceptan.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/QfFoqkkmdKHAYlftIH0n.png", alt="Diagrama que muestra ejemplos de avisos de cookies con capacidad de configuración completa de cookies", width="800", height="467" %}

- **UX:** Los controles para configurar el uso de cookies se muestran con mayor frecuencia mediante un modal independiente que se inicia cuando el usuario responde al aviso inicial de consentimiento de cookies. Sin embargo, si el espacio lo permite, algunos sitios mostrarán estos controles de estilos integrados en el código dentro del aviso de consentimiento de cookies inicial.

- **Granularidad:** el enfoque más común para la capacidad de configuración de las cookies es permitir que los usuarios opten por las cookies por "categoría" de cookies. Algunos ejemplos de categorías de cookies comunes incluyen cookies funcionales, de orientación y de redes sociales.

    Sin embargo, algunos sitios irán un paso más allá y permitirán a los usuarios optar por participar en cada cookie. Alternativamente, otra forma de proporcionar a los usuarios controles más específicos es dividir las categorías de cookies como "publicidad" en casos de uso específicos; por ejemplo, permitir que los usuarios opten por separado para "anuncios básicos" y "anuncios personalizados".

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/z7zFPtCkFi8GEpkfubek.png", alt="Diagrama que muestra ejemplos de avisos de cookies con capacidad de configuración completa de cookies", width="800", height="372" %}
