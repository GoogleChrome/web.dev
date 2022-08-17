---
layout: post
title: "Amélioration de la confidentialité des utilisateurs et de l'expérience des développeurs avec les conseils client User-Agent"
subhead: |-
 "User-Agent Client Hints est une nouvelle extension de l'API Client Hints, qui"
 "permet aux développeurs d'accéder à des informations sur le navigateur d'un utilisateur dans un"
  manière ergonomique et respectueuse de la vie privée.
authors:
  - rowan_m
  - yoavweiss
date: 2020-06-25
updated: 2021-09-10
hero: image/admin/xlg4t3uiTp0L5TBThFHQ.jpg
thumbnail: image/admin/hgxRNa56Vb9o3QRwIrm9.jpg
alt: "Un plan d'un pont et quelques outils de dessin vintage."
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% YouTube 'f0YY0o2OAKA' %}

Les Client Hints (indications du client, en français) permettent aux développeurs de demander activement des informations sur l'appareil ou les conditions de l'utilisateur, plutôt que d'avoir à les analyser à partir de la chaîne User-Agent (UA). Fournir cette route alternative est la première étape pour éventuellement réduire la granularité de la chaîne User-Agent.

Découvrez comment mettre à jour votre fonctionnalité existante qui repose sur l'analyse de la chaîne User-Agent pour utiliser User-Agent Client Hints à la place.

{% Aside 'caution' %} Si vous utilisez déjà User-Agent Client Hints, notez que le format d'en-tête a changé depuis Chrome 90, de sorte que les jetons Accept-CH doivent correspondre exactement aux en-têtes renvoyés. {% endAside %}

## Contexte

