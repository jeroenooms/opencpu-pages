---
layout: post
title: "curl 0.4 bugfix release"
category: posts
description: "This week curl version 0.4 appeared on CRAN. This release fixes a bug that was introduced in the previous version, and which could under some circumstances crash your R session. The new version is well tested and super stable. If you are using this package, updating is highly recommended."
cover: "containers.jpg"
thumb: "curllogo.jpg"
---

This week curl version 0.4 appeared on CRAN. This release fixes a memory [bug](https://github.com/jeroenooms/curl/commit/2d07e3fb1aec17fb8d64a5802277acf3d684fcd1) that was introduced in the previous version, and which could under some circumstances crash your R session. The new version is well tested and super stable. If you are using this package, updating is highly recommended.


## What is curl again?

From the manual

> The curl() function provides a drop-in replacement for base url() with better performance and support for http 2.0, ssl (https://, ftps://), gzip, deflate and other libcurl goodies. This interface is implemented using the RConnection API in order to support incremental processing of both binary and text streams.

Some examples from the help page illustrating https, gzip, redirects and other stuff that base url doesn't do well:

{% highlight r %}
library(curl)

# Read from a connection
con <- curl("https://httpbin.org/get")
readLines(con)

# HTTP error
curl("https://httpbin.org/status/418", "r")

# Follow redirects
readLines(curl("https://httpbin.org/redirect/3"))

# Error after redirect
curl("https://httpbin.org/redirect-to?url=http://httpbin.org/status/418", "r")

# Auto decompress Accept-Encoding: gzip / deflate (rfc2616 #14.3)
readLines(curl("http://httpbin.org/gzip"))
readLines(curl("http://httpbin.org/deflate"))
{% endhighlight %}

## Streaming

The advantage of curl over RCurl and httr is that the connection interface allows for streaming. For example you can use `readLines` to download and process data line-by-line:

{% highlight r %}
con <- curl("http://jeroenooms.github.io/data/diamonds.json", open = "r")
readLines(con, n = 3)
readLines(con, n = 3)
readLines(con, n = 3)
close(con)
{% endhighlight %}

We can combine this with `stream_in` from jsonlite to stream-parse sizable datasets:

{% highlight r %}
library(jsonlite)
con <- gzcon(curl("https://jeroenooms.github.io/data/nycflights13.json.gz"))
nycflights <- stream_in(con)
{% endhighlight %}

