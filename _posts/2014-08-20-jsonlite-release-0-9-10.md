---
layout: post
title: "CRAN release jsonlite 0.9.10 (RC)"
category: posts
description: "The jsonlite package is a JSON parser/generator optimized for the web."
cover: "containers.jpg"
---

The [jsonlite](http://cran.r-project.org/web/packages/jsonlite/) package is a JSON parser/generator optimized for the web. It implements a bidirectional mapping between JSON data and the most important R data types. This is very powerful for interacting with web APIs, or to build pipelines where data seamlessly flows in and out of R through JSON without any manual serializing, parsing or data munging.

The jsonlite package is one of the pillars of the [OpenCPU](https://www.opencpu.org/) system, which provides an interoperable API to interact with R over HTTP+JSON. However since its release, jsonlite has been adopted by many other projects as well, mostly to grab JSON data from REST APIs in R.

## New in this version

Version 0.9.10 includes two new vignettes to get you up and running with JSON and R in a few minutes.

 - [Getting started: Parsing JSON with jsonlite](http://cran.r-project.org/web/packages/jsonlite/vignettes/json-aaquickstart.html)
 - [Fetching JSON data from REST APIs](http://cran.r-project.org/web/packages/jsonlite/vignettes/json-apis.html)

These vignettes show how to get started analyzing data from Twitter, NY Times, Github, NYC CitiBike, ProPublica, Sunlight Foundation and much more, with 2 or 3 lines of R code.

There are also a few [other improvements](http://cran.r-project.org/web/packages/jsonlite/NEWS), most notably support parsing of escaped JSON unicode sequences, which could be important if you are from a country with a non-latin alphabet.

## Release candidate

This is the 10th CRAN version of jsonlite, and we are getting very close to a 1.0 release. By now the package does what it should do, has been tested by many users and all outstanding issues have been addressed. The mapping between JSON data and R classes is described in detail in the [jsonlite paper](http://arxiv.org/abs/1403.2805), and unit tests are available to validate that implementations behave as prescribed for all data and edge cases. Once the version bumps to 1.0, we plan to switch gears and start focussing more on optimizing performance.
