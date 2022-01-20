---
layout: post
title: Patrones para promover la instalación de las PWA
authors:
  - pjmclachlan
  - mustafakurtuldu
date: 2019-06-04
updated: 2020-06-17
description: |2-

  Cómo promover la instalación de aplicaciones web progresivas y sus mejores prácticas.
tags:
  - progressive-web-apps
feedback:
  - api
---

La instalación de tu aplicación web progresiva (PWA) puede facilitar a los usuarios su búsqueda y uso. Incluso con la promoción del navegador, algunos usuarios no se dan cuenta de que pueden instalar una PWA, por lo que puede ser útil brindar una experiencia en la aplicación que puedas usar para promover y habilitar la instalación de tu PWA.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PtJp54jasjOYyh9Soqzu.png", alt="Captura de pantalla de un botón de instalación simple de una PWA", width="800", height="368" %} <figcaption> Un botón de instalación simple  provisto dentro de tu PWA.</figcaption></figure>

Esta lista no es de ninguna manera exhaustiva, pero ofrece un punto de partida para diferentes formas de promover la instalación de tu PWA. Independientemente del patrón *o patrones* que utilices, todos conducen al mismo código que activa el flujo de instalación, documentado en [Cómo proporcionar tu propia experiencia de instalación en la aplicación](/customize-install/).

<div class="w-clearfix"> </div>

## Prácticas recomendadas para la promoción de instalaciones de PWA {: #best-practices }

Existen algunas prácticas recomendadas que se aplican independientemente de los patrones promocionales que utilices en tu sitio.

- Mantén las promociones fuera del flujo de los viajes de tus usuarios. Por ejemplo, en una página de inicio de sesión de PWA, pon la llamada a la acción debajo del formulario de inicio de sesión y el botón de envió. El uso disruptivo de patrones promocionales reduce la usabilidad de tu PWA e impacta negativamente en tus métricas de participación.
- Incluye la posibilidad de ignorar o rechazar la promoción. Recuerda la preferencia del usuario si hace esto y solo vuelve a preguntar si hay un cambio en la relación del usuario con su contenido, como si inició sesión o completó una compra.
- Combina más de una de estas técnicas en diferentes partes de tu PWA, pero ten cuidado de no abrumar o molestar a tu usuario con la promoción de instalación.
- Muestra la promoción solo **después** de que el [evento](/customize-install/#beforeinstallprompt) `beforeinstallprompt` se haya disparado.

## Promoción automática del navegador {: #browser-promotion }

Cuando se cumplen [ciertos criterios](/install-criteria/), la mayoría de los navegadores le indicarán automáticamente al usuario que tu aplicación web progresiva se puede instalar. Por ejemplo, el escritorio de Chrome muestra un botón de instalación en el cuadro multifunción.

<div class="w-columns">
  <figure id="browser-install-promo">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zIfRss5zOrZ49c4VdJ52.png", alt="Captura de pantalla del cuadro multifunción con indicador de instalación visible", width="800", height="307" %} <figcaption> Promoción de instalación proporcionada por el navegador (escritorio)</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kRjcsxlHDZa9Nqg2Fpei.png", alt="Captura de pantalla de la promoción de instalación proporcionada por el navegador", width="800", height="307" %}<figcaption> Promoción de instalación proporcionada por el navegador (móvil)</figcaption></figure>
</div>

<div class="w-clearfix"> </div>

Chrome para Android mostrará una mini barra de información al usuario, aunque esto se puede evitar llamando a `preventDefault()` en el evento de `beforeinstallprompt`. Si no llamas a `preventDefault()`, el banner se mostrará la primera vez que un usuario visite tu sitio y cumpla con los criterios de instalación en Android y luego nuevamente después de 90 días aproximadamente.

## Patrones promocionales de la interfaz de usuario de la aplicación {: #app-ui-patterns }

