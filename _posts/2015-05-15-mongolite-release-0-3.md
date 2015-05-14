---
layout: post
title: "Getting started with MongoDB in R"
category: posts
description: "The first stable version of the new mongolite package has appeared on CRAN. Mongolite builds on jsonlite to provide a simple, high-performance MongoDB client for R, which makes storing and accessing small or large data as easy as converting it to/from JSON."
cover: "containers.jpg"
thumb: "nosql.jpg"
---

The first stable version of the new [mongolite](http://cran.r-project.org/web/packages/mongolite/index.html) package has appeared on CRAN. Mongolite builds on [jsonlite](http://cran.r-project.org/web/packages/jsonlite/index.html) to provide a simple, high-performance MongoDB client for R, which makes storing and accessing small or large data as easy as converting it to/from JSON. The [package vignette](http://cran.r-project.org/web/packages/mongolite/vignettes/intro.html) has some examples to get you started with inserting, json queries, aggregation and map-reduce. MongoDB itself is open source and installation is easy (e.g. `brew install mongodb`).

If you use, or (think) you might want to use MongoDB with R, please [get in touch](https://github.com/jeroenooms/mongolite/issues/5). I am interested to hear your about your problems and use cases to make this package fit everyones needs. I will also be [presenting](https://www.opencpu.org/posts/jsonlite-and-mongolite/) this and related work at UseR 2015 and the annual French R Meeting.
