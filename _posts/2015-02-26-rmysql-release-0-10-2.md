---
layout: post
title: "RMySQL version 0.10.2: Full SSL Support"
category: posts
description: "RMySQL version 0.10.2 has appeared on CRAN. This version has full support on Windows and OSX."
cover: "containers.jpg"
thumb: "mysql.jpg"
---

RMySQL version 0.10.2 has appeared on CRAN. This is a maintenance release to streamline the build process on various platforms. Most importantly, the Windows/OSX binary packages from CRAN are now built with full SSL support. On Linux, the configure script has been updated a bit to automatically find the mysql client library.

A big thanks to epoch.com for [sponsoring](http://blog.rstudio.org/2015/02/11/epoch-rmysql/) the development of this important package.

## How to install RMySQL

RMySQL is a very [old](http://cran.r-project.org/src/contrib/Archive/RMySQL/) package, and as a result there is a lot of outdated and incorrect information on the interwebs. Back in the day (up till version 0.9.3) you had to manually install mysql on your machine to make the package work. But since the 0.10 series earlier this year, the package is now entirely self contained. The recommended way to install RMySQL on Windows and OSX is simply:

{% highlight r %}
install.packages("RMySQL")
{% endhighlight %}

On Linux the package still links against the system libmysqlclient. On most deb systems (Debian/Ubuntu) you need to install `libmysqlclient-dev` and on rpm systems such as Fedora/CentOS/RHEL you need `mariadb-devel`. It should also work with less known variants of MySQL such as [Percona](https://github.com/rstats-db/RMySQL/issues/38) but this doesn't get a lot of testing coverage.

## Using SSL with MySQL

MySQL is not always used with SSL because often the client and server run on the same machine, or within a private network. Moreover encryption introduces some performance overhead, which slows down your database connection a bit. But if you are connecting to a MySQL server over the internet, then enabling SSL is probably a good idea if you don't want everyone to see your data.

Most MySQL servers have been built with SSL support. To configure RMySQL to connect to server over SSL you need to set the certificates in your `~/.my.cnf` file:

```
[client]
ssl-ca=c:/ssl_certs/ca-cert.pem
ssl-cert=c:/ssl_certs/client-cert.pem
ssl-key=c:/ssl_certs/client-key.pem
```

I'm not using this myself but [others are](https://github.com/rstats-db/RMySQL/issues/33) so I'm taking their word that this works. If you're experiencing any problems, open an issue on github.

## Future Development

This is likely the final release of the 0.10 series. We (well mostly Hadley) are working on a full rewrite of the package based on Rcpp. The [readme](https://github.com/rstats-db/RMySQL#readme) on Github contains instructions on how to install the latest version from source (it is really easy, even on Windows).

Past experiences have shown that problems in this package are often specific to the operating system and version of mysql. Therefore we really appreciate feedback and testing of the new version. If you use RMySQL, please try to test the development version at some point so that we can make sure everythings works as expected when it gets released. Report bugs or suggetions on the [github page](https://github.com/rstats-db/RMySQL/issues); please include your OS and RMySQL version.