Los patrones promocionales de la interfaz de usuario de la aplicación se pueden utilizar para casi cualquier tipo de PWA y aparecen en la interfaz de usuario de la aplicación, como la navegación del sitio y en los banners. Al igual que con cualquier otro tipo de patrón promocional, es importante conocer el contexto del usuario para minimizar la interrupción del viaje del usuario.

Los sitios que tienen en cuenta cuándo activan la interfaz de usuario de promoción logran una mayor cantidad de instalaciones y evitan interferir con los viajes de los usuarios que no están interesados en la instalación.

<div class="w-clearfix"> </div>

### Botón de instalación simple {: #simple-button }

La experiencia de usuario más simple posible es incluir un botón de 'Instalar' o de 'Obtener aplicación' en una ubicación adecuada en tu contenido web. Asegúrate de que el botón no bloquee otras funciones importantes y no obstaculice el recorrido del usuario a través de tu aplicación.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kv0x9hxZ0TLVaIiP4Bqx.png", alt="Botón personalizado de instalación", width="800", height="448" %}<figcaption> Botón de instalación simple</figcaption></figure>

<div class="w-clearfix"> </div>

### Encabezado fijo {: #header }

Este es un botón de instalación que forma parte del encabezado de tu sitio. Otro contenido de encabezado a menudo incluye la marca del sitio, como un logotipo y el menú de hamburguesas. Los encabezados pueden tener la propiedad de `position:fixed` o no, según la funcionalidad de tu sitio y las necesidades del usuario.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GPJdkXcpNLR30r2zo7RR.png", alt="Botón personalizado de instalación en el encabezado", width="800", height="448" %}<figcaption> Botón personalizado de instalación en el encabezado</figcaption></figure>

Cuando se usa adecuadamente, promover la instalación de PWA desde el encabezado de tu sitio es una excelente manera de facilitar que tus clientes más leales regresen a tu experiencia. Los píxeles en el encabezado de tu PWA son valiosos, así que asegúrate de que tu llamado a la acción de instalación tenga el tamaño adecuado, sea más importante que otro posible contenido de encabezado y no sea intrusivo.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/L01AoSoy7LNk1ttMMax0.png", alt="Botón personalizado de instalación en el encabezado", width="800", height="430" %} <figcaption> Botón personalizado de instalación en el encabezado</figcaption></figure>

Asegúrate de que tú:

- No muestres el botón de instalación a menos que se haya disparado `beforeinstallprompt`.
- Evalúes el valor de tu caso de uso instalado para tus usuarios. Considera el enfoque selectivo para presentar tu promoción solo a los usuarios que probablemente se beneficiarán de ella.
- Utilices el valioso espacio del encabezado de manera eficiente. Considera qué más sería útil ofrecer a tu usuario en el encabezado y evalúar la prioridad de la promoción de instalación en relación con otras opciones.

<div class="w-clearfix"> </div>

### Menú de navegación {: #nav }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aT7NHi8lbsZW8TOm3Gaw.png", alt="Botón personalizado de instalación en el menú de navegación", width="800", height="1117" %}<figcaption> Agrega un botón y/o promoción de instalación en un menú de navegación deslizable.</figcaption></figure>

El menú de navegación es un gran lugar para promover la instalación de tu aplicación, ya que los usuarios que abren el menú están indicando que están involucrados con tu experiencia.

Asegúrate de que tú:

- Evites interrumpir el contenido de navegación importante. Coloca la promoción de instalación de PWA debajo de otros elementos del menú.
- Ofrezcas una presentación breve y relevante de por qué el usuario se beneficiaría de la instalación de tu PWA.

<div class="w-clearfix"> </div>

### Página de aterrizaje {: #landing }

El propósito de una página de aterrizaje es promocionar tus productos y servicios, por lo que este es un lugar en el que es apropiado para promocionar a lo grande los beneficios de instalar tu PWA.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7q09M12HFxgIiWhKPGma.png", alt="Solicitud personalizada de instalación en la página de aterrizaje", width="800", height="1117" %}<figcaption> Solicitud personalizada de instalación en la página de aterrizaje</figcaption></figure>

