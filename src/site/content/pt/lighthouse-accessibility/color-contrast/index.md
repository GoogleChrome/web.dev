---
layout: post
title: As cores de fundo e de primeiro plano não têm uma taxa de contraste suficiente
description: |-
  Aprenda como melhorar a acessibilidade de sua página da web certificando-se de que
  todo o texto tenha contraste de cor suficiente.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - contraste de cor
---

Textos com baixa taxa de contraste, ou seja, textos cujo brilho é muito próximo ao brilho do fundo, podem ser difíceis de ler. Por exemplo, apresentar um texto cinza claro em um fundo branco dificulta para os usuários distinguirem as formas dos caracteres, o que pode reduzir a compreensão da leitura e diminuir a velocidade de leitura.

Embora esse problema seja particularmente desafiador para pessoas com baixa visão, o texto de baixo contraste pode afetar negativamente a experiência de leitura de todos os seus usuários. Por exemplo, se você já leu algo em seu dispositivo móvel em um ambiente externo, provavelmente já percebeu a necessidade de um texto com contraste suficiente.

## Como a auditoria de contraste de cores do Lighthouse falha

O Lighthouse sinaliza o texto cujas cores de fundo e de primeiro plano não têm uma taxa de contraste suficientemente alta:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hD4Uc22QqAdrBLdRPhJe.png", alt="Auditoria do Lighthouse mostrando cque as cores de fundo e de primeiro plano não têm relação de contraste suficiente", width="800", height="343" %}</figure>

Para avaliar o contraste de cores do texto, o Lighthouse usa o <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">critério de sucesso 1.4.3 das WCAG 2.1</a> :

- Texto de 18 pt ou 14 pt e negrito precisam de uma taxa de contraste de 3:1.
- Todos os outros textos precisam de uma taxa de contraste de 4,5:1.

Devido à natureza da auditoria, o Lighthouse não pode verificar o contraste de cores do texto sobreposto em uma imagem.

{% Aside 'caution' %} Na versão 2.1, WCAG expandiu seus requisitos de contraste de cor para [incluir imagens e elementos da interface do usuário](https://www.w3.org/TR/WCAG21/#non-text-contrast) . O Lighthouse não verifica esses elementos, mas você deve fazer isso manualmente para garantir que todo o seu site seja acessível a pessoas com baixa capacidade de visão. {% endAside %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como garantir que o texto tenha contraste de cores suficiente

Certifique-se de que todo o texto em sua página atenda às taxas de contraste de cor mínimas <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">especificadas pela WCAG</a> :

- 3:1 para texto de 18 pt ou 14 pt e negrito
- 4.5:1 para todos os outros textos

Uma maneira de encontrar uma cor que atenda aos requisitos de contraste é usar o seletor de cores do Chrome DevTools:

1. Clique com o botão direito do mouse (ou pressione `Command` e clique no Mac) no elemento que deseja verificar e selecione **Inspecionar** .
2. Na guia **Estilos** **do painel Elementos** , encontre o valor de `color` do elemento.
3. Clique na miniatura colorida ao lado do valor.

O seletor de cores informa se o elemento atende aos requisitos de contraste de cor, levando em consideração o tamanho e o peso da fonte:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/osaU6NOcyElBALiXmRa5.png", alt="Captura de tela do seletor de cores Chrome DevTools com informações de contraste de cor destacadas", width="298", height="430" %}</figure>

Você pode usar o seletor de cores para ajustar a cor até que o contraste seja alto o suficiente. É mais fácil fazer ajustes no formato de cores HSL. Mude para esse formato clicando no botão de alternância à direita do seletor:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uUGdLr7fYCrmqtCrtpJK.png", alt="Captura de tela do seletor de cores Chrome DevTools com a chave de formatação de cores em destaque", width="298", height="430" %}</figure>

Depois de obter um valor de cor de passagem, atualize o CSS do seu projeto.

Casos mais complexos como texto sobre um gradiente ou texto sobre uma imagem precisam ser verificados manualmente, assim como os elementos e imagens da IU. Para texto em uma imagem, você pode usar o seletor de cor de fundo do DevTools para verificar o fundo em que o texto aparece:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PFznOtjzMF3nZy3IsCtW.png", alt="Captura de tela do seletor de cores de fundo do Chrome DevToolsr", width="301", height="431" %}</figure>

Para outros casos, considere o uso de uma ferramenta como o <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Analisador de contraste de cores</a> do Paciello Group.

## Recursos

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/color-contrast.js" rel="noopener">O código-fonte para a auditoria <strong>cores de fundo e de primeiro plano não tem de relação de contraste suficiente</strong></a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/color-contrast" rel="noopener">Os elementos de texto devem ter contraste de cor suficiente contra o fundo (Deque University)</a>
- <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Analisador de contraste de cor</a>
