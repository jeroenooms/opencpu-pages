---
layout: post
title: "Getting ready for OpenCPU 1.3"
category: posts
description: "OpenCPU is a system for embedded scientific computing and reproducible research. The OpenCPU HTTP API provides a middle layer interface to R. Either use the public servers or host your own."
cover: "containers.jpg"
---

The OpenCPU <a href="../../demo.html">public demo server</a> and <a href="https://demo.ocpu.io">ocpu.io</a> have been upgraded to an early version of the upcoming OpenCPU 1.3 release. This release is scheduled for April 17 along with Ubuntu 14.04 (Trusty). By deploying it on the public demo server we get some testing before the actual release. Please report any problems.

## New in OpenCPU 1.3

The improvements in this release are mostly internal. However there will be one subtle change: starting this version, all <a href="../../api.html">HTTP API</a> responses with status code <code>201</code>, <code>301</code> or <code>302</code> will use an <b>absolute url</b> in the <code>Location</code> response header. For example, the response headers of a request could contain:

	...
	Date: Mon, 17 Mar 2014 06:59:26 GMT
	Location: http://public.opencpu.org/ocpu/tmp/x0e28afb7/
	Content-Length: 44
	...

Whereas in previous versions, the same response would have looked like:

	...
	Date: Mon, 17 Mar 2014 06:59:26 GMT
	Location: /ocpu/tmp/x0e28afb7/
	Content-Length: 44
	...

However to scale up to distributed environments where resources can be hosted on various servers, we need to start using absolute URLs.

## How to update my client/app?

Most HTTP clients natively understand both absolute and relative urls, so you probably won't notice the difference. For example the <a href="../../jslib.html">opencpu.js</a> client library requires no changes or updates. However for the few of you that implemented a custom OpenCPU client, you might want to double check that your code understands both absolute and relative urls in the <code>Location</code> header, to make sure your application will be compatible with future versions of OpenCPU.