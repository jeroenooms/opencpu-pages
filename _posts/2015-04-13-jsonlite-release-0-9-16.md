---
layout: post
title: "JSON serialization now even faster and prettier"
category: posts
description: "The jsonlite package implements a robust, high performance JSON parser and generator for R, optimized for statistical data and the web. This week version 0.9.16 appeared on CRAN which has a new prettifying system, improved performance and some additional tweaks for the new mongolite package."
cover: "containers.jpg"
thumb: "mariokart.jpg"
---

The [jsonlite](http://cran.rstudio.org/web/packages/jsonlite/index.html) package implements a robust, high performance JSON parser and generator for R, optimized for statistical data and the web. This week version 0.9.16 appeared on CRAN which has a new prettifying system, improved performance and some additional tweaks for the new mongolite package.

## Improved Performance

Everyones favorite feature of jsonlite: performance. We found a way to significanlty speed up `toJSON` for data frames for the cases of `dataframe="rows"` (the default) or `dataframe="values"`. On my macbook I now get these results:

{% highlight r %}
data(diamonds, package="ggplot2")
system.time(toJSON(diamonds, dataframe = "rows"))
#   user  system elapsed
#  0.133   0.003   0.136
system.time(toJSON(diamonds, dataframe = "columns"))
#   user  system elapsed
#  0.070   0.003   0.072
system.time(toJSON(diamonds, dataframe = "values"))
#   user  system elapsed
#  0.094   0.005   0.099
{% endhighlight %}

A somewhat larger dataset:

{% highlight r %}
data(flights, package="nycflights13")
system.time(toJSON(flights, dataframe = "rows"))
#   user  system elapsed
#  1.506   0.072   1.578
system.time(toJSON(flights, dataframe = "columns"))
#   user  system elapsed
#  0.585   0.024   0.608
system.time(toJSON(flights, dataframe = "values"))
#   user  system elapsed
#  0.873   0.039   0.912
{% endhighlight %}

That is pretty darn fast for a text based serialization format. By comparison, we easily beat `write.csv` which is actually a much more simple output format:

{% highlight r %}
system.time(write.csv(diamonds, file="/dev/null"))
#   user  system elapsed
#  0.361   0.003   0.364
system.time(write.csv(flights, file="/dev/null"))
#   user  system elapsed
#  3.284   0.033   3.318
{% endhighlight %}

## Pretty even prettier

Yihui has pushed for a new prettifying system that inserts indentation directly in the R code rather than making yajl prettify the entire JSON blob at the end. As a result we can use different indentation rules for different R classes. See the [PR](https://github.com/jeroenooms/jsonlite/pull/85) for details. The main differce is that atomic vectors are now prettified without linebreaks:

{% highlight r %}
x <- list(foo = 1:3, bar = head(cars, 2))
toJSON(x, pretty=TRUE)

{
  "foo": [1, 2, 3],
  "bar": [
    {
      "speed": 4,
      "dist": 2
    },
    {
      "speed": 4,
      "dist": 10
    }
  ]
}

toJSON(x, pretty=T, dataframe = "col")

{
  "foo": [1, 2, 3],
  "bar": {
    "speed": [4, 4],
    "dist": [2, 10]
  }
}
{% endhighlight %}

This can be helpful for manually inspecting or debugging your JSON data. The `prettify` function still uses yajl, so if you prefer this style, simply use `prettify(toJSON(x))`.


## New mongolite package

There were some additional internal enhancements to support the new [mongolite](http://cran.r-project.org/web/packages/mongolite) package, which will be announced later this month. This package will extend the concepts and power of jsonlite to the in-database JSON documents. Have a look at the [git](https://github.com/jeroenooms/mongolite#readme) repository for a sneak preview.