Primero, explica la propuesta de valor de tu sitio y luego informa a los visitantes qué obtendrán al instalar la aplicación.

Asegúrate de que tú:

- Apeles a las funciones que más le interesan a tus visitantes y enfatices las palabras clave que podrían haberlos llevado a tu página de aterrizaje.
- Haz que la promoción de la instalación y el llamado a la acción sean llamativos, pero solo después de haber dejado clara tu propuesta de valor. Después de todo, esta es tu página de aterrizaje.
- Considera agregar una promoción de instalación en la parte donde los usuarios pasan más tiempo en tu aplicación.

<div class="w-clearfix"> </div>

### Instalar un banner {: #banner }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7fLCQQhdk2OzrQD3Xh4E.png", alt="Banner personalizado de instalación en la parte superior de la página", width="800", height="1000" %}<figcaption> Un banner descartable en la parte superior de la página.</figcaption></figure>

La mayoría de los usuarios han encontrado banners de instalación en experiencias móviles y están familiarizados con las interacciones que ofrece un banner. Los banners deben usarse con cuidado porque pueden molestar al usuario.

Asegúrate de que tú:

- Esperes hasta que el usuario haya demostrado interés en tu sitio antes de mostrar un banner. Si el usuario decide ignorar tu banner, no lo vuelvas a mostrar a menos que el usuario active un evento de conversión que indique un mayor nivel de participación con tu contenido, como una compra en un sitio de comercio electrónico o el registro de una cuenta.
- Proporciona una breve explicación del valor de instalar tu PWA en el banner. Por ejemplo, puedes diferenciar la instalación de una PWA de una aplicación de iOS o Android mencionando que casi no usa almacenamiento en el dispositivo del usuario o que se instalará instantáneamente sin un redireccionamiento a la tienda.

<div class="w-clearfix"> </div>

### IU temporal {: #temporary-ui }

