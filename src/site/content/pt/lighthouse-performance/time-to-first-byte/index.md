---
layout: post
title: Reduza os tempos de resposta do servidor (TTFB)
description: Saiba mais sobre a auditoria tempo até o primeiro byte.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - time-to-first-byte
---

A seção Oportunidades de seu relatório Lighthouse informa o tempo até o primeiro byte (Time to First Byte), o tempo que leva para o navegador de um usuário receber o primeiro byte do conteúdo da página:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/V0P3MeqXSwGIL7fJbBRj.png", alt="Uma captura de tela da auditoria Lighthouse Tempos de resposta do servidor são baixos (TTFB)", width="800", height="95" %}</figure>

## Tempos de resposta lentos do servidor afetam o desempenho

Esta auditoria falha quando o navegador espera mais de 600 ms para o servidor responder à solicitação do documento principal. Os usuários não gostam quando as páginas demoram muito para carregar. Tempos de resposta lentos do servidor são uma causa possível para demorados carregamentos de página.

Quando os usuários navegam para uma URL em seu navegador web, o navegador faz uma solicitação na rede para buscar esse conteúdo. Seu servidor recebe a solicitação e retorna o conteúdo da página.

O servidor poderá precisar de muito trabalho para retornar uma página com todo o conteúdo que os usuários desejam. Por exemplo, se os usuários estão olhando seu histórico de pedidos, o servidor precisa buscar o histórico de cada usuário em um banco de dados e, em seguida, inserir esse conteúdo na página.

Otimizar o servidor para fazer um trabalho assim o mais rápido possível é uma maneira de reduzir o tempo que os usuários gastam esperando o carregamento das páginas.

## Como melhorar os tempos de resposta do servidor

O primeiro passo para melhorar os tempos de resposta do servidor é identificar as principais tarefas conceituais que seu servidor deve concluir para retornar o conteúdo da página e, em seguida, medir quanto tempo cada uma dessas tarefas dura. Depois de identificar as tarefas mais demoradas, procure maneiras de acelerá-las.

Existem muitas causas possíveis para respostas lentas do servidor e, portanto, muitas maneiras possíveis de melhorar:

- Otimize a lógica do aplicativo do servidor para preparar as páginas com mais rapidez. Se você usar uma estrutura de servidor, a estrutura pode ter recomendações sobre como fazer isso.
- Otimize como seu servidor consulta bancos de dados ou migre para sistemas de banco de dados mais rápidos.
- Atualize o hardware do servidor para ter mais memória ou CPU.

## Orientações específicas para diferentes pilhas

### Drupal

Temas, módulos e especificações do servidor contribuem para o tempo de resposta do servidor. Considere encontrar um tema mais otimizado, selecionando cuidadosamente um módulo de otimização ou atualizando seu servidor. Seus servidores de hospedagem devem fazer uso de cache de opcode PHP, sistemas de cache de memória como memcached ou Redis para reduzir o tempo de consulta ao banco de dados, bem como lógica de aplicativo otimizada para preparar as páginas com mais rapidez.

### Magento

Use a [Varnish integration](https://devdocs.magento.com/guides/v2.3/config-guide/varnish/config-varnish.html) do Magento.

### React

Se você estiver renderizando qualquer componente React do lado do servidor, considere usar [`renderToNodeStream()`](https://reactjs.org/docs/react-dom-server.html#rendertonodestream) ou `renderToStaticNodeStream()` para permitir que o cliente receba e hidrate diferentes partes da marcação em vez de todas de uma vez.

### WordPress

Temas, plug-ins e especificações de servidor contribuem para o tempo de resposta do servidor. Considere encontrar um tema mais otimizado, selecionando cuidadosamente um plug-in de otimização e/ou atualizando seu servidor.

## Recursos

- [Código-fonte da auditoria **Reduza tempos de resposta do servidor (TTFB)**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/server-response-time.js)
- [Adaptive Serving com o Network Information API](/adaptive-serving-based-on-network-quality)
