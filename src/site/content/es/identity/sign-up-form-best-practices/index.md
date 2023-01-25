---
layout: post
title: Prácticas recomendadas para el formulario de registro
subhead: Ayude a que sus usuarios se registren, inicien sesión y administren los detalles de su cuenta con un mínimo de esfuerzo.
authors:
  - samdutton
scheduled: 'true'
date: 2020-12-09
updated: 2020-12-11
description: Ayude a que sus usuarios se registren, inicien sesión y administren los detalles de su cuenta con un mínimo de esfuerzo.
hero: image/admin/YfAltWqxvie1SP19BxBj.jpg
thumbnail: image/admin/7bDPvFWBMFIMynoqDpMc.jpg
alt: Portapapeles con página manuscrita que muestra una lista de verduras sembradas.
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
codelabs:
  - codelab-sign-up-form-best-practices
---

{% YouTube 'Ev2mCzJZLtY' %}

Si los usuarios alguna vez necesitan iniciar sesión en su sitio, entonces un buen diseño del formulario de registro es fundamental. Esto es especialmente cierto para las personas con malas conexiones, en el móvil, con prisa o bajo estrés. Los formularios de registro mal diseñados obtienen altas tasas de rebote. Cada rebote podría significar un usuario perdido y descontento, no solo una oportunidad de registro perdida.

{% Aside 'codelab' %} Si prefiere aprender estas prácticas recomendadas con un tutorial práctico, consulte el [Laboratorio de códigos sobre prácticas recomendadas del formulario de registro](/codelab-sign-up-form-best-practices). {% endAside %}

Este es un ejemplo de un formulario de registro muy simple que demuestra todas las prácticas recomendadas:

{% Glitch { id: 'signup-form', path: 'index.html', height: 700 } %}

{% Aside 'caution' %} Esta publicación trata sobre las prácticas recomendadas para formularios.

No explica cómo implementar el registro a través de un proveedor de identidad de terceros (inicio de sesión federado), ni muestra cómo crear servicios de backend para autenticar usuarios, almacenar credenciales y administrar cuentas.

