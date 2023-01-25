---
layout: post
title: Acessibilidade de cor e contraste
authors:
  - dgash
  - megginkearney
  - rachelandrew
  - robdodson
date: 2020-03-31
updated: 2020-05-29
description: |2-

  Se você tiver uma boa visão, é fácil presumir que todos percebem as cores ou a legibilidade do texto da mesma forma que você, mas é claro que não é o caso.
tags:
  - accessibility
---

Se você tiver uma boa visão, é fácil presumir que todos percebem as cores ou a legibilidade do texto da mesma forma que você, mas é claro que não é o caso.

Como você pode imaginar, algumas combinações de cores fáceis de ler para algumas pessoas são difíceis ou impossíveis para outras. Isso geralmente se resume ao contraste de cores, a relação entre a luminância das cores do primeiro plano e do plano de fundo. Quando as cores são semelhantes, a taxa de contraste é baixa. Caso contrário, a relação de contraste é alta.

As [diretrizes do WebAIM](https://webaim.org/standards/wcag/) recomendam uma taxa de contraste AA (mínima) de 4,5:1 para todo o texto. Uma exceção é feita para texto muito grande (120-150% maior do que o texto do corpo padrão), para o qual a proporção pode cair para 3:1. Observe a diferença nas taxas de contraste mostradas abaixo.

<figure>{% Img src="image/admin/DcYclKelVqhQ2CWlIG97.jpg", alt="Uma imagem mostrando as diferentes taxas de contraste", width="800", height="328" %}</figure>

A relação de contraste de 4,5:1 foi escolhida para o nível AA porque compensa a perda de sensibilidade de contraste normalmente experimentada por usuários com perda de visão equivalente a aproximadamente 20/40 de visão. A relação 20/40 é geralmente relatada como acuidade visual típica de pessoas por volta dos 80 anos. Para usuários com deficiência visual ou deficiência de cor, podemos aumentar o contraste até 7:1 para o texto do corpo.

Você pode usar a auditoria de acessibilidade no Lighthouse para verificar o contraste de cor. Abra DevTools, clique em Auditorias e selecione Acessibilidade para executar o relatório.

<figure>{% Img src="image/admin/vSFzNOurQO6z2xV6qWuW.png", alt="Uma captura de tela da saída de uma auditoria de contraste de cor.", width="800", height="218" %}</figure>

O Chrome também inclui um recurso experimental para ajudá-lo a [detectar todos os textos de baixo contraste de sua página](https://developers.google.com/web/updates/2020/10/devtools#css-overview). Você também pode usar a [sugestão de cor acessível](https://developers.google.com/web/updates/2020/08/devtools#accessible-color) para corrigir o texto de baixo contraste.

<figure>{% Img src="image/admin/VYZeK2l2vs6pIoWhH2hO.png", alt = "Uma captura de tela da saída do recurso experimental de texto de baixo contraste do Chrome.", width="800", height="521", class="w -screenshot" %}</figure>

Para um relatório mais completo, instale o [Accessibility Insights Extension](https://accessibilityinsights.io/). Uma das verificações no relatório Fastpass é o contraste de cores. Você receberá um relatório detalhado de todos os elementos com falha.

<figure>{% Img src="image/admin/CR21TFMZw8gWsSTWOGIF.jpg", alt="O relatório em Acessibilidade Insights", width="800", height="473" %}</figure>

## Algoritmo de contraste perceptual avançado (APCA)

O [Advanced Perceptual Contrast Algorithm (APCA)](https://w3c.github.io/silver/guidelines/methods/Method-font-characteristic-contrast.html) é uma nova maneira de calcular o contraste com base em pesquisas modernas sobre percepção de cores.

Em comparação com as [diretrizes AA](https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum)/[AAA](https://www.w3.org/WAI/WCAG21/quickref/#contrast-enhanced), a APCA é mais dependente do contexto.

O contraste é calculado com base nos seguintes recursos:

- Propriedades espaciais (peso da fonte e tamanho do texto)
- Cor do texto (diferença de claridade percebida entre o texto e o fundo)
- Contexto (luz ambiente, ambiente e finalidade do texto)

O Chrome inclui um [recurso experimental para substituir as diretrizes de relação de contraste AA/AAA por APCA](https://developers.google.com/web/updates/2021/01/devtools#apca).

<figure>{% Img src="image/admin/YhGKRLYvt37j3ldlwiXE.png", alt="Uma captura de tela da saída do recurso APCA no Chrome.", width="800", height="543" %}</figure>

## Não transmita informações apenas com cores

Existem cerca de 320 milhões de pessoas em todo o mundo com deficiência visual em cores. Cerca de 1 em 12 homens e 1 em 200 mulheres têm alguma forma de "daltonismo". Isso significa que cerca de 1/20, ou 5%, dos seus usuários não experimentarão o seu site da maneira desejada. Quando dependemos da cor para transmitir informações, elevamos esse número a níveis inaceitáveis.

{% Aside %} Observação: o termo "daltonismo" costuma ser usado para descrever uma condição visual em que uma pessoa tem dificuldade em distinguir as cores, mas na verdade muito poucas pessoas são realmente daltônicas. A maioria das pessoas com deficiências de cor pode ver algumas ou a maioria das cores, mas tem dificuldade em diferenciar certas cores, como vermelhos e verdes (mais comuns), marrons e laranjas e azuis e roxos. {% endAside %}

Por exemplo, em um formulário de entrada, um número de telefone pode ser sublinhado em vermelho para mostrar que é inválido. Mas para um usuário com deficiência de cor ou leitor de tela, essa informação não é transmitida bem, se é que é transmitida. Portanto, você deve sempre tentar fornecer vários caminhos para o usuário acessar informações críticas.

<figure style="width: 200px">{% Img src="image/admin/MKmlhejyjNpk7XE9R2KV.png", alt="Uma imagem de um formulário de entrada com um número de telefone incorreto destacado apenas com a cor vermelha.", width="293", height="323" %}</figure>

A [lista de verificação do WebAIM afirma na seção 1.4.1](https://webaim.org/standards/wcag/checklist#sc1.4.1) que "a cor não deve ser usada como o único método de transmissão de conteúdo ou distinção de elementos visuais." Além disso, destaca que "a cor por si só não deve ser usada para distinguir os links do texto ao redor", a menos que eles atendam a certos requisitos de contraste. Em vez disso, a lista de verificação recomenda adicionar um indicador adicional, como um sublinhado (usando a propriedade CSS `text-decoration`) para indicar quando o link está ativo.

Uma maneira fácil de corrigir o exemplo anterior é adicionar uma mensagem adicional ao campo, anunciando que é inválido e por quê.

<figure style="width: 200px">{% Img src="image/admin/FLQPcG16akNRoElx3pnz.png", alt="O mesmo formulário de entrada do último exemplo, desta vez com um rótulo de texto indicando o problema com o campo.", width="292", height= "343" %}</figure>

Ao criar um aplicativo, mantenha esse tipo de coisa em mente e preste atenção nas áreas em que você pode depender demais da cor para transmitir informações importantes.

Se você está curioso sobre a aparência do seu site para diferentes pessoas, ou se você depende muito do uso de cores em sua IU, você pode usar DevTools para simular várias formas de deficiência visual, incluindo diferentes tipos de daltonismo. O Chrome inclui um [recurso de emular deficiências de visão](https://developers.google.com/web/updates/2020/03/devtools#vision-deficiencies). Para acessá-lo, abra o DevTools e a **guia Rendering** no Drawer. Você pode emular as seguintes deficiências de cores.

- Protanopia: incapacidade de perceber qualquer luz vermelha.
- Deuteranopia: a incapacidade de perceber qualquer luz verde.
- Tritanopia: a incapacidade de perceber qualquer luz azul.
- Achromatopsia: incapacidade de perceber qualquer cor, exceto tons de cinza (extremamente raro).

<figure>{% Img src="image/admin/VAnFxYhzFcpovdTCToPl.jpg", alt="Emular a visão de uma pessoa com acromatopsia mostra nossa página em escala de cinza.", width="800", height="393", class="w -screenshot - preenchido" %}</figure>

## Modo de alto contraste

O modo de alto contraste permite ao usuário inverter as cores do primeiro plano e do plano de fundo, o que geralmente ajuda o texto a se destacar melhor. Para alguém com deficiência visual, o modo de alto contraste pode tornar muito mais fácil navegar pelo conteúdo da página. Existem algumas maneiras de obter uma configuração de alto contraste em sua máquina.

Sistemas operacionais como Mac OSX e Windows oferecem modos de alto contraste que podem ser ativados para tudo no nível do sistema.

Um exercício útil é ativar as configurações de alto contraste e verificar se toda a IU em seu aplicativo ainda está visível e utilizável.

Por exemplo, uma barra de navegação pode usar uma cor de fundo sutil para indicar qual página está selecionada no momento. Se você vê-lo em uma extensão de alto contraste, essa sutileza desaparece completamente, e com ela vai a compreensão do leitor de qual página está ativa.

<figure style="width: 500px">{% Img src="image/admin/dgmA4W1Qu8JmcgsH80HD.png", alt="Captura de tela de uma barra de navegação em modo de alto contraste em que a guia ativa é difícil de ler", width="640", height="57" %}</figure>

Da mesma forma, se você considerar o exemplo da lição anterior, o sublinhado vermelho no campo de número de telefone inválido pode ser exibido em uma cor azul esverdeada difícil de distinguir.

<figure>{% Img src="image/admin/HtlXwmHQHBcAO4LYSfAA.jpg", alt="Captura de tela do formulário de endereço usado anteriormente, desta vez em modo de alto contraste. A mudança de cor do elemento inválido é difícil de ler.", width="700", height="328" %}</figure>

Se você estiver atendendo às taxas de contraste abordadas anteriormente, não terá problemas com o suporte ao modo de alto contraste. Mas, para maior tranquilidade, considere instalar a [extensão de alto contraste do Chrome](https://chrome.google.com/webstore/detail/high-contrast/djcfdncoelnlbldjfhinnjlhdjlikmph) e dar uma olhada em sua página apenas para verificar se tudo funciona e está como esperado.
