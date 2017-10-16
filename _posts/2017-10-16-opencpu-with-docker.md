---
layout: post
title: "Why Use Docker with R? A DevOps Perspective"
category: posts
description: "There have been several blog posts going around about why one would use Docker with R. In this post I'll try to add a DevOps point of view and explain how containerizing R is used in the context of the OpenCPU system."
cover: "containers.jpg"
thumb: "stockplot.png"
---

There have been several blog posts going around about why one would use Docker with R.
In this post I'll try to add a DevOps point of view and explain how containerizing
R is used in the context of the OpenCPU system for building and deploying R servers.


<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Has anyone in the <a href="https://twitter.com/hashtag/rstats?src=hash&amp;ref_src=twsrc%5Etfw">#rstats</a> world written really well about the *why* of their use of Docker, as opposed to the the *how*?</p>&mdash; Jenny Bryan (@JennyBryan) <a href="https://twitter.com/JennyBryan/status/913785731998289920?ref_src=twsrc%5Etfw">September 29, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>


## 1: Easy Development

The flagship of the OpenCPU system is the [OpenCPU server](/download.html):
a mature and powerful Linux stack for embedding R in systems and applications.
Because OpenCPU is completely open source we can build and ship on DockerHub. A ready-to-go linux server with both OpenCPU and RStudio
can be started using the following (use port 8004 or 80):


```
docker run -t -p 8004:8004 opencpu/rstudio
```

Now simply open [http://localhost:8004/ocpu/](http://localhost:8004/ocpu/) and
[http://localhost:8004/rstudio/](http://localhost:8004/rstudio/) in your browser!
Login via rstudio with user: `opencpu` (passwd: `opencpu`) to build or install apps.
See the [readme](https://hub.docker.com/r/opencpu/rstudio/) for more info.

Docker makes it easy to get started with OpenCPU. The container gives you the full
flexibility of a Linux box, without the need to install anything on your system. 
You can install packages or apps via rstudio server, or use `docker exec` to a
root shell on the running server:

```
# Lookup the container ID
docker ps

# Drop a shell
docker exec -i -t eec1cdae3228 /bin/bash
```

From the shell you can install additional software in the server, customize the apache2 httpd 
config (auth, proxies, etc), tweak R options, optimize performance by preloading data or 
packages, etc. 

## 2: Shipping and Deployment via DockerHub

The most powerful use if Docker is shipping and deploying applications via DockerHub. To create a fully standalone
application container, simply use a standard [opencpu image](https://hub.docker.com/u/opencpu/) 
and add your app. 

For the purpose of this blog post I have wrapped up some of the [example apps](https://www.opencpu.org/apps.html) as docker containers by adding a very simple `Dockerfile` to each repository. For example the [nabel](https://rwebapps.ocpu.io/nabel/www/) app has a [Dockerfile](https://github.com/rwebapps/nabel/blob/master/Dockerfile) that contains the following:

```
FROM opencpu/base

RUN R -e 'devtools::install_github("rwebapps/nabel")'
```

It takes the standard [opencpu/base](https://hub.docker.com/r/opencpu/base/)
image and then installs the nabel app from the Github [repository](https://github.com/rwebapps).
The result is a completeley isolated, standalone application. The application can be 
started by anyone using e.g:

```
docker run -d -p 8004:8004 rwebapps/nabel
```

The `-d` daemonizes on port 8004. Now open the app via: [http://localhost:8004/ocpu/library/nabel](http://localhost:8004/ocpu/library/nabel). Obviously you can tweak the `Dockerfile` to install whatever extra software or settings you need
for your application. 

Containerized deployment shows the true power of docker: it allows for shipping fully 
self contained appliations that work out of the box, without installing any software or 
relying on paid hosting services. If you do prefer professional hosting, there are
many companies that will gladly host docker applications for you on scalable infrastructure.

## 3 Cross Platform Building

There is a third way Docker is used for OpenCPU. At each release we build
the `opencpu-server` installation package for half a dozen operating systems, which 
get published on [https://archive.opencpu.org](https://archive.opencpu.org).
This process has been fully automated using DockerHub. The following images automatically
build the enitre stack from source:

 - [opencpu/ubuntu-16.04](https://hub.docker.com/r/opencpu/ubuntu-16.04/)
 - [opencpu/debian-9](https://hub.docker.com/r/opencpu/debian-9/)
 - [opencpu/fedora-25](https://hub.docker.com/r/opencpu/fedora-25/)
 - [opencpu/fedora-26](https://hub.docker.com/r/opencpu/fedora-26/)
 - [opencpu/centos-6](https://hub.docker.com/r/opencpu/centos-6/)
 - [opencpu/centos-7](https://hub.docker.com/r/opencpu/centos-7/)

DockerHub automatically rebuilds this images when a new release is published on Github.
All that is left to do is run a [script](https://github.com/opencpu/archive/blob/gh-pages/update.sh) 
which pull down the images and copies the `opencpu-server` binaries to the [archive server](https://archive.opencpu.org).



