---
layout: post
title: Inclui bibliotecas JavaScript front-end com vulnerabilidades de segurança conhecidas
description: |2

  Aprenda como tornar sua página mais segura substituindo as bibliotecas JavaScript

  que têm vulnerabilidades conhecidas.
web_lighthouse:
  - no-vulnerable-libraries
date: 2019-05-02
updated: 2020-06-04
---

Os invasores têm rastreadores da web automatizados que podem varrer seu site em busca de vulnerabilidades de segurança conhecidas. Quando o rastreador da web detecta uma vulnerabilidade, ele alerta o intruso. A partir daí, o invasor só precisa descobrir como explorar a vulnerabilidade em seu site.

## Como esta auditoria Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza bibliotecas JavaScript front-end com vulnerabilidades de segurança conhecidas:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7xN0qVP92s6g1XrNru1f.png", alt="Auditoria de Lighthouse mostrando quaisquer bibliotecas JavaScript front-end com vulnerabilidades de segurança conhecidas usadas pela página", width="800", height="190" %}</figure>

Para detectar bibliotecas vulneráveis, o Lighthouse:

- Executa o [detector de biblioteca para o Chrome](https://www.npmjs.com/package/js-library-detector).
- Verifica a lista de bibliotecas detectadas no [banco de dados de vulnerabilidade do snyk](https://snyk.io/vuln?packageManager=all).

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Pare de usar bibliotecas JavaScript inseguras

Pare de usar cada uma das bibliotecas sinalizadas pelo Lighthouse. Se a biblioteca lançou uma versão mais recente que corrige a vulnerabilidade, atualize para essa versão. Se a biblioteca não lançou uma nova versão ou não é mais mantida, considere o uso de uma biblioteca diferente.

Clique nos links na **coluna Versão** da biblioteca de seu relatório para saber mais sobre as vulnerabilidades de cada biblioteca.

## Recursos

- [Código-fonte para auditoria **Inclui bibliotecas de front-end JavaScript com de vulnerabilidades de segurança conhecidas**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-vulnerable-libraries.js)
- [Banco de dados de vulnerabilidade de snyk](https://snyk.io/vuln?packageManager=all)
