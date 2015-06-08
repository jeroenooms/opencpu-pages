---
layout: post
title: "The curl package: a modern R interface to libcurl"
category: posts
description: "The curl() and curl_download() functions provide highly configurable drop-in replacements for base url() and download.file() with better performance, support for encryption (https://, ftps://), 'gzip' compression, authentication, and other 'libcurl' goodies. The core of the package implements a framework for performing fully customized requests where data can be processed either in memory, on disk, or streaming via the callback or connection interfaces."
cover: "containers.jpg"
thumb: "curllogo.jpg"
abstract: "**TL;DR:** *Check out the [vignette](http://cran.r-project.org/web/packages/curl/vignettes/intro.html) or the [development version](https://github.com/hadley/httr#installation) of httr.*" 
---

The package I put most time and effort in this year is [curl](http://cran.r-project.org/web/packages/curl/vignettes/intro.html). Last week version 0.8 was published on CRAN which fixes the last outstanding [bug](https://github.com/jeroenooms/curl/commit/80e0f72d248a1a812af2fe0f5adec772c9e18c0a) for Solaris. The package is pretty much done at this point: stable, well tested, and does everything it needs to; nothing more nothing less... 

From the description:

> The curl() and curl_download() functions provide highly configurable drop-in replacements for base url() and download.file() with better performance, support for encryption (https://, ftps://), 'gzip' compression, authentication, and other 'libcurl' goodies. The core of the package implements a framework for performing fully customized requests where data can be processed either in memory, on disk, or streaming via the callback or connection interfaces.

The initial [motivation](https://www.opencpu.org/posts/curl-release-0-2/) of the package was to implement a [connnection interface](http://stackoverflow.com/questions/30445875/what-exactly-is-a-connection-in-r/30446224#30446224) with SSL (https) support, something R has always been lacking (see also [json streaming](https://www.opencpu.org/posts/jsonlite-streaming/)). But since then the package has matured into a full featured HTTP client. By now it has become exactly what I promised it would not be: a complete replacement of RCurl.

### What about RCurl?

Good question. The [RCurl](http://www.omegahat.org/RCurl/) package by all-star R-core member Duncan Temple-Lang is one of the most widely used R packages. The first CRAN release was about 11 years ago and it has since then been the standard networking client for R. The [paper](http://www.omegahat.org/RCurl/RCurlJSS.pdf) shows that Duncan was (as with most of his work) ahead of his time, describing tools and technology that are now part of the standard data-science workflow. 

The RCurl package was also the basis of Hadley's popular [httr](https://github.com/hadley/httr) package, which started to reveal some shortcomings, including memory leaks, build problems, performance regressions and [mysterious errors](http://recology.info/2014/12/multi-handle/). Now a bug or two we can fix, but from the RCurl [source](https://github.com/omegahat/RCurl/blob/master/src/curl.c) code it becomes obvious that a lot has changed over the past 10 years. Both R and libcurl have matured a lot, and the internet has largely converged to (REST style) HTTP and SSL, with other protocols slowly being phased out. Also Duncan is a busy guy and seems to have largely moved on to other projects. And so we are going to need a rewrite from scratch...

The curl package is inspired by the good parts of RCurl but with an implementation that takes advantage of modern features in R such as the connection interface and external pointers with proper finalizers. This allows for a much simpler interface to libcurl that has better performance, supports streaming, and handles that automatically clean up after themselves. Moreover curl is deliberately very minimal and only contains the essential foundations for interacting with libcurl. High-level logic and utilities can be provided by other packages that build on curl, such as httr. The result is a small, clean and powerful package that takes 2 seconds to compile and will hopefully prove to be reliable and low maintenance.

### Getting started with curl and httr

The best introduction to the curl package is the [vignette](http://cran.r-project.org/web/packages/curl/vignettes/intro.html) which has some nice examples to get you started. Moreover the [development version of httr](http://github.com/hadley/httr) has already been migrated from RCurl to curl. To install using devtools:

{% highlight r %}
library(devtools)
install_github("hadley/httr")
{% endhighlight %} 

Note that devtools itself depends on httr so you might need to restart R after updating httr. If you are seeing some `ERROR: loading failed` error (especially on Windows) just restart R and try again.
