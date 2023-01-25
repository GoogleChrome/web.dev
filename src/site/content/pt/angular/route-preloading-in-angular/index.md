---
layout: post
title: Estratégias de pré-carregamento de rota no Angular
subhead: |2

  Pré-carregue as rotas com antecedência para acelerar a navegação dos usuários.
hero: image/admin/q4b86k6REnNHkpjQnsLK.jpg
hero_position: bottom
alt: Bola de cristal de vidro
date: 2019-07-09
description: |2

  Aprenda a usar as estratégias de pré-carregamento do Angular para aplicativos mais rápidos.
authors:
  - mgechev
tags:
  - performance
feedback:
  - api
---

[A divisão de código no nível da rota](/route-level-code-splitting-in-angular) pode ajudar a reduzir o tempo de carregamento inicial de um aplicativo, atrasando o JavaScript associado a rotas que não sejam inicialmente necessárias. Dessa forma, o roteador Angular espera até que um usuário navegue para uma determinada rota antes de acionar uma solicitação de rede para baixar o JavaScript associado.

Embora essa técnica seja ótima para o carregamento inicial da página, ela pode tornar a navegação mais lenta, dependendo da latência da rede e da largura de banda dos usuários. Uma maneira de resolver esse problema é o **pré-carregamento da rota**. Usando o pré-carregamento, quando o usuário está em uma determinada rota, você pode baixar e armazenar em cache o JavaScript associado às rotas que provavelmente serão necessárias em seguida. O roteador Angular fornece essa funcionalidade pronta para uso.

Nesta postagem, você aprenderá como acelerar a navegação ao usar a divisão de código no nível da rota, aproveitando o pré-carregamento do JavaScript no Angular.

## Estratégias de pré-carregamento de rota no Angular

O roteador Angular fornece uma propriedade de configuração chamada `preloadingStrategy`, que define a lógica para pré-carregamento e processamento de módulos Angular carregados lentamente. Abordaremos duas estratégias possíveis:

- `PreloadAllModules`, que pré-carrega todas as rotas com carregamento lento, como o nome indica
- `QuicklinkStrategy`, que pré-carrega apenas as rotas associadas aos links na página atual.

