---
layout: post
title: Como definir sua estratégia de instalação
authors:
  - demianrenzulli
  - petelepage
date: 2020-05-12
updated: 2020-08-20
description: |2-

  Melhores práticas para combinar diferentes ofertas de instalação para aumentar as taxas de instalação e evitar competição e canibalização da plataforma.
tags:
  - progressive-web-apps
---

{% YouTube '6R9pupbDXYw' %}

No passado, as instalações de aplicativos só eram possíveis no contexto de aplicativos específicos da plataforma. Hoje, os aplicativos da web modernos oferecem experiências instaláveis que fornecem o mesmo nível de integração e confiabilidade que os aplicativos específicos da plataforma.

Você pode conseguir isso de diferentes maneiras:

- Instalando o PWA a [partir do navegador](/customize-install/) .
- Instalando o PWA [da app store](https://developer.chrome.com/docs/android/trusted-web-activity/) .

Ter diferentes canais de distribuição é uma maneira poderosa de alcançar um grande número de usuários, mas escolher a estratégia certa para promovê-los pode ser um desafio.

Este guia explora as práticas recomendadas para combinar diferentes ofertas de instalação para aumentar as taxas de instalação e evitar a competição de plataforma e a canibalização. As ofertas de instalação cobertas incluem PWAs instalados do navegador e da App Store, bem como aplicativos específicos da plataforma.

## Por que tornar seu aplicativo da web instalável?

Progressive Web Apps instaladas são executados numa janela independente em vez de numa aba do navegador. Elas podem ser iniciadas na tela inicial do usuário, no dock, na barra de tarefas ou na prateleira. É possível procurá-las num dispositivo e alternar entre elas com o alternador de aplicações, fazendo com que pareçam parte do dispositivo em que estão instaladas.

Mas ter um aplicativo da web instalável e um aplicativo específico da plataforma pode ser confuso para os usuários. Para alguns usuários, os aplicativos específicos da plataforma podem ser a melhor escolha, mas para outros eles podem apresentar algumas desvantagens:

- **Restrições de armazenamento:** Instalar um novo aplicativo pode significar excluir outros ou limpar espaço, removendo conteúdo valioso. Isso é especialmente desvantajoso para usuários em dispositivos de baixo custo.
- **Largura de banda disponível:** Baixar um aplicativo pode ser um processo caro e lento, ainda mais para usuários com conexões lentas e planos de dados caros.
- **Atrito:** sair de um site e ir para uma loja para baixar um aplicativo cria atrito adicional e atrasa uma ação do usuário que poderia ser realizada diretamente na web.
- **Ciclo de atualização:** fazer alterações em aplicativos específicos da plataforma pode exigir a passagem por um processo de revisão de aplicativo, o que pode desacelerar as alterações e os experimentos (por exemplo, testes A / B).

Em alguns casos, a porcentagem de usuários que não irão baixar seu aplicativo específico da plataforma pode ser grande, por exemplo: aqueles que pensam que não usarão o aplicativo com muita frequência ou não podem justificar o gasto de vários megabytes de armazenamento ou dados. Você pode determinar o tamanho desse segmento de várias maneiras, por exemplo, usando uma configuração de análise para rastrear a porcentagem de usuários "apenas da web móvel".

Se o tamanho desse segmento for considerável, é uma boa indicação de que você precisa fornecer maneiras alternativas de instalar suas experiências.

## Promover a instalação do seu PWA através do navegador

Se você tiver um PWA de alta qualidade, pode ser melhor promover sua instalação em relação ao aplicativo específico de sua plataforma. Por exemplo, se o aplicativo específico da plataforma não tiver a funcionalidade oferecida pelo seu PWA ou se não tiver sido atualizado há algum tempo. Também pode ser útil promover a instalação de seu PWA se o aplicativo específico da plataforma não foi otimizado para telas maiores, como no ChromeOS.

Para alguns aplicativos, a condução de instalações de aplicativos específicos da plataforma é uma parte fundamental do modelo de negócios; nesse caso, faz sentido para os negócios promover a instalação de aplicativos específicos da plataforma. Porém, alguns usuários podem se sentir mais confortáveis permanecendo na web. Se esse segmento puder ser identificado, o prompt do PWA pode ser mostrado apenas para eles (o que chamamos de "PWA como fallback").

Nesta seção, exploraremos diferentes maneiras de maximizar a taxa de instalação de PWAs instalados por meio do navegador.

### PWA como experiência instalável primária

Quando um PWA atende aos [critérios de instalabilidade](/install-criteria/) , a maioria dos navegadores mostra uma indicação de que o PWA pode ser instalado. Por exemplo, Desktop Chrome mostrará um ícone instalável na barra de endereço e, no celular, mostrará uma mini-barra de informações:

<figure data-float="right">{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1VOvbQjeenZOBAmzjVN5.png", alt = "Solicitação de instalação padrão do Chrome chamada mini-infobar", width = "800", height = "417"%}<figcaption> O mini-infobar</figcaption></figure>

Embora isso possa ser suficiente para algumas experiências, se seu objetivo é conduzir as instalações do seu PWA, é altamente recomendável ouvir [`BeforeInstallPromptEvent`](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent) e seguir os [padrões para promover a instalação](/promote-install/) do seu PWA.

## Evite que seu PWA canibalize sua taxa de instalação de aplicativo específico da plataforma

Em alguns casos, você pode optar por promover a instalação de seu aplicativo específico de plataforma em vez de seu PWA, mas, neste caso, ainda recomendamos que você forneça um mecanismo para permitir que os usuários instalem seu PWA. Essa opção de fallback possibilita que usuários que não podem ou não querem instalar seu aplicativo específico da plataforma tenham uma experiência de instalação semelhante.

A primeira etapa para implementar essa estratégia é definir uma heurística para quando você mostrará ao usuário uma promoção de instalação para seu PWA, por exemplo:

**"Um usuário PWA é aquele que viu o prompt de instalação do aplicativo específico da plataforma e não instalou o aplicativo específico da plataforma. Eles retornaram ao site pelo menos cinco vezes ou clicaram no banner do aplicativo, mas continuaram usando o site em vez disso. "**

Então, a heurística pode ser implementada da seguinte maneira:

1. Mostre o banner de instalação de aplicativo específico da plataforma.
2. Se um usuário dispensar o banner, defina um cookie com essas informações (por exemplo, `document.cookie = "app-install-banner=dismissed"` ).
3. Use outro cookie para rastrear o número de visitas do usuário ao site (por exemplo, `document.cookie = "user-visits=1"` ).
4. Escreva uma função, como `isPWAUser()` , que usa as informações previamente armazenadas nos cookies junto com a [`getInstalledRelatedApps()`](/get-installed-related-apps/) para determinar se um usuário é considerado um "usuário PWA".
5. No momento em que o usuário executa uma ação significativa, chame `isPWAUser()` . Se a função retornar true e o prompt de instalação do PWA tiver sido salvo anteriormente, você pode mostrar o botão de instalação do PWA.

## Promover a instalação do seu PWA através de uma app store

Os aplicativos disponíveis nas lojas de aplicativos podem ser desenvolvidos com diferentes tecnologias, incluindo técnicas de PWA. Em [Combinando PWA em ambientes nativos,](https://youtu.be/V7YX4cZ_Cto) você pode encontrar um resumo das tecnologias que podem ser usadas para esse fim.

Nesta seção, classificaremos os aplicativos da loja em dois grupos:

- **Aplicativos específicos da plataforma:** esses aplicativos são desenvolvidos principalmente com código específico da plataforma. Seu tamanho depende da plataforma, mas geralmente é superior a 10 MB no Android e 30 MB no iOS. Você pode querer promover seu aplicativo específico da plataforma se não tiver um PWA ou se o aplicativo específico da plataforma apresentar um conjunto de recursos mais completo.
- **Aplicativos leves:** esses aplicativos também podem ser desenvolvidos com código específico da plataforma, mas geralmente são criados com tecnologia da web, empacotados em um invólucro específico da plataforma. PWAs completos também podem ser carregados nas lojas. Algumas empresas optam por fornecê-las como experiências "leves" e outras também usam essa abordagem para seus aplicativos principais (núcleo).

### Promoção de aplicativos leves

De acordo com um [estudo do Google Play](https://medium.com/googleplaydev/shrinking-apks-growing-installs-5d3fcba23ce2) , para cada 6 MB de aumento no tamanho de um APK, a taxa de conversão de instalação diminui em 1%. Isso significa que a taxa de conclusão do download de um aplicativo de 10 MB pode ser aproximadamente **30% maior do que um aplicativo de 100 MB!**

Para resolver isso, algumas empresas estão aproveitando seu PWA para fornecer uma versão leve de seu aplicativo na Play Store usando Trusted Web Activities. [As atividades da Web confiáveis](https://developer.chrome.com/docs/android/trusted-web-activity/) possibilitam a entrega de seu PWA na Play Store e, como ele é criado na web, o tamanho do aplicativo geralmente é de apenas alguns megabytes.

A Oyo, uma das maiores empresas de hospedagem da Índia, criou uma [versão Lite de seu aplicativo](/oyo-lite-twa/) e a disponibilizou na Play Store usando PWA. Tem apenas 850 KB, apenas 7% do tamanho de seu aplicativo Android. E uma vez instalado, é indistinguível de seu aplicativo Android:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>OYO Lite em ação.</figcaption></figure>

A Oyo manteve as versões do aplicativo carro-chefe e "leve" na loja, deixando a decisão final para os usuários.

#### Oferecendo uma experiência web leve

Intuitivamente, os usuários de dispositivos de baixo custo, podem estar mais inclinados a baixar versões leves de aplicativos do que os usuários de telefones de ponta. Portanto, se for possível identificar o dispositivo de um usuário, pode-se priorizar o banner de instalação do aplicativo leve sobre a versão do aplicativo específico da plataforma mais pesada.

Na web, é possível obter sinais de dispositivos e mapeá-los aproximadamente para categorias de dispositivos (por exemplo, "alto", "médio" ou "baixo"). Você pode obter essas informações de diferentes maneiras, usando APIs JavaScript ou dicas de cliente.

#### Usando APIs de JavaScript

Usando APIs JavaScript como [navigator.hardwareConcurrency](https://developer.mozilla.org/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency) , [navigator.deviceMemory](https://developer.mozilla.org/docs/Web/API/Navigator/deviceMemory) e [navigator.connection,](https://developer.mozilla.org/docs/Web/API/Navigator/connection) você pode obter informações sobre a CPU do dispositivo, memória e status da rede, respectivamente. Por exemplo:

```javascript
const deviceCategory = req.get('Device-Memory') < 1 ? 'lite' : 'full';`
```

#### Usando dicas do cliente

Os sinais do dispositivo também podem ser inferidos em cabeçalhos de solicitação HTTP, por meio de [dicas do cliente](https://developer.mozilla.org/docs/Glossary/Client_hints) . Veja como você pode implementar o código anterior para a memória do dispositivo com dicas de cliente:

Primeiro, diga ao navegador que você está interessado em receber dicas de memória do dispositivo no cabeçalho da resposta HTTP para qualquer solicitação primária:

```html
HTTP/1.1 200 OK
Content-Type: text/html
Accept-CH: Device-Memory
```

Em seguida, você começará a receber informações de memória do dispositivo no cabeçalho da solicitação de HTTP:

```html
GET /main.js HTTP/1.1
Device-Memory: 0.5
```

Você pode usar essas informações em seus backends para armazenar um cookie com a categoria do dispositivo do usuário:

```javascript
app.get('/route', (req, res) => {
  // Determine a category do dispositivo

 const deviceCategory = req.get('Device-Memory') < 1 ? 'lite' : 'full';

  // Defina um cookie
  res.setCookie('Device-Category', deviceCategory);
  …
});
```

Por fim, crie sua própria lógica para mapear essas informações para categorias de dispositivos e mostre o prompt de instalação do aplicativo correspondente em cada caso:

```javascript
if (isDeviceMidOrLowEnd()) {
   // show "Lite app" install banner or PWA A2HS prompt
} else {
  // show "Core app" install banner
}
```

{% Aside %} Cobrir em profundidade técnicas sobre como mapear sinais de dispositivos para categorias de dispositivos está fora do escopo deste guia, mas você pode verificar o [adaptive loading guide](https://dev.to/addyosmani/adaptive-loading-improving-web-performance-on-low-end-devices-1m69) de Addy Osmani, [The Device Memory API](https://developer.chrome.com/blog/device-memory/) de Philip Walton e [Adapting to Users with Client Hints](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints/) de Jeremy Wagner para obter mais informações sobre as melhores práticas a respeito disto. {% endAside %}

## Conclusão

A capacidade de ter um ícone na tela inicial do usuário é um dos recursos mais envolventes dos aplicativos. Dado que, historicamente, isso só era possível para aplicativos instalados de lojas de aplicativos, as empresas podem pensar que mostrar um banner de instalação da loja de aplicativos seria o suficiente para convencer os usuários a instalar suas experiências. Atualmente, existem mais opções para que o usuário instale um aplicativo, incluindo oferecer experiências de aplicativos leves nas lojas e permitir que os usuários adicionem PWAs à tela inicial, solicitando que façam isso diretamente do site.
