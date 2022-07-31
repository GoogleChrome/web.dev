---
layout: post
title: Minificar CSS
description: Saiba mais sobre a auditoria do css não minificado.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - css não minificado
---

A seção Oportunidades de seu relatório do Lighthouse lista todos os arquivos CSS não minificados, junto com a economia potencial em [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) quando esses arquivos são minificados:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/C1ah0bnY6JQsffdO446S.png", alt="Uma captura de tela da auditoria do CSS minificado do Lighthouse", width="800", height="212" %}</figure>

## Como arquivos CSS minificados podem melhorar o desempenho

Minificar arquivos CSS pode melhorar o desempenho do carregamento da página. Os arquivos CSS geralmente são maiores do que precisam ser. Por exemplo:

```css
/* Header background should match brand colors. */
h1 {
  background-color: #000000;
}
h2 {
  background-color: #000000;
}
```

Pode ser reduzido a:

```css
h1, h2 { background-color: #000000; }
```

Do ponto de vista do navegador, esses 2 exemplos de código são funcionalmente equivalentes, mas o segundo exemplo usa menos bytes. Os minificadores podem melhorar ainda mais a eficiência de bytes removendo espaços em branco:

```css
h1,h2{background-color:#000000;}
```

Alguns minificadores empregam truques inteligentes para minimizar bytes. Por exemplo, o valor da cor `#000000` pode ser ainda mais reduzido para `#000`, que é o equivalente abreviado.

O Lighthouse fornece uma estimativa de economia potencial com base nos comentários e caracteres de espaço em branco que encontra em seu CSS. Esta é uma estimativa conservadora. Conforme mencionado anteriormente, os minificadores podem realizar otimizações inteligentes (como reduzir `#000000` para `#000`) para reduzir ainda mais o tamanho do arquivo. Portanto, se você usar um minificador, poderá ver mais economia do que o Lighthouse relata.

## Use um minificador CSS para minificar seu código CSS

Para sites pequenos que você não atualiza com frequência, provavelmente você pode usar um serviço online para minificar manualmente seus arquivos. Você cola seu CSS na IU do serviço e ele retorna uma versão minificada do código.

Para desenvolvedores profissionais, você provavelmente deseja configurar um fluxo de trabalho automatizado que minifica seu CSS automaticamente antes de implantar o código atualizado. Isso geralmente é feito com uma ferramenta de construção como Gulp ou Webpack.

Aprenda como minificar seu código CSS em [Minificar CSS](/minify-css).

## Orientação específica de pilha

### Drupal

Ative os **arquivos CSS agregados** em **Administração** &gt; **Configuração** &gt; **Desenvolvimento**. Você também pode configurar opções de agregação mais avançadas por meio de [módulos adicionais](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=css+aggregation&solrsort=iss_project_release_usage+desc&op=Search) para acelerar seu site concatenando, minificando e compactando seus estilos de CSS.

### Joomla

Uma série de [extensões Joomla](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance) podem acelerar seu site concatenando, minimizando e compactando seus estilos de css. Também existem modelos que fornecem essa funcionalidade.

### Magento

Ative a [opção **Minificar arquivos CSS**](https://devdocs.magento.com/guides/v2.3/performance-best-practices/configuration.html?itm_source=devdocs&itm_medium=search_page&itm_campaign=federated_search&itm_term=minify%20css%20files) nas configurações de desenvolvedor da sua loja.

### React

Se o seu sistema de construção minifica os arquivos CSS automaticamente, certifique-se que você está implantando a [construção de produção](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)do seu aplicativo. Você pode verificar isso com a extensão React Developer Tools.

### WordPress

Vários [plug-ins do WordPress](https://wordpress.org/plugins/search/minify+css/) podem acelerar seu site concatenando, minificando e compactando seus estilos. Você também pode usar um processo de construção para fazer essa minificação antecipadamente, se possível.

## Recursos

- [Código-fonte para auditoria **Minify CSS**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/unminified-css.js)
- [Minificar CSS](/minify-css)
- [Minificar e comprimir payloads de rede](/reduce-network-payloads-using-text-compression)
