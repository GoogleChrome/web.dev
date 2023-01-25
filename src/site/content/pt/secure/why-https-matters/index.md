---
layout: post
title: Por que HTTPS é importante
authors:
  - kaycebasques
date: 2015-11-23
updated: 2020-04-07
description: |-
  HTTPS protege a integridade do seu site, protege a privacidade e segurança de
  seus usuários e é um pré-requisito de novas e poderosas APIs da plataforma web.
tags:
  - security
---

Você deve sempre proteger todos os seus sites com HTTPS, mesmo que eles não lidem com comunicações confidenciais. Além de fornecer segurança crítica e integridade de dados para seus sites e informações pessoais de seus usuários, HTTPS é um requisito obrigatório para muitos novos recursos do navegador, especialmente aqueles necessários para [progressive web apps](/progressive-web-apps).

{% YouTube 'iP75a1Y9saY' %}

## Resumo {: #summary }

- Tanto invasores malignos como benignos exploram todos os recursos desprotegidos entre seus sites e usuários.
- Muitos invasores analisam comportamentos agregados para identificar seus usuários.
- HTTPS não apenas protege contra o uso indevido do seu site. Também é um requisito obrigatório para muitos recursos modernos e uma tecnologia que permite recursos semelhantes a aplicações, como os service workers.

## HTTPS protege a integridade do seu site {: #integrity }

HTTPS ajuda a evitar que invasores interfiram nas comunicações entre seus sites e os navegadores de seus usuários. Os invasores incluem tanto aqueles realmente mal-intencionados como também empresas legítimas, mas intrusivas, como ISPs ou hotéis que injetam anúncios nas páginas.

Os invasores exploram comunicações desprotegidas para induzir seus usuários a fornecer informações confidenciais ou instalar malware, ou para inserir seus próprios anúncios usando seus recursos. Por exemplo, alguns terceiros injetam anúncios em sites que podem prejudicar as experiências do usuário e criar vulnerabilidades de segurança.

Os invasores exploram todos os recursos desprotegidos que trafegam entre seus sites e seus usuários. Imagens, cookies, scripts, HTML… Tudo pode ser explorado. As invasões podem ocorrer em qualquer ponto da rede, inclusive na máquina do usuário, um ponto de acesso Wi-Fi ou um ISP comprometido, apenas para citar alguns.

## HTTPS protege a privacidade e segurança de seus usuários {: #privacy }

O HTTPS impede que invasores possam ouvir passivamente as comunicações entre seus sites e seus usuários.

Um equívoco comum sobre HTTPS é que os únicos sites que precisam de HTTPS são aqueles que lidam com comunicações confidenciais. Cada solicitação HTTP desprotegida pode revelar informações sobre os comportamentos e identidades de seus usuários. Embora uma única visita a um de seus sites desprotegidos possa parecer benigna, alguns invasores olham para as atividades de navegação agregadas de seus usuários para fazer inferências sobre seus comportamentos e intenções e para [desanonimizar](https://en.wikipedia.org/wiki/De-anonymization) suas identidades. Por exemplo, funcionários podem divulgar sem querer condições de saúde sensíveis a seus empregadores simplesmente lendo artigos médicos desprotegidos.

## HTTPS é o futuro da web {: #capabilities }

Novos recursos de plataforma da web poderosos, como tirar fotos ou gravar áudio com `getUserMedia()`, ativar experiências de aplicações off-line com [service workers](/service-workers-cache-storage/) ou criar [progressive web apps](/progressive-web-apps), requerem permissão explícita do usuário antes de executar. Muitas APIs mais antigas também estão sendo atualizadas para exigir permissão de execução, como a [API de geolocalização](https://developer.mozilla.org/docs/Web/API/Geolocation/Using_geolocation). HTTPS é um componente-chave para os workflows de permissão para esses novos recursos e APIs atualizadas.
