---
layout: post
title: Cache do Service Worker e cache HTTP
subhead: Os prós e contras de usar lógica de expiração consistente ou diferente em todo o cache do service worker e camadas de cache HTTP.
authors:
  - jonchen
date: 2020-07-17
description: Os prós e contras de usar lógica de expiração consistente ou diferente em todo o cache do service worker e camadas de cache HTTP.
tags:
  - blog
  - network
  - service-worker
  - offline
---

Enquanto os service workers e PWAs estão se tornando padrões de aplicativos da web modernos, o cache de recursos se tornou mais complexo do que nunca. Este artigo cobre o panorama geral do cache do navegador, incluindo:

- Os casos de uso e as diferenças entre o armazenamento em cache do service worker e o cache HTTP.
- Os prós e contras de diferentes estratégias de expiração de armazenamento em cache do service worker em comparação com as estratégias regulares de armazenamento em cache HTTP.

## Visão geral do fluxo de cache

Em um nível superior, um navegador segue a ordem de cache abaixo ao solicitar um recurso:

1. **Cache do Service Worker** : O Service Worker verifica se o recurso está em seu cache e decide se deve retornar o próprio recurso com base em suas estratégias de cache programadas. Observe que isso não acontece automaticamente. Você precisa criar um manipulador de eventos fetch em seu service worker e interceptar as solicitações de rede para que as solicitações sejam atendidas a partir do cache do service worker em vez da rede.
2. **Cache HTTP (também conhecido como cache do navegador)** : se o recurso for encontrado no [cache HTTP](/http-cache) e ainda não tiver expirado, o navegador usará automaticamente o recurso do cache HTTP.
3. **Lado do servidor:** se nada for encontrado no cache do service worker ou no cache HTTP, o navegador vai para a rede para solicitar o recurso. Se o recurso não estiver armazenado em cache em um CDN, a solicitação deve voltar ao servidor de origem.

{% Img src="image/admin/vtKWC9Bg9dAMzoFKTeAM.png", alt="Fluxo de cache", width="800", height="585" %}

{% Aside %} Observe que alguns navegadores como o Chrome têm uma **camada de cache de memória** na frente do cache do service worker. Os detalhes do cache de memória dependem da implementação de cada navegador. Infelizmente, ainda não há especificações claras para esta parte. {% endAside %}

## Camadas de cache

### Cache do Service Worker

