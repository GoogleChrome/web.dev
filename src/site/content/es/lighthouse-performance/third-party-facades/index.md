---
layout: post
title: Carga diferida de recursos de terceros con fachadas
description: |2

  Conozca las oportunidades para cargar recursos de terceros de forma diferida con fachadas.
date: 2020-12-01
web_lighthouse:
  - fachadas de terceros
---

Los [recursos de terceros](/third-party-javascript/) se utilizan a menudo para mostrar anuncios o videos e integrarse con las redes sociales. El enfoque predeterminado es cargar los recursos de terceros tan pronto como se carga la página, pero esto puede ralentizar innecesariamente la carga de la misma. Si el contenido de terceros no es crítico, este costo de rendimiento se puede reducir [al cargarlo de forma diferida](/fast/#lazy-load-images-and-video).

Esta auditoría destaca las incrustaciones de terceros que se pueden cargar de forma diferida durante la interacción. En ese caso, se utiliza una *fachada* en lugar del contenido de terceros hasta que el usuario interactúe con él.

{% Aside 'key-term' %}

Una *fachada* es un elemento estático que luce similar al tercero incrustado real, pero no es funcional y, por lo tanto, es mucho menos exigente durante la carga de la página.

{% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cvQ4fxFUG5MIXtUfi77Z.jpg", alt="Un ejemplo de carga de un reproductor incrustado de YouTube con una fachada. La fachada pesa 3 KB y el reproductor que pesa 540 KB se carga durante la interacción.", width="800", height="521" %} <figcaption> Se está cargando el reproductor incrustado de YouTube con una fachada.</figcaption></figure>

## Cómo detecta Lighthouse las incrustaciones diferibles de terceros

Lighthouse busca los productos de terceros que se puedan diferir, como widgets de botones sociales o incrustaciones de video (por ejemplo, reproductor incrustado de YouTube).

Los datos sobre los productos diferibles y las fachadas disponibles se [mantienen en third-party-web](https://github.com/patrickhulce/third-party-web/).

La auditoría falla si la página carga recursos que pertenecen a una de estas incrustaciones de terceros.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/R0osncucBqYCIZfC85Hu.jpg", alt="Auditoría Lighthouse de fachada de terceros que destaca el reproductor integrado de Vimeo y el chat en vivo de Drift.", width="800", height="517" %} <figcaption> Auditoría Lighthouse de fachada de terceros.</figcaption></figure>

## Cómo diferir terceros con una fachada

En lugar de agregar un incrustado de terceros directamente a su HTML, cargue la página con un elemento estático que se parezca al del tercero incrustado real. El patrón de interacción debería verse así:

1. Al cargar: se agrega la fachada a la página.

2. Al pasar el mouse por encima: la fachada se conecta previamente a los recursos de terceros.

3. Al hacer clic: la fachada se reemplaza por el producto de terceros.

## Fachadas recomendadas

En general, las incrustaciones de video, los widgets de botones sociales y los widgets de chat pueden emplear el patrón de fachada. La siguiente lista ofrece nuestras recomendaciones de fachadas de código abierto. Al elegir una fachada, tenga en cuenta el equilibrio entre el tamaño y el conjunto de características. También puede usar un cargador de iframe diferido como [vb/lazyframe](https://github.com/vb/lazyframe).

### Reproductor incrustado de YouTube

- [paulirish/lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed)

- [justinribeiro/lite-youtube](https://github.com/justinribeiro/lite-youtube)

- [Daugilas/lazyYT](https://github.com/Daugilas/lazyYT)

### Reproductor incrustado de Vimeo

- [luwes/lite-vimeo-embed](https://github.com/luwes/lite-vimeo-embed)

- [slightlyoff/lite-vimeo](https://github.com/slightlyoff/lite-vimeo)

### Chat en vivo (Intercom, Drift, Help Scout, Facebook Messenger)

- [calibreapp/react-live-chat-loader](https://github.com/calibreapp/react-live-chat-loader) ([entrada de blog](https://calibreapp.com/blog/fast-live-chat))

{% Aside 'caution' %}

Existen algunas compensaciones cuando se cargan terceros con fachadas de manera diferida, ya que no presentan la gama completa de funcionalidades de las incrustaciones reales. Por ejemplo, la burbuja de Drift Live Chat tiene una insignia que indica la cantidad de mensajes nuevos. Si la burbuja de chat en vivo se difiere con una fachada, la burbuja aparece cuando se carga el widget de chat real después de que el navegador muestre `requestIdleCallback`. En el caso de incrustaciones de video, es posible que la reproducción automática no funcione de manera uniforme si se carga de manera diferida.

{% endAside %}

## Escriba su propia fachada

Puede optar por [construir una solución de fachada personalizada](https://wildbit.com/blog/2020/09/30/getting-postmark-lighthouse-performance-score-to-100#:~:text=What%20if%20we%20could%20replace%20the%20real%20widget) que emplee el patrón de interacción descrito anteriormente. La fachada debe ser significativamente más pequeña en comparación con el producto de terceros diferido y solo debe incluir el código suficiente para imitar la apariencia del producto.

Si desea que su solución se incluya en la lista anterior, consulte el [proceso de envío](https://github.com/patrickhulce/third-party-web/blob/master/facades.md).

## Recursos

Código fuente para [recursos de terceros de carga diferida con auditoría de fachadas](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/third-party-facades.js).
