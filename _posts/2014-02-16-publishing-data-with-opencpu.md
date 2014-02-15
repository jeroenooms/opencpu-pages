---
layout: post
title: "Publishing dynamic data on ocpu.io"
category: posts
description: "One way to use OpenCPU is to publish data."
cover: "containers.jpg"
---

Suppose you would like to publish some data, for example to accompany a journal article. One way would be to put a <code>CSV</code> file on your website, and share the URL with your colleagues. However CSV has many limitations: it only works for tabular structures, has limited type safety (pretty much everything gets coersed into strings) and leads to loss of numeric precision. 

There are many alternative data interchange formats, each with their own benefits and limitations. For example <a href="http://cran.r-project.org/web/packages/jsonlite/vignettes/json-mapping.pdf">JSON</a> is widely supported and can be parsed in almost any language, however it can be verbose and slow. A binary format such as <a href="http://arxiv.org/abs/1401.7372">Protocol Buffers</a> is more efficient, but many users might not know how to parse it. You could even use <code>save</code> or <code>saveRDS</code> in R to share the native R structures, however this limits your audience to R users. 

## Retrieving Dynamic Data

What we really need is a method to publish the data itself rather than some representation of the data in a particular format. With OpenCPU you can publish R <emph>objects</emph> (including datasets) in a way that lets the clients select the format and formatting options for retrieving the dataset. This is implemented using native R functionality to include arbitrary data/objects in packages, and standard R functions for exporting these data. For example, the CRAN package <code>MASS</code> includes a dataset called <code>bacteria</code>. It can be retrieved it in many formats:

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Format</th>
      <th>Export Function</th>
      <th>URL (short)</th>
    </tr>
  </thead>
  <tbody>      
    <tr>
      <td>text</td>
      <td><code>print</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/bacteria/print"><code>cran.ocpu.io/MASS/data/bacteria/print</code></a></td>
    </tr>
    <tr>
      <td>CSV</td>
      <td><code>write.csv</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/bacteria/csv"><code>cran.ocpu.io/MASS/data/bacteria/csv</code></a></td>
    </tr>
    <tr>
      <td>TSV</td>
      <td><code>write.table</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/bacteria/tab"><code>cran.ocpu.io/MASS/data/bacteria/tab</code></a></td>
    </tr>
    <tr>
      <td>JSON</td>
      <td><code>jsonlite::asJSON</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/bacteria/json"><code>cran.ocpu.io/MASS/data/bacteria/json</code></a></td>
    </tr> 
    <tr>
      <td>Protocol Buffers</td>
      <td><code>RProtoBuf::serialize_pb</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/bacteria/pb"><code>cran.ocpu.io/MASS/data/bacteria/pb</code></a></td>
    </tr> 
    <tr>
      <td>RData</td>
      <td><code>save</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/bacteria/rda"><code>cran.ocpu.io/MASS/data/bacteria/rda</code></a></td>
    </tr> 
    <tr>
      <td>RDS</td>
      <td><code>saveRDS</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/bacteria/rds"><code>cran.ocpu.io/MASS/data/bacteria/rds</code></a></td>
    </tr>    
    <tr>
      <td>ascii R</td>
      <td><code>dput</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/bacteria/ascii"><code>cran.ocpu.io/MASS/data/bacteria/ascii</code></a></td>
    </tr>              
  </tbody>
</table>

The client can also control formatting options by passing HTTP parameters. These parameters map directly to function arguments for the respective export function in the table above. To give just a few examples:

<table class="table table-hover table-bordered">
  <thead>
    <tr>
      <th>Output Format</th>
      <th>Equivalent URL on Public OpenCPU Server</th>
    </tr>
  </thead>
  <tbody>      
    <tr>
      <td><code>write.csv(bacteria, row.names=TRUE)</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/bacteria/csv?row.names=true"><code>cran.ocpu.io/MASS/data/bacteria/csv?row.names=true</code></a></td>
    </tr>
    <tr>
    <tr>
      <td><code>jsonlite::asJSON(Boston, digits=4)</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/Boston/json?digits=4"><code>cran.ocpu.io/MASS/data/Boston/json?digits=4</code></a></td>
    </tr>
    <tr>
   <tr>
      <td><code>jsonlite::asJSON(Boston, dataframe="columns")</code></td>
      <td><a href="https://cran.ocpu.io/MASS/data/Boston/json?dataframe=columns&digits=4"><code>cran.ocpu.io/MASS/data/Boston/json?dataframe=columns</code></a></td>
    </tr> 
  </tbody>
</table>

## Creating a data package

To start publishing your own dynamic data you need to put your data objects in an R package follwoing the standard guidelines as documented in <a href="http://cran.r-project.org/doc/manuals/R-exts.html#Data-in-packages">section 1.1.6</a> of <i>Writing R Extensions</i>. This might sound cumbersome, but it can be done in a few seconds. Once you get a hold if it, packages are actually a beautiful, standardized and well-tested container format for R objects. Have a look at the <a href="https://github.com/opencpu/appdemo">opencpu/appdemo</a> package for some examples. After creating and installing your package in R on your local machine, test it using the OpenCPU single user server:  

{% highlight r %}
library(opencpu)
opencpu$browse("/library/mypackage/data")
opencpu$browse("/library/mypackage/data/myobject")
{% endhighlight %} 

## Publishing Dynamic Data on ocpu.io

To make your data available through the public OpenCPU server and <code>ocpu.io</code>, all you need to do is put your package up on Github. OpenCPU requires the name of the Github repository to match the name of the R package it contains. Use devtools to test if your package is working:

{% highlight r %}
library(devtools)
install_github("pkgname", "username")
{% endhighlight %}

If this succeeds you're good to go. Navigate to <code>username.ocpu.io/pkgname/data</code> where username is your Github login. By default the OpenCPU public server updates packages installed from Github every 24 hours. However, the <a href="../../api.html#api-ci">Github webhook</a> can be used to update the package immediately every time a commit is pushed to github.

## Publishing Dynamic Data on Your Own Server

OpenCPU does not lock you into some commercial hosting service. Your data is stored on Github in a standard format under your control. The <code>ocpu.io</code> public server is there for your convenience. You can also <a href="download.html">install your own OpenCPU cloud server</a> to publish data at e.g. <code>http://opencpu.yourserver.com/ocpu/library/pkgname/data/myobject</code>. No need to put anything on Github, just install the package in R on the server.




