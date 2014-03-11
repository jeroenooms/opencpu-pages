---
layout: post
title: "OpenCPU 1.2.3 release"
category: posts
description: "OpenCPU is a system for embedded scientific computing and reproducible research. The OpenCPU HTTP API provides a middle layer interface to R. Either use the public servers or host your own."
cover: "containers.jpg"
---

A new version of the <a href="http://cran.r-project.org/web/packages/opencpu">opencpu package</a> was released to CRAN and Launchpad. Besides some minor bugfixes, the single-user has better support for configuration. By default, the single-user server will now load configuration from the following file:

{% highlight r %}
path.expand("~/.opencpu.conf")
{% endhighlight %}

If this file does not exist, the default configuration is used.

## Future plans

This is likely the final release in the 1.2 series. Future versions of OpenCPU will be targeting <code>R 3.1</code> and <code>Ubuntu 14.04</code> (both to be released in April), and the version will be bumped to emphasize this. 

No changes in the API are scheduled. Future work will focus on improving performance, documentation and client libraries.  