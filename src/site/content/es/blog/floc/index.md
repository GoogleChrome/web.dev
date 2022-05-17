---
title: "¿Qué es FLoC?"
subhead: FLoC permite la selección de anuncios sin compartir el comportamiento de navegación de usuarios individuales.
authors:
  - samdutton
date: 2021-03-30
updated: 2021-10-29
hero: image/80mq7dk16vVEg8BBhsVe42n6zn82/GA543wiVTwpbwp6Zmw0H.jpg
thumbnail: image/80mq7dk16vVEg8BBhsVe42n6zn82/OuORgPSvN06ntXT5xOii.jpg
alt: Murmuración de estorninos sobre Brighton Pier
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside %} Esta publicación describe el diseño de API implementado en Chrome para la primera prueba de origen de FLoC.

Actualmente se están desarrollando iteraciones futuras de una API para permitir la publicidad basada en intereses sin cookies de terceros u otros mecanismos de seguimiento entre sitios. {% endAside %}

FLoC proporciona un mecanismo de preservación de la privacidad para la selección de anuncios basados en intereses.

A medida que un usuario se mueve por la web, su navegador utiliza el algoritmo FLoC para calcular su "cohorte de interés", que será la misma para miles de navegadores con un historial similar reciente de navegación. El navegador recalcula su cohorte periódicamente, en el dispositivo del usuario, sin compartir datos de navegación individuales con el proveedor del navegador ni con nadie más.

{% Aside %} Durante la prueba inicial de FLoC, una visita a la página solo se incluía en el cálculo de FLoC del navegador por una de dos siguientes razones:

