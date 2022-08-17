---
title: Explication des Cookies SameSite
subhead: Sécurisez votre site en apprenant à marquer explicitement vos cookies intersites.
authors:
  - rowan_m
date: 2019-05-07
updated: 2020-05-28
hero: image/admin/UTOC41rgCccAqVNbJlyK.jpg
description: "Apprenez à marquer vos cookies pour une utilisation propriétaire et tierce avec l'attribut SameSite. Vous pouvez améliorer la sécurité de votre site en utilisant les valeurs Lax et Strict de SameSite pour améliorer la protection contre les attaques CSRF. La spécification du nouvel attribut None vous permet de marquer explicitement vos cookies pour une utilisation intersites."
tags:
  - blog
  - security
  - cookies
  - chrome-80
feedback:
  - api
---

{% Aside %} Cet article fait partie d'une série sur les modifications apportées aux attributs des cookies `SameSite` :

- [Explication des cookies SameSite](/samesite-cookies-explained/)
- [Recettes pour utiliser les cookies SameSite](/samesite-cookie-recipes/)
- [Schemeful Same-Site](/schemeful-samesite) {% endAside %}

Les cookies permettent d'ajouter un état persistant aux sites Web. Au fil des ans, leurs capacités ont grandi et évolué, mais ont laissé à la plate-forme des problèmes hérités. Pour résoudre ceci, les navigateurs (y compris Chrome, Firefox et Edge) modifient leur comportement pour appliquer davantage de paramètres par défaut préservant la confidentialité.

Chaque cookie est une paire `key=value` avec un certain nombre d'attributs qui contrôlent quand et où ce cookie est utilisé. Vous avez probablement déjà utilisé ces attributs pour définir des éléments tels que des dates d'expiration ou pour indiquer que le cookie ne doit être envoyé que via HTTPS. Les serveurs définissent des cookies en envoyant l'en-tête `Set-Cookie` dans leur réponse. Pour tous les détails, vous pouvez consulter [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1), mais pour l'instant, voici un petit rappel.

Supposons que vous ayez un blog sur lequel vous souhaitez afficher une promotion "Les nouveautés" à vos utilisateurs. Les utilisateurs peuvent ignorer la promotion et ne la reverront plus pendant un certain temps. Vous pouvez stocker cette préférence dans un cookie, la définir pour qu'elle expire dans un mois (2 600 000 secondes) et l'envoyer uniquement via HTTPS. Cet en-tête ressemblerait à ceci :

```text
Set-Cookie: promo_shown=1; Max-Age=2600000; Secure
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jJ1fqcsAk9Ig3hManFBO.png", alt="Trois cookies envoyés à un navigateur depuis un serveur dans une réponse", width="800", height="276", style="max-width: 35vw" %}<figcaption> Les serveurs définissent des cookies à l'aide de l'en-tête <code>Set-Cookie</code></figcaption></figure>

Lorsque votre lecteur consulte une page qui répond à ces exigences, c'est-à-dire qu'il utilise une connexion sécurisée et que le cookie date de moins d'un mois, son navigateur enverra cet en-tête dans sa requête :

```text
Cookie: promo_shown=1
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rq21WQpOZFvfgS9bbjmc.png", alt="Trois cookies envoyés d'un navigateur à un serveur dans une requête", width="800", height="165", style="max-width: 35vw" %}<figcaption> Votre navigateur renvoie des cookies dans l'en-tête <code>Cookie</code></figcaption></figure>

Vous pouvez également ajouter et lire les cookies disponibles sur ce site en JavaScript à l'aide de `document.cookie`. Effectuer une affectation à `document.cookie` créera ou remplacera un cookie avec cette clé. Par exemple, vous pouvez essayer ce qui suit dans la console JavaScript de votre navigateur :

```text
→ document.cookie = "promo_shown=1; Max-Age=2600000; Secure"
← "promo_shown=1; Max-Age=2600000; Secure"
```

