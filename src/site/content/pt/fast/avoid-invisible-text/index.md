---
layout: post
title: Evite texto invisível durante o carregamento da fonte
authors:
  - katiehempenius
description: As fontes geralmente são arquivos grandes que demoram um pouco para carregar. Para lidar com isto, alguns navegadores ocultam o texto até que a fonte carregue (o "flash de texto invisível"). Se você está otimizando para melhorar o desempenho, o ideal é evitar o "flash de texto invisível" e mostrar o conteúdo aos usuários imediatamente usando uma fonte do sistema.
date: 2018-11-05
codelabs:
  - codelab-avoid-invisible-text
tags:
  - performance
feedback:
  - api
---

## Por que você deveria se importar?

As fontes geralmente são arquivos grandes que demoram um pouco para carregar. Para lidar com isto, alguns navegadores ocultam o texto até que a fonte carregue (o "flash de texto invisível"). Se você está otimizando para melhorar o desempenho, o ideal é evitar o "flash de texto invisível" e mostrar o conteúdo aos usuários imediatamente usando uma fonte do sistema (o "flash de texto não estilizado").

## Exiba o texto imediatamente

Este guia descreve duas maneiras de fazer isto: a primeira abordagem é muito simples, mas não é [suportado](https://caniuse.com/#search=font-display) por todos os navegadores; a segunda abordagem é mais trabalhosa, mas tem suporte em todos os navegadores. A melhor escolha para você é aquela que você irá implementar e manter.

## Opção 1: usar font-display

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Antes</th>
        <th>Depois</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>@font-face {
  font-family: Helvetica;
}
</code>
        </td>
        <td>
<code>@font-face {
  font-family: Helvetica;
  &lt;strong&gt;font-display: swap;&lt;/strong&gt;
}
</code>
        </td>
      </tr>
    </tbody>
  </table>
</div>

[`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) é uma API para especificar a estratégia de exibição de fontes. A opção `swap` informa ao navegador que o texto usando essa fonte deve ser exibido imediatamente usando uma fonte do sistema. Assim que a fonte personalizada estiver pronta, a fonte do sistema será trocada.

Se um navegador não suporta `font-display`, ele continuará a seguir seu comportamento default para carregar fontes. Verifique quais navegadores suportam `font-display` [aqui](https://caniuse.com/#search=font-display).

Estes são os comportamentos default de carregamento de fonte para navegadores comuns:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><strong>Navegador</strong></th>
        <th><strong>Comportamento default se a fonte não estiver pronta...</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Edge</td>
        <td>Usa uma fonte do sistema até que a fonte esteja pronta. Depois troca a fonte.</td>
      </tr>
      <tr>
        <td>Chrome</td>
        <td>Esconde o texto por até 3 segundos. Se o texto ainda não estiver pronto, usa uma fonte do sistema até que a fonte esteja pronta. Depois troca a fonte.</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>Esconde o texto por até 3 segundos. Se o texto ainda não estiver pronto, usa uma fonte do sistema até que a fonte esteja pronta. Depois troca a fonte.</td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>Esconde o texto até que a fonte esteja pronta.</td>
      </tr>
    </tbody>
  </table>
</div>

## Opção 2: Antes de usar fontes personalizadas espere até que sejam carregadas

Com um pouco mais de trabalho, o mesmo comportamento pode ser implementado para funcionar em todos os navegadores.

Esta abordagem tem três partes:

- Não use uma fonte personalizada no carregamento da página inicial. Isto garante que o navegador exiba o texto imediatamente usando uma fonte do sistema.
- Detecte quando sua fonte personalizada for carregada. Isto pode ser feito com algumas linhas de código JavaScript, graças à biblioteca [FontFaceObserver.](https://github.com/bramstein/fontfaceobserver)
- Atualize o estilo da página para usar a fonte personalizada.

Aqui estão as mudanças que você precisa realizar para implementar isto:

- Refatore seu CSS para não usar uma fonte personalizada no carregamento inicial da página.
- Adicione um script à sua página. Este script detecta quando a fonte personalizada é carregada e, em seguida, atualiza o estilo da página.

{% Aside 'codelab' %} [Use o Font Face Observer para exibir o texto imediatamente](/codelab-avoid-invisible-text). {% endAside %}

## Verificação

Execute o Lighthouse para verificar se o site está usando `font-display: swap` para exibir texto:

{% Instruction 'audit-performance', 'ol' %}

Confirme que a verificação passa na auditoria **Assegure que o texto permanece visível durante a carga de fontes web**.
