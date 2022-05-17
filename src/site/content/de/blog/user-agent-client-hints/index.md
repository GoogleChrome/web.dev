---
title: Verbesserung des Datenschutzes und der Entwicklererfahrung mit User-Agent-Client-Hinweisen
subhead: User-Agent-Client-Hinweise (User-Agent Client Hints) sind eine neue Erweiterung des Client-Hinweise-APIs (Client Hints API), die Entwicklern auf datenschutzerhaltende und ergonomische Weise Zugriff auf Browserinformationen eines Benutzers ermöglicht.
authors:
  - rowan_m
  - yoavweiss
date: 2020-06-25
updated: 2021-09-10
hero: image/admin/xlg4t3uiTp0L5TBThFHQ.jpg
thumbnail: image/admin/hgxRNa56Vb9o3QRwIrm9.jpg
alt: Eine Blaupause einer Brücke und einige alte Werkzeuge für Entwurfszeichnungen.
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% YouTube 'f0YY0o2OAKA' %}

Client-Hinweise ermöglichen es Entwicklern, aktiv Informationen über das Gerät des Benutzers oder dessen Zustand anzufordern, anstatt sie aus dem User-Agent-String (UA) parsen zu müssen. Die Bereitstellung dieser alternativen Möglichkeit ist der erste Schritt auf dem Weg zur Reduktion der Granularität des Benutzer-Agent-Strings.

Erfahren Sie, wie Sie die vorhandenen Funktionen, die auf dem Parsen des User-Agent-Strings basieren, aktualisieren und stattdessen User-Agent-Client-Hinweise verwenden.

{% Aside 'caution' %} Wenn Sie bereits User-Agent-Client-Hinweise verwenden, beachten Sie, dass sich das Header-Format seit Chrome 90 dahingehend geändert hat, dass die Accept-CH-Token nun genau mit den zurückgesendeten Headern übereinstimmen müssen. {% endAside %}

## Hintergrund