La lecture de `document.cookie` affichera tous les cookies accessibles dans le contexte actuel, chaque cookie étant séparé par un point-virgule :

```text
→ document.cookie;
← "promo_shown=1; color_theme=peachpuff; sidebar_loc=left"
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mbV00Gy5VAPTUls0i7cM.png", alt="JavaScript accédant aux cookies dans le navigateur", width="600", height="382", style="max-width: 35vw" %}<figcaption> JavaScript peut accéder aux cookies en utilisant <code>document.cookie</code>.</figcaption></figure>

Si vous essayez ceci sur une sélection de sites populaires, vous remarquerez que la plupart d'entre eux définissent bien plus que trois cookies. Dans la plupart des cas, ces cookies sont envoyés dans chaque requête à ce domaine, ce qui entraîne un certain nombre d'implications. La bande passante de chargement est souvent plus restreinte que le téléchargement pour vos utilisateurs, de sorte que la surcharge de toutes les requêtes sortantes ajoute un délai au premier octet. Soyez prudent dans le nombre et la taille des cookies que vous définissez. Utilisez l'attribut `Max-Age` pour vous assurer que les cookies ne sont pas conservés plus longtemps que nécessaire.

## Que sont les cookies propriétaires et tiers ?

Si vous revenez à la même sélection de sites que précédemment, vous avez probablement remarqué que des cookies étaient présents pour une variété de domaines, et pas seulement sur celui sur lequel vous naviguiez. Les cookies qui correspondent au domaine du site actuel, c'est-à-dire ce qui est affiché dans la barre d'adresse du navigateur, sont appelés cookies **propriétaires**. De même, les cookies provenant de domaines autres que le site actuel sont appelés cookies **tiers**. Il ne s'agit pas d'un libellé absolu, mais relatif au contexte de l'utilisateur : le même cookie peut être soit propriétaire, soit tiers, selon le site sur lequel l'utilisateur se trouve à ce moment-là.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zjXpDz2jAdXMT83Nm3IT.png", alt="Trois cookies envoyés à un navigateur à partir de différentes requêtes sur la même page", width="800", height="346", style="max -largeur : 60vw" %}<figcaption> Les cookies peuvent provenir de différents domaines sur une même page.</figcaption></figure>

En reprenant l'exemple ci-dessus, supposons que l'un de vos articles de blog contient une photo d'un chat particulièrement incroyable et qu'elle est hébergée sur `/blog/img/amazing-cat.png`. Parce que c'est une image tellement fabuleuse, une autre personne l'utilise directement sur son site. Si un visiteur a visité votre blog et possède le cookie `promo_shown`, lorsqu'il consulte `amazing-cat.png` sur le site de l'autre personne, ce cookie **{nbsp}sera envoyé** dans cette requête d'image. Ce n'est pas particulièrement utile puisque `promo_shown` n'est pas utilisé pour une raison quelconque sur le site de cette autre personne, cela ne fait qu'ajouter des surcharges à la requête.

S'il s'agit d'un effet involontaire, pourquoi faire cela ? C'est ce mécanisme qui permet aux sites de conserver leur état lorsqu'ils sont utilisés dans un contexte tiers. Par exemple, si vous intégrez une vidéo YouTube sur votre site, les visiteurs verront une option "Regarder plus tard" dans le lecteur. Si votre visiteur est déjà connecté à YouTube, cette session est rendue accessible dans le lecteur intégré grâce à un cookie tiers. Ainsi, le bouton "Regarder plus tard" enregistrera simplement la vidéo en un clic plutôt que de l'inviter à se connecter ou de l'éloigner de votre page et revenir à YouTube.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/u9chHBLm3i27yFRwHx5W.png", alt="Le même cookie est envoyé dans trois contextes différents", width="800", height="433", style="max-width: 35vw" %} <figcaption> Un cookie dans un contexte tiers est envoyé lors de la visite de différentes pages. </figcaption></figure>

L'une des propriétés culturelles du Web est qu'il a tendance à être ouvert par défaut. Cela fait partie de ce qui a permis à tant de personnes de créer leur propre contenu et applications dessus. Cependant, cela a également entraîné un certain nombre de problèmes de sécurité et de confidentialité. Les attaques de falsification de requête intersites (CSRF) reposent sur le fait que des cookies sont joints à toute requête à une origine donnée, peu importe qui initie la requête. Par exemple, si vous visitez `evil.example`, cela peut déclencher des requêtes vers `your-blog.example`, et votre navigateur se fera un plaisir de joindre les cookies associés. Si votre blog ne fait pas attention à la façon dont il valide ces requêtes, `evil.example` peut déclencher des actions telles que la suppression de publications ou l'ajout de leur propre contenu.

Les utilisateurs sont également de plus en plus conscients de la manière dont les cookies peuvent être utilisés pour suivre leur activité sur plusieurs sites. Cependant, jusqu'à présent, il n'y avait aucun moyen d'indiquer explicitement votre intention en matière de cookies. Votre cookie `promo_shown` ne doit être envoyé que dans un contexte propriétaire, alors qu'un cookie de session pour un widget destiné à être intégré sur d'autres sites est intentionnellement présent pour fournir l'état de connexion dans un contexte tiers.

## Indiquez explicitement l'utilisation des cookies avec l'attribut `SameSite`

L'introduction de l'attribut `SameSite` (défini dans [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00)) vous permet de déclarer si votre cookie doit être restreint à un contexte propriétaire ou de même site. Il est utile de comprendre exactement ce que "site" signifie ici. Le site est la combinaison du suffixe de domaine et de la partie du domaine juste avant. Par exemple, le domaine `www.web.dev` fait partie du site `web.dev`.

{% Aside 'key-term' %}

Si l'utilisateur se trouve sur `www.web.dev` et effectue la requête d'une image à `static.web.dev`, il s'agit alors d'une requête sur le **même site**.

{% endAside %}

La [liste des suffixes publics](https://publicsuffix.org/) définit cela,. Il ne s'agit donc pas seulement de domaines de premier niveau tels que `.com`, mais également de services tels que `github.io`. Cela permet à `your-project.github.io` et `my-project.github.io` de compter comme des sites distincts.

{% Aside 'key-term' %}

Si l'utilisateur est sur `your-project.github.io` et effectue la requête d'une image sur `my-project.github.io`, il s'agit d'une requête **intersite**.

{% endAside %}

L'introduction de l'attribut `SameSite` sur un cookie offre trois manières différentes de contrôler ce comportement. Vous pouvez choisir de ne pas spécifier l'attribut, ou vous pouvez utiliser `Strict` ou `Lax` pour limiter le cookie aux requêtes du même site.

Si vous définissez `SameSite` sur `Strict`, votre cookie ne sera envoyé que dans un contexte propriétaire. En termes d'utilisateur, le cookie ne sera envoyé que si le site pour le cookie correspond au site actuellement affiché dans la barre d'URL du navigateur. Donc, si le cookie `promo_shown` est défini comme suit :

```text
Set-Cookie: promo_shown=1; SameSite=Strict
```

Lorsque l'utilisateur est sur votre site, le cookie sera envoyé avec la requête comme prévu. Cependant, lorsqu'on clique sur lien qui ramène à votre site, par exemple depuis un autre site ou via l'e-mail d'un ami, lors de cette requête initiale, le cookie ne sera pas envoyé. C'est une bonne chose lorsque vous avez des cookies associés à des fonctionnalités qui seront toujours à l'origine d'une navigation initiale, comme changer un mot de passe ou effectuer un achat, mais qui sont trop restrictifs pour `promo_shown`. Si l'un de vos lecteurs clique sur un lien menant vers votre site, il est préférable que le cookie soit envoyé afin que ses préférences puissent être appliquées.

C'est là que `SameSite=Lax` entre en jeu, en permettant l'envoi du cookie avec ces navigations de premier niveau. Revenons à l'exemple de l'article sur le chat ci-dessus, dans lequel un autre site référence votre contenu. Ce dernier utilise directement votre photo de chat et fournit un lien vers votre article d'origine.

```html
<p>Regardez ce chat incroyable !</p>
<img src="https://blog.example/blog/img/amazing-cat.png" />
<p>Lisez l'article ici : <a href="https://blog.example/blog/cat.html"></a>.</p>
```

Et le cookie a été défini comme suit :

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

Lorsque le lecteur est sur le blog de l'autre personne, le cookie **ne sera pas envoyé** lorsque le navigateur effectue la requête `amazing-cat.png`. Cependant, si le lecteur clique sur le lien vers `cat.html` menant vers votre blog, cette requête **inclura** le cookie. `Lax` est donc un bon choix pour les cookies affectant l'affichage du site, `Strict` étant utile pour les cookies liés aux actions de votre utilisateur.

{% Aside 'caution' %}

Ni `Strict` ni `Lax` sont une solution complète pour la sécurité de votre site. Les cookies sont envoyés dans le cadre de la requête de l'utilisateur et vous devez les traiter de la même manière que toute autre entrée utilisateur. Cela signifie désinfecter et valider l'entrée. N'utilisez jamais de cookie pour stocker des données que vous considérez comme un secret côté serveur.

{% endAside %}

Enfin, il y a la possibilité de ne pas spécifier la valeur, ce qui était auparavant le moyen de déclarer implicitement que vous souhaitez que le cookie soit envoyé dans tous les contextes. Dans la dernière version de [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03), cela est rendu explicite en introduisant une nouvelle valeur de `SameSite=None`. Ainsi, vous pouvez utiliser `None` pour indiquer clairement que vous souhaitez intentionnellement que le cookie soit envoyé dans un contexte tiers.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1MhNdg9exp0rKnHpwCWT.png", alt="Trois cookies étiquetés Aucun, Lax ou Strict selon leur contexte", width="800", height="456", style="max-width: 35vw" %}<figcaption> Marquez explicitement le contexte d'un cookie comme <code>None</code>, <code>Lax</code> ou <code>Strict</code>.</figcaption></figure>

{% Aside %}

Si vous fournissez un service que d'autres sites utilisent, comme des widgets, du contenu intégré, des programmes d'affiliation, de la publicité ou une connexion sur plusieurs sites, vous devez utiliser `None` pour assurer que votre intention est claire.

{% endAside %}

## Modifications du comportement par défaut sans SameSite

Bien que l'attribut `SameSite` soit largement pris en charge, il n'a malheureusement pas été adopté massivement par les développeurs. Le principal défaut, l'envoi de cookies partout, signifie que tous les cas d'utilisation fonctionnent, mais laisse l'utilisateur vulnérable au CSRF et aux fuites d'informations non intentionnelles. Pour encourager les développeurs à exprimer leur intention et à offrir aux utilisateurs une expérience plus sûre, la proposition de l'IETF, [Incrementally Better Cookies,](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) présente deux changements clés :

- Les cookies sans l'attribut `SameSite` seront traités comme `SameSite=Lax`.
- Les cookies avec l'attribut `SameSite=None` doivent également spécifier `Secure`, ce qui signifie qu'ils nécessitent un contexte sécurisé.

Chrome implémente ce comportement par défaut à partir de la version 84. Ils sont disponibles sur [Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ) à partir de Firefox 69, qui en fera des comportements par défaut à l'avenir. Pour tester ces comportements dans Firefox, ouvrez la page [`about:config`](http://kb.mozillazine.org/About:config) et configurez `network.cookie.sameSite.laxByDefault`. [Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) prévoit également de modifier ses comportements par défaut.

{% Aside %}

Cet article sera mis à jour au fur et à mesure que d'autres navigateurs annonceront leur prise en charge.

{% endAside %}

### `SameSite=Lax` par défaut

{% Compare 'worse', 'No attribute set' %}

```text
Set-Cookie: promo_shown=1
```

{% CompareCaption %}

Si vous envoyez un cookie sans aucun attribut `SameSite` spécifié…

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Comportement par défaut appliqué' %}

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

{% CompareCaption %}

Le navigateur traitera ce cookie comme si `SameSite=Lax` était spécifié.

{% endCompareCaption %}

{% endCompare %}

Bien que cela soit destiné à appliquer une valeur par défaut plus sécurisée, vous devez idéalement définir un attribut `SameSite` explicite plutôt que de vous fier au navigateur pour l'appliquer à votre place. Cela rend votre intention pour le cookie explicite et améliore les chances d'une expérience cohérente entre les navigateurs.

{% Aside 'caution' %}

Le comportement par défaut appliqué par Chrome est légèrement plus permissif qu'un `SameSite=Lax` explicite car il permettra l'envoi de certains cookies sur les requêtes POST de premier niveau. Vous pouvez voir les détails exacts sur [l'annonce de blink-dev](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/YKBxPCScCwAJ). Il s'agit d'une mesure d'atténuation temporaire. Vous devez toujours modifier vos cookies intersites pour utiliser {code2SameSite=None; Secure.

{% endAside %}

### `SameSite=None` doit être sécurisé

{% Compare 'worse', 'Rejected' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None
```