Lorsque les navigateurs Web font des requêtes, ils incluent des informations sur le navigateur et son environnement afin que les serveurs puissent activer l'analyse et personnaliser la réponse. Cela a été défini depuis 1996 (RFC 1945 pour HTTP/1.0), où vous pouvez trouver la [définition d'origine de la chaîne User-Agent](https://tools.ietf.org/html/rfc1945#section-10.15), qui comprend l'exemple suivant :

```text
User-Agent: CERN-LineMode/2.15 libwww/2.17b3
```

Cet en-tête était destiné à préciser, par ordre d'importance, le produit (par exemple, le navigateur ou la bibliothèque) et un commentaire (par exemple, la version).

### L'état de la chaîne User-Agent

Au cours des *décennies* qui ont suivi, cette chaîne a accumulé une variété de détails supplémentaires sur le client effectuant la requête (ainsi que des erreurs, en raison de la rétrocompatibilité). Nous pouvons le voir en regardant la chaîne User-Agent actuelle de Chrome :

```text
Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4076.0 Mobile Safari/537.36
```

La chaîne ci-dessus contient des informations sur le système d'exploitation et la version de l'utilisateur, le modèle de l'appareil, la marque et la version complète du navigateur, suffisamment d'indices pour en déduire qu'il s'agit d'un navigateur mobile, sans parler d'un certain nombre de références à d'autres navigateurs pour des raisons historiques.

La combinaison de ces paramètres avec la grande diversité des valeurs possibles signifie que la chaîne User-Agent pourrait contenir suffisamment d'informations pour permettre aux utilisateurs individuels d'être identifiés de manière unique. Si vous testez votre propre navigateur sur [AmIUnique](https://amiunique.org/), vous pouvez voir à quel point **votre** chaîne User-Agent **vous** identifie. Plus le "rapport de similitude" qui en résulte est faible, plus vos requêtes sont uniques, plus il est facile pour les serveurs de vous suivre secrètement.

La chaîne User-Agent permet de nombreux [cas d'utilisation](https://wicg.github.io/ua-client-hints/#use-cases) légitimes et joue un rôle important pour les développeurs et les propriétaires de sites. Cependant, il est également essentiel que la confidentialité des utilisateurs soit protégée contre les méthodes de suivi secrètes, et l'envoi d'informations UA par défaut va à l'encontre de cet objectif.

Il est également nécessaire d'améliorer la compatibilité Web en ce qui concerne la chaîne User-Agent. Comme elle n'est pas structurée, son analyse entraîne donc une complexité inutile, ce qui est souvent à l'origine de bugs et de problèmes de compatibilité de site qui nuisent aux utilisateurs. Ces problèmes affectent également de manière disproportionnée les utilisateurs de navigateurs moins répandus, car les sites peuvent avoir échoué à tester leur configuration.

## Présentation du nouveau User-Agent Client Hints

[User-Agent Client Hints](https://github.com/WICG/ua-client-hints#explainer-reducing-user-agent-granularity) permet d'accéder aux mêmes informations, mais d'une manière plus respectueuse de la vie privée, permettant ainsi aux navigateurs de réduire éventuellement la diffusion par défaut de la chaîne User-Agent. Les [Client Hints](https://datatracker.ietf.org/doc/html/rfc8942) appliquent un modèle dans lequel le serveur doit demander au navigateur un ensemble de données sur le client (les indications) et le navigateur applique ses propres politiques ou configuration utilisateur pour déterminer quelles données sont renvoyées. Ainsi, au lieu d'exposer **toutes** les informations User-Agent par défaut, l'accès est désormais géré de manière explicite et auditable. Les développeurs bénéficient également d'une API plus simple, plus besoin d'expressions régulières !

L'ensemble actuel des Client Hints décrit principalement les capacités d'affichage et de connexion du navigateur. Vous pouvez explorer les détails dans [Automatisation de la sélection des ressources avec les Client Hints](https://developer.chrome.com/blog/automating-resource-selection-with-client-hints/), mais retrouvez ci-dessous un rappel du processus.

Le serveur demande des Client Hints spécifiques via un en-tête :

⬇️ *Réponse du serveur*

```text
Accept-CH: Viewport-Width, Width
```

Ou une balise méta :

```html
<meta http-equiv="Accept-CH" content="Viewport-Width, Width" />
```

Le navigateur peut alors choisir de renvoyer les en-têtes suivants dans les requêtes ultérieures :

⬆️ *Requête ultérieure*

```text
Viewport-Width: 460
Width: 230
```

Le serveur peut choisir de varier ses réponses, par exemple en proposant des images à une résolution appropriée.

{% Aside %} Des discussions sont en cours sur l'activation des Client Hints sur une requête initiale, mais il est conseillé d'envisager une [conception dynamique](/responsive-web-design-basics) ou une amélioration progressive avant de vous engager dans cette voie. {% endAside %}

User-Agent Client Hints élargit la plage de propriétés avec le préfixe `Sec-CH-UA` qui peut être spécifié via l'en-tête de réponse du serveur `Accept-CH`. Pour plus d'informations, consultez cette [explication](https://github.com/WICG/ua-client-hints/blob/main/README.md), puis plongez dans la [proposition complète](https://wicg.github.io/ua-client-hints/).

{% Aside %} Les Client Hints **ne sont envoyés que via des connexions sécurisées**, alors assurez-vous d'avoir [migré votre site vers HTTPS](/why-https-matters). {% endAside %}

## User-Agent Client Hints depuis Chromium 89

User-Agent Client Hints est activé par défaut dans Chrome depuis la version 89.

Par défaut, le navigateur renvoie le modèle du navigateur, la version significative/principale, la plate-forme et un indicateur si le client est sur un appareil mobile :

⬆️ *Toutes les requêtes*

```text
Sec-CH-UA: "Chromium";v="93", "Google Chrome";v="93", " Not;A Brand";v="99"
Sec-CH-UA-Mobile: ?0
Sec-CH-UA-Platform: "macOS"
```

{% Aside 'caution' %} Ces propriétés sont plus complexes qu'une simple valeur, donc les [en-têtes structurés](https://httpwg.org/http-extensions/draft-ietf-httpbis-header-structure.html) sont utilisés pour représenter les listes et les booléens. {% endAside %}

### En-têtes de réponse et de requête User-Agent

<style>
.table-wrapper th:nth-of-type(1), .table-wrapper th:nth-of-type(2) {
    width: 28ch;
}

.table-wrapper td {
  padding: 4px 8px 4px 0;
}
</style>

⬇️ Réponse `Accept-CH`<br> ⬆️ En-tête de demande | ⬆️ Requête<br> Exemple de valeur | Description
--- | --- | ---
`Sec-CH-UA` | `"Chromium";v="84",`<br>`"Google Chrome";v="84"` | Liste des modèles de navigateurs et leur version significative.
`Sec-CH-UA-Mobile` | `?1` | Booléen indiquant si le navigateur est sur un appareil mobile ( `?1` pour vrai) ou non ( `?0` pour faux).
`Sec-CH-UA-Full-Version` | `"84.0.4143.2"` | [ **Obsolète** ]La version complète pour le navigateur.
`Sec-CH-UA-Full-Version-List` | `"Chromium";v="84.0.4143.2",`<br>`"Google Chrome";v="84.0.4143.2"` | List of browser brands and their full version.
`Sec-CH-UA-Platform` | `"Android"` | La plate-forme de l'appareil, généralement le système d'exploitation (OS).
`Sec-CH-UA-Platform-Version` | `"10"` | La version de la plate-forme ou du système d'exploitation.
`Sec-CH-UA-Arch` | `"arm"` | L'architecture sous-jacente de l'appareil. Bien que cela ne soit pas forcément pertinent pour l'affichage de la page, le site peut vouloir proposer un téléchargement qui utilise par défaut le bon format.
`Sec-CH-UA-Model` | `"Pixel 3"` | Le modèle de l'appareil.
`Sec-CH-UA-Bitness` | `"64"` | Le nombre de bits de l'architecture sous-jacente (c'est-à-dire la taille en bits d'un entier ou d'une adresse mémoire).

{% Aside 'gotchas' %} Des considérations de confidentialité et de compatibilité signifient que la valeur peut être vide, non renvoyée ou renseignée avec une valeur variable. C'est ce qu'on appelle  [GREASE](https://wicg.github.io/ua-client-hints/#grease). {% endAside %}

### Exemple d'échange

Un exemple d'échange ressemble à ceci :

⬆️ *Requête initiale du navigateur*<br> Le navigateur fait la requête de la page `/downloads` du site et envoie son User-Agent de base par défaut.

```text
GET /downloads HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="93", "Google Chrome";v="93", " Not;A Brand";v="99"
Sec-CH-UA-Mobile: ?1
Sec-CH-UA-Platform: "Android"
```

⬇️ *Réponse du serveur*<br> Le serveur renvoie la page et fait en plus la requête de la version complète du navigateur et de la plate-forme.

```text
HTTP/1.1 200 OK
Accept-CH: Sec-CH-UA-Full-Version-List
```

⬆️ *Requêtes ultérieures*<br> Le navigateur accorde au serveur l'accès aux informations supplémentaires et renvoie les indications supplémentaires dans toutes les requêtes ultérieures.

```text
GET /downloads/app1 HTTP/1.1
Host: example.site

Sec-CH-UA: " Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"
Sec-CH-UA-Mobile: ?1
Sec-CH-UA-Full-Version-List: " Not A;Brand";v="99.0.0.0", "Chromium";v="98.0.4738.0", "Google Chrome";v="98.0.4738.0"
Sec-CH-UA-Platform: "Android"
```

### API JavaScript

Outre les en-têtes, le User-Agent est également accessible en JavaScript via `navigator.userAgentData`. Les informations d'en-tête par défaut `Sec-CH-UA`, `Sec-CH-UA-Mobile` et `Sec-CH-UA-Platform` sont accessibles via les propriétés `brands` et `mobile`, respectivement :

```js
// Log the brand data
console.log(navigator.userAgentData.brands);

// output
[
  {
    brand: 'Chromium',
    version: '93',
  },
  {
    brand: 'Google Chrome',
    version: '93',
  },
  {
    brand: ' Not;A Brand',
    version: '99',
  },
];

// Log the mobile indicator
console.log(navigator.userAgentData.mobile);

// output
false;

// Log the platform value
console.log(navigator.userAgentData.platform);

// output
"macOS";
```

Les valeurs supplémentaires sont accessibles via l'appel `getHighEntropyValues()`. Le terme "entropie élevée" fait référence à l'[entropie de l'information](https://en.wikipedia.org/wiki/Entropy_(information_theory)), c'est-à-dire à la quantité d'informations que ces valeurs révèlent sur le navigateur de l'utilisateur. Comme pour la requête d'en-têtes supplémentaires, il appartient au navigateur de déterminer quelles valeurs, le cas échéant, sont renvoyées.

```js
// Log the full user-agent data
navigator
  .userAgentData.getHighEntropyValues(
    ["architecture", "model", "bitness", "platformVersion",
     "fullVersionList"])
  .then(ua => { console.log(ua) });

// output
{
   "architecture":"x86",
   "bitness":"64",
   "brands":[
      {
         "brand":" Not A;Brand",
         "version":"99"
      },
      {
         "brand":"Chromium",
         "version":"98"
      },
      {
         "brand":"Google Chrome",
         "version":"98"
      }
   ],
   "fullVersionList":[
      {
         "brand":" Not A;Brand",
         "version":"99.0.0.0"
      },
      {
         "brand":"Chromium",
         "version":"98.0.4738.0"
      },
      {
         "brand":"Google Chrome",
         "version":"98.0.4738.0"
      }
   ],
   "mobile":false,
   "model":"",
   "platformVersion":"12.0.1"
}
```

### Démo

Vous pouvez essayer les en-têtes et l'API JavaScript sur votre propre appareil à l'adresse [user-agent-client-hints.glitch.me](https://user-agent-client-hints.glitch.me).

{% Aside %} Assurez-vous que vous utilisez Chrome 89 ou une version supérieure. {% endAside %}

### Durée de vie et réinitialisation des indications

Les indications spécifiées via l'en-tête `Accept-CH` seront envoyées pendant la durée de la session du navigateur ou jusqu'à ce qu'un autre ensemble d'indications soit spécifié.

Cela signifie que si le serveur envoie :

⬇️ *Réponse*

```text
Accept-CH: Sec-CH-UA-Full-Version-List
```

Ensuite, le navigateur enverra l'en-tête `Sec-CH-UA-Full-Version` dans toutes les requêtes pour ce site jusqu'à ce que le navigateur soit fermé.

⬆️ *Requêtes ultérieures*

```text
Sec-CH-UA-Full-Version-List: " Not A;Brand";v="99.0.0.0", "Chromium";v="98.0.4738.0", "Google Chrome";v="98.0.4738.0"
```

Cependant, si un autre en-tête `Accept-CH` est reçu, cela **remplacera complètement** les indications actuelles envoyées par le navigateur.

⬇️ *Réponse*

```text
Accept-CH: Sec-CH-UA-Bitness
```

⬆️ *Requêtes ultérieures*

```text
Sec-CH-UA-Platform: "64"
```

La version `Sec-CH-UA-Full-Version-List` **{nbsp}précédemment demandée ne sera pas envoyée**.

Il est préférable de considérer l'en-tête `Accept-CH` comme spécifiant l'ensemble complet d'indications souhaitées pour cette page, ce qui signifie que le navigateur envoie ensuite les indications spécifiées pour toutes les sous-ressources de cette page. Bien que les indications persistent jusqu'à la prochaine navigation, le site ne doit pas compter sur le fait, ou supposer, que ces indications seront transmises.

{% Aside 'success' %} Assurez-vous de toujours pouvoir offrir une expérience pertinente même sans ces informations. Il s'agit d'améliorer l'expérience utilisateur, et non de la définir. C'est pourquoi on les appelle "indications", et non "réponses" ou "exigences" ! {% endAside%}

Vous pouvez également utiliser cette méthode pour effacer efficacement toutes les indications envoyées par le navigateur en envoyant `Accept-CH` vide dans la réponse. Pensez à l'ajouter partout où l'utilisateur réinitialise ses préférences ou se déconnecte de votre site.

Ce modèle correspond également au fonctionnement des indications via la balise `<meta http-equiv="Accept-CH" …>`. Les indications demandées ne seront envoyées que sur les requêtes initiées par la page, et non lors d'une éventuelle navigation ultérieure.

### Portée des indications et requêtes cross-origin

Par défaut, les Client Hints ne sont envoyés que sur les requêtes same-origin. Ainsi, si vous demandez des indications spécifiques sur `https://example.com`, mais que les ressources que vous souhaitez optimiser se trouvent sur `https://downloads.example.com`, elles ne recevront **aucune** indication.

Pour autoriser les indications sur les requêtes cross-origin, chaque indication et origine doivent être spécifiées par un en-tête `Permissions-Policy`. Pour appliquer cela à un User-Agent Client Hint, vous devez mettre l'indication en minuscules et supprimer le préfixe `sec-`. Par exemple :

⬇️ *Réponse de `example.com`*

```text
Accept-CH: Sec-CH-UA-Platform-Version, DPR
Permissions-Policy: ch-ua-platform-version=(self "downloads.example.com"),
                    ch-dpr=(self "cdn.provider" "img.example.com");
```

⬆️ *Requête à `downloads.example.com`*

```text
Sec-CH-UA-Platform-Version: "10"
```

⬆️ *Requêtes à `cdn.provider` ou `img.example.com`*

```text
DPR: 2
```

## Où utiliser User-Agent Client Hints ?

La réponse rapide est que vous devez refactoriser toutes les instances où vous analysez l'en-tête User-Agent ou utilisez l'un des appels JavaScript qui accèdent aux mêmes informations (c'est-à-dire `navigator.userAgent`, `navigator.appVersion` ou `navigator.platform`) pour utiliser User-Agent Client Hints à la place.

Pour aller plus loin, vous devez réexaminer votre utilisation des informations User-Agent et les remplacer par d'autres méthodes chaque fois que possible. Souvent, vous pouvez atteindre le même objectif en utilisant l'amélioration progressive, la détection de fonctionnalités ou une [conception dynamique](/responsive-web-design-basics). Le problème majeur en s'appuyant sur les données User-Agent est que vous maintenez toujours un mappage entre la propriété que vous inspectez et le comportement qu'elle active. Il s'agit d'une surcharge de maintenance pour garantir que votre détection est complète et reste à jour.

Avec ces mises en garde à l'esprit, le [référentiel User-Agent Client Hints répertorie certains cas d'utilisation valides](https://wicg.github.io/ua-client-hints/#use-cases) pour les sites.

## Qu'advient-il de la chaîne User-Agent ?

L'objectif consiste à minimiser la possibilité d'un suivi secret sur le Web en réduisant la quantité d'informations d'identification exposées par la chaîne User-Agent existante, sans causer de perturbations excessives sur les sites existants. L'introduction de User-Agent Client Hints vous permet désormais de comprendre et d'expérimenter cette nouvelle fonctionnalité, avant que des modifications ne soient apportées aux chaînes User-Agent.

[Eventuellement](https://blog.chromium.org/2021/05/update-on-user-agent-string-reduction.html), les informations de la chaîne User-Agent seront réduites afin de conserver le format hérité tout en fournissant uniquement les mêmes informations générales sur le navigateur et les versions significatives que dans les indications par défaut. Dans Chromium, ce changement a été reporté au moins jusqu'en 2022 pour donner plus de temps à l'écosystème pour évaluer les nouvelles capacités de User Agent Client Hints.

Vous pouvez tester une version de ceci en activant l'indicateur `about://flags/#reduce-user-agent` de Chrome 93 (Remarque : cet indicateur a été nommé `about://flags/#freeze-user-agent` dans les versions Chrome 84 - 92). Cela renverra une chaîne avec les entrées historiques pour des raisons de compatibilité, mais avec des spécificités épurées. Par exemple :

```text
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Mobile Safari/537.36
```

*Photo de [Sergey Zolkin](https://unsplash.com/@szolkin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) sur [Unsplash](https://unsplash.com/photos/m9qMoh-scfE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*