La interfaz de usuario temporal, como el patrón de diseño de [Snackbar](https://material.io/components/snackbars/), notifica al usuario y te permite completar una acción fácilmente. En este caso, instalar la aplicación. Cuando se usan correctamente, este tipo de patrones de IU no interrumpen el flujo del usuario y, por lo general, se descartan automáticamente si el usuario los ignora.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6DySYRtyegazEfMcWXQL.png", alt="Banner personalizado de instalación como snackbar.", width="800", height="448" %}<figcaption> Un snackbar descartable que indica que la PWA es instalable.</figcaption></figure>

Muestra la snackbar después de algunos compromisos e interacciones con tu aplicación. Si aparece al cargar la página, o fuera de contexto, se puede pasar por alto fácilmente o provocar una sobrecarga cognitiva. Cuando esto sucede, los usuarios simplemente descartarán todo lo que ven. Recuerda, es posible que los nuevos usuarios de tu sitio no estén listos para instalar tu PWA, por lo tanto, es mejor esperar hasta que tengas fuertes señales de interés del usuario antes de usar este patrón, por ejemplo, visitas repetidas, un inicio de sesión de usuario o un evento similar de conversión.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/d8dwdIe1rYSgd0JdCGtt.png", alt="Banner personalizado de instalación como snackbar.", width="800", height="424" %}<figcaption> Un snackbar descartable que indica que la PWA es instalable.</figcaption></figure>

Asegúrate de que tú:

- Muestres la snackbar entre 4 y 7 segundos para que los usuarios tengan tiempo suficiente para verla y reaccionar a ella y sin estorbar.
- Evites mostrar la snackbar sobre otra interfaz de usuario temporal, como banners, etc.
- Esperes hasta que tengas fuertes señales de interés del usuario antes de usar este patrón, por ejemplo, visitas repetidas, un inicio de sesión de usuario o un evento similar de conversión.

<div class="w-clearfix"> </div>

## Después de la conversión

Inmediatamente después de un evento de conversión de usuario, por ejemplo, después de una compra en un sitio de comercio electrónico, es una excelente oportunidad para promover la instalación de tu PWA. El usuario está claramente comprometido con tu contenido, y una conversión a menudo indica que el usuario volverá a interactuar con tus servicios.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/DrepSPFAm64d5cvTFoXe.png", alt="Captura de pantalla de la promoción de instalación después de la conversión.", width="800", height="448" %} <figcaption> Instala la promoción después de que el usuario haya completado la compra.</figcaption></figure>

### Viaje de pago o reserva {: #journey }

<figure data-float="right">{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bOYZM2UiWK5itVSpjKWO.png", alt = "Instalar la promoción después de un viaje del usuario", width = "800", height = "1419"%}<figcaption> Instalar la promoción después de un viaje del usuario.</figcaption></figure>

Muestra una promoción de instalación durante o después de un viaje secuencial, como los típicos flujos de pago o reserva. Si muestras la promoción después de que el usuario haya completado el viaje, a menudo puedes hacerla más prominente una vez que el viaje sea completado.

Asegúrate de que tú:

- Incluyas una llamada a la acción relevante. ¿Qué usuarios se beneficiarán de la instalación de tu aplicación y por qué? ¿Qué importancia tiene para el viaje que están emprendiendo actualmente?
- Si tu marca tiene ofertas únicas para los usuarios de aplicaciones instaladas, asegúrate de mencionarlas aquí.
- Mantén la promoción fuera de los próximos pasos en su viaje o este podrá afectar negativamente las tasas de finalización del mismo. En el ejemplo de comercio electrónico anterior, observa cómo la clave de la llamada a la acción para realizar el pago está por encima de la promoción de instalación de la aplicación.

<div class="w-clearfix"> </div>

### Flujo de registro, inicio de sesión o cierre de sesión {: #sign-up }

Esta promoción es un caso especial del patrón promocional del [viaje](#journey) donde la tarjeta de promoción puede ser más prominente.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PQXqSqtwRSwyELdJMjtd.png", alt="Botón personalizado de instalación en la página de registro.", width="800", height="1117" %} <figcaption> Botón personalizado de instalación en la página de registro.</figcaption></figure>

Por lo general, estas páginas solo las ven los usuarios comprometidos, cuando ya se ha establecido la propuesta de valor de tu PWA. Es normal que no haya mucho otro contenido útil para colocar en estas páginas. Como resultado, es menos perturbador hacer un llamado a la acción más grande siempre que no estorbe.

Asegúrate de que tú:

- Evites interrumpir el viaje del usuario dentro del formulario de registro. Si se trata de un proceso de varios pasos, es posible que desees esperar hasta que el usuario haya completado el viaje.
- Promociones las funciones más relevantes para un usuario registrado.
- Consideres agregar una promoción de instalación adicional dentro de las áreas en las que inició sesión de su aplicación.

<div class="w-clearfix"> </div>

## Patrones promocionales en línea

Las técnicas de promoción en línea entrelazan las promociones con el contenido del sitio. Esto suele ser más sutil que la promoción en la interfaz de usuario de la aplicación, pero como todo, tiene sus ventajas y desventajas. Tu deseo es que tu promoción se destaque lo suficiente como para que los usuarios interesados la noten y que no afecte mucho a la calidad de tu experiencia de usuario.

### En el feed {: #in-feed }

Aparece una promoción de instalación en el feed entre artículos de noticias u otras listas de tarjetas de información en tu PWA.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/LS5qSE2vicfjRBBkA47a.png", alt="Instala la promoción en el feed de contenido.", width="800", height="1000" %}  <figcaption> Instala la promoción en el feed de contenido.</figcaption></figure>

Tu objetivo es mostrar a los usuarios cómo acceder al contenido que disfrutan de una manera más conveniente. Concéntrate en promover características y funcionalidades que serán útiles para tus usuarios.

Asegúrate de que tú:

- Limites la frecuencia de las promociones para evitar molestar a los usuarios.
- Ofrezcas a tus usuarios la posibilidad de ignorar las promociones.
- Recuerdes la elección de tu usuario.
