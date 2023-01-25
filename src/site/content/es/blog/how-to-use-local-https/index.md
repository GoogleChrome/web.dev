---
title: Cómo utilizar el HTTPS en el desarrollo local
subhead: A veces, necesitas ejecutar tu sitio de desarrollo local con HTTPS. Consejos y herramientas para hacer esto de forma rápida y segura.
authors:
  - maudn
date: 2021-01-25
hero: image/admin/ZvW6VM0GEScldWHBvXJ4.jpg
thumbnail: image/admin/OG8YksgOnzGfnurzncWO.jpg
tags:
  - blog
  - security
---

{% Aside 'caution' %} La mayoría de las veces, `http://localhost` hace lo que necesitas: en los navegadores, se comporta principalmente como HTTPS 🔒. Es por eso que algunas API que no funcionarán en un sitio que utiliza  HTTP, funcionarán en `http://localhost`.

Lo que esto significa es que debes de usar HTTPS localmente **solo en casos especiales** (consulta [Cuándo usar HTTPS en el desarrollo local](/when-to-use-local-https)), como por ejemplo, nombres de host personalizados o asegurar cookies en todos los navegadores. ¡Sigue leyendo si esto se te hace conocido! {% endAside %}

*En esta publicación, las declaraciones sobre el `localhost` son válidas para `127.0.0.1` y `[::1]`, ya que ambas describen la dirección de la computadora local, a esta tambien se le conoce como "dirección del loopback". Además, para simplificar las cosas, no se especifica el número de puerto.**Entonces, cuando veas `http://localhost`, léelo como `http://localhost:{PORT}` o como `http://127.0.0.1:{PORT}`.*

Si tu sitio web de producción usa HTTPS, deseas que tu sitio de desarrollo local se comporte **como un sitio HTTPS** (si es que tu sitio web de producción no usa HTTPS, [haz que tu prioridad sea cambiar a HTTPS](/why-https-matters/)). La mayoría de las veces, puedes confiar en que `http://localhost` se comporte **como un sitio HTTPS**. Pero [en algunos casos](/when-to-use-local-https), debes de ejecutar tu sitio localmente con HTTPS. Echemos un vistazo a cómo hacer esto.

