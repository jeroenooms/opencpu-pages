---
layout: post
title: "HTTPS for CRAN: how and why"
category: posts
description: "R gained some limited support for https in version 3.2.0. Because `install.packages` and friends wrap around `download.file`, we can use this new feature to download R packages from CRAN via https. Encrypting the connection with the CRAN server prevents intermediate parties such as your ISP, (anti)virus, or any other user on your network from snooping or tampering with the connection."
cover: "containers.jpg"
thumb: "securitycat.jpg"
---

R gained some basic support for https in version 3.2.0 (see [NEWS](http://cran.r-project.org/doc/manuals/r-release/NEWS.html)) via the `method = "libcurl"` argument in base functions `download.file` and `url`. The global option `download.file.method` is used to make this the default. 

Unfortunately the implementation has a few limitations: there is no way to set request options (authentication, proxy, headers, TLS options, etc) and the functions do not expose an http status code or response headers. Because they also do not raise an error when the request fails with an http error (as do the other download methods), this leaves you to guess if the retrieved content is what you were expecting or an error page. 

{% highlight r %}
# Raises an error
download.file("http://httpbin.org/status/418", tempfile(), method = "internal")

# Does not raise an error
download.file("http://httpbin.org/status/418", tempfile(), method = "libcurl")

# What it should do
library(curl)
curl_download("http://httpbin.org/status/418", tempfile())
{% endhighlight %}

Anyway it is good enough for downloading static files from public servers, which is all we need for now.

### CRAN and libcurl

Because `install.packages` and friends wrap around `download.file`, we can use this new feature to download R packages from CRAN via https. None of the currently available CRAN servers seems to support https, so I created a demo server at [https://cran.opencpu.org](https://cran.opencpu.org). This is not a real mirror, it is just a https proxy to the [US mirror](http://cran.us.r-project.org/).

{% highlight r %}
# Install a package over https
install.packages("ggplot2", repos = "https://cran.opencpu.org", method = "libcurl")
{% endhighlight %}

Use a script like this to opt-in globally on machines where libcurl is available:

{% highlight r %}
# Enable CRAN https everywhere
if(capabilities("libcurl")){
  options(repos = "https://cran.opencpu.org", download.file.method = "libcurl")
}
{% endhighlight %}

Hopefully the admins in Vienna will at some point enable https for the main [cran server](https://cran.r-project.org/) in the same way they have done for [r-forge](https://r-forge.r-project.org/) (which is literally the neighborhing ip address).

### Why CRAN and https?

Using https can stop some, but not all, MITM attacks. Encrypting the connection with the CRAN server prevents intermediate parties such as your ISP, (anti)virus, or any other user on your network from snooping or tampering with the connection. When it comes to CRAN, security is probably more of a concern than privacy, especially when using public networks on e.g. airports, coffee shops or campuses. It is easy for hackers or viruses to hijack wifi connections and inject malicious code or executables into unencrypted traffic. Using https guarantees that at least the connection between you and your CRAN mirror is secure.

Of course this does not fully guarantee the integrity of your download. You are basically putting your faith in the hands of your CRAN mirror (or the owner of the domain to be more specific). If the mirror server gets hacked, or somebody manages to tamper with the mirroring process itself (which is done using rsync without any encryption) packages can still get infected. 

Linux distributions solve this problem by making package authors sign the checksum of the package with a private key. This signature is used to automatically verify the integrity of a download from the author's public key before installation, regardless of how the package was obtained. Simon has implemented some of this for R in [PKI](https://github.com/s-u/PKI) but unfortunately this was never adopted by CRAN. But at least with https we can somewhat safely install R packages from within a coffee shop now, which solves the most urgent problem.
