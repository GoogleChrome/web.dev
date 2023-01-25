---
layout: post
title: Como registrar um bom bug de navegador
subhead: |-
  Informar os fornecedores de navegadores sobre os problemas encontrados em seus navegadores
  é parte integrante da melhoria das plataformas da web!
authors:
  - robertnyman
  - petelepage
date: 2020-06-15
updated: 2020-06-15
description: |-
  Informar os fornecedores de navegadores sobre os problemas encontrados em seus navegadores
  é parte integrante da melhoria das plataformas da web!
tags:
  - blog
---

Reportar um bom bug não é difícil, mas dá um pouco de trabalho. O objetivo é facilitar encontrar o que está quebrado, chegar à causa raiz e, o mais importante, encontrar uma maneira de corrigi-lo. Os erros que progridem rapidamente tendem a ser fáceis de reproduzir com um comportamento esperado claro.

## Verifique se é um bug

A primeira etapa é descobrir qual deve ser o comportamento "correto".

### Qual é o comportamento correto?

Verifique os documentos API relevantes no [MDN](https://developer.mozilla.org/) ou tente encontrar especificações relacionadas. Essas informações podem ajudá-lo a decidir qual API está de fato quebrada, onde está quebrada e qual é o comportamento esperado.

### Funciona em um navegador diferente?

O comportamento que difere entre os navegadores geralmente é priorizado como um problema de interoperabilidade, especialmente quando o navegador que contém o bug é o único diferente. Tente testar nas versões mais recentes do Chrome, Firefox, Safari e Edge, possivelmente usando uma ferramenta como o [BrowserStack](https://www.browserstack.com/).

Se possível, verifique se a página não está se comportando de maneira diferente intencionalmente devido à detecção do agente do usuário. No Chrome DevTools, tente definir a [`User-Agent` do usuário para outro navegador](https://developer.chrome.com/docs/devtools/device-mode/override-user-agent/).

### Quebrou em um lançamento recente?

Isso funcionou como esperado no passado, mas quebrou em um lançamento recente do navegador? Essas "regressões" podem ser executadas muito mais rapidamente, especialmente se você informar um número de versão em que funcionou e uma versão em que falhou. Ferramentas como o [BrowserStack](https://www.browserstack.com/) podem facilitar a verificação de versões antigas do navegador e a [ferramenta bisect-builds](https://www.chromium.org/developers/bisect-builds-py) (para Chromium) permite pesquisar a alteração de forma muito eficiente.

Se um problema for uma regressão e puder ser reproduzido, a causa raiz geralmente pode ser encontrada e corrigida rapidamente.

### Outras pessoas estão vendo o mesmo problema?

Se você estiver tendo problemas, há uma boa chance de que outros desenvolvedores também estejam. Primeiro, tente pesquisar o bug no [Stack Overflow](http://stackoverflow.com/). Isso pode ajudá-lo a traduzir um problema abstrato em uma API específica quebrada e pode ajudá-lo a encontrar uma solução alternativa de curto prazo até que o bug seja corrigido.

## Isso já foi relatado antes?

Depois de ter uma ideia de qual é o bug, é hora de verificar se o bug já foi relatado, pesquisando no banco de dados de bugs do navegador.

- Navegadores baseados em Chromium: [https://crbug.com](https://crbug.com/)
- Firefox: [https://bugzilla.mozilla.org/](https://bugzilla.mozilla.org/)
- Navegadores baseados em Safari e WebKit: [https://bugs.webkit.org/](https://bugs.webkit.org/)

Se você encontrar um bug existente que descreva o problema, dê seu apoio marcando com estrela, adicionando como favorito ou comentando o bug. E, em muitos sites, você pode adicionar a si mesmo à lista CC e obter atualizações quando o bug mudar.

Se você decidir comentar sobre o bug, inclua informações sobre como o bug afeta seu site. Evite adicionar comentários no estilo "+1", pois os acompanhadores de bugs geralmente enviam e-mails para cada comentário.

## Reporte o bug

Se o bug não tiver sido relatado antes, é hora de comunicar ao fornecedor do navegador sobre ele.

### Crie um caso de teste minimizado {: #minified-test-case}

A Mozilla tem um ótimo artigo sobre [como criar um caso de teste minimizado](https://developer.mozilla.org/docs/Mozilla/QA/Reducing_testcases). Para resumir a história, embora uma descrição do problema seja um grande começo, nada se compara a oferecer uma demonstração vinculada no bug que mostra o problema. Para maximizar a chance de progresso rápido, o exemplo deve conter o mínimo possível de  código necessário para demonstrar o problema. Um exemplo mínimo de código é a primeira coisa que você pode fazer para aumentar as chances de seu bug ser corrigido.

Aqui estão algumas dicas para minimizar um caso de teste:

- Baixe a página da web, adicione [`<base href="https://original.url">`](https://developer.mozilla.org/docs/Web/HTML/Element/base) e verifique se o bug existe localmente. Isso pode exigir um servidor HTTPS ativo se o URL usar HTTPS.
- Teste os arquivos locais nas compilações mais recentes do maior número de navegadores que puder.
- Tente condensar tudo em um arquivo.
- Remova o código (começando com coisas que você sabe que são desnecessárias) até que o bug desapareça.
- Use o controle de versão para salvar seu trabalho e desfazer o que der errado.

#### Hospedar um caso de teste minimizado

Se você está procurando um bom lugar para hospedar seu caso de teste minimizado, existem vários bons lugares disponíveis:

- [Glitch](https://glitch.com)
- [JSBin](https://jsbin.com)
- [JSFiddle](https://jsfiddle.net)
- [CodePen](https://codepen.io)

Esteja ciente de que vários desses sites exibem conteúdo em um iframe, o que pode fazer com que recursos ou bugs se comportem de maneira diferente.

## Registrando seu problema

Depois de ter seu caso de teste minimizado, você está pronto para registrar esse bug. Vá até o site correto de acompanhamento de bugs e crie um novo problema.

- Navegadores baseados em Chromium - [https://crbug.com/new](https://crbug.com/new)
- Firefox - [https://bugzilla.mozilla.org/](https://bugzilla.mozilla.org/)
- Navegadores baseados em Safari e WebKit - [https://bugs.webkit.org/](https://bugs.webkit.org/)

### Forneça uma descrição clara e as etapas necessárias para reproduzir o problema

Primeiro, forneça uma descrição clara para ajudar os engenheiros a entender rapidamente qual é o problema e ajudar a fazer a triagem do problema.

```text
When installing a PWA using the `beforeinstallprompt.prompt()`, the
`appinstalled` event fires before the call to `prompt()` resolves.
```

Em seguida, forneça as etapas detalhadas necessárias para reproduzir o problema. É aqui que [entra o seu caso de teste reduzido](#minified-test-case).

```text
What steps will reproduce the problem?
1. Go to https://basic-pwa.glitch.me/, open DevTools and look at the
   console tab.
2. Click the Install button in the page, you might need to interact with
   the page a bit before it becomes enabled.
3. Click Install on the browser modal install confirmation.
```

E, finalmente, descreva o resultado *real* e *esperado* .

```text
What is the actual result? In the console:
0. INSTALL: Available (logged when `beforeinstallprompt` event fired)
1. INSTALL: Success (logged when `appinstalled` event fired)
2. INSTALL_PROMPT_RESPONSE: {outcome: "accepted", platform: "web"}
   (logged when beforeinstallprompt.prompt()` resolves)

What is the expected result? In the console:
0. INSTALL: Available (logged when `beforeinstallprompt` event fired)
1. INSTALL_PROMPT_RESPONSE: {outcome: "accepted", platform: "web"}
   (logged when beforeinstallprompt.prompt()` resolves)
2. INSTALL: Success (logged when `appinstalled` event fired)
```

Para obter mais informações, consulte as [diretrizes de redação de relatórios de bug](https://developer.mozilla.org/docs/Mozilla/QA/Bug_writing_guidelines) no MDN.

#### Bônus: adicione uma captura de tela ou screencast do problema

Embora não seja obrigatório, em alguns casos, pode ser útil adicionar uma captura de tela ou screencast do problema. Isso é especialmente útil nos casos em que os bugs possam exigir algumas etapas estranhas para serem reproduzidos. Poder ver o que acontece em um screencast ou em uma captura de tela frequentemente pode ser útil.

### Inclua os detalhes do ambiente

Alguns bugs são reproduzíveis apenas em determinados sistemas operacionais ou apenas em tipos específicos de monitores (por exemplo, baixo dpi ou alto dpi). Certifique-se de incluir os detalhes de todos os ambientes de teste usados.

### Envie o bug

Finalmente, envie o bug. Então, lembre-se de ficar de olho em seu e-mail para verificar eventuais respostas ao bug. Normalmente, durante a investigação e ao corrigir o bug, os engenheiros podem ter perguntas adicionais ou, se tiverem dificuldade em reproduzir o problema, eles podem entrar em contato.
