---
layout: post
title: "Release of jsonlite 0.9.4"
category: posts
description: "The jsonlite package is a fork of RJSONIO. It uses a more recent version of the libjson c++ parser and implements a smarter mapping between R objects and JSON strings."
cover: "containers.jpg"
---

A new version of the <a href="http://cran.r-project.org/web/packages/jsonlite">jsonlite package</a> was released to CRAN. In addition to adding small new features, this release cleans up code and documentation. Some annoying compiler warnings inherited from <code>RJSONIO</code> are fixed and the <a href="http://cran.r-project.org/web/packages/jsonlite/jsonlite.pdf">reference manual</a> is a bit more concise. Also some new examples of public JSON APIs were added to the <a href="http://cran.r-project.org/web/packages/jsonlite/vignettes/json-mapping.pdf">package vignette</a>. These are great to see the power of <code>jsonlite</code> in action when working with real world JSON structures. 

## What is jsonlite again?

The <code>jsonlite</code> package is a fork of <code>RJSONIO</code>. It builds on the same libjson c++ parser (although a more recent version), but implements a different system for converting between R objects and JSON structures. The most powerful feature is the option to automatically convert tabular JSON structures into R data frames and vice versa. Tabular structures are very common in <code>JSON</code> data, but usually difficult to read and manipulate. By automatically turning these into data frames <code>jsonlite</code> can save you many hours and bugs in getting your <code>JSON</code> data in and out of R. This <a href="../jsonlite-a-smarter-json-encoder/">blog post</a> has some nice examples with data from the Github API.

## New in this release

Two new functions were introduced in this release. The <code>minify</code> function is the opposite of <code>prettify</code>, and  reduces the size of a <code>JSON</code> blob by removing all redundant whitespace. 

The new <code>unbox</code> function was requested several users. It can be used to force atomic vectors of length 1 to be encoded as a <code>JSON</code> <b>scalar</b> rather than an <b>array</b>. To understand why this should not be default behavior, see the <a href="http://cran.r-project.org/web/packages/jsonlite/vignettes/json-mapping.pdf">vignette</a> or this <a href="https://github.com/jeroenooms/jsonlite/issues/6">github issue</a>. However it can be useful to do this for individual object elements:

{% highlight r %}
> cat(toJSON(list(foo=123)))
{ "foo" : [ 123 ] }
> cat(toJSON(list(foo=unbox(123))))
{ "foo" : 123 }
{% endhighlight %}

In the context of a script or function, the <code>unbox</code> function should only be used for elements that are always exactly length 1, otherwise <code>unbox</code> will throw an error. This is to protect you from writing code that generates inconsistent <code>JSON</code> i.e. an array one time and a scalar another time. 

The same <code>unbox</code> function can be used for data frames with exactly 1 row:

{% highlight r %}
> mycar <- cars[23,]
> cat(toJSON(mycar))
[ { "speed" : 14, "dist" : 80 } ]
> cat(toJSON(unbox(mycar)))
{ "speed" : 14, "dist" : 80 }
{% endhighlight %}

But again this should be used sparsely and with care. When in doubt, always stick with the default <code>toJSON</code> encodings.

