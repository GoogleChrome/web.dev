---
title: Introdução à medição de Web Vitals
authors:
  - katiehempenius
date: 2020-05-27
updated: 2022-07-18
hero: image/admin/QxMJKZcue9RS5u05XxTE.png
alt: Gráfico mensal sobreposto com cronômetros identificados como LCP, FID e CLS.
description: Aprenda como medir as Web Vitals do seu site em ambientes de mundo real e de laboratório.
tags:
  - blog
  - performance
  - web-vitals
---

Coletar dados sobre as Web Vitals do seu site é o primeiro passo para melhorá-las. Uma análise completa coletará dados de desempenho tanto de ambientes do mundo real como do ambiente de laboratório. A medição das Web Vitals requer mudanças mínimas de código e pode ser realizada usando ferramentas gratuitas.

## Medição de Web Vitals usando dados RUM

Os dados do [Real User Monitoring](https://en.wikipedia.org/wiki/Real_user_monitoring) - RUM (monitoração de usuários reais), também conhecidos como dados de campo, capturam o desempenho experimentado pelos usuários reais de um site. Os dados RUM são os que o Google usa para determinar se um site atende aos [limites recomendados do Core Web Vitals.](/vitals/)

### Introdução

Se você não tiver uma configuração RUM, as ferramentas a seguir irão lhe fornecer dados sobre o desempenho do seu site no mundo real. Todas essas ferramentas são baseadas no mesmo conjunto de dados subjacente (o [Relatório de Experiência do Usuário Chrome](https://developer.chrome.com/docs/crux/)), mas têm casos de uso ligeiramente diferentes:

- **PageSpeed Insights (PSI)**: o [PageSpeed Insights](https://pagespeed.web.dev/) produz relatórios sobre o desempenho agregado no nível da página e no nível da origem nos últimos 28 dias. Além disso, fornece sugestões sobre como melhorar o desempenho. Se você está procurando uma única ferramenta para começar a medir e melhorar os Web Vitals do seu site, recomendamos auditá-lo com o PSI. O PSI está disponível na [web](https://pagespeed.web.dev/) e como [API](https://developers.google.com/speed/docs/insights/v5/get-started).
- **Console de Busca**: o [Console de Busca](https://search.google.com/search-console/welcome) gera relatórios de dados de desempenho por página. Isso o torna adequado para identificar páginas específicas que precisam de melhorias. Ao contrário do PageSpeed Insights, os relatórios do Console de Busca incluem dados históricos de desempenho. O Console de Busca só pode ser usado com sites de sua propriedade e cuja propriedade possa ser verificada.
- **Painel CrUX** : o [painel CrUX](https://developers.google.com/web/updates/2018/08/chrome-ux-report-dashboard) é um painel pré-construído que apresenta dados CrUX para uma origem de sua escolha. Ele é baseado no Data Studio e o processo de configuração leva cerca de um minuto. Em comparação com o PageSpeed Insights e o Console de Busca, os relatórios do painel CrUX incluem mais dimensões, por exemplo, os dados podem ser divididos por dispositivo e tipo de conexão.

É importante notar que, embora as ferramentas listadas acima sejam adequadas para "começar" a medir as Web Vitals, elas também podem ser úteis em outros contextos. Em particular, tanto CrUX e como o PSI estão disponíveis como API e podem ser usados para [construir painéis](https://dev.to/chromiumdev/a-step-by-step-guide-to-monitoring-the-competition-with-the-chrome-ux-report-4k1o) e outros relatórios.

### Coletando dados RUM

Embora as ferramentas baseadas em CrUX sejam um bom ponto de partida para investigar o desempenho das Web Vitals, é altamente recomendável complementá-las com seus próprios dados RUM. Os dados RUM que você mesmo coleta podem fornecer feedback mais detalhado e imediato sobre o desempenho do seu site. Isso facilita a identificação de problemas e o teste de possíveis soluções.

{% Aside %} Fontes de dados baseadas em CrUX relatam dados usando uma granularidade de aproximadamente um mês, no entanto, os detalhes variam ligeiramente dependendo da ferramenta. Por exemplo, o PSI e o Console de Busca relatam o desempenho observado nos últimos 28 dias, enquanto o dataset CrUX e o painel fazem a divisão por mês. {% endAside %}

Você pode coletar seus próprios dados RUM usando um provedor RUM dedicado ou configurando suas próprias ferramentas.

Provedores RUM dedicados se especializam em coletar e relatar dados RUM. Para usar o Core Web Vitals com esses serviços, pergunte ao seu provedor RUM sobre a ativação do monitoramento do Core Web Vitals para o seu site.

Se você não tiver um provedor RUM, poderá aumentar sua configuração de análise existente para coletar e relatar essas métricas usando a [biblioteca JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals). Este método é explicado em mais detalhes abaixo.

### A biblioteca JavaScript web-vitals

Se você estiver implementando sua própria configuração RUM para Web Vitals, a maneira mais fácil de coletar medições do Web Vitals é usar a biblioteca JavaScript [`web-vitals`](https://github.com/GoogleChrome/web-vitals). A `web-vitals` é uma pequena biblioteca modular (~1 KB) que fornece uma API conveniente para coletar e relatar cada uma das métricas das Web Vitals [mensuráveis em campo.](/user-centric-performance-metrics/#in-the-field)

As métricas que compõem as Web Vitals não são todas expostas diretamente pelas APIs de desempenho integradas do navegador, mas sim construídas sobre elas. Por exemplo, a métrica [Cumulative Layout Shift (CLS)](/cls/) é implementada usando a [Layout Instability API](https://wicg.github.io/layout-instability/). Ao usar a biblioteca `web-vitals`, você não precisa se preocupar em implementar essas métricas por conta própria; ela também garante que os dados coletados correspondam à metodologia e às práticas recomendadas para cada métrica.

Para mais informações sobre a implementação da biblioteca `web-vitals`, consulte a [documentação](https://github.com/GoogleChrome/web-vitals) e o guia [Práticas recomendadas para medir as métricas Web Vitals em campo](/vitals-field-measurement-best-practices/).

### Agregação de dados

É essencial que você relate as medições coletadas pela biblioteca `web-vitals`. Se esses dados forem medidos, mas não relatados, você nunca vai vê-los. A documentação da `web-vitals` inclui exemplos que mostram como enviar os dados para [um endpoint de API genérico](https://github.com/GoogleChrome/web-vitals#send-the-results-to-an-analytics-endpoint), [Google Analytics](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics) ou [Google Tag Manager](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-tag-manager).

Se você já tem uma ferramenta de relatórios favorita, considere usá-la. Caso contrário, o Google Analytics é gratuito e pode ser usado para essa finalidade.

Ao considerar qual ferramenta usar, é importante pensar sobre quem precisará ter acesso aos dados. Normalmente, as empresas obtêm os maiores ganhos de desempenho quando toda a empresa, em vez de um único departamento, tem interesse em melhorar o desempenho. Consulte [Corrigindo a velocidade multifuncional de um site](/fixing-website-speed-cross-functionally/) para saber como conseguir a adesão de diferentes departamentos.

### Interpretação dos dados

Ao analisar os dados de desempenho, é importante prestar atenção às caudas da distribuição. Os dados RUM geralmente revelam que o desempenho varia bastante: alguns usuários têm experiências rápidas enquanto outros têm experiências lentas. No entanto, usar a mediana para resumir os dados pode mascarar facilmente esse comportamento.

Com relação às métricas Web Vitals, o Google usa a porcentagem de experiências "boas", em vez de estatísticas como medianas ou médias, para determinar se um site ou página atende aos limites recomendados. Especificamente, para considerar que um site ou página atingiu os limites das métricas Core Web Vitals, 75% das visitas à página devem atender ao limite "bom" para cada métrica.

## Medição de Web Vitals usando dados de laboratório

[Os dados de laboratório](/user-centric-performance-metrics/#in-the-lab) , também conhecidos como dados sintéticos, são coletados de um ambiente controlado, em vez de usuários reais. Ao contrário dos dados RUM, os dados de laboratório podem ser coletados de ambientes de pré-produção e, portanto, incorporados aos workflows do desenvolvedor e processos de integração contínua. Exemplos de ferramentas que coletam dados sintéticos são Lighthouse e WebPageTest.

### Considerações

Sempre haverá discrepâncias entre os dados RUM e os dados do laboratório, principalmente se as condições da rede, o tipo de dispositivo ou a localização do ambiente do laboratório forem significativamente diferentes daqueles usados pelos usuários. No entanto, quando se trata de coletar dados de laboratório sobre métricas Web Vitals em particular, há algumas considerações específicas importantes que devem ser observadas:

- **Cumulative Layout Shift - CLS (deslocamento cumulativo de layout):** A métrica [Cumulative Layout Shift](/cls/) medida em ambientes de laboratório pode ser artificialmente menor do que a CLS observada nos dados RUM. A CLS é definida como a "soma total de todas as pontuações de deslocamento de layout individual para cada deslocamento de layout inesperado que ocorre *durante toda a vida útil da página*". No entanto, a vida útil de uma página normalmente é muito diferente, dependendo se ela está sendo carregada por um usuário real ou por uma ferramenta de medição de desempenho sintética. Muitas ferramentas de laboratório apenas carregam a página: elas não interagem com ela. Como resultado, elas apenas capturam deslocamentos de layout que ocorrem durante o carregamento inicial da página. Em contraste, a CLS medida pelas ferramentas RUM captura [deslocamentos inesperados de layout](/cls/#expected-vs.-unexpected-layout-shifts) que ocorrem durante toda a vida útil da página.
- **First Input Delay - FID (atraso da primeira entrada):** A métrica [First Input Delay](/fid/) não pode ser medida em ambientes de laboratório porque requer interações do usuário com a página. Como resultado, a métrica [Total Blocking Time](/tbt/) (TBT) é o proxy de laboratório recomendado para o FID. A TBT mede a "quantidade total de tempo entre a Primeira renderização de conteúdo e o Tempo até a interação, durante a qual a página é bloqueada, ou seja, impedida de responder à entrada do usuário". Embora a FID e a TBT sejam calculados de forma diferente, ambas são reflexos de um thread principal bloqueado durante o processo de bootstrap. Quando o thread principal é bloqueado, o navegador demora para responder às interações do usuário. A FID mede o atraso, se houver, que ocorre na primeira vez que um usuário tenta interagir com uma página.

### Ferramental

Essas ferramentas podem ser usadas para coletar medições de laboratório de Web Vitals:

- **Web Vitals Chrome Extension:** O [Web Vitals Chrome Extension](https://github.com/GoogleChrome/web-vitals-extension) mede e reporta as Core Web Vitals (LCP, FID, e CLS) para uma determinada página. Esta ferramenta se destina a fornecer aos desenvolvedores feedback de desempenho em tempo real conforme eles fazem alterações no código.
- **Lighthouse:** O Lighthouse relata sobre LCP, CLS e TBT e também destaca possíveis melhorias de desempenho. O Lighthouse está disponível no Chrome DevTools, como uma extensão do Chrome e como um pacote npm. O Lighthouse também pode ser incorporado a workflows de integração contínua por meio do [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci).
- **WebPageTest:** O [WebPageTest](https://webpagetest.org/) inclui Web Vitals como parte de seu relatório padrão. O WebPageTest é útil para coletar informações sobre Web Vitals sob condições específicas de dispositivo e rede.
