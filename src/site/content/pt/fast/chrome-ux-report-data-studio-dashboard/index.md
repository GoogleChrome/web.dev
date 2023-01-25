---
layout: post
title: Uso do CrUX Dashboard no Data Studio
authors:
  - rviscomi
hero: image/admin/k3hWnnwqTvg7w7URsbIK.png
description: "\nData Studio é uma ferramenta poderosa de visualização de dados que permite construir \npainéis em cima de fontes de big data, como o Chrome UX Report. Nesse guia, aprenda a criar seu próprio painel CrUX personalizado para rastrear uma origem experiência de usuário."
date: 2020-06-22
updated: 2022-07-18
tags:
  - performance
  - blog
  - chrome-ux-report
---

O [Data Studio](https://marketingplatform.google.com/about/data-studio/) é uma ferramenta poderosa de visualização de dados que permite criar painéis em cima de fontes de big data, como o [Chrome UX Report](https://developer.chrome.com/docs/crux/) (CrUX). Neste guia, aprenda a criar seu próprio CrUX Dashboard personalizado para rastrear as tendências de experiência do usuário de uma origem.

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="Painel CrUX", width="800", height="598" %}

O Painel CrUX é construído com um recurso do Data Studio chamado [Community Connectors](https://developers.google.com/datastudio/connector/). Esse conector é um link preestabelecido entre os dados CrUX brutos do [BigQuery](https://console.cloud.google.com/bigquery?p=chrome-ux-report) e as visualizações do Data Studio. Ele elimina a necessidade dos usuários do painel de escrever quaisquer consultas ou gerar quaisquer gráficos. Tudo é feito para você; tudo que você precisa é fornecer uma origem e um painel personalizado será gerado para você.

## Criação de um painel

Para começar, acesse [g.co/chromeuxdash](https://g.co/chromeuxdash). Isso o levará para a página do conector da comunidade CrUX, onde você pode fornecer a origem para a qual o painel será gerado. Observe que os usuários iniciantes podem precisar preencher os prompts de permissão ou preferência de marketing.

{% Img src="image/admin/SSUqCau3HiN5qBbewX6h.png", alt="Conector do painel CrUX", width="800", height="484" %}

O campo de entrada de texto aceita apenas origens, não URLs completos. Por exemplo:

{% Compare 'melhor', 'Origem (suportado)' %}

```text
https://web.dev
```

{% endCompare %}

{% Compare 'pior', 'URL (não suportado)'%}

```text
https://web.dev/chrome-ux-report-data-studio-dashboard/
```

{% endCompare %}

Se você omitir o protocolo, o HTTPS será assumido. Subdomínios são importantes, por exemplo `https://developers.google.com` e `https://www.google.com` são considerados origens diferentes.

Alguns problemas comuns com as origens são fornecer o protocolo errado, por exemplo `http://` vez de `https://`, e omitir o subdomínio quando necessário. Alguns sites incluem redirecionamentos, portanto, se `http://example.com` redireciona para `https://www.example.com`, você deve usar o último, que é a versão canônica da origem. Como regra geral, use a origem que os usuários veem na barra de URL.

Se a sua origem não estiver incluída no conjunto de dados CrUX, você pode receber uma mensagem de erro como a mostrada abaixo. Existem mais de 4 milhões de origens no conjunto de dados, mas aquela que você deseja pode não ter dados suficientes para serem incluídos.

{% Img src="image/admin/qt0jWTgtdS93hDKW2SCm.png", alt="Mensagem de erro do Painel CrUX", width="800", height="409" %}

Se a origem existir, você será levado à página de esquema do painel. Isso mostra todos os campos incluídos: cada tipo de conexão efetiva, cada fator de forma, o mês do lançamento do conjunto de dados, a distribuição do desempenho de cada métrica e, claro, o nome da origem. Não há nada que você precise fazer ou alterar nesta página, basta clicar em **Criar relatório** para continuar.

{% Img src="image/admin/DTNigYO4gUwovCuCgyhH.png", alt="Esquema do Painel CrUX", width="800", height="403" %}

## Uso do painel

Cada painel vem com três tipos de páginas:

1. Visão geral do Core Web Vitals
2. Desempenho métrico
3. Dados demográficos do usuário

Cada página inclui um gráfico que mostra as distribuições ao longo do tempo para cada versão mensal disponível. Conforme novos conjuntos de dados são lançados, você pode simplesmente atualizar o painel para obter os dados mais recentes.

Os conjuntos de dados mensais são divulgados na segunda terça-feira de cada mês. Por exemplo, o conjunto de dados que consiste em dados de experiência do usuário do mês de maio é lançado na segunda terça-feira de junho.

### Visão geral do Core Web Vitals

A primeira página é uma visão geral do desempenho mensal do [Core Web Vitals](/vitals/) da origem. Essas são as métricas de experiência do usuário mais importantes nas quais o Google recomenda que você se concentre.

{% Img src="image/admin/h8iCTgvmG4DS2zScvatc.png", alt="Visão geral do Core Web Vitals do Painel CrUX", width="800", height="906" %}

Use a página Core Web Vitals para entender como a origem é experimentada por usuários de desktop e telefone. Por padrão, o mês mais recente no momento em que você criou o painel é selecionado. Para alternar entre lançamentos mensais mais antigos ou mais recentes, use o filtro **Mês** na parte superior da página.

Observe que o tablet é omitido desses gráficos por padrão, mas se necessário, você pode remover o filtro **Sem tablet** na configuração do gráfico de barras, mostrado abaixo.

{% Img src="image/admin/lD3eZ3LipJmBGmmkrUvG.png", alt="Editando o CrUX Dashboard para mostrar tablets na página Core Web Vitals", width="800", height="288" %}

### Desempenho métrico

Após a página Core Web Vitals, você encontrará páginas independentes para todas as [métricas](https://developer.chrome.com/docs/crux/methodology/#metrics) no conjunto de dados CrUX.

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="Página LCP do Painel CrUX", width="800", height="598" %}

No topo de cada página está o filtro **Dispositivo**, que você pode usar para restringir os fatores de forma incluídos nos dados de experiência. Por exemplo, você pode se aprofundar especificamente em experiências de telefone. Essa configuração persiste nas páginas.

As visualizações primárias nessas páginas são as distribuições mensais de experiências categorizadas como "Bom", "Precisa melhorar" e "Insuficiente". A legenda codificada por cores abaixo do gráfico indica a gama de experiências incluídas na categoria. Por exemplo, na captura de tela acima, você pode ver a porcentagem de experiências "boas" de [pintura com maior conteúdo](/lcp/#what-is-a-good-lcp-score) (LCP) flutuando e piorando um pouco nos últimos meses.

As porcentagens do mês mais recente de experiências "boas" e "ruins" são mostradas acima do gráfico, junto com um indicador da diferença percentual em relação ao mês anterior. Para esta origem, as experiências "boas" de LCP caíram 3,2%, para 56,04% mês a mês.

{% Aside 'caution' %} Devido a uma peculiaridade com o Data Studio, às vezes você pode ver `No Data` aqui. Isso é normal e devido ao lançamento do mês anterior não estar disponível até a segunda terça-feira. {% endAside %}

Além disso, para métricas como LCP e outros Core Web Vitals que fornecem recomendações explícitas de percentis, você encontrará a métrica "P75" entre as porcentagens "boas" e "ruins". Este valor corresponde ao 75º percentil da origem das experiências do usuário. Em outras palavras, 75% das experiências são melhores do que esse valor. Uma coisa a observar é que isso se aplica à distribuição geral em *todos os dispositivos* na origem. Alternar dispositivos específicos com o filtro **Dispositivo** não recalculará o percentil.

{% Details %} {% DetailsSummary %} Advertências técnicas enfadonhas sobre percentis {% endDetailsSummary%}

Esteja ciente de que as métricas de percentil são baseadas nos dados do histograma do [BigQuery](/chrome-ux-report-bigquery/), então a granularidade será grosseira: 1000 ms para LCP, 100 ms para FID e 0,05 para CLS. Em outras palavras, um P75 LCP de 3800 ms indica que o 75º percentil verdadeiro está em algum lugar entre 3800 ms e 3900 ms.

Além disso, o conjunto de dados do BigQuery usa uma técnica chamada "distribuição de bin", em que as densidades das experiências do usuário são intrinsecamente agrupadas em caixas muito grosseiras de granularidade decrescente. Isso nos permite incluir densidades minuto na cauda da distribuição sem ter que exceder quatro dígitos de precisão. Por exemplo, os valores LCP com menos de 3 segundos são agrupados em compartimentos de 200 ms de largura. Entre 3 e 10 segundos, os bins têm 500 ms de largura. Além de 10 segundos, as caixas têm 5.000 ms de largura, etc. Em vez de ter caixas de larguras variadas, a distribuição de caixas garante que todas as caixas tenham 100 ms de largura constante (o maior divisor comum) e a distribuição é interpolada linearmente em cada caixa.

Os valores P75 correspondentes em ferramentas como o PageSpeed Insights não são baseados no conjunto de dados público do BigQuery e podem fornecer valores de precisão de milissegundos. {% endDetails %}

### Dados demográficos do usuário

Existem duas [dimensões](https://developer.chrome.com/docs/crux/methodology/#dimensions) incluídas nas páginas demográficas do usuário: dispositivos e tipos de conexão efetiva (ECTs). Essas páginas ilustram a distribuição de visualizações de página em toda a origem para usuários em cada grupo demográfico.

A página de distribuição de dispositivos mostra a análise de usuários de telefones, desktops e tablets ao longo do tempo. Muitas origens tendem a ter poucos ou nenhum dado de tablet, então você verá "0%" pendurado na borda do gráfico.

{% Img src="image/admin/6PXh8MoQTWHnHXf8o1ZU.png", alt="Página de dispositivo do Painel CrUX", width="800", height="603" %}

Da mesma forma, a página de distribuição da ECT mostra a divisão de experiências 4G, 3G, 2G, 2G lentas e off-line.

{% Aside 'key-term' %} Os tipos de conexão eficazes são considerados *eficazes* porque são baseados em medições de largura de banda nos dispositivos dos usuários e não implicam em nenhuma tecnologia específica usada. Por exemplo, um usuário de desktop em Wi-Fi rápido pode ser rotulado como 4G, enquanto uma conexão móvel mais lenta pode ser rotulada como 2G. {% endAside %}

As distribuições para essas dimensões são calculadas usando segmentos dos dados do histograma do [First Contentful Paint](/fcp/) (FCP).

## Perguntas frequentes

### Quando devo usar o Painel CrUX em vez de outras ferramentas?

O Painel CrUX é baseado nos mesmos dados subjacentes disponíveis no BigQuery, mas você não precisa escrever uma única linha de SQL para extrair os dados e não precisa se preocupar em exceder as cotas gratuitas. Configurar um painel é rápido e fácil, todas as visualizações são geradas para você e você tem o controle para compartilhá-lo com quem quiser.

### Há alguma limitação no uso do Painel CrUX?

Ser baseado no BigQuery significa que o Painel CrUX também herda todas as suas limitações. É restrito a dados de nível de origem com granularidade mensal.

O Painel CrUX também troca parte da versatilidade dos dados brutos no BigQuery pela simplicidade e conveniência. Por exemplo, as distribuições de métricas são fornecidas apenas como "boas", "precisa de melhorias" e "ruins", em oposição aos histogramas completos. O Painel CrUX também fornece dados em um nível global, enquanto o conjunto de dados do BigQuery permite aumentar o zoom em países específicos.

### Onde posso aprender mais sobre o Data Studio?

Confira a [página de recursos do Data Studio](https://marketingplatform.google.com/about/data-studio/features/) para mais informações.
