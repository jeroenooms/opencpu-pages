---
layout: post
title: "Better memory usage and RJSONIO compatibility in jsonlite 0.9.15"
category: posts
description: "The jsonlite package implements a robust, high performance JSON parser and generator for R, optimized for statistical data and the web. Last week version 0.9.15 appeared on CRAN which improves memory usage and compatibility with other packages."
cover: "containers.jpg"
thumb: "mariokart.jpg"
---

The [jsonlite](http://cran.rstudio.org/web/packages/jsonlite/index.html) package implements a robust, high performance JSON parser and generator for R, optimized for statistical data and the web. Last week version 0.9.15 appeared on CRAN which improves memory usage and compatibility with other packages.

## Migrating to jsonlite

The upcoming release of [shiny](https://github.com/rstudio/shiny) will switch from RJSONIO to jsonlite. To make the transition painless for shiny users, Winston Chang has added some compatibility options to jsonlite that mimic the (legacy) behavior of RJSONIO. The following wrapper results in the same output as `RJSONIO::toJSON` for the majority of cases. Hopefully this will make it easier for other package authors to make the transition to jsonlite as well.

{% highlight r %}
# RJSONIO compatibility wrapper
toJSON_legacy <- function(x, ...) {
  jsonlite::toJSON(I(x), dataframe = "columns", null = "null", na = "null",
   auto_unbox = TRUE, use_signif = TRUE, force = TRUE,
   rownames = FALSE, keep_vec_names = TRUE, ...)
}
{% endhighlight %}

However be aware that the RJSONIO defaults can sometimes result in unexpected behavior and odd edge cases (which is why jsonlite was created in the first place). Therefore it is still highly recommend to switch to the jsonlite defaults when possible (see jsonlite [paper](http://arxiv.org/abs/1403.2805). One exception is perhaps the `auto_unbox` argument, which many people seem to prefer to `TRUE` for encoding relatively simple static data structures. 

## Memory usage

The new version should use less memory when parsing JSON, especially from a file or URL. This is mostly due to a new push-parser implementation that can incrementally parse JSON in little pieces, which eliminates memory overhead of copying around gigantic JSON strings. In addition, jsonlite now uses the new [curl](http://cran.r-project.org/web/packages/curl/index.html) package for retrieving data via a connection interface. 

{% highlight r %}
mydata1 <- jsonlite::fromJSON("https://jeroenooms.github.io/data/dmd.json")
{% endhighlight %}

The call above is results in the same output as the call below, but it should consume less memory, especially for very large json files.

{% highlight r %}
library(httr)
req <- GET("https://jeroenooms.github.io/data/dmd.json")
mydata2 <- jsonlite::fromJSON(content(req, "text"))
{% endhighlight %}

None of this changes anything in the API, these changes are all internal.