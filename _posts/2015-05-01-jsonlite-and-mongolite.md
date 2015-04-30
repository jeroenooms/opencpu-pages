---
layout: post
title: "Upcoming talks about jsonlite and mongolite"
category: posts
description: "This summer I will be giving an invited talk at the annual French R Meeting in Grenoble as well as a shorter talk at UseR 2015 in Aalborg. The presentations will feature some recent R packages in the json/web space (curl, jsonlite, mongolite, V8), and show how these tools can be combined for building interoperable data pipelines with R."
cover: "containers.jpg"
thumb: "useR-large.png"
---

This summer I will be giving an invited talk at the annual [French R Meeting](http://r2015-grenoble.sciencesconf.org/resource/page/id/1) in Grenoble as well as a shorter talk at [UseR 2015](http://user2015.math.aau.dk/) in Aalborg. The presentations will feature some recent R packages in the json/web space ([curl](http://cran.r-project.org/web/packages/curl/index.html), [jsonlite](http://cran.r-project.org/web/packages/jsonlite/index.html), [mongolite](http://cran.r-project.org/web/packages/mongolite/index.html), [V8](http://cran.r-project.org/web/packages/V8/index.html)), and show how these tools can be combined for building interoperable data pipelines with R. 

Below the official abstract.


## Abstract: jsonlite and mongolite

> The jsonlite package provides a powerful JSON parser and generator that has become one of standard methods for getting data in and out of R. We discuss some recent additions to the package, in particular support streaming (large) data over http(s) connections. We then introduce the new mongolite package: a high-performance MongoDB client based on jsonlite. MongoDB (from "humongous") is a popular open-source document database for storing and manipulating very big JSON structures. It includes a JSON query language and an embedded V8 engine for in-database aggregation and map-reduce. We show how mongolite makes inserting and retrieving R data to/from a database as easy as converting it to/from JSON, without the bureaucracy that comes with traditional databases. Users that are already familiar with the JSON format might find MongoDB a great companion to the R language and will enjoy the benefits of using a single format for both serialization and persistency of data.

