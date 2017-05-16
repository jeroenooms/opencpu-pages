---
layout: post
title: "OpenCPU 1.0 release!"
category: posts
description: With the new release also comes a new website and blog in which we will post tutorials and examples over the upcoming weeks/months. This first post features some highlights to get your feet wet.
cover: "containers.jpg"
---

After more than 3 years of development, we release the first official version of the OpenCPU system. 
Based on feedback and experiences from the beta series, OpenCPU version 1.0 has been rewritten entirely from scratch.
The result is simple and flexible API that is easier to understand yet more powerful than before.

With the new release also comes a new website and blog in which we will post tutorials and examples over the upcoming weeks/months. 
This first post features some highlights to get your feet wet.

## The package API

Try opening these URL's in your browser to explore objects and manuals (help pages) from a package:

    https://cloud.opencpu.org/ocpu/library/
    https://cloud.opencpu.org/ocpu/library/ggplot2/
    https://cloud.opencpu.org/ocpu/library/ggplot2/R/    
    https://cloud.opencpu.org/ocpu/library/ggplot2/R/diamonds
    https://cloud.opencpu.org/ocpu/library/ggplot2/R/mpg/json    
    https://cloud.opencpu.org/ocpu/library/ggplot2/R/mpg/csv
    https://cloud.opencpu.org/ocpu/library/ggplot2/R/mpg/rda
    https://cloud.opencpu.org/ocpu/library/ggplot2/R/qplot
    https://cloud.opencpu.org/ocpu/library/ggplot2/man/
    https://cloud.opencpu.org/ocpu/library/ggplot2/man/qplot/text
    https://cloud.opencpu.org/ocpu/library/ggplot2/man/qplot/html
    https://cloud.opencpu.org/ocpu/library/ggplot2/man/qplot/pdf

Or interface static files:

    https://cloud.opencpu.org/ocpu/library/MASS/DESCRIPTION
    https://cloud.opencpu.org/ocpu/library/MASS/NEWS
    https://cloud.opencpu.org/ocpu/library/MASS/scripts/
    https://cloud.opencpu.org/ocpu/library/MASS/scripts/ch01.R


## External Repositories

The `/ocpu/library/` API interfaces to packages which are installed in the global library on the server. 
Want to try another package? With a little extra patience, you can open any package straight from cran or github:

    https://cloud.opencpu.org/ocpu/cran/JJcorr/
    https://cloud.opencpu.org/ocpu/github/hadley/plyr/

Of course this will only work if the package installation is successful. When a package on an external repository
is accessed for the first time, the request might take quite a while because it is installed on the fly. But once
it is working, you can use it just like packages installed on the server. 

    https://cloud.opencpu.org/ocpu/github/jeroenooms/gitstats/www/

This way you can share your own packages and apps without hosting a personal OpenCPU cloud server.

## Running a function / script

The core feature of OpenCPU is the ability to call functions and run scripts (including sweave/knitr scripts).
To get started, you can use the <a href="https://cloud.opencpu.org/ocpu/test/">testing page</a> to poke around in the API.
Alternatively use `curl` to call OpenCPU from your command line:

{% highlight bash %}
#run a script
curl -X POST https://cloud.opencpu.org/ocpu/library/MASS/scripts/ch01.R

#call a function
curl https://cloud.opencpu.org/ocpu/library/stats/R/rnorm -d 'n=10&mean=5'
{% endhighlight %}

A successful POST will always return a HTTP 201 response indicating the location of where to retrieve results from the execution (objects, graphics, files, stdout, etc)


## OpenCPU Apps

One of the major improvements in OpenCPU 1.0 is improved support for apps.
An OpenCPU app is an R package which includes some web page(s) that call the R functions in the package using the OpenCPU API. 
This makes a convenient way to develop, package and ship standalone R web applications.
Have a look at the <a href="https://cloud.opencpu.org/apps.html">example apps</a>. 

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


