---
title: O que é FLoC?
subhead: FLoC permite a seleção de anúncios sem compartilhar o comportamento de navegação de usuários individuais.
authors:
  - samdutton
date: 2021-03-30
updated: 2021-10-29
hero: image/80mq7dk16vVEg8BBhsVe42n6zn82/GA543wiVTwpbwp6Zmw0H.jpg
thumbnail: image/80mq7dk16vVEg8BBhsVe42n6zn82/OuORgPSvN06ntXT5xOii.jpg
alt: Murmuração de estorninhos sobre o cais de Brighton
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside %} Esta postagem descreve o design da API implementado no Chrome para a primeira versão de teste do FLoC.

Futuras iterações de uma API para permitir publicidade com base em interesses sem cookies de terceiros ou outros mecanismos de rastreamento entre sites estão atualmente em desenvolvimento. {% endAside %}

FLoC fornece um mecanismo de preservação de privacidade para a seleção de anúncios com base em interesses.

Conforme um usuário se move pela web, seu navegador usa o algoritmo FLoC para calcular sua "coorte de interesse", que será a mesma para milhares de navegadores com um histórico de navegação recente semelhante. O navegador recalcula seu coorte periodicamente, no dispositivo do usuário, sem compartilhar dados de navegação individuais com o fornecedor do navegador ou qualquer outra pessoa.

{% Aside %} Durante o teste FLoC inicial, uma visita à página só foi incluída no cálculo do FLoC do navegador por um de dois motivos:

