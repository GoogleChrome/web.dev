---
title: Como usar HTTPS para desenvolvimento local
subhead: Às vezes, você precisa executar seu site de desenvolvimento local com HTTPS. Ferramentas e dicas para fazer isso com segurança e rapidez.
authors:
  - maudn
date: 2021-01-25
hero: image/admin/ZvW6VM0GEScldWHBvXJ4.jpg
thumbnail: image/admin/OG8YksgOnzGfnurzncWO.jpg
tags:
  - blog
  - security
---

{% Aside 'caution' %} Na maioria das vezes, `http://localhost` faz o que você precisa: em navegadores, ele se comporta principalmente como HTTPS 🔒. É por isso que algumas APIs que não funcionam em um site HTTP implantado funcionarão em `http://localhost` .

Isso significa que você precisa usar HTTPS localmente **apenas em casos especiais** (consulte [Quando usar HTTPS para desenvolvimento local](/when-to-use-local-https) ), como nomes de host personalizados ou cookies seguros em navegadores. Continue lendo se for você! {% endAside %}

*Neste post, as instruções sobre `localhost` são válidas para `127.0.0.1` e `[::1]` também, uma vez que ambas descrevem o endereço do computador local, também chamado de "endereço de loopback". Além disso, para manter as coisas simples, o número da porta não é especificado.**Portanto, quando você vir `http://localhost` , leia-o como `http://localhost:{PORT}` ou `http://127.0.0.1:{PORT}` .*

Se o seu site de produção usa HTTPS, você deseja que seu site de desenvolvimento local se comporte **como um site HTTPS** (se o seu site de produção não usa HTTPS, [priorize a mudança para HTTPS](/why-https-matters/) ). Na maioria das vezes, você pode confiar que `http://localhost` se comportará **como um site HTTPS** . Mas, [em alguns casos](/when-to-use-local-https) , você precisa executar seu site localmente com HTTPS. Vamos dar uma olhada em como fazer isso.

