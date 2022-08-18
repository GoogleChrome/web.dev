---
title: Otimize a First Input Delay
subhead: Como responder mais rápido às interações do usuário.
authors:
  - houssein
  - addyosmani
date: 2020-05-05
updated: 2022-07-18
hero: image/admin/WH0KlcJXJlxvsxU9ow2i.jpg
alt: Uma mão tocando a tela de um smartphone
description: A métrica First Input Delay (FID) mede o tempo a partir do momento em que um usuário interage pela primeira vez com o seu site até o momento em que o navegador é capaz de responder a essa interação. Saiba como otimizar a FID minimizando o JavaScript não utilizado, dividindo tarefas longas e melhorando a interação e prontidão.
tags:
  - blog
  - performance
  - web-vitals
---

<blockquote>
  <p>Cliquei, mas não aconteceu nada! Por que não consigo interagir com esta página? 😢</p>
</blockquote>

A [First Contentful Paint](/fcp/) - FCP (primeira renderização de conteúdo) e a [Largest Contentful Paint](/lcp/) - LCP (maior renderização de conteúdo) são métricas que medem o tempo que leva para o conteúdo ser visualmente renderizado (pintado) numa página. Embora seja importante, o tempo de renderização não captura a *responsividade do carregamento*, ou seja, a rapidez com que uma página responde à interação do usuário.

