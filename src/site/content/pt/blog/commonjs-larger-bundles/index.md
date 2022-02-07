---
title: Como o CommonJS está tornando seus pacotes maiores
subhead: Aprenda como os módulos do CommonJS estão afetando a estrutura de seu aplicativo
authors:
  - mgechev
date: 2020-05-08
updated: 2020-05-26
hero: image/admin/S5JWmwRRW3rEXKwJR0JA.jpg
alt: Como o CommonJS está tornando seus pacotes maiores
description: |-
  Módulos CommonJS são muito dinâmicos, o que impede JavaScript
  otimizadores e pacotes realizam otimizações avançadas sobre eles.
tags:
  - blog
  - javascript
  - modules
---

Nesta postagem, veremos o que é CommonJS e por que está tornando seus pacotes de JavaScript maiores do que o necessário.

Resumo: **Para garantir que o bundler possa otimizar seu aplicativo com sucesso, evite depender dos módulos CommonJS e use a sintaxe do módulo ECMAScript em todo o aplicativo.**

## O que é CommonJS?

CommonJS é um padrão de 2009 que estabeleceu convenções para módulos JavaScript. Ele foi inicialmente planejado para uso fora do navegador da web, principalmente para aplicativos do lado do servidor.

Com o CommonJS você pode definir módulos, exportar funcionalidades deles e importá-los em outros módulos. Por exemplo, o snippet abaixo define um módulo que exporta cinco funções: `add` , `subtract`, `multiply`, `divide` e `max`:

```javascript
// utils.js
const { maxBy } = require('lodash-es');
const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);
```

Posteriormente, outro módulo pode importar e usar algumas ou todas estas funções:

```javascript
// index.js
const { add } = require('./utils');
console.log(add(1, 2));
```

Invocar `index.js` com `node` produzirá o número `3` no console.

Devido à falta de um sistema de módulo padronizado no navegador no início de 2010, o CommonJS também se tornou um formato de módulo popular para bibliotecas do lado do cliente JavaScript.

## Como o CommonJS afeta o tamanho final do pacote?

O tamanho do seu aplicativo JavaScript do lado do servidor não é tão crítico quanto no navegador, é por isso que o CommonJS não foi projetado com a redução do tamanho do pacote de produção em mente. Ao mesmo tempo, a [análise](https://v8.dev/blog/cost-of-javascript-2019) mostra que o tamanho do pacote JavaScript ainda é o principal motivo para tornar os aplicativos de navegador mais lentos.

Os empacotadores e minificadores de JavaScript, como `webpack` e `terser` , executam diferentes otimizações para reduzir o tamanho do seu aplicativo. Analisando seu aplicativo em tempo de construção, eles tentam remover o máximo possível do código-fonte que você não está usando.

Por exemplo, no snippet acima, seu pacote final deve incluir apenas a `add`, pois este é o único símbolo de `utils.js` que você importa em `index.js`.

Vamos construir o aplicativo usando a seguinte configuração de `webpack`

```javascript
const path = require('path');
module.exports = {
  entry: 'index.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};
```

Aqui, especificamos que queremos usar otimizações de modo de produção e usar `index.js` como um ponto de entrada. Depois de invocar o `webpack` , se explorarmos o [tamanho da saída](https://github.com/mgechev/commonjs-example/blob/master/commonjs/dist/out.js) , veremos algo como isto:

```shell
$ cd dist && ls -lah
625K Apr 13 13:04 out.js
```

Observe que **o pacote tem 625 KB** . Se olharmos para a saída, encontraremos todas as funções de `utils.js` mais vários módulos de [`lodash`](https://lodash.com/) **. Embora não usemos `lodash` em `index.js` ele faz parte da saída**, o que adiciona muito peso extra aos nossos ativos de produção.

Agora, vamos mudar o formato do módulo para [módulos ECMAScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) e tentar novamente. Desta vez, `utils.js` ficaria assim:

```javascript
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

import { maxBy } from 'lodash-es';

export const max = arr => maxBy(arr);
```

E `index.js` importaria de `utils.js` usando a sintaxe do módulo ECMAScript:

```javascript
import { add } from './utils';

console.log(add(1, 2));
```

Usando a mesma `webpack` , podemos construir nosso aplicativo e abrir o arquivo de saída. **Agora tem 40 bytes** com a seguinte [saída](https://github.com/mgechev/commonjs-example/blob/master/esm/dist/out.js) :

```javascript
(()=>{"use strict";console.log(1+2)})();
```

Observe que o pacote final não contém nenhuma das funções de `utils.js` que não usamos e não há nenhum vestígio de `lodash`! Além disso, `terser` (o minificador JavaScript que o `webpack` usa) incluiu a função `add` `console.log`.

Uma pergunta justa que você pode fazer é: **por que usar o CommonJS faz com que o pacote de saída seja quase 16.000 vezes maior**? Claro, este é um exemplo de brinquedo; na realidade, a diferença de tamanho pode não ser tão grande, mas as chances são de que o CommonJS adicione um peso significativo à sua construção de produção.

**Os módulos CommonJS são mais difíceis de otimizar no caso geral porque são muito mais dinâmicos do que os módulos ES. Para garantir que seu bundler e minificador possam otimizar com sucesso seu aplicativo, evite depender dos módulos CommonJS e use a sintaxe do módulo ECMAScript em todo o seu aplicativo.**

Observe que, mesmo se você estiver usando módulos ECMAScript em `index.js`, se o módulo que você está consumindo for um módulo CommonJS, o tamanho do pacote do seu aplicativo será afetado.

## Por que o CommonJS torna seu aplicativo maior?

Para responder a essa pergunta, vamos dar uma olhada no comportamento do `ModuleConcatenationPlugin` no `webpack` e, em seguida, discutir a analisabilidade estática. Este plugin concatena o escopo de todos os seus módulos em um encerramento e permite que o seu código tenha um tempo de execução mais rápido no navegador. Vejamos um exemplo:

```javascript
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

```javascript
// index.js
import { add } from './utils';
const subtract = (a, b) => a - b;

console.log(add(1, 2));
```

Acima, temos um módulo ECMAScript, que importamos em `index.js` . Também definimos uma função de `subtract` Podemos construir o projeto usando a mesma `webpack` acima, mas desta vez, iremos desativar a minimização:

```javascript
const path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false
  },
  mode: 'production',
};
```

Vejamos a saída produzida:

```javascript
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// CONCATENATED MODULE: ./utils.js**
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

// CONCATENATED MODULE: ./index.js**
const index_subtract = (a, b) => a - b;**
console.log(add(1, 2));**

/******/ })();
```

Na saída acima, todas as funções estão dentro do mesmo namespace. Para evitar colisões, o webpack renomeou a função `subtract` `index.js` para `index_subtract` .

Se um minificador processar o código-fonte acima, ele vai:

- Remova as funções não utilizadas `subtract` e `index_subtract`
- Remova todos os comentários e espaços em branco redundantes
- Colocar em linha o corpo da função `add` na chamada `console.log`

Frequentemente, os desenvolvedores referem-se a essa **remoção de importações não utilizadas como uma confusão**. A agitação da árvore só foi possível porque o webpack foi capaz de compreender estaticamente (em tempo de compilação) quais símbolos estamos importando de `utils.js` e quais símbolos exportamos.

Esse comportamento é ativado por padrão para **módulos ES** porque eles **são mais estaticamente analisáveis**, em comparação com CommonJS.

Vejamos exatamente o mesmo exemplo, mas desta vez altere `utils.js` para usar CommonJS em vez de módulos ES:

```javascript
// utils.js
const { maxBy } = require('lodash-es');

