---
title: Proteja seus recursos de ataques da Web com busca de metadados
subhead: Evite vazamentos de informações de CSRF, XSSI e entre origens.
authors:
  - lwe
date: 2020-06-04
updated: 2020-06-10
hero: image/admin/El8ytnIgMDWVzdsglcfv.jpg
alt: Uma captura de tela do código Python relacionado à Política de Isolamento de Recursos.
description: |2-

  A busca de metadados é um novo recurso de plataforma da Web projetado para permitir que os servidores se protejam de ataques entre origens.
tags:
  - blog
  - security
feedback:
  - api
---

## Por que você deve se preocupar em isolar seus recursos da Web?

Muitos aplicativos da wWeb são vulneráveis a ataques [entre origens](/same-site-same-origin/#%22same-origin%22-and-%22cross-origin%22) [como falsificação de solicitação intersites](https://portswigger.net/web-security/csrf) (CSRF), [inclusão de script intersites](https://portswigger.net/research/json-hijacking-for-the-modern-web) (XSSI), ataques programados, [vazamento de informações entre origens](https://arxiv.org/pdf/1908.02204.pdf) ou ataques de canal lateral de execução especulativa ([Espectro).](https://developer.chrome.com/blog/meltdown-spectre/)

Os cabeçalhos de solicitação de [busca de metadados](https://www.w3.org/TR/fetch-metadata/) (Fetch Metadata) permitem que você implante um forte mecanismo de defesa em profundidade - uma Política de Isolamento de Recursos - para proteger seu aplicativo contra esses ataques comuns entre origens.

É comum que recursos expostos por um determinado aplicativo da Web sejam carregados apenas pelo próprio aplicativo, e não por outros sites. Nesses casos, implantar uma Política de Isolamento de Recursos com base em cabeçalhos de solicitação de busca de metadados exige pouco esforço e, ao mesmo tempo, protege o aplicativo de ataques intersites.

## Compatibilidade do navegador {: #compatibility}

Os cabeçalhos de solicitação de busca de metadados são suportados a partir do Chrome 76 e em outros navegadores baseados em Chromium, e estão em desenvolvimento no Firefox. Consulte [Compatibilidade de navegadores](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site#Browser_compatibility) para obter informações atualizadas sobre o suporte a navegadores.

## Histórico

Muitos ataques intersites são possíveis porque a Web é aberta por padrão e seu servidor de aplicativos não pode se proteger facilmente da comunicação originada de aplicativos externos. Um ataque de origem cruzada típico é a falsificação de solicitação intersites (CSRF), em que um invasor atrai um usuário para um site que ele controla e, em seguida, envia um formulário ao servidor no qual o usuário está conectado. Como o servidor não pode saber se a solicitação foi originada de outro domínio (intersite) e o navegador anexa cookies automaticamente às solicitações intersites, o servidor executará a ação solicitada pelo invasor em nome do usuário.

Outros ataques intersites, como inclusão de script intersites (XSSI) ou vazamentos de informações entre origens, são semelhantes em natureza ao CSRF e dependem do carregamento de recursos de um aplicativo vítima em um documento controlado pelo invasor e do vazamento de informações sobre os aplicativos vítimas. Como os aplicativos não podem distinguir facilmente as solicitações confiáveis das não confiáveis, eles não podem descartar o tráfego malicioso intersites.

{% Aside 'gotchas' %} Além de ataques a recursos conforme descrito acima, as *referências de janela* também podem levar a vazamentos de informações entre origens e ataques de Espectro. Você pode evitá-los definindo o cabeçalho de resposta `Cross-Origin-Opener-Policy` `same-origin`. {% endAside %}

## Apresentando a busca de metadados {: #introduction}

Os cabeçalhos de solicitação de busca de metadados (Fetch Metadata) são um novo recurso de segurança da plataforma da Web projetado para ajudar os servidores a se defenderem contra ataques entre origens. Ao fornecer informações sobre o contexto de uma solicitação HTTP em um conjunto de `Sec-Fetch-*`, eles permitem que o servidor de resposta aplique políticas de segurança antes de processar a solicitação. Isso permite que os desenvolvedores decidam se aceitam ou rejeitam uma solicitação com base na forma como foi feita e no contexto em que será usada, tornando possível responder apenas a solicitações legítimas feitas por seu próprio aplicativo.

{% Compare 'better', 'Same-Origin' %} {% CompareCaption %} As solicitações originadas de sites atendidos por seu próprio servidor (mesma origem) continuarão funcionando. {% endCompareCaption %}

<!--lint disable no-literal-urls-->

{% Img src="image/admin/aRsy2xULTR4TM2sMMsbQ.png", alt="Uma solicitação de busca de https://site.example para o recurso https://site.example/foo.json no JavaScript faz com que o navegador envie o cabeçalho de solicitação HTTP 'Sec Fetch-Site: same-origin'.", width="800", height="176" %}

<!--lint enable no-literal-urls-->

{% endCompare %}

{% Compare 'worse', 'Cross-site' %} {% CompareCaption %} Solicitações maliciosas initersites podem ser rejeitadas pelo servidor devido ao contexto adicional na solicitação HTTP fornecida pelos cabeçalhos `Sec-Fetch-*` {% endCompareCaption %}

<!--lint disable no-literal-urls-->

{% Img src="image/admin/xY4yB36JqsVw62wNMIWt.png", alt="Uma imagem em https://evil.example que definiu o atributo src de um elemento img para 'https://site.example/foo. json' faz com que o navegador envie o cabeçalho de solicitação HTTP 'Sec-Fetch-Site: cross-site'.", width="800", height="171" %}

<!--lint enable no-literal-urls-->

{% endCompare %}

### `Sec-Fetch-Site`

`Sec-Fetch-Site` informa ao servidor qual [site](/same-site-same-origin) enviou a solicitação. O navegador define esse valor como uma das seguintes opções:

- `same-origin`, se a solicitação foi feita por seu próprio aplicativo (por exemplo, `site.example`)
- `same-site`, se a solicitação foi feita por um subdomínio do seu site (por exemplo, `bar.site.example`)
- `none`, se a solicitação foi explicitamente causada pela interação de um usuário com o agente do usuário (por exemplo, clicar em um favorito)
- `cross-site`, se a solicitação foi enviada por outro site (por exemplo, `evil.example`)

### `Sec-Fetch-Mode`

`Sec-Fetch-Mode` indica o [modo](https://developer.mozilla.org/docs/Web/API/Request/mode) da solicitação. Isso corresponde aproximadamente ao tipo de solicitação e permite distinguir as cargas de recursos das solicitações de navegação. Por exemplo, um destino de `navigate` indica uma solicitação de navegação de nível superior, enquanto `no-cors` indica solicitações de recursos como o carregamento de uma imagem.

### `Sec-Fetch-Dest`

`Sec-Fetch-Dest` expõe o [destino](https://developer.mozilla.org/docs/Web/API/Request/destination) de uma solicitação (por exemplo, se um `script` ou uma `img` fez com que um recurso fosse solicitado pelo navegador).

## Como usar a busca de metadados para se proteger contra ataques entre origens

As informações extras que esses cabeçalhos de solicitação fornecem são bastante simples, mas o contexto adicional permite que você crie uma lógica de segurança poderosa no lado do servidor, também conhecida como política de isolamento de recursos, com apenas algumas linhas de código.

### Implementar uma política de isolamento de recursos

Uma política de isolamento de recursos evita que seus recursos sejam solicitados por sites externos. O bloqueio desse tráfego atenua vulnerabilidades comuns intersites da Web, como CSRF, XSSI, ataques de temporização e vazamentos de informações entre origens. Esta política pode ser ativada para todos os endpoints de seu aplicativo e permitirá todas as solicitações de recursos provenientes de seu próprio aplicativo, bem como navegações diretas (por meio de uma `GET`). Os endpoints que deveriam ser carregados em um contexto intersites (por exemplo, endpoints carregados usando CORS) podem ser excluídos desta lógica.

#### Etapa 1: permitir solicitações de navegadores que não enviam busca de metadados

Como nem todos os navegadores são compatíveis com o recurso de busca de metadados, você precisa permitir solicitações que não definem `Sec-Fetch-*` verificando a presença de `sec-fetch-site`.

{% Aside %} Todos os exemplos a seguir são no código Python. {% endAside %}

```python
if not req['sec-fetch-site']:
  return True  # Allow this request
```

{% Aside 'caution' %} Como a busca de metadados só é compatível com navegadores baseados em Chromium, ela deve ser usado como uma [proteção de defesa profunda](https://static.googleusercontent.com/media/landing.google.com/en//sre/static/pdf/Building_Secure_and_Reliable_Systems.pdf#page=181) e não como sua linha de defesa principal. {% endAside %}

#### Etapa 2: permitir solicitações iniciadas no mesmo site e no navegador

Qualquer solicitação que não se origine de um contexto de origem cruzada (como `evil.example`) será permitida. Em particular, são solicitações que:

- Têm origem no seu próprio aplicativo (por exemplo, uma solicitação de mesma origem em que as solicitações `site.example` `site.example/foo.json` sempre serão permitidas).
- Têm origem de seus subdomínios.
- São explicitamente causadas pela interação do usuário com o agente do usuário (por exemplo, navegação direta ou clicar em um favorito etc.).

```python
if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
  return True  # Allow this request
```

{% Aside 'gotchas' %} Caso seus subdomínios não sejam totalmente confiáveis, você pode tornar a política mais rígida bloqueando solicitações de subdomínios removendo o valor `same-site` {% endAside %}

#### Etapa 3: permitir navegação simples de nível superior e iframing

Para garantir que seu site ainda possa ser vinculado a outros sites, você deve permitir a navegação de nível superior `HTTP GET`

```python
if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET'
  # <object> and <embed> send navigation requests, which we disallow.
  and req['sec-fetch-dest'] not in ('object', 'embed'):
    return True  # Allow this request
```

{% Aside 'gotchas' %} A lógica acima protege os endpoints de seu aplicativo de serem usados como recursos por outros sites, mas permitirá a navegação de nível superior e incorporação (por exemplo, carregamento em um `<iframe>`). Para melhorar ainda mais a segurança, você pode usar os cabeçalhos Fetch Metadata para restringir as navegações intersites a apenas um conjunto permitido de páginas. {% endAside %}

#### Etapa 4: desative os endpoints destinados a atender ao tráfego intersites (opcional)

Em alguns casos, seu aplicativo pode fornecer recursos que devem ser carregados intersites. Esses recursos precisam ser isentos por caminho ou por endpoint. Exemplos de tais terminais são:

- Endpoints destinados a serem acessados entre origens: se o seu aplicativo está servindo endpoints que são `CORS`, você precisa desativá-los explicitamente do isolamento de recursos para garantir que as solicitações intersites para esses endpoints ainda sejam possíveis.
- Recursos públicos (por exemplo, imagens, estilos, etc.): Quaisquer recursos públicos e não autenticados que devam ser entre origens carregáveis de outros sites também podem ser isentos.

```python
if req.path in ('/my_CORS_endpoint', '/favicon.png'):
  return True
```

{% Aside 'caution' %} Antes de excluir partes de seu aplicativo dessas restrições de segurança, certifique-se de que sejam estáticas e não contenham informações confidenciais do usuário. {% endAside %}

#### Etapa 5: rejeitar todas as outras solicitações que sejam intersite e não de navegação

Qualquer outra solicitação **intersites** será rejeitada por esta Política de Isolamento de Recursos e, assim, protegerá seu aplicativo de ataques comuns intersites.

{% Aside 'gotchas' %} Por padrão, as solicitações que violam sua política devem ser rejeitadas com uma resposta `HTTP 403` Mas, dependendo do seu caso de uso, você também pode considerar outras ações, como:

- **Apenas registrar violações** . Isso é especialmente útil ao testar a compatibilidade da política e localizar terminais que podem precisar ser excluídos.
- **Modificando a solicitação**. Em certos cenários, considere realizar outras ações, como redirecionar para sua página de destino e descartar credenciais de autenticação (por exemplo, cookies). No entanto, esteja ciente de que isso pode enfraquecer as proteções de uma política baseada em Fetch Metadata. {% endAside %}

**Exemplo:** o código a seguir demonstra uma implementação completa de uma política de isolamento de recursos robusta no servidor ou como um middleware para negar solicitações de recursos intersites potencialmente maliciosas, enquanto permite solicitações de navegação simples:

```python
# Reject cross-origin requests to protect from CSRF, XSSI, and other bugs
def allow_request(req):
  # Allow requests from browsers which don't send Fetch Metadata
  if not req['sec-fetch-site']:
    return True

  # Allow same-site and browser-initiated requests
  if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
    return True

  # Allow simple top-level navigations except <object> and <embed>
  if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET'
    and req['sec-fetch-dest'] not in ('object', 'embed'):
      return True

  # [OPTIONAL] Exempt paths/endpoints meant to be served cross-origin.
  if req.path in ('/my_CORS_endpoint', '/favicon.png'):
    return True

  # Reject all other requests that are cross-site and not navigational
  return False
```

### Implementando uma Política de Isolamento de Recursos

1. Instale um módulo como o snippet de código acima para registrar e monitorar como seu site se comporta e certifique-se de que as restrições não afetem o tráfego legítimo.
2. Corrija possíveis violações, isentando endpoints legítimos entre origens.
3. Aplique a política descartando solicitações não compatíveis.

### Identificação e correção de violações de política

É recomendável que você teste sua política sem efeitos colaterais, primeiro habilitando-a no modo de relatório em seu código do lado do servidor. Como alternativa, você pode implementar essa lógica em middleware ou em um proxy reverso que registra quaisquer violações que sua política possa produzir quando aplicada ao tráfego de produção.

De acordo com nossa experiência de implementação de uma política de isolamento de recursos de metadados de busca no Google, a maioria dos aplicativos é, por padrão, compatível com essa política e raramente exige endpoints isentos para permitir o tráfego intersites.

### Aplicação de uma política de isolamento de recursos

Depois de verificar se sua política não afeta o tráfego de produção legítimo, você está pronto para aplicar restrições, garantindo que outros sites não possam solicitar seus recursos e protegendo seus usuários de ataques intersites.

{% Aside 'caution' %} Certifique-se de rejeitar solicitações inválidas antes de executar verificações de autenticação ou qualquer outro processamento da solicitação para evitar a revelação de informações confidenciais de tempo. {% endAside %}

## Leitura adicional

- [Especificação W3C Fetch Metadata Request Headers](https://www.w3.org/TR/fetch-metadata/)
- [Fetch Metadata Playground](https://secmetadata.appspot.com/)
- [Palestra do Google I / O: Protegendo aplicativos da web com recursos de plataforma modernos](https://webappsec.dev/assets/pub/Google_IO-Securing_Web_Apps_with_Modern_Platform_Features.pdf) (slides)

{% YouTube id = 'DDtM9caQ97I', startTime = '1856'%}
