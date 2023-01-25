---
layout: post
title: O que há de novo no Lighthouse 6.0
subhead: Novas métricas, atualização de pontuação de desempenho, novas auditorias e muito mais.
authors:
  - cjamcl
date: 2020-05-19
hero: image/admin/93kZL2w49CLIc514qojJ.svg
alt: Logotipo do Lighthouse.
tags:
  - blog
  - performance
  - lighthouse
---

Hoje estamos lançando o Lighthouse 6.0!

O [Lighthouse](https://github.com/GoogleChrome/lighthouse/) é uma ferramenta automatizada de auditoria de sites que ajuda os desenvolvedores com oportunidades e diagnósticos para melhorar a experiência do usuário em seus sites. Está disponível no Chrome DevTools, npm (como um módulo Node e uma CLI) ou como uma extensão do navegador (no [Chrome](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk) e [Firefox](https://addons.mozilla.org/en-US/firefox/addon/google-lighthouse/)). [Ele possibilita](/measure/) muitos serviços do Google, incluindo web.dev/measure e [PageSpeed Insights](https://pagespeed.web.dev/).

O Lighthouse 6.0 está disponível imediatamente no npm e no [Chrome Canary](https://www.google.com/chrome/canary/). Outros serviços do Google que utilizam o Lighthouse receberão a atualização no final do mês. Ele chegará no Chrome Stable no Chrome 84 (meados de julho).

Para experimentar a CLI Lighthouse Node, use os seguintes comandos:

```bash
npm install -g lighthouse
lighthouse https://www.example.com --view
```

Esta versão do Lighthouse vem com um grande número de mudanças [listadas no changelog 6.0](https://github.com/GoogleChrome/lighthouse/releases/tag/v6.0.0). Cobriremos os destaques neste artigo.

- [Novas métricas](#new-metrics)
- [Atualização de pontuação de desempenho](#score)
- [Novas auditorias](#new-audits)
- [CI do Lighthouse](#ci)
- [Painel do Chrome DevTools renomeado](#devtools)
- [Emulação móvel](#emulation)
- [Extensão do navegador](#extension)
- [Orçamentos](#budgets)
- [Links de localização da fonte](#source-location)
- [No horizonte](#horizon)
- [Agradecimentos!](#thanks)

## Novas métricas {: #new-metrics}

<figure>{% Img src="image/admin/Yo1oNtdfEF4PhD7zHDHQ.png", alt="Métricas do Lighthouse 6.0.", width="600", height="251" %}</figure>

O Lighthouse 6.0 apresenta três novas métricas ao relatório. Duas dessas novas métricas - Largest Contentful Paint (LCP) e Cumulative Layout Shift (CLS) - são implementações de laboratório de [Core Web Vitals](/vitals/).

### Largest Contentful Paint (LCP) {: #lcp }

[Largest Contentful Paint (LCP)](https://www.web.dev/lcp/) é uma medida da experiência de carregamento percebida. Ele marca o ponto durante o carregamento da página quando o conteúdo principal - ou "maior" foi carregado e está visível para o usuário. O LCP é um complemento importante para o First Contentful Paint (FCP), que captura apenas o início da experiência de carregamento. O LCP fornece um sinal aos desenvolvedores sobre a rapidez com que um usuário é realmente capaz de ver o conteúdo de uma página. Uma pontuação de LCP abaixo de 2,5 segundos é considerada 'Boa'.

Para obter mais informações, [assista a este aprofundamento no LCP](https://youtu.be/diAc65p15ag) de Paul Irish.

### Cumulative Layout Shift (CLS) {: #cls }

O [Cumulative Layout Shift (CLS)](https://www.web.dev/cls/) é uma medida de estabilidade visual. Ele quantifica o quanto o conteúdo de uma página muda visualmente. Uma pontuação CLS baixa é um sinal para os desenvolvedores de que seus usuários não estão experimentando mudanças de conteúdo indevidas; uma pontuação CLS abaixo de 0,10 é considerada 'Boa'.

O CLS em um ambiente de laboratório é medido até o final do carregamento da página. Enquanto no campo, você pode medir o CLS até a primeira interação do usuário ou incluindo todas as entradas do usuário.

Para obter mais informações, [assista a este aprofundamento no CLS](https://youtu.be/zIJuY-JCjqw) por Annie Sullivan.

### Total Blocking Time (TBT) {: #tbt }

O [Total Blocking Time (TBT)](https://www.web.dev/tbt/) quantifica a capacidade de resposta da carga, medindo a quantidade total de tempo em que o encadeamento principal ficou bloqueado por tempo suficiente para evitar a capacidade de resposta da entrada. O TBT mede a quantidade total de tempo entre o First Contentful Paint (FCP) e o Time to Interactive (TTI). É uma métrica complementar ao TTI e traz mais nuances para quantificar a atividade do thread principal que bloqueia a capacidade do usuário de interagir com sua página.

Além disso, o TBT se correlaciona bem com a métrica de campo [First Input Delay](/fid/) (FID), que é um Core Web Vital.

## Atualização da pontuação de desempenho {: #score}

A [pontuação de desempenho no Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/) é calculada a partir de uma combinação ponderada de várias métricas para resumir a velocidade de uma página. Segue-se a fórmula de pontuação de desempenho 6.0.

&lt;style&gt; .lh-table {min-width: unset; } .lh-table td {min-width: unset; } &lt;/style&gt;

<table class="lh-table">
<thead><tr>
<th><strong>Estágio</strong></th>
<th><strong>Nome da métrica</strong></th>
<th><strong>Peso</strong></th>
</tr></thead>
<tbody>
<tr>
<td>Antecipado (15%)</td>
<td>First Contentful Paint (FCP)</td>
<td>15%</td>
</tr>
<tr>
<td>Médio (40%)</td>
<td>	Speed Index (SI)</td>
<td>15%</td>
</tr>
<tr>
<td></td>
<td>Largest Contentful Paint (LCP)</td>
<td>25%</td>
</tr>
<tr>
<td>Atrasado (15%)</td>
<td>Time To Interactive (TTI)</td>
<td>15%</td>
</tr>
<tr>
<td>Thread principal (25%)</td>
<td> (25%)	Total Blocking Time (TBT)</td>
<td>25%</td>
</tr>
<tr>
<td>Previsibilidade (5%)</td>
<td>Cumulative Layout Shift (CLS)</td>
<td>5%</td>
</tr>
</tbody>
</table>

Enquanto três novas métricas foram adicionadas, três antigas foram removidas: irst Meaningful Paint, First CPU Idle, and Max Potential FID. Os pesos das métricas restantes foram modificados para enfatizar a interatividade do thread principal e a previsibilidade do layout.

Para efeito de comparação, aqui está a pontuação da versão 5:

<table class="lh-table">
<thead><tr>
<th><strong>Estágio</strong></th>
<th><strong>Nome da métrica</strong></th>
<th><strong>Peso</strong></th>
</tr></thead>
<tbody>
<tr>
<td>Antecipado (23%)</td>
<td>Primeira pintura com conteúdo (FCP)</td>
<td>23%</td>
</tr>
<tr>
<td>Médio (34%)</td>
<td>Índice de velocidade (SI)</td>
<td>27%</td>
</tr>
<tr>
<td></td>
<td>Primeira pintura significativa (FMP)</td>
<td>7%</td>
</tr>
<tr>
<td>Concluído (46%)</td>
<td>Tempo de interação (TTI)</td>
<td>33%</td>
</tr>
<tr>
<td></td>
<td>Primeira CPU inativa (FCI)</td>
<td>13%</td>
</tr>
<tr>
<td>Thread principal (25%)</td>
<td>Max Potencial FID</td>
<td>0%</td>
</tr>
</tbody>
</table>

{% Img src="image/admin/gJnkac5fOfjOvmeLXdPO.png", alt="A pontuação do Lighthouse muda conforme as versões 5 e 6.", width="800", height="165" %}

Alguns destaques das mudanças de pontuação entre as versões 5 e 6 do Lighthouse:

- **O peso da TTI foi reduzido de 33% para 15%**. Isso foi uma resposta direta ao feedback do usuário sobre a variabilidade do TTI, bem como inconsistências nas otimizações de métricas, levando a melhorias na experiência do usuário. O TTI ainda é um sinal útil para quando uma página é totalmente interativa, no entanto, com o TBT como um complemento - a [variabilidade é reduzida](https://docs.google.com/document/d/1xCERB_X7PiP5RAZDwyIkODnIXoBk-Oo7Mi9266aEdGg/edit#heading=h.vkfjuiyx1s5l). Com essa mudança na pontuação, esperamos que os desenvolvedores sejam mais efetivamente incentivados a otimizar a interatividade do usuário.
- **O peso do FCP foi reduzido de 23% para 15%.** Medir apenas quando o primeiro pixel é pintado (FCP) não nos deu uma imagem completa. Combiná-lo com a medição de quando os usuários podem ver o que é mais importante para eles (LCP) reflete melhor a experiência de carregamento.
- **Max Potential FID** **foi descontinuado**. Não é mais mostrado no relatório, mas ainda está disponível no JSON. Agora é recomendado olhar para TBT para quantificar sua interatividade em vez de mpFID.
- **First Meaningful Paint foi descontinuada.** Essa métrica era muito variante e não tinha um caminho viável para a padronização, pois a implementação é específica para componentes internos de renderização do Chrome. Embora algumas equipes considerem que o tempo do FMP vale a pena em seus sites, a métrica não receberá melhorias adicionais.
- **First CPU Idle foi descontinuado** porque não é suficientemente distinto do TTI. TBT e TTI são agora as métricas de referência para interatividade.
- O peso do CLS é relativamente baixo, embora esperemos aumentá-lo em uma versão principal futura.

### Mudanças nas pontuações {: #score-shifts}

Como essas mudanças afetam as pontuações de sites reais? Publicamos uma [análise](https://docs.google.com/spreadsheets/d/1BZFh7AyyaLHCj5LGAbrn3m72ysu4yv8okyHG-f3MoXI/edit?usp=sharing) das mudanças de pontuação usando dois conjuntos de dados: um[conjunto geral de sites](https://gist.github.com/connorjclark/8afe673d4e7c6e17204834a256e7caf1) e um [conjunto de sites estáticos](https://gist.github.com/connorjclark/0be52464887ae3a6f29ad5a798122e0c#file-readme-md) construídos com [Eleventy](https://www.11ty.dev/). Em resumo, ~20% dos sites veem pontuações visivelmente mais altas, ~30% quase não apresentam alterações e ~50% veem uma diminuição de pelo menos cinco pontos.

As alterações de pontuação podem ser divididas em três componentes principais:

- mudanças de peso da pontuação
- correções de bugs para implementações de métricas subjacentes
- mudanças na curva de pontuação individual

As alterações no peso da pontuação e a introdução de três novas métricas impulsionaram a maioria das alterações na pontuação geral. Novas métricas que os desenvolvedores ainda precisam otimizar têm peso significativo na pontuação de desempenho da versão 6. Enquanto a pontuação média de desempenho do corpus de teste na versão 5 foi de cerca de 50, as pontuações médias nas novas métricas Total Blocking Time e Largest Contentful Paint foram em torno de 30. Juntas, essas duas métricas respondem por 50% do peso na pontuação de desempenho da versão 6 do Lighthouse, então, naturalmente, uma grande porcentagem de sites notou quedas.

Correções de bugs para o cálculo da métrica subjacente podem resultar em pontuações diferentes. Isso afeta relativamente poucos sites, mas pode ter um impacto considerável em certas situações. No geral, cerca de 8% dos sites experimentaram uma melhoria na pontuação devido às mudanças na implementação da métrica e cerca de 4% dos sites viram uma diminuição na pontuação devido às mudanças na implementação da métrica. Aproximadamente 88% dos sites não foram afetados por essas correções.

As mudanças na curva de pontuação individual também impactaram as mudanças na pontuação geral, embora muito ligeiramente. Nós garantimos periodicamente que a curva de pontuação se alinhe com as métricas observadas no [conjunto de dados HTTPArchive](http://httparchive.org/). Excluindo sites afetados por grandes mudanças de implementação, pequenos ajustes na curva de pontuação para métricas individuais melhoraram as pontuações de cerca de 3% dos sites e diminuíram as pontuações de cerca de 4% dos sites. Aproximadamente 93% dos sites não foram afetados por essa mudança.

### Calculadora de pontuação {: #calculator}

Publicamos uma [calculadora de pontuação](https://googlechrome.github.io/lighthouse/scorecalc/) para ajudá-lo a explorar a pontuação de desempenho. A calculadora também oferece uma comparação entre as pontuações das versões 5 e 6 do Lighthouse. Quando você executa uma auditoria com o Lighthouse 6.0, o relatório vem com um link para a calculadora com seus resultados preenchidos.

<figure>{% Img src="image/admin/N8cRFUnM526m3fB4GQVf.png", alt="Calculadora de pontuação do farol.", width="600", height="319" %} <figcaption>Um grande obrigado a <a href="https://twitter.com/anatudor">Ana Tudor</a> pela atualização do medidor!</figcaption></figure>

## Novas auditorias {: #new-audits}

### JavaScript não usado {: #unused-javascript}

Estamos aproveitando a [cobertura de código do DevTools](https://developer.chrome.com/docs/devtools/coverage/) em uma nova auditoria: [**JavaScript não utilizado**](/remove-unused-code/).

Esta auditoria não é *inteiramente* nova: ela foi [adicionada em meados de 2017](https://github.com/GoogleChrome/lighthouse/issues/1852#issuecomment-306900595), mas devido à sobrecarga de desempenho, foi desabilitada por padrão para manter o Farol o mais rápido possível. Coletar esses dados de cobertura é muito mais eficiente agora, então nos sentimos confortáveis ativando-o por padrão.

### Auditorias de acessibilidade {: #a11y}

A Lighthouse usa a maravilhosa [biblioteca do núcleo do machado](https://github.com/dequelabs/axe-core) para alimentar a categoria de acessibilidade. No Lighthouse 6.0, adicionamos as seguintes auditorias:

- [aria-hidden-body](/aria-hidden-body/)
- [aria-hidden-focus](/aria-hidden-focus/)
- [aria-input-field-name](/aria-input-field-name/)
- [aria-toggle-field-name](/aria-toggle-field-name/)
- [form-field-multiple-labels](/form-field-multiple-labels/)
- [heading-order](/heading-order/)
- [duplicate-id-active](/duplicate-id-active/)
- [duplicate-id-aria](/duplicate-id-aria/)

### Ícone mascarável {: #maskable-icon}

[Ícones mascaráveis](/maskable-icon/) são um novo formato de ícone que faz com que os ícones do seu PWA tenham uma ótima aparência em todos os tipos de dispositivos. Para ajudar seu PWA a ter a melhor aparência possível, introduzimos uma nova auditoria para verificar se seu manifest.json oferece suporte a esse novo formato.

### Declaração de Charset {: #charset}

O [elemento meta charset](https://developer.chrome.com/docs/lighthouse/best-practices/charset/) declara qual codificação de caracteres deve ser usada para interpretar um documento HTML. Se este elemento estiver faltando, ou se for declarado no final do documento, os navegadores empregam uma série de heurísticas para adivinhar qual codificação deve ser usada. Se um navegador adivinhar incorretamente e um elemento meta charset tardio for encontrado, o analisador geralmente descarta todo o trabalho feito até agora e é reiniciado, levando a experiências ruins para o usuário. Essa nova auditoria verifica se a página possui uma codificação de caracteres válida e se ela está definida antecipadamente.

## CI do Lighthouse {: #ci}

No [CDS em novembro passado](/lighthouse-evolution-cds-2019/#lighthouse-ci-alpha-release), anunciamos o [CI do Lighthouse](https://github.com/GoogleChrome/lighthouse-ci), o Node CLI e servidor de código aberto que rastreia os resultados do Lighthouse em cada commit em seu pipeline de integração contínua, e percorremos um longo caminho desde o lançamento alfa. O CI do Lighthouse agora tem suporte para vários provedores de CI, incluindo Travis, Circle, GitLab e GitHub Actions. As [imagens do docker](https://github.com/GoogleChrome/lighthouse-ci/tree/master/docs/recipes) prontas para implantar tornam a configuração uma brisa, e um redesenho abrangente do painel agora revela tendências em cada categoria e métrica no Lighthouse para análise detalhada.

Comece a usar o CI do Lighthouse em seu projeto hoje, seguindo nosso [guia de primeiros passos](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/getting-started.md).

<figure data-float="left">{% Img src="image/admin/sXnTzewqGuc84MOCzFJe.png", alt="CI do Lighthouse.", width="600", height="413", linkTo=true %}</figure>

<figure data-float="left">{% Img src="image/admin/uGT7AUJEQeqK1vlKySLb.png", alt="CI do Lighthouse.", width="600", height="412", linkTo=true %}</figure>

<figure>{% Img src="image/admin/ZR48KZebW43eyAvB1RkT.png", alt="CI do Lighthouse.", width="600", height="354", linkTo=true %}</figure>

## Painel do Chrome DevTools renomeado {: #devtools}

Renomeamos o painel **Audits** para o painel **Lighthouse.** Já disse o suficiente!

Dependendo do tamanho da janela do DevTools, o painel provavelmente está atrás do botão `»`. Você pode arrastar a guia para alterar a ordem.

Para revelar rapidamente o painel com o [menu Comando](https://developer.chrome.com/docs/devtools/command-menu/):

1. {% Instruction 'devtools', 'none' %}
2. {% Instruction 'devtools-command', 'none' %}
3. Comece a digitar "LIghthouse".
4. Pressione `Enter`.

## Emulação de celular {: #emulation}

O Lighthouse segue uma mentalidade que prioriza os dispositivos móveis. Os problemas de desempenho são mais aparentes em condições móveis típicas, mas os desenvolvedores geralmente não testam nessas condições. É por isso que a configuração padrão no Lighthouse aplica a emulação móvel. A emulação consiste em:

- Simulação de condições lentas de rede e CPU (por meio de um mecanismo de simulação chamado [Lantern](https://github.com/GoogleChrome/lighthouse/blob/master/docs/lantern.md)).
- Emulação de tela do dispositivo (o mesmo encontrado no Chrome DevTools).

Desde o início, a Lighthouse usou o Nexus 5X como seu dispositivo de referência. Nos últimos anos, a maioria dos engenheiros de desempenho tem usado o Moto G4 para fins de teste. Agora a Lighthouse está seguindo o exemplo e mudou seu dispositivo de referência para Moto G4. Na prática, essa alteração não é muito perceptível, mas aqui estão todas as alterações detectáveis por uma página da web:

- O tamanho da tela foi alterado de 412x660 px para 360x640 px.
- A string do agente do usuário foi ligeiramente alterada, a parte do dispositivo que era anteriormente `Nexus 5 Build/MRA58N` agora será `Moto G (4)`.

A partir do Chrome 81, o Moto G4 também está disponível na lista de emulação de dispositivos Chrome DevTools.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wMyHDbxs49CTJ831UBp7.png", alt="Lista de emulação de dispositivo Chrome DevTools com Moto G4 incluído.", width="800", height="653" %}</figure>

## Extensão do navegador {: #extension}

A [extensão do Chrome para o Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk) é uma maneira conveniente de executar o Lighthouse localmente. Infelizmente, era complicado de suportar. Sentimos que, como o paibnel **Lighthouse** do Chrome DevTools é uma experiência melhor (o relatório se integra a outros painéis), poderíamos reduzir nossa sobrecarga de engenharia simplificando a extensão do Chrome.

Em vez de executar o Lighthouse localmente, a extensão agora usa a [API PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/get-started). Reconhecemos que esta não será uma substituição suficiente para alguns de nossos usuários. Estas são as principais diferenças:

- O PageSpeed Insights não pode auditar sites não públicos, pois ele é executado por meio de um servidor remoto e não da instância local do Chrome. Se você precisar auditar um site não público, use o **painel DevTools Lighthouse** ou a Node CLI.
- Não é garantido que o PageSpeed Insights use a versão mais recente do Lighthouse. Se você quiser usar a versão mais recente, use o Node CLI. A extensão do navegador receberá a atualização cerca de 1 a 2 semanas após o lançamento.
- O PageSpeed Insights é uma API do Google, e seu uso implica na aceitação dos Termos de Serviço da API do Google. Se você não deseja ou não pode aceitar os termos de serviço, use o **painel DevTools Lighthouse** ou a Node CLI.

A boa notícia é que simplificar a história do produto nos permitiu focar em outros problemas de engenharia. Como resultado, lançamos a [extensão Lighthouse Firefox](https://addons.mozilla.org/en-US/firefox/addon/google-lighthouse/) !

## Orçamentos {: #budgets}

O Lighthouse 5.0 introduziu [orçamentos de desempenho](/performance-budgets-101/) que suportavam a adição de limites para [quanto de cada tipo de recurso](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md#resource-budgets) (como scripts, imagens ou css) uma página pode servir.

O Lighthouse 6.0 adiciona [suporte para métricas de orçamento](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md#timing-budgets), então agora você pode definir limites para métricas específicas, como FCP. Por enquanto, os orçamentos estão disponíveis apenas para Node CLI e Lighthouse CI.

## Links de localização da fonte {: #source-location}

Alguns dos problemas que o Lighthouse encontra sobre uma página podem ser rastreados até uma linha específica de código-fonte e o relatório indicará o arquivo e a linha exatos que são relevantes. Para facilitar a exploração no DevTools, clicar nos locais especificados no relatório abrirá os arquivos relevantes no painel **Fontes.**

<figure>
  <video autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/lighthouse-whats-new-6.0/lighthouse-source-location.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/lighthouse-whats-new-6.0/lighthouse-source-location.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>DevTools revela a linha exata de código que causa o problema.</figcaption></figure>

## No horizonte {: #horizon}

O Lighthouse começou a experimentar a coleta de mapas de origem para potencializar novos recursos, como:

- Detectando módulos duplicados em pacotes JavaScript.
- Detectando polyfills excessivos ou transformações no código enviado para navegadores modernos.
- Aumentando a auditoria de JavaScript não utilizado para fornecer granularidade em nível de módulo.
- Visualizações de mapa de árvore destacando os módulos que requerem ação.
- Exibindo o código-fonte original para itens de relatório com um "local de origem".

<figure>{% Img src="image/admin/iZPhM3KNQebgwCsgXTuf.png", alt="JavaScript não usado mostrando módulos de mapas de origem.", width="600", height="566" %} <figcaption>A auditoria de JavaScript não usado usando mapas de origem para mostrar o código não usado em módulos agrupados específicos.</figcaption></figure>

Esses recursos serão habilitados por padrão em uma versão futura do Lighthouse. Por enquanto, você pode ver as auditorias experimentais do Lighthouse com a seguinte sinalização CLI:

```bash
lighthouse https://web.dev --view --preset experimental
```

## Agradecimentos! {: #thanks }

Agradecemos por usar o Lighthouse e fornecer feedback. Seu feedback nos ajuda a melhorar o Lighthouse e esperamos que o Lighthouse 6.0 torne mais fácil para você melhorar o desempenho de seus sites.

O que você pode fazer a seguir?

- Abra o Chrome Canary e experimente o painel **Lighthouse.**
- Use a CLI do Node: `npm install -g lighthouse && lighthouse https://yoursite.com --view`.
- Faça o [CI do Lighthouse](https://github.com/GoogleChrome/lighthouse-ci#lighthouse-ci) funcionar com seu projeto.
- Revise a [documentação de auditoria](/learn/#lighthouse) do Lighthouse.
- Divirta-se tornando a web melhor!

Somos apaixonados pela web e adoramos trabalhar com a comunidade de desenvolvedores para criar ferramentas que ajudem a melhorar a web. O Lighthouse é um projeto de código aberto e agradecemos imensamente a todos os contribuidores que nos ajudaram em tudo, desde correções de erros de digitação e refatores de documentação a novas auditorias. [Interessado em contribuir?](https://github.com/GoogleChrome/lighthouse/blob/master/CONTRIBUTING.md) Passe pelo [repositório Lighthouse GitHub](https://github.com/GoogleChrome/lighthouse) .