**⏩ Você está procurando instruções rápidas ou já esteve aqui antes? Pule para o [Cheatsheet](#using-mkcert-cheatsheet).**

## Execução local do seu site com HTTPS usando mkcert (recomendado)

Para usar HTTPS com seu site de desenvolvimento local e acessar `https://localhost` ou `https://mysite.example` (nome de host personalizado), você precisa de um [certificado TLS](https://en.wikipedia.org/wiki/Public_key_certificate#TLS/SSL_server_certificate). Mas os navegadores não consideram qualquer certificado válido: seu certificado precisa ser **assinado** por uma entidade confiável para o seu navegador, chamada **[autoridade de certificação](https://en.wikipedia.org/wiki/Certificate_authority)** confiável (CA).

O que você precisa fazer é criar um certificado e assiná-lo com uma CA que seja **confiável localmente** para seu dispositivo e navegador. [mkcert](https://github.com/FiloSottile/mkcert) é uma ferramenta que ajuda você a fazer isso em alguns comandos. Funciona assim:

- Se você abrir seu site em execução localmente em seu navegador usando HTTPS, seu navegador verificará o certificado de seu servidor de desenvolvimento local.
- Ao ver que o certificado foi assinado pela autoridade de certificação gerada pelo mkcert, o navegador verifica se está registrado como uma autoridade de certificação confiável.
- mkcert é listado como uma autoridade confiável, portanto, seu navegador confia no certificado e cria uma conexão HTTPS.

<figure>{% Img src="image/admin/3kdjci7NORnOw54fMia9.jpg", alt="Um diagrama de como o mkcert funciona.", width="800", height="787" %}<figcaption> Um diagrama de como funciona o mkcert.</figcaption></figure>

mkcert (e ferramentas semelhantes) fornecem vários benefícios:

- mkcert é especializado na criação de certificados que são **compatíveis com o que os navegadores consideram certificados válidos**. Ele permanece atualizado para atender aos requisitos e práticas recomendadas. É por isso que você não terá que executar comandos mkcert com configurações ou argumentos complexos para gerar os certificados corretos!
- mkcert é uma ferramenta de plataforma cruzada. Qualquer pessoa da sua equipe pode usá-lo.

mkcert é a ferramenta que recomendamos para criar um certificado TLS para desenvolvimento local. Você pode verificar [outras opções](#running-your-site-locally-with-https-other-options) também.

Muitos sistemas operacionais podem incluir bibliotecas para produzir certificados, como o [openssl](https://www.openssl.org/). Ao contrário do mkcert e ferramentas semelhantes, essas bibliotecas podem não produzir certificados corretos de maneira consistente, podem exigir a execução de comandos complexos e não são necessariamente multiplataforma.

{% Aside 'gotchas' %} O mkcert em que estamos interessados nesta postagem é [este](https://github.com/FiloSottile/mkcert), não [este](https://www.npmjs.com/package/mkcert). {% endAside %}

### Cuidado

{% Aside 'caution' %}

- Nunca exporte ou compartilhe o arquivo `rootCA-key.pem` que o mkcert cria automaticamente quando você executa `mkcert -install`. **Um invasor que obtiver esse arquivo pode criar ataques no caminho para qualquer site que você esteja visitando**. Eles podem interceptar solicitações seguras de sua máquina para qualquer site — seu banco, provedor de saúde ou redes sociais. Se você precisa saber onde `rootCA-key.pem` está localizado para ter certeza de que é seguro, execute `mkcert -CAROOT`.
- Use mkcert apenas para **fins de desenvolvimento** — e, por extensão, nunca peça aos usuários finais para executar comandos mkcert.
- Equipes de desenvolvimento: todos os membros de sua equipe devem instalar e executar o mkcert **separadamente** (não armazenar e compartilhar a CA e o certificado).

{% endAside %}

### Configuração

1. Instale o mkcert (apenas uma vez).

    Siga as [instruções](https://github.com/FiloSottile/mkcert#installation) para instalar o mkcert em seu sistema operacional. Por exemplo, no macOS:

    ```bash
    brew install mkcert
    brew install nss # se usa o Firefox
    ```

2. Adicione mkcert às suas CAs raiz locais.

    Em seu terminal, execute o seguinte comando:

    ```bash
    mkcert -install
    ```

    Isso gera uma autoridade de certificação local (CA). Sua CA local gerada pelo mkcert é confiável apenas **localmente**, no seu dispositivo.

3. Gere um certificado para o seu site, assinado por mkcert.

    Em seu terminal, navegue até o diretório raiz do seu site ou qualquer diretório em que você gostaria que os certificados estivessem localizados.

    Em seguida, execute:

    ```bash
    mkcert localhost
    ```

    Se você estiver usando um nome de host personalizado como `mysite.example`, execute:

    ```bash
    mkcert mysite.example
    ```

    O comando acima faz duas coisas:

    - Gera um certificado para o nome de host que você especificou
    - Permite que mkcert (que você adicionou como uma CA local na Etapa 2) assine este certificado.

    Agora, seu certificado está pronto e assinado por uma autoridade de certificação em que seu navegador confia localmente. Você está quase terminando, mas seu servidor ainda não sabe sobre o seu certificado!

4. Configure seu servidor.

    Agora você precisa dizer ao seu servidor para usar HTTPS (já que os servidores de desenvolvimento tendem a usar HTTP por padrão) e usar o certificado TLS que você acabou de criar.

    Como fazer isso depende exatamente do seu servidor. Alguns exemplos:

    **👩🏻‍💻 Com nó:**

    `server.js` (substitua `{PATH/TO/CERTIFICATE...}` e `{PORT}`):

    ```javascript
    const https = require('https');
    const fs = require('fs');
    const options = {
      key: fs.readFileSync('{PATH/TO/CERTIFICATE-KEY-FILENAME}.pem'),
      cert: fs.readFileSync('{PATH/TO/CERTIFICATE-FILENAME}.pem'),
    };
    https
      .createServer(options, function (req, res) {
        // server code
      })
      .listen({PORT});
    ```

    **👩🏻‍💻 Com [servidor http](https://www.npmjs.com/package/http-server) :**

    Inicie seu servidor da seguinte maneira (substitua `{PATH/TO/CERTIFICATE...}`):

    ```bash
    http-server -S -C {PATH/TO/CERTIFICATE-FILENAME}.pem -K {PATH/TO/CERTIFICATE-KEY-FILENAME}.pem
    ```

    `-S` executa seu servidor com HTTPS, enquanto `-C` define o certificado e `-K` define a chave.

    **👩🏻‍💻 Com um servidor de desenvolvimento React:**

    Edite seu `package.json` seguinte maneira e substitua `{PATH/TO/CERTIFICATE...}`:

    ```json
    "scripts": {
    "start": "HTTPS=true SSL_CRT_FILE={PATH/TO/CERTIFICATE-FILENAME}.pem SSL_KEY_FILE={PATH/TO/CERTIFICATE-KEY-FILENAME}.pem react-scripts start"
    ```

    Por exemplo, se você criou um certificado para `localhost` localizado no diretório raiz do seu site da seguinte maneira:

    ```text
    |-- my-react-app
        |-- package.json
        |-- localhost.pem
        |-- localhost-key.pem
        |--...
    ```

    Então, seu `start` deve ser parecido com este:

    ```json
    "scripts": {
        "start": "HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem react-scripts start"
    ```

    **👩🏻‍💻 Outros exemplos:**

    - [Servidor de desenvolvimento angular](https://angular.io/cli/serve)
    - [Python](https://blog.anvileight.com/posts/simple-python-http-server/)

5. ✨ Você está pronto! Abra `https://localhost` ou `https://mysite.example` em seu navegador: você está executando seu site localmente com HTTPS. Você não verá nenhum aviso do navegador, porque seu navegador confia no mkcert como uma autoridade de certificação local.

{% Aside %} Seu servidor pode usar uma porta diferente para HTTPS. {% endAside %}

### Usando mkcert: cheatsheet

{% Details %} {% DetailsSummary %} mkcert em resumo {% endDetailsSummary %}

Para executar seu site de desenvolvimento local com HTTPS:

1. Configure o mkcert.

    Se ainda não o fez, instale o mkcert, por exemplo, no macOS:

    ```bash
    brew install mkcert

    ```

    Verifique as [instruções de instalação do mkcert](https://github.com/FiloSottile/mkcert#installation) para Windows e Linux.

    Em seguida, crie uma autoridade de certificação local:

    ```bash
    mkcert -install
    ```

2. Crie um certificado confiável.

    ```bash
    mkcert {SEU HOSTNAME, por ex., hostlocal ou meusite.exemplo}
    ```

    Isso cria um certificado válido (que será assinado por `mkcert` automaticamente).

3. Configure seu servidor de desenvolvimento para usar HTTPS e o certificado que você criou na Etapa 2.

4. ✨ Você está pronto! Agora você pode acessar `https://{YOUR HOSTNAME}` em seu navegador, sem avisos

{% Aside 'caution' %}

Faça isso apenas para **fins de desenvolvimento** e **nunca exporte ou compartilhe** o arquivo `rootCA-key.pem` (se você precisa saber onde este arquivo está localizado para ter certeza de que é seguro, execute `mkcert -CAROOT`).

{% endAside %}

{% endDetails %}

## Execução local do seu site com HTTPS: outras opções

### Certificado autoassinado

Você também pode decidir não usar uma autoridade de certificação local como mkcert e, em vez disso, **assinar seu certificado você mesmo**.

Cuidado com algumas armadilhas desta abordagem:

- Os navegadores não confiam em você como autoridade de certificação e mostrarão avisos que você precisará ignorar manualmente. No Chrome, você pode usar o sinalizador `#allow-insecure-localhost` para ignorar esse aviso automaticamente no `localhost`. Se parece um pouco hackeado, é porque é.
- Isso não é seguro se você estiver trabalhando em uma rede insegura.
- Os certificados autoassinados não se comportam exatamente da mesma maneira que os certificados confiáveis.
- Não é necessariamente mais fácil ou mais rápido do que usar uma CA local como o mkcert.
- Se você não estiver usando esta técnica em um contexto de navegador, pode ser necessário desativar a verificação de certificado para o seu servidor. Omitir a reativação na produção seria perigoso.

<figure>{% Img src="image/admin/KxLz7mcUudiFwWBIdhH8.jpg", alt="Screenshots of the warnings browsers show when a self-signed certificate is used.", width="800", height="598" %} <figcaption> Os navegadores de avisos mostram quando um certificado autoassinado é usado.</figcaption></figure>

{% Aside %} Se você não especificar nenhum certificado, as opções HTTPS do servidor de desenvolvimento do [React](https://create-react-app.dev/docs/using-https-in-development/) e do [Vue](https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-serve) criam um certificado autoassinado em segundo plano. Isso é rápido, mas você receberá avisos do navegador e encontrará outras armadilhas relacionadas aos certificados autoassinados listados acima. Felizmente, você pode usar a opção HTTPS integrada dos frameworks front-end **e** especificar um certificado confiável localmente criado via mkcert ou similar. Veja como fazer isso no [exemplo mkcert com React](/#setup:~:text=a%20React%20development%20server). {% endAside %}

{% Details %} {% DetailsSummary %} Por que os navegadores não confiam em certificados autoassinados? {% endDetailsSummary %}

Se você abrir seu site em execução localmente em seu navegador usando HTTPS, seu navegador verificará o certificado de seu servidor de desenvolvimento local. Quando ele vê que o certificado foi assinado por você, ele verifica se você está registrado como uma autoridade de certificação confiável. Porque você não é, seu navegador não pode confiar no certificado; ele exibe um aviso informando que sua conexão não é segura. Você pode prosseguir por sua própria conta e risco — se o fizer, uma conexão HTTPS será criada.

<figure>{% Img src="image/admin/V2SAcIzuofqzUuestOOX.jpg", alt="Por que os navegadores não confiam em certificados autoassinados: um diagrama.", width="800", height="833" %} <figcaption> Por que os navegadores não confiam em certificados autoassinados.</figcaption></figure>

{% endDetails %}

### Certificado assinado por uma autoridade de certificação regular

Você também pode encontrar técnicas baseadas em fazer com que uma autoridade de certificação real — não local — assine seu certificado.

Algumas coisas para ter em mente se você estiver pensando em usar essas técnicas:

- Você terá mais trabalho de configuração a fazer do que usar uma técnica local de CA como o mkcert.
- Você precisa usar um nome de domínio que você controle e que seja válido. Isso significa que você **não pode** usar autoridades de certificação reais para:
    - `localhost` e outros nomes de domínio [reservados](https://www.iana.org/assignments/special-use-domain-names/special-use-domain-names.xhtml), como `example` ou `test`.
    - Qualquer nome de domínio que você não controla.
    - Domínios de nível superior que não são válidos. Veja a [lista de domínios de nível superior válidos](https://www.iana.org/domains/root/db).

### Proxy reverso

Outra opção para acessar um site em execução local com HTTPS é usar um [proxy reverso](https://en.wikipedia.org/wiki/Reverse_proxy) como o [ngrok](https://ngrok.com/).

Alguns pontos a considerar:

- Qualquer pessoa pode acessar seu site de desenvolvimento local, uma vez que você compartilhe com eles uma URL criada com um proxy reverso. Isso pode ser muito útil ao demonstrar seu projeto para os clientes! Ou isso pode ser uma desvantagem, se seu projeto for delicado.
- Você pode precisar considerar o preço.
- Novas [medidas de segurança](/cors-rfc1918-feedback/) em navegadores podem afetar a maneira como essas ferramentas funcionam.

### Sinalizar (não recomendado)

Se estiver usando um nome de host personalizado como `mysite.example`, você pode usar um sinalizador no Chrome para forçosamente considerar `mysite.example` seguro. **Evite fazer isso**, porque:

- Você precisaria ter 100% de certeza de que `mysite.example` sempre resolve para um endereço local, caso contrário, você poderia vazar credenciais de produção.
- Você não conseguirá depurar em navegadores com este truque 🙀.

*Com muitos agradecimentos pelas contribuições e feedback a todos os revisores e colaboradores - especialmente Ryan Sleevi, Filippo Valsorda, Milica Mihajlija e Rowan Merewood. 🙌*

*Fundo da imagem do herói por [@anandu](https://unsplash.com/@anandu) no [Unsplash](https://unsplash.com/photos/pbxwxwfI0B4), editado.*
