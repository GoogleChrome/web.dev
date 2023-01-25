---
layout: post
title: "Un guide pour permettre l'isolement d'origines multiples"
authors:
  - agektmr
date: 2021-02-09
updated: 2021-05-06
subhead: "L'isolement d'origines multiples permet à une page Web d'utiliser des fonctionnalités puissantes telles que SharedArrayBuffer. Cet article explique comment activer l'isolement d'origines multiples sur votre site Web."
description: "L'isolement d'origines multiples permet à une page Web d'utiliser des fonctionnalités puissantes telles que SharedArrayBuffer. Cet article explique comment activer l'isolement d'origines multiples sur votre site Web."
tags:
  - security
---

Ce guide vous montre comment activer l'isolement d'origines multiples. L'isolement d'origines multiples est requis si vous souhaitez utiliser [`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), [`performance.measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/), [un minuteur haute résolution avec une meilleure précision](https://developer.chrome.com/blog/cross-origin-isolated-hr-timers/) ou l'API JS Self-Profiling.

Si vous souhaitez activer l'isolement d'origines multiples, évaluez l'impact que cela aura sur d'autres ressources d'origines multiples de votre site Web, telles que l'emplacement des annonces.

{% Details %} {% DetailsSummary %} Déterminez où sur votre site Web `SharedArrayBuffer` est utilisé.

À partir de Chrome 92, les fonctionnalités qui utilisent `SharedArrayBuffer` ne fonctionneront plus sans l'isolement d'origines multiples. Si vous avez atterri sur cette page en raison d'un message d'obsolescence `SharedArrayBuffer`, il est probable que votre site Web ou l'une des ressources qui y sont intégrées utilise `SharedArrayBuffer`. Pour vous assurer qu'aucun problème ne survienne sur votre site Web en raison d'une obsolescence, commencez par identifier où il est utilisé.

{% endDetailsSummary %}

{% Aside 'objective' %}

- Activez l'isolement d'origines multiples pour continuer à utiliser `SharedArrayBuffer`.
- Si vous vous basez sur un code tiers qui utilise `SharedArrayBuffer`, informez le fournisseur tiers pour qu'il prenne des mesures. {% endAside %}

Si vous ne savez pas où un `SharedArrayBuffer` est utilisé sur votre site, il existe deux façons de le savoir :

- Utiliser Chrome DevTools
- (Avancé) Utiliser les rapports d'obsolescence

Si vous savez déjà où vous utilisez un `SharedArrayBuffer`, passez à [Analyser l'impact de l'isolement d'origines multiples](#analysis).

### Utiliser Chrome DevTools

[Chrome DevTools](https://developer.chrome.com/docs/devtools/open/) permet aux développeurs d'inspecter les sites Web.

1. [Ouvrez Chrome DevTools](https://developer.chrome.com/docs/devtools/open/) sur la page que vous soupçonnez d'utiliser un `SharedArrayBuffer`.
2. Sélectionnez le panneau **Console.**
3. Si la page utilise un `SharedArrayBuffer`, le message suivant s'affichera :
    ```text
    [Obsolescence] SharedArrayBuffer exigera l'isolement d'origines multiples à partir de la version M92, vers le mois de mai 2021. Consultez le lien suivant : https://developer.chrome.com/blog/enabling-shared-array-buffer/ pour en savoir plus. common-bundle.js:535
    ```
4. Le nom de fichier et le numéro de ligne à la fin du message (par exemple, `common-bundle.js:535`) indiquent d'où vient le `SharedArrayBuffer`. S'il s'agit d'une bibliothèque tierce, contactez le développeur pour résoudre le problème. S'il est implémenté dans le cadre de votre site Web, suivez le guide ci-dessous pour activer l'isolement d'origines multiples.

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/GOgkyjAabePTc8AG22F7.png", alt="Avertissement DevTools Console lorsqu'un SharedArrayBuffer est utilisé sans isolement d'origines multiples", width="800", height="163" %}<figcaption> Avertissement DevTools Console lorsqu'un SharedArrayBuffer est utilisé sans isolement d'origines multiples.</figcaption></figure>

### (Avancé) Utilisation des rapports d'obsolescence

Certains navigateurs disposent d'[une fonctionnalité de rapport d'obsolescence des API](https://wicg.github.io/deprecation-reporting/) à un point de terminaison spécifié.

1. [Configurez un serveur de rapports d'obsolescence et obtenez l'URL du rapport](/coop-coep/#set-up-reporting-endpoint). Pour cela, utilisez un service public ou créez-en une vous-même.
2. À l'aide de l'URL, définissez l'en-tête HTTP suivant sur les pages qui abritent potentiellement un `SharedArrayBuffer`.
    ```http
    Report-To: {"group":"default","max_age":86400,"endpoints":[{"url":"THE_DEPRECATION_ENDPOINT_URL"}]}
    ```
3. Une fois que l'en-tête commence à se propager, le point de terminaison que vous avez inscrit doit commencer à collecter des rapports d'obsolescence.

Pour voir un exemple d'implémentation, accédez au lien suivant : [https://cross-origin-isolation.glitch.me](https://cross-origin-isolation.glitch.me).

{% endDetails %}

## Analyser l'impact de l'isolement d'origines multiples {: #analysis}

Ne serait-il pas formidable de pouvoir évaluer l'impact de l'activation de l'isolement d'origines multiples sur votre site sans prendre le risque d'endommager quoi que ce soit ? C'est exactement ce que les en-têtes HTTP [`Cross-Origin-Opener-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) et [`Cross-Origin-Embedder-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) vous permettent de faire.

1. Définissez [`Cross-Origin-Opener-Policy-Report-Only: same-origin`](/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document) sur votre document de premier niveau. Comme son nom l'indique, cet en-tête envoie uniquement des rapports sur l'impact que `COOP: same-origin` **aurait** sur votre site ; il ne désactivera pas réellement la communication avec les fenêtres contextuelles.
2. Configurez la création de rapports et configurez un serveur Web pour recevoir et enregistrer les rapports.
3. Définissez [`Cross-Origin-Embedder-Policy-Report-Only: require-corp`](/coop-coep/#3.-use-the-coep-report-only-http-header-to-assess-embedded-resources) sur votre document de premier niveau. Encore une fois, cet en-tête vous permet de visualiser l'impact de l'activation de `COEP: require-corp` sans réellement affecter le fonctionnement de votre site pour le moment. Vous pouvez configurer cet en-tête pour envoyer des rapports au même serveur de rapports que celui que vous avez configuré à l'étape précédente.

{% Aside %} Vous pouvez également [activer la colonne **Domaine**](https://developer.chrome.com/docs/devtools/network/#information) dans le panneau **Réseau** de Chrome DevTools pour obtenir une vue générale des ressources susceptibles d'être affectées. {% endAside %}

{% Aside 'caution' %}

L'activation de l'isolement d'origines multiples bloquera le chargement des ressources d'origines multiples que vous n'activez pas explicitement, et cela empêchera votre document de premier niveau de pouvoir communiquer avec les fenêtres contextuelles.

Nous avons étudié des moyens de déployer `Cross-Origin-Resource-Policy` à grande échelle, car l'isolement d'origines multiples nécessite que toutes les sous-ressources soient explicitement acceptées. Nous avons eu l'idée de faire l'inverse : [un nouveau mode COEP « sans informations d'identification »](https://github.com/mikewest/credentiallessness/) qui permet de charger des ressources sans l'en-tête CORP en supprimant toutes leurs informations d'identification. Nous sommes en train de déterminer les détails de la façon dont cela devrait fonctionner, mais nous espérons que cela vous soulagera de l'obligation de vérifier que les sous-ressources envoient bien l'en-tête `Cross-Origin-Resource-Policy`.

On sait en outre que l'en-tête `Cross-Origin-Opener-Policy: same-origin` rompra les intégrations qui nécessitent des interactions de fenêtre d'origines multiples telles que OAuth et les paiements. Pour atténuer ce problème, nous étudions l'[assouplissement des conditions](https://github.com/whatwg/html/issues/6364) permettant l'isolement d'origines multiples avec `Cross-Origin-Opener-Policy: same-origin-allow-popups`. De cette façon, la communication avec la fenêtre ouverte par elle-même sera possible.

Si vous souhaitez activer l'isolement d'origines multiples mais êtes bloqué par ces difficultés, nous vous recommandons de vous [inscrire à un essai d'origine](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial) et d'attendre que les nouveaux modes soient disponibles. Nous ne prévoyons pas de mettre fin à l'essai d'origine tant que ces nouveaux modes ne seront pas disponibles.

{% endAside %}

## Atténuer l'impact de l'isolement d'origines multiples

Une fois que vous avez déterminé quelles ressources seront affectées par l'isolement d'origines multiples, prenez connaissance des directives générales sur la façon dont vous optez réellement pour ces ressources d'origines multiples :

1. Pour les ressources d'origines multiples telles que les images, les scripts, les feuilles de style, les iframes et autres, définissez l'en-tête [`Cross-Origin-Resource-Policy: cross-origin`](https://resourcepolicy.fyi/#cross-origin). Pour les ressources du même site, définissez l'en-tête [`Cross-Origin-Resource-Policy: same-site`](https://resourcepolicy.fyi/#same-origin).
2. Définissez l'attribut `crossorigin` dans la balise HTML du document de premier niveau si la ressource est fournie avec [CORS](/cross-origin-resource-sharing/) (par exemple, `<img src="example.jpg" crossorigin>`).
3. Si les ressources d'origines multiples chargées dans les iframes impliquent une autre couche d'iframes, appliquez de manière récursive les étapes décrites dans cette section avant de continuer.
4. Une fois que vous avez confirmé que toutes les ressources d'origines multiples sont activées, définissez `Cross-Origin-Embedder-Policy: require-corp` sur les ressources d'origines multiples chargées dans les iframes.
5. Assurez-vous qu'il n'y a pas de fenêtres contextuelles d'origines multiples nécessitant une communication via `postMessage()`. Il n'y a aucun moyen de les faire fonctionner lorsque l'isolement d'origines multiples est activé. Vous pouvez déplacer la communication vers un autre document sans isolement d'origines multiples ou utiliser une méthode de communication différente (par exemple, des requêtes HTTP).

## Activer l'isolement d'origines multiples

Une fois que vous avez atténué l'impact grâce à l'isolement d'origines multiples, prenez connaissance des directives générales sur la façon dont vous pouvez l'activer :

1. Définissez l'en-tête `Cross-Origin-Opener-Policy: same-origin` sur votre document de premier niveau. Si vous aviez défini `Cross-Origin-Opener-Policy-Report-Only: same-origin`, remplacez-le. Cela bloque la communication entre votre document de premier niveau et ses fenêtres contextuelles.
2. Définissez l'en-tête `Cross-Origin-Embedder-Policy: require-corp` sur votre document de premier niveau. Si vous aviez défini `Cross-Origin-Embedder-Policy-Report-Only: require-corp`, remplacez-le. Cela bloquera le chargement des ressources d'origines multiples qui ne sont pas activées.
3. Vérifiez que `self.crossOriginIsolated` renvoie `true` dans la console pour vérifier que votre page est soumise à l'isolement d'origines multiples.

{% Aside 'gotchas' %}

L'activation de l'isolement d'origines croisées sur un serveur local peut être difficile car les serveurs simples ne prennent pas en charge l'envoi d'en-têtes. Vous pouvez lancer Chrome avec un indicateur de ligne de commande `--enable-features=SharedArrayBuffer` pour activer l'objet `SharedArrayBuffer` sans activer l'isolement d'origines croisées. Découvrez [comment exécuter Chrome avec un indicateur de ligne de commande sur différentes plateformes](https://www.chromium.org/developers/how-tos/run-chromium-with-flags).

{% endAside %}

## Ressources

- [Making your website "cross-origin isolated" using COOP and COEP](/coop-coep/)
- [SharedArrayBuffer updates in Android Chrome 88 and Desktop Chrome 92](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
