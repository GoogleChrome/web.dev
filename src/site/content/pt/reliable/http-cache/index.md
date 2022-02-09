---
layout: post
title: Evite solicitações de rede desnecessárias com o Cache HTTP
authors:
  - jeffposnick
  - ilyagrigorik
date: 2018-11-05
updated: 2020-04-17
description: |2-

  Como você pode evitar solicitações de rede desnecessárias? O Cache HTTP do navegador é a sua
  primeira linha de defesa. Não é necessariamente a abordagem mais poderosa ou flexível, e você tem controle limitado sobre o tempo de vida das respostas em cache,
  mas é eficaz e compatível com todos os navegadores, além de não exigir muito
  esforço.
codelabs:
  - codelab-http-cache
feedback:
  - api
---

Buscar recursos na rede é lento e caro:

- Respostas grandes requerem muitas transações entre o navegador e o servidor.
- Sua página não carregará até que todos os seus [recursos críticos](https://developers.google.com/web/fundamentals/performance/critical-rendering-path) tenham sido completamente baixados.
- Se uma pessoa está acessando seu site com um plano de dados móvel limitado, cada solicitação de rede desnecessária é um desperdício de dinheiro.

Como você pode evitar solicitações de rede desnecessárias? O Cache HTTP do navegador é sua primeira linha de defesa. Não é necessariamente a abordagem mais poderosa ou flexível, e você tem controle limitado sobre o tempo de vida das respostas em cache, mas é eficaz e compatível com todos os navegadores, além de não exigir muito esforço.

Este guia mostra os fundamentos de uma implementação eficaz do Cache HTTP.

## Compatibilidade do navegador {: #browser-compatibility }

Na verdade, não existe uma única API chamada Cache HTTP. É o nome geral para uma coleção de APIs para plataformas da web. Essas APIs são compatíveis com todos os navegadores:

- [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Browser_compatibility)
- [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag#Browser_compatibility)
- [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified#Browser_compatibility)

## Como funciona o Cache HTTP {: #overview }

Todas as solicitações HTTP que o navegador faz são primeiro roteadas para o cache do navegador para verificar se há uma resposta válida em cache que pode ser usada para atender à solicitação. Se houver uma correspondência, a resposta é lida no cache, o que elimina a latência da rede e os custos de dados incorridos pela transferência.

O comportamento do Cache HTTP é controlado por uma combinação de [cabeçalhos de solicitação](https://developer.mozilla.org/docs/Glossary/Request_header) e [cabeçalhos de resposta](https://developer.mozilla.org/docs/Glossary/Response_header). Em um cenário ideal, você terá controle sobre o código do seu aplicativo da web (que determinará os cabeçalhos da solicitação) e a configuração do servidor da web (que determinará os cabeçalhos de resposta).

Confira o [artigo sobre cache de HTTP](https://developer.mozilla.org/docs/Web/HTTP/Caching) da MDN para obter uma visão geral mais aprofundada sobre o conceito.

## Solicite cabeçalhos: mantenha os padrões (em geral) {: #request-headers }

Embora haja uma série de cabeçalhos importantes que devam ser incluídos nas solicitações de saída de seu aplicativo da web, o navegador quase sempre se encarrega de defini-los em seu nome quando faz solicitações. Os cabeçalhos de solicitação que afetam a verificação de atualização, como [`If-None-Match`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match) e[`If-Modified-Since`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-Modified-Since), aparecem apenas com base no entendimento do navegador dos valores atuais no cache HTTP.

Isso é uma boa notícia. Significa que você pode continuar incluindo tags como `<img src="my-image.png">` em seu HTML, e o navegador cuidará automaticamente do cache HTTP para você, sem esforço extra.

{% Aside %} Os desenvolvedores que precisam de mais controle sobre o Cache HTTP em seu aplicativo da web têm uma alternativa: é possível "descer" um nível e usar manualmente a [API Fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API), passando para ela objetos [`Request`](https://developer.mozilla.org/docs/Web/API/Request) com conjunto de substituições de [`cache`](https://developer.mozilla.org/docs/Web/API/Request/cache). Porém, isso está além do escopo deste guia! {% endAside %}

## Cabeçalhos de resposta: configure seu servidor da web {: #response-headers }

A parte da configuração do Cache HTTP que mais importa são os cabeçalhos que seu servidor da web adiciona a cada resposta de saída. Todos os cabeçalhos a seguir influenciam no comportamento eficaz do armazenamento em cache:

- [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control)  O servidor pode retornar um `Cache-Control` para especificar como e por quanto tempo o navegador e outros caches intermediários devem armazenar em cache a resposta individual.
- [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag). Quando o navegador encontra uma resposta expirada em cache, ele pode enviar um pequeno token (geralmente um hash do conteúdo do arquivo) para o servidor e verificar se o arquivo foi alterado. Se o servidor retornar o mesmo token, o arquivo é o mesmo e não há necessidade de baixá-lo novamente.
- [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified). Este cabeçalho tem a mesma finalidade que `ETag`, mas usa uma estratégia baseada em tempo para determinar se um recurso foi alterado, em oposição à estratégia baseada em conteúdo de `ETag` .

Alguns servidores da web têm suporte integrado para definir esses cabeçalhos por padrão, enquanto outros deixam os cabeçalhos totalmente de fora, a menos que sejam configurados explicitamente. Os detalhes específicos de *como* configurar cabeçalhos variam muito, dependendo do servidor web utilizado. Você deve consultar a documentação do servidor para obter informações mais precisas.

Para evitar pesquisas, confira abaixo as instruções de como configurar alguns servidores da web mais conhecidos:

- [Express](https://expressjs.com/en/api.html#express.static)
- [Apache](https://httpd.apache.org/docs/2.4/caching.html)
- [nginx](http://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Firebase Hosting](https://firebase.google.com/docs/hosting/full-config)
- [Netlify](https://www.netlify.com/blog/2017/02/23/better-living-through-caching/)

Deixar de fora o cabeçalho de resposta `Cache-Control` não desabilita o Cache HTTP! Em vez disso, os navegadores [adivinham efetivamente](https://www.mnot.net/blog/2017/03/16/browser-caching#heuristic-freshness) que tipo de comportamento de cache faz mais sentido para um determinado tipo de conteúdo. Talvez você deseje mais controle do que isso oferece, então reserve um tempo para configurar seus cabeçalhos de resposta.

## Quais valores de cabeçalho de resposta você deve usar? {: #response-header-strategies }

Existem dois cenários importantes que você deve analisar ao configurar os cabeçalhos de resposta do seu servidor da web.

### Cache de longa duração para URLs com controle de versão {: #versioned-urls }

{% Details %} {% DetailsSummary 'h4' %} Como URLs com controle de versão podem ajudar na sua estratégia de armazenamento em cache? URLs com controle de versão são uma boa prática porque facilitam a invalidação de respostas em cache. {% endDetailsSummary %} Suponha que seu servidor instrua os navegadores a armazenar em cache um arquivo CSS por um ano ( <code>Cache-Control: max-age=31536000</code> ), mas seu designer acabou de fazer uma atualização de emergência que precisa ser implementada imediatamente. Como você notifica os navegadores para atualizar a cópia em cache "desatualizada" do arquivo? É impossível, pelo menos não sem alterar a URL do recurso. Depois que o navegador armazena a resposta em cache, a versão nele é usada até que não seja mais atualizada, conforme determinado por <code>max-age</code> ou <code>expires</code>, ou até que seja removida dele por algum outro motivo (por exemplo: o usuário limpar o cache do navegador). Como resultado, usuários diferentes podem acabar usando versões distintas do arquivo quando a página é construída: os usuários que acabaram de buscar o recurso usam a nova versão, enquanto os usuários que armazenaram em cache uma cópia anterior (mas ainda válida) usam uma versão mais antiga de seu resposta. Como obter o melhor dos dois mundos: cache do lado do cliente e atualizações rápidas? Você altera a URL do recurso e obriga o usuário a baixar a nova resposta sempre que seu conteúdo é alterado. Normalmente, isso é feito incorporando uma impressão digital, ou um número de versão, no nome do seu arquivo (por exemplo: <code>style.x234dff.css</code>. {% endDetails %}

Ao responder a solicitações de URLs que contêm "[impressão digital](https://en.wikipedia.org/wiki/Fingerprint_(computing))" ou informações de versão e cujo conteúdo nunca deve ser alterado, adicione `Cache-Control: max-age=31536000` às suas respostas.

Definir este valor informa ao navegador que, quando for necessário carregar a mesma URL a qualquer momento durante o próximo ano (31.536.000 segundos; o valor máximo suportado), é possível usar imediatamente o valor no Cache HTTP, sem precisar fazer uma solicitação de rede para seu servidor da web. Isso é ótimo, você ganhou imediatamente a confiabilidade e a velocidade ao evitar a rede!

Ferramentas de construção como o webpack podem [automatizar o processo](https://webpack.js.org/guides/caching/#output-filenames) de atribuição de impressões digitais de hash às URLs dos seus ativos.

{% Aside %} Você também pode adicionar a [propriedade `immutable`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Revalidation_and_reloading) ao seu `Cache-Control` como uma otimização adicional, embora [seja ignorada](https://www.keycdn.com/blog/cache-control-immutable#browser-support) em alguns navegadores. {% endAside %}

### Revalidação de servidor para URLs sem controle de versão {: #unversioned-urls }

Infelizmente, nem todos as URLs carregadas têm controle de versão. Talvez você não consiga incluir uma etapa de compilação antes de implantar seu aplicativo da web, por isso não é possível adicionar hashes às URLs de ativos. Todo aplicativo da web precisa de arquivos HTML, sendo que esses arquivos (quase!) nunca incluirão informações de controle de versão, já que ninguém se preocupará em usá-lo se precisar lembrar que a URL a ser acessada é `https://example.com/index.34def12.html`. Então, o que você pode fazer por essas URLs?

Esse é um cenário em que você precisa admitir a derrota. Apenas o Cache HTTP não é poderoso o suficiente para evitar totalmente a rede. (Não se preocupe, em breve você aprenderá sobre [trabalhos de serviço](/service-workers-cache-storage/), que fornecerão o suporte necessário para reverter a batalha a seu favor.) Mas existem algumas etapas que você pode seguir para garantir que as solicitações de rede serão tão rápidas e eficientes quanto possível.

Os seguintes valores `Cache-Control` podem ajudar a ajustar onde e como as URLs sem controle de versão são armazenadas em cache:

- `no-cache`. Isso instrui o navegador que é preciso revalidar com o servidor sempre antes de usar uma versão em cache da URL.
- `no-store`. Isso instrui o navegador e outros caches intermediários (como CDNs) a nunca armazenar nenhuma versão do arquivo.
- `private`. Os navegadores podem armazenar o arquivo em cache, mas os caches intermediários não.
- `public`. A resposta pode ser armazenada por qualquer cache.

Verifique o [Apêndice: Fluxograma de `Cache-Control`](#flowchart) para visualizar o processo de decisão de qual(is) valor(es) de `Cache-Control` serão utilizados. Observe também que o `Cache-Control` pode aceitar uma lista de diretivas separadas por vírgulas. Consulte o <a href="#examples" data-md-type="link">Apêndice: exemplos de `Cache-Control`</a> .

Junto com isso, definir um dos dois cabeçalhos de resposta adicionais também pode ajudar o [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag) ou [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified). Conforme mencionado nos [cabeçalhos de resposta](#response-headers), `ETag` e `Last-Modified` têm a mesma finalidade: determinar se o navegador precisa baixar novamente um arquivo em cache que expirou. `ETag` é a abordagem recomendada porque é mais precisa.

{% Details %} {% DetailsSummary 'h4' %} Exemplo de ETag {% endDetailsSummary %} Suponha que 120 segundos tenham se passado desde a busca inicial e que o navegador tenha iniciado uma nova solicitação para o mesmo recurso. Primeiro o navegador verifica o Cache HTTP e encontra a resposta anterior, mas infelizmente não pode usá-a porque já expirou. Nesse ponto, o navegador pode despachar uma nova solicitação e buscar a nova resposta completa. No entanto, isso não é eficiente porque, se o recurso não tiver sido alterado, não há razão para baixar as mesmas informações que já estão no cache! Conforme especificado no <code>ETag</code>, os tokens de validação foram projetados para resolver esse problema. O servidor gera e retorna um token arbitrário, que normalmente é um hash ou alguma outra impressão digital do conteúdo do arquivo. O navegador não precisa saber como a impressão digital é gerada, basta enviá-la ao servidor na próxima solicitação. Se a impressão digital ainda for a mesma, o recurso não foi alterado e o navegador pode ignorar o download. {% endDetails %}

Ao definir `ETag` ou `Last-Modified` , você acabará tornando a solicitação de revalidação muito mais eficiente, que acabam acionando os [`If-Modified-Since`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-Modified-Since) ou [`If-None-Match`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match) mencionados nos [cabeçalhos de solicitação](#request-headers) .

Quando um servidor da web configurado corretamente detectar esses cabeçalhos de solicitação de entrada, será possível confirmar se a versão do recurso que o navegador já possui em seu Cache HTTP corresponde à versão mais recente no servidor da web. Se houver uma correspondência, o servidor pode responder com um [`304 Not Modified`](https://developer.mozilla.org/docs/Web/HTTP/Status/304), que equivale a dizer "Ei, continue usando o que você já tem!". Há muito poucos dados a serem transferidos ao enviar esse tipo de resposta, então geralmente isso é bem mais rápido do que ter que retornar uma cópia do recurso real que está sendo solicitado.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/e2bN6glWoVbWIcwUF1uh.png", alt="Diagrama de um cliente solicitando um recurso e o servidor respondendo com um cabeçalho 304.", width="474", height="215" %} <figcaption> O navegador solicita <code>/file</code> do servidor e inclui o <code>If-None-Match</code> para instrui-lo a retornar apenas o arquivo completo se a <code>ETag</code> do arquivo no servidor não corresponder ao valor <code>If-None-Match</code> nele. Nesse caso, ambos os valores coincidiram, por isso o servidor retorna um <code>304 Not Modified</code> com instruções sobre a quantidade de tempo pelo qual o arquivo deve ser armazenado no cache (<code>Cache-Control: max-age=120</code> ). </figcaption></figure>

## Resumo {: #summary }

O Cache HTTP é uma forma eficaz de melhorar o desempenho de carregamento, pois reduz as solicitações de rede desnecessárias. É compatível com todos os navegadores e não requer muito trabalho para configurar.

Os `Cache-Control` a seguir são um bom começo:

- `Cache-Control: no-cache` para recursos que devem ser revalidados com o servidor antes de cada uso.
- `Cache-Control: no-store` recursos que nunca devem ser armazenados em cache.
- `Cache-Control: max-age=31536000` para recursos com controle de versão.

Além disso, o `ETag` ou `Last-Modified` pode ajudar a revalidar recursos expirados do cache com mais eficiência.

{% Aside 'codelab' %} Experimente o [codelab HTTP Cache](/codelab-http-cache) para obter experiência prática com `Cache-Control` e `ETag` no Express. {% endAside %}

## Saiba mais {: #learn-more }

Se você quiser saber ainda mais sobre o uso do `Cache-Control`, confira o guia de [práticas recomendadas de cache e dicas de max-age](https://jakearchibald.com/2016/caching-best-practices/), de Jake Archibald.

Consulte [Ame seu cache](/love-your-cache) para obter orientações de como otimizar o uso do cache para visitantes recorrentes.

## Apêndice: Mais dicas {: #tips }

Se você tiver mais tempo, confira abaixo outras maneiras de otimizar o uso do Cache HTTP:

- Use URLs consistentes. Se você veicular o mesmo conteúdo em URLs diferentes, esse conteúdo será buscado e armazenado várias vezes.
- Minimize a rotatividade. Se parte de um recurso (como um arquivo CSS) for atualizado com frequência, enquanto o resto do arquivo não (como o código da biblioteca), considere dividir o código atualizado com frequência em um arquivo separado e usar uma estratégia de armazenamento em cache de curta duração para ele e uma de longa duração para o código que não é alterado com frequência.
- Confira a nova diretriz [`stale-while-revalidate`](/stale-while-revalidate/) se algum grau de desatualização for aceitável em sua política de `Cache-Control`

## Apêndice: `Cache-Control` {: #flowchart }

{% Img src="image/admin/htXr84PI8YR0lhgLPiqZ.png", alt="Fluxograma", width="595", height="600"%}

## Apêndice: `Cache-Control` {: #examples }

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Valor de <code>Cache-Control</code>
</th>
        <th>Explicação</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>max-age=86400</code></td>
        <td>A resposta pode ser armazenada em cache por navegadores e caches intermediários durante até um dia (60 segundos x 60 minutos x 24 horas).</td>
      </tr>
      <tr>
        <td><code>private, max-age=600</code></td>
        <td>A resposta pode ser armazenada em cache pelo navegador (mas não caches intermediários) durante até 10 minutos (60 segundos x 10 minutos).</td>
      </tr>
      <tr>
        <td><code>public, max-age=31536000</code></td>
        <td>A resposta pode ser armazenada por qualquer cache durante um ano.</td>
      </tr>
      <tr>
        <td><code>no-store</code></td>
        <td>A resposta não pode ser armazenada em cache e deve ser buscada na íntegra em cada solicitação.</td>
      </tr>
    </tbody>
  </table>
</div>
