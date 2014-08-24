---
layout: post
title: "New in OpenCPU 1.4.4: session namespaces"
category: posts
description: "New in OpenCPU release 1.4.4"
cover: "containers.jpg"
---

The OpenCPU system exposes an [HTTP API](https://www.opencpu.org/api.html) for embedded scientific computing with R. This provides reliable and scalable foundations for integrating R based analysis and visualization modules into pipelines, web applications or big data infrastructures.

This week version 1.4.4 was released on [Launchpad](https://launchpad.net/~opencpu/+archive/ubuntu/opencpu-1.4) (Ubuntu), and [OBS](http://software.opensuse.org/download.html?project=home%3Ajeroenooms%3Aopencpu-1.4&package=opencpu) (Fedora, SUSE) and [CRAN](http://cran.r-project.org/web/packages/opencpu/).

## New: session namespaces

A new feature in this version is support for `session namespaces. Clients can now refer to objects within a temporary session using `sessionid::name`. This makes it easier to reuse objects that were created from a script. For example let's execute the [ch01.R](https://public.opencpu.org/ocpu/library/MASS/scripts/ch01.R) script which is included with the [MASS](https://public.opencpu.org/ocpu/library/MASS/scripts) package:

	>> curl https://public.opencpu.org/ocpu/library/MASS/scripts/ch01.R -X POST
	/ocpu/tmp/x05af9fe89a/R/dd
	/ocpu/tmp/x05af9fe89a/R/m
	/ocpu/tmp/x05af9fe89a/R/std.dev
	/ocpu/tmp/x05af9fe89a/R/t.stat
	/ocpu/tmp/x05af9fe89a/R/t.test.p
	/ocpu/tmp/x05af9fe89a/R/v
	/ocpu/tmp/x05af9fe89a/R/z
	/ocpu/tmp/x05af9fe89a/stdout
	/ocpu/tmp/x05af9fe89a/source
	/ocpu/tmp/x05af9fe89a/console
	/ocpu/tmp/x05af9fe89a/info
	/ocpu/tmp/x05af9fe89a/files/ch01.pdf

The `x05af9fe89a` is the temporary session ID, which will be different for every execution. From the output we can see that this script stored 7 objects in the session namespace. For example to retrieve the `z` object in `json` format:

    https://public.opencpu.org/ocpu/tmp/x05af9fe89a/R/z/json?pretty=FALSE

But what if we want to reuse `z` the object in a subsequent function call? We can now do this using the sesssion namespace. For example, to calculate `stats::sd(x = z)`, we need to refer to `x05af9fe89a::z` as shown below:

	curl https://public.opencpu.org/ocpu/library/stats/R/sd/json -d x=x05af9fe89a::z
	[
		1.9368
	]

This way, we can chain script executions and function calls by passing output objects as arguments to subsequent requests.

## Function calls

For remote function calls, you can still use the session id alone to refer to the return object of the function call. For example to calculate `stats::rnorm(n = 5)` we do:

	>> curl https://public.opencpu.org/ocpu/library/stats/R/rnorm -d n=5
	/ocpu/tmp/x009f9e7630/R/.val
	/ocpu/tmp/x009f9e7630/stdout
	/ocpu/tmp/x009f9e7630/source
	/ocpu/tmp/x009f9e7630/console
	/ocpu/tmp/x009f9e7630/info

To calculate the standard deviation of our newly created object, the client can either use `x009f9e7630::.val` or simply `x009f9e7630`:

    curl https://public.opencpu.org/ocpu/library/stats/R/sd -d x=x009f9e7630
    curl https://public.opencpu.org/ocpu/library/stats/R/sd -d x=x009f9e7630::.val

The above two requests are equivalent.

