---
layout: post
title: Desempenho do JavaScript de terceiros
subhead: Descubra como o JavaScript de terceiros pode afetar o desempenho e o que você pode fazer para evitar que ele diminua a velocidade de seus sites.
authors:
  - mihajlija
date: 2019-08-13
description: |2-

  Esta postagem descreve os tipos comuns do JavaScript de terceiros e os problemas de desempenho que eles podem causar. Ele também fornece orientação geral sobre como otimizar scripts de terceiros.
alt: Um diagrama de uma página da web com texto, um vídeo, um mapa, um widget de bate-papo e botões de compartilhamento de mídia social.
tags:
  - blog
  - performance
---

O JavaScript de terceiros geralmente se refere a scripts incorporados em seu site que são:

- Não é de sua autoria
- Servido a partir de servidores de terceiros

Os sites usam esses scripts para vários fins, incluindo:

- Botões de compartilhamento social
- Incorporação do reprodutor de vídeo
- Serviços de bate-papo
- Iframes de publicidade
- Scripts de análise e métricas
- Scripts de teste A/B para experimentos
- Bibliotecas auxiliares (como formatação de data, animação e bibliotecas funcionais)

<figure data-size="full"> {% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/uLXJ72jZAlzK56ctPwXd.mp4", autoplay=true, loop=true, muted=true, playsinline=true %}</figure>

Os scripts de terceiros podem fornecer funcionalidade poderosa, mas essa não é toda a história. Eles também afetam a privacidade, a segurança e o comportamento da página⁠ — e podem ser particularmente problemáticos para o desempenho.

## Desempenho

Qualquer quantidade significativa de [JavaScript pode diminuir o desempenho](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/). Mas como o JavaScript de terceiros geralmente está fora do seu controle, ele pode trazer problemas adicionais.

### Rede

Configurar conexões leva tempo e enviar muitas solicitações a vários servidores causa lentidão. Esse tempo é ainda mais longo para conexões seguras, o que pode envolver pesquisas de DNS, redirecionamentos e várias viagens de ida e volta para o servidor final que lida com a solicitação do usuário.

Os scripts de terceiros costumam aumentar a sobrecarga da rede com coisas como:

- Disparo de solicitações de rede adicionais
- Exibição de imagens e vídeos não otimizados
- [Cache de HTTP](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching) insuficiente, o que força a busca frequente de recursos de rede
- Recursos de [Compressão do servidor](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer) insuficiente
- Várias instâncias de estruturas e bibliotecas exibidas por diferentes incorporações de terceiros

### Renderização

A maneira como o JavaScript de terceiros é carregado é muito importante. Se for feito de forma sincronizada no caminho de renderização crítico, ele atrasa a análise do resto do documento.

{% Aside 'key-term' %} O **caminho de renderização crítico** inclui todos os recursos de que o navegador precisa para exibir o conteúdo da primeira tela. {% endAside %}

Caso um terceiro tiver problemas no servidor e não conseguir entregar um recurso, a renderização será bloqueada até que a solicitação expire, o que pode ser de 10 a 80 segundos. Você pode testar e simular esse problema com os [testes de ponto único de falha do WebPageTest](https://css-tricks.com/use-webpagetest-api/#single-point-of-failure).

{% Aside %} [Os scripts de teste A/B](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript/#ab_test_smaller_samples_of_users) também podem atrasar a renderização. A maioria deles bloqueia a exibição de conteúdo até que concluam o processamento — o que pode ser verdadeiro até mesmo para scripts de teste A/B assíncronos. {% endAside %}

## O que fazer sobre isso

Usar o JavaScript de terceiros geralmente é inevitável, mas há coisas que você pode fazer para minimizar os efeitos adversos:

- Ao escolher recursos de terceiros, dê preferência aos que enviam a menor quantidade de código e, ao mesmo tempo, fornecem a funcionalidade de que você precisa.
- Use os [orçamentos de desempenho](/use-lighthouse-for-performance-budgets/) para conteúdo de terceiros para manter seus custos sob controle.
- Não use a mesma funcionalidade de dois fornecedores diferentes. Você provavelmente não precisa de dois gerenciadores de tags ou duas plataformas analíticas.
- Audite e limpe rotineiramente scripts redundantes de terceiros.

Para aprender como auditar o conteúdo de terceiros e carregá-lo com eficiência para melhor desempenho e experiência do usuário, verifique as outras postagens na seção [Otimize seus recursos de terceiros](/fast/#optimize-your-third-party-resources).
