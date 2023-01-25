---
layout: post
title: Pontos de toque acessíveis
authors:
  - dgash
  - megginkearney
  - rachelandrew
  - robdodson
date: 2020-03-31
updated: 2020-05-29
description: |2-

  É importante que os elementos interativos tenham espaço suficiente ao seu redor, quando usados em um dispositivo móvel ou em touchscreen. Isso ajudará a todos, mas especialmente aqueles com deficiência motora.
tags:
  - accessibility
---

Quando seu design é exibido em um dispositivo móvel, você deve garantir que os elementos interativos, como botões ou links, sejam grandes o bastante e tenham espaço suficiente ao redor deles, para torná-los fáceis de pressionar sem se sobrepor acidentalmente a outros elementos. Isso beneficia todos os usuários, mas é especialmente útil para qualquer pessoa com deficiência motora.

O tamanho mínimo recomendado do alvo de toque é de cerca de 48 pixels independentes de dispositivo em um site com uma janela de visualização móvel devidamente configurada. Por exemplo, embora um ícone possa ter apenas uma largura e altura de 24 px, você pode usar preenchimento adicional para aumentar o tamanho do ponto de toque para 48 px. A área de 48x48 pixels corresponde a cerca de 9 mm, que é aproximadamente o tamanho da área da almofada do dedo de uma pessoa.

Na demonstração, adicionei preenchimento a todos os links para garantir que eles atendam ao tamanho mínimo.

{% Glitch {id: 'tap-targets', path: 'index.html'}%}

Os alvos de toque também devem ter um espaçamento de cerca de 8 pixels, tanto horizontal quanto verticalmente, para que o dedo do usuário, ao pressionar um alvo, não toque inadvertidamente em outro alvo.

## Testando seus alvos de toque

Se seu destino for texto e você tiver usado valores relativos como `em` ou `rem` para dimensionar o texto e qualquer preenchimento, você pode usar DevTools para verificar se o valor calculado dessa área é grande o suficiente. No exemplo abaixo, estou usando `em` para meu texto e preenchimento.

{% Glitch {id: 'tap-targets-2', path: 'style.css'}%}

Inspecione o `a` do link e, no Chrome DevTools, mude para o [painel Computado,](https://developer.chrome.com/docs/devtools/css/overrides/#computed) onde você pode inspecionar as várias partes da caixa e ver para qual tamanho de pixel elas resolvem. No Firefox DevTools existe um painel de layout. Nesse painel você obtém o tamanho real do elemento inspecionado.

<figure style="max-width: 500px">{% Img src="image/admin/vmFzREveRttHVDfLqqCx.jpg", alt="O painel de layout no Firefox DevTools mostrando o tamanho de um elemento", width="800", height="565" %}</figure>

## Usando consultas de mídia para detectar o uso da tela sensível ao toque

Um dos recursos de mídia que agora podemos testar com consultas de mídia é se a entrada principal do usuário é uma tela sensível ao toque. O recurso de `pointer` `fine` ou `coarse`. Um apontador fino será alguém usando um mouse ou trackpad, mesmo se esse mouse estiver conectado via Bluetooth a um telefone. Um `coarse` indica uma tela sensível ao toque, que pode ser um dispositivo móvel, mas também pode ser uma tela de laptop ou tablet grande.

Se você estiver ajustando seu CSS em uma consulta de mídia para aumentar o alvo de toque, o teste de um ponteiro grosso permite aumentar os alvos de toque para todos os usuários de touchscreen. Isso fornece uma área de toque maior, seja o dispositivo um telefone ou um dispositivo maior, enquanto o teste de largura fornece apenas usuários móveis.

```css
.container a {
  padding: .2em;
}

@media (pointer: coarse) {
  .container a {
    padding: .8em;
  }
}
```

Você pode descobrir mais sobre os recursos de mídia de interação, como ponteiro, no artigo [Noções básicas sobre design da web responsivo.](/responsive-web-design-basics/)