El documento [Integración del inicio de sesión Google en su aplicación web](https://developers.google.com/identity/sign-in/web/sign-in) explica cómo agregar un inicio de sesión federado a sus opciones de registro.

El documento [Las 12 mejores prácticas para la gestión de cuentas de usuario, autorizaciones y contraseñas](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account) describe los principios básicos de backend para la gestión de cuentas de usuario. {% endAside %}

## Lista de Verificación

- [Evite el inicio de sesión si puede](#no-forced-sign-in).
- [Haga que sea obvio cómo crear una cuenta](#obvious-account-creation).
- [Haga que la manera de acceder a los detalles de la cuenta sea obvia](#obvious-account-details).
- [Elimine el desorden](#cut-clutter).
- [Considere la duración de la sesión](#session-length).
- [Ayude a los administradores de contraseñas para que sugieran y almacenen contraseñas de forma segura](#help-password-managers).
- [No permita contraseñas comprometidas](#no-compromised-passwords).
- [Permita pegar contraseñas](#allow-password-pasting).
- [Nunca almacene ni transmita contraseñas en texto sin formato](#salt-and-hash).
- [No fuerce las actualizaciones de contraseña](#no-forced-password-updates).
- [Facilite el cambio o restablecimiento de contraseñas](#password-change).
- [Habilite el inicio de sesión federado](#federated-login).
- [Simplifique el cambio de cuenta](#account-switching).
- [Considere ofrecer autenticación multifactor](#multi-factor-authentication).
- [Tenga cuidado con los nombres de usuario](#username).
- [Haga pruebas tanto en el campo como en el laboratorio](#analytics-rum).
- [Pruebe en una variedad de navegadores, dispositivos y plataformas](#test-platforms).

## Evite el inicio de sesión si puede {: #no-force-sign-in }

Antes de implementar un formulario de registro y pedirles a los usuarios que creen una cuenta en su sitio, considere si realmente lo necesita. Siempre que sea posible, debe evitar las funciones de activación detrás del inicio de sesión.

¡El mejor formulario de registro es no tener ninguno!

Al pedirle a un usuario que cree una cuenta, usted se interpone entre el usuario y lo que él intenta lograr. Usted está pidiendo un favor y le está pidiendo al usuario que le confíe sus datos personales. Cada contraseña y elemento de datos que almacena conlleva una "deuda de datos" de privacidad y seguridad, lo que se convierte en un costo y una responsabilidad para su sitio.

Si la razón principal por la que solicita a los usuarios que creen una cuenta es para guardar información entre navegaciones o sesiones de navegación, [considere usar el almacenamiento del lado del cliente](/storage-for-the-web). Para los sitios de compras, obligar a los usuarios a crear una cuenta para realizar una compra se cita como una de las principales razones para el abandono del carrito de compras. Debería [hacer que el pago como invitado sea el predeterminado](/payment-and-address-form-best-practices#guest-checkout).

## Haga que el inicio de sesión sea obvio {: #obvious-account-creation}

Haga que sea obvio cómo crear una cuenta en su sitio, por ejemplo, con un botón **Iniciar sesión** o **Regístrese** en la parte superior derecha de la página. Evite el uso de un icono ambiguo o palabras vagas ("¡Suba a bordo!", "Únase a nosotros") y no oculte el inicio de sesión en un menú de navegación. El experto en usabilidad Steve Krug resumió este enfoque de usabilidad del sitio web: [¡No me haga pensar!](https://uxplanet.org/dont-make-me-think-20-wise-thoughts-about-usability-from-steve-krug-876b563f1d63) Si necesita convencer a otros miembros de su equipo web, utilice los [análisis](#analytics-rum) para mostrar el impacto de las diferentes opciones.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KeztoU8KgAqrQ5CKBSWw.jpg", alt="Dos capturas de pantalla de una maqueta de un sitio web de comercio electrónico visto en un teléfono Android. La de la izquierda usa un icono para el enlace de inicio de sesión que es algo ambiguo uno a la derecha simplemente dice 'Iniciar sesión' ", width= "800", height="737" %}<figcaption>Haga que el inicio de sesión sea obvio. Un icono puede ser ambiguo, pero un botón o enlace <b>Iniciar sesión</b>  es obvio.</figcaption></figure>

{% Aside %} Es posible que se esté preguntando si debe agregar un botón (o enlace) para crear una cuenta y otro para que los usuarios existentes inicien sesión. Muchos sitios populares ahora simplemente muestran un solo botón **Iniciar sesión**. Cuando el usuario toca o hace clic en eso, también obtiene un enlace para crear una cuenta si es necesario. Ese es un patrón común ahora y es probable que sus usuarios lo entiendan, pero puede usar [el análisis de interacción](#analytics-rum) para monitorear si un solo botón funciona mejor o no. {% endAside %}

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WUgCNqhEgvoWEVwGjfrA.jpg", alt="Capturas de pantalla del inicio de sesión para Gmail: una página, que muestra el botón Iniciar sesión, cuando se hace clic en el formulario que también tiene un enlace Crear una cuenta.", width="800", height="545" %}   <figcaption> La página de inicio de sesión de Gmail tiene un enlace para crear una cuenta. <br> En tamaños de ventana más grandes que los que se muestran aquí, Gmail muestra un enlace <b>Iniciar sesión</b> y un botón <b>Crear una cuenta</b>. </figcaption></figure>

Asegúrese de vincular las cuentas de los usuarios que se registran a través de un proveedor de identidad como Google y que también se registran mediante correo electrónico y contraseña. Eso es fácil de hacer si puede acceder a la dirección de correo electrónico de un usuario desde los datos del perfil del proveedor de identidad y hacer coincidir las dos cuentas. El siguiente código muestra cómo acceder a los datos de correo electrónico de un usuario con inicio de sesión de Google.

```js
// auth2 se inicializa con gapi.auth2.init()
if (auth2.isSignedIn.get()) {
  var profile = auth2.currentUser.get().getBasicProfile();
  console.log(`Email: ${profile.getEmail()}`);
}
```

{: #obvious-account-details}

Una vez que un usuario haya iniciado sesión, aclare cómo acceder a los detalles de la cuenta. En particular, haga que sea obvio cómo [cambiar o restablecer las contraseñas](#password-change).

## Elimina el desorden {: #cut-clutter}

En el flujo de registro, su trabajo es minimizar la complejidad y mantener al usuario enfocado. Elimine el desorden. ¡Este no es el momento de distracciones y tentaciones!

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/avoid-distractions.mp4" type="video/mp4">
   </source></video>
  <figcaption>No distraiga a los usuarios mientras completan el registro.</figcaption></figure>

Durante el registro, solicite lo menos posible. Recopile datos de usuario adicionales (como nombre y dirección) solo cuando sea necesario y cuando el usuario vea un beneficio claro al proporcionar esos datos. Tenga en cuenta que cada elemento de datos que comunique y almacene implica un costo y una responsabilidad.

No duplique sus entradas solo para asegurar de que los usuarios ingresen sus datos de contacto correctamente. Eso ralentiza la finalización del formulario y no tiene sentido si los campos del formulario se llenan automáticamente. En su lugar, envíele al usuario un código de confirmación una vez que haya ingresado sus datos de contacto, luego siga con la creación de la cuenta una vez que el usuario responda. Este es un patrón de registro común: los usuarios están acostumbrados.

Es posible que desee considerar el inicio de sesión sin contraseña al enviarle a los usuarios un código cada vez que inician sesión en un nuevo dispositivo o navegador. Sitios como Slack y Medium usan una versión de esto.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/medium-sign-in.mp4" type="video/mp4">
   </source></video>
  <figcaption>Inicio de sesión sin contraseña en medium.com.</figcaption></figure>

Al igual que con el inicio de sesión federado, esto tiene la ventaja adicional de no tener que administrar las contraseñas de los usuarios.

## Considere la duración de la sesión {: #session-length}

Cualquiera que sea el enfoque que adopte para la identidad del usuario, deberá tomar una decisión cuidadosa sobre la duración de la sesión: cuánto tiempo permanece el usuario conectado y qué puede hacer que usted le cierre la sesión.

Considere si sus usuarios están en dispositivos móviles o de escritorio, y si están en equipos de escritorio o dispositivos compartidos.

{% Aside %} Puede solucionar algunos de los problemas de los dispositivos compartidos si aplica una nueva autenticación para funciones sensibles, por ejemplo, cuando se realiza una compra o se actualiza una cuenta. Puede obtener más información sobre las formas de implementar la reautenticación en la el laboratorio de códigos [Su primera aplicación WebAuthn](https://codelabs.developers.google.com/codelabs/webauthn-reauth/#0). {% endAside %}

## Ayude a que los administradores de contraseñas sugieran y almacenen contraseñas de forma segura {: #help-password-managers}

Puede ayudar a que los administradores de contraseñas de navegadores integrados y de terceros sugieran y almacenen contraseñas, de modo que los usuarios no tengan que elegir, recordar o escribir contraseñas ellos mismos. Los administradores de contraseñas funcionan bien en los navegadores modernos, al sincronizar las cuentas en todos los dispositivos, en aplicaciones web, las específicas de la plataforma y en dispositivos nuevos.

Esto hace que sea extremadamente importante codificar los formularios de registro correctamente, en particular para usar los valores correctos de autocompletar. Para los formularios de registro utilice `autocomplete="new-password"` para las nuevas contraseñas y agregue los valores correctos de autocompletar a otros campos de formulario siempre que sea posible, como `autocomplete="email"` y `autocomplete="tel"`. También puede ayudar a los administradores de contraseñas mediante el uso de diferentes valores `name` e `id` en los formularios de registro y de inicio de sesión, para el elemento `form` en sí, así como también cualquier elemento `input`, `select` y `textarea`.

También debe usar el [atributo `type`](https://developer.mozilla.org/docs/Web/HTML/Element/input/email) apropiado para proporcionar el teclado correcto en el dispositivo móvil y habilitar la validación básica incorporada por parte del navegador. Puede obtener más información en el documento [Prácticas recomendadas para formulario de pago y dirección](/payment-and-address-form-best-practices#type).

{% Aside %} EL documento [Prácticas recomendadas para formularios de inicio de sesión](/sign-in-form-best-practices) tiene muchos más consejos sobre cómo mejorar el diseño, el diseño y la accesibilidad de los formularios, y cómo codificar los formularios correctamente para aprovechar las funciones integradas del navegador. {% endAside %}

## Verifique que los usuarios ingresen contraseñas seguras {: #secure-passwords}

Permitir que los administradores de contraseñas sugieran contraseñas es la mejor opción, además debe alentar a los usuarios para que acepten las contraseñas seguras sugeridas por los navegadores y administradores de navegadores de terceros.

Sin embargo, muchos usuarios desean ingresar sus propias contraseñas, por lo que debe implementar reglas para la seguridad de las contraseñas. El Instituto Nacional de Estándares y Tecnología de los Estados Unidos explica [cómo evitar las contraseñas inseguras](https://pages.nist.gov/800-63-3/sp800-63b.html#5-authenticator-and-verifier-requirements).

{% Aside 'warning' %} Los formularios de registro en algunos sitios tienen reglas de validación de contraseñas que no permiten las contraseñas seguras generadas por el navegador y los administradores de contraseñas de terceros. Verifique que su sitio no haga tal cosa, ya que interrumpe el llenado de formularios, molesta a los usuarios y requiere que los usuarios creen sus propias contraseñas, que pueden ser menos seguras que las generadas por los administradores de contraseñas. {% endAside %}

## No permita contraseñas comprometidas {: #no-compromised-passwords}

Independientemente de las reglas que elija para las contraseñas, nunca debe permitir contraseñas que se hayan [expuesto en violaciones de seguridad](https://haveibeenpwned.com/PwnedWebsites).

Una vez que un usuario ha ingresado una contraseña, debe verificar que no sea una contraseña que ya se haya comprometido. El sitio [Have I Been Pwned](https://haveibeenpwned.com/Passwords) proporciona una API para la verificación de contraseñas o puede ejecutarlo usted mismo como un servicio.

El Administrador de contraseñas de Google también le permite [verificar si alguna de sus contraseñas existentes se ha visto comprometida](https://passwords.google.com/checkup).

Si rechaza la contraseña que propone un usuario, dígale específicamente por qué se rechazó. [Muestre los problemas en línea y explique cómo solucionarlos](https://baymard.com/blog/inline-form-validation), tan pronto como el usuario haya ingresado un valor, no después de que haya enviado el formulario de registro y haya tenido que esperar una respuesta de su servidor.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/password-validation.mp4" type="video/mp4">
   </source></video>
  <figcaption>Sea claro respecto a por qué se rechaza una contraseña.</figcaption></figure>

## No prohíba el pegado de contraseñas {: #allow-password-pasting}

Algunos sitios no permiten que se pegue texto en las entradas de contraseña.

No permitir el pegado de contraseñas molesta a los usuarios, fomenta contraseñas que se pueden recordar (y, por lo tanto, pueden ser más fáciles de comprometer) y, según organizaciones como el Centro Nacional de Seguridad Cibernética del Reino Unido, en realidad pueden [reducir la seguridad](https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords). Los usuarios solo se dan cuenta de que no se permite pegar *después* de que intentan pegar su contraseña, por lo que [no permitir el pegado de contraseñas no evita las vulnerabilidades del portapapeles](https://github.com/OWASP/owasp-masvs/issues/106).

## Nunca almacene ni transmita contraseñas en texto sin formato {: #salt-and-hash}

Asegúrese de utilizar el [hash con sal](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#Use_a_cryptographically_strong_credential-specific_salt) para las contraseñas, además ¡[no intente inventar su propio algoritmo de hash](https://www.schneier.com/blog/archives/2011/04/schneiers_law.html)!

## No fuerce las actualizaciones de contraseña {: #no-force-password-updates}

[No obligue a que los usuarios actualicen sus contraseñas de forma arbitraria.](https://pages.nist.gov/800-63-3/sp800-63b.html#-5112-memorized-secret-verifiers:~:text=Verifiers%20SHOULD%20NOT%20require%20memorized%20secrets%20to%20be%20changed%20arbitrarily%20(e.g.%2C%20periodically).)

Forzar la actualización de contraseñas puede resultar costoso para los departamentos de TI, molesta a los usuarios y [no tiene mucho impacto sobre la seguridad](https://pages.nist.gov/800-63-FAQ/#q-b05). También es probable que fomente que las personas utilicen contraseñas fáciles de recordar inseguras o que mantengan un registro físico de las contraseñas.

En lugar de forzar las actualizaciones de contraseñas, debe controlar la actividad inusual de la cuenta y advertirles a los usuarios. Si es posible, también debe controlar las contraseñas que se vean comprometidas debido a violaciones de datos.

También debe proporcionarles a sus usuarios acceso al historial de inicio de sesión de su cuenta, para mostrarles dónde y cuándo ocurrió un inicio de sesión.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zZXmhWc9bZ1GtvrE5Ooq.jpg", alt="Página de actividad de la cuenta de Gmail", width="800", height="469" %} <figcaption><a href="https://support.google.com/mail/answer/45938?hl=en-GB" title="Descubra cómo ver la actividad de la cuenta de Gmail.">Página de actividad de la cuenta de Gmail</a>.</figcaption></figure>

## Simplifique el cambio o restablecimiento de contraseñas {: #password-change}

Indíqueles a los usuarios dónde y cómo **actualizar** la contraseña de su cuenta. En algunos sitios, es sorprendentemente difícil.

Por supuesto, también debe facilitarles a los usuarios el **restablecimiento** de su contraseña si la olvidan. El Proyecto de seguridad de aplicaciones web de fuente abierta proporciona una guía detallada sobre [cómo manejar las contraseñas perdidas](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).

Para mantener su negocio y sus usuarios seguros, es especialmente importante ayudar a que los usuarios a cambien su contraseña si descubren que se ha comprometido. Para facilitar esto, debe agregar una URL [`/.well-known/change-password`](https://w3c.github.io/webappsec-change-password-url/) en su sitio que redirija hacia su página de administración de contraseñas. Esto permite que los administradores de contraseñas dirijan a sus usuarios directamente a la página donde pueden cambiar la contraseña de su sitio. Esta función ahora está implementada en Safari, Chrome y llegará a otros navegadores. El documento [Ayude a que los usuarios cambien las contraseñas fácilmente al agregar una URL conocida para cambiar las contraseñas](/change-password-url) explica cómo implementar esto.

También debe facilitarles a los usuarios la eliminación de su cuenta si eso es lo que quieren.

## Ofrezca acceso a través de proveedores de identidad de terceros {: #federated-login}

Muchos usuarios prefieren iniciar sesión en sitios web mediante una dirección de correo electrónico y un formulario de registro de contraseña. Sin embargo, también debe permitir que los usuarios inicien sesión a través de un proveedor de identidad externo, también conocido como inicio de sesión federado.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jubgwX1shLB7qAIiioTU.jpg", alt="Página de inicio de sesión de WordPress", width="800", height="513" %} <figcaption>Página de inicio de sesión de WordPress, con opciones de inicio de sesión de Google y Apple.</figcaption></figure>

Este enfoque tiene varias ventajas. Para los usuarios que crean una cuenta mediante el inicio de sesión federado, no es necesario que soliciten, comuniquen o almacenen las contraseñas.

También puede acceder a la información de perfil verificada y adicional desde el inicio de sesión federado, como una dirección de correo electrónico, lo que significa que el usuario no tiene que ingresar esos datos y usted no necesita hacer la verificación usted mismo. El inicio de sesión federado también puede facilitarles mucho las cosas a los usuarios cuando obtienen un nuevo dispositivo.

el documento [Integración del inicio de sesión de Google en su aplicación web](https://developers.google.com/identity/sign-in/web/sign-in) explica cómo agregar un inicio de sesión federado a sus opciones de registro. Hay [muchas otras](https://en.wikipedia.org/wiki/Federated_identity#Examples) plataformas de identidad disponibles.

{% Aside %} La "experiencia del primer día" cuando se obtiene un dispositivo nuevo es cada vez más importante. Los usuarios esperan iniciar sesión desde varios dispositivos, incluidos su teléfono, computadora portátil, computadora de escritorio, tableta, TV o desde un automóvil. Si sus formularios de registro e inicio de sesión no son perfectos, este es un momento en el que corre el riesgo de perder usuarios o al menos perder el contacto con ellos hasta que configuren de nuevo. Debe hacer que sea lo más rápido y fácil posible para que los usuarios de nuevos dispositivos comiencen a usar su sitio. Esta es otra área en la que el inicio de sesión federado puede ayudar. {% endAside %}

## Simplifique el cambio de cuenta {: #account-switching}

Muchos usuarios comparten dispositivos e intercambian cuentas mediante el mismo navegador. Ya sea que los usuarios accedan al inicio de sesión federado o no, debe simplificar el cambio de cuenta.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sPDZJIY5Vo2ijqyuofCy.jpg", alt="Se muestra un cambio de cuenta en Gmail", width="800", height="494" %} <figcaption>Cambio de cuenta en Gmail.</figcaption></figure>

## Considere ofrecer autenticación multifactor {: #multi-factor-authentication}

La autenticación multifactor significa garantizar que los usuarios proporcionen autenticación en más de una forma. Por ejemplo, además de pedirle al usuario que establezca una contraseña, también puede hacer cumplir la verificación mediante un código de acceso único enviado por correo electrónico o un mensaje de texto SMS, o mediante un código único basado en la aplicación, una clave de seguridad o un sensor de huellas dactilares. Los documentos [Prácticas recomendadas de SMS OTP](/sms-otp-form) y [Habilitación de la autenticación robusta con WebAuthn](https://developer.chrome.com/blog/webauthn/) explican cómo implementar la autenticación multifactor.

Sin duda, debe ofrecer (o hacer cumplir) la autenticación multifactor si su sitio maneja información personal o confidencial.

## Tenga cuidado con los nombres de usuario {: #username}

No insista en un nombre de usuario a menos (o hasta) que lo necesite. Permita que los usuarios se registren e inicien sesión solo con una dirección de correo electrónico (o número de teléfono) y una contraseña, o un [inicio de sesión federado](#federated-login) si lo prefieren. No los obligue a elegir y recordar un nombre de usuario.

Si su sitio requiere nombres de usuario, no les imponga reglas irrazonables y no impida que los usuarios actualicen su nombre de usuario. En su backend, debe generar una identificación única para cada cuenta de usuario, no un identificador basado en datos personales como el nombre de usuario.

También asegúrese de utilizar `autocomplete="username"` para los nombres de usuario.

{% Aside 'caution' %} Al igual que con los nombres personales, verifique que los nombres de usuario no estén restringidos a caracteres del [alfabeto latino](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes#Types:~:text=Latin%20alphabet). El documento [Prácticas recomendables de formularios de pago y dirección](/payment-and-address-form-best-practices#unicode-matching) explica cómo y por qué validar mediante la concordancia de letras Unicode. {% endAside %}

## Haga pruebas en una variedad de dispositivos, plataformas, navegadores y versiones {: #test-platform}

Haga pruebas de los formularios de registro en las plataformas más comunes para sus usuarios. La funcionalidad del elemento de formulario puede variar y las diferencias en el tamaño de la ventana gráfica pueden causar problemas de diseño. BrowserStack permite [realizar pruebas gratuitas para proyectos de código abierto](https://www.browserstack.com/open-source) en una variedad de dispositivos y navegadores.

## Implemente el análisis y monitoreo de usuarios reales {: #analytics-rum}

Necesita [datos de campo, así como también datos de laboratorio](/how-to-measure-speed/#lab-data-vs-field-data) para comprender cómo los usuarios experimentan sus formularios de registro. Los análisis y el [monitoreo real de usuarios](https://developer.mozilla.org/docs/Web/Performance/Rum-vs-Synthetic#Real_User_Monitoring) (RUM) proporcionan datos para la experiencia real de sus usuarios, como cuánto tiempo tardan en cargarse las páginas de registro, con qué componentes de la interfaz de usuario interactúan (o no) los usuarios y cuánto tardan los usuarios en completar el registro.

- **Análisis de página{/strong0: [vistas de página, tasas de rebote y salidas](https://analytics.google.com/analytics/academy/course/6) para cada página en su flujo de registro.**
- **Análisis de interacción**: los [embudos de objetivos](https://support.google.com/analytics/answer/6180923?hl=en) y los [eventos](https://developers.google.com/analytics/devguides/collection/gtagjs/events) indican dónde los usuarios abandonan el flujo de registro y qué proporción de usuarios hacen clic en los botones, enlaces y otros componentes de sus páginas de registro.
- **Rendimiento del sitio web**: las [estadísticas centradas en el usuario](/user-centric-performance-metrics) pueden indicarle si su flujo de registro tarda en cargarse o es [visualmente inestable](/cls).

Los pequeños cambios pueden marcar una gran diferencia en las tasas de finalización de los formularios de registro. Los análisis y el RUM le permiten optimizar y priorizar cambios, además de monitorear su sitio en busca de problemas que no queden expuestos por las pruebas locales.

## Siga aprendiendo {: #resources }

- [Prácticas recomendables para el formulario de inicio de sesión](/sign-in-form-best-practices)
- [Prácticas recomendadas para los formularios de pago y de dirección](/payment-and-address-form-best-practices)
- [Cree formas asombrosas](/learn/forms/)
- [Prácticas recomendadas para el diseño de formularios móviles](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [Controles de formulario más capaces](/more-capable-form-controls)
- [Crear formularios accesibles](https://webaim.org/techniques/forms/)
- [Optimización del flujo de registro mediante la API de gestión de credenciales](https://developer.chrome.com/blog/credential-management-api/)
- [Verifique los números de teléfono en la web con la API WebOTP](/web-otp)

Foto de [@ecowarriorprincess](https://unsplash.com/@ecowarriorprincess) en [Unsplash](https://unsplash.com/photos/lUShu7PHIGA).