**⏩ ¿Estás buscando instrucciones rápidas o ya estuviste aquí antes? Saltate al [sumario](#using-mkcert-cheatsheet).**

## Ejecutar tu sitio localmente con HTTPS usando mkcert (recomendación)

Para usar HTTPS en tu sitio de desarrollo local y acceder a `https://localhost` o `https://mysite.example` (nombre de host personalizado), necesitas de un [certificado TLS](https://en.wikipedia.org/wiki/Public_key_certificate#TLS/SSL_server_certificate). Pero los navegadores no considerarán válido cualquier certificado: tu certificado debe estar **firmado** por una entidad en la que tu navegador confía, a esto se le conoce como **[autoridad certificadora (CA)](https://en.wikipedia.org/wiki/Certificate_authority)** de confianza.

Lo que debes de hacer es crear un certificado y firmarlo con una CA en la que tu dispositivo y navegador **confíen localmente**. [mkcert](https://github.com/FiloSottile/mkcert) es una herramienta que te ayudará a hacer esto con unos pocos comandos. Así es como funciona:

- Si abres tu sitio que se ejecuta localmente en tu navegador usando HTTPS, tu navegador verifica el certificado de tu servidor de desarrollo local.
- Al ver que el certificado ha sido firmado por la autoridad de certificación generada por mkcert, el navegador verifica si está registrado como una autoridad de certificación confiable.
- mkcert está considerado como una autoridad de confianza, por lo que tu navegador confía en el certificado y crea una conexión HTTPS.

<figure>{% Img src="image/admin/3kdjci7NORnOw54fMia9.jpg", alt="Un diagrama de cómo funciona mkcert.", width="800", height="787" %} <figcaption><figcaption> Un diagrama de cómo funciona mkcert.</figcaption></figcaption></figure>

mkcert (y herramientas similares) proporcionan varios beneficios:

- mkcert está especializado en la creación de certificados que **cumplen con lo que los navegadores consideran certificados válidos**. Este se mantiene actualizado para cumplir con los requisitos y las mejores prácticas. ¡Es por eso que no tendrás que ejecutar comandos mkcert con configuraciones o argumentos complejos para generar los certificados correctos!
- mkcert es una herramienta multiplataforma. Cualquiera de tu equipo puede usarla.

mkcert es la herramienta que recomendamos para crear un certificado TLS para desarrollo local. También puedes consultar [otras opciones](#running-your-site-locally-with-https-other-options).

Muchos sistemas operativos pueden incluir bibliotecas para producir certificados, como [openssl](https://www.openssl.org/). A diferencia de mkcert y herramientas similares, es posible que estas bibliotecas no produzcan certificados correctos de manera consistente, pueden requerir la ejecución de comandos complejos y no son necesariamente multiplataforma.

{% Aside 'gotchas' %} El mkcert que nos interesa en esta publicación es [este](https://github.com/FiloSottile/mkcert), no [este](https://www.npmjs.com/package/mkcert). {% endAside %}

### Precaución

{% Aside 'caution' %}

- Nunca exportes ni compartas el archivo `rootCA-key.pem` que mkcert crea automáticamente cuando ejecutas `mkcert-install`. **Un atacante que se apodere de este archivo puede crear ataques en ruta para cualquier sitio que el esté visitando**. Ellos podrían interceptar solicitudes seguras desde tu máquina a cualquier sitio: tu banco, proveedor de atención médica o redes sociales. Si necesitas saber dónde se encuentra el `rootCA-key.pem` para asegurarte de que sea seguro, ejecuta `mkcert-CAROOT`.
- Utiliza solo mkcert para **fines de desarrollo** y, por extensión, nunca le pidas a los usuarios finales que ejecuten comandos de mkcert.
- Equipos de desarrollo: todos los miembros de tu equipo deben instalar y ejecutar mkcert por **separado** (no almacenar y compartir la CA y el certificado).

{% endAside %}

### Configuración

1. Instala mkcert (solo una vez).

    Sigue las [instrucciones](https://github.com/FiloSottile/mkcert#installation) para instalar mkcert en tu sistema operativo. Por ejemplo, en macOS:

    ```bash
    brew install mkcert
    brew install nss # if you use Firefox
    ```

2. Agrega mkcert a sus raíces locales de CA.

    En tu terminal, ejecuta el siguiente comando:

    ```bash
    mkcert -install
    ```

    Esto genera una autoridad de certificación (CA) local. Tu CA local generada por mkcert solo es de confianza **localmente**, en tu dispositivo.

3. Genera un certificado para tu sitio, firmado por mkcert.

    En tu terminal, navega hasta el directorio raíz de tu sitio o cualquier directorio en el que deseas que se ubiquen los certificados.

    Luego ejecutas lo siguiente:

    ```bash
    mkcert localhost
    ```

    Si estás utilizando un nombre de host personalizado como `mysite.example`, ejecuta:

    ```bash
    mkcert mysite.example
    ```

    El comando anterior hace dos cosas:

    - Genera un certificado para el nombre de host que has especificado
    - Permite que el mkcert (que agregaste como CA local en el paso 2) firme este certificado.

    Ahora, tu certificado está listo y firmado por una autoridad de certificación en la que su navegador confía localmente. Ya casi has terminado, ¡pero tu servidor aún no reconoce tu certificado!

4. Configura tu servidor.

    Ahora debes de decirle a tu servidor que use HTTPS (ya que los servidores de desarrollo tienden a usar HTTP de forma predeterminada) y que use el certificado TLS que acabas de crear.

    Hacer esto depende exactamente de tu servidor. Algunos ejemplos:

    **👩🏻‍💻 Con Node:**

    `server.js` (reemplaza `{PATH/TO/CERTIFICATE...}` and `{PORT}`):

    ```javascript
    const https = require('https');
    const fs = require('fs');
    const options = {
      key: fs.readFileSync('{PATH/TO/CERTIFICATE-KEY-FILENAME}.pem'),
      cert: fs.readFileSync('{PATH/TO/CERTIFICATE-FILENAME}.pem'),
    };
    https
      .createServer(options, function (req, res) {
        // server code
      })
      .listen({PORT});
    ```

    **👩🏻‍💻 Con [http-server](https://www.npmjs.com/package/http-server):**

    Inicie su servidor de la siguiente manera (reemplaza `{PATH/TO/CERTIFICATE...}`):

    ```bash
    http-server -S -C {PATH/TO/CERTIFICATE-FILENAME}.pem -K {PATH/TO/CERTIFICATE-KEY-FILENAME}.pem
    ```

    `-S` ejecuta tu servidor con HTTPS, mientras que `-C` establece el certificado y `-K` establece la llave (key).

    **👩🏻‍💻 Con un servidor de desarrollo React:**

    Edita tu `package.json` de la siguiente manera y reemplaza `{PATH/TO/CERTIFICATE...}`:

    ```json
    "scripts": {
    "start": "HTTPS=true SSL_CRT_FILE={PATH/TO/CERTIFICATE-FILENAME}.pem SSL_KEY_FILE={PATH/TO/CERTIFICATE-KEY-FILENAME}.pem react-scripts start"
    ```

    Por ejemplo, si creaste un certificado para `localhost` que se encuentra en el directorio raíz de su sitio de la siguiente manera:

    ```text
    |-- my-react-app
        |-- package.json
        |-- localhost.pem
        |-- localhost-key.pem
        |--...
    ```

    Entonces tu script de `start` debe de verse así:

    ```json
    "scripts": {
        "start": "HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem react-scripts start"
    ```

    **👩🏻‍💻 Otros ejemplos:**

    - [Servidor de desarrollo de Angular](https://angular.io/cli/serve)
    - [Python](https://blog.anvileight.com/posts/simple-python-http-server/)

5. ✨ ¡Ya terminaste! Abre `https://localhost` o `https://mysite.example` en tu navegador: ya estas ejecutando tu sitio localmente con HTTPS. No verás ninguna advertencia del navegador, porque tu navegador confía en mkcert como una autoridad de certificación local.

{% Aside %} Tu servidor puede usar un puerto diferente para HTTPS. {% endAside %}

### Usando mkcert: sumario

{% Details %} {% DetailsSummary %} mkcert en resumen {% endDetailsSummary %}

Para ejecutar tu sitio de desarrollo local con HTTPS:

1. Configura mkcert.

    Si aún no lo has hecho, instala mkcert, ejemplo de instalación en macOS:

    ```bash
    brew install mkcert

    ```

    Comprueba las [instrucciones de instalación de mkcert](https://github.com/FiloSottile/mkcert#installation) para Windows y Linux.

    Luego, crea una autoridad de certificación local:

    ```bash
    mkcert -install
    ```

2. Crea un certificado de confianza.

    ```bash
    mkcert {YOUR HOSTNAME e.g. localhost or mysite.example}
    ```

    Esto crea un certificado válido (que será firmado por `mkcert`).

3. Configura tu servidor de desarrollo para usar HTTPS y el certificado que creaste en el paso 2.

4. ✨ ¡Ya terminaste! Ahora puedes acceder a `https://{YOUR HOSTNAME}` en tu navegador, sin advertencias

{% Aside 'caution' %}

Solo deberías de hacer esto con **fines de desarrollo** y **nunca exportes o compartas** el archivo de `rootCA-key.pem` (si necesitas saber dónde se encuentra este archivo para asegurarse de que sea seguro, ejecuta `mkcert -CAROOT`).

{% endAside %}

{% endDetails %}

## Ejecutar tu sitio de manera local con HTTPS: otras opciones

### Certificado autofirmado

También puedes decidir no utilizar una autoridad de certificación local como mkcert y, en su lugar, **firmar tu certificado tú mismo**.

Ten cuidado con algunas trampas con esta aproximación:

- Los navegadores no confían en ti como autoridad de certificación y mostrarán advertencias que deberás omitir manualmente. En Chrome, puedes usar la bandera de `#allow-insecure-localhost` para omitir esta advertencia automáticamente en `localhost`. Si hacer esto se siente un poco extraño, es porque lo es.
- Esto no es seguro si trabajas en una red insegura.
- Los certificados autofirmados no se comportarán exactamente de la misma manera que los certificados de confianza.
- No es necesariamente más fácil o más rápido que usar una CA local como mkcert.
- Si no estás utilizando esta técnica en el contexto de un navegador, es posible que debas de deshabilitar la verificación del certificado para tu servidor. Omitir volver a habilitarlo en producción sería peligroso.

<figure>{% Img src="image/admin/KxLz7mcUudiFwWBIdhH8.jpg", alt="Capturas de pantalla de las advertencias que muestran los navegadores cuando se usa un certificado autofirmado.", width="800", height="598" %} <figcaption> Las advertencias de los navegadores se muestran cuando se utiliza un certificado autofirmado.</figcaption></figure>

{% Aside %} Si no especificaste ningún certificado, las opciones HTTPS del servidor de desarrollo de [React](https://create-react-app.dev/docs/using-https-in-development/) y de [Vue](https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-serve) crean un certificado autofirmado por ellos mismos. Esto es rápido, pero recibirá advertencias del navegador y encontrará otros errores relacionados con los certificados autofirmados que se enumeran anteriormente. Afortunadamente, puedes usar la opción HTTPS incorporada de los frameworks frontend **y** especificar un certificado de confianza local creado a través de mkcert o de manera similar. Mira cómo hacer esto en el [ejemplo de mkcert con React](/#setup:~:text=a%20React%20development%20server). {% endAside %}

{% Details %} {% DetailsSummary %} ¿Por qué los navegadores no confían en los certificados autofirmados? {% endDetailsSummary %}

Si abres tu sitio que se ejecuta localmente en tu navegador usando HTTPS, tu navegador verificará el certificado de tu servidor de desarrollo local. Cuando veas que el certificado ha sido firmado por ti mismo, este comprueba si estás registrado como una autoridad certificadora de confianza. Como no lo eres, tu navegador no puede confiar en el certificado; muestra una advertencia que te indica que tu conexión no es segura. Puedes proceder bajo su propio riesgo; si lo haces, se creará una conexión HTTPS.

<figure>{% Img src="image/admin/V2SAcIzuofqzUuestOOX.jpg", alt="Por qué los navegadores no confían en los certificados autofirmados: un diagrama.", width="800", height="833" %} <figcaption> Por qué los navegadores no confían en los certificados autofirmados.</figcaption></figure>

{% endDetails %}

### Certificado firmado por una autoridad certificadora regular

También puedes encontrar técnicas basadas en que una autoridad certificadora real, no una local, firme tu certificado.

Algunas cosas a tener en cuenta si estás considerando usar estas técnicas:

- Tendrás más cosas que hacer en la configuración por hacer que cuando se usa una técnica de CA local como mkcert.
- Debes de utilizar un nombre de dominio que controles y que sea válido. Esto significa que no **puedes** utilizar autoridades de certificación reales para:
    - `localhost` y otros nombres de dominio que están [reservados](https://www.iana.org/assignments/special-use-domain-names/special-use-domain-names.xhtml), como `example` o `test`.
    - Cualquier nombre de dominio que no controles.
    - Dominios de nivel superior que no son válidos. Consulta la [lista de dominios de nivel superior válidos](https://www.iana.org/domains/root/db).

### Proxy inverso

Otra opción para acceder a un sitio que se ejecuta localmente con HTTPS es utilizar un [proxy inverso](https://en.wikipedia.org/wiki/Reverse_proxy) como [ngrok](https://ngrok.com/).

Algunos puntos a considerar:

- Cualquiera puede acceder a tu sitio de desarrollo local una vez que compartas con ellos una URL creada con un proxy inverso. ¡Esto puede ser muy útil cuando demuestres tu proyecto a los clientes! O esto puede ser un inconveniente, si tu proyecto es delicado.
- Es posible que debas de considerar los precios.
- Las nuevas [medidas de seguridad](/cors-rfc1918-feedback/) en los navegadores pueden afectar la forma en que funcionan estas herramientas.

### Bandera (no recomendado)

Si estás usando un nombre de host personalizado como `mysite.example`, en Chrome puedes usar una bandera (flag) para considerar forzosamente a mysite.example como un sitio seguro. **Evita hacer esto** porque:

- Debes de estar 100% seguro de que `mysite.example` siempre se resuelve en una dirección local; de lo contrario, podrías filtrar las credenciales de producción.
- No podrás depurar varios navegadores con este truco 🙀.

*Muchas gracias por las contribuciones y comentarios a todos los editores y colaboradores, especialmente a Ryan Sleevi, Filippo Valsorda, Milica Mihajlija y Rowan Merewood. 🙌*

*Fondo de imagen de héroe por [@anandu](https://unsplash.com/@anandu) en [Unsplash](https://unsplash.com/photos/pbxwxwfI0B4), editado.*
