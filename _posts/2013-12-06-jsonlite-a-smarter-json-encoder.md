---
layout: post
title: "New package: jsonlite. A smart(er) JSON encoder/decoder."
category: posts
description: "The jsonlite package: A smart(er) JSON encoder/decoder"
cover: "containers.jpg"
---

This week we released a new package on CRAN: <a href="http://cran.r-project.org/web/packages/jsonlite/index.html">jsonlite</a>. This package is a fork of `RJSONIO` by Duncan Temple Lang and builds on the same parser, but uses a different mapping between R objects and JSON data. The [package vignette](http://cran.r-project.org/web/packages/jsonlite/vignettes/json-mapping.pdf) goes in great detail and has many examples on how JSON data are converted to R objects and vice versa. To try it:

{% highlight r %}
#install
install.packages("jsonlite", repos="http://cran.r-project.org")

#load
library(jsonlite)

#convert object to json
myjson <- toJSON(iris, pretty=TRUE)
cat(myjson)

#convert json back to object
iris2 <- fromJSON(myjson)
print(iris2)
{% endhighlight %}

## So what's new?

The `jsonlite` package implements functions `toJSON` and `fromJSON` similar to those in packages as `RJSONIO` and `rjson`, but options and output are quite different. The primary goal in the design of `jsonlite` is to recognize and comply with conventional ways of encoding data in JSON (outside the R community), in particular (relational) datasets. This increases interoperability when dealing with external data from within R, or when reading/writing R objects from an external client (e.g. through <a href="http://opencpu.org">OpenCPU</a>). For example, consider structures as returned by the Github API:

 - Simple dataset: <a href="https://api.github.com/users/hadley/orgs" target="_blank">https://api.github.com/users/hadley/orgs</a>
 - Nested dataset: <a href="https://api.github.com/users/hadley/repos" target="_blank">https://api.github.com/users/hadley/repos</a>

These JSON structures obviously represent data tables, or in R terminology: data frames. The first structure represents a single table; the second structure represents a relational structure with two tables: the `owner` property in the main table was generated from a foreign key that points to a record in a second table (owners). However, as we can see, these tables are structured **by row**, wereas R likes data frames **by column**. This is one example where `jsonlite` goes beyond other packages, and actually returns a data frame:

{% highlight r%}
library(jsonlite)
library(httr)

#get data
data1 <- fromJSON("https://api.github.com/users/hadley/orgs")

#it's a data frame
names(data1)
data1$login
{% endhighlight %}

The second example is a bit more complicated because of the relational structure. `jsonlite` tries to stay as close as possible to the original structure by returing a nested data frame:

{% highlight r %}
data2 <- fromJSON("https://api.github.com/users/hadley/repos")

#it's a data frame...
names(data2)
data2$name

#...with has a nested data frame
names(data2$owner)
data2$owner$login

#subsetting is easy
data2[1,]
data2[1,]$login

#these are equivalent :)
data2[1,]$owner
data2$owner[1,]
{% endhighlight %}

The [package vignette](http://cran.r-project.org/web/packages/jsonlite/vignettes/json-mapping.pdf) gives many more examples of how various structures map to R objects.

## On correctness and performance

The initial emphasis in jsonlite has been on correctness: rather than rushing towards performance, we want to explicity specify intended behavior covering all important structures. The complexity of this problem is easily understimated, which can result in unexpected behavior, ambiguous edge cases and differences between implementations. A set of conventions for a consistent and practical mapping are proposed in the [package vignette](http://cran.r-project.org/web/packages/jsonlite/vignettes/json-mapping.pdf). If you are using JSON with R, free to join the discussion.

<blockquote>
  <p>Premature optimization is the root of all evil.</p>
  <small>Donald Knuth</small>
</blockquote>

We hope that a clear specifiction will make it much easier to optimize performance or write alternate implementations. The [package vignette](http://cran.r-project.org/web/packages/jsonlite/vignettes/json-mapping.pdf) and package unit tests are intended to take away ambiguity on what exactly `toJSON` and `fromJSON` are supposed to do. From here we will start optimizing R code, port pieces to C++, or perhaps even write an entirely new implementation, without breaking software that depends on it. 

If you would like to contribute to `jsonlite`, you can <a href="https://github.com/jeroenooms/jsonlite/">submit patches or pull requests</a> on github, as long as they don't alter the behavior of the functions. At a minimum, they should pass the package unit tests... or you should modify the unit tests that are overly strict :-)

{% highlight r %}
library(testthat)
test_package("jsonlite")
{% endhighlight %}
