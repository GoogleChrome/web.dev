---
layout: post
title: Divisão de código de nível de rota no Angular
subhead: |2

  Melhore o desempenho do seu aplicativo usando a divisão de código no nível da rota!
hero: image/admin/WVwZbWEEXUfXzVTtAlha.jpg
date: 2019-06-24
description: |2

  Aprenda como tornar o pacote de aplicativos inicial menor usando a divisão de código no nível da rota.
authors:
  - mgechev
tags:
  - performance
feedback:
  - api
---

Esta postagem explica como configurar a [divisão de código](/reduce-javascript-payloads-with-code-splitting/) no nível da rota em um aplicativo Angular, o que pode reduzir o tamanho do pacote JavaScript e melhorar drasticamente o [tempo de interação](/tti/).

*Você pode encontrar os exemplos de código deste artigo no [GitHub](https://github.com/mgechev/code-splitting-web-dev). O exemplo de roteamento ansioso está disponível no [branch adiantado](https://github.com/mgechev/code-splitting-web-dev/tree/eager). O exemplo de divisão de código no nível da rota está no [branch lento](https://github.com/mgechev/code-splitting-web-dev/tree/lazy).*

{% Aside %} Esta publicação pressupõe que você conheça o roteador Angular. Para obter um guia sobre como usá-lo, visite a [documentação oficial](https://angular.io/guide/router) do Angular. {% endAside %}

## Por que a divisão de código é importante

A complexidade cada vez maior dos aplicativos da web levou a um aumento significativo na quantidade de JavaScript enviada aos usuários. Arquivos JavaScript grandes podem atrasar visivelmente a interatividade, portanto, pode ser um recurso caro, especialmente em dispositivos móveis.

A maneira mais eficiente de reduzir os pacotes JavaScript sem sacrificar os recursos de seus aplicativos é introduzir uma divisão de código agressiva.

A **[divisão de código](/reduce-javascript-payloads-with-code-splitting/)** permite dividir o JavaScript de seu aplicativo em vários blocos associados a diferentes rotas ou recursos. Essa abordagem apenas envia aos usuários o JavaScript de que precisam durante o carregamento inicial do aplicativo, mantendo o tempo de carregamento baixo.

{% Aside 'note' %}

Usando a divisão de código, o [Twitter e o Tinder](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4) observaram melhorias de até 50% em seu [tempo até ficar interativo](/tti/).

{% endAside %}

## Técnicas de divisão de código

A divisão de código pode ser feita em dois níveis: o **nível** do componente e o **nível** da rota.

- Na divisão de código em nível de componente, você move os componentes para seus próprios fragmentos de JavaScript e os carrega lentamente quando são necessários.
- Na divisão de código no nível da rota, você encapsula a funcionalidade de cada rota em um bloco separado. Quando os usuários navegam em seu aplicativo, eles buscam os blocos associados às rotas individuais e obtêm a funcionalidade associada quando precisam.

Esta publicação se concentra na configuração da divisão de nível de rota no Angular.

### Aplicativo de amostra

Antes de nos aprofundarmos em como usar a divisão de código de nível de rota no Angular, vamos dar uma olhada em um aplicativo de amostra:

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">{% IFrame { src: 'https://stackblitz.com/github/mgechev/code-splitting-web-dev/tree/eager?embed=1&amp;file=src/app/app.component.ts&amp;view=preview' } %}</div>

Confira a implementação dos módulos do app. Dentro do `AppModule` duas rotas são definidas: a rota padrão associada a `HomeComponent` e uma `nyan` associada a `NyanComponent`:

```javascript
@NgModule({
  ...
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'nyan',
        component: NyanComponent
      }
    ])
  ],
  ...
})
export class AppModule {}
```

### Divisão de código no nível da rota

Para configurar a divisão de código, a `nyan` adiantada precisa ser refatorada.

A versão 8.1.0 do Angular CLI pode fazer tudo por você com este comando:

```bash
ng g module nyan --module app --route nyan
```

Isso irá gerar:

- Um novo módulo de roteamento chamado `NyanModule`
- Uma rota em `AppModule` chamada `nyan` que irá carregar dinamicamente o `NyanModule`
- Uma rota padrão no `NyanModule`
- Um componente chamado `NyanComponent` que será renderizado quando o usuário atingir a rota padrão

Vamos estudar essas etapas manualmente para entender melhor a implementação da divisão de código com o Angular!

Quando o usuário navegar para a `nyan` , o roteador renderizará o `NyanComponent` na saída do roteador.

Para usar a divisão de código no nível da rota em Angular, defina a `loadChildren` da declaração de rota e combine-a com uma importação dinâmica:

```javascript/2
{
  path: 'nyan',
  loadChildren: () => import('./nyan/nyan.module').then(m => m.NyanModule)
}
```

Existem duas diferenças principais em relação à rota adiantada:

1. Você define `loadChildren` vez de `component` . Ao usar a divisão de código de nível de rota, você precisa apontar para módulos carregados dinamicamente, em vez de componentes.
2. Em `loadChildren` , assim que a promessa for resolvida, você retorna o `NyanModule` vez de apontar para o `NyanComponent`.

O snippet acima especifica que quando o usuário navega para `nyan`, o Angular deve carregar dinamicamente `nyan.module` do `nyan` e renderizar o componente associado à rota padrão declarada no módulo.

Você pode associar a rota padrão a um componente usando esta declaração:

```javascript
import { NgModule } from '@angular/core';
import { NyanComponent } from './nyan.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NyanComponent],
  imports: [
    RouterModule.forChild([{
      path: '',
      pathMatch: 'full',
      component: NyanComponent
    }])
  ]
})
export class NyanModule {}
```

Este código renderiza `NyanComponent` quando o usuário navega para `https://example.com/nyan`.

Para verificar se o roteador Angular baixa o `nyan.module` em seu ambiente local:

{% Instruction 'devtools-network', 'ol' %}

1. Clique **em NYAN** no aplicativo de amostra.
2. Observe que o `nyan-nyan-module.js` aparece na guia de rede.

{% Img src="image/admin/wT4xLV2OkrZ2b7QaQz8L.png", alt="Carregamento lento de pacotes JavaScript com divisão de código em nível de rota", width="800", height="524" %}

*Encontre este exemplo [no GitHub](https://github.com/mgechev/code-splitting-web-dev/tree/lazy/src) .*

### Mostrar um spinner

Agora, quando o usuário clica no **botão NYAN** , o aplicativo não indica que está carregando o JavaScript em segundo plano. Para dar feedback ao usuário enquanto carrega o script, você provavelmente vai querer adicionar um spinner.

Para fazer isso, comece adicionando marcação para o indicador dentro do elemento `router-outlet` no `app.component.html`:

```html
<router-outlet>
  <span class="loader" *ngIf="loading"></span>
</router-outlet>
```

Em seguida, adicione uma `AppComponent` para lidar com eventos de roteamento. Esta classe definirá o sinalizador de `loading` `true` quando ouvir o `RouteConfigLoadStart` e definirá o sinalizador como `false` quando ouvir o evento `RouteConfigLoadEnd`.

```javascript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading: boolean;
  constructor(router: Router) {
    this.loading = false;
    router.events.subscribe(
      (event: RouterEvent): void => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (event instanceof NavigationEnd) {
          this.loading = false;
        }
      }
    );
  }
}
```

No exemplo abaixo, introduzimos uma latência artificial de 500 ms para que você possa ver o botão giratório em ação.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">{% IFrame { src: 'https://stackblitz.com/github/mgechev/code-splitting-web-dev/tree/lazy?embed=1&amp;file=src/app/app.component.ts&amp;view=preview' } %}</div>

{% Aside 'warning' %} A divisão de código pode melhorar significativamente o tempo de carregamento inicial de um aplicativo, mas vem ao custo de desacelerar a navegação subsequente. No [próximo post](/route-preloading-in-angular) sobre pré-carregamento de rota, você verá como contornar este problema! {% endAside %}

## Conclusão

Você pode reduzir o tamanho do pacote de seus aplicativos angulares aplicando a divisão de código no nível da rota:

1. Use o gerador de módulo de carregamento lento de CLI Angular para criar um andaime automático de uma rota carregada dinamicamente.
2. Adicione um indicador de carregamento quando o usuário navegar para uma rota preguiçosa para mostrar que há uma ação em andamento.