Um service worker intercepta solicitações HTTP do tipo de rede e usa uma [estratégia de cache](/offline-cookbook/#serving-suggestions) para determinar quais recursos devem ser retornados ao navegador. O cache do service worker e o cache HTTP têm a mesma finalidade geral, mas o cache do service worker oferece mais recursos de cache, como controle refinado sobre exatamente o que é armazenado em cache e como o cache é feito.

#### Controlar o cache do service worker

Um service worker intercepta solicitações HTTP com [ouvintes de eventos](https://github.com/mdn/sw-test/blob/gh-pages/sw.js#L19) (geralmente o `fetch` ). Este [trecho de código](https://github.com/mdn/sw-test/blob/gh-pages/sw.js#L19) demonstra a lógica de uma estratégia de cache [Cache-First.](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/#cache-first-cache-falling-back-to-network)

{% Img src="image/admin/INLfnhEpmL4KpMmFXnTL.png", alt="Um diagrama que mostra como os service workers interceptam solicitações HTTP", width="800", height="516" %}

É altamente recomendável usar o [Workbox](https://developer.chrome.com/docs/workbox/) para evitar reinventar a roda. Por exemplo, você pode [registrar caminhos de URL de recurso com uma única linha de código regex](https://developer.chrome.com/docs/workbox/modules/workbox-routing/#how-to-register-a-regular-expression-route) .

```js
import {registerRoute} from 'workbox-routing';

registerRoute(new RegExp('styles/.*\\.css'), callbackHandler);
```

#### Estratégias de armazenamento em cache do Service Worker e casos de uso

A próxima tabela descreve as estratégias comuns de armazenamento em cache do service worker e quando cada estratégia é útil.

<table>
<thead><tr>
<th><strong>Estratégias</strong></th>
<th><strong>Motivo para atualização</strong></th>
<th><strong>Casos de uso</strong></th>
</tr></thead>
<tbody>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-only">Apenas rede</a></p></strong></td>
<td>O conteúdo deve estar sempre atualizado.</td>
<td><ul>
<li>Pagamentos e checkouts</li>
<li>Balanço</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="/stale-while-revalidate/" class="">Rede voltando para o cache</a></p></strong></td>
<td>É preferível servir o conteúdo novo. No entanto, se a rede falhar ou for instável, é aceitável veicular conteúdo um pouco antigo.</td>
<td><ul>
<li>Dados oportunos</li>
<li>Preços e taxas (requer isenções de responsabilidade)</li>
<li>Status do pedido</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="/stale-while-revalidate/" class="">Desatualizar durante a revalidação</a></p></strong></td>
<td>Não há problema em servir conteúdo em cache imediatamente, mas o conteúdo em cache atualizado deve ser usado no futuro.</td>
<td><ul>
<li>Feed de notícias</li>
<li>Páginas de lista de produtos</li>
<li>Mensagens</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-then-network">Cache primeiro, volte para a rede</a></p></strong></td>
<td>O conteúdo não é crítico e pode ser servido do cache para ganhos de desempenho, mas o service worker deve ocasionalmente verificar se há atualizações.</td>
<td><ul>
<li>Conchas de aplicativos</li>
<li>Recursos comuns</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-only">Somente cache</a></p></strong></td>
<td>O conteúdo raramente muda.</td>
<td><ul><li>Conteúdo estático</li></ul></td>
</tr>
</tbody>
</table>

#### Benefícios adicionais do cache do service worker

Além do controle refinado da lógica de armazenamento em cache, o armazenamento em cache do service worker também fornece:

- **Mais memória e espaço de armazenamento para sua origem:** O navegador aloca recursos de cache HTTP por [origem](/same-site-same-origin/#origin) . Em outras palavras, se você tiver vários subdomínios, todos eles compartilham o mesmo cache HTTP. Não há garantia de que o conteúdo de sua origem / domínio permaneça no cache HTTP por muito tempo. Por exemplo, um usuário pode limpar o cache limpando manualmente da IU de configurações do navegador ou acionando um recarregamento físico em uma página. Com um cache de service worker, você tem uma probabilidade muito maior de que seu conteúdo em cache permaneça armazenado em cache. Consulte [Armazenamento persistente](/persistent-storage/) para saber mais.
- **Maior flexibilidade com redes fragmentadas ou experiências offline:** com o cache HTTP, você só tem uma escolha binária: o recurso é armazenado em cache ou não. Com o cache do service worker, você pode mitigar pequenos "soluços" com muito mais facilidade (com a estratégia "desatualizar durante a revalidação"), oferecer uma experiência offline completa (com a estratégia "Somente cache") ou até mesmo algo intermediário, como interfaces de usuário personalizadas com partes da página provenientes do cache do service worker e algumas partes excluídas (com a estratégia "Set catch handler") quando apropriado.

### Cache HTTP

Na primeira vez que um navegador carrega uma página da web e recursos relacionados, ele armazena esses recursos em seu cache HTTP. O cache HTTP geralmente é ativado automaticamente pelos navegadores, a menos que tenha sido desativado explicitamente pelo usuário final.

Usar o cache HTTP significa confiar no servidor para determinar quando armazenar em cache um recurso e por quanto tempo.

#### Controle a expiração do cache HTTP com cabeçalhos de resposta HTTP

Quando um servidor responde a uma solicitação do navegador para um recurso, o servidor usa cabeçalhos de resposta HTTP para informar ao navegador por quanto tempo ele deve armazenar o recurso em cache. Consulte [Cabeçalhos de resposta: configure seu servidor da web](/http-cache/#response-headers) para saber mais.

#### Estratégias de armazenamento em cache HTTP e casos de uso

O cache HTTP é muito mais simples do que o cache do service worker, porque o cache HTTP lida apenas com a lógica de expiração de recurso baseada em tempo (TTL). Consulte [Quais valores de cabeçalho de resposta você deve usar?](/http-cache/#response-header-strategies) e [Resumo](/http-cache/#summary) para aprender mais sobre estratégias de cache HTTP.

## Projetando sua lógica de expiração de cache

Esta seção explica os prós e contras do uso de lógica de expiração consistente nas camadas de cache do service worker e HTTP, bem como os prós e contras da lógica de expiração separada nessas camadas.

A falha abaixo demonstra como o cache do service worker e o cache HTTP funcionam em diferentes cenários:

{% Glitch { id: 'compare-sw-and-http-caching', height: 480 } %}

### Lógica de expiração consistente para todas as camadas de cache

Para demonstrar os prós e os contras, examinaremos três cenários: longo, médio e curto prazo.

<table>
<thead><tr>
<th>Cenários</th>
<th>Cache de longo prazo</th>
<th>Cache de médio prazo</th>
<th>Cache de curto prazo</th>
</tr></thead>
<tbody>
<tr>
<td>Estratégia de cache do Service Worker</td>
<td>Cache, voltando para a rede</td>
<td>Desatualizado durante a revalidação</td>
<td>Rede, voltando para o cache</td>
</tr>
<tr>
<td>TTL do cache do Service Worker</td>
<td><strong>30 dias</strong></td>
<td><strong>1 dia</strong></td>
<td><strong>10 minutos</strong></td>
</tr>
<tr>
<td>Idade máxima do cache HTTP</td>
<td><strong>30 dias</strong></td>
<td><strong>1 dia</strong></td>
<td><strong>10 minutos</strong></td>
</tr>
</tbody>
</table>

#### Cenário: cache de longo prazo (cache, retornando à rede)

- Quando um recurso em cache é válido (&lt;= 30 dias): O service worker retorna o recurso em cache imediatamente, sem ir para a rede.
- Quando um recurso em cache expira (&gt; 30 dias): O service worker vai para a rede para buscar o recurso. O navegador não tem uma cópia do recurso em seu cache HTTP, então ele vai do lado do servidor para o recurso.

Contra: neste cenário, o cache HTTP fornece menos valor porque o navegador sempre passará a solicitação para o lado do servidor quando o cache expira no service worker.

#### Cenário: cache de médio prazo (desatualizado durante a revalidação)

- Quando um recurso em cache é válido (&lt;= 1 dia): O service worker retorna o recurso em cache imediatamente e vai para a rede para buscar o recurso. O navegador tem uma cópia do recurso em seu cache HTTP, portanto, ele retorna essa cópia ao service worker.
- Quando um recurso em cache expira (&gt; 1 dia): O service worker retorna o recurso em cache imediatamente e vai para a rede para buscar o recurso. O navegador não tem uma cópia do recurso em seu cache HTTP, então ele vai do lado do servidor para buscar o recurso.

Contra: o service worker requer impedimento de cache adicional para substituir o cache HTTP a fim de aproveitar ao máximo a etapa de "revalidação".

#### Cenário: cache de curto prazo (rede voltando para o cache)

- Quando um recurso em cache é válido (&lt;= 10 minutos): O service worker vai para a rede para buscar o recurso. O navegador tem uma cópia do recurso em seu cache HTTP para que ele retorne ao service worker sem passar do lado do servidor.
- Quando um recurso em cache expira (&gt; 10 minutos): O service worker retorna o recurso em cache imediatamente e vai para a rede para buscar o recurso. O navegador não tem uma cópia do recurso em seu cache HTTP, então ele vai do lado do servidor para buscar o recurso.

Contra: semelhante ao cenário de armazenamento em cache de médio prazo, o service worker requer lógica de bloqueio de cache adicional para substituir o cache HTTP a fim de buscar o recurso mais recente do lado do servidor.

#### Service worker em todos os cenários

Em todos os cenários, o cache do service worker ainda pode retornar recursos em cache quando a rede está instável. Por outro lado, o cache HTTP não é confiável quando a rede está instável ou inativa.

### Lógica de expiração de cache diferente no cache do service worker e camadas HTTP

Para demonstrar os prós e os contras, examinaremos novamente os cenários de longo, médio e curto prazo.

<table>
<thead><tr>
<th>Cenários</th>
<th>Cache de longo prazo</th>
<th>Cache de médio prazo</th>
<th>Cache de curto prazo</th>
</tr></thead>
<tbody>
<tr>
<td>Estratégia de cache do Service Worker</td>
<td>Cache, voltando para a rede</td>
<td>Desatualizado durante a revalidação</td>
<td>Rede voltando para o cache</td>
</tr>
<tr>
<td>TTL do cache do Service Worker</td>
<td><strong>90 dias</strong></td>
<td><strong>30 dias</strong></td>
<td><strong>1 dia</strong></td>
</tr>
<tr>
<td>Idade máxima do cache HTTP</td>
<td><strong>30 dias</strong></td>
<td><strong>1 dia</strong></td>
<td><strong>10 minutos</strong></td>
</tr>
</tbody>
</table>

#### Cenário: cache de longo prazo (cache, retornando à rede)

- Quando um recurso armazenado em cache é válido no cache do service worker (&lt;= 90 dias): O service worker retorna o recurso armazenado em cache imediatamente.
- Quando um recurso em cache expira no cache do service worker (&gt; 90 dias): O service worker vai para a rede para buscar o recurso. O navegador não tem uma cópia do recurso em seu cache HTTP, então ele vai para o lado do servidor.

Prós e contras:

- Pro: os usuários experimentam uma resposta instantânea à medida que o service worker retorna imediatamente os recursos armazenados em cache.
- Pro: o service worker tem um controle mais refinado de quando usar seu cache e quando solicitar novas versões de recursos.
- Contra: é necessária uma estratégia de cache do service worker bem definida.

#### Cenário: cache de médio prazo (desatualizado durante a revalidação)

- Quando um recurso armazenado em cache é válido no cache do Service Worker (&lt;= 30 dias): O Service Worker retorna o recurso em cache imediatamente.
- Quando um recurso armazenado em cache expira no cache do service worker (&gt; 30 dias): O service worker vai para a rede em busca do recurso. O navegador não tem uma cópia do recurso em seu cache HTTP, então ele vai para o lado do servidor.

Prós e contras:

- Pro: os usuários experimentam uma resposta instantânea à medida que o service worker retorna imediatamente os recursos armazenados em cache.
- Prós: o service worker pode garantir que a **próxima** solicitação de um determinado URL use uma nova resposta da rede, graças à revalidação que acontece "em segundo plano".
- Contra: é necessária uma estratégia de cache do service worker bem definida.

#### Cenário: cache de curto prazo (rede voltando para o cache)

- Quando um recurso armazenado em cache é válido no cache do Service Worker (&lt;= 1 dia): O Service Worker vai até a rede em busca do recurso. O navegador retorna o recurso do cache HTTP, se estiver lá. Se a rede estiver inativa, o service worker retorna o recurso do cache do service worker
- Quando um recurso em cache expira no cache do service worker (&gt; 1 dia): O service worker vai para a rede para buscar o recurso. O navegador busca os recursos na rede conforme a versão em cache em seu cache HTTP expira.

Prós e contras:

- Pro: quando a rede está instável ou inativa, o service worker retorna os recursos armazenados em cache imediatamente.
- Contra: o service worker requer bloqueio de cache adicional para substituir o cache HTTP e fazer solicitações de "Rede primeiro".

## Conclusão

Dada a complexidade da combinação de cenários de cache, não é possível projetar uma regra que cubra todos os casos. No entanto, com base nas descobertas nas seções anteriores, existem algumas sugestões a serem observadas ao projetar suas estratégias de cache:

- A lógica de cache do Service Worker não precisa ser consistente com a lógica de expiração do cache HTTP. Se possível, use uma lógica de expiração mais longa no service worker para conceder ao service worker mais controle.
- O cache HTTP ainda desempenha um papel importante, mas não é confiável quando a rede está instável ou inativa.
- Revisite suas estratégias de cache para cada recurso para garantir que a estratégia de cache do service worker forneça seu valor, sem entrar em conflito com o cache HTTP.

## Saber mais

- [Confiabilidade da rede](/reliable/)
- [Evite solicitações de rede desnecessárias com o cache HTTP](/http-cache)
- [Codelab de cache HTTP](/codelab-http-cache/)
- [Medir o impacto do desempenho no mundo real dos prestadores de serviço](https://developers.google.com/web/showcase/2016/service-worker-perf)
- [Cache-Control vs. Expira](https://stackoverflow.com/questions/5799906/what-s-the-difference-between-expires-and-cache-control-headers)
