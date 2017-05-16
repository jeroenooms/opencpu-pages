---
layout: post
title: "Implementing a DPU with OpenCPU"
category: posts
description: "A 'Data Processing Unit' (DPU) is a modular, stateless data I/O unit called remotely by other software. In OpenCPU any R function automatically becomes a DPU."  
cover: "containers.jpg"
---

One of the prime use cases in the design of OpenCPU has been the "Data Processing Unit", for short: DPU.
A DPU is a modular, stateless data I/O unit which is called remotely by other software.
In the [OpenMHealth architecture](http://openmhealth.org/developers/key-architectual-abstractions/) 
a DPU must use JSON for data input and output, and is called over HTTPS. Below two simple examples.

## Basic example

Suppose your software needs to calculate a correlation between two vectors. In R we would use the `cor` function from the `stats`
package to do this:

{% highlight r %}
> cor(x=c(1,2,3,4,5), y=c(3,1,5,2,2));
[1] -0.1042572
{% endhighlight %}

Using OpenCPU we can perform the same function call remotely just as easily:

{% highlight bash %}
curl https://cloud.opencpu.org/ocpu/library/stats/R/cor/json -d 'x=[1,2,3,4,5]&y=[3,1,5,2,2]'
[
	-0.10426
]
{% endhighlight %}

We can go full JSON by specifying the request `Content-type` to be `application/json`. This is exactly the same request and will yield the same output.

{% highlight bash %}
curl https://cloud.opencpu.org/ocpu/library/stats/R/cor/json -H "Content-Type: application/json" -d '{"x":[1,2,3,4,5],"y":[3,1,5,2,2]}'
{% endhighlight %}

Note that `curl` is used here for illustration only, your actual application could use whatever HTTP client library is available for the programming language at hand.


## Another example

One real application for OpenMHealth required calculation of the total distance between a set of longitude-latitude coordinates as recorded by a mobile device.
Wikipedia tells us that the distance between two points on a sphere is calculated from their longitudes and latitudes using [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula).
The geosphere package has a function `distHaversine` [(help)](https://cloud.opencpu.org/ocpu/library/geosphere/man/distHaversine/text), [(source)](https://cloud.opencpu.org/ocpu/library/geosphere/R/distHaversine/print) which implements this equation.

So we created [dpu.mobility](https://github.com/openmhealth/dpu.mobility/) package with a function `geodistance` [(help)](https://cloud.opencpu.org/ocpu/library/dpu.mobility/man/geodistance/text), [(source)](https://cloud.opencpu.org/ocpu/library/dpu.mobility/R/geodistance/print) that iterates 
over a set of the locations to calculate the total distance among all points. We also added an option to smooth away outliers (caused by noisy GPS signal). 
Now to calculate the distance from LA to NYC and back:

{% highlight bash %}
curl https://cloud.opencpu.org/ocpu/library/dpu.mobility/R/geodistance/json -H "Content-Type: application/json" -d '{"long":[-74.0064,-118.2430,-74.0064],"lat":[40.7142,34.0522,40.7142]}'
{% endhighlight %}

Or in miles:
{% highlight bash %}
curl https://cloud.opencpu.org/ocpu/library/dpu.mobility/R/geodistance/json -H "Content-Type: application/json" -d '{"long":[-74.0064,-118.2430,-74.0064],"lat":[40.7142,34.0522,40.7142],"unit":"miles"}'
{% endhighlight %}

## When to use a DPU

So how is this useful? Suppose you are building a system or application and would like to embed some statistical functionality. 
One solution is implement the required statistical methods yourself in the language at hand. 
However for complex methods this is time consuming and your code might not be as reliable as what is available in R. 
Another solution is to call R directly from the application language, using a bridge like RInside or JRI, rpy2, etc. 
This might work, but managing R sessions, error handling, security, data I/O, etc can be painful. And if the R session crashes, so does your application.
Furthermore this means that each installation of the application must have a local copy of R and all required packages installed, which quickly becomes a maintenance nightmare.

If what you are doing fits the DPU paradigm, this might make a more elegant design.
Most programming languages these days know their way around http(s) and JSON.
Implement your statistical methods simply as an R function and have OpenCPU deal with management of sessions, security, JSON, etc.
A single OpenCPU cloud server serves all your application instances/users, which is cheap and easier to maintain.
The cloud server might considerably improve performance by caching requests and if your application becomes popular and you need to scale up to serve many simultaneous request per second, you just install a http load balancer with multiple back-end servers. No need to change any code :-)


  





