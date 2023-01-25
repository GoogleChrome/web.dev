---
layout: post
title: Por qué el HTTPS es importante
authors:
  - kaycebasques
date: 2015-11-23
updated: 2020-04-07
description: |2-

  HTTPS protege la integridad de tu sitio web, protege la privacidad y seguridad de
  tus usuarios, y es un nuevo requisito previo para las potentes API de plataforma web.
tags:
  - security
---

Siempre debes de proteger todos tus sitios web con HTTPS, incluso si no manejan comunicaciones confidenciales. Además de proporcionar seguridad crítica e integridad de datos tanto para tus sitios web como para la información personal de tus usuarios, el HTTPS es un requisito para muchas funciones nuevas del navegador, en particular las necesarias para [las aplicaciones web progresivas (PWA)](/progressive-web-apps).

{% YouTube 'iP75a1Y9saY' %}

## Resumen {: #summary }

- Los intrusos, tanto malignos como benignos, explotan todos los recursos desprotegidos entre tus sitios web y tus usuarios.
- Muchos intrusos miran comportamientos agregados para identificar a sus usuarios.
- HTTPS no solo bloquea el uso indebido de tu sitio web. También es un requisito para muchas funciones de vanguardia y es una tecnología habilitadora para capacidades similares a las de una aplicación, como los service workers.

## HTTPS protege la integridad de tu sitio web {: #integrity }

HTTPS ayuda a evitar que los intrusos manipulen las comunicaciones entre tus sitios web y los navegadores de tus usuarios. Los intrusos incluyen atacantes maliciosos de manera intencional y las empresas legítimas, pero intrusivas, como son las ISP y hoteles, inyectan anuncios en las páginas.

Los intrusos explotan las comunicaciones no protegidas para engañar a tus usuarios para que proporcionen información confidencial o instalen malware, o para insertar sus propios anuncios en tus recursos. Por ejemplo, algunos terceros inyectan anuncios en sitios web que potencialmente rompen las experiencias de los usuarios y crean vulnerabilidades en la seguridad.

Los intrusos explotan todos los recursos desprotegidos que viajan entre tus sitios web y tus usuarios. Imágenes, cookies, scripts, HTML… todos son explotables. Las intrusiones pueden ocurrir en cualquier lugar de la red, incluyendo la máquina del usuario, un punto de acceso Wi-Fi o un ISP comprometido, solo por nombrar algunos ejemplos.

## HTTPS protege la privacidad y la seguridad de tus usuarios {: #privacy }

HTTPS evita que los intrusos puedan escuchar pasivamente las comunicaciones entre tus sitios web y tus usuarios.

Un error común sobre el HTTPS es que los únicos sitios web que necesitan HTTPS son los que manejan comunicaciones confidenciales. Cada solicitud HTTP desprotegida puede potencialmente revelar información sobre los comportamientos y las identidades de tus usuarios. Aunque una sola visita a uno de tus sitios web desprotegidos puede no parecer alarmante, algunos intrusos miran las actividades de navegación agregadas de tus usuarios para hacer inferencias sobre tus comportamientos e intenciones y también para [anonimizar](https://en.wikipedia.org/wiki/De-anonymization) sus identidades. Por ejemplo, los empleados pueden revelar inadvertidamente condiciones de salud delicadas a sus jefes con solo leer artículos médicos desprotegidos.

## HTTPS es el futuro de la web {: #capabilities }

Las nuevas y potentes funciones de la plataforma web, como tomar fotografías o grabar audio con `getUserMedia()`, permitir experiencias de aplicaciones sin conexión con los [service workers](/service-workers-cache-storage/) o crear [aplicaciones web progresivas](/progressive-web-apps), requieren permiso explícito del usuario antes de ejecutar. Muchas API más antiguas también se están actualizando para requerir permiso de ejecución, como lo es la [API de Geolocalización](https://developer.mozilla.org/docs/Web/API/Geolocation/Using_geolocation). HTTPS es un componente clave para los flujos de trabajo de permisos tanto para estas nuevas funciones como para las API actualizadas.