*O restante desta postagem se refere a um exemplo de aplicativo Angular. Você pode encontrar o código-fonte [no GitHub](https://github.com/mgechev/route-preloading-web-dev).*

### Usando a estratégia `PreloadAllModules`

O aplicativo de amostra tem várias rotas de carregamento lento. Para pré-carregar todos eles usando a estratégia `PreloadAllModules` - que é integrada ao Angular - especifique-a como o valor da `preloadingStrategy` na configuração do roteador:

```js
import { RouterModule, PreloadAllModules } from '@angular/router';
// …

RouterModule.forRoot([
  …
], {
  preloadingStrategy: PreloadAllModules
})
// …
```

Agora sirva o aplicativo e observe o painel **Rede** no Chrome DevTools:

{% Instruction 'devtools-network', 'ol' %}

Você deve ver que o roteador baixou `nyan-nyan-module.js` e `about-about-module.js` em segundo plano ao abrir o aplicativo:

<figure data-size="full">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/TVi6LCasiwZI1hxJrBOL.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/e9h6JBVl8TUGMWOSAWyC.mp4"], controls="true", loop="true", muted="true" %} <figcaption> A estratégia PreloadAllModules em ação. </figcaption></figure>

O roteador também registrou as declarações de rota dos módulos para que, quando você navegar para um URL associado a qualquer um dos módulos pré-carregados, a transição seja instantânea.

### Usando a estratégia de pré-carregamento Quicklink

`PreloadAllModules` é útil em muitos casos. Quando você tem dezenas de módulos, no entanto, seu pré-carregamento agressivo pode realmente aumentar o uso da rede. Além disso, como o roteador precisa registrar as rotas em todos os módulos pré-carregados, isso pode causar cálculos intensivos no thread de IU e levar a uma experiência do usuário lenta.

A [biblioteca de link rápido](https://github.com/GoogleChromeLabs/quicklink) oferece uma estratégia melhor para aplicativos maiores. Ele usa a [API IntersectionObserver](/intersectionobserver-v2/) para pré-carregar apenas módulos associados a links que estiverem atualmente visíveis na página.

Você pode adicionar um link rápido para um aplicativo Angular usando o pacote [ngx-quicklink.](https://www.npmjs.com/package/ngx-quicklink) Comece instalando o pacote do npm:

```bash
npm install --save ngx-quicklink
```

Assim que estiver disponível em seu projeto, você pode usar `QuicklinkStrategy` especificando o roteador `preloadingStrategy` e importando o `QuicklinkModule` :

```js
import {QuicklinkStrategy, QuicklinkModule} from 'ngx-quicklink';
…

@NgModule({
  …
  imports: [
    …
    QuicklinkModule,
    RouterModule.forRoot([…], {
      preloadingStrategy: QuicklinkStrategy
    })
  ],
  …
})
export class AppModule {}
```

Agora, ao abrir o aplicativo novamente, você notará que o roteador pré-carrega apenas `nyan-nyan-module.js`, pois o botão no centro da página tem um link de roteador para ele. E ao abrir a navegação lateral, você perceberá que o roteador pré-carrega a rota "Sobre":

<figure data-size="full">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/dfZkoiQyNh4fUj4DJjrc.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/SkNp99W1Bv2tsaRgOwoe.mp4"], controls="true", loop="true", muted="true" %} <figcaption> Uma demonstração da estratégia de pré-carregamento quicklink. </figcaption></figure>

### Usando a estratégia de pré-carregamento Quicklink em vários módulos de carregamento lento

O exemplo acima funcionará para um aplicativo básico, mas se o seu aplicativo contiver vários módulos de carregamento lento, você precisará importar o `QuicklinkModule` para um módulo compartilhado, exportá-lo e depois importar o módulo compartilhado para os módulos de carregamento lento.

Primeiro importe o `QuicklinkModule` do `ngx-quicklink` para o seu módulo compartilhado e exporte-o:

```js
import { QuicklinkModule } from 'ngx-quicklink';
…

@NgModule({
  …
  imports: [
    QuicklinkModule
  ],
  exports: [
    QuicklinkModule
  ],
  …
})
export class SharedModule {}
```

Em seguida, importe seu `SharedModule` para todos os seus módulos carregados lentamente:

```js
import { SharedModule } from '@app/shared/shared.module';
…

@NgModule({
  …
  imports: [
      SharedModule
  ],
  …
});
```

Os `Quicklinks` agora estarão disponíveis em seus módulos carregados lentamente.

## Indo além do pré-carregamento básico

Embora o pré-carregamento seletivo via link rápido possa acelerar significativamente a navegação, você pode tornar sua estratégia de pré-carregamento ainda mais eficiente em rede usando o pré-carregamento preditivo, que é implementado por [Guess.js](https://github.com/guess-js/guess). Ao analisar um relatório do Google Analytics ou outro provedor de análise, Guess.js pode prever a jornada de navegação de um usuário e pré-carregar apenas os blocos de JavaScript que provavelmente serão necessários a seguir.

Você pode aprender como usar Guess.js com Angular [nesta página do site Guess.js](https://guess-js.github.io/docs/angular).

## Conclusão

Para acelerar a navegação ao usar a divisão de código no nível da rota:

1. Escolha a estratégia de pré-carregamento certa, dependendo do tamanho do seu aplicativo:
    - Aplicativos com poucos módulos podem usar a estratégia `PreloadAllModules`
    - Aplicativos com muitos módulos devem usar uma estratégia de pré-carregamento customizada, como o quicklink do Angular, ou pré-carregamento preditivo, conforme implementado no Guess.js.
2. Configure a estratégia de pré-carregamento definindo a `preloadStrategy` do roteador Angular.