const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);
```

Esta pequena atualização mudará significativamente a saída. Como é muito longo para incorporar a esta página, compartilhei apenas uma pequena parte dela:

```javascript
...
(() => {

"use strict";
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(288);
const subtract = (a, b) => a - b;
console.log((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .add */ .IH)(1, 2));

})();
```

Observe que o pacote final contém algum `webpack`: código injetado que é responsável por importar / exportar a funcionalidade dos módulos incluídos. Desta vez, em vez de colocar todos os símbolos de `utils.js` e `index.js` no mesmo namespace, exigimos dinamicamente, em tempo de execução, a função `add` `__webpack_require__`.

Isso é necessário porque com CommonJS podemos obter o nome da exportação de uma expressão arbitrária. Por exemplo, o código abaixo é uma construção absolutamente válida:

```javascript
module.exports[localStorage.getItem(Math.random())] = () => { … };
```

Não há como o bundler saber em tempo de construção qual é o nome do símbolo exportado, pois isso requer informações que estão disponíveis apenas em tempo de execução, no contexto do navegador do usuário.

**Dessa forma, o minificador é incapaz de entender o que exatamente `index.js` usa de suas dependências, então ele não pode sacudi-lo em uma árvore.** Observaremos exatamente o mesmo comportamento para módulos de terceiros. **Se importarmos um módulo CommonJS de `node_modules`, seu conjunto de ferramentas de construção não será capaz de otimizá-lo adequadamente.**

## Agitando árvores com CommonJS

É muito mais difícil analisar os módulos CommonJS, pois eles são dinâmicos por definição. Por exemplo, o local de importação em módulos ES é sempre um literal de string, em comparação com CommonJS, onde é uma expressão.

Em alguns casos, se a biblioteca que você está usando segue convenções específicas sobre como usa o CommonJS, é possível remover as exportações não utilizadas no momento da construção usando um [plugin](https://github.com/indutny/webpack-common-shake) `webpack` de terceiros. Embora este plug-in adicione suporte para agitação de árvore, ele não cobre todas as diferentes maneiras como suas dependências podem usar o CommonJS. Isso significa que você não está obtendo as mesmas garantias dos módulos ES. Além disso, ele adiciona um custo extra como parte do seu processo de construção em cima do comportamento do `webpack`.

## Conclusão

**Para garantir que o bundler possa otimizar seu aplicativo com sucesso, evite depender dos módulos CommonJS e use a sintaxe do módulo ECMAScript em todo o aplicativo.**

Aqui estão algumas dicas práticas para verificar se você está no caminho ideal:

- Use o plug[-](https://github.com/rollup/plugins/tree/master/packages/node-resolve)in de resolução de nó de Rollup.js e defina o `modulesOnly` para especificar que você deseja depender apenas de módulos ECMAScript.
- Use o pacote [`is-esm`](https://github.com/mgechev/is-esm) para verificar se um pacote npm usa módulos ECMAScript.
- Se você estiver usando Angular, por padrão, você receberá um aviso se depender de módulos que não podem ser abalados por árvores.
