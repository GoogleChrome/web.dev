---
title: Ferramentas para medir as Core Web Vitals
subhead: Suas ferramentas de desenvolvimento favoritas agora podem medir as Core Web Vitals.
authors:
  - addyosmani
  - egsweeny
date: 2020-05-28
description: Leia sobre o recém-anunciado suporte à medição das Core Web Vitals em ferramentas populares de desenvolvimento web, como Lighthouse, PageSpeed Insights, Chrome UX Report e muitos outros.
hero: image/admin/wNtXgv1OE2OETdiSzi8l.png
thumbnail: image/admin/KxBRBQe5CRZpCxNYyW2H.png
alt: Logotipo da Chrome User Experience, logotipo do PageSpeed Insights, logotipo do Lighthouse, logotipo do Console de Busca, logotipo do Chrome DevTools, logotipo da extensão Web Vitals.
tags:
  - blog
  - web-vitals
  - performance
---

A recém anunciada iniciativa [Web Vitals](/vitals/) fornece orientação unificada sobre sinais de qualidade essenciais para que todos os sites possam oferecer uma excelente experiência ao usuário na web. Estamos felizes em anunciar que **todas as ferramentas populares do Google para desenvolvedores web agora oferecem suporte à medição das Core Web Vitals**, ajudando você a diagnosticar e corrigir problemas relacionados à experiência do usuário com mais facilidade. Isto inclui [Lighthouse](https://github.com/GoogleChrome/lighthouse), [PageSpeed Insights](https://pagespeed.web.dev/), [Chrome DevTools](https://developer.chrome.com/docs/devtools/), [Console de Busca](https://search.google.com/search-console/about), [ferramenta de medição web.dev](/measure/), a [extensão Web Vitals Chrome](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma) e uma nova API (!) [Chrome UX Report](https://developer.chrome.com/docs/crux/).

Com a Pesquisa do Google agora incluindo Core Web Vitals como a base para avaliar a [experiência da página](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html), é importante que essas métricas estejam tão disponíveis e acionáveis quanto possível.

<figure>   {% Img src="image/admin/V00vjrHmwzljYo04f3d3.png", alt="Resumo das ferramentas de pesquisa e do Chrome que oferecem suporte às métricas Core Web Vitals", width="800", height="509" %}</figure>

{% Aside 'key-term' %} **Ferramentas de laboratório** fornecem informações sobre a provável experiência de um *usuário em potencial* no seu site e oferecem resultados reproduzíveis para depuração. As **ferramentas de campo** fornecem insight sobre a experiência de *usuários reais* com o seu site; este tipo de medição é freqüentemente chamado de Monitoramento Real do Usuário (RUM). Cada [ferramenta de laboratório ou de campo](/how-to-measure-speed/#lab-data-vs-field-data) oferece um valor distinto para otimizar a experiência do usuário. {% endAside %}

Para começar sua jornada otimizando a experiência do usuário com Core Web Vitals, experimente o seguinte fluxo de trabalho:

- Use o novo relatório Core Web Vitals do Console de Busca para identificar grupos de páginas que requerem atenção (com base nos dados de campo).
- Depois de identificar as páginas que precisam ser trabalhadas, use o PageSpeed Insights (implementado pelo Lighthouse e Chrome UX Report) para diagnosticar problemas de laboratório e de campo numa página. O PageSpeed Insights (PSI) está disponível por meio do Console de Busca mas você também pode inserir uma URL diretamente no PSI.
- Pronto para otimizar seu site localmente no laboratório? Use o Lighthouse e o Chrome DevTools para medir as Core Web Vitals e obtenha orientações práticas sobre exatamente o que corrigir. A extensão Web Vitals do Chrome pode fornecer uma visão em tempo real das métricas no desktop.
- Precisa de um painel personalizado das Core Web Vitals? Use a última versão do CrUX Dashboard ou a nova Chrome UX Report API para dados de campo ou a PageSpeed Insights API para dados de laboratório.
- Procurando orientação? O serviço web.dev/measure pode realizar medições na sua página e mostrar a você um conjunto priorizado de guias e codelabs para otimização, usando dados PSI.
- Por fim, use o Lighthouse CI em solicitações pull para garantir que não haja regressões nas Core Web Vitals antes de implantar uma mudança em produção.

Com esta introdução, vamos mergulhar nas atualizações específicas para cada ferramenta!

### Lighthouse

O Lighthouse é uma ferramenta automatizada de auditoria de sites que ajuda os desenvolvedores a diagnosticar problemas e identificar oportunidades para melhorar a experiência do usuário em seus sites. Ele mede várias dimensões da qualidade da experiência do usuário num ambiente de laboratório, incluindo desempenho e acessibilidade. A versão mais recente do Lighthouse ([6.0](/lighthouse-whats-new-6.0/), lançada em meados de maio de 2020) inclui auditorias adicionais, novas métricas e pontuação de desempenho.

<figure>   {% Img src="image/admin/4j72CWywp2D88Xti8zBf.png", alt="Lighthouse 6.0 mostrando as métricas mais recentes das Core Web Vitals", width="800", height="527" %}</figure>

O Lighthouse 6.0 apresenta três novas métricas para o relatório. Duas dessas novas métricas - [Largest Contentful Paint](/lcp/) (LCP) e [Cumulative Layout Shift](/cls/) (CLS) - são implementações de laboratório das Core Web Vitals e fornecem importantes informações de diagnóstico para otimizar a experiência do usuário. Dada a sua importância para avaliar a experiência do usuário, as novas métricas não são apenas medidas e incluídas no relatório, mas também são levadas em consideração no cálculo da pontuação de desempenho.

A terceira nova métrica incluída no Lighthouse - [Total Blocking Time](/tbt/) (TBT) - se correlaciona bem com a métrica de campo [First Input Delay](/fid/) (FID), outra métrica Core Web Vitals. Seguir as recomendações fornecidas no relatório Lighthouse e otimizar com base nas suas pontuações permite que você forneça a melhor experiência possível aos seus usuários.

Todos os produtos que o Lighthouse oferece são atualizados para refletir a versão mais recente, incluindo o [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci), que permite medir facilmente seus Core Web Vitals em solicitações pull antes de realizar merge e da implantação.

<figure>   {% Img src="image/admin/aOm5ZAIUbspjcyRMIXbn.png", alt="Lighthouse CI exibindo uma visualização de diff com a Largest Contentful Paint", width="800", height="498" %}</figure>

Para saber mais sobre as últimas atualizações do Lighthouse, confira nosso artigo do blog [Novidades do Lighthouse 6.0.](/lighthouse-whats-new-6.0/)

### PageSpeed Insights

Relatórios do [PageSpeed Insights](https://pagespeed.web.dev/) (PSI) sobre o desempenho de laboratório e de campo de uma página em dispositivos móveis e desktop. A ferramenta fornece uma visão geral sobre a experiência na página por usuários do mundo real (fornecida pelo Chrome UX Report) e um conjunto de recomendações acionáveis sobre como o proprietário de um site pode melhorar a experiência da página (fornecidas pelo Lighthouse).

O PageSpeed Insights e a [API PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/get-started) também foram atualizados para usar o Lighthouse 6.0 internamente e agora suportam a medição das Core Web Vitals tanto nas seções de laboratório como de campo do relatório! As Core Web Vitals são anotadas com uma fita azul, conforme mostrado abaixo.

<figure>   {% Img src="image/admin/l1posckVsR7JeVGnk6Jv.png", alt="PageSpeed Insights com dados da Core Web Vitals exibidos para campo e laboratório", width="800", height="873" %}</figure>

Embora o [Console de Busca](https://search.google.com/search-console/) proporcione aos proprietários de sites uma excelente visão geral dos grupos de páginas que precisam de atenção, o PSI ajuda a identificar oportunidades por página para melhorar a experiência de cada página. No PSI, você é capaz de ver claramente se sua página alcança ou não os limites que garantem uma boa experiência em todas as Core Web Vitals na parte superior do relatório, indicados por **passa na avaliação das Core Web Vitals** ou **não passa na avaliação das Core Web Vitals**.

### CrUX

O [Chrome UX Report](https://developer.chrome.com/docs/crux/) (CrUX) é um dataset público composto de dados reais da experiência do usuário em milhões de sites. Ele mede as versões de campo de todas as Core Web Vitals. Ao contrário dos dados de laboratório, os dados do CrUX vêm de [usuários](https://developer.chrome.com/docs/crux/methodology/#user-eligibility) autorizados em campo. Usando esses dados, os desenvolvedores são capazes de compreender a distribuição de experiências do usuário do mundo real em seus próprios sites ou até mesmo em sites de concorrentes. Mesmo se você não tiver RUM no seu site, o CrUX pode lhe fornecer uma maneira rápida e fácil de avaliar suas Core Web Vitals. O [dataset CrUX no BigQuery](https://developer.chrome.com/docs/crux/bigquery/) inclui dados de desempenho refinados para todos os Core Web Vitals e está disponível em snapshots mensais no nível de origem.

A única maneira de conhecer o desempenho real do seu site para os usuários é medindo seu desempenho no campo à medida que esses usuários carregam suas páginas e interagem com elas. Esse tipo de medição é geralmente chamado de Monitoramento Real do Usuário - ou RUM (abreviação de Real User Monitoring). Mesmo se você não tiver RUM no seu site, o CrUX pode lhe fornecer uma maneira rápida e fácil de avaliar suas Core Web Vitals.

**Apresentando a API CrUX**

Hoje temos o prazer de anunciar a [API CrUX](http://developers.google.com/web/tools/chrome-user-experience-report/api/reference/), uma solução rápida e gratuita para integrar facilmente seus workflows de desenvolvimento com medições de qualidade a nível de URL e origem para as seguintes métricas de campo:

- Largest Contentful Paint
- Cumulative Layout Shift
- First Input Delay
- First Contentful Paint

Os desenvolvedores podem fazer uma pesquisa para localizar uma origem ou URL e segmentar os resultados por diferentes fatores de forma. A API é atualizada diariamente e resume os dados dos 28 dias anteriores (diferentemente do conjunto de dados do BigQuery, que é agregado mensalmente). A API também tem as mesmas cotas de API públicas relaxadas que aplicamos na nossa outra API, a PageSpeed Insights API (25.000 solicitações por dia).

Abaixo está uma [demonstração](/chrome-ux-report-api/) usando a API CrUX para visualizar as métricas Core Web Vitals com distribuições **boa**, **precisa melhorar** e **ruim** :

<figure>   {% Img src="image/admin/ye3CMKfacSItYA2lqItP.png", alt="Demonstração da Chrome User Experience Report API demo mostrando métricas Core Web Vitals", width="800", height="523" %}</figure>

Em versões futuras, planejamos expandir a API para permitir o acesso a dimensões e métricas adicionais do dataset CrUX.

**Painel CrUX reformulado**

O novo [Painel CrUX](http://g.co/chromeuxdash) permite que você acompanhe facilmente o desempenho de uma origem ao longo do tempo, Agora você também pode usá-lo para monitorar as distribuições de todas as métricas Core Web Vitals. Para começar a usar o painel, veja nosso [tutorial](/chrome-ux-report-data-studio-dashboard/) em web.dev.

<figure>   {% Img src="image/admin/OjbICyhI21RNfGXrFP1x.png", alt="Painel do Chrome UX Report exibindo as métricas Core Web Vitals numa nova página de destino", width="800", height="497" %}</figure>

Introduzimos uma nova página de destino Core Web Vitals para tornar ainda mais fácil o acompanhamento do desempenho do seu site. Agradecemos seus comentários sobre todas as ferramentas CrUX; para compartilhar suas ideias e perguntas, entre em contato conosco através da conta Twitter [@ChromeUXReport](https://twitter.com/chromeuxreport) ou no [Google Group](https://groups.google.com/a/chromium.org/g/chrome-ux-report).

### Painel de desempenho do Chrome DevTools

**Depuração de eventos de mudança de layout na seção Experience**

O painel Chrome DevTools **Performance** tem uma nova seção **[Experience](https://developers.google.com/web/updates/2020/05/devtools#cls)** que pode ajudá-lo a detectar mudanças inesperadas de layout. Isto é útil para localizar e corrigir problemas de instabilidade visual na sua página que contribuem para a Cumulative Layout Shift.

<figure>   {% Img src="image/admin/VMbZAgKCi5V6FiQyu631.png", alt="Cumulative Layout Shift exibida com registros vermelhos no painel Performance", width="800", height="517" %}</figure>

Selecione um deslocamento de layout para visualizar seus detalhes na aba **Resumo**. Para visualizar onde ocorreu a mudança, passe o mouse sobre os campos **Movido de** e **Movido para**.

**Depuração da prontidão para interação com o Total Blocking Time no rodapé**

A métrica Total Blocking Time (TBT) pode ser medida em ferramentas de laboratório e é um excelente proxy para a First Input Delay. A TBT mede a quantidade total de tempo entre a [First Contentful Paint (FCP)](/fcp/) e a [Time to Interactive (TTI)](/tti/) onde a thread principal foi bloqueada por tempo suficiente para evitar a responsividade da entrada. As otimizações de desempenho que melhoram a TBT no laboratório devem melhorar a FID em campo.

<figure>   {% Img src="image/admin/WufuLpvrZfgbRn70C74V.png", alt="Total Blocking Time exibido no rodapé do painel de desempenho do DevTools", width="800", height="517" %}</figure>

A TBT agora é mostrada no rodapé do painel **Chrome DevTools Performance** quando você mede o desempenho da página:

{% Instruction 'devtools-performance', 'ol' %}

1. Clique em **Gravar**.
2. Recarregue a página manualmente.
3. Espere a página carregar e pare a gravação.

Para obter mais informações, veja [Novidades do DevTools (Chrome 84)](https://developers.google.com/web/updates/2020/05/devtools#cls).

### Console de Busca

O novo [relatório Core Web Vitals](https://support.google.com/webmasters/answer/9205520) no Console de Busca ajuda a identificar grupos de páginas no seu site que requerem atenção, com base em dados do mundo real (campo) do CrUX. O desempenho da URL é agrupado por status, tipo de métrica e grupo de URL (grupos de páginas web semelhantes).

<figure>   {% Img src="image/admin/BjTUt0xdWXD9hrLsbhLK.png", alt="Novo relatório do Core Web Vitals do Console de Busca", width="800", height="1000" %}</figure>

O relatório é baseado nas três métricas Core Web Vitals: LCP, FID e CLS. Se uma URL não possuir uma quantidade mínima de dados de relatório para essas métricas, ela será omitida do relatório. Experimente o novo relatório para obter uma visão holística do desempenho de sua origem.

Depois de identificar um tipo de página com problemas relacionados às Core Web Vitals, você pode usar o PageSpeed Insights para obter sugestões de otimização específicas para páginas representativas.

#### web.dev

[web.dev/measure](/measure/) permite medir o desempenho de sua página ao longo do tempo, fornecendo uma lista priorizada de guias e codelabs sobre como melhorar. A medição é fornecida pelo PageSpeed Insights. A ferramenta measure agora também oferece suporte às métricas Core Web Vitals, conforme mostrado abaixo:

<figure>   {% Img src="image/admin/ryoV1T1PhxUmo9zdCsDe.png", alt="Meça as Core Web Vitals ao longo do tempo e obtenha orientação priorizada com a ferramenta web.dev measure", width="800", height="459" %}</figure>

### Extensão Web Vitals

A extensão Web Vitals mede as três métricas Core Web Vitals em tempo real para o Google Chrome (desktop). Isto é útil para detectar problemas no início do workflow de desenvolvimento e como uma ferramenta de diagnóstico para avaliar o desempenho das Core Web Vitals enquanto você navega na web.

A extensão agora está disponível para instalação na [Chrome Web Store](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en)! Esperamos que você ache ela útil. Agradecemos quaisquer contribuições para melhorá-la, bem como feedback sobre o repositório [GitHub](https://github.com/GoogleChrome/web-vitals-extension/) do projeto.

<figure>   {% Img src="image/admin/woROdEmNV4jlHDPryjBQ.png", alt="Core Web Vitals exibidas em tempo real com a extensão Web Vitals Chrome", width="800", height="459" %}</figure>

#### Destaques rápidos

Isto é um resumo! O que você pode fazer em seguida:

- Use o **Lighthouse** no DevTools para otimizar sua experiência do usuário e garantir que você esteja se preparando para o sucesso com as Core Web Vitals em campo.
- Use o **PageSpeed Insights** para comparar o desempenho das suas Core Web Vitals no laboratório e em campo.
- Experimente a nova **Chrome User Experience Report API** para avaliar com facilidade o desempenho de sua origem e URL em relação às Core Web Vitals nos últimos 28 dias.
- Use a seção **Experience** e o rodapé no painel **Performance** do DevTools para mergulhar fundo e depurar em relação a Core Web Vitals específicas.
- Use **o relatório Core Web Vitals do Console de Busca** para obter um resumo do desempenho de suas origens em campo.
- Use a **Extensão Web Vitals** para rastrear o desempenho de uma página em relação às métricas Core Web Vitals em tempo real.

Falaremos mais sobre nossas ferramentas Core Web Vitals na [web.dev Live](/live/) em junho. Inscreva-se para ficar por dentro do evento!

~ por Elizabeth e Addy, WebPerf Janitors
