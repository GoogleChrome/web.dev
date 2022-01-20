---
layout: post
title: Divisão de código com React.lazy e Suspense
subhead: |2

  Você nunca precisa enviar mais código do que o necessário para seus usuários, então divida seus pacotes para garantir que isso nunca aconteça!
hero: image/admin/Lk8KvDZcWntc7rtQzvv9.jpg
date: 2019-04-29
description: |2-

  O método React.lazy facilita a divisão de código de um aplicativo React em um

  nível de componente usando importações dinâmicas. Use-o junto com o Suspense para mostrar

  estados de carregamento apropriados aos seus usuários.
authors:
  - houssein
  - jeffposnick
feedback:
  - api
---

{% Aside %} Se você ainda não entende a ideia básica por trás da divisão de código, consulte primeiro o guia [Reduzir cargas úteis de JavaScript com divisão de código](/reduce-javascript-payloads-with-code-splitting). {% endAside %}

O **`React.lazy`** facilita a divisão de código de um aplicativo React em um nível de componente usando importações dinâmicas.

```jsx
import React, { lazy } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));

const DetailsComponent = () => (
  <div>
    <AvatarComponent />
  </div>
)
```

## Por que isso é útil?

Um grande aplicativo React geralmente consiste em muitos componentes, métodos utilitários e bibliotecas de terceiros. Se não for feito nenhum esforço para tentar carregar diferentes partes de um aplicativo apenas quando forem necessárias, um único pacote grande de JavaScript será enviado para seus usuários assim que carregarem a primeira página. Isso pode afetar significativamente o desempenho da página.

O `React.lazy` fornece uma maneira integrada de separar componentes em um aplicativo em partes separadas de JavaScript com muito pouco trabalho braçal. Então você pode cuidar dos estados de carregamento ao acoplá-lo ao componente `Suspense`.

## Suspense

O problema de enviar uma grande carga útil de JavaScript para os usuários é o tempo que levaria para a página terminar de carregar, especialmente em dispositivos e conexões de rede mais fracos. É por isso que a divisão de código e o carregamento lento são extremamente úteis.

No entanto, sempre haverá um pequeno atraso pelo qual os usuários terão que passar quando um componente de divisão de código estiver sendo buscado pela rede, por isso é importante exibir um estado de carregamento útil. Usar `React.lazy` com o **`Suspense`** ajuda a resolver esse problema.

```jsx
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));

const renderLoader = () => <p>Loading</p>;

const DetailsComponent = () => (
  <Suspense fallback={renderLoader()}>
    <AvatarComponent />
  </Suspense>
)
```

`Suspense` aceita um `fallback` que permite exibir qualquer componente React como um estado de carregamento. O exemplo a seguir mostra como isso funciona. O avatar só é renderizado ao clicar no botão, no qual uma solicitação é feita para recuperar o código necessário para o `AvatarComponent` suspenso. Nesse ínterim, o componente de carregamento de fallback é mostrado.

{% Glitch { id: 'react-lazy-suspense', path: 'src/index.css', height: 480} %}

Aqui, o código que compõe o `AvatarComponent` é pequeno, por isso o botão giratório de carregamento só é exibido por um curto período de tempo. Componentes maiores podem demorar muito mais para carregar, especialmente em conexões de rede fracas.

Para demonstrar melhor como isso funciona:

{% Instruction 'preview' %} {% Instruction 'devtools-network' %}

- Clique na lista suspensa **Limitação** que é definida como **Sem limitação** por padrão. Selecione **3G rápido**.
- Clique no botão **Clique em mim** no aplicativo.

O indicador de carregamento será mostrado por mais tempo agora. Observe como todo o código que compõe o `AvatarComponent` é obtido como um bloco separado.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ga9IsnuJoJdnUfE6sGee.png", alt="Painel de rede DevTools mostrando um arquivo chunk.js sendo baixado", width="800", height="478" %}</figure>

