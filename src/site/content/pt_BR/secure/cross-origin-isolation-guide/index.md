---
layout: post
title: Um guia para permitir o isolamento da origem cruzada
authors:
  - agektmr
date: '2021-02-09'
updated: '2021-05-06'
subhead: O isolamento da origem cruzada permite que uma página web use recursos poderosos, como SharedArrayBuffer. Este artigo explica como habilitar o isolamento da origem cruzada no seu site.
description: O isolamento da origem cruzada permite que uma página web use recursos poderosos, como SharedArrayBuffer. Este artigo explica como habilitar o isolamento da origem cruzada no seu site.
tags:
  - security
---

Este guia mostra como habilitar o isolamento de origem cruzada. O isolamento de origem cruzada é necessário se você deseja usar [`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), [`performance.measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/), [cronômetro de alta resolução com melhor precisão](https://developer.chrome.com/blog/cross-origin-isolated-hr-timers/) ou a API JS Self-Profiling.

If you intend to enable cross-origin isolation, evaluate the impact this will have on other cross-origin resources on your website, such as ad placements.

{% Details %} {% DetailsSummary %} Determine where in your website `SharedArrayBuffer` is used

A partir do Chrome 92, as funcionalidades que usam `SharedArrayBuffer` não funcionarão mais sem o isolamento de origem cruzada. Se você acessou esta página devido a uma `SharedArrayBuffer`, é provável que seu site ou um dos recursos incorporados a ele esteja usando `SharedArrayBuffer`. Para garantir que nada seja interrompido em seu site devido à suspensão do uso, comece identificando onde ele é usado.

{% endDetailsSummary %}

{% Aside 'objective' %}

- Ative o isolamento de origem cruzada para continuar usando `SharedArrayBuffer`.
- Se você depende de código de terceiros que usa `SharedArrayBuffer`, notifique o provedor de terceiros para tomar providências. {% endAside %}

If you are not sure where in your site a `SharedArrayBuffer` is used, there are two ways find out:

- Using Chrome DevTools
- (Avançado) Usando Deprecation Reporting

Se você já sabe onde está usando `SharedArrayBuffer`, vá para [Analisar o impacto do isolamento de origem cruzada](#analysis) .

### Using Chrome DevTools

[Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/open) allows developers to inspect websites.

1. [Abra o Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/open) na página que você suspeita estar usando `SharedArrayBuffer`.
2. Select the **Console** panel.
3. Se a página estiver usando `SharedArrayBuffer`, a seguinte mensagem será exibida:
    ```text
    [Deprecation] SharedArrayBuffer will require cross-origin isolation as of M92, around May 2021. See https://developer.chrome.com/blog/enabling-shared-array-buffer/ for more details. common-bundle.js:535
    ```
4. O nome do arquivo e o número da linha no final da mensagem (por exemplo, `common-bundle.js:535`) indicam de onde o `SharedArrayBuffer` está vindo. Se for uma biblioteca de terceiros, entre em contato com o desenvolvedor para corrigir o problema. Se for implementado como parte do seu site, siga o guia abaixo para habilitar o isolamento de origem cruzada.

<figure class="w-figure"> {% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/GOgkyjAabePTc8AG22F7.png", alt="Aviso do console DevToools quando SharedArrayBuffer é usado sem isolamento de origem cruzada", width="800", height="163", class="w-screenshot" %}    <figcaption> Aviso do console DevToools quando SharedArrayBuffer é usado sem isolamento de origem cruzada. </figcaption></figure>

### (Avançado) Usando Deprecation Reporting

Alguns navegadores têm [uma funcionalidade que relata APIs deprecadas](https://wicg.github.io/deprecation-reporting/) para um determinado endpoint.

1. [Configure um servidor de relatório de deprecação e obtenha a URL do relatório](/coop-coep/#set-up-reporting-endpoint). Você pode conseguir isto usando um serviço público ou instalando um você mesmo.
2. Usando a URL, defina o seguinte cabeçalho HTTP para páginas que estão potencialmente servindo `SharedArrayBuffer`.
    ```http
    Report-To: {"group":"default","max_age":86400,"endpoints":[{"url":"THE_DEPRECATION_ENDPOINT_URL"}]}
    ```
3. Assim que o cabeçalho começar a se propagar, o endpoint no qual você se registrou deve começar a coletar relatórios de deprecação.

See an example implementation here: [https://first-party-test.glitch.me](https://first-party-test.glitch.me).

{% endDetails %}

## Analyze the impact of cross-origin isolation  {: #analysis}

Não seria ótimo se você pudesse avaliar o impacto que a ativação do isolamento de origem cruzada teria em seu site sem realmente quebrar nada? Os cabeçalhos HTTP [`Cross-Origin-Opener-Policy-Report-Only`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) e [`Cross-Origin-Embedder-Policy-Report-Only`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) permitem que você faça exatamente isso.

1. Set [`Cross-Origin-Opener-Policy-Report-Only: same-origin`](/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document) on your top-level document. As the name indicates, this header only sends reports about the impact that `COOP: same-origin` **would** have on your site—it won't actually disable communication with popup windows.
2. Configure relatórios e configure um servidor web para receber e salvar os relatórios.
3. Set [`Cross-Origin-Embedder-Policy-Report-Only: require-corp`](/coop-coep/#3.-use-the-coep-report-only-http-header-to-assess-embedded-resources) on your top-level document. Again, this header lets you see the impact of enabling `COEP: require-corp` without actually affecting your site's functioning yet. You can configure this header to send reports to the same reporting server that you set up in the previous step.

{% Aside %} You can also [enable the **Domain** column](https://developers.google.com/web/tools/chrome-devtools/network#information) in Chrome DevTools **Network** panel to get a general view of which resources would be impacted. {% endAside %}

{% Aside 'caution' %}

Enabling cross-origin isolation will block the loading of cross-origin resources that you don't explicitly opt-in, and it will prevent your top-level document from being able to communicate with popup windows.

Temos explorado maneiras de implantar a `Cross-Origin-Resource-Policy` em escala, já que o isolamento de origem cruzada requer que todos os sub-recursos optem por isso explicitamente. Então tivemos a ideia de ir na direção oposta: [um novo modo COEP "credentialess"](https://github.com/mikewest/credentiallessness/) que permite carregar recursos sem o cabeçalho CORP removendo todas as suas credenciais. Estamos descobrindo os detalhes de como isso deve funcionar, mas esperamos que isto alivie seu fardo de garantir que os sub-recursos estejam enviando o cabeçalho `Cross-Origin-Resource-Policy`

Além disso, sabe-se que o cabeçalho `Cross-Origin-Opener-Policy: same-origin` quebrará integrações que requerem interações de janela de origem cruzada, como OAuth e pagamentos. Para atenuar esse problema, estamos explorando o [relaxamento da condição](https://github.com/whatwg/html/issues/6364) para permitir o isolamento de origem `Cross-Origin-Opener-Policy: same-origin-allow-popups`. Desta forma, a comunicação com a janela aberta por ela mesma será possível.

Se você deseja habilitar o isolamento de origem cruzada, mas está impedido por esses desafios, recomendamos [registrar-se para um teste de origem](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial) e aguardar até que os novos modos estejam disponíveis. Não planejamos encerrar o teste de origem até que esses novos modos estejam disponíveis.

{% endAside %}

## Mitigação do impacto do isolamento de origem cruzada

Depois de determinar quais recursos serão afetados pelo isolamento de origem cruzada, aqui estão as diretrizes gerais de como você ativa esses recursos de origem cruzada:

1. Em recursos de origem cruzada, como imagens, scripts, folhas de estilo, iframes e outros, defina o cabeçalho [`Cross-Origin-Resource-Policy: cross-origin`](https://resourcepolicy.fyi/#cross-origin) Em recursos do mesmo site, defina o cabeçalho [`Cross-Origin-Resource-Policy: same-site`](https://resourcepolicy.fyi/#same-origin).
2. Defina o atributo `crossorigin` na tag HTML no documento de nível superior se o recurso for servido com [CORS](/cross-origin-resource-sharing/) (por exemplo, `<img src="example.jpg" crossorigin>` ).
3. If cross-origin resources loaded into iframes involve another layer of iframes, recursively apply steps described in this section before moving forward.
4. Depois de confirmar que todos os recursos de origem cruzada estão incluídos, defina o cabeçalho `Cross-Origin-Embedder-Policy: require-corp` nos recursos de origem cruzada carregados em iframes.
5. Certifique-se de que não haja janelas pop-up de origem cruzada que exijam comunicação por meio de `postMessage()`. Não há como mantê-los funcionando quando o isolamento de origem cruzada está habilitado. Você pode mover a comunicação para outro documento que não tenha isolamento de origem cruzada ou usar um método de comunicação diferente (por exemplo, solicitações HTTP).

## Ativação do isolamento de origem cruzada

Depois de ter mitigado o impacto através do isolamento de origem cruzada, aqui estão as diretrizes gerais para permitir o isolamento de origem cruzada:

1. Defina o cabeçalho `Cross-Origin-Opener-Policy: same-origin` em seu documento de nível superior. Se você configurou `Cross-Origin-Opener-Policy-Report-Only: same-origin`, substitua-o. Isto bloqueia a comunicação entre o documento de nível superior e suas janelas pop-up.
2. Defina o cabeçalho `Cross-Origin-Embedder-Policy: require-corp` em seu documento de nível superior. Se você configurou `Cross-Origin-Embedder-Policy-Report-Only: require-corp` , substitua-o. Isto bloqueará o carregamento de recursos de origem cruzada que não estejam ativados.
3. Verifique se `self.crossOriginIsolated` retorna `true` no console para verificar se sua página tem isolamento de origem cruzada.

{% Aside 'gotchas' %}

Habilitar o isolamento de origem cruzada em um servidor local pode ser doloroso, pois servidores simples não suportam o envio de cabeçalhos. Você pode iniciar o Chrome com um sinalizador de linha de comando `--enable-features=SharedArrayBuffer` para habilitar `SharedArrayBuffer` sem habilitar o isolamento de origem cruzada. Aprenda [a executar o Chrome com um sinalizador de linha de comando nas respectivas plataformas](https://www.chromium.org/developers/how-tos/run-chromium-with-flags).

{% endAside %}

## Resources

- [Deixando seu site com "isolamento de origem cruzada" usando COOP e COEP](/coop-coep/)
- [SharedArrayBuffer updates in Android Chrome 88 and Desktop Chrome 92](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
