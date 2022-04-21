---
title: Acesse recursos modernos de GPU com WebGPU
subhead: |2-

  WebGPU permite gráficos 3D de alto desempenho e computação paralela de dados

  da web.
authors:
  - beaufortfrancois
  - cwallez
date: 2021-08-26
updated: 2021-11-24
hero: image/vvhSqZboQoZZN9wBvoXq72wzGAf1/SN6GIsxmcINXJZKszOTr.jpeg
thumbnail: image/vvhSqZboQoZZN9wBvoXq72wzGAf1/SN6GIsxmcINXJZKszOTr.jpeg
description: |2-

  WebGPU permite gráficos 3D de alto desempenho e computação paralela de dados

  da web.
origin_trial:
  url: "https://developer.chrome.com/origintrials/#/view_trial/118219490218475521"
tags:
  - blog
  - capabilities
  - games
feedback:
  - api
stack_overflow_tag: webgpu
---

## O que é WebGPU? {: #what }

[WebGPU](https://gpuweb.github.io/gpuweb/) é uma nova API da web que expõe recursos gráficos de computador modernos, especificamente Direct3D 12, Metal e Vulkan, para realizar operações de renderização e computação em uma unidade de processamento gráfico (GPU).

<figure>{% Img src = "image/vvhSqZboQoZZN9wBvoXq72wzGAf1/WHoJmX2IU7roV4iabH6M.png", alt = "Diagrama de arquitetura mostrando a conexão WebGPUs entre APIs do SO e Direct3D 12, Metal e Vulkan.", width="800", height="313" %} <figcaption> Diagrama da arquitetura WebGPU</figcaption></figure>

Esse objetivo é semelhante à [família WebGL](https://developer.mozilla.org/docs/Web/API/WebGL_API) de APIs, mas o WebGPU permite o acesso a recursos mais avançados de GPUs. Considerando que WebGL é principalmente para desenhar imagens, mas pode ser reaproveitado com grande esforço para outros tipos de cálculos, WebGPU fornece suporte de primeira classe para realizar cálculos gerais na GPU.

Após quatro anos de desenvolvimento no [grupo da comunidade "GPU para a Web"](https://www.w3.org/community/gpu/) do W3C, o WebGPU está agora pronto para que os desenvolvedores experimentem o Chrome e forneçam feedback sobre a API e a linguagem de sombreamento.

{% Blockquote 'Mr.doob, Creator of Three.js' %} "Após uma década de WebGL trazendo gráficos 3D para a web e permitindo todos os tipos de novas experiências, agora é hora de atualizar a pilha e ajudar os desenvolvedores da web a tirar o máximo proveito das placas gráficas modernas. WebGPU chega bem na hora!" {% endBlockquote %}

{% Blockquote 'David Catuhe, Creator of Babylon.js' %} WebGPU nos deixa mais perto do metal e também revela o poder do sombreamento de computação para desenvolvedores da Web. Novas experiências 3D podem ser construídas hoje no [Babylon.js Playground](https://playground.babylonjs.com/#XCNL7Y). {% endBlockquote %}

<figure>{% Video src = "video/vvhSqZboQoZZN9wBvoXq72wzGAf1/Xb7LvsJ5e8efTssp94c6.mov", autoplay = true, muted = true, playsinline = true, loop = true%}<figcaption> Uma demonstração do Babylon.js de um mar agitado sendo simulado usando o recurso de sombreamento de computação do WebGPU.</figcaption></figure>

## Status atual {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Degrau</th>
<th data-md-type="table_cell">Status</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crie um explicador</td>
<td data-md-type="table_cell"><a href="https://gpuweb.github.io/gpuweb/explainer/" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crie o rascunho inicial das especificações</td>
<td data-md-type="table_cell"><a href="https://gpuweb.github.io/gpuweb/" data-md-type="link">Em andamento</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Reúna feedback e repita o design</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">Em andamento</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. <strong data-md-type="double_emphasis">Teste de origem</strong>
</td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis"><p data-md-type="paragraph"><a href="https://developer.chrome.com/origintrials/#/view_trial/118219490218475521" data-md-type="link">Em andamento</a></p></strong></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. Lançamento</td>
<td data-md-type="table_cell">Não foi iniciado</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Como usar o WebGPU {: #use }

### Ativando via about://flags

Para experimentar o WebGPU localmente, sem um token de teste de origem, habilite o sinalizador `#enable-unsafe-webgpu` `about://flags` .

### Habilitando o suporte durante a fase de teste de origem

A partir do Chrome 94, o WebGPU está disponível como um teste original no Chrome. Espera-se que o teste de origem termine no Chrome 101 (18 de maio de 2022).

{% include 'content/origin-trials.njk' %}

### Registre-se para o teste de origem {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Detecção de recurso {: #feature-detection }

Para verificar se WebGPU é compatível, use:

```js
if ("gpu" in navigator) {
  // WebGPU é suportado! 🎉
}
```

{% Aside 'caution' %} O adaptador de GPU retornado por `navigator.gpu.requestAdapter()` pode ser `null` . {% endAside %}

### Comece {: #get-started }

WebGPU é uma API de baixo nível, como WebGL. É muito poderoso, bastante prolixo e requer a compreensão de conceitos-chave antes de mergulhar nele. É por isso que vou criar um link para conteúdo de alta qualidade existentes neste artigo para você começar a usar o WebGPU.

- [Comece a usar GPU Compute na web](/gpu-compute/)
- [Um gostinho de WebGPU no Firefox](https://hacks.mozilla.org/2020/04/experimental-webgpu-in-firefox/)
- [WebGPU para Desenvolvedores de Metal, Parte Um](https://metalbyexample.com/webgpu-part-one/)
- [Aprenda quais tipos e estruturas de dados chave são necessários para desenhar no WebGPU](https://alain.xyz/blog/raw-webgpu)
- [Explicador WebGPU](https://gpuweb.github.io/gpuweb/explainer/)
- [Melhores Práticas WebGPU](https://toji.github.io/webgpu-best-practices/)

## Suporte do navegador {: #browser-support }

O WebGPU está disponível em dispositivos selecionados no ChromeOS, macOS e Windows 10 no Chrome 94, com mais dispositivos sendo suportados no futuro. O suporte experimental para Linux está disponível executando o Chrome com `--enable-features=Vulkan`. Mais suporte para mais plataformas virá em seguida.

A lista completa de problemas conhecidos está disponível no [documento Origin Trial Caveats](https://hackmd.io/QcdsK_g7RVKRCIIBqgs5Hw) .

No momento em que este artigo foi escrito, o suporte WebGPU estava em andamento no [Safari](https://webkit.org/blog/9528/webgpu-and-wsl-in-safari/) e no [Firefox](https://hacks.mozilla.org/2020/04/experimental-webgpu-in-firefox/) .

## Suporte de plataforma {: #platform-support }

Como no mundo do WebGL, algumas bibliotecas também implementam WebGPU:

- [Dawn](https://dawn.googlesource.com/dawn) é uma implementação C++ de WebGPU usada no Chromium. Ele pode ser usado para direcionar WebGPU em aplicativos C e C++ que podem então ser transferidos para [WebAssembly](https://developer.mozilla.org/docs/WebAssembly) usando [Emscripten](https://emscripten.org/) e automaticamente tirar vantagem da WebGPU no navegador.
- [Wgpu](https://sotrh.github.io/learn-wgpu/#what-is-wgpu) é uma implementação Rust de WebGPU usada no Firefox. É usado por vários aplicativos de GPU no ecossistema Rust, por exemplo[, Veloren](https://veloren.net/devblog-125/), um RPG de voxel multijogador.

## Demos {: #demos }

- [Amostras WebGPU](https://austin-eng.com/webgpu-samples/)
- [Metaballs renderizados em WebGPU](https://toji.github.io/webgpu-metaballs/)
- [WebGPU Clustered Forward Shading](https://toji.github.io/webgpu-clustered-shading/)

## Segurança e privacidade {: #security-privacy }

Para garantir que uma página da web funcione apenas com seus próprios dados, todos os comandos são rigorosamente validados antes de chegarem à GPU. Verifique a seção de [considerações de uso malicioso](https://gpuweb.github.io/gpuweb/#malicious-use) da especificação WebGPU para aprender mais sobre as compensações de segurança relacionadas a bugs de driver, por exemplo.

## Feedback {: #feedback }

A equipe do Chrome quer ouvir sobre suas experiências com WebGPU.

### Conte-nos sobre o design da API

Há algo na API ou na linguagem de sombreamento que não funciona como você esperava? Ou faltam métodos ou propriedades de que você precisa para implementar sua ideia? Tem uma pergunta ou comentário sobre o modelo de segurança? Registre um problema de especificação no [repositório GitHub](https://github.com/gpuweb/gpuweb/issues/) correspondente ou adicione suas ideias a um problema existente.

### Comunicar um problema com a implementação

Você encontrou um bug com a implementação do Chrome? Ou a implementação é diferente da especificação? [Registre](https://new.crbug.com) um bug em new.crbug.com. Certifique-se de incluir o máximo de detalhes que puder sobre o conteúdo da página interna `about:gpu`, instruções simples para reproduzir e insira `Blink>WebGPU` na caixa **Componentes.** [Glitch](https://glitch.com/) funciona muito bem para compartilhar reproduções rápidas e fáceis.

### Mostrar suporte para WebGPU

Você está planejando usar o WebGPU? Seu apoio público ajuda a equipe do Chrome a priorizar os recursos e mostrar a outros fornecedores de navegadores como é fundamental apoiá-los.

Envie um tweet para [@ChromiumDev](https://twitter.com/ChromiumDev) usando a hashtag [`#WebGPU`](https://twitter.com/search?q=%23WebGPU&src=recent_search_click&f=live) e diga-nos onde e como você está usando a API. Faça uma pergunta no StackOverflow com a hashtag [`#webgpu`](https://stackoverflow.com/questions/tagged/webgpu).

## Links úteis {: #helpful }

- [Explicador público](https://gpuweb.github.io/gpuweb/explainer/)
- [Especificação da API WebGPU](https://gpuweb.github.io/gpuweb/)
- [WebGPU Shading Language (WGSL)](https://gpuweb.github.io/gpuweb/wgsl/)
- [Bug de rastreamento do Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1156646)
- [Entrada ChromeStatus.com](https://chromestatus.com/feature/6213121689518080)
- Componente Blink: [`Blink>WebGPU`](https://chromestatus.com/features#component%3ABlink%3EWebGPU)
- [Revisão de TAG](https://github.com/w3ctag/design-reviews/issues/626)
- [Intenção de Experimentar](https://groups.google.com/a/chromium.org/g/blink-dev/c/K4_egTNAvTs/m/ApS804L_AQAJ)
- [Canal de matriz da WebGPU](https://matrix.to/#/#WebGPU:matrix.org)

## Agradecimentos {: #acknowledgements }

Imagem do herói via [Maxime Rossignol](https://unsplash.com/@maxoor) no [Unsplash](https://unsplash.com/photos/ukOCJ09jpgc) .
