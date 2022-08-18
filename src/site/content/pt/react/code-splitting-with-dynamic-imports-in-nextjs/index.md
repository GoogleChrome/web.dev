---
layout: post
title: Divisão de código com importações dinâmicas em Next.js
authors:
  - mihajlija
subhead: |2

  Como acelerar seu aplicativo Next.js com divisão de código e estratégias de carregamento inteligente.
date: 2019-11-08
feedback:
  - api
---

## O que você vai aprender?

Esta publicação explica diferentes tipos de [divisão](/reduce-javascript-payloads-with-code-splitting/) de código e como usar importações dinâmicas para acelerar seus aplicativos Next.js.

## Divisão de código baseada em rota e baseada em componente

Por padrão, o Next.js divide seu JavaScript em partes separadas para cada rota. Quando os usuários carregam seu aplicativo, o Next.js envia apenas o código necessário para a rota inicial. Quando os usuários navegam pelo aplicativo, eles buscam os pedaços associados a outras rotas. A divisão de código baseada em rota minimiza a quantidade de script que precisa ser analisada e compilada de uma vez, o que resulta em tempos de carregamento de página mais rápidos.

Embora a divisão de código baseada em rota seja um bom padrão, você pode otimizar ainda mais o processo de carregamento com a divisão de código no nível do componente. Se você tiver componentes grandes em seu aplicativo, é uma ótima ideia dividi-los em partes separadas. Dessa forma, qualquer componente grande que não seja crítico ou apenas renderize em certas interações do usuário (como clicar em um botão) pode ser carregado lentamente.

