---
layout: post
title: "New features in jsonlite 0.9.14"
category: posts
description: "The jsonlite package implements a robust, high performance JSON parser and generator for R, optimized for statistical data and the web. This week version 0.9.14 appeared on CRAN which adds some handy new features."
cover: "containers.jpg"
thumb: "mariokart.jpg"
---

The [jsonlite](http://cran.rstudio.org/web/packages/jsonlite/index.html) package implements a robust, high performance JSON parser and generator for R, optimized for statistical data and the web. This week version 0.9.14 appeared on CRAN which adds some handy new features.

## Significant Digits

A feature requested by Winston Chang was to control precision of number formatting. By default, the `digits` argument in `toJSON` specifies the number of decimal digits to print:

{% highlight r %}
toJSON(pi, digits=3)
# [3.142]
{% endhighlight %}

Alternatively you can now specify the number of significant digits, analogous to the `signif` function in base R. You can either set `signif = TRUE` or specify the `digits` argument using `I()`:

{% highlight r %}
> toJSON(pi, digits = 3, use_signif = TRUE)
# [3.14]

toJSON(pi, digits = I(3))
# [3.14]
{% endhighlight %}

## Prettify Indent

A feature requested by Yihui Xie was to control the number of spaces to indent prettified json. The default is still 4 spaces:

{% highlight r %}
toJSON(pi, pretty = TRUE)
# [
#     3.1416
# ]
{% endhighlight %}

The number of indent spaces can be changed by setting the `pretty` argument to an integer. For example to indent by only 2 spaces:

{% highlight r %}
toJSON(pi, pretty = 2)
# [
#   3.1416
# ]
{% endhighlight %}

## Support for 64bit integers in toJSON

Another new feature is support for 64bit integers from the `bit64` package. R does not support 64 bit integers by default, and doubles have limited precision:

{% highlight r %}
x <- 2^60 + 1:3
toJSON(x)
# [1.15292150460685e+18,1.15292150460685e+18,1.15292150460685e+18]
{% endhighlight %}

But when the number is stored as 64 bit integer, jsonlite will print the full integer in the JSON output:

{% highlight r %}
library(bit64)
x <- as.integer64(2)^60 + 1:3
toJSON(x)
# [1152921504606846977,1152921504606846978,1152921504606846979]
{% endhighlight %}

Currently this is only supported in `toJSON`. The parser in `fromJSON` still uses doubles for very large integers.
