---
layout: post
title: Redes de distribuição de conteúdo (CDNs)
authors:
  - katiehempenius
description: |2-

  Este artigo fornece uma visão geral abrangente das redes de distribuição de conteúdo (CDNs). Além disso, explica como escolher, configurar e otimizar uma configuração de CDN.
subhead: |2

  Melhore o desempenho usando uma rede de distribuição de conteúdo.
date: 2020-09-22
hero: image/admin/22YYRBuQy8gvQhgllLKq.jpg
tags:
  - blog
  - performance
  - network
---

As redes de distribuição de conteúdo (CDNs) melhoram o desempenho do site usando uma rede distribuída de servidores para fornecer recursos aos usuários. Como os CDNs reduzem a carga do servidor, eles reduzem os custos do servidor e são adequados para lidar com picos de tráfego. Este artigo aborda como os CDNs funcionam e fornecem orientação agnóstica independente de plataforma sobre a escolha, configuração e otimização de uma instalação de CDN.

## Visão geral

Uma rede de distribuição de conteúdo consiste em uma rede de servidores que são otimizados para entregar conteúdo rapidamente aos usuários. Embora os CDNs sejam indiscutivelmente mais conhecidos por servirem conteúdo em cache, os CDNs também podem melhorar a entrega de conteúdo não armazenável em cache. De modo geral, quanto mais do seu site for entregue pelo seu CDN, melhor.

