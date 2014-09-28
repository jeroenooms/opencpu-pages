---
layout: post
title: "jsonlite 0.9.12: now even lighter and faster"
category: posts
description: "This week version 0.9.12 of jsonlite appeared on CRAN. This new version which includes a completely rewritten json parser, more optimized C code for json generation, and some cool new features."
cover: "containers.jpg"
thumb: "mariokart.jpg"
---

The [jsonlite](http://cran.rstudio.org/web/packages/jsonlite/index.html) package implements a robust, high performance JSON parser and generator for R, optimized for statistical data and the web. This week version 0.9.12 appeared on CRAN which includes a completely rewritten json parser and more optimized C code for json generation. The new parser is based on [yajl](http://lloyd.github.io/yajl/) which is smaller and faster than libjson, and much easier to compile.

### Error handling

My favorite feature of yajl is that it gives helpful error messages when parsing invalid JSON, for example:

```{r}
fromJSON('[1,2,falsse,4]')
# Error in parseJSON(txt) : lexical error: invalid string in json text.
#                               [1,2,falsse,4]
#                     (right here) ------^

fromJSON('["foo", "bla\nbla"]')
# Error in parseJSON(txt) : lexical error: invalid character inside string.
#                            ["foo", "bla bla"]
#                     (right here) ------^

fromJSON('[1,2,3,4] {}')
# Error in parseJSON(txt) : parse error: trailing garbage
#                             [1,2,3,4] {}
#                     (right here) ------^
```

This makes debugging much easier, especially when dealing with dynamic data that might not be easy reproduce.

### Unicode parsing

The yajl parser always correctly converts escaped unicode sequences into UTF-8 characters:

```{r}
fromJSON('["\\u5bff\u53f8","Z\\u00fcrich"]')
# [1] "寿司"   "Zürich"
````

Escaped unicode was already supported in the previous version of jsonlite, however it was expensive and not enabled by default. With yajl we get this for free :-)


### Integer parsing

Another cool feature is that yajl parses numbers into integers when possible:

```{r}
class(fromJSON('[13,14,15]'))
# [1] "integer"
```

### Performance

Performance of both parsing and generating JSON has again tremendously improved in this version. Some benchmarks:

```{r}
library(jsonlite)
library(microbenchmark)
data(diamonds, package="ggplot2")
json_rows <- toJSON(diamonds)
json_columns <- toJSON(diamonds, dataframe = "columns")
microbenchmark(
   toJSON(diamonds), #0.60
   toJSON(diamonds, dataframe = "columns"), #0.32
   fromJSON(json_rows), #1.15
   fromJSON(json_columns), # 0.41
   times=10
)
# Unit: milliseconds
#                                    expr      min       lq   median       uq       max neval
#                        toJSON(diamonds) 587.6984 591.3231 619.1590 630.3588  661.5118    10
# toJSON(diamonds, dataframe = "columns") 317.6793 325.3809 330.6444 339.9898  343.7466    10
#                     fromJSON(json_rows) 890.9832 899.3334 939.3230 979.6338 1059.9770    10
#                  fromJSON(json_columns) 188.5764 201.8463 238.1272 279.7607  293.1195    10
```

If we compare this to the [previous blog post](https://www.opencpu.org/posts/jsonlite-release-0-9-11/) we can see that generating JSON to row-based data frames (the default) is approx 2x faster than the previous version. Parsing row-based json is about 2.5x faster, and parsing column-based json is about 5x faster!

### Streaming JSON

Version 0.9.12 introduces some cool streaming functionality. This is a topic in itself and I will blog about this later in the week. Have a look at examples from the [`stream_in`](http://demo.ocpu.io/jsonlite/man/stream_in/html) and [`stream_out`](http://demo.ocpu.io/jsonlite/man/stream_in/html) manual pages till then.

