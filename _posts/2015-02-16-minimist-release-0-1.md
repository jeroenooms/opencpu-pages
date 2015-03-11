---
layout: post
title: "Minimist: an example of writing native JavaScript bindings in R"
category: posts
description: "The new minimist package exemplifies how to write an R package with bindings to a JavaScript library using V8."
cover: "containers.jpg"
thumb: "substack.jpg"
---

A new package has appeared on CRAN called [minimist](http://cran.r-project.org/web/packages/minimist/), which implements an interface to the popular [JavaScript library](https://www.npmjs.com/package/minimist). This package has only one function, used for argument parsing. For example in RGui on OSX, the output of `commandArgs()` looks like this:

{% highlight r %}
> commandArgs()
[1] "R" "--no-save" "--no-restore-data" "--gui=aqua" 
{% endhighlight %}

Minimist turns that into this:

{% highlight r %}
> library(minimist)
> minimist(commandArgs())
$`_`
[1] "R"

$save
[1] FALSE

$`restore-data`
[1] FALSE

$gui
[1] "aqua"
{% endhighlight %}

Note how it interprets the `--no-` prefix as `FALSE` and the `--foo=bar` as a key-value pair. It has some more of these rules, following the usual scripting argument syntax conventions. Cool, but not exactly ground breaking; there are already half a dozen packages on CRAN for parsing arguments (although this one is particularly nice :P). 

## Writing JavaScript bindings using V8

The main purpose of this new package is to exemplify how to write a package with bindings to a JavaScript library using V8. If you take a look at the [package source](https://github.com/cran/minimist), you might be surprised how small it is. The package consists of:

 - A copy of the [minimist.js](https://www.npmjs.com/package/minimist) library in the package [`inst`](https://github.com/cran/minimist/tree/master/inst/js) dir
 - Two [lines of standard code](https://github.com/cran/minimist/blob/0.1/R/onLoad.R) to initiate the V8 engine and read minimist when loading the R package
 - A one-line [wrapper function](https://github.com/cran/minimist/blob/0.1/R/minimist.R) to call the JavaScript function from R

That's it. To install this package from source **no compiler is required**. It will build out of the box, even on machines without Rtools or Xcode. Moreover, there are **no external dependencies** as is the case for e.g. Java code, where we need to install a JVM. Everything is self contained within R and V8. It's fast too:

{% highlight r %}
> system.time(minimist(commandArgs()))
   user  system elapsed 
  0.001   0.000   0.001
{% endhighlight %}

I'm working on several other packages to implement bindings to cool JavaScript libraries (see also [yesterdays post](https://www.opencpu.org/posts/v8-release-0-5/)). If you have some suggestions for other JavaScript libraries that might be useful in R, [get in touch](http://twitter.com/home?status=%23rstats%20%40opencpu%20). 