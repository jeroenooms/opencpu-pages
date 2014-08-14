---
layout: post
title: "Running OpenCPU server on Fedora and Enterprise Linux"
category: posts
description: ""
cover: "containers.jpg"
---

Starting version 1.4.4, the OpenCPU cloud server can run on Redhat distributions, i.e. Fedora and Enterprise Linux (CentOS/RHEL). This post explains how to install and use OpenCPU on these systems. But before continuing I should emphasize that the preferred distribution to run OpenCPU servers is still Ubuntu, which has better support for R than any other server OS. If you would like to run OpenCPU (or other R based software) on a server, you can save yourself lots of time and headaches down the road by wisely choosing your OS. But if you like Redhat, know what you are doing and want to try OpenCPU, this post is for you.

## OpenCPU rpm packages

A spec file and instructions to build the opencpu-server rpm package from source are available from the [rpm readme](https://github.com/jeroenooms/opencpu-server/tree/master/rpm#readme) in the Github repository. The build process is very easy and I verified that it works out of the box on Fedora 19, 20 and CentOS 6. For recent versions of Fedora, prebuilt binaries are available from build service, so all you need to do is [add the repository](https://github.com/jeroenooms/opencpu-server/tree/master/rpm#readme) and run:

{% highlight bash %}
yum install opencpu-server
{% endhighlight %}

If you find any issues with the rpm packages please report them on the [issues page](https://github.com/jeroenooms/opencpu/issues).

## OpenCPU and SELinux

In general, the `opencpu-server` rpm package is very similar to the deb one, and most information in the [server manual](http://jeroenooms.github.com/opencpu-manual/opencpu-server.pdf) applies to Fedora/EL the same way as it does to Ubuntu. However one aspect is completely different: security.

Because OpenCPU has no notion of users or privileges, the server relies on Mandatory Access Control (MAC) style security. On Debian and Ubuntu, MAC is available through AppArmor and the opencpu-server package includes customisable apparmor profiles defining policies designed specifically for R and OpenCPU (see also [RAppArmor](http://www.jstatsoft.org/v55/i07/)). Redhat distributions on the other hand use SELinux and do not support AppArmor. The SELinux system is more complex and requires a lot of manual effort from the system administrator to configure and maintain security policies on the server (a popular introduction is [SELinux for Mere Mortals](http://www.redhat.com/resourcelibrary/videos/selinux-for-mere-mortals)). This is perhaps very powerful if you're a bank or government agency with a team of dedicated security experts, but otherwise it can be pretty painful.

Because the OpenCPU server builds on rApache (mod_R), it runs by default in the SElinux `httpd_modules_t` context. This standard SELinux policy is designed for Apache modules, and prevents most types of malicious use that you would expect from a web service. Running OpenCPU in this context is fine for internal use, but it is not recommended to expose your Fedora/EL OpenCPU server to the web without further fine tuning SELinux for your application. Furthermore, if you experience unexpected persmission denied errors, you probably need to enable some of the `httpd_` selinux "booleans". A boolean in SElinux is the term for a global flag that enables/disables a particular privilege within a particular context. The [httpd_selinux man page](http://linux.die.net/man/8/httpd_selinux) lists some important booleans for httpd that you might want to turn on/off.

Some more information is available in the earlier mentioned [rpm readme](https://github.com/jeroenooms/opencpu-server/tree/master/rpm#readme), which I will be updating regularly.

## About R in CentOS/RHEL

The above should get you started on Fedora, but on Enterprise Linux there is another catch. **Officially, Enterprise Linux does not support R!** The standard repositories for CentOS and RHEL do not include the `R-core` and `R-devel` packages that are available in Fedora. The workaround that is recommended by for example [CRAN](http://cran.r-project.org/bin/linux/redhat/README) and [RStudio](http://www.rstudio.com/products/rstudio/download-server/#tab1ff10494) is to add the EPEL (Extra Packages for Enterprise Linux) repository, which includes ports of many Fedora packages, including `R-core` and `R-devel`.

However it is important to realize that packages in EPEL are not frozen: they include whatever is latest on the most recent version of Fedora. This means that each time a new version of Fedora gets released (every 6 months), the latest development versions of all EPEL packages get pushed to your server the next time you run `yum update`. This is usually precisely what you do not want to happen on a server. I stress this because I learned this the hard way, when `yum` accidentily upgraded R from 2.15 to 3.0, breaking every currently installed package, when all I wanted was security updates.

You can avoid all trouble by using a distribution which has native support for R, such as Debian, Ubuntu or Fedora. But if you are still reading by now, I am probably not going to convince you :-) So make sure you either disable EPEL after installing R, or be very careful with `yum update` on long running servers.
