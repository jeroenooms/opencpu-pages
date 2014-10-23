---
layout: post
title: "Generating secure random numbers with openssl"
category: posts
description: "The openssl R package implements bindings to the OpenSSL random number generator in order to generate crypto secure random bytes in R."
cover: "containers.jpg"
thumb: "securitycat.jpg"
---

I started working on a new R package with bindings for OpenSSL. The initial release is now available [from CRAN](http://cran.r-project.org/web/packages/openssl). To install the package on Linux you need `libssl-dev` (Debian/Ubuntu) or `openssl-devel` (Fedora, RHEL, CentOS). For Mac and Windows, precompiled binaries are available from CRAN as usual. The Mac version is compiled against the version of OpenSSL that is included with OSX. See the [comments](https://github.com/jeroenooms/openssl/blob/master/src/Makevars) in Makevars if you want to compile against a more recent version of OpenSSL.

## Secure random numbers

The initial release of openssl implements bindings to the OpenSSL random number generator, which will be used to generate session keys in the upcoming version of the OpenCPU system. This feature was requested by Ruben Arslan who noted that the default RNG in R is not suitable for this because they are predictable and lack of entropy can lead to collisions. I'm not a crypto expert but it seems like OpenSSL is frequently recommended for secure RNG, hence this new package. For implementation details, see the respective [OpenSSL documentation](https://www.openssl.org/docs/crypto/RAND_bytes.html) pages.

The `rand_bytes` and `rand_pseudo_bytes` functions return a raw vector with random bytes:

{% highlight r %}
library(openssl)
rand_bytes(10)
# [1] 3b a7 0f 85 e7 c6 cd 15 cb 5f
{% endhighlight %}

To convert them to integers (0-255) simply use `as.numeric`:

{% highlight r %}
> as.numeric(rand_bytes(10))
# [1]  15 149 231  77  18  29 219 191 165 112
{% endhighlight %}

Or convert bits to booleans:

{% highlight r %}
> rnd <- rand_bytes(1)
> as.logical(rawToBits(rnd))
# [1] FALSE FALSE  TRUE FALSE FALSE  TRUE  TRUE  TRUE
{% endhighlight %}

## Probability distributions

Mapping random bytes to a continuous distribution requires a bit of math. For example to combine four 8bit bytes into a single 32bit double from the standard uniform distribution:

{% highlight r %}
rand_unif <- function(n){
  x <- matrix(as.numeric(openssl::rand_bytes(n*4)), ncol = 4)
  as.numeric(x %*% 256^-(1:4));
}
rand_unif(5)
# [1] 0.8094907 0.8180394 0.0743821 0.6031131 0.8488938
{% endhighlight %}

And from U(0,1) we can map into draws from a probability distribution using its CDF:

{% highlight r %}
rand_norm <- function(n, ...){
  qnorm(rand_unif(n), ...)
}
rand_norm(5, mean = 100, sd = 15)
# [1] 101.86120 123.84420  70.15235  81.50505  86.46514
{% endhighlight %}

However note the native R random number generators are much faster and have better numeric properties. Also the OpenSSL RNG is not intended for generating large sequences of random numbers as often used in statistics. It is mainly useful in situations where it is critical to create a little bit of secure randomness that can not be manipulated. Typical applications include encryption keys, drinking games, or raffle drawings at your local R user group.

## More fun stuff

OpenSSL has a lot of other useful stuff which we coud add to the R package in future versions. In particular public key methods to sign and verify packages is something that R and CRAN could really benefit from. Simon Urbanek is working on something similar as well in the [PKI](https://github.com/s-u/PKI) package, which also builds on OpenSSL.

If you you would like to see some other OpenSSL functionality in the R package, feel free to send a pull request with bindings on [github](https://github.com/jeroenooms/openssl). It would be great to have people involved with better understanding cryptographic methods.