- El (`document.interestCohort()`) de la API de FLoC era usado en la página.
- Chrome detecta que la página [cargaba anuncios o recursos relacionados con anuncios](https://github.com/WICG/floc/issues/82).

Para otros algoritmos de agrupamiento, la prueba puede experimentar con diferentes criterios de inclusión: eso es parte del proceso de la prueba de ensayo de origen.

La prueba de origen para la versión inicial de FLoC, se ejecuto desde Chrome 89 hasta Chrome 91, [actualmente se encuentra finalizada](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561). {% endAside %}

Los anunciantes (sitios que pagan por anuncios) pueden incluir código en sus propios sitios web para recopilar y proporcionar datos de cohortes a sus plataformas de adtech (empresas que proporcionan software y herramientas para entregar publicidad). Por ejemplo, una plataforma de tecnología publicitaria podría aprender de una tienda de zapatos en línea que los navegadores de las cohortes 1101 y 1354 parecen interesados en el equipo de senderismo de la tienda. De otros anunciantes, la plataforma adtech aprende sobre otros intereses de esas cohortes.

Posteriormente, la plataforma publicitaria puede usar estos datos para seleccionar anuncios relevantes (como un anuncio de calzado de montaña de la zapatería) cuando un navegador de una de esas cohortes solicita una página de un sitio que muestra anuncios, como un sitio web de noticias.

Privacy Sandbox es una serie de propuestas para satisfacer casos de uso de terceros sin la necesidad de las cookies de terceros u otros mecanismos de seguimiento. Consulta [Profundizando sobre la Privacy Sandbox](/digging-into-the-privacy-sandbox) para obtener una descripción general de todas las propuestas.

**Esta propuesta necesita de tu retroalimentación.** Si tienes comentarios, [crea un problema](https://github.com/WICG/floc/issues/new) en el repositorio de [FLoC Explainer.](https://github.com/WICG/floc) Si tienes comentarios sobre el experimento de Chrome con esta propuesta, publica una respuesta en [Intent to Experiment (Intención de experimentar)](https://groups.google.com/a/chromium.org/g/blink-dev/c/MmijXrmwrJs).

## ¿Por qué necesitamos FLoC?

Muchas empresas confían en la publicidad para dirigir el tráfico a sus sitios y muchos sitios web de editores financian el contenido vendiendo inventario publicitario. En general, las personas prefieren ver anuncios que sean relevantes y útiles para ellos, mientras que los anuncios relevantes también brindan más negocios a los anunciantes y [más ingresos a los sitios web que los alojan](https://services.google.com/fh/files/misc/disabling_third-party_cookies_publisher_revenue.pdf). En otras palabras, el espacio publicitario es más valioso cuando muestra anuncios relevantes. Por lo tanto, la selección de anuncios relevantes aumenta los ingresos de los sitios web con publicidad. Eso, a su vez, significa que los anuncios relevantes ayudan a financiar la creación de contenido que beneficia a los usuarios.

Sin embargo, las personas están preocupadas por las implicaciones de privacidad de la publicidad personalizada ya que actualmente se basa en técnicas como las cookies de seguimiento y la toma de huellas digitales del dispositivo, que pueden revelar tu historial de navegación entre los sitios a los anunciantes o plataformas publicitarias. La propuesta de FLoC tiene como objetivo permitir la selección de anuncios de una manera que proteja mejor la privacidad.

## ¿Para qué se puede utilizar FLoC?

- Mostrar anuncios a personas cuyos navegadores pertenecen a una cohorte que se ha observado que visita con frecuencia el sitio de un anunciante o muestra interés en temas relevantes.
- Utilizar modelos de aprendizaje automático (machine learning) para predecir la probabilidad de que un usuario se convierta en función de su cohorte, a fin de informar el comportamiento de las ofertas de subastas de anuncios.
- Recomendar contenido a los usuarios. Por ejemplo, supongamos que un sitio de noticias observa que tu página de podcasts deportivos se ha vuelto especialmente popular entre los visitantes de las cohortes 1234 y 7. Estos pueden recomendar ese contenido a otros visitantes de esas cohortes.

## ¿Cómo funciona FLoC?

El siguiente ejemplo describe las diferentes funciones en la selección de un anuncio mediante FLoC.

- El **anunciante** (una empresa que paga la publicidad) en este ejemplo es un minorista de calzado en línea:<br> **<u>shoestore.example</u>**

- El **editor** (un sitio que vende espacio publicitario) en este ejemplo es un sitio de noticias:<br> **<u>dailynews.example</u>**

- La **plataforma adtech** (que proporciona software y herramientas para entregar publicidad) es:<br> **<u>adnetwork.example</u>**

{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/wnJ1fSECf5STngywgE7V.png", alt="Diagrama que muestra, paso a paso, las diferentes funciones en la selección y publicación de un anuncio con FLoC: servicio FLoC, navegador, anunciantes, editor (para observar las cohortes), adtech, editor (para mostrar anuncios)", width="800", height="359" %}

En este ejemplo, hemos llamado a los usuarios **Yoshi** y **Alex**. Inicialmente, sus navegadores pertenecen a la misma cohorte de 1354.

{% Aside %} Hemos llamado a los usuarios aquí Yoshi y Alex, pero esto es solo para el propósito del ejemplo. Los nombres y las identidades individuales no se revelan al anunciante, editor o plataforma de adtech con FLoC.

No pienses en una cohorte como una colección de personas. En su lugar, piensa que una cohorte es como una agrupación de actividad de navegación. {% endAside %}

### 1. Servicio FLoC

1. El servicio FLoC utilizado por el navegador crea un modelo matemático con miles de "cohortes", cada una de las cuales corresponderá a miles de navegadores web con historiales recientes de navegación similares. A [continuación](#floc-server) aprenderás más sobre cómo funciona esto.
2. A cada cohorte se le asigna un número.

### 2. Navegador

1. Desde el servicio FLoC, el navegador de Yoshi obtiene datos que describen el modelo FLoC.
2. El navegador de Yoshi calcula su cohorte [utilizando el algoritmo del modelo FLoC](#floc-algorithm) para calcular qué cohorte corresponde de manera más similar a su propio historial de navegación. En este ejemplo, esa será la cohorte de 1354. Ten en cuenta que el navegador de Yoshi no comparte ningún dato con el servicio FLoC.
3. De la misma manera, el navegador de Alex calcula su ID de cohorte. El historial de navegación de Alex es diferente al de Yoshi, pero lo suficientemente similar como para que sus navegadores pertenezcan a la cohorte de 1354.

### 3. Anunciante: <span style="font-weight:normal">shoestore.example</span>

1. Yoshi visita la tienda de <u>shoestore.example</u>.
2. El sitio le pregunta al navegador de Yoshi su cohorte: 1354.
3. Yoshi mira el calzado de montaña.
4. El sitio registra que un navegador de la cohorte 1354 mostró interés en las botas de montaña.
5. Posteriormente, el sitio registra un interés adicional en sus productos de la cohorte 1354, así como de otras cohortes.
6. El sitio periódicamente agrega y comparte información sobre cohortes e intereses de productos con su plataforma adtech <u>adnetwork.example</u>.

Ahora es el turno de Alex.

### 4. Editor: <span style="font-weight:normal">dailynews.example</span>

1. Alex visita <u>dailynews.example</u>.
2. El sitio le pregunta al navegador de Alex cuál es su cohorte.
3. Luego, el sitio solicita un anuncio a su plataforma adtech, <u>adnetwork.example</u>, incluida la cohorte del navegador de Alex: 1354.

### 5. Plataforma de <span style="font-weight:normal">Adtech: adnetwork.example</span>

1. <u>adnetwork.example</u> puede seleccionar un anuncio adecuado para Alex combinando los datos que tiene del editor <u>dailynews.example</u> y la <u>shoestore.example</u> del anunciante.

- La cohorte del navegador de Alex (1354) es proporcionada por <u>dailynews.example</u>.
- Datos sobre cohortes e intereses de productos de la <u>shoestore.example</u>. Ejemplo: "Los navegadores de la cohorte 1354 podrían estar interesados en calzado de montaña".

1. <u>adnetwork.example</u> selecciona un anuncio apropiado para Alex: un anuncio de botas de montaña en <u>shoestore.example</u>.
2. <u>dailynews.example</u> muestra el anuncio 🥾.

{% Aside %} Los enfoques actuales para la selección de anuncios se basan en técnicas como las cookies de seguimiento y la toma de huellas digitales del dispositivo, que son utilizadas por terceros, como los anunciantes, para rastrear el comportamiento de navegación individual.

Con FLoC, el navegador **no comparte** tu historial de navegación con el servicio FLoC ni con nadie más. El navegador, en el dispositivo del usuario, determina a qué grupo pertenece. El historial de navegación del usuario nunca abandona el dispositivo. {% endAside %}

## ¿Quién ejecuta el servicio de back-end que crea el modelo FLoC?

Cada proveedor de navegadores deberá tomar su propia decisión sobre cómo agrupar los navegadores en cohortes. Chrome está ejecutando su propio servicio FLoC; otros navegadores podrían optar por implementar FLoC con un enfoque de agrupación en clúster diferente y ejecutarían su propio servicio para hacerlo.

## ¿Cómo permite el servicio FLoC que el navegador calcule tu cohorte? {: #floc-server }

1. El servicio FLoC utilizado por el navegador crea una representación matemática multidimensional de todos los posibles historiales de navegación web. A este modelo lo llamaremos "espacio de cohortes".
2. El servicio divide este espacio en miles de segmentos. Cada segmento representa un grupo de miles de historias de navegación similares. Estas agrupaciones no se basan en conocer ningún historial de navegación real; se basan simplemente en elegir centros aleatorios en "espacio de cohorte" o en cortar el espacio con líneas aleatorias.
3. A cada segmento se le asigna un número de cohorte.
4. El navegador web obtiene estos datos que describen el "espacio de cohorte" de su servicio FLoC.
5. A medida que un usuario se desplaza por la web, su navegador [utiliza un algoritmo](#floc-algorithm) para calcular periódicamente la región en el "espacio de cohorte" que corresponde más estrechamente con su propio historial de navegación.

<figure style="text-align: center">{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/32k5jByqLrgwSMwb9mqo.png", alt="Diagrama del 'espacio del historial de navegación' creado por un servidor FLoC, que muestra varios segmentos, cada uno con un número de cohorte.", width="400", height="359" %} <figcaption> El servicio FLoC divide el "espacio de cohortes" en miles de segmentos (aquí solo se muestran algunos).</figcaption></figure>

{% Aside %} En ningún momento de este proceso se comparte el historial de navegación del usuario con el servicio FLoC o con un tercero. La cohorte del navegador es calculada por el navegador, en el dispositivo del usuario. El servicio FLoC no adquiere ni almacena datos del usuario. {% endAside %}

## ¿Puede cambiar la cohorte de un navegador?

¡*Sí*! ¡La cohorte de un navegador definitivamente puede cambiar! Probablemente no visites los mismos sitios web todas las semanas, y la cohorte de tu navegador lo reflejará.

Una cohorte representa un grupo de actividad de navegación, no una colección de personas. Las características de actividad de una cohorte son generalmente consistentes a lo largo del tiempo, y las cohortes son útiles para la selección de anuncios porque agrupan comportamientos similares de navegación recientes. Los navegadores de las personas individuales entrarán y saldrán de una cohorte a medida que cambie su comportamiento de navegación. Inicialmente, esperamos que el navegador vuelva a calcular su cohorte cada siete días.

En el ejemplo anterior, la cohorte del navegador de Yoshi y Alex es 1354. En el futuro, el navegador de Yoshi y el navegador de Alex pueden pasar a una cohorte diferente si cambian sus intereses. En el siguiente ejemplo, el navegador de Yoshi se mueve a la cohorte 1101 y el navegador de Alex se mueve a la cohorte 1378. Los navegadores de otras personas entrarán y saldrán de las cohortes a medida que cambien sus intereses de navegación.

<figure style="text-align: center">{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/LMkb62V3iJTqkOrFACnM.png", alt="Diagrama del 'espacio del historial de navegación' creado por un servidor FLoC, el cual muestra múltiples segmentos, cada uno con un número de cohorte. El diagrama muestra los navegadores que pertenecen a los usuarios pertenecientes a un número de cohorte. Esto muestra a los navegadores de Yoshi y de Alex pasando de una cohorte a otra a medida que sus intereses de navegación cambian con el tiempo.", width="800", height="533" %} <figcaption> Las cohortes de los navegadores de Yoshi y Alex pueden cambiar si cambian sus intereses.</figcaption></figure>

{% Aside %} Una cohorte define un grupo de actividad de navegación, no un grupo de personas. Los navegadores entrarán y saldrán de una cohorte a medida que cambie su actividad. {% endAside %}

## ¿Cómo calcula el navegador su cohorte? {: #floc-algorithm }

Como se describió anteriormente, el navegador del usuario obtiene datos de su servicio FLoC que describe el modelo matemático para cohortes: un espacio multidimensional que representa la actividad de navegación de todos los usuarios. A continuación, el navegador utiliza un algoritmo para determinar qué región de este "espacio de cohorte" (es decir, cuál cohorte) coincide más con su propio comportamiento de navegación reciente.

## ¿Cómo calcula FLoC el tamaño correcto de cohorte?

Habrá miles de navegadores en cada cohorte.

Un tamaño de cohorte más pequeño puede ser más útil para personalizar anuncios, pero es menos probable que detenga el seguimiento de los usuarios, y viceversa. Un mecanismo para asignar navegadores a cohortes debe hacer un intercambio entre la privacidad y utilidad. Privacy Sandbox utiliza el [k-anonymity](https://en.wikipedia.org/wiki/K-anonymity) para permitir que un usuario "se esconda entre la multitud". Una cohorte es k-anónima si es compartida por al menos k usuarios. Cuanto mayor sea el número k, mayor será la privacidad de la cohorte.

## ¿Se puede utilizar FLoC para agrupar personas en función de categorías delicadas?

El algoritmo de agrupación utilizado para construir el modelo de cohorte FLoC está diseñado para evaluar si una cohorte puede estar correlacionada con categorías sensibles, sin saber por qué una categoría es sensible. Se bloquearán las cohortes que puedan revelar categorías sensibles como raza, sexualidad o historial médico. En otras palabras, al calcular su cohorte, el navegador solo elegirá entre cohortes que no revelarán categorías sensibles.

## ¿FLoC es solo otra forma de categorizar a las personas en línea?

Con FLoC, el navegador de un usuario pertenecerá a una de las miles de cohortes, junto con miles de navegadores de otros usuarios. A diferencia de las cookies de terceros y otros mecanismos de focalización, FLoC solo revela la cohorte en la que se encuentra el navegador de un usuario, y no una identificación de usuario individual. No permite a otros distinguir a un individuo dentro de una cohorte. Además, la información sobre la actividad de navegación que se utiliza para determinar la cohorte de un navegador se mantiene local en el navegador o dispositivo y no se carga en ningún otro lugar. El navegador puede aprovechar aún más otros métodos de anonimización, como la [privacidad diferencial](https://en.wikipedia.org/wiki/Differential_privacy).

## ¿Los sitios web tienen que participar y compartir información?

Los sitios web tendrán la capacidad de optar por entrar o salir de FLoC, por lo que los sitios sobre temas delicados podrán evitar que las visitas a su sitio se incluyan en el cálculo de FLoC. Como protección adicional, el análisis del servicio FLoC evaluará si una cohorte puede revelar información sensible sobre los usuarios sin saber por qué esa cohorte es sensible. Si una cohorte puede representar un número mayor de lo habitual de personas que visitan sitios en una categoría sensible, esa cohorte completa se elimina. Los estados financieros negativos y la salud mental se encuentran entre las categorías sensibles cubiertas por este análisis.

Los sitios web [pueden excluir una página del cálculo de FLoC](https://github.com/WICG/floc#opting-out-of-computation) configurando una cabecera de [Política de permisos](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/) de `interest-cohort=()` para esa página. Para las páginas que no se han excluido, se incluirá una visita de página en el cálculo de FLoC del navegador si `document.interestCohort()` está presente en la página. Durante la actual [prueba de origen de FLoC](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561), también se incluirá la página en el cálculo si Chrome detecta que la página [carga anuncios o recursos relacionados con anuncios](https://github.com/WICG/floc/issues/82). (El [etiquetado de anuncios en Chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/ad_tagging.md) explica cómo funciona el mecanismo de detección de anuncios de Chrome).

Las páginas servidas desde direcciones IP privadas, como páginas de intranet, no serán parte del cálculo de FLoC.

## ¿Cómo funciona la API de JavaScript de FLoC?

{% Aside %} La prueba de origen para la versión inicial de FLoC, se ejecuto desde Chrome 89 hasta Chrome 91, [actualmente se encuentra finalizada](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561). {% endAside %}

La API de FLoC es muy simple: solo un método único que devuelve una promesa que se resuelve en un objeto que proporciona el `id` de la cohorte y la `version`:

```javascript
const { id, version } = await document.interestCohort();
console.log('FLoC ID:', id);
console.log('FLoC version:', version);
```

Los datos disponibles de la cohorte se ven así:

```js
{
  id: "14159",
  version: "chrome.2.1"
}
```

El valor de `version` permite a los sitios que utilizan FLoC saber a qué navegador y a qué modelo de FLoC se refiere la ID de cohorte. Como se describe a continuación, la promesa devuelta por `document.interestCohort()` se rechazará para cualquier marco al que no se le permita el permiso de `interest-cohort`.

## ¿Pueden los sitios web optar por no ser incluidos en el cálculo de FLoC?

La política de permiso de `interest-cohort` permite a un sitio declarar que no desea ser incluido en la lista de sitios del usuario para el cálculo de cohortes. La política estará en `allow` de forma predeterminada. La promesa devuelta por `document.interestCohort()` se rechazará para cualquier marco que no tenga el permiso de `interest-cohort`. Si el marco principal no tiene el permiso de `interest-cohort`, la visita a la página no se incluirá en el cálculo de la cohorte de intereses.

Por ejemplo, un sitio puede optar por no participar en todos los cálculos de cohortes de FLoC enviando la siguiente cabecera de respuesta HTTP:

```text
  Permissions-Policy: interest-cohort=()
```

## ¿Puede un usuario evitar que los sitios obtengan la cohorte FLoC de su navegador?

Si un usuario deshabilita el Privacy Sandbox en `chrome://settings/privacySandbox`, el navegador no proporcionará la cohorte del usuario cuando se le pregunté mediante JavaScript. Por lo tanto, la promesa de `document.interestCohort()` se rechazará.

## ¿Cómo puedo hacer sugerencias o proporcionar retroalimentación?

Si tienes comentarios sobre la API, [crea un problema](https://github.com/WICG/floc/issues/new) en el repositorio de [FLoC Explainer](https://github.com/WICG/floc).

## Para saber más

- [Profundizando la Privacy Sandbox](/digging-into-the-privacy-sandbox/)
- [Explicador de FLoC](https://github.com/WICG/floc)
- [Agrupación y prueba del origen de FLoC](https://sites.google.com/a/chromium.org/dev/Home/chromium-privacy/privacy-sandbox/floc)
- [Evaluación de algoritmos de cohorte para la API de FLoC](https://github.com/google/ads-privacy/blob/master/proposals/FLoC/README.md)

---

Foto de [Rhys Kentish](https://unsplash.com/@rhyskentish) en [Unsplash](https://unsplash.com/photos/I5AYxsxSuVA).
