---
layout: post
title: "New in openssl 0.3: hash functions"
category: posts
description: "This release enables gzip compression in the default apache2 configuration for ocpu, which was suggested by several smart users. When gzipped, json payloads are often comparable to binary formats, giving you the best of both worlds."
cover: "containers.jpg"
thumb: "systemd.jpg"
---

This week version 0.3 of the [openssl](http://cran.r-project.org/web/packages/openssl/index.html) package appeared on CRAN. New in this release are bindings to the cryptographic hashning functions in OpenSSL. Not exactly ground breaking (hashing functions have long been available from digest) but nice to have anyway. An overview from the new [vignette](http://cran.r-project.org/web/packages/openssl/vignettes/crypto_hashing.html):

## Hashing functions

The functions `sha1`, `sha256`, `sha512`, `md4`, `md5` and `ripemd160` bind to the respective [digest functions](https://www.openssl.org/docs/apps/dgst.html) in OpenSSL's libcrypto. Both binary and string inputs are supported and the output type will match the input type.

{% highlight r %}
library(openssl)
md5("foo")
# [1] "acbd18db4cc2f85cedef654fccc4a4d8"
md5(charToRaw("foo"))
# [1] ac bd 18 db 4c c2 f8 5c ed ef 65 4f cc c4 a4 d8
{% endhighlight %}

Functions are fully vectorized for the case of character vectors: a vector with n strings will return n hashes.

{% highlight r %}
# Vectorized for strings
md5(c("foo", "bar", "baz"))
# [1] "acbd18db4cc2f85cedef654fccc4a4d8" "37b51d194a7513e45b56f6524f2d51f2"
# [3] "73feffa4b7f6bb68e44cf984c85f6e88"
{% endhighlight %}

Besides character and raw vectors we can pass a connection object (e.g. a file, socket or url). In this case the function will stream-hash the binary contents of the conection.

{% highlight r %}
# Stream-hash a file
myfile <- system.file("CITATION")
md5(file(myfile))
# Hashing....
# [1] e4 4f 1b 99 e3 2f 27 e0 a7 e6 a0 0a 36 07 0e 1b
{% endhighlight %}

Same for URLs. The hash of the [`R-3.1.1-win.exe`](http://cran.us.r-project.org/bin/windows/base/old/3.1.1/R-3.1.1-win.exe) below should match the one in [`md5sum.txt`](http://cran.us.r-project.org/bin/windows/base/old/3.1.1/md5sum.txt)

{% highlight r %}
# Stream-hash from a network connection
md5(url("http://cran.us.r-project.org/bin/windows/base/old/3.1.1/R-3.1.1-win.exe"))
# Hashing................................................................................................................
# [1] 0b 48 29 e8 92 10 eb 6d 13 71 24 8c d0 97 d1 fc
{% endhighlight %}

## Compare to digest

Similar functionality is also available in the [digest](http://cran.r-project.org/web/packages/digest/index.html) package, but with a slightly different interface:

{% highlight r %}
# Compare to digest
library(digest)
digest("foo", "md5", serialize = FALSE)
# [1] "acbd18db4cc2f85cedef654fccc4a4d8"

# Other way around
digest(cars, skip = 0)
# [1] "81919836edd7b5a422700ac32bbccd7d"
md5(serialize(cars, NULL))
# [1] 81 91 98 36 ed d7 b5 a4 22 70 0a c3 2b bc cd 7d
{% endhighlight %}





