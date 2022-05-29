---
layout: post
title: Entendendo dados estruturados 
authors:
    - bendevjunior
description: 
    Vamos entender um pouco sobre dados estruturados e qual sua função e importância para um website.
date: 2022-28-05
tags: 
  - blog
  - html
  - javascript
---

Vamos entender um pouco sobre dados estruturados e qual sua função e importância para um website.


Vamos iniciar já com o entendimento de que o Google ele usa dados estruturados para compreender o conteúdo do seu site, vou colocar um exemplo: Vamos imaginar que seu site seja um portal de notícias com notícias diárias como você iria fazer para que as ferramentas de pesquisas indexarem o seu site como um portal de notícias ? Pois bem, dados estruturados e a resposta.


Existem algumas formas de você estruturar o site, principalmente ter um site semântico ( [eu falo um pouco sobre semântica web no meu site](https://blog.bendevoficial.com/posts/conceitos-importantes-sobre-html)), e uma delas, porém você também pode usar outro método que é basicamente você fornecer de maneira clara para que o Pesquisa Google entenda do que seu site se trata, dessa maneira assim será muito mais simples para o Google indexar seu conteúdo.


Dados estruturados eles usam vocabulários no caso uma das mais famosas e recomendados pela google e o schema.org, não irei entrar muito afundo no schema.org mas entenda que ele e um serviço colaborativo que usamos para estruturar essas informações, porém o Google criou uma galeria com conteúdos disponíveis e exemplos de códigos estruturados que o Google suporta que chamamos de [Rich Results](https://developers.google.com/search/docs/advanced/structured-data/article) e iremos explorar ele neste artigo, caso queiram algo mais avançado me mandem no twitter que eu crio outro com um conteúdo avançado.


Quais maneiras de criar dados estruturados ?

-   JSON-LD
  
-   Microdados
  
-   RDFa
  


Vamos explorar um pouco cada um e vamos iniciar pelo JSON-LD o qual é mais recomendado pela própria Google a usar.

## JSON-LD

JSON-LD e uma notação que incorporamos dentro de uma tag `<script></script>` iremos usar ela logo após, a vantagem deste e que o Google consegue entender e ler os dados podendo ser injetados dinamicamente na página facilitando assim o entendimento, vale ressaltar que o usuário não consegue visualizar o JSON-LD então para usá-lo e muito prático pois você consegue demarcar e ficar mais simples o entendimento ao Google..

## Microdados

Microdados como o JSON-LD o microdata é de comunidade aberta, ela é uma especificação do HTML usada para definir dados estruturados assim como o RDFa que iremos falar logo mais ele usa atributos de tags para alinhar os dados.

## RDFa

RDFa ele é uma extensão do HTML é compatível com dados vinculados ou seja diferente do JSON-LD que o usuário não iria enxergar a marcação aqui já seria mais visível a ele, costumamos usar o RDFa em cabeçalho mas também pode ser usado no corpo depende de como vai trabalhar.

## Exemplo

Vou mostrar alguns modos de uso, mas quero deixar aqui a documentação e galeria de resultados da Google para vocês poderem acessar, lembrando que no schema.org vocês podem ver um pouco mais sobre cada atributos que vamos usar.


Quero mostrar um exemplo de como seria um dado estruturado de um artigo, mas antes vamos entender o que compõe um artigo ok? um artigo ele seria composto por:

-   Título
  
-   Imagens ou imagens
  
-   Data em que foi publicado
  
-   Data da última alteração
  
-   autor
  
-   O veículo responsável pela publicação.
  


Agora que temos as informações como isso seria em um dado estruturado usando a marcação JSON-LD?
```js

   <script type="application/ld+json">
       {
           "@context": "https://schema.org",
           "@type": "NewsArticle",
           "mainEntityOfPage": {
               "@type": "WebPage",
               "@id": "https://web.dev/entendendo-dados-estruturados"
            },
            "headline": "Entendendo dados estruturados ",
            "image": [
                "https://example.com/photos/1x1/photo.jpg",
            ],
            "datePublished": "2022-05-28T14:00:00+08:00",
            "dateModified": "2022-05-28T14:14:00+08:00",
            "author": {
                "@type": "Person",
                "name": "Bendev Junior",
                "url": "https://bendevoficial.com"
            },
            "publisher": {
                @type": "Organization",
                "name": "web.dev",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://google.com/logo.jpg"
                 }
           }
       }
       </script>
```


No exemplo acima nós basicamente definimos nosso dado estruturado e vamos entendê-lo agora, nós tínhamos definido que um artigo tem basicamente: **Título, Imagens ou imagens, Data em que foi publicado, Data da última alteração, autor, O veículo responsável pela publicação**. Levando isso em consideração, representamos todas essas informações nessa marcação, vale lembrar que precisa ser definido o tipo na tag `<script>`para que entenda que é uma linguagem de marcação como eu fiz acima definindo como `type="application/ld+json"`.


Vamos entender um pouco o que fizemos, no basicamente criamos um objetivo que tem como contexto o qual é definido no @Context que você veem na primeira linha do objeto `"@context": "https://schema.org",` que basicamente definimos que ele vai usar as marcações do shema.org como venho falando, logo após instanciamos parametros que o shema tem documentação de todos inclusive o tipo que usamos no `"@type": "NewsArticle"` vocês podem entrar e buscar é basicamente colocar url + tipo exemplo: [schema.org/NewsArticle,](https://schema.org/NewsArticle) vocês iram entrar na página oficial e ver todos os parâmetros disponíveis em um artigo de notícias como por exemplo o headline que usamos para o título, ou o autor que obrigatoriamente precisamos passar se é uma organização ou uma pessoal que também é um dado estruturado, assim o Google consegue mapear e entender seu site.


Este é apenas um exemplo que você pode usar na [Galeria de resultados de busca da Google](https://developers.google.com/search/docs/advanced/structured-data/article) existem várias lembrando que no [shema.org](shema.org) também tem informações sobre cada dados que podem ser usados.


Twitter: [@bendevoficial ](https://twitter.com/bendevoficial)
