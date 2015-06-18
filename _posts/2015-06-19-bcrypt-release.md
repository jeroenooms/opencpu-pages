---
layout: post
title: "Secure password hashing in R with bcrypt"
category: posts
description: "The new package bcrypt provides an R interface to the OpenBSD ‘blowfish’ password hashing algorithm, as described in A Future-Adaptable Password Scheme by Niels Provos. The implementation is derived from the py-bcrypt module for Python which is a wrapper for the OpenBSD implementation."
cover: "containers.jpg"
thumb: "openbsd.gif"
---

The new package [bcrypt](http://cran.r-project.org/web/packages/bcrypt/) provides an R interface to the OpenBSD 'blowfish' password hashing algorithm described in [*A Future-Adaptable Password Scheme*](http://www.openbsd.org/papers/bcrypt-paper.pdf) by [Niels Provos](http://research.google.com/pubs/author1.html). The implementation is derived from the [py-bcrypt](https://pypi.python.org/pypi/py-bcrypt/) module for Python which is a wrapper for the OpenBSD implementation.

Bcrypt is used for secure password hashing. The main difference with regular digest algorithms such as md5 / sha256 is that the bcrypt algorithm is specifically designed to be cpu intensive in order to protect against brute force attacks. This means that hasing with bcrypt is terribly slow, which is a feature. The complexity of the algorithm is configurable via the `log_rounds` parameter.

The API from the R package is exactly the same as [the one from python](http://www.mindrot.org/projects/py-bcrypt/): the `hashpw` function calculates a hash from a password using a random salt. Validating the hash is done by reshashing the password using the hash as a salt. 

{% highlight r %}
# Secret message as a string
passwd <- "supersecret"

# Create the hash
hash <- hashpw(passwd)
hash
## [1] "$2a$12$1G8N3Xnp11oHt0RJf7SCMeWib7DpEOgpE5lXwjE2BATHJqFFxci6u"

# To validate the hash
identical(hash, hashpw(passwd, hash))
## TRUE

# Wrapper that does the same
checkpw(passwd, hash)
## TRUE
{% endhighlight %} 

The `gensalt` function generates a salt for use with `hashpw` and specifies the complexity of the algorithm via the `log_rounds` parameter. The first few characters in the salt string hold the bcrypt version  and value for log_rounds. The remainder stores 16 bytes of base64 encoded randomness for seeding the hashing algorithm.

{% highlight r %}
# Use varying complexity:
hash11 <- hashpw(passwd, gensalt(11))
hash12 <- hashpw(passwd, gensalt(12))
hash13 <- hashpw(passwd, gensalt(13))

# Takes longer to verify (or crack)
system.time(checkpw(passwd, hash11))
##   user  system elapsed 
##  0.155   0.000   0.156 
system.time(checkpw(passwd, hash12))
##   user  system elapsed 
##  0.312   0.000   0.312 
system.time(checkpw(passwd, hash13))
##   user  system elapsed 
##  0.640   0.002   0.642
{% endhighlight %} 
