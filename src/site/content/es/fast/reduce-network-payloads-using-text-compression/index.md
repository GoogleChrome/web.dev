---
layout: post
title: Minimice y comprima las cargas útiles de la red
authors:
  - houssein
date: 2018-11-05
description: Existen dos técnicas útiles que se pueden utilizar para mejorar el rendimiento de su página web, la minificación y la compresión de datos. Incorporar ambas técnicas reduce el tamaño de la carga útil y también mejora los tiempos de carga de las páginas.
codelabs:
  - codelab-text-compression
  - codelab-text-compression-brotli
tags:
  - performance
---

Hay dos técnicas útiles que se pueden utilizar para mejorar el rendimiento de su página web:

- Minificación
- Compresión de datos

La incorporación de estas dos técnicas reduce el tamaño de la carga útil y, a su vez, mejora los tiempos de carga de la página.

## Medir

Lighthouse muestra una auditoría fallida si detecta algún recurso CSS o JS en su página que se pueda minificar.

{% Img src="image/admin/ZT9ESeCStegt0SklYbni.png", alt="Auditoría de CSS de Lighthouse Minify", width="800", height="90" %}

{% Img src="image/admin/vDaAnUSvQxmGcoasQj1k.png", alt="Auditoría Lighthouse Minify JS", width="800", height="112" %}

También audita los activos sin comprimir.

{% Img src="image/admin/xfqzdLuu3w3lanxo5Ggc.png", alt="Lighthouse: Habilitar compresión de texto", width="800", height="123" %}

## Minificación

**La minificación** es el proceso de eliminar los espacios en blanco y cualquier código que no sea necesario para crear un archivo de código más pequeño pero perfectamente válido. [Terser](https://github.com/terser-js/terser) es una herramienta popular de compresión de JavaScript y el [webpack](https://webpack.js.org/) v4 incluye un complemento para esta biblioteca de forma predeterminada para crear archivos de compilación minificados.

- Si está utilizando webpack v4 o superior, debería estar listo para comenzar sin hacer ningún trabajo adicional. 👍
- Si está utilizando una versión anterior de webpack, instale e incluya el `TerserWebpackPlugin` en los ajustes de configuración de su webpack. Siga la [documentación](https://webpack.js.org/plugins/terser-webpack-plugin/) para aprender cómo.
- Si no está utilizando un paquete de módulos, use `Terser` como herramienta CLI o inclúyalo directamente como una dependencia de su aplicación. La [documentación del](https://github.com/terser-js/terser) proyecto proporciona instrucciones.

## Compresión de datos

La **compresión** es el proceso de modificar datos mediante un algoritmo de compresión.[Gzip](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s) es el formato de compresión más utilizado para las interacciones entre el servidor y el cliente. [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) es un algoritmo de compresión más nuevo que puede proporcionar resultados de compresión incluso mejores que Gzip.

{% Aside %} La compresión de archivos puede mejorar significativamente el rendimiento de una página web, pero rara vez es necesario que la haga usted mismo. Muchas plataformas de alojamiento, CDN y servidores proxy inversos codifican activos con compresión de forma predeterminada o le permiten configurarlos fácilmente. Lea la documentación de la herramienta que está utilizando para ver si la compresión ya es soportada antes de intentar implementar su propia solución. {% endAside %}

Hay dos formas diferentes de comprimir archivos enviados a un navegador:

- Dinamicamente
- Estáticamente

Ambos enfoques tienen sus propias ventajas y desventajas, que se tratan en la siguiente sección. Utilice el que funcione mejor para su aplicación.

## Compresión dinámica

Este proceso implica comprimir los activos sobre la marcha a medida que los solicita el navegador. Esto puede ser más simple que comprimir archivos manualmente o con un proceso de compilación, pero puede causar retrasos si se utilizan niveles de compresión altos.

[Express](https://expressjs.com/) es un marco web popular para Node y proporciona una biblioteca middleware de [compresión](https://github.com/expressjs/compression). Úselo para comprimir cualquier activo a medida que se solicite. Aquí hay un ejemplo de un archivo de servidor completo que lo usa correctamente:

```js/5
const express = require('express');
const compression = require('compression');

const app = express();

app.use(compression());

app.use(express.static('public'));

const listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});
```

Esto comprime sus activos usando `gzip`. Si su servidor web lo admite, considere usar un módulo separado como [shrink-ray](https://github.com/aickin/shrink-ray#readme) para comprimir a través de Brotli para obtener mejores relaciones de compresión.

{% Aside 'codelab' %} Use express.js para comprimir activos con [gzip](/codelab-text-compression) y [Brotli](/codelab-text-compression-brotli). {% endAside %}

## Compresión estática

La compresión estática implica comprimir y guardar activos de forma anticipada. Esto puede hacer que el proceso de compilación demore más, especialmente si se utilizan niveles de compresión altos, pero garantiza que no se produzcan retrasos cuando el navegador recupera el recurso comprimido.

Si su servidor web es compatible con Brotli, use un complemento como [BrotliWebpackPlugin](https://github.com/mynameiswhm/brotli-webpack-plugin) con webpack para comprimir sus activos como parte de su paso de compilación. De lo contrario, use [CompressionPlugin](https://github.com/webpack-contrib/compression-webpack-plugin) para comprimir sus activos con gzip. Se puede incluir como cualquier otro complemento en el archivo de configuración del webpack:

```js/4
module.exports = {
	//...
	plugins: [
		//...
		new CompressionPlugin()
	]
}
```

Una vez que los archivos comprimidos sean parte de la carpeta de compilación, cree una ruta en su servidor para manejar todos los endpoints JS para servir los archivos comprimidos. A continuación, se muestra un ejemplo de cómo se puede hacer esto con Node y Express para contenido comprimido con gzip.

<pre>const express = require('express');
const app = express();

&lt;strong&gt;app.get('*.js', (req, res, next) =&gt; {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
});&lt;/strong&gt;

app.use(express.static('public'));
</pre>
