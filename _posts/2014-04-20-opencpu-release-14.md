---
layout: post
title: "OpenCPU release 1.3 and 1.4"
category: posts
description: "After a few months of testing we present OpenCPU versions 1.3 and 1.4. These releases do not introduce any major changes in the OpenCPU HTTP API but focus entirely on performance, reliability and security to support long running servers."
cover: "containers.jpg"
---

After a few months of testing we present OpenCPU versions 1.3 and 1.4. These releases do not introduce any major changes in the <a href="../../api.html">OpenCPU HTTP API</a> but focus entirely on performance, reliability and security to support long running servers. The only minor API change in the <a href="../getting-ready-for-opencpu130/">switch to absolute URLs</a> in the location header. Upgrading from OpenCPU 1.2 should be painless and is recommended.

These and future releases of the OpenCPU cloud server will target <code>Ubuntu 14.04</code> in order to take advantage of recent features in <code>R</code>, <code>Apache2</code>, <code>AppArmor</code> and <code>nginx</code>. Because this is a Long Term Support (LTS) Ubuntu release it includes 5 years of updates. Hence your OpenCPU server can run safely until April 2019 (or until you decide to upgrade).

## Version 1.3 versus 1.4

OpenCPU versions 1.3 and 1.4 build on exactly the same version of the HTTP API and server code. The only difference is the version of R that is used in the cloud server. OpenCPU version 1.3 uses <code>R 3.0.2</code> included with Ubuntu, whereas OpenCPU version 1.4 uses the current version: <code>R 3.1.0</code>.

If you have no preference, OpenCPU 1.4 is recommended because many of the packages on <code>CRAN</code> require the <i>current</i> version of <code>R</code> and will therefore only work with OpenCPU 1.4.

## How to upgrade

Because of some internal cleanup and refactoring of configuration files, it is highly recommended to install the new version of OpenCPU on a clean fresh Ubuntu 14.04 server. Usually installing a new Ubuntu server is safer and quicker than upgrading and old server anyway. See the <a href="https://opencpu.github.io/server-manual/opencpu-server.pdf">Server Manual</a> for standard instructions on a clean installation.

However if for whatever reason you need to upgrade a previous installation, the safest way is to uninstall previous versions before installing the new one. This ensures that no old files keep lingering around.

{% highlight bash %}
# remove old versions
sudo apt-get purge opencpu-*
sudo apt-get autoremove --purge

# upgrade Ubuntu to 14.04 (if not done so yet)
sudo do-release-upgrade

# install new version on Ubuntu 14.04
sudo add-apt-repository opencpu/opencpu-1.4
sudo apt-get update
sudo apt-get install opencpu
{% endhighlight %}

## OpenCPU and RStudio

Using OpenCPU together with RStudio is now even easier! The <code>opencpu-1.3</code> and <code>opencpu-1.4</code> repositories include a copy of rstudio server that you can install with a single line:

{% highlight bash %}
# install rstudio
sudo apt-get install rstudio-server
{% endhighlight %}

Both apache and nginx are preconfigured to proxy the <code>/rstudio/</code> path to rstudio. Hence after installing both opencpu and rstudio-server they can be accessed directly through:

    https://your.server.com/ocpu/
    https://your.server.com/rstudio/

Appendix B of the <a href="https://opencpu.github.io/server-manual/opencpu-server.pdf">OpenCPU Server Manual</a> has some more details.

## Questions

If you have any problems, questions, feedback or suggestions feel free to send an email on the <a href="../../help.html">mailing list</a> or open an issue on github. As is the case for many open source projects, good software comes with terrible documentation. But if anything is not working or unclear please do let me know; it is probably something small.


