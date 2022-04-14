---
title: Armazenamento para a web
subhead: Existem muitas opções diferentes para armazenar dados no navegador. Qual é o melhor para suas necessidades?
authors:
  - petelepage
description: Existem muitas opções diferentes para armazenar dados no navegador. Qual delas é a melhor para suas necessidades?
date: 2020-04-27
updated: 2021-02-11
tags:
  - blog
  - progressive-web-apps
  - storage
  - memory
hero: image/admin/c8u2hKEFoFfgTsmcKeuK.jpg
alt: Pilha de contêineres
feedback:
  - api
---

As conexões com a Internet podem ser instáveis ou inexistentes em trânsito, e é por isso que o suporte offline e o desempenho confiável são recursos comuns em [aplicativos da web progressivos](/progressive-web-apps/). Mesmo em ambientes sem fio perfeitos, o uso criterioso de cache e outras técnicas de armazenamento pode melhorar substancialmente a experiência do usuário. Existem várias maneiras de armazenar em cache os recursos do aplicativo estático (HTML, JavaScript, CSS, imagens, etc.) e dados (dados do usuário, artigos de notícias, etc.). Mas qual é a melhor solução? Quanto você pode armazenar? Como evitar que ele seja despejado?

## O que devo usar? {: #recommendation }

Aqui está uma recomendação geral para armazenar recursos:

