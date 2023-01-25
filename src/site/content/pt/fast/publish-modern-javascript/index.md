---
layout: post
title: Publique, envie e instale o JavaScript moderno para aplicativos mais rápidos
subhead: Melhore o desempenho ativando as dependências e a saída do JavaScript moderno.
hero: image/admin/UQbMiPKbXL1EDjtWsLju.jpg
authors:
  - houssein
  - developit
description: |2-

  O JavaScript moderno oferece melhorias de tamanho e desempenho em relação ao ES5 transpilado, e é compatível com 95% dos navegadores da web. Ativar a saída JavaScript moderna traz esses benefícios para o seu aplicativo, mas o impacto é limitado por dependências que já estão transpilados para ES5. Este guia demonstra como publicar pacotes modernos ao npm e como instalar e agrupar pacotes JavaScript modernos da maneira ideal.
date: 2020-12-10
updated: 2020-12-16
codelabs:
  - codelab-serve-modern-code
tags:
  - performance
  - blog
---

Mais de 90% dos navegadores são capazes de executar o JavaScript moderno, mas a prevalência do JavaScript legado continua sendo um dos maiores contribuintes para os problemas de desempenho na web hoje. [EStimator.dev](http://estimator.dev/) é uma ferramenta simples baseada na web que calcula o tamanho e a melhoria de desempenho que um site pode alcançar fornecendo uma sintaxe do JavaScript moderna.

<figure data-size="full">{% Img src="image/admin/FHHnXqdjdsC6PNSSnnC4.png", alt="A análise do EStimator.dev mostrando um site poderia ser 9% mais rápida com JavaScript moderno.", width="800", height="785" %} <figcaption> EStimator.dev </figcaption></figure>

A web hoje é limitada por JavaScript legado e nenhuma otimização melhorará o desempenho tanto quanto escrever, publicar e enviar sua página da web ou pacote usando a sintaxe **ES2017**.

## JavaScript moderno

O JavaScript moderno não é caracterizado como um código escrito em uma versão de especificação ECMAScript específica, mas sim na sintaxe que é suportada por todos os navegadores modernos. Navegadores modernos como Chrome, Edge, Firefox e Safari representam mais de [90% do mercado de navegadores](https://www.caniuse.com/usage-table), e navegadores diferentes que contam com os mesmos mecanismos de renderização subjacentes representam 5% adicionais. Isso significa que 95% do tráfego global da web vem de navegadores que suportam os recursos de linguagem do JavaScript mais amplamente usados nos últimos 10 anos, incluindo:

- Classes (ES2015)
- Funções das setas (ES2015)
- Geradores (ES2015)
- Escopo do bloco (ES2015)
- Destruição (ES2015)
- Parâmetros de repouso e propagação (ES2015)
- Abreviação do objeto (ES2015)
- Assíncrono/aguardar (ES2017)

Recursos em versões mais recentes da especificação de idioma geralmente têm suporte menos consistente em navegadores modernos. Por exemplo, muitos recursos do ES2020 e ES2021 são suportados apenas em 70% do mercado de navegadores — ainda que a maioria dos navegadores, mas não o suficiente para que seja seguro confiar diretamente nesses recursos. Isso significa que, embora o JavaScript "moderno" seja um alvo móvel, o ES2017 tem a mais ampla variedade de compatibilidade do navegador, [enquanto inclui a maioria dos recursos de sintaxe modernos comumente usados](https://dev.to/garylchew/bringing-modern-javascript-to-libraries-432c). Em outras palavras, **ES2017 é a sintaxe mais próxima da moderna hoje**.

## JavaScript legado

O JavaScript legado é um código que evita especificamente o uso de todos os recursos de linguagem mencionados acima. A maioria dos desenvolvedores escreve seu código-fonte usando uma sintaxe moderna, mas compila tudo para a sintaxe legada para aumentar o suporte do navegador. Compilar a sintaxe legada aumenta o suporte do navegador, no entanto, o efeito costuma ser menor do que imaginamos. Em muitos casos, o suporte aumenta de cerca de 95% para 98% enquanto que o custo é significativo:

- O JavaScript legado é normalmente cerca de 20% maior e mais lento do que o código moderno equivalente. Deficiências de ferramentas e configurações incorretas muitas vezes ampliam ainda mais esta falha.

- As bibliotecas instaladas representam até 90% da produção convencional do código do JavaScript. O código da biblioteca incorre em uma sobrecarga do JavaScript legado ainda maior devido ao polyfill e à duplicação do auxiliar que poderia ser evitada com a publicação de código moderno.

## JavaScript moderno em npm

Recentemente, o Node.js padronizou um campo de `"exports"` para definir [pontos de entrada para um pacote](https://nodejs.org/api/packages.html#packages_package_entry_points):

```json
{
  "exports": "./index.js"
}
```

Módulos referenciados pelo campo `"exports"` implicam em uma versão do Nó de pelo menos 12.8, que suporta ES2019. Isso significa que qualquer módulo referenciado usando o `"exports"` pode ser *escrito em JavaScript moderno*. Os consumidores do pacote devem assumir que os módulos com um `"exports"` contêm código moderno e transpilar, caso seja necessário.

### Apenas moderno

Caso você deseje publicar um pacote com código moderno e deixar ao consumidor a responsabilidade de transportá-lo quando for usado como uma dependência, use apenas o campo `"exports"`.

```json
{
  "name": "foo",
  "exports": "./modern.js"
}
```

{% Aside 'caution' %} Esta abordagem *não é recomendada*. Em um mundo perfeito, cada desenvolvedor já teria configurado seu sistema de compilação para transpilar todas as dependências (`node_modules`) para sua sintaxe necessária. No entanto, esse não é o caso atualmente, e publicar seu pacote usando apenas sintaxe moderna impediria seu uso em aplicativos que seriam acessados por navegadores legados. {% endAside %}

### Moderno com fallback legado

Use o campo `"exports"` junto com `"main"` para publicar seu pacote usando código moderno, mas também inclua um fallback ES5 + CommonJS para navegadores legados.

```json
{
  "name": "foo",
  "exports": "./modern.js",
  "main": "./legacy.cjs"
}
```

### Moderno com fallback legado e otimizações de empacotadores ESM

Além de definir um ponto de entrada CommonJS de fallback, o `"module"` pode ser usado para apontar para um pacote de fallback legado semelhante, mas que usa sintaxe de módulo do JavaScript (`import` e `export`).

```json
{
  "name": "foo",
  "exports": "./modern.js",
  "main": "./legacy.cjs",
  "module": "./module.js"
}
```

Muitos empacotadores, como webpack e Rollup, contam com esse campo para aproveitar as vantagens dos recursos do módulo e permitir a [tree shaking](/commonjs-larger-bundles/#how-does-commonjs-affect-your-final-bundle-size). Este ainda é um pacote legado que não contém nenhum código moderno além da `import`/`export`, portanto, use essa abordagem para enviar código moderno com um fallback legado que ainda é otimizado para empacotamento.

## JavaScript moderno em aplicativos

Dependências de terceiros constituem a grande maioria do código do JavaScript de produção típico em aplicativos da web. Embora as dependências do npm tenham sido publicadas historicamente como sintaxe ES5 legada, essa não é mais uma suposição segura e corre o risco de atualizações de dependência quebrarem o suporte do navegador em seu aplicativo.

Com um número cada vez maior de pacotes npm migrando para o JavaScript moderno, é importante garantir que as ferramentas de construção estejam configuradas para lidar com eles. Há uma boa chance de alguns dos pacotes npm dos quais você depende já estarem usando recursos de linguagem modernos. Existem várias opções disponíveis para usar o código moderno do npm sem quebrar seu aplicativo em navegadores mais antigos, mas a ideia geral é fazer com que o sistema de compilação transpondo as dependências para o mesmo destino de sintaxe do código-fonte.

## webpack

A partir do webpack 5, agora é possível configurar a sintaxe que o webpack usará ao gerar o código para pacotes e módulos. Isso não transpila seu código ou dependências, apenas afeta o código "glue" gerado pelo webpack. Para especificar o destino de suporte do navegador, adicione uma [configuração de lista de navegadores](https://github.com/browserslist/browserslist#readme) ao seu projeto ou faça isso diretamente na configuração do webpack:

```js
module.exports = {
  target: ['web', 'es2017'],
};
```

Também é possível configurar o webpack para gerar pacotes otimizados que omitem funções do invólucro desnecessárias ao se direcionar a um ambiente moderno de Módulos ES. Isto também configura o webpack para carregar pacotes de divisão de código usando `<script type="module">`.

```js
module.exports = {
  target: ['web', 'es2017'],
  output: {
    module: true,
  },
  experiments: {
    outputModule: true,
  },
};
```

Existem vários plug-ins de webpack disponíveis que tornam possível compilar e distribuir o JavaScript moderno, ao mesmo tempo que oferece suporte a navegadores legados, como Optimize Plugin e BabelEsmPlugin.

### Optimize Plugin

O [Optimize Plugin](https://github.com/developit/optimize-plugin) é um plugin webpack que transforma o código final do pacote de JavaScript moderno para legado, em vez de cada arquivo de fonte individual. É uma configuração independente que permite que a configuração do seu webpack assuma que tudo seja JavaScript moderno, sem ramificações especiais para várias saídas ou sintaxes.

Como o Optimize Plugin opera em pacotes em vez de módulos individuais, ele processa o código do seu aplicativo e suas dependências igualmente. Isso torna seguro o uso de dependências do JavaScript modernos do npm, porque seu código será empacotado e transpilado para a sintaxe correta. Também pode ser mais rápido do que as soluções tradicionais envolvendo duas etapas de compilação, enquanto ainda gera pacotes separados para navegadores modernos e legados. Os dois conjuntos de pacotes são projetados para serem carregados usando o [module/nomodule pattern](/serve-modern-code-to-modern-browsers/).

```js
// webpack.config.js
const OptimizePlugin = require('optimize-plugin');

module.exports = {
  // ...
  plugins: [new OptimizePlugin()],
};
```

O `Optimize Plugin` pode ser mais rápido e eficiente do que configurações de webpack personalizadas, que normalmente agrupam código moderno e legado separadamente. Ele também lida com a execução do [Babel](https://babeljs.io/) para você e minimiza os pacotes usando o [Terser](https://terser.org/) com configurações ideais separadas para as saídas modernas e legadas. Por último, polyfills necessários para os pacotes legados gerados são extraídos em um script dedicado para que nunca sejam duplicados ou carregados desnecessariamente em navegadores mais novos.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/fast-publish-modern-javascript/transpile-before-after.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/fast-publish-modern-javascript/transpile-before-after.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Comparação: transpilar módulos de fonte duas vezes versus transpilar pacotes gerados.</figcaption></figure>

### BabelEsmPlugin

O [BabelEsmPlugin](https://github.com/prateekbh/babel-esm-plugin) é um plugin webpack que funciona junto com [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) para gerar versões modernas de pacotes existentes para enviar menos código transpilado para navegadores modernos. É a solução de prateleira mais popular para module/nomodule, usada por [Next.js](https://nextjs.org/) e [Preact CLI](https://preactjs.com/cli/).

```js
// webpack.config.js
const BabelEsmPlugin = require('babel-esm-plugin');

module.exports = {
  //...
  module: {
    rules: [
      // your existing babel-loader configuration:
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [new BabelEsmPlugin()],
};
```

O `BabelEsmPlugin` suporta a uma ampla variedade de configurações de webpack, porque executa duas compilações amplamente separadas de seu aplicativo. Compilar duas vezes pode levar um pouco mais de tempo para aplicativos grandes, no entanto, essa técnica permite que o `BabelEsmPlugin` se integre perfeitamente às configurações do webpack existentes e o torna uma das opções mais convenientes disponíveis.

### Configure o babel-loader para transpilar node_modules

Caso esteja usando o `babel-loader` sem um dos dois plug-ins anteriores, há uma etapa importante necessária para consumir módulos npm do JavaScript moderno. A definição de duas configurações separadas `babel-loader` torna possível compilar automaticamente recursos de linguagem modernos encontrados em `node_modules` para ES2017, enquanto ainda transpila seu próprio código fonte com os plug-ins Babel e predefinições definidas na configuração do seu projeto. Isso não gera pacotes legados e modernos para uma configuração do module/nomodule, mas torna possível instalar e usar pacotes npm que contêm JavaScript moderno sem quebrar navegadores mais antigos.

O [webpack-plugin-modern-npm](https://www.npmjs.com/package/webpack-plugin-modern-npm) usa essa técnica para compilar dependências npm que têm um `"exports"` em seu `package.json`, já que estas podem conter a sintaxe moderna:

```js
// webpack.config.js
const ModernNpmPlugin = require('webpack-plugin-modern-npm');

module.exports = {
  plugins: [
    // auto-transpile modern stuff found in node_modules
    new ModernNpmPlugin(),
  ],
};
```

Como alternativa, você pode implementar a técnica manualmente na configuração do seu webpack, verificando se há um campo `"exports"` `package.json` dos módulos conforme eles são resolvidos. Omitindo o armazenamento em cache por questões de brevidade, uma implementação personalizada pode ter a seguinte aparência:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      // Transpile for your own first-party code:
      {
        test: /\.js$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      // Transpile modern dependencies:
      {
        test: /\.js$/i,
        include(file) {
          let dir = file.match(/^.*[/\\]node_modules[/\\](@.*?[/\\])?.*?[/\\]/);
          try {
            return dir && !!require(dir[0] + 'package.json').exports;
          } catch (e) {}
        },
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
```

Ao usar essa abordagem, você precisará garantir que a sintaxe moderna seja compatível com seu minificador. Tanto o [Terser](https://github.com/terser/terser#minify-options) quanto o [uglify-es](https://github.com/mishoo/UglifyJS/tree/harmony#minify-options) têm a opção de especificar `{ecma: 2017}` a fim de preservar e, em alguns casos, gerar a sintaxe ES2017 durante a compactação e a formatação.

## Rollup

O Rollup tem suporte integrado para gerar vários conjuntos de pacotes como parte de uma única construção e gera código moderno por padrão. Como resultado, o Rollup pode ser configurado para gerar pacotes modernos e legados com os plug-ins oficiais que você provavelmente já esteja usando.

### @rollup/plugin-babel

Caso use o Rollup, o [`getBabelOutputPlugin()` method](https://github.com/rollup/plugins/tree/master/packages/babel#running-babel-on-the-generated-code) (fornecido pelo [official Babel plugin](https://github.com/rollup/plugins/tree/master/packages/babel) do Rollup) transforma o código em pacotes gerados em vez de módulos de fonte individuais. O Rollup tem suporte integrado para gerar vários conjuntos de pacotes como parte de uma única construção, cada um com seus próprios plug-ins. É possível usar isso para produzir pacotes diferentes para o moderno e o legado, passando cada um por uma configuração diferente de plug-in de saída do Babel:

```js
// rollup.config.js
import {getBabelOutputPlugin} from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    // modern bundles:
    {
      format: 'es',
      plugins: [
        getBabelOutputPlugin({
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {esmodules: true},
                bugfixes: true,
                loose: true,
              },
            ],
          ],
        }),
      ],
    },
    // legacy (ES5) bundles:
    {
      format: 'amd',
      entryFileNames: '[name].legacy.js',
      chunkFileNames: '[name]-[hash].legacy.js',
      plugins: [
        getBabelOutputPlugin({
          presets: ['@babel/preset-env'],
        }),
      ],
    },
  ],
};
```

## Ferramentas de compilação adicionais

O Rollup e webpack são altamente configuráveis, o que geralmente significa que cada projeto deve atualizar sua configuração para permitir a sintaxe do JavaScript moderna nas dependências. Existem também ferramentas de construção de alto nível que favorecem a convenção e os padrões em relação à configuração, como [Parcel](https://parceljs.org/), [Snowpack](https://www.snowpack.dev/), [Vite](https://github.com/vitejs/vite) and [WMR](https://github.com/preactjs/wmr). A maioria dessas ferramentas assume que as dependências do npm podem conter sintaxe moderna e as transpilarão para o(s) nível(is) de sintaxe apropriado(s) ao construir para produção.

Além de plug-ins dedicados para o webpack e Rollup, pacotes do JavaScript modernos com fallbacks legados podem ser adicionados a qualquer projeto usando [devolution](https://github.com/theKashey/devolution). O Devolution é uma ferramenta autônoma que transforma a saída de um sistema de construção para produzir variantes do JavaScript legadas, permitindo que o empacotamento e as transformações assumam um destino de saída moderno.

## Conclusão

O [EStimator.dev](http://estimator.dev/) foi desenvolvido para fornecer uma maneira fácil de avaliar o impacto que pode causar o deslocamento para o código JavaScript moderno para a maioria dos usuários. Hoje, ES2017 é o mais próximo da sintaxe moderna e ferramentas como npm, Babel, webpack e Rollup tornaram possível configurar seu sistema de construção e escrever seus pacotes usando esta sintaxe. Esta postagem aborda várias abordagens, e você deve usar a opção mais fácil que funcione para o seu caso de uso.

{% YouTube 'cLxNdLK--yI' %}

<br>
