---
layout: post
title: "¿Qué son las aplicaciones web progresivas?"
authors:
  - samrichard
  - petelepage
date: 2020-01-06
updated: 2020-02-24
description: |2-

  Una introducción a las aplicaciones web progresivas (PWA) y los tres pilares que
  los separa de otras aplicaciones web.
tags:
  - progressive-web-apps
---

La web es una plataforma increíble. Su combinación de ubicuidad entre dispositivos y sistemas operativos, su modelo de seguridad centrado en el usuario y el hecho de que ni su especificación ni su implementación están controladas por una sola empresa hacen de la web una plataforma única para desarrollar software. Combinado con su capacidad de vinculación inherente, es posible buscar y compartir lo que ha encontrado con cualquier persona, en cualquier lugar. Siempre que visita un sitio web, está actualizado y su experiencia con ese sitio puede ser tan efímera o permanente como desees. Las aplicaciones web pueden llegar a *cualquier persona, en cualquier lugar y con cualquier dispositivo* con una única base de código.

Las aplicaciones específicas de la plataforma son conocidas por ser increíblemente ricas y confiables. Están siempre presentes en las pantallas de inicio, los dock y en las barras de tareas. Funcionan independientemente de la conexión de red. Se lanzan en su propia experiencia independiente. Pueden leer y escribir archivos desde el sistema de archivos local, acceder al hardware conectado a través de un puerto USB o bluetooth, e incluso interactuar con los datos almacenados en su dispositivo, como contactos y eventos del calendario. En estas aplicaciones, puedes hacer cosas como tomar fotografías, ver la reproducción de canciones en la pantalla de inicio o controlar la reproducción de canciones mientras está en otra aplicación. Las aplicaciones específicas de la plataforma se sienten como *parte* del dispositivo en el que se ejecutan.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1DKtUFjXLJbiiruKA9P1.svg", alt="Un gráfico que ilustra las capacidades relativas y el alcance de aplicaciones específicas de plataforma con altas capacidades, aplicaciones web con alto alcance, y aplicaciones web progresivas que tienen una gran capacidad y gran alcance.", width="370", height="367" %}<figcaption> Capacidades contra el alcance de aplicaciones específicas de plataforma, aplicaciones web y aplicaciones web progresivas.</figcaption></figure>

Si piensa en aplicaciones web y aplicaciones específicas de plataforma en términos de capacidad y alcance, las aplicaciones específicas de la plataforma representan de mejor manera las capacidades, mientras que las aplicaciones web representan el mejor alcance. Entonces, ¿en dónde encajan las aplicaciones web progresivas?

Las aplicaciones web progresivas (PWA) se crean y se mejoran con API modernas para ofrecer capacidad, confiabilidad e instalación mejoradas mientras llegan a *cualquier persona, en cualquier lugar y con cualquier dispositivo* con una única base de código.

## Los tres pilares de la aplicación

Las aplicaciones web progresivas son aplicaciones web que se han diseñado para que sean capaces, confiables e instalables. Estos tres pilares los transforman en una experiencia que se siente como una aplicación específica de la plataforma.

### Capaces

