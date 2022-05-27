---
layout: post
title: Text compression for web developers
authors:
  - coltmcanlis
date: 2013-10-15
updated: 2013-10-17
tags:
  - blog
---

## Introduction

Most text data on the web is comprised of HTML, Javascript, and CSS. These formats don’t lend themselves to lossy compression formats. So you’re limited to lossless encoders, which don’t offer the dramatic compression ratios of some lossy image and video codecs. So how do you shrink your web-app’s footprint without going insane? This article will walk you through the process, and help you keep your sanity.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/xbNVBzqhXLVWZg8REc0i.jpg", alt="Text Compression for Developers", width="602", height="367" %}
</figure>


## TL;DR : Text Data Compression Checklist

1 Think **mobile first** about user experiences
    1. What is your page's asset footprint? Can you reduce it?
    1. How long will it take for users to load your page on average connections?
1. Minify all content that can be minified.
    1. CSS and Javascript minifiers are powerful, easy to use, and fit into existing build pipelines.
    1. Preprocess your data as much as you can.
1. Use GZIP compression for all text resources.
    1. Ensure that your server has GZIP compression turned on.
    1. Generate better compressed GZIP data offline using [Zopfli](https://code.google.com/p/zopfli/) or [7zip](http://www.7-zip.org/).
1. If you need more, embrace advanced codecs like [BZIP2](http://www.bzip.org/) and [LZMA](http://www.7-zip.org/).

## Why Small is Big

There’s already a massive market for mobile, and with increased connectivity world-wide, the technology companies find themselves in a new fight to provide content and data to the next 5 billion humans who will come online soon. [Eric Schmidt’s “New Digital Age”](http://www.amazon.com/The-New-Digital-Age-Reshaping/dp/1480542288) lays out the topic well:

{% Aside %}
There are already more than 650 million mobile phone users in Africa, and close to  3 billion across Asia. The majority of these people are using basic-feature phones-voice calls and text messages only-because the cost of data service in their countries is often prohibitively expensive, so that even those who can buy web-enabled phones or smart phones cannot use them affordably. This will change, and when it does the smartphone revolution will profoundly benefit these populations.
{% endAside %}

This isn’t new information according to a [Cisco](http://www.cisco.com/en/US/solutions/collateral/ns341/ns525/ns537/ns705/ns827/white_paper_c11-520862.html) report, the number of mobile-only users is already on the rise, approaching [788 million mobile only users by 2015](http://www.webperformancetoday.com/2012/02/23/mobile-web-performance-unlimited-data/). Of course, for large companies like Cisco, this is a big concern, as **597 petabytes a month** flowed through their hardware in 2012.

**Mobile connection speeds and device performance.**

The world has been seeing great improvement in network speeds over the past few years. However it’s important to see how this improvement is not uniform in terms of numbers, or geolocation. Google Analytics has a [fantastic chart](http://analytics.blogspot.com/2013/04/is-web-getting-faster.html) showing the trends in connectivity, worldwide. It’s easy to see that the idea of improvement is not homogenous; for instance China saw a **8% increase** in median page load time for desktop (things got slower), while their mobile performance time **decreased 33%**, (things got faster) still landing at >3.5 seconds load time; which is a pretty big number, **considering 42% of their 1.53 billion population is online**.


And really, user perception of load time and responsiveness is the most important metric to rally towards. As we’ve seen, [latency is the new web performance bottleneck](http://www.igvita.com/2012/07/19/latency-the-new-web-performance-bottleneck/) and it’s apparent that improvement in networks is directly a hardware problem for most countries. Constructing new cellular towers and fiber-optic lines is a civil engineering nightmare, and it represents an enormous investment cost. The problems are so complex, that some companies are even developing [multi million dollar satellites](http://www.cbc.ca/news/technology/story/2013/06/25/technology-o3bnetworks-satellites-internet.html) to tackle the problem in a different way. The short form is this: **mobile networks will continue to grind their way to [increased speed](http://en.wikipedia.org/wiki/LTE_(telecommunication)), slowly, unevenly, and at great expense.** If you’re waiting for the mobile web to suddenly get faster, you might need to find a more comfortable chair to wait around in.

**Give users __more__ by sending them __less__.**

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/mm5KsSWmT5VTitedLdTO.jpg", alt="Mobile connection speeds and device performance.", width="269", height="161" %}
</figure>

As a web developer, you have the most control on how to optimize your site for the fastest, cheapest, highest quality experience for your users; One of the best ways to achieve that is with compression.

Of course you could just make a mobile site, with less content and smaller breadth. However it’s been shown that users don’t want a mobile site: one-third of a site’s mobile visitors will choose to visit the full site if given the option between the two. Site owners who can deliver a fast, reliable, cross-platform user experience across multiple devices and connections will own the web of the not-so-distant future.

## Types of compression algorithms

The federation of text compression is dominantly made up of lossless compression algorithms. (excluding the edge cases for text-based, floating point data you may have laying around). These are typical compression algorithms that allow the source stream to be recovered directly without any loss of precision or information. In most archival compressors, popular lossless codecs include [LZ77](http://en.wikipedia.org/wiki/LZ77_and_LZ78), [Huffman](http://en.wikipedia.org/wiki/Huffman_coding), and [Arithmetic encoding](http://en.wikipedia.org/wiki/Arithmetic_coding). Lossless compression algorithms are the backbone of most codecs, often applied after other algorithms to squeeze out a few more percentage points of compression.

<figure>
    <table>
    <tr>
        <td>Before</td>
        <td>After</td>
    </tr>
    <tr>
        <td>aaaaabbbbbcccddddeeeeffffaaaaabb</td>
        <td>a5b4c2d4e4f4a5bb</td>
    </tr>
    </table>
<figcaption>
Figure 1 - An example of lossless compression. Runs of values are encoded as the symbol followed by the length of the run. We can properly restore the origional stream. Note that if the length of the run is <= 2 characters, it makes sense to just leave the symbols alone. You see this at the end of the stream with ‘bb’.
</figcaption>
</figure>

In some rare cases, you can gain further savings by applying a lossy transform to parts of your content before applying the lossless compressor.  Since the data is non-recoverable to its source state from these transforms, these algorithms are typically reserved for types of text-based data which won’t suffer from loss of information; for example, truncating floating point numbers to only two significant decimal places may be an acceptable transform for a dataset.

<figure>
    <table>
        <tr>
            <td>Before</td>
            <td>After</td>
        </tr>
        <tr>
            <td>0.123, 1.2345, 21.2165, 21.999, 12.123</td>
            <td>0,0,20,20,10</td>
        </tr>
    </table>
<figcaption>
    Figure 2 - An example of lossy compression. Values are quantized to the smallest multiple of 10 they occupy. This transform cannot be reversed.
</figcaption>
</figure>

## Text compression Formats

The bulk of text compression systems today work by chaining together various data transforms to achieve success. The point of each stage in the system is to transform the data such that the next stage can consume, and compress it efficiently. The summation of these stages produces a small, losslessly recoverable file. There’s literally hundreds of compression formats/systems each one with pros and cons with respect to different types of data. You never hear about most of them, because they are either not as robust (handling multiple types of data), or don’t produce desired savings. For our purposes, let’s take a look at three of the more popular formats, GZIP, BZip2 and 7zip.

## Web Supported formats: GZIP and Deflate

There are two commonly used [HTTP compression](http://en.wikipedia.org/wiki/HTTP_compression) schemes on the web today: [DEFLATE](http://en.wikipedia.org/wiki/DEFLATE), and [GZIP](http://en.wikipedia.org/wiki/Gzip).

[DEFLATE](http://en.wikipedia.org/wiki/DEFLATE) is a very popular compression algorithm which generally wraps up data using the [LZ77](http://en.wikipedia.org/wiki/LZ77_and_LZ78),  algorithm and [Huffman](http://en.wikipedia.org/wiki/Huffman_coding) coding. [GZIP](http://en.wikipedia.org/wiki/Gzip) is a file format that uses DEFLATE internally, along with some interesting blocking, filtering heuristics, a header and a checksum. In general, the additional blocking and heuristics that [GZIP](http://en.wikipedia.org/wiki/Gzip) uses give it better compression ratios than DEFLATE alone.

The web stack has done its best to make the usage of these technologies semi-automatic, pushing the actual compression of files to the distribution server (Both algorithms are quite fast at both compression and decompression speeds, which make them great candidates to work server side). [PHP](http://www.webcodingtech.com/php/gzip-compression.php), [Apache](http://www.askapache.com/htaccess/apache-speed-compression.html), even [Google App Engine](https://developers.google.com/appengine/kb/general#compression) all support [GZIP](http://en.wikipedia.org/wiki/Gzip); they compress files on your behalf, and allow you to set flags in HTTP headers to describe how the traffic is transferred.

Next-generation transfer protocols like [SPDY](http://en.wikipedia.org/wiki/SPDY) and HTTP2.0 support header compression using [GZIP](http://en.wikipedia.org/wiki/Gzip), so most of the web stack will rely on this compression algorithm in the future.

{% YouTube id="Mjab_aZsdxw" %}

**Rolling your own Smaller GZIP files**<br>
Most developers simply upload uncompressed content and rely on the web server to compress data on the fly. This produces great results for most developers, and is easy to use. But most people don’t know that the default [GZIP](http://en.wikipedia.org/wiki/Gzip) level on most servers is [set to level 6](http://en.wikipedia.org/wiki/Mod_deflate), where the maximum level is actually 9.  This setting is intentional: it lets the servers compress the data faster at the cost of a larger output file.

You can get better compression by using [GZIP](http://en.wikipedia.org/wiki/Gzip) to compress your files offline, and uploading the compressed files to the server. You could use GZIP directly for this process, but more advanced compressors like [Zopfli](https://code.google.com/p/zopfli/) and [7zip](http://www.7-zip.org/) will regularly produce __smaller__ gzip files, through more advanced searching / matching algorithms, and data structures that utilize more memory for better pattern matching.

To take advantage of these savings, compress your files offline, and upload the compressed files to your server. You’ll need to configure your server to deliver the pre-compressed content correctly (here’s how to do that on [Apache](http://blog.codegrill.org/2009/07/how-to-pre-compress-static-files-in.html), [nginx](http://nginx.org/en/docs/http/ngx_http_gzip_static_module.html) and [Amazon Web Services](https://forums.aws.amazon.com/message.jspa?messageID=137563)). When a client requests your page, it will be delivered and unpacked like normal, without any changes to your client-side code.

## Other compression formats

[GZIP](http://en.wikipedia.org/wiki/Gzip) is far from the only option on the block, and if you happen to be a web app which sends around large blocks of data, frequently, then you might need to invest in other techniques to reduce your content size. One of these techniques may involve using a javascript build compression format that offers you better compression than [GZIP](http://en.wikipedia.org/wiki/Gzip), at reasonable decompression speeds.

Two competitive compression formats (aka “What the kids are using”) are [BZIP2](http://www.bzip.org/) and [LZMA](http://www.7-zip.org/), which both can regularly produce smaller files than [GZIP](http://en.wikipedia.org/wiki/Gzip), and in many cases can decompress faster as well.

Sadly these two formats aren’t supported in browsers at the native level, but these popular formats now have [JavaScript ported versions of their code](https://github.com/cscott/compressjs), meaning you can compress your data with these codecs offline, and decompress them in javascript on the client. 

Decompression times will be slower for this activity, which means it may not be suitable for all data, however developers of interactive, and highly detailed web applications may find large wins going down this route.

As far as formats go, these two use completely different stages in their data compression path, making it hard to do a proper comparison against [GZIP](http://en.wikipedia.org/wiki/Gzip).

For example, [BZIP2](http://www.bzip.org/) is built around the [Burrows Wheeler Transform](http://en.wikipedia.org/wiki/Burrows%E2%80%93Wheeler_transform), coupled with a [Move To Front](http://en.wikipedia.org/wiki/Move-to-front_transform) transform. Both of these transforms do nothing to reduce the actual size of the data, but instead, transform the data in a way that a following huffman / arithmetic encoder can do the actual compression. BZIP is often criticised for it’s larger memory needs, (the BWT can consume memory quickly with naive implementations) but as far as comparison goes, it can easily compress smaller than gzip.

[LZMA](http://www.7-zip.org/) can be considered a distant cousin to [GZIP](http://en.wikipedia.org/wiki/Gzip). They both start with the popular LZ dictionary compression followed by a statistical range encoding system. What makes [LZMA](http://www.7-zip.org/) produce smaller files than [GZIP](http://en.wikipedia.org/wiki/Gzip), however, lies in its’ advanced LZ matching and windowing algorithms.

## Preprocessing text for better compression

Typically text compression on the web is a two-step process; First a minimization step, followed by a lossless compression step.

### Minification

The first step, **Minification** is the act of reducing the size of data such that it can be consumed without processing by the [underlying systems](https://code.google.com/p/v8/). Basically we remove as much unnecessary data from the file as possible, without changing it syntactically. For example, it’s safe to remove most whitespace from a Javascript file,reducing the file size without changing the JavaScript syntax. Minification is typically handled during the [build process](http://gruntjs.com/) either as a manual step or as part of an automated build chain.

**CSS Minifiers**</br>
There are many CSS minifiers to choose from. A few of the available options include.

- [CleanCSS](https://github.com/GoalSmashers/clean-css)
- [CSSMin](https://code.google.com/p/cssmin/)
- [YUI](http://yui.github.io/yuicompressor/)
- [CSSTidy](http://csstidy.sourceforge.net/usage.php)
- [Slimmer](https://pypi.python.org/pypi/slimmer/)
- [CSS Compressor](http://www.csscompressor.com/)

Try a few and choose the one that gives you good results and fits into your workflow with the least amount of friction.

The main difference between these tools lies in how deep their minification processes go. For example, simple optimization filters text to remove excess whitespace and empty blocks. More advanced optimizations might include swapping “[AntiqueWhite](http://www.html-color-names.com/antiquewhite.php)” with “[#FAEBD7](http://www.html-color-names.com/antiquewhite.php)” since the hex form is shorter in the file, and forcing all of the characters to lowercase to increase GZIP compression.

More aggressive methods of CSS minimization save more space, [but run the risk of breaking your CSS rules](http://mainroach.blogspot.com/2013/07/css-compression-minifier-roulette.html). As such, most improvements can’t always be automated, and developers must decide whether the file-size improvement is worth the risk.

In fact, there’s a new trend of creating [other](http://lesscss.org/) [versions](http://sass-lang.com/) of [CSS languages](http://learnboost.github.io/stylus/) to help author CSS code more efficiently, and as an added benefit, allow the compiler to produce  smaller CSS code. 

**Javascript Minifiers**</br>
As with CSS minifiers, there’s no one-size-fits-all JavaScript minifier. Once again, they all do much the same work, so choose the one that works with your build chain and has the features you want. Some of the more popular being:

- [UglifyJS](https://github.com/mishoo/UglifyJS)
- [JSMin](http://www.crockford.com/javascript/jsmin.html)
- [YUI](http://yui.github.io/yuicompressor/)
- [rJSMin](http://opensource.perlig.de/rjsmin/)
- [Dojo ShrinkSafe](http://dojotoolkit.org/documentation/)
- [Ajax Minifier](http://aspnet.codeplex.com/releases/view/40584)
- [Closure](https://developers.google.com/closure/compiler/)

Most of these systems work by compiling your Javascript into some sort of [Abstract Syntax Tree](http://en.wikipedia.org/wiki/Abstract_syntax_tree) representation, and re-generating more compact JavaScript from the ASK. Sample optimizations including minimizing whitespace, shortening variable names, and rewriting expressions in shorter forms. For example, foo.bar)

Automated minifiers do their job well, but there are some advanced optimizations that [robots have no idea how to do](http://www.slideshare.net/ruidlopes/humanpowered-javascript-compression-for-fun-and-gummy-bears). A new generation of JS hackers are pushing past automated minification methods into [hand-generated minification](https://github.com/jed/140bytes/wiki/Byte-saving-techniques), which often produces smaller files than any of the automated tools can produce. Of course, requiring a bit of insanity to achieve.

### Content specific processing

While general purpose lossless compression algorithms produce great savings, there’s a common trend of pre-processing your data to get better compression.  The largest wins in most compression systems now come from highly-informed decisions about the format and organization of the information, and exploiting that with grouping and custom compression (this is also called __modeling__). Most of the time this requires a clear, hard look at your content to determine what types of redundancies you can exploit at a high level. Here are some ideas to get you thinking:

- For text data, some symbols can be removed from the compressed stream, and recovered on the client at a later time (spaces, for example) which can reduce the overall file size, and doesn’t impact client-side performance too much.

  <figure>
      <table>
        <tr>
            <td>Before</td>
            <td>After</td>
        </tr>
        <tr>
            <td>“1,2,3,4,5,6,7,8,0,2,3,4,2,1,2”</td>
            <td>“123456780234212”</td></tr>
      </table>
    <figcaption>
    Figure 3 - An example of removing known, redundant text. We know in this example that all the values are single digit bytes, we can remove the commas and recover them later.
    </figcaption>
   </figure>

- If you’re passing around lots of floating point numbers, [quantizing](http://en.wikipedia.org/wiki/Vector_quantization) your values is a great idea, as it will likely reduce the number of unique symbols, and also truncate some precision that is needlessly added to the file.

  <figure>
      <table>
        <tr><td>Before</td><td>After</td></tr>
        <tr><td>0.123, 1.2345, 21.2165, 21.999, 12.123</td><td>0,0,20,20,10</td></tr>
      </table>
    <figcap>Figure 4 - An example of lossy compression. Values are quantized to the smallest multiple of 10 they occupy. This transform cannot be reversed.
    </figcaption>
   </figure>
   <br>

- Often times, developers sent around arrays of indexes, which tend to be order-independent. If your index information happens to be a closed interval (ie, all values of X,Y, without any skips) then you could sort your information, and delta encode it for bigger gains.

  <figure>
      <table>
        <tr><td>Before</td><td>After</td></tr>
        <tr><td>[8,2,1,5,3,7,6,3,2,9,0,4]</td><td>sorted = [0,1,2,3,4,5,6,7,8,9] <br> delta encoded = [0,1,1,1,1,1,1,1,1,1]</td></tr>
      </table>
    <figcaption>
    Figure 5 - An example of sorting and delta encoding. We first sort the data, and then encode it, such that each element is represented as the difference between the previous element. Note how the delta encoded form contains many repetitive symbols.
    </figcaption>
   </figure>

{% Aside %}
Recently, compression guru [Matt Mahoney](http://mattmahoney.net/) entered a competition to compress [human DNA sequences](http://maq.sourceforge.net/fastq.shtml). His [results were impressive](https://docs.google.com/a/google.com/document/pub?id=1f-8C-ZfCUTEsO-EqvlcTXQ0M5aYM61Aet902dA8QZZk), and generally centered around extraction, modeling and analysis of the content at hand. The ability to extract similar data types from the interleaved stream into homogeneous blocks allows the compression algorithm to take advantage of local information to aid in compression, often allowing the ability to predict future symbols based on several independent data points.
{% endAside %}

It’s quite tricky, and cumbersome to write this type of content-specific compression for arbitrary, mixed-content data files. Luckily for you, some people have already started heading down that path:

- [XMILL](http://homes.cs.washington.edu/~suciu/XMILL/) is an **XML** specific compression system which extracts out heterogenous types of data, groups them together, and runs various compression algorithms on them.
- Another fantastic application of this is [JSZap](http://research.microsoft.com/en-us/projects/jszap/), which will dissect your **JavaScript** into an Abstract Syntax Tree, and then separate out similar data types into separate streams, compressing each stream individually using an optimal compressor for each one.
- You can easily find multiple references in applying this idea to **JSON** data; once again, you can [preprocess JSON files](http://mainroach.blogspot.com/2013/08/json-compression-transpose-binary.html) before passing them off to GZIP in order to produce greater savings.

## Conclusion

Although images take up 60% of most website bandwidth, you can’t ignore that other data block coming from text content. JavaScript files are getting larger, JSON data is sent around every day, and more users are coming online with poor connections. So make sure that every time you push a build of your site, you follow the **Text compression checklist**:

1. Think **mobile first** about user experiences
    1. What is your page's asset footprint? Can you reduce it?
    1. How long will it take for users to load your page on average connections?
1. Minify all content that can be minified.
    1. CSS and Javascript minifiers are powerful, easy to use, and fit into existing build pipelines.
    1. Preprocess your data as much as you can.
1. Use GZIP compression for all text resources.
    1. Ensure that your server has GZIP compression turned on.
    1. Generate better compressed GZIP data offline using [Zopfli](https://code.google.com/p/zopfli/) or [7zip](http://www.7-zip.org/).
1. If you need more, embrace advanced codecs like [BZIP2](http://www.bzip.org/) and [LZMA](http://www.7-zip.org/).
