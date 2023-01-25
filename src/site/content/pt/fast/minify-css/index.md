---
layout: post
title: Minificar CSS
authors:
  - demianrenzulli
description: Saiba como minificar arquivos CSS para melhorar o desempenho, sem afetar a forma como o navegador processa os estilos.
date: 2019-05-02
tags:
  - performance
---

Os arquivos CSS podem conter caracteres desnecessários, como comentários, espaços em branco e recuos. Na produção, é possível remover esses caracteres com segurança, para reduzir o tamanho do arquivo sem afetar a forma como o navegador processa os estilos. Essa técnica é chamada de **minificação**.

## Carregando CSS não minificado

Confira o seguinte bloco CSS:

```css
body {
  font-family: "Benton Sans", "Helvetica Neue", helvetica, arial, sans-serif;
  margin: 2em;
}

/* todos os títulos precisam ter o mesmo plano de fundo, fonte e cor */
h1 {
  font-style: italic;
  color: #373fff;
  background-color: #000000;
}

h2 {
  font-style: italic;
  color: #373fff;
  background-color: #000000;
}
```

Esse conteúdo é fácil de ler, mas produz um arquivo maior do que o necessário:

- Ele usa espaços para fins de recuo e contém comentários, que são ignorados pelo navegador, então podem ser removidos.
- Os elementos `<h1>` e `<h2>` têm os mesmos estilos: em vez de declará-los separadamente, "`h1 {...} h2 {...}`", eles podem ser expressos como "`h1, h2{...}`".
- A **cor de plano de fundo** `#000000` pode ser expressa apenas como `#000`.

Depois de fazer essas alterações, você obtém uma versão mais compacta dos mesmos estilos:

```css
body{font-family:"Benton Sans","Helvetica Neue",helvetica,arial,sans-serif;margin:2em}h1,h2{font-style:italic;color:#373fff;background-color:#000}
```

