---
title: Proteja sus recursos de los ataques web con Fetch Metadata
subhead: Evite las fugas de información CSRF, XSSI y de origen cruzado.
authors:
  - lwe
date: 2020-06-04
updated: 2020-06-10
hero: image/admin/El8ytnIgMDWVzdsglcfv.jpg
alt: Una captura de pantalla del código Python relacionado con la Política de aislamiento de recursos.
description: |2

  Fetch Metadata es una nueva función de plataforma web diseñada para permitir que los servidores se protejan de ataques de origen cruzado.
tags:
  - blog
  - security
feedback:
  - api
---

## ¿Por qué debería preocuparse por aislar sus recursos web?

Muchas aplicaciones web son vulnerables a ataques de [origen cruzado](/same-site-same-origin/#%22same-origin%22-and-%22cross-origin%22), como [falsificación de solicitudes entre sitios](https://portswigger.net/web-security/csrf) (CSRF), [inclusión de scripts entre sitios](https://portswigger.net/research/json-hijacking-for-the-modern-web) (XSSI), ataques de tiempo, [fugas de información de origen cruzado](https://arxiv.org/pdf/1908.02204.pdf) o ataques de canal lateral de ejecución especulativa [(Spectre)](https://developer.chrome.com/blog/meltdown-spectre/).

Los encabezados de solicitud de [Fetch Metadata (obtención de metadatos)](https://www.w3.org/TR/fetch-metadata/) permiten implementar un sólido mecanismo de defensa a profundidad (una política de aislamiento de recursos) para proteger su aplicación contra estos ataques comunes de origen cruzado.

Es usual que los recursos expuestos por una determinada aplicación web solo sean cargados por la propia aplicación y no por otros sitios web. En tales casos, implementar una política de aislamiento de recursos basada en los encabezados de solicitud de obtención de metadatos requiere poco esfuerzo y, al mismo tiempo, protege la aplicación de ataques entre sitios.

## Compatibilidad del navegador {: #compatibility}

Los encabezados de solicitud de obtención de metadatos son compatibles con navegadores a partir de Chrome 76 y en otros navegadores basados en Chromium, y están en desarrollo en Firefox. Consulte [Compatibilidad del navegador](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site#Browser_compatibility) para obtener información actualizada.

## Antecedentes

Muchos ataques entre sitios son posibles porque la web está abierta de forma predeterminada y su servidor de aplicaciones no puede protegerse fácilmente de las comunicaciones que se originan en aplicaciones externas. Un ataque típico de origen cruzado es la falsificación de solicitudes entre sitios (CSRF), en la que un atacante atrae a un usuario a un sitio que controla y luego envía un formulario al servidor en el que el usuario ha iniciado sesión. Dado que el servidor no puede saber si la solicitud se originó en otro dominio (entre sitios) y el navegador adjunta cookies automáticamente a las solicitudes entre sitios, el servidor ejecutará la acción solicitada por el atacante en nombre del usuario.

Otros ataques entre sitios, como la inclusión de scripts entre sitios (XSSI) o las fugas de información de origen cruzado, son de naturaleza similar a la CSRF, y se basan en la carga de recursos de la aplicación de una víctima en un documento controlado por el atacante y en la filtración de información sobre las aplicaciones de la víctima. Dado que las aplicaciones no pueden distinguir fácilmente las solicitudes confiables de las no confiables, no pueden descartar el tráfico malicioso entre sitios.

{% Aside 'gotchas' %} Además de los ataques a los recursos descritos anteriormente, *las referencias a ventanas* también pueden provocar fugas de información de origen cruzado y ataques de Spectre. Puede evitarlos configurando el encabezado de respuesta `Cross-Origin-Opener-Policy` en `same-origin`. {% endAside %}

## Presentamos Fetch Metadata {: #introduction}

Los encabezados de solicitud de obtención de datos son una nueva característica de seguridad de la plataforma web, diseñada para ayudar a los servidores a defenderse de los ataques de origen cruzado. Al proporcionar información sobre el contexto de una solicitud HTTP en un conjunto de encabezados`Sec-Fetch-*`, permiten que el servidor que responde aplique políticas de seguridad antes de procesar la solicitud. Esto da la oportunidad a los desarrolladores de decidir si aceptan o rechazan una solicitud dependiendo de la forma en que se realizó y el contexto en el que se utilizará, lo que hace posible responder solo a solicitudes legítimas realizadas por su propia aplicación.

{% Compare 'better', 'Same-Origin' %} {% CompareCaption %} Las solicitudes que se originen en sitios atendidos por su propio servidor (del mismo origen) seguirán funcionando. {% endCompareCaption %}

<!--lint disable no-literal-urls-->

{% Img src="image/admin/aRsy2xULTR4TM2sMMsbQ.png", alt="Una solicitud de recuperación de https: //site.example para el recurso https: //site.example/foo.json en JavaScript hace que el navegador envíe el encabezado de solicitud HTTP 'Sec Fetch-Site: same-origin'. ", width="800 ", height=" 76" %}

<!--lint enable no-literal-urls-->

{% endCompare %}

{% Compare 'worse', 'Cross-site' %} {% CompareCaption %} El servidor puede rechazar las solicitudes maliciosas entre sitios debido al contexto adicional en la solicitud HTTP proporcionada por los encabezados `Sec-Fetch-*`. {% endCompareCaption %}

<!--lint disable no-literal-urls-->

{% Img src="image/admin/xY4yB36JqsVw62wNMIWt.png", alt="Una imagen en https: //evil.example que ha establecido el atributo src de un elemento img en 'https: //site.example/foo. json' hace que el navegador envíe el encabezado de solicitud HTTP' Sec-Fetch-Site: cross-site . ", width="800", height="171" %}

<!--lint enable no-literal-urls-->

{% endCompare %}

### `Sec-Fetch-Site`

`Sec-Fetch-Site` le dice al servidor qué [sitio](/same-site-same-origin) envió la solicitud. El navegador establece este valor en uno de los siguientes:

- `same-origin`, si la solicitud fue realizada por su propia aplicación (p. ej., `site.example`)
- `same-site`, si la solicitud fue realizada por un subdominio de su sitio (p. ej., `bar.site.example`)
- `none`, si la solicitud fue causada explícitamente por la interacción de un usuario con el agente de usuario (p. ej., al hacer clic en un marcador)
- `cross-site`, si la solicitud fue enviada por otro sitio web (p. ej., `evil.example`)

### `Sec-Fetch-Mode`

`Sec-Fetch-Mode` indica el [modo](https://developer.mozilla.org/docs/Web/API/Request/mode) de la solicitud. Esto corresponde aproximadamente al tipo de solicitud y le permite distinguir entre las cargas de recursos y las solicitudes de navegación. Por ejemplo, un destino de `navigate` indica una solicitud de navegación de nivel superior, mientras que `no-cors` indica solicitudes de recursos, como cargar una imagen.

### `Sec-Fetch-Dest`

`Sec-Fetch-Dest` expone el [destino de](https://developer.mozilla.org/docs/Web/API/Request/destination) una solicitud (p. ej., si una etiqueta de `script` o de `img` provocó que el navegador solicitara un recurso).

## Cómo utilizar la obtención de datos para protegerse contra ataques de origen cruzado

La información adicional que brindan estos encabezados de solicitud es bastante simple, pero el contexto adicional le permite construir una lógica de seguridad poderosa en el lado del servidor (también conocida como política de aislamiento de recursos), con solo unas pocas líneas de código.

### Implementación de una política de aislamiento de recursos

Una política de aislamiento de recursos evita que los sitios web externos soliciten sus recursos. El bloqueo de dicho tráfico mitiga las vulnerabilidades web más comunes entre sitios, como CSRF, XSSI, ataques de tiempo y fugas de información de origen cruzado. Esta política se puede habilitar para todos los puntos finales de su aplicación y permitirá todas las solicitudes de recursos provenientes de su propia aplicación, así como navegaciones directas (a través de una solicitud `GET` HTTP). Los puntos finales que se supone deben cargarse en un contexto entre sitios (por ejemplo, puntos finales cargados mediante CORS) pueden excluirse de esta lógica.

#### Paso 1: Permitir solicitudes de navegadores que no envían obtención de metadatos

Dado que no todos los navegadores son compatibles con la obtención de metadatos, debe permitir solicitudes que no establezcan los encabezados `Sec-Fetch-*` comprobando la presencia de `sec-fetch-site`.

{% Aside %} Todos los siguientes ejemplos son código Python. {% endAside %}

```python
if not req['sec-fetch-site']:
  return True  # Allow this request
```

{% Aside 'caution' %} Dado que la obtención de metadatos solo es compatible con navegadores basados en Chromium, debe usarse como una [protección de defensa a profundidad](https://static.googleusercontent.com/media/landing.google.com/en//sre/static/pdf/Building_Secure_and_Reliable_Systems.pdf#page=181) y no como su principal línea de defensa. {% endAside %}

#### Paso 2: Permitir solicitudes same-site e iniciadas por el navegador

Se permitirá cualquier solicitud que no se origine en un contexto de origen cruzado (como `evil.example`). En particular, se trata de solicitudes que:

- Proceden de su propia aplicación (por ejemplo, una solicitud del mismo origen donde `site.example` solicita `site.example/foo.json` siempre se permitirá).
- Proceden de sus subdominios.
- Son causadas explícitamente por la interacción de un usuario con el agente de usuario (por ejemplo, navegación directa o al hacer clic en un marcador, etc.).

```python
if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
  return True  # Allow this request
```

{% Aside 'gotchas' %} En caso de que sus subdominios no sean completamente confiables, puede hacer que la política sea más estricta bloqueando las solicitudes de los subdominios eliminando el valor `same-site`. {% endAside %}

#### Paso 3: Permitir la navegación y el iframing de nivel superior simples

Para asegurarse de que su sitio aún pueda estar vinculado desde otros sitios, debe permitir una navegación de nivel superior simple (`HTTP GET`).

```python
if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET'
  # <object> and <embed> send navigation requests, which we disallow.
  and req['sec-fetch-dest'] not in ('object', 'embed'):
    return True  # Allow this request
```

{% Aside 'gotchas' %} La lógica anterior protege los puntos finales de su aplicación para que no sean utilizados como recursos por otros sitios web, pero permitirá la navegación e incrustación de nivel superior (por ejemplo, la carga en un `<iframe>`). Para mejorar aún más la seguridad, puede usar los encabezados de obtención de metadatos para restringir la navegación entre sitios a solo un conjunto permitido de páginas. {% endAside %}

#### Paso 4: Inhabilitar los puntos finales que están destinados a brindar tráfico entre sitios (opcional)

En algunos casos, su aplicación puede proporcionar recursos que deben cargarse entre sitios. Estos recursos deben estar exentos por ruta o por punto final. Ejemplos de estos puntos finales son:

- Puntos finales destinados a ser accedidos desde el origen cruzado: Si su aplicación está sirviendo puntos finales que están habilitados con `CORS`, debe excluirlos explícitamente del aislamiento de recursos para asegurarse de que las solicitudes entre sitios a estos puntos finales aún sean posibles.
- Recursos públicos (por ejemplo, imágenes, estilos, etc.): Cualquier recurso público y no autenticado cuya carga deba ser por origen cruzado desde otros sitios también puede quedar exento.

```python
if req.path in ('/my_CORS_endpoint', '/favicon.png'):
  return True
```

{% Aside 'caution' %} Antes de excluir partes de su aplicación de estas restricciones de seguridad, asegúrese de que sean estáticas y no contengan información confidencial del usuario. {% endAside %}

#### Paso 5: Rechazar todas las demás solicitudes que sean entre sitios y no de navegación

Esta Política de aislamiento de recursos rechazará cualquier otra **solicitud entre sitios** y, por lo tanto, protegerá su aplicación de los ataques comunes entre sitios.

{% Aside 'gotchas' %} De forma predeterminada, las solicitudes que infrinjan su política deben rechazarse con una respuesta `HTTP 403`. Sin embargo, dependiendo de su caso de uso, también puede considerar otras acciones, como:

- **Registrar solo violaciones**. Esto es especialmente útil cuando se prueba la compatibilidad de la política y se encuentran puntos finales que podrían necesitar ser excluidos.
- **Modificar la solicitud**. En ciertos escenarios, considere realizar otras acciones como redirigir a su página de destino y eliminar las credenciales de autenticación (por ejemplo, cookies). Sin embargo, tenga en cuenta que esto podría debilitar las protecciones de una política basada en la obtención de metadatos. {% endAside %}

**Ejemplo:** el siguiente código demuestra una implementación completa de una política de aislamiento de recursos sólida en el servidor o como un middleware, para denegar solicitudes de recursos entre sitios potencialmente maliciosos, al tiempo que permite solicitudes de navegación simples:

```python
# Reject cross-origin requests to protect from CSRF, XSSI, and other bugs
def allow_request(req):
  # Allow requests from browsers which don't send Fetch Metadata
  if not req['sec-fetch-site']:
    return True

  # Allow same-site and browser-initiated requests
  if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
    return True

  # Allow simple top-level navigations except <object> and <embed>
  if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET'
    and req['sec-fetch-dest'] not in ('object', 'embed'):
      return True

  # [OPTIONAL] Exempt paths/endpoints meant to be served cross-origin.
  if req.path in ('/my_CORS_endpoint', '/favicon.png'):
    return True

  # Reject all other requests that are cross-site and not navigational
  return False
```

### Implementar una política de aislamiento de recursos

1. Instale un módulo como el fragmento de código de arriba para registrar y monitorear cómo se comporta su sitio y asegurarse de que las restricciones no afecten al tráfico legítimo.
2. Solucione las posibles violaciones eximiendo los puntos finales de origen cruzado legítimos.
3. Haga cumplir la política descartando las solicitudes que no cumplen con esta.

### Identificar y corregir violaciones de políticas

Se recomienda que pruebe su política sin efectos secundarios habilitándola primero en modo de informes en su código del lado del servidor. Alternativamente, puede implementar esta lógica en middleware o en un proxy inverso que registra cualquier violación que su política pueda producir cuando se aplica al tráfico de producción.

Según nuestra experiencia en la implementación de una Política de aislamiento de recursos de obtención de metadatos en Google, la mayoría de las aplicaciones son compatibles de forma predeterminada con dicha política y rara vez requieren la exención de puntos finales para permitir el tráfico entre sitios.

### Hace cumplir una política de aislamiento de recursos

Una vez que haya verificado que su política no afecta el tráfico de producción legítimo, estará listo para hacer cumplir las restricciones, garantizando que otros sitios no podrán solicitar sus recursos y protegiendo a sus usuarios de ataques entre sitios.

{% Aside 'caution' %} Asegúrese de rechazar las solicitudes no válidas antes de ejecutar comprobaciones de autenticación o cualquier otro procesamiento de la solicitud para evitar revelar información confidencial de tiempos. {% endAside %}

## Artículos relacionados

- [Especificación de encabezados de solicitud de obtención de metadatos del W3C](https://www.w3.org/TR/fetch-metadata/)
- [Playground de obtención de metadatos](https://secmetadata.appspot.com/)
- [Charla de Google I/O: Protección de aplicaciones web con funciones de plataforma modernas](https://webappsec.dev/assets/pub/Google_IO-Securing_Web_Apps_with_Modern_Platform_Features.pdf) (diapositivas)

{% YouTube id='DDtM9caQ97I', startTime='1856'%}
