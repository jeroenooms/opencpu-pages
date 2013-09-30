---
layout: post
title: "Remotely use R packages on Github through OpenCPU"
category: posts
description: "By putting your R package or app on Github, all code and documentation in the package can be used remotely via the OpenCPU cloud server."
cover: "containers.jpg"
---

Any R package on Github can be used remotely on OpenCPU through the [`/ocpu/github/`](https://public.opencpu.org/api.html#api-libraries) API. Users on the internet can browse code, objects, help pages, or call functions in the package without having to learn R or install it on their local machine. Thereby you can make your method, algorithm, plot or DPU more accessible outside the R community.

For example: [last time](https://public.opencpu.org/posts/implementing-data-processing-units-with-opencpu/) we discussed how OpenMHealth uses the [geodistance](https://github.com/openmhealth/dpu.mobility/blob/master/R/geodistance.R) function to calculate the total distance along a set of lon/lat coordinates using [Haversine](http://en.wikipedia.org/wiki/Haversine_formula) formula. The `geodistance` function is included in the [dpu.mobility](https://github.com/openmhealth/dpu.mobility) R package and avaible on the `openmhealth` github repository. By putting the `dpu.mobility` package on Github, all functionality in the package can now be accessed directly though the OpenCPU cloud server. 
Try opening some of these URL's in the browser (feel free to play around with the URL). The package help pages are available under `/man/` (in various formats):

 * [/ocpu/github/openmhealth/dpu.mobility/man/](https://public.opencpu.org/ocpu/github/openmhealth/dpu.mobility/man/)
 * [/ocpu/github/openmhealth/dpu.mobility/man/geodistance/text](https://public.opencpu.org/ocpu/github/openmhealth/dpu.mobility/man/geodistance/text)
 * [/ocpu/github/openmhealth/dpu.mobility/man/geodistance/html](https://public.opencpu.org/ocpu/github/openmhealth/dpu.mobility/man/geodistance/html)
 * [/ocpu/github/openmhealth/dpu.mobility/man/geodistance/pdf](https://public.opencpu.org/ocpu/github/openmhealth/dpu.mobility/man/geodistance/pdf) 

The R functions and objects in the package are available under `/R/`:

 * [/ocpu/github/openmhealth/dpu.mobility/R](https://public.opencpu.org/ocpu/github/openmhealth/dpu.mobility/R)
 * [/ocpu/github/openmhealth/dpu.mobility/R/geodistance](https://public.opencpu.org/ocpu/github/openmhealth/dpu.mobility/R/geodistance)

Any R function in the package can be called remotely using `HTTP POST`. For example to calculate the distance from LA to NY and back with curl:

{% highlight bash %}
#POST url-encoded
curl https://public.opencpu.org/ocpu/github/openmhealth/dpu.mobility/R/geodistance/json -d \
 'long=[-74.0064,-118.2430,-74.0064]&lat=[40.7142,34.0522,40.7142]'

#POST json
curl https://public.opencpu.org/ocpu/github/openmhealth/dpu.mobility/R/geodistance/json \
 -H "Content-Type: application/json" -d '{"long":[-74.0064,-118.2430,-74.0064],"lat":[40.7142,34.0522,40.7142]}' 
{% endhighlight %}

We use `curl` for illustration in this example, but any browser or web client could do the same thing, allowing anyone to embed your algorithms or plots in systems and applications.

## Try it yourself!

For an R package to be used remotely on OpenCPU, it must be installible with `install_github` and the R package name must be identical to the repository name. I.e. if this works on your local machine:

{% highlight r %}
library(devtools)
install_github("plyr", "hadley")
{% endhighlight %}

Then the package will be available remotely though:

 * [/ocpu/github/hadley/plyr/](https://public.opencpu.org/ocpu/github/hadley/plyr/)

Try to see if you can access your own packages! Some of the usual suspects:

 * [/ocpu/github/yihui/knitr/](https://public.opencpu.org/ocpu/github/yihui/knitr/)
 * [/ocpu/github/hadley/plyr/](https://public.opencpu.org/ocpu/github/hadley/plyr/)
 * [/ocpu/github/rstudio/markdown/](https://public.opencpu.org/ocpu/github/rstudio/markdown/)
 * [/ocpu/github/ropensci/rplos/](https://public.opencpu.org/ocpu/github/ropensci/rplos/)

HTTP POST calls a function in any of these packages straight from github:

{% highlight bash %}
#from ?llply
curl https://public.opencpu.org/ocpu/github/hadley/plyr/R/llply/json -d '.data=baseball&.fun=summary'

#simple plot
curl https://public.opencpu.org/ocpu/github/hadley/ggplot2/R/qplot -d 'x=[1,2,3,4,5]&y=[2,3,2,4,2]'
{% endhighlight %}

One final note: in the current implementation of OpenCPU, packages from Github are installed no more than once every 24 hours. So your most recent Github commits might not show up immediately. The recommended workflow is to use the OpenCPU local [single user server](https://public.opencpu.org/download.html) to develop your package. Once it works locally, push your package to Github to make it available on the OpenCPU cloud server.
