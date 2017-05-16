---
layout: post
title: "Calling R functions through AJAX using opencpu.js"
category: posts
description: "The opencpu.js library builds on jQuery to call R functions though AJAX, straight from the browser. This makes it easy to embed computation or graphics in apps."
cover: "containers.jpg"
---

The [opencpu.js](https://cloud.opencpu.org/jslib.html) library builds on jQuery to call R functions through AJAX, straight from the browser. This makes it easy to embed R based computation or graphics in [apps](https://cloud.opencpu.org/apps.html). Moreover, asynchronous requests (which are native in Javascript) make parallelization a natural part of the application. This post introduces some of the basic features of the library.

## Getting started with opencpu.js

The [readme page](https://github.com/jeroenooms/opencpu.js#readme) for opencpu.js has some brief documentation, but perhaps the easiest way to get started with opencpu.js is by example. The [opencpu apps](https://cloud.opencpu.org/apps.html) page lists a couple of example apps that you can play around with. The source code for each app is available from the [opencpu github organization](https://github.com/opencpu), and each app is based on opencpu.js. The [appdemo](https://cloud.opencpu.org/ocpu/library/appdemo/www/) app contains some pages with minimal examples illustrating the basic `opencpu.js` functionality. Like all OpenCPU apps, you can either use it on the public cloud server, or install for local use:

{% highlight r %}
#install the appdemo app
library(devtools)
install_github("appdemo", "opencpu")

#load the app
library(opencpu)
opencpu$browse("/library/appdemo/www")
{% endhighlight %}



## Hello World: calling a function

The [hello.html](https://cloud.opencpu.org/ocpu/library/appdemo/www/hello.html) page demonstrates how to call an R function that is included with the R package containing the app. In this example we call the R function named [hello](https://cloud.opencpu.org/ocpu/library/appdemo/R/hello). Navigate to the [hello.html](https://cloud.opencpu.org/ocpu/library/appdemo/www/hello.html) page in your favorite browser and look at the html source code to see what is going on. The magic happens in these lines of javascript:

{% highlight javascript %}
//read the value for 'myname'
var myname = $("#namefield").val();

//perform the request
var req = ocpu.rpc("hello", {
  myname : myname
}, function(output){
  $("#output").text(output.message);
});
{% endhighlight %}

The first line is basic jQuery syntax and reads the value from the page element with id `namefield` down in the html. In the next line we use `ocpu.rpc` to call the R function [hello](https://cloud.opencpu.org/ocpu/library/appdemo/R/hello) (included in the app package) and pass the value to the `myname` argument of the R function. The final argument is the callback handler: a function to (asynchronously) processes the output once the request has returned from the server. In this case our callback handler writes `output$message` value returned by our R function to the html field with id `output`. 

The above is all that is needed to call R from Javascript in the browser. The remaining lines form this example:

{% highlight javascript %}
//if R returns an error, alert the error message
req.fail(function(){
  alert("Server error: " + req.responseText);
});

//after request complete, re-enable the button 
req.always(function(){
  $("#submitbutton").removeAttr("disabled")
});
{% endhighlight %}

Web developers will immediately recognize this pattern: all functions in the opencpu.js library wrap around the jQuery `$.ajax` method and return the `jqXHR` object. Thereby you (the programmer) have full control over the request using all methods and properties from [jQuery.ajax](http://api.jquery.com/jQuery.ajax/). So you can register additional handlers to deal with errors or to add additional behavior after the request has completed (in the example to re-enable a button).

## Making a plot

The opencpu.js library also makes it easy to embed your R plots in a website. The [plot.html](https://cloud.opencpu.org/ocpu/library/appdemo/www/plot.html) page illustrates this with a very simple example. Again, look at the source of the HTML page: 


{% highlight javascript %}
//create the plot area on the plotdiv element
var req = $("#plotdiv").rplot("randomplot", {
  n : nfield,
  dist : distfield
})
{% endhighlight %}

The syntax for is slightly different than when calling a function before: the plotting widget is implemented as a jQuery plugin and hence called on a dom element, usually an empty `<div>`. In this case we call the R function [randomplot](https://cloud.opencpu.org/ocpu/library/appdemo/R/randomplot) (included with the appdemo package) and pass arguments `n` and `dist`. Once completed, a png image of the plot is displayed in `#plotdiv` and links to pdf and svg images. 

Real world examples of apps using `$.rplot` are [nabel](https://cloud.opencpu.org/ocpu/library/nabel/www/), [gitstats](https://cloud.opencpu.org/ocpu/library/gitstats/www/) and [stocks](https://cloud.opencpu.org/ocpu/library/stocks/www/).

## Uploading a File

In many statistical applications the user needs to provide some data, often in the form of a file. When using opencpu.js, calling an R function with a file works exactly the same as calling it with any other value. Look at the source code for [upload.html](https://cloud.opencpu.org/ocpu/library/appdemo/www/upload.html) to see this in action.


{% highlight javascript %}
//arguments
var myheader = $("#header").val() == "true";
var myfile = $("#csvfile")[0].files[0];

//perform the request
var req = ocpu.rpc("readcsvnew", {
  file : myfile,
  header : myheader
}, function(session){
  alert("success:\n" + location.protocol + "//" + location.host + session.getLoc())  
});
{% endhighlight %}

Basically for any `<input type="file">` HTML element we can pass the file to an R function using `$("#id")[0].files[0]` (note this requires HTML5 support). OpenCPU will then copy this file to the working directory of the R process and use the filename as the parameter value. The next section shows how we would actually use this object.

## Simulating state by chaining function calls

Thus far all examples contained a single R function call and we would either grab the output or some plot to display on the page. However in practice your application might involve several steps: the user uploads some data, specifies variables, fits a model on the data, etc. 

The OpenCPU API is stateless. Clients do not have a private R process and each call to the server is independent of the previous one. Instead, the way you can introduce state is by chaining function calls: the OpenCPU server stores the return object from a function call, and you can pass a reference to such an object as a argument to subsequent function calls. This might sound cumbersome at first, but it results in well organized, scalable applications and makes asynchronous parallel requests a native feature of your application. 

A simple example of this concept which builds on the previous example is illustrated in [chain.html](https://cloud.opencpu.org/ocpu/library/appdemo/www/chain.html). Because this example is a bit larger, the javascript code was placed in a seperate file called [chain.js](https://cloud.opencpu.org/ocpu/library/appdemo/www/chain.js). The example starts with:

{% highlight javascript %}
//perform the request
var req = ocpu.call("readcsvnew", {
  file : file,
  header : header
}, function(session){
  //on success call printsummary()
  printsummary(session);
});
{% endhighlight %}

This look very similar as before: `ocpu.call` is used to call the R function [readcsvnew](https://cloud.opencpu.org/ocpu/library/appdemo/R/readcsvnew). However this time the callback function calls another function by passing on the reference to the object returned by `readcsvnew` (which we called `session` in this example) The `printsummary` javascript function then uses this object for the argument `mydata` when calling the R function [printsummary](https://cloud.opencpu.org/ocpu/library/appdemo/R/printsummary):

{% highlight javascript %}
function printsummary(mydata){
  //perform the request
  var req = ocpu.call("printsummary", {
    mydata : mydata
  }, function(session){
    var url = session.getLoc() +  "console/text";
    downloadfile(url);
  }).fail(function(){
    alert("Server error: " + req.responseText);
  });        
}
{% endhighlight %}

This illustrates the concept of function chaining. We can keep going on and keep calling new functions and pass output from previous function calls as the argument. To see a real world example of this, try the [mapapp](https://cloud.opencpu.org/ocpu/library/mapapp/www/) OpenCPU app.
