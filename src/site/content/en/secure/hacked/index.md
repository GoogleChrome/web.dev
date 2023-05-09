---
layout: post
title: Help, I think I've been hacked
date: 2015-01-01
updated: 2022-03-04
description: >
  Learn how and why websites are hacked.
tags:
  - security
---

Every day, cybercriminals compromise thousands of websites. Hacks are often invisible to users, yet remain harmful to anyone viewing the page—including the site owner. For example, a hacker may have infected your site with harmful code which in turn can record keystrokes on visitors' computers, stealing login credentials for online banking or financial transactions. If you're not sure whether or not your site was hacked, start by reading [how do I know if my site is hacked](/secure/how-do-i-know-if-my-site-was-hacked/)?


<figure>
    {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/INhVTTPZ65TEBG9N4Qpz.gif", alt="Different errors that might indicate a hacked site.", width="800", height="450" %}
    <figcaption>If you're a site owner and you see one of these, you might have been hacked.</figcaption>
</figure>

## Learn more about hacking

The following video covers:

- How and why sites are hacked.
- The process for recovering a site and removing any user-facing warnings.
- Approximate time to fix the site.
- Fixing it yourself or hiring a professional.

{% YouTube "mbJvL61DOZg" %}
Web Site Saldırı Türleri ve Etkileri

İnternet sitesi saldırıları tür ve etki bakımından farklı sonuç ve yıkımlara neden olmaktadır. Bir çok web sitesi saldırı tekniği ve yöntemi mevcuttur. Bu teknik ve yöntemler saldırının amacına uygun planlanır. Siteye yapılan saldırıların etkisi kalıcı veya geçici olabilir. Geçici etki bile, site yöneticilerinin müdahale etmemesi sonucu kalıcı olabilir. Aşağıda en çok yapılan 5 web sitesi saldırı çeşidinin ne anlama geldiklerini ve etkilerini ele aldık.) Siteler Arası Komut Dosyası Saldırısı (XSS – Cross Site Scripting)

Çapraz Site Betik Saldırısı (XSS); ASP, PHP gibi birçok dille yazılmış dinamik sitelerde, HTML ve Javascript kodları çalıştırılarak yetkisiz erişim sağlamaya yönelik saldırılardır. Yorum kutuları, giriş formları, arama kutuları, iletişim popup ları kullanılarak;  kredi kartı verileri, kimlik bilgileri, adres ve iletişim bilgileri gibi önemli bilgilerin çalınması XSS saldırıyla yapılabilir. Genellikle dinamik web sitelerinde kullanılan javascript dili hedef alınır. Bunun yanı sıra XSS HTML, Flash, VBScript, CSS ve diğer birçok dilin kullanıldığı web sayfaları da saldırıya açık olarak kullanılır. Örneğin, JS, CSS ve HTML ile oluşturulmuş bir formu XSS saldırısı için kullanılabilir. XSS saldırıyla;

Web site kullanıcılarının oturum açma bilgilerini çalınabilir.

Web sayfasını ziyaret edenlerin cihazlarına virüs vb yazılımlar gönderilebilir.

Web sayfasını ziyaret edenlerin cihazları zombi cihaz olarak kullanılabilir.

Web sitesi çökertilebilir.

Web site sunucusuna dosyalar gönderilerek, kişisel bilgiler çalınabilir.

Çalınan bilgiler dolandırıcılık faaliyetlerinde kullanılabilir.

Web site kullanıcının tarayıcısının kontrolü ele geçirilebilir.

XSS saldırılarının üç bilinen ana türü vardır.2) Kalıcı XSS saldırıları

Kalıcı (Depolanmış – Stored) XSS saldırısı; Saldırı yapan bilgisayar korsanı tarafından, kötü amaçlı kodu sayfaya enjekte etmesinin ardından sayfaya her erişim olduğunda ve yürütüleceği sunucuda depolandığında ortaya çıkar. Kod enjekte edilmiş bir form sayesinde, kullanıcının girmiş olduğu tüm bilgiler, saldırıyı yapanın yönlendirdiği sunucuya – veri tabanına kaydolur. bu saldırı türü ciddi olumsuz sonuçlar doğurabilir. çok tehlikelidir3) DOM XSS Saldırıları

DOM (Document Object Model – Belge Nesne Modeli) XSS saldırısı; saldırıyı yapan bilgisayar korsanı, istemci komut dosyasının çalıştığı internet sitesinin tarayıcısında DOM değiştirerek yük enjekte eder. Web sayfası değişmez, fakat sayfada bulunan istemci tarafı kodu, kötü amaçlı kod değişiklikleriyle çalışır. Bu XSS saldırı türü de çok tehlikelidir.
