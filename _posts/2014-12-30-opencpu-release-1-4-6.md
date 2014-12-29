---
layout: post
title: "OpenCPU release 1.4.6: gzip and systemd"
category: posts
description: "This release enables gzip compression in the default apache2 configuration for ocpu, which was suggested by several smart users. When gzipped, json payloads are often comparable to binary formats, giving you the best of both worlds."
cover: "containers.jpg"
thumb: "systemd.jpg"
---

OpenCPU server version 1.4.6 has been released to [launchpad](https://launchpad.net/~opencpu/+archive/ubuntu/opencpu-1.4), [OBS](https://build.opensuse.org/package/show/home:jeroenooms:opencpu-1.4/opencpu), and [dockerhub](https://registry.hub.docker.com/repos/opencpu/) (more about docker in a future blog post). I also updated the instructions to [install](https://www.opencpu.org/download.html) the server or build from source for [rpm](https://github.com/jeroenooms/opencpu-server/tree/master/rpm#readme) or [deb](https://github.com/jeroenooms/opencpu-server/tree/master/debian#readme). If you have a running deployment, you should be able to upgrade with `apt-get upgrade` or `yum update` respectively.

## Compression

This release enables gzip compression in the default apache2 configuration for ocpu, which was suggested by several smart users. As was explained in an earlier [post](https://www.opencpu.org/posts/curl-release-0-2/) about the curl package:

> Support for compression can make a huge difference when streaming large data. Text based formats such as json are popular because they are human readable, but the main downside of plain-text is inefficiency for storing numbers. However when gzipped, json payloads are often [comparable to binary formats](https://news.ycombinator.com/item?id=2571729), giving you the best of both worlds.

The nice thing about http is that compression is handled entirely on the level of the protocol so it works for all content types and you don't have to do anything to take advantage of it. Client and server will automatically negotiate a method of compression that they both support via the `Accept-Encoding` header.

Try playing around with the ocpu [test page](http://public.opencpu.org/ocpu/test/) by looking at the `Content-Encoding` response header, or just use curl with the `--compress` flag (use `-v` to see headers)

```bash
curl https://demo.ocpu.io/MASS/data/Boston/json -v > /dev/null
curl https://demo.ocpu.io/MASS/data/Boston/json --compress -v > /dev/null
```

As usual, I also updated the library of R packages included with the server, including the latest [jsonlite 0.9.14](https://www.opencpu.org/posts/jsonlite-release-0-9-14/) which allows for controlling  prettify indentation:

  - [`http://demo.ocpu.io/MASS/data/cats/json`](http://demo.ocpu.io/MASS/data/cats/json)
  - [`http://demo.ocpu.io/MASS/data/cats/json?pretty=2`](http://demo.ocpu.io/MASS/data/cats/json?pretty=2)
  - [`http://demo.ocpu.io/MASS/data/cats/json?pretty=false`](http://demo.ocpu.io/MASS/data/cats/json?pretty=false)

## Support for systemd and docker

Apart from enabling compression and updating the R package library, this release has some internal changes to support systemd on Debian 8 (Jessie), on which the r-base docker images are based.

The introduction of systemd has been quite [controversial](http://linux.slashdot.org/story/14/11/19/043259/debian-votes-against-mandating-non-systemd-compatibility) in the Debian community, to say the least, which is perhaps why things are not working as smoothly yet as in Fedora. My current init scripts definitely did not work out of the box with systemd (as advertised) and getting them fixed was quite painful.

However I did figure everything out eventually, and learned a lot about systemd while debugging it. I can see it being a very powerful system, definitely a big improvement over the old style init scripts. The way services are specified has a lot in common with how docker does it, which I'm sure is not a conicidence. I look forward to taking full advantage of it once it has landed in all major distributions.

I really hope the Debian folks will resolve their differences sooner rather than later though, because the current state of Jessie is not very good. Even popular packges such as nginx are currently broken due to the chaos and uncertainty surrounding the transition to systemd, which is not helping anyone. On the other hand, I do admire the Debian tradition of transparent and democratic decision making (even when messy) which is something the R community seems to be missing sometimes...

