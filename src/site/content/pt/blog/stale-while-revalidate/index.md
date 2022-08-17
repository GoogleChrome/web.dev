---
title: Manter as coisas atualizadas com stale-while-revalidate
subhead: Uma ferramenta adicional para ajudar você a equilibrar o imediatismo e a atualização ao veicular seu aplicativo da web.
authors:
  - jeffposnick
date: 2019-07-18
description: stale-while-revalidate ajuda os desenvolvedores a equilibrar o imediatismo   - carregar imediatamente o conteúdo em cache - e o frescor - garantir que as atualizações do conteúdo em cache sejam usadas no futuro.
hero: image/admin/skgQgcT3q8fdBGGNL3o1.jpg
alt: Uma fotografia de uma parede pintada pela metade.
tags:
  - blog
feedback:
  - api
---

## O que foi enviado?

[`stale-while-revalidate`](https://tools.ietf.org/html/rfc5861#section-3) ajuda os desenvolvedores a equilibrar o imediatismo - *carregar o conteúdo em cache imediatamente* - e o frescor - *garantir que as atualizações do conteúdo em cache sejam usadas no futuro*. Se você mantém um serviço da web ou biblioteca de terceiros que atualiza em uma programação regular, ou se seus ativos originais tendem a ter uma vida útil curta, então `stale-while-revalidate` pode ser uma adição útil às suas políticas de cache existentes.

O suporte para definir `stale-while-revalidate` junto com `max-age` em seu cabeçalho de resposta `Cache-Control` [está disponível no Chrome 75](https://chromestatus.com/feature/5050913014153216) e [Firefox 68](https://bugzilla.mozilla.org/show_bug.cgi?id=1536511).

Navegadores que não suportam `stale-while-revalidate` irão ignorar silenciosamente esse valor de configuração e usar [`max-age`](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#max-age), como explicarei em breve …

## O que isso significa?

Vamos dividir o `stale-while-revalidate` em duas partes: a ideia de que uma resposta em cache pode estar obsoleta e o processo de revalidação.

Primeiro, como o navegador sabe se uma resposta em cache está "obsoleta"? Um cabeçalho de resposta [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control) que contém `stale-while-revalidate` também deve conter `max-age`, e o número de segundos especificado por meio de `max-age` é o que determina a obsolescência. Qualquer resposta em cache mais recente que `max-age` é considerada nova e as respostas em cache mais antigas são obsoletas.

Se a resposta armazenada localmente em cache ainda estiver atualizada, ela poderá ser usada no estado em que se encontra para atender à solicitação de um navegador. Do ponto de vista de `stale-while-revalidate`, não há nada a fazer neste cenário.

Mas se a resposta em cache estiver desatualizada, é executada outra verificação com base na idade: a idade da resposta em cache dentro da janela de tempo é coberta pela configuração `stale-while-revalidate`

Se a idade de uma resposta desatualizada cair nessa janela, ela será usada para atender à solicitação do navegador. Ao mesmo tempo, uma solicitação de "revalidação" será feita contra a rede de uma forma que não atrase o uso da resposta em cache. A resposta retornada pode conter as mesmas informações que a resposta armazenada em cache anteriormente ou pode ser diferente. De qualquer maneira, a resposta da rede é armazenada localmente, substituindo tudo o que estava em cache anteriormente e redefinindo o temporizador de "atualização" usado durante todas as comparações `max-age`

No entanto, se a resposta em cache desatualizada for antiga o suficiente para ficar fora da `stale-while-revalidate`, ela não atenderá à solicitação do navegador. Em vez disso, o navegador recuperará uma resposta da rede e a usará para atender à solicitação inicial e também preencher o cache local com uma nova resposta.

## Exemplo ao Vivo

Abaixo está um exemplo simples de uma API HTTP para retornar a hora atual, mais especificamente, o número atual de minutos após a hora.

{% Glitch { id: 's-w-r-demo', path: 'server.js:20:15', height: 346 } %}

Nesse cenário, o servidor da web usa este `Cache-Control` em sua resposta HTTP:

```text
Cache-Control: max-age=1, stale-while-revalidate=59
```

Essa configuração significa que, se uma solicitação para o tempo for repetida no próximo segundo, o valor previamente armazenado em cache ainda será atualizado e usado como está, sem qualquer revalidação.

Se uma solicitação for repetida entre 1 e 60 segundos depois, o valor em cache ficará obsoleto, mas será usado para atender à solicitação da API. Ao mesmo tempo, "em segundo plano", uma solicitação de revalidação será feita para preencher o cache com um valor novo para uso futuro.

Se uma solicitação for repetida após mais de 60 segundos, a resposta desatualizada não será usada, e atender à solicitação do navegador e a revalidação do cache dependerá da obtenção de uma resposta da rede.

Aqui está uma análise desses três estados distintos, juntamente com a janela de tempo em que cada um deles se aplica ao nosso exemplo:

{% Img src="image/admin/C8lg2FSEqhTKR6WmYky3.svg", alt="Um diagrama ilustrando as informações da seção anterior.", width="719", height="370" %}

## Quais são os casos de uso comuns?

Embora o exemplo acima para um serviço de API "minutos após a hora" seja inventado, ele ilustra o caso de uso esperado: serviços que fornecem informações que precisam ser atualizadas, mas onde algum grau de desatualização é aceitável.

Exemplos menos planejados podem ser uma API para as condições meteorológicas atuais ou as principais manchetes que foram escritas na última hora.

Geralmente, qualquer resposta que seja atualizada em um intervalo conhecido, provavelmente será solicitada várias vezes e seja estática dentro desse intervalo, é uma boa candidata para armazenamento em cache de curto prazo via `max-age`. Usar `stale-while-revalidate` além de `max-age` aumenta a probabilidade de que solicitações futuras possam ser atendidas do cache com conteúdo mais recente, sem bloquear uma resposta da rede.

## Como ele interage com os service workers?

Se você já ouviu falar de `stale-while-revalidate`, é provável que tenha ocorrido no contexto de [receitas](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate) usadas por um [prestador de serviço](/service-workers-cache-storage/) .

O uso de stale-while-revalidate por meio de um `Cache-Control` compartilha algumas semelhanças com seu uso em um service worker, e muitas das mesmas considerações em torno de compensações de atualização e tempos de vida máximos se aplicam. No entanto, existem algumas considerações que você deve levar em consideração ao decidir se deve implementar uma abordagem baseada no service worker ou apenas contar com a configuração do cabeçalho `Cache-Control`

### Use uma abordagem baseada em service worker se

- Você já estiver usando um service worker em seu aplicativo da web.
- Você precisar de controle refinado sobre o conteúdo de seus caches e deseja implementar algo como uma política de expiração usada pelo menos recentemente. [O módulo de expiração de cache](https://developer.chrome.com/docs/workbox/modules/workbox-expiration/) do Workbox pode ajudar com isso.
- Você desejar ser notificado quando uma resposta desatualizada muda em segundo plano durante a etapa de revalidação. [O módulo Broadcast Cache Update](https://developer.chrome.com/docs/workbox/modules/workbox-broadcast-update/) da Workbox pode ajudar com isso.
- Você precisa desse `stale-while-revalidate` em todos os navegadores modernos.

### Use uma abordagem de controle de cache se

- Você preferir não lidar com a sobrecarga de implantação e manutenção de um service worker para seu aplicativo da web.
- Não houver problema em permitir que o gerenciamento automático de cache do navegador impeça que seus caches locais fiquem muito grandes.
- Você estiver satisfeito com uma abordagem que atualmente não é compatível com todos os navegadores modernos (desde julho de 2019; o suporte pode crescer no futuro).

Se você estiver usando um service worker e também tiver `stale-while-revalidate` habilitado para algumas respostas por meio de um `Cache-Control` , então o service worker terá, em geral, o "primeiro crack" ao responder a uma solicitação. Se o service worker decidir não responder ou se, no processo de geração de uma resposta, fizer uma solicitação de rede usando [`fetch()`](https://developer.mozilla.org/docs/Web/API/Fetch_API), o comportamento configurado por meio do `Cache-Control` entrará em vigor.

## Saber mais

- [resposta `stale-while-revalidate`](https://fetch.spec.whatwg.org/#concept-stale-while-revalidate-response) na especificação da API Fetch.
- [RFC 5861](https://tools.ietf.org/html/rfc5861), abordando a especificação `stale-while-revalidate`
- [O cache HTTP: sua primeira linha de defesa](/http-cache/) do guia "Confiabilidade da rede" deste site.

*Imagem do herói por Samuel Zeller.*
