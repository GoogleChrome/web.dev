---
title: Supervisión del rendimiento con Lighthouse CI
subhead: Cómo agregar Lighthouse a un sistema de integración continua, como GitHub Actions.
authors:
  - katiehempenius
date: 2020-07-27
description: |2

  Aprenda a configurar Lighthouse CI e integrarlo en los flujos de trabajo de los desarrolladores.
hero: image/admin/8q10N5o2xDA7YJKcefm5.png
alt: Lighthouse CI se muestra en una captura de pantalla del servidor Lighthouse CI
tags:
  - blog
  - performance
  - lighthouse
feedback:
  - api
---

[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) es un conjunto de herramientas para el uso de Lighthouse durante la integración continua. Lighthouse CI se puede incorporar a los flujos de trabajo de los desarrolladores de muchas formas diferentes. Esta guía cubre los siguientes temas:

- Uso de la CLI de Lighthouse CI.
- Configuración de su proveedor de CI para ejecutar Lighthouse CI.
- Configuración de una [GitHub Action](https://github.com/features/actions) y la [verificación de estado](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-status-checks) para Lighthouse CI. Esto mostrará automáticamente los resultados de Lighthouse en las solicitudes de extracción de GitHub.
- Creación de un panel de rendimiento y un almacén de datos para informes Lighthouse.

## Descripción general

Lighthouse CI es un conjunto de herramientas gratuitas que facilitan el uso de Lighthouse para supervisar el rendimiento. Un solo informe Lighthouse proporciona una instantánea del rendimiento de una página web en el momento en que se ejecuta. Lighthouse CI muestra cómo estos hallazgos han cambiado con el tiempo. Esto se puede utilizar para identificar el impacto de cambios particulares del código o garantizar que se cumplan los umbrales de rendimiento durante los procesos de integración continua. Aunque la supervisión del rendimiento es el caso de uso más común de Lighthouse CI, se puede utilizar para supervisar otros aspectos del informe Lighthouse, por ejemplo, SEO o accesibilidad.

La funcionalidad principal de Lighthouse CI la proporciona la interfaz de línea de comandos de Lighthouse CI. (Nota: esta es una herramienta separada de la [CLI de Lighthouse](https://github.com/GoogleChrome/lighthouse#using-the-node-cli)). La CLI de Lighthouse CI proporciona un conjunto de [comandos](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#commands) para el uso de Lighthouse CI. Por ejemplo, el comando `autorun` ejecuta varias instancias de Lighthouse, identifica el informe medio de Lighthouse y carga el informe para su almacenamiento. Este comportamiento se puede personalizar en gran medida al pasar indicadores adicionales o al personalizar el archivo de configuración de Lighthouse CI, `lighthouserc.js`.

Aunque la funcionalidad principal de Lighthouse CI se encapsula principalmente en la CLI de Lighthouse CI, Lighthouse CI se utiliza normalmente mediante uno de los siguientes enfoques:

- Ejecución de Lighthouse CI como parte de la integración continua
- Uso de una GitHub Action de Lighthouse CI que se ejecuta y comenta en cada solicitud de extracción
- Seguimiento del rendimiento a lo largo del tiempo a través del panel proporcionado por Lighthouse Server.

Todos estos enfoques se basan en la CLI de Lighthouse CI.

Las alternativas a Lighthouse CI incluyen servicios de monitoreo de rendimiento de terceros o escribir su propio script para recopilar datos de rendimiento durante el proceso de CI. Debería considerar el uso de un servicio de terceros si prefiere dejar que otra persona se encargue de la administración de su servidor de monitoreo de rendimiento y sus dispositivos de prueba, o si desea capacidades de notificación (como correo electrónico o integración de Slack) sin tener que crear tales características usted mismo.

## Utilice Lighthouse CI localmente {: #cli }

Esta sección explica cómo ejecutar e instalar la CLI de Lighthouse CI localmente y cómo configurar `lighthouserc.js`. Ejecutar la CLI de Lighthouse CI localmente es la forma más fácil de asegurar que su `lighthouserc.js` esté configurado correctamente.

1. Instale la CLI de Lighthouse CI.

    ```shell
    npm install -g @lhci/cli
    ```

    Lighthouse CI se configura al colocar un archivo `lighthouserc.js` en la raíz del repositorio de su proyecto. Este archivo es obligatorio y contendrá información de configuración relacionada con Lighthouse CI. Aunque Lighthouse CI se puede [configurar para usarse sin un repositorio de git](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#build-context), las instrucciones de este artículo asumen que el repositorio de su proyecto está configurado para usar git.

2. En la raíz de su repositorio, cree un [archivo de configuración](https://github.com/GoogleChrome/lighthouse-ci/blob/v0.4.1/docs/configuration.md#configuration-file) `lighthouserc.js`.

    ```shell
    touch lighthouserc.js
    ```

3. Agregue el siguiente código al archivo `lighthouserc.js`. Este código es una configuración de Lighthouse CI vacía. Agregará cosas a esta configuración en pasos posteriores.

    ```js
    module.exports = {
      ci: {
        collect: {
          /* Agregue la configuración aquí */
        },
        upload: {
          /* Agregue la configuración aquí */
        },
      },
    };
    ```

4. Cada vez que se ejecuta Lighthouse CI, inicia un servidor para suministrar su sitio. Este servidor es lo que le permite a Lighthouse cargar su sitio incluso cuando no hay otros servidores en ejecución. Cuando Lighthouse CI termine de ejecutarse, apagará automáticamente el servidor. Para asegurar que la publicación funcione correctamente, debe configurar las propiedades [`staticDistDir`](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#detecting-collectstaticdistdir) o [`startServerCommand`](https://github.com/GoogleChrome/lighthouse-ci/blob/v0.4.1/docs/configuration.md#startservercommand).

    Si su sitio es estático, agregue la propiedad `staticDistDir` al objeto `ci.collect` para indicar dónde se encuentran los archivos estáticos. Lighthouse CI utilizará su propio servidor para suministrar estos archivos mientras prueba su sitio. Si su sitio no es estático, agregue la propiedad `startServerCommand` al objeto `ci.collect` para indicar el comando que inicia su servidor. Lighthouse CI iniciará un nuevo proceso de servidor durante la prueba y lo apagará después.

    ```js
    // Ejemplo de sitio estático
    collect: {
      staticDistDir: './public',
    }
    ```

    ```js
    // Ejemplo de sitio dinámico
    collect: {
      startServerCommand: 'npm run start',
    }
    ```

5. Agregue la propiedad [`url`](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#url) `ci.collect` para indicar las URL en las que Lighthouse CI debe ejecutar Lighthouse. El valor de la `url` debe proporcionarse como una matriz de URL. Esta matriz puede contener una o más URL. De forma predeterminada, Lighthouse CI ejecutará Lighthouse tres veces en cada URL.

    ```js
    collect: {
      // ...
      url: ['http://localhost:8080']
    }
    ```

    Nota: El servidor que configuró en el paso anterior debería estar en capacidad de publicar estas URL. Por lo tanto, si está ejecutando Lighthouse CI localmente, estas URL probablemente deberían incluir `localhost` en lugar de su host de producción.

6. Agregue la propiedad de [`target`](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#target) `ci.upload` y establezca el valor en `'temporary-public-storage'`. Los informes de Lighthouse recopilados por Lighthouse CI se cargarán en un almacenamiento público temporal. El informe permanecerá allí durante siete días y luego se eliminará automáticamente. Esta guía de configuración utiliza la opción de carga de "almacenamiento público temporal" porque es rápida de configurar. Para obtener información sobre otras formas de almacenar informes Lighthouse, consulte la [documentación](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#target).

    ```js
    upload: {
      target: 'temporary-public-storage',
    }
    ```

    La ubicación de almacenamiento del informe será similar a esta:

    ```text
    https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1580152437799-46441.report.html
    ```

    (Esta URL no funcionará porque el informe ya se eliminó).

7. Ejecute la CLI de Lighthouse CI desde la terminal mediante el comando `autorun`. Esto ejecutará Lighthouse tres veces y cargará el informe mediano de Lighthouse.

    ```shell
    lhci autorun
    ```

    Si ha configurado correctamente Lighthouse CI, la ejecución de este comando debería producir un resultado similar a este:

    ```shell
    ✅  .lighthouseci/ directory writable
    ✅  Configuration file found
    ✅  Chrome installation found
    ⚠️   GitHub token not set
    Healthcheck passed!

    Started a web server on port 65324...
    Running Lighthouse 3 time(s) on http://localhost:65324/index.html
    Run #1...done.
    Run #2...done.
    Run #3...done.
    Done running Lighthouse!

    Uploading median LHR of http://localhost:65324/index.html...success!
    Open the report at https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1591720514021-82403.report.html
    No GitHub token set, skipping GitHub status check.

    Done running autorun.
    ```

    Puede ignorar el mensaje `GitHub token not set` en el resultado de la consola. Un token de GitHub solo es necesario si desea utilizar Lighthouse CI con una GitHub Action. Más adelante en este artículo se explica cómo configurar una GitHub Action.

    Al hacer clic en el enlace contenido en el resultado que comienza con `https://storage.googleapis.com...` lo llevará al informe de Lighthouse correspondiente a la ejecución mediana de Lighthouse.

    Los valores predeterminados utilizados por `autorun` se pueden anular mediante la línea de comandos o mediante `lighthouserc.js`. Por ejemplo, la configuración `lighthouserc.js` a continuación indica que se deben recopilar cinco ejecuciones de Lighthouse cada vez que se ejecuta `autorun`.

8. Actualice `lighthouserc.js` para usar la propiedad `numberOfRuns`:

    ```js
    module.exports = {
        // ...
        collect: {
          numberOfRuns: 5
        },
      // ...
      },
    };
    ```

9. Vuelva a ejecutar el comando de `autorun`:

    ```shell
    lhci autorun
    ```

    El resultado de la terminal debe mostrar que Lighthouse se ha ejecutado cinco veces en lugar de las tres predeterminadas:

    ```shell
    ✅  .lighthouseci/ directory writable
    ✅  Configuration file found
    ✅  Chrome installation found
    ⚠️   GitHub token not set
    Healthcheck passed!

    Automatically determined ./dist as `staticDistDir`.
    Set it explicitly in lighthouserc.json if incorrect.

    Started a web server on port 64444...
    Running Lighthouse 5 time(s) on http://localhost:64444/index.html
    Run #1...done.
    Run #2...done.
    Run #3...done.
    Run #4...done.
    Run #5...done.
    Done running Lighthouse!

    Uploading median LHR of http://localhost:64444/index.html...success!
    Open the report at https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1591716944028-6048.report.html
    No GitHub token set, skipping GitHub status check.

    Done running autorun.
    ```

    Para conocer otras opciones de configuración, consulte la [documentación de configuración](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md) de Lighthouse CI.

## Configure su proceso de CI para ejecutar Lighthouse CI {: #ci-setup }

Lighthouse CI se puede utilizar con su herramienta de CI favorita. La [sección Configure su proveedor de CI](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/getting-started.md#configure-your-ci-provider) de la documentación de Lighthouse CI contiene ejemplos de código que muestran cómo incorporar Lighthouse CI en los archivos de configuración de herramientas de CI comunes. Específicamente, estos ejemplos de código muestran cómo ejecutar Lighthouse CI para recopilar medidas de rendimiento durante el proceso de CI.

El uso de Lighthouse CI para recopilar medidas de rendimiento es un buen lugar para comenzar con la supervisión del rendimiento. Sin embargo, los usuarios avanzados quizá quieran ir un paso más allá y usar Lighthouse CI para las compilaciones fallidas si no cumplen con los criterios predefinidos, como aprobar auditorías específicas de Lighthouse o cumplir con todos los presupuestos de desempeño. Este comportamiento se configura a través de la propiedad [`assert`](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#assert) del archivo `lighthouserc.js`.

Lighthouse CI admite tres niveles de afirmaciones:

- `off`: ignorar las afirmaciones
- `warn`: imprime los fallos en stderr
- `error` : imprime los fallos en stderr y sale de Lighthouse CI con un [código de salida distinto de cero](https://www.gnu.org/software/bash/manual/html_node/Exit-Status.html#:~:text=A%20non%2Dzero%20exit%20status,N%20as%20the%20exit%20status.)

A continuación se muestra un ejemplo de una configuración `lighthouserc.js` que incluye aserciones. Establece afirmaciones para las puntuaciones de las categorías de accesibilidad y rendimiento de Lighthouse. Para probar esto, agregue las afirmaciones que se muestran a continuación a su archivo `lighthouserc.js`, luego vuelva a ejecutar Lighthouse CI.

```js
module.exports = {
  ci: {
    collect: {
      // ...
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 1}],
        'categories:accessibility': ['error', {minScore: 1}]
      }
    },
    upload: {
      // ...
    },
  },
};
```

El resultado de consola que genera luce así:

<figure>{% Img src="image/admin/ti9NuzxPKZCYVIzjjddc.png", alt="Captura de pantalla de un mensaje de advertencia generado por Lighthouse CI", width="800", height="431" %}</figure>

Para obtener más información sobre las afirmaciones de Lighthouse CI, consulte la [documentación](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#assert).

## Configure una GitHub Action para ejecutar Lighthouse CI {: #github-actions }

{% Aside %} Esta sección asume que estás familiarizado con git, GitHub y las solicitudes de extracción de GitHub. {% endAside %}

Se [puede usar una GitHub Action](https://github.com/features/actions) para ejecutar Lighthouse CI. Esto generará un nuevo informe Lighthouse cada vez que se envíe un cambio de código a cualquier rama de un repositorio de GitHub. Úselo junto con una [verificación de estado](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-status-checks) para mostrar estos resultados en cada solicitud de extracción.

<figure>{% Img src="image/admin/RZIfiOAPrst9Cxtxi9AX.png", alt="Captura de pantalla de una verificación de estado de GitHub", width="800", height="297" %}</figure>

1. En la raíz de su repositorio, cree un directorio llamado `.github/workflows`. Los [flujos de trabajo](https://help.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#about-workflows) de su proyecto irán a este directorio. Un flujo de trabajo es un proceso que se ejecuta en un momento predeterminado (por ejemplo, cuando se envía un código) y se compone de una o más acciones.

    ```shell
    mkdir .github
    mkdir .github/workflows
    ```

2. En `.github/workflows` cree un archivo llamado `lighthouse-ci.yaml`. Este archivo contendrá la configuración para un nuevo flujo de trabajo.

    ```shell
    touch lighthouse-ci.yaml
    ```

3. Agregue el siguiente texto a `lighthouse-ci.yaml`.

    ```yaml
    name: Build project and run Lighthouse CI
    on: [push]
    jobs:
      lhci:
        name: Lighthouse CI
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v1
          - name: Use Node.js 10.x
            uses: actions/setup-node@v1
            with:
              node-version: 10.x
          - name: npm install
            run: |
              npm install
          - name: run Lighthouse CI
            run: |
              npm install -g @lhci/cli@0.3.x
              lhci autorun --upload.target=temporary-public-storage || echo "LHCI failed!"
    ```

    Esta configuración establece un flujo de trabajo que consta de un único trabajo que se ejecutará cada vez que se envíe un nuevo código al repositorio. Este trabajo tiene cuatro pasos:

    - Consultar el repositorio en el que se ejecutará Lighthouse CI
    - Instalar y configurar un nodo
    - Instalar los paquetes npm necesarios
    - Ejecutar Lighthouse CI y cargar los resultados en un almacenamiento público temporal.

4. Confirme estos cambios y envíelos a GitHub. Si ha seguido correctamente los pasos anteriores, al enviar código a GitHub se activará la ejecución del flujo de trabajo que acaba de agregar.

5. Para confirmar que Lighthouse CI se ha activado y ver el informe que generó, vaya a la pestaña **Acciones** de su proyecto. Debería ver el flujo de trabajo **Compilar el proyecto y el flujo de trabajo de ejecución de Lighthouse CI** en la lista de su confirmación más reciente.

    <figure>{% Img src="image/admin/ougavsYk6faiNidNxIGQ.png", alt="Captura de pantalla de la pestaña 'Configuración' de GitHub", width="800", height="216" %}</figure>

    Puede navegar hasta el informe Lighthouse correspondiente a una confirmación en particular desde la pestaña **Acciones.** Haga clic en la confirmación, haga clic en el paso del flujo de trabajo de **Lighthouse CI** y, a continuación, expanda los resultados del paso de **ejecución de Lighthouse CI**.

    <figure>{% Img src="image/admin/aJF6FVHGOPpGNxKB3LjY.png", alt="Captura de pantalla de la pestaña 'Configuración' de GitHub", width="800", height="366" %}</figure>

    Acaba de configurar una GitHub Action para ejecutar Lighthouse CI. Esto será más útil cuando se use junto con una [verificación de estado](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-status-checks) de GitHub.

### Configure una verificación de estado de GitHub {: #github-status-checks }

Una verificación de estado, si está configurada, es un mensaje que aparece en cada RP y generalmente incluye información como los resultados de una prueba o el éxito de una compilación.

<figure>{% Img src="image/admin/RZIfiOAPrst9Cxtxi9AX.png", alt="Captura de pantalla de la pestaña 'Configuración' de GitHub", width="800", height="297" %}</figure>

Los pasos a continuación explican cómo configurar una verificación de estado para Lighthouse CI.

1. Vaya a la [página GitHub de la aplicación Lighthouse CI](https://github.com/apps/lighthouse-ci) y haga clic en **Configurar**.

2. (Opcional) Si forma parte de varias organizaciones en GitHub, elija la organización propietaria del repositorio para el que desea usar Lighthouse CI.

3. Seleccione **Todos los repositorios** si desea habilitar Lighthouse CI en todos los repositorios o seleccione **Solo repositorios seleccionados** si solo desea usarlo en repositorios específicos y luego seleccione los repositorios. Luego haga clic en **Instalar y autorizar**.

4. Copie el token que se muestra. Lo usará en el siguiente paso.

5. Para agregar el token, navegue a la página de **Configuración** de su repositorio de GitHub, haga clic en **Secretos**, luego haga clic en **Agregar un nuevo secreto**.

    <figure>{% Img src="image/admin/ZYH9cOHehImZLI6vov1r.png", alt="Captura de pantalla de la pestaña 'Configuración' de GitHub", width="800", height="375" %}</figure>

6. Establezca el campo **Nombre** en `LHCI_GITHUB_APP_TOKEN` y establezca el campo **Valor** como el token que copió en el último paso y luego haga clic en el botón **Agregar secreto**.

7. La verificación de estado está lista para su uso. Para probarla, [cree una nueva solicitud de extracción](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) o envíe una confirmación a una solicitud de extracción existente.

## Configure el servidor Lighthouse CI {: #server-setup }

El servidor Lighthouse CI proporciona un panel para explorar los informes históricos de Lighthouse. También puede actuar como un almacén de datos privado a largo plazo para los informes Lighthouse.

<figure>{% Img src="image/admin/4xv6LLe6G48weVNl1CO1.png", alt="Captura de pantalla del panel de Lighthouse CI Server", width="800", height="581" %}</figure>

<figure>{% Img src="image/admin/vp9hVBQGZk01fUMpIQ1Z.png", alt="Captura de pantalla de la comparación de dos informes de Lighthouse en Lighthouse CI Server", width="800", height="556" %}</figure>

1. Elija qué compromisos comparar.
2. La cantidad en que ha cambiado la puntuación de Lighthouse entre las dos confirmaciones.
3. Esta sección solo muestra las estadísticas que han cambiado entre las dos confirmaciones.
4. Las regresiones se resaltan en rosa.
5. Las mejoras se resaltan en azul.

Lighthouse CI Server se adapta mejor a los usuarios que se sienten cómodos al implementar y administrar su propia infraestructura.

Para obtener información sobre cómo configurar el servidor Lighthouse CI, incluidas las recetas para usar Heroku y Docker para la implementación, consulte estas [instrucciones](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/server.md).

## Conozca más

- [Repositorio GitHub de Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
