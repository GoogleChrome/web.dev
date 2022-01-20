---
layout: post
title: Minifique e comprima payloads de rede
authors:
  - houssein
date: 2018-11-05
description: |2-

  Existem duas técnicas úteis que podem ser usadas para melhorar o desempenho de

  sua página da web, minificação e compactação de dados. Incorporar ambas as técnicas reduz os tamanhos da payload e, por sua vez, melhoram os tempos de carregamento da página.
codelabs:
  - codelab-text-compression
  - codelab-text-compression-brotli
tags:
  - performance
---

Existem duas técnicas úteis que podem ser usadas para melhorar o desempenho de sua página da web:

- Minificação
- Compactação de dados

A incorporação de ambas as técnicas reduz o tamanho do payload e, por sua vez, melhora o tempo de carregamento da página.

## A medida

O Lighthouse exibirá uma auditoria com falha se detectar quaisquer recursos CSS ou JS em sua página que possam ser minificados.

{% Img src="image/admin/ZT9ESeCStegt0SklYbni.png", alt="Auditoria Lighthouse minifica CSS", width="800", height="90" %}

{% Img src="image/admin/vDaAnUSvQxmGcoasQj1k.png", alt="Auditoria Lighthouse minifica JS", width="800", height="112" %}

Ele também audita todos os ativos não compactados.

{% Img src="image/admin/xfqzdLuu3w3lanxo5Ggc.png", alt="Lighthouse: ativar compactação de texto", width="800", height="123" %}

## Minificação

**Minificação** é o processo de remover espaços em branco e qualquer código que não seja necessário para criar um arquivo de código menor, mas perfeitamente válido. [Terser](https://github.com/terser-js/terser) é uma ferramenta de compressão de JavaScript popular e [webpack](https://webpack.js.org/) v4 inclui um plugin para esta biblioteca por padrão para criar arquivos de compilação minificados.

- Se você estiver usando o webpack v4 ou superior, não deverá fazer nenhum trabalho adicional. 👍
- Se você estiver usando uma versão mais antiga do webpack, instale e inclua `TerserWebpackPlugin` nas definições de configuração do webpack. Siga a [documentação](https://webpack.js.org/plugins/terser-webpack-plugin/) para saber como.
- Se você não estiver usando um módulo `Terser`, use o Terser como uma ferramenta CLI ou inclua-o diretamente como uma dependência de seu aplicativo. A [documentação](https://github.com/terser-js/terser) do projeto fornece instruções.

## Compressão de dados

A **compactação** é o processo de modificação de dados usando um algoritmo de compactação. [Gzip](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s) é o formato de compactação mais amplamente usado para interações de servidor e cliente. [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) é um algoritmo de compactação mais recente que pode fornecer resultados de compactação ainda melhores do que o Gzip.

{% Aside %} Compactar arquivos pode melhorar significativamente o desempenho de uma página da web, mas raramente você precisa fazer isso sozinho. Muitas plataformas de hospedagem, CDNs e servidores proxy reverso codificam ativos com compactação por padrão ou permitem que você os configure facilmente. Leia a documentação da ferramenta que você está usando para ver se a compactação já é suportada antes de tentar implementar sua própria solução. {% endAside %}

Existem duas maneiras diferentes de compactar arquivos enviados para um navegador:

- Dinamicamente
- Estatisticamente

Ambas as abordagens têm suas próprias vantagens e desvantagens, que são abordadas na próxima seção. Use o que funcionar melhor para o seu aplicativo.

## Compactação dinâmica

Esse processo envolve a compactação de ativos em tempo real à medida que são solicitados pelo navegador. Isso pode ser mais simples do que compactar arquivos manualmente ou com um processo de construção, mas pode causar atrasos se níveis de compactação altos forem usados.

[Express](https://expressjs.com/) é uma estrutura da web popular para Node e fornece uma biblioteca de middleware de [compactação.](https://github.com/expressjs/compression) Use-o para compactar qualquer ativo conforme solicitado. Aqui está um exemplo de um arquivo de servidor inteiro que o usa corretamente:

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

Isso compacta seus ativos usando `gzip` . Se o seu servidor da web oferecer suporte, considere o uso de um módulo separado, como o [shrink-ray,](https://github.com/aickin/shrink-ray#readme) para compactar via Brotli para obter melhores taxas de compactação.

{% Aside 'codelab' %} Use express.js para compactar ativos com [gzip](/codelab-text-compression) e [Brotli](/codelab-text-compression-brotli) . {% endAside %}

## Compactação estática

A compactação estática envolve compactar e salvar ativos antecipadamente. Isso pode fazer com que o processo de construção demore mais, especialmente se forem usados altos níveis de compactação, mas garante que nenhum atraso aconteça quando o navegador buscar o recurso compactado.

Se o seu servidor da web suportar Brotli, use um plugin como o [BrotliWebpackPlugin](https://github.com/mynameiswhm/brotli-webpack-plugin) com webpack para compactar seus ativos como parte de sua etapa de construção. Caso contrário, use o [CompressionPlugin](https://github.com/webpack-contrib/compression-webpack-plugin) para compactar seus recursos com gzip. Ele pode ser incluído como qualquer outro plug-in no arquivo de configurações do webpack:

```js/4
module.exports = {
	//...
	plugins: [
		//...
		new CompressionPlugin()
	]
}
```

Depois que os arquivos compactados fizerem parte da pasta de construção, crie uma rota em seu servidor para lidar com todos os endpoints JS para servir os arquivos compactados. Aqui está um exemplo de como isso pode ser feito com Node e Express para ativos compactados com gzip.

<pre>const express = require('express');
const app = express();

&lt;strong&gt;app.get('*.js', (req, res, next) =&gt; {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
});&lt;/strong&gt;

app.use(express.static('public'));
</pre>
