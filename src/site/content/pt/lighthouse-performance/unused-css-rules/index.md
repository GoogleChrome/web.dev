---
layout: post
title: Remover CSS não utilizado
description: Aprenda sobre a auditoria unused-css-rules.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - unused-css-rules
---

A seção Oportunidades de seu relatório Lighthouse lista todas as folhas de estilo com CSS não utilizado com uma economia potencial de 2 KiB ou mais. Remova o CSS não utilizado para reduzir bytes desnecessários consumidos pela atividade de rede:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/m3WfvnCGJgrC5wqyvyyQ.png", alt="Uma captura de tela da auditoria Lighthouse Remover CSS não utilizado", width="800", height="235" %}</figure>

## Como CSS não utilizado diminui o desempenho

O uso de uma tag `<link>` é uma forma comum de adicionar estilos a uma página:

```html
<!doctype html>
<html>
  <head>
    <link href="main.css" rel="stylesheet">
    ...
```

O arquivo `main.css` que o navegador baixa é chamado de folha de estilo externa, porque é um arquivo armazenado separadamente do HTML que o utiliza.

Por default, um navegador deve baixar, analisar e processar todas as folhas de estilo externas que encontrar antes de exibir ou renderizar qualquer conteúdo na tela de um usuário. Não faria sentido para um navegador tentar exibir o conteúdo antes que as folhas de estilo tivessem sido processadas, porque as folhas de estilo podem conter regras que afetam o estilo da página.

Cada folha de estilo externa precisa ser baixada da rede. Essas viagens extras de rede podem aumentar significativamente o tempo que os usuários precisam esperar antes de ver qualquer conteúdo em suas telas.

O CSS não utilizado também retarda a construção da [árvore de renderização](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction) pelo navegador. A árvore de renderização é como a árvore DOM, exceto que também inclui os estilos para cada nó. Para construir a árvore de renderização, um navegador precisa percorrer toda a árvore DOM e verificar quais regras CSS se aplicam a cada nó. Quanto mais CSS não utilizado houver, mais tempo um navegador irá potencialmente precisar gastar calculando os estilos de cada nó.

## Como detectar CSS não utilizado {: #coverage}

A aba Cobertura do Chrome DevTools pode ajudá-lo a descobrir qual o CSS que é crítico e qual o que não é crítico. Veja [Exibir CSS usado e não usado com a aba Cobertura](https://developer.chrome.com/docs/devtools/css/reference/#coverage).

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ydgzuclRCAlY2nzrpDmk.png", alt="Chrome DevTools: aba Cobertura", width="800", height="407" %}   <figcaption>     Chrome DevTools: aba Cobertura.   </figcaption></figure>

Você também pode extrair essas informações do Puppeteer. Veja [page.coverage](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagecoverage).

## Incorpore o CSS crítico e adie o CSS não crítico

De forma semelhante ao código incorporado em `<script>`, insira estilos críticos necessários para a primeira renderização dentro de um bloco `<style>` na `head` da página HTML. Em seguida, carregue o restante dos estilos de forma assíncrona usando o link `preload`.

Considere automatizar o processo de extração e incorporação de CSS "Acima da Dobra" usando a [ferramenta crítica](https://github.com/addyosmani/critical/blob/master/README.md).

Saiba mais em [Adie CSS não crítico](/defer-non-critical-css).

## Orientações para pilhas específicas

### Drupal

Considere a remoção de regras CSS não utilizadas e apenas anexe as bibliotecas Drupal necessárias à página ou componente relevante em uma página. Veja [Definindo uma biblioteca](https://www.drupal.org/docs/8/creating-custom-modules/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-module#library) para mais detalhes.

### Joomla

Considere reduzir ou trocar o número de [extensões Joomla](https://extensions.joomla.org/) que carregam CSS não utilizado em sua página.

### WordPress

Considere reduzir ou trocar o número de [plug-ins](https://wordpress.org/plugins/) do WordPress carregando CSS não utilizado em sua página.

## Resources

- [Código-fonte para auditoria **Remove unused CSS**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/unused-css-rules.js)