Em um alto nível, os benefícios de desempenho dos CDNs derivam de um punhado de princípios: os servidores CDN estão localizados mais perto dos usuários do que os [servidores de origem](https://en.wikipedia.org/wiki/Upstream_server) e, portanto, têm uma latência de [tempo de ida e volta (RTT)](https://en.wikipedia.org/wiki/Round-trip_delay) mais curta; as otimizações de rede permitem que os CDNs forneçam conteúdo mais rapidamente do que se o conteúdo fosse carregado "diretamente" do servidor de origem; por último, os caches CDN eliminam a necessidade de uma solicitação para viajar para o servidor de origem.

{% Aside 'key-term' %} O **servidor de origem** refere-se ao servidor do qual um CDN recupera o conteúdo. {% endAside %}

### Distribuição de recursos

Embora possa parecer não intuitivo, usar um CDN para fornecer recursos (mesmo os que não podem ser armazenados em cache) normalmente será mais rápido do que fazer com que o usuário carregue o recurso "diretamente" de seus servidores.

Quando um CDN é usado para fornecer recursos da origem, uma nova conexão é estabelecida entre o cliente e um servidor CDN próximo. O restante da jornada (em outras palavras, a transferência de dados entre o servidor CDN e a origem) ocorre pela rede do CDN — que geralmente inclui conexões existentes e persistentes com a origem. Os benefícios são duplos: encerrar a nova conexão o mais próximo possível do usuário elimina custos de configuração de conexão desnecessários (estabelecer uma nova conexão é caro e requer várias viagens de ida e volta); o uso de uma conexão pré-aquecida permite que os dados sejam transferidos imediatamente com a máxima produtividade possível.

<figure>{% Img src="image/admin/M9kzM7J7FenUyO7E9MF0.png", alt="Comparação da configuração da conexão com e sem CDN", width="800", height="512" %}</figure>

Alguns CDNs melhoram isso ainda mais, roteando o tráfego para a origem por meio de vários servidores CDN espalhados pela Internet. As conexões entre os servidores CDN ocorrem por meio de rotas confiáveis e altamente otimizadas, em vez de rotas determinadas pelo [Border Gateway Protocol (BGP)](https://en.wikipedia.org/wiki/Border_Gateway_Protocol). Embora o BGP seja o protocolo de roteamento de fato da Internet, suas decisões de roteamento nem sempre são voltadas para o desempenho. Portanto, as rotas determinadas pelo BGP provavelmente têm menos desempenho do que as rotas ajustadas entre os servidores CDN.

<figure>{% Img src="image/admin/ZLMPFySQgBkpWvgujuJP.png", alt="Comparação da configuração da conexão com e sem CDN", width="800", height="449" %}</figure>

### Cache

O cache de recursos nos servidores de um CDN elimina a necessidade de uma solicitação percorrer todo o caminho até a origem para ser atendida. Como resultado, o recurso é entregue mais rapidamente; isso também reduz a carga no servidor de origem.

#### Adicionar recursos ao cache

O método mais frequentemente usado para preencher os caches de CDN é fazer com que os recursos "pull" de CDN conforme eles são necessários — isso é conhecido como "pull de origem". Na primeira vez que um determinado recurso é solicitado do cache, o CDN o solicita do servidor de origem e armazena em cache a resposta. Dessa maneira, o conteúdo do cache é construído ao longo do tempo à medida que recursos adicionais não armazenados em cache são solicitados.

#### Remover recursos do cache

Os CDNs usam o despejo de cache para remover periodicamente recursos não tão úteis do cache. Além disso, os proprietários de sites podem usar a purga para remover recursos explicitamente.

- **Despejo de cache**

    Os caches têm uma capacidade de armazenamento finita. Quando um cache se aproxima de sua capacidade, ele abre espaço para novos recursos removendo recursos que não foram acessados recentemente ou que ocupam muito espaço. Este processo é conhecido como despejo de cache. O despejo de um recurso de um cache não significa necessariamente que ele foi despejado de todos os caches em uma rede CDN.

- **Purga**

    A purga (também conhecido como "invalidação de cache") é um mecanismo para remover um recurso dos caches de um CDN sem ter que esperar que ele expire ou seja despejado. Normalmente é executado por meio de uma API. A purga é crítica em situações em que o conteúdo precisa ser recolhido (por exemplo, corrigir erros de digitação, erros de preços ou artigos de notícias incorretos). Além disso, ela também pode desempenhar um papel crucial na estratégia de cache de um site.

    Se um CDN oferece suporte para purga quase instantânea, a purga pode ser usada como um mecanismo para gerenciar o cache de conteúdo dinâmico: armazene em cache o conteúdo dinâmico usando um TTL longo e, em seguida, purga o recurso sempre que ele for atualizado. Desta forma, é possível maximizar a duração do cache de um recurso dinâmico, apesar de não saber com antecedência quando o recurso será alterado. Essa técnica às vezes é chamada de "cache de espera até que seja informado".

    Quando a purga é usada em escala, normalmente é usada em conjunto com um conceito conhecido como "tags de cache" ou "chaves de cache substitutas". Esse mecanismo permite que os proprietários de sites associem um ou mais identificadores adicionais (às vezes chamados de "tags") a um recurso armazenado em cache. Essas etiquetas podem então ser usadas para realizar uma purga altamente granular. Por exemplo, você pode adicionar uma tag "rodapé" a todos os recursos (por exemplo, `/about`, `/blog` ) que contêm o rodapé do seu site. Quando o rodapé for atualizado, instrua seu CDN para purgar todos os recursos associados à tag "rodapé".

#### Recursos armazenáveis em cache

Se e como um recurso deve ser armazenado em cache depende se ele é público ou privado; estático ou dinâmico.

##### Recursos privados e públicos

- **Recursos privados**

    Os recursos privados contêm dados destinados a um único usuário e, portanto, não devem ser armazenados em cache por um CDN. Os recursos privados são indicados pelo cabeçalho `Cache-Control: private` privado.

- **Recursos públicos**

    Os recursos públicos não contêm informações específicas do usuário e, portanto, podem ser armazenados em cache por um CDN. Um recurso pode ser considerado armazenável em cache por um CDN se não tiver um cabeçalho `Cache-Control: no-store` ou `Cache-Control: private` privado. O período de tempo que um recurso público pode ser armazenado em cache depende da frequência com que o ativo muda.

##### Conteúdo dinâmico e estático

- **Conteúdo dinâmico**

    Conteúdo dinâmico é aquele que muda com frequência. Uma resposta da API e uma página inicial da loja são exemplos desse tipo de conteúdo. No entanto, o fato de que esse conteúdo muda com frequência não impede necessariamente que seja armazenado em cache. Durante períodos de tráfego intenso, o armazenamento em cache dessas respostas por períodos muito curtos (por exemplo, 5 segundos) pode reduzir significativamente a carga no servidor de origem, ao mesmo tempo em que tem impacto mínimo na atualização dos dados.

- **Conteúdo estático**

    O conteúdo estático muda raramente, ou nunca. Imagens, vídeos e bibliotecas com controle de versão são normalmente exemplos desse tipo de conteúdo. Como o conteúdo estático não muda, ele deve ser armazenado em cache com um longo Time to Live (TTL) — por exemplo, 6 meses ou 1 ano.

## Escolher um CDN

O desempenho é normalmente uma consideração importante ao escolher um CDN. No entanto, os outros recursos que um CDN oferece (por exemplo, recursos de segurança e analíticos), bem como os preços, suporte e integração de um CDN, são importantes a serem considerados ao escolher um CDN.

### Desempenho

Em um nível superior, a estratégia de desempenho de um CDN pode ser pensada em termos de compensação entre minimizar a latência e maximizar a taxa de acertos do cache. Os CDNs com muitos pontos de presença (PoPs) podem fornecer latência mais baixa, mas podem apresentar taxas de acerto de cache mais baixas como resultado da divisão do tráfego em mais caches. Por outro lado, os CDNs com menos PoPs podem estar localizados geograficamente mais longe dos usuários, mas podem atingir taxas de acerto de cache mais altas.

Como resultado dessa troca, alguns CDNs usam uma abordagem em camadas para armazenamento em cache: os PoPs localizados próximos aos usuários (também conhecidos como "caches de borda") são complementados com PoPs centrais que têm taxas de acerto de cache mais altas. Quando um cache de borda não consegue encontrar um recurso, ele procura um PoP central para o recurso. Essa abordagem troca uma latência um pouco maior por uma probabilidade maior de que o recurso possa ser servido a partir de um cache CDN — embora não necessariamente um cache de borda.

A compensação entre minimizar a latência e minimizar a taxa de acertos do cache é um espectro. Nenhuma abordagem particular é universalmente melhor; no entanto, dependendo da natureza do seu site e de sua base de usuários, você pode descobrir que uma dessas abordagens oferece um desempenho significativamente melhor do que a outra.

Também é importante notar que o desempenho do CDN pode variar significativamente dependendo da geografia, da hora do dia e até dos eventos atuais. Embora seja sempre uma boa ideia fazer sua própria pesquisa sobre o desempenho de um CDN, pode ser difícil prever o desempenho exato que você obterá de um CDN.

### Características adicionais

Os CDNs geralmente oferecem uma ampla variedade de recursos além de sua oferta principal de CDN. Os recursos normalmente oferecidos incluem: balanceamento de carga, otimização de imagem, streaming de vídeo, computação e borda e produtos de segurança.

## Como instalar e configurar um CDN

O ideal é usar um CDN para atender todo o seu site. Em um alto nível, o processo de configuração para isso consiste em se inscrever em um provedor de CDN e, em seguida, atualizar seu registro DNS CNAME para apontar para o provedor de CDN. Por exemplo, o registro CNAME para `www.example.com` pode apontar para `example.my-cdn.com`. Como resultado dessa alteração de DNS, o tráfego para seu site será roteado por meio do CDN.

Se usar um CDN para servir todos os recursos não for uma opção, você pode configurar um CDN para servir apenas um subconjunto de recursos — por exemplo, apenas recursos estáticos. Você pode fazer isso criando um registro CNAME separado que só será usado para recursos que devem ser servidos pelo CDN. Por exemplo, você pode criar um registro CNAME `static.example.com` que aponte para `example.my-cdn.com`. Você também precisaria reescrever as URLs dos recursos servidos pelo CDN para apontar para o subdomínio `static.example.com` que você criou.

Embora seu CDN seja configurado neste ponto, provavelmente haverá ineficiências em sua configuração. As próximas duas seções deste artigo explicarão como obter o máximo do seu CDN aumentando a taxa de acertos do cache e ativando recursos de desempenho.

## Melhorar a taxa de acertos do cache

Uma configuração de CDN eficaz fornecerá o maior número possível de recursos do cache. Geralmente, é medido pela taxa de acertos do cache (CHR). A taxa de acertos do cache é definida como o número de acertos do cache dividido pelo número total de solicitações durante um determinado intervalo de tempo.

Um cache recém-inicializado terá um CHR de 0, mas isso aumenta à medida que o cache for preenchido com recursos. Um CHR de 90% é uma boa meta para a maioria dos sites. Seu provedor de CDN deve fornecer análises e relatórios sobre seu CHR.

Ao otimizar o CHR, a primeira coisa a verificar é se todos os recursos armazenáveis em cache estão sendo armazenados em cache pelo período de tempo correto. Esta é uma avaliação simples que deve ser realizada por todos os sites.

O próximo nível de otimização de CHR, em termos gerais, é ajustar as configurações de CDN para garantir que as respostas do servidor logicamente equivalentes não sejam armazenadas em cache separadamente. Esta é uma ineficiência comum que ocorre devido ao impacto de fatores como parâmetros de consulta, cookies e cabeçalhos de solicitação no armazenamento em cache.

### Auditoria inicial

A maioria dos CDNs fornecerá análises de cache. Além disso, ferramentas como [WebPageTest](https://webpagetest.org/) e [Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl/) também podem ser usadas para verificar rapidamente se todos os recursos estáticos de uma página estão sendo armazenados em cache pelo período de tempo correto. Isso é feito verificando os cabeçalhos do cache HTTP de cada recurso. O armazenamento em cache de um recurso usando o Time To Live (TTL) máximo apropriado evitará buscas de origem desnecessárias no futuro e, portanto, aumentará o CHR.

No mínimo, um desses cabeçalhos normalmente precisa ser definido para que um recurso seja armazenado em cache por um CDN:

- `Cache-Control: max-age=`
- `Cache-Control: s-maxage=`
- `Expires`

Além disso, embora não haja impacto sobre se ou como um recurso é armazenado em cache por um CDN, é uma boa prática definir também a diretiva [`Cache-Control: immutable`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Revalidation_and_reloading). O `Cache-Control: immutable` indica que um recurso "não será atualizado durante seu tempo de vida de atualização". Como resultado, o navegador não irá revalidar o recurso ao servi-lo a partir do cache do navegador, eliminando assim uma solicitação desnecessária do servidor. Infelizmente, esta diretiva só é [compatível](https://caniuse.com/#feat=mdn-http_headers_cache-control_immutable) com Firefox e Safari — não é compatível com navegadores baseados em Chromium. Este [problema](https://bugs.chromium.org/p/chromium/issues/detail?id=611416) rastreia o suporte do Chromium para `Cache-Control: immutable`. Marcar este problema pode ajudar a incentivar o suporte a esse recurso.

Para obter uma explicação mais detalhada sobre o cache HTTP, consulte [Impedir solicitações de rede desnecessárias com o cache HTTP](/http-cache/).

### Afinação

Uma explicação um pouco simplificada de como funcionam os caches CDN é que o URL de um recurso é usado como a chave para armazenar em cache e recuperar o recurso do cache. Na prática, isso ainda é extremamente verdadeiro, mas é um pouco complicada pelo impacto de coisas como cabeçalhos de solicitação e parâmetros de consulta. Como resultado, reescrever URLs de solicitação é uma técnica importante para maximizar o CHR e garantir que o conteúdo correto seja servido aos usuários. Uma instância de CDN configurada corretamente atinge o equilíbrio correto entre o cache excessivamente granular (o que prejudica o CHR) e o cache insuficientemente granular (o que resulta em respostas incorretas servidas aos usuários).

#### Parâmetros de consulta

Por padrão, os CDNs levam em consideração os parâmetros de consulta ao armazenar em cache um recurso. No entanto, pequenos ajustes no manuseio de parâmetros de consulta podem ter um impacto significativo no CHR. Por exemplo:

- **Parâmetros de consulta desnecessários**

    Por padrão, um CDN armazenaria em cache `example.com/blog` e `example.com/blog?referral_id=2zjk` separadamente, embora eles provavelmente sejam o mesmo recurso subjacente. Isso é corrigido ajustando a configuração de um CDN para ignorar o parâmetro de consulta de `referral\_id`.

- **Ordem dos parâmetros de consulta**

    Um CDN armazenará em cache `example.com/blog?id=123&query=dogs` separadamente de `example.com/blog?query=dogs&id=123`. Para a maioria dos sites, a ordem dos parâmetros de consulta não importa, portanto, configurar o CDN para classificar os parâmetros de consulta (normalizando assim a URL usada para armazenar em cache a resposta do servidor) aumentará o CHR.

#### Vary

O cabeçalho de resposta [Vary](https://developer.mozilla.org/docs/Web/HTTP/Headers/Vary) informa aos caches que a resposta do servidor correspondente a um URL específico pode variar dependendo dos cabeçalhos definidos na solicitação (por exemplo, os cabeçalhos de solicitação [Accept-Language](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Language) ou [Accept-Encoding](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Encoding)). Como resultado, ele instrui um CDN a armazenar em cache essas respostas separadamente. O cabeçalho Vary não é amplamente suportado por CDNs e pode fazer com que um recurso armazenável em cache não seja servido a partir de um cache.

Embora o cabeçalho Vary possa ser uma ferramenta útil, o uso inadequado prejudica o CHR. Além disso, se você usar `Vary`, normalizar os cabeçalhos de solicitação ajudará a melhorar o CHR. Por exemplo, sem normalização, os cabeçalhos de solicitação `Accept-Language: en-US` e `Accept-Language: en-US,en;q=0.9` resultariam em duas entradas de cache separadas, embora seu conteúdo provavelmente fosse idêntico.

#### Cookies

Os cookies são definidos em solicitações por meio do cabeçalho [`Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cookie), eles são definidos nas respostas por meio do cabeçalho `Set-Cookie`. O uso desnecessário do <a href="https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie" data-md-type="link">`Set-Cookie`</a> deve ser evitado, visto que os caches normalmente não armazenam em cache as respostas do servidor que contêm esse cabeçalho.

## Recursos de desempenho

Esta seção aborda os recursos de desempenho que são muitas vezes oferecidos pelos CDNs como parte de sua oferta de produto principal. Muitos sites esquecem de ativar esses recursos, perdendo assim vitórias fáceis de desempenho.

### Compressão

Todas as respostas baseadas em texto devem ser [comprimidos](/reduce-network-payloads-using-text-compression/#data-compression) com gzip ou Brotli. Se você puder, escolha Brotli em vez de gzip. O Brotli é um algoritmo de compressão mais recente e, em comparação com o gzip, pode atingir taxas de compressão mais altas.

Existem dois tipos de suporte de CDN para compressão do Brotli: "Brotli da origem" e "compressão de Brotli automática".

#### Brotli de origem

O Brotli de origem é quando um CDN atende recursos que foram comprimidas do Brotli pela origem. Embora isso possa parecer um recurso que todos os CDNs devem ser capazes de suportar fora da caixa, requer que um CDN que seja capaz de armazenar em cache várias versões (em outras palavras, versões comprimidas com gzip e versões comprimidas com Brotli) do recurso correspondente a um determinado URL.

#### Compressão de Brotli automática

A compressão de Brotli automática ocorre quando os recursos são comprimidos do Brotli pelo CDN. Os CDNs podem comprimir recursos armazenáveis e não armazenados em cache.

Na primeira vez que um recurso é solicitado, ele é servido usando compressão "boa o suficiente" — por exemplo, o Brotli-5. Esse tipo de compressão é aplicável a recursos armazenáveis e não armazenados em cache.

Enquanto isso, se um recurso puder ser armazenado em cache, o CDN usará o processamento offline para comprimir o recurso em um nível de compressão mais poderoso, mas muito mais lento — por exemplo, o Brotli-11. Assim que a compressão for concluída, a versão mais comprimida será armazenada em cache e usada para solicitações subsequentes.

#### Melhores práticas de compressão

Os sites que desejam maximizar o desempenho devem aplicar a compressão de Brotli em seu servidor de origem e no CDN. A compressão de Brotli na origem minimiza o tamanho da transferência de recursos que não podem ser servidos a partir do cache. Para evitar atrasos no atendimento de solicitações, a origem deve comprimir recursos dinâmicos usando um nível de compressão bastante conservador — por exemplo, o Brotli-4; recursos estáticos podem ser comprimidos usando o Brotli-11. Se uma origem não suportar o Brotli, o gzip-6 pode ser usado para comprimir recursos dinâmicos; o gzip-9 pode ser usado para comprimir recursos estáticos.

### TLS 1.3

O TLS 1.3 é a versão mais recente do [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security), o protocolo criptográfico usado pelo [HTTPS](https://en.wikipedia.org/wiki/HTTPS). O TLS 1.3 oferece melhor privacidade e desempenho em comparação com o TLS 1.2.

O TLS 1.3 encurta o aperto de mão do TLS de duas viagens de ida e volta para uma. Para conexões usando HTTP/1 ou HTTP/2, encurtar o aperto de mão do TLS para uma viagem de ida e volta reduz efetivamente o tempo de configuração da conexão em 33%.

<figure>{% Img src="image/admin/FnCSj1W23jXaiOWCp0Bw.png", alt="Comparação dos apertos de mão do TLS 1.2 e TLS 1.3", width="800", height="448" %}</figure>

### HTTP/2 e HTTP/3

O HTTP/2 e HTTP/3 fornecem benefícios de desempenho em relação ao HTTP/1. Dos dois, o HTTP/3 oferece maiores benefícios *potenciais* de desempenho. O HTTP/3 ainda não está totalmente padronizado, mas terá amplo [suporte](https://caniuse.com/#feat=http3) quando isso ocorrer.

#### HTTP/2

Se o seu CDN ainda não ativou o [HTTP/2](https://almanac.httparchive.org/en/2019/http2) por padrão, você deve considerar ligá-lo. O HTTP/2 oferece vários [benefícios de desempenho](https://hpbn.co/http2) em relação ao HTTP/1 e é [compatível](https://caniuse.com/#feat=http2) com todos os principais navegadores. Os recursos de desempenho do HTTP/2 incluem: [multiplexação](https://hpbn.co/http2/#request-and-response-multiplexing), [priorização de stream](https://hpbn.co/http2/#stream-prioritization), [push de servidor](https://almanac.httparchive.org/en/2019/http2#http2-push) e [compressão de cabeçalho](https://tools.ietf.org/html/rfc7541/).

- **Multiplexação**

    A multiplexação é indiscutivelmente o recurso mais importante do HTTP/2. A multiplexação permite que uma única conexão TCP atenda a vários pares de resposta de solicitação ao mesmo tempo. Isso elimina a sobrecarga de configurações de conexão desnecessárias; considerando que o número de conexões que um navegador pode abrir em um determinado momento é limitado, isso também implica que o navegador agora pode solicitar mais recursos de uma página em paralelo. A multiplexação teoricamente remove a necessidade de otimizações HTTP/1 como concatenação e folhas de sprite — no entanto, na prática, essas técnicas permanecerão relevantes, uma vez que arquivos maiores comprimem melhor.

- **Priorização de fluxo**

    A multiplexação permite vários fluxos simultâneos; a [priorização de fluxo](https://httpwg.org/specs/rfc7540.html#StreamPriority) fornece uma interface para comunicar a prioridade relativa de cada um desses fluxos. Isso ajuda o servidor a enviar os recursos mais importantes primeiro — mesmo que eles não tenham sido solicitados primeiro.

A priorização do fluxo é expressa pelo navegador por meio de uma árvore de dependências e é apenas uma declaração de *preferência*: em outras palavras, o servidor não é obrigado a atender (ou mesmo considerar) as prioridades fornecidas pelo navegador. A priorização de fluxo torna-se mais eficaz quando mais de um site é servido por meio de um CDN.

As implementações de CDN de priorização de recursos HTTP/2 variam enormemente. Para identificar se o seu CDN oferece suporte total e adequado à priorização de recursos HTTP/2, consulte o artigo [O HTTP/2 ainda é rápido?](https://ishttp2fastyet.com/).

Embora mudar sua instância de CDN para HTTP/2 seja basicamente uma questão de ativar um botão, é importante testar completamente essa mudança antes de ativá-la na produção. HTTP/1 e HTTP/2 usam as mesmas convenções para cabeçalhos de solicitação e resposta — mas o HTTP/2 é muito menos tolerante quando essas convenções não são seguidas. Como resultado, práticas não especificadas, como incluir caracteres não ASCII ou maiúsculos em cabeçalhos, podem começar a causar erros quando o HTTP/2 for ativado. Se isso ocorrer, as tentativas do navegador de baixar o recurso falharão. A tentativa de download com falha ficará visível na guia "Rede" do DevTools. Além disso, a mensagem de erro "ERR_HTTP2_PROTOCOL_ERROR" será exibida no console.

#### HTTP/3

O [HTTP/3](https://en.wikipedia.org/wiki/HTTP/3) é o sucessor do [HTTP/2](https://en.wikipedia.org/wiki/HTTP/2). Em setembro de 2020, todos os principais navegadores têm [suporte](https://caniuse.com/#feat=http3) experimental para HTTP/3 e alguns CDNs o suportam. O desempenho é o principal benefício do HTTP/3 sobre o HTTP/2. Especificamente, o HTTP/3 elimina o bloqueio frontal no nível da conexão e reduz o tempo de configuração da conexão.

- **Eliminação do bloqueio frontal**

    O HTTP/2 introduziu a multiplexação, um recurso que permite que uma única conexão seja usada para transmitir vários fluxos de dados simultaneamente. No entanto, com o HTTP/2, um único pacote descartado bloqueia todos os fluxos em uma conexão (um fenômeno conhecido como bloqueio frontal). Com o HTTP/3, um pacote descartado bloqueia apenas um único fluxo. Essa melhoria é em grande parte o resultado de HTTP/3 usando [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) (o HTTP/3 usa UDP via [QUIC](https://en.wikipedia.org/wiki/QUIC) ) em vez de [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol). Isso torna o HTTP/3 particularmente útil para transferência de dados em redes congestionadas ou com perdas.

<figure>{% Img src="image/admin/B7YKfqGG4eS2toSoTDdS.png", alt="Diagrama mostrando as diferenças na transmissão de dados entre HTTP/1, HTTP/2, e HTTP/3", width="800", height="449" %}</figure>

- **Tempo de configuração de conexão reduzido**

    O HTTP/3 usa TLS 1.3 e, portanto, compartilha seus benefícios de desempenho: estabelecer uma nova conexão requer apenas uma única viagem de ida e volta e retomar uma conexão existente não requer nenhuma viagem de ida e volta.

<figure>{% Img src="image/admin/7ffDEjblsisTNsfkynt6.png", alt="Comparação da retomada da conexão entre TLS 1.2, TLS 1.3, TLS 1.3 0-RTT e HTTP/3", width="800", height="400" %}</figure>

O HTTP/3 terá o maior impacto sobre os usuários em conexões de rede ruins: não apenas porque HTTP/3 lida com a perda de pacotes melhor do que seus predecessores, mas também porque a economia de tempo absoluta resultante de uma configuração de conexão 0-RTT ou 1-RTT será maior em redes com alta latência.

### Otimização de imagem

Os serviços de otimização de imagem CDN normalmente se concentram em otimizações de imagem que podem ser aplicadas automaticamente para reduzir o tamanho de transferência da imagem. Por exemplo: remoção de dados [EXIF](https://en.wikipedia.org/wiki/Exif), aplicação de compressão sem perdas e conversão de imagens em formatos de arquivo mais recentes (por exemplo, WebP). As imagens constituem cerca de 50% dos bytes de transferência na página média da web, portanto, a otimização de imagens pode reduzir significativamente o tamanho da página.

### Minificação

A [minimização](/reduce-network-payloads-using-text-compression/#minification) remove caracteres desnecessários de JavaScript, CSS e HTML. É preferível fazer a minificação no servidor de origem, em vez do CDN. Os proprietários do site têm mais contexto sobre o código a ser minimizado e, portanto, muitas vezes podem usar técnicas de minimização mais agressivas do que as empregadas pelos CDNs. No entanto, se a minimização do código na origem não for uma opção, a minimização pelo CDN será uma boa alternativa.

## Conclusão

- **Use um CDN:** os CDNs fornecem recursos rapidamente, reduzem a carga no servidor de origem e são úteis para lidar com picos de tráfego.
- **O conteúdo do cache é o mais agressivo possível:** tanto o conteúdo estático quanto o dinâmico podem e devem ser armazenados em cache — embora por durações variáveis. Faça uma auditoria periódica em seu site para garantir que está armazenando o conteúdo em cache da maneira ideal.
- **Ative os recursos de desempenho do CDN:** recursos como Brotli, TLS 1.3, HTTP/2 e HTTP/3 melhoram ainda mais o desempenho.
