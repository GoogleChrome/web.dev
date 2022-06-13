---
layout: post
title: Sirva ativos estáticos com uma política de cache eficiente
description: Aprenda como armazenar em cache os recursos estáticos de sua página web pode melhorar o desempenho e confiabilidade para visitantes recorrentes.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - uses-long-cache-ttl
---

O cache HTTP pode acelerar o tempo de carregamento da página em visitas repetidas.

Quando um navegador solicita um recurso, o servidor que fornece o recurso pode dizer ao navegador quanto tempo ele deve armazenar o recurso temporariamente *em cache*. Para qualquer solicitação subsequente desse recurso, o navegador usa sua cópia local em vez de obtê-la da rede.

## Como falha a auditoria da política de cache do Lighthouse

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza todos os recursos estáticos que não são armazenados em cache:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vtRp9i6zzD8EDlHYkHtQ.png", alt="Uma captura de tela da auditoria Lighthouse Sirva ativos estáticos com uma política de cache eficiente", width="800", height="490" %}</figure>

O Lighthouse considera um recurso armazenável em cache se todas as seguintes condições forem atendidas:

- O recurso é uma fonte, imagem, arquivo de mídia, script ou folha de estilo.
- O recurso possui um [código de status HTTP](https://developer.mozilla.org/docs/Web/HTTP/Status) `200`, `203` ou `206`.
- O recurso não tem uma política explícita de no-cache.

Quando uma página falha na auditoria, o Lighthouse lista os resultados numa tabela com três colunas:

<div class="table-wrapper scrollbar">
  <table>
    <tbody>
      <tr>
        <td><strong>URL</strong></td>
        <td>A localização do recurso armazenável em cache</td>
      </tr>
      <tr>
        <td><strong>Cache TTL</strong></td>
        <td>A duração atual do cache do recurso</td>
      </tr>
      <tr>
        <td><strong>Tamanho</strong></td>
        <td>Uma estimativa dos dados que seus usuários salvariam se o recurso sinalizado tivesse sido armazenado em cache</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como armazenar recursos estáticos em cache usando o cache HTTP

Configure seu servidor para retornar o cabeçalho de resposta HTTP `Cache-Control`

```js
Cache-Control: max-age=31536000
```

A diretiva `max-age` informa ao navegador quanto tempo ele deve armazenar o recurso em segundos. Este exemplo define a duração para `31536000`, que corresponde a 1 ano: 60 segundos × 60 minutos × 24 horas × 365 dias = 31536000 segundos.

Quando possível, armazene em cache ativos estáticos imutáveis por um longo tempo, como um ano ou mais.

{% Aside %} Um risco de configurar caches de longa duração é que seus usuários não verão atualizações para arquivos estáticos. Você pode evitar esse problema configurando sua ferramenta de build para incorporar um hash nos seus nomes de arquivos de ativos estáticos para que cada versão seja única, o que força o navegador a buscar sempre a nova versão do servidor. (Para aprender a incorporar hashes usando webpack, veja o [Guia de cache](https://webpack.js.org/guides/caching/) do webpack.) {% endAside %}

Use `no-cache` se o recurso mudar e a atualização for importante, mas você ainda deseja obter alguns dos benefícios de velocidade do armazenamento em cache. O navegador ainda armazena em cache um recurso definido como `no-cache` mas verifica primeiro com o servidor para ter certeza de que o recurso está atualizado.

Uma duração de cache mais longa nem sempre é melhor. Em última análise, cabe a você decidir qual é a duração ideal do cache para seus recursos.

Existem muitas diretivas para personalizar como o navegador armazena em cache diferentes recursos. Saiba mais sobre recursos de cache no guia [Cache HTTP: sua primeira linha de defesa](/http-cache) e no codelab [Configurando o comportamento de cache em HTTP](/codelab-http-cache) .

## Como verificar respostas em cache no Chrome DevTools

Para ver quais recursos o navegador está obtendo de seu cache, abra a **guia Rede** no Chrome DevTools:

{% Instruction 'devtools-network', 'ol' %}

A coluna **Tamanho** no Chrome DevTools pode ajudá-lo a verificar se um recurso foi armazenado em cache:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dc7QffBFDTcTHyUNNevi.png", alt="A coluna Tamanho.", width="800", height="565" %}</figure>

O Chrome fornece os recursos mais solicitados do cache de memória, que é muito rápido, mas é esvaziado quando o navegador é fechado.

Para verificar se o cabeçalho `Cache-Control` de um recurso está definido conforme o esperado, verifique os dados do seu cabeçalho HTTP:

1. Clique na URL da solicitação, na coluna**Nome** da tabela Solicitações.
2. Clique na aba **Cabeçalhos.**

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dGDjkwsoUBwFVLYM0sVy.png", alt="Inspecionando o cabeçalho Cache-Control por meio da aba Cabeçalhos", width="800", height="597" %}   <figcaption>     Inspecionando o cabeçalho <code>Cache-Control</code> por meio da aba <b>Headers</b>.   </figcaption></figure>

## Orientações específicas para diferentes pilhas

### Drupal

Defina a **idade máxima do navegador e do cache do proxy** na página **Administração** &gt; **Configuração** &gt; **Desenvolvimento**. Veja [Recursos de desempenho do Drupal](https://www.drupal.org/docs/7/managing-site-performance-and-scalability/caching-to-improve-performance/caching-overview#s-drupal-performance-resources).

### Joomla

Veja [Cache](https://docs.joomla.org/Cache).

### WordPress

Veja [Cache do navegador](https://wordpress.org/support/article/optimization/#browser-caching).

## Recursos

- [Código-fonte para a auditoria **Sirva ativos estáticos com uma política de cache eficiente**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-long-cache-ttl.js)
- [Especificação do Cache-Control](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)
- [Cache-Control (MDN)](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control)
