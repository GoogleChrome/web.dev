---
layout: post
title: Remova o código não utilizado
subhead: |2

  O npm facilita a adição de código ao seu projeto. Mas você está realmente usando todos

  esses bytes extras?
authors:
  - houssein
date: 2018-11-05
description: Registros como o npm transformaram o mundo JavaScript para melhor ao permitir que qualquer pessoa baixe e use facilmente mais de meio milhão de pacotes públicos. Mas muitas vezes incluímos bibliotecas que não estamos utilizando por completo. Para solucionar esse problema, analise seu pacote para detectar códigos não utilizados.
codelabs:
  - codelab-remove-unused-code
tags:
  - performance
---

Registros como o [npm](https://docs.npmjs.com/getting-started/what-is-npm) transformaram o mundo do JavaScript para melhor, permitindo que qualquer pessoa baixe e use facilmente mais de *meio milhão* de pacotes públicos. Mas muitas vezes incluímos bibliotecas que não estamos utilizando totalmente. Para corrigir esse problema, **analise seu pacote** para detectar código não utilizado. Em seguida, remova as bibliotecas **não utilizadas** e **desnecessárias.**

## Analise seu pacote

DevTools torna mais fácil ver o tamanho de todas as solicitações de rede: {% Instruction 'devtools-network', 'ol' %} {% Instruction 'disable-cache', 'ol' %} {% Instruction 'reload-page', 'ol' %}

{% Img src="image/admin/aq6QZj5p4KTuaWnUJnLC.png", alt="Painel de rede com solicitação de pacote", width="800", height="169" %}

A guia [Cobertura](https://developer.chrome.com/docs/devtools/coverage/) em DevTools também informará quanto código CSS e JS em seu aplicativo não está sendo usado.

{% Img src="image/admin/xlPdOMaeykJhYqGcaMJr.png", alt="Abrangência de códigos no DevTools", width="800", height="562"%}

Ao especificar uma configuração completa do Lighthouse por meio de seu Node CLI, uma auditoria de "JavaScript não usado" também pode ser usada para rastrear quanto código não usado está sendo enviado com seu aplicativo.

{% Img src="image/admin/tdC0d65gEIiHZy6eyo82.png", alt="Auditoria do Lighthouse de JS não usado", width="800", height="347" %}

Se você estiver usando o [webpack](https://webpack.js.org/) como seu empacotador, o [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) ajudará a investigar o que constitui o bundle. Inclua o plug-in em seu arquivo de configurações do webpack como qualquer outro plug-in:

```js/4
module.exports = {
  //...
  plugins: [
    //...
    new BundleAnalyzerPlugin()
  ]
}
```

Embora o webpack seja geralmente usado para construir aplicativos de página única, outros empacotadores, como [Parcel](https://parceljs.org/) e [Rollup](https://rollupjs.org/guide/en), também têm ferramentas de visualização que você pode usar para analisar seu pacote.

Recarregar o aplicativo com este plugin incluído mostra um mapa de árvore com zoom de todo o seu pacote.

{% Img src="image/admin/pLAHEtl5C011wTk2IJij.png", alt="Webpack Bundle Analyzer", width="800", height="468"%}

Usar esta visualização permite que você inspecione quais partes de seu pacote são maiores do que outras, bem como ter uma ideia melhor de todas as bibliotecas que você está importando. Isso pode ajudar a identificar se você está usando alguma biblioteca não utilizada ou desnecessária.

## Remover bibliotecas não utilizadas

Na imagem anterior do mapa de árvore, existem alguns pacotes dentro de um único domínio `@firebase`. Se seu site precisa apenas do componente de banco de dados firebase, atualize as importações para buscar essa biblioteca:

```js/1-2/0
import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/database';
```

É importante enfatizar que este processo é significativamente mais complexo para aplicações maiores.

Para o pacote de aparência misteriosa que você tem certeza de que não está sendo usado em lugar nenhum, dê um passo para trás e veja em quais de suas dependências de nível superior está sendo usado. Tente encontrar uma maneira de importar apenas os componentes de que você precisa. Se você não estiver usando uma biblioteca, remova-a. Se a biblioteca não for necessária para o carregamento da página inicial, considere se ela pode ser [carregada lentamente](/reduce-javascript-payloads-with-code-splitting).

Caso você esteja usando o webpack, verifique [a lista de plug-ins que removem automaticamente o código não utilizado das bibliotecas mais usadas](https://github.com/GoogleChromeLabs/webpack-libs-optimizations).

{% Aside 'codelab' %} [Remova o código não utilizado.](/codelab-remove-unused-code) {% endAside %}

## Remover bibliotecas desnecessárias

Nem todas as bibliotecas podem ser facilmente divididas em partes e importadas seletivamente. Nesses cenários, verifique se biblioteca pode ser removida completamente. Construir uma solução personalizada ou aproveitar uma alternativa mais leve devem sempre ser opções que valem a pena considerar. No entanto, é importante pesar na complexidade e o esforço necessários para qualquer um desses esforços antes de remover uma biblioteca inteiramente de um aplicativo.
