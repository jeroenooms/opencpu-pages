---
layout: post
title: "New package: curl. High performance http(s) streaming in R"
category: posts
description: "The curl() function provides a drop-in replacement for base url() with better performance and support for http 2.0, ssl (https, ftps), gzip, deflate and other libcurl goodies. This interface is implemented using the RConnection API in order to support incremental processing of both binary and text streams."
cover: "containers.jpg"
thumb: "boat.jpg"
---

A bit ago I blogged about [new streaming features](https://www.opencpu.org/posts/jsonlite-streaming) in jsonlite:

{% highlight r %}
library(jsonlite)
diamonds2 <- stream_in(url("http://jeroenooms.github.io/data/diamonds.json"))
{% endhighlight %}

In the same blog post it was also mentioned that R does currently not support https connections. The `RCurl` package does support https, but does not have a connection interface. This bothered me so I decided to write one. The result is the new [curl](http://cran.r-project.org/package=curl) package.

## Encryption, compression and more

From the package description:

> The curl() function provides a drop-in replacement for base url() with better performance and support for http 2.0, ssl (https, ftps), gzip, deflate and other libcurl goodies. This interface is implemented using the RConnection API in order to support incremental processing of both binary and text streams.

What this means is that `curl()` should be able to do anything that `url()` does, but better. The same example as above, but now with https:

{% highlight r %}
library(curl)
library(jsonlite)
diamonds2 <- stream_in(curl("https://jeroenooms.github.io/data/diamonds.json"))
{% endhighlight %}

That was easy. Switching to curl has other benefits as well. For example it automatically recognizes and decompresses gzipped or deflated connections from the `Accept-Encoding` header:

{% highlight r %}
readLines(curl("http://httpbin.org/gzip"))
readLines(curl("http://httpbin.org/deflate"))
{% endhighlight %}

Support for compression can make a huge difference when streaming large data. Text based formats such as json are popular because they are human readable, but the main downside of plain-text is inefficiency for storing numbers. However when gzipped, json payloads are often [comparable to binary formats](https://news.ycombinator.com/item?id=2571729), giving you the best of both worlds.

## Performance

One thing that did surprise me a bit is the difference in performance. Especially the implementation of `readLines` for url connections seems to be inefficient in base R.

{% highlight r %}
con2 <- curl("http://jeroenooms.github.io/data/diamonds.json")
system.time(readLines(con2))
#   user  system elapsed
#  0.238   0.096   0.334

con1 <- url("http://jeroenooms.github.io/data/diamonds.json")
system.time(readLines(con1))
#   user  system elapsed
#  0.236   0.113   3.858
{% endhighlight %}

I'm not quite sure why this is. Maybe the base R version does some additional character recoding that I am not aware of, although I have not observed such behavior. Also measuring performance is tricky in this case because it depends on the connection bandwidth, caching settings, etc.