- Para os recursos de rede necessários para carregar seu aplicativo e conteúdo baseado em arquivo, use a [**API Cache Storage**](/cache-api-quick-guide/) (parte dos [service workers](https://developer.chrome.com/docs/workbox/service-worker-overview/) ).
- Para outros dados, use [**IndexedDB**](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) (com um [wrapper de promises](https://www.npmjs.com/package/idb) ).

IndexedDB e a API Cache Storage são suportados em todos os navegadores modernos. Ambos são assíncronos e não bloquearão o thread principal. Eles são acessíveis a partir do objeto `window`, web workers e service workers, tornando mais fácil usá-los em qualquer lugar em seu código.

## E quanto a outros mecanismos de armazenamento? {: #other }

Existem vários outros mecanismos de armazenamento disponíveis no navegador, mas eles têm uso limitado e podem causar problemas de desempenho significativos.

[SessionStorage](https://developer.mozilla.org/en/docs/Web/API/Window/sessionStorage) é específico da guia e tem como escopo o tempo de vida da guia. Pode ser útil para armazenar pequenas quantidades de informações específicas da sessão, por exemplo, uma chave IndexedDB. Deve ser usado com cuidado porque é síncrono e bloqueará o thread principal. É limitado a cerca de 5 MB e pode conter apenas strings. Por ser específico da guia, não pode ser acessado por web workers ou service workers.

[LocalStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) deve ser evitado porque é síncrono e bloqueará o thread principal. É limitado a cerca de 5 MB e pode conter apenas strings. LocalStorage não pode ser acessado por web workers ou service workers.

[Os cookies](https://developer.mozilla.org/docs/Web/HTTP/Cookies) têm seus usos, mas não devem ser usados para armazenamento. Os cookies são enviados com cada solicitação HTTP, portanto, o armazenamento de qualquer coisa além de uma pequena quantidade de dados aumentará significativamente o tamanho de cada solicitação da web. Eles são síncronos e não podem ser acessados por web workers. Como LocalStorage e SessionStorage, os cookies são limitados a apenas strings.

Um [API File System](https://developer.mozilla.org/docs/Web/API/File_and_Directory_Entries_API/Introduction) e a API FileWriter fornecem métodos para ler e gravar arquivos em um sistema de arquivos em área restrita. Embora seja assíncrono, não é recomendado porque está [disponível apenas em navegadores baseados em Chromium](https://caniuse.com/#feat=filesystem) .

A [API File System Access](/file-system-access/) foi projetada para tornar mais fácil para os usuários ler e editar arquivos em seu sistema de arquivos local. O usuário deve conceder permissão antes que uma página possa ler ou gravar em qualquer arquivo local, e as permissões não são mantidas entre sessões.

WebSQL **não** deve ser usado e o uso existente deve ser migrado para IndexedDB. O suporte [foi removido](https://caniuse.com/#feat=sql-storage) de quase todos os principais navegadores. O W3C [parou de manter a especificação Web SQL](https://www.w3.org/TR/webdatabase/) em 2010, sem planos de novas atualizações planejadas.

O cache do aplicativo **não** deve ser usado e o uso existente deve ser migrado para service workers e API do cache. Ele foi [descontinuado](https://developer.mozilla.org/docs/Web/API/Window/applicationCache) e o suporte será removido dos navegadores no futuro.

## Quanto posso armazenar? {: #how-much }

Resumindo, **muito**, pelo menos algumas centenas de megabytes e potencialmente centenas de gigabytes ou mais. As implementações do navegador variam, mas a quantidade de armazenamento disponível geralmente se baseia na quantidade de armazenamento disponível no dispositivo.

- O Chrome permite que o navegador use até 80% do espaço total em disco. Uma origem pode usar até 60% do espaço total em disco. Você pode usar a [API StorageManager](#check) para determinar a cota máxima disponível. Outros navegadores baseados em Chromium podem permitir que o navegador use mais armazenamento. Consulte [PR # 3896](https://github.com/GoogleChrome/web.dev/pull/3896) para obter detalhes sobre a implementação do Chrome.
- O Internet Explorer 10 e posterior pode armazenar até 250 MB e avisará o usuário quando mais de 10 MB forem usados.
- O Firefox permite que o navegador use até 50% do espaço livre em disco. Um [grupo eTLD+1](https://godoc.org/golang.org/x/net/publicsuffix) (por exemplo, `example.com`, `www.example.com` e `foo.bar.example.com`) [pode usar até 2 GB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria#Storage_limits) . Você pode usar a [API StorageManager](#check-available) para determinar quanto espaço ainda está disponível.
- O Safari (desktop e celular) parece permitir cerca de 1 GB. Quando o limite é atingido, o Safari pergunta ao usuário, aumentando o limite em incrementos de 200 MB. Não consegui encontrar nenhuma documentação oficial a respeito.
    - Se um PWA for adicionado à tela inicial no Safari móvel, ele parecerá criar um novo contêiner de armazenamento e nada será compartilhado entre o PWA e o Safari móvel. Depois que a cota for atingida para um PWA instalado, não parece haver nenhuma maneira de solicitar armazenamento adicional.

No passado, se um site excedesse um certo limite de dados armazenados, o navegador pedia ao usuário para conceder permissão para usar mais dados. Por exemplo, se a origem usou mais de 50 MB, o navegador solicitará ao usuário que permita o armazenamento de até 100 MB e, em seguida, solicitará novamente em incrementos de 50 MB.

Hoje, a maioria dos navegadores modernos não solicitará ao usuário e permitirá que um site use até sua cota atribuída. A exceção parece ser o Safari, que solicita a 750 MB, pedindo permissão para armazenar até 1,1 GB. Se uma origem tentar usar mais do que sua cota atribuída, outras tentativas de gravar dados falharão.

## Como posso verificar a quantidade de armazenamento disponível? {: #check }

Em [muitos navegadores](https://caniuse.com/#feat=mdn-api_storagemanager) , você pode usar a [API StorageManager](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate) para determinar a quantidade de armazenamento disponível para a origem e quanto armazenamento está usando. Ele relata o número total de bytes usados por IndexedDB e a API do Cache e torna possível calcular o espaço de armazenamento restante aproximado disponível.

```js
if (navigator.storage && navigator.storage.estimate) {
  const quota = await navigator.storage.estimate();
  // quota.usage -> Número de bytes usados.
  // quota.quota -> Número máximo de bytes disponível.
  const percentageUsed = (quota.usage / quota.quota) * 100;
  console.log(`Você usou ${percentageUsed}% do armazenamento disponível.`);
  const remaining = quota.quota - quota.usage;
  console.log(`Você pode gravar até ${remaining} bytes mais.`);
}
```

O StorageManager ainda não foi [implementado](https://caniuse.com/#feat=mdn-api_storagemanager) em todos os navegadores, portanto, você deve detectar o recurso antes de usá-lo. Mesmo quando estiver disponível, você ainda deve detectar erros de excesso de cota (veja abaixo). Em alguns casos, é possível que a cota disponível exceda a quantidade real de armazenamento disponível.

{% Aside %} Outros navegadores baseados em Chromium podem levar em consideração a quantidade de espaço livre ao relatar a cota disponível. O Chrome não informa e sempre relatará 60% do tamanho real do disco. Isso ajuda a reduzir a capacidade de determinar o tamanho dos recursos de origem cruzada armazenados. {% endAside %}

### Inspecionar

Durante o desenvolvimento, você pode usar DevTools do navegador para inspecionar os diferentes tipos de armazenamento e limpar facilmente todos os dados armazenados.

Um novo recurso foi adicionado ao Chrome 88 que permite substituir a cota de armazenamento do site no painel de armazenamento. Este recurso oferece a capacidade de simular diferentes dispositivos e testar o comportamento de seus aplicativos em cenários de baixa disponibilidade de disco. Acesse **Aplicativo** e **, em seguida, Armazenamento**, marque a **caixa de seleção Simular cota de armazenamento customizada** e insira qualquer número válido para simular a cota de armazenamento.

{% Img src="image/0g2WvpbGRGdVs0aAPc6ObG7gkud2/tYlbklNwF6DFKNV2cY0D.png", alt = "Painel Armazenamento do DevTools.", width="800", height="567"%}

Enquanto trabalhava neste artigo, escrevi uma [ferramenta simples](https://storage-quota.glitch.me/) para tentar usar rapidamente o máximo de armazenamento possível. É uma maneira rápida e fácil de experimentar diferentes mecanismos de armazenamento e ver o que acontece quando você usa toda a sua cota.

## Como lidar se ultrapassar a cota? {: #over-quota }

O que você deve fazer quando ultrapassar a cota? Mais importante ainda, você deve sempre detectar e tratar erros de gravação, seja um `QuotaExceededError` ou algum outro. Logo, dependendo do design do seu aplicativo, decida como lidar com isso. Por exemplo, exclua o conteúdo que não é acessado há muito tempo, remova os dados com base no tamanho ou forneça uma maneira para os usuários escolherem o que desejam excluir.

Tanto o IndexedDB quanto a API do Cache lançam um `DOMError` chamado `QuotaExceededError` quando você excede a cota disponível.

### IndexedDB

Se a origem tiver excedido sua cota, as tentativas de gravação em IndexedDB falharão. `onabort()` da transação será chamado, passando um evento. O evento incluirá uma `DOMException` na propriedade de erro. Verificar o `name` do erro retornará `QuotaExceededError`.

```js
const transaction = idb.transaction(['entries'], 'readwrite');
transaction.onabort = function(event) {
  const error = event.target.error; // DOMException
  if (error.name == 'QuotaExceededError') {
    // O código de fallback/alternativa vai aqui
  }
};
```

### API de cache

Se a origem excedeu sua cota, as tentativas de gravar na API do Cache serão rejeitadas com uma `QuotaExceededError` `DOMException` .

```js
try {
  const cache = await caches.open('my-cache');
  await cache.add(new Request('/sample1.jpg'));
} catch (err) {
  if (error.name === 'QuotaExceededError') {
    // O código de fallback/alternativa vai aqui
  }
}
```

## Como funciona o despejo? {: #eviction }

O armazenamento da Web é categorizado em dois grupos, "Melhor esforço" e "Persistente". Melhor esforço significa que o armazenamento pode ser limpo pelo navegador sem interromper o usuário, mas é menos durável para dados críticos ou de longo prazo. O armazenamento persistente não é apagado automaticamente quando o armazenamento está baixo. O usuário precisa limpar manualmente esse armazenamento (por meio das configurações do navegador).

Por padrão, os dados de um site (incluindo IndexedDB, Cache API, etc) se enquadram na categoria de melhor esforço, o que significa que, a menos que um site tenha [solicitado armazenamento persistente](/persistent-storage/) , o navegador pode despejar os dados do site a seu critério, por exemplo, quando o armazenamento do dispositivo estiver baixo .

A política de despejo para o melhor esforço é:

- Os navegadores baseados em Chromium começarão a despejar dados quando o navegador ficar sem espaço, limpando todos os dados do site da origem menos usada recentemente primeiro, depois a próxima, até que o navegador não ultrapasse o limite.
- O Internet Explorer 10+ não despejará dados, mas impedirá que a origem grave mais.
- O Firefox começará a despejar dados quando o espaço em disco disponível for preenchido, limpando todos os dados do site da origem menos usada recentemente primeiro, depois a próxima, até que o navegador não ultrapasse o limite.
- Anteriormente, o Safari não despejava dados, mas recentemente implementou um novo limite de sete dias em todo o armazenamento gravável (veja abaixo).

A partir do iOS e iPadOS 13.4 e Safari 13.1 no macOS, há um limite de sete dias em todo o armazenamento gravável de script, incluindo IndexedDB, registro de service worker e API de cache. Isso significa que o Safari irá remover todo o conteúdo do cache após sete dias de uso do Safari, se o usuário não interagir com o site. Esta política de despejo **não se aplica a PWAs instalados** que foram adicionados à tela inicial. Consulte [Bloqueio completo de cookies de terceiros e muito mais](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) no blog do WebKit para obter os detalhes completos.

{% Aside %} Você pode solicitar [armazenamento persistente](/persistent-storage/) para seu site para proteger usuários críticos ou dados de aplicativos. {% endAside %}

## Bônus: Por que usar um wrapper para IndexedDB

IndexedDB é uma API de baixo nível que requer configuração significativa antes do uso, o que pode ser particularmente difícil para armazenar dados simples. Ao contrário da maioria das APIs  modernas baseadas em promises, ela é baseada em eventos. Wrappers de promises como [idb](https://www.npmjs.com/package/idb) para IndexedDB ocultam alguns dos recursos poderosos, mas, o que é mais importante, ocultam o maquinário complexo (por exemplo, transações, controle de versão de esquema) que vem com a biblioteca IndexedDB.

## Conclusão

Já se foi o tempo de armazenamento limitado e de solicitação ao usuário para armazenar cada vez mais dados. Os sites podem armazenar com eficácia todos os recursos e dados de que precisam para funcionar. Usando a [API StorageManager,](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate) você pode determinar quanto está disponível para você e quanto você usou. E com o [armazenamento persistente](/persistent-storage/) , a menos que o usuário o remova, você pode protegê-lo contra despejo.

### Recursos adicionais

- [Melhores práticas de IndexedDB](/indexeddb-best-practices/)
- [Conceitos de cota e armazenamento da Web do Chrome](https://docs.google.com/document/d/19QemRTdIxYaJ4gkHYf2WWBNPbpuZQDNMpUVf8dQxj4U/preview)

### Obrigado

Agradecimentos especiais a Jarryd Goodman, Phil Walton, Eiji Kitamura, Daniel Murphy, Darwin Huang, Josh Bell, Marijn Kruisselbrink e Victor Costan pela revisão deste artigo. Agradecimentos a Eiji Kitamura, Addy Osmani e Marc Cohen que escreveram os artigos originais nos quais este artigo se baseia. Eiji escreveu uma ferramenta útil chamada [Browser Storage Abuser](http://demo.agektmr.com/storage/) que foi útil para validar o comportamento atual. Ele permite que você armazene o máximo de dados possível e veja os limites de armazenamento em seu navegador. Obrigado a François Beaufort, que investigou o Safari para descobrir seus limites de armazenamento.

A imagem do herói é de Guillaume Bolduc no [Unsplash](https://unsplash.com/photos/uBe2mknURG4).
