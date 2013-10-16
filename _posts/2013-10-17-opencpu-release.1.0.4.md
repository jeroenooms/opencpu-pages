---
layout: post
title: "OpenCPU Release 1.0.4"
category: posts
description: "OpenCPU 1.0.4 was released to CRAN and Launchpad. A new improvement in this release is the capturing of output for the package installation process."
cover: "newyork.jpg"
---

OpenCPU version 1.0.4 was released to CRAN and Launchpad this week. This release brings some bug fixes/improvements and no breaking changes so you can safely upgrade your 1.0.x installations. Upgrade an existing OpenCPU cloud server using:

{% highlight bash %}
sudo apt-get update
sudo apt-get upgrade 
{% endhighlight %}

Or to install the latest version of the OpenCPU local single-user server in R:

{% highlight r %}
update.packages(ask=FALSE)
install.packages("opencpu", repos="http://cran.r-project.org")
{% endhighlight %}

## New in this release

One improvement in this release is the capturing of output from the package installation process. This is surprisingly difficult in R, but thanks to some helpful <a href="http://r.789695.n4.nabble.com/Capture-output-of-install-packages-pipe-system2-td4676754.html">tips</a> on r-devel, we found a way to implement it. This makes it much easier to diagnose the problem if a certain package fails to install on OpenCPU.

For example: as described in the API manual <a href="https://public.opencpu.org/api.html#api-libraries">section on libraries</a>, the <a href="https://public.opencpu.org/ocpu/cran/" target="blank"><code>/ocpu/cran/</code></a>, <a href="https://public.opencpu.org/ocpu/bioc/" target="blank"><code>/ocpu/bioc/</code></a> and <a href="https://public.opencpu.org/ocpu/github/hadley/" target="blank"><code>/ocpu/github/</code></a> APIs represent <strong>remote libraries</strong>: when a client calls a package in any of these libraries for the first time, the OpenCPU server will attempt to install the current version of the corresponding package on the fly (if not already available), before processing the request. In a <a href="https://public.opencpu.org/posts/remotely-use-r-packages-on-github/">previous post</a> we described how this allows anyone on the internet to use your R package without even installing R.

However, sometimes the installation of a package fails, for example because of a missing dependency or version conflict. To make it easier to diagnose the problem, the OpenCPU server now returns the output from the package installation process for failed installations. For example, here are two packages that fail to install, and now we know why :-)

<ul>
	<li><a href="https://public.opencpu.org/ocpu/github/hadley/dplyr/" target="_blank">/ocpu/github/hadley/dplyr/</a></li>
	<li><a href="https://public.opencpu.org/ocpu/cran/rgl/" target="_blank">/ocpu/cran/rgl/</a></li>	
</ul> 

Loading these pages can take a couple of seconds because we have to wait for the installation process to complete. However once a package installation has succeeded it is stored for 24 hours so that the next request/user will be able to use it instantaneously.

## About Local and Remote libraries

It is important to note that the above only applies to the mentioned <strong>remote libraries</strong>. Package in any of the <string>local libraries</strong> such as <a href="https://public.opencpu.org/ocpu/library/" target="blank"><code>/ocpu/library/</code></a> are already installed on the server. When running your own OpenCPU server, it is preferable to install your package on the server in the usual ways and call it via the local library API. The remote libraries are mostly intended to allow anyone to share and use arbitrary packages on public OpenCPU servers.
