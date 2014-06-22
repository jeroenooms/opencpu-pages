---
layout: post
title: "Deploying a scoring engine for predictive analytics with OpenCPU"
category: posts
description: "This post explains how we can use OpenCPU to design scoring engine for calculating real time predictions."
cover: "containers.jpg"
---

**TLDR/abstract:** See the [tvscore demo app](https://demo.ocpu.io/tvscore/www/) or [this jsfiddle](http://jsfiddle.net/opencpu/WVWCR/) for all of this in action. 

This post explains how to use the OpenCPU system to setup a scoring engine for calculating real time predictions. In our example we use the [predict.gam](http://stat.ethz.ch/R-manual/R-patched/library/mgcv/html/predict.gam.html) function from the `mgcv` package to make predictions based on a generalized additive model. The entire process consists of four steps: 

1. Building a model
2. Create an R package containing the model and a scoring function
3. Install the package on your OpenCPU server
4. Remotely call the scoring function through the OpenCPU API

Let's get started!

## Step 1: creating a model

For this example, we use data from the [General Social Survey](http://www3.norc.org/GSS+Website/), which is a very rich dataset on demographic characteristics and attitudes of United States residents. To load the data in R:

{% highlight r %}
#Data info: http://www3.norc.org/GSS+Website/Download/SPSS+Format/
download.file("http://publicdata.norc.org/GSS/DOCUMENTS/OTHR/2012_spss.zip", destfile="2012_spss.zip")
unzip("2012_spss.zip")
GSS <- foreign::read.spss("GSS2012.sav", to.data.frame=TRUE)
{% endhighlight %}

The GSS data has 1974 rows for 816 variables. To keep our example simple, we create a model with only 2 predictor variables. The code below fits a GAM which predicts the average number of hours per day that a person watches TV, based on their age and marital status. In these data `tvhours` and `age` are numeric variables, whereas `marital` is categorical (factor) variable with levels `MARRIED`, `SEPARATED`,`DIVORCED`, `WIDOWED` and `NEVER MARRIED`. 

{% highlight r %}
#Variable info: http://www3.norc.org/GSS+Website/Browse+GSS+Variables/Mnemonic+Index/
library(mgcv)
mydata <- na.omit(GSS[c("age", "tvhours", "marital")])
tv_model <- gam(tvhours ~ s(age, by=marital), data = mydata)
{% endhighlight %}

The `predict` function is used to score data against the model. We test with some random cases:

{% highlight r %}
newdata <- data.frame(
  age = c(24, 54, 32, 75),
  marital = c("MARRIED", "DIVORCED", "WIDOWED", "NEVER MARRIED")
)

predict(tv_model, newdata = newdata)
       1        2        3        4 
3.022650 3.693640 1.556342 3.665077 
{% endhighlight %}

All seems good, this completes step 1. But just to get a sense of what our example model actually looks like before we start scoring, a simple viz:

{% highlight r %}
library(ggplot2)
qplot(age, predict(tv_model), color=marital, geom="line", data=mydata) +
  ggtitle("gam(tvhours ~ s(age, by=marital))") +
  ylab("Average hours of TV per day")
{% endhighlight %}

<img src="https://raw.githubusercontent.com/opencpu/tvscore/master/inst/tv/viz.png" class="img-responsive">

Seems like people that get married start watching less TV, who would have thought :-) In a real study we should probably tune the smoothing a bit and add parenting as predictor (also in the data), but for simplicity we'll stick with this model for now.  


## Step 2: creating a package

In order to score cases via the OpenCPU API, we need to turn the model into an R package. Making R packages is very easy these days, especially when using RStudio. Our package needs to contain at least two things: the `tv_model` object that we created above, and a wrapper function that calls out to `predict(tv_model, ...)`. You can make the wrapper as simple or sophisticated as you like, based on the type of input and output data that you want to send/receive from your scoring engine. 

The [`tvscore`](https://github.com/opencpu/tvscore) package that is available from the [opencpu github repository](https://github.com/opencpu) is an example of such a package. The important thing to note is that the [`tv_model`](https://github.com/opencpu/tvscore/tree/master/data) object is included in the `data` directory of the package. Saving objects to a file is done using the `save` function in R:

{% highlight r %}
#Store the model as a data object
save(tv_model, file="data/tv_model.rda")
{% endhighlight %}

To load the model with the package, we can either set `LazyData=true` in the package [DESCRIPTION](https://github.com/opencpu/tvscore/blob/master/DESCRIPTION), or manually load it using the `data()` function in R. For details on including data in R packages, see [section 1.1.6 of writing R extensions](http://cran.r-project.org/doc/manuals/R-exts.html#Data-in-packages).

Finally the package contains a scoring function called [`tv`](https://github.com/opencpu/tvscore/blob/master/R/tv.R), which calls out to `predict.gam`. The scoring function is what clients will call remotely through the OpenCPU API. Below a smart function that supports both data frames as well as CSV files for input:

{% highlight r %}
tv <- function(input){
  #input can either be csv file or data	
  newdata <- if(is.character(input) && file.exists(input)){
  	read.csv(input)
  } else {
  	as.data.frame(input)
  }
  stopifnot("age" %in% names(newdata))
  stopifnot("marital" %in% names(newdata))
  
  newdata$age <- as.numeric(newdata$age)

  #tv_model is included with the package
  newdata$tv <- predict.gam(tv_model, newdata = newdata)
  return(newdata)
}
{% endhighlight %}

Note how the function does a bit of input validation by checking that the `age` and `marital` columns are present. As usual, the [`tv`](https://github.com/opencpu/tvscore/blob/master/R/tv.R) function is saved in the [`R`](https://github.com/opencpu/tvscore/blob/master/R) directory of the [source package](https://github.com/opencpu/tvscore). Install the package locally to verify that it works as expected in a clean R session. To install our example package from github, restart R and do:

{% highlight r %}
#install the tv score package
library(devtools)
install_github("opencpu/tvscore")
{% endhighlight %}

First we test the `tv` function with data frame input: 

{% highlight r %}
#test scoring with data frame input
library(tvscore)
newdata <- data.frame(
  age = c(24, 54, 32, 75),
  marital = c("MARRIED", "DIVORCED", "WIDOWED", "NEVER MARRIED")
)
tv(input = newdata)
{% endhighlight %}

And then we test if it works for CSV data:

{% highlight r %}
#test scoring with CSV file input
setwd(tempdir())
write.csv(newdata, "testdata.csv")
library(tvscore)
tv(input = "testdata.csv")
{% endhighlight %}

If all of this works as expected, the package is ready to be deployed on your OpenCPU server!

## Step 3: Install the package on the server

To deploy your scoring engine, simply install the package on your OpenCPU server. If you are running the OpenCPU cloud server, make sure to install your package as root. For example if you built the package into a `tar.gz` archive:

{% highlight bash %}
sudo -i
R CMD INSTALL tvscore_0.1.tar.gz
{% endhighlight %}

To install our example package straight from R, either on an OpenCPU cloud server or OpenCPU single-user server:

{% highlight r %}
#install the tv score package
library(devtools)
install_github("opencpu/tvscore")
{% endhighlight %}

If you are running the cloud server, you are done with this step. If you are running the single-user server, start OpenCPU using:

{% highlight r %}
library(opencpu)
opencpu$browse()
{% endhighlight %}

To verify that the installation succeeded, open your browser and navigate to the [<code>/ocpu/library/tvscore</code>](https://public.opencpu.org/ocpu/library/tvscore/) path on the OpenCPU server. Also have a look at [<code>/ocpu/library/tvscore/R/tv</code>](https://public.opencpu.org/ocpu/library/tvscore/R/tv) and [<code>/ocpu/library/tvscore/man/tv</code>](https://public.opencpu.org/ocpu/library/tvscore/man/tv).

## Step 4: Scoring through the API

Once the package is installed on the server, we can remotely call the `tv` function via the OpenCPU API. In the examples below we use the public demo server: <code>https://public.opencpu.org/</code>. For example, to call the `tv` function with `curl` using basic [JSON RPC](https://www.opencpu.org/api.html#api-json):

{% highlight bash %}
curl https://public.opencpu.org/ocpu/library/tvscore/R/tv/json \
 -H "Content-Type: application/json" \
 -d '{"input" : [ {"age":26, "marital" : "MARRIED"}, {"age":41, "marital":"DIVORCED"}, {"age":53, "marital":"NEVER MARRIED"} ]}'
{% endhighlight %}

Note how the OpenCPU server automatically converts input and output data from/to JSON using [`jsonlite`](http://arxiv.org/pdf/1403.2805v1.pdf). See the [API docs](https://www.opencpu.org/api.html#api-json) for more details on this process. Alternatively we can batch score by posting a CSV file ([example data](https://public.opencpu.org/ocpu/library/tvscore/tv/testdata.csv))

{% highlight bash %}
curl https://public.opencpu.org/ocpu/library/tvscore/R/tv -F "input=@testdata.csv"
{% endhighlight %}

The response to a successful HTTP POST request contains the location of the output data in the `Location` header. For example if the call returned a HTTP 201 with `Location` header `/ocpu/tmp/x036bf30e82`, the client can retrieve the output data in various formats using a subsequent HTTP GET request:

{% highlight bash %}
curl https://public.opencpu.org/ocpu/tmp/x036bf30e82/R/.val/csv
curl https://public.opencpu.org/ocpu/tmp/x036bf30e82/R/.val/json
curl https://public.opencpu.org/ocpu/tmp/x036bf30e82/R/.val/tab
{% endhighlight %}

This completes our scoring engine. Using these steps, clients from any language can remotely score cases by calling the `tv` function using standard `HTTP` and `JSON` libraries.

## Extra credit: performance optimization

When using a scoring engine based on OpenCPU in production, it is worthwile configuring your server to optimize performance. In particular, we can add our package to the `preload` field in the `/etc/opencpu/server.conf` file on the OpenCPU cloud server. This will automatically load (but not attach) the package when the OpenCPU server starts, which eliminates package loading time from the individual scoring requests.

Note that R does *not* load LazyData objects when the package loads. Hence, `preload` in combination with lazy loading of data might not have the desired effect. When using `preload`, make sure to design your package such that all data gets loaded when the package loads [(example)](https://github.com/opencpu/tvscore/blob/master/R/onLoad.R).

Finally in production you might want to tweak the `timelimit.post` (timeout), `rlimit.as` (mem limit), `rlimit.fsize` (disk limit) and `rlimit.nproc` (parallel process limit) options in `/etc/opencpu/server.conf` to fit your needs. Also see the [server manual](http://jeroenooms.github.com/opencpu-manual/opencpu-server.pdf) on this topic.

## Bonus: creating an OpenCPU app

By including web pages in the [`/inst/www/`](https://github.com/opencpu/tvscore/tree/master/inst/www) directory of the source package, we can turn our scoring engine into a standalone web application. The [`tvscore`](https://github.com/opencpu/tvscore) example package contains a simple web interface that makes use of the [opencpu.js](https://www.opencpu.org/jslib.html) JavaScript client to interact with R via OpenCPU in the browser. Navigate to [/ocpu/library/tvscore/www/](https://public.opencpu.org/ocpu/library/tvscore/www) on the public demo server to see it in action!

To install and run the same app in your local R session, use:

{% highlight r %}
#Install the app
library(devtools)
install_github("opencpu/tvscore")

#Load the app
library(opencpu)
opencpu$browse("/library/tvscore/www")
{% endhighlight %}

We can also call the OpenCPU server from an external website using cross domain ajax requests (CORS). See [this jsfiddle](http://jsfiddle.net/opencpu/WVWCR/) for a simple example that calls the public server using the `ocpu.rpc` function from `opencpu.js`.

