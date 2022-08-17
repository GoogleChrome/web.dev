---
title: Consertar um servidor sobrecarregado
subhead: |2

  Como determinar o gargalo de um servidor, corrigi-lo rapidamente, melhorar o desempenho do servidor e evitar regressões.
authors:
  - katiehempenius
date: 2020-03-31
hero: image/admin/5fmiwGShxNngW0sOeKvf.jpg
description: |2

  Como determinar o gargalo de um servidor, corrigi-lo rapidamente, melhorar o desempenho do servidor e evitar regressões.
tags:
  - blog
  - performance
---

## Visão geral

Este guia mostra como consertar um servidor sobrecarregado em 4 etapas:

1. [Avaliar](#assess) : Determine o gargalo do servidor.
2. [Estabilizar](#stabilize) : Implemente soluções rápidas para mitigar o impacto.
3. [Melhorar](#improve) : Aumente e otimize os recursos do servidor.
4. [Monitorar](#monitor) : Use ferramentas automatizadas para ajudar a prevenir problemas futuros.

{% Aside %}

Se você tiver perguntas ou comentários sobre este guia, ou se quiser compartilhar suas próprias dicas e truques, deixe um comentário no [PR #2479](https://github.com/GoogleChrome/web.dev/pull/2479).

{% endAside %}

## Avaliar

Quando o tráfego sobrecarrega um servidor, um ou mais dos itens a seguir podem se tornar um gargalo: CPU, rede, memória ou E/S de disco. Identificar qual deles é o gargalo torna possível concentrar os esforços nas mitigações mais impactantes.

- CPU: o uso da CPU que é consistentemente superior a 80% deve ser investigado e corrigido. O desempenho do servidor geralmente diminui quando o uso da CPU atinge cerca de 80-90%, e se torna mais pronunciado à medida que o uso se aproxima de 100%. A utilização da CPU para atender a uma única solicitação é insignificante, mas fazer isso na escala encontrada durante os picos de tráfego às vezes pode sobrecarregar um servidor. Transferir o serviço para outra infraestrutura, reduzindo operações caras e limitando a quantidade de solicitações reduzirá a utilização da CPU.
- Rede: durante períodos de alto tráfego, a taxa de transferência da rede necessária para atender às solicitações do usuário pode exceder a capacidade. Alguns sites, dependendo do provedor de hospedagem, também podem atingir limites em relação à transferência cumulativa de dados. Reduzir o tamanho e a quantidade de dados transferidos de e para o servidor removerá esse gargalo.
- Memória: quando um sistema não tem memória suficiente, os dados devem ser transferidos para o disco para armazenamento. O acesso ao disco é consideravelmente mais lento do que à memória, e isso pode tornar o aplicativo inteiro mais lento. Se a memória se esgotar completamente, isso pode resultar em erros de [Memória Insuficiente](https://en.wikipedia.org/wiki/Out_of_memory)  (OOM - Out of Memory). Ajustar a alocação de memória, consertar vazamentos de memória e atualizar a memória pode remover esse gargalo.
- E/S de disco: a taxa na qual os dados podem ser lidos ou gravados no disco é limitada pelo próprio disco. Se a E/S de disco for um gargalo, aumentar a quantidade de dados em cache na memória pode aliviar esse problema (ao custo de uma maior utilização da memória). Se isso não funcionar, pode ser necessário atualizar seus discos.

As técnicas neste guia enfocam o tratamento de gargalos de CPU e rede. Para a maioria dos sites, a CPU e a rede serão os gargalos mais relevantes durante um pico de tráfego.

A execução [`top`](https://linux.die.net/man/1/top) no servidor afetado é um bom ponto de partida para a investigação de gargalos. Se disponível, complemente com dados históricos de seu provedor de hospedagem ou ferramentas de monitoramento.

## Estabilizar

Um servidor sobrecarregado pode levar rapidamente a [falhas em cascata](https://en.wikipedia.org/wiki/Cascading_failure) em outras partes do sistema. Portanto, é importante estabilizar o servidor antes de tentar fazer alterações mais significativas.

### Limitação de taxa

A limitação de taxa protege a infraestrutura, limitando o número de solicitações de entrada. Isso é cada vez mais importante à medida que o desempenho do servidor diminui: conforme os tempos de resposta aumentam, os usuários tendem a atualizar a página agressivamente - aumentando ainda mais a carga do servidor.

#### Consertar

Embora rejeitar uma solicitação seja relativamente barato, a melhor maneira de proteger seu servidor é lidar com a limitação de taxa em algum ponto anterior - por exemplo, por meio de um balanceador de carga, proxy reverso ou CDN.

Instruções:

- [NGINX](https://www.nginx.com/blog/rate-limiting-nginx/)
- [HAProxy](https://www.haproxy.com/blog/four-examples-of-haproxy-rate-limiting/)
- [Microsoft IIS](https://docs.microsoft.com/en-us/iis/configuration/system.applicationhost/sites/site/limits)

Leitura adicional:

- [Estratégias e técnicas de limitação de taxa](https://cloud.google.com/solutions/rate-limiting-strategies-techniques)

### Cache HTTP

Procure maneiras de armazenar conteúdo de forma mais agressiva. Se um recurso pode ser servido a partir de um cache HTTP (seja o cache do navegador ou um CDN), ele não precisa ser solicitado do servidor de origem, o que reduz a carga do servidor.

Cabeçalhos HTTP como [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control), [`Expires`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Expires) e [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag) indicam como um recurso deve ser armazenado em cache por um cache HTTP. Auditar e corrigir esses cabeçalhos melhorará o armazenamento em cache.

Embora os [service workers](https://developer.chrome.com/docs/workbox/service-worker-overview/) também possam ser usados para armazenamento em cache, eles utilizam um [cache](https://developer.mozilla.org/docs/Web/API/Cache) separado e são um suplemento, e não uma substituição, para o armazenamento em cache HTTP adequado. Por esse motivo, ao lidar com um servidor sobrecarregado, os esforços devem se concentrar na otimização do cache HTTP.

#### Diagnosticar

Execute o [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) e observe [Servir ativos estáticos com uma eficiente](https://developers.google.com/web/tools/lighthouse/audits/cache-policy) auditoria de política de cache para visualizar uma lista de recursos com um [tempo de vida](https://en.wikipedia.org/wiki/Time_to_live) curto a médio (TTL). Para cada recurso listado, considere se o TTL deve ser aumentado. Como uma diretriz aproximada:

- Os recursos estáticos devem ser armazenados em cache com um TTL longo (1 ano).
- Os recursos dinâmicos devem ser armazenados em cache com um curto TTL (3 horas).

#### Consertar

Defina a `max-age` do cabeçalho [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control) para o número apropriado de segundos.

Instruções:

- [NGINX](http://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Apache](http://httpd.apache.org/docs/current/mod/mod_expires.html)
- [Microsoft](https://docs.microsoft.com/en-us/iis/configuration/system.webserver/staticcontent/clientcache)

Nota: A `max-age` é apenas uma das muitas diretivas de armazenamento em cache. Existem muitas outras diretivas e cabeçalhos que afetarão o comportamento do cache de seu aplicativo. Para uma explicação mais aprofundada da estratégia de cache, é altamente recomendável que você leia [Cache HTTP](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching) .

### Degradação Elegante

Degradação elegante é a estratégia de reduzir temporariamente a funcionalidade para eliminar o excesso de carga de um sistema. Este conceito pode ser aplicado de muitas maneiras diferentes: por exemplo, servindo uma página de texto estática em vez de um aplicativo completo, desabilitando a pesquisa ou retornando menos resultados da pesquisa, ou desabilitando certos recursos caros ou não essenciais. Deve-se enfatizar a remoção de funcionalidades que podem ser removidas com segurança e facilidade, com impacto mínimo nos negócios.

## Melhorar

### Use uma rede de distribuição de conteúdo (CDN)

Os ativos estáticos de serviço podem ser descarregados de seu servidor para uma rede de distribuição de conteúdo (CDN), reduzindo assim a carga.

A principal função de um CDN é fornecer conteúdo aos usuários rapidamente, fornecendo uma grande rede de servidores localizados próximos aos usuários. No entanto, a maioria dos CDNs também oferece recursos adicionais relacionados ao desempenho, como compactação, balanceamento de carga e otimização de mídia.

#### Configure um CDN

Os CDNs se beneficiam da escala, portanto operar seu próprio CDN raramente faz sentido. Uma configuração básica de CDN é bastante rápida de definir (cerca de 30 minutos) e consiste em atualizar os registros DNS para apontar para o CDN.

#### Otimize o uso de CDN

#### Diagnosticar

Identifique os recursos que não estão sendo servidos por um CDN (mas deveriam ser) executando [WebPageTest](https://webpagetest.org/) . Na página de resultados, clique no quadrado acima de 'Uso efetivo do CDN' para ver a lista de recursos que devem ser servidos por um CDN.

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/awCu4XpFI9IQ1bfhIaWJ.jpg", alt = "Seta apontando para o botão 'Uso efetivo do CDN'", width="300", height="109" %} <figcaption> Resultados do WebPageTest</figcaption></figure>

#### Consertar

Se um recurso não estiver sendo armazenado em cache pelo CDN, verifique se as seguintes condições são atendidas:

- Ele tem um [`Cache-Control: public`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Cacheability) cabeçalho público.
- Ele tem um cabeçalho [`Cache-Control: s-maxage`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Expiration) , [`Cache-Control: max-age`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Expiration) ou [`Expires`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Expires)
- Ele tem um [`Content-Length`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Length) , [`Content-Range`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Range) ou[`Transfer-Encoding header`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Transfer-Encoding) .

### Dimensionar recursos de computação

A decisão de dimensionar os recursos de computação deve ser feita com cuidado. Embora seja frequentemente necessário dimensionar os recursos de computação, fazer isso prematuramente pode gerar complexidade arquitetônica e custos financeiros desnecessários.

#### Diagnosticar

Um [tempo alto para o primeiro byte](/ttfb/) (TTFB) pode ser um sinal de que um servidor está se aproximando de sua capacidade. Você pode encontrar essas informações na auditoria de [Redução dos tempos de resposta do servidor Lighthouse(TTFB).](https://developers.google.com/web/tools/lighthouse/audits/ttfb)

Para investigar mais, use uma ferramenta de monitoramento para avaliar o uso da CPU. Se o uso atual ou previsto da CPU exceder 80%, você deve considerar aumentar seus servidores.

#### Consertar

Adicionar um balanceador de carga torna possível distribuir o tráfego em vários servidores. Um balanceador de carga fica na frente de um pool de servidores e roteia o tráfego para o servidor apropriado. Os provedores de nuvem oferecem seus próprios balanceadores de carga ( [GCP](https://cloud.google.com/load-balancing) , [AWS](https://aws.amazon.com/elasticloadbalancing/) , [Azure](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview) ) ou você pode configurar o seu próprio usando [HAProxy](https://www.digitalocean.com/community/tutorials/an-introduction-to-haproxy-and-load-balancing-concepts) ou [NGINX](http://nginx.org/en/docs/http/load_balancing.html) . Depois que um balanceador de carga estiver no lugar, servidores adicionais podem ser adicionados.

Além do balanceamento de carga, a maioria dos provedores de nuvem oferece escalonamento automático ( [GCP](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling) , [AWS](https://docs.aws.amazon.com/ec2/index.html) , [Azure](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/autoscale-overview) ). O escalonamento automático funciona em conjunto com o balanceamento de carga - o escalonamento automático dimensiona automaticamente os recursos de computação para cima e para baixo, dada a demanda em um determinado momento. Dito isso, o escalonamento automático não é mágico - leva tempo para novas instâncias ficarem online e requer uma configuração significativa. Devido à complexidade adicional que o escalonamento automático acarreta, uma configuração mais simples baseada no balanceador de carga deve ser considerada primeiro.

### Permitir compressão

Recursos baseados em texto devem ser compactados usando gzip ou brotli. O Gzip pode reduzir o tamanho da transferência desses recursos em cerca de 70%.

#### Diagnosticar

Use a [auditoria de compactação de texto](https://developers.google.com/web/tools/lighthouse/audits/text-compression) Lighthouse Enable para identificar recursos que devem ser compactados.

#### Consertar

Ative a compactação atualizando a configuração do servidor. Instruções:

- [NGINX](http://nginx.org/en/docs/http/ngx_http_gzip_module.html)
- [Apache](https://httpd.apache.org/docs/trunk/mod/mod_deflate.html)
- [Microsoft](https://docs.microsoft.com/en-us/iis/extensions/iis-compression/iis-compression-overview)

### Otimize imagens e mídia

[As imagens constituem a maior parte de tamanho do arquivo da maioria dos sites](https://images.guide/#introduction); otimizar imagens pode reduzir rápida e significativamente o tamanho de um site.

#### Diagnosticar

O Lighthouse tem uma variedade de auditorias que sinalizam otimizações de imagem em potencial. Como alternativa, outra estratégia é usar DevTools para identificar os maiores arquivos de imagem - essas imagens provavelmente serão boas candidatas para otimização.

Auditorias Farol relevantes:

- [Tamanho adequado das imagens](https://developers.google.com/web/tools/lighthouse/audits/oversized-images)
- [Adiar imagens fora da tela](https://developers.google.com/web/tools/lighthouse/audits/offscreen-images)
- [Codifique imagens de forma eficiente](/uses-optimized-images/)
- [Veicule imagens em formatos de última geração](https://developers.google.com/web/tools/lighthouse/audits/webp)
- [Use formatos de vídeo para conteúdo animado](/efficient-animated-content/)

Fluxo de trabalho do Chrome DevTools:

- [Registrar atividade de rede](https://developer.chrome.com/docs/devtools/network/#load)
- Clique em **Img** para [filtrar recursos que não sejam de imagem](https://developer.chrome.com/docs/devtools/network/reference/#filter-by-type)
- Clique na **coluna Tamanho** para classificar os arquivos de imagem por tamanho

#### Consertar

*Se você tem tempo limitado …*

Concentre seu tempo na identificação de imagens grandes e carregadas com frequência e na otimização manual delas com uma ferramenta como o [Squoosh](https://squoosh.app/) . As imagens de herói costumam ser boas candidatas para otimização.

Coisas a ter em mente:

- Tamanho: as imagens não devem ser maiores do que o necessário.
- Compactação: de modo geral, um nível de qualidade de 80-85 terá um efeito mínimo na qualidade da imagem, enquanto produz uma redução de 30-40% no tamanho do arquivo.
- Formato: use JPEGs para fotos em vez de PNG; use MP4 para [conteúdo animado](/replace-gifs-with-videos/) em vez de GIF.

*Se você tiver mais tempo …*

Considere configurar um CDN de imagem se as imagens constituírem uma parte substancial do seu site. Os CDNs de imagem são projetados para veicular e otimizar imagens e descarregam a veiculação de imagens do servidor de origem. A configuração de um CDN de imagem é simples, mas requer a atualização de URLs de imagem existentes para apontar para o CDN de imagem.

Leitura adicional:

- [Use CDNs de imagem para otimizar imagens](/image-cdns/#optimize-your-images)
- [images.guide](https://images.guide/)

### Minimize JS e CSS

A minimização remove caracteres desnecessários de JavaScript e CSS.

#### Diagnosticar

Use as [auditorias Minify CSS](https://developers.google.com/web/tools/lighthouse/audits/minify-css) e [Minify JavaScript](/unminified-javascript/) Lighthouse para identificar recursos que precisam de minimização.

#### Consertar

Se você tem tempo limitado, concentre-se em reduzir seu JavaScript. A maioria dos sites tem mais JavaScript do que CSS, então isso terá mais impacto.

- [Minify JavaScript](/reduce-network-payloads-using-text-compression/)
- [Minificar CSS](/minify-css/)

## Monitorar

As ferramentas de monitoramento de servidor fornecem coleta de dados, painéis e alertas sobre o desempenho do servidor. Seu uso pode ajudar a prevenir e mitigar futuros problemas de desempenho do servidor.

Uma configuração de monitoramento deve ser mantida o mais simples possível. A coleta e o alerta excessivos de dados têm seus custos: quanto maior o escopo ou a frequência da coleta de dados, mais caro será sua coleta e armazenamento; alertas excessivos levam inevitavelmente a páginas ignoradas.

O alerta deve usar métricas que detectem problemas de forma consistente e precisa. O tempo de resposta do servidor (latência) é uma métrica que funciona particularmente bem para isso: ela identifica uma ampla variedade de problemas e se correlaciona diretamente com a experiência do usuário. O alerta com base em métricas de nível inferior, como o uso da CPU, pode ser um suplemento útil, mas detectará um subconjunto menor de problemas. Além disso, o alerta deve ser baseado no desempenho observado na cauda (em outras palavras, o 95º ou 99º percentuais), em vez de médias. Caso contrário, as médias podem facilmente ocultar problemas que não afetam todos os usuários.

### Consertar

Todos os principais provedores de nuvem oferecem suas próprias ferramentas de monitoramento ( [GCP](https://codelabs.developers.google.com/codelabs/cloud-monitoring-alerting/index.html?index=..%2F..index) , [AWS](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/monitoring-system-instance-status-check.html) , [Azure](https://docs.microsoft.com/en-us/azure/azure-monitor/) ). Além disso, o [Netdata](https://github.com/topics/monitoring) é uma excelente alternativa gratuita e de código aberto. Independentemente da ferramenta escolhida, você precisará instalar o agente de monitoramento da ferramenta em cada servidor que deseja monitorar. Depois de concluído, certifique-se de configurar o alerta.

Instruções:

- [GCP](https://cloud.google.com/monitoring/alerts)
- [AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-system-instance-status-check.html)
- [Azure](https://docs.microsoft.com/en-us/azure/azure-monitor/app/alerts)
- [Netdata](https://docs.netdata.cloud/health/)
