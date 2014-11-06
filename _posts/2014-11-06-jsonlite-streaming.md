---
layout: post
title: "High performance JSON streaming in R: Part 1"
category: posts
description: "The jsonlite stream_in and stream_out functions implement line-by-line processing of JSON data over a connection, such as a socket, url, file or pipe. This allows for processing unlimited amounts of data with limited memory. "
cover: "containers.jpg"
thumb: "rabbit1.jpg"
---

The jsonlite [stream_in](http://demo.ocpu.io/jsonlite/man/stream_in/html) and [stream_out](http://demo.ocpu.io/jsonlite/man/stream_in/html) functions implement line-by-line processing of JSON data over a connection, such as a socket, url, file or pipe. Thereby we can construct a data processing pipeline, in order to handle large (or unlimited) amounts of data with limited memory. This post will walk through some examples from the [help pages](http://demo.ocpu.io/jsonlite/man/stream_in/html).

## The json streaming format

Because parsing huge JSON strings is difficult and inefficient, JSON streaming is done using lines of minified JSON records. This is pretty standard: JSON databases such as [MongoDB](http://docs.mongodb.org/manual/reference/program/mongoexport/#cmdoption--query) use the same format to import/export large datasets. Note that this means that the total stream combined is not valid JSON itself; only the individual lines are.

{% highlight r %}
library(jsonlite)
x <- iris[1:3,]
stream_out(x, con = stdout())
# {"Sepal.Length":5.1,"Sepal.Width":3.5,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"}
# {"Sepal.Length":4.9,"Sepal.Width":3,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"}
# {"Sepal.Length":4.7,"Sepal.Width":3.2,"Petal.Length":1.3,"Petal.Width":0.2,"Species":"setosa"}
{% endhighlight %}

Also note that because line-breaks are used as separators, prettified JSON is not permitted: the JSON lines must be minified. In this respect, the format is a bit different from fromJSON and toJSON where all lines are part of a single JSON structure with optional line breaks.

## Streaming to/from a file

The `nycflights13` package contains a dataset with about 5 million values. To stream this to a file:

{% highlight r %}
library(nycflights13)
stream_out(flights, con = file("~/flights.json"))
{% endhighlight %}

Running this code will open the file connection, write json to the connection in batches of 500 rows, and afterwards close the connection. Status messages will be printed to the console while writing output. The entire process should take a few seconds and generate a json file of about 7MB.

We use the same file to illustrate how to stream the json back into R. The following code will stream-parse the json in batches of 500 lines. Afterward we verify that the output is indeed identical to the original one:

{% highlight r %}
flights2 <- stream_in(file("~/flights.json"))
all.equal(flights2, as.data.frame(flights))
# [1] TRUE
{% endhighlight %}

Because the data is read in small batches, this require much less memory than when we would try to parse a huge json blob all at once. The `pagesize` argument in `stream_in` and `stream_out` can be used to specify the number of rows that will be read/written per iteration.

## Streaming from a URL

We can use the standard `url` function in R to stream from a HTTP connection.

{% highlight r %}
diamonds2 <- stream_in(url("http://jeroenooms.github.io/data/diamonds.json"))
{% endhighlight %}

If the data source is gzipped, simply wrap the connection in `gzcon`.

{% highlight r %}
flights3 <- stream_in(gzcon(url("http://jeroenooms.github.io/data/nycflights13.json.gz")))
all.equal(flights3, as.data.frame(flights))
{% endhighlight %}

Because R currently does not support SSL, we use a `curl` pipe to stream over HTTPS:

{% highlight r %}
flights4 <- stream_in(gzcon(pipe("curl https://jeroenooms.github.io/data/nycflights13.json.gz")))
all.equal(flights4, as.data.frame(flights))
{% endhighlight %}

For this to work, the `curl` executable needs to be installed and available in the search path, which requires cygwin on Windows. Unfortunately the RCurl package does not seem to support binary streaming at this point.

## Next up

These examples illustrate basic line-by-line json streaming of data frames from/to a connection. Thereby we can deal with larger datasets than would be doable using just `fromJSON` or `toJSON`.

In the next blog post we will actually make the step to full JSON IO streaming by defining a custom `handler` function. Thereby we can construct a json data processing pipeline in R that can handle an infinite data stream. The impatient reader can have a look at the examples in the [stream_in](http://demo.ocpu.io/jsonlite/man/stream_in/html) help page.

