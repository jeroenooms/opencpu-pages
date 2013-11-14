---
layout: post
title: "The RAppArmor Package: Enforcing Security Policies in R Using Dynamic Sandboxing on Linux"
category: posts
description: "The increasing availability of cloud computing and scientific super computers brings great potential for making R accessible through public or shared resources. This allows us to efficiently run code requiring lots of cycles and memory, or embed R functionality into, e.g., systems and web services. However some important security concerns need to be addressed before this can be put in production. The prime use case in the design of R has always been a single statistician running R on the local machine through the interactive console. Therefore the execution environment of R is entirely unrestricted, which could result in malicious behavior or excessive use of hardware resources in a shared environment. Properly securing an R process turns out to be a complex problem. We describe various approaches and illustrate potential issues using some of our personal experiences in hosting public web services. Finally we introduce the RAppArmor package: a Linux based reference implementation for dynamic sandboxing in R on the level of the operating system."
cover: "blue.jpg"
---

<p>An article called <strong>The RAppArmor Package: Enforcing Security Policies in R Using Dynamic Sandboxing on Linux</strong> has appeared in the latest volume of he <i>Journal of Statistical Software</i>: <a href="http://www.jstatsoft.org/v55/i07">http://www.jstatsoft.org/v55/i07</a>. The RAppArmor package is one of the foundations of the OpenCPU framework. It protects against malicious use and excessive use of hardware resources when executing arbitrary R code. From the abstract:</p>


<p><blockquote><small><em>The increasing availability of cloud computing and scientific super computers brings great potential for making R accessible through public or shared resources. This allows us to efficiently run code requiring lots of cycles and memory, or embed R functionality into, e.g., systems and web services. However some important security concerns need to be addressed before this can be put in production. The prime use case in the design of R has always been a single statistician running R on the local machine through the interactive console. Therefore the execution environment of R is entirely unrestricted, which could result in malicious behavior or excessive use of hardware resources in a shared environment. Properly securing an R process turns out to be a complex problem. We describe various approaches and illustrate potential issues using some of our personal experiences in hosting public web services. Finally we introduce the RAppArmor package: a Linux based reference implementation for dynamic sandboxing in R on the level of the operating system.</em></small></blockquote></p>

<p>Code, documentation, examples and videos are available from Github: <a href="https://github.com/jeroenooms/RAppArmor#readme">https://github.com/jeroenooms/RAppArmor</a>. A quick preview of what the package does below. The <code>eval.secure</code> function evaluates an expression in a sandboxed process. This way it is possible to set limits on hardware resources such as memory allocation, cpu usage, etc:</p>

{% highlight r %}
library(RAppArmor)

#sandboxed evaluation: setting 500MB memory limit
A <- eval.secure(rnorm(1e7), RLIMIT_AS = 512*1024*1024);
length(A)
> [1] 10000000

B <- eval.secure(rnorm(1e8), RLIMIT_AS = 512*1024*1024);
> Error: cannot allocate vector of size 762.9 Mb
{% endhighlight %}

<p>RAppArmor can also set hard time limits to kill jobs that are not returning timely. These time limits always work, unlike e.g. R's built-in <code>setTimeLimit</code> which won't work for the example below:</p>

{% highlight r %}
cputest <- function() {
  A <- matrix(rnorm(1e7), 1e3)
  B <- svd(A)
}

system.time(x <- eval.secure(cputest(), timeout = 5))
> Error: R call did not return within 5 seconds. Terminating process.
> Timing stopped at: 0.003 0.006 5.008
{% endhighlight %}

<p> But the most important feature is enforce Mandatory Access Control policies by applying an AppArmor profile. In this profile you can specify exactly which files and resources on the system a process is allowed to access and which not. For example, the <a href="https://github.com/jeroenooms/RAppArmor/blob/master/inst/profiles/debian/rapparmor.d/r-user">r-user</a> profile used below does <strong>not</strong> have permission to list the contents of the root of the system:</p>

{% highlight r %}
> list.files("/")
 [1] "bin"            "boot"           "cdrom"          "dev"           
 [5] "etc"            "home"           "initrd.img"     "initrd.img.old"
 [9] "lib"            "lib64"          "lost+found"     "media"         
[13] "mnt"            "opt"            "proc"           "root"          
[17] "run"            "sbin"           "srv"            "sys"           
[21] "tmp"            "usr"            "var"            "vmlinuz"       
[25] "vmlinuz.old"   
> eval.secure(list.files("/"), profile="r-user")
character(0)
{% endhighlight %}

<p>This and much more is described in detail in the Journal of Statistical Software: <a href="http://www.jstatsoft.org/v55/i07">http://www.jstatsoft.org/v55/i07</a>.