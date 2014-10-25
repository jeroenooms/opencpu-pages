---
layout: post
title: "jsonlite 0.9.13: high performance number formatting"
category: posts
description: "The jsonlite package implements a robust, high performance JSON parser and generator for R, optimized for statistical data and the web. This week version 0.9.13 appeared on CRAN which is the third release in a relatively short period focusing on performance optimization."
cover: "containers.jpg"
thumb: "mariokart.jpg"
---

The [jsonlite](http://cran.rstudio.org/web/packages/jsonlite/index.html) package implements a robust, high performance JSON parser and generator for R, optimized for statistical data and the web. This week version 0.9.13 appeared on CRAN which is the third release in a relatively short period focusing on performance optimization.

## Fast number formatting

Version 0.9.11 and 0.9.12 had already introduced majors speedup by porting [critical bottlenecks to C code](https://www.opencpu.org/posts/jsonlite-release-0-9-11/) and switching to a [better JSON parser](https://www.opencpu.org/posts/jsonlite-release-0-9-12/). The current release focuses on number formatting and incorporates C code from [`modp_numtoa`](https://code.google.com/p/stringencoders/) which is several times faster than `as.character`, `formatC` or `sprintf` for converting doubles and integers to strings (your mileage may vary depending on platform and precision).

{% highlight r %}
library(ggplot2)
nrow(diamonds)
# [1] 53940
system.time(jsonlite::toJSON(diamonds, dataframe = "row"))
#   user  system elapsed
#  0.319   0.007   0.325
system.time(jsonlite::toJSON(diamonds, dataframe = "col"))
#   user  system elapsed
#  0.073   0.002   0.075
{% endhighlight %}

Using the same benchmark from [previous posts](http://pages.opencpu.org/posts/jsonlite-release-0-9-12/), time to convert the `diamonds` data to row-based json has gone down from 0.619s to 0.325s on my machine (about 2x speedup from jsonlite 0.9.12), and converting to column-based json has gone down from 0.330s to 0.075s (about 4x speedup).

## Comparing to other JSON packages

When comparing JSON packages, it should be noted that the comparsion is never entirely fair because different packages use different settings and defaults for missing values, number of digits, etc. Both `rjson` and `RJSONIO` only support the column based format for encoding data frames. Using their default settings:

{% highlight r %}
system.time(rjson::toJSON(diamonds))
#   user  system elapsed
#  0.279   0.004   0.281
system.time(RJSONIO::toJSON(diamonds))
#   user  system elapsed
#  0.918   0.027   0.944
{% endhighlight %}

For this particular dataset, jsonlite is about 3.5x faster than `rjson` and about 12x faster than `RJSONIO` (on my machine) to generate column-based JSON. These differences are relatively large because 7 out of the 10 columns in the `diamonds` dataset are numeric. 
