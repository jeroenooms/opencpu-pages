---
layout: post
title: "jsonlite gets a triple mushroom boost!"
category: posts
description: "The jsonlite package is a JSON parser/generator optimized for the web. It implements a bidirectional mapping between JSON data and the most important R data types, which allows for converting objects to JSON and back without the need for any manual data restructuring."
cover: "containers.jpg"
---

The [jsonlite](http://cran.r-project.org/web/packages/jsonlite/) package is a JSON parser/generator optimized for the web. It implements a bidirectional mapping between JSON data and the most important R data types, which allows for converting objects to JSON and back without manual data restructuring. This is ideal for interacting with web APIs, or to build pipelines where data seamlessly flow in and out of R through JSON. The [quickstart vignette](http://cran.r-project.org/web/packages/jsonlite/vignettes/json-aaquickstart.html) gives a brief introduction, or just try:

{% highlight r %}
fromJSON(toJSON(mtcars))
{% endhighlight %}

Or use some data from the web:

{% highlight r %}
# Latest commits in r-base
r_source <- fromJSON("https://api.github.com/repos/wch/r-source/commits")

# Pretty print:
committer <- format(r_source$commit$author$name)
date <- as.Date(r_source$commit$committer$date)
message <- sub("\n\n.*","", r_source$commit$message)
paste(date, committer, message)
{% endhighlight %}

## New in 0.9.11: performance!

Version 0.9.11 has a few minor bugfixes, but most of the work of this release has gone into improving performance. The implementation of `toJSON` has been optimized in many ways, and with a little [help](http://stackoverflow.com/questions/25609174/fast-escaping-deparsing-of-character-vectors-in-r) from Winston Chang, the most CPU intensive bottleneck has been ported to C code. The result is quite impressive: encoding dataframes to row-based JSON format is about 3x faster, and encoding dataframes to column-based JSON format is nearly 10x faster in comparision with the previous release.

The [diamonds](https://demo.ocpu.io/ggplot2/data/diamonds) dataset from the ggplot2 package has about 0.5 million values which makes a nice benchmark. On my macbook it takes jsonlite on average 1.18s to encode it to row-based JSON, and 0.34s for column-based json:

{% highlight r %}
library(jsonlite)
library(microbenchmark)
data("diamonds", package="ggplot2")
microbenchmark(json_rows <- toJSON(diamonds), times=10)
# Unit: seconds
#              expr     min       lq   median       uq     max neval
#  toJSON(diamonds) 1.12773 1.140724 1.175872 1.180354 1.21786    10

microbenchmark(json_columns <- toJSON(diamonds, dataframe="col"), times=10)
# Unit: milliseconds
#                                 expr      min      lq   median       uq      # max neval
#  toJSON(diamonds, dataframe = "col") 333.9494 334.799 338.0843 340.0929 350.3026    10
{% endhighlight %}

## Parsing and simplification performance

The performance of `fromJSON` has been improved as well. The parser itself was already a high performance c++ library that was borrowed from RJSONIO, which has not changed. However the simplification code used to reduce deeply nested lists into nice vectors and data frames has been tweaked in many places and is on average 3 to 5 times faster than before (depending on what the JSON data look like). For the diamonds example, the row-based data gets parsed in about 2.32s and column based data in 1.25s.

{% highlight r %}
microbenchmark(fromJSON(json_rows), times=10)
# Unit: seconds
#                 expr      min       lq   median       uq      max neval
#  fromJSON(json_rows) 2.178211 2.278337 2.319519 2.376085 2.423627    10

microbenchmark(fromJSON(json_columns), times=10)
# Unit: seconds
#                    expr     min       lq   median       uq      max neval
#  fromJSON(json_columns) 1.17289 1.252284 1.253999 1.265763 1.306357    10
{% endhighlight %}

For comparison, we can also disable simplification in which case parsing takes respectively 0.70 and 0.39 seconds for these data. However without simplification we end up with a big nested list of lists which is often not very useful.

{% highlight r %}
microbenchmark(fromJSON(json_rows, simplifyVector=F), times=10)
# Unit: milliseconds
#                                     expr      min       lq   median       uq      max neval
#  fromJSON(json_rows, simplifyVector = F) 635.5767 648.4693 704.6996 720.0335 727.8869    10

microbenchmark(fromJSON(json_columns, simplifyVector=F), times=10)
# Unit: milliseconds
#                                        expr      min       lq   median       uq      max neval
#  fromJSON(json_columns, simplifyVector = F) 385.3224 388.4772 395.1916 409.3432 463.9695    10
{% endhighlight %}