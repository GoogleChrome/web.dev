---
title: Almacenamiento persistente
subhead: El almacenamiento persistente puede ayudar a proteger los datos críticos del desalojo y reducir la posibilidad de pérdida de datos.
authors:
  - petelepage
description: El almacenamiento persistente puede ayudar a proteger los datos críticos del desalojo y reducir la posibilidad de pérdida de datos.
date: 2020-05-12
updated: 2020-05-12
tags:
  - blog
  - storage
  - progressive-web-apps
hero: image/admin/0TWeS0GZhDTpPzQVhDVS.jpg
alt: Placa de circuito impreso
feedback:
  - api
---

Cuando nos enfrentamos a presiones por almacenamiento como lo es el poco espacio en disco, los navegadores normalmente [desalojan los datos](/storage-for-the-web/#eviction), incluso los de la API de Cache y los de IndexedDB, del origen menos utilizado recientemente. Esto puede causar la pérdida de datos si la aplicación no ha sincronizado los datos con el servidor y reducir la confiabilidad de la aplicación al eliminar los recursos necesarios para que funcione, lo cual genera experiencias negativas para el usuario.

Afortunadamente, la investigación realizada por el equipo de Chrome muestra que Chrome en raras ocasiones borra los datos automáticamente. Es mucho más común que los usuarios borren manualmente el almacenamiento. Por lo tanto, si un usuario visita tu sitio con regularidad, las posibilidades de que tus datos sean desalojados son escasas. Para evitar que el navegador elimine tus datos, puedes solicitar que todo el almacenamiento de tu sitio sea marcado como persistente.

{% Aside %} Al solicitar que todos los datos de tu sitio se marquen como persistentes solo se debe de hacerse para datos críticos (por ejemplo, claves de cifrado de extremo a extremo) que, si no se respaldan en la nube, podrían resultar en una pérdida significativa de datos si no son guardados. El navegador no elimina el almacenamiento persistente, incluso si el almacenamiento se está agotando. Solo se eliminará si el usuario elige eliminarlo a través de la configuración de su sitio. {% endAside %}

El almacenamiento persistente es [compatible con muchos](https://caniuse.com/#feat=mdn-api_permissions_persistent-storage_permission) navegadores modernos. Para obtener más información sobre el desalojo, cuánto puedes almacenar y cómo manejar las limitaciones de las cuotas, consulta [Almacenamiento para la web](/storage-for-the-web/).

## Comprueba si el almacenamiento de tu sitio se ha marcado como persistente

Puedes utilizar JavaScript para determinar si el almacenamiento de tu sitio se ha marcado como persistente. Al llamar a `navigator.storage.persisted()` devuelve una Promesa que se resuelve con un booleano, lo que indica si el almacenamiento se ha marcado como persistente o no.

```js
// Verifica si el alojamiento del sitio fue marcado como persistente
if (navigator.storage && navigator.storage.persist) {
  const isPersisted = await navigator.storage.persisted();
  console.log(`Persisted storage granted: ${isPersisted}`);
}
```

## ¿Cuándo debo pedir el almacenamiento persistente?

El mejor momento para solicitar que tu almacenamiento se marque como persistente es cuando guardas los datos críticos del usuario y esa solicitud idealmente debería estar envuelta en un gesto de usuario. No solicites almacenamiento persistente en la carga de la página o en otro código de arranque dado que el navegador puede solicitar permiso al usuario. Si el usuario no está haciendo nada que crea que debe guardarse, el mensaje puede ser confuso y probablemente rechazará la solicitud. Además, no avises con demasiada frecuencia. Si el usuario decidió no otorgar el permiso, no vuelvas a preguntar inmediatamente en el próximo guardado.

## Solicitar almacenamiento persistente

Para solicitar el almacenamiento persistente de los datos de tu sitio, llama a `navigator.storage.persist()`. Devuelve una Promesa que se resuelve con un booleano, lo que indica si se otorgó el permiso de almacenamiento persistente.

```js
// Hace una solicitud de almacenamiento persistente al sitio
if (navigator.storage && navigator.storage.persist) {
  const isPersisted = await navigator.storage.persist();
  console.log(`Persisted storage granted: ${isPersisted}`);
}
```

{% Aside %} Los nombres de API para *verificar* si el almacenamiento de su sitio ya se marcó como persistente y para *solicitar* almacenamiento persistente son muy similares. La forma en que recuerdo la diferencia es que `persisted()` está en tiempo pasado, y se utiliza para comprobar si ya está persisten**te**. Mientras que `persist()` está en tiempo presente y lo solicita en el presente. {% endAside %}

### ¿Cómo se concede el permiso?

El almacenamiento persistente se trata como un [permiso](https://storage.spec.whatwg.org/#persistence). Los navegadores utilizan diferentes factores para decidir si otorgan permisos de almacenamiento persistentes.

#### Chrome y otros navegadores basados en Chromium

Chrome y la mayoría de los navegadores basados en Chromium manejan automáticamente la solicitud de permiso y no muestran ningún mensaje al usuario. En cambio, si un sitio se considera importante, el permiso de almacenamiento persistente se otorga automáticamente; de lo contrario, se niega silenciosamente.

Las heurísticas para determinar si un sitio es importante incluyen:

- ¿Qué tan alto es el nivel de participación del sitio?
- ¿El sitio ha sido instalado o marcado como favorito?
- ¿Se le ha otorgado permiso al sitio para mostrar notificaciones?

Si la solicitud fue negada, se puede solicitar nuevamente más tarde y se evaluará utilizando la misma heurística.

#### Firefox

Firefox delega la solicitud de permiso al usuario. Cuando se solicita el almacenamiento persistente, se le solicita al usuario mediante una ventana emergente de IU que le pregunta si permitirá que el sitio almacene datos en un almacenamiento persistente.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/o8W7pNTZ5dFKeDg2cmvA.jpg", alt="Una ventana emergente que muestra Firefox cuando un sitio solicita el almacenamiento persistente.", width="428", height="177" %} <figcaption> Una ventana emergente que muestra Firefox cuando un sitio solicita el almacenamiento persistente.</figcaption></figure>

## ¿Qué almacenamiento está protegido por almacenamiento persistente?

Si se otorga el permiso de almacenamiento persistente, el navegador no desalojará los datos almacenados en:

- API de Cache
- Cookies
- Almacenamiento DOM (almacenamiento local)
- API de File Systems (sistema de archivos del navegador y en un espacio aislado)
- IndexedDB
- Service workers
- Caché de aplicaciones (obsoleto, no debe usarse)
- WebSQL (obsoleto, no debe usarse)

## Cómo desactivar el almacenamiento persistente

En este momento, no existe una forma programática de decirle al navegador que ya no necesita almacenamiento persistente.

## Conclusión

La investigación del equipo de Chrome muestra que, aunque es posible, Chrome rara vez borra automáticamente los datos almacenados. Para proteger los datos críticos que pueden no almacenarse en la nube, o que resultarán en una pérdida significativa de datos, el almacenamiento persistente puede ser una herramienta útil para garantizar que el navegador no elimine tus datos cuando el dispositivo local se enfrenta a una presión causada por el almacenamiento. Y recuerda, solicita el almacenamiento persistente solo cuando sea más probable que el usuario lo desee.

### Gracias

Un agradecimiento especial a Victor Costan y Joe Medley por revisar este artículo. Gracias a Chris Wilson, quien escribió la versión original de este artículo que apareció por primera vez en WebFundamentals.

Imagen de héroe de Umberto en [Unsplash](https://unsplash.com/photos/jXd2FSvcRr8)
