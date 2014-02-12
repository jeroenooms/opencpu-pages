---
layout: post
title: "Share and access R code, data, apps on ocpu.io"
category: posts
description: "ocpu.io is a new domain for publishing code, data and applications based on the OpenCPU system. Any R package/app on Github is directly available from yourname.ocpu.io."
cover: "containers.jpg"
---

<code>ocpu.io</code> is a new domain for publishing code, data and apps based on the OpenCPU system. Any R package on Github is directly available via <code>yourname.ocpu.io</code>. Thereby the package can be used remotely via the <a href="../../api.html">OpenCPU API</a> to access data, perform remote function calls, reproduce results, publish webapps, and much more. The OpenCPU <a href="../../demo.html">public server page</a> explains how requests to <code>ocpu.io</code> map to the existing public demo server.

## Examples

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Action</th>
      <th>URL (short)</th>
    </tr>
  </thead>
  <tbody>      
    <tr>
      <td>List packages on CRAN</td>
      <td><a href="https://cran.ocpu.io"><code>cran.ocpu.io</code></a></td>
    </tr>
    <tr>
      <td>List packages on BioConductor</td>
      <td><a href="https://bioc.ocpu.io"><code>bioc.ocpu.io</code></a></td>
    </tr>
    <tr>
      <td>Github repositories from: <a href="http://github.com/hadley">Hadley</a></td>
      <td><a href="https://hadley.ocpu.io"><code>hadley.ocpu.io</code></a></td>
    </tr>   
    <tr><th colspan="3" class="text-center">Package Info</th></tr>    
    <tr>
      <td>MASS from CRAN</td>
      <td><a href="https://cran.ocpu.io/MASS/"><code>cran.ocpu.io/MASS/</code></a></td>
    </tr>
    <tr>
      <td>plyr from CRAN</td>
      <td><a href="https://cran.ocpu.io/plyr/"><code>cran.ocpu.io/plyr/</code></a></td>
    </tr> 
    <tr>
      <td>plyr from Github</td>
      <td><a href="https://hadley.ocpu.io/plyr/"><code>hadley.ocpu.io/plyr/</code></a></td>
    </tr>
    <tr><th colspan="3" class="text-center">Package Contents</th></tr>
    <tr>
      <td>MASS datasets</td>
      <td><a href="https://cran.ocpu.io/MASS/data/"><code>cran.ocpu.io/MASS/data/</code></a></td>
    </tr>
    <tr>
      <td>plyr datasets</td>
      <td><a href="https://hadley.ocpu.io/plyr/data/"><code>hadley.ocpu.io/plyr/data/</code></a></td>
    </tr> 
    <tr>
      <td>plyr R objects</td>
      <td><a href="https://hadley.ocpu.io/plyr/R/"><code>hadley.ocpu.io/plyr/R/</code></a></td>
    </tr>
    <tr>
      <td>plyr help pages</td>
      <td><a href="https://hadley.ocpu.io/plyr/man/"><code>hadley.ocpu.io/plyr/man/</code></a></td>
    </tr>   
    <tr>
      <td>plyr files</td>
      <td><a href="https://hadley.ocpu.io/plyr/DESCRIPTION"><code>hadley.ocpu.io/plyr/DESCRIPTION</code></a></td>
    </tr>
    <tr><th colspan="3" class="text-center">Datasets</th></tr>  
    <tr>
      <td>mammals sleep data (print)</td>
      <td><a href="https://hadley.ocpu.io/ggplot2/data/msleep/print"><code>hadley.ocpu.io/ggplot2/data/msleep/print</code></a></td>
    </tr>
    <tr>
      <td>mammals sleep data (csv)</td>
      <td><a href="https://hadley.ocpu.io/ggplot2/data/msleep/csv"><code>hadley.ocpu.io/ggplot2/data/msleep/csv</code></a></td>
    </tr>
    <tr>
      <td>mammals sleep data (json)</td>
      <td><a href="https://hadley.ocpu.io/ggplot2/data/msleep/json?digits=4"><code>hadley.ocpu.io/ggplot2/data/msleep/json</code></a></td>
    </tr>
    <tr>
      <td>mammals sleep data (json columns)</td>
      <td><a href="https://hadley.ocpu.io/ggplot2/data/msleep/json?dataframe=column&digits=4"><code>hadley.ocpu.io/ggplot2/data/msleep/json?dataframe=column</code></a></td>
    </tr>    
    <tr><th colspan="3" class="text-center">Manual pages</th></tr>  
    <tr>
      <td>msleep help (text) </td>
      <td><a href="https://hadley.ocpu.io/ggplot2/man/msleep/text"><code>hadley.ocpu.io/ggplot2/man/msleep/text</code></a></td>
    </tr>
    <tr>
      <td>msleep help (html) </td>
      <td><a href="https://hadley.ocpu.io/ggplot2/man/msleep/html"><code>hadley.ocpu.io/ggplot2/man/msleep/html</code></a></td>
    </tr>
    <tr>
      <td>msleep help (pdf) </td>
      <td><a href="https://hadley.ocpu.io/ggplot2/man/msleep/pdf"><code>hadley.ocpu.io/ggplot2/man/msleep/pdf</code></a></td>
    </tr>
    <tr><th colspan="3" class="text-center">Example Apps</th></tr>  
    <tr>
      <td>appdemo <a href="http://github.com/opencpu/appdemo">(src)</a></td>
      <td><a href="https://opencpu.ocpu.io/appdemo/www"><code>opencpu.ocpu.io/appdemo/www</code></a></td>
    </tr>
    <tr>
      <td>stocks <a href="http://github.com/opencpu/stocks">(src)</a></td>
      <td><a href="https://opencpu.ocpu.io/stocks/www"><code>opencpu.ocpu.io/stocks/www</code></a></td>
    </tr>
    <tr>
      <td>nabel <a href="http://github.com/opencpu/nabel">(src)</a></td>
      <td><a href="https://opencpu.ocpu.io/nabel/www"><code>opencpu.ocpu.io/nabel/www</code></a></td>
    </tr>
    <tr>
      <td>markdownapp <a href="http://github.com/opencpu/markdownapp">(src)</a></td>
      <td><a href="https://opencpu.ocpu.io/markdownapp/www"><code>opencpu.ocpu.io/markdownapp/www</code></a></td>
    </tr>
    <tr>
      <td>mapapp <a href="http://github.com/opencpu/mapapp">(src)</a></td>
      <td><a href="https://opencpu.ocpu.io/mapapp/www"><code>opencpu.ocpu.io/mapapp/www</code></a></td>
    </tr>     
  </tbody>
</table>

## How to use

To start publishing on <code>ocpu.io</code> you need to put your R functions, datasets, scripts, sweave/knitr documents into an R package and put it up on Github. This is not too difficult, there are many guides on how to do this. OpenCPU requires the name of the Github repository to match the name of the R package it contains. Use devtools to test if your package is working:

{% highlight r %}
library(devtools)
install_github("pkgname", "username")
{% endhighlight %}

If this succeeds you're good to go. Navigate to <code>username.ocpu.io/pkgname</code> where username is your Github login. The <a href="../../api.html">API docs</a> and <a href="../../jslib.html">JavaScript docs</a> explain how to read objects, files and datasets, RPC functions and develop apps.

By default the OpenCPU public server updates packages installed from Github every 24 hours. However, the <a href="../../api.html#api-ci">Github webhook</a> can be used to update the package immediately every time a commit is pushed to github.

