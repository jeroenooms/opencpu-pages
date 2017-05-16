---
layout: post
title: "OpenCPU release 1.4.5: configurable webhooks"
category: posts
description: "OpenCPU 1.4.5 is a patch release that improves performance by taking advantage of latest versions of jsonlite, devtools, knitr, openssl, etc. Also new in this release is the option to pass build parameters for deploying to ocpu.io (or your own opencpu server) using the github webhook."
cover: "containers.jpg"
thumb: "struisvogel.jpg"
---

OpenCPU 1.4.5 is a patch release that improves performance by taking advantage of latest versions of jsonlite, devtools, knitr, openssl, etc. Also new in this release is the option to pass build parameters for deploying on ocpu.io (or your own opencpu server) using the github webhook.

As usual, server binaries for Ubuntu, Fedora and Suse are available from [Launchpad](https://www.opencpu.org/download.html) and [Build Service](http://software.opensuse.org/download.html?project=home:jeroenooms:opencpu-1.4&package=opencpu). There should not be any breaking changes, but perhaps double check that all is OK next time you run `apt-get upgrade` on your server. If you are in production and do *not* want to upgrade, make sure to comment-out the `opencpu-1.4` ppa in the `/etc/apt/sources.list.d/` conf files.

The opencpu-1.4 repository now ships with:

- OpenCPU 1.4.5
- R 3.1.2
- Rcpp 0.11.3
- RApache 1.2.5
- RStudio-Server 0.98.1087

For Debian/CentOS users, instructions to build opencpu-server packages from source are on github: [rpm](https://github.com/jeroenooms/opencpu-server/tree/master/rpm#readme) and [deb](https://github.com/jeroenooms/opencpu-server/tree/master/debian#readme).

## Configurable webhooks

Any R package on Github can automatically be deployed to `https://yourname.ocpu.io/yourpkg` by setting the [ocpu webhook](https://www.opencpu.org/api.html#api-ci) in your github repository. It takes about 15 seconds to setup, and is a great way to continuously publish and test code, data, documentation, vignettes from your package. You will also get notified by email if your package fails to build. If you are not using ocpu.io yet, now would be a good time to add the webhook :-)

New in this release is that http parameters added to the webhook URL will be passed to [install_github](http://demo.ocpu.io/devtools/man/install_github/text). For example if you want to build vignettes of your package, use webhook:

    https://cloud.opencpu.org/ocpu/webhook?build_vignettes=true

Or if your package is in a subdir in the repo:

    https://cloud.opencpu.org/ocpu/webhook?build_vignettes=true&subdir=pkgdir

In addition to parameters for `install_github`, there is currently one extra parameter `sendmail` (true/false) which specifies if the server sends an email with the build status.