Você provavelmente não quer escrever CSS assim. Em vez disso, pode escrever normalmente e adicionar uma etapa de minificação ao processo de desenvolvimento. Neste guia, você aprenderá a fazer isso usando uma ferramenta conhecida de desenvolvimento: o [webpack](https://webpack.js.org/).

## Medição

Você aplicará a minificação de CSS a um site que foi usado em outros guias: o [Fav Kitties](https://fav-kitties-animated.glitch.me/). Essa versão do site usa uma boa biblioteca CSS ([animate.css](https://github.com/daneden/animate.css)) para animar diferentes elementos da página quando um usuário vota em um gato 😺.

Primeiro, você precisa entender qual é a oportunidade de minificação desse arquivo:

1. Abra a [página de medição](/measure).
2. Digite o URL `https://fav-kitties-animated.glitch.me` e clique em **Run Audit** (Executar auditoria).
3. Clique em **View report** (Exibir relatório).
4. Clique em **Performance** (Desempenho) e acesse a seção **Opportunities** (Oportunidades).

O relatório resultante mostra que até **16 KB** podem ser poupados no arquivo **animate.css**:

{% Img src="image/admin/RFMk5OMAIvOlkUZJTsh4.png", alt="Lighthouse: oportunidade de minificação de CSS.", width="800", height="172", class="screenshot" %}

Agora inspecione o conteúdo do CSS:

1. Abra o [site Fav Kitties](https://fav-kitties-animated.glitch.me/) no Chrome. Pode demorar um pouco para que os servidores do Glitch respondam pela primeira vez. {% Instruction 'devtools-network', 'ol' %}
2. Clique no filtro **CSS.**
3. Marque a caixa de seleção **Disable cache** (Desativar cache). {% Instruction 'reload-app', 'ol' %}

{% Img src="image/admin/WgneNAyftk8jneyXxMih.png", alt="Rastreamento não otimizado de CSS do DevTools", width="800", height="138" %}

A página está solicitando dois arquivos CSS, de **1,9 KB** e **76,2 KB,** respectivamente.

1. Clique em **animate.css**.
2. Clique na guia **Response** (Resposta) para ver o conteúdo do arquivo.

Observe que a folha de estilo contém caracteres de espaços em branco e recuos:

{% Img src="image/admin/UEB5Xxe5IHhGtMx3XfKD.png", alt="Resposta não otimizada de CSS do DevTools", width="800", height="286" %}

A seguir, você adicionará alguns plug-ins do webpack ao processo de desenvolvimento para minificar esses arquivos.

{% Aside 'note' %} **Observação:** o relatório do Lighthouse anterior lista apenas `animate.css` como uma oportunidade de minificação. A minificação de `style.css` também poupa alguns bytes, mas não o suficiente para o Lighthouse considerar uma economia significativa. No entanto, minificar o CSS é uma prática recomendada geral. Portanto, faz sentido minificar todos os seus arquivos CSS. {% endAside %}

## Minificação de CSS com webpack

Antes de pular para as otimizações, dedique algum tempo para entender como funciona o processo de desenvolvimento do [site Fav Kitties](https://glitch.com/edit/#!/fav-kitties-animated?path=webpack.config.js:1:0%5D):

{% Glitch { id: 'fav-kitties-animated', path: 'webpack.config.js', previewSize: 0 } %}

Por padrão, o pacote JS produzido pelo webpack contém o conteúdo dos arquivos CSS embutidos. Como queremos manter arquivos CSS separados, estamos usando dois plug-ins complementares:

- O [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) extrai cada folha de estilo para um arquivo próprio, como uma das etapas do processo de desenvolvimento.
- O [webpack-fix-style-only-entries](https://github.com/fqborges/webpack-fix-style-only-entries) é usado para corrigir um problema no wepback 4, evitando a geração de um arquivo JS extra para cada arquivo CSS listado em **webpack-config.js**.

Agora você fará algumas alterações no projeto:

1. Abra [o projeto Fav Kitties no Glitch](https://glitch.com/~fav-kitties-animated). {% Instruction 'source', 'ol' %} {% Instruction 'remix', 'ol' %} {% Instruction 'console', 'ol' %}

Para minificar o CSS resultante, você usará o [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin):

1. No console do Glitch, execute `npm install --save-dev optimize-css-assets-webpack-plugin`.
2. Execute `refresh` para sincronizar as alterações com o editor do Glitch.

Em seguida, volte ao editor do Glitch, abra o arquivo **webpack.config.js** e faça as seguintes modificações:

Carregue o módulo no início do arquivo:

```js
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
```

Em seguida, transmita uma instância do plug-in para a matriz  **plugins**:

```js
  plugins: [
    new HtmlWebpackPlugin({template: "./src/index.html"}),
    new MiniCssExtractPlugin({filename: "[name].css"}),
    new FixStyleOnlyEntriesPlugin(),
    new OptimizeCSSAssetsPlugin({})
  ]
```

Depois de fazer as alterações, será acionada uma recriação do projeto. Esta é a aparência do **webpack.config.js** resultante:

{% Glitch { id: 'fav-kitties-animated-min', path: 'webpack.config.js', previewSize: 0 } %}

A seguir, você verificará o resultado dessa otimização com as ferramentas de desempenho.

## Verificação

{% Instruction 'preview' %}

Se você se perdeu em alguma das etapas anteriores, clique [aqui](https://fav-kitties-animated-min.glitch.me/) para abrir uma versão otimizada do site.

Para inspecionar o tamanho e o conteúdo dos arquivos, faça o seguinte:

{% Instruction 'devtools-network', 'ol' %}

1. Clique no filtro **CSS.**
2. Marque a caixa de seleção **Disable cache** (Desativar cache) se ainda não tiver feito isso. {% Instruction 'reload-app', 'ol' %}

{% Img src="image/admin/id5kWwB3NilmVPWPTM59.png", alt="Resposta não otimizada de CSS do DevTools", width="800", height="130" %}

É possível inspecionar esses arquivos e ver se as novas versões não contêm nenhum espaço em branco. Ambos os arquivos são muito menores, principalmente o [animate.css](http://fav-kitties-animated-min.glitch.me/animate.css), que foi reduzido em **aproximadamente 26%**, poupando **cerca de 20 KB**!

Siga esta última etapa:

1. Abra a [página de medição](/measure).
2. Insira a URL do site otimizado.
3. Clique em **View report** (Exibir relatório).
4. Clique em **Performance** (Desempenho) e encontre a seção **Opportunities** (Oportunidades).

O relatório não mostra mais "Minify CSS" (Minificar CSS) como uma oportunidade e foi movido para a seção "Passed Audits" (Auditorias aprovadas):

{% Img src="image/admin/zegn2qIHYYK58w1GhgYd.png", alt="Auditorias do Lighthouse de otimização da página aprovadas.", width="800", height="163" %}

Como os arquivos CSS são [recursos de bloqueio de renderização](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources), se você aplicar a minificação em sites que usam arquivos CSS grandes, poderá ver melhorias nas métricas, como a [First Contentful Paint](/fcp/) (FCP), ou primeira exibição de conteúdo.

## Próximas etapas e recursos

Neste guia, discutimos a minificação de CSS com o webpack, mas a mesma abordagem pode ser seguida com outras ferramentas de desenvolvimento, como [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css) para o [Gulp](https://gulpjs.com/) ou [grunt-contrib-cssmin](https://www.npmjs.com/package/grunt-contrib-cssmin) para o [Grunt](https://gruntjs.com/).

A minificação também pode ser aplicada a outros tipos de arquivos. Confira o [guia Minificar e compactar cargas de rede](/fast/reduce-network-payloads-using-text-compression) para saber mais sobre as ferramentas de minificação de JS e algumas técnicas complementares, como a compactação.
