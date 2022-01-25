---
title: Monitoramento de desempenho com Lighthouse CI
subhead: Como adicionar o Lighthouse a um sistema de integração contínua, como o GitHub Actions.
authors:
  - katiehempenius
date: 2020-02-27
description: |2

  Aprenda como configurar o Lighthouse CI e integrá-lo aos fluxos de trabalho do desenvolvedor.
hero: image/admin/8q10N5o2xDA7YJKcefm5.png
alt: O Lighthouse CI exibido sobre uma captura de tela do Lighthouse CI Server
tags:
  - blog
  - performance
  - lighthouse
feedback:
  - api
---

O [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) é um conjunto de ferramentas para usar o Lighthouse durante a integração contínua. O Lighthouse CI pode ser incorporado aos fluxos de trabalho do desenvolvedor de muitas maneiras diferentes. Este guia aborda os seguintes tópicos:

- Usar o Lighthouse CI CLI.
- Configurar seu provedor de CI para executar o Lighthouse CI.
- Configurar um [GitHub Action](https://github.com/features/actions) e [verificação de status](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-status-checks) para o Lighthouse CI. Isso exibirá automaticamente os resultados do Lighthouse nas solicitações pull do GitHub.
- Construir um painel de desempenho e armazenamento de dados para relatórios do Lighthouse.

## Visão geral

O Lighthouse CI é um conjunto de ferramentas gratuitas que facilita o uso do Lighthouse para monitoramento de desempenho. Um único relatório do Lighthouse fornece um instantâneo do desempenho de uma página da web no momento em que é executado; o Lighthouse CI mostra como essas descobertas mudaram ao longo do tempo. Isso pode ser usado para identificar o impacto de alterações de códigos específicos ou garantir que os limites de desempenho sejam atendidos durante os processos de integração contínua. Embora o monitoramento de desempenho seja o caso de uso mais comum para o Lighthouse CI, ele pode ser usado para monitorar outros aspectos do relatório do Lighthouse — por exemplo, o SEO ou a acessibilidade.

A funcionalidade principal do Lighthouse CI é fornecida pela interface de linha de comando do Lighthouse CI. (Nota: esta é uma ferramenta separada do [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse#using-the-node-cli).) O Lighthouse CI CLI fornece um conjunto de [comandos](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#commands) para usar o Lighthouse CI. Por exemplo, o `autorun` executa várias execuções do Lighthouse, identifica o relatório do Lighthouse mediano e carrega o relatório para armazenamento. Esse comportamento pode ser bastante personalizado passando sinalizadores adicionais ou personalizando o arquivo de configuração do Lighthouse CI, `lighthouserc.js`.

Embora a funcionalidade principal do Lighthouse CI seja principalmente encapsulada no Lighthouse CI CLI, o Lighthouse CI é normalmente usado por meio de uma das seguintes abordagens:

- Executar o Lighthouse CI como parte da integração contínua
- Usar a ação Lighthouse CI do GitHub que executa e comenta cada solicitação pull
- Acompanhar o desempenho ao longo do tempo por meio do painel fornecido pelo Lighthouse Server.

Todas essas abordagens são baseadas no Lighthouse CI CLI.

Alternativas ao Lighthouse CI incluem serviços de monitoramento de desempenho de terceiros ou escrever seu próprio script para coletar dados de desempenho durante o processo de CI. Você deve considerar o uso de um serviço de terceiros se preferir deixar outra pessoa cuidar do gerenciamento de seu servidor de monitoramento de desempenho e dispositivos de teste, ou se desejar recursos de notificação (como e-mail ou integração com Slack) sem ter que construir estes recursos por conta própria.

## Use o Lighthouse CI localmente {: #cli }

Esta seção explica como executar e instalar o Lighthouse CI CLI localmente e como configurar o `lighthouserc.js`. Executar o Lighthouse CI CLI localmente é a maneira mais fácil de garantir que o `lighthouserc.js` esteja configurado corretamente.

1. Instale o Lighthouse CI CLI.

    ```shell
    npm install -g @lhci/cli
    ```

    O Lighthouse CI é configurado colocando um `lighthouserc.js` na raiz do repositório do seu projeto. Este arquivo é obrigatório e conterá informações de configuração relacionadas ao Lighthouse CI. Embora o Lighthouse CI possa ser [configurado para ser usado sem um repositório git](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#build-context), as instruções neste artigo presumem que seu repositório de projeto está configurado para usar git.

2. Na raiz do seu repositório, crie um [arquivo de configuração](https://github.com/GoogleChrome/lighthouse-ci/blob/v0.4.1/docs/configuration.md#configuration-file) `lighthouserc.js`.

    ```shell
    touch lighthouserc.js
    ```

3. Adicione o seguinte código ao `lighthouserc.js`. Este código é uma configuração do Lighthouse CI vazia. Você adicionará a esta configuração em etapas seguintes.

    ```js
    module.exports = {
      ci: {
        collect: {
          /* Add configuration here */
        },
        upload: {
          /* Add configuration here */
        },
      },
    };
    ```

4. Cada vez que o Lighthouse CI é executado, ele inicia um servidor para atender ao seu site. Esse servidor é o que permite que o Lighthouse carregue seu site mesmo quando nenhum outro servidor estiver em execução. Quando o Lighthouse CI terminar de ser executado, ele desligará automaticamente o servidor. Para garantir que o serviço funcione corretamente, você deve configurar as propriedades [`staticDistDir`](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#detecting-collectstaticdistdir) ou [`startServerCommand`](https://github.com/GoogleChrome/lighthouse-ci/blob/v0.4.1/docs/configuration.md#startservercommand).

    Se o seu site for estático, adicione a propriedade `staticDistDir` ao objeto `ci.collect` para indicar onde os arquivos estáticos estão localizados. O Lighthouse CI usará seu próprio servidor para atender esses arquivos enquanto testa seu site. Se o seu site não for estático, adicione a propriedade `startServerCommand` ao objeto `ci.collect` para indicar o comando que inicia o seu servidor. O Lighthouse CI iniciará um novo processo de servidor durante o teste e o encerrará depois.

    ```js
    // Static site example
    collect: {
      staticDistDir: './public',
    }
    ```

    ```js
    // Dynamic site example
    collect: {
      startServerCommand: 'npm run start',
    }
    ```

5. Adicione a propriedade [`url`](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#url) ao objeto `ci.collect` para indicar os URLs nos quais o Lighthouse CI deve executar o Lighthouse. O valor do `url` deve ser fornecido como uma matriz de URLs; esta matriz pode conter um ou mais URLs. Por padrão, o Lighthouse CI executará o Lighthouse três vezes em cada URL.

    ```js
    collect: {
      // ...
      url: ['http://localhost:8080']
    }
    ```

    Nota: Esses URLs devem ser servidos pelo servidor que você configurou na etapa anterior. Portanto, se você estiver executando o Lighthouse CI localmente, esses URLs provavelmente devem incluir `localhost` em vez de seu host de produção.

6. Adicione a propriedade [`target`](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#target) ao objeto `ci.upload` e defina o valor como `'temporary-public-storage'`. Os relatórios do Lighthouse coletados pelo Lighthouse CI serão feitos o upload para o armazenamento público temporário. O relatório permanecerá lá por sete dias e, em seguida, será excluído automaticamente. Este guia de configuração usa a opção de upload "armazenamento público temporário" porque é rápido de configurar. Para obter informações sobre outras maneiras de armazenar relatórios do Lighthouse, consulte a [documentação](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#target).

    ```js
    upload: {
      target: 'temporary-public-storage',
    }
    ```

    O local de armazenamento do relatório será semelhante a este:

    ```text
    https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1580152437799-46441.report.html
    ```

    (Este URL não funcionará porque o relatório já foi excluído.)

7. Execute o Lighthouse CI CLI do terminal usando o comando `autorun`. Isso executará o Lighthouse três vezes e fará o upload do relatório do Lighthouse mediano.

    ```shell
    lhci autorun
    ```

    Se você configurou o Lighthouse CI corretamente, a execução deste comando deve produzir uma saída semelhante a esta:

    ```shell
    ✅  .lighthouseci/ directory writable
    ✅  Configuration file found
    ✅  Chrome installation found
    ⚠️   GitHub token not set
    Healthcheck passed!

    Started a web server on port 65324...
    Running Lighthouse 3 time(s) on http://localhost:65324/index.html
    Run #1...done.
    Run #2...done.
    Run #3...done.
    Done running Lighthouse!

    Uploading median LHR of http://localhost:65324/index.html...success!
    Open the report at https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1591720514021-82403.report.html
    No GitHub token set, skipping GitHub status check.

    Done running autorun.
    ```

    Você pode ignorar o `GitHub token not set` na saída do console. Um token do GitHub é necessário apenas se você quiser usar o Lighthouse CI com uma ação do GitHub. Será explicado mais adiante neste artigo como configurar uma ação do GitHub.

    Clicar no link na saída que começa com `https://storage.googleapis.com...` levará você ao relatório do Lighthouse correspondente à execução do Lighthouse mediana.

    Os padrões usados pelo `autorun` podem ser substituídos por meio da linha de comando ou `lighthouserc.js`. Por exemplo, a configuração `lighthouserc.js` abaixo indica que cinco execuções do Lighthouse devem ser coletadas toda vez que o `autorun` for executado.

8. Atualize o `lighthouserc.js` para usar a propriedade `numberOfRuns`:

    ```js
    module.exports = {
        // ...
        collect: {
          numberOfRuns: 5
        },
      // ...
      },
    };
    ```

9. Execute novamente o comando `autorun`

    ```shell
    lhci autorun
    ```

    A saída do terminal deve mostrar que o Lighthouse foi executado cinco vezes, em vez das três por padrão:

    ```shell
    ✅  .lighthouseci/ directory writable
    ✅  Configuration file found
    ✅  Chrome installation found
    ⚠️   GitHub token not set
    Healthcheck passed!

    Automatically determined ./dist as `staticDistDir`.
    Set it explicitly in lighthouserc.json if incorrect.

    Started a web server on port 64444...
    Running Lighthouse 5 time(s) on http://localhost:64444/index.html
    Run #1...done.
    Run #2...done.
    Run #3...done.
    Run #4...done.
    Run #5...done.
    Done running Lighthouse!

    Uploading median LHR of http://localhost:64444/index.html...success!
    Open the report at https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1591716944028-6048.report.html
    No GitHub token set, skipping GitHub status check.

    Done running autorun.
    ```

    Para saber mais sobre outras opções de configuração, consulte a [documentação de configuração](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md) do Lighthouse CI.

## Configure seu processo de CI para executar o Lighthouse CI {: #ci-setup }

O Lighthouse CI pode ser usado com sua ferramenta de CI favorita. A seção [Configure seu provedor CI](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/getting-started.md#configure-your-ci-provider) da documentação do Lighthouse CI contém exemplos de código que mostram como incorporar o Lighthouse CI aos arquivos de configuração de ferramentas comuns de CI. Especificamente, esses exemplos de código mostram como executar o Lighthouse CI para coletar medições de desempenho durante o processo de CI.

Usar o Lighthouse CI para coletar medições de desempenho é um bom lugar para começar com o monitoramento de desempenho. No entanto, os usuários avançados podem querer ir um passo além e usar o Lighthouse CI para falhar em construções se não atenderem aos critérios predefinidos, como passar em auditorias do Lighthouse específicas ou cumprir todos os orçamentos de desempenho. Esse comportamento é configurado por meio da propriedade [`assert`](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#assert) do arquivo `lighthouserc.js`.

O Lighthouse CI oferece suporte a três níveis de afirmações:

- `off` : ignorar asserções
- `warn` : falhas de impressão para stderr
- `error` : falhas de impressão para stderr e sair do Lighthouse CI com um [código de saída](https://www.gnu.org/software/bash/manual/html_node/Exit-Status.html#:~:text=A%20non%2Dzero%20exit%20status,N%20as%20the%20exit%20status.) diferente de zero

Abaixo está um exemplo do `lighthouserc.js` que inclui asserções. Ele define afirmações para as pontuações das categorias de desempenho e acessibilidade do Lighthouse. Para tentar fazer isso, adicione as afirmações mostradas abaixo ao seu arquivo `lighthouserc.js` e execute novamente o Lighthouse CI.

```js
module.exports = {
  ci: {
    collect: {
      // ...
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 1}],
        'categories:accessibility': ['error', {minScore: 1}]
      }
    },
    upload: {
      // ...
    },
  },
};
```

A saída do console que ele gera é assim:

<figure>{% Img src="image/admin/ti9NuzxPKZCYVIzjjddc.png", alt="Captura de tela de uma mensagem de aviso gerada pelo Lighthouse CI", width="800", height="431" %}</figure>

Para obter mais informações sobre as afirmações do Lighthouse CI, consulte a [documentação](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/configuration.md#assert).

## Configure um GitHub Action para executar o Lighthouse CI {: #github-actions }

{% Aside %} Esta seção pressupõe que você esteja familiarizado com git, GitHub e solicitações pull do GitHub. {% endAside %}

Um [GitHub Action](https://github.com/features/actions) pode ser usado para executar o Lighthouse CI. Isso gerará um novo relatório do Lighthouse sempre que uma alteração de código for enviada a qualquer branch de um repositório do GitHub. Use isso em conjunto com uma [verificação de status](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-status-checks) para exibir esses resultados em cada solicitação pull.

<figure>{% Img src="image/admin/RZIfiOAPrst9Cxtxi9AX.png", alt="Captura de tela de uma verificação de status do GitHub", width="800", height="297" %}</figure>

1. Na raiz do seu repositório, crie um diretório chamado `.github/workflows`. Os [fluxos de trabalho](https://help.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#about-workflows) do seu projeto irão para este diretório. Um fluxo de trabalho é um processo executado em um momento predeterminado (por exemplo, quando o código é enviado) e é composto por uma ou mais ações.

    ```shell
    mkdir .github
    mkdir .github/workflows
    ```

2. Em `.github/workflows` crie um arquivo chamado `lighthouse-ci.yaml`. Este arquivo conterá a configuração para um novo fluxo de trabalho.

    ```shell
    touch lighthouse-ci.yaml
    ```

3. Adicione o seguinte texto a `lighthouse-ci.yaml`.

    ```yaml
    name: Build project and run Lighthouse CI
    on: [push]
    jobs:
      lhci:
        name: Lighthouse CI
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v1
          - name: Use Node.js 10.x
            uses: actions/setup-node@v1
            with:
              node-version: 10.x
          - name: npm install
            run: |
              npm install
          - name: run Lighthouse CI
            run: |
              npm install -g @lhci/cli@0.3.x
              lhci autorun --upload.target=temporary-public-storage || echo "LHCI failed!"
    ```

    Essa configuração define um fluxo de trabalho que consiste em um único trabalho que será executado sempre que um novo código for enviado ao repositório. Este trabalho tem quatro etapas:

    - Verifique o repositório no qual o Lighthouse CI será executado
    - Instale e configure o Nó
    - Instale os pacotes npm necessários
    - Execute o Lighthouse CI e carregue os resultados para o armazenamento público temporário.

4. Faça o commit dessas mudanças e envie-as para o GitHub. Se você seguiu corretamente as etapas acima, enviar o código para o GitHub iniciará a execução do fluxo de trabalho que você acabou de adicionar.

5. Para confirmar se o CI do Lighthouse foi acionado e visualizar o relatório gerado, acesse a guia **Ações** de seu projeto. Você deve ver o fluxo de trabalho **Projeto de construção e execução do Lighthouse CI** listados em seu commit mais recente.

    <figure>{% Img src="image/admin/ougavsYk6faiNidNxIGQ.png", alt="Captura de tela da guia 'Configurações' do GitHub", width="800", height="216" %}</figure>

    Você pode navegar até o relatório do Lighthouse correspondente a um commit específico na guia **Actions**. Clique no commit, clique na etapa de fluxo de trabalho **Lighthouse CI** e expanda os resultados da etapa de **execução do Lighthouse CI**.

    <figure>{% Img src="image/admin/aJF6FVHGOPpGNxKB3LjY.png", alt="Captura de tela da guia 'Configurações' do GitHub", width="800", height="366" %}</figure>

    Você acabou de configurar um GitHub Action para executar o Lighthouse CI. Isso será mais útil quando usado em conjunto com uma [verificação de status](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-status-checks) do GitHub.

### Configure uma verificação de status do GitHub {: #github-status-checks }

Uma verificação de status, se configurada, é uma mensagem que aparece em cada PR e geralmente inclui informações como os resultados de um teste ou o sucesso de uma construção.

<figure>{% Img src="image/admin/RZIfiOAPrst9Cxtxi9AX.png", alt="Captura de tela da guia 'Configurações' do GitHub", width="800", height="297" %}</figure>

As etapas abaixo explicam como configurar uma verificação de status para o Lighthouse CI.

1. Acesse a [página do aplicativo do GitHub Lighthouse CI](https://github.com/apps/lighthouse-ci) e clique em **Configurar**.

2. (Opcional) Se você faz parte de várias organizações no GitHub, escolha a organização que possui o repositório para o qual deseja usar o Lighthouse CI.

3. Selecione **Todos os repositórios** se quiser ativar o Lighthouse CI em todos os repositórios ou selecione **Selecionar apenas repositórios** se quiser usá-lo apenas em repositórios específicos e, em seguida, selecione os repositórios. Depois, clique em **Instalar e autorizar**.

4. Copie o token que for exibido. Você o usará na próxima etapa.

5. Para adicionar o token, navegue até a página **Configurações** do seu repositório do GitHub, clique em **Segredos** e em **Adicionar um novo segredo**.

    <figure>{% Img src="image/admin/ZYH9cOHehImZLI6vov1r.png", alt="Captura de tela da guia 'Configurações' do GitHub", width="800", height="375" %}</figure>

6. Defina o campo **Nome** para `LHCI_GITHUB_APP_TOKEN` e defina o campo **Valor** como o token que você copiou na última etapa e clique no botão **Adicionar segredo**.

7. A verificação de status está pronta para uso. Para testá-lo, [crie uma nova solicitação pull](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) ou envie um commit para uma solicitação pull existente.

## Configure o Lighthouse CI Server {: #server-setup }

O Lighthouse CI Server fornece um painel para explorar os relatórios históricos do Lighthouse. Ele também pode atuar como um armazenamento de dados privado de longo prazo para relatórios do Lighthouse.

<figure>{% Img src="image/admin/4xv6LLe6G48weVNl1CO1.png", alt="Captura de tela do painel do Lighthouse CI Server", width="800", height="581" %}</figure>

<figure>{% Img src="image/admin/vp9hVBQGZk01fUMpIQ1Z.png", alt="Captura de tela da comparação de dois relatórios do Lighthouse no Lighthouse CI Server", width="800", height="556" %}</figure>

1. Escolha quais commits comparar.
2. A quantidade de alteração da pontuação do Lighthouse entre os dois commits.
3. Esta seção mostra apenas as métricas que mudaram entre os dois commits.
4. As regressões são destacadas em rosa.
5. As melhorias são destacadas em azul.

O Lighthouse CI Server é mais adequado para usuários que se sentem confortáveis com a implantação e gerenciamento de sua própria infraestrutura.

Para obter informações sobre como configurar o Lighthouse CI Server, incluindo receitas para usar o Heroku e Docker para implantação, consulte estas [instruções](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/server.md).

## Descubra mais

- [Repositório do GitHub Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
