---
layout: post
title: Cómo la PWA de Goibibo mejoró las conversiones en un 60%
subhead: Cerrando la brecha entre la web y las experiencias de iOS y Android para deleitar a los usuarios.
date: 2020-09-29
hero: image/admin/373gEGS1WasAvqbvVoH9.png
thumbnail: image/admin/i2nyfqyVr4XWqilOxPrY.png
alt: Una ilustración de un teléfono inteligente junto al texto "Escala en la web"
description: Descubre cómo Goibibo, la principal empresa de viajes en línea de la India, logró un aumento del 60% en conversiones mediante la creación de experiencias de usuario fiables entre sus aplicaciones PWA y las de iOS y Android.
tags:
  - blog
  - case-study
  - capabilities
  - progressive-web-apps
  - scale-on-web
---

[Goibibo](https://goibibo.com) es el principal portal de reservas de viajes en línea de la India. Al crear una [aplicación web progresiva (PWA)](/pwa) confiable y con todas las funciones que coincidía con las capacidades de sus aplicaciones iOS y Android, Goibibo logró un aumento del 60% en las conversiones (en comparación con su flujo web anterior).

<div class="stats">
  <div class="stats__item">
    <p class="stats__figure">60 <sub>%</sub></p>
    <p>Incremento de conversiones</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">20 <sub>%</sub></p>
    <p>Aumento de usuarios registrados</p>
  </div>
</div>

## Destacando la oportunidad {: #opportunity }

En su viaje para mejorar la experiencia del usuario, Goibibo notó algunas tendencias:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0dmwrJViuhgA3I4IDCkj.png", alt="PWA de Goibibo.", width="800", height="1624" %}</figure>

- Dado que los usuarios ya cambiaron o están cambiando rápidamente a dispositivos móviles, su estrategia inicial hacia la web móvil fue construir una aplicación liviana y funcional. Esto funcionó, con conversiones de páginas de búsqueda a detalles que se igualaron en la web y en iOS y Android, pero las aplicaciones de iOS y Android ganaron en todos los pasos posteriores del embudo de conversión.

- Hubo caídas significativas en la etapa de pago de la PWA en comparación con sus aplicaciones de iOS y Android. Fue entonces cuando decidieron invertir en su PWA con el objetivo de permitir que los usuarios experimentaran la misma UX en su PWA que en sus aplicaciones de iOS y Android.

- También notaron que casi el 20% de sus usuarios estaban iniciando una sesión en la web y convirtiendo en la aplicación. Esto reiteró su creencia de que una gran parte de los usuarios quedará sin explotar sin una estrategia de aplicación PWA de iOS y Android alineada.

## Las herramientas que usaron {: #tools }

### API de Contact Picker {: #contact-picker }

<div class="switcher">
  <p>Casi el 15% de los usuarios registrados en Goibibo hacen reservas para familiares o amigos en la web móvil. Goibibo usó la <a href="/contact-picker/">API de Contact Picker (Selector de contactos)</a> para permitir a los usuarios de la PWA completar formularios en nombre de otros sin problemas.</p>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Pdqx8qyXbwzzS8ivNS3l.png", alt="Impacto: el 20% de los usuarios eligieron la experiencia perfecta de Goibibo.", width="800", height="360" %}</figure>
</div>

### WebOTP {: #web-otp }

<div class="switcher">
  <p>Debido a que la autenticación segura es un gran desafío en la India, Goibibo utilizó la <a href="/web-otp/">API de WebOTP (contraseña de un solo uso)</a> para reducir la fricción de inicio de sesión en su PWA.</p>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Nf0NeE3sSFOrYleAsxVd.png", alt="Impacto: aumento del 20% en los usuarios que han iniciado sesión en la web móvil; disminución del 25% en las llamadas a la API de reintentos de OTP durante el registro.", width="800", height="526" %}</figure>
</div>

### API de Web Share {: #web-share }

<div class="switcher">
  <p>Para cerrar la brecha entre su experiencia web y de iOS y Android, Goibibo adoptó la <a href="/web-share/">API de Web Share</a> para facilitar el intercambio de enlaces, texto o archivos sobre los detalles del hotel, la disponibilidad de trenes, etc.</p>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/u5pl2i6MHBkDZESQRHXR.png", alt="Impacto: el 5% de las nuevas sesiones provienen de la API de Web Share.", width="800", height="356" %}</figure>
</div>

### Notificaciones push {: #notifications}

<div class="switcher">
  <p>Goibibo usó <a href="https://developers.google.com/web/fundamentals/push-notifications">notificaciones push web</a> para reorientar a los usuarios rebotados con actualizaciones relevantes como alertas de tarifas de vuelos y otro contenido personalizado.</p>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/baFHO5RXsOVdE6qiT0AR.png", alt="Impacto: Los usuarios reorientados se convirtieron 4 veces más en comparación con la base de usuarios normal.", width="800", height="414" %}</figure>
</div>

## Cómo las nuevas capacidades web mejoraron el embudo de Goibibo {: #funnel}

&lt;style&gt; @media (min-width: 865px) { #funnel { max-width: 75%; } } &lt;/style&gt;

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rsENPcTITCviudxIhPU1.png", alt="1. Web Share mejoró el porcentaje de usuarios recurrentes 2. Contact Picker mejoró la experiencia del usuario, lo que facilita la reserva de los clientes 3. WebOTP redujo la fricción durante las transacciones, lo que resulta en menos tiempo dedicado a la pantalla OTP y menos reintentos de llamadas a la API 4. Las notificaciones push mejoraron las conversiones de los usuarios reorientados", width="711", height="627" %}</figure>

## Resultados comerciales generales {: #results }

- Las iteraciones en las interfaces de PWA dieron como resultado un aumento del 60% en la tasa de conversión (en comparación con el flujo web móvil anterior) y deleitaron a los usuarios.
- [Las nuevas capacidades web](https://developer.chrome.com/blog/fugu-status/) mejoraron la UX y provocaron un aumento del 20% en los usuarios registrados (que se convierten 6 veces más).

<blockquote>
  <p style="font-style: italic; font-size: 1.5rem;">Siempre nos esforzamos por lograr una experiencia de usuario perfecta y, a su vez, mejores tasas de conversión. Vimos una mayor participación del usuario y mejores tasas de conversión en el PWA que en el flujo web móvil original. Por lo tanto, invertir en una PWA es fundamental para nuestro éxito y, si no lo hubiéramos hecho, nos habría costado una fortuna.</p>
  <cite>Rithish Saralaya, vicepresidente de ingeniería, Goibibo</cite>
</blockquote>

Consulta la [página de estudios de casos de Scale on web](/tags/scale-on-web) para obtener más historias de éxito de la India y el sudeste asiático.