{% Aside %} Atualmente, o React não oferece suporte ao Suspense quando os componentes estão sendo renderizados do lado do servidor. Se você estiver renderizando no servidor, considere o uso de outra biblioteca, como [`loadable-components`](https://www.smooth-code.com/open-source/loadable-components/docs/server-side-rendering/), recomendada na documentação do React. {% endAside %}

## Suspensão de vários componentes

Outro recurso do `Suspense` é que ele permite suspender o carregamento de vários componentes, **mesmo que sejam carregados lentamente**.

Por exemplo:

```jsx
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));
const InfoComponent = lazy(() => import('./InfoComponent'));
const MoreInfoComponent = lazy(() => import('./MoreInfoComponent'));

const renderLoader = () => <p>Loading</p>;

const DetailsComponent = () => (
  <Suspense fallback={renderLoader()}>
    <AvatarComponent />
    <InfoComponent />
    <MoreInfoComponent />
  </Suspense>
)
```

Esta é uma maneira extremamente útil de atrasar a renderização de vários componentes enquanto mostra apenas um único estado de carregamento. Uma vez que todos os componentes tenham terminado de buscar, o usuário pode ver todos eles exibidos ao mesmo tempo.

Você pode ver isso com a seguinte inserção:

{% Glitch { id: 'react-lazy-suspense-multiple', path: 'src/index.css', height: 480 } %}

{% Aside %} Indicador de carregamento mostrando um pouco rápido demais? Tente simular uma conexão limitada no DevTools novamente. {% endAside %}

Sem isso, é fácil enfrentar o problema de *carregamento escalonado* ou diferentes partes de uma IU sendo carregada uma após a outra, com cada uma tendo seu próprio indicador de carregamento. Isso pode tornar a experiência do usuário mais chocante.

{% Aside %} Embora o uso do Suspense para dividir componentes já seja possível e facilite a redução dos tamanhos dos pacotes, a equipe do React continua a trabalhar em mais recursos que expandiriam essa possibilidade ainda mais. O [roteiro do React 16.x](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html) explica isso com mais detalhes. {% endAside %}

## Lidar com falhas de carregamento

`Suspense` permite que você exiba um estado de carregamento temporário enquanto as solicitações de rede são feitas nos bastidores. Mas e se essas solicitações de rede falharem por algum motivo? Você pode estar off-line ou talvez seu aplicativo da web esteja tentando carregar lentamente uma [URL com controle de versão](/http-cache/#long-lived-caching-for-versioned-urls) desatualizada e indisponível após uma reimplantação do servidor.

O React tem um modelo padrão para lidar com esses tipos de falhas de carregamento: usar um limite de erro. Conforme descrito [na documentação](https://reactjs.org/docs/error-boundaries.html), qualquer componente do React pode servir como um limite de erro se implementar um (ou ambos) dos métodos de ciclo de vida: `static getDerivedStateFromError()` ou `componentDidCatch()`.

Para detectar e lidar com falhas de carregamento lento, você pode encapsular seu `Suspense` em um componente pai que serve como um limite de erro. Dentro do método `render()` do limite de erro, você pode renderizar os filhos como estão, se não houver erro, ou renderizar uma mensagem de erro personalizada, se algo der errado:

```js
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));
const InfoComponent = lazy(() => import('./InfoComponent'));
const MoreInfoComponent = lazy(() => import('./MoreInfoComponent'));

const renderLoader = () => <p>Loading</p>;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return <p>Loading failed! Please reload.</p>;
    }

    return this.props.children;
  }
}

const DetailsComponent = () => (
  <ErrorBoundary>
    <Suspense fallback={renderLoader()}>
      <AvatarComponent />
      <InfoComponent />
      <MoreInfoComponent />
    </Suspense>
  </ErrorBoundary>
)
```

## Conclusão

Se você não tiver certeza de onde começar a aplicar a divisão de código ao aplicativo React, siga estas etapas:

1. Comece no nível da rota. As rotas são a maneira mais simples de identificar pontos de sua aplicação que podem ser divididos. Os [documentos do React](https://reactjs.org/docs/code-splitting.html#route-based-code-splitting) mostram como o `Suspense` pode ser usado junto com o [`react-router`](https://github.com/ReactTraining/react-router).
2. Identifique quaisquer componentes grandes em uma página de seu site que são processados apenas em certas interações do usuário (como clicar em um botão). A divisão desses componentes minimizará suas cargas de JavaScript.
3. Considere dividir qualquer coisa que esteja fora da tela e não seja crítica para o usuário.
