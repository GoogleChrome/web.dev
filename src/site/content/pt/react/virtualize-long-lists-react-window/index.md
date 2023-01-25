---
layout: post
title: Virtualize grandes listas com janela de reação
subhead: |2

  Tabelas e listas muito grandes podem reduzir significativamente o desempenho do seu site. A virtualização pode ajudar!
hero: image/admin/CVkKShuaQw4CfZBg3Eub.jpg
date: 2019-04-29
description: |2

  react-window é uma biblioteca que permite que grandes listas sejam renderizadas com eficiência.
authors:
  - houssein
  - developit
feedback:
  - api
---

O [`react-window`](https://react-window.now.sh/#/examples/list/fixed-size) é uma biblioteca que permite que grandes listas sejam renderizadas com eficiência.

Aqui está um exemplo de uma lista que contém 1000 linhas sendo renderizadas com `react-window`. Tente rolar o mais rápido que puder.

{% Glitch { id: 'react-window-fixed', path: 'src/App.js', height: 750 } %}

## Por que isto é útil?

Pode haver momentos em que você precise exibir uma grande tabela ou lista que contém muitas linhas. Carregar todos os itens dessa lista pode afetar o desempenho de maneira significativa.

A**virtualização de lista**, ou "janelamento", é o conceito de apenas renderizar o que é visível para o usuário. O número de elementos renderizados a princípio é um subconjunto muito pequeno de toda a lista e a "janela" de conteúdo visível *se move* quando o usuário continua a rolar. Isso melhora o desempenho de renderização e rolagem da lista.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aWscOPGSFKVAIkgnUplQ.jpg", alt="Janela de conteúdo em uma lista virtualizada", width="578", height="525" %} <figcaption> Mover "janela" de conteúdo em uma lista virtualizada </figcaption></figure>

Os nós DOM que saem da "janela" são reciclados ou imediatamente substituídos por elementos mais novos conforme o usuário rola a lista para baixo. Isso mantém o número de todos os elementos renderizados específicos para o tamanho da janela.

## react-window

O `react-window` é uma pequena biblioteca de terceiros que torna mais fácil criar listas virtualizadas em seu aplicativo. Ele fornece várias APIs básicas que podem ser usadas para diferentes tipos de listas e tabelas.

### Quando usar listas de tamanho fixo

Use o `FixedSizeList` se você tiver uma lista longa e unidimensional de itens de tamanhos iguais.

```jsx
import React from 'react';
import { FixedSizeList } from 'react-window';

const items = [...] // some list of items

const Row = ({ index, style }) => (
  <div style={style}>
     {/* define the row component using items[index] */}
  </div>
);

const ListComponent = () => (
  <FixedSizeList
    height={500}
    width={500}
    itemSize={120}
    itemCount={items.length}
  >
    {Row}
  </FixedSizeList>
);

export default ListComponent;
```

- O componente `FixedSizeList` aceita uma propriedade `height`, `width` e `itemSize` para controlar o tamanho dos itens na lista.
- Uma função que renderiza as linhas é passada como filho para `FixedSizeList`. Detalhes sobre o item específico podem ser acessados com o argumento de `index` (`items[index]`).
- Um `style` também é passado para o método de renderização de linha que **deve** ser anexado ao elemento da linha. Os itens da lista são absolutamente posicionados com seus valores de altura e largura atribuídos sequencialmente, e o parâmetro `style` é responsável por isso.

{% Aside 'caution' %} Não atribua propriedades `height` e `width` à lista ou ao item da lista com um arquivo CSS externo. Eles seriam ignorados devido ao fato de que esses atributos de estilo são aplicados em linha. {% endAside %}

O exemplo de Glitch mostrado anteriormente neste artigo mostra um exemplo de um componente `FixedSizeList`

### Quando usar listas de tamanhos variáveis

Use o `VariableSizeList` para renderizar uma lista de itens que possuem tamanhos diferentes. Este componente funciona da mesma maneira que uma lista de tamanho fixo, mas em vez disso espera uma função para a propriedade `itemSize` vez de um valor específico.

```jsx
import React from 'react';
import { VariableSizeList } from 'react-window';

const items = [...] // some list of items

const Row = ({ index, style }) => (
  <div style={style}>
     {/* define the row component using items[index] */}
  </div>
);

const getItemSize = index => {
  // return a size for items[index]
}

const ListComponent = () => (
  <VariableSizeList
    height={500}
    width={500}
    itemCount={items.length}
    itemSize={getItemSize}
  >
    {Row}
  </VariableSizeList>
);

export default ListComponent;
```

A incorporação a seguir mostra um exemplo desse componente.

{% Glitch { id: 'react-window-variable', path: 'src/ListComponent.js', height: 750 } %}

A função de tamanho do item passada para a propriedade `itemSize` randomiza as alturas das linhas neste exemplo. Em um aplicativo real, entretanto, deve haver uma lógica real definindo os tamanhos de cada item. Idealmente, esses tamanhos devem ser calculados com base em dados ou obtidos de uma API.

{% Aside %} Ambos os `FixedSizeList` e `VariableSizeList` suportam listas horizontais usando uma propriedade `layout="horizontal"`. Dê uma olhada na [documentação](https://react-window.now.sh/#/examples/list/fixed-size) para ver um exemplo. {% endAside %}

### Grades

O `react-window` também fornece suporte para virtualizar listas multidimensionais ou grades. Nesse contexto, a "janela" de conteúdo visível muda conforme o usuário rola horizontal **e** verticalmente.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1j2qoGW8bFzBNiOzaJKZ.jpg", alt="Mover janela de conteúdo em uma grade virtualizada é bidimensional", width="739", height="516" %} <figcaption> Mover "janela" de conteúdo em uma grade virtualizada é bidimensional </figcaption></figure>

Da mesma forma, os `FixedSizeGrid` e `VariableSizeGrid` podem ser usados dependendo se o tamanho de itens de lista específicos pode variar.

- Para `FixedSizeGrid`, a API é quase a mesma, mas com o fato de que alturas, larguras e contagens de itens precisam ser representadas para colunas e linhas.
- Para `VariableSizeGrid`, as larguras das colunas e as alturas das linhas podem ser alteradas passando funções em vez de valores para suas respectivas propriedades.

Dê uma olhada na [documentação](https://react-window.now.sh/#/examples/grid/fixed-size) para ver exemplos de grades virtualizadas.

{% Aside %} Além de fornecer os componentes básicos para criar listas e grades eficientes, a `react-window` também fornece outros recursos, como rolar para um item específico ou fornecer um indicador quando o usuário está rolando. A [documentação](https://react-window.now.sh/#/examples/list/scrolling-indicators) fornece exemplos para isso. {% endAside %}

## Carregamento lento na rolagem

Muitos sites melhoram o desempenho esperando para carregar e renderizar itens em uma longa lista até que o usuário role para baixo. Essa técnica, geralmente conhecida como "carregamento infinito", adiciona novos nós DOM à lista conforme o usuário rola para além de um determinado limite próximo ao final. Embora isso seja melhor do que carregar todos os itens em uma lista de uma vez, ele ainda acaba preenchendo o DOM com milhares de entradas de linha se o usuário tiver passado dessa quantidade. Isso pode levar a um tamanho de DOM excessivamente grande, que começa a afetar o desempenho ao fazer cálculos de estilo e mutações de DOM mais lentos.

O diagrama a seguir pode ajudar a resumir isso:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dKuKVjP02xWxO9LPoOuc.jpg", alt="Diferença na rolagem entre uma lista normal e virtualizada", width="800", height="531" %} <figcaption> Diferença na rolagem entre uma lista normal e virtualizada </figcaption></figure>

A melhor abordagem para resolver esse problema é continuar a usar uma biblioteca como a `react-window` para manter uma pequena "janela" de elementos em uma página, mas também para carregar lentamente as entradas mais recentes conforme o usuário rola para baixo. Um pacote separado, `react-window-infinite-loader`, torna isso possível com `react-window`.

Considere o seguinte trecho de código, que mostra um exemplo de estado gerenciado em um componente de `App`

```jsx
import React, { Component } from 'react';

import ListComponent from './ListComponent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [], // instantiate initial list here
      moreItemsLoading: false,
      hasNextPage: true
    };

    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
   // method to fetch newer entries for the list
  }

  render() {
    const { items, moreItemsLoading, hasNextPage } = this.state;

    return (
      <ListComponent
        items={items}
        moreItemsLoading={moreItemsLoading}
        loadMore={this.loadMore}
        hasNextPage={hasNextPage}
      />
    );
  }
}

export default App;
```

Um método `loadMore` é passado para um `ListComponent` filho que contém a lista de carregadores infinita. Isso é importante porque o carregador infinito precisa disparar um retorno de chamada para carregar mais itens, uma vez que o usuário tenha passado de um determinado ponto.

Veja aqui como o `ListComponent` que renderiza a lista pode se parecer:

```jsx
import React from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from "react-window-infinite-loader";

const ListComponent = ({ items, moreItemsLoading, loadMore, hasNextPage }) => {
  const Row = ({ index, style }) => (
     {/* define the row component using items[index] */}
  );

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  return (
    <InfiniteLoader
      isItemLoaded={index => index < items.length}
      itemCount={itemCount}
      loadMoreItems={loadMore}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={500}
          width={500}
          itemCount={itemCount}
          itemSize={120}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {Row}
        </FixedSizeList>
      )}
  </InfiniteLoader>
  )
};

export default ListComponent;
```

Aqui, o componente `FixedSizeList` está envolto no `InfiniteLoader`. As propriedades atribuídas ao carregador são:

- `isItemLoaded` : método que verifica se um determinado item foi carregado
- `itemCount` : número de itens na lista (ou esperado)
- `loadMoreItems` : retorno de chamada que retorna uma promessa que resolve dados adicionais para a lista

Uma [propriedade de renderização](https://reactjs.org/docs/render-props.html#using-props-other-than-render) é usada para retornar uma função que o componente de lista usa para renderizar. Tanto os atributos `onItemsRendered` como `ref` são atributos que precisam ser transmitidos.

A seguir está um exemplo de como o carregamento infinito pode funcionar com uma lista virtualizada.

{% Glitch { id: 'react-window-infinite', path: 'src/ListComponent.js', height: 750 } %}

Rolar para baixo na lista pode parecer o mesmo, mas agora é feita uma solicitação para recuperar 10 usuários de uma [API de usuário aleatório](https://randomuser.me/) toda vez que você rola para perto do final da lista. Isso tudo é feito enquanto apenas renderiza uma única "janela" de resultados de cada vez.

Ao verificar o `index` de um determinado item, um estado de carregamento diferente pode ser mostrado para um item, dependendo se uma solicitação foi feita para entradas mais recentes e o item ainda está sendo carregado.

Por exemplo:

```js
const Row = ({ index, style }) => {
  const itemLoading = index === items.length;

  if (itemLoading) {
      // return loading state
  } else {
      // return item
  }
};
```

## Varreduras em excesso

Como os itens em uma lista virtualizada só mudam quando o usuário faz a rolagem, o espaço em branco pode piscar brevemente à medida que novas entradas estão prestes a serem exibidas. Você pode tentar rolar rapidamente qualquer um dos exemplos anteriores neste guia para perceber isso.

Para melhorar a experiência do usuário em listas virtualizadas, o `react-window` permite que você faça uma varredura excessiva de itens com a propriedade `overscanCount`. Isso permite que você defina quantos itens fora da "janela" visível para renderizar a todo momento.

```jsx
<FixedSizeList
  //...
  overscanCount={4}
>
  {...}
</FixedSizeList>
```

O `overscanCount` funciona tanto para os `FixedSizeList` como `VariableSizeList` e tem um valor padrão de 1. Dependendo do tamanho de uma lista e do tamanho de cada item, a varredura excessiva de mais de uma entrada pode ajudar a evitar um flash perceptível de espaço vazio quando o o usuário rola. No entanto, a varredura excessiva de muitas entradas pode afetar negativamente o desempenho. O objetivo de usar uma lista virtualizada é minimizar o número de entradas para o que o usuário possa ver a qualquer momento, então tente manter o número de itens varridos em excesso o mais baixo possível.

Para `FixedSizeGrid` e `VariableSizeGrid`, utilize o `overscanColumnsCount` e propriedades `overscanRowsCount` para controlar o número de colunas e linhas para a varredura excessiva respectivamente.

## Conclusão

Se você não tiver certeza de onde começar a virtualizar listas e tabelas em seu aplicativo, siga estas etapas:

1. Avalie o desempenho de renderização e rolagem. Este [artigo](https://addyosmani.com/blog/react-window/) mostra como o [medidor FPS](https://developer.chrome.com/docs/devtools/evaluate-performance/#analyze_frames_per_second) no Chrome DevTools pode ser usado para explorar a eficiência com que os itens são renderizados em uma lista.
2. Inclua `react-window` para quaisquer listas longas ou grades que estão afetando o desempenho.
3. Se houver certos recursos não suportados na `react-window`, considere usar o [`react-virtualized`](https://github.com/bvaughn/react-virtualized) se você não puder adicionar essa funcionalidade sozinho.
4. Faça sua lista virtualizada com `react-window-infinite-loader` se você precisar carregar itens lentamente enquanto o usuário rola a tela.
5. Use a propriedade `overscanCount` para suas listas e as propriedades `overscanColumnsCount` e `overscanRowsCount` para suas grades para evitar um flash de conteúdo vazio. Não explore muitas entradas, pois isso afetará negativamente o desempenho.