En la actualidad, la web es bastante capaz. Por ejemplo, se puede crear una aplicación de chat de video enfocado en una localidad utilizando WebRTC, geolocalización y notificaciones push. Puedes hacer que esa aplicación se pueda instalar y convertir esas conversaciones en virtuales con WebGL y WebVR. Con la introducción de Web Assembly, los desarrolladores pueden aprovechar otros ecosistemas, como C, C++ y Rust, y traer también décadas de experiencia y de capacidades a la web. [Squoosh.app](https://squoosh.app/), por ejemplo, aprovecha esto para su compresión de imagen avanzada.

Hasta hace poco, solo las aplicaciones específicas de plataforma podían realmente reclamar estas capacidades. Si bien algunas capacidades aún están fuera del alcance de la web, las API nuevas y futuras buscan cambiar eso, expandiendo lo que la web puede hacer con funciones como acceso al sistema de archivos, controles de medios, credenciales de aplicaciones y soporte completo para el portapapeles. Todas estas capacidades se construyen con el modelo de permisos seguro y centrado en el usuario de la web, lo que garantiza que ir a un sitio web nunca sea una propuesta aterradora para los usuarios.

Entre las API modernas, el Web Assembly y las API nuevas y futuras, las aplicaciones web son más capaces que nunca, y esas capacidades solo están creciendo.

### Confiables

Una aplicación web progresiva confiable se siente rápida y fiable independientemente de la red.

La velocidad es fundamental para que los usuarios *utilicen* tu experiencia. De hecho, a medida que los tiempos de carga de la página van de 1 segundo a 10 segundos, la probabilidad de que un usuario rebote [aumenta en un 123%](https://www.thinkwithgoogle.com/marketing-resources/data-measurement/mobile-page-speed-new-industry-benchmarks/). El rendimiento no se detiene después del evento de `onload`. Los usuarios nunca deben preguntarse si su interacción (por ejemplo, hacer clic en un botón) se registró o no. El desplazamiento y la animación deben ser fluidos. El rendimiento afecta a toda su experiencia, desde cómo los usuarios perciben su aplicación hasta cómo funciona realmente.

Por último, las aplicaciones fiables deben poder utilizarse independientemente de la conexión de red. Los usuarios esperan a que las aplicaciones se inicien con conexiones de red lentas o inestables o incluso cuando estén desconectadas. Esperan que el contenido más reciente con el que han interactuado, como pistas multimedia o boletos e itinerarios, estén disponibles y se puedan usar incluso si es difícil obtener una consulta en su servidor. Cuando una consulta no es posible, esperan que se les diga que hay problemas en lugar de fallar o bloquearse silenciosamente.

A los usuarios les encantan las aplicaciones que responden a la interacción en un abrir y cerrar de ojos y en una experiencia en la que pueden confiar.

### Instalables

Las aplicaciones web progresivas instaladas se ejecutan en una ventana independiente en lugar de en una pestaña del navegador. Se pueden iniciar desde la pantalla de inicio del usuario, el dock, la barra de tareas o la estantería. Es posible buscarlos en un dispositivo y saltar entre ellos con el conmutador de aplicaciones, haciéndolos sentir como parte del dispositivo en el que están instalados.

Se abren nuevas capacidades después de instalar una aplicación web. Los atajos de teclado que generalmente se reservan cuando se ejecutan en el navegador, se encuentran disponibles. Las aplicaciones web progresivas pueden registrarse para aceptar contenido de otras aplicaciones o para ser la aplicación predeterminada para manejar diferentes tipos de archivos.

Cuando una aplicación web progresiva sale de una pestaña y entra en una ventana de aplicación independiente, transforma la forma en que los usuarios piensan e interactúan con ella.

## Lo mejor de ambos mundos

En el fondo, las aplicaciones web progresivas son solo aplicaciones web. Mediante la mejora progresiva, se habilitan nuevas capacidades en los navegadores modernos. Con los service workers y un manifiesto de la aplicación web, su aplicación web se vuelve confiable e instalable. Si las nuevas capacidades no están disponibles, los usuarios aún obtienen la experiencia principal.

¡Los números no mienten! Las empresas que han lanzado aplicaciones web progresivas han obtenido resultados impresionantes. Por ejemplo, Twitter experimentó un aumento del 65% en las páginas por sesión, un 75% más de tweets y una disminución del 20% en la tasa de rebote, todo mientras reducía el tamaño de su aplicación en más del 97%. Después de cambiar a una PWA, Nikkei vio 2.3 veces más tráfico orgánico, un 58% más de suscripciones y un 49% más de usuarios activos diarios. Hulu reemplazó su experiencia de escritorio específica de la plataforma con una aplicación web progresiva y vio un aumento del 27% en las visitas de retorno.

Las aplicaciones web progresivas nos regalan una oportunidad única de brindar una experiencia web la cual a sus usuarios les encantará. Utilizando las últimas funciones web para brindar capacidades mejoradas y confiabilidad, las aplicaciones web progresivas permiten que *cualquier persona, en cualquier lugar, con cualquier dispositivo* instale lo que haya creado con una única base de código.
