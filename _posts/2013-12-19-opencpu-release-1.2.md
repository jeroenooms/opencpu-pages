---
layout: post
title: "OpenCPU 1.2: Flexible and reliable R function RPC over HTTPS + JSON"
category: posts
description: "Earlier this week, OpenCPU 1.2 was released. This release uses the new jsonlite package for JSON conversion, which puts in place the final fundamental piece of the OpenCPU framework. This post describes what has changed, why this is important, and how to upgrade."
cover: "containers.jpg"
---

Earlier this week, OpenCPU 1.2 was released. This release uses the new <a href="../jsonlite-a-smarter-json-encoder/">jsonlite</a> package for JSON conversion, which puts in place the final fundamental piece of the OpenCPU framework. This post describes what has changed, why this is important, and how to upgrade. 

From here, no major changes in the OpenCPU API are planned for quite a while, so that we can shift focus towards optimizing performance, implementing client-libraries and developing applications.

## HTTPS, JSON and OpenCPU

Let's first explain why this piece is important. The OpenCPU API defines a mapping between HTTP request and R function calls. This is easy for simple input and output, such as numbers or vectors:

{% highlight bash %}
curl https://cloud.opencpu.org/ocpu/library/stats/R/rnorm/json -d 'n=10&mean=5'
{% endhighlight %}

But what if the R function has a return value or arguments which require more advanced objects, such as a matrix or data frame? This is where <code>jsonlite</code> comes in. The <a href="http://cran.r-project.org/web/packages/jsonlite/vignettes/json-mapping.pdf">jsonlite vignette</a> defines <i><b>a practical and consistent mapping between JSON data and R Objects</i></b>. This allows OpenCPU to automatically convert incoming JSON arguments into R objects using <code>jsonlite::fromJSON</code>, and convert output values back into JSON using <code>jsonlite::toJSON</code>. Thereby the cycle is complete, and we can call advanced R functions over http(s)+json without requiring clients to have any understanding of R.

## An example: melting data frames

Examples with curl get a bit verbose with a large payload, but to get an idea, let's melt some data using the <code>melt</code> function in the <code>reshape2</code> package. This function has an argument <tt>data</tt> (data frame) and an argument <tt>id</tt> (character vector). It returns another data frame. In this example, we pass it the first three rows of the AirQuaility dataset, very similar to the example in the <a href="https://cloud.opencpu.org/ocpu/library/reshape2/man/melt.data.frame/text">melt manual page</a>. The API docs explain that the JSON objects can either be posted as HTTP parameters in a standard HTTP POST formats (i.e. multipart or x-www-form-urlencoded):

{% highlight bash %}
curl https://cloud.opencpu.org/ocpu/library/reshape2/R/melt/json \
-d 'data=[{"Ozone":41, "Solar.R":190, "Wind":7.4, "Temp":67, "Month":5, "Day":1}, 
{"Ozone":36, "Solar.R":118, "Wind":8, "Temp": 72, "Month":5, "Day":2}, 
{"Ozone":12, "Solar.R":149, "Wind":12.6, "Temp": 74, "Month":5, "Day":3}]&id=["Month", "Day"]'
{% endhighlight %}

Alternatively, we can do pure JSON RPC by setting the <code>Content-Type: application/json</code> header:

{% highlight bash %}
curl https://cloud.opencpu.org/ocpu/library/reshape2/R/melt/json \
-H 'Content-Type: application/json' \
-d '{
  "data": [
    {"Ozone":41, "Solar.R":190, "Wind":7.4, "Temp":67, "Month":5, "Day":1}, 
    {"Ozone":36, "Solar.R":118, "Wind":8, "Temp": 72, "Month":5, "Day":2}, 
    {"Ozone":12, "Solar.R":149, "Wind":12.6, "Temp": 74, "Month":5, "Day":3}
  ], 
  "id" :["Month", "Day"]
 }'
{% endhighlight %}

Note that if you use Windows, the <code>curl</code> examples might need to be modified to properly escape the quotes in the windows terminal. This is just a limitation of using the windows command line; it won't be a problem for actual clients (e.g. a browser). If you don't like curl, the same request can be performed using the <a href="https://cloud.opencpu.org/ocpu/test">ocpu test page</a>.

The above RPC request is equivalent to the R code below. You can use this code as a template to see how your R functions would behave when called remotely over OpenCPU.

{% highlight r%}
# Load required packages
library(jsonlite)
library(reshape2)

# Input arguments in JSON format
input <- '{
  "data": [
    {"Ozone":41, "Solar.R":190, "Wind":7.4, "Temp":67, "Month":5, "Day":1}, 
    {"Ozone":36, "Solar.R":118, "Wind":8, "Temp": 72, "Month":5, "Day":2}, 
    {"Ozone":12, "Solar.R":149, "Wind":12.6, "Temp": 74, "Month":5, "Day":3}
  ], 
  "id" :["Month", "Day"]
 }'

# The actual function call
args <- fromJSON(input)
result <- do.call(reshape2::melt, args)

# This is what you get back from OpenCPU
output <- toJSON(result, pretty=TRUE)
cat(output)
{% endhighlight %}


## Upgrading to OpenCPU 1.2

It is recommended to update your servers  and applications to version 1.2 rather sooner than later. The 1.0 branch will keep working, but it won't get any new fixes or updates. We plan to stay on the 1.2 branch for quite a while.

The introduction of <code>jsonlite</code> does not affect the HTTP API itself, but existing applications that rely heavily on JSON to get data in and out of R might need some modification. For this reason we decided to bump the version to the <tt>1.2</tt> series. If you have existing OpenCPU clients/applications that use JSON, have a look at the <a href="../jsonlite-a-smarter-json-encoder/">post about jsonlite</a> to get a better understanding of how JSON data map to R objects and vice versa. Installing or upgrading the OpenCPU single-user development server is business as usual:

{% highlight r %}
update.packages(ask = FALSE)
install.packages("opencpu")
{% endhighlight %}

Servers running the OpenCPU 1.0 cloud server will not automatically receive the update to 1.2, to prevent existing applications from breaking. In order to update a previous installation of the OpenCPU cloud server, you need to add the new repository first:

{% highlight bash %}
sudo add-apt-repository ppa:opencpu/opencpu-1.2
sudo apt-get update
sudo apt-get upgrade
{% endhighlight %}

To see if the update was successful, navigate to <a href="https://cloud.opencpu.org/ocpu/library/opencpu/">/ocpu/library/opencpu</a> on your server to check the currently installed version of the opencpu package. 
