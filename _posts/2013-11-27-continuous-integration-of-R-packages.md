---
layout: post
title: "Continuous Integration with OpenCPU"
category: posts
description: "The latest version of OpenCPU adds support for continuous integration. Any R package that is hosted on Github is supported."
cover: "containers.jpg"
---

Starting version 1.0.7, the OpenCPU cloud server adds support for continuous integration (CI). This means that Github repositories can be configured to automatically install your package on an OpenCPU server, every time a commit is pushed. To take advantage of this feature, it is required that:

<ol>
	<li>Your R source package is hosted on Github.</li>
	<li>The name of the Github repository is identical to the name of the R package</li>
	<li>Your Github user account has a public email address</li>
</ol>

To setup CI, add the following URL as a 'WebHook' in your Github repository: 

    https://public.opencpu.org/ocpu/webhook

For instructions how to add webhooks, see [here](https://help.github.com/articles/post-receive-hooks). To trigger a build, either push a commit to the master branch, or select the box with the URL and press the <code>Test Hook</code> button. You should receive an email that reports if the installation was successful. If it was, the package will directly be available for remote use through the OpenCPU API.

<img class="img-thumbnail img-responsive" src="../../images/githook.png" alt="git hook screenshot">

## But why?

Continuous Integration in OpenCPU addresses several issues at once:

<ul>
	<li>If you introduced a bug and your package fails to install, you get notified by email immediately.</li>
	<li>Deploy packages/apps on OpenCPU public cloud servers without having to wait until the server synchronizes.</li>
	<li>You can use CI without relying on a 3rd party service; installing your own OpenCPU server is easy.</li>
</ul>

Every active R package maintainer could benefit from some sort of CI environment, with or without OpenCPU. Earlier this year, Yihui had a cool [blog post](http://yihui.name/en/2013/04/travis-ci-for-r/) about [Travis CI](https://travis-ci.org/) (also see [r-travis](https://github.com/craigcitro/r-travis)). Simon Urbanek's rforge.net is another service that provides some auto-building functionality. One way or another, it's important to frequently check that your all your packages still build, pass unit tests, haven't introduced conflicts, etc. That way you catch problems immediately while the changes are still fresh in your memory.

Moreover, unexpected changes in R or dependencies are often beyond your control, but can cause your package to work one day, and break the next. The article on [Possible Directions for Improving Dependency Versioning in R](http://arxiv.org/abs/1303.2140) (<i>The R Journal [Vol. 5/1](http://journal.r-project.org/archive/2013-1), June 2013)</i> explained that CRAN requires all "current" packages to compatible, which assumes that all package authors are constantly on the lookout for changes in dependencies and reverse dependencies, forever. This system is unsustainable and will eventually have to be revised, but continuous integration can at least help detecting problems as soon as possible.

## Final notes

Some final notes/disclaimers: this feature is currently being tested; please let me know if something is not working. To setup your own OpenCPU CI server, you need to configure an SMTP server; which is not yet documented in the [PDF manual](http://jeroenooms.github.com/opencpu-manual/opencpu-manual.pdf). Also note that currently only the default (master) branch will be deployed; pushes to other branches are ignored. Finally some packages might not build on the public demo server because of missing system dependencies. If your package needs any particular libraries, send me an email (or set up your own cloud server :-)
