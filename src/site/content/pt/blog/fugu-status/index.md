---
layout: post
title: Status de novos recursos
subhead: Os aplicativos da Web devem ser capazes de fazer qualquer coisa que os aplicativos iOS, Android e desktop possam. Os membros do projeto de recursos entre empresas querem possibilitar que você crie e entregue aplicativos na web aberta que nunca foram possíveis antes.
date: 2018-11-12
updated: 2021-11-04
tags:
  - blog
  - capabilities
---

<figure data-float="right"> {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/uIIvM9xocYkjmBfHSrJE.svg", alt="A fugu fish, the logo of Project Fugu.", width="150", height="150" %}</figure>

O [projeto de recursos](https://developers.google.com/web/updates/capabilities) é um esforço entre empresas com o objetivo de possibilitar que os aplicativos da web façam qualquer coisa que os aplicativos iOS / Android / desktop podem, expondo os recursos dessas plataformas para a plataforma web, mantendo a segurança, privacidade e confiança do usuário e outros princípios básicos da web.

Este trabalho, entre muitos outros exemplos, permitiu que a [Adobe trouxesse o Photoshop para a web](/ps-on-the-web/), [Excalidraw para descontinuar seu aplicativo Electron](/deprecating-excalidraw-electron/) e [Betty Crocker para aumentar os indicadores de intenção de compra em 300%](/betty-crocker/).

Você pode ver a lista completa de recursos novos e potenciais e o estágio em que cada proposta se encontra no [Fugu API Tracker](https://goo.gle/fugu-api-tracker) . É importante notar que muitas ideias nunca passam do estágio de explicação ou de teste de origem. O objetivo do processo é enviar os recursos corretos. Isso significa que precisamos aprender e iterar rapidamente. Não enviar um recurso porque não resolve a necessidade do desenvolvedor está OK.

## Recursos disponíveis na versão estável {: #in-stable}

As seguintes APIs passaram do teste de origem e estão disponíveis na versão mais recente do Chrome e, em muitos casos, em outros navegadores baseados em Chromium.

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#shipped">Todas as APIs já enviadas</a>

## Recursos disponíveis como um teste de origem {: #origin-trial}

Essas APIs estão disponíveis como um [teste de origem](https://developers.chrome.com/origintrials/#/trials/active) no Chrome. Os testes de origem fornecem uma oportunidade para o Chrome validar recursos experimentais e APIs e possibilitar que você forneça feedback sobre sua usabilidade e eficácia em uma implantação mais ampla.

Optar por um teste de origem permite que você crie demonstrações e protótipos que seus usuários de teste beta podem experimentar durante o período de teste, sem exigir que eles mudem qualquer sinalizador em seus navegadores. Embora normalmente mais estável do que os recursos disponíveis por trás de uma bandeira (veja abaixo), ainda é possível que a superfície de uma API mude com base em seus comentários. Há mais informações sobre os testes de origem no [Guia de testes de origem para desenvolvedores da Web](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md).

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#origin-trial">Todas as APIs atualmente em teste de origem</a>

## Recursos disponíveis por trás de um sinalizador {: #flag}

Essas APIs estão disponíveis apenas atrás de um sinalizador. Eles são experimentais e ainda estão em desenvolvimento. Eles não estão prontos para uso na produção. Há uma boa chance de que haja bugs, que essas APIs apresentem problemas ou que a superfície da API mude.

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#started">Todas as APIs nas quais o trabalho foi iniciado</a>

## Recursos que são iniciados {: #started}

O trabalho nessas APIs acabou de começar. Não há muito para ver ainda, mas os desenvolvedores interessados podem querer marcar os bugs relevantes do Chromium para se manterem atualizados sobre o progresso que está sendo feito.

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#started">Todas as APIs nas quais o trabalho foi iniciado</a>

## Recursos que estão sob consideração {: #under-consideration}

Este é o backlog de APIs e ideias que ainda não fizemos. Vale a pena marcar com estrela os bugs relevantes do Chromium para votar em um recurso e ser informado assim que o trabalho começar.

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#under-consideration">Todas as APIs em consideração</a>

## Sugira um novo recurso {: #suggest-new}

Você tem uma sugestão para um recurso que você acha que o Chromium deveria levar em conta? Conte-nos sobre isso preenchendo um [pedido de novo recurso](https://goo.gl/qWhHXU). Lembre-se de incluir o máximo de detalhes possível, como o problema que você está tentando resolver, casos de uso sugeridos e qualquer outra coisa que possa ser útil.

{% Aside %} Quer experimentar alguns desses novos recursos? Confira o [Codelab de recursos da Web](https://developers.google.com/codelabs/project-fugu#0). {% endAside %}