A [First Input Delay](/fid/) - FID (atraso da primeira entrada) é uma métrica [Core Web Vitals](/vitals/) que captura a primeira impressão de um usuário sobre a interatividade e capacidade de resposta de um site. Ela mede o tempo desde quando um usuário interage pela primeira vez com uma página até o momento em que o navegador é finalmente capaz de responder a essa interação. A FID é uma [métrica de campo](/user-centric-performance-metrics/#in-the-field) e não pode ser simulada em ambiente de laboratório. **É necessária uma interação real do usuário** para medir o atraso da resposta.

  <picture>
    <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eXyvkqRHQZ5iG38Axh1Z.svg" | imgix }}" media="(min-width: 640px)">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Se4TiXIdp8jtLJVScWed.svg", alt="Bons valores de fid são 2,5 segundos, valores fracos são maiores que 4,0 segundos e qualquer coisa entre precisa de melhorias", width="384", height="96" %}
  </picture>

Para ajudar a prever a FID no [laboratório](/how-to-measure-speed/#lab-data-vs-field-data) , recomendamos a métrica [Total Blocking Time - TBT (tempo total de bloqueio)](/tbt/). Elas medem coisas diferentes, mas melhorias na TBT geralmente correspondem a melhorias na FID.

A principal causa de uma FID ruim é **a execução pesada de JavaScript**. Otimizar como o JavaScript processa, compila e executa na sua página web reduzirá diretamente a FID.

## Execução pesada de JavaScript

O navegador não pode responder à maioria das entradas do usuário enquanto executa o JavaScript na thread principal. Em outras palavras, o navegador não pode responder às interações do usuário enquanto a thread principal está ocupada. Para melhorar isto:

- [Divida Tarefas Longas](#long-tasks)
- [Otimize sua página para a prontidão de interação](#optimize-interaction-readiness)
- [Use um web worker](#use-a-web-worker)
- [Reduza o tempo de execução do JavaScript](#reduce-javascript-execution)

## Divida tarefas longas {:#long-tasks}

Se você já tentou reduzir a quantidade de JavaScript que carrega numa única página, pode ser útil dividir o código de longa execução em **tarefas assíncronas menores** .

[**Tarefas Longas**](/custom-metrics/#long-tasks-api) são aqueles períodos de execução de JavaScript onde os usuários podem perceber que sua interface não responde. Qualquer pedaço de código que bloqueie a thread principal por 50 ms ou mais pode ser caracterizado como uma Tarefa Longa. Tarefas Longas são um sinal de potencial inchaço do JavaScript (carregar e executar mais do que o usuário pode precisar naquele instante). A divisão das tarefas longas poderá reduzir o atraso de entrada no seu site.

<figure>
  {% Img src="image/admin/THLKu0sOPhSghNr0XkP1.png", alt="Tarefas Longas em Chrome DevTools", width="800", height="132" %}
  <figcaption>Chrome DevTools <a href="https://developers.google.com/web/updates/2020/03/devtools#long-tasks">visualiza tarefas longas</a> no painel Performance</figcaption>
</figure>

A FID deve melhorar visivelmente à medida que você adota práticas recomendadas, como divisão de código e divisão de tarefas longas. Embora a TBT não seja uma métrica de campo, é útil para verificar o progresso no sentido de melhorar a Time to Interactive - TTI (tempo até interatividade) e a FID.

{% Aside %} Para mais informações, dê uma olhada em [Tarefas longas de JavaScript estão atrasando seu Time to Interactive?](/long-tasks-devtools/). {% endAside %}

## Otimize sua página para a prontidão de interação

Existem várias causas comuns para pontuações baixas de FID e TBT em aplicativos web que dependem fortemente de JavaScript:

### A execução do scripts primários pode atrasar a prontidão para a interação

- O inchaço do tamanho do JavaScript, tempos de execução pesados e fragmentação ineficiente podem atrasar o momento em que uma página esteja pronta a receber à entrada do usuário e impactar a FID, a TBT e a TTI. O carregamento progressivo de código e de recursos pode ajudar a distribuir esse trabalho e melhorar a prontidão para a interação.
- Aplicações renderizadas do lado do servidor podem parecer que estão renderizando pixels na tela rapidamente, mas preste atenção às interações do usuário que são bloqueadas por demoradas execuções de scripts (por exemplo, a reidratação para conectar listeners de eventos). Isto pode demorar várias centenas de milissegundos e às vezes até segundos, se a divisão de código baseada em rota estiver sendo usada. Considere transferir mais lógica para o lado do servidor ou gerar mais conteúdo estaticamente durante o tempo de build.

Abaixo estão as pontuações de TBT antes e depois de otimizar o carregamento do script original para uma aplicação. Ao transferir o carregamento (e execução) de scripts caros de um componente não essencial para fora do seu caminho crítico, os usuários foram capazes de interagir com a página muito mais cedo.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TEIbBnIAyfzIoQtvXvMk.png", alt="Melhorias na pontuação de TBT no Lighthouse depois de otimizar um script primário.", width="800", height="148" %}

### A transferência de dados pode afetar diversos aspectos da prontidão da interação

- Esperar por uma sequência de transferências em cascata (por exemplo, JavaScript e transferências de dados para componentes) pode impactar a latência da interação. Procure depender menos de dados baixados em cascata.
- Grandes datastores inline podem aumentar o tempo de processamento do HTML e impactar nas métricas de renderização e interação. Procure minimizar a quantidade de dados que precisam ser pós-processados no lado do cliente.

### A execução de scripts de terceiros também pode atrasar a latência de interação

- Muitos sites incluem tags e análises de terceiros que podem manter a rede ocupada e fazer com que a thread principal pare de responder periodicamente, afetando a latência de interação. Experimente o carregamento sob demanda de código de terceiros (por exemplo, talvez você não carregue os anúncios abaixo da dobra até que eles rolem para mais perto da janela de visualização).
- Em alguns casos, os scripts de terceiros podem se antecipar aos originais em termos de prioridade e largura de banda na thread principal, também atrasando o tempo de prontidão de uma página para interações. Tente priorizar o carregamento do que você acredita que oferece o maior valor para os usuários.

## Use um web worker

Uma thread principal bloqueada é uma das principais causas do atraso de entrada. Os [Web workers](https://developer.mozilla.org/docs/Web/API/Worker) possibilitam a execução de JavaScript numa thread em segundo plano. Mover operações não relacionadas à interface do usuário para uma thread de trabalho separada pode reduzir o tempo de bloqueio da thread principal e, conseqüentemente, melhorar a FID.

Considere o uso das seguintes bibliotecas para facilitar o uso de web workers em seu site:

- [Comlink](https://github.com/GoogleChromeLabs/comlink) : uma biblioteca auxiliar que abstrai o `postMessage` e o torna mais fácil de usar
- [Workway](https://github.com/WebReflection/workway) : Um exportador de web workers de propósito geral
- [Workerize](https://github.com/developit/workerize) : Mova um módulo para um web worker

{% Aside %} Para saber mais sobre como os web workers podem executar código fora da thread principal, consulte [Use Web Workers para executar JavaScript fora da thread principal do navegador](/off-main-thread/) . {% endAside %}

### Reduza o tempo de execução do JavaScript {:#reduce-javascript-execution}

Limitar a quantidade de JavaScript em sua página reduz a quantidade de tempo que o navegador precisa para executar o código JavaScript. Isto acelera a rapidez com que o navegador pode começar a responder a qualquer interação do usuário.

Para reduzir a quantidade de JavaScript executado em sua página:

- Adie o JavaScript não utilizado
- Minimize polyfills não utilizados

#### Adie o JavaScript não utilizado

Por default, todo JavaScript bloqueia a renderização. Quando o navegador encontra uma tag de script que vincula a um arquivo JavaScript externo, ele deve pausar o que está fazendo e fazer o download, processar, compilar e executar esse JavaScript. Portanto, você só deve carregar o código necessário para a página ou para responder à entrada do usuário.

A aba [Coverage](https://developer.chrome.com/docs/devtools/coverage/) no Chrome DevTools pode informar quanto JavaScript não está sendo usado na sua página da web.

{% Img src="image/admin/UNEigFiwsGu48rtXMZM4.png", alt="A aba Coverage.", width="800", height="559" %}

Para reduzir o JavaScript não utilizado:

- Divida o código do seu pacote em vários pedaços
- Adie qualquer JavaScript não crítico, incluindo scripts de terceiros, usando `async` ou `defer`

**A divisão de código** é o conceito de dividir um único grande pacote JavaScript em pedaços menores que possam ser carregados condicionalmente (também conhecido como lazy-loading). [A maioria dos navegadores mais recentes suportam a sintaxe de importação dinâmica](https://caniuse.com/#feat=es6-module-dynamic-import), que permite baixar módulos sob demanda:

```js
import('module.js').then((module) => {
  // Do something with the module.
});
```

A importação dinâmica de JavaScript em certas interações do usuário (como alterar uma rota ou exibir um modal) garantirá que código que não é usado para o carregamento inicial da página seja baixado apenas quando necessário.

Além do suporte geral do navegador, a sintaxe de importação dinâmica pode ser usada em diversos sistemas de build diferentes.

- Se você usar [webpack](https://webpack.js.org/guides/code-splitting/) , [Rollup](https://medium.com/rollup/rollup-now-has-code-splitting-and-we-need-your-help-46defd901c82) ou [Parcel](https://parceljs.org/code_splitting.html) como um empacotador de módulos, aproveite o suporte a importação dinâmica.
- Frameworks lado-cliente, como [React](https://reactjs.org/docs/code-splitting.html#reactlazy) , [Angular](https://angular.io/guide/lazy-loading-ngmodules) e [Vue](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components) fornecem abstrações para facilitar o carregamento lazy no nível do componente.

{% Aside %} Dê uma olhada em [Reduza payloads do JavaScript com divisão de código](/reduce-javascript-payloads-with-code-splitting/) para saber mais sobre divisão de código. {% endAside %}

Além da divisão de código, sempre use [async ou defer](https://javascript.info/script-async-defer) para scripts que não são necessários para conteúdo crítico ou conteúdo acima da dobra.

```html
<script defer src="…"></script>
<script async src="…"></script>
```

A menos que haja um motivo específico para não fazê-lo, todos os scripts de terceiros devem ser carregados com `defer` ou `async` por default.

#### Minimize polyfills não utilizados

Se você cria seu código usando sintaxe JavaScript moderna e fizer referência a APIs de navegadores modernos, será necessário transpilá-lo e incluir polyfills para que funcione em navegadores mais antigos.

Uma das principais preocupações de desempenho ao incluir polyfills e código transpilado em seu site é que os navegadores mais novos não devem fazer o download se não precisarem. Para reduzir o tamanho do JavaScript do seu aplicativo, minimize os polyfills não usados tanto quanto possível e restrinja seu uso aos ambientes onde são necessários.

Para otimizar o uso de polyfills em seu site:

- Se você usar o [Babel](https://babeljs.io/docs/en/index.html) como um transpilador, use [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env) para incluir apenas os polyfills necessários para os navegadores que você planeja suportar. Para o Babel 7.9, ative a opção [`bugfixes`](https://babeljs.io/docs/en/babel-preset-env#bugfixes) para reduzir ainda mais os polyfills desnecessários

- Use o padrão module/nomodule para fornecer dois pacotes separados (`@babel/preset-env` também suporta isso via [`target.esmodules`](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules))

    ```html
    <script type="module" src="modern.js"></script>
    <script nomodule src="legacy.js" defer></script>
    ```

    Muitos recursos mais recentes do ECMAScript compilados com Babel já são suportados em ambientes que suportam módulos JavaScript. Assim, ao fazer isso, você simplifica o processo de garantir que apenas o código transpilado seja usado para navegadores que realmente precisam dele.

{% Aside %} O guia [Servindo código moderno a navegadores modernos para um carregamento de página mais rápido](/serve-modern-code-to-modern-browsers/) apresente esse tópico em mais detalhes. {% endAside %}

## Ferramentas de desenvolvimento

Uma série de ferramentas estão disponíveis para medir e depurar a FID:

- O [Lighthouse 6.0](https://developer.chrome.com/docs/lighthouse/overview/) não inclui suporte para FID, já que é uma métrica de campo. No entanto, o [Total Blocking Time](/tbt/) (TBT) pode ser usado como proxy. As otimizações que melhoram a TBT também devem melhorar a FID em campo.

    {% Img src="image/admin/FRM9kHWmsDv9dddGMgwu.jpg", alt="Lighthouse 6.0.", width="800", height="309" %}

- O [Relatório de Experiência do Usuário Chrome](https://developer.chrome.com/docs/crux/) fornece valores de FID do mundo real agregados no nível de origem

*Com agradecimentos a Philip Walton, Kayce Basques, Ilya Grigorik e Annie Sullivan por suas avaliações.*
