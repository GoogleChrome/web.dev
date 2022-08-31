---
layout: post
title: Minify JavaScript
description: |2

  Saiba mais sobre a auditoria javascript não-minimizada.
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - unminified-javascript
---

Minifizar arquivos JavaScript pode reduzir os tamanhos de carga útil e o tempo de análise do script. A seção Oportunidades de seu relatório Lighthouse lista todos os arquivos JavaScript não minimizados, junto com a economia potencial em [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) quando esses arquivos são minimizados:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aHumzRfDrBcuplUDCnvf.png", alt="Uma captura de tela da auditoria de JavaScript do Lighthouse Minify", width="800", height="212" %}</figure>

## Como reduzir seus arquivos JavaScript

Minificação é o processo de remover espaços em branco e qualquer código que não seja necessário para criar um arquivo de código menor, mas perfeitamente válido. [Terser](https://github.com/terser-js/terser) é uma ferramenta de compressão de JavaScript popular. webpack v4 inclui um plugin para esta biblioteca por padrão para criar arquivos de compilação minimizados.

## Orientação específica para pilha

### Drupal

Certifique-se de ter habilitado os **arquivos JavaScript agregados** na **administração**

> **Configuração** &gt; página **Desenvolvimento.** Você também pode configurar opções de agregação mais avançadas por meio de [módulos adicionais](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=javascript+aggregation&solrsort=iss_project_release_usage+desc&op=Search) para acelerar seu site concatenando, minimizando e compactando seus ativos JavaScript.

### Joomla

Uma série de [extensões Joomla](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance) podem acelerar seu site concatenando, minificando e compactando seus scripts. Também existem modelos que fornecem essa funcionalidade.

### Magento

Use o [Terser](https://www.npmjs.com/package/terser) para minificar todos os ativos JavaScript da implantação de conteúdo estático e desabilite o recurso de minificação integrado.

### React

Se o seu sistema de construção minifica os arquivos JS automaticamente, certifique-se de que você está implantando a [construção](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build) de produção do seu aplicativo. Você pode verificar isso com a extensão React Developer Tools.

### WordPress

Vários [plug-ins](https://wordpress.org/plugins/search/minify+javascript/) do WordPress podem acelerar seu site concatenando, minificando e compactando seus scripts. Você também pode usar um processo de construção para fazer essa redução antecipadamente, se possível.

## Recursos

- [Código-fonte para auditoria **Minify JavaScript**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/unminified-javascript.js)