{% CompareCaption %}

La configuration d'un cookie sans `Secure` **sera rejetée**.

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Accepted' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

{% CompareCaption %}

Vous devez vous assurer de coupler `SameSite=None` avec l'attribut `Secure`

{% endCompareCaption %}

{% endCompare %}

Vous pouvez tester ce comportement à partir de Chrome 76 en activant `about://flags/#cookies-without-same-site-must-be-secure` et depuis Firefox 69 dans [`about:config`](http://kb.mozillazine.org/About:config) en configurant `network.cookie.sameSite.noneRequiresSecure`.

Il est conseillé de l'appliquer lors de la configuration de nouveaux cookies et d'actualiser activement les cookies existants même s'ils n'approchent pas de leur date d'expiration.

{% Aside 'note' %}

Si vous comptez sur des services qui fournissent du contenu tiers sur votre site, vous devez également vérifier auprès du fournisseur qu'il met à jour ses services. Vous devrez peut-être mettre à jour vos dépendances ou vos extraits de code pour vous assurer que votre site adopte le nouveau comportement.

{% endAside %}

Ces deux modifications sont rétrocompatibles avec les navigateurs qui ont correctement implémenté la version précédente de l'attribut `SameSite`, ou qui ne le prennent tout simplement pas en charge. En appliquant ces modifications à vos cookies, vous rendez explicite l'utilisation souhaitée de ces derniers plutôt que de vous fier au comportement par défaut du navigateur. De même, tous les clients qui ne reconnaissent pas `SameSite=None` pour l'instant doivent l'ignorer et continuer comme si l'attribut n'était pas défini.

{% Aside 'warning' %}

Un certain nombre d'anciennes versions de navigateurs, notamment Chrome, Safari et le navigateur UC, sont incompatibles avec le nouvel attribut `None` et peuvent ignorer ou restreindre le cookie. Ce comportement est corrigé dans les versions actuelles, mais pensez à vérifier votre trafic pour déterminer quelle proportion de vos utilisateurs est affectée. Vous pouvez voir la [liste des clients incompatibles connus sur le site Chromium](https://www.chromium.org/updates/same-site/incompatible-clients).

{% endAside %}

## Recettes de cookies `SameSite`

Pour plus de détails sur comment mettre à jour vos cookies pour gérer les modifications apportées à `SameSite=None` et la différence de comportement des navigateurs, consultez l'article suivant : [Recettes pour utiliser les cookies SameSite](/samesite-cookie-recipes).

_Merci pour les contributions et les commentaires de Lily Chen, Malte Ubl, Mike West, Rob Dodson, Tom Steiner et Vivek Sekhar_

_Cookie hero image par [Pille-Riin Priske](https://unsplash.com/photos/UiP3uF5JRWM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) sur [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_
