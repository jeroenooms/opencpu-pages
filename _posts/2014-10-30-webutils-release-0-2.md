---
layout: post
title: "Parsing multipart/form-data with webutils"
category: posts
description: "As part of a larger effort to clean up and rewrite the opencpu package, some of the more general tools will be moved into a new, separate package called webutils. The first release of webutils is now on CRAN. It containss parsers for application/x-www-form-urlencoded as well as multipart/form-data, both written in pure R."
cover: "containers.jpg"
thumb: "rabbit1.jpg"
---

As part of a larger effort to clean up and rewrite the opencpu package, some of the more general utilities will be moved into a new, separate package called [webutils](http://cran.r-project.org/web/packages/webutils/). The first release of webutils is now on CRAN.

The package contains a simple http request body parser that supports `application/x-www-form-urlencoded`, `multipart/form-data`, and `application/json`. The multipart parser is written in pure R but surprisingly fast. Two demo functions are included that illustrate how to host and parse simple HTML forms (with file uploads) using either rhttpd or httpuv.

{% highlight r %}
library(webutils)
demo_rhttpd()
demo_httpuv()
{% endhighlight %}

Nothing ground breaking in a time of interactive graphics and restful data science as a service, but sometimes all you need is a simple form. I had a hard time finding a decent multipart parser for R, and this one does the job quite nicely.