Next.js suporta o elemento [`import()` dinâmico](https://v8.dev/features/dynamic-import), que permite importar módulos JavaScript (incluindo componentes React) dinamicamente e carregar cada importação como um pedaço separado. Isso oferece divisão de código em nível de componente e permite controlar o carregamento de recursos para que os usuários baixem apenas o código de que precisam para a parte do site que estão visualizando. No Next.js, esses componentes são [renderizados do lado do servidor (SSR)](/rendering-on-the-web/) por padrão.

## Importações dinâmicas em ação

Esta postagem inclui várias versões de um aplicativo de amostra que consiste em uma página simples com um botão. Ao clicar no botão, você verá um cachorrinho fofo. Conforme você avança em cada versão do aplicativo, verá como as importações dinâmicas são diferentes das [importações estáticas](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) e como trabalhar com elas.

Na primeira versão do aplicativo, o cachorro mora em `components/Puppy.js`. Para exibir o cachorro na página, o aplicativo importa o componente `Puppy` `index.js` com uma declaração de importação estática:

```js
import Puppy from "../components/Puppy";
```

{% Glitch { id: 'static-import', path: 'index.js', previewSize: 0, height: 480 } %}

Para ver como Next.js agrupa o aplicativo, inspecione o rastreamento de rede no DevTools:

{% Instruction 'preview', 'ol' %}

{% Instruction 'devtools-network', 'ol' %}

{% Instruction 'disable-cache', 'ol' %}

{% Instruction 'reload-page', 'ol' %}

Quando você carrega a página, todo o código necessário, incluindo o `Puppy.js`, é empacotado em `index.js` :

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6KWlTYFhoIEIGqnuMwlh.png", alt="Guia Rede DevTools mostrando seis arquivos JavaScript: index.js, app.js, webpack.js, main.js, 0.js e o dll (arquivo de biblioteca de link dinâmico).", width="800", height="665" %}</figure>

Quando você pressiona o botão **Clique aqui**, apenas a solicitação do filhote de cachorro JPEG é adicionada à guia **Rede:**

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7MkXVqnqfIbW74VV48kB.png", alt="Guia Rede DevTools após o clique do botão, mostrando os mesmos seis arquivos JavaScript e uma imagem.", width="800", height="665" %}</figure>

A desvantagem dessa abordagem é que, mesmo que os usuários não cliquem no botão para ver o cachorro, eles precisam carregar o `Puppy` porque ele está incluído no `index.js`. Neste pequeno exemplo, isso não é grande coisa, mas em aplicações reais geralmente é uma grande melhoria carregar componentes grandes apenas quando necessário.

Agora verifique uma segunda versão do aplicativo, em que a importação estática é substituída por uma importação dinâmica. Next.js inclui `next/dynamic`, o que possibilita usar importações dinâmicas para qualquer componente em Next:

```js/1,5/0
import Puppy from "../components/Puppy";
import dynamic from "next/dynamic";

// ...

const Puppy = dynamic(import("../components/Puppy"));
```

{% Glitch { id: 'dynamic-import-nextjs', path: 'pages/index.js:29:10', height: 480 } %}

Siga as etapas do primeiro exemplo para inspecionar o rastreamento da rede.

Quando você carrega o aplicativo pela primeira vez, apenas o `index.js` é baixado. Desta vez, é 0,5 KB menor (diminuiu de 37,9 KB para 37,4 KB) porque não inclui o código do componente `Puppy`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K7Ii3bxUkb37LrZjjWT1.png", alt="Rede DevTools mostrando os mesmos seis arquivos JavaScript, exceto index.js agora é 0,5 KB menor.", width="800", height="665" %}</figure>

O `Puppy` agora está em um bloco separado, `1.js`, que é carregado apenas quando você pressiona o botão:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1DfVDv5poQmwXwOKmnvd.png", alt = "Guia Rede DevTools após o clique do botão, mostrando o arquivo 1.js adicional e a imagem adicionada ao final da lista de arquivos.", width = " 800 ", height =" 665 "%}</figure>

{% Aside %} Por padrão, Next.js nomeia esses blocos dinâmicos como *número* .js, em que *número* começa em 1. {% endAside %}

Em aplicações reais, os componentes costumam ser [muito maiores](https://bundlephobia.com/result?p=moment@2.24.0) e o carregamento lento pode reduzir a carga útil inicial do JavaScript em centenas de kilobytes.

## Importações dinâmicas com indicador de carregamento personalizado

Quando você carrega lentamente os recursos, é uma boa prática fornecer um indicador de carregamento no caso de haver atrasos. Em Next.js, você pode fazer isso fornecendo um argumento adicional para a função `dynamic()`:

```js
const Puppy = dynamic(() => import("../components/Puppy"), {
  loading: () => <p>Loading...</p>
});
```

{% Glitch { id: 'dynamic-import-loading', path: 'pages/index.js:7:27', height: 480 } %}

Para ver o indicador de carregamento em ação, simule uma conexão de rede lenta no DevTools:

{% Instruction 'preview', 'ol' %}

{% Instruction 'devtools-network', 'ol' %}

{% Instruction 'disable-cache', 'ol' %}

1. Na lista suspensa **Aceleração**, selecione **3G rápido**.

2. Pressione o botão **Clique aqui**

Agora, quando você clica no botão, leva um tempo para carregar o componente e o aplicativo exibe a mensagem "Carregando…" nesse meio tempo.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tjlpmwolBVp1jh948Fln.png", alt="Uma tela escura com a mensagem \"Carregando...\".", width="800", height="663" %}</figure>

## Importações dinâmicas sem SSR

Se precisar renderizar um componente apenas no lado do cliente (por exemplo, um widget de chat), você pode fazer isso configurando a opção `ssr` `false` :

```js
const Puppy = dynamic(() => import("../components/Puppy"), {
  ssr: false,
});
```

{% Glitch { id: 'dynamic-import-no-ssr', path: 'pages/index.js:5:0', height: 480 } %}

## Conclusão

Com suporte para importações dinâmicas, o Next.js oferece divisão de código em nível de componente, o que pode minimizar suas cargas de JavaScript e melhorar o tempo de carregamento do aplicativo. Todos os componentes são renderizados do lado do servidor por padrão e você pode desabilitar esta opção sempre que necessário.