Wenn Webbrowser Anfragen stellen, enthalten diese Informationen über den Browser und seine Umgebung, damit Server diese analysieren können und ihre Antworten daran anpassen können. Wie dies geschieht, wurde bereits 1996 festgelegt (RFC 1945 für HTTP/1.0). In diesem Text findet sich die [ursprüngliche Definition des User-Agent-Strings](https://tools.ietf.org/html/rfc1945#section-10.15) mit einem darauf folgenden Beispiel:

```text
User-Agent: CERN-LineMode/2.15 libwww/2.17b3
```

Dieser Header sollte in der Reihenfolge ihrer Wichtigkeit das Produkt (z. B. Browser oder Bibliothek) sowie einen Kommentar (z. B. Versionsnummer) beinhalten.

### Der Zustand des User-Agent-Strings

Im Laufe der *Jahrzehnte* hat dieser String eine Vielzahl zusätzlicher Details (sowie zur Abwärtskompatibilität einigen Datenmüll) zu den Clients, von denen die Anfragen ausgehen, aufgenommen. Wir können dies sehen, wenn wir uns den aktuellen User-Agent-String von Chrome ansehen:

```text
Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4076.0 Mobile Safari/537.36
```

Der obige String enthält Informationen über das Betriebssystem des Benutzers, z. B. dessen Versionsnummer; das Gerätemodell; die Gerätemarke sowie die vollständige Versionsnummer des Browsers; genügend Hinweise, die darauf schließen lassen können, ob es sich um einen mobilen Browser handelt; ganz zu schweigen von einer Reihe von Verweisen auf andere Browser aus historischen Gründen.

Die Kombination dieser Parameter mit ihrer schieren Vielfalt möglicher Werte bedeutet, dass der User-Agent-String genügend Informationen enthalten kann, um einzelne Benutzer eindeutig zu identifizieren. Wenn Sie Ihren eigenen Browser bei [AmIUnique](https://amiunique.org/) überprüfen, können Sie sehen, wie genau **Sie** anhand **Ihres** User-Agent-Strings identifiziert werden können. Je niedriger Ihre resultierende „Similarity ratio“ (Ähnlichkeitsverhältnis) ist, desto einzigartiger sind Ihre Anfragen und umso einfacher ist es für Server, Sie heimlich zu tracken.

Für den User-Agent-String gibt es viele legitime [Anwendungsfälle](https://wicg.github.io/ua-client-hints/#use-cases) und er dient Entwicklern und Websitebetreibern zu einem wichtigen Zweck. Es ist jedoch ebenfalls wichtig, dass die Privatsphäre der Benutzer vor verdeckten Trackingmethoden geschützt wird, und das standardmäßige Senden von UA-Informationen läuft diesem Ziel zuwider.

Ebenso ist klar, dass die Webkompatibilität des User-Agent-Strings verbessert werden muss. Er ist unstrukturiert, was beim Parsen zu unnötiger Komplexität führt und oft Ursache für Fehler und Probleme mit der Webseitenkompatibilität ist, die den Benutzern schaden. Diese Probleme treffen Benutzer weniger verbreiteter Browser unverhältnismäßig, da Websites möglicherweise nicht mit ihren Konfigurationen getestet wurden.

## Vorstellung der neuen User-Agent-Client-Hinweise

[User-Agent-Client-Hinweise](https://github.com/WICG/ua-client-hints#explainer-reducing-user-agent-granularity) ermöglichen den Zugriff auf dieselben Informationen, allerdings auf eine datenschutzfreundlichere Weise, wodurch es Browsern wiederum ermöglicht wird, die Standardeinstellung des User-Agent-Strings, alles zu übertragen, einzuschränken. [Client-Hinweise](https://datatracker.ietf.org/doc/html/rfc8942) erzwingen ein Modell, bei dem der Server den Browser nach einer Reihe von Daten über den Client (den Hinweisen) fragen muss und der Browser seine eigenen Richtlinien oder Benutzerkonfigurationen anwendet, um zu bestimmen, welche Daten zurückgesendet werden. Dies bedeutet, dass der Zugriff jetzt explizit und überprüfbar verwaltet wird, anstatt dass standardmäßig **alle** User-Agent-Informationen offengelegt werden. Entwickler profitieren darüber hinaus von einem einfacheren API – jetzt ganz ohne regulärer Ausdrücke!

Die aktuelle Auswahl von Client-Hinweisen beschreibt hauptsächlich die Anzeige- und Verbindungsfunktionen des Browsers. Sie können die Details unter [Automatisieren der Ressourcenauswahl mit Client-Hinweisen](https://developer.chrome.com/blog/automating-resource-selection-with-client-hints/) erkunden. Hier ist dennoch eine kurze Erinnerung dazu, wie der Prozess abläuft:

Der Server fragt per Header nach bestimmten Client-Hinweise:

⬇️ *Antwort vom Server*

```text
Accept-CH: Viewport-Width, Width
```

Oder ein Meta-Tag:

```html
<meta http-equiv="Accept-CH" content="Viewport-Width, Width" />
```

Der Browser kann dann die folgenden Header in nachfolgenden Anfragen zurücksenden:

⬆️ *Nachfolgende Anfrage*

```text
Viewport-Width: 460
Width: 230
```

Der Server kann variable Antworten zurücksenden, beispielsweise indem er Bilder stets mit geeigneter Auflösung bereitstellt.

{% Aside %} Diskussionen über die Aktivierung von Client-Hinweisen bei Erstanfragen halten an, Sie sollten jedoch ein [responsives Design](/responsive-web-design-basics) oder eine progressive Erweiterung (Progressive Enhancement) in Betracht ziehen, bevor Sie diesen Weg einschlagen. {% endAside %}

User-Agent Client-Hinweise erweitern den Eigenschaftsbereich mit dem `Sec-CH-UA`-Präfix, das über den `Accept-CH`-Server-Antwort-Header angegeben werden kann. Beachten Sie für weitere Details [die Erläuterung](https://github.com/WICG/ua-client-hints/blob/main/README.md) und sehen Sie sich den [vollständigen Vorschlag](https://wicg.github.io/ua-client-hints/) an.

{% Aside %} Client-Hinweise werden **nur über sichere Verbindungen** gesendet. Stellen Sie daher sicher, dass Sie [Ihre Webseite zu HTTPS migriert](/why-https-matters) haben. {% endAside %}

## User-Agent-Client-Hinweise von Chromium 89

User-Agent-Client-Hinweise sind in Chrome seit Version 89 standardmäßig aktiviert.

Standardmäßig meldet der Browser die Browsermarke, die relevante Version bzw. die Hauptversion, die Plattform sowie einen Indikator der anzeigt, ob der Client ein mobiles Gerät ist, zurück:

⬆️ *Alle Anfragen*

```text
Sec-CH-UA: "Chromium";v="93", "Google Chrome";v="93", " Not;A Brand";v="99"
Sec-CH-UA-Mobile: ?0
Sec-CH-UA-Platform: "macOS"
```

{% Aside 'caution' %} Diese Eigenschaften sind komplexer als nur ein einzelner Wert, daher werden [strukturierte Header](https://httpwg.org/http-extensions/draft-ietf-httpbis-header-structure.html) zur Darstellung von Listen und booleschen Werten verwendet. {% endAside %}

### User-Agent-Antwort und Anforderungsheader

<style>
.table-wrapper th:nth-of-type(1), .table-wrapper th:nth-of-type(2) {
    width: 28ch;
}

.table-wrapper td {
  padding: 4px 8px 4px 0;
}
</style>

⬇️ Antwort `Accept-CH`<br> ⬆️ Anfrageheader | ⬆️Anfrage<br> Beispielwert | Beschreibung
--- | --- | ---
`Sec-CH-UA` | `"Chromium";v="84",`<br>`"Google Chrome";v="84"` | Liste der Browsermarken und ihrer relevanten Versionen.
`Sec-CH-UA-Mobile` | `?1` | Boolescher Wert, der angibt, ob sich der Browser auf einem Mobilgerät befindet ( `?1` für wahr) oder nicht (`?0` für falsch).
`Sec-CH-UA-Full-Version` | `"84.0.4143.2"` | [**Deprecated**]The complete version for the browser.
`Sec-CH-UA-Full-Version-List` | `"Chromium";v="84.0.4143.2",`<br>`"Google Chrome";v="84.0.4143.2"` | List of browser brands and their full version.
`Sec-CH-UA-Platform` | `"Android"` | Die Plattform des Geräts, normalerweise das Betriebssystem (OS).
`Sec-CH-UA-Platform-Version` | `"10"` | Die Versionsnummer der Plattform oder des Betriebssystems.
`Sec-CH-UA-Arch` | `"arm"` | Die zugrunde liegende Architektur des Geräts. Obwohl dies für das Anzeigen der Seite möglicherweise nicht relevant ist, möchte die Seite gegebenenfalls eine Seitenversion bereitstellen, die standardmäßig das richtige Format verwendet.
`Sec-CH-UA-Model` | `"Pixel 3"` | Das Gerätemodell.
`Sec-CH-UA-Bitness` | `"64"` | Die Bitanzahl der zugrunde liegenden Architektur (d. h. die Größe einer Ganzzahl oder Speicheradresse in Bits)

{% Aside 'gotchas' %} Datenschutz- und Kompatibilitätsüberlegungen führen eventuell dazu, dass Werte unbestimmt bleiben, nicht zurückgemeldet oder mit anderen Werten gefüllt werden. Dies wird als [GREASE](https://wicg.github.io/ua-client-hints/#grease) bezeichnet. {% endAside %}

### Beispielhafter Datenaustausch

Ein Beispiel eines Datenaustausches würde so aussehen:

⬆️ *Erstanfrage vom Browser*<br> Der Browser fordert die Seite `/downloads` von der Website an und sendet seinen standardmäßigen User-Agent.

```text
GET /downloads HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="93", "Google Chrome";v="93", " Not;A Brand";v="99"
Sec-CH-UA-Mobile: ?1
Sec-CH-UA-Platform: "Android"
```

⬇️ *Antwort vom Server*<br> Der Server sendet die Seite zurück und fragt zusätzlich nach der vollständigen Versionsnummer und nach der Plattform.

```text
HTTP/1.1 200 OK
Accept-CH: Sec-CH-UA-Full-Version-List
```

⬆️ *Folgeanfragen*<br> Der Browser gewährt dem Server Zugriff auf die zusätzlichen Informationen und sendet die zusätzlichen Hinweise bei allen nachfolgenden Anfragen zurück.

```text
GET /downloads/app1 HTTP/1.1
Host: example.site

Sec-CH-UA: " Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"
Sec-CH-UA-Mobile: ?1
Sec-CH-UA-Full-Version-List: " Not A;Brand";v="99.0.0.0", "Chromium";v="98.0.4738.0", "Google Chrome";v="98.0.4738.0"
Sec-CH-UA-Platform: "Android"
```

### JavaScript-API

Neben den Headern kann der User-Agent auch per JavaScript über `navigator.userAgentData` abgegriffen werden. Auf die standardmäßigen Header-Informationen von `Sec-CH-UA`, `Sec-CH-UA-Mobile` und `Sec-CH-UA-Platform` kann über die Eigenschaften `brands` bzw. `mobile` zugegriffen werden:

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

Der Zugriff auf die zusätzlichen Werte erfolgt über den Aufruf `getHighEntropyValues()`. Der Begriff „high entropy“ (hohe Entropie) bezieht sich auf die [Informationsentropie](https://en.wikipedia.org/wiki/Entropy_(information_theory)), mit anderen Worten: die Menge an Informationen, die diese Werte über den Browser des Benutzers preisgeben. Wie beim Anfordern der zusätzlichen Header hängt es vom Browser ab, welche Werte, zurückgesendet werden oder ob überhaupt welche zurückgesendet werden.

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

### Demo

Sie können sowohl die Header als auch das JavaScript-API auf Ihrem eigenen Gerät unter [user-agent-client-hints.glitch.me](https://user-agent-client-hints.glitch.me) ausprobieren.

{% Aside %} Vergewissern Sie sich, dass Sie Chrome 89 oder höher verwenden. {% endAside %}

### Lebensdauer eines Hinweises und Zurücksetzen

Hinweise, die über den Header `Accept-CH` angegeben werden, werden entweder lediglich für die Dauer der Browsersitzung gesendet oder bis ein anderer Satz von Hnweisen angegeben wird.

Wenn der Server also den folgenden Header sendet:

⬇️ *Antwort*

```text
Accept-CH: Sec-CH-UA-Full-Version-List
```

Then the browser will send the `Sec-CH-UA-Full-Version-List` header on all requests for that site until the browser is closed.

⬆️ *Folgeanfragen*

```text
Sec-CH-UA-Full-Version-List: " Not A;Brand";v="99.0.0.0", "Chromium";v="98.0.4738.0", "Google Chrome";v="98.0.4738.0"
```

Wenn jedoch ein weiterer `Accept-CH`-Header empfangen wird, wird dies die gerade vom Browser gesendeten Hinweise **vollständig ersetzen**.

⬇️ *Antwort*

```text
Accept-CH: Sec-CH-UA-Bitness
```

⬆️ *Folgeanfragen*

```text
Sec-CH-UA-Platform: "64"
```

The previously asked-for `Sec-CH-UA-Full-Version-List` **will not be sent**.

Stellen Sie sich den `Accept-CH`-Header am besten als eine Information vor, die den vollständigen Satz von von dieser Seite erwünschten Hinweise angibt, und dessen Empfang zur Folge hat, dass Browser die angegebenen Hinweise dann für alle Unterressourcen auf dieser Webseite mitsenden. Auch wenn Hinweise bis zum nächsten Seitennavigationsereignis bestehen bleiben, sollte sich die Website nicht darauf verlassen oder davon ausgehen, dass sie überhaupt gesendet werden.

{% Aside 'success' %} Stellen Sie immer sicher, dass Sie auch ohne diese Informationen ein sinnvolles Nutzungserlebnis bieten können. Client-Hinweise sollen die Benutzererfahrung bereichern und sie nicht definieren. Deshalb werden sie auch „Hinweise“ genannt und nicht „Antworten“ oder „Anforderungen“! {% endAside%}

Sie können mithilfe des Headers auch alle vom Browser gesendeten Hinweise effektiv löschen, indem Sie eine leere `Accept-CH`-Antwort senden. Erwägen Sie dies überall dort, wo Benutzer Einstellungen zurücksetzen oder sich von Ihrer Webseite abmelden.

Dieses Muster entspricht auch der Funktionsweise von Hnweise über das Tag `<meta http-equiv="Accept-CH" …>`. Die angeforderten Hinweise werden nur auf Anfragen hin gesendet, die von der Seite initiiert wurden und nicht bei einer späteren Seitennavigation.

### Der Umfang von Hinweisen und Cross-Origin-Anfragen

Standardmäßig werden Client-Hinweise nur bei Same-Origin-Anfragen gesendet. Das heißt, dass wenn Sie Hinweise unter `https://example.com` anfordern, die Ressourcen, die Sie optimieren möchten, sich jedoch unter `https://downloads.example.com` befinden, in der Antwort **keine** Hinweise für diese Seite enthalten sein werden.

Um Hinweise für Cross-Origin-Anfragen zuzulassen, muss jeder Hinweis und jede Origin (Ausgangspunkt) mit einem `Permissions-Policy`-Header angegeben werden. Um dies auf einen User-Agent-Client-Hinweis anzuwenden, müssen Sie den Hinweis klein schreiben und das Präfix `sec-` entfernen. Zum Beispiel:

⬇️ *Antwort von `example.com`*

```text
Accept-CH: Sec-CH-UA-Platform-Version, DPR
Permissions-Policy: ch-ua-platform-version=(self "downloads.example.com"),
                    ch-dpr=(self "cdn.provider" "img.example.com");
```

⬆️ *Anfrage an `downloads.example.com`*

```text
Sec-CH-UA-Platform-Version: "10"
```

⬆️ *Anfragen an `cdn.provider` oder `img.example.com`*

```text
DPR: 2
```

## Wo werden User-Agent-Client-Hinweise verwendet?

Die schnelle Antwort ist, dass Sie alle Instanzen umgestalten sollten, in denen Sie entweder den User-Agent-Header parsen oder einen der JavaScript-Aufrufe verwenden, die auf dieselben Informationen zugreifen (z. B.`navigator.userAgent`, `navigator.appVersion` oder `navigator.platform`). Verwenden Sie stattdessen User-Agent-Client-Hinweise.

Wenn Sie noch einen Schritt weiter gehen möchten, dann sollten Sie Ihre Nutzung von User-Agent-Informationen überdenken und diese Praxis nach Möglichkeit durch andere Methoden ersetzen. Häufig können Sie dasselbe Ziel erreichen, indem Sie progressive Erweiterung, Funktionserkennung oder [responsives Design](/responsive-web-design-basics) anwenden. Das grundlegende Problem dabei, sich auf die User-Agent-Daten zu verlassen besteht darin, dass Sie immer eine Zuordnung zwischen der zu untersuchenden Eigenschaft und dem von ihr aktivierten Verhalten beibehalten. Dies stellt einen Wartungsaufwand dar, da gewährleistet werden muss, dass Ihre Erkennung umfassend ist und auf dem neuesten Stand bleibt.

Unter Berücksichtigung dieser Vorbehalte listet das [Repository für User-Agent-Client-Hinweise](https://wicg.github.io/ua-client-hints/#use-cases) einige gültige Anwendungsfälle bei Websites auf.

## Was passiert mit dem User-Agent-String?

Der Plan besteht darin, Möglichkeiten für verdecktes Tracking im Web zu minimieren, indem die Menge der zur Identifikation nutzbaren Informationen reduziert wird, die durch den vorhandenen User-Agent-String offengelegt werden, ohne dass es dabei zu unnötigen Unterbrechungen auf bestehenden Websites kommt. Mit der Einführung von User-Agent-Client-Hinweise ergibt sich Ihnen jetzt die Möglichkeit, diese neuen Funktionen zu verstehen und mit ihnen zu experimentieren, bevor irgendwelche Änderungen an den User-Agent-Strings vorgenommen werden.

[Am Ende](https://blog.chromium.org/2021/05/update-on-user-agent-string-reduction.html) werden die Informationen im User-Agent-String reduziert, sodass nur noch das Legacy-Format sowie der gleiche High-Level-Browser beibehalten, relevante Versionsinformationen aber nun gemäß der standardmäßigen Client-Hinweise bereitgestellt werden. In Chromium wurde diese Änderung auf mindestens 2022 verschoben, um dem Ökosystem zusätzliche Zeit zu geben, die neuen Funktionen der User-Agent-Client-Hinweise zu evaluieren.

Sie können eine Version dieser Funktion testen, indem Sie das Flag `about://flags/#reduce-user-agent` unter Chrome 93 aktivieren (Hinweis: Dieses Flag hatte in den Chrome-Versionen 84-92 die Bezeichnung `about://flags/#freeze-user-agent`). Diese Einstellung wird aus Kompatibilitätsgründen einen String mit historischen Einträgen, aber mit bereinigten Detailangaben zurücksenden. Zum Beispiel so etwas wie:

```text
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Mobile Safari/537.36
```

*Photo by [Sergey Zolkin](https://unsplash.com/@szolkin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/m9qMoh-scfE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*
