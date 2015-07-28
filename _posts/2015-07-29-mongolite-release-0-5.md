---
layout: post
title: "Mongolite 0.5: authentication and iterators"
category: posts
description: "Mongolite builds on jsonlite to provide a simple, high-performance MongoDB client for R, which makes storing small or large data in a database as easy as converting it to/from JSON. This version improves authentication for connecting with secured servers, and introduces iterators to give you more grained control over processing query data."
cover: "containers.jpg"
thumb: "nosql.jpg"
---

A new version of the [mongolite](http://cran.r-project.org/web/packages/mongolite/index.html) package has appeared on CRAN. Mongolite builds on [jsonlite](http://cran.r-project.org/web/packages/jsonlite/index.html) to provide a simple, high-performance MongoDB client for R, which makes storing small or large data in a database as easy as converting it to/from JSON. Have a look at the [vignette](http://cran.r-project.org/web/packages/mongolite/vignettes/intro.html) or [useR2015 slides](http://bit.ly/mongo-slides) to get started with inserting, json queries, aggregation and map-reduce. 

### Authentication and mongolabs

This release fixes an issue with the authentication mechanism that was reported by Dean Attali. The new version should properly authenticate to secured mongodb servers. 

Try running the code below to grab some flights data from my mongolabs server:

{% highlight bash %}
# load the package
library(mongolite)
stopifnot(packageVersion("mongolite") >= "0.5")

# Connect to the 'flights' dataset
flights <- mongo("flights", url = "mongodb://readonly:test@ds043942.mongolab.com:43942/jeroen_test")

# Count data for query
flights$count('{"day":1,"month":1}')

# Get data for query
jan1_flights <- flights$find('{"day":1,"month":1}')
{% endhighlight %}

While debugging this, I found that [mongolab](https://mongolab.com/) is actually very cool. You can sign up for a your own free (up to 500MB) mongodb server and easily create data collections with one or more read-only and/or read-write user accounts. This provides a pretty neat way to publish some data (read-only) or sync and collaborate with colleagues (read-write).

### Iterators

Another feature request from some early adopters was to add support for iterators. Usually you want to use the `mongo$find()` method which automatically converts data from a query into a dataframe. However sometimes you need finer control over the individual documents. 

The new version adds a `mongo$iterate()` method to manually iteratate over the individual records from a query without any automatic simplification. Using the same example query as above:

{% highlight bash %}
# Connect to the 'flights' dataset
flights <- mongo("flights", url = "mongodb://readonly:test@ds043942.mongolab.com:43942/jeroen_test")

# Create iterator
iter <- flights$iterate('{"day":1,"month":1}')

# Iterate over individual records
while(length(doc <- iter$one())){
	# do something with the row here
	print(doc)
}
{% endhighlight %}

Currently the iterator has 3 methods: `one()`, `batch(n = 1000)` and `page(n = 1000)`. The `iter$one` method will pop one document from iterator (it would be called `iter$next()` if that was not a reserved keyword in R). Both `iter$batch(n)` and `iter$page(n)` pop n documents at once. The difference is that `iter$batch` returns a list of at most length n whereas `iter$page` returns a data frame with at most n rows. 

Once the iterator is exhausted, its methods will only return `NULL`.