- A API FLoC ( `document.interestCohort()`) é usada na página.
- O Chrome detecta que a página [carrega anúncios ou recursos relacionados a anúncios](https://github.com/WICG/floc/issues/82) .

Para outros algoritmos de agrupamento, o ensaio pode experimentar diferentes critérios de inclusão: isso faz parte do processo de experimento do ensaio de origem.

O teste de origem para a versão inicial do FLoC, que funcionou do Chrome 89 ao 91, [está encerrado](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561). {% endAside %}

Os anunciantes (sites que pagam por anúncios) podem incluir código em seus próprios sites para coletar e fornecer dados de coorte para suas plataformas adtech (empresas que fornecem software e ferramentas para veicular publicidade). Por exemplo, uma plataforma adtech pode aprender com uma loja de calçados online que os navegadores das coortes 1101 e 1354 parecem interessados nos equipamentos de caminhada da loja. De outros anunciantes, a plataforma adtech aprende sobre outros interesses dessas coortes.

Posteriormente, a plataforma de anúncios pode usar esses dados para selecionar anúncios relevantes (como um anúncio de botas de caminhada da loja de sapatos) quando um navegador de uma dessas coortes solicita uma página de um site que exibe anúncios, como um site de notícias.

O Privacy Sandbox é uma série de propostas para satisfazer os casos de uso de terceiros sem cookies de terceiros ou outros mecanismos de rastreamento. Consulte [Exploração da área de segurança da privacidade](/digging-into-the-privacy-sandbox) para obter uma visão geral de todas as propostas.

**Esta proposta precisa de seu feedback.** Se você tiver comentários, [crie um problema](https://github.com/WICG/floc/issues/new) no repositório [FLoC Explainer.](https://github.com/WICG/floc) Se você tiver comentários sobre o experimento do Chrome com esta proposta, poste uma resposta no [Intent to Experiment](https://groups.google.com/a/chromium.org/g/blink-dev/c/MmijXrmwrJs).

## Por que precisamos de FLoC?

Muitas empresas dependem da publicidade para direcionar o tráfego para seus sites, e muitos sites de editores financiam o conteúdo com a venda de inventário de publicidade. As pessoas geralmente preferem ver anúncios que sejam relevantes e úteis para elas, e anúncios relevantes também trazem mais negócios para os anunciantes e [mais receita para os sites que os hospedam](https://services.google.com/fh/files/misc/disabling_third-party_cookies_publisher_revenue.pdf). Em outras palavras, o espaço do anúncio é mais valioso quando exibe anúncios relevantes. Assim, a seleção de anúncios relevantes aumenta a receita de sites com anúncios. Isso, por sua vez, significa que anúncios relevantes ajudam a financiar a criação de conteúdo que beneficia os usuários.

No entanto, as pessoas estão preocupadas com as implicações de privacidade da publicidade personalizada, que atualmente depende de técnicas como cookies de rastreamento e impressão digital do dispositivo, que podem revelar seu histórico de navegação em sites para anunciantes ou plataformas de anúncios. A proposta do FLoC visa permitir a seleção de anúncios de uma forma que proteja melhor a privacidade.

## Para que o FLoC pode ser usado?

- Mostre anúncios para pessoas cujos navegadores pertencem a um grupo que costuma visitar o site de um anunciante ou mostra interesse em tópicos relevantes.
- Use modelos de aprendizado de máquina para prever a probabilidade de um usuário realizar uma conversão com base em seu coorte, a fim de informar o comportamento dos lances no leilão de anúncios.
- Recomendar conteúdo aos usuários. Por exemplo, suponha que um site de notícias observe que sua página de podcast de esportes se tornou especialmente popular entre os visitantes das coortes 1234 e 7. Eles podem recomendar esse conteúdo a outros visitantes dessas coortes.

## Como funciona o FLoC?

O exemplo abaixo descreve as diferentes funções na seleção de um anúncio usando FLoC.

- O **anunciante** (uma empresa que paga pela publicidade) neste exemplo é um varejista de calçados online:<br> **<u>calçados.exemplo</u>**

- O **editor** (um site que vende espaço de anúncio) no exemplo é um site de notícias:<br> **<u>jornal.exemplo</u>**

- A **plataforma adtech** (que fornece software e ferramentas para veicular publicidade) é:<br> **<u>redeanuncio.exemplo</u>**

{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/wnJ1fSECf5STngywgE7V.png", alt="Diagrama mostrando, passo a passo, as diferentes funções na seleção e entrega de um anúncio usando FLoC: serviço FLoC, navegador, anunciantes, editor (para observar coortes), Adtech, Editor (para exibir anúncios)", width="800", height="359" %}

Neste exemplo, chamamos os usuários de **Yoshi** e **Alex**. Inicialmente, seus navegadores pertencem à mesma coorte, 1354.

{% Aside %} Chamamos os usuários aqui de Yoshi e Alex, mas isso é apenas para fins de exemplo. Nomes e identidades individuais não são revelados ao anunciante, editor ou plataforma adtech com FLoC.

Não pense em uma coorte como um grupo de pessoas. Em vez disso, pense em um coorte como um agrupamento de atividades de navegação. {% endAside %}

### 1. Serviço FLoC

1. O serviço FLoC usado pelo navegador cria um modelo matemático com milhares de "coortes", cada uma correspondendo a milhares de navegadores com históricos de navegação recentes semelhantes. Mais sobre como isso funciona [abaixo](#floc-server).
2. Cada coorte recebe um número.

### 2. Navegador

1. Do serviço FLoC, o navegador de Yoshi obtém dados que descrevem o modelo FLoC.
2. O navegador de Yoshi calcula sua coorte [usando o algoritmo do modelo FLoC](#floc-algorithm) para calcular qual coorte corresponde mais de perto a seu próprio histórico de navegação. Neste exemplo, será a coorte 1354. Observe que o navegador de Yoshi não compartilha nenhum dado com o serviço FLoC.
3. Da mesma forma, o navegador de Alex calcula seu ID de coorte. O histórico de navegação de Alex é diferente do de Yoshi, mas semelhante o suficiente para que seus navegadores pertençam à coorte 1354.

### 3. Anunciante: <span style="font-weight:normal">calçado.exemplo</span>

1. Yoshi visita a <u>calçado.exemplo</u>.
2. O site pede ao navegador de Yoshi seu coorte: 1354.
3. Yoshi olha para as botas de caminhada.
4. O site registra que um navegador da coorte 1354 mostrou interesse em botas de caminhada.
5. O site posteriormente registra interesse adicional em seus produtos da coorte 1354, bem como de outras coortes.
6. O site agrega e compartilha periodicamente informações sobre coortes e interesses de produtos com sua plataforma <u>adtech redeanuncio.exemplo</u>.

Agora é a vez de Alex.

### 4. Editor: <span style="font-weight:normal">jornal.exemplo</span>

1. Alex visita <u>jornal.exemplo</u>.
2. O site pede ao navegador de Alex seu coorte.
3. O site então faz uma solicitação de anúncio para sua plataforma <u>adtech</u>, adnetwork.example, incluindo o coorte do navegador de Alex: 1354.

### 5. Plataforma <span style="font-weight:normal">Adtech: redeanuncio.exemplo</span>

1. <u>redeanuncio.exemplo</u> pode selecionar um anúncio adequado para Alex combinando os dados que possui do editor <u>jornal.exemplo</u> e do anunciante <u>calçado.exemplo</u>:

- Coorte do navegador de Alex (1354) fornecida por <u>jornal.exemplo</u>.
- Dados sobre coortes e interesses de produto da <u>loja</u> de sapatos.exemplo: "Os navegadores da coorte 1354 podem estar interessados em botas de caminhada."

1. <u>redeanuncio.exemplo</u> seleciona um anúncio apropriado para Alex: um anúncio de botas de caminhada em <u>calçado.exemplo</u>.
2. <u>jornal.exemplo</u> exibe o anúncio 🥾.

{% Aside %} As abordagens atuais para seleção de anúncios dependem de técnicas como cookies de rastreamento e impressão digital do dispositivo, que são usadas por terceiros, como anunciantes, para rastrear o comportamento de navegação individual.

Com o FLoC, o navegador **não compartilha** seu histórico de navegação com o serviço FLoC ou qualquer outra pessoa. O navegador, no dispositivo do usuário, determina a qual coorte ele pertence. O histórico de navegação do usuário nunca sai do dispositivo. {% endAside %}

## Quem executa o serviço de back-end que cria o modelo FLoC?

Cada fornecedor de navegador precisará fazer sua própria escolha de como agrupar os navegadores em grupos. O Chrome está executando seu próprio serviço FLoC; outros navegadores podem escolher implementar FLoC com uma abordagem de clustering diferente e executar seu próprio serviço para fazer isso.

## Como o serviço FLoC permite que o navegador trabalhe com seu coorte? {: #floc-server }

1. O serviço FLoC usado pelo navegador cria uma representação matemática multidimensional de todos os históricos de navegação na web em potencial. Chamaremos esse modelo de "espaço de coorte".
2. O serviço divide este espaço em milhares de segmentos. Cada segmento representa um grupo de milhares de históricos de navegação semelhantes. Esses agrupamentos não são baseados no conhecimento de qualquer histórico de navegação real; eles simplesmente se baseiam em escolher centros aleatórios no "espaço de coorte" ou cortar o espaço com linhas aleatórias.
3. Cada segmento recebe um número de coorte.
4. O navegador da web obtém esses dados que descrevem o "espaço de coorte" de seu serviço FLoC.
5. Conforme um usuário se move pela web, seu navegador [usa um algoritmo](#floc-algorithm) para calcular periodicamente a região no "espaço de coorte" que corresponde mais de perto ao seu próprio histórico de navegação.

<figure style="text-align: center">{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/32k5jByqLrgwSMwb9mqo.png", alt="Diagrama do 'espaço de histórico de navegação' criado por um servidor FLoC, mostrando vários segmentos, cada um com um número de coorte",  width="400", height="359" %} <figcaption>O serviço FLoC divide o "espaço de coorte" em milhares de segmentos (apenas alguns são mostrados aqui).</figcaption></figure>

{% Aside %} Em nenhum momento deste processo o histórico de navegação do usuário é compartilhado com o serviço FLoC ou qualquer terceiro. A coorte do navegador é calculada pelo navegador, no dispositivo do usuário. Nenhum dado do usuário é adquirido ou armazenado pelo serviço FLoC. {% endAside %}

## A coorte de um navegador pode mudar?

*Sim*! O coorte de um navegador definitivamente pode mudar! Você provavelmente não visita os mesmos sites todas as semanas, e o grupo de seu navegador refletirá isso.

Uma coorte representa um cluster de atividade de navegação, não um grupo de pessoas. As características de atividade de uma coorte geralmente são consistentes ao longo do tempo, e as coortes são úteis para a seleção de anúncios porque agrupam comportamentos de navegação recentes semelhantes. Os navegadores de cada pessoa entrarão e sairão de uma coorte conforme seu comportamento de navegação muda. Inicialmente, esperamos que o navegador recalcule sua coorte a cada sete dias.

No exemplo acima, o coorte dos navegadores de Yoshi e Alex é 1354. No futuro, os navegadores de Yoshi e Alex podem mudar para um coorte diferente se seus interesses mudarem. No exemplo abaixo, o navegador de Yoshi muda para a coorte 1101 e o navegador de Alex para a coorte 1378. Os navegadores de outras pessoas entram e saem das coortes conforme seus interesses de navegação mudam.

<figure style="text-align: center">{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/LMkb62V3iJTqkOrFACnM.png", alt="Diagrama do 'espaço de histórico de navegação' criado por um servidor FLoC, mostrando vários segmentos, cada um com um número de coorte. O diagrama mostra os navegadores pertencentes aos usuários Yoshi e Alex mudando de uma coorte para outra conforme seus interesses de navegação mudam com o tempo.", width="800", height="533"%}<figcaption> O grupo de navegadores de Yoshi e Alex pode mudar se seus interesses mudarem.</figcaption></figure>

{% Aside %} Um coorte define um agrupamento de atividades de navegação, não um grupo de pessoas. Os navegadores entram e saem de uma coorte conforme sua atividade muda. {% endAside %}

## Como o navegador funciona com seu coorte? {: #floc-algorithm }

Conforme descrito acima, o navegador do usuário obtém dados de seu serviço FLoC que descreve o modelo matemático para coortes: um espaço multidimensional que representa a atividade de navegação de todos os usuários. O navegador então usa um algoritmo para descobrir qual região desse "espaço de coorte" (ou seja, qual coorte) corresponde mais de perto ao seu próprio comportamento de navegação recente.

## Como o FLoC calcula o tamanho certo da coorte?

Haverá milhares de navegadores em cada coorte.

Um tamanho de coorte menor pode ser mais útil para personalizar anúncios, mas é menos provável que interrompa o rastreamento do usuário - e vice-versa. Um mecanismo para atribuir navegadores a coortes precisa fazer uma troca entre privacidade e utilidade. O Privacy Sandbox usa [k-anonimato](https://en.wikipedia.org/wiki/K-anonymity) para permitir que um usuário "se esconda no meio da multidão". Uma coorte é k-anônima se for compartilhada por pelo menos k usuários. Quanto mais alto o número k, maior a preservação da privacidade da coorte.

## O FLoC pode ser usado para agrupar pessoas com base em categorias sensíveis?

O algoritmo de agrupamento usado para construir o modelo de coorte FLoC é projetado para avaliar se uma coorte pode ser correlacionada com categorias sensíveis, sem aprender por que uma categoria é sensível. As coortes que podem revelar categorias sensíveis, como raça, sexualidade ou histórico médico, serão bloqueadas. Em outras palavras, ao trabalhar em sua coorte, um navegador só estará escolhendo entre coortes que não revelarão categorias sensíveis.

## O FLoC é apenas outra maneira de categorizar as pessoas online?

Com o FLoC, o navegador de um usuário pertencerá a uma das milhares de coortes, junto com milhares de navegadores de outros usuários. Ao contrário de cookies de terceiros e outros mecanismos de direcionamento, o FLoC apenas revela a coorte em que o navegador do usuário está, e não um ID de usuário individual. Não permite que outros distingam um indivíduo dentro de uma coorte. Além disso, as informações sobre a atividade de navegação que são usadas para resolver o coorte de um navegador são mantidas locais no navegador ou dispositivo e não são carregadas em outro lugar. O navegador pode aproveitar ainda mais outros métodos de anonimato, como [privacidade diferencial](https://en.wikipedia.org/wiki/Differential_privacy).

## Os sites precisam participar e compartilhar informações?

Os sites terão a capacidade de ativar ou desativar o FLoC, portanto, os sites sobre tópicos sensíveis poderão impedir que as visitas a seus sites sejam incluídas no cálculo do FLoC. Como proteção adicional, a análise do serviço FLoC avaliará se uma coorte pode revelar informações confidenciais sobre os usuários sem saber por que essa coorte é confidencial. Se uma coorte representar um número maior do que o normal de pessoas que visitam sites em uma categoria sensível, toda a coorte será removida. Situação financeira negativa e saúde mental estão entre as categorias sensíveis abrangidas por esta análise.

Os sites [podem excluir uma página do cálculo FLoC](https://github.com/WICG/floc#opting-out-of-computation) definindo um cabeçalho de [políticas de permissões](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/) `interest-cohort=()` para essa página. Para páginas que não foram excluídas, uma visita à página será incluída no cálculo FLoC do navegador se `document.interestCohort()` for usado na página. Durante o [teste de origem do FLoC](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561) atual, uma página também será incluída no cálculo se o Chrome detectar que a página [carrega anúncios ou recursos relacionados a anúncios](https://github.com/WICG/floc/issues/82). (A [marcação de anúncios no Chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/ad_tagging.md) explica como funciona o mecanismo de detecção de anúncios do Chrome.)

As páginas servidas a partir de endereços IP privados, como páginas da intranet, não farão parte do cálculo do FLoC.

## Como funciona a API FLoC JavaScript?

{% Aside %} O teste de origem para a versão inicial do FLoC, que funcionava do Chrome 89 ao 91, [foi encerrado](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561). {% endAside %}

A API FLoC é muito simples: apenas um único método que retorna uma promessa que é resolvida para um objeto que fornece o `id` coorte e a `version`:

```javascript
const { id, version } = await document.interestCohort();
console.log('FLoC ID:', id);
console.log('FLoC version:', version);
```

Os dados de coorte disponibilizados são assim:

```js
{
  id: "14159",
  version: "chrome.2.1"
}
```

O `version` permite que sites que usam FLoC saibam a qual navegador e a qual modelo FLoC o ID de coorte se refere. Conforme descrito abaixo, a promessa retornada por `document.interestCohort()` será rejeitada para qualquer frame que não tenha a permissão de `interest-cohort`

## Os sites podem optar por não serem incluídos no cálculo do FLoC?

A `interest-cohort` permite que um site declare que não deseja ser incluído na lista de sites do usuário para cálculo de coorte. A política será `allow` por padrão. A promessa retornada por `document.interestCohort()` rejeitará qualquer frame que não tenha permissão `interest-cohort`. Se o frame principal não tiver `interest-cohort`, a visita à página não será incluída no cálculo da coorte de interesse.

Por exemplo, um site pode cancelar todos os cálculos de coorte FLoC enviando o seguinte cabeçalho de resposta HTTP:

```text
  Permissions-Policy: interest-cohort=()
```

## Um usuário pode impedir que sites obtenham o coorte FLoC de seu navegador?

Se um usuário desativar o Privacy Sandbox em `chrome://settings/privacySandbox`, o navegador não fornecerá a coorte do usuário quando solicitada por JavaScript: a promessa retornada por `document.interestCohort()` será rejeitada.

## Como posso fazer sugestões ou fornecer feedback?

Se você tiver comentários sobre a API, [crie um problema](https://github.com/WICG/floc/issues/new) no repositório [FLoC Explainer.](https://github.com/WICG/floc)

## Descubra mais

- [Exploração da área de segurança da privacidade](/digging-into-the-privacy-sandbox/)
- [FLoC Explainer](https://github.com/WICG/floc)
- [FLoC Origin Trial &amp; Clustering](https://sites.google.com/a/chromium.org/dev/Home/chromium-privacy/privacy-sandbox/floc)
- [Avaliação de algoritmos de coorte para a API FLoC](https://github.com/google/ads-privacy/blob/master/proposals/FLoC/README.md)

---

Foto de [Rhys Kentish](https://unsplash.com/@rhyskentish) no [Unsplash](https://unsplash.com/photos/I5AYxsxSuVA).
