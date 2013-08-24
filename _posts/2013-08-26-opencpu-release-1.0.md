---
layout: post
title: "OpenCPU 1.0 release!"
category: posts
cover: "containers.jpg"
---

Almost 2 years after the initial beta version, we release the first official version of the OpenCPU framework. 
Based on feedback and experiences from the beta series, OpenCPU version 1.0 has been rewritten from scratch.
The result is simple and flexible API that is easier to understand yet more powerful than before.

## The OpenCPU API: resources

Try opening these URL's in your browser. 

* [https://public.opencpu.org/ocpu/library/](https://public.opencpu.org/ocpu/library)
* [https://public.opencpu.org/ocpu/library/ggplot2/](https://public.opencpu.org/ocpu/library/ggplot2/)
* [https://public.opencpu.org/ocpu/library/ggplot2/R](https://public.opencpu.org/ocpu/library/ggplot2/R)
* [https://public.opencpu.org/ocpu/library/ggplot2/R/qplot](https://public.opencpu.org/ocpu/library/ggplot2/R/qplot)
* [https://public.opencpu.org/ocpu/library/ggplot2/man](https://public.opencpu.org/ocpu/library/ggplot2/man)
* [https://public.opencpu.org/ocpu/library/ggplot2/man/qplot/text](https://public.opencpu.org/ocpu/library/ggplot2/man/qplot/text)
* [https://public.opencpu.org/ocpu/library/ggplot2/man/qplot/html](https://public.opencpu.org/ocpu/library/ggplot2/man/qplot/html)
* [https://public.opencpu.org/ocpu/library/ggplot2/man/qplot/pdf](https://public.opencpu.org/ocpu/library/ggplot2/man/qplot/pdf)

What about these?

* [https://public.opencpu.org/ocpu/library/MASS/DESCRIPTION](https://public.opencpu.org/ocpu/library/MASS/DESCRIPTION)
* [https://public.opencpu.org/ocpu/library/MASS/NEWS](https://public.opencpu.org/ocpu/library/MASS/NEWS)
* [https://public.opencpu.org/ocpu/library/MASS/scripts/](https://public.opencpu.org/ocpu/library/MASS/scripts/)
* [https://public.opencpu.org/ocpu/library/MASS/scripts/ch01.R](https://public.opencpu.org/ocpu/library/MASS/scripts/ch01.R)

Use HTTP POST to call a function or script:

{% highlight bash %}
curl -X POST https://public.opencpu.org/ocpu/library/MASS/scripts/ch01.R
curl https://public.opencpu.org/ocpu/library/stats/R/rnorm -d 'n=10&mean=5'
{% endhighlight %}

## OpenCPU Apps

One of the major improvements in OpenCPU 1.0 is improved support for apps.
An OpenCPU app is an R package which includes some web page(s) that call the R functions in the package using the OpenCPU API. 
This makes a convenient way to develop, package and ship standalone R web applications.
Have a look at the <a href="https://public.opencpu.org/apps.html">example apps</a>. 

## The single-user server

OpenCPU 1.0 is available both as a cloud server, and single-user server. The latter will run inside an interactive
R session and is used to run and develop local apps.

{% highlight r %}
install.packages("opencpu")
library(opencpu)
{% endhighlight %}

After installing OpenCPU, we install apps just like we would install a package:

{% highlight r %}
library(devtools)

#gitstats app
install_github("gitstats", "opencpu")
opencpu$browse("/library/gitstats/www")

#stocks app
install_github("stocks", "opencpu")
opencpu$browse("/library/stocks/www")

#nabel app
install_github("nabel", "opencpu")
opencpu$browse("/library/nabel/www")
{% endhighlight %}


